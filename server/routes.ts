import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { analyzeCode, debugCode } from "./services/gemini";
import { insertPostSchema, insertCodeAnalysisSchema, insertDebugSchema } from "@shared/schema";

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

  const httpServer = createServer(app);
  return httpServer;
}
