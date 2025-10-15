import html from './match-view.html?raw';
import css from './match-view.css?raw';
import sharedCss from '../../styles/index.css?raw';

export class MatchView extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${sharedCss}</style><style>${css}</style>${html}`;
  }

  connectedCallback() {
    // TODO: Populate names, scores, timer, and add event listeners for buttons
    // Example:
    // this.shadowRoot?.getElementById('red-name').textContent = ...
    // this.shadowRoot?.getElementById('blue-name').textContent = ...
  }
}

customElements.define('match-view', MatchView);
