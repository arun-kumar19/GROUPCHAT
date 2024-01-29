const { Sequelize, DataTypes } = require('sequelize');
const { Op } = require('sequelize');
const sequelize=require("../util/database");
const bcrypt=require("bcryptjs");
const saltRounds = 10;
const path = require('path');
const User=require("../model/signup");
const Message=require("../model/usermessages");
const conversation=require("../model/conversation");
const jwt=require("jsonwebtoken");
const secretKey="7539753909887979qggjgjjjjhh"
const groupCreator=require("../model/groupcreators");
const groupInfo=require("../model/groupinfo");
const groupinfo=require("../model/groupinfo");//do not remove it

exports.getSignIn=(req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
  };
  

  exports.getSignUp=(req, res) => {
      res.sendFile(path.join(__dirname, '../views', 'signup.html'));
    };

    exports.getDemo=(req, res) => {
      res.sendFile(path.join(__dirname, '../views', 'demo.html'));
    };
  
    
    exports.getSignUpSubmitForm=(req, res) => {
    const { name, email, phone, password } = req.body;
    console.log(name, ' ',email,' ',password,' ',phone);
  console.log('inside post method');
   bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(password, salt, async function(err, hash) {
      console.log('User password:',hash);
              // Create a new user in the database
  
              const userCheck=await User.findAll({where:{
                  email:email
              }})
              console.log('usercheck:',userCheck.length);
  
              if(userCheck.length>0){
                  console.log('user already exits');
                  res.status(406).send('User already exits. Try creating with different email id');
              }else{
              const newUser =await User.create({
                name,
                email,
                phone,
                password:hash,
              }).then(result=>{
                      console.log('user crreated and result:',result);
                      res.send('Signup successful!');     
              }).catch(error=>{
                  console.log('something went wrong:',error);
                  res.status(500).send('Error creating user');
              });
          }
              
      });
  });
  
  };
      
  exports.getSignInCheck=(req, res) => {
    const { email, password } = req.body;
    console.log(email,' ',password);
  console.log('inside sign in post method');

    User.findAll({
      where:{
      email:email
    },
    attributes:['id','password','name'],}).then((dbpassword)=>{
        //console.log('dbpassword:',dbpassword);    
        if(dbpassword.length<1){
          return res.status(404).json({'status':'failed','message':'User not found'});
        }
      console.log('user unique id:',dbpassword[0].id,' ','dbpassword:',dbpassword[0].password);
  
      bcrypt.compare(password,dbpassword[0].password,function(err,result){
        if(result){
          console.log('user entered correct password');
          const token=jwt.sign(dbpassword[0].id,secretKey);
          res.status(200).json({'token':token,'name':dbpassword[0].name,'status':'success'})
        }
        else{
        console.log('err:',err);
        res.status(401).json({'status':'failed','message':'user is not authorised'})
        }
      })
      
      
    })
     
  };
      

  exports.getProfile=(req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
  };



  exports.saveMessage=(req, res) => {
    const { token, message,chatgroupid } = req.body;
    console.log('token:',token);
    const id=jwt.verify(token,secretKey);
    //console.log(token,' ',id,' ',message);

console.log('inside save message function');

    conversation.create({
    memberid:id,
    groupid:chatgroupid,
    message,
  }).then(result=>{
          console.log('message saved successfully:',result);
          res.status(200).json({'status':'success','result':result});     
  }).catch(error=>{
      console.log('something went wrong:',error);
      res.status(500).send('Error saving data');
  });  
   
  /* Message.create({
    userid:id,
    message,
  }).then(result=>{
    //      console.log('message saved successfully:',result);
          res.status(200).json({'status':'success','result':result});     
  }).catch(error=>{
      console.log('something went wrong:',error);
      res.status(500).send('Error saving data');
  });  
    */

  };



  exports.getMessages=(req, res) => {
    const token = req.header("Authorization");
    const id=jwt.verify(token,secretKey);
    console.log('token:',token,' ',id);
  //console.log('inside getmessages method');

    Message.findAll({
      where:{
      userid:id
    },
    order: [
      ['id', 'DESC'],
  ],
    attributes:['id','message'],}).then((messages)=>{
       // console.log('message:',messages); 
        const messageJSON=messages.map((expence)=>expence.toJSON());
       // console.log('messageJSON:',messageJSON);
          
        if(messages.length<1){
          return res.status(404).json({'status':'failed','message':'no message found'});
        }
        else{
          res.status(200).json({'message':messageJSON,'status':'success'})
        }
        
      })
  };
      

  exports.getProfile=(req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
  };


  exports.getContacts=(req, res) => {
  const token=req.header('Authorization');
  const id=jwt.verify(token,secretKey);
  //console.log('inside getContacts method');

  User.findAll({
      where:{
         id :{ [Op.ne]: id },
      },
    order: [
      ['name', 'ASC'],
  ],
    attributes:['id','name','phone'],}).then((contacts)=>{
       // console.log('contacts:',contacts); 
        const contactsJSON=contacts.map((contact)=>contact.toJSON());
        //console.log('messageJSON:',contactsJSON);
          
        if(contacts.length<1){
          return res.status(404).json({'status':'failed','message':'no message found'});
        }
        else{
          res.status(200).json({'message':contactsJSON,'status':'success'})
        }
        
      })
  };
 
  

  exports.getCreateGroup=async(req, res) => {

  //console.log('inside getCreateGroup method');
  const {groupname,member}=req.body;
  const token=req.header("Authorization");
  const id=jwt.verify(token,secretKey);
  console.log('id:',id,'groupname:',groupname,' member:',member);
  const t = await sequelize.transaction();
    try{
    const group = await groupCreator.create({ groupcreatorid: id,groupname, usersignupId: id }, { transaction: t });
    //console.log('group:', group.id);
    const groupid=group.id;
         
    const admin = await groupInfo.create({ groupid, adminid: id, memberid: id, groupcreatorid: id }, { transaction: t });
    //console.log('admin created:',admin);

    const memberPromises = member.map(async (memberId) => {
      try {
       console.log('groupid:',groupid,' id:',id, '    memberId:',memberId);
       const result =await groupInfo.create({ groupid,memberid:memberId }, { transaction: t });
       // console.log('member added successfully:', result);
      } catch (error) {
        console.log('something went wrong while adding member in group', error);
        throw error; // Re-throw the error to catch it in the outer catch block
      }
    });

        await Promise.all([group,admin,...memberPromises]);
       await t.commit();
       res.status(200).json({ 'STATUS': 1,'MESSAGE':'GROUP_CREATED' });
      }catch(error){
        await t.rollback();
      console.log('Transaction rolled back due to an error:', error);
      res.status(401).json({ 'STATUS': 0,'MESSAGE':'SOMETHING WENT WRONG' });
      }
  
  }
      
   
  exports.getGroupInfo=async (req, res) => {
    const token=req.header('Authorization');
    //console.log('inside getGroupInfo method');
    console.log('token:',token);
    const id=jwt.verify(token,secretKey);
    //console.log('inside getGroupInfo method');

    try {
      const groupInfos = await groupInfo.findAll({
        attributes: [
          'groupid',
          [Sequelize.col('groupcreator.groupname'), 'groupname'],
          'adminid',
          'memberid',
          'memberstatus'
        ],
        include: [{
          model: groupCreator,
          attributes: [],
          where: { id: Sequelize.col('groupinfo.groupid') }
        }],
        where: { memberid: id }
      });
  //console.log('groupinfos:',JSON.stringify(groupInfos));
      res.status(200).json({ status: 'success', 'groupInfos':groupInfos });
    } catch (error) {
      console.error('Error retrieving group information:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };      
  
   
  exports.getGroupChat=async (req, res) => {
    const token=req.header('Authorization');
    const id=jwt.verify(token,secretKey);
    const groupid=req.query.groupid;
    //console.log('inside getGroupChat method');

    try {
    const chat=await conversation.findAll({
      attributes: [
        'groupid',
        'memberid',
        'MessageType',
        [Sequelize.col('usersignup.name'), 'name'],
        'message',
        'ContentURL',
        'createdAt'
      ],
         include: [{model: User, as: 'usersignup',
         attributes: ['name'],
        required: true
        }],
        where: { groupid: groupid },
        order: [
          ['createdAt', 'DESC']
        ],
        limit: 6,
      })
  console.log('chat:',JSON.stringify(chat));
      res.status(200).json({ status: 'success', 'message':chat,'cid':id });//cid==currentuserid who logged in
    } catch (error) {
      console.error('Error retrieving group information:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };


  exports.getGroupContacts=async (req, res) => {
    const token=req.header('Authorization');
    const id=jwt.verify(token,secretKey);
    const groupid=req.query.groupid;
    console.log('group id:',groupid);
    console.log('inside getGroupContacts method and user id is ',id);
    const groupcreator=await groupCreator.findByPk(groupid);
    const stringifyObj=JSON.stringify(groupcreator);
    console.log('groupcreator:',groupcreator.id);

    groupInfo.findAll({
      attributes: ['groupid', 'adminid', 'memberid'],
      include: [
        {
          model: User,
          attributes: ['name'],
          required: true
 //        where: { id: Sequelize.col('groupInfo.memberid') }
        }
      ],
      where: { groupid: groupid,
      memberstatus:true },
      order: [['adminid', 'DESC']]
    })
.then(results => {
  const groupJSON=results.map((results)=>results.toJSON());
        //console.log('groupJSON:',groupJSON);
 
        const groupWithAdminId = findGroupByAdminId(groupJSON, id);

        if (groupWithAdminId) {
          //console.log('is admin:',groupWithAdminId);
        } else {
          console.log('is admin:',groupWithAdminId);
        }

  res.status(200).json({'status':1,'data':results,'isadmin':groupWithAdminId,'userid':id});
})
.catch(error => {
  console.log('something went wrong:',error);
  res.status(401).json({'status':0,'data':'error'})
  });
}



function findGroupByAdminId(groups, targetAdminId) {
  for (const group of groups) {
    //console.log('group:',group);
    if (group.adminid == targetAdminId) {
      console.log('user is admin');
      return true;
    }
  }
  return false; // Return null if no matching group is found
}

exports.getAdminAction=async (req, res) => {
  const {chatgroupid,userid,isadmin}=req.body;
  console.log('chatgroupid,userid,isadmin are:',chatgroupid,' ',userid,' ',isadmin);
  console.log('inside getAdminAction method and user id is ',userid);

  try {
    const groupInfos = await groupInfo.findAll({
      attributes: [
        'groupid',
        [Sequelize.col('groupcreator.groupcreatorid'), 'groupcreatorid'],
        'adminid',
        'memberid'
      ],
      include: [{
        model: groupCreator,
        attributes: [],
        where: { id: Sequelize.col('groupinfo.groupid') }
      }],
      where: { memberid: userid,
      groupid:chatgroupid }
    });
console.log('groupinfos:',JSON.stringify(groupInfos));
console.log('groupInfos.groupcreatorid===userid',groupInfos[0].dataValues.groupcreatorid,' ',userid);
if(groupInfos[0].dataValues.groupcreatorid==userid){
  console.log('ok');
  return res.status(401).json({ status: '0', 'groupInfos':groupInfos,'message':'unauthorised' });
}

if(groupInfos[0].dataValues.adminid==null && isadmin==0){
  console.log('no admin');
  groupInfo.update(
    { adminid: userid },
    { where: { groupid: chatgroupid,
    memberid:userid } }
  ).then((result) => {
      console.log(`Rows affected: ${result[0]}`);
    })
    .catch((error) => {
      console.error('Error updating record:', error);
    });
  res.status(200).json({ status: 1, 'groupInfos':groupInfos,'message':'admincreated' });
}

if(groupInfos[0].dataValues.adminid==userid && isadmin==1){
  console.log('admin removed');
  try{
  groupInfo.update(
    { adminid: null},
    { where: { groupid: chatgroupid,
    memberid:userid } }
  ).then((result) => {
      console.log(`Rows affected: ${result[0]}`);
      res.status(200).json({ status: 2, 'groupInfos':groupInfos,'message':'adminremoved' });
    })
    .catch((error) => {
      console.error('Error updating record:', error);
    });
  }
  catch(error){
    console.error('Error retrieving group information:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}
   // res.status(200).json({ status: 'success', 'groupInfos':groupInfos });
  } catch (error) {
    console.error('Error retrieving group information:', error);
    
  }
}

exports.updateGroupName=async (req, res) => {
  const {groupname,groupid,token}=req.body;
  console.log('grupname,groupid,token:',groupname,' ',groupid,' ',token);
  console.log('inside updateGroupName method and grupname is ',groupname);

  groupCreator.update(
    { groupname: groupname },
    { where: { id: groupid } }
  ).then((result) => {
      console.log(`Rows affected: ${result[0]}`,' and result is ',result);
      res.status(200).json({ status: 1, 'groupInfos':result,'message':'updated' });
    })
    .catch((error) => {
      console.error('Error updating record:', error);
      res.status(200).json({ status: 0, 'groupInfos':error,'message':'something went wrong. try again later' });
    });
  
}

exports.getExcludedContacts=(req, res) => {
  const token=req.header('Authorization');
  const chatgroupid=req.query.groupid;
  const id=jwt.verify(token,secretKey);
  console.log('inside getExcludedContacts method: id and groupid',id, ' ',chatgroupid);
  
  User.findAll({
    attributes: ['id', 'phone','name',[Sequelize.col('groupinfos.groupid'), 'groupid'], [Sequelize.col('groupinfos.memberid'), 'memberid'], [Sequelize.col('groupinfos.memberstatus'), 'memberstatus']],
    where: {
      [Sequelize.Op.or]: [
        { '$groupinfos.memberstatus$': 0 },
        { '$groupinfos.memberid$': null },
      ],
    },
     include: [{
      model: groupinfo,
      where:{ 
        groupid: chatgroupid
      },
     required:false,
     as:'groupinfos',
    }],
  
  }).then((contacts)=>{
    //console.log('result:',contacts);
      console.log('exclueded contacts:',JSON.stringify(contacts, null, 2)); 
        const contactsJSON=contacts.map((contact)=>contact.toJSON());
        //console.log('messageJSON:',contactsJSON);
          
        if(contacts.length<1){
          return res.status(404).json({'status':'failed','message':'no contact found'});
        }
        else{
          res.status(200).json({'message':contactsJSON,'status':'success'})
        }
        
      }).catch(error=>{
        console.log('something went wrong:',error);
      })
  };
 

  exports.getUpdateGroupMember=async(req, res) => {

    //console.log('inside getUpdateGroupMember method');
    const {groupname,groupid,token,member}=req.body;
    const id=jwt.verify(token,secretKey);
    console.log('id:',id,'groupid:',groupid,' member:',member);
    const t = await sequelize.transaction();

    const info=await groupinfo.findAll({
      where :{
        groupid:groupid
      }
     })

     const infoArray = info.map((instance) => instance.toJSON());
      console.log(infoArray);

     console.log('info:',JSON.stringify(info));
     
      try{

        const groupNameUpdate=await groupCreator.update(
          {groupname:groupname},
          {where :{
            id:groupid
          }},{transaction:t})
           
      const memberPromises = member.map(async(memberId) => {
        
         console.log('groupid:',groupid,' id:',id, '    memberId:',memberId);
         
         const specificInfo = infoArray.find(item=> item.memberid === memberId);
         let result;
    if (specificInfo) {
          console.log('Found:', specificInfo);
          result=await groupinfo.update(
            {memberstatus:1},
            {where :{
              groupid:groupid,
              memberid:memberId
            }},{transaction:t})
  } else {
    console.log('Not found');
    result=await groupInfo.create({ groupid,memberid:memberId }, { transaction: t });
    console.log('member added successfully123:', result);
  }
          
})
  
      await Promise.all([groupNameUpdate,...memberPromises]);
         await t.commit();
         console.log('member and group updated successfully');
         res.status(200).json({ 'STATUS': 1,'MESSAGE':'GROUP_CREATED' });
        }
      catch(error){
          await t.rollback();
        console.log('Transaction rolled back due to an error:', error);
        res.status(401).json({ 'STATUS': 0,'MESSAGE':'SOMETHING WENT WRONG' });
        }
    }
        


    exports.getRemoveUser=async(req, res) => {

      console.log('inside getRemoveUser method');
      const {groupid,memberid,actionbyid}=req.body;
      const id=jwt.verify(actionbyid,secretKey);
      console.log('memberid:',memberid,'groupid:',groupid,' actionbyid:',actionbyid);

          groupinfo.update(
            {memberstatus:false},
            {where :{
              groupid:groupid,
              memberid:memberid
            }}).then(async (result)=>{
              //console.log('result:',result, ' result type:',typeof result);
              console.log('group updated:',JSON.stringify(result));    
           console.log('member removed successfully');
           
           res.status(200).json({ 'STATUS': 1,'MESSAGE':'member removed' });
          }).catch(async(error)=>{
            res.status(401).json({ 'STATUS': 0,'MESSAGE':'SOMETHING WENT WRONG' });
            console.log('something went wrong while removing member in group', error);
            throw error; // Re-throw the error to catch it in the outer catch block
          })
  }



  exports.getStatus=(req, res) => {

    console.log('inside getStatus method');
    const messengersendortoken=req.header("messengersendortoken");
    const currentusertoken=req.header("currentusertoken");
    console.log('messengersendortoken',messengersendortoken,' currentusertoken',currentusertoken);
    const messengersendorid=jwt.verify(messengersendortoken,secretKey);
    const currentuserid=jwt.verify(currentusertoken,secretKey);
    console.log('messengersendorid:',messengersendorid,'currentuserid:',currentuserid);

    if(messengersendorid===currentuserid){
       
         res.status(200).json({ 'STATUS': 1,'MESSAGE':'you are sendor' });
        }
    else{
          res.status(200).json({ 'STATUS': 0,'MESSAGE':'other group member is sendor' });
    
        }
}