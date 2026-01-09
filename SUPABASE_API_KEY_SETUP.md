# Supabase API Key Setup Guide

## 🔑 The Error You're Seeing

```
{
    "message": "Invalid API key",
    "hint": "Double check your Supabase `anon` or `service_role` API key."
}
```

This error means your application is trying to connect to Supabase but either:
1. The API key is missing
2. The API key is incorrect or expired
3. The API key is not in the right location in your project

---

## 📍 Where to Find Your Supabase API Key

### Step 1: Go to Supabase Dashboard
1. Visit https://supabase.com/dashboard
2. Log in with your account
3. Select your project (or create one if you haven't)

### Step 2: Find Your API Keys
1. In the left sidebar, click **Settings**
2. Click **API** (under Project Settings)
3. You'll see two important keys:
   - **anon (public)** - For client-side authentication
   - **service_role (secret)** - For server-side operations (KEEP SECRET!)

### Step 3: Copy Your Keys
- **Project URL**: Copy the value from "Project URL"
- **Anon Key**: Copy the value from "anon public" 

---

## 📁 Where to Put the Key in Your Application

Your project uses environment variables. You need to create/update a `.env` file.

### Current Configuration Location
```
apps/suite/.env
```

### Current Content (as of your setup)
```dotenv
VITE_SUPABASE_URL=https://omvpdlghgjjcytmamxvj.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### What These Variables Mean
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_KEY` - Your Supabase anon (public) API key

> **Note**: `VITE_` prefix is required for Vite to expose these variables to the browser

---

## 🔧 How to Update Your API Key

### Option 1: Update Existing .env File
1. Open `apps/suite/.env`
2. Replace the values:
```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your_anon_key_here
```

### Option 2: Create .env File (if it doesn't exist)
Create a new file at `apps/suite/.env` with:
```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your_anon_key_here
```

---

## 🔍 How Your Application Uses These Keys

### In Your Code:
**File**: `apps/suite/src/services/supabaseClient.ts`
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
```

This:
1. Reads the environment variables from `.env`
2. Creates a Supabase client
3. Makes it available to all services (authService, etc.)

---

## 🚀 Step-by-Step Setup Instructions

### 1. Get Your Credentials from Supabase

```
Supabase Dashboard 
  → Settings 
  → API 
  → Copy "Project URL" and "anon public" key
```

### 2. Update Your .env File

Open `apps/suite/.env` and paste:
```dotenv
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_KEY=your-actual-anon-key-here
```

### 3. Restart Your Dev Server

After changing `.env`, you must restart Vite:
```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. Test the Connection

Try logging in or signing up. If you still get "Invalid API key":
- Double-check you copied the key correctly (no extra spaces)
- Make sure you're using the **anon** key, not the **service_role** key
- Verify the project URL is correct
- Check that your `.env` file is in the right location: `apps/suite/.env`

---

## ⚠️ Important Security Notes

### DO's ✅
- ✅ Use the **anon (public)** key in your `.env` file (it's meant to be public)
- ✅ Keep `.env` file in `.gitignore` (don't commit it)
- ✅ The `VITE_` prefix is necessary for Vite

### DON'Ts ❌
- ❌ Never use the **service_role** key in client-side code
- ❌ Never commit `.env` file with real keys to git
- ❌ Never share your Supabase project keys publicly
- ❌ Don't add keys to `.gitignore` - the file itself should be ignored

---

## 🐛 Troubleshooting

### Issue: "Missing Supabase environment variables"
**Cause**: `.env` file not found or variables not set
**Solution**: Create `apps/suite/.env` with correct values

### Issue: "Invalid API key"
**Cause**: Wrong key or format
**Solution**: 
- Double-check you copied from Supabase dashboard
- Verify you're using the **anon** key, not **service_role**
- Check for extra spaces in the key
- Restart dev server after updating `.env`

### Issue: Changes to .env not taking effect
**Cause**: Vite caches environment variables
**Solution**: Restart your dev server with `Ctrl+C` and `npm run dev`

### Issue: Key works locally but not in production
**Cause**: Environment variables not set in deployment
**Solution**: Set the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` in your deployment platform (Vercel, Netlify, etc.)

---

## 📚 Your Current Setup

### Location
```
C:\Users\jve\Desktop\self-call-suite\
  apps/
    suite/
      .env ← Your config file is here
      src/
        services/
          supabaseClient.ts ← This file reads .env
          authService.ts ← Uses supabaseClient
```

### Usage in Services
- **authService**: Uses supabase for login, signup, logout
- **Other services**: Import `supabase` from supabaseClient

---

## ✅ Verification Checklist

After setting up, verify:
- [ ] You have a Supabase account and project
- [ ] `apps/suite/.env` file exists
- [ ] `VITE_SUPABASE_URL` is set correctly
- [ ] `VITE_SUPABASE_KEY` is set to the **anon** key (not service_role)
- [ ] Dev server has been restarted since updating `.env`
- [ ] `.env` is in `.gitignore`
- [ ] No extra spaces in the keys
- [ ] Can successfully sign up or log in

---

## 💡 Next Steps

Once API keys are configured:
1. Your auth service should work
2. You can test login/signup pages
3. User profiles will be stored in Supabase
4. All role-based access control will function

If you still have issues, check:
1. Supabase RLS (Row Level Security) policies are configured
2. Database tables exist (profiles, etc.)
3. Check Supabase dashboard → Database → Logs for detailed errors

