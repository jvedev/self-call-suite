# HEMA Self-Call Suite

A comprehensive suite of applications for self-call HEMA (Historical European Martial Arts) scoring and tournament management.

## Overview

This is a monorepo containing multiple applications for different aspects of HEMA competition management:

- **Self-Call**: Standalone scoring app for matches without referees
- **Scoreboard**: Display application for spectators and multi-monitor setups  
- **Score Keeper**: Alternative scoring interface for table crew
- **Admin**: Tournament management and user administration
- **Server**: Backend API for user management and data persistence

## Quick Start

```bash
# Install dependencies
npm install

# Build shared modules
cd shared/modules && npm run build
cd ../views && npm run build  
cd ../web-components && npm run build

# Run the self-call app
cd ../../apps/self-call && npm run dev
```

Visit http://localhost:3000 to use the self-call application.

## Architecture

### Monorepo Structure

```
/
├── README.md
├── package.json                 # Root workspace configuration
├── tsconfig.json               # Shared TypeScript configuration
├── shared/                     # Shared code packages
│   ├── modules/                # Core business logic
│   │   ├── auth/              # Authentication state management
│   │   ├── logging/           # Structured logging system
│   │   ├── settings/          # Match and user settings
│   │   └── state/             # Match state management
│   ├── styles/                # CSS design system
│   ├── views/                 # Base view classes and router
│   └── web-components/        # Reusable custom elements
└── apps/                      # Individual applications
    ├── self-call/             # Main scoring application
    ├── scoreboard/            # Spectator display
    ├── scoreKeeper/           # Alternative scoring interface
    ├── admin/                 # Management dashboard  
    └── server/                # Express.js backend API
```

### Technology Stack

**Frontend:**
- Vanilla TypeScript with modern ES modules
- Web Components for reusable UI elements
- Valtio for reactive state management
- Modern CSS with custom properties and nesting
- Vite for build tooling and development
- PWA capabilities with service workers

**Backend:**
- Express.js with TypeScript
- Prisma ORM with SQLite/PostgreSQL support
- JWT authentication with bcrypt
- CORS enabled for cross-origin requests

**Development:**
- NPM workspaces for monorepo management
- TypeScript project references for incremental builds
- Prettier for code formatting
- Comprehensive type safety throughout

## Applications

### Self-Call App (`apps/self-call`)

The main application for scoring HEMA matches without referees.

**Features:**
- Match creation with fighter names
- Real-time scoring for red/blue fighters
- Timer with last-exchange indication
- Warning system with predefined infractions
- Match history and event logging
- Responsive mobile-first design
- PWA installable for offline use
- Light/dark theme support

**Views:**
- Home: Main navigation and app overview
- New Match: Fighter selection and match setup
- Match: Live scoring interface with timer
- Match Settings: Comprehensive rule configuration
- Past Matches: History with detailed match logs

### Server (`apps/server`)

Express.js backend providing user management and data persistence.

**Features:**
- User authentication and registration
- Tournament management
- Match data storage and retrieval
- RESTful API with comprehensive error handling
- Prisma ORM for database operations

**API Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication  
- `GET /api/matches` - Match listing and search
- `POST /api/matches` - Create new match
- `GET /api/tournaments` - Tournament management

## Match Settings & Logic

The system supports comprehensive match configuration following HEMA tournament standards:

- **Round Duration**: Configurable minutes and seconds
- **Scoring System**: Multiple point values (default: 0, 2, 3)
- **Right of Way**: Optional priority-based scoring
- **Double Hits**: Configurable counting behavior
- **Afterblow**: Tempo-based additional scoring
- **Last Exchange**: Automatic overtime detection
- **Sudden Death**: First-to-score overtime
- **Warnings**: Predefined infraction categories

See [`docs/logic_settings.md`](./docs/logic_settings.md) for complete specifications.

## Design System

The shared styles package provides a comprehensive design system:

**Core Principles:**
- Mobile-first responsive design
- Accessibility with high contrast options
- Red/blue color scheme for fighter identification
- Clean, minimal interface focused on functionality

**Components:**
- Button system (including radio buttons styled as buttons)
- Form elements with focus states
- Timer displays with state-based styling
- Score displays with fighter color coding
- Card layouts for content organization

## Development

### Building

```bash
# Build all shared packages
npm run build:shared

# Build specific app
cd apps/self-call && npm run build

# Type check all projects
npm run type-check
```

### Development Servers

```bash
# Self-call app
cd apps/self-call && npm run dev

# Server
cd apps/server && npm run dev

# Scoreboard
cd apps/scoreboard && npm run dev
```

### Database Setup

```bash
cd apps/server

# Copy environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run migrations (for production database)
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

## PWA Features

The self-call app is a Progressive Web Application with:

- **Offline Capability**: Service worker caches for offline use
- **Installable**: Add to home screen on mobile devices
- **App-like Experience**: Standalone display mode
- **Background Sync**: State persistence across sessions
- **Responsive**: Optimized for mobile and desktop use

## Accessibility

All applications follow WCAG 2.1 guidelines:

- High contrast color schemes
- Keyboard navigation support
- Screen reader compatibility
- Focus management and indicators
- Semantic HTML structure
- Touch-friendly interface elements (44px minimum)

## Contributing

This monorepo uses npm workspaces for dependency management. When adding dependencies:

```bash
# Add to specific package
npm install package-name --workspace=@shared/modules

# Add to all packages
npm install package-name --workspaces
```

## Documentation

Detailed specifications are available in the `docs/` directory:

- [Repository Structure](./docs/repo_structure.md)
- [Match Logic and Settings](./docs/logic_settings.md)  
- [View Specifications](./docs/views.md)

## License

MIT License - see LICENSE file for details.
