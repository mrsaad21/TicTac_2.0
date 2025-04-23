import React from 'react';
import { useGame } from '../context/GameContext';

const GameStatus: React.FC = () => {
  const { currentPlayer, winner, turnCount } = useGame();

  return (
    <div className="text-center mb-4">
      <div className="bg-white/10 p-3 rounded-lg shadow-inner">
        {winner ? (
          <div className="text-xl font-semibold animate-pulse">
            {winner === 'draw' ? (
              <span className="text-yellow-300">It's a draw!</span>
            ) : (
              <span className={`${winner === 'X' ? 'text-teal-300' : 'text-pink-300'}`}>
                Player {winner} wins!
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <span className="text-white text-opacity-80">Turn {turnCount}</span>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-white">Current Player:</span>
              <span 
                className={`font-bold ${
                  currentPlayer === 'X' ? 'text-teal-300' : 'text-pink-300'
                }`}
              >
                {currentPlayer}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 text-white/70 text-sm px-4">
        <p>Each player can only have 3 marks at once!</p>
        <p>You can't place a mark where your oldest mark was removed.</p>
      </div>
    </div>
  );
};

export default GameStatus;