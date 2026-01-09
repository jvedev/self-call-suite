# Suite PWA - Directory Structure Reference

## Complete File Tree

```
apps/suite/
├── public/                          # Static PWA assets
│   ├── manifest.json               # PWA manifest
│   ├── service-worker.js           # Service worker for offline
│   └── icons/                      # App icons (to be added)
│
├── src/                            # Source code
│   ├── main.ts                     # App entry point & routing logic
│   ├── styles/
│   │   └── shared.css              # Design tokens, utilities, base styles
│   │
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces & enums
│   │
│   ├── services/                   # Business logic layer
│   │   ├── supabaseClient.ts       # Supabase initialization
│   │   ├── authService.ts          # Authentication (signup, login, logout)
│   │   ├── authorizationService.ts # Permission checking & role management
│   │   └── dataService.ts          # CRUD operations for all entities
│   │
│   ├── store/                      # State management
│   │   └── appState.ts             # Valtio state + actions
│   │
│   ├── router/                     # Navigation
│   │   └── suiteRouter.ts          # Route definitions & permission checks
│   │
│   └── views/                      # UI Components
│       ├── login-view/
│       │   ├── login-view.ts       # Component logic
│       │   ├── login-view.html     # Template
│       │   └── login-view.css      # Styles
│       │
│       ├── register-view/
│       │   ├── register-view.ts
│       │   ├── register-view.html
│       │   └── register-view.css
│       │
│       ├── home-view/
│       │   ├── home-view.ts        # Main dashboard with role tiles
│       │   ├── home-view.html
│       │   └── home-view.css
│       │
│       ├── super-admin-dashboard/
│       │   ├── super-admin-dashboard.ts    # Clubs CRUD
│       │   ├── super-admin-dashboard.html
│       │   └── super-admin-dashboard.css
│       │
│       ├── app-admin-dashboard/
│       │   ├── app-admin-dashboard.ts      # Events, users, venues
│       │   ├── app-admin-dashboard.html
│       │   └── app-admin-dashboard.css
│       │
│       ├── club-admin-dashboard/
│       │   ├── club-admin-dashboard.ts     # Club management
│       │   ├── club-admin-dashboard.html
│       │   └── club-admin-dashboard.css
│       │
│       ├── event-director-dashboard/
│       │   ├── event-director-dashboard.ts # Tournament/pools/fights
│       │   ├── event-director-dashboard.html
│       │   └── event-director-dashboard.css
│       │
│       ├── table-official-dashboard/
│       │   ├── table-official-dashboard.ts # Score recording
│       │   ├── table-official-dashboard.html
│       │   └── table-official-dashboard.css
│       │
│       ├── event-participant-dashboard/
│       │   ├── event-participant-dashboard.ts  # Tournament registration
│       │   ├── event-participant-dashboard.html
│       │   └── event-participant-dashboard.css
│       │
│       └── profile-view/
│           ├── profile-view.ts     # User profile & info
│           ├── profile-view.html
│           └── profile-view.css
│
├── index.html                      # HTML shell/entry point
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── .env                            # Environment variables (Supabase keys)
├── package.json                    # Dependencies and scripts
│
├── README.md                       # Main documentation
├── QUICK_START.md                  # 5-minute setup guide
├── IMPLEMENTATION_GUIDE.md         # Architecture and patterns
└── FEATURE_CHECKLIST.md            # This file
```

## File Purpose Summary

### Core Application Files

| File | Purpose |
|------|---------|
| `main.ts` | App initialization, routing, view rendering |
| `index.html` | HTML shell with app container |
| `vite.config.ts` | Build configuration |
| `tsconfig.json` | TypeScript strict mode settings |
| `package.json` | Dependencies and npm scripts |

### Service Layer (Business Logic)

| Service | Purpose | Methods |
|---------|---------|---------|
| `authService` | User authentication | `signup()`, `login()`, `logout()`, `getCurrentSession()` |
| `authorizationService` | Permission checking | `hasPermission()`, `canManageUser()`, `getRoleColor()` |
| `dataService` | Generic CRUD | `create()`, `getById()`, `getAll()`, `query()`, `update()`, `delete()` |
| `clubService` | Club operations | All CRUD methods + specialized queries |

### State Management

| File | Purpose |
|------|---------|
| `appState.ts` | Valtio proxy store with all app state |
| `appActions` | Functions to mutate state |

### Router

| File | Purpose |
|------|---------|
| `suiteRouter.ts` | Route definitions, permission checks, navigation |

### Type Definitions

| Type | Purpose |
|------|---------|
| `UserRole` enum | 6 role types |
| `Permission` enum | 15+ permission types |
| `UserProfile` interface | User data structure |
| `Club`, `Event`, etc. | Entity data structures |
| `AuthState`, `AppState` | State shape definitions |

### Views/Components

Each view has **exactly 3 files**:

| File | Purpose |
|------|---------|
| `.ts` | Component class (logic, lifecycle) |
| `.html` | Template (structure) |
| `.css` | Styles (native nesting) |

#### View Purposes

| View | Purpose | Users |
|------|---------|-------|
| `login-view` | Sign in | Everyone |
| `register-view` | Create account | New users |
| `home-view` | Role-based dashboard | All authenticated |
| `super-admin-dashboard` | Manage clubs | Super Admin |
| `app-admin-dashboard` | System management | App Admin |
| `club-admin-dashboard` | Club management | Club Admin |
| `event-director-dashboard` | Tournament mgmt | Event Director |
| `table-official-dashboard` | Score recording | Table Official |
| `event-participant-dashboard` | Browse tournaments | All participants |
| `profile-view` | User information | All authenticated |

### Style Files

| File | Purpose |
|------|---------|
| `shared.css` | Design tokens, utilities, base styles |
| View `.css` files | Component-specific styles |

### PWA Files

| File | Purpose |
|------|---------|
| `manifest.json` | App metadata for install |
| `service-worker.js` | Offline support & caching |

### Documentation

| File | Purpose | Time |
|------|---------|------|
| `README.md` | Complete reference | 20 min read |
| `QUICK_START.md` | Setup & test in 5 min | 5 min |
| `IMPLEMENTATION_GUIDE.md` | Architecture deep dive | 30 min read |
| `FEATURE_CHECKLIST.md` | What's included | 10 min read |

## File Dependencies

### Main Flow
```
index.html
  ↓
main.ts (imports all views)
  ↓
Each view imports:
  - CSS & HTML files
  - Services
  - Types
  - Valtio state
```

### Service Dependencies
```
Component → dataService → supabaseClient
         ↓  
    authService → supabaseClient
         ↓
 authorizationService (pure functions)
```

### State Dependencies
```
Component → snapshot(appState)
         ↓
  appActions (mutations)
    ↓
 Valtio proxy (reactive)
```

## Adding New Files

### Adding a New View

1. Create folder: `src/views/my-view/`
2. Create 3 files:
   ```bash
   touch my-view.ts
   touch my-view.html
   touch my-view.css
   ```
3. Import in `src/main.ts`:
   ```typescript
   import './views/my-view/my-view'
   ```
4. Add route in `src/router/suiteRouter.ts`

### Adding a New Service

1. Create file: `src/services/myService.ts`
2. Export singleton instance
3. Import where needed

### Adding a New Type

1. Add to `src/types/index.ts`
2. Export from index for easy importing

## Import Paths

### Absolute Imports (tsconfig paths)
```typescript
// From any file in suite:
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'
import { appState } from '@suite/store/appState'
```

### Relative Imports (when absolute not available)
```typescript
// From a view:
import { appState } from '../../store/appState'
import { authService } from '../../services/authService'
```

## File Size Target

| Category | Target |
|----------|--------|
| Each service | < 500 lines |
| Each view | < 400 lines |
| CSS files | < 300 lines |
| Total app size | < 200 KB (gzipped) |

## Organization Principles

1. **One Component Per Folder** - Easy to find and maintain
2. **Three Files Per Component** - TS, HTML, CSS separation
3. **Services Separate** - Business logic isolated
4. **Types Centralized** - Single source of truth
5. **Styles Shared** - DRY CSS via shared tokens

## Version Control Ignore

The `.gitignore` should exclude:
```
node_modules/
dist/
.env
.env.local
*.log
```

Include in git:
```
src/
public/
*.ts
*.html
*.css
*.json
```

## Development Flow

```
Edit file → Save
    ↓
Vite hot reload
    ↓
Browser refreshes instantly
    ↓
See changes
```

All TypeScript/CSS changes trigger reload automatically!

## Building & Deployment

### Source Files Used
- All `src/` files
- `index.html`
- `public/manifest.json` and `public/service-worker.js`
- `src/styles/shared.css`

### Output Location
- Vite outputs to `../../docs/` (shared across monorepo)
- Ready for GitHub Pages or CDN

### Not Included in Build
- `.env` (secrets stay local)
- `node_modules/` (dependencies)
- Documentation files (separate from app build)

---

**This structure follows industry best practices for maintainability and scalability.**

