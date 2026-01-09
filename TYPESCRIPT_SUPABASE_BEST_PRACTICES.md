# TypeScript + Supabase Best Practices & Tools

## Overview
This guide covers best practices for using TypeScript with Supabase and tools to automatically generate types from your database schema.

---

## 1. Best Practices for TypeScript + Supabase

### 1.1 Use Supabase Client with Full Type Safety
Create a typed Supabase client wrapper:

```typescript
// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabase = createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

export default supabase
```

### 1.2 Generated Database Types
Supabase automatically generates TypeScript types from your schema. This is the BEST approach.

**Benefits:**
- ✅ Always in sync with database
- ✅ Compile-time type checking
- ✅ IntelliSense in your IDE
- ✅ No manual type maintenance
- ✅ Catch errors before runtime

### 1.3 Typed Query Examples

```typescript
// ✅ GOOD - Type-safe queries
const { data, error } = await supabase
  .from('events')
  .select('*')
  .eq('contact_person_id', userId)

// data is typed as Event[] automatically

// ✅ Insert with full type checking
await supabase.from('events').insert({
  name: 'Event Name',
  start_datetime: new Date().toISOString(),
  // TS will error if required fields are missing!
})

// ✅ Update with type safety
await supabase
  .from('events')
  .update({ name: 'Updated' })
  .eq('id', eventId)
```

### 1.4 Create Wrapper Functions

```typescript
// eventService.ts
import supabase from './supabaseClient'
import type { Database } from './database.types'

type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']

export const eventService = {
  async getEventsByUser(userId: string): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('contact_person_id', userId)
    
    if (error) throw error
    return data || []
  },

  async createEvent(event: EventInsert): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateEvent(id: string, updates: EventUpdate): Promise<Event> {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
```

---

## 2. Tools to Generate TypeScript Types from Supabase

### 2.1 **Supabase CLI (RECOMMENDED)** ⭐

The official and best option.

**Installation:**
```bash
npm install -D supabase
```

**Setup:**
```bash
# Login to Supabase
supabase login

# Initialize
supabase init

# Generate types
supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts
```

**In your package.json:**
```json
{
  "scripts": {
    "types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts"
  }
}
```

**Output example:**
```typescript
// database.types.ts (auto-generated)
export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          name: string
          start_datetime: string
          end_datetime: string
          contact_person_id: string | null
          // ...
        }
        Insert: {
          id?: string
          name: string
          start_datetime: string
          end_datetime: string
          contact_person_id?: string | null
          // ...
        }
        Update: {
          id?: string
          name?: string
          start_datetime?: string
          end_datetime?: string
          contact_person_id?: string | null
          // ...
        }
      }
      // ... other tables
    }
  }
}
```

### 2.2 **TypeBox CLI (Alternative)**

For more control over generated types:

```bash
npm install -D @sinclair/typebox
```

### 2.3 **openapi-typescript (Alternative)**

If you use Supabase's REST API:

```bash
npm install -D openapi-typescript
npx openapi-typescript https://YOUR_PROJECT.supabase.co/rest/v1/?apikey=YOUR_KEY
```

---

## 3. Recommended Project Structure

```
src/
  types/
    database.types.ts       # ← Auto-generated from Supabase
    index.ts
  services/
    eventService.ts         # ← Typed wrapper functions
    tournamentService.ts
  supabaseClient.ts         # ← Typed client initialization
  views/
    event-list/
      event-list.ts
```

---

## 4. Advanced Patterns

### 4.1 Error Handling

```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

async function getEvents(userId: string): Promise<Result<Event[]>> {
  try {
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
}
```

### 4.2 Relationships

```typescript
// Get event with related tournaments
const { data } = await supabase
  .from('events')
  .select(`
    *,
    tournaments (
      id,
      name,
      arenas (*)
    )
  `)
  .eq('id', eventId)
  .single()
```

### 4.3 Real-time Subscriptions

```typescript
const subscription = supabase
  .channel('events')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'events' },
    (payload: RealtimePostgresChangesPayload<Event>) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

---

## 5. Your Current Project Status

### ✅ What you're doing well:
- Centralized types in `response.type.ts`
- Organized project structure

### 🔧 What to improve:
1. **Implement Supabase CLI for auto-generated types**
   - Replace manual types in `response.type.ts` with generated `database.types.ts`
   - Run `npm run types` whenever schema changes

2. **Create service layer**
   - Move all Supabase queries to `eventService.ts`, `tournamentService.ts`, etc.
   - Example: `eventService.getEvents()`, `eventService.createEvent()`
   - Components only call service functions

3. **Use generated Database types**
   - Import: `import type { Database } from './database.types'`
   - Extract row types: `type Event = Database['public']['Tables']['events']['Row']`
   - Extract insert types: `type EventInsert = Database['public']['Tables']['events']['Insert']`
   - Extract update types: `type EventUpdate = Database['public']['Tables']['events']['Update']`

4. **Add error handling**
   - Create `Result<T>` type for consistent error handling
   - All service functions should return `Result<T>`

---

## 6. Next Steps

1. **Set up Supabase CLI:**
   ```bash
   npm install -D supabase
   supabase login
   supabase gen types typescript --project-id YOUR_PROJECT_ID > shared/types/src/database.types.ts
   ```

2. **Create service layer:**
   - `shared/services/eventService.ts`
   - `shared/services/tournamentService.ts`
   - `shared/services/profileService.ts`
   - etc.

3. **Refactor components:**
   - Update `event-list.ts` to use `eventService`
   - Replace inline Supabase queries with service functions

4. **Add error handling:**
   - Implement `Result<T>` pattern
   - Show user-friendly error messages

---

## 7. Useful Resources

- **Official Supabase TypeScript Guide:** https://supabase.com/docs/guides/database/typescript
- **Supabase CLI Reference:** https://supabase.com/docs/reference/cli/supabase-gen-types-typescript
- **Database Best Practices:** https://supabase.com/docs/guides/database/best-practices

