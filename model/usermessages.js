const {DataTypes } = require('sequelize');
const sequelize=require("../util/database");

 // Define User model
  const usermessage = sequelize.define('usermessage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  
  module.exports=usermessage;