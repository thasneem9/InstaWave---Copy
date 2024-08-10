import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import { Op } from 'sequelize';
import Sequelize from '../db/database.js';
import generateTokenAndSetCookie from '../helpers/generateTokensAndSelectCookie.js';
import jwt from 'jsonwebtoken';
import Post from '../models/Post.js';

import {v2 as cloudinary} from 'cloudinary'



const signupUser= async(req,res)=>{

    try {
        const {name,email,username,password}=req.body
         if(!name||!email||!username||!password){
            return res.status(400).json({error:"    please fill in all the details"})


        }


         const user = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }],
            },
        });
        if(user){
            return res.status(400).json({error:"user already exists"})
        }
      

      
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt);


         // Create the new user
         const newUser = await User.create({
            name,
            email,
            username,
            password: hashedPassword,
        });
      
        if (newUser) {
            //set cookie#2
            generateTokenAndSetCookie(newUser._id,res);
            //ne wuser#1
			res.status(201).json({
				_id: newUser._id,
				name: newUser.name,
				email: newUser.email,
				username: newUser.username,
				bio: newUser.bio,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}

        
    } catch (error) {
        res.status(500).json({error:error.message})
        console.log("Error in signupUser:",error.message)
        
    }

}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({
            where: {
                [Op.or]: [{ username }],
            },
        });

        // Check if user exists and verify password
        if (!user) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        // If authentication succeeds, generate token with userId and set cookie
        const token = generateTokenAndSetCookie(user.id, res);

        // Respond with user details and token
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic,
            token: token, // Optionally include token in response for client-side storage
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("error in loginUser:", error.message);
    }
};

const logoutUser=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:1});//1milisecond, clearing out cookies
        res.status(200).json({message:"User loggesout successfully"})
        
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("error in loginUser:",error.message)
        
    }

}
const followUnfollowUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Retrieve user ID from the token in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        console.log("Decoded User ID:", userId); // Ensure userId is correctly decoded from the token
        console.log("Requested user to follow/unfollow:", id);
        console.log("Current user ID:", userId);///////////////

        if (id === userId.toString()) {
            return res.status(400).json({ error: "You cannot follow/unfollow yourself" });
        }

        const userToModify = await User.findByPk(id);
        const currentUser = await User.findByPk(userId);

        if (!userToModify || !currentUser) {
            console.log("User not found:", { userToModify, currentUser });
            return res.status(400).json({ error: "User not found" });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            // Unfollow user
            await User.update(
                { followers: Sequelize.fn('array_remove', Sequelize.cast(Sequelize.col('followers'), 'INTEGER[]'), userId) },
                { where: { id } }
            );
            await User.update(
                { following: Sequelize.fn('array_remove', Sequelize.cast(Sequelize.col('following'), 'INTEGER[]'), id) },
                { where: { id: userId } }
            );
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            // Follow user
            await User.update(
                { followers: Sequelize.fn('array_append', Sequelize.cast(Sequelize.col('followers'), 'INTEGER[]'), userId) },
                { where: { id } }
            );
            await User.update(
                { following: Sequelize.fn('array_append', Sequelize.cast(Sequelize.col('following'), 'INTEGER[]'), id) },
                { where: { id: userId } }
            );
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in followUnfollowUser:", err.message);
    }
};
const updateUser=async (req,res)=>{
    const {name,email,username,password,bio}=req.body;
    let{profilePic}=req.body;

    
        // Retrieve user ID from the token in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        console.log("Decoded User ID:", userId); 


try {
  
        let user= await User.findByPk(userId);
        if(!user) return res.status(400).json({error:"User not found"});
        //prevent updating otherppl's info
       

        //if user changes pasword:
        if(password){
            const salt=await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            user.password=hashedPassword;
        }
        //save profile pic to cloudinary
       if(profilePic){
        if(user.profilePic){//if a profilepic already exists themn remove it from the cloudianry....dont waste space
            await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
        }
        const uploadedResponse=await cloudinary.uploader.upload(profilePic);
        //this uploadResponse has one field called secure URL...
        profilePic=uploadedResponse.secure_url;
       }

       
        //ifuserupdate name:or if null thenasit was
        user.name=name||user.name;
        user.email=email||user.email;
        user.username=username||user.username;
        user.profilePic=profilePic||user.profilePic;
        user.bio=bio||user.bio;


        user = await user.save();
      // Fetch all posts where user's replies need to be updated
      const posts = await Post.findAll();

      // Update username and userProfilePic in all replies
      for (let post of posts) {
          if (post.replies && Array.isArray(post.replies)) {
              let updated = false;
              for (let reply of post.replies) {
                  if (reply.userId === userId) {
                      reply.username = user.username;
                      reply.userProfilePic = user.profilePic;
                      updated = true;
                  }
              }
              if (updated) {
                  await post.save(); // Save each post to persist the updated replies
              }
          }
      }


        user.password=null;
        res.status(200).json({message:"profile updated successfully",user})
        
} catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in updateUser:", error.message);
    
}
}


const getUserProfile=async(req,res)=>{

            //fetch userprofile using wither username or id....=query
            const {query}=req.params;
    try {
     
        let user;
        //query is userid:
        if(!isNaN(query)) {
       user = await User.findOne({
            where: { id:query },
            attributes: { exclude: ['password', 'updatedAt'] }
        });}else{
           //query is username
       user = await User.findOne({
        where: { username:query },
        attributes: { exclude: ['password', 'updatedAt'] }
    });}
        
        
        //exclude pasword andupdated at
        if(!user) return res.status(404).json({error:"User not found"});

        res.status(200).json(user)
        
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in geting profile:", error.message);
        
    }
}

const getSuggestedUsers = async (req, res) => {
    try {
         // Retrieve user ID from the token in cookies
         const token = req.cookies.jwt;
         if (!token) {
             return res.status(401).json({ error: "Unauthorized" });
         }
 
         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
         const userId = decodedToken.userId;
 

        // Fetch users followed by the current user
        const currentUser = await User.findByPk(userId);
        const usersFollowedByYou = currentUser.following; // Assuming 'following' is an array of user IDs

        // Fetch random users excluding the current user and those already followed
        const users = await User.findAll({
            where: {
                id: {
                    [Op.not]: userId, // Exclude the current user
                    [Op.notIn]: usersFollowedByYou, // Exclude followed users
                }
            },
            order: Sequelize.random(), // Random ordering (sequelize.random() is an alias for 'RAND()' or equivalent)
            limit: 10,
        });

        // Limit the number of suggested users
        const suggestedUsers = users.slice(0, 4).map(user => {
            // Omit sensitive information
            const { id, name, email,username,profilePic } = user;
            return { id, name, email,username,profilePic }; // Customize fields as needed
        });

        res.status(200).json(suggestedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export {signupUser,loginUser,logoutUser, followUnfollowUser,updateUser, getUserProfile,getSuggestedUsers}