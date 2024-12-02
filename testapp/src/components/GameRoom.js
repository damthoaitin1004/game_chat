import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { ref, onValue, set, push, remove } from 'firebase/database';
import { useParams, useNavigate } from 'react-router-dom';
import decodeJWT from './Jwt';
import './GameRoom.css';
function GameRoom() {
  const { roomId } = useParams(); // Extract roomId from URL
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]); // Chat messages
  const [newMessage, setNewMessage] = useState(''); // Input field for new message
  const [userInfo, setUserInfo] = useState(null); // User information
  const [board, setBoard] = useState(Array(9).fill(null)); // Tic Tac Toe board
  const [isXNext, setIsXNext] = useState(true); // Turn indicator
  const [winner, setWinner] = useState(null); // Winner indicator

  // Decode user info on mount
  useEffect(() => {
    const decoded = decodeJWT(); // Assuming decodeJWT is imported from your utility file
    if (decoded) {
      setUserInfo(decoded);
    }
  }, []);

  // Listen to chat messages in the game room
  useEffect(() => {
    if (roomId) {
      const messagesRef = ref(db, `gameRooms/${roomId}/messages`);

      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setMessages(Object.values(data));
        } else {
          setMessages([]);
        }
      });

      return () => unsubscribe();
    }
  }, [roomId]);

  // Listen to game board updates
  useEffect(() => {
    if (roomId) {
      const boardRef = ref(db, `gameRooms/${roomId}/board`);
      const unsubscribe = onValue(boardRef, (snapshot) => {
        const data = snapshot.val();
        console.log("Dữ liệu từ Firebase:", data); // Debug log

        if (data && Array.isArray(data.board)) {
          const updatedBoard = Array(9).fill(null);
          data.board.forEach((cell, index) => {
            if (index < 9) {
              updatedBoard[index] = cell; // Copy values from data.board
            }
          });
           // Create a new board with 9 cells
          // const updatedBoard = data.board.map(cell => (cell === "null" ? null : cell));
          setBoard(updatedBoard);
          setIsXNext(data.isXNext);
          setWinner(data.winner);
          console.log(board);
          
        } else {
          setBoard(Array(9).fill(null));
          setIsXNext(true);
          setWinner(null);
        }
      });

      return () => unsubscribe();
    }
  }, [roomId]);


  // Handle sending a new message
  const sendMessage = () => {
    if (!newMessage.trim()) return; // Prevent empty messages
    if (!roomId || !userInfo) return;

    const messagesRef = ref(db, `gameRooms/${roomId}/messages`);

    // Add the new message to the Firebase database
    push(messagesRef, {
      userId: userInfo.user_id,
      email: userInfo.email,
      content: newMessage,
      timestamp: Date.now(),
    });

    setNewMessage(''); // Clear input field
  };

  // Handle a player's move
  const handleMove = (index) => {
   

    if (board[index] || winner || !roomId || !userInfo) return; // Ignore invalid moves
console.log(roomId.split('_')[1]);

    const isPlayerX = userInfo.user_id === roomId.split('_')[0];
    const isPlayerO = userInfo.user_id === roomId.split('_')[1];
    console.log(isXNext && !isPlayerX);
    console.log(!isPlayerO && !isXNext);
    console.log(board);

    if ((isXNext && !isPlayerX) || (!isXNext && !isPlayerO)) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    const newIsXNext = !isXNext;
    const newWinner = calculateWinner(newBoard);
    // const updatedBoard = newBoard.map(cell => (cell === null ? "null" : cell));

    console.log(newBoard);
    

    // Update Firebase with the new board state
    set(ref(db, `gameRooms/${roomId}/board`), {
      board: newBoard,
      isXNext: newIsXNext,
      winner: newWinner,
    });
  };


  // Calculate winner
  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6],           // Diagonals
    ];

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  };

  // Handle resetting the game
  const handleResetGame = () => {
    if (!roomId) return;

    // Reset the board in Firebase
    set(ref(db, `gameRooms/${roomId}/board`), {
      board: Array(9).fill(null),
      isXNext: true,
      winner: null,
    });
  };

  // Handle exiting the room
  const handleExitRoom = () => {
    if (!roomId || !userInfo) return;

    // Remove the user from the room
    const userKey = userInfo.user_id;
    const roomRef = ref(db, `gameRooms/${roomId}`);

    remove(ref(db, `gameRooms/${roomId}/users/${userKey}`)).then(() => {
      // Check if the room is empty
      onValue(roomRef, (snapshot) => {
        const roomData = snapshot.val();
        if (!roomData || !roomData.users) {
          remove(roomRef); // Delete the room if empty
        }
      }, { onlyOnce: true });

      navigate('/'); // Navigate the user out of the room
    });
  };

  return (
    <div>
      <h2>Game Room: {roomId}</h2>

      {/* Exit room button */}
      <button onClick={handleExitRoom} style={{ marginBottom: '10px', color: 'red' }}>
        Exit Room
      </button>

      {/* Reset game button */}
      <button onClick={handleResetGame} style={{ marginBottom: '10px', color: 'blue' }}>
        Reset Game
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)', gap: '5px' }}>
        {board.map((cell, index) => (
          <div
            key={index}
            onClick={() => handleMove(index)}
            style={{
              width: '100px',
              height: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid black',
              fontSize: '24px',
            }}
          >
           {cell}
    </div>
        ))}
      </div>


      {winner ? <h3>Winner: {winner}</h3> : <h3>Next turn: {isXNext ? 'X' : 'O'}</h3>}

      {/* Chat box */}
      <div style={{ border: '1px solid #ccc', padding: '10px', maxHeight: '300px', overflowY: 'scroll', marginTop: '20px' }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              textAlign: message.userId === userInfo?.user_id ? 'right' : 'left',
            }}
          >
            <p>
              <strong>{message.email}</strong>: {message.content}
            </p>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: '80%', marginRight: '10px' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default GameRoom;
