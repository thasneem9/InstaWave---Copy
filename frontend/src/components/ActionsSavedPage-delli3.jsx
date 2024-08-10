import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { Text } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom.js';
import useShowToast from "../hooks/useShowToast";
import { useEffect } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react';
import { Button } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import postsAtom from "../atoms/PostsAtom.js";
import SavePostButton from "./SavePostButton.jsx";

export default function ActionsSavedPage({ post }) {
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const [liked, setLiked] = useState(post?.likes?.includes(user?._id)); 
    const [likesCount, setLikesCount] = useState(post?.likes?.length);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [reply, setReply] = useState("");
    const [posts, setPosts] = useRecoilState(postsAtom);

    useEffect(() => {
        setLiked(post?.likes?.includes(user?._id));
        setLikesCount(post?.likes?.length);
    }, [post, user]);

    function handleClick(e) {
        e.preventDefault();
    }

    const handleLike = async () => {
        if (!user) return showToast('error', 'You must be logged in to like a post', 'error');
        try {
            const res = await fetch('/api/posts/like/' + post.id, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
            });
            const data = await res.json();
            if (data.error) return showToast('error', data.error, 'error');

            if (!liked) {
                const updatedPosts = posts.map((p) => {
                    if (p.id === post.id) {
                        return { ...p, likes: [...p.likes, user._id] };
                    }
                    return p;
                });
                setPosts(updatedPosts);
                setLikesCount(likesCount + 1); // Update likesCount
            } else {
                const updatedPosts = posts.map((p) => {
                    if (p.id === post.id) {
                        return { ...p, likes: p.likes.filter((id) => id !== user._id) };
                    }
                    return p;
                });
                setPosts(updatedPosts);
                setLikesCount(likesCount - 1); // Update likesCount
            }
            setLiked(!liked);
        } catch (error) {
            showToast('error', error.message, 'error');
        }
    };

    const handleReply = async () => {
        if (!user) return showToast('error', 'You must be logged in to reply to a post', 'error');
        try {
            const res = await fetch("/api/posts/reply/" + post.id, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({ text: reply })
            });
            const data = await res.json();
            if (data.error) return showToast('error', data.error, 'error');

            const updatedPosts = posts.map((p) => {
                if (p.id === post.id) {
                    return { ...p, replies: [...p.replies, data] };
                }
                return p;
            });
            setPosts(updatedPosts);

            showToast("success", "Replied to post", "success");
            onClose();
            setReply("");
        } catch (error) {
            showToast('error', error.message, 'error');
        }
    };

    return (
        <Flex gap={3} my={2} onClick={handleClick}>
            <svg
                aria-label='Like'
                color={liked ? "rgb(237, 73, 86)" : ""}
                fill={liked ? "rgb(237, 73, 86)" : "transparent"} // Ensure it's pink in light mode
                height='19'
                role='img'
                viewBox='0 0 24 22'
                width='20'
                onClick={handleLike}
            >
                <path
                    d='M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z'
                    stroke='currentColor'
                    strokeWidth='2'
                ></path>
            </svg>
            <svg
                aria-label='Comment'
                color=''
                fill=''
                height='20'
                role='img'
                viewBox='0 0 24 24'
                width='20'
                onClick={onOpen}
            >
                <title>Comment</title>
                <path
                    d='M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z'
                    fill='none'
                    stroke='currentColor'
                    strokeLinejoin='round'
                    strokeWidth='2'
                ></path>
            </svg>
            <SavePostButton post={post} />
            <Flex gap={2} alignItems={"center"} >
                <Text color={"gray.light"} fontSize={"sm"}>{post?.replies?.length} replies</Text>
                <Box w={0.5} h={0.5} borderRadius="full" bg="gray.light"></Box>
                <Text color={"gray.light"} fontSize={"sm"}>{likesCount} likes</Text>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader />
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Input
                                placeholder='Reply goes here...'
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' size={'sm'} mr={3} onClick={handleReply}>
                            Reply
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}
