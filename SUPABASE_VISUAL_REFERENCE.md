# 🎯 Supabase API Key - Visual Reference Card

```
╔════════════════════════════════════════════════════════════════╗
║           SUPABASE API KEY SETUP - VISUAL GUIDE               ║
╚════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────┐
│ THE ERROR YOU'RE SEEING                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  {                                                              │
│    "message": "Invalid API key",                                │
│    "hint": "Double check your Supabase anon API key."          │
│  }                                                              │
│                                                                 │
│  This means: Your app tried to connect to Supabase            │
│             but couldn't authenticate with the key             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ THE SOLUTION IN 3 STEPS                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: GET THE KEYS FROM SUPABASE                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                 │
│    https://supabase.com/dashboard                              │
│          ↓                                                      │
│    Select your project                                         │
│          ↓                                                      │
│    Settings → API                                              │
│          ↓                                                      │
│    Copy: PROJECT URL & ANON PUBLIC                             │
│                                                                 │
│  ┌──────────────────────────────────────────────┐              │
│  │ WHAT YOU'LL FIND IN SUPABASE DASHBOARD:      │              │
│  ├──────────────────────────────────────────────┤              │
│  │                                              │              │
│  │ PROJECT URL                                  │              │
│  │ https://omvpdlghgjjcytmamxvj.supabase.co   │              │
│  │              ↓ COPY THIS ↓                  │              │
│  │                                              │              │
│  │ ANON PUBLIC                                  │              │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...   │              │
│  │              ↓ AND THIS ↓                   │              │
│  │                                              │              │
│  └──────────────────────────────────────────────┘              │
│                                                                 │
│                                                                 │
│  STEP 2: PUT THEM IN YOUR .env FILE                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                 │
│    File: apps/suite/.env                                       │
│                                                                 │
│    Content:                                                    │
│    ┌────────────────────────────────────────────┐              │
│    │ VITE_SUPABASE_URL=https://omvp...         │              │
│    │ VITE_SUPABASE_KEY=eyJhbGci...             │              │
│    └────────────────────────────────────────────┘              │
│                                                                 │
│                                                                 │
│  STEP 3: RESTART DEV SERVER                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                 │
│    Press: Ctrl + C (to stop current server)                    │
│    Then:  npm run dev (to restart)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ HOW IT ALL CONNECTS                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  .env FILE                                                      │
│  ┌──────────────────────────┐                                   │
│  │ VITE_SUPABASE_URL        │                                   │
│  │ VITE_SUPABASE_KEY        │                                   │
│  └────────────┬─────────────┘                                   │
│               │                                                │
│               │ Read by Vite                                   │
│               ↓                                                │
│  supabaseClient.ts                                             │
│  ┌──────────────────────────┐                                   │
│  │ Creates Supabase client  │                                   │
│  │ using these keys         │                                   │
│  └────────────┬─────────────┘                                   │
│               │                                                │
│               │ Used by                                        │
│               ↓                                                │
│  authService.ts                                                │
│  ┌──────────────────────────┐                                   │
│  │ Login/Signup/Logout      │                                   │
│  └────────────┬─────────────┘                                   │
│               │                                                │
│               │ Powers                                         │
│               ↓                                                │
│  YOUR APP                                                      │
│  ┌──────────────────────────┐                                   │
│  │ Login View               │                                   │
│  │ Register View            │                                   │
│  │ Home View                │                                   │
│  └──────────────────────────┘                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ YOUR FILE LOCATIONS                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  KEY GOES HERE:                                                │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ C:\Users\jve\Desktop\self-call-suite\               │       │
│  │ └── apps\                                           │       │
│  │     └── suite\                                      │       │
│  │         └── .env ← PUT YOUR KEYS HERE              │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
│  USED BY:                                                      │
│  ┌─────────────────────────────────────────────────────┐       │
│  │ C:\Users\jve\Desktop\self-call-suite\               │       │
│  │ └── apps\                                           │       │
│  │     └── suite\                                      │       │
│  │         └── src\                                    │       │
│  │             └── services\                           │       │
│  │                 └── supabaseClient.ts               │       │
│  │ (Reads .env and creates Supabase client)            │       │
│  └─────────────────────────────────────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ WHAT EACH KEY IS                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  VITE_SUPABASE_URL                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  What:    Your Supabase project's web address                  │
│  From:    Supabase Dashboard → Settings → API → PROJECT URL    │
│  Example: https://omvpdlghgjjcytmamxvj.supabase.co            │
│  Purpose: Tells your app WHERE to find Supabase               │
│                                                                 │
│                                                                 │
│  VITE_SUPABASE_KEY                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  What:    Your public authentication key                       │
│  From:    Supabase Dashboard → Settings → API → ANON PUBLIC    │
│  Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi... │
│  Purpose: Tells Supabase your app is authorized               │
│                                                                 │
│                                                                 │
│  VITE_ PREFIX                                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  What:    Marker that tells Vite to expose to browser         │
│  Why:     Vite only exposes VITE_ prefixed vars for security  │
│  Without: Your app won't have access to the variable          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ QUICK CHECKLIST                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ DO:                                                         │
│     □ Use ANON PUBLIC key (not SERVICE_ROLE)                   │
│     □ Keep VITE_ prefix on variable names                      │
│     □ Restart dev server after editing .env                    │
│     □ Keep .env in .gitignore                                  │
│     □ Copy keys carefully (no extra spaces)                    │
│     □ Update when key is regenerated                           │
│                                                                 │
│  ❌ DON'T:                                                      │
│     □ Forget to restart dev server                             │
│     □ Use SERVICE_ROLE key in browser                          │
│     □ Share your keys publicly                                 │
│     □ Commit .env to git                                       │
│     □ Leave extra spaces in values                             │
│     □ Mix up keys from different projects                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ COMMON MISTAKES & FIXES                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  MISTAKE 1: "Forgot to restart dev server"                     │
│  RESULT:   Changes don't take effect                           │
│  FIX:      Ctrl+C to stop, npm run dev to restart              │
│                                                                 │
│  MISTAKE 2: "Used SERVICE_ROLE key"                            │
│  RESULT:   "Invalid API key" error                             │
│  FIX:      Use ANON PUBLIC key instead                         │
│                                                                 │
│  MISTAKE 3: "Extra spaces in key"                              │
│  RESULT:   "Invalid API key" error                             │
│  FIX:      Copy carefully, check for spaces                    │
│                                                                 │
│  MISTAKE 4: ".env in wrong location"                           │
│  RESULT:   Missing Supabase env variables error                │
│  FIX:      Should be at apps/suite/.env                        │
│                                                                 │
│  MISTAKE 5: ".env file missing"                                │
│  RESULT:   Missing Supabase env variables error                │
│  FIX:      Create the file with the two variables              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ TESTING YOUR SETUP                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  YOU'RE SET UP CORRECTLY WHEN:                                 │
│                                                                 │
│  ✅ App loads without errors                                    │
│  ✅ Can navigate to login page                                  │
│  ✅ Can click "Sign Up"                                         │
│  ✅ Can fill in the form                                        │
│  ✅ Can submit without "Invalid API key"                        │
│  ✅ No error in browser console (F12)                           │
│  ✅ User created in Supabase dashboard                          │
│                                                                 │
│  IF ANY FAIL:                                                   │
│  → Check SUPABASE_TROUBLESHOOTING.md                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ WHERE TO GET HELP                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FOR QUICK UNDERSTANDING:                                      │
│  → Read: SUPABASE_WHERE_TO_PUT_KEY.md (5 min)                  │
│                                                                 │
│  FOR FINDING YOUR KEYS:                                        │
│  → Read: SUPABASE_DASHBOARD_GUIDE.md (5 min)                   │
│                                                                 │
│  FOR ERROR SOLVING:                                            │
│  → Read: SUPABASE_TROUBLESHOOTING.md (varies)                  │
│                                                                 │
│  FOR COMPLETE SETUP:                                           │
│  → Read: SUPABASE_API_KEY_SETUP.md (15 min)                    │
│                                                                 │
│  FOR QUICK LOOKUP:                                             │
│  → Read: SUPABASE_QUICK_REFERENCE.md (2 min)                   │
│                                                                 │
│  FOR NAVIGATION:                                               │
│  → Read: SUPABASE_DOCUMENTATION_INDEX.md                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 You're Ready In 3 Steps!

1. **Copy Keys** (from Supabase Dashboard → Settings → API)
2. **Paste Into** `apps/suite/.env`
3. **Restart** dev server with `npm run dev`

**Test**: Try signing up without "Invalid API key" error = ✅ Success!

---

**Questions?** Start with: `SUPABASE_WHERE_TO_PUT_KEY.md`

