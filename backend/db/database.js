// database.js

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('instawave', 'postgres', 'postgresql566',{
    dialect: 'postgres',
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    logging:console.log
    
});

export default sequelize;



