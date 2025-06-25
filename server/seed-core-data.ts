import { db } from "./db";
import { 
  users, 
  teams, 
  facilities, 
  events, 
  teamMembers, 
  notifications, 
  payments,
  teamMessages,
  gameStats
} from "../shared/schema";

export async function seedCoreData() {
  try {
    console.log("Starting core data seeding...");

    // Clear existing data safely
    console.log("Clearing existing data...");
    
    try { await db.delete(gameStats); } catch (e) { /* ignore */ }
    try { await db.delete(teamMessages); } catch (e) { /* ignore */ }
    try { await db.delete(payments); } catch (e) { /* ignore */ }
    try { await db.delete(notifications); } catch (e) { /* ignore */ }
    try { await db.delete(teamMembers); } catch (e) { /* ignore */ }
    try { await db.delete(events); } catch (e) { /* ignore */ }
    try { await db.delete(facilities); } catch (e) { /* ignore */ }
    try { await db.delete(teams); } catch (e) { /* ignore */ }
    try { await db.delete(users); } catch (e) { /* ignore */ }

    // Insert Users
    const usersList = [
      {
        id: "user-1",
        email: "coach.martinez@eaglesfc.com",
        firstName: "Carlos",
        lastName: "Martinez",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        role: "team_admin",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2025-01-20")
      },
      {
        id: "user-2",
        email: "coach.johnson@lionsbasketball.com",
        firstName: "Sarah",
        lastName: "Johnson",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b494?w=150",
        role: "team_admin",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2025-01-18")
      },
      {
        id: "user-3",
        email: "alex.johnson@example.com",
        firstName: "Alex",
        lastName: "Johnson",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        role: "team_user",
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2025-01-19")
      },
      {
        id: "user-4",
        email: "sarah.wilson@example.com",
        firstName: "Sarah",
        lastName: "Wilson",
        profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        role: "team_user",
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2025-01-20")
      },
      {
        id: "user-5",
        email: "mike.rodriguez@example.com",
        firstName: "Mike",
        lastName: "Rodriguez",
        profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        role: "team_user",
        createdAt: new Date("2024-04-01"),
        updatedAt: new Date("2025-01-17")
      },
      {
        id: "user-6",
        email: "emma.davis@example.com",
        firstName: "Emma",
        lastName: "Davis",
        profileImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        role: "team_user",
        createdAt: new Date("2024-04-15"),
        updatedAt: new Date("2025-01-19")
      },
      {
        id: "admin-1",
        email: "admin@teampro.ai",
        firstName: "System",
        lastName: "Administrator",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        role: "super_admin",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2025-01-20")
      }
    ];

    const insertedUsers = await db.insert(users).values(usersList).returning();
    console.log(`✓ Inserted ${insertedUsers.length} users`);

    // Insert Facilities
    const facilitiesList = [
      {
        name: "Central Sports Complex",
        type: "multi-sport",
        address: "123 Sports Drive, Downtown",
        capacity: 500,
        hourlyRate: 150.00,
        amenities: ["Parking", "Restrooms", "Concessions", "First Aid", "Equipment Storage"],
        isActive: true,
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2025-01-15")
      },
      {
        name: "Riverside Athletic Park",
        type: "outdoor",
        address: "456 River Road, Riverside",
        capacity: 300,
        hourlyRate: 120.00,
        amenities: ["Parking", "Restrooms", "Bleachers", "Scoreboard"],
        isActive: true,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2025-01-10")
      },
      {
        name: "Elite Training Center",
        type: "indoor",
        address: "789 Training Blvd, Northside",
        capacity: 200,
        hourlyRate: 200.00,
        amenities: ["Climate Control", "Video Analysis", "Strength Training", "Medical Room"],
        isActive: true,
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2025-01-12")
      }
    ];

    const insertedFacilities = await db.insert(facilities).values(facilitiesList).returning();
    console.log(`✓ Inserted ${insertedFacilities.length} facilities`);

    // Insert Teams
    const teamsList = [
      {
        name: "Eagles FC U16",
        sport: "volleyball",
        category: "U16",
        ownerId: "user-1",
        description: "Competitive soccer team focused on developing young talent with emphasis on teamwork and skill development",
        maxPlayers: 22,
        isActive: true,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2025-01-20")
      },
      {
        name: "Lions Basketball Academy",
        sport: "basketball",
        category: "U14",
        ownerId: "user-2",
        description: "Youth basketball program emphasizing fundamentals, character building, and competitive excellence",
        maxPlayers: 15,
        isActive: true,
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2025-01-18")
      },
      {
        name: "Thunder Volleyball Club",
        sport: "volleyball",
        category: "U18",
        ownerId: "user-1",
        description: "Girls volleyball team promoting athletic excellence and personal growth",
        maxPlayers: 12,
        isActive: true,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2025-01-15")
      }
    ];

    const insertedTeams = await db.insert(teams).values(teamsList).returning();
    console.log(`✓ Inserted ${insertedTeams.length} teams`);

    // Insert Team Members
    const teamMembersList = [
      { teamId: insertedTeams[0].id, userId: "user-1", role: "coach", joinedAt: new Date("2024-01-15") },
      { teamId: insertedTeams[0].id, userId: "user-3", role: "player", joinedAt: new Date("2024-03-10") },
      { teamId: insertedTeams[0].id, userId: "user-4", role: "player", joinedAt: new Date("2024-03-15") },
      { teamId: insertedTeams[0].id, userId: "user-5", role: "player", joinedAt: new Date("2024-04-01") },
      { teamId: insertedTeams[1].id, userId: "user-2", role: "coach", joinedAt: new Date("2024-02-01") },
      { teamId: insertedTeams[1].id, userId: "user-6", role: "player", joinedAt: new Date("2024-04-15") },
      { teamId: insertedTeams[2].id, userId: "user-1", role: "coach", joinedAt: new Date("2024-03-15") }
    ];

    const insertedTeamMembers = await db.insert(teamMembers).values(teamMembersList).returning();
    console.log(`✓ Inserted ${insertedTeamMembers.length} team members`);

    // Insert Events
    const eventsList = [
      {
        title: "Eagles FC vs Lions United",
        description: "Regional league match - crucial game for playoff positioning",
        type: "game",
        sport: "volleyball",
        teamId: insertedTeams[0].id,
        facilityId: insertedFacilities[0].id,
        organizerId: "user-1",
        startTime: new Date("2025-01-25T15:00:00"),
        endTime: new Date("2025-01-25T17:00:00"),
        status: "scheduled",
        maxParticipants: 22,
        isRecurring: false,
        createdAt: new Date("2025-01-10"),
        updatedAt: new Date("2025-01-15")
      },
      {
        title: "Eagles FC Training Session",
        description: "Focus on passing combinations and set pieces",
        type: "practice",
        sport: "volleyball",
        teamId: insertedTeams[0].id,
        facilityId: insertedFacilities[0].id,
        organizerId: "user-1",
        startTime: new Date("2025-01-23T18:00:00"),
        endTime: new Date("2025-01-23T19:30:00"),
        status: "scheduled",
        maxParticipants: 22,
        isRecurring: false,
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-18")
      },
      {
        title: "Lions Basketball Championship Final",
        description: "Season finale - championship game with trophy presentation",
        type: "game",
        sport: "basketball",
        teamId: insertedTeams[1].id,
        facilityId: insertedFacilities[2].id,
        organizerId: "user-2",
        startTime: new Date("2025-01-28T14:00:00"),
        endTime: new Date("2025-01-28T16:00:00"),
        status: "scheduled",
        maxParticipants: 15,
        isRecurring: false,
        createdAt: new Date("2025-01-12"),
        updatedAt: new Date("2025-01-20")
      }
    ];

    const insertedEvents = await db.insert(events).values(eventsList).returning();
    console.log(`✓ Inserted ${insertedEvents.length} events`);

    // Insert Notifications
    const notificationsList = [
      {
        userId: "user-3",
        title: "Game Reminder",
        message: "Eagles FC vs Lions United tomorrow at 3:00 PM at Central Sports Complex",
        type: "info",
        isRead: false,
        isUrgent: false,
        relatedEntityType: "event",
        relatedEntityId: insertedEvents[0].id,
        createdAt: new Date("2025-01-24T09:00:00")
      },
      {
        userId: "user-4",
        title: "Payment Due",
        message: "Monthly team fees of $75 are due by January 30th",
        type: "warning",
        isRead: false,
        isUrgent: false,
        relatedEntityType: "payment",
        relatedEntityId: 1,
        createdAt: new Date("2025-01-20T10:00:00")
      },
      {
        userId: "user-5",
        title: "Training Update",
        message: "Thursday practice moved to 7:00 PM due to facility maintenance",
        type: "urgent",
        isRead: true,
        isUrgent: true,
        relatedEntityType: "event",
        relatedEntityId: insertedEvents[1].id,
        createdAt: new Date("2025-01-22T14:30:00")
      },
      {
        userId: "user-1",
        title: "New Team Member",
        message: "Emily Chen has joined Eagles FC U16",
        type: "success",
        isRead: true,
        isUrgent: false,
        relatedEntityType: "team",
        relatedEntityId: insertedTeams[0].id,
        createdAt: new Date("2025-01-19T16:00:00")
      }
    ];

    const insertedNotifications = await db.insert(notifications).values(notificationsList).returning();
    console.log(`✓ Inserted ${insertedNotifications.length} notifications`);

    // Insert Payments
    const paymentsList = [
      {
        userId: "user-3",
        teamId: insertedTeams[0].id,
        amount: 75.00,
        currency: "USD",
        type: "registration",
        status: "pending",
        description: "Monthly team fees - January 2025",
        dueDate: new Date("2025-01-30"),
        createdAt: new Date("2025-01-01")
      },
      {
        userId: "user-4",
        teamId: insertedTeams[0].id,
        amount: 75.00,
        currency: "USD",
        type: "registration",
        status: "pending",
        description: "Monthly team fees - January 2025",
        dueDate: new Date("2025-01-30"),
        createdAt: new Date("2025-01-01")
      },
      {
        userId: "user-5",
        teamId: insertedTeams[0].id,
        amount: 150.00,
        currency: "USD",
        type: "registration",
        status: "completed",
        description: "Tournament registration fee",
        dueDate: new Date("2025-01-25"),
        paidAt: new Date("2025-01-18T10:30:00"),
        createdAt: new Date("2025-01-10")
      },
      {
        userId: "user-6",
        teamId: insertedTeams[1].id,
        amount: 100.00,
        currency: "USD",
        type: "equipment",
        status: "pending",
        description: "Uniform and equipment fee",
        dueDate: new Date("2025-02-01"),
        createdAt: new Date("2025-01-15")
      }
    ];

    const insertedPayments = await db.insert(payments).values(paymentsList).returning();
    console.log(`✓ Inserted ${insertedPayments.length} payments`);

    // Insert Team Messages
    const teamMessagesList = [
      {
        teamId: insertedTeams[0].id,
        senderId: "user-1",
        message: "Great practice today team! Remember to work on your first touch during the week.",
        isUrgent: false,
        createdAt: new Date("2025-01-22T20:00:00")
      },
      {
        teamId: insertedTeams[0].id,
        senderId: "user-3",
        message: "Can't make it to Thursday practice due to doctor's appointment. Will catch up on drills.",
        isUrgent: false,
        replyToId: 1,
        createdAt: new Date("2025-01-23T08:30:00")
      },
      {
        teamId: insertedTeams[0].id,
        senderId: "user-1",
        message: "URGENT: Game time changed to 2:30 PM for Saturday's match. Please confirm receipt.",
        isUrgent: true,
        createdAt: new Date("2025-01-24T11:15:00")
      },
      {
        teamId: insertedTeams[1].id,
        senderId: "user-2",
        message: "Championship finals this weekend! Let's give it our all. Team dinner Friday at 6 PM.",
        isUrgent: false,
        createdAt: new Date("2025-01-23T15:45:00")
      }
    ];

    const insertedMessages = await db.insert(teamMessages).values(teamMessagesList).returning();
    console.log(`✓ Inserted ${insertedMessages.length} team messages`);

    // Insert Game Stats
    const gameStatsList = [
      {
        eventId: insertedEvents[0].id,
        playerId: "user-3",
        sport: "volleyball",
        stats: {
          kills: 12,
          assists: 8,
          blocks: 4,
          digs: 15,
          aces: 3,
          errors: 2,
          attackPercentage: 0.68,
          setsPlayed: 3
        },
        createdAt: new Date("2025-01-20T16:00:00")
      },
      {
        eventId: insertedEvents[0].id,
        playerId: "user-4",
        sport: "volleyball",
        stats: {
          kills: 8,
          assists: 22,
          blocks: 2,
          digs: 18,
          aces: 5,
          errors: 1,
          attackPercentage: 0.75,
          setsPlayed: 3
        },
        createdAt: new Date("2025-01-20T16:00:00")
      },
      {
        eventId: insertedEvents[2].id,
        playerId: "user-6",
        sport: "basketball",
        stats: {
          points: 18,
          rebounds: 7,
          assists: 4,
          steals: 3,
          blocks: 1,
          turnovers: 2,
          fieldGoalPercentage: 0.62,
          freeThrowPercentage: 0.85
        },
        createdAt: new Date("2025-01-18T15:30:00")
      }
    ];

    const insertedStats = await db.insert(gameStats).values(gameStatsList).returning();
    console.log(`✓ Inserted ${insertedStats.length} game stats`);

    console.log("✅ Core data seeding completed successfully!");
    
    return {
      users: insertedUsers.length,
      facilities: insertedFacilities.length,
      teams: insertedTeams.length,
      teamMembers: insertedTeamMembers.length,
      events: insertedEvents.length,
      notifications: insertedNotifications.length,
      payments: insertedPayments.length,
      teamMessages: insertedMessages.length,
      gameStats: insertedStats.length,
      totalRecords: insertedUsers.length + insertedFacilities.length + insertedTeams.length + 
                   insertedTeamMembers.length + insertedEvents.length + insertedNotifications.length +
                   insertedPayments.length + insertedMessages.length + insertedStats.length
    };

  } catch (error) {
    console.error("Error seeding core data:", error);
    throw error;
  }
}