import React from 'react'
import { TbTicTac } from "react-icons/tb";
import { Center, Flex } from '@chakra-ui/react';
import { Heading } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Link } from "@chakra-ui/react"
import {Link as RouterLink} from 'react-router-dom'
import { RiGameFill } from "react-icons/ri";
import { LiaGamepadSolid } from "react-icons/lia";
import { GiMagickTrick } from "react-icons/gi";
import { Box } from '@chakra-ui/react';


const GamePage = () => {
  return (
    <>
    <Flex flexDirection={"column"} gap={10} marginLeft={"100px"} >
        <Heading >Choose a game to play!</Heading>
                    <Box  bg="twitter.900"  
    p={4}         
    borderRadius="md" 
    _hover={{ transform: "scale(1.05)", transition: "transform 0.2s", color:"white.900"}}
    w={"400px"}
     >

                    <Flex alignItems="center" gap={3} >
                        <Link as ={RouterLink} to="/tictactoe" _hover={{ textDecoration: "none", color: "blue.500" }}>
                        <TbTicTac size={50} />
                        </Link>
                        <Text fontSize="lg">Tic Tac Toe</Text>
                    </Flex>
                    </Box>



                    <Box bg="purple.900"  
    p={4}         
    borderRadius="md" 
    _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" ,color:"white.900"}}
    w={"400px"}
    >

                    <Flex alignItems="center" gap={3}  _hover={{ transform: "scale(1.05)", transition: "transform 0.2s" }}>
                        <Link as ={RouterLink} to="/memory" _hover={{ textDecoration: "none", color: "pink.500" }}>
                        <GiMagickTrick size={50} />
                        </Link>
                        <Text fontSize="lg">Memory Game </Text>
                    </Flex>
                    </Box>


    </Flex>

    <Flex justifyContent="center" alignItems="center" mt={55} flexDirection={"column"} gap={10}> 
      <Text >More Multiplayer Games Coming Soon...</Text>
    <LiaGamepadSolid size={50}  />

    </Flex>

    </>
  )
}

export default GamePage