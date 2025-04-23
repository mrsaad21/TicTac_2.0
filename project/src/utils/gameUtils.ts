import { Mark, Difficulty } from '../context/GameContext';

export const calculateWinner = (board: (Mark | null)[]): 'X' | 'O' | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (
      board[a] && 
      board[b] && 
      board[c] && 
      board[a]?.player === board[b]?.player && 
      board[b]?.player === board[c]?.player
    ) {
      return board[a]?.player as 'X' | 'O';
    }
  }

  return null;
};

const evaluate = (board: (Mark | null)[], player: 'X' | 'O'): number => {
  const opponent = player === 'X' ? 'O' : 'X';
  const winner = calculateWinner(board);

  if (winner === player) return 10;
  if (winner === opponent) return -10;

  // Additional evaluation for better positional play
  let score = 0;
  
  // Center control
  if (board[4]?.player === player) score += 3;
  
  // Corner control
  for (const corner of [0, 2, 6, 8]) {
    if (board[corner]?.player === player) score += 2;
  }

  return score;
};

const cloneBoard = (board: (Mark | null)[]): (Mark | null)[] => {
  return board.map(mark => mark ? { ...mark } : null);
};

const minimax = (
  board: (Mark | null)[],
  depth: number,
  isMax: boolean,
  player: 'X' | 'O',
  alpha: number,
  beta: number,
  maxDepth: number
): number => {
  const score = evaluate(board, player);

  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (depth === maxDepth) return score;

  if (isMax) {
    let best = -1000;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = cloneBoard(board);
        newBoard[i] = { player, position: i, turnPlaced: 0 };
        best = Math.max(
          best,
          minimax(newBoard, depth + 1, false, player, alpha, beta, maxDepth)
        );
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  } else {
    let best = 1000;
    const opponent = player === 'X' ? 'O' : 'X';
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        const newBoard = cloneBoard(board);
        newBoard[i] = { player: opponent, position: i, turnPlaced: 0 };
        best = Math.min(
          best,
          minimax(newBoard, depth + 1, true, player, alpha, beta, maxDepth)
        );
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
    }
    return best;
  }
};

const getRandomMove = (
  board: (Mark | null)[],
  blockedPosition: number | null
): number | null => {
  const availablePositions = board
    .map((cell, index) => (cell === null && index !== blockedPosition ? index : -1))
    .filter(pos => pos !== -1);

  if (availablePositions.length === 0) return null;
  return availablePositions[Math.floor(Math.random() * availablePositions.length)];
};

export const findBestMove = (
  board: (Mark | null)[],
  markHistory: Mark[],
  blockedPosition: number | null,
  difficulty: Difficulty
): number | null => {
  // Create a copy of the board to avoid mutating the original
  const boardCopy = [...board];

  // Get available positions (excluding blocked position)
  const availablePositions = boardCopy
    .map((cell, index) => (cell === null && index !== blockedPosition ? index : -1))
    .filter(pos => pos !== -1);

  // If no moves are available, return null
  if (availablePositions.length === 0) {
    return null;
  }

  // Different strategies based on difficulty
  switch (difficulty) {
    case 'easy':
      // 70% random moves, 30% smart moves
      return Math.random() < 0.7
        ? getRandomMove(boardCopy, blockedPosition)
        : findSmartMove(boardCopy, blockedPosition, 2);

    case 'medium':
      // 30% random moves, 70% smart moves with medium depth
      return Math.random() < 0.3
        ? getRandomMove(boardCopy, blockedPosition)
        : findSmartMove(boardCopy, blockedPosition, 3);

    case 'hard':
      // Always smart moves with higher depth
      return findSmartMove(boardCopy, blockedPosition, 4);

    case 'insane':
      // Maximum depth and additional strategic evaluation
      return findSmartMove(boardCopy, blockedPosition, 6);

    default:
      return findSmartMove(boardCopy, blockedPosition, 3);
  }
};

const findSmartMove = (
  board: (Mark | null)[],
  blockedPosition: number | null,
  maxDepth: number
): number | null => {
  let bestVal = -1000;
  let bestMove = null;

  // Get available positions (excluding blocked position)
  const availablePositions = board
    .map((cell, index) => (cell === null && index !== blockedPosition ? index : -1))
    .filter(pos => pos !== -1);

  // If no moves are available, return null
  if (availablePositions.length === 0) {
    return null;
  }

  for (const position of availablePositions) {
    board[position] = { player: 'O', position, turnPlaced: 0 };
    const moveVal = minimax(board, 0, false, 'O', -1000, 1000, maxDepth);
    board[position] = null;

    if (moveVal > bestVal) {
      bestVal = moveVal;
      bestMove = position;
    }
  }

  return bestMove;
};