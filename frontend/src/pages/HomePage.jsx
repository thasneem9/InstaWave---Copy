import { Flex } from "@chakra-ui/react";

import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import Post from "../components/Post";
import postsAtom from "../atoms/PostsAtom";
import { useRecoilState } from "recoil";
import { Box } from "@chakra-ui/react";
import SuggestedUsers from "../components/SuggestedUsers";
////////////////
export default function  HomePage(){

/////
const showToast=useShowToast();
const [posts, setPosts] = useRecoilState(postsAtom);

const [loading,setLoading]=useState(true)

///
    useEffect(()=>{
        const getFeedPosts=async()=>{
            setPosts([]);
            try {
                const res=await fetch("/api/posts/feed")
                const data=await res.json()
                if (!data || data.length === 0) {
                    showToast("Info", "Connect With Users to See Feed", "info");
                    setLoading(false); // Make sure to handle loading state
                    return;

                }
                if(data.error){
                    console.log(data.error)
                    return;
                }
                console.log(data)//shows an array of the post
                setPosts(data)
                setLoading(false)
                
            } catch (error) {
                console.log(error.message)
            }
        }
        getFeedPosts();

    },[showToast,setPosts])


    ///////


  

    return(
      
        
       <Flex gap="10" alignItems={"flex-start"}>
     <Box flex={70}>
     { posts.length===0 && <h1>Follow some users to see the feed</h1>}
        {posts.map((post) => (
					<Post key={post.id} post={post} postedBy={post.postedBy} />
				))}

     </Box>
     <Box flex={30}>  
    <SuggestedUsers/>
     </Box>
        
        
        
        
     </Flex>
    )
};