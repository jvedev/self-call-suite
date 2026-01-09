# Suite PWA - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Setup Environment

```bash
# Navigate to suite app
cd apps/suite

# Install dependencies
npm install
```

### 2. Configure Supabase

Create/update `.env` file:
```env
VITE_SUPABASE_URL=https://omvpdlghgjjcytmamxvj.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tdnBkbGdoZ2pqY3l0bWFteHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTkwMDk2NzcsImV4cCI6MTk4NDU4OTY3N30.5KfDrFXlVPmXOTn7TXcELLJEkq2GzTWZKGDFiZPH_Fw
```

### 3. Start Development

```bash
npm run dev
```

Open browser to `http://localhost:5173`

## 🔓 Test Login Credentials

### Creating Test Users

1. Go to login page: `http://localhost:5173/login`
2. Sign up with new account or use test accounts

### Test User Roles

Once authenticated, users get these roles by default:
- New registrations: `EVENT_PARTICIPANT`
- Admins can assign additional roles via Supabase

## 📖 Key Features to Try

### For All Users
1. **Login/Register** - Authentication with Supabase
2. **Home Dashboard** - View role-based options
3. **Profile** - See your user information and roles

### For Super Admin
1. Navigate to: **Super Admin Panel** on home
2. **Overview** - See statistics
3. **Manage Clubs** - Create/edit/delete clubs
4. **Create Club** - Test full CRUD

### For Application Admin
1. Navigate to: **Admin Panel** on home
2. Manage events and system settings

### For Club Admin
1. Navigate to: **Club Management** on home
2. Manage club members and events

### For Event Director
1. Navigate to: **Event Director** on home
2. Manage tournaments and pools

### For Table Official
1. Navigate to: **Table Official** on home
2. Record fight scores

### For Participants
1. Navigate to: **Tournaments** on home
2. View available events

## 📱 Testing as PWA

### Install on Android
1. Open app in Chrome
2. Tap menu (3 dots) → Install app

### Install on iOS
1. Open app in Safari
2. Tap share → Add to Home Screen

### Test Offline
1. Open app normally
2. Go to DevTools → Network → Offline
3. Navigate cached pages - they still work!

## 🔧 Development Commands

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📚 File Structure Quick Reference

```
src/
├── main.ts                    ← App entry & routing
├── types/                     ← TypeScript interfaces
├── services/                  ← Auth, data, authorization
├── store/                     ← Valtio state management
├── router/                    ← Navigation & permissions
├── views/                     ← Page components
└── styles/                    ← Shared CSS tokens

Each view has:
├── view-name.ts              ← Component class
├── view-name.html            ← Template
└── view-name.css             ← Styles (with nesting)
```

## 🛠️ Common Tasks

### Add New View Component

1. Create folder: `src/views/my-view/`
2. Create three files:
   - `my-view.ts` (copy from another view)
   - `my-view.html` (template)
   - `my-view.css` (styles)
3. Import in `src/main.ts`
4. Add route in `src/router/suiteRouter.ts`

### Add CRUD Operation

1. Add/update methods in `src/services/dataService.ts`
2. Use in your component:
   ```typescript
   import { clubService } from '../../services/dataService'
   const { data, error } = await clubService.getAll()
   ```

### Check User Permissions

```typescript
import { appState } from '../../store/appState'
import { snapshot } from 'valtio'

const state = snapshot(appState)
const hasRole = state.auth.user?.roles.includes(UserRole.SUPER_ADMIN)
```

### Navigate Programmatically

```typescript
import { suiteRouter } from '../../router/suiteRouter'

suiteRouter.navigate('/admin/super', userRoles)
```

## 🐛 Debugging Tips

### Enable Debug Logging
1. Open browser DevTools (F12)
2. Check Console tab for messages
3. Look at Network tab for API calls

### Check Authentication State
```javascript
// In browser console:
console.log(sessionStorage)  // Session tokens
localStorage.getItem('supabase.auth.token')
```

### Inspect Component State
```javascript
// Valtio state is reactive
appState.auth  // Check current auth state
```

## ❓ FAQ

**Q: Can't login?**
A: Check `.env` has correct Supabase credentials. Try registering new account first.

**Q: Getting "Access Denied"?**
A: Check your user has required role. Visit `/profile` to see your roles.

**Q: App not working offline?**
A: Service worker may need registration. Check DevTools → Application → Service Workers.

**Q: Styles not loading?**
A: Clear browser cache or do hard refresh (Ctrl+Shift+R on Windows).

## 📞 Support

Need help? Check:
1. `/README.md` in this folder for detailed docs
2. Console errors (F12)
3. Supabase dashboard for data issues

---

**Happy coding! 🎉**

