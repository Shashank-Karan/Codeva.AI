import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, Users, Bot, Send, ArrowLeft, MessageSquare, Clock, Flag, HandHeart } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Chess } from "chess.js";
import { io, Socket } from "socket.io-client";
import AppNavigation from "@/components/AppNavigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import ChessBoard from "@/components/ChessBoard";

interface ChessGameData {
  id: number;
  roomId: string;
  whitePlayer: { id: number; username: string } | null;
  blackPlayer: { id: number; username: string } | null;
  gameStatus: 'waiting' | 'active' | 'finished';
  gameType: 'multiplayer' | 'ai';
  isPrivate: boolean;
  currentFen: string;
  winner?: string;
  createdAt: string;
}

interface ChatMessage {
  id: number;
  message: string;
  messageType: 'chat' | 'system' | 'game_event';
  createdAt: string;
  user: { id: number; username: string } | null;
}

interface GameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  isDraw: boolean;
  gameStatus: string;
  whitePlayer: any;
  blackPlayer: any;
  history: string[];
  winner?: string;
}

export default function ChessGame() {
  const [match, params] = useRoute("/chess/game/:roomId");
  const roomId = params?.roomId;
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [chess] = useState(() => new Chess());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [capturedPieces, setCapturedPieces] = useState<{white: string[], black: string[]}>({white: [], black: []});
  const [drawOffer, setDrawOffer] = useState<{from: string, username: string} | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial game data
  const { data: gameData, isLoading } = useQuery<ChessGameData>({
    queryKey: [`/api/chess/games/${roomId}`],
    enabled: !!roomId,
  });

  // Initialize captured pieces when game data loads
  useEffect(() => {
    if (gameData?.currentFen) {
      updateCapturedPieces(gameData.currentFen);
    }
  }, [gameData?.currentFen]);

  // Initialize socket connection
  useEffect(() => {
    if (!user || !roomId) return;

    const newSocket = io({
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join-chess-game', { roomId, userId: user.id });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('game-state', (state: GameState) => {
      console.log('Game state updated:', state);
      setGameState(state);
      chess.load(state.fen);
      setSelectedSquare(null);
      setPossibleMoves([]);
      updateCapturedPieces(state.fen);
    });

    newSocket.on('chat-history', (messages: ChatMessage[]) => {
      setChatMessages(messages);
    });

    newSocket.on('move-made', (data: any) => {
      console.log('Move made:', data);
      chess.load(data.fen);
      setGameState(prev => prev ? { ...prev, ...data } : data);
      setSelectedSquare(null);
      setPossibleMoves([]);
      updateCapturedPieces(data.fen);
    });

    newSocket.on('ai-move-made', (data: any) => {
      console.log('AI move made:', data);
      chess.load(data.fen);
      setGameState(prev => prev ? { ...prev, ...data } : data);
      setSelectedSquare(null);
      setPossibleMoves([]);
    });

    newSocket.on('chat-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
    });

    newSocket.on('draw-offer', (data: {from: string, username: string}) => {
      setDrawOffer(data);
    });

    newSocket.on('draw-offer-declined', () => {
      setDrawOffer(null);
    });

    newSocket.on('player-joined', (data: any) => {
      // Refresh the game data when a player joins
      queryClient.invalidateQueries({ queryKey: [`/api/chess/games/${roomId}`] });
    });

    newSocket.on('player-disconnected', (data: any) => {
      // Handle player disconnection
      console.log('Player disconnected:', data.userId);
    });

    newSocket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message);
      // You could show a toast notification here if needed
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user, roomId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSquareClick = (square: string) => {
    if (!gameState || !user || !gameData) return;

    // Check if game is active
    if (gameState.gameStatus !== 'active') return;

    const isPlayerTurn = 
      (gameState.turn === 'w' && gameData?.whitePlayer?.id === user.id) ||
      (gameState.turn === 'b' && gameData?.blackPlayer?.id === user.id);

    if (!isPlayerTurn) {
      console.log('Not your turn');
      return;
    }

    if (selectedSquare) {
      // Try to make a move - use a temporary chess instance to validate
      const tempChess = new Chess(gameState.fen);
      try {
        const move = tempChess.move({
          from: selectedSquare,
          to: square,
          promotion: 'q', // Always promote to queen for simplicity
        });

        if (move) {
          socket?.emit('chess-move', {
            roomId,
            move: { from: selectedSquare, to: square, promotion: 'q' },
            userId: user.id,
          });
        }
      } catch (error) {
        console.log('Invalid move:', error);
      }
      
      setSelectedSquare(null);
      setPossibleMoves([]);
    } else {
      // Select a piece - use current game state
      const tempChess = new Chess(gameState.fen);
      const piece = tempChess.get(square);
      if (piece && piece.color === gameState.turn) {
        setSelectedSquare(square);
        const moves = tempChess.moves({ square, verbose: true });
        setPossibleMoves(moves.map(move => move.to));
      }
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !socket || !user) return;

    socket.emit('chess-chat', {
      roomId,
      message: messageInput,
      userId: user.id,
    });

    setMessageInput("");
  };

  const handleRequestAIMove = () => {
    if (!socket || !user || gameData?.gameType !== 'ai') return;
    
    socket.emit('request-ai-move', {
      roomId,
      userId: user.id,
    });
  };

  const handleResign = () => {
    if (!socket || !user) return;
    
    socket.emit('chess-resign', {
      roomId,
      userId: user.id,
    });
  };

  const handleOfferDraw = () => {
    if (!socket || !user) return;
    
    socket.emit('offer-draw', {
      roomId,
      userId: user.id,
    });
  };

  const handleAcceptDraw = () => {
    if (socket && user) {
      socket.emit('accept-draw', { roomId, userId: user.id });
      setDrawOffer(null);
    }
  };

  const handleDeclineDraw = () => {
    if (socket && user) {
      socket.emit('decline-draw', { roomId, userId: user.id });
      setDrawOffer(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20';
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/20';
      case 'finished': return 'bg-gray-500/20 text-gray-300 border-gray-500/20';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/20';
    }
  };

  const getPlayerColor = (playerId: number | undefined) => {
    if (!gameData || !playerId) return null;
    if (gameData.whitePlayer?.id === playerId) return 'white';
    if (gameData.blackPlayer?.id === playerId) return 'black';
    return null;
  };

  const isPlayerTurn = () => {
    if (!gameState || !user || !gameData) return false;
    return (gameState.turn === 'w' && gameData.whitePlayer?.id === user.id) ||
           (gameState.turn === 'b' && gameData.blackPlayer?.id === user.id);
  };

  const updateCapturedPieces = (fen: string) => {
    const startingPieces = {
      'p': 8, 'r': 2, 'n': 2, 'b': 2, 'q': 1, 'k': 1,
      'P': 8, 'R': 2, 'N': 2, 'B': 2, 'Q': 1, 'K': 1
    };
    
    const currentPieces: any = {};
    
    // Count current pieces on board
    const board = fen.split(' ')[0];
    for (const char of board) {
      if (char in startingPieces) {
        currentPieces[char] = (currentPieces[char] || 0) + 1;
      }
    }
    
    const captured = { white: [] as string[], black: [] as string[] };
    
    // Calculate captured pieces
    for (const [piece, startCount] of Object.entries(startingPieces)) {
      const currentCount = currentPieces[piece] || 0;
      const capturedCount = startCount - currentCount;
      
      for (let i = 0; i < capturedCount; i++) {
        if (piece === piece.toLowerCase()) {
          // Black piece captured by white
          captured.white.push(piece);
        } else {
          // White piece captured by black
          captured.black.push(piece.toLowerCase());
        }
      }
    }
    
    setCapturedPieces(captured);
  };

  const getPlayerResult = () => {
    if (!gameState || !user || !gameData || gameState.gameStatus !== 'finished') return null;
    
    const isWhitePlayer = gameData.whitePlayer?.id === user.id;
    const isBlackPlayer = gameData.blackPlayer?.id === user.id;
    
    if (gameState.winner === 'draw') return 'draw';
    if ((gameState.winner === 'white' && isWhitePlayer) || (gameState.winner === 'black' && isBlackPlayer)) {
      return 'winner';
    }
    if ((gameState.winner === 'white' && isBlackPlayer) || (gameState.winner === 'black' && isWhitePlayer)) {
      return 'loser';
    }
    return null;
  };

  const renderCapturedPieces = (pieces: string[], color: 'white' | 'black') => {
    const pieceSymbols: { [key: string]: string } = {
      'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚'
    };
    
    return (
      <div className={`flex flex-wrap gap-1 min-h-[24px] p-2 rounded ${color === 'white' ? 'bg-slate-100/10' : 'bg-slate-700/50'}`}>
        {pieces.map((piece, index) => (
          <span key={index} className="text-lg">
            {pieceSymbols[piece]}
          </span>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <LoadingSpinner message="Loading chess game..." />
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold text-white mb-2">Game Not Found</h2>
            <p className="text-gray-400 mb-4">The chess game you're looking for doesn't exist.</p>
            <Link href="/chess">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chess Lobby
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      </div>

      <AppNavigation />

      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/chess">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lobby
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              {gameData.gameType === 'ai' ? (
                <Bot className="h-5 w-5 text-purple-400" />
              ) : (
                <Users className="h-5 w-5 text-blue-400" />
              )}
              <span className="text-white font-medium">
                {gameData.gameType === 'ai' ? 'vs AI' : 'Multiplayer'}
              </span>
            </div>
            <Badge className={getStatusColor(gameData.gameStatus)}>
              {gameData.gameStatus}
            </Badge>
            {!isConnected && (
              <Badge variant="destructive">
                Disconnected
              </Badge>
            )}
          </div>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Chess Board */}
          <div className="xl:col-span-3">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle className="text-white flex items-center">
                    <Crown className="h-5 w-5 mr-2" />
                    Chess Game
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    {gameState?.turn && (
                      <Badge variant="outline" className="text-white">
                        {gameState.turn === 'w' ? 'White' : 'Black'} to move
                      </Badge>
                    )}
                    {isPlayerTurn() && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/20">
                        Your turn
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Game Result Banner */}
                {getPlayerResult() && (
                  <div className={`mb-6 p-4 rounded-lg text-center ${
                    getPlayerResult() === 'winner' ? 'bg-green-600/20 border border-green-500/30' :
                    getPlayerResult() === 'loser' ? 'bg-red-600/20 border border-red-500/30' :
                    'bg-yellow-600/20 border border-yellow-500/30'
                  }`}>
                    <div className="flex items-center justify-center space-x-2">
                      {getPlayerResult() === 'winner' && <Crown className="h-6 w-6 text-yellow-400" />}
                      {getPlayerResult() === 'loser' && <Flag className="h-6 w-6 text-red-400" />}
                      <h2 className={`text-xl font-bold ${
                        getPlayerResult() === 'winner' ? 'text-green-300' :
                        getPlayerResult() === 'loser' ? 'text-red-300' :
                        'text-yellow-300'
                      }`}>
                        {getPlayerResult() === 'winner' ? '🎉 You Won!' :
                         getPlayerResult() === 'loser' ? '😔 You Lost' :
                         '🤝 Draw Game'}
                      </h2>
                    </div>
                  </div>
                )}

                {/* Draw Offer Notification */}
                {drawOffer && drawOffer.from !== user?.id.toString() && (
                  <div className="mb-6 p-4 rounded-lg bg-blue-600/20 border border-blue-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <HandHeart className="h-5 w-5 text-blue-400" />
                        <span className="text-blue-300 font-medium">
                          {drawOffer.username} offers a draw
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleAcceptDraw}
                        >
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-red-500 text-red-400 hover:bg-red-600/20"
                          onClick={handleDeclineDraw}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Black player info with captured pieces */}
                  <div className="space-y-2">
                    <div className={`rounded-lg p-3 ${
                      gameState?.turn === 'b' && gameState?.gameStatus === 'active' ? 'bg-blue-600/30 border border-blue-500/50' : 'bg-slate-700/50'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                        <span className="text-white font-medium text-sm sm:text-base">
                          {gameData.blackPlayer?.username || 'Waiting...'}
                        </span>
                        {gameState?.turn === 'b' && gameState?.gameStatus === 'active' && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            Your Turn
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* Captured pieces by black */}
                    <div className="text-xs text-gray-400 mb-1">Captured by Black:</div>
                    {renderCapturedPieces(capturedPieces.black, 'black')}
                  </div>
                  
                  {/* Game status info */}
                  <div className="text-center">
                    {gameState?.isCheck && (
                      <Badge variant="destructive" className="mb-2">
                        Check!
                      </Badge>
                    )}
                    {gameState?.isCheckmate && (
                      <Badge variant="destructive">
                        Checkmate!
                      </Badge>
                    )}
                    {gameState?.isStalemate && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/20">
                        Stalemate!
                      </Badge>
                    )}
                    {gameState?.isDraw && (
                      <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/20">
                        Draw!
                      </Badge>
                    )}
                    
                    {/* Turn indicator */}
                    {gameState?.gameStatus === 'active' && (
                      <div className="mt-2">
                        <div className="text-sm text-gray-400 mb-1">Current Turn:</div>
                        <Badge variant="outline" className="text-white text-base px-3 py-1">
                          {gameState.turn === 'w' ? '⚪ White' : '⚫ Black'}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* White player info with captured pieces */}
                  <div className="space-y-2">
                    <div className={`rounded-lg p-3 ${
                      gameState?.turn === 'w' && gameState?.gameStatus === 'active' ? 'bg-blue-600/30 border border-blue-500/50' : 'bg-slate-100/10'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                        <span className="text-white font-medium text-sm sm:text-base">
                          {gameData.whitePlayer?.username || 'Waiting...'}
                        </span>
                        {gameState?.turn === 'w' && gameState?.gameStatus === 'active' && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            Your Turn
                          </Badge>
                        )}
                      </div>
                    </div>
                    {/* Captured pieces by white */}
                    <div className="text-xs text-gray-400 mb-1">Captured by White:</div>
                    {renderCapturedPieces(capturedPieces.white, 'white')}
                  </div>
                </div>

                {/* Chess Board */}
                <div className="flex justify-center mb-6">
                  <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl">
                    <ChessBoard
                      position={gameState?.fen || chess.fen()}
                      onSquareClick={handleSquareClick}
                      selectedSquare={selectedSquare}
                      possibleMoves={possibleMoves}
                      orientation={getPlayerColor(user?.id) || 'white'}
                    />
                  </div>
                </div>

                {/* Game Actions */}
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {/* AI Move Button */}
                  {gameData.gameType === 'ai' && gameState?.turn === 'b' && gameState?.gameStatus === 'active' && (
                    <Button
                      onClick={handleRequestAIMove}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Request AI Move
                    </Button>
                  )}
                  
                  {/* Player Action Buttons */}
                  {gameState?.gameStatus === 'active' && (
                    <>
                      <Button
                        onClick={handleOfferDraw}
                        variant="outline"
                        className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Offer Draw
                      </Button>
                      <Button
                        onClick={handleResign}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Flag className="h-4 w-4 mr-2" />
                        Resign
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Panel */}
          <div className="xl:col-span-1">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center text-sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Game Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-col h-80 xl:h-96">
                  {/* Chat Messages */}
                  <ScrollArea className="flex-1 px-4">
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.user?.id === user?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[240px] rounded-lg px-3 py-2 ${
                              message.user?.id === user?.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-700 text-gray-300'
                            }`}
                          >
                            <div className="font-medium text-xs mb-1">
                              {message.user?.username || 'System'}
                            </div>
                            <div className="text-sm break-words">{message.message}</div>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>
                  
                  {/* Chat Input */}
                  <div className="p-4 border-t border-slate-700">
                    <div className="flex space-x-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-slate-700 border-slate-600 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="sm"
                        disabled={!messageInput.trim() || !isConnected}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}