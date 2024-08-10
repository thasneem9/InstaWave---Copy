import {Link} from 'react-router-dom'
import { Flex, Box, Text, Image } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/avatar'
import Actions from './Actions'; //cntains 4 svgs of liekbutton,repost,share
import { useEffect } from 'react';
import { useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useNavigate } from 'react-router-dom';
import {formatDistanceToNow} from 'date-fns'
import {DeleteIcon} from '@chakra-ui/icons'
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/PostsAtom';
import useGetUserProfile from '../hooks/useGetUserProfile';

export default function Post({post,postedBy}) {
    const [liked,setLiked]=useState(false)
    const [user,setUser]=useState(null)
    const showToast=useShowToast();
    const navigate=useNavigate()
    const currentUser=useRecoilValue(userAtom)
    const [posts,setPosts]=useRecoilState(postsAtom)





    useEffect(()=>{
        const getUser= async()=>{
            try {
                const res=await fetch("/api/users/profile/"+postedBy)
                const data=await res.json()
             /*    console.log(data) */
                if(data.error){
                    showToast("Error",data.error,"error")

                }
                setUser(data)
              
                
            } catch (error) {
                showToast("Error",error.message,"error")
                setUser(null)
                
            }

        }
        getUser()
    },[postedBy,showToast])
  


 async function handleDeletePost(e){
    try {
        e.preventDefault()//it shudnt list to the link tag lol
        if(!window.confirm("Are you sure you want to delete this post?")) return;
        //if no then return out of the function, otheriwse:
        const res=await fetch(`/api/posts/${post.id}`,{
            method:"DELETE",
            
        })
        const data=await res.json()
        if(data.error){
            showToast("Error",data.error,"error")

        }
        showToast("success","post deleted ","success")
        setPosts(posts.filter((p)=>p.id!==post.id))
     
    } catch (error) {
        showToast("Error",error.message,"error")
        
    }
        
    }
    console.log("profile:",user?.profilePic)//it WORKS
  return (
    <Link  to={`/${user?.username}/post/${post.id}`}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name={user?.name} src={user?.profilePic}
                onClick={(e)=>{
                    e.preventDefault();
                    navigate(`/${user.username}`)

                }}
                />
              <Box w="1px" h={"full"}bg="gray.light" my={2} ></Box>                     {/* bg="gray.light" my={2} ---->margin along  y axis is the line or thread. IM NOTMAKING THREDA SO */}
                <Box position={"relative"} w={"full"}>
                    {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                    
                    {post.replies[0]&&(
                          <Avatar 
                          size="xs"
                          name={post.replies[0].username}
                          src={post.replies[0].userProfilePic}
                          position={"absolute"}
                          top={"0px"}
                          left="15px"
                          padding={"2px"}
                          />

                    )}
                    
                    {post.replies[1] && (
							<Avatar
								size='xs'
								name={post.replies[1].username}
								src={post.replies[1].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								right='-5px'
								padding={"2px"}
							/>
						)}
                {post.replies[2] && (
							<Avatar
								size='xs'
								name={post.replies[2].username}
								src={post.replies[2].userProfilePic}
								position={"absolute"}
								bottom={"0px"}
								left='4px'
								padding={"2px"}
							/>


                    )}

                    
                </Box>

            </Flex>
{/* VERIFICATIOMN MARK AND TH NAME */}
            <Flex flex={1} flexDirection={"column"} gap={2}>
            <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
                <Text fontSize={"sm"} fontWeight={"bold"} 
                         onClick={(e)=>{
                            e.preventDefault();
                            navigate(`/${user.username}`)
        
                        }}>{user?.username}
       


                </Text>
                <Image src="/verified.png" w={4} h={4} ml={1}></Image>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
                <Text fontSize={"xs"} width={36}color={"gray.light"} textAlign={'right'}>
                        {formatDistanceToNow(new Date(post.createdAt))} ago
                </Text>
                {currentUser?.id ===user?.id && <DeleteIcon size={40} onClick={handleDeletePost}/>}

                
               

            </Flex>
            </Flex>

            <Text fontSize={"sm"}>{post.text}</Text>
            {post.img && (
                    <Box borderRadius={6}
                    overflow={"hidden"}
                    border={"1px solid gray.light"}>
                        <Image src={post.img} w={"full"}></Image>
                    </Box>

            )}
            <Flex gap={3} my={1}>
                <Actions post={post}  />
            </Flex>
        

            <Flex gap={3} my={1}>
                </Flex>
                {/* <Flex gap={2} alignItems={"center"} >
                    <Text color={"gray.light"} fontSize={"sm"}>{post.replies.length} replies</Text>
                    <Box w={0.5} h={0.5} borderRadius="full" bg="gray.light"></Box>
                    <Text color={"gray.light"} fontSize={"sm"}>{post.likes.length} likes</Text>
                </Flex> */}

            </Flex>

        </Flex>

    </Link>
  )
}

