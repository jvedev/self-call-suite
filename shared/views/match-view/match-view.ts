import html from './match-view.html?raw';
import css from './match-view.css?raw';

export class MatchView extends View {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${css}</style>${html}`;
  }

  connectedCallback() {
    // TODO: Populate names, scores, timer, and add event listeners for buttons
    // Example:
    // this.shadowRoot?.getElementById('red-name').textContent = ...
    // this.shadowRoot?.getElementById('blue-name').textContent = ...
  }
}

customElements.define('match-view', MatchView);
