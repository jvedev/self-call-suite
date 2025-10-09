import { BaseView } from '@shared/views';
import { createMatch, startMatch } from '@shared/modules/state';

export class NewMatchView extends BaseView {
  private redFighterInput!: HTMLInputElement;
  private blueFighterInput!: HTMLInputElement;
  private errorDiv!: HTMLElement;

  render() {
    this.clear();

    // Header
    const header = this.createElement('header', 'view-header');
    const title = this.createElement('h1', 'view-title', 'New Match');
    const backBtn = this.createButton('← Back', 'btn btn--sm', () => {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    
    header.appendChild(backBtn);
    header.appendChild(title);

    // Form
    const form = this.createElement('form', 'new-match-form');
    
    // Error message
    this.errorDiv = this.createElement('div', 'error-message');
    this.errorDiv.style.display = 'none';

    // Red fighter input
    this.redFighterInput = this.createInput('text', 'Red Fighter Name');
    const redGroup = this.createFormGroup('Red Fighter', this.redFighterInput);
    redGroup.classList.add('form-group--red');

    // Blue fighter input  
    this.blueFighterInput = this.createInput('text', 'Blue Fighter Name');
    const blueGroup = this.createFormGroup('Blue Fighter', this.blueFighterInput);
    blueGroup.classList.add('form-group--blue');

    // Start match button
    const startBtn = this.createButton('Start Match', 'btn btn--primary btn--lg', (e) => {
      e.preventDefault();
      this.handleStartMatch();
    });

    form.appendChild(this.errorDiv);
    form.appendChild(redGroup);
    form.appendChild(blueGroup);
    form.appendChild(startBtn);

    this.container.appendChild(header);
    this.container.appendChild(form);

    // Focus on first input
    this.redFighterInput.focus();

    // Add custom styles
    const styles = `
      <style>
        .view-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .view-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
          flex: 1;
          text-align: center;
        }
        
        .new-match-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .form-group--red label {
          color: var(--color-primary-red);
        }
        
        .form-group--blue label {
          color: var(--color-primary-blue);
        }
        
        .form-group--red input:focus {
          border-color: var(--color-primary-red);
          box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
        }
        
        .form-group--blue input:focus {
          border-color: var(--color-primary-blue);
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        
        .error-message {
          background-color: var(--color-error);
          color: white;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        @media (max-width: 480px) {
          .view-header {
            padding: 0.75rem;
          }
          
          .new-match-form {
            padding: 0 1.5rem;
          }
        }
      </style>
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles.replace(/<\/?style>/g, '');
    document.head.appendChild(styleElement);

    this.isRendered = true;
  }

  destroy() {
    // Remove custom styles
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
      if (style.textContent?.includes('new-match-form')) {
        style.remove();
      }
    });
    
    this.clear();
    this.isRendered = false;
  }

  private handleStartMatch() {
    const redName = this.redFighterInput.value.trim();
    const blueName = this.blueFighterInput.value.trim();

    // Validation
    if (!redName || !blueName) {
      this.showError('Please enter names for both fighters');
      return;
    }

    if (redName === blueName) {
      this.showError('Fighter names must be different');
      return;
    }

    try {
      // Create and start the match
      createMatch(redName, blueName);
      startMatch();

      // Navigate to match view
      window.history.pushState(null, '', '/match');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (error) {
      this.showError('Failed to start match. Please try again.');
      console.error('Error starting match:', error);
    }
  }

  private showError(message: string) {
    this.errorDiv.textContent = message;
    this.errorDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (this.errorDiv) {
        this.errorDiv.style.display = 'none';
      }
    }, 5000);
  }
}