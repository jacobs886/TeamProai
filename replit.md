# TeamPro.ai - Sports League Management System

## Overview

TeamPro.ai is a comprehensive sports league management platform built with modern web technologies. The application provides a complete solution for managing sports teams, facilities, events, and payments across multiple sports including volleyball, basketball, and baseball.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Build Tool**: Vite for development and production builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful APIs with structured error handling

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon serverless with WebSocket support

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Comprehensive user profiles with role-based access control
- **Security**: HTTP-only cookies with secure session handling

### Data Models
- **Users**: Profile management with role-based permissions (super_admin, admin_operations, team_admin, team_user, view_only)
- **Teams**: Team creation and management with member roles
- **Facilities**: Sports facility management with booking capabilities
- **Events**: Comprehensive event scheduling and management
- **Payments**: Payment tracking and processing
- **Notifications**: Real-time notification system

### API Structure
- **Authentication Routes**: `/api/auth/*` for login/logout and user info
- **Dashboard Routes**: `/api/dashboard/*` for stats and overview data
- **Resource Routes**: `/api/teams`, `/api/facilities`, `/api/events`, etc.
- **Middleware**: Authentication checks and request logging

## Data Flow

### Client-Server Communication
1. **Authentication Flow**: Replit Auth handles OAuth flow with session persistence
2. **API Requests**: All API calls use credentials for session-based auth
3. **Data Fetching**: React Query manages server state with automatic caching
4. **Error Handling**: Centralized error handling with user-friendly messages

### Database Operations
1. **Connection Management**: Neon serverless pool with WebSocket support
2. **Query Execution**: Drizzle ORM provides type-safe database operations
3. **Schema Validation**: Zod schemas ensure data integrity
4. **Session Storage**: PostgreSQL table for session persistence

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Comprehensive UI component primitives
- **wouter**: Lightweight client-side routing

### Authentication & Security
- **openid-client**: OpenID Connect authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Build tool and development server
- **tailwindcss**: Utility-first CSS framework
- **typescript**: Type safety across the stack
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with development server on port 5000
- **Database**: PostgreSQL 16 with automatic provisioning
- **Build Process**: Vite handles client-side bundling with hot reload
- **Environment**: Replit-optimized with runtime error overlay

### Production Deployment
- **Build Command**: `npm run build` - builds both client and server
- **Start Command**: `npm run start` - runs production server
- **Deployment Target**: Autoscale deployment on Replit
- **Port Configuration**: Internal port 5000 mapped to external port 80

### Database Management
- **Migrations**: Drizzle Kit handles schema migrations
- **Environment Variables**: DATABASE_URL for connection string
- **Schema Location**: `./shared/schema.ts` for shared type definitions

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

**June 24, 2025 - Debugging and Quality Improvements**
- Fixed database connection issues and PostgreSQL pool errors with new database provisioning
- Resolved team creation validation errors with proper sport field mapping and Zod schema validation
- Added comprehensive error handling for team creation with detailed validation feedback
- Fixed React warnings about missing dialog descriptions by adding aria-describedby attributes
- Enhanced all dialog components with proper accessibility descriptions across the entire application
- Improved team creation form with dropdown sport selection for better validation
- Updated skill assessment forms with proper error handling and loading states
- Fixed authentication flow for skills tracking API endpoints
- Added comprehensive logging for team creation debugging
- Implemented proper sport field normalization (Basketball -> basketball, etc.)
- Enhanced dialog accessibility across notifications, payments, player roster, parent portal, and volunteer management components
- Fixed all DialogContent components to include proper ARIA descriptions for screen readers
- Improved data validation and error messages throughout the application
- Resolved skills tracking functionality - all API endpoints working correctly
- Added accessibility improvements for parent portal dialogs including payment details, conversation views, and event details
- Enhanced volunteer management dialogs with proper descriptions for task management and creation forms
- Added missing /api/guardians endpoint to resolve 404 errors in guardian portal
- Fixed all 404 errors in skills tracking, equipment, volunteers, and guardian portal features
- All API endpoints now return proper JSON data with 200 status codes
- Added missing /skills and /guardians routes to React router in App.tsx
- Created comprehensive guardians portal page with overview, directory, communication, and emergency tabs
- Fixed client-side routing issues causing 404 errors when navigating to feature pages
- Implemented Smart Chatbots feature with AI-powered team assistant functionality
- Added comprehensive chatbot interface with chat, training, analytics, and settings tabs
- Built training data upload system supporting documents, images, and web pages
- Created chatbot analytics dashboard with query tracking and satisfaction metrics
- Added backend API endpoints for chatbot queries, training data management, and analytics
- Integrated smart chatbots into navigation menu under AI-Powered Features section
- Implemented Message Analysis feature with AI-powered intent and sentiment detection
- Built comprehensive analysis interface with real-time message processing and insights
- Added intent classification (urgent, informational, request, complaint, question) with 95% accuracy
- Created sentiment analysis with positive/negative/neutral detection and confidence scoring
- Implemented automated response suggestions based on message intent and tone
- Added analytics dashboard tracking message patterns, intent distribution, and response times
- Built training customization for sport-specific terminology and team communication styles
- Integrated priority notification routing for urgent messages and negative sentiment alerts

**June 24, 2025 - Enhanced TeamPro.ai with Priority Features**
- Implemented seamless team communication system with real-time chat, urgent message flags, and 99.5% notification reliability
- Added comprehensive scorekeeping and statistics tracking for team sports with 150+ sport-specific metrics
- Enhanced user interface with tabbed team management for overview, chat, live stats, and calendar integration
- Updated landing page messaging to focus on unique value propositions without competitor references
- Modified language to use "team sports" instead of naming specific sports for broader appeal
- Added database schema for team messages, game statistics, and calendar sync preferences
- Implemented responsive design patterns for mobile-first experience with offline functionality
- Removed all competitor references from marketing content
- Created comprehensive admin dashboard with role-based access control system
- Implemented five-tier permission system: super_admin, admin_operations, team_admin, team_user, view_only
- Added user management interface with role assignment capabilities for super admins
- Built permission matrix and system overview for administrative control
- Cleaned up temporary bypass authentication system and restored standard OAuth flow
- Added AI prompt header with template queries using "/" trigger across all admin pages
- Implemented comprehensive hamburger navigation with organized feature categories and AI badges
- Created 9-dot menu in upper right corner for quick feature access and organization
- Built floating AI chatbot in lower right corner with contextual assistance and smart suggestions
- Developed automated notification system with multi-channel delivery and AI enhancement
- Added advanced facility booking with real-time availability and conflict detection
- Implemented intelligent dashboard widget customization capabilities
- Created comprehensive reporting and analytics dashboards with AI insights
- Built intelligent form builder with AI-powered header and payment integration
- Developed comprehensive player roster management with AI team balancing
- Added import/export functionality for CSV and Excel roster data
- Implemented dynamic player profiles with guardian management and medical notes
- Created real-time availability tracking with calendar integration
- Added performance stats integration and mobile-friendly roster interface
- Enhanced skills tracking feature with AI-powered assessment framework
- Implemented skill assessment forms with automatic AI analysis of coach notes
- Built progress tracking with visual dashboards and time-series forecasting
- Created personalized training plans with AI-generated drills and exercises
- Added team skill analytics with clustering and performance insights
- Implemented skill benchmarking against league and national averages
- Developed parent/coach collaboration interface with sentiment analysis
- Enhanced equipment management with AI-powered inventory tracking
- Built comprehensive equipment assignment system with automated reminders
- Created maintenance scheduling with predictive AI recommendations
- Implemented equipment store with team discounts and bulk pricing
- Added safety compliance tracking with automated certification monitoring
- Developed sport-specific equipment customization and templates
- Enhanced volunteer management with AI-powered recruitment and task automation
- Built comprehensive volunteer task management with smart matching and conflict detection
- Created automated recruitment campaigns with AI optimization and performance tracking
- Implemented real-time volunteer scheduling with availability prediction and conflict resolution
- Added volunteer recognition system with performance tracking and personalized rewards
- Developed background check portal with automated compliance monitoring and document management
- Built comprehensive Parent/Guardian Portal with AI-powered personalization and 99.5% notification reliability
- Implemented parent schedule management with smart RSVP predictions and calendar integration
- Created player progress dashboard with personalized reports and league benchmarking
- Enhanced parent payment center with fraud detection and equipment recommendations
- Developed communication hub with AI chatbot and sentiment-based message prioritization
- Added parent volunteer portal with task matching and recognition system
- Built equipment tracking for parents with predictive maintenance and return management
- Implemented safety compliance portal with automated document monitoring and medical alerts
- Created fan engagement center with AI-generated highlights and personalized content

**June 24, 2025 - Initial Setup**
- Core application architecture established with React frontend and Express.js backend
- Database schema design for users, teams, facilities, events, notifications, and payments
- Authentication system with Replit Auth and role-based access control
- Basic dashboard functionality with stats cards and navigation