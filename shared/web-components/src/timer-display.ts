import { MatchStore } from '@shared/modules';

export class TimerDisplay extends HTMLElement {
  private timeDisplay: HTMLElement;
  private interval: number | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.timeDisplay = document.createElement('div');
    this.render();
    this.startTimer();
  }

  connectedCallback() {
    this.startTimer();
  }

  disconnectedCallback() {
    this.stopTimer();
  }

  private render() {
    const styles = `
      <style>
        :host {
          display: block;
        }
        .timer {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
          font-size: 2.25rem;
          font-weight: bold;
          text-align: center;
          padding: 1rem;
          border-radius: 0.5rem;
          background-color: var(--theme-bg-secondary, #f5f5f5);
          border: 2px solid transparent;
          transition: all 250ms ease;
          cursor: pointer;
        }
        .timer--normal {
          color: var(--color-timer-normal, #171717);
        }
        .timer--last-exchange {
          color: var(--color-timer-last-exchange, #ff8c00);
          border-color: var(--color-timer-last-exchange, #ff8c00);
        }
        .timer--extend {
          color: var(--color-timer-extend, #ffd700);
          border-color: var(--color-timer-extend, #ffd700);
        }
        .timer--sudden-death {
          color: var(--color-timer-sudden-death, #dc3545);
          border-color: var(--color-timer-sudden-death, #dc3545);
          animation: pulse 1s infinite;
        }
        .timer--paused {
          color: var(--color-timer-paused, #737373);
          border-color: var(--color-timer-paused, #737373);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @media (max-width: 768px) {
          .timer {
            font-size: 1.875rem;
          }
        }
      </style>
    `;

    this.timeDisplay.className = 'timer timer--normal';
    this.timeDisplay.textContent = '03:00';
    
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = styles;
      this.shadowRoot.appendChild(this.timeDisplay);
    }

    // Add click handler for time adjustment
    this.timeDisplay.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('timer-click', {
        bubbles: true,
        detail: { action: 'adjust-time' }
      }));
    });
  }

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private updateDisplay() {
    if (!MatchStore.current) {
      this.timeDisplay.textContent = '03:00';
      this.timeDisplay.className = 'timer timer--normal';
      return;
    }

    const timeRemaining = MatchStore.current.timeRemaining;
    this.timeDisplay.textContent = this.formatTime(timeRemaining);

    // Update timer appearance based on state
    const baseClass = 'timer';
    let stateClass = 'timer--normal';

    switch (MatchStore.timer.display) {
      case 'last_exchange':
        stateClass = 'timer--last-exchange';
        break;
      case 'extend':
        stateClass = 'timer--extend';
        break;
      case 'sudden_death':
        stateClass = 'timer--sudden-death';
        break;
      case 'paused':
        stateClass = 'timer--paused';
        break;
      default:
        stateClass = 'timer--normal';
    }

    this.timeDisplay.className = `${baseClass} ${stateClass}`;
  }

  private startTimer() {
    if (this.interval) return;
    
    this.interval = window.setInterval(() => {
      this.updateDisplay();
    }, 100); // Update every 100ms for smooth display
  }

  private stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

customElements.define('timer-display', TimerDisplay);