'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

import { useSetRecoilState } from 'recoil'



import { useToast } from '@chakra-ui/react'

import userAtom from '../atoms/userAtom.js'
import authScreenAtom from '../atoms/AuthAtom.js';

export default function loginCard() {
  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreen=useSetRecoilState(authScreenAtom)

  const setUser=useSetRecoilState(userAtom)

  const [inputs,setInputs]=useState({
    username:"",
    password:"",



  })

  const toast=useToast();
  const handleLogin =async()=>{
    try {
      const res= await fetch("api/users/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(inputs),

      })
      const data=await res.json();
      console.log(data)

      if(data.error){
        //updated mesages to errors in backend usercontroller
        //or use the suseshowtoast hook like in logoutbutton
        toast({
          title:"Error",
          description:data.error,
          status:"error",
          duration:3000,
          isclosable:true
      });
      return
      }
      console.log(data);//thedaat is returned form our usercontrioler

      localStorage.setItem("user-instawave",JSON.stringify(data))
      setUser(data);//since user will exist, its gona navigate us to the '/'
    } catch (error) {
      toast({
        title:"Error",
        description:data.error,
        status:"error",
        duration:3000,
        isclosable:true
    });

      
    }
  
  }

  return (
    <Flex
  /*     minH={'100vh'} */
      align={'center'}
      justify={'center'}
       bg={useColorModeValue('gray.50', 'gray.800')} >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
           Login
          </Heading>
          <Flex mt={1}>
          
          <Text fontSize={'lg'} color={'gray.600'} textAlign={"center"}>
         Sign in to your account to start exploring
          </Text>
       </Flex>
        </Stack>
        <Box
    rounded={'lg'}
 /*    bg={useColorModeValue('white', 'gray.700')} */
    boxShadow={'lg'}
    p={0}
    h={'auto'}  // Adjust the height as needed
>
          <Stack spacing={4}>
          
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input type="text"
              value={inputs.username}
              onChange={(e)=>setInputs((inputs)=>({...inputs,username:e.target.value}))} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} 
                  value={inputs.password}
                onChange={(e)=>setInputs((inputs)=>({...inputs,password:e.target.value}))}/>
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={'blue.600'}
                color={'white'}
                _hover={{
                  bg: 'blue.400',
                }}
                onClick={handleLogin}>
             Login
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don't have an account? <Link color={'blue.400'}
                onClick={()=>setAuthScreen("signup")}>
                  Signup</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}