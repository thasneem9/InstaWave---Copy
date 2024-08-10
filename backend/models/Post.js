
import Sequelize from 'sequelize';
import sequelize from '../db/database.js'; 
import { DataTypes } from 'sequelize';

const Post = sequelize.define('Post', {
    postedBy: {
        type: Sequelize.INTEGER, 
        allowNull: false,
    },
    text: {
        type: Sequelize.STRING(500),
        allowNull: true,
    },
    img: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    likes: {
        type: Sequelize.ARRAY(Sequelize.INTEGER), 
        allowNull: true,
        defaultValue: [],
    },
    replies: {
        type: Sequelize.JSONB, 
        allowNull: true,
        defaultValue: []
    },
}, {
    timestamps: true,
});



export default Post;
