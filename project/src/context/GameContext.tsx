import React, { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { calculateWinner, findBestMove } from '../utils/gameUtils';

export type Player = 'X' | 'O';
export type GameMode = 'pvp' | 'computer';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'insane';

export interface Mark {
  player: Player;
  position: number;
  turnPlaced: number;
  isOldest?: boolean;
}

interface GameContextType {
  board: (Mark | null)[];
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  gameMode: GameMode;
  difficulty: Difficulty;
  blockedPosition: number | null;
  turnCount: number;
  handleSquareClick: (position: number) => void;
  resetGame: () => void;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }: GameProviderProps) => {
  const [board, setBoard] = useState<(Mark | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [turnCount, setTurnCount] = useState<number>(1);
  const [markHistory, setMarkHistory] = useState<Mark[]>([]);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [blockedPosition, setBlockedPosition] = useState<number | null>(null);

  // Update oldest marks
  useEffect(() => {
    const newBoard = [...board];
    newBoard.forEach(mark => {
      if (mark) mark.isOldest = false;
    });

    ['X', 'O'].forEach(player => {
      const playerMarks = markHistory
        .filter(mark => mark.player === player)
        .sort((a, b) => a.turnPlaced - b.turnPlaced);

      if (playerMarks.length === 3) {
        const oldestMark = playerMarks[0];
        const markOnBoard = newBoard[oldestMark.position];
        if (markOnBoard) {
          markOnBoard.isOldest = true;
        }
      }
    });

    setBoard(newBoard);
  }, [markHistory]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setTurnCount(1);
    setMarkHistory([]);
    setWinner(null);
    setBlockedPosition(null);
  };

  const handlePlayerMove = (position: number) => {
    if (winner || board[position] !== null || position === blockedPosition) {
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';

    const currentPlayerMarks = board.filter(
      mark => mark?.player === currentPlayer
    ).length;

    if (currentPlayerMarks >= 3) {
      const playerMarks = markHistory.filter(mark => mark.player === currentPlayer);
      const oldestMark = playerMarks[0];
      
      const newBoard = [...board];
      newBoard[oldestMark.position] = null;
      
      if (position === oldestMark.position) {
        return;
      }
      
      const newMarkHistory = markHistory.filter(
        mark => mark.position !== oldestMark.position
      );
      
      const newMark: Mark = {
        player: currentPlayer,
        position,
        turnPlaced: turnCount,
      };
      
      newBoard[position] = newMark;
      newMarkHistory.push(newMark);
      
      setBoard(newBoard);
      setMarkHistory(newMarkHistory);
      setCurrentPlayer(nextPlayer);
      setTurnCount(turnCount + 1);
      
      const gameWinner = calculateWinner(newBoard);
      if (gameWinner) {
        setWinner(gameWinner);
      }
      
      if (gameMode === 'computer' && nextPlayer === 'O' && !winner) {
        triggerComputerMove();
      }
      
      return;
    }

    const newMark: Mark = {
      player: currentPlayer,
      position,
      turnPlaced: turnCount,
    };

    const newBoard = [...board];
    newBoard[position] = newMark;
    
    const newMarkHistory = [...markHistory, newMark];
    
    setBoard(newBoard);
    setMarkHistory(newMarkHistory);
    setCurrentPlayer(nextPlayer);
    setTurnCount(turnCount + 1);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }

    if (gameMode === 'computer' && nextPlayer === 'O' && !winner) {
      triggerComputerMove();
    }
  };

  // Removed duplicate handlePlayerMove code block here to avoid redundancy

  const triggerComputerMove = () => {
    if (gameMode === 'computer' && currentPlayer === 'O' && !winner) {
      const bestMove = findBestMove(board, markHistory, blockedPosition, difficulty);
      if (bestMove !== null) {
        setTimeout(() => {
          handlePlayerMove(bestMove);
        }, 500);
      } else {
        setWinner('draw');
      }
    }
  };

  useEffect(() => {
    if (gameMode === 'computer' && currentPlayer === 'O' && !winner) {
      triggerComputerMove();
    }
  }, [currentPlayer, gameMode, winner, difficulty, turnCount]);

  const handleSquareClick = (position: number) => {
    if (gameMode === 'computer' && currentPlayer === 'O') {
      return;
    }
    
    handlePlayerMove(position);
  };

  const value = {
    board,
    currentPlayer,
    winner,
    gameMode,
    difficulty,
    blockedPosition,
    turnCount,
    handleSquareClick,
    resetGame,
    setGameMode,
    setDifficulty,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
