import {
  users,
  posts,
  postLikes,
  codeAnalysis,
  debugResults,
  chessGames,
  chessGameMessages,
  type User,
  type UpsertUser,
  type Post,
  type PostWithAuthor,
  type InsertPost,
  type CodeAnalysis,
  type InsertCodeAnalysis,
  type DebugResult,
  type InsertDebugRequest,
  type ChessGame,
  type ChessGameWithPlayers,
  type InsertChessGame,
  type ChessGameMessage,
  type ChessGameMessageWithUser,
  type InsertChessMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Post operations
  createPost(authorId: string, post: InsertPost): Promise<Post>;
  getPosts(userId?: string): Promise<PostWithAuthor[]>;
  likePost(postId: number, userId: string): Promise<void>;
  unlikePost(postId: number, userId: string): Promise<void>;
  
  // Code analysis operations
  saveCodeAnalysis(userId: string | undefined, analysis: InsertCodeAnalysis, results: any): Promise<CodeAnalysis>;
  getUserCodeAnalyses(userId: string): Promise<CodeAnalysis[]>;
  
  // Debug operations
  saveDebugResult(userId: string | undefined, request: InsertDebugRequest, results: any): Promise<DebugResult>;
  getUserDebugResults(userId: string): Promise<DebugResult[]>;
  
  // Chess game operations
  createChessGame(userId: string, gameData: InsertChessGame): Promise<ChessGame>;
  getChessGame(roomId: string): Promise<ChessGameWithPlayers | undefined>;
  updateChessGame(roomId: string, gameData: Partial<ChessGame>): Promise<ChessGame>;
  joinChessGame(roomId: string, userId: string, password?: string): Promise<ChessGameWithPlayers>;
  getActiveChessGames(): Promise<ChessGameWithPlayers[]>;
  getUserChessGames(userId: string): Promise<ChessGameWithPlayers[]>;
  
  // Chess game messages
  addChessGameMessage(gameId: number, userId: string, message: InsertChessMessage): Promise<ChessGameMessage>;
  getChessGameMessages(gameId: number): Promise<ChessGameMessageWithUser[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(id)));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Post operations
  async createPost(authorId: string, post: InsertPost): Promise<Post> {
    const [newPost] = await db
      .insert(posts)
      .values({
        ...post,
        authorId: parseInt(authorId),
      })
      .returning();
    return newPost;
  }

  async getPosts(userId?: string): Promise<PostWithAuthor[]> {
    const postsWithAuthors = await db
      .select({
        id: posts.id,
        authorId: posts.authorId,
        content: posts.content,
        code: posts.code,
        language: posts.language,
        image: posts.image,
        video: posts.video,
        likes: posts.likes,
        commentsCount: posts.commentsCount,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        },
        isLiked: userId 
          ? sql<boolean>`EXISTS (SELECT 1 FROM ${postLikes} WHERE ${postLikes.postId} = ${posts.id} AND ${postLikes.userId} = ${userId})`
          : sql<boolean>`false`,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .orderBy(desc(posts.createdAt));

    return postsWithAuthors as PostWithAuthor[];
  }

  async likePost(postId: number, userId: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Insert like
      await tx.insert(postLikes).values({ postId, userId: parseInt(userId) }).onConflictDoNothing();
      
      // Update like count
      await tx
        .update(posts)
        .set({ likes: sql`${posts.likes} + 1` })
        .where(eq(posts.id, postId));
    });
  }

  async unlikePost(postId: number, userId: string): Promise<void> {
    await db.transaction(async (tx) => {
      // Remove like
      await tx
        .delete(postLikes)
        .where(sql`${postLikes.postId} = ${postId} AND ${postLikes.userId} = ${userId}`);
      
      // Update like count
      await tx
        .update(posts)
        .set({ likes: sql`${posts.likes} - 1` })
        .where(eq(posts.id, postId));
    });
  }

  // Code analysis operations
  async saveCodeAnalysis(userId: string | undefined, analysisData: InsertCodeAnalysis, results: any): Promise<CodeAnalysis> {
    const [analysis] = await db
      .insert(codeAnalysis)
      .values({
        ...analysisData,
        userId: userId ? parseInt(userId) : null,
        explanation: results.explanation,
        flowchart: results.flowchart,
        lineByLineAnalysis: results.lineByLineAnalysis,
      })
      .returning();
    return analysis;
  }

  async getUserCodeAnalyses(userId: string): Promise<CodeAnalysis[]> {
    return await db
      .select()
      .from(codeAnalysis)
      .where(eq(codeAnalysis.userId, parseInt(userId)))
      .orderBy(desc(codeAnalysis.createdAt));
  }

  // Debug operations
  async saveDebugResult(userId: string | undefined, request: InsertDebugRequest, results: any): Promise<DebugResult> {
    const [debugResult] = await db
      .insert(debugResults)
      .values({
        ...request,
        userId: userId ? parseInt(userId) : null,
        issues: results.issues,
        fixedCode: results.fixedCode,
        explanation: results.explanation,
      })
      .returning();
    return debugResult;
  }

  async getUserDebugResults(userId: string): Promise<DebugResult[]> {
    return await db
      .select()
      .from(debugResults)
      .where(eq(debugResults.userId, parseInt(userId)))
      .orderBy(desc(debugResults.createdAt));
  }

  // Chess game operations
  async createChessGame(userId: string, gameData: InsertChessGame): Promise<ChessGame> {
    const [game] = await db
      .insert(chessGames)
      .values({
        ...gameData,
        whitePlayerId: parseInt(userId),
        gameState: { moves: [], turn: 'w', history: [] },
        currentFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      })
      .returning();
    return game;
  }

  async getChessGame(roomId: string): Promise<ChessGameWithPlayers | undefined> {
    const games = await db
      .select()
      .from(chessGames)
      .where(eq(chessGames.roomId, roomId));

    if (games.length === 0) return undefined;

    const game = games[0];
    let whitePlayer = null;
    let blackPlayer = null;

    if (game.whitePlayerId) {
      whitePlayer = await this.getUser(game.whitePlayerId.toString());
    }
    if (game.blackPlayerId) {
      blackPlayer = await this.getUser(game.blackPlayerId.toString());
    }

    return {
      ...game,
      whitePlayer,
      blackPlayer,
    };
  }

  async updateChessGame(roomId: string, gameData: Partial<ChessGame>): Promise<ChessGame> {
    const [game] = await db
      .update(chessGames)
      .set({ ...gameData, updatedAt: new Date() })
      .where(eq(chessGames.roomId, roomId))
      .returning();
    return game;
  }

  async joinChessGame(roomId: string, userId: string, password?: string): Promise<ChessGameWithPlayers> {
    const game = await this.getChessGame(roomId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.isPrivate && game.password !== password) {
      throw new Error('Invalid password');
    }

    if (game.whitePlayerId && game.blackPlayerId) {
      throw new Error('Game is full');
    }

    // Check if user is already in the game
    if (game.whitePlayerId?.toString() === userId || game.blackPlayerId?.toString() === userId) {
      return game;
    }

    // Assign to available slot
    const updateData: any = {};
    if (!game.whitePlayerId) {
      updateData.whitePlayerId = parseInt(userId);
    } else if (!game.blackPlayerId) {
      updateData.blackPlayerId = parseInt(userId);
    }

    // Only set to active if both players are present after this join
    if ((game.whitePlayerId && updateData.blackPlayerId) || (game.blackPlayerId && updateData.whitePlayerId)) {
      updateData.gameStatus = 'active';
    }

    await this.updateChessGame(roomId, updateData);

    return await this.getChessGame(roomId) as ChessGameWithPlayers;
  }

  async getActiveChessGames(): Promise<ChessGameWithPlayers[]> {
    const games = await db
      .select()
      .from(chessGames)
      .where(sql`${chessGames.gameStatus} IN ('waiting', 'active')`)
      .orderBy(desc(chessGames.createdAt));

    const gamesWithPlayers = [];
    for (const game of games) {
      let whitePlayer = null;
      let blackPlayer = null;

      if (game.whitePlayerId) {
        whitePlayer = await this.getUser(game.whitePlayerId.toString());
      }
      if (game.blackPlayerId) {
        blackPlayer = await this.getUser(game.blackPlayerId.toString());
      }

      gamesWithPlayers.push({
        ...game,
        whitePlayer,
        blackPlayer,
      });
    }

    return gamesWithPlayers;
  }

  async getUserChessGames(userId: string): Promise<ChessGameWithPlayers[]> {
    const games = await db
      .select()
      .from(chessGames)
      .where(sql`${chessGames.whitePlayerId} = ${parseInt(userId)} OR ${chessGames.blackPlayerId} = ${parseInt(userId)}`)
      .orderBy(desc(chessGames.createdAt));

    const gamesWithPlayers = [];
    for (const game of games) {
      let whitePlayer = null;
      let blackPlayer = null;

      if (game.whitePlayerId) {
        whitePlayer = await this.getUser(game.whitePlayerId.toString());
      }
      if (game.blackPlayerId) {
        blackPlayer = await this.getUser(game.blackPlayerId.toString());
      }

      gamesWithPlayers.push({
        ...game,
        whitePlayer,
        blackPlayer,
      });
    }

    return gamesWithPlayers;
  }

  // Chess game messages
  async addChessGameMessage(gameId: number, userId: string, message: InsertChessMessage): Promise<ChessGameMessage> {
    const [newMessage] = await db
      .insert(chessGameMessages)
      .values({
        ...message,
        gameId,
        userId: parseInt(userId),
      })
      .returning();
    return newMessage;
  }

  async getChessGameMessages(gameId: number): Promise<ChessGameMessageWithUser[]> {
    const messages = await db
      .select()
      .from(chessGameMessages)
      .where(eq(chessGameMessages.gameId, gameId))
      .orderBy(chessGameMessages.createdAt);

    const messagesWithUsers = [];
    for (const message of messages) {
      const user = await this.getUser(message.userId.toString());
      messagesWithUsers.push({
        ...message,
        user,
      });
    }

    return messagesWithUsers;
  }
}

export const storage = new DatabaseStorage();
