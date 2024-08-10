
import UserHeader from "../components/UserHeader"

import { useState } from "react";
import { useEffect} from "react";

import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/PostsAtom";
export default function UserPage() {
  const[user,setUser]=useState(null);
  const {username}=useParams()
  const showToast=useShowToast();
  const [posts,setPosts]=useRecoilState(postsAtom)
  
            
//or use getuser hook
  useEffect(()=>{
    const getUser=async()=>{
      try {
        const res= await fetch(`/api/users/profile/${username}`)
        const data=await res.json()
        console.log(data)

        if(data.error){
          showToast("Error",data.error,"error");
          return;
        }
        setUser(data);
        
      } catch (error) {
        console.log(error)
        showToast("Error",error.message,"error");
        
      }
    };
    const getPosts=async()=>{

      try {
        const res=await fetch(`/api/posts/user/${username}`)
        const data=await res.json()
        console.log("dataa----",data)
        setPosts(data)
        
      } catch (error) {
        
        showToast("Error",error.message,"error")
        setPosts([])
      }

    }
    getUser()
    getPosts();

  },[username,showToast,setPosts])
  console.log("posts is here//////",posts)
  if(!user)return null
  return (
    <div>
      <UserHeader user={user}></UserHeader>
      {posts.length===0 && <h1>User has no posts</h1>}
      {posts.map((post)=>(
        <Post key={post.id} post={post} postedBy={post.postedBy}    />
      ))}
     
    </div>
  )
}

