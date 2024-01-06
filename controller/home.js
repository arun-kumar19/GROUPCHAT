const bcrypt=require("bcryptjs");
const saltRounds = 10;
const path = require('path');
const User=require("../model/signup");

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
      console.log('user unique id:',dbpassword[0].id,' ','dbpassword:',dbpassword[0].password);
      bcrypt.compare(password,dbpassword[0].password,function(err,result){
        if(result){
          console.log('user entered correct password');
          res.status(200).json({'id':dbpassword[0].id,'name':dbpassword[0].name,'status':'success'})
        }
        if(err){
        console.log('err:',err);
          console.log('user entered wrong password');
        }
        
      })

    })
     
  };
      

  exports.getProfile=(req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
  };