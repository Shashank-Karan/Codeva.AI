# Codeva.AI Application

## Overview

Codeva.AI is a full-stack web application designed for code analysis, visualization, and community interaction. It's built as a modern React application with Express.js backend, featuring AI-powered code analysis using Google's Gemini AI, community features for sharing code snippets, and debugging capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **Session Management**: express-session with PostgreSQL store
- **AI Integration**: Google Gemini AI for code analysis and debugging
- **Database Connection**: Neon serverless PostgreSQL

## Key Components

### Authentication System
- Custom username/password authentication
- Secure password hashing using Node.js crypto (scrypt)
- Session-based authentication with PostgreSQL storage
- Passport.js LocalStrategy for authentication
- User registration and login forms
- Protected routes redirecting to auth page

### Code Analysis Engine
- **Purpose**: Analyze code snippets and provide detailed explanations
- **Technology**: Google Gemini AI API
- **Features**: 
  - Line-by-line code analysis
  - Visual flowchart generation with interactive diagrams
  - Textual flowchart descriptions
  - Code explanation and documentation
  - Support for multiple programming languages
  - Interactive node-based flow visualization

### Debug System
- **Purpose**: Identify and fix code issues
- **Features**:
  - Issue detection with severity levels (error, warning, info)
  - Automatic code fixing suggestions
  - Detailed explanations of problems and solutions

### Community Platform
- **Purpose**: Share code snippets and interact with other developers
- **Features**:
  - Post creation with code snippets
  - Like system for posts
  - User profiles and post history
  - Language-specific categorization

### Database Schema
- **Users**: Profile information from Replit Auth
- **Posts**: Community code sharing with metadata
- **Code Analysis**: Historical analysis results
- **Debug Results**: Historical debugging sessions
- **Sessions**: Authentication session storage

## Data Flow

1. **User Authentication**: 
   - User creates account or logs in with username/password
   - Session created and stored in PostgreSQL
   - User profile information stored in database

2. **Code Analysis Flow**:
   - User submits code and language selection
   - Request sent to Gemini AI API
   - Results processed and stored in database
   - Analysis results displayed to user

3. **Community Interaction**:
   - Users create posts with optional code snippets
   - Posts stored with author information
   - Real-time updates via query invalidation
   - Like system for community engagement

4. **Debug Process**:
   - User submits problematic code
   - AI analyzes and identifies issues
   - Fixed code and explanations generated
   - Results stored for future reference

## External Dependencies

### AI Services
- **Google Gemini AI**: Core AI functionality for code analysis and debugging
- **API Integration**: RESTful API calls with structured prompts

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection**: WebSocket-based connection for serverless environments

### Authentication
- **Custom Auth**: Username/password authentication system
- **Session Storage**: PostgreSQL-based session management
- **Password Security**: Salted password hashing with scrypt

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite development server with HMR
- **Database**: Local or development Neon instance
- **Environment Variables**: Local .env file configuration

### Production Build
- **Frontend**: Vite build process generating optimized static assets
- **Backend**: ESBuild compilation for Node.js deployment
- **Static Serving**: Express serves built frontend assets
- **Database**: Production Neon PostgreSQL instance

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **GEMINI_API_KEY**: Google AI API key
- **REPLIT_DOMAINS**: Allowed domains for Replit Auth
- **SESSION_SECRET**: Session encryption secret

## Changelog
- July 13, 2025. Upgraded AI Chat Assistant with simplified, user-friendly interface including smart chat modes (General, Code, Learning, Creative), streamlined file upload, clean message layout, and improved user experience
- July 13, 2025. Added comprehensive chat persistence with database storage for conversations and messages, enhanced backend routes for chat management
- July 10, 2025. Redesigned footer with anime-style aesthetics including animated background elements, floating particles, colorful hover effects, gradient text, and comprehensive project navigation organized by Features, Tools, and Connect sections
- July 10, 2025. Made Home page exactly identical to Landing page with same design, layout, animations, feature cards, detailed sections, and visual consistency for authenticated users
- July 09, 2025. Added comprehensive Code Learning Games section with 5 interactive mini-games: Fix the Bug, Predict the Output, Drag-and-Drop Order, Fill in the Blank, and Spot the Error
- July 09, 2025. Implemented comprehensive Chess functionality with real-time multiplayer gameplay, AI opponents, WebSocket integration, responsive design, and integrated chat system
- July 02, 2025. Updated Community and Debug pages with consistent modern dark theme styling
- July 02, 2025. Replaced Replit Auth with custom username/password authentication system
- July 01, 2025. Enhanced app with comprehensive features section, responsive navigation, footer, and interactive animations
- July 01, 2025. Added "How It Works" section with step-by-step process explanation and interactive code demo
- July 01, 2025. Implemented responsive mobile navigation with smooth animations and enhanced loading spinner
- July 01, 2025. Applied consistent dark theme to Visualize page with gradient backgrounds and improved form styling
- July 01, 2025. Created modern landing page matching CodeVis.ai design with dark gradient background, hero section, and feature cards
- July 01, 2025. Upgraded to professional flowchart style with proper SVG shapes, shadows, and grid layout
- July 01, 2025. Enhanced Code Analysis Engine with visual flowchart generation and interactive diagrams
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.