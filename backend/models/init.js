import { Sequelize } from 'sequelize';
import User from './User.js';
import Conversation from './Conversation.js';
import Message from './Message.js';

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres', // or 'mysql', 'sqlite', etc.
  logging: false,
});

// Define associations
Conversation.belongsToMany(User, { through: 'ConversationParticipants', foreignKey: 'conversationId' });
User.belongsToMany(Conversation, { through: 'ConversationParticipants', foreignKey: 'userId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
Message.belongsTo(User, { foreignKey: 'sender' });

export { sequelize, User, Conversation, Message };
