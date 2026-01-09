import html from './table-official-dashboard.html?raw'
import css from './table-official-dashboard.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'

export class TableOfficialDashboard extends BaseComponent {
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

customElements.define('table-official-dashboard', TableOfficialDashboard)

