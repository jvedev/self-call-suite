import html from './app-admin-dashboard.html?raw'
import css from './app-admin-dashboard.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'
import { eventService } from '../../services/dataService'
import { Event } from '../../types'

export class AppAdminDashboard extends BaseComponent {
  private events: Event[] = []

  constructor() {
    super()
    this.render(css, html)
  }

  async connectedCallback() {
    await this.loadEvents()
    this.attachEventListeners()
  }

  private async loadEvents() {
    const { data } = await eventService.getAllEvents()
    this.events = data
      console.log(this.events)
  }

  private attachEventListeners() {
    const backBtn = this.queryRoot<HTMLAnchorElement>('.back-btn')
    backBtn?.addEventListener('click', () => {
      window.location.pathname = '/home'
    }, { signal: this.signal })
  }


}

customElements.define('app-admin-dashboard', AppAdminDashboard)

