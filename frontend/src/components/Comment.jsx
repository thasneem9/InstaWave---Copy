import { Flex, Avatar,Box, Text,Image} from "@chakra-ui/react"
import {BsThreeDots} from "react-icons/bs";
import Actions from "../components/Actions";
import { Divider } from "@chakra-ui/react";

export default function Comment({reply}){
  return (
    <>
  
   <Flex gap={4} py={2} my={2} w={'full'} > 
    <Avatar src={reply.userProfilePic}></Avatar>
     <Flex gap={1} w={'full'} flexDirection={"column"}>
     <Flex w={'full'} justifyContent={"space-between"} alignItems={"center"}>
         <Text fontSize="sm" fontWeight={"bold"}>{reply.username}</Text>
    {/*      <Actions/> */}
    </Flex>
    <Text>{reply.text}</Text>
   </Flex>
   </Flex>
   
  <Divider my={3}/>
     
   
   </>
  )
}

