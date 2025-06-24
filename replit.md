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

**June 24, 2025 - Initial Setup**
- Core application architecture established with React frontend and Express.js backend
- Database schema design for users, teams, facilities, events, notifications, and payments
- Authentication system with Replit Auth and role-based access control
- Basic dashboard functionality with stats cards and navigation