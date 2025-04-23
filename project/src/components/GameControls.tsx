import React from 'react';
import { RefreshCw, Users, Cpu, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { Difficulty } from '../context/GameContext';

const GameControls: React.FC = () => {
  const { resetGame, gameMode, setGameMode, difficulty, setDifficulty } = useGame();

  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-orange-500',
    insane: 'bg-red-500',
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
            ${
              gameMode === 'pvp'
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          onClick={() => setGameMode('pvp')}
        >
          <Users size={18} />
          <span>Player vs Player</span>
        </button>
        
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
            ${
              gameMode === 'computer'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          onClick={() => setGameMode('computer')}
        >
          <Cpu size={18} />
          <span>vs Computer</span>
        </button>
      </div>

      {gameMode === 'computer' && (
        <div className="flex justify-center space-x-2">
          {(['easy', 'medium', 'hard', 'insane'] as Difficulty[]).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`px-3 py-1 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-1
                ${difficulty === level 
                  ? `${difficultyColors[level]} text-white shadow-lg` 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
            >
              <Zap size={14} className={difficulty === level ? 'animate-pulse' : ''} />
              <span className="capitalize">{level}</span>
            </button>
          ))}
        </div>
      )}
      
      <button
        onClick={resetGame}
        className="mx-auto px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95"
      >
        <RefreshCw size={18} className="animate-spin-slow" />
        <span>New Game</span>
      </button>
    </div>
  );
};

export default GameControls;