import React from 'react';
import GameBoard from './components/GameBoard';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-4">
      <GameProvider>
        <GameBoard />
      </GameProvider>
    </div>
  );
}

export default App;