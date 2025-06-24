import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import { users } from "@shared/schema";
import { insertTeamSchema, insertEventSchema, insertFacilitySchema } from "@shared/schema";
import { setupInitialSuperAdmin, hasSuperAdmin } from "./setup-admin";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin routes for role management
  app.post('/api/admin/assign-role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      // Only super_admin can assign roles
      if (currentUser?.role !== 'super_admin') {
        return res.status(403).json({ message: "Access denied. Super admin privileges required." });
      }

      const { targetUserId, role } = req.body;
      const updatedUser = await storage.updateUserRole(targetUserId, role);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "Role updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Get all users for admin management
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      // Only super_admin and admin_operations can view all users
      if (!['super_admin', 'admin_operations'].includes(currentUser?.role || '')) {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
      }

      const allUsers = await db.select().from(users).orderBy(users.createdAt);
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Debug endpoint to check auth status
  app.get('/api/debug/auth', (req: any, res) => {
    res.json({
      isAuthenticated: req.isAuthenticated(),
      user: req.user ? 'Present' : 'None',
      session: req.session ? 'Present' : 'None',
      sessionID: req.sessionID,
      cookies: req.headers.cookie || 'None',
      hostname: req.hostname,
      url: req.url
    });
  });

  // Test callback endpoint to see if callbacks are reaching the server
  app.get('/api/test-callback', (req: any, res) => {
    console.log('Test callback hit with query:', req.query);
    res.json({
      message: 'Test callback received',
      query: req.query,
      headers: req.headers
    });
  });

  // Setup initial super admin (one-time setup)
  app.post('/api/setup/super-admin', async (req: any, res) => {
    try {
      // Check if super admin already exists
      const adminExists = await hasSuperAdmin();
      if (adminExists) {
        return res.status(400).json({ message: "Super admin already exists" });
      }

      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const success = await setupInitialSuperAdmin(email);
      if (success) {
        res.json({ message: "Super admin setup successful" });
      } else {
        res.status(400).json({ message: "Failed to setup super admin. User may not exist." });
      }
    } catch (error) {
      console.error("Error setting up super admin:", error);
      res.status(500).json({ message: "Failed to setup super admin" });
    }
  });

  // Get admin stats
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!['super_admin', 'admin_operations'].includes(currentUser?.role || '')) {
        return res.status(403).json({ message: "Access denied. Admin privileges required." });
      }

      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/upcoming-events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const events = await storage.getUpcomingEvents(userId, 5);
      res.json(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      res.status(500).json({ message: "Failed to fetch upcoming events" });
    }
  });

  // Team routes
  app.get('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teams = await storage.getTeamsByOwner(userId);
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });

  app.post('/api/teams', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const teamData = insertTeamSchema.parse({ ...req.body, ownerId: userId });
      const team = await storage.createTeam(teamData);
      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(400).json({ message: "Failed to create team" });
    }
  });

  app.get('/api/teams/:id', isAuthenticated, async (req: any, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });

  app.get('/api/teams/:id/members', isAuthenticated, async (req: any, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const members = await storage.getTeamMembers(teamId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  // Event routes
  app.get('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const events = await storage.getEventsByUser(userId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.post('/api/events', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const eventData = insertEventSchema.parse({ ...req.body, organizerId: userId });
      const event = await storage.createEvent(eventData);
      res.json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(400).json({ message: "Failed to create event" });
    }
  });

  app.get('/api/events/:id', isAuthenticated, async (req: any, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Facility routes
  app.get('/api/facilities', isAuthenticated, async (req: any, res) => {
    try {
      const facilities = await storage.getFacilities();
      res.json(facilities);
    } catch (error) {
      console.error("Error fetching facilities:", error);
      res.status(500).json({ message: "Failed to fetch facilities" });
    }
  });

  app.post('/api/facilities', isAuthenticated, async (req: any, res) => {
    try {
      const facilityData = insertFacilitySchema.parse(req.body);
      const facility = await storage.createFacility(facilityData);
      res.json(facility);
    } catch (error) {
      console.error("Error creating facility:", error);
      res.status(400).json({ message: "Failed to create facility" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get('/api/notifications/unread', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUnreadNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      res.status(500).json({ message: "Failed to fetch unread notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      await storage.markNotificationAsRead(notificationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Payment routes
  app.get('/api/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const payments = await storage.getUserPayments(userId);
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  // Team messaging routes
  app.get('/api/teams/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const messages = await storage.getTeamMessages(teamId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching team messages:", error);
      res.status(500).json({ message: "Failed to fetch team messages" });
    }
  });

  app.post('/api/teams/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const teamId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { message, isUrgent, replyToId } = req.body;
      
      const newMessage = await storage.createTeamMessage(teamId, userId, message, isUrgent, replyToId);
      res.json(newMessage);
    } catch (error) {
      console.error("Error creating team message:", error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  // Game statistics routes
  app.get('/api/events/:id/stats', isAuthenticated, async (req: any, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const stats = await storage.getGameStats(eventId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching game stats:", error);
      res.status(500).json({ message: "Failed to fetch game stats" });
    }
  });

  app.post('/api/events/:id/stats', isAuthenticated, async (req: any, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const statsArray = req.body;
      
      const results = [];
      for (const stat of statsArray) {
        const result = await storage.createGameStats(eventId, stat.playerId, stat.sport, stat.stats);
        results.push(result);
      }
      
      res.json(results);
    } catch (error) {
      console.error("Error saving game stats:", error);
      res.status(400).json({ message: "Failed to save game stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
