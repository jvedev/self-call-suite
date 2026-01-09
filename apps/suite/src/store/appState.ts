/**
 * Valtio Application State Store
 * Centralized state management for Suite app
 */

import { proxy } from 'valtio'
import { AppState, AuthState, UserRole } from '../types'

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
}

const initialState: AppState = {
  auth: initialAuthState,
  uiState: {
    sidebarOpen: true,
    currentRoute: '/',
  },
}

export const appState = proxy(initialState)

/**
 * Actions to modify state
 */
export const appActions = {
  setAuthUser: (user: AppState['auth']['user']) => {
    appState.auth.user = user
    appState.auth.isAuthenticated = !!user
    appState.auth.loading = false
  },

  setAuthLoading: (loading: boolean) => {
    appState.auth.loading = loading
  },

  setAuthError: (error: string | null) => {
    appState.auth.error = error
  },

  logout: () => {
    appState.auth.user = null
    appState.auth.isAuthenticated = false
    appState.auth.error = null
  },

  setCurrentClub: (club: AppState['currentClub']) => {
    appState.currentClub = club
  },

  setCurrentEvent: (event: AppState['currentEvent']) => {
    appState.currentEvent = event
  },

  setCurrentTournament: (tournament: AppState['currentTournament']) => {
    appState.currentTournament = tournament
  },

  setSidebarOpen: (open: boolean) => {
    appState.uiState.sidebarOpen = open
  },

  setCurrentRoute: (route: string) => {
    appState.uiState.currentRoute = route
  },

  hasRole: (role: UserRole): boolean => {
    return appState.auth.user?.roles?.includes(role) ?? false
  },

  hasAnyRole: (roles: UserRole[]): boolean => {
    return roles.some(role => appState.auth.user?.roles?.includes(role))
  },

  hasAllRoles: (roles: UserRole[]): boolean => {
    return roles.every(role => appState.auth.user?.roles?.includes(role))
  },
}

