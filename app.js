const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const homeRoute = require('./route/home');
const sequelize=require('./util/database');
const PORT = process.env.PORT || 3000;
var cors=require("cors");
app.set('views', 'views');//// Set the 'views' directory for the application
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
app.use(homeRoute);
// Connect to SQLite database
// Routes

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
