import { createServer }  from 'http'
import {Server} from 'socket.io';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: "http://localhost:3000",
});//-------------------------------1 set up Soxket server allow..RLTC...bw clients conected form :3000 and sevrer

const allUsers = {};                       //n object that stores  socketid+ online status
const allRooms = [];                        //-----------------------2. ROOMS,USERS:      activegame rooms

io.on("connection", (socket) => {             //    The socket object in Socket.IO contains various properties and methods that allow you to interact with the connection. Here are some key properties and methods:             //---------3.LISTEN FOR NEW (SOCKET) CONETIONS...stoee user detil id,online
  allUsers[socket.id] = {                             //3A update the emptyobject
    socket: socket,
    online: true,
    playing:false,
  };
  
  socket.on("request_to_play", (data) => {                                           //3B  LISTEN FOR REQTOPLAY EVENTTTT!!!! curnetuser update fom socket ...whch is..
    const currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;
    let opponentPlayer;              
    for (const key in allUsers) {                                              //The for loop searches for an available opponent. If found, opponentPlayer is set to the matched user.
      const user = allUsers[key];
      if (user.online && !user.playing && socket.id !== key) {
        opponentPlayer = user;
        break;
      }
    }
    if (opponentPlayer) {
      allRooms.push({
        player1: opponentPlayer,
        player2: currentUser,
      });

      currentUser.socket.emit("OpponentFound", {
        opponentName: opponentPlayer.playerName,
        playingAs: "circle",
      });
      //If an opponent is found, a new game room is created and both players are notified.

      opponentPlayer.socket.emit("OpponentFound", {
        opponentName: currentUser.playerName,
        playingAs: "cross",
      });

      currentUser.socket.on("playerMoveFromClient", (data) => {
        opponentPlayer.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });

      opponentPlayer.socket.on("playerMoveFromClient", (data) => {
        currentUser.socket.emit("playerMoveFromServer", {
          ...data,
        });
      });
    } else {
      currentUser.socket.emit("OpponentNotFound");
    }
  });

  socket.on("disconnect", function () {
    const currentUser = allUsers[socket.id];
    currentUser.online = false;
    currentUser.playing = false;

    for (let index = 0; index < allRooms.length; index++) {
      const { player1, player2 } = allRooms[index];

      if (player1.socket.id === socket.id) {
        player2.socket.emit("opponentLeftMatch"); //he loop iterates through all active rooms to notify the opponent that their opponent has left the match if they were part of a game room.
        break;
      }

      if (player2.socket.id === socket.id) {
        player1.socket.emit("opponentLeftMatch");
        break;
      }
    }
  });
});

httpServer.listen(4000, () => {
    console.log("Game socket server listening on port 4000");
  });