import html from './event-director-dashboard.html?raw'
import css from './event-director-dashboard.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'

export class EventDirectorDashboard extends BaseComponent {
  constructor() {
    super()
    this.render(css, html)
  }

  connectedCallback() {
    this.attachEventListeners()
  }

  private attachEventListeners() {
    const backBtn = this.queryRoot<HTMLAnchorElement>('.back-btn')
    backBtn?.addEventListener('click', () => {
      window.location.pathname = '/home'
    }, { signal: this.signal })
  }




}

customElements.define('event-director-dashboard', EventDirectorDashboard)

