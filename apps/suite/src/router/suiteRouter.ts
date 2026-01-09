/**
 * Suite Router
 * Extends AppRouter with role-based route protection
 */

import { appActions } from '../store/appState'
import { UserRole, Permission } from '../types'
import { authorizationService } from '../services/authorizationService'

export interface SuiteRoute {
  path: string
  component: string
  requiredRole?: UserRole | UserRole[]
  requiredPermission?: Permission | Permission[]
  public?: boolean
}

const routes: SuiteRoute[] = [
  // Public routes
  { path: '/', component: 'login-view', public: true },
  { path: '/login', component: 'login-view', public: true },
  { path: '/register', component: 'register-view', public: true },

  // Home route
  { path: '/home', component: 'home-view', requiredRole: Object.values(UserRole) },

  // Super Admin routes
  {
    path: '/admin/super',
    component: 'super-admin-dashboard',
    requiredRole: UserRole.SUPER_ADMIN,
    requiredPermission: Permission.MANAGE_ADMINS,
  },
  {
    path: '/admin/super/clubs',
    component: 'clubs-management',
    requiredRole: UserRole.SUPER_ADMIN,
  },
  {
    path: '/admin/super/clubs/new',
    component: 'club-form',
    requiredRole: UserRole.SUPER_ADMIN,
  },
  {
    path: '/admin/super/clubs/:id/edit',
    component: 'club-form',
    requiredRole: UserRole.SUPER_ADMIN,
  },

  // Application Admin routes
  {
    path: '/admin/app',
    component: 'app-admin-dashboard',
    requiredRole: UserRole.APPLICATION_ADMIN,
  },
  {
    path: '/admin/app/events',
    component: 'events-list',
    requiredRole: UserRole.APPLICATION_ADMIN,
  },
  {
    path: '/admin/app/users',
    component: 'users-management',
    requiredRole: UserRole.APPLICATION_ADMIN,
  },

  // Club Admin routes
  {
    path: '/club',
    component: 'club-admin-dashboard',
    requiredRole: UserRole.CLUB_ADMIN,
  },
  {
    path: '/club/events',
    component: 'club-events-list',
    requiredRole: UserRole.CLUB_ADMIN,
  },
  {
    path: '/club/members',
    component: 'club-members-list',
    requiredRole: UserRole.CLUB_ADMIN,
  },

  // Event Director routes
  {
    path: '/event',
    component: 'event-director-dashboard',
    requiredRole: UserRole.EVENT_DIRECTOR,
  },
  {
    path: '/event/:id/tournaments',
    component: 'tournaments-list',
    requiredRole: UserRole.EVENT_DIRECTOR,
  },
  {
    path: '/event/:id/pools',
    component: 'pools-management',
    requiredRole: UserRole.EVENT_DIRECTOR,
  },

  // Table Official routes
  {
    path: '/table',
    component: 'table-official-dashboard',
    requiredRole: UserRole.TABLE_OFFICIAL,
  },
  {
    path: '/table/fights',
    component: 'fights-management',
    requiredRole: UserRole.TABLE_OFFICIAL,
  },

  // Participant routes
  {
    path: '/participant',
    component: 'event-participant-dashboard',
    requiredRole: UserRole.EVENT_PARTICIPANT,
  },
  {
    path: '/participant/tournaments',
    component: 'participant-tournaments',
    requiredRole: UserRole.EVENT_PARTICIPANT,
  },

  // Profile routes (all authenticated users)
  {
    path: '/profile',
    component: 'profile-view',
    requiredRole: Object.values(UserRole),
  },
]

class SuiteRouter {
  /**
   * Check if current user can access a route
   */
  canAccessRoute(route: SuiteRoute, userRoles: UserRole[] = []): boolean {
    // Public routes
    if (route.public) {
      return true
    }

    // Authenticated routes
    if (!userRoles || userRoles.length === 0) {
      return false
    }

    // Check required role
    if (route.requiredRole) {
      const requiredRoles = Array.isArray(route.requiredRole) ? route.requiredRole : [route.requiredRole]
      const hasRole = requiredRoles.some(role => userRoles.includes(role))
      if (!hasRole) return false
    }

    // Check required permission
    if (route.requiredPermission) {
      const requiredPermissions = Array.isArray(route.requiredPermission)
        ? route.requiredPermission
        : [route.requiredPermission]
      const hasPermission = authorizationService.hasAllPermissions(userRoles, requiredPermissions)
      if (!hasPermission) return false
    }

    return true
  }

  /**
   * Navigate to a route if user has access
   */
  navigate(path: string, userRoles: UserRole[] = []): boolean {
    const route = this.getRoute(path)

    if (!route) {
      console.warn(`Route not found: ${path}`)
      return false
    }

    if (!this.canAccessRoute(route, userRoles)) {
      console.warn(`Access denied to route: ${path}`)
      return false
    }

    // Update app state and navigate
    appActions.setCurrentRoute(path)
    window.history.pushState(null, '', path)

    return true
  }

  /**
   * Get route by path
   */
  private getRoute(path: string): SuiteRoute | undefined {
    return routes.find(route => route.path === path)
  }

  /**
   * Get all accessible routes for user
   */
  getAccessibleRoutes(userRoles: UserRole[]): SuiteRoute[] {
    return routes.filter(route => this.canAccessRoute(route, userRoles))
  }

  /**
   * Get routes by role
   */
  getRoutesByRole(role: UserRole): SuiteRoute[] {
    return routes.filter(route => {
      if (route.public) return true
      if (!route.requiredRole) return false

      const requiredRoles = Array.isArray(route.requiredRole) ? route.requiredRole : [route.requiredRole]
      return requiredRoles.includes(role)
    })
  }
}

export const suiteRouter = new SuiteRouter()
export { routes }

