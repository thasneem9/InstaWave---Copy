import { Flex,Image,useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import {AiFillHome} from "react-icons/ai"
import {RxAvatar} from "react-icons/rx"

import { Link } from "@chakra-ui/react"
import {Link as RouterLink} from 'react-router-dom'

import { FiMessageSquare } from "react-icons/fi";

import useLogout from "../hooks/useLogout";
import { Button } from "@chakra-ui/react";
import {FiLogOut} from "react-icons/fi"
import { PiBookmarksLight } from "react-icons/pi";
import { IoGameControllerOutline } from "react-icons/io5";





export default function Header(){
    const {colorMode, toggleColorMode}=useColorMode()
    const user=useRecoilValue(userAtom)
    const logout = useLogout();
    return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
{/* HOMEPAGE */}
        {user &&(
            <Link as ={RouterLink} to="/">
            <AiFillHome size={24}/>
            </Link>
        )}
        <Image 
        cursor={"pointer"}
        alt="logo"
        w={20}
        src={"/image.png"}
        onClick={toggleColorMode}
        />
{/* Userpage  and chat*/}
        
{user &&(
    <Flex gap={4}>
           {/*  <PiBookmarksLight size={24}  /> */}

           <Link as={RouterLink} to='/game'>
           <IoGameControllerOutline size={24}/>
           </Link>


           <Link as={RouterLink} to='/saved'>
					<PiBookmarksLight size={"24"}>Saved </PiBookmarksLight>
			</Link>
         

            <Link as ={RouterLink} to={`/${user.username}`}>
            <RxAvatar size={24}/>
            </Link>

            <Link as ={RouterLink} to={`/chat`}>
            <FiMessageSquare  size={24}/>
            </Link>

            <Button size={"xs"} onClick={logout}>
						<FiLogOut size={20} />
			</Button>

            
        

    </Flex>
            
        )}
    </Flex>
    )

}