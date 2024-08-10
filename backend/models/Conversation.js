import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js'; 


import User from '../models/User.js'
const Conversation = sequelize.define('Conversation', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  
  participants: {
    type: DataTypes.JSON,
    allowNull: false,
  },

  lastMessageText: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  lastMessageSenderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  
  lastMessageSeen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

export default Conversation;
