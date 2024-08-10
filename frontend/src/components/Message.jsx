import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Avatar } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/userAtom'
import { Box } from '@chakra-ui/react'
import { BsCheckAll } from "react-icons/bs";
import { Image } from '@chakra-ui/react'
import { useState } from 'react'
import { Skeleton } from '@chakra-ui/react'
//if ur the owner of message..position the avatar..to the right
const Message = ({ownMessage,message}) => {
    const selectedConversation=useRecoilValue(selectedConversationAtom)
    const user=useRecoilValue(userAtom)
    const [imgLoaded,setImgLoaded]=useState(false)
  return (
    <>
    {ownMessage?(

        <Flex gap={2} alignSelf={"flex-end"} >
        {message.text && (
						<Flex bg={"twitter.700"} maxW={"350px"} p={1} borderRadius={"md"}>
						  <Text color={"white"}>{message.text}</Text>
              <Box alignSelf={"flex-end"}     ml={1} color={message.seen?"blue.900":"white.900"} fontWeight={"bold"}  >
              <BsCheckAll size={16} />
              </Box>
					</Flex>
					)}

        {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
              src={message.img}
              alt='message image'
              hidden
              onLoad={()=>setImgLoaded(true)}
              borderRadius={4}
              />
            <Skeleton w={"200px"} h={"200px"}/>
            </Flex>
          )}
          {message.img && imgLoaded && (
            <Flex mt={5} w={"200px"}>
                 <Image
                 src={message.img}
                 alt='message image'
                 borderRadius={4}/>
                <Box alignSelf={"flex-end"}     ml={1} color={message.seen?"blue.900":"white.900"} fontWeight={"bold"}  >
              < BsCheckAll size={16} />
              </Box>
               </Flex>

              )}
        <Avatar src={user.profilePic} w="7" h={7}/>
        </Flex>
            ):(
                <Flex
                gap={2}
                >
               <Avatar src={selectedConversation.userProfilePic} w='7' h={7} />
               {message.text && (
						<Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
							{message.text}
						</Text>
					)}
                {message.img && !imgLoaded && (
            <Flex mt={5} w={"200px"}>
              <Image
              src={message.img}
              alt='message image'
              hidden
              onLoad={()=>setImgLoaded(true)}
              borderRadius={4}
           
              />
                 <Skeleton w={"200px"} h={"200px"}/>
            </Flex>
          )}
              {message.img && imgLoaded && (
                 <Flex mt={5} w={"200px"}>
                 <Image
                 src={message.img}
                 alt='message image'
                 borderRadius={4}/>
               </Flex>

              )}
              
                </Flex>
            )}
   </>
  )
}

export default Message