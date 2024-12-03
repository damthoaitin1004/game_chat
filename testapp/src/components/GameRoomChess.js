// import React, { useState } from 'react';
// import './ChessGame.css'; // Import file CSS cho giao diện

// const initialBoard = [
//   ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
//   ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
//   ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
// ];

// const pieceSymbols = {
//   R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙',
//   r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟'
// };

// const ChessGame = () => {
//   const [board, setBoard] = useState(initialBoard);
//   const [selectedPiece, setSelectedPiece] = useState(null);
//   const [turn, setTurn] = useState('white');

//   const handleCellClick = (row, col) => {
//     if (selectedPiece) {
//       const newBoard = [...board];
//       newBoard[selectedPiece.row][selectedPiece.col] = null;
//       newBoard[row][col] = selectedPiece.piece;
//       setBoard(newBoard);
//       setSelectedPiece(null);
//       setTurn(turn === 'white' ? 'black' : 'white');
//     } else if (board[row][col] && ((turn === 'white' && board[row][col] === board[row][col].toUpperCase()) || (turn === 'black' && board[row][col] === board[row][col].toLowerCase()))) {
//       setSelectedPiece({ row, col, piece: board[row][col] });
//     }
//   };
// //   Rời phòng
//   const handleExitRoom = () => {
//     if (!roomId || !userInfo) return;

//     // Remove the user from the room
//     const userKey = userInfo.user_id;
//     const roomRef = ref(db, `gameRooms/${roomId}`);

//     remove(ref(db, `gameRooms/${roomId}/users/${userKey}`)).then(() => {
//       // Check if the room is empty
//       onValue(roomRef, (snapshot) => {
//         const roomData = snapshot.val();
//         if (!roomData || !roomData.users) {
//           remove(roomRef); // Delete the room if empty
//         }
//       }, { onlyOnce: true });

//       navigate('/online-players'); // Navigate the user out of the room
//     });
//   };
// //   ?chat
//   const sendMessage = () => {
//     if (!newMessage.trim()) return; // Prevent empty messages
//     if (!roomId || !userInfo) return;

//     const messagesRef = ref(db, `gameRooms/${roomId}/messages`);

//     // Add the new message to the Firebase database
//     push(messagesRef, {
//       userId: userInfo.user_id,
//       email: userInfo.email,
//       content: newMessage,
//       timestamp: Date.now(),
//     });

//     setNewMessage(''); // Clear input field
//   };
//   return (
//     <div className="chess-container">
//       <h1>{`Turn: ${turn}`}</h1>
//       <div className="board">
//         {board.map((row, rowIndex) => (
//           <div key={rowIndex} className="board-row">
//             {row.map((cell, colIndex) => (
//               <div
//                 key={colIndex}
//                 className={`board-cell ${(rowIndex + colIndex) % 2 === 0 ? 'white-cell' : 'black-cell'} ${selectedPiece && selectedPiece.row === rowIndex && selectedPiece.col === colIndex ? 'selected' : ''}`}
//                 onClick={() => handleCellClick(rowIndex, colIndex)}
//               >
//                 {cell ? pieceSymbols[cell] : ''}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ChessGame;
