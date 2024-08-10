import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";

import { useEffect } from "react";

import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {

	const toast = useToast();
	const currentUser = useRecoilValue(userAtom); // logged in user
    const [following, setFollowing] = useState(false);
    const showToast=useShowToast();
    const [updating,setUpdating]=useState(false)///this is for shoing a spinner loading thing
	useEffect(() => {
		if (user && currentUser) {
			console.log("user.followers:", user.followers);
			console.log("currentUser.id:", currentUser._id);

			const isFollowing = user.followers.includes(currentUser?._id?.toString());
			setFollowing(isFollowing);
		}
	}, [user, currentUser]);

	console.log(following);
	
	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};
    console.log("Current User:", currentUser);
console.log("User:", user);


const handleFollow=async()=>{
    if(!currentUser){
        showToast("Error","Youmust Login to follow","error");
        return;
    }
    setUpdating(true);
    try {
        const res=await fetch(`/api/users/follow/${user.id}`,{
            method:"POST",
            headers:{
                "Content-Type":"Application/json",
            }
        })
        const data=await res.json()
        if(data.error){
            showToast("Error",data.error,"error")
            return;
        }
        if(following){
            showToast("success",`Disconnected with ${user.name}`,"success");
            user.followers.pop()//decremnts length
        }else{
            showToast("success",`Connected with ${user.name}`,"success");
            user.followers.push(currentUser._id)//thiswil only update inthe cLIENT SIDE!!
        }
        setFollowing(!following);

        console.log(data);
        
    } catch (error) {
        showToast("Error",error,"error")
        
    }finally{
        setUpdating(false);//for this to be complet eu nee dto set isloading={updating}insie the button..imno  doing it cz mine is toofastlOl
    }
}

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>{user.username}</Text>
						<Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
							Instawave
						</Text>
					</Flex>
				</Box>
				<Box>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src='https://bit.ly/broken-link'
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>

			<Text>{user.bio}</Text>
            

			{currentUser?._id === user.id && (   /* basicaly if u are the loged user */
				<Link as={RouterLink} to='/update'>
					<Button size={"lg"}>Update Profile</Button>
				</Link>
			)}




                {currentUser?._id !== user.id && (
				<Button size={"sm"} onClick={handleFollow} >
					{following ? "Disconnect" : "Connect"}
				</Button>
			)}

		
			<Flex w={"full"} justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>{user.followers.length} followers</Text>
					<Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box>
					<Link color={"gray.light"}>instagram.com</Link>
				</Flex>
				<Flex>
					<Box className='icon-container'>
						<BsInstagram size={24} cursor={"pointer"} />
					</Box>
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			<Flex w={"full"}>
				<Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
					<Text fontWeight={"bold"}> Posts</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={"1px solid gray"}
					justifyContent={"center"}
					color={"gray.light"}
					pb='3'
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}> Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
