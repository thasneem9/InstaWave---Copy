
import { Button } from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import useShowToast from '../hooks/useShowToast.js';


import {FiLogOut} from "react-icons/fi";

export default function LogoutButton(){


    const setUser=useSetRecoilState(userAtom);
    const showToast=useShowToast();


    const handleLogout=async()=>{
        try {
          
            const res= await fetch("/api/users/logout",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
            })
            const data=await res.json();
            console.log(data);
            if(data.error){
                showToast("Error",data.error,"error")
                //showthetoastand then return out of the error:
                return;
            }    
            localStorage.removeItem("user-instawave");  //clear localstorage 
            setUser(null)//clear the state
        } catch(error) {
            showToast("Error",error,"error")
        }
    }
  return (
    
    <Button
     position={"fixed"} 
    top={"30px"}
    right={"30px"}
    size={'sm'} 
        onClick={handleLogout}
    ><FiLogOut size={20}/>
    
    </Button>
  )
}

