import html from './match-settings-view.html?raw';
import css from './match-settings-view.css?raw';
import sharedCss from '../../styles/index.css?raw';

export class MatchSettingsView extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${sharedCss}</style><style>${css}</style>${html}`;
  }

  connectedCallback() {
    // TODO: Add event listeners for form actions and populate with settings
  }
}

customElements.define('match-settings-view', MatchSettingsView);
