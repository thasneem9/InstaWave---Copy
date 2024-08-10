// models/Bookmark.js
import Sequelize from 'sequelize';
import sequelize from '../db/database.js';
import { DataTypes } from 'sequelize';

// Define the Bookmark model
const Bookmark = sequelize.define('Bookmark', {
    userId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    text: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    likes: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), 
        allowNull: true,
        defaultValue: [],
    },
    replies: {
        type: DataTypes.JSONB, 
        allowNull: true,
        defaultValue: []
    },
}, {
    timestamps: true,
});

export default Bookmark;
