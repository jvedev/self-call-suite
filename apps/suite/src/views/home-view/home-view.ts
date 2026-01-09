import html from './home-view.html?raw'
import css from './home-view.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'
import { appState, appActions } from '../../store/appState'
import { authService } from '../../services/authService'
import { suiteRouter } from '../../router/suiteRouter'
import { UserRole } from '../../types'
import { snapshot } from 'valtio'

interface NavTile {
  title: string
  description: string
  icon: string
  path: string
  color: string
  role: UserRole
}

export class HomeView extends BaseComponent {
  private navigationTiles: NavTile[] = [
    {
      title: 'Super Admin Panel',
      description: 'Manage clubs and administrators',
      icon: '👑',
      path: '/admin/super',
      color: 'var(--color-super-admin)',
      role: UserRole.SUPER_ADMIN,
    },
    {
      title: 'Admin Panel',
      description: 'Manage events and users',
      icon: '⚙️',
      path: '/admin/app',
      color: 'var(--color-app-admin)',
      role: UserRole.APPLICATION_ADMIN,
    },
    {
      title: 'Club Management',
      description: 'Manage your club',
      icon: '🏛️',
      path: '/club',
      color: 'var(--color-club-admin)',
      role: UserRole.CLUB_ADMIN,
    },
    {
      title: 'Event Director',
      description: 'Manage tournaments and pools',
      icon: '📋',
      path: '/event',
      color: 'var(--color-event-director)',
      role: UserRole.EVENT_DIRECTOR,
    },
    {
      title: 'Table Official',
      description: 'Record fight scores and results',
      icon: '📊',
      path: '/table',
      color: 'var(--color-table-official)',
      role: UserRole.TABLE_OFFICIAL,
    },
    {
      title: 'Tournaments',
      description: 'View and register for events',
      icon: '🎯',
      path: '/participant',
      color: 'var(--color-participant)',
      role: UserRole.EVENT_PARTICIPANT,
    },
  ]

  constructor() {
    super()
    this.render(css, html)
  }

  connectedCallback() {
    this.renderNavigation()
    this.attachEventListeners()
  }

  private renderNavigation() {
    const state = snapshot(appState)
    const userRoles = state.auth.user?.roles || []

    // Filter tiles based on user roles
    const accessibleTiles = this.navigationTiles.filter(tile =>
      userRoles.includes(tile.role)
    )

    const navGrid = this.queryRoot<HTMLDivElement>('.nav-grid')
    navGrid.innerHTML = ''

    accessibleTiles.forEach(tile => {
      const tileElement = document.createElement('div')
      tileElement.className = 'nav-tile'
      tileElement.style.borderTopColor = tile.color
      tileElement.innerHTML = `
        <div class="tile-icon">${tile.icon}</div>
        <h3>${tile.title}</h3>
        <p>${tile.description}</p>
      `
      tileElement.addEventListener('click', () => {
        suiteRouter.navigate(tile.path, [...userRoles])
      }, { signal: this.signal })

      navGrid.appendChild(tileElement)
    })
  }

  private attachEventListeners() {
    const logoutBtn = this.queryRoot<HTMLButtonElement>('.logout-btn')
    const profileBtn = this.queryRoot<HTMLButtonElement>('.profile-btn')

    logoutBtn.addEventListener('click', async () => {
      await this.handleLogout()
    }, { signal: this.signal })

    profileBtn.addEventListener('click', () => {
      suiteRouter.navigate('/profile')
    }, { signal: this.signal })
  }

  private async handleLogout() {
    const { error } = await authService.logout()

    if (error) {
      console.error('Logout error:', error)
      return
    }

    appActions.logout()
    suiteRouter.navigate('/login')
  }


}

customElements.define('home-view', HomeView)

