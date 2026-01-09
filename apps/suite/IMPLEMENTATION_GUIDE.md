# Suite PWA - Complete Implementation Guide

## Project Overview

**Suite** is a comprehensive Progressive Web Application for managing HEMA (Historical European Martial Arts) tournaments. It provides role-based access control, real-time data management, and offline capabilities.

**Built with:**
- TypeScript (strict mode)
- Web Components + BaseComponent pattern
- Valtio for state management
- Supabase for backend
- Native CSS nesting

## Architecture & Design Patterns

### 1. Component Architecture

All UI components extend `BaseComponent`:

```typescript
export class MyComponent extends BaseComponent {
  constructor() {
    super()
    this.render(css, html)  // Load CSS and HTML from files
  }

  connectedCallback() {
    super.connectedCallback()
    this.attachEventListeners()
  }

  private attachEventListeners() {
    // Use this.signal for automatic cleanup on disconnect
    const element = this.queryRoot<HTMLElement>('.my-element')
    element.addEventListener('click', () => {
      // handle event
    }, { signal: this.signal })
  }

  render(): void {
    super.render(css, html)
  }

  protected attachEventListeners(): void {}
  protected removeEventListeners(): void {}
}

customElements.define('my-component', MyComponent)
```

**Key Features:**
- Shadow DOM encapsulation
- Automatic event cleanup via AbortController
- Type-safe DOM querying via `queryRoot<T>()`
- Shared CSS stylesheet adoption

### 2. State Management with Valtio

Valtio provides lightweight reactive state without complex patterns:

```typescript
// Store definition
export const appState = proxy({
  auth: { user: null, isAuthenticated: false },
  uiState: { sidebarOpen: true }
})

// State actions (mutations)
export const appActions = {
  setUser: (user) => { appState.auth.user = user },
  logout: () => { appState.auth.user = null }
}

// In components - snapshot for reads
import { snapshot } from 'valtio'
const state = snapshot(appState)
console.log(state.auth.user)  // Reactive, won't trigger updates

// Direct mutations trigger reactivity
appActions.setUser(newUser)   // All subscribed components update
```

**Why Valtio:**
- Zero boilerplate
- Proxy-based mutations feel natural
- Tiny bundle size
- Perfect for app-level state

### 3. Service Layer

Services handle business logic:

```
services/
├── supabaseClient.ts        # Configuration
├── authService.ts           # Login, signup, session
├── authorizationService.ts  # Permission checking
└── dataService.ts           # CRUD operations
```

#### AuthService Pattern

```typescript
class AuthService {
  async login(email, password): Promise<{ user, error }> {
    // Supabase auth
    // Fetch profile from DB
    // Handle errors gracefully
  }

  onAuthStateChange(callback) {
    // Supabase listener
    // Calls callback with user or null
  }
}

export const authService = new AuthService()  // Singleton
```

#### DataService Pattern

```typescript
class DataService {
  async create(table, data): Promise<{ data, error }> {}
  async getById(table, id): Promise<{ data, error }> {}
  async getAll(table, options): Promise<{ data, error }> {}
  async query(table, filters): Promise<{ data, error }> {}
  async update(table, id, updates): Promise<{ data, error }> {}
  async delete(table, id): Promise<{ error }> {}
}

// Specialized services
class ClubService {
  async getAllClubs() { return dataService.getAll('clubs') }
  async createClub(data) { return dataService.create('clubs', data) }
  // ... more operations
}

export const clubService = new ClubService()
```

### 4. Authorization Pattern

Two-tier authorization:

**Route Level** - `suiteRouter.canAccessRoute()`
```typescript
const route = { path: '/admin', requiredRole: UserRole.SUPER_ADMIN }
suiteRouter.canAccessRoute(route, userRoles)  // true/false
```

**Permission Level** - `authorizationService.hasPermission()`
```typescript
authorizationService.hasPermission(
  userRoles,
  Permission.DELETE_CLUBS
)  // true/false
```

**Component Level** - Direct role checks
```typescript
const state = snapshot(appState)
if (state.auth.user?.roles.includes(UserRole.SUPER_ADMIN)) {
  // Show admin UI
}
```

### 5. Routing Pattern

Custom router for role-based navigation:

```typescript
// Navigate with permission check
suiteRouter.navigate('/admin/super', userRoles)

// Get accessible routes
const routes = suiteRouter.getAccessibleRoutes(userRoles)

// Get routes by role
const adminRoutes = suiteRouter.getRoutesByRole(UserRole.SUPER_ADMIN)
```

**Route Definition**
```typescript
const routes: SuiteRoute[] = [
  {
    path: '/admin/super',
    component: 'super-admin-dashboard',
    requiredRole: UserRole.SUPER_ADMIN,
    requiredPermission: Permission.MANAGE_ADMINS,
  }
]
```

## Role-Based Access Control (RBAC)

### Role Hierarchy

```
Super Admin (6)
  ├─ Application Admin (5)
  │   ├─ Club Admin (4)
  │   │   ├─ Event Director (3)
  │   │   │   └─ Table Official (2)
  │   │   └─ Event Participant (1)
```

### Permission Matrix

| Action | Super | App | Club | Event | Table | Part |
|--------|:-----:|:---:|:----:|:-----:|:-----:|:----:|
| Delete clubs | ✓ | | | | | |
| Manage admins | ✓ | ✓ | | | | |
| Create clubs | ✓ | ✓ | | | | |
| Create events | ✓ | ✓ | ✓ | | | |
| Manage tournaments | ✓ | ✓ | ✓ | ✓ | | |
| Record scores | ✓ | ✓ | ✓ | ✓ | ✓ | |
| Register events | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

## CRUD Operations Implementation

### Example: Club Management

**Service Layer** (`dataService.ts`)
```typescript
class ClubService {
  async getAllClubs() {
    return dataService.getAll<Club>('clubs')
  }

  async getClubById(id: string) {
    return dataService.getById<Club>('clubs', id)
  }

  async createClub(club: Omit<Club, 'id'>) {
    return dataService.create<Club>('clubs', club)
  }

  async updateClub(id: string, updates: Partial<Club>) {
    return dataService.update<Club>('clubs', id, updates)
  }

  async deleteClub(id: string) {
    return dataService.delete('clubs', id)
  }
}
```

**Component Usage** (`super-admin-dashboard.ts`)
```typescript
async connectedCallback() {
  super.connectedCallback()
  await this.loadClubs()  // Read
}

private async loadClubs() {
  const { data, error } = await clubService.getAllClubs()
  if (!error) this.clubs = data
}

private async saveClub(data) {
  if (this.isEditing) {
    // Update
    await clubService.updateClub(this.currentClub.id, data)
  } else {
    // Create
    await clubService.createClub(data)
  }
  await this.loadClubs()  // Refresh list
}

private async deleteClub(id) {
  if (confirm('Delete this club?')) {
    // Delete
    await clubService.deleteClub(id)
    await this.loadClubs()  // Refresh list
  }
}
```

## Authentication Flow

```
User Registration/Login
         ↓
   authService.signup/login()
         ↓
  Supabase Auth (returns JWT)
         ↓
 Fetch user profile from DB
         ↓
 appActions.setAuthUser(profile)
         ↓
appState updated → Components re-render
         ↓
 suiteRouter navigates to /home
         ↓
Home view shows role-based tiles
```

## Data Flow & Reactivity

```
User Action
    ↓
Service Call (async)
    ↓
Supabase API Call
    ↓
Result → appActions.update*() OR component property update
    ↓
appState mutation → Valtio reactivity
    ↓
Components subscribed to state → snapshot() calls
    ↓
Component re-render
```

## File Organization Best Practices

### TypeScript Organization

```typescript
// 1. Imports (grouped: external, internal, types)
import { BaseComponent } from '@shared/web-components/...'
import { appState } from '../../store/appState'
import { UserRole } from '../../types'

// 2. Types & Constants
const MAX_CLUBS = 100

// 3. Class definition
export class MyComponent extends BaseComponent {
  // Properties
  private clubs: Club[] = []

  // Constructor
  constructor() { }

  // Lifecycle
  connectedCallback() { }
  disconnectedCallback() { }

  // Private methods
  private loadData() { }
  private render() { }

  // Public methods (if any)
}

// 4. Component registration
customElements.define('my-component', MyComponent)
```

### CSS Organization

```css
/* 1. Host styles */
:host {
  --custom-color: #fff;
  display: block;
}

/* 2. Structure selectors */
.container {
  padding: var(--spacing-lg);

  .header { }
  .content { }
  .footer { }
}

/* 3. Component-specific selectors */
.my-button { }
.my-form { }

/* 4. States */
.is-loading { }
.is-error { }

/* 5. Media queries */
@media (max-width: 768px) { }
```

### HTML Organization

```html
<!-- Semantic structure -->
<div class="container">
  <header class="header">
    <h1>Title</h1>
  </header>

  <main class="main">
    <div class="content">
      <!-- Content here -->
    </div>
  </main>

  <footer class="footer">
    <!-- Footer here -->
  </footer>
</div>
```

## Common Patterns

### 1. Loading State Pattern

```typescript
private async loadData() {
  this.isLoading = true
  const { data, error } = await dataService.getAll('clubs')
  this.isLoading = false

  if (error) {
    this.showError(error)
    return
  }

  this.clubs = data
  this.render()
}
```

### 2. Form Submission Pattern

```typescript
private async handleSubmit(form: HTMLFormElement) {
  const formData = new FormData(form)
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
  }

  const { data: result, error } = await dataService.create(
    'clubs',
    data
  )

  if (error) {
    this.showError(error)
    return
  }

  this.showSuccess('Club created!')
  this.closeModal()
  await this.loadData()
}
```

### 3. List & Detail Pattern

```typescript
private items: Club[] = []

async connectedCallback() {
  await this.loadItems()
  this.renderList()
}

private renderList() {
  // Show list of items
  items.map(item => `<div>${item.name}</div>`)
}

private async selectItem(id: string) {
  this.selectedItem = this.items.find(i => i.id === id)
  this.renderDetail()
}

private renderDetail() {
  // Show detail view of selected item
  `<h2>${this.selectedItem.name}</h2>`
}
```

### 4. Conditional Rendering Pattern

```typescript
private renderContent() {
  const state = snapshot(appState)

  if (!state.auth.isAuthenticated) {
    return '<p>Please login</p>'
  }

  if (!authorizationService.hasPermission(
    state.auth.user.roles,
    Permission.MANAGE_CLUBS
  )) {
    return '<p>Access denied</p>'
  }

  return this.renderClubsList()
}
```

## Testing Considerations

### Unit Testing Pattern

```typescript
describe('AuthService', () => {
  it('should login user', async () => {
    const { user, error } = await authService.login(
      'test@example.com',
      'password'
    )

    expect(user).toBeDefined()
    expect(error).toBeNull()
  })
})
```

### Component Testing Pattern

```typescript
describe('LoginView', () => {
  let component: LoginView

  beforeEach(() => {
    component = new LoginView()
    document.body.appendChild(component)
  })

  it('should render login form', () => {
    const form = component.shadowRoot?.querySelector('form')
    expect(form).toBeDefined()
  })
})
```

## Performance Optimization

### 1. Lazy Loading Views

```typescript
// In main.ts
const viewModule = await import('./views/my-view/my-view.ts')
```

### 2. State Snapshot Optimization

```typescript
// ❌ Bad - creates new snapshot on every render
const user = snapshot(appState).auth.user

// ✓ Good - snapshot once, use multiple times
const state = snapshot(appState)
const user = state.auth.user
const isAdmin = state.auth.user.roles.includes(UserRole.SUPER_ADMIN)
```

### 3. Event Listener Cleanup

```typescript
// ✓ Good - automatic cleanup
btn.addEventListener('click', handler, { signal: this.signal })

// ❌ Bad - memory leak
btn.addEventListener('click', handler)
// No cleanup in disconnectedCallback
```

## Troubleshooting Guide

### Issue: User loses session after page refresh

**Cause:** Authentication state not persisted

**Solution:**
```typescript
// In authService
async getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()
  return data.session
}

// In main.ts
const session = await authService.getCurrentSession()
if (session?.user) {
  appActions.setAuthUser(profile)
}
```

### Issue: Styles not applying to shadow DOM

**Cause:** CSS not properly imported

**Solution:**
```typescript
import css from './my-view.css?raw'  // Use ?raw suffix
super.render(css, html)  // Pass as string
```

### Issue: Components not updating on state change

**Cause:** Using state directly instead of snapshot

**Solution:**
```typescript
// ❌ Bad
const user = appState.auth.user

// ✓ Good
import { snapshot } from 'valtio'
const state = snapshot(appState)
const user = state.auth.user
```

## Security Checklist

- [ ] All API calls go through services
- [ ] User input validated before submission
- [ ] Sensitive operations require confirmation
- [ ] JWT tokens stored securely
- [ ] RLS policies configured in Supabase
- [ ] Environment variables not committed
- [ ] Passwords never logged or exposed
- [ ] HTTPS enforced in production

## Next Steps for Expansion

1. **Real-time Updates**
   - Use Supabase Realtime
   - Subscribe to table changes

2. **Advanced Features**
   - Export/import functionality
   - Advanced filtering
   - Multi-language support

3. **Mobile Optimization**
   - Responsive design refinement
   - Touch interactions
   - Mobile-specific views

4. **Analytics**
   - User activity tracking
   - Performance monitoring
   - Error logging

---

**For detailed component documentation, see individual README.md files in each view folder.**

