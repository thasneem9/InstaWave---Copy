

import React from 'react'
import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react';
//every time u need to use a toast just yuse thishook
const useShowToast = () => {
    const toast=useToast();

    const showToast=useCallback(
    (title,description,status)=>{
        toast({
            title,
            description,
            status,
            duration:3000,
            isClosable:true,
    });
  },
  [toast]
);
  return showToast;
  };
export default useShowToast;