const express = require('express');
const bodyParser = require('body-parser');
const mime=require('mime-types')
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server: SocketIOServer } = require("socket.io");
const io = new SocketIOServer(server);
const homeRoute = require('./route/home');
const jwt=require("jsonwebtoken");
const secretKey="7539753909887979qggjgjjjjhh"
const sequelize=require('./util/database');
const groupcreators=require('./model/groupcreators');
const groupinfo=require("./model/groupinfo");
const User=require("./model/signup");
const S3Services=require('./services/s3services')
const multer = require('multer');
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

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });


app.use('/savemessage',upload.single('file'),async (req,res)=>{  
  
  let type;
  let fileUrl;
  console.log('inside save2 message function');
  
  const { token, message,chatgroupid} = req.body;
  console.log('token:',token,' message:',message,' chatgroupid:',chatgroupid);

    const id=jwt.verify(token,secretKey);
    console.log('userid=',id);
  
  
  if (req.file) {

        const file = req.file;
        const fileName = file.originalname;

         type=mime.lookup(file.originalname);
  console.log('fileName:',fileName,'  and type is:',type);

  var ISTTime = new Date();
  
  console.log('date=',ISTTime);
  const day=ISTTime.getDate();
  console.log('day=',day);
  const monthShort = ISTTime.toLocaleString('default', { month: 'short' });
  const year=ISTTime.getFullYear();
  const hours=ISTTime.getHours();
  const minute=ISTTime.getMinutes();
  const second=ISTTime.getSeconds();
  const formatName=day+monthShort+year+"_"+hours+"_"+minute+"_"+second;
  const filename="expences"+formatName+".txt";
  
  try{
  fileUrl=await S3Services.uplaodtoS3(file,filename,type);
   console.log('fileURL=',fileUrl);
   await conversation.create({
    memberid:id,
    groupid:chatgroupid,
    message:message,
    MessageType:type,
    ContentURL:fileUrl,
   }).then((result)=>{
     console.log("mutlimedia file saved successfully"); 
     res.status(200).json({'status':'success','result':result});     
   }).catch(err=>{
    console.log('something went wrong=',err);
   })
   
  }
  catch(error){
    console.log('error=',error);
    
  }
}
else{
    conversation.create({
      memberid:id,
      groupid:chatgroupid,
      message,
      MessageType:'text',
      ContentURL:'null'
    }).then(result=>{
            console.log('message saved successfully:',result);
            res.status(200).json({'status':'success','result':result});     
    }).catch(error=>{
        console.log('something went wrong:',error);
        res.status(500).send('Error saving data');
    });  
    
  
}

})
  
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
      message:msg.message,
      ContentURL:msg.ContentURL,
      MessageType:msg.MessageType,
      chatgroupid:msg.chatgroupid
    }
    //console.log('data:',data);
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
