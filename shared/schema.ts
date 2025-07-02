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
  content: text("content").notNull(),
  code: text("code"),
  language: varchar("language"),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  postLikes: many(postLikes),
  codeAnalysis: many(codeAnalysis),
  debugResults: many(debugResults),
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

// Insert schemas
export const insertPostSchema = createInsertSchema(posts).pick({
  content: true,
  code: true,
  language: true,
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
  firstName: true,
  lastName: true,
}).extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
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
