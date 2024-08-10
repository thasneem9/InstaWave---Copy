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
import authScreenAtom from '../atoms/AuthAtom.js'
import userAtom from '../atoms/userAtom.js'

import { useToast } from '@chakra-ui/react'

export default function SignupCard() {




  const [showPassword, setShowPassword] = useState(false)
  const setAuthScreen =useSetRecoilState(authScreenAtom)
    //usesattes for signingup
  const[inputs,setInputs]=useState({
    name:"",
    username:"",
    email:"",
    password:""})
const toast=useToast();
//clearing the user state
const setUser=useSetRecoilState(userAtom)

  async function handleSignup(){//no req,res here <----
    /* console.log(inputs) to se if it works, the submitto backend:*/
    try {
      //to send a fetch request we ned to add proxy in viteconfig or else we get a cors errror
      //target is already defined invite config, we just need to pas the api...make sure to match the api set up inthe backen, for ref see yourpostman!--or backend userRoute.js
    const res=await fetch("/api/users/signup",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
        body:JSON.stringify(inputs),
      });
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
      //set user if he exits, tolocalstorage: u can checkin inspect>application>loclstorage
      localStorage.setItem("user-instawave",JSON.stringify(data))
      setUser(data);
      
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
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Flex mt={1}>
          
          <Text fontSize={'lg'} color={'gray.600'} textAlign={"center"}>
          Create an account to start exploring
          </Text>
       </Flex>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl  isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input type="text"
                  onChange={(e)=>setInputs({...inputs,name:e.target.value})} 
                  value={inputs.name}/>
                </FormControl>
              </Box>
              <Box>
                <FormControl  isRequired >
                  <FormLabel>username</FormLabel>
                  <Input type="text" 
                  onChange={(e)=>setInputs({...inputs,username:e.target.value})} 
                  value={inputs.username}/>
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" 
              onChange={(e)=>setInputs({...inputs,email:e.target.value})} 
                  value={inputs.email}/>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'}
                onChange={(e)=>setInputs({...inputs,password:e.target.value})} 
                value={inputs.password} />
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
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={handleSignup}>
                Sign up
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? {""}<Link color={'blue.400'}
                onClick={()=>setAuthScreen("login")}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}