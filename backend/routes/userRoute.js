import express from "express";
import { loginUser, signupUser,logoutUser ,followUnfollowUser,updateUser, getUserProfile,getSuggestedUsers } from "../controllers/userController.js";



const router=express.Router();
router.get(`/profile/:query`,getUserProfile); 
router.get(`/suggested`,getSuggestedUsers); 
router.post("/signup",signupUser) 
router.post("/login",loginUser) 
router.post("/logout",logoutUser) 
router.post(`/follow/:id`,followUnfollowUser);
router.post(`/update/:id`,updateUser); 

export default router;
