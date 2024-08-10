import React, { useState, useEffect } from "react";
import "../tictactoe.css";
import Square from "./Sqaure.jsx";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

const renderFrom = [ 
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const TicTacToe = () => {
  const [gameState, setGameState] = useState(renderFrom); // holds the current state of the game board.
  const [currentPlayer, setCurrentPlayer] = useState("circle");//  current player (circle or cross).

  const [finishedState, setFinishetState] = useState(false);
  const [finishedArrayState, setFinishedArrayState] = useState([]);//holds the winning combination

  const [playOnline, setPlayOnline] = useState(false);//whether the player is playing online.
  const [socket, setSocket] = useState(null);//??????????holds the socket instance.

  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);

  const [playingAs, setPlayingAs] = useState(null);//???duplicate????player's symbol (circle or cross).

  //WING COMBINATIONS?>FINISHEd ARRAY STATE
  const checkWinner = () => {
    // row dynamic
    for (let row = 0; row < gameState.length; row++) {                //Loops through each row of the board.
      if (
        gameState[row][0] === gameState[row][1] && 
        gameState[row][1] === gameState[row][2]                          //if all 3 box in a row x is same? x iterates...
      ) {
        setFinishedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);            //if winer finishes using second row ...3,4,5.. 1*3+1..
        return gameState[row][0];
      }
    }

    // column dynamic
    for (let col = 0; col < gameState.length; col++) {
      if (
        gameState[0][col] === gameState[1][col] &&
        gameState[1][col] === gameState[2][col]
      ) {
        setFinishedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameState[0][col];
      }
    }
    //checking DIAGONALY>>>

    if (
      gameState[0][0] === gameState[1][1] &&
      gameState[1][1] === gameState[2][2]
    ) {
      return gameState[0][0];
    }

    if (
      gameState[0][2] === gameState[1][1] &&
      gameState[1][1] === gameState[2][0]
    ) {
      return gameState[0][2];
    }
//.flat()  onverts the 2D array gameState into a 1D array. //check if evrything is NOT EMPTY that is either cros/circle
    const isDrawMatch = gameState.flat().every((e) => {
      if (e === "circle" || e === "cross") return true;
    });

    if (isDrawMatch) return "draw";

    return null;
  };

  useEffect(() => {// runs whenever gameState changes.
    const winner = checkWinner();
    if (winner) {
      setFinishetState(winner);
    }
  }, [gameState]);

  
  const takePlayerName = async () => {
    const result = await Swal.fire({ //SweetAlert2 to prompt name
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    return result;
  };

  socket?.on("opponentLeftMatch", () => {
    setFinishetState("opponentLeftMatch");
  });

  socket?.on("playerMoveFromServer", (data) => {
    const id = data.state.id;

    setGameState((prevState) => {
      let newState = [...prevState];
      const rowIndex = Math.floor(id / 3); //id: This is the unique identifier for each square in the grid, typically ranging from 0 to 8 for a 3x3 grid.
      const colIndex = id % 3;
      newState[rowIndex][colIndex] = data.state.sign;
      return newState;
    });


    setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");


  });

  socket?.on("connect", function () {
    setPlayOnline(true);
  });

  socket?.on("OpponentNotFound", function () {
    setOpponentName(false);
  });

  socket?.on("OpponentFound", function (data) {
    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
  });




  
////////////////////////////////////////////
  async function playOnlineClick() {
    const result = await takePlayerName();

    if (!result.isConfirmed) {
      return;
    }
    const username = result.value;
    setPlayerName(username);
    const newSocket = io("http://localhost:4000", {
      autoConnect: true,
    });
    newSocket?.emit("request_to_play", {
      playerName: username,
    });
    setSocket(newSocket);
  }

  
  if (!playOnline) {
    return (
      <div className="main-div">
        <button onClick={playOnlineClick} className="playOnline">
          Play Online
        </button>
      </div>
    );
  }

  if (playOnline && !opponentName) {
    return (
      <div className="waiting">
        <p>Waiting for opponent . . .</p>
      </div>
    );
  }

  return (
    <div className="main-div">
      <div className="move-detection">
        <div
          className={`left ${
            currentPlayer === playingAs ? "current-move-" + currentPlayer : ""
          }`}
        >
          {playerName}
        </div>
        <div
          className={`right ${
            currentPlayer !== playingAs ? "current-move-" + currentPlayer : ""
          }`}
        >
          {opponentName}
        </div>
      </div>
      <div>
        <h1 className="game-heading water-background">Tic Tac Toe</h1>
        <div className="square-wrapper">
          {gameState.map((arr, rowIndex) =>
            arr.map((e, colIndex) => {
              return (
                <Square
                  socket={socket}
                  playingAs={playingAs}
                  gameState={gameState}
                  finishedArrayState={finishedArrayState}
                  finishedState={finishedState}
                  currentPlayer={currentPlayer}
                  setCurrentPlayer={setCurrentPlayer}
                  setGameState={setGameState}
                  id={rowIndex * 3 + colIndex}
                  key={rowIndex * 3 + colIndex}
                  currentElement={e}
                />
              );
            })
          )}
        </div>
        {finishedState &&
          finishedState !== "opponentLeftMatch" &&
          finishedState !== "draw" && (
            <h3 className="finished-state">
              {finishedState === playingAs ? "You " : finishedState} won the
              game
            </h3>
          )}
        {finishedState &&
          finishedState !== "opponentLeftMatch" &&
          finishedState === "draw" && (
            <h3 className="finished-state">It's a Draw</h3>
          )}
      </div>
      {!finishedState && opponentName && (
        <h2 style={{"margin-top":"10px"}}>You are playing against {opponentName}</h2>
      )}
      {finishedState && finishedState === "opponentLeftMatch" && (
        <h2>You won the match, Opponent has left</h2>
      )}
    </div>
  );
};

export default TicTacToe;
