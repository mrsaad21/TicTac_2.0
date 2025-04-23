import React from 'react';
import { X, Circle } from 'lucide-react';
import { Mark } from '../context/GameContext';

interface GameSquareProps {
  index: number;
  mark: Mark | null;
  onClick: () => void;
  isBlocked: boolean;
  isDisabled: boolean;
}

const GameSquare: React.FC<GameSquareProps> = ({ 
  index, 
  mark, 
  onClick, 
  isBlocked,
  isDisabled
}) => {
  // Determine which classes to apply based on props
  const baseClasses = "flex items-center justify-center w-full h-full rounded-lg text-white cursor-pointer transition-all duration-300";
  
  const stateClasses = isDisabled
    ? "cursor-not-allowed"
    : isBlocked
    ? "bg-red-500/20 cursor-not-allowed"
    : mark
    ? "bg-indigo-500/30 shadow-inner"
    : "bg-white/10 hover:bg-white/20 active:scale-95";

  const markOpacity = mark?.isOldest ? "opacity-40" : "opacity-100";

  return (
    <div 
      className={`${baseClasses} ${stateClasses}`}
      onClick={!isDisabled && !isBlocked && !mark ? onClick : undefined}
      aria-label={`Square ${index + 1}${mark ? ` marked with ${mark.player}` : ''}`}
    >
      {mark && (
        <div className={`animate-pop ${markOpacity}`}>
          {mark.player === 'X' ? (
            <X size={36} className="text-teal-300" strokeWidth={3} />
          ) : (
            <Circle size={36} className="text-pink-300" strokeWidth={3} />
          )}
        </div>
      )}
      
      {isBlocked && !mark && (
        <div className="text-red-300 font-bold text-opacity-70 text-sm">
          Blocked
        </div>
      )}
    </div>
  );
};

export default GameSquare;