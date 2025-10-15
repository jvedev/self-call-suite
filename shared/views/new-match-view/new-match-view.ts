import html from './new-match-view.html?raw';
import css from './new-match-view.css?raw';

export class NewMatchView extends View {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${css}</style>${html}`;
  }

  connectedCallback() {
    const form = this.shadowRoot?.getElementById('new-match-form') as HTMLFormElement;
    const backBtn = this.shadowRoot?.getElementById('back-btn');
    const errorMessage = this.shadowRoot?.getElementById('error-message');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const redFighter = (this.shadowRoot?.getElementById('red-fighter') as HTMLInputElement).value.trim();
      const blueFighter = (this.shadowRoot?.getElementById('blue-fighter') as HTMLInputElement).value.trim();
      if (!redFighter || !blueFighter) {
        this.showError('Please enter names for both fighters');
        return;
      }
      if (redFighter === blueFighter) {
        this.showError('Fighters must have different names');
        return;
      }
      // TODO: matchActions.startMatch(redFighter, blueFighter, DEFAULT_MATCH_SETTINGS);
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'match' }));
    });
    backBtn?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
    });
  }

  showError(message: string) {
    const errorElement = this.shadowRoot?.getElementById('error-message');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }
}

customElements.define('new-match-view', NewMatchView);

