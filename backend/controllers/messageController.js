import { Op } from 'sequelize'; // Import Op for querying
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { v2 as cloudinary } from "cloudinary";
import jwt from 'jsonwebtoken'



import User from '../models/User.js'
import { getRecipientSocketId, io } from '../socket/socket.js';

async function sendMessage(req, res) {
  try {
    const { recipientId, message ,imgUrl} = req.body;
 

     // Retrieve user ID from the token in cookies
     const token = req.cookies.jwt;
     if (!token) {
         return res.status(401).json({ error: "Unauthorized" });
     }
     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
     const userId = decodedToken.userId;
    const senderId = userId // Assuming req.user contains the logged-in user's info
    console.log("Received imgUrl:", imgUrl); 
    let img = null;
    if (imgUrl) {
      const uploadedResponse = await cloudinary.uploader.upload(imgUrl);
      img = uploadedResponse.secure_url;
      console.log("Uploaded image to Cloudinary. Secure URL:", img);
    }
    // Find or create a conversation
    let conversation = await Conversation.findOne({
      where: {
        participants: {
          [Op.contains]: [senderId, recipientId], // Op.contains for JSON array field
        },
      },
    });

    if (!conversation) {
      // Create a new conversation
      conversation = await Conversation.create({
        participants: [senderId, recipientId],
        lastMessageText: message,
        lastMessageSenderId: senderId,
        lastMessageSeen: false,
      });
    } else {
      // Update the existing conversation
      await Conversation.update(
        {
          lastMessageText: message,
          lastMessageSenderId: senderId,
          lastMessageSeen: false,
        },
        {
          where: {
            id: conversation.id,
          },
        }
      );
    }

    // Handle image upload if there's an image
    
   
    // Create a new message
    const newMessage = await Message.create({
      conversationId: conversation.id,
      senderId: senderId,
      text: message,
      img: img,
      seen: false,
    });

    const recipientSocketId=getRecipientSocketId(recipientId)
    if(recipientSocketId){
      io.to(recipientSocketId).emit("newMessage",newMessage)
    }
    console.log("Created new message++++++++++++++:", newMessage); // Log the created message object

    // Respond with the new message
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMessages(req,res){
  //if we enter /2 and we r logged in as id=1..then we getthe messages bw 1 and 2
//const of otheruserid
//dont try sending mesages to urself..tht aint handled yet
const {otherUserId}=req.params;
 // Retrieve user ID from the token in cookies
 const token = req.cookies.jwt;
 if (!token) {
     return res.status(401).json({ error: "Unauthorized" });
 }
 const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
 const userId = decodedToken.userId;
 // Convert otherUserId to integer
 const otherUserIdInt = parseInt(otherUserId, 10);

  try {
   
    const conversation = await Conversation.findOne({
      where: {
        participants: {
          [Op.contains]: [userId,  otherUserIdInt], // Adjusted for Sequelize
        },
      },
    });

  if(!conversation){
    return res.status(404).json({error:"Conversation Not Found"})
  }
    // Handle the case for mock conversations if needed
   /*  if (conversation.mock) {
      return res.status(200).json([]); // Return an empty array or appropriate response
    } */

  // Retrieve messages from the found conversation
  const messages = await Message.findAll({
    where: {
      conversationId: conversation.id,
    },
     order: [['createdAt', 'ASC']], // Sort by createdAt
  });
res.status(200).json(messages)
    
  } catch (error) {
    res.status(500).json({error:error.message})
    
  }

}

async function getConversations(req,res){
   // Retrieve user ID from the token in cookies
 const token = req.cookies.jwt;
 if (!token) {
     return res.status(401).json({ error: "Unauthorized" });
 }
 const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
 const userId = decodedToken.userId;
  try {
      // Find conversations involving the user
      const conversations = await Conversation.findAll({
        where: {
          participants: {
            [Op.contains]: [userId], // Ensure the user is part of the participants array
          },
        },
      });
  
      // Extract all unique participant IDs from the conversations
      const participantIds = [];
      conversations.forEach(conversation => {
        conversation.participants.forEach(participant => {
          if (!participantIds.includes(participant)) {
            participantIds.push(participant);
          }
        });
      });
  
      // Fetch participant details
      const participantsDetails = await User.findAll({
        where: {
          id: {
            [Op.in]: participantIds,
          },
        },
        attributes: ['id', 'username', 'profilePic'],
      });
  
      // Map participant details to conversations
      const conversationsWithDetails = conversations.map(conversation => {
        const details = conversation.participants.map(participantId => {
          return participantsDetails.find(user => user.id === participantId);
        });
        return {
          ...conversation.toJSON(),
          participantsDetails: details,
        };
      });
  
      res.status(200).json(conversationsWithDetails);

    
  } catch (error) {
    res.status(500).json({error:error.message})
    
  }
}

export  {sendMessage,getMessages,getConversations};


