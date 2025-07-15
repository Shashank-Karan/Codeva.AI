
# Codeva.AI - AI-Powered Code Development Platform

## 🚀 Overview

Codeva.AI is a comprehensive full-stack web application designed for AI-powered code analysis, visualization, and community interaction. Built with modern technologies, it provides developers with intelligent tools for understanding, debugging, and sharing code while fostering a collaborative coding community.

### 🌟 Key Features

- **🔍 AI-Powered Code Analysis**: Deep code understanding with line-by-line explanations
- **📊 Interactive Code Visualization**: Transform complex algorithms into clear, interactive flowcharts
- **🐛 Intelligent Debugging**: Automated issue detection and code fixing suggestions
- **👥 Community Platform**: Share code snippets and collaborate with other developers
- **♟️ Chess Integration**: Built-in multiplayer chess game with real-time gameplay
- **💬 AI Chat Assistant**: Interactive AI conversations for coding help
- **🎮 Coding Games**: Educational programming challenges and puzzles
- **🛠️ Developer Tools**: Essential utilities including calculators, timers, and more
- **👨‍💼 Admin Dashboard**: Comprehensive administration panel for content management

## 🏗️ System Architecture

### Frontend Architecture

- **Framework**: React with TypeScript for type-safe development
- **Build Tool**: Vite for lightning-fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and responsive design
- **State Management**: TanStack Query for efficient server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for robust form management

### Backend Architecture

- **Framework**: Express.js with TypeScript for scalable server-side development
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Custom username/password authentication with session management
- **Session Storage**: PostgreSQL-based session store with express-session
- **AI Integration**: Google Gemini AI for advanced code analysis and debugging
- **Real-time Features**: Socket.IO for live chess games and chat functionality

### Database Design

- **Users**: Comprehensive user profiles with role-based access control
- **Posts**: Community code sharing with metadata and engagement features
- **Code Analysis**: Historical analysis results with detailed explanations
- **Debug Results**: Debugging session history with issue tracking
- **Chess Games**: Multiplayer game state management with move history
- **Chat System**: Conversation management with file attachment support
- **Admin Tools**: Audit logs, system settings, and content moderation

## 🛠️ Technology Stack

### Core Technologies

- **Runtime**: Node.js 20.x
- **Language**: TypeScript 5.6.x
- **Frontend**: React 18.x with Vite
- **Backend**: Express.js 4.x
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM with Zod validation

### UI & Styling

- **Component Library**: Radix UI primitives
- **Design System**: Shadcn/ui components
- **Styling**: Tailwind CSS with PostCSS
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion for smooth interactions

### Development Tools

- **Type Checking**: TypeScript with strict mode
- **Build Tool**: Vite with ESM support
- **Code Quality**: ESLint and Prettier
- **Version Control**: Git with GitHub integration

## 📁 Project Structure

```
codeva-ai/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Shadcn/ui component library
│   │   │   ├── AppNavigation.tsx
│   │   │   ├── ChessBoard.tsx
│   │   │   └── FlowchartViewer.tsx
│   │   ├── pages/             # Page components and routes
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── auth-page.tsx  # Authentication interface
│   │   │   ├── Home.tsx       # Main dashboard
│   │   │   ├── Visualize.tsx  # Code analysis interface
│   │   │   ├── Debug.tsx      # Debugging tools
│   │   │   ├── Community.tsx  # Social features
│   │   │   ├── Chess.tsx      # Chess game interface
│   │   │   └── Games.tsx      # Coding challenges
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions and configs
│   │   └── App.tsx            # Main app component
│   └── index.html             # HTML entry point
├── server/                     # Backend Express application
│   ├── services/              # External service integrations
│   │   └── gemini.ts         # Google Gemini AI integration
│   ├── auth.ts               # Authentication logic
│   ├── db.ts                 # Database connection
│   ├── routes.ts             # API route definitions
│   ├── adminRoutes.ts        # Admin-specific routes
│   └── index.ts              # Server entry point
├── shared/                     # Shared code between client/server
│   └── schema.ts             # Database schema and types
├── attached_assets/           # Static asset storage
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite build configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── drizzle.config.ts         # Database configuration
└── README.md                 # This documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- PostgreSQL database (Neon recommended)
- Google Gemini AI API key

### Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd codeva-ai
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   - `DATABASE_URL`: Your PostgreSQL connection string
   - `GEMINI_API_KEY`: Your Google Gemini AI API key
   - `SESSION_SECRET`: A secure random string for session encryption

4. **Database Setup**

   ```bash
   npm run db:push
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5000`

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Core Features Explained

### 1. AI-Powered Code Analysis

Transform any code snippet into comprehensive analysis including:

- **Line-by-Line Breakdown**: Detailed explanation of each code line
- **Interactive Flowcharts**: Visual representation of code logic flow
- **Algorithm Explanation**: High-level understanding of the code's purpose
- **Complexity Analysis**: Performance and efficiency insights

**Supported Languages**: Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, and more

### 2. Intelligent Debugging System

Advanced debugging capabilities powered by AI:

- **Automatic Issue Detection**: Identifies syntax errors, logic issues, and potential bugs
- **Smart Code Fixes**: Suggests corrections with explanations
- **Severity Classification**: Categorizes issues by importance (error, warning, info)
- **Learning Integration**: Explains why issues occur and how to prevent them

### 3. Community Platform

Collaborative coding environment featuring:

- **Code Sharing**: Post code snippets with syntax highlighting
- **Social Engagement**: Like and comment on community posts
- **Language Categorization**: Filter content by programming language
- **User Profiles**: Track your contributions and engagement

### 4. Interactive Chess Game

Full-featured chess implementation:

- **Real-time Multiplayer**: Play against other users live
- **Game Rooms**: Create private or public game sessions
- **Move History**: Complete game replay functionality
- **Chat Integration**: Communicate during games

### 5. Developer Tools Suite

Essential utilities for developers:

- **Advanced Calculator**: Scientific and programming calculations
- **Code Timer**: Pomodoro and coding session tracking
- **Note Taking**: Integrated development notes
- **Coding Games**: Educational programming challenges

### 6. Admin Dashboard

Comprehensive administration interface:

- **User Management**: Account administration and moderation
- **Content Moderation**: Post and comment management
- **System Analytics**: Usage statistics and performance metrics
- **Audit Logging**: Complete action tracking for security

## 🔧 Configuration

### Database Configuration

The application uses Drizzle ORM with PostgreSQL. Configuration is handled in `drizzle.config.ts`:

```typescript
export default {
  schema: "./shared/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
};
```

### AI Integration

Google Gemini AI integration is configured in `server/services/gemini.ts` with:

- **Model Selection**: Gemini Pro for optimal performance
- **Token Limits**: Configured for code analysis tasks
- **Error Handling**: Robust error management and fallbacks
- **Rate Limiting**: Built-in request throttling

### Authentication System

Custom authentication implementation featuring:

- **Password Security**: Scrypt-based password hashing
- **Session Management**: PostgreSQL session storage
- **Role-Based Access**: User and admin role separation
- **Security Headers**: CSRF protection and secure cookies

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### Code Analysis Endpoints

- `POST /api/code/analyze` - Analyze code snippet
- `GET /api/code/analysis/:id` - Get analysis by ID
- `GET /api/code/history` - Get user's analysis history

### Debug Endpoints

- `POST /api/debug/analyze` - Debug code issues
- `GET /api/debug/results/:id` - Get debug results
- `GET /api/debug/history` - Get debug history

### Community Endpoints

- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post
- `POST /api/community/posts/:id/like` - Like/unlike post

### Chess Game Endpoints

- `GET /api/chess/games` - Get available games
- `POST /api/chess/games` - Create new game
- `POST /api/chess/games/:id/join` - Join game
- `POST /api/chess/games/:id/move` - Make move

## 🎮 Gaming Features

### Coding Challenges

Educational programming games including:

1. **Fix the Bug**: Identify and correct code errors
2. **Predict Output**: Guess program execution results
3. **Code Ordering**: Arrange code lines in correct sequence
4. **Fill in the Blanks**: Complete partial code snippets

### Difficulty Levels

- **Beginner**: Basic syntax and logic
- **Intermediate**: Algorithm implementation
- **Advanced**: Complex problem solving

## 🔒 Security Features

### Data Protection

- **Input Validation**: Comprehensive request validation with Zod
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **XSS Protection**: Content sanitization and CSP headers
- **Session Security**: Secure session management with expiration

### User Privacy

- **Data Encryption**: Sensitive data encryption at rest
- **Audit Logging**: Complete user action tracking
- **Access Control**: Role-based permission system
- **Secure Communication**: HTTPS enforcement in production

## 📊 Performance Optimizations

### Frontend Optimizations

- **Code Splitting**: Lazy loading for improved initial load
- **Asset Optimization**: Compressed images and minified code
- **Caching Strategy**: Efficient browser and service worker caching
- **Bundle Analysis**: Optimized dependency bundling

### Backend Optimizations

- **Database Indexing**: Optimized queries with proper indexing
- **Connection Pooling**: Efficient database connection management
- **Caching Layer**: Redis-compatible caching for frequent queries
- **Rate Limiting**: API rate limiting to prevent abuse

## 🧪 Testing Strategy

### Testing Approach

- **Unit Testing**: Component and function-level testing
- **Integration Testing**: API endpoint and database testing
- **End-to-End Testing**: Complete user workflow testing
- **Performance Testing**: Load testing and optimization

### Testing Tools

- **Frontend**: Jest and React Testing Library
- **Backend**: Jest and Supertest
- **E2E**: Playwright for browser automation

## 📈 Monitoring & Analytics

### Application Monitoring

- **Error Tracking**: Comprehensive error logging and reporting
- **Performance Metrics**: Response time and throughput monitoring
- **User Analytics**: Usage patterns and feature adoption
- **System Health**: Database and server performance monitoring

### Logging Strategy

- **Structured Logging**: JSON-formatted logs for analysis
- **Log Levels**: Configurable logging levels (error, warn, info, debug)
- **Audit Trails**: Complete user action logging for security
- **Performance Logging**: Request timing and resource usage

## 🚀 Deployment

### Production Configuration

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Environment Variables

Required environment variables for production:

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
GEMINI_API_KEY=your_gemini_api_key
SESSION_SECRET=your_secure_session_secret
```

## 🤝 Contributing

We welcome contributions to Codeva.AI! Here's how to get started:

### Development Workflow

1. **Fork the Repository**: Create your own fork of the project
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Implement your feature or bug fix
4. **Test Thoroughly**: Ensure all tests pass and add new tests
5. **Submit Pull Request**: Create a detailed PR with description

### Code Standards

- **TypeScript**: Use strict TypeScript with proper typing
- **Component Structure**: Follow React best practices
- **Code Formatting**: Use Prettier for consistent formatting
- **Commit Messages**: Follow conventional commit format

### Areas for Contribution

- **New AI Features**: Additional code analysis capabilities
- **UI/UX Improvements**: Enhanced user interface components
- **Performance Optimizations**: Backend and frontend improvements
- **Testing Coverage**: Expanded test suite
- **Documentation**: API documentation and tutorials

## 📋 Roadmap

### Short-term Goals (Q1 2024)

- [ ] Mobile responsive design improvements
- [ ] Advanced code visualization features
- [ ] Enhanced debugging capabilities
- [ ] Performance optimizations

### Medium-term Goals (Q2-Q3 2024)

- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Plugin system for extensibility
- [ ] Collaborative coding features

### Long-term Vision (Q4 2024+)

- [ ] AI-powered code generation
- [ ] Advanced learning modules
- [ ] Enterprise features
- [ ] API marketplace

## 🐛 Known Issues

### Current Limitations

- **File Upload Size**: Limited to 50MB for code analysis
- **Concurrent Users**: Optimized for moderate concurrent usage
- **AI Rate Limits**: Subject to Google Gemini API rate limits
- **Browser Compatibility**: Optimized for modern browsers (Chrome 90+, Firefox 88+)

### Planned Fixes

- Enhanced file processing capabilities
- Improved scalability for high-traffic scenarios
- Alternative AI provider integration for redundancy
- Extended browser compatibility

### Troubleshooting

Common issues and solutions:

1. **Database Connection**: Verify DATABASE_URL is correctly set
2. **AI Integration**: Ensure GEMINI_API_KEY is valid and active
3. **Build Errors**: Clear node_modules and reinstall dependencies
4. **Performance Issues**: Check browser console for errors

## 🙏 Acknowledgments

### Technologies & Libraries

- **React Team**: For the incredible React framework
- **Vercel**: For the Next.js inspiration and tooling
- **Radix UI**: For accessible component primitives
- **Tailwind CSS**: For the utility-first CSS framework
- **Google**: For the Gemini AI API
- **Neon**: For serverless PostgreSQL hosting

---

**Built by the Codeva.AI team.**

*Empowering developers through AI-powered code understanding and collaboration*

Demo Image:
![alt text](Demo/1st.png) ![alt text](Demo/2nd.png) ![alt text](Demo/3.png) ![alt text](Demo/5.png) ![alt text](Demo/6.png) ![alt text](Demo/7.png) ![alt text](Demo/8.png) ![alt text](Demo/9.png) ![alt text](Demo/10.png) ![alt text](Demo/11.png) ![alt text](Demo/12.png) ![alt text](Demo/13.png) ![alt text](Demo/14.png) ![alt text](Demo/15.png)
