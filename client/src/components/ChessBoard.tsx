import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';

interface ChessBoardProps {
  position: string;
  onSquareClick: (square: string) => void;
  selectedSquare?: string | null;
  possibleMoves?: string[];
  orientation?: 'white' | 'black';
}

interface PieceProps {
  piece: string;
  square: string;
  isSelected: boolean;
  isPossibleMove: boolean;
  onSquareClick: (square: string) => void;
}

const pieceSymbols: { [key: string]: string } = {
  'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
  'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟',
};

function ChessPiece({ piece, square, isSelected, isPossibleMove, onSquareClick }: PieceProps) {
  const symbol = pieceSymbols[piece] || '';
  
  return (
    <div
      className={`
        w-12 h-12 flex items-center justify-center text-4xl cursor-pointer
        transition-all duration-200 select-none
        ${isSelected ? 'bg-blue-400/50 shadow-lg' : ''}
        ${isPossibleMove ? 'bg-green-400/30' : ''}
        hover:bg-blue-300/30
      `}
      onClick={() => onSquareClick(square)}
    >
      {symbol}
    </div>
  );
}

export default function ChessBoard({ 
  position, 
  onSquareClick, 
  selectedSquare, 
  possibleMoves = [], 
  orientation = 'white' 
}: ChessBoardProps) {
  const [chess] = useState(() => new Chess());
  const [boardState, setBoardState] = useState<any>({});

  useEffect(() => {
    chess.load(position);
    const board = chess.board();
    const newBoardState: any = {};
    
    board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        const square = String.fromCharCode(97 + colIndex) + (8 - rowIndex);
        if (piece) {
          newBoardState[square] = piece.color + piece.type.toUpperCase();
        }
      });
    });
    
    setBoardState(newBoardState);
  }, [position]);

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Reverse the board for black orientation
  const displayFiles = orientation === 'black' ? [...files].reverse() : files;
  const displayRanks = orientation === 'black' ? [...ranks].reverse() : ranks;

  const getSquareColor = (file: string, rank: string) => {
    const fileIndex = files.indexOf(file);
    const rankIndex = parseInt(rank);
    const isLight = (fileIndex + rankIndex) % 2 === 0;
    return isLight ? 'bg-amber-100' : 'bg-amber-800';
  };

  const isSquareSelected = (square: string) => selectedSquare === square;
  const isSquarePossibleMove = (square: string) => possibleMoves.includes(square);

  return (
    <div className="inline-block bg-amber-900 p-4 rounded-lg shadow-2xl">
      {/* Rank labels (left side) */}
      <div className="flex">
        <div className="flex flex-col justify-center mr-2">
          {displayRanks.map((rank) => (
            <div key={rank} className="h-12 flex items-center text-amber-200 font-bold text-sm">
              {rank}
            </div>
          ))}
        </div>
        
        {/* Chess board */}
        <div className="border-2 border-amber-800 rounded">
          <div className="grid grid-cols-8 gap-0">
            {displayRanks.map((rank) =>
              displayFiles.map((file) => {
                const square = file + rank;
                const piece = boardState[square];
                const isSelected = isSquareSelected(square);
                const isPossibleMove = isSquarePossibleMove(square);
                
                return (
                  <div
                    key={square}
                    className={`
                      w-12 h-12 relative cursor-pointer
                      ${getSquareColor(file, rank)}
                      ${isSelected ? 'ring-2 ring-blue-500' : ''}
                      ${isPossibleMove ? 'ring-2 ring-green-500' : ''}
                      hover:ring-2 hover:ring-blue-300
                    `}
                    onClick={() => onSquareClick(square)}
                  >
                    {/* Possible move indicator */}
                    {isPossibleMove && !piece && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full opacity-60"></div>
                      </div>
                    )}
                    
                    {/* Piece */}
                    {piece && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl select-none">
                          {pieceSymbols[piece]}
                        </span>
                      </div>
                    )}
                    
                    {/* Possible move indicator for pieces */}
                    {isPossibleMove && piece && (
                      <div className="absolute inset-0 ring-2 ring-green-500 rounded-full opacity-60"></div>
                    )}
                    
                    {/* Square coordinates (for debugging) */}
                    <div className="absolute top-0 left-0 text-xs text-gray-500 opacity-0 hover:opacity-100">
                      {square}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      {/* File labels (bottom) */}
      <div className="flex justify-center mt-2 ml-6">
        {displayFiles.map((file) => (
          <div key={file} className="w-12 text-center text-amber-200 font-bold text-sm">
            {file}
          </div>
        ))}
      </div>
    </div>
  );
}