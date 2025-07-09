import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Bot, Plus, Play, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import AppNavigation from "@/components/AppNavigation";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ChessGame {
  id: number;
  roomId: string;
  whitePlayer: { id: number; username: string } | null;
  blackPlayer: { id: number; username: string } | null;
  gameStatus: 'waiting' | 'active' | 'finished';
  gameType: 'multiplayer' | 'ai';
  isPrivate: boolean;
  createdAt: string;
  winner?: string;
}

export default function Chess() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("lobby");

  // Fetch active games
  const { data: activeGames, isLoading: isLoadingActive } = useQuery({
    queryKey: ['/api/chess/games'],
    enabled: !!user,
  });

  // Fetch user's games
  const { data: userGames, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/chess/user/games'],
    enabled: !!user,
  });

  if (!user) {
    return <div>Please log in to play chess</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
      </div>

      <AppNavigation />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 pt-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-amber-600/20 backdrop-blur-sm rounded-full text-amber-300 text-sm mb-4 border border-amber-500/20">
            <Crown className="h-4 w-4 mr-2" />
            Chess Arena
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Play Chess Online
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Challenge friends in real-time multiplayer matches or test your skills against AI opponents
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 backdrop-blur-sm">
            <TabsTrigger value="lobby" className="data-[state=active]:bg-blue-600">
              <Users className="h-4 w-4 mr-2" />
              Game Lobby
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Game
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-blue-600">
              <Crown className="h-4 w-4 mr-2" />
              My Games
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lobby" className="space-y-6">
            <div className="grid gap-6">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Active Games
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Join an ongoing game or wait for opponents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingActive ? (
                    <LoadingSpinner message="Loading active games..." />
                  ) : (
                    <div className="space-y-4">
                      {activeGames?.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No active games available</p>
                          <p className="text-sm">Create a new game to get started!</p>
                        </div>
                      ) : (
                        activeGames?.map((game: ChessGame) => (
                          <GameCard key={game.id} game={game} />
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <CreateGameForm />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  Your Games
                </CardTitle>
                <CardDescription className="text-gray-400">
                  View your chess game history and statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUser ? (
                  <LoadingSpinner message="Loading your games..." />
                ) : (
                  <div className="space-y-4">
                    {userGames?.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <Crown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No games played yet</p>
                        <p className="text-sm">Start your first game!</p>
                      </div>
                    ) : (
                      userGames?.map((game: ChessGame) => (
                        <GameHistoryCard key={game.id} game={game} currentUserId={user.id} />
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function GameCard({ game }: { game: ChessGame }) {
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const [joinPassword, setJoinPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20';
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/20';
      case 'finished': return 'bg-gray-500/20 text-gray-300 border-gray-500/20';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/20';
    }
  };

  const canJoin = () => {
    if (!user) return false;
    if (game.gameStatus !== 'waiting') return false;
    if (game.whitePlayer?.id === user.id || game.blackPlayer?.id === user.id) return false;
    return !game.whitePlayer || !game.blackPlayer;
  };

  const handleJoinGame = async () => {
    if (!canJoin()) return;
    
    if (game.isPrivate && !showPasswordInput) {
      setShowPasswordInput(true);
      return;
    }
    
    setIsJoining(true);
    try {
      const response = await fetch(`/api/chess/games/${game.roomId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: game.isPrivate ? joinPassword : undefined,
        }),
      });

      if (response.ok) {
        // Refresh the games list
        queryClient.invalidateQueries({ queryKey: ['/api/chess/games'] });
        queryClient.invalidateQueries({ queryKey: ['/api/chess/user/games'] });
        
        // Navigate to the game
        window.location.href = `/chess/game/${game.roomId}`;
      } else {
        const errorData = await response.json();
        console.error('Failed to join game:', errorData.message);
        alert(errorData.message || 'Failed to join game');
      }
    } catch (error) {
      console.error('Error joining game:', error);
      alert('Failed to join game');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-600/50 rounded-lg p-4 hover:bg-slate-900/60 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {game.gameType === 'ai' ? (
              <Bot className="h-5 w-5 text-purple-400" />
            ) : (
              <Users className="h-5 w-5 text-blue-400" />
            )}
            <div className="flex flex-col">
              <span className="text-white font-medium">
                {game.gameName || (game.gameType === 'ai' ? 'vs AI' : 'Multiplayer')}
              </span>
              {game.gameName && (
                <span className="text-sm text-gray-400">
                  {game.gameType === 'ai' ? 'vs AI' : 'Multiplayer'}
                </span>
              )}
            </div>
          </div>
          <Badge className={getStatusColor(game.gameStatus)}>
            {game.gameStatus}
          </Badge>
          {game.isPrivate && (
            <Badge variant="outline" className="border-amber-500/20 text-amber-300">
              Private
            </Badge>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="text-sm text-gray-400">
            <span className="text-white">{game.whitePlayer?.username || 'Waiting...'}</span>
            <span className="mx-2">vs</span>
            <span className="text-white">{game.blackPlayer?.username || 'Waiting...'}</span>
          </div>
          <div className="flex space-x-2">
            {canJoin() && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={handleJoinGame}
                disabled={isJoining}
              >
                <Play className="h-4 w-4 mr-2" />
                {isJoining ? 'Joining...' : (game.isPrivate && !showPasswordInput ? 'Enter Password' : 'Join Game')}
              </Button>
            )}
            <Link href={`/chess/game/${game.roomId}`}>
              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                {game.gameStatus === 'waiting' ? 'Spectate' : 'View Game'}
              </Button>
            </Link>
            <Button 
              size="sm" 
              variant="ghost"
              className="text-blue-400 hover:text-blue-300"
              onClick={() => {
                navigator.clipboard.writeText(window.location.origin + `/chess/game/${game.roomId}`);
                // You could add a toast notification here
              }}
            >
              Share Link
            </Button>
          </div>
        </div>
      </div>
      {showPasswordInput && (
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="password"
            value={joinPassword}
            onChange={(e) => setJoinPassword(e.target.value)}
            placeholder="Enter password"
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            size="sm"
            onClick={handleJoinGame}
            disabled={isJoining || !joinPassword}
            className="bg-green-600 hover:bg-green-700"
          >
            {isJoining ? 'Joining...' : 'Join'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setShowPasswordInput(false);
              setJoinPassword('');
            }}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}

function GameHistoryCard({ game, currentUserId }: { game: ChessGame; currentUserId: number }) {
  const isWhitePlayer = game.whitePlayer?.id === currentUserId;
  const isBlackPlayer = game.blackPlayer?.id === currentUserId;
  const opponent = isWhitePlayer ? game.blackPlayer : game.whitePlayer;
  const playerColor = isWhitePlayer ? 'White' : 'Black';

  const getResultColor = (winner?: string) => {
    if (!winner) return 'bg-gray-500/20 text-gray-300 border-gray-500/20';
    if (winner === 'draw') return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/20';
    
    const playerWon = (winner === 'white' && isWhitePlayer) || (winner === 'black' && isBlackPlayer);
    return playerWon 
      ? 'bg-green-500/20 text-green-300 border-green-500/20'
      : 'bg-red-500/20 text-red-300 border-red-500/20';
  };

  const getResultText = (winner?: string) => {
    if (!winner) return 'In Progress';
    if (winner === 'draw') return 'Draw';
    
    const playerWon = (winner === 'white' && isWhitePlayer) || (winner === 'black' && isBlackPlayer);
    return playerWon ? 'Victory' : 'Defeat';
  };

  return (
    <div className="bg-slate-900/40 border border-slate-600/50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {game.gameType === 'ai' ? (
              <Bot className="h-5 w-5 text-purple-400" />
            ) : (
              <Users className="h-5 w-5 text-blue-400" />
            )}
            <div className="flex flex-col">
              <span className="text-white font-medium">
                {game.gameName || `${playerColor} vs ${opponent?.username || 'AI'}`}
              </span>
              {game.gameName && (
                <span className="text-sm text-gray-400">
                  {playerColor} vs {opponent?.username || 'AI'}
                </span>
              )}
            </div>
          </div>
          <Badge className={getResultColor(game.winner)}>
            {getResultText(game.winner)}
          </Badge>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            {new Date(game.createdAt).toLocaleDateString()}
          </div>
          <Link href={`/chess/game/${game.roomId}`}>
            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function CreateGameForm() {
  const [gameType, setGameType] = useState<'multiplayer' | 'ai'>('multiplayer');
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [gameName, setGameName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGame = async () => {
    setIsCreating(true);
    try {
      const roomId = `game-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch('/api/chess/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          gameName: gameName.trim() || undefined,
          gameType,
          isPrivate,
          password: isPrivate ? password : undefined,
        }),
      });

      if (response.ok) {
        const game = await response.json();
        window.location.href = `/chess/game/${game.roomId}`;
      } else {
        throw new Error('Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Create New Game
        </CardTitle>
        <CardDescription className="text-gray-400">
          Set up a new chess game with your preferred settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label htmlFor="gameName" className="block text-sm font-medium text-gray-300 mb-2">
            Game Name (optional)
          </label>
          <input
            type="text"
            id="gameName"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter custom game name"
            maxLength={50}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={gameType === 'multiplayer' ? 'default' : 'outline'}
            onClick={() => setGameType('multiplayer')}
            className="h-20 flex-col space-y-2"
          >
            <Users className="h-6 w-6" />
            <span>Multiplayer</span>
          </Button>
          <Button
            variant={gameType === 'ai' ? 'default' : 'outline'}
            onClick={() => setGameType('ai')}
            className="h-20 flex-col space-y-2"
          >
            <Bot className="h-6 w-6" />
            <span>vs AI</span>
          </Button>
        </div>

        {gameType === 'multiplayer' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="private"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-blue-600"
              />
              <label htmlFor="private" className="text-white">
                Private game (password required)
              </label>
            </div>

            {isPrivate && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter game password"
                />
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handleCreateGame}
          disabled={isCreating || (isPrivate && !password)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isCreating ? (
            <LoadingSpinner message="Creating game..." />
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Create Game
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}