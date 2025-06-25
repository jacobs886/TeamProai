import {
  users,
  facilities,
  teams,
  teamMembers,
  events,
  eventParticipants,
  notifications,
  payments,
  teamMessages,
  gameStats,
  type User,
  type UpsertUser,
  type Facility,
  type InsertFacility,
  type Team,
  type InsertTeam,
  type TeamMember,
  type Event,
  type InsertEvent,
  type EventParticipant,
  type Notification,
  type Payment,
  type TeamMessage,
  type GameStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(userId: string, role: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Facility operations
  getFacilities(): Promise<Facility[]>;
  getFacility(id: number): Promise<Facility | undefined>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  updateFacility(id: number, facility: Partial<InsertFacility>): Promise<Facility>;
  
  // Team operations
  getTeams(): Promise<Team[]>;
  getTeamsByOwner(ownerId: string): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team>;
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  addTeamMember(teamId: number, userId: string, role: string): Promise<TeamMember>;
  
  // Event operations
  getEvents(): Promise<Event[]>;
  getEventsByTeam(teamId: number): Promise<Event[]>;
  getEventsByUser(userId: string): Promise<Event[]>;
  getUpcomingEvents(userId: string, limit?: number): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event>;
  
  // Notification operations
  getUserNotifications(userId: string): Promise<Notification[]>;
  getUnreadNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: any): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;
  
  // Payment operations
  getUserPayments(userId: string): Promise<Payment[]>;
  getTeamPayments(teamId: number): Promise<Payment[]>;
  createPayment(payment: any): Promise<Payment>;
  updatePayment(id: number, payment: any): Promise<Payment>;
  
  // Dashboard stats
  getDashboardStats(userId: string): Promise<any>;
  
  // Team messaging operations
  getTeamMessages(teamId: number): Promise<any[]>;
  createTeamMessage(teamId: number, senderId: string, message: string, isUrgent?: boolean, replyToId?: number): Promise<any>;
  
  // Game statistics operations
  getGameStats(eventId: number): Promise<any[]>;
  createGameStats(eventId: number, playerId: string, sport: string, stats: any): Promise<any>;
  
  // AutoStream operations
  getStreams(): Promise<any[]>;
  getStream(id: number): Promise<any>;
  createStream(stream: any): Promise<any>;
  updateStream(id: number, updates: any): Promise<any>;
  getHighlights(): Promise<any[]>;
  createHighlight(highlight: any): Promise<any>;
  getStreamingAnalytics(): Promise<any>;
  updateStreamSettings(streamId: number, settings: any): Promise<any>;
  getStreamEngagement(streamId: number): Promise<any>;
  addHighlightToStream(streamId: number, highlight: any): Promise<void>;
  updateStreamMetrics(streamId: number, metrics: any): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
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

  async updateUserRole(userId: string, role: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role: role as any, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Facility operations
  async getFacilities(): Promise<Facility[]> {
    return await db.select().from(facilities).where(eq(facilities.isActive, true));
  }

  async getFacility(id: number): Promise<Facility | undefined> {
    const [facility] = await db.select().from(facilities).where(eq(facilities.id, id));
    return facility;
  }

  async createFacility(facility: InsertFacility): Promise<Facility> {
    const [created] = await db.insert(facilities).values(facility).returning();
    return created;
  }

  async updateFacility(id: number, facility: Partial<InsertFacility>): Promise<Facility> {
    const [updated] = await db
      .update(facilities)
      .set({ ...facility, updatedAt: new Date() })
      .where(eq(facilities.id, id))
      .returning();
    return updated;
  }

  // Team operations
  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams).where(eq(teams.isActive, true));
  }

  async getTeamsByOwner(ownerId: string): Promise<Team[]> {
    return await db
      .select()
      .from(teams)
      .where(and(eq(teams.ownerId, ownerId), eq(teams.isActive, true)));
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    const [created] = await db.insert(teams).values(team).returning();
    return created;
  }

  async updateTeam(id: number, team: Partial<InsertTeam>): Promise<Team> {
    const [updated] = await db
      .update(teams)
      .set({ ...team, updatedAt: new Date() })
      .where(eq(teams.id, id))
      .returning();
    return updated;
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId));
  }

  async addTeamMember(teamId: number, userId: string, role: string): Promise<TeamMember> {
    const [member] = await db
      .insert(teamMembers)
      .values({ teamId: teamId, userId: userId, role: role as any })
      .returning();
    return member;
  }

  // Event operations
  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(desc(events.startTime));
  }

  async getEventsByTeam(teamId: number): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(eq(events.teamId, teamId))
      .orderBy(desc(events.startTime));
  }

  async getEventsByUser(userId: string): Promise<Event[]> {
    return await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        type: events.type,
        sport: events.sport,
        teamId: events.teamId,
        facilityId: events.facilityId,
        organizerId: events.organizerId,
        startTime: events.startTime,
        endTime: events.endTime,
        status: events.status,
        maxParticipants: events.maxParticipants,
        isRecurring: events.isRecurring,
        recurringPattern: events.recurringPattern,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
      })
      .from(events)
      .leftJoin(eventParticipants, eq(events.id, eventParticipants.eventId))
      .where(eq(eventParticipants.userId, userId))
      .orderBy(desc(events.startTime));
  }

  async getUpcomingEvents(userId: string, limit = 10): Promise<Event[]> {
    const now = new Date();
    return await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        type: events.type,
        sport: events.sport,
        teamId: events.teamId,
        facilityId: events.facilityId,
        organizerId: events.organizerId,
        startTime: events.startTime,
        endTime: events.endTime,
        status: events.status,
        maxParticipants: events.maxParticipants,
        isRecurring: events.isRecurring,
        recurringPattern: events.recurringPattern,
        createdAt: events.createdAt,
        updatedAt: events.updatedAt,
      })
      .from(events)
      .leftJoin(eventParticipants, eq(events.id, eventParticipants.eventId))
      .where(
        and(
          eq(eventParticipants.userId, userId),
          gte(events.startTime, now)
        )
      )
      .orderBy(events.startTime)
      .limit(limit);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event> {
    const [updated] = await db
      .update(events)
      .set({ ...event, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return updated;
  }

  // Notification operations
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: any): Promise<Notification> {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Payment operations
  async getUserPayments(userId: string): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(desc(payments.createdAt));
  }

  async getTeamPayments(teamId: number): Promise<Payment[]> {
    return await db
      .select()
      .from(payments)
      .where(eq(payments.teamId, teamId))
      .orderBy(desc(payments.createdAt));
  }

  async createPayment(payment: any): Promise<Payment> {
    const [created] = await db.insert(payments).values(payment).returning();
    return created;
  }

  async updatePayment(id: number, payment: any): Promise<Payment> {
    const [updated] = await db
      .update(payments)
      .set({ ...payment, updatedAt: new Date() })
      .where(eq(payments.id, id))
      .returning();
    return updated;
  }

  // Dashboard stats
  async getDashboardStats(userId: string): Promise<any> {
    const [teamCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(teams)
      .where(and(eq(teams.ownerId, userId), eq(teams.isActive, true)));

    const [facilityCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(facilities)
      .where(eq(facilities.isActive, true));

    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [upcomingEventsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(events)
      .leftJoin(eventParticipants, eq(events.id, eventParticipants.eventId))
      .where(
        and(
          eq(eventParticipants.userId, userId),
          gte(events.startTime, now),
          lte(events.startTime, weekFromNow)
        )
      );

    const [totalRevenue] = await db
      .select({ total: sql<number>`coalesce(sum(amount), 0)` })
      .from(payments)
      .where(and(eq(payments.userId, userId), eq(payments.status, "completed")));

    return {
      activeTeams: teamCount?.count || 0,
      facilities: facilityCount?.count || 0,
      upcomingEvents: upcomingEventsCount?.count || 0,
      monthlyRevenue: totalRevenue?.total || 0,
    };
  }
  
  // Team messaging operations
  async getTeamMessages(teamId: number): Promise<any[]> {
    return await db
      .select({
        id: teamMessages.id,
        message: teamMessages.message,
        isUrgent: teamMessages.isUrgent,
        senderId: teamMessages.senderId,
        senderName: users.firstName,
        senderImage: users.profileImageUrl,
        replyToId: teamMessages.replyToId,
        createdAt: teamMessages.createdAt,
      })
      .from(teamMessages)
      .leftJoin(users, eq(teamMessages.senderId, users.id))
      .where(eq(teamMessages.teamId, teamId))
      .orderBy(teamMessages.createdAt);
  }

  async createTeamMessage(teamId: number, senderId: string, message: string, isUrgent = false, replyToId?: number): Promise<any> {
    const [created] = await db
      .insert(teamMessages)
      .values({ teamId, senderId, message, isUrgent, replyToId })
      .returning();
    return created;
  }
  
  // Game statistics operations
  async getGameStats(eventId: number): Promise<any[]> {
    return await db
      .select()
      .from(gameStats)
      .where(eq(gameStats.eventId, eventId))
      .orderBy(gameStats.createdAt);
  }

  async createGameStats(eventId: number, playerId: string, sport: string, stats: any): Promise<any> {
    const [created] = await db
      .insert(gameStats)
      .values({ eventId, playerId, sport: sport as any, stats })
      .returning();
    return created;
  }
  // AutoStream implementation
  private streams: any[] = [];
  private highlights: any[] = [];
  private streamingAnalytics = {
    totalStreams: 0,
    totalViewers: 0,
    avgWatchTime: 0,
    highlightAccuracy: 0.91,
    engagementRate: 0.78
  };

  async getStreams(): Promise<any[]> {
    return this.streams;
  }

  async getStream(id: number): Promise<any> {
    return this.streams.find(s => s.id === id);
  }

  async createStream(streamData: any): Promise<any> {
    const newStream = {
      id: this.streams.length + 1,
      ...streamData,
      createdAt: new Date().toISOString(),
      thumbnailUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      metrics: {
        quality: streamData.quality || "720p",
        bandwidth: "2.5 Mbps",
        latency: 2.1
      }
    };
    this.streams.push(newStream);
    this.streamingAnalytics.totalStreams++;
    return newStream;
  }

  async updateStream(id: number, updates: any): Promise<any> {
    const streamIndex = this.streams.findIndex(s => s.id === id);
    if (streamIndex !== -1) {
      this.streams[streamIndex] = { ...this.streams[streamIndex], ...updates };
      return this.streams[streamIndex];
    }
    throw new Error("Stream not found");
  }

  async getHighlights(): Promise<any[]> {
    return this.highlights;
  }

  async createHighlight(highlightData: any): Promise<any> {
    const newHighlight = {
      id: this.highlights.length + 1,
      ...highlightData,
      thumbnailUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=300",
      videoUrl: `https://demo.video.url/highlight${this.highlights.length + 1}.mp4`,
      duration: Math.floor(Math.random() * 30) + 10,
      metrics: [
        { name: "Sprint Speed", value: "7.2 m/s", benchmark: "Above Average" },
        { name: "Shot Accuracy", value: "95%", benchmark: "Excellent" }
      ],
      tags: ["goal", "sprint", "accuracy"],
      translations: {
        es: "Jugada destacada",
        fr: "Action remarquable"
      }
    };
    this.highlights.push(newHighlight);
    return newHighlight;
  }

  async getStreamingAnalytics(): Promise<any> {
    return {
      ...this.streamingAnalytics,
      streamEngagement: 0.78,
      avgWatchTime: 24,
      highlightAccuracy: 0.91,
      languagesServed: 12,
      recentStreams: this.streams.slice(-5),
      topHighlights: this.highlights.slice(-3)
    };
  }

  async updateStreamSettings(streamId: number, settings: any): Promise<any> {
    return await this.updateStream(streamId, { settings });
  }

  async getStreamEngagement(streamId: number): Promise<any> {
    return {
      streamId,
      viewerCount: Math.floor(Math.random() * 100) + 20,
      avgWatchTime: Math.floor(Math.random() * 30) + 15,
      interactions: Math.floor(Math.random() * 50) + 10,
      shares: Math.floor(Math.random() * 20) + 5,
      comments: Math.floor(Math.random() * 30) + 8
    };
  }

  async addHighlightToStream(streamId: number, highlight: any): Promise<void> {
    const stream = await this.getStream(streamId);
    if (stream) {
      if (!stream.highlights) stream.highlights = [];
      stream.highlights.push(highlight);
    }
  }

  async updateStreamMetrics(streamId: number, metrics: any): Promise<void> {
    const stream = await this.getStream(streamId);
    if (stream) {
      stream.metrics = { ...stream.metrics, ...metrics };
    }
  }
}

export const storage = new DatabaseStorage();
