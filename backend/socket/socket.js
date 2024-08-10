import {Server} from 'socket.io';
import http from 'http'
import express from 'express'
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';


const app=express()

const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

export const getRecipientSocketId=(recipientId)=> {
  return userSocketMap[recipientId]
}

//to see online/offline storinguser ids in hash map:
const userSocketMap={}//userId:socketId
io.on('connection', (socket) => {
    console.log("User connected", socket.id);
    const userId=socket.handshake.query.userId;

    if(userId!="undefined") userSocketMap[userId]=socket.id;//key=value
    io.emit("getOnlineUsers",Object.keys(userSocketMap))//[1,2,3]ONLY KEYS NOT VALUESSS

  socket.on("markMessagesAsSeen",async({conversationId,userId})=>{
    try {
 
     // Update messages as seen
     await Message.update(
      { seen: true },
      { where: { conversationId: conversationId, seen: false } }
    );


   // Update conversation to mark the last message as seen
   await Conversation.update(
    { lastMessageSeen: true },
    { where: { id: conversationId } }
  );

      io.to(userSocketMap[userId]).emit("messagesSeen",{conversationId})
    } catch (error) {
      console.log(error)
      
    }
  })



    socket.on('disconnect', () => {
      console.log("User disconnected", socket.id);
   delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit updated online users
  });
});
export {io,server,app}