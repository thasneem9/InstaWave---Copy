import express from "express"
import {sendMessage}  from "../controllers/messageController.js"
import {getMessages} from  "../controllers/messageController.js"
import {getConversations} from  "../controllers/messageController.js"


const router=express.Router()

router.post("/",sendMessage)
router.get("/conversations",getConversations)
router.get("/:otherUserId",getMessages)//i.e, bw logged in user and /:otherUserId



export default router                          