# Implementation Guide: Auto-Generated Types & Service Layer

This guide shows you exactly how to implement the best practices in your self-call-suite project.

## Step 1: Set Up Supabase CLI for Auto-Generated Types

### 1.1 Install Supabase CLI

```bash
# In your workspace root
npm install -D supabase
```

### 1.2 Create `.env.local` (in workspace root)

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

### 1.3 Create `supabase/config.toml`

```toml
[project]
name = "self-call-suite"

[api]
enabled = true
port = 54321
schemas = ["public"]
max_rows = 1000

[auth]
enabled = true
```

### 1.4 Generate Types

```bash
# One-time generation
supabase gen types typescript --project-id YOUR_PROJECT_ID > shared/types/src/database.types.ts

# Add to package.json for recurring updates
{
  "scripts": {
    "gen:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > shared/types/src/database.types.ts"
  }
}

# Run whenever your schema changes
npm run gen:types
```

---

## Step 2: Create Service Layer

### 2.1 Create `shared/services/` directory

```
shared/
  services/
    index.ts
    eventService.ts
    tournamentService.ts
    venueService.ts
    profileService.ts
```

### 2.2 Example: `eventService.ts`

```typescript
import supabase from '../modules/supabaseClient'
import type { Database } from '../types/database.types'

// Extract types from generated database schema
type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']

// Error handling wrapper
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export const eventService = {
  /**
   * Get all events created by a specific user
   */
  async getEventsByUser(userId: string | null): Promise<Result<Event[]>> {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' }
      }

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('contact_person_id', userId)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: data || [] }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },

  /**
   * Get a single event by ID with tournaments
   */
  async getEventWithTournaments(eventId: string): Promise<Result<Event | null>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          tournaments (
            id,
            name,
            description,
            arenas (
              id,
              name,
              description
            )
          )
        `)
        .eq('id', eventId)
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },

  /**
   * Create a new event
   */
  async createEvent(event: EventInsert): Promise<Result<Event>> {
    try {
      // Validate required fields at compile time!
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },

  /**
   * Update an event
   */
  async updateEvent(
    id: string,
    updates: EventUpdate
  ): Promise<Result<Event>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },

  /**
   * Delete an event
   */
  async deleteEvent(id: string): Promise<Result<void>> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, data: undefined }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  }
}
```

### 2.3 Export all services: `services/index.ts`

```typescript
export { eventService } from './eventService'
export { tournamentService } from './tournamentService'
export { venueService } from './venueService'
export { profileService } from './profileService'
```

---

## Step 3: Update Components to Use Services

### 3.1 Refactor `event-list.ts`

Instead of:
```typescript
// ❌ OLD: Inline Supabase queries
async loadEvents() {
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("contact_person_id", this.userId)
  this.events = (data || []) as Event[]
}
```

Use:
```typescript
// ✅ NEW: Service layer with error handling
import { eventService } from "@shared/services"
import type { Database } from "../types/database.types"

type Event = Database['public']['Tables']['events']['Row']

export class EventList extends BaseComponent {
  events: Event[] = []
  userId: string | null = null
  errorMessage: string | null = null

  async init() {
    await this.getUser()
    await this.loadEvents()
    this.setupHandlers()
  }

  async loadEvents() {
    if (!this.userId) return

    const result = await eventService.getEventsByUser(this.userId)
    
    if (result.success) {
      this.events = result.data
    } else {
      this.errorMessage = result.error
      console.error('Failed to load events:', result.error)
    }
    
    this.renderEvents()
  }

  async createEventHandler(name: string, start: string, end: string) {
    const result = await eventService.createEvent({
      name,
      start_datetime: start,
      end_datetime: end,
      contact_person_id: this.userId || undefined,
      contact_email: '',
      organizer_id: null
    })

    if (result.success) {
      await this.loadEvents()
      // Show success message
    } else {
      this.errorMessage = result.error
    }
  }

  async updateEventHandler(
    id: string,
    name: string,
    start: string,
    end: string
  ) {
    const result = await eventService.updateEvent(id, {
      name,
      start_datetime: start,
      end_datetime: end
    })

    if (result.success) {
      await this.loadEvents()
    } else {
      this.errorMessage = result.error
    }
  }

  async deleteEventHandler(id: string) {
    const result = await eventService.deleteEvent(id)

    if (result.success) {
      await this.loadEvents()
    } else {
      this.errorMessage = result.error
    }
  }
}
```

---

## Step 4: Benefits You'll Get

### ✅ Type Safety
```typescript
// TS will catch errors at compile time
const event: EventInsert = {
  name: 'Event',
  // ❌ ERROR: Missing required field 'start_datetime'
  // ✅ REQUIRED: start_datetime is required
}
```

### ✅ Auto-completion in IDE
```typescript
const event = await eventService.createEvent({
  name: 'Event',
  start_datetime: new Date().toISOString(),
  // IDE shows all available fields with proper types!
})
```

### ✅ Consistency
- All DB queries in one place
- Consistent error handling
- Easy to add logging, caching, validation

### ✅ Easy Schema Updates
```bash
# When you change the database schema:
npm run gen:types
# Types auto-update! No manual edits needed.
```

---

## Step 5: Create Similar Services for Other Tables

Follow the same pattern for:

```typescript
// tournamentService.ts
export const tournamentService = {
  async getTournamentsByEvent(eventId: string) { ... },
  async createTournament(tournament: TournamentInsert) { ... },
  async updateTournament(id: string, updates: TournamentUpdate) { ... },
  async deleteTournament(id: string) { ... }
}

// venueService.ts
export const venueService = {
  async getAllVenues() { ... },
  async getVenuesByCity(city: string) { ... },
  async createVenue(venue: VenueInsert) { ... },
  // ...
}

// profileService.ts
export const profileService = {
  async getProfile(userId: string) { ... },
  async updateProfile(userId: string, updates: ProfileUpdate) { ... },
  // ...
}
```

---

## Step 6: TypeScript Configuration

Make sure `tsconfig.json` in your app includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

---

## Summary of Changes

| File | Change | Benefit |
|------|--------|---------|
| `shared/types/database.types.ts` | Auto-generated from schema | Always in sync with DB |
| `shared/services/eventService.ts` | NEW service layer | Centralized, typed queries |
| `apps/eventManager/src/event-list.ts` | Use services instead of inline queries | Type safety, consistency |
| `package.json` | Add `gen:types` script | Easy schema updates |

---

## Commands to Run

```bash
# 1. Install Supabase CLI
npm install -D supabase

# 2. Generate types (first time)
supabase gen types typescript --project-id YOUR_PROJECT_ID > shared/types/src/database.types.ts

# 3. Create services directory
mkdir shared/services

# 4. Copy service implementations (from this guide)

# 5. Update components to use services

# 6. Run tests (if you have them)
npm test

# 7. Build
npm run build
```

---

## Troubleshooting

### Types not generated?
```bash
# Make sure you're logged in
supabase login

# Check your project ID
supabase projects list

# Try with explicit auth
supabase gen types typescript --project-id YOUR_PROJECT_ID --linked
```

### Import errors?
```bash
# Make sure shared/types/src/database.types.ts exists
# And shared/services/index.ts exports all services
# Check import paths are relative to your component
```

### Schema changes not reflected?
```bash
# Regenerate types
npm run gen:types

# IDE cache: Restart IDE if needed
```

