const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const homeRoute = require('./route/home');
const sequelize=require('./util/database');
const groupcreators=require('./model/groupcreators');
const groupinfo=require("./model/groupinfo");
const User=require("./model/signup");
const PORT = process.env.PORT || 3000;
var cors=require("cors");
const conversation = require('./model/conversation');
app.set('views', 'views');//// Set the 'views' directory for the application
app.use(bodyParser.json());
app.use(cors({
    "origin": "http://127.0.0.1:3000",
    "methods": ["GET","POST"],
  }
));
User.hasMany(groupcreators,{
  foreignKey: 'groupcreatorid'
});
groupcreators.belongsTo(User);

 groupcreators.hasMany(groupinfo,{
  foreignKey:'groupid'
})

groupinfo.belongsTo(groupcreators,{
  foreignKey: 'groupid'
}); 

User.hasMany(groupinfo,{
  foreignKey:'memberid'
})

groupinfo.belongsTo(User,{
  foreignKey: 'memberid'
}); 

User.hasMany(conversation,{
  foreignKey:'memberid'
})

conversation.belongsTo(User,{
  foreignKey: 'memberid'
}); 

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
console.log('current path:',path.join(__dirname, 'public'));
app.use(homeRoute);

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
