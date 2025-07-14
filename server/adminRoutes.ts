import type { Express } from "express";
import { storage } from "./storage";
import { eq, desc, and, gte, count, sql } from "drizzle-orm";
import { users, posts, codeAnalysis, debugResults, adminLogs, systemSettings, notifications, loginAttempts } from "@shared/schema";
import { db } from "./db";

// Middleware to check if user is admin - Only allow owner
function isAdmin(req: any, res: any, next: any) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Only allow user with username 'admin' to access admin panel
  if (req.user.username !== 'admin') {
    return res.status(403).json({ message: "Access denied - Only owner can access admin panel" });
  }
  
  next();
}

// Helper function to log admin actions
async function logAdminAction(adminId: number, action: string, targetType?: string, targetId?: string, description?: string, req?: any) {
  try {
    await db.insert(adminLogs).values({
      adminId,
      action,
      targetType,
      targetId,
      description,
      ipAddress: req?.ip || req?.connection?.remoteAddress,
      userAgent: req?.get('User-Agent'),
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
}

export function registerAdminRoutes(app: Express) {
  
  // Dashboard Stats
  app.get("/api/admin/dashboard/stats", isAdmin, async (req: any, res) => {
    try {
      const timeRange = req.query.timeRange || "24h";
      let dateFilter = new Date();
      
      switch (timeRange) {
        case "24h":
          dateFilter.setHours(dateFilter.getHours() - 24);
          break;
        case "7d":
          dateFilter.setDate(dateFilter.getDate() - 7);
          break;
        case "30d":
          dateFilter.setDate(dateFilter.getDate() - 30);
          break;
      }

      const [
        totalUsers,
        activeUsers,
        bannedUsers,
        totalPosts,
        totalAnalyses,
        totalChessGames,
        recentLogins,
        systemAlerts
      ] = await Promise.all([
        db.select({ count: count() }).from(users),
        db.select({ count: count() }).from(users).where(and(eq(users.isActive, true), eq(users.isBanned, false))),
        db.select({ count: count() }).from(users).where(eq(users.isBanned, true)),
        db.select({ count: count() }).from(posts),
        db.select({ count: count() }).from(codeAnalysis),
        db.select({ count: count() }).from(users), // Placeholder for chess games
        db.select({ count: count() }).from(users).where(gte(users.lastLoginAt, dateFilter)),
        db.select({ count: count() }).from(notifications).where(eq(notifications.type, "error"))
      ]);

      res.json({
        totalUsers: totalUsers[0]?.count || 0,
        activeUsers: activeUsers[0]?.count || 0,
        bannedUsers: bannedUsers[0]?.count || 0,
        totalPosts: totalPosts[0]?.count || 0,
        totalAnalyses: totalAnalyses[0]?.count || 0,
        totalChessGames: 0, // Placeholder
        recentLogins: recentLogins[0]?.count || 0,
        systemAlerts: systemAlerts[0]?.count || 0
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Recent Activity
  app.get("/api/admin/dashboard/activity", isAdmin, async (req: any, res) => {
    try {
      const recentActivity = await db
        .select()
        .from(adminLogs)
        .orderBy(desc(adminLogs.createdAt))
        .limit(10);

      res.json(recentActivity);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // System Alerts
  app.get("/api/admin/dashboard/alerts", isAdmin, async (req: any, res) => {
    try {
      const alerts = [];
      
      // Check for failed login attempts in the last hour
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      const failedLogins = await db
        .select({ count: count() })
        .from(loginAttempts)
        .where(and(
          eq(loginAttempts.success, false),
          gte(loginAttempts.attemptedAt, oneHourAgo)
        ));

      if (failedLogins[0]?.count > 5) {
        alerts.push({
          type: "error",
          priority: "High Priority",
          message: `${failedLogins[0].count} failed login attempts detected`,
          timestamp: new Date(),
          color: "red"
        });
      }

      // Check for new user registrations spike
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);
      
      const newUsers = await db
        .select({ count: count() })
        .from(users)
        .where(gte(users.createdAt, last24Hours));

      if (newUsers[0]?.count > 10) {
        alerts.push({
          type: "info",
          priority: "Info",
          message: "New user registration spike detected",
          timestamp: new Date(),
          color: "blue"
        });
      }

      // Check system health (placeholder)
      alerts.push({
        type: "warning",
        priority: "Medium Priority", 
        message: "System performing optimally",
        timestamp: new Date(),
        color: "yellow"
      });

      res.json(alerts);
    } catch (error) {
      console.error("Error fetching system alerts:", error);
      res.status(500).json({ message: "Failed to fetch system alerts" });
    }
  });

  // User Management
  app.get("/api/admin/users", isAdmin, async (req: any, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
      const search = req.query.search as string;
      const role = req.query.role as string;
      const status = req.query.status as string;

      let query = db.select().from(users);
      let countQuery = db.select({ count: count() }).from(users);

      // Apply filters
      const conditions = [];
      if (search) {
        conditions.push(sql`${users.username} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`}`);
      }
      if (role && role !== "all") {
        conditions.push(eq(users.role, role));
      }
      if (status === "active") {
        conditions.push(and(eq(users.isActive, true), eq(users.isBanned, false)));
      } else if (status === "banned") {
        conditions.push(eq(users.isBanned, true));
      }

      if (conditions.length > 0) {
        const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
        query = query.where(whereClause);
        countQuery = countQuery.where(whereClause);
      }

      const [userList, totalCount] = await Promise.all([
        query.orderBy(desc(users.createdAt)).limit(limit).offset(offset),
        countQuery
      ]);

      res.json({
        users: userList,
        total: totalCount[0]?.count || 0,
        hasMore: offset + limit < (totalCount[0]?.count || 0)
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Create User
  app.post("/api/admin/users", isAdmin, async (req: any, res) => {
    try {
      const { username, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (existingEmail.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password using the same method as auth.ts
      const { randomBytes, scrypt } = await import("crypto");
      const { promisify } = await import("util");
      const scryptAsync = promisify(scrypt);
      
      const salt = randomBytes(16).toString("hex");
      const buf = (await scryptAsync(password, salt, 64)) as Buffer;
      const hashedPassword = `${buf.toString("hex")}.${salt}`;

      // Create the user
      const newUser = await db.insert(users).values({
        username,
        email,
        password: hashedPassword,
        role: role || "user",
        isActive: true,
        isBanned: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      await logAdminAction(
        req.user.id,
        "create",
        "user",
        newUser[0].id.toString(),
        `Created new user: ${username}`,
        req
      );

      res.json({ success: true, user: newUser[0] });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Ban User
  app.post("/api/admin/users/:id/ban", isAdmin, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { reason } = req.body;

      await db.update(users).set({ isBanned: true }).where(eq(users.id, userId));
      
      await logAdminAction(
        req.user.id,
        "ban",
        "user",
        userId.toString(),
        `Banned user with reason: ${reason}`,
        req
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error banning user:", error);
      res.status(500).json({ message: "Failed to ban user" });
    }
  });

  // Unban User
  app.post("/api/admin/users/:id/unban", isAdmin, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);

      await db.update(users).set({ isBanned: false }).where(eq(users.id, userId));
      
      await logAdminAction(
        req.user.id,
        "unban",
        "user",
        userId.toString(),
        "Unbanned user",
        req
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error unbanning user:", error);
      res.status(500).json({ message: "Failed to unban user" });
    }
  });

  // Update User Role
  app.put("/api/admin/users/:id/role", isAdmin, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;

      await db.update(users).set({ role }).where(eq(users.id, userId));
      
      await logAdminAction(
        req.user.id,
        "update",
        "user",
        userId.toString(),
        `Updated user role to: ${role}`,
        req
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Delete User
  app.delete("/api/admin/users/:id", isAdmin, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);

      await db.delete(users).where(eq(users.id, userId));
      
      await logAdminAction(
        req.user.id,
        "delete",
        "user",
        userId.toString(),
        "Deleted user account",
        req
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // System Settings
  app.get("/api/admin/settings", isAdmin, async (req: any, res) => {
    try {
      const settings = await db.select().from(systemSettings);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", isAdmin, async (req: any, res) => {
    try {
      const { key, value } = req.body;

      await db.insert(systemSettings).values({
        key,
        value,
        updatedBy: req.user.id
      }).onConflictDoUpdate({
        target: systemSettings.key,
        set: { 
          value,
          updatedBy: req.user.id,
          updatedAt: new Date()
        }
      });

      await logAdminAction(
        req.user.id,
        "update",
        "setting",
        key,
        `Updated setting ${key} to: ${value}`,
        req
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Audit Logs
  app.get("/api/admin/logs", isAdmin, async (req: any, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 20;
      const offset = (page - 1) * limit;
      const search = req.query.search as string;
      const action = req.query.action as string;
      const timeRange = req.query.timeRange as string;
      const adminId = req.query.adminId as string;

      let query = db.select().from(adminLogs);
      let countQuery = db.select({ count: count() }).from(adminLogs);

      const conditions = [];
      
      if (search) {
        conditions.push(sql`${adminLogs.description} ILIKE ${`%${search}%`} OR ${adminLogs.action} ILIKE ${`%${search}%`}`);
      }
      if (action && action !== "all") {
        conditions.push(eq(adminLogs.action, action));
      }
      if (adminId && adminId !== "all") {
        conditions.push(eq(adminLogs.adminId, parseInt(adminId)));
      }
      if (timeRange && timeRange !== "all") {
        let dateFilter = new Date();
        switch (timeRange) {
          case "1h":
            dateFilter.setHours(dateFilter.getHours() - 1);
            break;
          case "24h":
            dateFilter.setHours(dateFilter.getHours() - 24);
            break;
          case "7d":
            dateFilter.setDate(dateFilter.getDate() - 7);
            break;
          case "30d":
            dateFilter.setDate(dateFilter.getDate() - 30);
            break;
        }
        conditions.push(gte(adminLogs.createdAt, dateFilter));
      }

      if (conditions.length > 0) {
        const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
        query = query.where(whereClause);
        countQuery = countQuery.where(whereClause);
      }

      const [logs, totalCount] = await Promise.all([
        query.orderBy(desc(adminLogs.createdAt)).limit(limit).offset(offset),
        countQuery
      ]);

      res.json({
        logs,
        total: totalCount[0]?.count || 0,
        hasMore: offset + limit < (totalCount[0]?.count || 0)
      });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Content Management - Posts
  app.get("/api/admin/posts", isAdmin, async (req: any, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;

      const [postList, totalCount] = await Promise.all([
        db.select({
          id: posts.id,
          content: posts.content,
          code: posts.code,
          language: posts.language,
          likes: posts.likes,
          commentsCount: posts.commentsCount,
          createdAt: posts.createdAt,
          author: {
            id: users.id,
            username: users.username,
            email: users.email
          }
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .orderBy(desc(posts.createdAt))
        .limit(limit)
        .offset(offset),
        
        db.select({ count: count() }).from(posts)
      ]);

      res.json({
        posts: postList,
        total: totalCount[0]?.count || 0,
        hasMore: offset + limit < (totalCount[0]?.count || 0)
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Analytics
  app.get("/api/admin/analytics", isAdmin, async (req: any, res) => {
    try {
      const timeRange = req.query.timeRange || "30d";
      
      // Generate sample data for analytics
      const userGrowth = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        users: Math.floor(Math.random() * 50) + 100 + i * 2
      }));

      const activity = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        activity: Math.floor(Math.random() * 100) + 20
      }));

      const languages = [
        { name: "JavaScript", value: 35 },
        { name: "Python", value: 25 },
        { name: "Java", value: 20 },
        { name: "C++", value: 12 },
        { name: "TypeScript", value: 8 }
      ];

      res.json({
        userGrowth,
        activity,
        languages
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/analytics/realtime", isAdmin, async (req: any, res) => {
    try {
      // Generate sample real-time data
      res.json({
        activeUsers: Math.floor(Math.random() * 100) + 50,
        pageViews: Math.floor(Math.random() * 1000) + 500,
        avgSession: "4m 32s",
        apiCalls: Math.floor(Math.random() * 500) + 200
      });
    } catch (error) {
      console.error("Error fetching real-time analytics:", error);
      res.status(500).json({ message: "Failed to fetch real-time analytics" });
    }
  });
}