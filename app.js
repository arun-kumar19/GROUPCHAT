const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt=require("bcryptjs");
const saltRounds = 10;
const app = express();
const sequelize=require('./util/database');
const User=require("./model/signup");
const PORT = process.env.PORT || 3000;
var cors=require("cors");
app.use(bodyParser.json());
app.use(cors({
    "origin": "http://127.0.0.1:3000",
    "methods": ["GET","POST"],
  }
));
    

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
console.log('current path:',path.join(__dirname, 'public'));

// Connect to SQLite database
// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
  });

  
app.post('/signup',(req, res) => {
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

});
    

// Start the server
sequelize.sync() // Sync the database models with the actual database
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database:', error.message);
  });
