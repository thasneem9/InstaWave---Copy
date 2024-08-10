
import React, { useState, useEffect } from 'react';
import { Divider, Flex, Text, useToast } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { Avatar } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {formatDistanceToNow} from 'date-fns';
import Actions from '../components/Actions';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon } from '@chakra-ui/icons';
import useShowToast from '../hooks/useShowToast';

import ActionsSavedPage from '../components/ActionsSavedPage';
import { Heading } from '@chakra-ui/react';

export default function SavedPage() {
    const [posts, setPosts] = useState([]);
    const toast = useToast();
    const navigate=useNavigate()
    const showToast=useShowToast();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/posts/saved', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                setPosts(data);
                console.log("+++++++++++", data);
            } catch (error) {
                console.error("Error fetching saved posts:", error);
                toast({
                    title: "Error",
                    description: "Unable to fetch saved posts.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        };

        fetchPosts();
    }, [toast]);

    
 async function handleDeletePost(e,postId){
    try {
        e.preventDefault()//it shudnt list to the link tag lol
        if(!window.confirm("Are you sure you want to delete this from Your saved list?")) return;
        //if no then return out of the function, otheriwse:
        const res=await fetch(`/api/posts/unsave/${postId}`,{
            method:"DELETE",
            
        })
        const data=await res.json()
        if(data.error){
            showToast("Error",data.error,"error")

        }
        showToast("success","post deleted ","success")
        
        setPosts(posts.filter((p)=>p.id!==postId))
        navigate(`/saved`)
     
    } catch (error) {
        showToast("Error",error.message,"error")
        
    }
        
    }

    return (
        <>
        <Heading  alignItems={"flex-center"}>Saved Posts</Heading>
        <Divider my={3}/>
         <Flex  gap="10" alignItems={"flex-center"} mb={4} py={5}>
            
          <Box flex={70}>
     { posts.length===0 && <h1>Save some Posts to find it here...</h1>}
        {posts.map((post) => (
                    <Flex>
                        <Link  to={`/${post?.post?.username}/post/${post.postId}`}>
        <Flex gap={3} mb={4} py={5}>
            <Flex flexDirection={"column"} alignItems={"center"}>
                <Avatar size="md" name={post?.post?.username} src={post?.post?.profilePic}
                onClick={(e)=>{
                    e.preventDefault();
                    navigate(`/${post?.post?.username}`)

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
                            navigate(`/${post?.post.username}`)
        
                        }}>{post?.post?.username}
       


                </Text>
                <Image src="/verified.png" w={4} h={4} ml={1}></Image>
            </Flex>
            <Flex gap={4} alignItems={"center"}>
                <Text fontSize={"xs"} width={36}color={"gray.light"} textAlign={'right'}>
                        {formatDistanceToNow(new Date(post.createdAt))} ago
                </Text>
                <DeleteIcon size={40} onClick={(e) => handleDeletePost(e, post.id)}/>
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
               {/*  <Actions post={post}  /> */}
               <ActionsSavedPage post={post.post}/>
            </Flex>
        

            
                </Flex>
               

        </Flex>

    </Link>



                     </Flex>
				))}

     </Box>
     <Box flex={30}>  
     </Box>
        
     </Flex>
     </>
    );
}






















{/* <h1>Saved Posts</h1>
            {savedPosts.length === 0 ? (
                <p>No saved posts found.</p>
            ) : (
                <ul>
                    {savedPosts?.map((bookmark) => (
                        <li key={bookmark?.id}>
                            <h2>{bookmark?.text}</h2>

                            <p>{bookmark?.likes} Likes</p>
                            <p>{bookmark?.replies} Replies</p>
                        </li>
                    ))}
                </ul>
            )} */}