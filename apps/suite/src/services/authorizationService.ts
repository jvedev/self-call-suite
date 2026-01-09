/**
 * Authorization Service
 * Permission checking and role-based access control
 */

import { UserRole, Permission } from '../types'

/**
 * Permission matrix - defines which permissions each role has
 */
const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.SUPER_ADMIN]: [
    // Super Admin has all permissions
    ...Object.values(Permission),
  ],

  [UserRole.APPLICATION_ADMIN]: [
    Permission.CREATE_CLUBS,
    Permission.EDIT_CLUBS,
    Permission.MANAGE_ADMINS,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.MANAGE_VENUES,
    Permission.MANAGE_USERS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_EVENTS,
  ],

  [UserRole.CLUB_ADMIN]: [
    Permission.MANAGE_CLUB_PROFILE,
    Permission.MANAGE_CLUB_VENUES,
    Permission.MANAGE_CLUB_MEMBERS,
    Permission.CREATE_CLUB_EVENTS,
    Permission.EDIT_CLUB_EVENTS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_EVENTS,
  ],

  [UserRole.EVENT_DIRECTOR]: [
    Permission.MANAGE_EVENT_DATA,
    Permission.ASSIGN_EVENT_DIRECTORS,
    Permission.ASSIGN_TABLE_OFFICIALS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_EVENTS,
  ],

  [UserRole.TABLE_OFFICIAL]: [
    Permission.MANAGE_FIGHT_DATA,
    Permission.UPDATE_SCORES,
    Permission.RECORD_WARNINGS,
    Permission.VIEW_PROFILE,
    Permission.VIEW_EVENTS,
  ],

  [UserRole.EVENT_PARTICIPANT]: [
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
    Permission.VIEW_EVENTS,
    Permission.REGISTER_EVENTS,
  ],
}

class AuthorizationService {
  /**
   * Check if a user with given roles has a specific permission
   */
  hasPermission(userRoles: UserRole[], permission: Permission): boolean {
    if (!userRoles || userRoles.length === 0) {
      return false
    }

    return userRoles.some(role => {
      const permissions = rolePermissions[role] || []
      return permissions.includes(permission)
    })
  }

  /**
   * Check if a user with given roles has any of the specified permissions
   */
  hasAnyPermission(userRoles: UserRole[], permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(userRoles, permission))
  }

  /**
   * Check if a user with given roles has all of the specified permissions
   */
  hasAllPermissions(userRoles: UserRole[], permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(userRoles, permission))
  }

  /**
   * Check if a user has a specific role
   */
  hasRole(userRoles: UserRole[], role: UserRole): boolean {
    return userRoles?.includes(role) ?? false
  }

  /**
   * Get all permissions for given roles
   */
  getPermissionsForRoles(roles: UserRole[]): Permission[] {
    const permissions = new Set<Permission>()
    roles.forEach(role => {
      const rolePerms = rolePermissions[role] || []
      rolePerms.forEach(perm => permissions.add(perm))
    })
    return Array.from(permissions)
  }

  /**
   * Get role hierarchy level for sorting/comparison
   * Higher number = more powerful role
   */
  getRoleHierarchy(role: UserRole): number {
    const hierarchy: Record<UserRole, number> = {
      [UserRole.SUPER_ADMIN]: 6,
      [UserRole.APPLICATION_ADMIN]: 5,
      [UserRole.CLUB_ADMIN]: 4,
      [UserRole.EVENT_DIRECTOR]: 3,
      [UserRole.TABLE_OFFICIAL]: 2,
      [UserRole.EVENT_PARTICIPANT]: 1,
    }
    return hierarchy[role] || 0
  }

  /**
   * Check if a user can manage another user
   * Users can manage users with lower hierarchy
   */
  canManageUser(userRoles: UserRole[], targetRoles: UserRole[]): boolean {
    const userMaxHierarchy = Math.max(
      ...userRoles.map(r => this.getRoleHierarchy(r)),
      0
    )
    const targetMaxHierarchy = Math.max(
      ...targetRoles.map(r => this.getRoleHierarchy(r)),
      0
    )

    return userMaxHierarchy > targetMaxHierarchy
  }

  /**
   * Get human-readable role name
   */
  getRoleDisplayName(role: UserRole): string {
    const names: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: 'Super Admin',
      [UserRole.APPLICATION_ADMIN]: 'Application Admin',
      [UserRole.CLUB_ADMIN]: 'Club Admin',
      [UserRole.EVENT_DIRECTOR]: 'Event Director',
      [UserRole.TABLE_OFFICIAL]: 'Table Official',
      [UserRole.EVENT_PARTICIPANT]: 'Event Participant',
    }
    return names[role] || 'Unknown'
  }

  /**
   * Get role color for UI
   */
  getRoleColor(role: UserRole): string {
    const colors: Record<UserRole, string> = {
      [UserRole.SUPER_ADMIN]: '#dc2626',
      [UserRole.APPLICATION_ADMIN]: '#ea580c',
      [UserRole.CLUB_ADMIN]: '#f59e0b',
      [UserRole.EVENT_DIRECTOR]: '#3b82f6',
      [UserRole.TABLE_OFFICIAL]: '#06b6d4',
      [UserRole.EVENT_PARTICIPANT]: '#10b981',
    }
    return colors[role] || '#6b7280'
  }
}

export const authorizationService = new AuthorizationService()

