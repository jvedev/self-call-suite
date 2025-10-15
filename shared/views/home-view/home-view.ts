import html from './home-view.html?raw';
import css from './home-view.css?raw';
import sharedCss from '../../styles/index.css?raw';

export class HomeView extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${sharedCss}</style><style>${css}</style>${html}`;
  }

  connectedCallback() {
    this.shadowRoot?.getElementById('new-match-btn')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'new-match' }));
    });
    this.shadowRoot?.getElementById('match-settings-btn')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'match-settings' }));
    });
    this.shadowRoot?.getElementById('past-matches-btn')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'past-matches' }));
    });
  }
}

customElements.define('home-view', HomeView);
