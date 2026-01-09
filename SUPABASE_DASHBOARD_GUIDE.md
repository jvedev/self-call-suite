# 🗺️ Supabase Dashboard Navigation Guide

## Where to Find Your API Keys - Step by Step

### Step 1: Log In to Supabase
```
Go to: https://supabase.com/dashboard
Login with your email/password
```

### Step 2: Select Your Project
```
On the left sidebar, you'll see your projects
Click on "self-call-suite" or your project name
```

### Step 3: Navigate to API Settings
```
In the left sidebar, scroll down to "Settings"
↓
Click "Settings"
↓
Look for "API" in the submenu (or direct link)
↓
Click "API"
```

### What You'll See

```
┌──────────────────────────────────────────────────────┐
│              SUPABASE DASHBOARD                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Left Sidebar:                                       │
│   • Project Settings                                │
│     - General                                       │
│     - Database                                      │
│     - API ← CLICK HERE                             │
│     - Auth                                          │
│     - Billing                                       │
│                                                      │
│ Main Content Area:                                  │
│                                                      │
│ ┌──────────────────────────────────────────────────┐│
│ │ PROJECT URL                                       ││
│ │ ────────────────────────────────────────────────┤│
│ │ https://omvpdlghgjjcytmamxvj.supabase.co       ││
│ │ [Copy button]                                    ││
│ └──────────────────────────────────────────────────┘│
│                                                      │
│ ┌──────────────────────────────────────────────────┐│
│ │ API KEYS & TOKENS                                ││
│ │ ────────────────────────────────────────────────┤│
│ │                                                  ││
│ │ 🔓 ANON PUBLIC (safe for client)                ││
│ │    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    ││
│ │    [Copy button] [Show/Hide]                     ││
│ │                                                  ││
│ │ 🔐 SERVICE_ROLE SECRET (keep private!)          ││
│ │    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    ││
│ │    [Copy button] [Show/Hide]                     ││
│ │                                                  ││
│ └──────────────────────────────────────────────────┘│
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🔑 Which Key to Copy?

### For Client-Side Apps (Like Yours)

**Use**: `ANON PUBLIC` ✅
- Safe to use in browser
- Used for authentication
- Public - okay if exposed

**Don't Use**: `SERVICE_ROLE SECRET` ❌
- Never share this
- Only for server-side
- Keep it secret!

### Your Use Case

Your app runs in the browser, so:
```
VITE_SUPABASE_URL = Copy from "PROJECT URL"
VITE_SUPABASE_KEY = Copy from "ANON PUBLIC"
```

---

## Step-by-Step Copy Process

### 1. Copy Project URL
```
┌─────────────────────────────────────────────┐
│ PROJECT URL                                 │
├─────────────────────────────────────────────┤
│ https://omvpdlghgjjcytmamxvj.supabase.co   │
│                                   [COPY] ← │
└─────────────────────────────────────────────┘

1. Click [COPY] button
2. Paste into your .env file:
   VITE_SUPABASE_URL=https://omvpdlghgjjcytmamxvj.supabase.co
```

### 2. Copy Anon Public Key
```
┌─────────────────────────────────────────────────────────────┐
│ ANON PUBLIC                                                 │
├─────────────────────────────────────────────────────────────┤
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXB...   │
│                                                    [COPY] ← │
└─────────────────────────────────────────────────────────────┘

1. Click [COPY] button (or click [Show/Hide] first if hidden)
2. Paste into your .env file:
   VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📋 Your .env File Should Look Like

After copying both values:

```dotenv
VITE_SUPABASE_URL=https://omvpdlghgjjcytmamxvj.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdnBkbGdoZ2pqY3l0bWFteHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwMDk2NzcsImV4cCI6MTk4NDU4OTY3N30.5KfDrFXlVPmXOTn7TXcELLJEkq2GzTWZKGDFiZPH_Fw
```

---

## 🔄 What If Your Key Has Changed?

Sometimes Supabase regenerates keys. You'll know this happened if:
- "Invalid API key" error suddenly appears
- You remember seeing "Key regenerated" notification

**To Fix**:
1. Go back to Supabase Dashboard → Settings → API
2. Copy the NEW anon key
3. Update it in `apps/suite/.env`
4. Restart dev server: `npm run dev`

---

## 🔔 Notifications You Might See

### "Key regenerated"
This happens when:
- You clicked "Regenerate" in the dashboard
- Someone on your team regenerated it
- Supabase security policy triggered a regeneration

**Action**: Copy the new key and update your `.env`

### "Project paused"
If your project is paused:
- Check Supabase Dashboard main page
- Unpause the project
- Keys will still work, but database won't respond

---

## 🗂️ File Paths in Your Project

```
C:\Users\jve\Desktop\self-call-suite\
├── apps\
│   └── suite\
│       └── .env ← YOUR KEYS GO HERE
│           (Currently contains: VITE_SUPABASE_URL and VITE_SUPABASE_KEY)
│
├── SUPABASE_API_KEY_SETUP.md ← Full guide
├── SUPABASE_QUICK_REFERENCE.md ← Quick reference
└── SUPABASE_KEY_SUMMARY.md ← Summary
```

---

## ✅ Verification Checklist

After copying and pasting:

- [ ] Opened `apps/suite/.env`
- [ ] Pasted VITE_SUPABASE_URL
- [ ] Pasted VITE_SUPABASE_KEY
- [ ] Both values match what's in Supabase dashboard
- [ ] No extra spaces at beginning/end of lines
- [ ] File saved
- [ ] Restarted dev server (`npm run dev`)
- [ ] No "Invalid API key" error

---

## 🚀 You're Ready When

✅ You have the URL from "PROJECT URL"  
✅ You have the key from "ANON PUBLIC"  
✅ Both are in your `apps/suite/.env` file  
✅ Dev server is running  
✅ Can see login page without errors  

---

## 📸 Still Confused?

Compare your Supabase dashboard to this template:

**In Supabase Dashboard → Settings → API:**
```
Copy THIS ─────→ VITE_SUPABASE_URL=https://xyz.supabase.co
         [PROJECT URL section]

Copy THIS ─────→ VITE_SUPABASE_KEY=eyJ...
         [ANON PUBLIC section]
```

**Into this file: `apps/suite/.env`**
```
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_KEY=eyJ...
```

---

## 🆘 Troubleshooting Quick Links

- Key expired? → Get new key from dashboard, update `.env`, restart
- Wrong key? → Make sure you copied ANON PUBLIC, not SERVICE_ROLE
- Can't find API page? → Settings → API (left sidebar)
- Key doesn't work? → Check for extra spaces, verify URL format
- Keys look different? → Different projects? → Select the right project from left sidebar

---

## 💡 Pro Tips

1. **Bookmark the API page**: `https://supabase.com/dashboard/project/[your-project-id]/settings/api`

2. **Never regenerate keys lightly**: Regenerating invalidates old keys - update all places using it

3. **Store in .gitignore**: Never commit `.env` with real keys to GitHub

4. **Use different keys per environment**: 
   - Development: One project
   - Production: Another project
   - Each with different .env files

5. **Check key expiry**: Some organizations set automatic key rotation (usually 2+ years)

