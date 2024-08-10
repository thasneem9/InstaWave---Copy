import { DataTypes } from 'sequelize';
import sequelize from '../db/database.js';


const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 255],
        },
    },
    profilePic: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    followers: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    following: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
    },
    bio: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    isFrozen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'User',
    timestamps: true,
});



export default User;





