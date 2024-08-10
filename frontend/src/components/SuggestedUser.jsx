import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@chakra-ui/react'
import { Box } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/react'
import useFollow from '../hooks/useFollow.js'



const SuggestedUser = ({user}) => {
    const {handleFollow,following,updating}=useFollow(user)
    
  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
    <Flex gap={2} as={Link} to={`${user.username}`}>
        <Avatar src={user.profilePic} />
        <Box>
            <Text fontSize={"sm"} fontWeight={"bold"}>
               {user.username}
            </Text>
            <Text color={"gray.light"} fontSize={"sm"}>
               {user.name}
            </Text>
        </Box>
    </Flex>
    <Button
        size={"sm"}
        color={following ? "black" : "white"}
        bg={following ? "white" : "blue.400"}
        onClick={handleFollow}
        isLoading={updating}
        _hover={{
            color: following ? "black" : "white",
            opacity: ".8",
        }}
    >
        {following ? "Disconnect" : "Connect"}
    </Button>
</Flex> 
  )
}

export default SuggestedUser