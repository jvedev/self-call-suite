# 🚀 Supabase API Key - Quick Reference

## Problem
```
❌ Invalid API key
Double check your Supabase `anon` or `service_role` API key.
```

## Solution in 3 Steps

### 1️⃣ Get Your Keys from Supabase
```
https://supabase.com/dashboard
  → Select your project
  → Settings → API
  → Copy:
     • Project URL
     • anon public key
```

### 2️⃣ Put Keys in Your .env File
**Location**: `apps/suite/.env`

**Content**:
```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_KEY=your_anon_key_here
```

### 3️⃣ Restart Dev Server
```bash
# Stop: Ctrl+C
# Restart:
npm run dev
```

---

## ✅ Important Reminders

| Do ✅ | Don't ❌ |
|------|---------|
| Use the **anon** key | Don't use **service_role** key |
| Keep `.env` in `.gitignore` | Don't commit `.env` to git |
| Restart dev server after updating | Don't forget to restart |
| Use `VITE_` prefix for variables | Don't forget the VITE_ prefix |

---

## 📍 File Locations

```
Your Project Structure:
.
├── apps/
│   └── suite/
│       ├── .env ← PUT YOUR KEYS HERE
│       ├── src/
│       │   └── services/
│       │       └── supabaseClient.ts ← This reads .env
│       └── vite.config.ts
```

---

## 🔑 What You're Looking For in Supabase Dashboard

**Settings → API tab shows:**

```
PROJECT URL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
https://xyz123abc.supabase.co


API KEYS & TOKENS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔓 anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ← USE THIS


🔐 service_role secret
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... ← DON'T USE THIS
```

---

## 🧪 Test Your Setup

After updating `.env` and restarting, try:
1. Go to login page
2. Click "Sign Up"
3. Create a test account
4. If it works → API key is correct! ✅
5. If it fails → Check the error in browser console

---

## 💭 Common Mistakes

| Mistake | Fix |
|---------|-----|
| "Forgot to restart dev server" | Stop and restart: `npm run dev` |
| "Used service_role key" | Use **anon** key instead |
| "Extra spaces in key" | Copy-paste carefully, check for spaces |
| ".env in wrong location" | Should be at `apps/suite/.env` |
| ".env file missing" | Create it with the two VITE_ variables |

---

## 🆘 If Still Getting "Invalid API Key"

1. **Verify in Supabase Dashboard**
   - Go to API settings
   - Make sure you're looking at the right project
   - Check anon key hasn't been regenerated

2. **Check Your .env File**
   - Open `apps/suite/.env`
   - Verify values match Supabase dashboard exactly
   - Check for hidden characters/spaces
   - Make sure both URL and KEY are present

3. **Restart Everything**
   - Stop dev server (Ctrl+C)
   - Delete node_modules/.vite cache (if needed)
   - Run: `npm run dev`

4. **Check Browser Console**
   - Open DevTools (F12)
   - Look for error details
   - Search for "supabase" in Network tab

---

## 📞 When to Get Help

Provide these details:
- [ ] Screenshot of Supabase API page
- [ ] Your .env file contents (with key hidden)
- [ ] Browser console error messages
- [ ] Dev server startup logs

