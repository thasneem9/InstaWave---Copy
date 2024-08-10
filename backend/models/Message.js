import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js'; // Import your sequelize instance

const Message = sequelize.define('Message', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
 
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  img: {
    type: DataTypes.STRING,
    defaultValue: "",
  },
}, {
  timestamps: true, 
});

export default Message;
