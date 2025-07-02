import {
  users,
  posts,
  postLikes,
  codeAnalysis,
  debugResults,
  type User,
  type UpsertUser,
  type Post,
  type PostWithAuthor,
  type InsertPost,
  type CodeAnalysis,
  type InsertCodeAnalysis,
  type DebugResult,
  type InsertDebugRequest,
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
}

export const storage = new DatabaseStorage();
