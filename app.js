const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const jwt=require("jsonwebtoken");
const secretKey="7539753909887979qggjgjjjjhh"
const { Server: SocketIOServer } = require("socket.io");
const io = new SocketIOServer(server);


const homeRoute = require('./route/home');
const sequelize=require('./util/database');
const groupcreators=require('./model/groupcreators');
const groupinfo=require("./model/groupinfo");
const User=require("./model/signup");
const PORT = process.env.PORT || 8080;
var cors=require("cors");
const conversation = require('./model/conversation');
app.set('views', 'views');//// Set the 'views' directory for the application
app.use(bodyParser.json());

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

io.on('connection', (socket) => {
  console.log('a user connected:',socket.id);
  
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    const token=msg.messengersendortoken;
    //const id=jwt.verify(token,secretKey);
    const data={
      messengersendortoken:token,
      messengersendorname:msg.messengersendorname,
      message:msg.message
    }
    console.log('data:',data);
    io.emit('chat message', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
sequelize.sync() // Sync the database models with the actual database
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database:', error.message);
  });
