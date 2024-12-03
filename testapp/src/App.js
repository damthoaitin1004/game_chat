import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import OnlinePlayers from './components/OnlinePlayers';
import GameRoom from './components/GameRoom';
import ChessGame from './components/GameRoomChess';
// import Login from './components/Login';
// import Register from './Register';
// import OnlinePlayers from './OnlinePlayers';
// import GameRoom from './components/GameRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/online-players" element={<OnlinePlayers />} />
        <Route path="/game-room/:roomId" element={<GameRoom />} />
        <Route path="/game-room-chess/" element={<ChessGame/>} />

      </Routes>
    </Router>
  );
}

export default App;
