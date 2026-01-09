# Quick Reference: TypeScript + Supabase

## 🎯 TL;DR - The Best Approach

1. **Use Supabase CLI** to auto-generate types from your database
2. **Create a service layer** with typed functions for all queries
3. **Import generated types** in your services and components
4. **Use Result<T>** pattern for error handling

---

## 🛠️ Tools Comparison

| Tool | Setup | Auto-sync | Type Safety | Recommendation |
|------|-------|-----------|-------------|---|
| **Supabase CLI** | ⭐ Easy | ✅ Yes | ✅ Full | ⭐⭐⭐ BEST |
| **Manual Types** | 😞 Hard | ❌ No | ⚠️ Partial | ❌ Avoid |
| **openapi-typescript** | ⚠️ Medium | ✅ Yes | ✅ Full | ⭐⭐ Alternative |
| **TypeBox** | ⚠️ Medium | ❌ No | ⚠️ Partial | ❌ Not recommended |

---

## 📦 Installation & Setup

```bash
# 1. Install Supabase CLI
npm install -D supabase

# 2. Login
supabase login

# 3. Generate types (replace YOUR_PROJECT_ID)
supabase gen types typescript --project-id YOUR_PROJECT_ID > shared/types/src/database.types.ts

# 4. Add to package.json
"scripts": {
  "gen:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > shared/types/src/database.types.ts"
}

# 5. Run whenever schema changes
npm run gen:types
```

---

## 📝 Generated Types Structure

After running `npm run gen:types`, you get:

```typescript
// auto-generated: database.types.ts
export type Database = {
  public: {
    Tables: {
      events: {
        Row: {           // ← SELECT query result
          id: string
          name: string
          start_datetime: string
          // ...
        }
        Insert: {        // ← INSERT data type
          id?: string
          name: string
          start_datetime: string
          // ...
        }
        Update: {        // ← UPDATE data type
          id?: string
          name?: string
          start_datetime?: string
          // ... all fields optional
        }
      }
      // ... other tables
    }
  }
}
```

**Extract types:**
```typescript
import type { Database } from './database.types'

// Full row type (what you get from SELECT)
type Event = Database['public']['Tables']['events']['Row']

// Insert type (what you pass to INSERT)
type EventInsert = Database['public']['Tables']['events']['Insert']

// Update type (what you pass to UPDATE)
type EventUpdate = Database['public']['Tables']['events']['Update']
```

---

## 🔧 Complete Service Example

```typescript
// services/eventService.ts
import supabase from '../modules/supabaseClient'
import type { Database } from '../types/database.types'

type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']

type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export const eventService = {
  // Get all events for a user
  async getByUser(userId: string): Promise<Result<Event[]>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('contact_person_id', userId)
      
      if (error) throw error
      return { success: true, data: data || [] }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },

  // Get single event
  async getById(id: string): Promise<Result<Event | null>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },

  // Create event
  async create(event: EventInsert): Promise<Result<Event>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert(event)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },

  // Update event
  async update(id: string, updates: EventUpdate): Promise<Result<Event>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  },

  // Delete event
  async delete(id: string): Promise<Result<void>> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true, data: undefined }
    } catch (err) {
      return { success: false, error: String(err) }
    }
  }
}
```

---

## 💻 Using Services in Components

```typescript
// Before: ❌ Messy
async loadEvents() {
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("contact_person_id", this.userId)
  this.events = (data || []) as Event[]
}

// After: ✅ Clean & Type-safe
import { eventService } from "@shared/services"
import type { Database } from "../types/database.types"

type Event = Database['public']['Tables']['events']['Row']

async loadEvents() {
  const result = await eventService.getByUser(this.userId)
  if (result.success) {
    this.events = result.data
  } else {
    console.error(result.error)
  }
}

async handleCreate(name: string, start: string, end: string) {
  const result = await eventService.create({
    name,
    start_datetime: start,
    end_datetime: end,
    contact_person_id: this.userId,
    contact_email: ''
  })
  
  if (result.success) {
    await this.loadEvents() // refresh
  } else {
    alert(`Error: ${result.error}`)
  }
}
```

---

## 🚀 Query Patterns

### Select with Relations
```typescript
const { data } = await supabase
  .from('events')
  .select(`
    *,
    tournaments (id, name),
    venues:event_locations (venue_id)
  `)
```

### Filter & Sort
```typescript
const { data } = await supabase
  .from('events')
  .select('*')
  .eq('organizer_id', clubId)           // WHERE organizer_id = ?
  .gt('start_datetime', now)            // WHERE start_datetime > ?
  .order('start_datetime', { ascending: true })
  .limit(10)
```

### Real-time Subscription
```typescript
supabase
  .channel('events')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'events' },
    (payload) => {
      console.log('Event changed:', payload)
    }
  )
  .subscribe()
```

---

## ✅ Type Safety Examples

```typescript
// ✅ TypeScript catches errors!

// Missing required field
const event: EventInsert = {
  name: 'Event'
  // ❌ ERROR: Property 'start_datetime' is missing
}

// Wrong type
const event: EventInsert = {
  name: 'Event',
  start_datetime: new Date(),  // ❌ ERROR: Expected string
  // ✅ SHOULD BE: new Date().toISOString()
}

// Non-existent field
const event: EventInsert = {
  name: 'Event',
  start_datetime: '2024-01-01T00:00:00Z',
  invalid_field: 'value'  // ❌ ERROR: Unknown property
}

// Service return type is checked
const result = await eventService.getByUser(userId)
if (result.success) {
  console.log(result.data)  // ✅ Event[]
} else {
  console.log(result.error)  // ✅ string
}
```

---

## 🔄 Workflow When Schema Changes

1. Modify schema in Supabase dashboard (or SQL file)
2. Run: `npm run gen:types`
3. Types auto-update in `database.types.ts`
4. IDE auto-completes with new fields
5. TypeScript catches missing fields

---

## 📚 Resources

- **Official Guide:** https://supabase.com/docs/guides/database/typescript
- **Supabase CLI:** https://supabase.com/docs/reference/cli/supabase-gen-types-typescript
- **RLS Best Practices:** https://supabase.com/docs/guides/database/postgres/row-level-security
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

---

## ❓ Common Mistakes & How to Fix

```typescript
// ❌ DON'T: Use 'as' casts
const events = (data || []) as Event[]

// ✅ DO: Let TypeScript infer from service
const result = await eventService.getByUser(userId)
if (result.success) {
  const events = result.data  // Already typed!
}

// ❌ DON'T: Ignore errors
const { data } = await supabase
  .from('events')
  .select('*')
  .eq('contact_person_id', userId)
// What if query fails?

// ✅ DO: Check errors
const result = await eventService.getByUser(userId)
if (result.success) {
  // data is safe
} else {
  // handle error.error
}

// ❌ DON'T: Spread unknown data
const event = { ...unknownData } as Event

// ✅ DO: Validate in service layer
export const eventService = {
  async create(data: EventInsert) {
    // TypeScript ensures data has required fields
    const result = await supabase.from('events').insert(data)
  }
}
```

---

## 🎓 Your Learning Path

1. **Week 1:** Install CLI, generate types, understand structure
2. **Week 2:** Create service layer for events
3. **Week 3:** Create services for tournaments, venues
4. **Week 4:** Refactor components to use services
5. **Week 5:** Add error handling & validation

---

## 📞 Need Help?

1. Check if `database.types.ts` is generated
2. Verify import paths are correct
3. Run `npm run gen:types` after schema changes
4. Check that services export all functions
5. Use IDE Go-to-Definition to verify types

