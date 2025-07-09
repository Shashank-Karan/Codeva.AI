import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  authorId: integer("author_id").notNull().references(() => users.id),
  content: text("content"),
  code: text("code"),
  language: varchar("language"),
  image: text("image"), // Base64 encoded image or URL
  video: text("video"), // Base64 encoded video or URL
  likes: integer("likes").default(0),
  commentsCount: integer("comments_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Post likes table
export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Code analysis results table
export const codeAnalysis = pgTable("code_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title"),
  code: text("code").notNull(),
  language: varchar("language").notNull(),
  explanation: text("explanation"),
  flowchart: text("flowchart"),
  lineByLineAnalysis: jsonb("line_by_line_analysis"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Debug results table
export const debugResults = pgTable("debug_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originalCode: text("original_code").notNull(),
  language: varchar("language").notNull(),
  issues: jsonb("issues"),
  fixedCode: text("fixed_code"),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chess games table
export const chessGames = pgTable("chess_games", {
  id: serial("id").primaryKey(),
  roomId: varchar("room_id").notNull().unique(),
  whitePlayerId: integer("white_player_id").references(() => users.id),
  blackPlayerId: integer("black_player_id").references(() => users.id),
  gameState: jsonb("game_state").notNull(), // Chess.js game state
  currentFen: text("current_fen").notNull(),
  gameStatus: varchar("game_status").notNull().default("waiting"), // waiting, active, finished
  winner: varchar("winner"), // white, black, draw
  gameType: varchar("game_type").notNull().default("multiplayer"), // multiplayer, ai
  isPrivate: boolean("is_private").default(false),
  password: varchar("password"),
  moveHistory: jsonb("move_history").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chess game messages table
export const chessGameMessages = pgTable("chess_game_messages", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id").notNull().references(() => chessGames.id),
  userId: integer("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  messageType: varchar("message_type").default("chat"), // chat, system, game_event
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  postLikes: many(postLikes),
  codeAnalysis: many(codeAnalysis),
  debugResults: many(debugResults),
  whiteChessGames: many(chessGames, { relationName: "whitePlayer" }),
  blackChessGames: many(chessGames, { relationName: "blackPlayer" }),
  chessGameMessages: many(chessGameMessages),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  likes: many(postLikes),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  post: one(posts, {
    fields: [postLikes.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
}));

export const chessGamesRelations = relations(chessGames, ({ one, many }) => ({
  whitePlayer: one(users, {
    fields: [chessGames.whitePlayerId],
    references: [users.id],
    relationName: "whitePlayer",
  }),
  blackPlayer: one(users, {
    fields: [chessGames.blackPlayerId],
    references: [users.id],
    relationName: "blackPlayer",
  }),
  messages: many(chessGameMessages),
}));

export const chessGameMessagesRelations = relations(chessGameMessages, ({ one }) => ({
  game: one(chessGames, {
    fields: [chessGameMessages.gameId],
    references: [chessGames.id],
  }),
  user: one(users, {
    fields: [chessGameMessages.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertPostSchema = createInsertSchema(posts).pick({
  content: true,
  code: true,
  language: true,
  image: true,
  video: true,
}).extend({
  content: z.string().optional(),
});

export const insertCodeAnalysisSchema = createInsertSchema(codeAnalysis).pick({
  title: true,
  code: true,
  language: true,
});

export const insertDebugSchema = createInsertSchema(debugResults).pick({
  originalCode: true,
  language: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
}).extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const insertChessGameSchema = createInsertSchema(chessGames).pick({
  roomId: true,
  gameType: true,
  isPrivate: true,
  password: true,
}).extend({
  password: z.string().optional(),
});

export const insertChessMessageSchema = createInsertSchema(chessGameMessages).pick({
  message: true,
  messageType: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Post = typeof posts.$inferSelect;
export type PostWithAuthor = Post & { author: User | null; isLiked?: boolean };
export type InsertPost = z.infer<typeof insertPostSchema>;
export type CodeAnalysis = typeof codeAnalysis.$inferSelect;
export type InsertCodeAnalysis = z.infer<typeof insertCodeAnalysisSchema>;
export type DebugResult = typeof debugResults.$inferSelect;
export type InsertDebugRequest = z.infer<typeof insertDebugSchema>;
export type ChessGame = typeof chessGames.$inferSelect;
export type ChessGameWithPlayers = ChessGame & {
  whitePlayer: User | null;
  blackPlayer: User | null;
  messages?: ChessGameMessage[];
};
export type InsertChessGame = z.infer<typeof insertChessGameSchema>;
export type ChessGameMessage = typeof chessGameMessages.$inferSelect;
export type ChessGameMessageWithUser = ChessGameMessage & { user: User | null };
export type InsertChessMessage = z.infer<typeof insertChessMessageSchema>;
