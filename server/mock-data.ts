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
  gameStats,
  guardians,
  players,
  playerGuardians,
  skillsTracking,
  equipment,
  volunteers,
  playerDevelopment,
  aiChatbots,
  sentimentAnalysis,
  communicationLogs,
  facilityBookings,
  scheduleOptimization,
  videoAnalysis,
  fanEngagement
} from "../shared/schema";

export async function seedMockData() {
  try {
    console.log("Starting mock data seeding...");

    // Clear existing data
    await db.delete(fanEngagement);
    await db.delete(videoAnalysis);
    await db.delete(scheduleOptimization);
    await db.delete(facilityBookings);
    await db.delete(communicationLogs);
    await db.delete(sentimentAnalysis);
    await db.delete(aiChatbots);
    await db.delete(playerDevelopment);
    await db.delete(volunteers);
    await db.delete(equipment);
    await db.delete(skillsTracking);
    await db.delete(playerGuardians);
    await db.delete(players);
    await db.delete(guardians);
    await db.delete(gameStats);
    await db.delete(teamMessages);
    await db.delete(payments);
    await db.delete(notifications);
    await db.delete(teamMembers);
    await db.delete(events);
    await db.delete(facilities);
    await db.delete(teams);
    await db.delete(users);

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

    await db.insert(users).values(usersList);

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

    await db.insert(facilities).values(facilitiesList);

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

    await db.insert(teams).values(teamsList);

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

    await db.insert(teamMembers).values(teamMembersList);

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

    await db.insert(events).values(eventsList);

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

    await db.insert(notifications).values(notificationsList);

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

    await db.insert(payments).values(paymentsList);

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

    await db.insert(teamMessages).values(teamMessagesList);

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

    await db.insert(gameStats).values(gameStatsList);

    // Insert Guardians
    const guardiansList = [
      {
        id: "guardian-1",
        firstName: "Robert",
        lastName: "Johnson",
        email: "robert.johnson@email.com",
        phone: "+1-555-123-4567",
        relationship: "father",
        emergencyContact: true,
        address: "123 Oak Street, Springfield, ST 12345",
        occupation: "Engineer",
        medicalInfo: "No known allergies",
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2025-01-15")
      },
      {
        id: "guardian-2",
        firstName: "Jennifer",
        lastName: "Johnson",
        email: "jennifer.johnson@email.com",
        phone: "+1-555-123-4568",
        relationship: "mother",
        emergencyContact: true,
        address: "123 Oak Street, Springfield, ST 12345",
        occupation: "Teacher",
        medicalInfo: "No known allergies",
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2025-01-15")
      },
      {
        id: "guardian-3",
        firstName: "David",
        lastName: "Wilson",
        email: "david.wilson@email.com",
        phone: "+1-555-234-5678",
        relationship: "father",
        emergencyContact: true,
        address: "456 Pine Avenue, Springfield, ST 12345",
        occupation: "Doctor",
        medicalInfo: "Asthma inhaler required",
        createdAt: new Date("2024-03-05"),
        updatedAt: new Date("2025-01-18")
      }
    ];

    await db.insert(guardians).values(guardiansList);

    // Insert Players
    const playersList = [
      {
        id: "player-1",
        userId: "user-3",
        teamId: 1,
        jerseyNumber: 10,
        position: "Forward",
        height: "5'8\"",
        weight: "145 lbs",
        dateOfBirth: new Date("2008-05-15"),
        medicalInfo: "No known allergies or conditions",
        emergencyContact: "Robert Johnson - +1-555-123-4567",
        skillLevel: "intermediate",
        dominantFoot: "right",
        previousExperience: "3 years club soccer",
        goals: "Improve shooting accuracy and speed",
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2025-01-20")
      },
      {
        id: "player-2",
        userId: "user-4",
        teamId: 1,
        jerseyNumber: 8,
        position: "Midfielder",
        height: "5'6\"",
        weight: "135 lbs",
        dateOfBirth: new Date("2008-07-22"),
        medicalInfo: "Mild asthma - inhaler available",
        emergencyContact: "David Wilson - +1-555-234-5678",
        skillLevel: "advanced",
        dominantFoot: "left",
        previousExperience: "5 years competitive soccer",
        goals: "Develop leadership skills and tactical awareness",
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2025-01-19")
      },
      {
        id: "player-3",
        userId: "user-5",
        teamId: 1,
        jerseyNumber: 1,
        position: "Goalkeeper",
        height: "5'10\"",
        weight: "155 lbs",
        dateOfBirth: new Date("2008-02-10"),
        medicalInfo: "Previous knee injury - fully recovered",
        emergencyContact: "Maria Rodriguez - +1-555-345-6789",
        skillLevel: "intermediate",
        dominantFoot: "right",
        previousExperience: "2 years goalkeeper training",
        goals: "Improve distribution and communication",
        createdAt: new Date("2024-04-01"),
        updatedAt: new Date("2025-01-17")
      }
    ];

    await db.insert(players).values(playersList);

    // Insert Player-Guardian relationships
    const playerGuardiansList = [
      { playerId: "player-1", guardianId: "guardian-1", isPrimary: true },
      { playerId: "player-1", guardianId: "guardian-2", isPrimary: false },
      { playerId: "player-2", guardianId: "guardian-3", isPrimary: true }
    ];

    await db.insert(playerGuardians).values(playerGuardiansList);

    // Insert Skills Tracking
    const skillsTrackingList = [
      {
        playerId: "player-1",
        skill: "Shooting",
        currentLevel: 7.5,
        targetLevel: 9.0,
        lastAssessment: new Date("2025-01-15"),
        nextAssessment: new Date("2025-02-15"),
        improvementPlan: "Focus on power and accuracy from various angles",
        assessmentHistory: [
          { date: "2024-11-15", level: 6.8, notes: "Good technique, needs more power" },
          { date: "2024-12-15", level: 7.2, notes: "Improved power, working on accuracy" },
          { date: "2025-01-15", level: 7.5, notes: "Consistent improvement, ready for advanced drills" }
        ],
        coachNotes: "Excellent progress in shooting. Ready for 1v1 finishing drills.",
        createdAt: new Date("2024-11-01"),
        updatedAt: new Date("2025-01-15")
      },
      {
        playerId: "player-2",
        skill: "Passing",
        currentLevel: 8.8,
        targetLevel: 9.5,
        lastAssessment: new Date("2025-01-18"),
        nextAssessment: new Date("2025-02-18"),
        improvementPlan: "Work on long-range passing and vision under pressure",
        assessmentHistory: [
          { date: "2024-11-18", level: 8.2, notes: "Excellent short passing, develop long range" },
          { date: "2024-12-18", level: 8.5, notes: "Improved vision and decision making" },
          { date: "2025-01-18", level: 8.8, notes: "Outstanding progress, elite level potential" }
        ],
        coachNotes: "Elite passing ability. Focus on leadership and directing teammates.",
        createdAt: new Date("2024-11-01"),
        updatedAt: new Date("2025-01-18")
      }
    ];

    await db.insert(skillsTracking).values(skillsTrackingList);

    // Insert Equipment
    const equipmentList = [
      {
        name: "Soccer Balls - Size 5",
        category: "training",
        quantity: 20,
        condition: "excellent",
        location: "Central Sports Complex - Storage Room A",
        purchaseDate: new Date("2024-08-15"),
        purchaseCost: 400.00,
        supplier: "SportsTech Equipment Co.",
        maintenanceSchedule: "Monthly inspection and inflation check",
        warrantyExpiration: new Date("2026-08-15"),
        assignedTo: "Eagles FC U16",
        serialNumbers: ["SB-001", "SB-002", "SB-003"],
        usageLog: [
          { date: "2025-01-20", usage: "Training session", condition: "Good" },
          { date: "2025-01-18", usage: "Match vs Lions", condition: "Excellent" }
        ],
        createdAt: new Date("2024-08-15"),
        updatedAt: new Date("2025-01-20")
      },
      {
        name: "Training Cones",
        category: "training",
        quantity: 50,
        condition: "good",
        location: "Central Sports Complex - Storage Room A",
        purchaseDate: new Date("2024-06-01"),
        purchaseCost: 150.00,
        supplier: "TrainingGear Ltd.",
        maintenanceSchedule: "Weekly cleaning and damage check",
        assignedTo: "All Teams",
        usageLog: [
          { date: "2025-01-22", usage: "Eagles FC training", condition: "Good" },
          { date: "2025-01-19", usage: "Lions basketball drills", condition: "Good" }
        ],
        createdAt: new Date("2024-06-01"),
        updatedAt: new Date("2025-01-22")
      },
      {
        name: "First Aid Kit",
        category: "safety",
        quantity: 3,
        condition: "excellent",
        location: "Multiple locations",
        purchaseDate: new Date("2024-09-01"),
        purchaseCost: 75.00,
        supplier: "MedSupply Inc.",
        maintenanceSchedule: "Monthly inventory and expiration check",
        warrantyExpiration: new Date("2025-09-01"),
        assignedTo: "Emergency Use",
        usageLog: [
          { date: "2025-01-15", usage: "Minor cut treatment", condition: "Excellent" }
        ],
        createdAt: new Date("2024-09-01"),
        updatedAt: new Date("2025-01-15")
      }
    ];

    await db.insert(equipment).values(equipmentList);

    // Insert Volunteers
    const volunteersList = [
      {
        name: "Lisa Thompson",
        email: "lisa.thompson@email.com",
        phone: "+1-555-456-7890",
        skills: ["Event coordination", "Photography", "First aid certified"],
        availability: ["Saturday", "Sunday"],
        preferredRoles: ["Event coordinator", "Team photographer"],
        experience: "5 years volunteering with youth sports",
        backgroundCheck: true,
        emergencyContact: "Tom Thompson - +1-555-456-7891",
        assignedTeams: [1, 2],
        activeAssignments: [
          {
            eventId: 1,
            role: "Team photographer",
            date: "2025-01-25",
            status: "confirmed"
          }
        ],
        volunteerHours: 45,
        createdAt: new Date("2024-05-15"),
        updatedAt: new Date("2025-01-20")
      },
      {
        name: "Mark Davis",
        email: "mark.davis@email.com",
        phone: "+1-555-567-8901",
        skills: ["Referee certification", "Equipment management", "Transportation"],
        availability: ["Tuesday", "Thursday", "Saturday"],
        preferredRoles: ["Referee", "Equipment manager"],
        experience: "8 years as certified referee",
        backgroundCheck: true,
        emergencyContact: "Susan Davis - +1-555-567-8902",
        assignedTeams: [1, 3],
        activeAssignments: [
          {
            eventId: 1,
            role: "Referee",
            date: "2025-01-25",
            status: "confirmed"
          }
        ],
        volunteerHours: 72,
        createdAt: new Date("2024-03-20"),
        updatedAt: new Date("2025-01-18")
      }
    ];

    await db.insert(volunteers).values(volunteersList);

    // Insert Player Development
    const playerDevelopmentList = [
      {
        playerId: "player-1",
        coachId: "user-1",
        assessmentDate: new Date("2025-01-15"),
        strengths: ["Shooting accuracy", "Ball control", "Work ethic"],
        weaknesses: ["Defensive positioning", "Aerial ability", "Left foot"],
        goals: ["Improve defending", "Develop weaker foot", "Increase speed"],
        trainingPlan: {
          focus: "Defensive skills and speed development",
          duration: "8 weeks",
          sessionsPerWeek: 3,
          specificDrills: [
            "1v1 defending practice",
            "Sprint interval training",
            "Left foot skill work"
          ]
        },
        progressNotes: "Showing improvement in defensive awareness. Speed training paying off.",
        nextReview: new Date("2025-03-15"),
        skillRatings: {
          technical: 8.2,
          physical: 7.5,
          tactical: 6.8,
          mental: 8.0
        },
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-20")
      },
      {
        playerId: "player-2",
        coachId: "user-1",
        assessmentDate: new Date("2025-01-18"),
        strengths: ["Passing vision", "Leadership", "Game intelligence"],
        weaknesses: ["Physical strength", "Shooting power", "Pace"],
        goals: ["Increase shooting power", "Build physical strength", "Develop pace"],
        trainingPlan: {
          focus: "Physical development and shooting power",
          duration: "10 weeks",
          sessionsPerWeek: 4,
          specificDrills: [
            "Strength training program",
            "Power shooting drills",
            "Sprint acceleration work"
          ]
        },
        progressNotes: "Excellent technical ability. Working on physical aspects to complete development.",
        nextReview: new Date("2025-03-18"),
        skillRatings: {
          technical: 9.1,
          physical: 6.9,
          tactical: 8.8,
          mental: 8.5
        },
        createdAt: new Date("2025-01-18"),
        updatedAt: new Date("2025-01-20")
      }
    ];

    await db.insert(playerDevelopment).values(playerDevelopmentList);

    // Insert AI Chatbots
    const aiChatbotsList = [
      {
        name: "Eagles FC Assistant",
        teamId: 1,
        purpose: "Team communication and information assistance",
        personality: "Friendly, encouraging, and knowledgeable about soccer",
        trainingData: [
          "Team roster and player information",
          "Practice schedules and game times",
          "Soccer rules and terminology",
          "Team history and achievements"
        ],
        responseAccuracy: 0.94,
        queriesHandled: 287,
        avgResponseTime: 1.2,
        userSatisfaction: 4.6,
        lastTrainingUpdate: new Date("2025-01-15"),
        isActive: true,
        createdAt: new Date("2024-12-01"),
        updatedAt: new Date("2025-01-20")
      },
      {
        name: "General Sports AI",
        teamId: null,
        purpose: "General sports information and guidance",
        personality: "Professional, informative, and supportive",
        trainingData: [
          "Multi-sport rules and regulations",
          "Training techniques and best practices",
          "Sports medicine and injury prevention",
          "Youth development principles"
        ],
        responseAccuracy: 0.91,
        queriesHandled: 523,
        avgResponseTime: 1.8,
        userSatisfaction: 4.3,
        lastTrainingUpdate: new Date("2025-01-10"),
        isActive: true,
        createdAt: new Date("2024-11-15"),
        updatedAt: new Date("2025-01-18")
      }
    ];

    await db.insert(aiChatbots).values(aiChatbotsList);

    // Insert Sentiment Analysis
    const sentimentAnalysisList = [
      {
        messageId: 1,
        sentiment: "positive",
        confidence: 0.89,
        emotions: ["encouragement", "satisfaction"],
        toxicity: 0.02,
        urgency: 0.15,
        intent: "informational",
        keywords: ["practice", "team", "improvement"],
        languageDetected: "en",
        createdAt: new Date("2025-01-22T20:05:00")
      },
      {
        messageId: 3,
        sentiment: "neutral",
        confidence: 0.76,
        emotions: ["urgency", "importance"],
        toxicity: 0.01,
        urgency: 0.92,
        intent: "urgent",
        keywords: ["urgent", "game", "time", "change"],
        languageDetected: "en",
        createdAt: new Date("2025-01-24T11:20:00")
      }
    ];

    await db.insert(sentimentAnalysis).values(sentimentAnalysisList);

    // Insert Communication Logs
    const communicationLogsList = [
      {
        userId: "user-3",
        channel: "app",
        messageContent: "Practice reminder: Thursday 6:00 PM at Central Sports Complex",
        recipientType: "individual",
        status: "delivered",
        deliveryTime: new Date("2025-01-22T08:00:00"),
        readTime: new Date("2025-01-22T08:15:00"),
        intent: "reminder",
        sentiment: "neutral",
        priority: "medium",
        messageId: "msg-001",
        createdAt: new Date("2025-01-22T08:00:00")
      },
      {
        userId: "user-1",
        channel: "sms",
        messageContent: "Game time changed to 2:30 PM. Please confirm receipt.",
        recipientType: "team",
        status: "delivered",
        deliveryTime: new Date("2025-01-24T11:15:00"),
        readTime: new Date("2025-01-24T11:18:00"),
        intent: "urgent",
        sentiment: "neutral",
        priority: "high",
        messageId: "msg-002",
        createdAt: new Date("2025-01-24T11:15:00")
      },
      {
        userId: "user-4",
        channel: "email",
        messageContent: "Monthly newsletter with team updates and upcoming events",
        recipientType: "team",
        status: "delivered",
        deliveryTime: new Date("2025-01-20T09:00:00"),
        readTime: new Date("2025-01-20T10:30:00"),
        intent: "informational",
        sentiment: "positive",
        priority: "low",
        messageId: "msg-003",
        createdAt: new Date("2025-01-20T09:00:00")
      }
    ];

    await db.insert(communicationLogs).values(communicationLogsList);

    // Insert Facility Bookings
    const facilityBookingsList = [
      {
        facilityId: 1,
        teamId: 1,
        userId: "user-1",
        startTime: new Date("2025-01-25T15:00:00"),
        endTime: new Date("2025-01-25T17:00:00"),
        purpose: "League match vs Lions United",
        status: "confirmed",
        cost: 300.00,
        paymentStatus: "paid",
        specialRequirements: "Goal nets, corner flags, medical kit",
        equipmentNeeded: ["Soccer goals", "Corner flags", "First aid kit"],
        participantCount: 22,
        contactPerson: "Carlos Martinez",
        emergencyContact: "+1-555-123-4567",
        createdAt: new Date("2025-01-10T10:00:00"),
        updatedAt: new Date("2025-01-15T14:30:00")
      },
      {
        facilityId: 3,
        teamId: 2,
        userId: "user-2",
        startTime: new Date("2025-01-28T14:00:00"),
        endTime: new Date("2025-01-28T16:00:00"),
        purpose: "Championship final game",
        status: "confirmed",
        cost: 400.00,
        paymentStatus: "paid",
        specialRequirements: "Championship setup, trophy table, live streaming equipment",
        equipmentNeeded: ["Basketball hoops", "Scoreboard", "Trophy table"],
        participantCount: 15,
        contactPerson: "Sarah Johnson",
        emergencyContact: "+1-555-234-5678",
        createdAt: new Date("2025-01-12T09:00:00"),
        updatedAt: new Date("2025-01-20T11:00:00")
      }
    ];

    await db.insert(facilityBookings).values(facilityBookingsList);

    // Insert Schedule Optimization
    const scheduleOptimizationList = [
      {
        teamId: 1,
        optimizationDate: new Date("2025-01-20"),
        algorithm: "ai_conflict_detection",
        parameters: {
          priorityWeights: {
            playerAvailability: 0.4,
            facilityAvailability: 0.3,
            coachPreference: 0.2,
            travelDistance: 0.1
          },
          constraintsConsidered: ["player_conflicts", "facility_availability", "weather_conditions"],
          optimizationGoals: ["minimize_conflicts", "maximize_attendance", "optimize_travel"]
        },
        originalScheduleConflicts: 8,
        optimizedScheduleConflicts: 2,
        improvementPercentage: 75.0,
        recommendedChanges: [
          "Move Tuesday practice to Wednesday 7:00 PM",
          "Reschedule away game to avoid player exam conflicts",
          "Combine U14 and U16 transport for away games"
        ],
        implementationStatus: "partially_implemented",
        coachApproval: true,
        playerFeedback: 4.2,
        createdAt: new Date("2025-01-20T14:00:00"),
        updatedAt: new Date("2025-01-22T16:30:00")
      }
    ];

    await db.insert(scheduleOptimization).values(scheduleOptimizationList);

    // Insert Video Analysis
    const videoAnalysisList = [
      {
        eventId: 1,
        playerId: "player-1",
        videoUrl: "https://video.eaglesfc.com/analysis/player1-game1",
        analysisType: "individual_performance",
        aiInsights: {
          performanceMetrics: {
            ballTouches: 67,
            successfulPasses: 42,
            shotsOnTarget: 4,
            defensiveActions: 12
          },
          strengthsIdentified: ["Quick decision making", "Good first touch", "Effective pressing"],
          areasForImprovement: ["Defensive positioning", "Left foot usage", "Aerial duels"],
          tacticalAnalysis: "Player shows good understanding of team shape but needs work on defensive transitions"
        },
        coachNotes: "Excellent attacking play. Focus on defensive responsibilities in training.",
        playerFeedback: "Really helpful to see my positioning mistakes. Will work on them.",
        analysisDate: new Date("2025-01-21T10:00:00"),
        shareWithPlayer: true,
        shareWithParents: true,
        tags: ["attacking", "positioning", "development"],
        createdAt: new Date("2025-01-21T10:00:00"),
        updatedAt: new Date("2025-01-22T14:15:00")
      }
    ];

    await db.insert(videoAnalysis).values(videoAnalysisList);

    // Insert Fan Engagement
    const fanEngagementList = [
      {
        teamId: 1,
        contentType: "match_preview",
        title: "Eagles FC vs Lions United - Match Preview",
        content: "This Saturday's match against Lions United promises to be an exciting encounter. Our team has been training hard and is ready to showcase their skills.",
        mediaUrls: ["https://images.eaglesfc.com/match-preview-1.jpg"],
        engagement: {
          views: 247,
          likes: 34,
          shares: 12,
          comments: 8
        },
        demographics: {
          ageGroups: { "13-17": 45, "18-35": 32, "36-50": 23 },
          geography: { "local": 78, "regional": 22 },
          fanType: { "parents": 65, "community": 25, "alumni": 10 }
        },
        publishedAt: new Date("2025-01-22T18:00:00"),
        isActive: true,
        scheduledFor: new Date("2025-01-25T12:00:00"),
        createdBy: "user-1",
        createdAt: new Date("2025-01-22T17:30:00"),
        updatedAt: new Date("2025-01-24T09:15:00")
      },
      {
        teamId: 2,
        contentType: "player_spotlight",
        title: "Player Spotlight: Emma Davis - Rising Star",
        content: "Get to know Emma Davis, our talented point guard who has been leading the team with exceptional court vision and leadership.",
        mediaUrls: ["https://images.lionsbasketball.com/emma-spotlight.jpg"],
        engagement: {
          views: 156,
          likes: 28,
          shares: 6,
          comments: 14
        },
        demographics: {
          ageGroups: { "13-17": 52, "18-35": 28, "36-50": 20 },
          geography: { "local": 82, "regional": 18 },
          fanType: { "parents": 58, "community": 30, "alumni": 12 }
        },
        publishedAt: new Date("2025-01-20T15:00:00"),
        isActive: true,
        createdBy: "user-2",
        createdAt: new Date("2025-01-20T14:30:00"),
        updatedAt: new Date("2025-01-21T10:20:00")
      }
    ];

    await db.insert(fanEngagement).values(fanEngagementList);

    console.log("Mock data seeding completed successfully!");
    
    return {
      users: usersList.length,
      teams: teamsList.length,
      facilities: facilitiesList.length,
      events: eventsList.length,
      notifications: notificationsList.length,
      payments: paymentsList.length,
      teamMessages: teamMessagesList.length,
      gameStats: gameStatsList.length,
      guardians: guardiansList.length,
      players: playersList.length,
      playerGuardians: playerGuardiansList.length,
      skillsTracking: skillsTrackingList.length,
      equipment: equipmentList.length,
      volunteers: volunteersList.length,
      playerDevelopment: playerDevelopmentList.length,
      aiChatbots: aiChatbotsList.length,
      sentimentAnalysis: sentimentAnalysisList.length,
      communicationLogs: communicationLogsList.length,
      facilityBookings: facilityBookingsList.length,
      scheduleOptimization: scheduleOptimizationList.length,
      videoAnalysis: videoAnalysisList.length,
      fanEngagement: fanEngagementList.length
    };

  } catch (error) {
    console.error("Error seeding mock data:", error);
    throw error;
  }
}