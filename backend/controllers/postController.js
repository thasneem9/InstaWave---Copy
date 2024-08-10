import User from "../models/User.js";
import jwt from 'jsonwebtoken'
import Post from "../models/Post.js";
import {Op} from 'sequelize';
import Sequelize from '../db/database.js';
import {v2 as cloudinary} from "cloudinary"
import Bookmark from "../models/Bookmark.js";

const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let {img}=req.body;
        // Retrieve user ID from the token in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        
        console.log("Decoded User ID:", userId);
        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }
        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Prevent creating post for other users
        if (userId.toString() !== user.id.toString()) {
            return res.status(401).json({ error: "Unauthorized to post for other people" });
        }
        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: "Text must be less than 500 characters" });
        }
        if(img){
            const uploadedResponse=await cloudinary.uploader.upload(img);
            img=uploadedResponse.secure_url;
        }
        // Create new post
        const newPost = await Post.create({
            postedBy: userId,
            text,
            img,
            replies: [], // Initialize replies as empty array
        });
                                                                                           
        res.status(201).json( newPost );
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error in createPost:", error);
    }
};




const savePost = async (req, res) => {
    try {
        // Retrieve user ID from the token in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log("Decoded User ID:", userId);

        const { id } = req.params;

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the post exists
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Save the post to bookmarks with all details
        const newBookmark = await Bookmark.create({
            userId,
            postedBy:post.postedBy,
            postId: post.id,
            text: post.text,
            img: post.img,
            likes: post.likes,
            replies: post.replies
        });

        res.status(201).json(newBookmark);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error in savePost:", error);
    }
};

//   to get saved posts



const checkIfBookmarked = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        const { postId } = req.params;

        const bookmark = await Bookmark.findOne({ where: { userId, postId } });
        if (bookmark) {
            return res.status(200).json({ bookmarked: true });
        } else {
            return res.status(200).json({ bookmarked: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error in checkIfBookmarked:", error);
    }
};




const getSavedPosts = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        


        const bookmarks = await Sequelize.query(
            'SELECT * FROM "Bookmarks" WHERE "userId" = :userId',
            {
                replacements: { userId },
                type: Sequelize.QueryTypes.SELECT
            }
        );


  
           // Fetch post details for the bookmarks
           const postIds = bookmarks.map(bookmark => bookmark.postId);
           const postDetails = await Sequelize.query(
               `
               SELECT "Posts".*, "Users"."username", "Users"."profilePic"
               FROM "Posts"
               JOIN "Users" ON "Posts"."postedBy" = "Users".id
               WHERE "Posts".id IN (:postIds)
               `,
               {
                   replacements: { postIds },
                   type: Sequelize.QueryTypes.SELECT
               }
               
           );
   
           // Combine the bookmarks and post details
           const combinedResults = bookmarks.map(bookmark => {
               const postDetail = postDetails.find(post => post.id === bookmark.postId);
               return {
                   ...bookmark,
                   post: postDetail,
                   isSaved: true // Add saved status
               };
           });
   
           res.status(200).json(combinedResults);
           console.log('Test Query Result:', combinedResults);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




const getPost=async(req,res)=>{
    try {
        const post=await Post.findByPk(req.params.id)
        if(!post){
            return  res.status(404).json({ error: "Post not found" });
        }
       
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error("Error in getpost:", error);
        
    }
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Retrieve user ID from the token in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log("Decoded User ID:", userId);

        // Check if you are the owner of the post
        if (post.postedBy.toString() !== userId.toString()) {
            return res.status(401).json({ error: "Unauthorized to delete post" });
        }
        if(post.img){
            const imgId= post.img.split("/").pop().split(".")[0];
         await cloudinary.uploader.destroy(imgId)
        }

        // Delete the post
        await post.destroy();
        res.status(200).json({ message: "Post deleted successfully", post });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error("Error in deletePost:", error);
    }
};
const deleteSaved = async (req, res) => {
    try {
        const post = await Bookmark.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Retrieve user ID from the token in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log("Decoded User ID:", userId);

        // Check if you are the owner of the post
    
        if(post.img){
            const imgId= post.img.split("/").pop().split(".")[0];
         await cloudinary.uploader.destroy(imgId)
        }

        // Delete the post
        await post.destroy();
        res.status(200).json({ message: "Post deleted successfully", post });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error("Error in deletesave:", error);
    }
};


const likeUnlikePost = async (req, res) => {
    try {
        const{id:postId}=req.params;
        // Retrieve user ID from the token in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log("Decoded User ID:", userId);/////
        //Retreive postttt

        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }


        const userLikedPost=post.likes.includes(userId);//array wilinclude the userif heliked it
        if (userLikedPost) {
            // unlike post 
            await Post.update(
                { likes: Sequelize.fn('array_remove', Sequelize.cast(Sequelize.col('likes'), 'INTEGER[]'), userId) },
                { where: { id: postId }}
            );
            res.status(200).json({ message: "Post unliked successfully" });
        } else {
            // like post 
            await Post.update(
                { likes: Sequelize.fn('array_append', Sequelize.cast(Sequelize.col('likes'), 'INTEGER[]'), userId) },
                { where: { id: postId } }
            );
        
            res.status(200).json({ message: "post liked successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.error("Error in likeUnlikePost:", error);
    }
};

const replyToPost = async (req, res) => {
    try {
        //Retrieve logged person's id from cookie
       const token = req.cookies.jwt;
       if (!token) {
           return res.status(401).json({ error: "Unauthorized" });
       }
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
       const userId = decodedToken.userId;
       console.log("Decoded User ID:", userId);

       //To get all details from User.js
       const user = await User.findByPk(decodedToken.userId);
       if (!user) {
           return res.status(404).json({ error: "User not found." });
       }
       req.user = user; // Manually setting req.user
       console.log("------3@@@999999----user:",user)
        const { text } = req.body;
        const postId = req.params.id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ error: "Text field is required" });
        }

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        //UPDATING DB:
    
       // Construct the reply object
       const reply = {
        userId: userId,
        text,
        userProfilePic,
        username
    };
    // Ensure replies is always an array
    const updatedReplies = Array.isArray(post.replies) ? [...post.replies] : [];

  // Push new reply object into updatedReplies array
  updatedReplies.push(reply);
      // Update the post with the new replies array
      await post.update({ replies: updatedReplies });

        res.status(200).json(reply);
    } catch (err) {
        console.error("Error in replyToPost:", err);
        res.status(500).json({ error: err.message });
    }
};

//------------
const getFeed=async(req,res)=>{
    try {
        // Retrieve logged person's ID from the token in cookies
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is not set");
          }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log("Decoded User ID:", userId);/////

     const feedPosts = await Post.findAll({
  where: {
    postedBy: {
      [Op.any]: Sequelize.literal(`(SELECT UNNEST(following)::integer FROM "Users" WHERE id = ${userId})`),
    },
  },
});
    res.status(200).json(feedPosts)



} catch (error) {
   res.status(500).json({ error: error.message });
   console.error("Error in getFeedPost:", error);
}
};
      

const getUserPosts=async(req,res)=>{

    const {username}=req.params;
     // Retrieve user ID from the token in cookies
     const token = req.cookies.jwt;
     if (!token) {
         return res.status(401).json({ error: "Unauthorized" });
     }
    


    try { 
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        console.log("Decoded User ID:", userId);
        //fetch
       const user = await User.findOne({
            where: { username },
            attributes: { exclude: ['password', 'updatedAt'] }
        });
         if(!user) return res.status(404).json({error:"User not found"});
         //fetch
         const posts = await Post.findAll({
            where: { postedBy:user.id },
            attributes: { exclude: ['password', 'updatedAt'] }
        });
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ error: error.message });

        
    }
}



export { createPost,getPost,deletePost, likeUnlikePost, replyToPost,getFeed,getUserPosts,savePost,getSavedPosts,deleteSaved,checkIfBookmarked};


