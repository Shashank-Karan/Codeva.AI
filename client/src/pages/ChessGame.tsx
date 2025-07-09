import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, Users, Bot, Send, ArrowLeft, MessageSquare, Clock, Flag } from "lucide-react";
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial game data
  const { data: gameData, isLoading } = useQuery<ChessGameData>({
    queryKey: [`/api/chess/games/${roomId}`],
    enabled: !!roomId,
  });

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
    
    socket.emit('chess-offer-draw', {
      roomId,
      userId: user.id,
    });
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Black player info */}
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-slate-900 rounded-full"></div>
                      <span className="text-white font-medium text-sm sm:text-base">
                        {gameData.blackPlayer?.username || 'Waiting...'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Game info */}
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
                  </div>
                  
                  {/* White player info */}
                  <div className="bg-slate-100/10 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span className="text-white font-medium text-sm sm:text-base">
                        {gameData.whitePlayer?.username || 'Waiting...'}
                      </span>
                    </div>
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