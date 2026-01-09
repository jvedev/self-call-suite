# Suite - Tournament Management PWA

A comprehensive Progressive Web Application (PWA) for managing HEMA (Historical European Martial Arts) tournaments with role-based access control, real-time data management, and offline capabilities.

## Features

### 🔐 Authentication & Authorization
- **Email/Password authentication** via Supabase Auth
- **Role-Based Access Control (RBAC)** with 6 distinct roles
- **Session management** with automatic login persistence
- **Secure JWT tokens** for API communication

### 👥 Role Hierarchy
1. **Super Admin** - System-wide management and deletions
2. **Application Admin** - Event and user management
3. **Club Admin** - Club-specific management
4. **Event Director** - Tournament and pool management
5. **Table Official** - Fight scoring and results
6. **Event Participant** - Tournament registration and viewing

### 📊 CRUD Operations
- **Clubs** - Create, read, update, delete clubs
- **Events** - Manage tournament events
- **Tournaments** - Create and manage tournament brackets
- **Participants** - Register and manage participants
- **Pools** - Manage fight pools and groupings
- **Fights** - Schedule and track individual fights
- **User Profiles** - Manage user information and ratings

### 🏗️ Technical Stack
- **Frontend**: TypeScript, Web Components, Native CSS with nesting
- **State Management**: Valtio (lightweight reactive proxy)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build**: Vite
- **Code Quality**: SOLID principles, Clean Code, TypeScript strict mode

## Project Structure

```
apps/suite/
├── src/
│   ├── main.ts                 # App entry point
│   ├── styles/
│   │   └── shared.css          # Shared design tokens and utilities
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── services/
│   │   ├── supabaseClient.ts   # Supabase configuration
│   │   ├── authService.ts      # Authentication logic
│   │   ├── authorizationService.ts  # Permission checking
│   │   └── dataService.ts      # CRUD operations
│   ├── store/
│   │   └── appState.ts         # Valtio state management
│   ├── router/
│   │   └── suiteRouter.ts      # Navigation and route protection
│   └── views/
│       ├── login-view/         # Login page
│       ├── register-view/      # Registration page
│       ├── home-view/          # Role-based dashboard
│       ├── super-admin-dashboard/
│       ├── app-admin-dashboard/
│       ├── club-admin-dashboard/
│       ├── event-director-dashboard/
│       ├── table-official-dashboard/
│       ├── event-participant-dashboard/
│       └── profile-view/       # User profile
├── public/
│   ├── manifest.json           # PWA manifest
│   └── service-worker.js       # Offline support
├── index.html                  # HTML shell
├── vite.config.ts             # Build configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase project with schema initialized

### Installation

1. **Navigate to the Suite app directory**
   ```bash
   cd apps/suite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # .env file in apps/suite/
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your-anon-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Web Component Guidelines

Each view component follows these patterns:

### File Structure
```
view-name/
├── view-name.ts   # Component logic
├── view-name.html # Template
└── view-name.css  # Styles (with native nesting)
```

### Example Component

```typescript
import html from './example-view.html?raw'
import css from './example-view.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'

export class ExampleView extends BaseComponent {
  constructor() {
    super()
    this.render(css, html)
  }

  connectedCallback() {
    super.connectedCallback()
    this.attachEventListeners()
  }

  private attachEventListeners() {
    // Use this.signal for automatic cleanup
    const btn = this.queryRoot<HTMLButtonElement>('.my-btn')
    btn.addEventListener('click', () => {
      // handle click
    }, { signal: this.signal })
  }

  render(): void {
    super.render(css, html)
  }

  protected attachEventListeners(): void {}
  protected removeEventListeners(): void {}
}

customElements.define('example-view', ExampleView)
```

### CSS with Nesting

```css
:host {
  --color-primary: #3b82f6;
}

.container {
  padding: var(--spacing-lg);

  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);

    h1 {
      margin: 0;
    }
  }

  .content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-md);
  }
}
```

## Authentication Flow

1. **User Registration/Login**
   - User enters credentials
   - `authService.signup()` or `authService.login()` is called
   - Supabase Auth creates JWT token
   - User profile is fetched from database

2. **Session Management**
   - JWT stored in browser's secure session
   - `appState` updated with user profile and roles
   - Components re-render based on new state

3. **Authorization**
   - Routes check user roles before navigation
   - Components use `appState.auth.user.roles` for visibility
   - `authorizationService` provides permission checking

## State Management with Valtio

The app uses Valtio for reactive state:

```typescript
import { appState, appActions } from './store/appState'
import { snapshot } from 'valtio'

// Read state (creates snapshot)
const state = snapshot(appState)
console.log(state.auth.user.name)

// Update state (automatic reactivity)
appActions.setAuthUser(newUser)
appActions.setSidebarOpen(true)

// Subscribe to changes
import { subscribe } from 'valtio'
subscribe(appState.auth, () => {
  console.log('Auth state changed!')
})
```

## API & Data Service

The `dataService` provides generic CRUD operations:

```typescript
import { clubService, eventService } from './services/dataService'

// Get all clubs
const { data: clubs, error } = await clubService.getAllClubs()

// Get specific club
const { data: club } = await clubService.getClubById(id)

// Create club
const { data: newClub } = await clubService.createClub({
  name: 'New Club',
  contactEmail: 'info@club.com',
})

// Update club
const { data: updated } = await clubService.updateClub(id, {
  name: 'Updated Name',
})

// Delete club
const { error } = await clubService.deleteClub(id)
```

## Permission Matrix

| Permission | Super Admin | App Admin | Club Admin | Event Dir | Table Offl | Participant |
|-----------|:-----------:|:---------:|:---------:|:---------:|:---------:|:---------:|
| Delete Clubs | ✓ | | | | | |
| Delete Users | ✓ | | | | | |
| Change Fight Outcomes (Ended) | ✓ | | | | | |
| Create Clubs | | ✓ | | | | |
| Manage Admins | | ✓ | | | | |
| Manage Club Data | | | ✓ | | | |
| Manage Event Data | | | | ✓ | | |
| Update Scores | | | | | ✓ | |
| Register Events | | | | | | ✓ |

## PWA Features

### Offline Support
- Service worker caches app shell
- API requests fall back to cache
- Users can continue viewing cached data offline

### Installation
Users can install Suite as a native app:
- **iOS**: Share → Add to Home Screen
- **Android**: Menu → Install App
- **Desktop**: Menu → Install

### Push Notifications (Future)
Framework ready for push notifications:
```typescript
// Register for notifications
serviceWorkerContainer.ready.then(registration => {
  registration.pushManager.subscribe({...})
})
```

## Development Guidelines

### TypeScript
- Use strict mode (enabled in tsconfig.json)
- Define types for all API responses
- Avoid `any` type

### Clean Code
- Single responsibility principle
- DRY (Don't Repeat Yourself)
- Descriptive naming
- Proper error handling

### Component Development
- Use `BaseComponent` as base class
- Implement lifecycle methods
- Use `this.signal` for event cleanup
- Avoid global state mutations

### Testing
```bash
npm run type-check  # Type checking
npm test            # Run tests (when available)
```

## Deployment

### Build
```bash
npm run build
```

Output goes to `../../docs/` (shared deployment folder)

### Environment Setup
1. Set environment variables in `.env`
2. Ensure Supabase RLS policies are configured
3. Test authentication flow

### Security Checklist
- ✓ All passwords are hashed (Supabase handles)
- ✓ JWT tokens are secured
- ✓ RLS policies restrict database access
- ✓ User input is validated
- ✓ Sensitive operations require confirmation

## Troubleshooting

### Authentication Issues
- Check Supabase credentials in `.env`
- Verify email confirmation is disabled/enabled appropriately
- Check browser localStorage for session issues

### CRUD Operation Failures
- Verify RLS policies allow the operation
- Check user has required role
- Review browser console for error details

### Performance
- Use snapshot() for efficient state reads
- Lazy load components when possible
- Monitor bundle size with `npm run build`

## Future Enhancements

- [ ] Real-time updates with Supabase Realtime
- [ ] Advanced filtering and search
- [ ] Export/import tournament data
- [ ] Multi-language support (i18n)
- [ ] Two-factor authentication
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

## Support & Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Valtio Docs](https://github.com/pmndrs/valtio)
- [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector)

## License

This project is part of the self-call-suite monorepo.

---

**Questions?** Check the main project README or create an issue!

