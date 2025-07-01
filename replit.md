# CodeFlow Application

## Overview

CodeFlow is a full-stack web application designed for code analysis, visualization, and community interaction. It's built as a modern React application with Express.js backend, featuring AI-powered code analysis using Google's Gemini AI, community features for sharing code snippets, and debugging capabilities.

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
- Replit Auth integration using OpenID Connect
- Session-based authentication with PostgreSQL storage
- Middleware for protecting authenticated routes
- User management with profile information storage

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
   - User logs in via Replit Auth
   - Session created and stored in PostgreSQL
   - User profile information synchronized

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
- **Replit Auth**: OpenID Connect provider
- **Session Storage**: PostgreSQL-based session management

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
- July 01, 2025. Enhanced Code Analysis Engine with visual flowchart generation and interactive diagrams
- July 01, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.