import html from './match-settings-view.html?raw';
import css from './match-settings-view.css?raw';

export class MatchSettingsView extends View {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${css}</style>${html}`;
  }

  connectedCallback() {
    // TODO: Add event listeners for form actions and populate with settings
  }
}

customElements.define('match-settings-view', MatchSettingsView);
