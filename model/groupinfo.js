const {DataTypes } = require('sequelize');
const sequelize=require("../util/database");
const groupcreators=require("./groupcreators");
const usersignups=require("./signup");

 // Define User model
  const groupinfo = sequelize.define('groupinfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    groupid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: groupcreators,
          key: 'id'
      }
  },
  adminid: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    memberid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: usersignups,
        key: 'id'
      }
    },
    memberstatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true 
    }
  });
  module.exports=groupinfo;