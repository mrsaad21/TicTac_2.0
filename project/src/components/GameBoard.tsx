import React from 'react';
import { useGame } from '../context/GameContext';
import GameSquare from './GameSquare';
import GameStatus from './GameStatus';
import GameControls from './GameControls';

const GameBoard: React.FC = () => {
  const { board, handleSquareClick, winner, blockedPosition } = useGame();

  return (
    <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
      <div className="p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-4">
          Dynamic Tic Tac Toe
        </h1>
        
        <GameStatus />
        
        <div className="mt-6 mb-8 grid grid-cols-3 gap-3 aspect-square">
          {Array(9).fill(null).map((_, index) => (
            <GameSquare
              key={index}
              index={index}
              mark={board[index]}
              onClick={() => handleSquareClick(index)}
              isBlocked={index === blockedPosition}
              isDisabled={winner !== null}
            />
          ))}
        </div>
        
        <GameControls />
      </div>
    </div>
  );
};

export default GameBoard;