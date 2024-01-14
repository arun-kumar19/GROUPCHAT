const {DataTypes } = require('sequelize');
const sequelize=require("../util/database");
const User=require("./signup");

 // Define User model
  const groupcreators = sequelize.define('groupcreator', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    groupcreatorid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: User,
          key: 'id'
      }
  },

  groupname: {
    type: DataTypes.STRING,
    allowNull: false,
},
  
  });
  
  module.exports=groupcreators;