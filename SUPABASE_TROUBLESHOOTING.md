# 🔧 Supabase "Invalid API Key" - Troubleshooting Guide

## The Error Message

```json
{
    "message": "Invalid API key",
    "hint": "Double check your Supabase `anon` or `service_role` API key."
}
```

---

## Troubleshooting Flowchart

```
Invalid API Key Error
         ↓
    Did you see this error right away?
         ↓
    ┌─────────────────┬──────────────────┐
    ↓                 ↓
  YES               NO
    ↓                 ↓
  GO TO:           GO TO:
  "Just Getting   "Error Appeared
   Started"        Later"
```

---

## 1️⃣ Scenario: Just Getting Started

**You**: Just set up the project and trying to sign up/login

**Likely Cause**: Missing or incorrect API keys

### Check 1: .env File Exists
```bash
# Windows - Check if file exists
dir "apps\suite\.env"

# Should show:
# Volume in drive C is OS (C:)
#  Directory of C:\Users\jve\Desktop\self-call-suite\apps\suite
# 12/01/2023  10:30 AM           80 .env
```

**If file doesn't exist**:
1. Go to `apps/suite/` folder
2. Create new file called `.env`
3. Add these two lines:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

### Check 2: Values Are Correct
```bash
# Open the file and verify it contains:
VITE_SUPABASE_URL=https://omvpdlghgjjcytmamxvj.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Compare with Supabase Dashboard**:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy Project URL and compare with your .env
5. Copy Anon Public and compare with your .env

### Check 3: Dev Server Restarted
```bash
# Stop the server
Ctrl + C

# Wait for it to fully stop

# Restart
npm run dev
```

**Why**: Vite caches environment variables. Changes don't take effect until restart.

### Check 4: Correct Key Type
```
❌ Using: SERVICE_ROLE key
✅ Should use: ANON PUBLIC key

Make sure your VITE_SUPABASE_KEY starts with:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

And the "role" claim inside is "anon"
(not "service_role")
```

---

## 2️⃣ Scenario: Error Appeared Later

**You**: App was working, then suddenly "Invalid API key" error appears

**Likely Causes**: 
- Key was regenerated
- Project paused
- Key expired
- Network issue

### Check 1: Key Was Regenerated
```
Supabase sometimes regenerates keys for security
This invalidates the old key
```

**To Fix**:
1. Go to Supabase Dashboard → Settings → API
2. Check if the anon key is different from what's in your `.env`
3. If different, copy the new key
4. Update `apps/suite/.env`
5. Restart dev server

### Check 2: Project Status
```
Your Supabase project might be paused
This happens if:
- Free tier with no activity for 1 week
- Billing issue
- Manual pause
```

**To Fix**:
1. Go to https://supabase.com/dashboard
2. Check project status at the top
3. If paused, click to unpause
4. Try again

### Check 3: Check for Typos
```
Common mistakes:
❌ Extra space: "eyJ... " (space at end)
❌ Missing characters: "eyJ..." (incomplete copy)
❌ Wrong line: Copied from service_role instead of anon
```

**To Fix**:
1. Open Supabase Dashboard
2. Click [Show] next to Anon Public to see the full key
3. Delete the key in your `.env`
4. Copy it again carefully
5. Restart dev server

### Check 4: Network/Connectivity
```
If Supabase is down (rare):
- Check Supabase Status: https://status.supabase.com
- Check internet connection
- Try again in a few minutes
```

---

## 3️⃣ Scenario: Using Wrong Environment

**You**: App works on one computer/environment but not another

**Likely Cause**: Different .env files or missing .env

### Check: Environment Files

**Development**:
```
Location: apps/suite/.env
Should have: VITE_SUPABASE_URL and VITE_SUPABASE_KEY
```

**Production**:
```
Location: Deployment platform (Vercel, Netlify, etc.)
Should set: Same environment variables
```

**To Fix**:
1. Verify `apps/suite/.env` exists locally
2. Verify values are correct
3. If deploying, set same vars in deployment platform
4. Restart dev server after any changes

---

## 🔍 Deep Debugging

### Check 1: Open Browser DevTools
```
Press: F12
Go to: Console tab
Look for:
- Any red error messages
- Network errors to Supabase
- Which specific endpoint is failing
```

### Check 2: Check Network Requests
```
In DevTools:
1. Click "Network" tab
2. Try to log in / sign up
3. Look for requests to supabase URLs
4. Check the response - it might have more details
```

### Check 3: Check Vite Debug Output
```
In terminal where dev server is running:
Look for any messages about:
- "Missing environment variables"
- "VITE_SUPABASE" 
- Environment loading

The app checks for these on startup:
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}
```

### Check 4: Manually Verify .env Loading
```typescript
// Open browser console and type:
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_KEY

// Should output your values (or undefined if not loaded)
// If undefined = .env not loaded = restart dev server
```

---

## 🆘 Still Not Working?

### Collect This Info

1. **Current .env file** (without showing full key):
   ```
   VITE_SUPABASE_URL=https://[redacted].supabase.co
   VITE_SUPABASE_KEY=eyJ[redacted]...
   ```

2. **Error message from browser console**:
   ```
   Copy the exact error text
   ```

3. **Network request response** (from DevTools):
   ```
   What's the exact error from Supabase?
   ```

4. **Steps to reproduce**:
   ```
   - Open the app
   - Click [X button]
   - Fill in [Y field]
   - Click [Z button]
   - See error: ...
   ```

5. **File locations**:
   ```
   Is .env at: apps/suite/.env? [YES/NO]
   Is it tracked in git? [YES/NO]
   ```

### Common Issues Checklist

- [ ] `.env` file exists in `apps/suite/`
- [ ] `VITE_SUPABASE_URL` is correct (matches Supabase dashboard)
- [ ] `VITE_SUPABASE_KEY` is the ANON PUBLIC key
- [ ] No extra spaces in key or URL
- [ ] Dev server restarted after editing `.env`
- [ ] Not using SERVICE_ROLE key (that's secret!)
- [ ] Not using keys from a different project
- [ ] Supabase project is not paused
- [ ] No typos in variable names (VITE_ prefix is required)

---

## 📚 Quick Reference

### Files Involved

```
.env (environment variables)
  ↓ read by Vite during build
src/services/supabaseClient.ts
  ↓ imports from import.meta.env
Creates Supabase client
  ↓
authService.ts, other services
  ↓
Login/Signup pages
```

### Environment Variables

```
Name: VITE_SUPABASE_URL
Get from: Supabase Dashboard → Settings → API → "PROJECT URL"
Example: https://omvpdlghgjjcytmamxvj.supabase.co

Name: VITE_SUPABASE_KEY  
Get from: Supabase Dashboard → Settings → API → "ANON PUBLIC"
Example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

IMPORTANT: VITE_ prefix is REQUIRED
```

---

## 🎯 Step-by-Step Recovery

If nothing works, start fresh:

```
1. Delete apps/suite/.env
2. Go to Supabase Dashboard
3. Settings → API
4. Copy "PROJECT URL"
5. Copy "ANON PUBLIC" key
6. Create new file: apps/suite/.env
7. Paste:
   VITE_SUPABASE_URL=[pasted url]
   VITE_SUPABASE_KEY=[pasted key]
8. Save file
9. Stop dev server (Ctrl+C)
10. Run: npm run dev
11. Try to log in
12. Check browser console for errors
```

---

## 🚀 Success Indicators

You're set up correctly when:

✅ No "Invalid API key" error  
✅ Can click "Sign Up" button  
✅ Can fill in email/password  
✅ Can submit the form  
✅ User appears in Supabase Dashboard → Authentication  
✅ User profile appears in Supabase Dashboard → Database → profiles table  

---

## 📞 Getting Help

When asking for help, provide:
1. Error message (from browser console)
2. Your .env file structure (with key hidden)
3. What you were trying to do when error appeared
4. Steps you've already tried
5. Which troubleshooting step you're stuck on

---

## Related Docs

📄 **Full Setup Guide**: SUPABASE_API_KEY_SETUP.md  
⚡ **Quick Ref**: SUPABASE_QUICK_REFERENCE.md  
🗺️ **Dashboard Navigation**: SUPABASE_DASHBOARD_GUIDE.md  
📋 **Summary**: SUPABASE_KEY_SUMMARY.md  

