import express from "express";
import { createPost,getPost,deletePost,likeUnlikePost,replyToPost,getFeed, savePost,getSavedPosts,deleteSaved,checkIfBookmarked} from "../controllers/postController.js";
import { getUserPosts } from "../controllers/postController.js";
const router=express.Router();
//order DoeS inDEED MATTER!!!!!
router.get("/saved", getSavedPosts); 
router.get("/feed", getFeed);


router.get("/:id",getPost)




router.get("/user/:username",getUserPosts)


router.get('/check-bookmark/:postId', checkIfBookmarked);

router.post(`/create`,createPost); 


router.delete("/:id",deletePost)

router.delete("/unsave/:id",deleteSaved)

router.post("/like/:id",likeUnlikePost)

router.post("/reply/:id",replyToPost)

router.post("/save/:id",savePost)





export default router;
