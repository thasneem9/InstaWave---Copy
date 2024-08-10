import  React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import {useParams} from 'react-router-dom'
import useShowToast from './useShowToast'


const useGetUserProfile = () => {
    const [user,setUser]=useState(null)
    const {username} =useParams()
    const showToast=useShowToast()

    useEffect(()=>{
        const getUser=async()=>{
          try {
            const res= await fetch(`/api/users/profile/${username}`)
            const data=await res.json()
            console.log(data)
    
            if(data.error){
              showToast("Error",data.error,"error");
              return;
            }
            setUser(data);
            
            
          } catch (error) {
            console.log(error)
            showToast("Error",error.message,"error");
            
          }
        };
        getUser()
        console.log({user},"my userrrrr")
    
      },[username])
      return {user}
}


export default useGetUserProfile