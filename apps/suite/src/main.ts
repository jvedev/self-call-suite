/**
 * Suite App Main Entry Point
 */

import { appState, appActions } from './store/appState'
import { authService } from './services/authService'
import { suiteRouter } from './router/suiteRouter'
import sharedcss from './styles/shared.css?raw'
import { snapshot } from 'valtio'

// Import all view components
import './views/login-view/login-view'
import './views/register-view/register-view'
import './views/home-view/home-view'
import './views/super-admin-dashboard/super-admin-dashboard'
import './views/app-admin-dashboard/app-admin-dashboard'
import './views/club-admin-dashboard/club-admin-dashboard'
import './views/event-director-dashboard/event-director-dashboard'
import './views/table-official-dashboard/table-official-dashboard'
import './views/event-participant-dashboard/event-participant-dashboard'
import './views/profile-view/profile-view'

class SuiteApp extends HTMLElement {
  private styleSheet: CSSStyleSheet

  constructor() {
    super()
    const shadowRoot = this.attachShadow({ mode: 'open' })

    this.styleSheet = new CSSStyleSheet()
    this.styleSheet.replaceSync(sharedcss)
    shadowRoot.adoptedStyleSheets = [this.styleSheet]

    shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100vh;
        }
        
        #app-outlet {
          width: 100%;
          height: 100%;
        }
      </style>
      <div id="app-outlet"></div>
    `
  }

  async connectedCallback() {
    this.setupAuthStateListener()
    await this.initializeApp()
    this.setupRouting()
  }

  /**
   * Setup authentication state listener
   */
  private setupAuthStateListener() {
    authService.onAuthStateChange((user) => {
      appActions.setAuthUser(user)
      this.navigate()
    })
  }

  /**
   * Initialize the app
   */
  private async initializeApp() {
    appActions.setAuthLoading(true)

    // Check if user is already logged in
    const session = await authService.getCurrentSession()
    if (session?.user) {
      const profile = await authService.getUserProfile(session.user.id)
      appActions.setAuthUser(profile)
    } else {
      appActions.setAuthUser(null)
    }

    appActions.setAuthLoading(false)
  }

  /**
   * Setup routing
   */
  private setupRouting() {
    window.addEventListener('popstate', () => this.navigate())
    this.navigate()
  }

  /**
   * Navigate to current path
   */
  private navigate() {
    const path = window.location.pathname
    const state = snapshot(appState)
    const userRoles = state.auth.user?.roles || []
    const isAuthenticated = state.auth.isAuthenticated

    // Redirect unauthenticated users to login
    if (!isAuthenticated && path !== '/login' && path !== '/register' && path !== '/') {
      window.history.replaceState(null, '', '/login')
      this.renderView('login-view')
      return
    }

    // Redirect authenticated users away from login/register
    if (isAuthenticated && (path === '/login' || path === '/register' || path === '/')) {
      window.history.replaceState(null, '', '/home')
      this.renderView('home-view')
      return
    }

    // Check permission for protected routes
    const route = suiteRouter['getRoute']?.(path) as any
    if (route && !suiteRouter.canAccessRoute(route, userRoles)) {
      window.history.replaceState(null, '', '/home')
      this.renderView('home-view')
      return
    }

    this.renderViewByPath(path)
  }

  /**
   * Render view by path
   */
  private renderViewByPath(path: string) {
    const componentMap: Record<string, string> = {
      '/': 'login-view',
      '/login': 'login-view',
      '/register': 'register-view',
      '/home': 'home-view',
      '/admin/super': 'super-admin-dashboard',
      '/admin/app': 'app-admin-dashboard',
      '/club': 'club-admin-dashboard',
      '/event': 'event-director-dashboard',
      '/table': 'table-official-dashboard',
      '/participant': 'event-participant-dashboard',
      '/profile': 'profile-view',
    }

    const component = componentMap[path] || 'login-view'
    this.renderView(component)
  }

  /**
   * Render a specific view component
   */
  private renderView(componentName: string) {
    const outlet = this.shadowRoot?.querySelector('#app-outlet')
    if (!outlet) return

    // Clear existing content
    outlet.innerHTML = ''

    // Create and append the component
    const component = document.createElement(componentName)
    outlet.appendChild(component)
  }
}

customElements.define('suite-app', SuiteApp)

// Mount the app
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('suite-app')
  if (!app) {
    const appElement = document.createElement('suite-app')
    document.body.appendChild(appElement)
  }
})

