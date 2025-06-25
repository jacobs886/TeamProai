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

export async function seedMockData() {
  try {
    console.log("Starting mock data seeding...");

    // Clear existing data (only core tables)
    try {
      await db.delete(gameStats);
    } catch (e) { console.log("gameStats table doesn't exist, skipping..."); }
    
    try {
      await db.delete(teamMessages);
    } catch (e) { console.log("teamMessages table doesn't exist, skipping..."); }
    
    try {
      await db.delete(payments);
    } catch (e) { console.log("payments table doesn't exist, skipping..."); }
    
    try {
      await db.delete(notifications);
    } catch (e) { console.log("notifications table doesn't exist, skipping..."); }
    
    try {
      await db.delete(teamMembers);
    } catch (e) { console.log("teamMembers table doesn't exist, skipping..."); }
    
    try {
      await db.delete(events);
    } catch (e) { console.log("events table doesn't exist, skipping..."); }
    
    try {
      await db.delete(facilities);
    } catch (e) { console.log("facilities table doesn't exist, skipping..."); }
    
    try {
      await db.delete(teams);
    } catch (e) { console.log("teams table doesn't exist, skipping..."); }
    
    try {
      await db.delete(users);
    } catch (e) { console.log("users table doesn't exist, skipping..."); }

    // Insert Users
    const usersList = [
      {
        id: "user-1",
        email: "coach.martinez@example.com",
        firstName: "Carlos",
        lastName: "Martinez",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        role: "team_admin",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2025-01-20")
      },
      {
        id: "user-2",
        email: "coach.johnson@example.com",
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

    try {
      await db.insert(users).values(usersList);
      console.log(`Inserted ${usersList.length} users`);
    } catch (e) {
      console.log("Could not insert users:", e.message);
    }

    // Insert Facilities
    const facilitiesList = [
      {
        name: "Central Sports Complex",
        description: "Premier multi-sport facility with 4 soccer fields, basketball courts, and training facilities",
        location: "123 Sports Drive, Downtown",
        capacity: 500,
        amenities: ["Parking", "Restrooms", "Concessions", "First Aid", "Equipment Storage"],
        contactInfo: "facility@centralsports.com | (555) 123-4567",
        hourlyRate: 150.00,
        availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2025-01-15")
      },
      {
        name: "Riverside Athletic Park",
        description: "Beautiful outdoor facility with natural grass fields and scenic views",
        location: "456 River Road, Riverside",
        capacity: 300,
        amenities: ["Parking", "Restrooms", "Bleachers", "Scoreboard"],
        contactInfo: "info@riversidepark.com | (555) 234-5678",
        hourlyRate: 120.00,
        availability: ["Saturday", "Sunday", "Wednesday", "Friday"],
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2025-01-10")
      },
      {
        name: "Elite Training Center",
        description: "Indoor facility specializing in youth development with video analysis capabilities",
        location: "789 Training Blvd, Northside",
        capacity: 200,
        amenities: ["Climate Control", "Video Analysis", "Strength Training", "Medical Room"],
        contactInfo: "bookings@elitetraining.com | (555) 345-6789",
        hourlyRate: 200.00,
        availability: ["Monday", "Tuesday", "Thursday", "Friday"],
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2025-01-12")
      }
    ];

    try {
      await db.insert(facilities).values(facilitiesList);
      console.log(`Inserted ${facilitiesList.length} facilities`);
    } catch (e) {
      console.log("Could not insert facilities:", e.message);
    }

    // Insert Teams
    const teamsList = [
      {
        name: "Eagles FC U16",
        description: "Competitive soccer team focused on developing young talent with emphasis on teamwork and skill development",
        sport: "soccer",
        ageGroup: "U16",
        skillLevel: "competitive",
        maxMembers: 22,
        ownerId: "user-1",
        season: "Spring 2025",
        league: "Regional Youth Soccer League",
        homeField: "Central Sports Complex - Field 1",
        practiceSchedule: "Tuesday/Thursday 6:00 PM, Saturday 10:00 AM",
        contactInfo: "coach.martinez@eaglesfc.com",
        teamColors: ["Blue", "White"],
        founded: new Date("2020-01-15"),
        achievements: ["Regional Champions 2023", "Fair Play Award 2024"],
        philosophy: "Development through dedication, teamwork, and continuous improvement",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2025-01-20")
      },
      {
        name: "Lions Basketball Academy",
        description: "Youth basketball program emphasizing fundamentals, character building, and competitive excellence",
        sport: "basketball",
        ageGroup: "U14",
        skillLevel: "intermediate",
        maxMembers: 15,
        ownerId: "user-2",
        season: "Winter 2024-25",
        league: "Metro Youth Basketball Association",
        homeField: "Elite Training Center - Court A",
        practiceSchedule: "Monday/Wednesday/Friday 4:00 PM",
        contactInfo: "coach.johnson@lionsbasketball.com",
        teamColors: ["Gold", "Black"],
        founded: new Date("2021-09-01"),
        achievements: ["League Runners-up 2024", "Sportsmanship Award 2023"],
        philosophy: "Building champions on and off the court through discipline and teamwork",
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2025-01-18")
      },
      {
        name: "Thunder Volleyball Club",
        description: "Girls volleyball team promoting athletic excellence and personal growth",
        sport: "volleyball",
        ageGroup: "U18",
        skillLevel: "advanced",
        maxMembers: 12,
        ownerId: "user-1",
        season: "Fall 2024",
        league: "State Volleyball Championship",
        homeField: "Central Sports Complex - Gym",
        practiceSchedule: "Tuesday/Thursday 7:00 PM, Sunday 2:00 PM",
        contactInfo: "thunder@volleyballclub.com",
        teamColors: ["Purple", "Silver"],
        founded: new Date("2019-08-15"),
        achievements: ["State Semi-finalists 2024", "Regional Champions 2023"],
        philosophy: "Empowering athletes through volleyball excellence and leadership development",
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2025-01-15")
      }
    ];

    try {
      await db.insert(teams).values(teamsList);
      console.log(`Inserted ${teamsList.length} teams`);
    } catch (e) {
      console.log("Could not insert teams:", e.message);
    }

    // Insert Team Members
    const teamMembersList = [
      { teamId: 1, userId: "user-1", role: "coach", joinedAt: new Date("2024-01-15") },
      { teamId: 1, userId: "user-3", role: "player", joinedAt: new Date("2024-03-10") },
      { teamId: 1, userId: "user-4", role: "player", joinedAt: new Date("2024-03-15") },
      { teamId: 1, userId: "user-5", role: "player", joinedAt: new Date("2024-04-01") },
      { teamId: 2, userId: "user-2", role: "coach", joinedAt: new Date("2024-02-01") },
      { teamId: 2, userId: "user-6", role: "player", joinedAt: new Date("2024-04-15") },
      { teamId: 3, userId: "user-1", role: "coach", joinedAt: new Date("2024-03-15") }
    ];

    try {
      await db.insert(teamMembers).values(teamMembersList);
      console.log(`Inserted ${teamMembersList.length} team members`);
    } catch (e) {
      console.log("Could not insert team members:", e.message);
    }

    // Insert Events
    const eventsList = [
      {
        title: "Eagles FC vs Lions United",
        description: "Regional league match - crucial game for playoff positioning",
        startTime: new Date("2025-01-25T15:00:00"),
        endTime: new Date("2025-01-25T17:00:00"),
        facilityId: 1,
        teamId: 1,
        eventType: "game",
        isPublic: true,
        status: "scheduled",
        maxParticipants: 22,
        requirements: "Arrive 30 minutes early, bring water and shin guards",
        weatherDependent: true,
        livestreamUrl: "https://stream.eaglesfc.com/game-1",
        createdBy: "user-1",
        createdAt: new Date("2025-01-10"),
        updatedAt: new Date("2025-01-15")
      },
      {
        title: "Eagles FC Training Session",
        description: "Focus on passing combinations and set pieces",
        startTime: new Date("2025-01-23T18:00:00"),
        endTime: new Date("2025-01-23T19:30:00"),
        facilityId: 1,
        teamId: 1,
        eventType: "practice",
        isPublic: false,
        status: "scheduled",
        maxParticipants: 22,
        requirements: "Full training kit required",
        weatherDependent: false,
        createdBy: "user-1",
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-18")
      },
      {
        title: "Lions Basketball Championship Final",
        description: "Season finale - championship game with trophy presentation",
        startTime: new Date("2025-01-28T14:00:00"),
        endTime: new Date("2025-01-28T16:00:00"),
        facilityId: 3,
        teamId: 2,
        eventType: "game",
        isPublic: true,
        status: "scheduled",
        maxParticipants: 15,
        requirements: "Team uniform, arrive 45 minutes early for warm-up",
        weatherDependent: false,
        livestreamUrl: "https://stream.lionsbasketball.com/finals",
        createdBy: "user-2",
        createdAt: new Date("2025-01-12"),
        updatedAt: new Date("2025-01-20")
      },
      {
        title: "Thunder Volleyball Tournament",
        description: "3-day tournament with teams from across the region",
        startTime: new Date("2025-02-01T09:00:00"),
        endTime: new Date("2025-02-03T18:00:00"),
        facilityId: 1,
        teamId: 3,
        eventType: "tournament",
        isPublic: true,
        status: "scheduled",
        maxParticipants: 12,
        requirements: "Tournament packet, medical clearance forms",
        weatherDependent: false,
        createdBy: "user-1",
        createdAt: new Date("2025-01-08"),
        updatedAt: new Date("2025-01-16")
      }
    ];

    try {
      await db.insert(events).values(eventsList);
      console.log(`Inserted ${eventsList.length} events`);
    } catch (e) {
      console.log("Could not insert events:", e.message);
    }

    // Insert Notifications
    const notificationsList = [
      {
        userId: "user-3",
        title: "Game Reminder",
        message: "Eagles FC vs Lions United tomorrow at 3:00 PM at Central Sports Complex",
        type: "reminder",
        priority: "high",
        read: false,
        actionUrl: "/events/1",
        createdAt: new Date("2025-01-24T09:00:00")
      },
      {
        userId: "user-4",
        title: "Payment Due",
        message: "Monthly team fees of $75 are due by January 30th",
        type: "payment",
        priority: "medium",
        read: false,
        actionUrl: "/payments",
        createdAt: new Date("2025-01-20T10:00:00")
      },
      {
        userId: "user-5",
        title: "Training Update",
        message: "Thursday practice moved to 7:00 PM due to facility maintenance",
        type: "schedule_change",
        priority: "high",
        read: true,
        actionUrl: "/events/2",
        createdAt: new Date("2025-01-22T14:30:00")
      },
      {
        userId: "user-1",
        title: "New Team Member",
        message: "Emily Chen has joined Eagles FC U16",
        type: "team_update",
        priority: "low",
        read: true,
        actionUrl: "/teams/1",
        createdAt: new Date("2025-01-19T16:00:00")
      }
    ];

    try {
      await db.insert(notifications).values(notificationsList);
      console.log(`Inserted ${notificationsList.length} notifications`);
    } catch (e) {
      console.log("Could not insert notifications:", e.message);
    }

    // Insert Payments
    const paymentsList = [
      {
        userId: "user-3",
        teamId: 1,
        amount: 75.00,
        description: "Monthly team fees - January 2025",
        dueDate: new Date("2025-01-30"),
        status: "pending",
        paymentType: "monthly_fee",
        createdAt: new Date("2025-01-01")
      },
      {
        userId: "user-4",
        teamId: 1,
        amount: 75.00,
        description: "Monthly team fees - January 2025",
        dueDate: new Date("2025-01-30"),
        status: "pending",
        paymentType: "monthly_fee",
        createdAt: new Date("2025-01-01")
      },
      {
        userId: "user-5",
        teamId: 1,
        amount: 150.00,
        description: "Tournament registration fee",
        dueDate: new Date("2025-01-25"),
        status: "paid",
        paymentType: "tournament_fee",
        paidAt: new Date("2025-01-18T10:30:00"),
        createdAt: new Date("2025-01-10")
      },
      {
        userId: "user-6",
        teamId: 2,
        amount: 100.00,
        description: "Uniform and equipment fee",
        dueDate: new Date("2025-02-01"),
        status: "pending",
        paymentType: "equipment_fee",
        createdAt: new Date("2025-01-15")
      }
    ];

    try {
      await db.insert(payments).values(paymentsList);
      console.log(`Inserted ${paymentsList.length} payments`);
    } catch (e) {
      console.log("Could not insert payments:", e.message);
    }

    // Insert Team Messages
    const teamMessagesList = [
      {
        teamId: 1,
        senderId: "user-1",
        message: "Great practice today team! Remember to work on your first touch during the week.",
        isUrgent: false,
        createdAt: new Date("2025-01-22T20:00:00")
      },
      {
        teamId: 1,
        senderId: "user-3",
        message: "Can't make it to Thursday practice due to doctor's appointment. Will catch up on drills.",
        isUrgent: false,
        replyToId: 1,
        createdAt: new Date("2025-01-23T08:30:00")
      },
      {
        teamId: 1,
        senderId: "user-1",
        message: "URGENT: Game time changed to 2:30 PM for Saturday's match. Please confirm receipt.",
        isUrgent: true,
        createdAt: new Date("2025-01-24T11:15:00")
      },
      {
        teamId: 2,
        senderId: "user-2",
        message: "Championship finals this weekend! Let's give it our all. Team dinner Friday at 6 PM.",
        isUrgent: false,
        createdAt: new Date("2025-01-23T15:45:00")
      }
    ];

    try {
      await db.insert(teamMessages).values(teamMessagesList);
      console.log(`Inserted ${teamMessagesList.length} team messages`);
    } catch (e) {
      console.log("Could not insert team messages:", e.message);
    }

    // Insert Game Stats
    const gameStatsList = [
      {
        eventId: 1,
        playerId: "user-3",
        sport: "soccer",
        stats: {
          goals: 2,
          assists: 1,
          shots: 6,
          passes: 45,
          tackles: 8,
          minutesPlayed: 90,
          yellowCards: 0,
          redCards: 0
        },
        createdAt: new Date("2025-01-20T16:00:00")
      },
      {
        eventId: 1,
        playerId: "user-4",
        sport: "soccer",
        stats: {
          goals: 0,
          assists: 3,
          shots: 2,
          passes: 67,
          tackles: 5,
          minutesPlayed: 90,
          yellowCards: 1,
          redCards: 0
        },
        createdAt: new Date("2025-01-20T16:00:00")
      },
      {
        eventId: 3,
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

    try {
      await db.insert(gameStats).values(gameStatsList);
      console.log(`Inserted ${gameStatsList.length} game stats`);
    } catch (e) {
      console.log("Could not insert game stats:", e.message);
    }

    console.log("Mock data seeding completed successfully!");
    
    return {
      users: usersList.length,
      teams: teamsList.length,
      facilities: facilitiesList.length,
      events: eventsList.length,
      teamMembers: teamMembersList.length,
      notifications: notificationsList.length,
      payments: paymentsList.length,
      teamMessages: teamMessagesList.length,
      gameStats: gameStatsList.length
    };

  } catch (error) {
    console.error("Error seeding mock data:", error);
    throw error;
  }
}