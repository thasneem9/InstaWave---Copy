
import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from './routes/userRoute.js';
import postRoutes from './routes/postRoute.js'
import messageRoutes from './routes/messageRoute.js'
import sequelize from './db/database.js'; 
import {app,server} from "./socket/socket.js"//aslo changed i n last line app.lisetn to server.listen
// Ensure correct path
 // Ensure this file is imported to set up associations
//folowunfoloe:

//mangae file uploads/iage uploads:
import {v2 as cloudinary} from "cloudinary";


dotenv.config();

/* const app = express(); already created in ocket*/
const PORT = process.env.PORT || 5000;
const __dirname= path.resolve();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
//backend frontend in smae url:
if(process.env.NODE_ENV=== "production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
    })
}

    // Sync models and start server
sequelize.sync({ force: false }) // Set force to true only in development to recreate tables
.then(() => {
    console.log('Database synced successfully');
    server.listen(PORT, () => console.log(`Server started at http://localhost:${PORT}`));
})
.catch((err) => {
    console.log('Error syncing the database:', err);
});

