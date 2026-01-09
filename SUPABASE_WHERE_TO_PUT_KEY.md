# 📍 Where to Put Your Supabase API Key - Visual Guide

## The Answer in One Picture

```
┌──────────────────────────────────────────────────────────┐
│                   YOUR COMPUTER                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  C:\Users\jve\Desktop\self-call-suite\                  │
│         └── apps\                                        │
│             └── suite\                                   │
│                 └── .env ← YOUR KEY GOES HERE!          │
│                                                          │
│    Content of .env:                                     │
│    ─────────────────────────────────────────────────────│
│    VITE_SUPABASE_URL=https://...supabase.co            │
│    VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiI...           │
│    ─────────────────────────────────────────────────────│
│                                                          │
└──────────────────────────────────────────────────────────┘
                          ↕️ (used by)
┌──────────────────────────────────────────────────────────┐
│              VITE BUILD PROCESS                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  reads .env file                                        │
│  provides env vars to app via import.meta.env           │
│                                                          │
└──────────────────────────────────────────────────────────┘
                          ↕️ (used by)
┌──────────────────────────────────────────────────────────┐
│         apps/suite/src/services/supabaseClient.ts       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  const url = import.meta.env.VITE_SUPABASE_URL         │
│  const key = import.meta.env.VITE_SUPABASE_KEY         │
│  Creates Supabase client...                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
                          ↕️ (used by)
┌──────────────────────────────────────────────────────────┐
│                 YOUR APP                                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Login View → authService → Supabase API               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 3 Things You Need to Know

### 1. WHERE
```
File: apps/suite/.env
Location: C:\Users\jve\Desktop\self-call-suite\apps\suite\.env
```

### 2. WHAT
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key-here
```

### 3. WHY
```
Vite reads .env
Vite provides it via import.meta.env
Your app uses it to connect to Supabase
```

---

## How to Set It Up

### STEP 1: Get Keys from Supabase
```
Supabase Dashboard
    ↓
Settings
    ↓
API
    ↓
Copy "Project URL" → for VITE_SUPABASE_URL
Copy "Anon Public" → for VITE_SUPABASE_KEY
```

### STEP 2: Create/Edit .env File
```
Open or create: apps/suite/.env

Write:
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOi...

Save the file
```

### STEP 3: Restart Dev Server
```bash
Stop current server: Ctrl+C
Start again: npm run dev
```

### STEP 4: Test
```
Try to Sign Up or Log In
Should work without "Invalid API key" error
```

---

## What Each Part Does

### VITE_SUPABASE_URL
```
What: Your Supabase project's web address
Where from: Supabase Dashboard → API → PROJECT URL
Example: https://omvpdlghgjjcytmamxvj.supabase.co
Purpose: Tells your app WHERE to find Supabase
```

### VITE_SUPABASE_KEY
```
What: Your public authentication key
Where from: Supabase Dashboard → API → ANON PUBLIC
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Purpose: Tells Supabase your app is authorized
```

### VITE_ Prefix
```
What: Makes Vite expose the variable to browser
Why: Vite only exposes VITE_ prefixed vars for security
Without it: Your app won't have access to the variable
```

---

## Real Example

### In Supabase Dashboard

```
PROJECT URL
https://omvpdlghgjjcytmamxvj.supabase.co

ANON PUBLIC
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXB...
```

### In Your .env File

```
VITE_SUPABASE_URL=https://omvpdlghgjjcytmamxvj.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXB...
```

### In Your App

```typescript
// src/services/supabaseClient.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// → https://omvpdlghgjjcytmamxvj.supabase.co

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
// → eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXB...

const supabase = createClient(supabaseUrl, supabaseKey)
// Now app can connect to Supabase!
```

---

## File Structure

```
C:\Users\jve\Desktop\self-call-suite\

├── apps\
│   └── suite\
│       ├── .env ← ⭐ PUT YOUR KEYS HERE
│       ├── src\
│       │   ├── services\
│       │   │   ├── supabaseClient.ts ← Reads from .env
│       │   │   └── authService.ts ← Uses supabaseClient
│       │   ├── views\
│       │   │   ├── login-view\
│       │   │   └── register-view\
│       │   └── ...
│       ├── vite.config.ts
│       └── package.json
│
├── SUPABASE_API_KEY_SETUP.md ← Read if you need help
├── SUPABASE_QUICK_REFERENCE.md ← Quick cheat sheet
├── SUPABASE_DASHBOARD_GUIDE.md ← How to navigate Supabase
├── SUPABASE_TROUBLESHOOTING.md ← If something goes wrong
└── ...
```

---

## Checklist

- [ ] Created file at `apps/suite/.env`
- [ ] Added `VITE_SUPABASE_URL` line
- [ ] Added `VITE_SUPABASE_KEY` line
- [ ] Values match Supabase Dashboard exactly
- [ ] No extra spaces or characters
- [ ] File is saved
- [ ] Dev server restarted
- [ ] App loads without "Invalid API key" error
- [ ] Can see login page
- [ ] Can try to sign up

---

## Common Mistakes to Avoid

| Mistake | Result | Fix |
|---------|--------|-----|
| File not in right location | App can't find .env | Move to `apps/suite/.env` |
| Wrong key type (SERVICE_ROLE) | "Invalid API key" | Use ANON PUBLIC key |
| Forgot VITE_ prefix | Variables not available | Add `VITE_` before name |
| Extra spaces in key | "Invalid API key" | Copy key carefully |
| Didn't restart dev server | Changes don't work | Stop & restart Vite |
| Key regenerated in dashboard | Suddenly stops working | Copy new key, update .env |
| Using wrong project's keys | Can't access data | Make sure keys match dashboard |

---

## Key Points to Remember

✅ **DO**
- Keep `VITE_` prefix on variable names
- Use **ANON PUBLIC** key (not SERVICE_ROLE)
- Restart dev server after editing .env
- Keep .env in .gitignore
- Update when key is regenerated

❌ **DON'T**
- Forget to restart dev server
- Use SERVICE_ROLE key in browser
- Share your keys publicly
- Commit .env to git
- Add extra spaces around values

---

## If It's Still Not Working

Follow this order:
1. Read **SUPABASE_QUICK_REFERENCE.md** (2 min read)
2. Check **SUPABASE_TROUBLESHOOTING.md** (find your scenario)
3. Review **SUPABASE_API_KEY_SETUP.md** (detailed guide)
4. Check **SUPABASE_DASHBOARD_GUIDE.md** (visual walkthrough)

---

## Key Locations Quick Reference

```
WHERE TO PUT IT:
  apps/suite/.env

WHAT TO PUT IN IT:
  VITE_SUPABASE_URL=https://...supabase.co
  VITE_SUPABASE_KEY=eyJ...

HOW TO GET IT:
  Supabase Dashboard → Settings → API

WHAT YOU NEED FROM THERE:
  PROJECT URL → for VITE_SUPABASE_URL
  ANON PUBLIC → for VITE_SUPABASE_KEY

WHEN YOU'RE DONE:
  Restart dev server with: npm run dev
```

---

## Success!

When you see this:
✅ App loads without errors
✅ Can click "Sign Up"
✅ Can fill in the form
✅ Can submit without "Invalid API key"

Your setup is complete!

---

**Questions?** Check the numbered docs:
1. SUPABASE_QUICK_REFERENCE.md
2. SUPABASE_DASHBOARD_GUIDE.md
3. SUPABASE_TROUBLESHOOTING.md
4. SUPABASE_API_KEY_SETUP.md (complete guide)

