import { BaseView } from '@shared/views';
import { MatchStore, addScore, addWarning, pauseMatch, resumeMatch } from '@shared/modules/state';

export class MatchView extends BaseView {
  private timerElement!: HTMLElement;
  private redScoreElement!: HTMLElement;
  private blueScoreElement!: HTMLElement;
  private pauseResumeBtn!: HTMLButtonElement;
  private gameLogElement!: HTMLElement;

  render() {
    this.clear();

    if (!MatchStore.current) {
      // Redirect to home if no active match
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    const match = MatchStore.current;

    // Header with fighter names
    const header = this.createElement('header', 'match-header');
    const redFighter = this.createElement('div', 'fighter-name fighter-name--red', match.redFighter.name);
    const vs = this.createElement('div', 'vs-text', 'VS');
    const blueFighter = this.createElement('div', 'fighter-name fighter-name--blue', match.blueFighter.name);
    
    header.appendChild(redFighter);
    header.appendChild(vs);
    header.appendChild(blueFighter);

    // Timer display (using web component)
    this.timerElement = document.createElement('timer-display');
    this.timerElement.classList.add('match-timer');

    // Score display
    const scoreContainer = this.createElement('div', 'score-container');
    
    this.redScoreElement = this.createElement('div', 'score score--red', match.redScore.toString());
    this.blueScoreElement = this.createElement('div', 'score score--blue', match.blueScore.toString());
    
    scoreContainer.appendChild(this.redScoreElement);
    scoreContainer.appendChild(this.blueScoreElement);

    // Control buttons
    const controls = this.createElement('div', 'match-controls');
    
    const hitBtn = this.createButton('Hit', 'btn btn--primary btn--lg', () => {
      // This would open hit selection modal in a real implementation
      this.showHitModal();
    });
    
    const warningBtn = this.createButton('Warning', 'btn btn--lg', () => {
      this.showWarningModal();
    });
    
    this.pauseResumeBtn = this.createButton(
      match.isPaused ? 'Resume' : 'Pause', 
      'btn btn--lg',
      () => this.togglePause()
    );
    
    const endMatchBtn = this.createButton('End Match', 'btn btn--red', () => {
      if (confirm('Are you sure you want to end this match?')) {
        window.history.pushState(null, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    });

    controls.appendChild(hitBtn);
    controls.appendChild(warningBtn);
    controls.appendChild(this.pauseResumeBtn);
    controls.appendChild(endMatchBtn);

    // Game log (last 5 events)
    this.gameLogElement = this.createElement('div', 'game-log');
    this.updateGameLog();

    this.container.appendChild(header);
    this.container.appendChild(this.timerElement);
    this.container.appendChild(scoreContainer);
    this.container.appendChild(controls);
    this.container.appendChild(this.gameLogElement);

    // Add custom styles
    this.addMatchStyles();

    this.isRendered = true;
  }

  destroy() {
    // Remove custom styles
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
      if (style.textContent?.includes('match-header')) {
        style.remove();
      }
    });
    
    this.clear();
    this.isRendered = false;
  }

  private togglePause() {
    if (!MatchStore.current) return;

    if (MatchStore.current.isPaused) {
      resumeMatch();
      this.pauseResumeBtn.textContent = 'Pause';
    } else {
      pauseMatch();
      this.pauseResumeBtn.textContent = 'Resume';
    }
  }

  private showHitModal() {
    // Simple implementation - in real app this would be a proper modal
    const fighter = prompt('Who scored? (red/blue)');
    if (fighter === 'red' || fighter === 'blue') {
      const points = parseInt(prompt('Points scored:') || '0');
      if (points > 0) {
        addScore(fighter, points);
        this.updateScores();
        this.updateGameLog();
      }
    }
  }

  private showWarningModal() {
    const fighter = prompt('Warning for whom? (red/blue)');
    if (fighter === 'red' || fighter === 'blue') {
      const warning = prompt('Warning type:');
      if (warning) {
        addWarning(fighter, warning);
        this.updateGameLog();
      }
    }
  }

  private updateScores() {
    if (!MatchStore.current) return;
    
    this.redScoreElement.textContent = MatchStore.current.redScore.toString();
    this.blueScoreElement.textContent = MatchStore.current.blueScore.toString();
  }

  private updateGameLog() {
    if (!MatchStore.current) return;

    this.gameLogElement.innerHTML = '<h3>Recent Events</h3>';
    
    const recentEvents = MatchStore.current.events.slice(-5).reverse();
    if (recentEvents.length === 0) {
      const noEvents = this.createElement('p', 'no-events', 'No events yet');
      this.gameLogElement.appendChild(noEvents);
      return;
    }

    const eventsList = this.createElement('ul', 'events-list');
    recentEvents.forEach(event => {
      const item = this.createElement('li', 'event-item');
      let description = '';
      
      switch (event.type) {
        case 'hit':
          description = `${event.fighter?.toUpperCase()} scored ${event.points} points`;
          break;
        case 'warning':
          description = `${event.fighter?.toUpperCase()} warning: ${event.warning}`;
          break;
        case 'timeout':
          description = `Timeout: ${event.timeoutReason}`;
          break;
        case 'match_start':
          description = 'Match started';
          break;
        case 'match_end':
          description = 'Match ended';
          break;
        default:
          description = `${event.type}`;
      }
      
      item.textContent = description;
      eventsList.appendChild(item);
    });
    
    this.gameLogElement.appendChild(eventsList);
  }

  private addMatchStyles() {
    const styles = `
      <style>
        .match-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: var(--theme-bg-secondary);
          border-radius: var(--radius-lg);
        }
        
        .fighter-name {
          font-size: 1.125rem;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
        }
        
        .fighter-name--red {
          background-color: var(--color-primary-red-light);
          color: var(--color-primary-red-dark);
        }
        
        .fighter-name--blue {
          background-color: var(--color-primary-blue-light);
          color: var(--color-primary-blue-dark);
        }
        
        .vs-text {
          font-weight: bold;
          color: var(--theme-text-secondary);
        }
        
        .match-timer {
          margin-bottom: 1.5rem;
        }
        
        .score-container {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .match-controls {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 0 1rem;
        }
        
        .game-log {
          background-color: var(--theme-bg-secondary);
          border-radius: var(--radius-lg);
          padding: 1rem;
          margin: 0 1rem;
        }
        
        .game-log h3 {
          margin: 0 0 1rem 0;
          font-size: 1.125rem;
          color: var(--theme-text-primary);
        }
        
        .events-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .event-item {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--theme-border-light);
          font-size: 0.875rem;
          color: var(--theme-text-secondary);
        }
        
        .event-item:last-child {
          border-bottom: none;
        }
        
        .no-events {
          color: var(--theme-text-muted);
          font-style: italic;
          margin: 0;
        }
        
        @media (max-width: 480px) {
          .match-header {
            flex-direction: column;
            gap: 0.5rem;
            text-align: center;
          }
          
          .fighter-name {
            font-size: 1rem;
          }
          
          .score-container {
            gap: 1rem;
          }
          
          .match-controls {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles.replace(/<\/?style>/g, '');
    document.head.appendChild(styleElement);
  }
}