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
      
      // For development mode, return mock user data
      if (process.env.NODE_ENV === 'development' && userId === 'dev_user') {
        const mockUser = {
          id: 'dev_user',
          email: req.user.claims.email,
          firstName: req.user.claims.first_name || 'Development',
          lastName: req.user.claims.last_name || 'User',
          role: 'super_admin',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return res.json(mockUser);
      }
      
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Player routes
  app.get('/api/players', isAuthenticated, async (req, res) => {
    try {
      // Mock data for now - replace with actual database calls
      const players = [
        {
          id: "1",
          firstName: "Alex",
          lastName: "Johnson",
          dateOfBirth: "2010-05-15",
          position: "Midfielder",
          jerseyNumber: 12,
          email: "alex.johnson@email.com",
          phone: "(555) 123-4567",
          teamId: "team1",
          guardians: [
            {
              id: "g1",
              firstName: "Sarah",
              lastName: "Johnson",
              email: "sarah.johnson@email.com",
              phone: "(555) 123-4567",
              relationship: "parent",
              isEmergencyContact: true
            }
          ],
          medicalNotes: "Mild asthma - has inhaler",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "2",
          firstName: "Emma",
          lastName: "Davis",
          dateOfBirth: "2011-08-22",
          position: "Forward",
          jerseyNumber: 7,
          email: "emma.davis@email.com",
          phone: "(555) 234-5678",
          teamId: "team1",
          guardians: [
            {
              id: "g2",
              firstName: "Michael",
              lastName: "Davis",
              email: "michael.davis@email.com",
              phone: "(555) 234-5678",
              relationship: "parent",
              isEmergencyContact: true
            },
            {
              id: "g3",
              firstName: "Lisa",
              lastName: "Davis",
              email: "lisa.davis@email.com",
              phone: "(555) 234-5679",
              relationship: "parent",
              isEmergencyContact: false
            }
          ],
          medicalNotes: "No known allergies",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "3",
          firstName: "Mason",
          lastName: "Rodriguez",
          dateOfBirth: "2010-12-03",
          position: "Defender",
          jerseyNumber: 4,
          email: "mason.rodriguez@email.com",
          phone: "(555) 345-6789",
          teamId: "team1",
          guardians: [
            {
              id: "g4",
              firstName: "Carlos",
              lastName: "Rodriguez",
              email: "carlos.rodriguez@email.com",
              phone: "(555) 345-6789",
              relationship: "parent",
              isEmergencyContact: true
            }
          ],
          medicalNotes: "Lactose intolerant",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      res.json(players);
    } catch (error) {
      console.error("Error fetching players:", error);
      res.status(500).json({ message: "Failed to fetch players" });
    }
  });

  app.post('/api/players', isAuthenticated, async (req, res) => {
    try {
      const playerData = req.body;
      // In a real implementation, save to database
      const newPlayer = {
        id: Date.now().toString(),
        ...playerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      res.json(newPlayer);
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ message: "Failed to create player" });
    }
  });

  app.get('/api/players/ai-insights', isAuthenticated, async (req, res) => {
    try {
      const insights = {
        teamBalance: 85,
        avgSkillLevel: 7.2,
        completionRate: 94,
        improvementRate: 12,
        topPerformers: 5,
        needsSupport: 3
      };
      res.json(insights);
    } catch (error) {
      console.error("Error fetching player AI insights:", error);
      res.status(500).json({ message: "Failed to fetch player AI insights" });
    }
  });

  app.post('/api/players', isAuthenticated, async (req, res) => {
    try {
      const playerData = req.body;
      // Mock response - replace with actual database creation
      const newPlayer = {
        id: Date.now().toString(),
        ...playerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      res.status(201).json(newPlayer);
    } catch (error) {
      console.error("Error creating player:", error);
      res.status(500).json({ message: "Failed to create player" });
    }
  });

  app.post('/api/players/import', isAuthenticated, async (req, res) => {
    try {
      // Mock CSV import - in real implementation, parse the uploaded file
      const imported = Math.floor(Math.random() * 20) + 5;
      res.json({ imported, message: `Successfully imported ${imported} players` });
    } catch (error) {
      console.error("Error importing players:", error);
      res.status(500).json({ message: "Failed to import players" });
    }
  });

  // Skills tracking routes
  app.get('/api/skills/categories', isAuthenticated, async (req, res) => {
    try {
      const categories = [
        {
          id: "technical",
          name: "Technical Skills",
          sport: "soccer",
          skills: [
            { id: "ballControl", name: "Ball Control", description: "Ability to control and manipulate the ball", maxScore: 5 },
            { id: "passing", name: "Passing", description: "Accuracy and technique in passing", maxScore: 5 },
            { id: "shooting", name: "Shooting", description: "Goal scoring ability", maxScore: 5 },
            { id: "firstTouch", name: "First Touch", description: "Initial ball control", maxScore: 5 }
          ]
        },
        {
          id: "physical",
          name: "Physical Attributes",
          sport: "soccer",
          skills: [
            { id: "speed", name: "Speed", description: "Running pace and acceleration", maxScore: 5 },
            { id: "agility", name: "Agility", description: "Quick directional changes", maxScore: 5 },
            { id: "stamina", name: "Stamina", description: "Endurance and fitness", maxScore: 5 },
            { id: "strength", name: "Strength", description: "Physical power", maxScore: 5 }
          ]
        },
        {
          id: "tactical",
          name: "Tactical Understanding",
          sport: "soccer",
          skills: [
            { id: "positioning", name: "Positioning", description: "Field awareness", maxScore: 5 },
            { id: "decisionMaking", name: "Decision Making", description: "Game intelligence", maxScore: 5 },
            { id: "teamwork", name: "Teamwork", description: "Team collaboration", maxScore: 5 },
            { id: "communication", name: "Communication", description: "On-field communication", maxScore: 5 }
          ]
        }
      ];
      res.json(categories);
    } catch (error) {
      console.error("Error fetching skill categories:", error);
      res.status(500).json({ message: "Failed to fetch skill categories" });
    }
  });

  app.get('/api/skills/assessments', isAuthenticated, async (req, res) => {
    try {
      const assessments = [
        {
          id: "1",
          playerId: "1",
          skillId: "ballControl",
          score: 4,
          notes: "Shows excellent ball control under pressure",
          assessedBy: "Coach Mike",
          assessedAt: new Date().toISOString(),
          improvement: 15
        },
        {
          id: "2",
          playerId: "1",
          skillId: "shooting",
          score: 3,
          notes: "Good technique but needs work on accuracy",
          assessedBy: "Coach Mike",
          assessedAt: new Date().toISOString(),
          improvement: 25
        }
      ];
      res.json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.post('/api/skills/assessments', isAuthenticated, async (req, res) => {
    try {
      const { assessments, aiInsights } = req.body;
      // Mock response - replace with actual database creation
      const savedAssessments = assessments.map((assessment: any, index: number) => ({
        id: (Date.now() + index).toString(),
        ...assessment,
        assessedBy: req.user?.claims?.email || "Unknown Coach",
        assessedAt: new Date().toISOString()
      }));
      res.status(201).json({ saved: savedAssessments.length, assessments: savedAssessments });
    } catch (error) {
      console.error("Error saving assessments:", error);
      res.status(500).json({ message: "Failed to save assessments" });
    }
  });

  app.post('/api/skills/ai-analysis', isAuthenticated, async (req, res) => {
    try {
      const { notes, playerId } = req.body;
      // Mock AI analysis - replace with actual AI processing
      const analysis = {
        suggestedScore: Math.floor(Math.random() * 2) + 3, // 3-4
        reasoning: "Based on the detailed notes, the player shows strong fundamentals with room for improvement in consistency.",
        recommendations: [
          "Focus on repetitive drills to build muscle memory",
          "Practice under pressure situations",
          "Work on weaker foot development"
        ],
        strengths: ["Good technique", "Positive attitude", "Quick learning"],
        improvementAreas: ["Consistency", "Decision making under pressure"]
      };
      res.json(analysis);
    } catch (error) {
      console.error("Error in AI analysis:", error);
      res.status(500).json({ message: "Failed to analyze notes" });
    }
  });

  app.get('/api/skills/ai-recommendations', isAuthenticated, async (req, res) => {
    try {
      const recommendations = {
        focusAreas: ["Shooting accuracy", "Ball control"],
        trainingSuggestions: [
          "Increase shooting practice by 30%",
          "Add pressure situation drills",
          "Focus on weak foot development"
        ],
        playerInsights: {
          strengths: ["Teamwork", "Passing"],
          weaknesses: ["Shooting", "Speed"],
          trends: "Consistent improvement over last 3 months"
        }
      };
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  app.post('/api/skills/generate-training-plan', isAuthenticated, async (req, res) => {
    try {
      const { playerId, planType, weakAreas, duration } = req.body;
      // Mock training plan generation
      const plan = {
        id: Date.now().toString(),
        playerId,
        planType,
        duration,
        drills: [
          {
            id: "drill1",
            name: "Cone Dribbling Circuit",
            skill: "Ball Control",
            duration: 10,
            difficulty: "Intermediate"
          },
          {
            id: "drill2", 
            name: "Target Shooting Practice",
            skill: "Shooting",
            duration: 15,
            difficulty: "Beginner"
          }
        ],
        aiGenerated: true,
        createdAt: new Date().toISOString()
      };
      res.status(201).json(plan);
    } catch (error) {
      console.error("Error generating training plan:", error);
      res.status(500).json({ message: "Failed to generate training plan" });
    }
  });

  // Equipment management routes
  app.get('/api/equipment', isAuthenticated, async (req, res) => {
    try {
      const equipment = [
        {
          id: "1",
          name: "Wilson Soccer Ball",
          type: "ball",
          sport: "soccer",
          brand: "Wilson",
          model: "Pro Series",
          quantity: 15,
          available: 12,
          assigned: 3,
          condition: "excellent",
          location: "Equipment Room A",
          purchaseDate: "2024-01-15",
          cost: 29.99,
          totalValue: 449.85,
          serialNumber: "WS2024001",
          complianceStatus: "compliant"
        },
        {
          id: "2",
          name: "Nike Basketball",
          type: "ball",
          sport: "basketball", 
          brand: "Nike",
          model: "Elite Championship",
          quantity: 8,
          available: 5,
          assigned: 3,
          condition: "good",
          location: "Gym Storage",
          purchaseDate: "2023-09-10",
          cost: 45.00,
          totalValue: 360.00,
          serialNumber: "NK2023002",
          complianceStatus: "compliant"
        }
      ];
      res.json(equipment);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).json({ message: "Failed to fetch equipment" });
    }
  });

  app.get('/api/equipment/categories', isAuthenticated, async (req, res) => {
    try {
      const categories = [
        {
          id: "balls",
          name: "Balls",
          sport: "all",
          items: ["Soccer Ball", "Basketball", "Football", "Tennis Ball"]
        },
        {
          id: "protective",
          name: "Protective Gear",
          sport: "all", 
          items: ["Helmets", "Shin Guards", "Knee Pads", "Gloves"]
        },
        {
          id: "training",
          name: "Training Equipment",
          sport: "all",
          items: ["Cones", "Agility Ladders", "Hurdles", "Goals"]
        }
      ];
      res.json(categories);
    } catch (error) {
      console.error("Error fetching equipment categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/equipment/ai-insights', isAuthenticated, async (req, res) => {
    try {
      const insights = {
        restockAlerts: [
          { item: "Soccer Balls", daysUntil: 15, priority: "medium" },
          { item: "Basketball", daysUntil: 7, priority: "high" }
        ],
        maintenanceDue: [
          { item: "Goal Posts", type: "inspection", daysOverdue: 3 },
          { item: "Training Equipment", type: "cleaning", daysOverdue: 0 }
        ],
        costOptimization: {
          potentialSavings: 450,
          recommendations: [
            "Bulk purchase discount available for soccer balls",
            "Consider alternative supplier for protective gear"
          ]
        },
        usagePatterns: {
          topUsed: ["Soccer Balls", "Training Cones", "Goal Posts"],
          underUtilized: ["Tennis Equipment", "Wrestling Mats"]
        }
      };
      res.json(insights);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  // Guardians routes
  app.get('/api/guardians', isAuthenticated, async (req, res) => {
    try {
      const guardians = [
        {
          id: "g1",
          firstName: "Sarah",
          lastName: "Johnson", 
          email: "sarah.johnson@email.com",
          phone: "(555) 123-4567",
          relationship: "parent",
          isEmergencyContact: true,
          playerId: "1",
          address: "123 Main St, Anytown, ST 12345",
          occupation: "Marketing Manager",
          workPhone: "(555) 123-4568"
        },
        {
          id: "g2",
          firstName: "Michael",
          lastName: "Davis",
          email: "michael.davis@email.com", 
          phone: "(555) 234-5678",
          relationship: "parent",
          isEmergencyContact: true,
          playerId: "2",
          address: "456 Oak Ave, Anytown, ST 12345",
          occupation: "Software Engineer",
          workPhone: "(555) 234-5679"
        },
        {
          id: "g3",
          firstName: "Carlos",
          lastName: "Rodriguez",
          email: "carlos.rodriguez@email.com",
          phone: "(555) 345-6789", 
          relationship: "parent",
          isEmergencyContact: true,
          playerId: "3",
          address: "789 Pine St, Anytown, ST 12345",
          occupation: "Teacher",
          workPhone: "(555) 345-6790"
        }
      ];
      res.json(guardians);
    } catch (error) {
      console.error("Error fetching guardians:", error);
      res.status(500).json({ message: "Failed to fetch guardians" });
    }
  });

  // Volunteer management routes
  app.get('/api/volunteers', isAuthenticated, async (req, res) => {
    try {
      const volunteers = [
        {
          id: "v1",
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "(555) 123-4567",
          status: "active",
          skills: ["Scorekeeping", "Event Management", "First Aid"],
          availability: ["Weekend Mornings", "Weekday Evenings"],
          preferredRoles: ["Scorekeeper", "Team Manager"],
          reliability: 98,
          totalHours: 45,
          backgroundCheck: "cleared"
        },
        {
          id: "v2",
          name: "Mike Thompson",
          email: "mike@example.com",
          phone: "(555) 234-5678",
          status: "active",
          skills: ["Equipment Setup", "Coaching", "Technology"],
          availability: ["Weekends", "Evenings"],
          preferredRoles: ["Equipment Manager", "Assistant Coach"],
          reliability: 92,
          totalHours: 38,
          backgroundCheck: "pending"
        },
        {
          id: "v3",
          name: "Jennifer Adams",
          email: "jennifer@example.com",
          phone: "(555) 345-6789",
          status: "active",
          skills: ["Communication", "Organization", "Fundraising"],
          availability: ["Flexible"],
          preferredRoles: ["Event Coordinator", "Communication"],
          reliability: 95,
          totalHours: 42,
          backgroundCheck: "needs_renewal"
        }
      ];
      res.json(volunteers);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
      res.status(500).json({ message: "Failed to fetch volunteers" });
    }
  });

  app.get('/api/volunteers/tasks', isAuthenticated, async (req, res) => {
    try {
      const tasks = [
        {
          id: "1",
          title: "Soccer Game Scorekeeper",
          description: "Keep score and stats for U12 soccer game",
          sport: "soccer",
          eventName: "Hawks vs Eagles - Championship",
          date: "2024-07-20",
          time: "10:00 AM",
          volunteersNeeded: 2,
          volunteersAssigned: 1,
          status: "partially_filled",
          priority: "high"
        },
        {
          id: "2",
          title: "Equipment Setup Crew",
          description: "Set up goals, nets, and field markers",
          sport: "soccer",
          eventName: "Tournament Day 1 Setup",
          date: "2024-07-21",
          time: "7:00 AM",
          volunteersNeeded: 4,
          volunteersAssigned: 4,
          status: "filled",
          priority: "medium"
        }
      ];
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching volunteer tasks:", error);
      res.status(500).json({ message: "Failed to fetch volunteer tasks" });
    }
  });

  app.get('/api/volunteers/ai-insights', isAuthenticated, async (req, res) => {
    try {
      const insights = {
        matchingAccuracy: 95,
        automationSavings: 70,
        attendanceRate: 95,
        satisfactionScore: 88,
        recommendations: [
          "Send reminder emails to non-responders on weekday mornings",
          "Pair experienced volunteers with newcomers for training",
          "Schedule recognition events quarterly to boost engagement"
        ],
        trends: {
          volunteerGrowth: 12,
          taskCompletionRate: 89,
          averageResponseTime: "2.3 hours"
        }
      };
      res.json(insights);
    } catch (error) {
      console.error("Error fetching volunteer AI insights:", error);
      res.status(500).json({ message: "Failed to fetch volunteer AI insights" });
    }
  });

  // Parent portal routes
  app.get('/api/parent-portal', isAuthenticated, async (req, res) => {
    try {
      const parentData = {
        parentName: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "(555) 123-4567",
        emergencyContact: "(555) 987-6543",
        address: "123 Oak Street, City, State 12345",
        memberSince: "2023-09-15",
        activeChildren: 1,
        totalPayments: 540.00,
        volunteerHours: 15.5
      };
      res.json(parentData);
    } catch (error) {
      console.error("Error fetching parent portal data:", error);
      res.status(500).json({ message: "Failed to fetch parent portal data" });
    }
  });

  app.get('/api/parent-portal/children', isAuthenticated, async (req, res) => {
    try {
      const children = [
        {
          id: "child1",
          name: "Alex Johnson",
          age: 12,
          team: "Hawks U12",
          position: "Midfielder",
          jerseyNumber: 12,
          skillLevel: "Intermediate",
          medicalNotes: "Mild asthma - has inhaler",
          emergencyContact: "Sarah Johnson - (555) 123-4567"
        }
      ];
      res.json(children);
    } catch (error) {
      console.error("Error fetching children data:", error);
      res.status(500).json({ message: "Failed to fetch children data" });
    }
  });

  app.get('/api/parent-portal/ai-insights', isAuthenticated, async (req, res) => {
    try {
      const insights = {
        scheduleAccuracy: 92,
        notificationReliability: 99.5,
        paymentAutomation: 85,
        communicationEfficiency: 78,
        personalizedContent: 88,
        recommendations: [
          "Your child performs 15% better in morning games",
          "Consider carpooling with the Johnson family for Tuesday practices",
          "Alex's shooting skills have improved 12% this month"
        ],
        upcomingAlerts: [
          "Physical exam expires in 2 weeks",
          "Equipment return due next Friday",
          "Payment due August 1st"
        ]
      };
      res.json(insights);
    } catch (error) {
      console.error("Error fetching parent portal AI insights:", error);
      res.status(500).json({ message: "Failed to fetch parent portal AI insights" });
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
      console.log("Creating team with data:", req.body, "User ID:", userId);
      
      // Validate and sanitize sport field
      const sportMapping: { [key: string]: string } = {
        'Basketball': 'basketball',
        'Volleyball': 'volleyball', 
        'Baseball': 'baseball',
        'basketball': 'basketball',
        'volleyball': 'volleyball',
        'baseball': 'baseball'
      };
      
      const normalizedSport = sportMapping[req.body.sport] || req.body.sport?.toLowerCase();
      
      const teamData = insertTeamSchema.parse({ 
        ...req.body, 
        sport: normalizedSport,
        ownerId: userId 
      });
      
      const team = await storage.createTeam(teamData);
      res.json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      if (error.name === 'ZodError') {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      } else {
        res.status(400).json({ message: "Failed to create team" });
      }
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
      const notifications = [
        {
          id: "1",
          title: "Practice Cancelled - Weather",
          message: "Due to heavy rain, today's practice has been cancelled. We will reschedule for tomorrow at the same time.",
          type: "warning",
          isRead: false,
          recipient: "All team members",
          deliveryMethod: "email",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "2", 
          title: "Game Day Reminder",
          message: "Don't forget about tomorrow's championship game at 2 PM. Please arrive 30 minutes early for warm-up.",
          type: "info",
          isRead: true,
          recipient: "All team members",
          deliveryMethod: "sms",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "3",
          title: "New Player Joined Team",
          message: "Please welcome Sarah Wilson to our team! She will be joining us starting next week.",
          type: "success",
          isRead: false,
          recipient: "All team members",
          deliveryMethod: "push",
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ];
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post('/api/notifications', isAuthenticated, async (req, res) => {
    try {
      const notificationData = req.body;
      const newNotification = {
        id: Date.now().toString(),
        ...notificationData,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      res.json(newNotification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      const notificationId = req.params.id;
      // In a real implementation, update the notification in the database
      res.json({ success: true, id: notificationId });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
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
      const payments = [
        {
          id: "1",
          description: "Registration Fee - Spring Season",
          amount: 150.00,
          dueDate: "2024-12-31",
          status: "paid",
          type: "registration",
          playerName: "Alex Johnson",
          notes: "Includes uniform and equipment",
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          description: "Tournament Entry Fee",
          amount: 75.00,
          dueDate: "2025-01-15",
          status: "pending",
          type: "tournament",
          playerName: "Emma Davis",
          notes: "Regional championship tournament",
          createdAt: new Date().toISOString()
        },
        {
          id: "3",
          description: "Equipment Replacement",
          amount: 50.00,
          dueDate: "2024-12-20",
          status: "overdue",
          type: "uniform",
          playerName: "Mason Rodriguez",
          notes: "New cleats and shin guards",
          createdAt: new Date().toISOString()
        }
      ];
      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post('/api/payments', isAuthenticated, async (req, res) => {
    try {
      const paymentData = req.body;
      const newPayment = {
        id: Date.now().toString(),
        ...paymentData,
        status: "pending",
        createdAt: new Date().toISOString()
      };
      res.json(newPayment);
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ message: "Failed to create payment" });
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

  // Calendar Sync API endpoints
  app.get("/api/calendar-sync/connections", isAuthenticated, async (req: any, res) => {
    try {
      const connections = [
        {
          id: "1",
          provider: "google",
          email: "coach@example.com",
          name: "Coach Martinez Google Calendar",
          status: "connected",
          lastSync: new Date("2025-01-20T18:30:00"),
          syncedEvents: 45,
          conflicts: 2,
          isActive: true,
          syncFrequency: "realtime"
        },
        {
          id: "2",
          provider: "microsoft",
          email: "parent@example.com",
          name: "Sarah Johnson Outlook",
          status: "connected",
          lastSync: new Date("2025-01-20T17:45:00"),
          syncedEvents: 23,
          conflicts: 0,
          isActive: true,
          syncFrequency: "hourly"
        },
        {
          id: "3",
          provider: "apple",
          email: "admin@example.com",
          name: "Team Admin iCloud",
          status: "syncing",
          lastSync: new Date("2025-01-20T16:00:00"),
          syncedEvents: 67,
          conflicts: 1,
          isActive: true,
          syncFrequency: "realtime"
        }
      ];
      
      res.json(connections);
    } catch (error) {
      console.error("Calendar connections fetch error:", error);
      res.status(500).json({ message: "Failed to fetch calendar connections" });
    }
  });

  app.get("/api/calendar-sync/conflicts", isAuthenticated, async (req: any, res) => {
    try {
      const conflicts = [
        {
          id: "1",
          eventTitle: "Team Practice vs Doctor Appointment",
          teamProEvent: "Soccer Practice - Main Field, 4:00 PM - 6:00 PM",
          externalEvent: "Doctor Appointment - Medical Center, 5:00 PM - 6:00 PM",
          conflictType: "time_overlap",
          severity: "high",
          date: new Date("2025-01-23T16:00:00"),
          suggestedResolution: "Reschedule practice to 3:00 PM - 5:00 PM or move to Tuesday",
          autoResolvable: false,
          status: "pending"
        },
        {
          id: "2",
          eventTitle: "Game Day vs Family Event",
          teamProEvent: "Championship Game - Stadium Field, 10:00 AM - 12:00 PM",
          externalEvent: "Family Reunion - Home, 9:00 AM - 2:00 PM",
          conflictType: "time_overlap",
          severity: "medium",
          date: new Date("2025-01-25T10:00:00"),
          suggestedResolution: "Notify family about game priority or arrange late arrival",
          autoResolvable: false,
          status: "pending"
        },
        {
          id: "3",
          eventTitle: "Volunteer Task vs Work Meeting",
          teamProEvent: "Equipment Setup - Gymnasium, 8:00 AM - 9:00 AM",
          externalEvent: "Weekly Team Meeting - Office, 8:30 AM - 9:30 AM",
          conflictType: "time_overlap",
          severity: "low",
          date: new Date("2025-01-24T08:00:00"),
          suggestedResolution: "Reassign volunteer task to another parent",
          autoResolvable: true,
          status: "pending"
        }
      ];
      
      res.json(conflicts);
    } catch (error) {
      console.error("Calendar conflicts fetch error:", error);
      res.status(500).json({ message: "Failed to fetch calendar conflicts" });
    }
  });

  app.get("/api/calendar-sync/analytics", isAuthenticated, async (req: any, res) => {
    try {
      const analytics = {
        totalConnections: 8,
        activeConnections: 6,
        syncReliability: 99.5,
        conflictResolutionRate: 87.3,
        timesSaved: 24.5,
        popularProviders: [
          { provider: "google", count: 5 },
          { provider: "microsoft", count: 2 },
          { provider: "apple", count: 1 },
          { provider: "ical", count: 0 }
        ],
        syncTrends: [
          { date: "2025-01-15", synced: 89, conflicts: 3 },
          { date: "2025-01-16", synced: 95, conflicts: 2 },
          { date: "2025-01-17", synced: 102, conflicts: 4 },
          { date: "2025-01-18", synced: 87, conflicts: 1 },
          { date: "2025-01-19", synced: 114, conflicts: 2 },
          { date: "2025-01-20", synced: 108, conflicts: 3 }
        ]
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Calendar sync analytics error:", error);
      res.status(500).json({ message: "Failed to fetch sync analytics" });
    }
  });

  app.post("/api/calendar-sync/connect", isAuthenticated, async (req: any, res) => {
    try {
      const { provider, email, syncFrequency } = req.body;
      
      // Simulate OAuth connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newConnection = {
        id: Date.now().toString(),
        provider,
        email,
        name: `${email} ${provider} Calendar`,
        status: "connected",
        lastSync: new Date(),
        syncedEvents: 0,
        conflicts: 0,
        isActive: true,
        syncFrequency: syncFrequency || "realtime"
      };
      
      res.json(newConnection);
    } catch (error) {
      console.error("Calendar connect error:", error);
      res.status(500).json({ message: "Failed to connect calendar" });
    }
  });

  app.delete("/api/calendar-sync/connections/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({ 
        message: "Calendar disconnected successfully",
        connectionId: id
      });
    } catch (error) {
      console.error("Calendar disconnect error:", error);
      res.status(500).json({ message: "Failed to disconnect calendar" });
    }
  });

  app.post("/api/calendar-sync/connections/:id/sync", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Simulate manual sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const eventCount = Math.floor(Math.random() * 20) + 5;
      
      res.json({ 
        message: "Sync completed successfully",
        connectionId: id,
        eventCount,
        conflicts: Math.floor(Math.random() * 3)
      });
    } catch (error) {
      console.error("Calendar sync error:", error);
      res.status(500).json({ message: "Failed to sync calendar" });
    }
  });

  app.post("/api/calendar-sync/conflicts/:id/resolve", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Simulate conflict resolution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      res.json({ 
        message: "Conflict resolved successfully",
        conflictId: id,
        resolution: "AI-powered automatic resolution applied"
      });
    } catch (error) {
      console.error("Conflict resolution error:", error);
      res.status(500).json({ message: "Failed to resolve conflict" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
