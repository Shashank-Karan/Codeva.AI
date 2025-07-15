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

// User storage table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email").unique().notNull(),
  password: varchar("password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }).default("user"),
  isActive: boolean("is_active").default(true),
  isBanned: boolean("is_banned").default(false),
  lastLoginAt: timestamp("last_login_at"),
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
  gameName: varchar("game_name"), // Custom game name
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

// Chat conversations table
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  mode: text("mode").default("general").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => chatConversations.id, { onDelete: "cascade" }),
  type: text("type", { enum: ["user", "ai"] }).notNull(),
  content: text("content").notNull(),
  fileInfo: jsonb("file_info").$type<{ name: string; type: string; size: number }>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  chatConversations: many(chatConversations),
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

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [chatConversations.userId],
    references: [users.id],
  }),
  messages: many(chatMessages),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
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
  gameName: true,
  gameType: true,
  isPrivate: true,
  password: true,
}).extend({
  password: z.string().optional(),
  gameName: z.string().optional(),
});

export const insertChessMessageSchema = createInsertSchema(chessGameMessages).pick({
  message: true,
  messageType: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).pick({
  title: true,
  mode: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  type: true,
  content: true,
  fileInfo: true,
});

// Admin tables
export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull().references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  targetType: varchar("target_type", { length: 50 }),
  targetId: varchar("target_id"),
  description: text("description"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: text("value"),
  type: varchar("type", { length: 20 }).default("string"),
  description: text("description"),
  updatedBy: integer("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 20 }).default("info"),
  isRead: boolean("is_read").default(false),
  isGlobal: boolean("is_global").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  email: varchar("email"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  success: boolean("success").default(false),
  attemptedAt: timestamp("attempted_at").defaultNow(),
});

// Admin schemas
export const insertAdminLogSchema = createInsertSchema(adminLogs).pick({
  action: true,
  targetType: true,
  targetId: true,
  description: true,
  ipAddress: true,
  userAgent: true,
});

export const insertSystemSettingSchema = createInsertSchema(systemSettings).pick({
  key: true,
  value: true,
  type: true,
  description: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  title: true,
  message: true,
  type: true,
  isGlobal: true,
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
export type ChatConversation = typeof chatConversations.$inferSelect;
export type ChatConversationWithMessages = ChatConversation & { messages: ChatMessage[] };
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = z.infer<typeof insertSystemSettingSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type LoginAttempt = typeof loginAttempts.$inferSelect;
