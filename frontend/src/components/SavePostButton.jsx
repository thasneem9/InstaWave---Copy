




import React, { useEffect, useState } from 'react';
import { Button } from '@chakra-ui/react';
import useSavePost from '../hooks/useSavePost';
import { IoBookmarkOutline } from "react-icons/io5";
import { MdBookmarkAdd } from "react-icons/md";

const SavePostButton = ({ post }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    
  

    useEffect(() => {
        const checkBookmarkStatus = async () => {
            try {
                const res = await fetch(`/api/posts/check-bookmark/${post.id}`);
                const data = await res.json();
                setIsBookmarked(data.bookmarked);
            } catch (error) {
                console.error("Error checking bookmark status:", error);
            }
        };

        checkBookmarkStatus();
    }, [post.id]);

    const onSaveSuccess = () => {
        setIsBookmarked(true);
    };
    const { handleSave, saving } = useSavePost(post, onSaveSuccess);

    if (isBookmarked) {
        return null;
    }

    return (
        <MdBookmarkAdd size={20} onClick={handleSave} isLoading={saving} />
    );
};

export default SavePostButton;



