import { InputRightElement } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Input } from '@chakra-ui/react'
import { InputGroup } from '@chakra-ui/react'
import {IoSendSharp} from "react-icons/io5"
import useShowToast from '../hooks/useShowToast'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { conversationAtom, selectedConversationAtom } from '../atoms/messagesAtom.js'
import { useEffect } from 'react'
import { BsFillImageFill } from 'react-icons/bs'
import { Flex } from '@chakra-ui/react'
import { useRef } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import usePreviewImg from '../hooks/usePreviewImg.js'
import { Spinner } from '@chakra-ui/react'
import {
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from "@chakra-ui/react";




const MessageInput = ({setMessages}) => {
  const [messageText,setMessageText]=useState("")
  const showToast=useShowToast();
const selectedConversation=useRecoilValue(selectedConversationAtom)
const setConversations=useSetRecoilState(conversationAtom)
const imageRef=useRef(null)
const { onClose } = useDisclosure();
const {handleImageChange,imgUrl,setImgUrl}=usePreviewImg()
const [isSending,setIsSending]=useState(false);



  const handleSendMessage= async(e)=>{
    e.preventDefault();
    if(!messageText && !imgUrl) return;
    if(isSending) return;
    //prevent multople sending butons lol

    setIsSending(true)
    try {
      const res=await fetch("/api/messages",{
        method:"POST",
        headers:{
          "content-Type":"application/json",
        },
        body:JSON.stringify({
          message:messageText,
          recipientId:selectedConversation.userId,
          imgUrl:imgUrl
        })
      })
      const data=await res.json()
      console.log("Received response from backend:", data); // Check response from backend
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
       console.log("mydataaaaa>>>",data) 
      setMessages((messages)=>[...messages,data])


      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation.id === selectedConversation._id) { // Ensure you are comparing the correct IDs
            return {
              ...conversation,
              lastMessageText: messageText, // Update the lastMessageText
              lastMessageSenderId: data.senderId, // Update the lastMessageSenderId
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("")
      setImgUrl("")

    } catch (error) {
      showToast("Error",error.message,"error")
      
    }finally{
      setIsSending(false)

    }
  }
 


  return (
    <Flex gap={2}  alignItems={"center"} >

   
   <form onSubmit={handleSendMessage} style={{flex:95}}>
    <InputGroup>
    <Input w={"full"} placeholder='Type a message'
    onChange={(e)=>setMessageText(e.target.value)}
    value={messageText}
    />
    <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
    <IoSendSharp/>
    </InputRightElement>
    </InputGroup>
    </form>
    <Flex flex={5} cursor={"pointer"}>
      <BsFillImageFill size={20} onClick={()=>imageRef.current.click()}/>
        <Input type={"file"}hidden ref={imageRef} onChange={handleImageChange}/>
    </Flex>

    <Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>

    
    





    </Flex>
  )
}

export default MessageInput