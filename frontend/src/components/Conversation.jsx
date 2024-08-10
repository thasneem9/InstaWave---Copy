import { Avatar, AvatarBadge, Flex, useColorModeValue, WrapItem } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import React from 'react'
import userAtom from '../atoms/userAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { BsCheckAll } from 'react-icons/bs'
import { selectedConversationAtom } from '../atoms/messagesAtom'
import { useColorMode } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { BsFillImageFill } from 'react-icons/bs'

const Conversation = ({conversation,isOnline}) => {

 

const lastMessage=conversation.lastMessageText;
const lastMessageSenderId=conversation.lastMessageSenderId;
const lastMessageSeen=conversation.lastMessageSeen;

const currentUser=useRecoilValue(userAtom)
const [selectedConversation,setSelectedConversation]=useRecoilState(selectedConversationAtom)
const colorMode=useColorMode();

//to remove colormode erro in bg ofselctedconv:

  //if conversation.participantsDetails.length=1(no conv yet and the only particpant [0]us the eprson u r talking TO)
  // Determine the user
  let user;
  if (conversation.participantsDetails.length === 1 || conversation.participantsDetails[1] === null) {
    user = conversation.participantsDetails[0]; // The user we are starting a new conversation with
  } else {
    user = conversation.participantsDetails.find(participant => participant.id !== currentUser._id); // The other participant
  }

  console.log("checking++ the [0] conv:",user?.username)

  console.log("Conversation prop:", conversation);
  console.log("selected conv:",selectedConversation.username)
if (!conversation || !conversation.participantsDetails || conversation.participantsDetails.length === 0) {
    console.log("userrrrrrr is emoty")
    return null; // Or some fallback UI
  }
//---------------------------------
//-------------------------------

  return (
   <Flex 
   w={'220px'}
   gap={4}
   alignItems={"center"}
   p={"1"}
   _hover={{
    cursor:"pointer",
    bg:useColorModeValue("gray.600","gray.dark"),
    color:"white"
   }}
   onClick={()=>setSelectedConversation({
    _id:conversation?.id,
    userId:user?.id,
    userProfilePic:user?.profilePic,
    username:user?.username,
    mock:conversation?.mock,
   })}
   bg={selectedConversation?._id===conversation.id?(colorMode==="light"?"gray.700":"gray.400")
    :""}
   borderRadius={'lg'}
   >
    <WrapItem>
        <Avatar size={{
            base:"xs",
            sm:"sm",
            md:"md"
        }} src={user?.profilePic}
        >
         {isOnline?   <AvatarBadge boxSize="1em" bg="green.500"  />:""} 
        
    
        </Avatar>
    </WrapItem>
    <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
        {user?.username} <Image src='/verified.png' w={4} h={4} ml={1}/>
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
        {currentUser._id === lastMessageSenderId ? (
            <Box color={lastMessageSeen ? "blue.900" : ""}>
             {/*  <BsCheckAll size={16} />    NO NEED THE TICKMARKS ON THIS BOX*/}
            </Box>
          ) :(
            ""
          )}
            {lastMessage.length>18?lastMessage.substring(0,18)+"...":lastMessage||<BsFillImageFill size={16}/>}
        </Text>

    </Stack>
   </Flex>
  )
}

export default Conversation
