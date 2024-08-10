import React, { useEffect } from 'react'
import { Box, Button, Skeleton, SkeletonCircle, useColorModeValue } from '@chakra-ui/react'
import { Flex} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { Input } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import Conversation from '../components/Conversation'
import { useState } from 'react'
import {GiConversation} from "react-icons/gi"
import MessageContainer from '../components/MessageContainer'
import useShowToast from "../hooks/useShowToast.js"
import { useRecoilState } from 'recoil'
import { conversationAtom, selectedConversationAtom } from '../atoms/messagesAtom.js'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom.js'
import { useSocket } from '../context/SocketContext.jsx'


const ChatPage = () => {
  const showToast=useShowToast();
  const [loadingConversations,setLoadingConversations]=useState(true)
const [conversations, setConversations]=useRecoilState(conversationAtom)
const [selectedConversation,setSelectedConversation]=useRecoilState(selectedConversationAtom)
const [searchText, setSearchText]=useState("");
const [searchingUser,setSearchingUser]=useState(false);
const currentUser=useRecoilValue(userAtom);
const {socket,onlineUsers}=useSocket();


useEffect(() => {
  socket?.on("messagesSeen", ({ conversationId }) => {
    setConversations((prev) => {
      const updatedConversations = prev.map((conversation) => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            lastMessageSeen: true
          };
  
        }
        return conversation;
      });
      return updatedConversations;
    });
  });
}, [socket, setConversations]);


  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // Ensure lastMessageSeen property is correctly included
      const conversationsWithSeenStatus = data.map(conversation => ({
        ...conversation,
        lastMessageSeen: conversation.lastMessageSeen || false
      }));

      setConversations(conversationsWithSeenStatus);
      console.log("Conversations data:", conversationsWithSeenStatus);
        console.log("Conversations data:", data);
      /*   setConversations(data); */

        

      } catch (error) {
        showToast("Error", error.message, "error");
      }finally{
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast,setConversations]);

  const handleConversationSearch=async (e)=>{
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res=await fetch(`/api/users/profile/${searchText}`);
      const searchedUser =await res.json();
      if(searchedUser.error){
        showToast("Error",searchedUser.error,"error");
        return;
      }

      const messagingYourself=searchedUser.id===currentUser._id;
      if(messagingYourself){
        showToast("ERROR","you cannot message yourself","error")
        return;
      }
    /*   const conversationAlreadyExists = conversations.find(
        (conversation) => {
          // Ensure participantsDetails is defined and is an array
          return conversation.participantsDetails &&
                 Array.isArray(conversation.participantsDetails) &&
                 conversation.participantsDetails[0] &&
                 conversation.participantsDetails[0].id === searchedUser.id;
        }
      ); */
      const conversationAlreadyExists = conversations.find((conversation) => {
        // Ensure participantsDetails is defined and is an array
        return conversation.participantsDetails &&
               Array.isArray(conversation.participantsDetails) &&
               conversation.participantsDetails.some(participant => participant.id === searchedUser.id);
      });
    if(conversationAlreadyExists){
        setSelectedConversation({
          _id: conversationAlreadyExists.id,
          userId:searchedUser.id,
          username:searchedUser.username,
          userProfilePic:searchedUser.profilePic,
        });
        return;
      }
      const newid=Date.now();

     const mockConversation={
      mock:true,
      lastMessageText:"",
      lastMessageSenderId:"",
      id:newid,
      participantsDetails:[
        {
          id:searchedUser.id,
          username:searchedUser.username,
          profilePic:searchedUser.profilePic,                    
        }
      ]

       
     }
     setConversations((prevConvs)=>[...prevConvs,mockConversation])
    } catch (error) {
      showToast("error",error.message,"error")
      
    }finally{
      setSearchingUser(false)
    }
  }



  return (
    <Box postition={"absolute"}
    left={"50%"}
 /*    transform={"translateX(-10%)"} */
    w={{
      base:"100%",//smaller scren
       md:"80%",//medium screeen
      lg:"750px"
    }}
    p={4}
  
    /* border={"1px solid red"} */
    > 
    <Flex
    gap={4}
    flexDirection={{
      base:"column",
      md:"row"
    }}
    maxW={{
      sm:"400px",
      md:"full"
    }}
    mx={"auto"}
    >
      <Flex flex={30}
      gap={2}
      flexDirection={"column"}
      maxw={{
        sm:"400px",
        md:"full",
      }}
      mx={"auto"}
      >
        <Text fontWeight={700} 
        color={useColorModeValue("gray.600","gray.400")}>
          Your Converstaions
        </Text>
        <form onSubmit={handleConversationSearch}>
          <Flex alignItems={"center"} gap={2}>
            <Input placeholder='search for a user'
            onChange={(e)=>setSearchText(e.target.value)}
            />
            <Button size={'sm'} onClick={handleConversationSearch}
            isLoading={searchingUser}
            >
              <SearchIcon/>
            </Button>
          </Flex>
        </form>
        {loadingConversations &&
        [0,1,2,3,4].map((_,i)=>(
          <Flex key={i} gap={4} alignItems={"center"} p={1} borderRadius={"md"}>
            <Box>
              <SkeletonCircle size={10}/>
            </Box>
            <Flex w={"full"} flexDirection={"column"} gap={3}>
              <Skeleton h={"10px"} w={"80%"}/>
              <Skeleton h={"8px"} w={"90%"}/>
              </Flex>
          </Flex>
        ))}
      {/*   WORKS BUT NOT WON SECOND WINDOW :*/}
      {/*   {!loadingConversations &&(
        conversations.map((conversation)=>(
          <Conversation
           key={conversation.id} 
          isOnline={onlineUsers.includes(conversation.participantsDetails[0].id.toString())}

          conversation={conversation}
          />
        ))
       )} */}
                {!loadingConversations && (
          conversations.map((conversation) => {
            // Determine the other participant's ID
            const otherParticipant = conversation.participantsDetails.find(
              (participant) => participant.id !== currentUser._id
            );

            // Check if the other participant is online
            const isOnline = onlineUsers.includes(otherParticipant.id.toString());

            return (
              <Conversation
                key={conversation.id}
                isOnline={isOnline}
                conversation={conversation}
                currentUser={currentUser}
              />
            );
          })
        )}


      </Flex>
      {!selectedConversation._id &&(
             <Flex
             flex={1}
           
               flexDir={"column"}
               alignItems={"center"}
               justifyContent={"center"}
               height={"300px"}
               width={"100%"}
               maxWidth={"400px"}
               textAlign={"center"}
               p={4}
               >
                 <GiConversation size={80}/>
                 <Text fontSize={"lg"} maxWidth={"200px"} whiteSpace={"nowrap"} overflow={"hidden"} textOverflow={"ellipsis"}>Select a conversation to start messaging</Text>
         
               </Flex>


      )}
       {selectedConversation._id && <MessageContainer/> }
  
   
    </Flex>
    </Box> //this has to be box....bcs in app it is box and is defined as relative
  )
}

export default ChatPage;



















  /*  borderRadius={"md"} */
    /*   p={"2"} */