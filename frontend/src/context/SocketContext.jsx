// context/SocketContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { io } from 'socket.io-client';
import userAtom from '../atoms/userAtom';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useRecoilValue(userAtom);
  const [onlineUsers,setOnlineUsers]=useState([])

  useEffect(() => {
                                                                                 //WARNING----??!! IN HIS CODE ITIS CONSTS OCKET ,...MINE IT IS NEW SOCKET!!!!!
    const newSocket = io("http://localhost:5000", {
      query: {
        userId: user?._id
      }
    });
    newSocket.on("getOnlineUsers",(users)=>{
        setOnlineUsers(users);

    })

    setSocket(newSocket);

 
  
    return () => {
        if (newSocket) {
          newSocket.close();
        }
      };
    }, [user?._id]);
  console.log(onlineUsers,"Online users")



  

  return (
    <SocketContext.Provider value={{ socket,onlineUsers}}>
      {children}
    </SocketContext.Provider>
  );
};
