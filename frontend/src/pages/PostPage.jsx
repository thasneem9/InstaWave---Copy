
import { Flex, Avatar,Box, Text,Image} from "@chakra-ui/react"
import {BsThreeDots} from "react-icons/bs";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import { Divider } from "@chakra-ui/react";
import { useEffect } from "react";
import { useState } from "react";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import postsAtom from "../atoms/PostsAtom";

export default function PostPage(){
  const {user}=useGetUserProfile()
/* const [post,setPosts]=useState(null); */
const showToast=useShowToast()
const {pid} = useParams()
const currentUser = useRecoilValue(userAtom); // logged in user
const navigate=useNavigate();
const [posts,setPosts]=useRecoilState(postsAtom)



const currentPost=posts[0];

  useEffect(()=>{
    const getPost=async()=>{
      try {
        const res=await fetch(`/api/posts/${pid}`)
        const data=await res.json();
        if (data.error){
          showToast("error",data.error,"error")
          return

        }
        console.log("MY POSTS:",data)
       
        setPosts([data])
      } catch (error) {
        showToast("error",error.message,"error")
       
        
      }
    }
    getPost()
  },[showToast,pid,setPosts])

 if(!user){
  return(<Flex>


  </Flex>)
 }
 if(!currentPost){
  return null;
 }
 async function handleDeletePost(){
  try {
     
      if(!window.confirm("Are you sure you want to delet this post?")) return;
      //if no then return out of the function, otheriwse:
      const res=await fetch(`/api/posts/${currentPost.id}`,{
          method:"DELETE",
          
      })
      const data=await res.json()
      if(data.error){
          showToast("Error",data.error,"error")
       

      }
      showToast("success","post deleetd ","success")
      navigate(`/${user.username}`)
  } catch (error) {
      showToast("Error",error.message,"error")
      
  }
      
  }
  console.log("username",user.username)//this owrks


  return (
  <>
{/*  avatar and his verified name */}
    <Flex gap={3}> 
      

            <Avatar
                name={user?.username}
               
              
                src={user?.profilePic}
                size={{
                    base:"md",
                    md:"xl" /* for responsive avatarc */
                }}
            />

            <Flex >
                <Text fontSize={"xl"} fontWeight={"bold"}>{user?.username}</Text>
                <Image src="/verified.png" w={4} h={4} ml={1} my={1} mx={2}></Image>
            </Flex>
    </Flex>
{/* threed ots 1d */}

        
         <Flex gap={4} alignItems={"center"} justifyContent={"flex-end"}>
  <Text fontSize={"xs"} color={"gray.light"} ml="auto">
    {formatDistanceToNow(new Date(currentPost?.createdAt))} ago
  </Text>
  {currentUser._id === user.id && (
    <DeleteIcon size={20} onClick={handleDeletePost} />
  )}
</Flex>
          
{/* text */}
              
              <Text my={3}>{currentPost?.text}</Text>

{/* post+ svgs */}
                {currentPost?.img &&(
                   <Box borderRadius={6}
                   overflow={"hidden"}
                   border={"1px solid gray.light"}>
               <Image src={currentPost.img} w={"full"}></Image>
               </Box>

                )}
             


            <Flex my={3}>
              <Actions post={currentPost}/>

            </Flex>

{/* likes dot replies */}
           {/*   <Flex gap={3} alignItems={"center"}>
              <Text color={"gray.light"}>{post?.replies?.length} replies</Text>
              <Box w={0.5} h={0.5} borderRadius="full" bg="gray.light" ></Box>
              <Text color={"gray.light"}>{post?.likes?.length} likesit</Text>

            </Flex>  */}
          <Divider my={3}/>
          {currentPost?.replies?.map(reply=>(
            <Comment
            key={reply.id}
            reply={reply}/> 
            

          ))}
          <Divider my={3}/>
       

        

  </>
  

  )
}

