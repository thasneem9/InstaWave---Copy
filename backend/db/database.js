// database.js

import { Sequelize } from 'sequelize';

/* const sequelize = new Sequelize('instawave', 'postgres', 'postgresql566',{
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // You might need this depending on the certificate
        }
    },
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    logging:console.log
    
}); */
const sequelize = new Sequelize('instawave', 'postgres', 'postgresql566',{
    dialect:'postgres',
    connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
    
});

export default sequelize;



