import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

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
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false, // Depending on your SSL certificate setup
        },
    },
    logging: console.log, // You can turn this off or adjust as needed
});

export default sequelize;



