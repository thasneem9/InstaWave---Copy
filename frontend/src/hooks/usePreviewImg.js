
import {useState} from 'react'
import { useToast } from '@chakra-ui/react'


const usePreviewImg = () => {
    const [imgUrl,setImgUrl]=useState(null);
    const toast=useToast();

    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        console.log(file)//includes details like size, file type etc
        if(file && file.type.startsWith("image/")){
            const reader=new FileReader();

            reader.onloadend=()=>{
                setImgUrl(reader.result);
            }
            reader.readAsDataURL(file)
            //its gona turn it into base64 string we can get the string now nd render it into our react app
            //ifits not an image then:
        }else{
            toast({
                title:"Invalid file type",
                description:"Please select an image file",
                status:"error",
                duration:3000,
                isclosable:true
            });
            setImgUrl(null);
        }

    }
    /* console.log(imgUrl) *///ucansee a hell long string like AFYgtyhAGYGJ..=>base64string

      return {handleImageChange,imgUrl,setImgUrl}
}

export default usePreviewImg