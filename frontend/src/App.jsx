
import { Container } from "@chakra-ui/react"
import {Route, Routes} from 'react-router-dom';


import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage"
import Header from "./components/Header"

import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom.js";

import { Navigate } from "react-router-dom";

import LogoutButton from "./components/LogoutButton.jsx";

import UpdateProfilePage from "./pages/UpdateProfilePage.jsx";

import CreatePost from "./components/CreatePost.jsx";

import ChatPage from "./pages/ChatPage.jsx";

import { Box } from '@chakra-ui/react'
import { useLocation } from "react-router-dom";
import SavedPage from "./pages/SavedPage.jsx";
import GamePage from "./pages/GamePage.jsx";
import TicTacToe from "./components/tictactoe.jsx";
import Memory from "./components/Memory.jsx";

/* import TicTacToePage from "./pages/TicTacToePage.jsx"; */




function App() {
//see if wehave userornot: in the route, if yes go to homepage, if nouser go to authpage
const user=useRecoilValue(userAtom)//ouruseratomcontains the object storedinlocalstorage wen we isgnedup
console.log(user)//soif user exits, theevenif we go to /auth its gona navigate ustohomepage
const {pathname}=useLocation()
  return (
    <Box position={"relative"} w={"full"}>

  
    <Container maxW={pathname==="/"?"900px":"620px"}>      {/* this is the reason why u see evrything (posts..users,)isde a long rectangle */}
      <Header></Header>
      <Routes>
        
        <Route path='/' element={user?<HomePage/>:<Navigate to="/auth"/>}/>
        <Route path='/auth' element={!user?<AuthPage/>:<Navigate to="/"/>}/>
        <Route path='/update' element={user?<UpdateProfilePage/>:<Navigate to="/auth"/>}/>

    <Route path="/:username" element={<UserPage/>}/> 
    <Route path="/:username/post/:pid" element={<PostPage/>}/> 
    <Route path="/chat" element={user? <ChatPage/>:<Navigate to={"/auth"} />}/> 
    <Route path="/saved" element={<SavedPage/>}/> 
    <Route path="/game" element={<GamePage/>}/> 
     <Route path="/tictactoe" element={<TicTacToe/>}/> 
     <Route path="/memory" element={<Memory/>}/> 
     
   
    
   
      </Routes>
{/* if u have a user showthe logout button, cretpost\: */}
    {/*   {user && <LogoutButton/>} */}
     {user && <CreatePost/>} 
     
   

    </Container>
    </Box>
  )
}

export default App
