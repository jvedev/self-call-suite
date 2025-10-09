import { BaseView } from '@shared/views';
import { MatchStore } from '@shared/modules/state';

export class PastMatchesView extends BaseView {
  render() {
    this.clear();

    // Header
    const header = this.createElement('header', 'view-header');
    const title = this.createElement('h1', 'view-title', 'Past Matches');
    const backBtn = this.createButton('← Back', 'btn btn--sm', () => {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    
    header.appendChild(backBtn);
    header.appendChild(title);

    // Matches list
    const matchesList = this.createElement('div', 'matches-list');
    
    if (MatchStore.history.length === 0) {
      const emptyState = this.createElement('div', 'empty-state');
      emptyState.innerHTML = `
        <div class="empty-icon">⚔️</div>
        <h2>No Past Matches</h2>
        <p>Complete some matches to see them here.</p>
      `;
      matchesList.appendChild(emptyState);
    } else {
      // Sort matches by most recent first
      const sortedMatches = [...MatchStore.history].sort((a, b) => b.createdAt - a.createdAt);
      
      sortedMatches.forEach(match => {
        const matchCard = this.createElement('div', 'match-card');
        
        const date = new Date(match.createdAt).toLocaleDateString();
        const time = new Date(match.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const winner = match.redScore > match.blueScore ? match.redFighter.name : 
                      match.blueScore > match.redScore ? match.blueFighter.name : 'Draw';
        
        const duration = match.finishedAt ? 
          this.formatDuration(match.finishedAt - match.createdAt) : 'Incomplete';
        
        matchCard.innerHTML = `
          <div class="match-card__header">
            <div class="match-fighters">
              <span class="fighter-name fighter-name--red">${match.redFighter.name}</span>
              <span class="vs-text">vs</span>
              <span class="fighter-name fighter-name--blue">${match.blueFighter.name}</span>
            </div>
            <div class="match-date">${date} ${time}</div>
          </div>
          
          <div class="match-card__body">
            <div class="match-scores">
              <div class="score-display">
                <span class="score score--red">${match.redScore}</span>
                <span class="score-separator">-</span>
                <span class="score score--blue">${match.blueScore}</span>
              </div>
            </div>
            
            <div class="match-info">
              <div class="info-item">
                <strong>Winner:</strong> ${winner}
              </div>
              <div class="info-item">
                <strong>Duration:</strong> ${duration}
              </div>
              <div class="info-item">
                <strong>Events:</strong> ${match.events.length}
              </div>
            </div>
          </div>
        `;
        
        // Add click handler to view details
        matchCard.addEventListener('click', () => {
          this.showMatchDetails(match);
        });
        
        matchesList.appendChild(matchCard);
      });
    }

    this.container.appendChild(header);
    this.container.appendChild(matchesList);

    // Add custom styles
    this.addPastMatchesStyles();

    this.isRendered = true;
  }

  destroy() {
    // Remove custom styles
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
      if (style.textContent?.includes('matches-list')) {
        style.remove();
      }
    });
    
    this.clear();
    this.isRendered = false;
  }

  private formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private showMatchDetails(match: any) {
    // Simple implementation - in a real app this would open a detailed view
    const events = match.events.map((event: any, index: number) => {
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
          description = event.type;
      }
      return `${index + 1}. ${description}`;
    }).join('\n');

    const details = `
Match Details:
${match.redFighter.name} vs ${match.blueFighter.name}
Score: ${match.redScore} - ${match.blueScore}
Date: ${new Date(match.createdAt).toLocaleString()}
${match.finishedAt ? `Duration: ${this.formatDuration(match.finishedAt - match.createdAt)}` : 'Incomplete'}

Events:
${events || 'No events recorded'}
    `;

    alert(details);
  }

  private addPastMatchesStyles() {
    const styles = `
      <style>
        .matches-list {
          padding: 0 1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--theme-text-secondary);
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .empty-state h2 {
          margin: 0 0 0.5rem 0;
          color: var(--theme-text-primary);
        }
        
        .empty-state p {
          margin: 0;
        }
        
        .match-card {
          background-color: var(--theme-bg-secondary);
          border: 1px solid var(--theme-border-light);
          border-radius: var(--radius-lg);
          padding: 1rem;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .match-card:hover {
          border-color: var(--theme-border-medium);
          box-shadow: var(--shadow-md);
        }
        
        .match-card__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .match-fighters {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .fighter-name {
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
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
          font-size: 0.75rem;
          color: var(--theme-text-muted);
          font-weight: 500;
        }
        
        .match-date {
          font-size: 0.75rem;
          color: var(--theme-text-muted);
        }
        
        .match-card__body {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .match-scores {
          flex-shrink: 0;
        }
        
        .score-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .score {
          font-size: 1.5rem;
          font-weight: bold;
          min-width: 2rem;
          text-align: center;
        }
        
        .score--red {
          color: var(--color-primary-red);
        }
        
        .score--blue {
          color: var(--color-primary-blue);
        }
        
        .score-separator {
          color: var(--theme-text-muted);
          font-weight: normal;
        }
        
        .match-info {
          flex: 1;
          font-size: 0.875rem;
        }
        
        .info-item {
          margin-bottom: 0.25rem;
          color: var(--theme-text-secondary);
        }
        
        .info-item:last-child {
          margin-bottom: 0;
        }
        
        @media (max-width: 480px) {
          .matches-list {
            padding: 0 1.5rem;
          }
          
          .match-card__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .match-card__body {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .match-info {
            width: 100%;
          }
        }
      </style>
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles.replace(/<\/?style>/g, '');
    document.head.appendChild(styleElement);
  }
}