import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { Chess } from "chess.js";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { analyzeCode, debugCode, chatWithAI } from "./services/gemini";
import { insertPostSchema, insertCodeAnalysisSchema, insertDebugSchema, insertChessGameSchema, insertChessMessageSchema, insertChatConversationSchema, insertChatMessageSchema } from "@shared/schema";

// Simple auth middleware
function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  setupAuth(app);

  // Code analysis routes
  app.post('/api/analyze', async (req: any, res) => {
    try {
      const userId = req.user?.id?.toString();
      const analysisData = insertCodeAnalysisSchema.parse(req.body);
      
      const results = await analyzeCode(analysisData.code, analysisData.language);
      const analysis = await storage.saveCodeAnalysis(userId, analysisData, results);
      
      res.json({ analysis, results });
    } catch (error) {
      console.error("Error analyzing code:", error);
      res.status(500).json({ message: "Failed to analyze code" });
    }
  });

  app.get('/api/analyze/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const analyses = await storage.getUserCodeAnalyses(userId);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching analysis history:", error);
      res.status(500).json({ message: "Failed to fetch analysis history" });
    }
  });

  // Debug routes
  app.post('/api/debug', async (req: any, res) => {
    try {
      const userId = req.user?.id?.toString();
      const debugData = insertDebugSchema.parse(req.body);
      
      const results = await debugCode(debugData.originalCode, debugData.language);
      const debugResult = await storage.saveDebugResult(userId, debugData, results);
      
      res.json({ debugResult, results });
    } catch (error) {
      console.error("Error debugging code:", error);
      res.status(500).json({ message: "Failed to debug code" });
    }
  });

  // Enhanced AI Chat routes with conversation management
  app.post('/api/chat', async (req: any, res) => {
    try {
      const { message, fileContent, fileType, conversationId, mode = 'general' } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const userId = req.user?.id?.toString();
      let currentConversationId = conversationId;

      // Create new conversation if none provided
      if (!currentConversationId && userId) {
        const conversation = await storage.createChatConversation(userId, {
          title: message.slice(0, 50) + (message.length > 50 ? '...' : ''),
          mode,
        });
        currentConversationId = conversation.id;
      }

      // Add user message to conversation
      if (currentConversationId) {
        await storage.addChatMessage(currentConversationId, {
          type: 'user',
          content: message,
          fileInfo: fileContent ? { 
            name: 'uploaded-file', 
            type: fileType || 'text/plain', 
            size: fileContent.length 
          } : undefined,
        });
      }

      // Get AI response
      const response = await chatWithAI(message, fileContent, fileType);

      // Add AI response to conversation
      if (currentConversationId) {
        await storage.addChatMessage(currentConversationId, {
          type: 'ai',
          content: response,
        });
      }
      
      res.json({ 
        response, 
        conversationId: currentConversationId 
      });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  // Get chat conversations
  app.get('/api/chat/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const conversations = await storage.getUserChatConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get specific conversation with messages
  app.get('/api/chat/conversations/:id', async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const conversation = await storage.getChatConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      // Check if user owns the conversation (optional authentication)
      if (req.user && conversation.userId && conversation.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Update conversation (e.g., rename)
  app.patch('/api/chat/conversations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const updates = req.body;
      const userId = req.user.id;

      // Verify ownership
      const conversation = await storage.getChatConversation(conversationId);
      if (!conversation || conversation.userId !== userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const updatedConversation = await storage.updateChatConversation(conversationId, updates);
      res.json(updatedConversation);
    } catch (error) {
      console.error("Error updating conversation:", error);
      res.status(500).json({ message: "Failed to update conversation" });
    }
  });

  // Delete conversation
  app.delete('/api/chat/conversations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const userId = req.user.id;

      // Verify ownership
      const conversation = await storage.getChatConversation(conversationId);
      if (!conversation || conversation.userId !== userId) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      await storage.deleteChatConversation(conversationId);
      res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  app.get('/api/debug/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const debugResults = await storage.getUserDebugResults(userId);
      res.json(debugResults);
    } catch (error) {
      console.error("Error fetching debug history:", error);
      res.status(500).json({ message: "Failed to fetch debug history" });
    }
  });

  // Community routes
  app.post('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const postData = insertPostSchema.parse(req.body);
      
      // Validate that at least content, image, or video is provided
      if (!postData.content?.trim() && !postData.image && !postData.video) {
        return res.status(400).json({ message: "Post must have content, image, or video" });
      }
      
      const post = await storage.createPost(userId, postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/posts', async (req: any, res) => {
    try {
      const userId = req.user?.id?.toString();
      const posts = await storage.getPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const postId = parseInt(req.params.id);
      
      await storage.likePost(postId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.delete('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const postId = parseInt(req.params.id);
      
      await storage.unlikePost(postId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  // Chess game routes
  app.post('/api/chess/games', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const gameData = insertChessGameSchema.parse(req.body);
      
      const game = await storage.createChessGame(userId, gameData);
      res.json(game);
    } catch (error) {
      console.error("Error creating chess game:", error);
      res.status(500).json({ message: "Failed to create chess game" });
    }
  });

  app.get('/api/chess/games', async (req: any, res) => {
    try {
      const games = await storage.getActiveChessGames();
      res.json(games);
    } catch (error) {
      console.error("Error fetching active chess games:", error);
      res.status(500).json({ message: "Failed to fetch active chess games" });
    }
  });

  app.get('/api/chess/games/:roomId', async (req: any, res) => {
    try {
      const { roomId } = req.params;
      const game = await storage.getChessGame(roomId);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      res.json(game);
    } catch (error) {
      console.error("Error fetching chess game:", error);
      res.status(500).json({ message: "Failed to fetch chess game" });
    }
  });

  app.post('/api/chess/games/:roomId/join', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const { roomId } = req.params;
      const { password } = req.body;
      
      const game = await storage.joinChessGame(roomId, userId, password);
      res.json(game);
    } catch (error) {
      console.error("Error joining chess game:", error);
      res.status(500).json({ message: error.message || "Failed to join chess game" });
    }
  });

  app.get('/api/chess/games/:roomId/messages', async (req: any, res) => {
    try {
      const { roomId } = req.params;
      const game = await storage.getChessGame(roomId);
      
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      const messages = await storage.getChessGameMessages(game.id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chess game messages:", error);
      res.status(500).json({ message: "Failed to fetch chess game messages" });
    }
  });

  app.post('/api/chess/games/:roomId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const { roomId } = req.params;
      const messageData = insertChessMessageSchema.parse(req.body);
      
      const game = await storage.getChessGame(roomId);
      if (!game) {
        return res.status(404).json({ message: "Game not found" });
      }
      
      const message = await storage.addChessGameMessage(game.id, userId, messageData);
      res.json(message);
    } catch (error) {
      console.error("Error adding chess game message:", error);
      res.status(500).json({ message: "Failed to add chess game message" });
    }
  });

  app.get('/api/chess/user/games', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id.toString();
      const games = await storage.getUserChessGames(userId);
      res.json(games);
    } catch (error) {
      console.error("Error fetching user chess games:", error);
      res.status(500).json({ message: "Failed to fetch user chess games" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time chess gameplay
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Store active chess games and socket connections
  const activeGames = new Map<string, { chess: Chess; players: Map<string, any> }>();
  const userSockets = new Map<string, string>(); // userId -> socketId mapping

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join chess game room
    socket.on('join-chess-game', async (data) => {
      try {
        const { roomId, userId } = data;
        
        // Get game from database
        const game = await storage.getChessGame(roomId);
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        // Initialize or get chess game instance
        if (!activeGames.has(roomId)) {
          const chess = new Chess();
          if (game.currentFen && game.currentFen !== chess.fen()) {
            chess.load(game.currentFen);
          }
          activeGames.set(roomId, {
            chess,
            players: new Map()
          });
        }

        const gameInstance = activeGames.get(roomId)!;
        gameInstance.players.set(userId, socket.id);
        userSockets.set(userId, socket.id);

        // Join the room
        socket.join(roomId);

        // Send current game state
        socket.emit('game-state', {
          fen: gameInstance.chess.fen(),
          turn: gameInstance.chess.turn(),
          isCheck: gameInstance.chess.isCheck(),
          isCheckmate: gameInstance.chess.isCheckmate(),
          isStalemate: gameInstance.chess.isStalemate(),
          isDraw: gameInstance.chess.isDraw(),
          gameStatus: game.gameStatus,
          whitePlayer: game.whitePlayer,
          blackPlayer: game.blackPlayer,
          history: gameInstance.chess.history()
        });

        // Load and send chat messages
        const messages = await storage.getChessGameMessages(game.id);
        socket.emit('chat-history', messages);

        console.log(`User ${userId} joined game ${roomId}`);
        
        // Get updated game state after potential join
        const updatedGame = await storage.getChessGame(roomId);
        
        // Send updated game state to all players in the room
        io.to(roomId).emit('game-state', {
          fen: gameInstance.chess.fen(),
          turn: gameInstance.chess.turn(),
          isCheck: gameInstance.chess.isCheck(),
          isCheckmate: gameInstance.chess.isCheckmate(),
          isStalemate: gameInstance.chess.isStalemate(),
          isDraw: gameInstance.chess.isDraw(),
          gameStatus: updatedGame?.gameStatus || game.gameStatus,
          whitePlayer: updatedGame?.whitePlayer || game.whitePlayer,
          blackPlayer: updatedGame?.blackPlayer || game.blackPlayer,
          history: gameInstance.chess.history()
        });
        
        // Notify other players about the join
        socket.to(roomId).emit('player-joined', {
          userId,
          whitePlayer: updatedGame?.whitePlayer || game.whitePlayer,
          blackPlayer: updatedGame?.blackPlayer || game.blackPlayer
        });
      } catch (error) {
        console.error('Error joining chess game:', error);
        socket.emit('error', { message: 'Failed to join game' });
      }
    });

    // Handle chess moves
    socket.on('chess-move', async (data) => {
      try {
        const { roomId, move, userId } = data;
        
        const game = await storage.getChessGame(roomId);
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        const gameInstance = activeGames.get(roomId);
        if (!gameInstance) {
          socket.emit('error', { message: 'Game instance not found' });
          return;
        }

        // Validate turn
        const isWhiteTurn = gameInstance.chess.turn() === 'w';
        const isWhitePlayer = game.whitePlayer?.id?.toString() === userId.toString();
        const isBlackPlayer = game.blackPlayer?.id?.toString() === userId.toString();

        if ((isWhiteTurn && !isWhitePlayer) || (!isWhiteTurn && !isBlackPlayer)) {
          socket.emit('error', { message: 'Not your turn' });
          return;
        }

        // Attempt to make the move
        const result = gameInstance.chess.move(move);
        if (!result) {
          socket.emit('error', { message: 'Invalid move' });
          return;
        }

        // Update game state in database
        const newGameState: any = {
          currentFen: gameInstance.chess.fen()
        };

        // Check for game end
        if (gameInstance.chess.isGameOver()) {
          if (gameInstance.chess.isCheckmate()) {
            newGameState.gameStatus = 'finished';
            newGameState.winner = gameInstance.chess.turn() === 'w' ? 'black' : 'white';
          } else if (gameInstance.chess.isStalemate() || gameInstance.chess.isDraw()) {
            newGameState.gameStatus = 'finished';
            newGameState.winner = 'draw';
          }
        } else if (game.gameStatus === 'waiting' && game.whitePlayer && game.blackPlayer) {
          newGameState.gameStatus = 'active';
        }

        await storage.updateChessGame(roomId, newGameState);

        // Broadcast move to all players in the room
        io.to(roomId).emit('move-made', {
          move: result,
          fen: gameInstance.chess.fen(),
          turn: gameInstance.chess.turn(),
          isCheck: gameInstance.chess.isCheck(),
          isCheckmate: gameInstance.chess.isCheckmate(),
          isStalemate: gameInstance.chess.isStalemate(),
          isDraw: gameInstance.chess.isDraw(),
          gameStatus: newGameState.gameStatus,
          winner: newGameState.winner,
          history: gameInstance.chess.history()
        });

        // Clean up finished games from active games
        if (newGameState.gameStatus === 'finished') {
          activeGames.delete(roomId);
          console.log(`Game ${roomId} finished and removed from active games`);
        }

        console.log(`Move made in game ${roomId}: ${result.san}`);
      } catch (error) {
        console.error('Error making chess move:', error);
        socket.emit('error', { message: 'Failed to make move' });
      }
    });

    // Handle chat messages
    socket.on('chess-chat', async (data) => {
      try {
        const { roomId, message, userId } = data;
        
        const game = await storage.getChessGame(roomId);
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        // Save message to database
        const chatMessage = await storage.addChessGameMessage(game.id, userId, {
          message,
          messageType: 'chat'
        });

        // Get user info for the message
        const user = await storage.getUser(userId);
        const messageWithUser = {
          ...chatMessage,
          user
        };

        // Broadcast message to all players in the room
        io.to(roomId).emit('chat-message', messageWithUser);

        console.log(`Chat message in game ${roomId}: ${message}`);
      } catch (error) {
        console.error('Error sending chat message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle AI moves (for single-player games)
    socket.on('request-ai-move', async (data) => {
      try {
        const { roomId, userId } = data;
        
        const game = await storage.getChessGame(roomId);
        if (!game || game.gameType !== 'ai') {
          socket.emit('error', { message: 'AI move not available for this game' });
          return;
        }

        const gameInstance = activeGames.get(roomId);
        if (!gameInstance) {
          socket.emit('error', { message: 'Game instance not found' });
          return;
        }

        // Simple AI: make a random legal move
        const possibleMoves = gameInstance.chess.moves();
        if (possibleMoves.length === 0) {
          return; // Game is over
        }

        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const result = gameInstance.chess.move(randomMove);

        if (result) {
          // Update game state in database
          const newGameState: any = {
            currentFen: gameInstance.chess.fen()
          };

          await storage.updateChessGame(roomId, newGameState);

          // Broadcast AI move
          io.to(roomId).emit('ai-move-made', {
            move: result,
            fen: gameInstance.chess.fen(),
            turn: gameInstance.chess.turn(),
            isCheck: gameInstance.chess.isCheck(),
            isCheckmate: gameInstance.chess.isCheckmate(),
            isStalemate: gameInstance.chess.isStalemate(),
            isDraw: gameInstance.chess.isDraw(),
            history: gameInstance.chess.history()
          });

          console.log(`AI move made in game ${roomId}: ${result.san}`);
        }
      } catch (error) {
        console.error('Error making AI move:', error);
        socket.emit('error', { message: 'Failed to make AI move' });
      }
    });

    // Handle resignation
    socket.on('chess-resign', async (data) => {
      try {
        const { roomId, userId } = data;
        
        const game = await storage.getChessGame(roomId);
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        const gameInstance = activeGames.get(roomId);
        if (!gameInstance) {
          socket.emit('error', { message: 'Game instance not found' });
          return;
        }

        // Determine winner (opponent of the resigning player)
        const isWhitePlayer = game.whitePlayer?.id?.toString() === userId.toString();
        const winner = isWhitePlayer ? 'black' : 'white';

        // Update game state
        await storage.updateChessGame(roomId, {
          gameStatus: 'finished',
          winner: winner
        });

        // Broadcast resignation
        io.to(roomId).emit('game-state', {
          fen: gameInstance.chess.fen(),
          turn: gameInstance.chess.turn(),
          isCheck: gameInstance.chess.isCheck(),
          isCheckmate: false,
          isStalemate: false,
          isDraw: false,
          gameStatus: 'finished',
          winner: winner,
          history: gameInstance.chess.history(),
          whitePlayer: game.whitePlayer,
          blackPlayer: game.blackPlayer
        });

        // Clean up finished game from active games
        activeGames.delete(roomId);
        console.log(`Player ${userId} resigned in game ${roomId} - game removed from active games`);
      } catch (error) {
        console.error('Error handling resignation:', error);
        socket.emit('error', { message: 'Failed to resign' });
      }
    });

    // Handle draw offers
    socket.on('offer-draw', async ({ roomId, userId }) => {
      try {
        const game = await storage.getChessGame(roomId);
        if (!game) return;

        const user = await storage.getUser(userId.toString());
        if (!user) return;

        // Broadcast draw offer to the other player
        socket.to(roomId).emit('draw-offer', {
          from: userId.toString(),
          username: user.username
        });

        console.log(`Draw offer from ${user.username} in game ${roomId}`);
      } catch (error) {
        console.error('Error offering draw:', error);
      }
    });

    // Handle draw acceptance
    socket.on('accept-draw', async ({ roomId, userId }) => {
      try {
        const game = await storage.getChessGame(roomId);
        if (!game) return;

        // Update game status to draw
        await storage.updateChessGame(roomId, {
          gameStatus: 'finished',
          winner: 'draw'
        });

        const gameInstance = activeGames.get(roomId);
        
        // Broadcast draw
        io.to(roomId).emit('game-state', {
          fen: gameInstance?.chess.fen() || game.currentFen,
          turn: gameInstance?.chess.turn() || 'w',
          isCheck: false,
          isCheckmate: false,
          isStalemate: false,
          isDraw: true,
          gameStatus: 'finished',
          winner: 'draw',
          history: gameInstance?.chess.history() || [],
          whitePlayer: game.whitePlayer,
          blackPlayer: game.blackPlayer
        });

        // Clean up finished game from active games
        activeGames.delete(roomId);
        console.log(`Draw accepted in game ${roomId} - game removed from active games`);
      } catch (error) {
        console.error('Error accepting draw:', error);
      }
    });

    // Handle draw decline
    socket.on('decline-draw', async ({ roomId, userId }) => {
      try {
        // Notify the offering player that draw was declined
        socket.to(roomId).emit('draw-offer-declined');
        console.log(`Draw offer declined in game ${roomId}`);
      } catch (error) {
        console.error('Error declining draw:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove user from active games
      for (const [roomId, gameData] of activeGames.entries()) {
        for (const [userId, socketId] of gameData.players.entries()) {
          if (socketId === socket.id) {
            gameData.players.delete(userId);
            userSockets.delete(userId);
            
            // Notify other players
            socket.to(roomId).emit('player-disconnected', { userId });
            
            // Clean up empty games
            if (gameData.players.size === 0) {
              activeGames.delete(roomId);
            }
            break;
          }
        }
      }
    });
  });

  return httpServer;
}
