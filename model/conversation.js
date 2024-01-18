const { Sequelize, DataTypes } = require('sequelize');
const sequelize=require("../util/database");

 // Define User model
  const conversation = sequelize.define('conversation', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    memberid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isactive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    groupid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  
  module.exports=conversation;