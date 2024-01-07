const bcrypt=require("bcryptjs");
const saltRounds = 10;
const path = require('path');
const User=require("../model/signup");
const Message=require("../model/usermessages");
const jwt=require("jsonwebtoken");
const secretKey="7539753909887979qggjgjjjjhh"
exports.getSignIn=(req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'login.html'));
  };
  
  exports.getSignUp=(req, res) => {
      res.sendFile(path.join(__dirname, '../views', 'signup.html'));
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
        console.log('dbpassword:',dbpassword);    
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
    const { token, message } = req.body;
    console.log('token:',token);
    const id=jwt.verify(token,secretKey);
    //console.log(token,' ',id,' ',message);

  //console.log('inside save message function');

    Message.create({
    userid:id,
    message,
  }).then(result=>{
    //      console.log('message saved successfully:',result);
          res.status(200).send('message saved');     
  }).catch(error=>{
      console.log('something went wrong:',error);
      res.status(500).send('Error saving data');
  });  
   
  };



  exports.getMessages=(req, res) => {
    const token = req.header("Authorization");
    const id=jwt.verify(token,secretKey);
    console.log('token:',token,' ',id);
  console.log('inside getmessages method');

    Message.findAll({
      where:{
      userid:id
    },
    attributes:['message'],}).then((message)=>{
        console.log('message:',message);    
        if(message.length<1){
          return res.status(404).json({'status':'failed','message':'no message found'});
        }
        else{
      console.log('message:',message);
          res.status(200).json({'message':message,'status':'success'})
        }
        
      })
  };
      

  exports.getProfile=(req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
  };


