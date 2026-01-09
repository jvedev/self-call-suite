# Supabase Tournament Suite Deployment Guide

This guide will walk you through deploying the Tournament Suite backend and frontend, including setting up authentication with GitHub and updating your deployment.

---

## 1. Prerequisites
- Node.js and npm installed
- Supabase account ([https://supabase.com/](https://supabase.com/))
- GitHub account
- (Optional) Vercel/Netlify for frontend hosting

---

## 2. Clone the Repository
```sh
git clone <your-repo-url>
cd self-call-suite
```

---

## 3. Set Up Supabase Project
1. Go to [Supabase](https://app.supabase.com/) and create a new project.
2. Note your project URL and anon/public API key.
3. In the Supabase dashboard, go to **SQL Editor** and run the contents of `backend/supabase_schema.sql` to set up your database schema.
4. (Optional) Run `backend/setup_disciplines.sql` to populate the disciplines table.

---

## 4. Configure GitHub Authentication
1. In Supabase dashboard, go to **Authentication > Providers**.
2. Enable **GitHub**.
3. Go to [GitHub Developer Settings > OAuth Apps](https://github.com/settings/developers).
4. Click **New OAuth App**:
   - **Application name**: Your app name
   - **Homepage URL**: `https://<your-frontend-domain>` or `http://localhost:5173` for local
   - **Authorization callback URL**: `https://<your-frontend-domain>/` or `http://localhost:5173/`
5. After creating, copy the **Client ID** and **Client Secret**.
6. In Supabase, paste these into the GitHub provider settings.
7. Save changes.

---

## 5. Configure Environment Variables
Create a `.env` file in your frontend root (e.g., `apps/` or project root):
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## 6. Install Dependencies
```sh
npm install
```
Or, if using workspaces/monorepo:
```sh
npm install --workspaces
```

---

## 7. Run Locally
```sh
npm run dev
```
Or, for Vite-based frontend:
```sh
cd apps	npm run dev
```

---

## 8. Deploy Frontend
- Deploy to Vercel, Netlify, or your preferred host.
- Set the same environment variables in your host's dashboard.

---

## 9. Updating Your Deployment
To update your deployment after making changes:
1. **Pull latest code**:
   ```sh
   git pull origin main
   ```
2. **Apply database changes**:
   - Run any new SQL scripts in the Supabase SQL Editor.
3. **Redeploy frontend**:
   - Push to your hosting provider or trigger a redeploy.

---

## 10. Logging In with GitHub
- Go to your deployed frontend or `http://localhost:5173`.
- Click **Login** or **Sign in with GitHub**.
- Authorize the app in the GitHub popup.
- You will be redirected back and logged in.

---

## 11. Troubleshooting
- Check Supabase Auth settings if login fails.
- Ensure environment variables are correct.
- Check browser console and Supabase logs for errors.

---

## 12. Resources
- [Supabase Docs](https://supabase.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

---

Feel free to update this guide as your deployment process evolves!

