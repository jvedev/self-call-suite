# Practical Examples: Your Code Refactored

This document shows exactly how to refactor your current code with the best practices.

---

## Current vs. Refactored

### 📍 File: `event-list.ts`

#### ❌ BEFORE (Current Code)

```typescript
import html from "./event-list.html?raw";
import css from "./event-list.css?raw";
import { BaseComponent } from "@shared/web-components";
import { supabase } from "../supabaseClient";
import { Event } from "../response.type";

export class EventList extends BaseComponent {
  events: Event[] = [];
  userId: string | null = null;

  constructor() {
    super();
    this.render(css, html);
    this.init();
  }

  async init() {
    await this.getUser();
    await this.loadEvents();
    this.setupHandlers();
  }

  async getUser() {
    const { data } = await supabase.auth.getUser();
    this.userId = data?.user?.id || null;
  }

  async loadEvents() {
    // Only show events created by user or where user is admin
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("contact_person_id", this.userId);
    this.events = (data || []) as Event[];  // ❌ Using 'as' cast
    this.renderEvents();
  }

  renderEvents() {
    const ul = this.queryRoot<HTMLUListElement>("events");
    if (!ul) return;
    ul.innerHTML = "";
    this.events.forEach((event: Event) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${event.name}</strong><br>
        ${event.start_datetime} - ${event.end_datetime}<br>
        <button data-id="${event.id}" class="edit">Edit</button>
        <button data-id="${event.id}" class="delete">Delete</button>
      `;
      ul.appendChild(li);
    });
  }

  setupHandlers() {
    const createBtn = this.queryRoot<HTMLButtonElement>("create-event");
    if (createBtn) createBtn.onclick = () => this.showCreateForm();
    const ul = this.queryRoot<HTMLUListElement>("events");
    if (ul) {
      ul.onclick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        if (target.classList.contains("edit")) {
          const id = target.getAttribute("data-id");
          if (id) this.showEditForm(id);
        } else if (target.classList.contains("delete")) {
          const id = target.getAttribute("data-id");
          if (id) this.deleteEvent(id);
        }
      };
    }
  }

  showCreateForm() {
    // ... form creation code ...
  }

  showEditForm(id: string) {
    // ... edit form code ...
  }

  async deleteEvent(id: string) {
    await supabase.from("events").delete().eq("id", id);
    await this.loadEvents();
  }
}
```

#### ✅ AFTER (Best Practices)

**Step 1: Create the service** `shared/services/eventService.ts`

```typescript
import supabase from '../modules/supabaseClient'
import type { Database } from '../types/database.types'

// Extract types from generated schema
type Event = Database['public']['Tables']['events']['Row']
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']

// Consistent error handling
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

export const eventService = {
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
      return { 
        success: false, 
        error: `Failed to load events: ${String(err)}` 
      }
    }
  },

  async createEvent(event: EventInsert): Promise<Result<Event>> {
    try {
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
      return { 
        success: false, 
        error: `Failed to create event: ${String(err)}` 
      }
    }
  },

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
      return { 
        success: false, 
        error: `Failed to update event: ${String(err)}` 
      }
    }
  },

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
      return { 
        success: false, 
        error: `Failed to delete event: ${String(err)}` 
      }
    }
  }
}
```

**Step 2: Update the component** `event-list.ts`

```typescript
import html from "./event-list.html?raw";
import css from "./event-list.css?raw";
import { BaseComponent } from "@shared/web-components";
import { supabase } from "../supabaseClient";
import { eventService } from "@shared/services";
import type { Database } from "../types/database.types";

// Import generated type from database schema
type Event = Database['public']['Tables']['events']['Row']

export class EventList extends BaseComponent {
  events: Event[] = [];
  userId: string | null = null;
  errorMessage: string | null = null;

  constructor() {
    super();
    this.render(css, html);
    this.init();
  }

  async init() {
    await this.getUser();
    await this.loadEvents();
    this.setupHandlers();
  }

  async getUser() {
    const { data } = await supabase.auth.getUser();
    this.userId = data?.user?.id || null;
  }

  async loadEvents() {
    // Use typed service instead of direct Supabase call
    const result = await eventService.getEventsByUser(this.userId);
    
    if (result.success) {
      this.events = result.data;
      this.errorMessage = null;
    } else {
      this.errorMessage = result.error;
      console.error('Failed to load events:', result.error);
      this.events = [];
    }
    
    this.renderEvents();
  }

  renderEvents() {
    const ul = this.queryRoot<HTMLUListElement>("events");
    if (!ul) return;
    
    ul.innerHTML = "";
    
    // Show error if present
    if (this.errorMessage) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "error";
      errorDiv.textContent = `Error: ${this.errorMessage}`;
      ul.parentNode?.insertBefore(errorDiv, ul);
      return;
    }

    // Render events
    this.events.forEach((event: Event) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${event.name}</strong><br>
        ${event.start_datetime} - ${event.end_datetime}<br>
        <button data-id="${event.id}" class="edit">Edit</button>
        <button data-id="${event.id}" class="delete">Delete</button>
      `;
      ul.appendChild(li);
    });
  }

  setupHandlers() {
    const createBtn = this.queryRoot<HTMLButtonElement>("create-event");
    if (createBtn) createBtn.onclick = () => this.showCreateForm();
    
    const ul = this.queryRoot<HTMLUListElement>("events");
    if (ul) {
      ul.onclick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target) return;
        
        if (target.classList.contains("edit")) {
          const id = target.getAttribute("data-id");
          if (id) this.showEditForm(id);
        } else if (target.classList.contains("delete")) {
          const id = target.getAttribute("data-id");
          if (id) this.deleteEventHandler(id);
        }
      };
    }
  }

  showCreateForm() {
    const ul = this.queryRoot<HTMLUListElement>("events");
    if (!ul || !ul.parentNode) return;
    
    const form = document.createElement("form");
    form.innerHTML = `
      <input name="name" placeholder="Event Name" required />
      <input name="start_datetime" type="datetime-local" required />
      <input name="end_datetime" type="datetime-local" required />
      <button type="submit">Create</button>
      <button type="button" id="cancel">Cancel</button>
    `;
    
    ul.parentNode.insertBefore(form, ul);
    
    form.onsubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      
      const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value;
      const start_datetime = (form.querySelector('[name="start_datetime"]') as HTMLInputElement)?.value;
      const end_datetime = (form.querySelector('[name="end_datetime"]') as HTMLInputElement)?.value;

      // Use service with proper types
      const result = await eventService.createEvent({
        name,
        start_datetime,
        end_datetime,
        contact_person_id: this.userId || undefined,
        contact_email: '',
        organizer_id: null
      });

      if (result.success) {
        form.remove();
        await this.loadEvents();
      } else {
        alert(`Error creating event: ${result.error}`);
      }
    };
    
    const cancelBtn = form.querySelector("#cancel");
    if (cancelBtn) {
      (cancelBtn as HTMLButtonElement).onclick = () => form.remove();
    }
  }

  showEditForm(id: string) {
    const event = this.events.find(ev => ev.id === id);
    if (!event) return;
    
    const ul = this.queryRoot<HTMLUListElement>("events");
    if (!ul || !ul.parentNode) return;
    
    const form = document.createElement("form");
    form.innerHTML = `
      <input name="name" value="${event.name}" required />
      <input name="start_datetime" type="datetime-local" value="${event.start_datetime}" required />
      <input name="end_datetime" type="datetime-local" value="${event.end_datetime}" required />
      <button type="submit">Update</button>
      <button type="button" id="cancel">Cancel</button>
    `;
    
    ul.parentNode.insertBefore(form, ul);
    
    form.onsubmit = async (e: SubmitEvent) => {
      e.preventDefault();
      
      const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value;
      const start_datetime = (form.querySelector('[name="start_datetime"]') as HTMLInputElement)?.value;
      const end_datetime = (form.querySelector('[name="end_datetime"]') as HTMLInputElement)?.value;

      // Use service with typed updates
      const result = await eventService.updateEvent(id, {
        name,
        start_datetime,
        end_datetime
      });

      if (result.success) {
        form.remove();
        await this.loadEvents();
      } else {
        alert(`Error updating event: ${result.error}`);
      }
    };
    
    const cancelBtn = form.querySelector("#cancel");
    if (cancelBtn) {
      (cancelBtn as HTMLButtonElement).onclick = () => form.remove();
    }
  }

  async deleteEventHandler(id: string) {
    // Use service instead of inline query
    const result = await eventService.deleteEvent(id);
    
    if (result.success) {
      await this.loadEvents();
    } else {
      alert(`Error deleting event: ${result.error}`);
    }
  }
}

customElements.define("event-list", EventList);
```

---

## Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Type Safety** | `as Event[]` casts | Fully typed from DB schema |
| **Error Handling** | Ignored errors | Explicit Result<T> pattern |
| **Code Organization** | Queries inline | Dedicated service layer |
| **Maintainability** | Scattered logic | Centralized services |
| **IDE Support** | Limited | Full autocomplete |
| **Test-ability** | Hard to test | Easy to mock services |
| **Reusability** | Copy-paste code | Use service anywhere |

---

## Benefits You Get

### 🎯 Type Safety
```typescript
// TypeScript catches errors before runtime
const result = await eventService.createEvent({
  name: 'Event',
  // ❌ ERROR: Missing required 'start_datetime'
  // ✅ FIXED: Add required field
  start_datetime: '2024-01-01T00:00:00Z',
  end_datetime: '2024-01-01T23:59:59Z',
  contact_person_id: this.userId
})
```

### 🔍 IDE Autocomplete
```typescript
// Start typing and IDE suggests:
await eventService.  // ← shows: getEventsByUser, createEvent, updateEvent, deleteEvent
await eventService.createEvent({  // ← shows all required fields with correct types
  name: '',              // ← typed as string
  start_datetime: '',    // ← typed as string
  end_datetime: '',      // ← typed as string
  contact_person_id: '', // ← typed as string
  // ... all fields with proper types
})
```

### 🔄 Consistent Error Handling
```typescript
// Every operation returns Result<T>
const result = await eventService.createEvent(...)
if (result.success) {
  // result.data is typed Event
  console.log(result.data.name)  // ✅ Works, properly typed
} else {
  // result.error is typed string
  console.log(result.error)      // ✅ Error message
}
```

### 📦 Easy to Refactor
When you need to:
- Add filtering
- Add pagination
- Add caching
- Add logging

You only change **one file** - the service! All components automatically get the improvements.

### ✅ Easy to Test
```typescript
// Mock service in tests
const mockEventService = {
  getEventsByUser: async () => ({
    success: true,
    data: [{ id: '1', name: 'Test Event', ... }]
  })
}

// Use in test
const result = await mockEventService.getEventsByUser('user-id')
expect(result.success).toBe(true)
expect(result.data[0].name).toBe('Test Event')
```

---

## Migration Checklist

- [ ] Install Supabase CLI: `npm install -D supabase`
- [ ] Generate types: `supabase gen types typescript --project-id YOUR_ID > shared/types/src/database.types.ts`
- [ ] Create `shared/services/` directory
- [ ] Create `shared/services/eventService.ts` (use example above)
- [ ] Update `event-list.ts` to use service
- [ ] Test that app still works
- [ ] Remove old `response.type.ts` event type (keep others if needed)
- [ ] Add `"gen:types"` script to package.json
- [ ] Commit changes
- [ ] Create services for other entities (tournaments, venues, etc.)
- [ ] Update other components to use services

---

## Timeline

- **Hour 1:** Install CLI, generate types, understand structure
- **Hour 2:** Create eventService
- **Hour 3:** Update event-list component
- **Hour 4:** Create other services (tournaments, venues)
- **Hour 5:** Update other components

Total time: ~5 hours for complete refactor

---

## Questions?

- **"Will this break my app?"** No, just carefully update one component at a time
- **"Do I need to change the database?"** No, just generate types from existing schema
- **"Can I do it gradually?"** Yes! Refactor one component per day
- **"What about existing types?"** Delete them, use generated ones instead
- **"Is this overkill?"** No, this is industry standard practice

