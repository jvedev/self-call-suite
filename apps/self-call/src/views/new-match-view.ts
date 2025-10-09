import { View } from '../router';
import { matchActions } from '../../../../shared/modules/state';
import { DEFAULT_MATCH_SETTINGS } from '../../../../shared/modules/settings';

export class NewMatchView implements View {
    render(): string {
        return `
            <div class="container">
                <h2>New Match</h2>
                
                <form id="new-match-form">
                    <div class="form-field">
                        <label for="red-fighter" class="form-label">Red Fighter</label>
                        <input 
                            type="text" 
                            id="red-fighter" 
                            class="form-input"
                            placeholder="Enter red fighter name"
                            required
                        >
                    </div>
                    
                    <div class="form-field">
                        <label for="blue-fighter" class="form-label">Blue Fighter</label>
                        <input 
                            type="text" 
                            id="blue-fighter" 
                            class="form-input"
                            placeholder="Enter blue fighter name"
                            required
                        >
                    </div>
                    
                    <div id="error-message" class="error-message" style="display: none; color: var(--color-error); margin-bottom: 1rem;"></div>
                    
                    <div class="button-group">
                        <button type="submit" class="btn btn-primary">
                            Start Match
                        </button>
                        <button type="button" id="back-btn" class="btn">
                            Back
                        </button>
                    </div>
                </form>
            </div>
        `;
    }

    onMount(): void {
        const form = document.getElementById('new-match-form') as HTMLFormElement;
        const backBtn = document.getElementById('back-btn');
        const errorMessage = document.getElementById('error-message');

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const redFighter = (document.getElementById('red-fighter') as HTMLInputElement).value.trim();
            const blueFighter = (document.getElementById('blue-fighter') as HTMLInputElement).value.trim();
            
            if (!redFighter || !blueFighter) {
                this.showError('Please enter names for both fighters');
                return;
            }
            
            if (redFighter === blueFighter) {
                this.showError('Fighters must have different names');
                return;
            }
            
            // Start the match
            matchActions.startMatch(redFighter, blueFighter, DEFAULT_MATCH_SETTINGS);
            
            // Navigate to match view
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'match' }));
        });

        backBtn?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
        });
    }

    private showError(message: string): void {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
}