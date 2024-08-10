import React, { useState } from 'react'
import { Button } from '@chakra-ui/react'
import { useColorModeValue} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'
  import { FormControl } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import usePreviewImg from '../hooks/usePreviewImg'
import { useRef } from 'react'
import { BsFillImageFill } from 'react-icons/bs'
import { Input } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import { CloseButton } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from '../hooks/useShowToast'
import postsAtom from '../atoms/PostsAtom'
import { useParams } from 'react-router-dom'
////////////   CONSTSSSS  ///////////////

const CreatePost = () => {
const { isOpen, onOpen, onClose } = useDisclosure();
const [postText,setPostText]=useState("")
const { handleImageChange, imgUrl,setImgUrl } = usePreviewImg()
const imageRef=useRef(null)
const [remainingChar,setRemainingChar]=useState(500)
const user=useRecoilValue(userAtom)
const showToast=useShowToast()
const [posts,setPosts]=useRecoilState(postsAtom)
const {username}=useParams();
////////       FUNCTIONS             ////////////////////

const handleTextChange=(e)=>{
    const inputText=e.target.value;
    if(inputText.length>500){
        const truncatedText    =inputText.slice(0,500);
        setPostText(truncatedText)
        setRemainingChar(0)
    }else{
        setPostText(inputText)
        setRemainingChar(500-inputText.length)
    }


}
async function handleCreatePost(){
    try {
          
        const res= await fetch("/api/posts/create",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({postedBy:user.id,text:postText,img:imgUrl})
        })
        const responseClone = res.clone();
        const bodyText = await responseClone.text();
        console.log('Received the following instead of valid JSON:', bodyText);
        const data=await res.json();
        console.log(data);
        if(data.error){                                 
            showToast("Error",data.error,"error")
            return;
        }else{
            showToast("success","posted","success");
            if(username===user.username){
                setPosts([data,...posts]);
            }
            onClose()
            setPostText("");
            setImgUrl("")
        }                        
    } catch(error) {
        showToast("Error",error.message,"error")
    }
}

/////////       RETURN       ///////////

  return (
    



    <>
    
    <Button
    position={"fixed"}
    bottom={10}
    right={5}
    leftIcon={ <AddIcon />}
    bg={useColorModeValue("gray.300", "gray.dark")}
    onClick={onOpen} 
    size={{ base: "sm", sm: "md" }}
        >Post
   
    </Button>

    {/*  copied form chakra docs: */}
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>

            <FormControl>
                <Textarea
                placeholder='Post Content......'
                onChange={handleTextChange}
                value={postText}>

                </Textarea>

                <Text fontSize='xs'
                fontWeight="bold"
                textAlign="right"
                m={1}
                color={'gray.800'}>
                    {remainingChar}/500
                </Text>
                <Input type='file'
                hidden
                ref={imageRef}
                onChange={handleImageChange}/>
                <BsFillImageFill
                style={{marginLeft:'5px', cursor:"pointer"}}
                size={16}
                onClick={()=>imageRef.current.click()}/>
            </FormControl>
            {imgUrl &&(
                <Flex mt={5} w={'full'} position={'relative'}>
                    <Image src={imgUrl} alt='selected img'></Image>
                    <CloseButton onClick={()=>{setImgUrl("")}}
                        bg={'gray.100'}
                        position={'absolute'}
                        top={2}
                        right={2}
                        ></CloseButton>
                </Flex>
            )}
          </ModalBody>

          <ModalFooter>

            <Button colorScheme='blue' mr={3} onClick={handleCreatePost}>
              Post
            </Button>
         
          </ModalFooter>
        </ModalContent>
      </Modal>










</>








  )
}

export default CreatePost