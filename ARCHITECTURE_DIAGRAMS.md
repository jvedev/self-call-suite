# Architecture Diagrams: TypeScript + Supabase

## 1. Traditional Approach (❌ Not Recommended)

```
┌─────────────────────────────────────────────────────────────┐
│ Components (Vue, React, Web Components)                      │
│                                                              │
│  event-list.ts          tournament-list.ts       venue-list │
│  ┌──────────────┐       ┌───────────────┐        ┌────────┐ │
│  │async loadEv()│       │async load()   │        │async   │ │
│  │  const {data}│       │  const {data} │        │load()  │ │
│  │  = await     │       │  = await      │        │        │ │
│  │  supabase... │       │  supabase...  │        │        │ │
│  └──────────────┘       └───────────────┘        └────────┘ │
│         ▲                       ▲                      ▲      │
└─────────┼───────────────────────┼──────────────────────┼─────┘
          │                       │                      │
          │ Queries directly      │ Scattered Queries    │
          │                       │                      │
┌─────────┼───────────────────────┼──────────────────────┼─────┐
│         │ Supabase Client       │                      │     │
│         └───────────────────────┴──────────────────────┴──── │
│                                                              │
│  .from('events').select().eq()                              │
│  .from('tournaments').select()                              │
│  .from('venues').select()                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ Supabase Backend                                             │
│                                                              │
│  PostgreSQL Database                                         │
│  ├─ events                                                   │
│  ├─ tournaments                                              │
│  ├─ venues                                                   │
│  └─ ... other tables                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Problems:
❌ Types scattered and manually maintained
❌ No consistency in error handling
❌ Hard to reuse logic
❌ Hard to test (Supabase calls scattered everywhere)
❌ Schema changes require updating multiple files
```

---

## 2. Best Practice Approach (✅ Recommended)

```
┌────────────────────────────────────────────────────────────┐
│ Step 1: GENERATE TYPES                                      │
│                                                             │
│  Supabase CLI:                                              │
│  $ supabase gen types typescript --project-id YOUR_ID       │
│                                                             │
│  ▼▼▼                                                        │
│                                                             │
│  database.types.ts (AUTO-GENERATED)                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ export type Database = {                               │ │
│  │   public: {                                            │ │
│  │     Tables: {                                          │ │
│  │       events: {                                        │ │
│  │         Row: Event                                     │ │
│  │         Insert: EventInsert                            │ │
│  │         Update: EventUpdate                            │ │
│  │       }                                                │ │
│  │       tournaments: { ... }                             │ │
│  │       venues: { ... }                                  │ │
│  │     }                                                  │ │
│  │   }                                                    │ │
│  │ }                                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ✅ Always in sync with database                           │
│  ✅ Auto-updated when schema changes                       │
│  ✅ Zero maintenance                                       │
│                                                             │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ Step 2: CREATE SERVICE LAYER                                │
│                                                             │
│  services/
│  ├─ eventService.ts        (import types from database.types)
│  ├─ tournamentService.ts    (import types from database.types)
│  ├─ venueService.ts         (import types from database.types)
│  └─ index.ts
│                                                             │
│  eventService.ts:                                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ type Event = Database['...']['events']['Row']          │ │
│  │ type EventInsert = Database['...']['events']['Insert'] │ │
│  │                                                        │ │
│  │ export const eventService = {                          │ │
│  │   async getByUser(userId: string) {...}              │ │
│  │   async create(event: EventInsert) {...}             │ │
│  │   async update(id: string, e: EventUpdate) {...}     │ │
│  │   async delete(id: string) {...}                     │ │
│  │ }                                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ✅ Centralized database queries                           │
│  ✅ Consistent error handling                              │
│  ✅ Easy to test (mockable)                                │
│  ✅ Easy to add features (logging, caching, etc)           │
│                                                             │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ Step 3: USE IN COMPONENTS                                   │
│                                                             │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ event-list.ts   │  │tourney-list  │  │ venue-list   │  │
│  │                 │  │              │  │              │  │
│  │import {         │  │import {      │  │import {      │  │
│  │  eventService   │  │  tourneyServ.│  │  venueServ.  │  │
│  │}                │  │}             │  │}             │  │
│  │                 │  │              │  │              │  │
│  │const result =   │  │const result =│  │const result =│  │
│  │await eventServ. │  │await tourneyS│  │await venueSer│  │
│  │getByUser(userId)│  │.getByEvent() │  │.getAll()     │  │
│  │                 │  │              │  │              │  │
│  │if (result.ok)   │  │if (result.ok)│  │if (result.ok)│  │
│  │  this.events =  │  │  events = r. │  │  venues = r. │  │
│  │  result.data    │  │  data        │  │  data        │  │
│  └─────────────────┘  └──────────────┘  └──────────────┘  │
│                                                             │
│  ✅ Type-safe queries                                      │
│  ✅ Consistent error handling (Result<T> pattern)          │
│  ✅ Perfect IDE autocomplete                               │
│  ✅ Easy to test (mock services)                           │
│  ✅ Easy to refactor (services isolated)                   │
│                                                             │
└────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────┐
│ Supabase Backend                                             │
│                                                             │
│  PostgreSQL Database                                         │
│  ├─ events                                                   │
│  ├─ tournaments                                              │
│  ├─ venues                                                   │
│  └─ ... other tables                                         │
│                                                             │
└────────────────────────────────────────────────────────────┘

Benefits:
✅ Types auto-generated from database
✅ Types always in sync with database
✅ Centralized database queries
✅ Consistent error handling throughout
✅ Perfect IDE support
✅ Easy to test (services are mockable)
✅ Easy to extend (logging, caching, validation)
✅ Industry-standard approach
```

---

## 3. Data Flow Comparison

### ❌ Without Service Layer

```
User clicks "Create Event" button
         │
         ▼
Component: showCreateForm()
         │
         ▼
Form submitted
         │
         ▼
Component: async createEvent(data) {
  const { data, error } = await supabase
    .from('events')
    .insert(data)
  this.events = (data || []) as Event[]  ← 🤞 Hope this is right!
  this.render()
}
         │
         ▼
Supabase Client
         │
         ▼
PostgreSQL
         │
         ▼
Response: success or error
         │
         ▼
Back to component
         │
         ▼
Component handles response
         │
         ▼
Component re-renders

Problems:
❌ Type cast with 'as' - not safe
❌ Error handling inline
❌ Hard to reuse
❌ Hard to add features
❌ Hard to test
```

### ✅ With Service Layer

```
User clicks "Create Event" button
         │
         ▼
Component: showCreateForm()
         │
         ▼
Form submitted
         │
         ▼
Component: async createEventHandler(data: EventInsert) {
  const result = await eventService.create(data)
  if (result.success) {
    this.events = result.data  ← ✅ Fully typed!
    this.render()
  } else {
    showError(result.error)
  }
}
         │
         ▼
Service: eventService.create(event: EventInsert) {
  - Validate input
  - Call Supabase
  - Handle error
  - Return Result<Event>
}
         │
         ▼
Supabase Client
         │
         ▼
PostgreSQL
         │
         ▼
Response: success or error
         │
         ▼
Service: Handle and wrap in Result type
         │
         ▼
Back to component with Result<Event>
         │
         ▼
Component handles Result
         │
         ▼
Component re-renders

Benefits:
✅ Type-safe from start to end
✅ Consistent error handling
✅ Easy to add logging/caching
✅ Easy to test (mock service)
✅ Easy to reuse (other components use same service)
```

---

## 4. Type Safety Flow

```
Database Schema (SQL)
    │
    │ "$ supabase gen types"
    │
    ▼
database.types.ts (AUTO-GENERATED)
    │
    │ "import type { Database }"
    │
    ┌────┴────┐
    │         │
    ▼         ▼
Service  Component
Layer    Code
    │         │
    │         │
    ▼         ▼
type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']
    │         │
    │         │
    ▼         ▼
EventService:
  async create(event: EventInsert): Promise<Result<Event>>
     │
     ▼ TypeScript checks:
     ✅ event has all required fields
     ✅ event.name is string (not number)
     ✅ Returns Event (with all fields)
     ✅ Wrapped in Result<T> for error handling
    │
    ▼
Component:
  const result = await eventService.create({
    name: 'Event',                    ✅ Required, type string
    start_datetime: '...',            ✅ Required, type string
    // TypeScript error if missing:
    end_datetime: '...',              ✅ Required, type string
    invalid_field: '...'              ❌ ERROR: Unknown field!
  })

  if (result.success) {
    console.log(result.data.name)     ✅ TypeScript knows this exists
  } else {
    console.log(result.error)         ✅ TypeScript knows this is string
  }

=== COMPILE TIME TYPE CHECKING ===
✅ Catch errors BEFORE code runs
✅ IDE shows all valid fields
✅ IDE shows field types
✅ No runtime surprises
```

---

## 5. File Structure

### Before (Scattered)

```
src/
├─ event-list/
│  └─ event-list.ts          ← Queries scattered here
├─ tournament-list/
│  └─ tournament-list.ts      ← Queries scattered here
├─ venue-list/
│  └─ venue-list.ts           ← Queries scattered here
├─ response.type.ts           ← Manual types (outdated?)
└─ supabaseClient.ts
```

**Problem:** Queries everywhere, types manual, no reuse

### After (Organized)

```
shared/
├─ types/
│  └─ database.types.ts       ← AUTO-GENERATED from schema
│                                (regenerate when schema changes)
└─ services/
   ├─ eventService.ts         ← All event queries here
   ├─ tournamentService.ts    ← All tournament queries here
   ├─ venueService.ts         ← All venue queries here
   ├─ profileService.ts       ← All profile queries here
   └─ index.ts                ← Export all services

apps/
└─ eventManager/
   └─ src/
      ├─ event-list/
      │  └─ event-list.ts     ← Uses eventService
      ├─ tournament-list/
      │  └─ tournament-list.ts ← Uses tournamentService
      ├─ venue-list/
      │  └─ venue-list.ts      ← Uses venueService
      └─ supabaseClient.ts
```

**Benefits:**
- ✅ Services centralized
- ✅ Types auto-maintained
- ✅ Easy to find queries
- ✅ Easy to reuse
- ✅ Easy to test

---

## 6. Error Handling Pattern

### Result<T> Type

```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

// Usage:
const result: Result<Event[]> = await eventService.getByUser(userId)

// TypeScript knows that:
if (result.success === true) {
  // result.data is Event[]
  console.log(result.data[0].name)  ✅ OK
} else {
  // result.error is string
  console.log(result.error)         ✅ OK
}

// TypeScript prevents:
if (result.success) {
  console.log(result.error)         ❌ ERROR: error doesn't exist when success
  console.log(result.data.length)   ✅ OK
} else {
  console.log(result.data)          ❌ ERROR: data doesn't exist when failed
  console.log(result.error)         ✅ OK
}
```

---

## 7. Workflow Diagram

### Normal Development

```
┌─────────────────────────────────────────────────────┐
│ 1. Schema in Database                               │
│    (Via Supabase dashboard or SQL)                  │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ 2. Generate Types                                   │
│    $ npm run gen:types                              │
│    (Updates database.types.ts)                      │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ 3. Services Use Generated Types                     │
│    import type { Database }                         │
│    type Event = Database[...]['events']['Row']      │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ 4. Components Use Services                          │
│    import { eventService }                          │
│    const result = await eventService.getByUser()   │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ 5. TypeScript Compilation                           │
│    $ npm run build                                  │
│    (Catches all type errors)                        │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│ 6. Run Application                                  │
│    $ npm run dev                                    │
│    (No type errors, fully type-safe)                │
└─────────────────────────────────────────────────────┘
```

### When Schema Changes

```
Developer makes change in Supabase dashboard
         │
         ▼
Run: $ npm run gen:types
         │
         ▼
database.types.ts automatically updates
         │
         ▼
TypeScript compilation
         │
         ├─ ❌ ERROR: Missing required field
         │  (Service won't compile until fixed)
         │
         └─ ✅ All good
            (Types match schema)
         │
         ▼
Services and components automatically use new types
         │
         ▼
App works with new schema

Benefits:
✅ Never forget to update types
✅ Always in sync with database
✅ Catch errors at compile time, not runtime
```

---

## 8. Team Collaboration

```
Database Schema (Shared)
  │
  ├─ Developer A
  │  │
  │  ├─ Pull latest code
  │  │
  │  ├─ Run: npm run gen:types
  │  │
  │  └─ Types auto-update
  │     (No manual sync needed)
  │
  ├─ Developer B
  │  │
  │  ├─ Pull latest code
  │  │
  │  ├─ Run: npm run gen:types
  │  │
  │  └─ Types auto-update
  │     (No manual sync needed)
  │
  └─ Developer C
     │
     ├─ Pull latest code
     │
     ├─ Run: npm run gen:types
     │
     └─ Types auto-update
        (No manual sync needed)

Benefits:
✅ Everyone has same types
✅ No "type drift"
✅ No coordination needed
✅ Easy code reviews
✅ No type mismatch bugs
```

This architecture ensures that all developers are working with the same, correct types automatically!

