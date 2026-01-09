import html from './event-participant-dashboard.html?raw'
import css from './event-participant-dashboard.css?raw'
import { BaseComponent } from '@shared/web-components/src/base-component/base-component'

export class EventParticipantDashboard extends BaseComponent {
  constructor() {
    super()
    this.render(css, html)
  }
}

customElements.define('event-participant-dashboard', EventParticipantDashboard)
