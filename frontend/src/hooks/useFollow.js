import React from 'react'
import useShowToast from './useShowToast'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom.js'
import { useState } from 'react'



const useFollow = (user ) => {
    const currentUser=useRecoilValue(userAtom)
    const [following,setFollowing]=useState(user?.followers?.includes(currentUser?._id))
    const [updating,setUpdating]=useState(false)
    const showToast=useShowToast();
 

    const handleFollow = async () => {
        if (!currentUser) {
            showToast("Error", "You must login to follow", "error");
            return;
        }
    
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
    
            // Clone the user object to avoid mutating the original
            const updatedUser = { ...user };
    
            if (following) {
                showToast("success", "Disconnected", "success");
                // Remove currentUser._id from followers array
                updatedUser.followers = updatedUser?.followers?.filter(
                    (followerId) => followerId !== currentUser?._id
                );
            } else {
                showToast("success", "Connected", "success");
                // Add currentUser._id to followers array
                updatedUser?.followers?.push(currentUser._id);
            }
    
            // Update the state with the modified user object
            setFollowing(!following);
            
    
            console.log(data);
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }
    };
    


  return  {handleFollow,updating,following}
  
}

export default useFollow