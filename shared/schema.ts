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
  decimal,
  date,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["super_admin", "admin_operations", "team_admin", "team_user", "view_only"] }).default("team_user"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // basketball, volleyball, baseball
  address: text("address"),
  capacity: integer("capacity"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  amenities: text("amenities").array(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  sport: varchar("sport", { enum: ["volleyball", "basketball", "baseball"] }).notNull(),
  category: varchar("category"), // U-18 Girls, U-16 Boys, etc.
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  description: text("description"),
  maxPlayers: integer("max_players").default(20),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role", { enum: ["coach", "player", "manager"] }).default("player"),
  jerseyNumber: integer("jersey_number"),
  position: varchar("position"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type", { enum: ["practice", "game", "training"] }).notNull(),
  sport: varchar("sport", { enum: ["volleyball", "basketball", "baseball"] }).notNull(),
  teamId: integer("team_id").references(() => teams.id),
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  organizerId: varchar("organizer_id").references(() => users.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: varchar("status", { enum: ["scheduled", "confirmed", "cancelled", "completed"] }).default("scheduled"),
  maxParticipants: integer("max_participants"),
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: jsonb("recurring_pattern"), // for recurring events
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  status: varchar("status", { enum: ["invited", "confirmed", "declined", "attended"] }).default("invited"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type", { enum: ["info", "warning", "success", "error", "urgent"] }).default("info"),
  isRead: boolean("is_read").default(false),
  isUrgent: boolean("is_urgent").default(false),
  relatedEntityType: varchar("related_entity_type"), // team, event, payment, etc.
  relatedEntityId: integer("related_entity_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Add team chat messages table for seamless communication
export const teamMessages = pgTable("team_messages", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isUrgent: boolean("is_urgent").default(false),
  replyToId: integer("reply_to_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Add game statistics and scorekeeping
export const gameStats = pgTable("game_stats", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  playerId: varchar("player_id").references(() => users.id).notNull(),
  sport: varchar("sport", { enum: ["volleyball", "basketball", "baseball"] }).notNull(),
  stats: jsonb("stats").notNull(), // Flexible stats storage for different sports
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Add calendar sync preferences
export const calendarSync = pgTable("calendar_sync", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  provider: varchar("provider", { enum: ["google", "apple", "outlook"] }).notNull(),
  isEnabled: boolean("is_enabled").default(true),
  syncToken: varchar("sync_token"),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  teamId: integer("team_id").references(() => teams.id),
  eventId: integer("event_id").references(() => events.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  type: varchar("type", { enum: ["registration", "facility", "equipment", "other"] }).notNull(),
  status: varchar("status", { enum: ["pending", "completed", "failed", "refunded"] }).default("pending"),
  paymentMethod: varchar("payment_method"),
  description: text("description"),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Youth Team Management Extensions
export const guardians = pgTable("guardians", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  emergencyPhone: varchar("emergency_phone", { length: 20 }),
  relationship: varchar("relationship", { length: 50 }),
  address: text("address"),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("en"),
  canPickup: boolean("can_pickup").default(true),
  medicalNotes: text("medical_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  dateOfBirth: date("date_of_birth"),
  jerseyNumber: integer("jersey_number"),
  position: varchar("position", { length: 50 }),
  skillLevel: varchar("skill_level", { length: 20 }),
  medicalConditions: text("medical_conditions"),
  allergies: text("allergies"),
  emergencyContact: text("emergency_contact"),
  profileImageUrl: varchar("profile_image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playerGuardians = pgTable("player_guardians", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  guardianId: integer("guardian_id").references(() => guardians.id),
  isPrimary: boolean("is_primary").default(false),
  canReceiveUpdates: boolean("can_receive_updates").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skillsTracking = pgTable("skills_tracking", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  skill: varchar("skill", { length: 100 }).notNull(),
  currentLevel: integer("current_level").default(1),
  targetLevel: integer("target_level"),
  assessmentDate: timestamp("assessment_date").defaultNow(),
  assessedBy: varchar("assessed_by").references(() => users.id),
  notes: text("notes"),
  developmentPlan: text("development_plan"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  playerId: integer("player_id").references(() => players.id),
  type: varchar("type", { length: 50 }).notNull(),
  item: varchar("item", { length: 100 }).notNull(),
  size: varchar("size", { length: 20 }),
  condition: varchar("condition", { length: 20 }).default("good"),
  issuedDate: timestamp("issued_date"),
  returnDate: timestamp("return_date"),
  cost: decimal("cost", { precision: 8, scale: 2 }),
  status: varchar("status", { length: 20 }).default("available"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const volunteers = pgTable("volunteers", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  userId: varchar("user_id").references(() => users.id),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 50 }),
  availability: jsonb("availability"),
  skills: text("skills"),
  backgroundCheckStatus: varchar("background_check_status", { length: 20 }).default("pending"),
  backgroundCheckExpiry: date("background_check_expiry"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playerDevelopment = pgTable("player_development", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  assessmentDate: timestamp("assessment_date").defaultNow(),
  assessedBy: varchar("assessed_by").references(() => users.id),
  physicalMetrics: jsonb("physical_metrics"),
  technicalSkills: jsonb("technical_skills"),
  mentalAspects: jsonb("mental_aspects"),
  goals: text("goals"),
  recommendations: text("recommendations"),
  videoAnalysisUrl: varchar("video_analysis_url"),
  benchmarkComparison: jsonb("benchmark_comparison"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI-Driven Features Schema
export const aiChatbots = pgTable("ai_chatbots", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  name: varchar("name", { length: 100 }).notNull(),
  purpose: varchar("purpose", { length: 100 }),
  knowledgeBase: jsonb("knowledge_base"),
  isActive: boolean("is_active").default(true),
  responseCount: integer("response_count").default(0),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sentimentAnalysis = pgTable("sentiment_analysis", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => teamMessages.id),
  sentiment: varchar("sentiment", { length: 20 }),
  confidence: decimal("confidence", { precision: 3, scale: 2 }),
  urgencyScore: integer("urgency_score"),
  keywords: jsonb("keywords"),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

export const scheduleOptimization = pgTable("schedule_optimization", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  originalSchedule: jsonb("original_schedule"),
  optimizedSchedule: jsonb("optimized_schedule"),
  conflictsResolved: integer("conflicts_resolved"),
  efficiencyGain: decimal("efficiency_gain", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const videoAnalysis = pgTable("video_analysis", {
  id: serial("id").primaryKey(),
  playerId: integer("player_id").references(() => players.id),
  eventId: integer("event_id").references(() => events.id),
  videoUrl: varchar("video_url").notNull(),
  analysisType: varchar("analysis_type", { length: 50 }),
  aiInsights: jsonb("ai_insights"),
  highlights: jsonb("highlights"),
  performanceMetrics: jsonb("performance_metrics"),
  improvementSuggestions: text("improvement_suggestions"),
  processingStatus: varchar("processing_status", { length: 20 }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fanEngagement = pgTable("fan_engagement", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  userId: varchar("user_id").references(() => users.id),
  engagementType: varchar("engagement_type", { length: 50 }),
  points: integer("points").default(0),
  level: varchar("level", { length: 20 }).default("bronze"),
  badges: jsonb("badges"),
  streakCount: integer("streak_count").default(0),
  lastActivity: timestamp("last_activity"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communicationLogs = pgTable("communication_logs", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id),
  senderId: varchar("sender_id").references(() => users.id),
  recipientType: varchar("recipient_type", { length: 20 }),
  recipientIds: jsonb("recipient_ids"),
  channel: varchar("channel", { length: 20 }),
  subject: varchar("subject", { length: 200 }),
  message: text("message"),
  translatedMessages: jsonb("translated_messages"),
  isEmergency: boolean("is_emergency").default(false),
  deliveryStatus: jsonb("delivery_status"),
  sentAt: timestamp("sent_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Advanced Facility Booking System
export const facilityBookings = pgTable("facility_bookings", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  teamId: integer("team_id").references(() => teams.id),
  eventId: integer("event_id").references(() => events.id),
  bookedBy: varchar("booked_by").references(() => users.id).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: varchar("status", { length: 20 }).default("confirmed"), // confirmed, pending, cancelled, completed
  recurringPattern: varchar("recurring_pattern", { length: 50 }), // none, daily, weekly, monthly
  recurringUntil: timestamp("recurring_until"),
  attendeeCount: integer("attendee_count"),
  equipmentNeeded: jsonb("equipment_needed"), // Array of equipment requirements
  specialRequirements: text("special_requirements"),
  cost: decimal("cost", { precision: 8, scale: 2 }),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"), // pending, paid, refunded
  confirmationCode: varchar("confirmation_code", { length: 50 }),
  checkedInAt: timestamp("checked_in_at"),
  checkedOutAt: timestamp("checked_out_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const facilityAvailability = pgTable("facility_availability", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  startTime: varchar("start_time", { length: 8 }).notNull(), // HH:MM:SS format
  endTime: varchar("end_time", { length: 8 }).notNull(),
  isAvailable: boolean("is_available").default(true),
  maxBookingsPerSlot: integer("max_bookings_per_slot").default(1),
  advanceBookingDays: integer("advance_booking_days").default(30),
  minimumBookingDuration: integer("minimum_booking_duration").default(60), // minutes
  maximumBookingDuration: integer("maximum_booking_duration").default(480), // minutes
  bufferTimeBefore: integer("buffer_time_before").default(0), // minutes
  bufferTimeAfter: integer("buffer_time_after").default(0), // minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const facilityUnavailability = pgTable("facility_unavailability", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  reason: varchar("reason", { length: 100 }), // maintenance, private_event, holiday, etc.
  description: text("description"),
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: varchar("recurring_pattern", { length: 50 }),
  createdBy: varchar("created_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bookingConflicts = pgTable("booking_conflicts", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => facilityBookings.id).notNull(),
  conflictingBookingId: integer("conflicting_booking_id").references(() => facilityBookings.id),
  conflictType: varchar("conflict_type", { length: 50 }).notNull(), // time_overlap, resource_conflict, capacity_exceeded
  severity: varchar("severity", { length: 20 }).default("medium"), // low, medium, high, critical
  description: text("description"),
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: varchar("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const facilityEquipment = pgTable("facility_equipment", {
  id: serial("id").primaryKey(),
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }), // audio_visual, sports, furniture, technology
  quantity: integer("quantity").default(1),
  condition: varchar("condition", { length: 20 }).default("good"), // excellent, good, fair, poor, out_of_order
  requiresTraining: boolean("requires_training").default(false),
  costPerHour: decimal("cost_per_hour", { precision: 8, scale: 2 }),
  description: text("description"),
  maintenanceSchedule: jsonb("maintenance_schedule"),
  lastMaintenanceDate: date("last_maintenance_date"),
  nextMaintenanceDate: date("next_maintenance_date"),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const realTimeBookingUpdates = pgTable("real_time_booking_updates", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => facilityBookings.id).notNull(),
  updateType: varchar("update_type", { length: 50 }).notNull(), // created, modified, cancelled, checked_in, checked_out
  previousData: jsonb("previous_data"),
  newData: jsonb("new_data"),
  updatedBy: varchar("updated_by").references(() => users.id).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  broadcastChannels: jsonb("broadcast_channels"), // Array of channels to notify
  notificationSent: boolean("notification_sent").default(false),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedTeams: many(teams),
  teamMemberships: many(teamMembers),
  organizedEvents: many(events),
  eventParticipations: many(eventParticipants),
  notifications: many(notifications),
  payments: many(payments),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  owner: one(users, {
    fields: [teams.ownerId],
    references: [users.id],
  }),
  members: many(teamMembers),
  events: many(events),
  payments: many(payments),
}));

export const facilitiesRelations = relations(facilities, ({ many }) => ({
  events: many(events),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  team: one(teams, {
    fields: [events.teamId],
    references: [teams.id],
  }),
  facility: one(facilities, {
    fields: [events.facilityId],
    references: [facilities.id],
  }),
  organizer: one(users, {
    fields: [events.organizerId],
    references: [users.id],
  }),
  participants: many(eventParticipants),
  payments: many(payments),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(events, {
    fields: [eventParticipants.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventParticipants.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const teamMessagesRelations = relations(teamMessages, ({ one }) => ({
  team: one(teams, {
    fields: [teamMessages.teamId],
    references: [teams.id],
  }),
  sender: one(users, {
    fields: [teamMessages.senderId],
    references: [users.id],
  }),
  replyTo: one(teamMessages, {
    fields: [teamMessages.replyToId],
    references: [teamMessages.id],
  }),
}));

export const gameStatsRelations = relations(gameStats, ({ one }) => ({
  event: one(events, {
    fields: [gameStats.eventId],
    references: [events.id],
  }),
  player: one(users, {
    fields: [gameStats.playerId],
    references: [users.id],
  }),
}));

export const calendarSyncRelations = relations(calendarSync, ({ one }) => ({
  user: one(users, {
    fields: [calendarSync.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [payments.teamId],
    references: [teams.id],
  }),
  event: one(events, {
    fields: [payments.eventId],
    references: [events.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilities.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
export type EventParticipant = typeof eventParticipants.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type TeamMessage = typeof teamMessages.$inferSelect;
export type GameStats = typeof gameStats.$inferSelect;
export type CalendarSync = typeof calendarSync.$inferSelect;

// Youth Team Management Types
export type Guardian = typeof guardians.$inferSelect;
export type InsertGuardian = typeof guardians.$inferInsert;
export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;
export type PlayerGuardian = typeof playerGuardians.$inferSelect;
export type SkillsTracking = typeof skillsTracking.$inferSelect;
export type InsertSkillsTracking = typeof skillsTracking.$inferInsert;
export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = typeof equipment.$inferInsert;
export type Volunteer = typeof volunteers.$inferSelect;
export type InsertVolunteer = typeof volunteers.$inferInsert;
export type PlayerDevelopment = typeof playerDevelopment.$inferSelect;
export type InsertPlayerDevelopment = typeof playerDevelopment.$inferInsert;
export type CommunicationLog = typeof communicationLogs.$inferSelect;
export type InsertCommunicationLog = typeof communicationLogs.$inferInsert;

// AI-Driven Features Types
export type AiChatbot = typeof aiChatbots.$inferSelect;
export type InsertAiChatbot = typeof aiChatbots.$inferInsert;
export type SentimentAnalysis = typeof sentimentAnalysis.$inferSelect;
export type ScheduleOptimization = typeof scheduleOptimization.$inferSelect;
export type VideoAnalysis = typeof videoAnalysis.$inferSelect;
export type InsertVideoAnalysis = typeof videoAnalysis.$inferInsert;
export type FanEngagement = typeof fanEngagement.$inferSelect;
export type InsertFanEngagement = typeof fanEngagement.$inferInsert;

// Advanced Facility Booking Types
export type FacilityBooking = typeof facilityBookings.$inferSelect;
export type InsertFacilityBooking = typeof facilityBookings.$inferInsert;
export type FacilityAvailability = typeof facilityAvailability.$inferSelect;
export type InsertFacilityAvailability = typeof facilityAvailability.$inferInsert;
export type FacilityUnavailability = typeof facilityUnavailability.$inferSelect;
export type InsertFacilityUnavailability = typeof facilityUnavailability.$inferInsert;
export type BookingConflict = typeof bookingConflicts.$inferSelect;
export type InsertBookingConflict = typeof bookingConflicts.$inferInsert;
export type FacilityEquipment = typeof facilityEquipment.$inferSelect;
export type InsertFacilityEquipment = typeof facilityEquipment.$inferInsert;
export type RealTimeBookingUpdate = typeof realTimeBookingUpdates.$inferSelect;
export type InsertRealTimeBookingUpdate = typeof realTimeBookingUpdates.$inferInsert;
