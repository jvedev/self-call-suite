import { View } from '../router';
import { appActions } from '../../../../shared/modules/state';

export class HomeView implements View {
    render(): string {
        return `
            <div class="container">
                <div class="text-center mb-4">
                    <h2>Welcome to Self Call</h2>
                    <p>HEMA Self-Refereeing Scoring System</p>
                </div>
                
                <div class="button-group">
                    <button id="new-match-btn" class="btn btn-primary">
                        New Match
                    </button>
                    <button id="match-settings-btn" class="btn btn-primary">
                        Match Settings
                    </button>
                    <button id="past-matches-btn" class="btn btn-primary">
                        Past Matches
                    </button>
                </div>
            </div>
        `;
    }

    onMount(): void {
        const newMatchBtn = document.getElementById('new-match-btn');
        const settingsBtn = document.getElementById('match-settings-btn');
        const pastMatchesBtn = document.getElementById('past-matches-btn');

        newMatchBtn?.addEventListener('click', () => {
            appActions.navigateTo('new-match');
            // Router will handle the navigation
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'new-match' }));
        });

        settingsBtn?.addEventListener('click', () => {
            appActions.navigateTo('match-settings');
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'match-settings' }));
        });

        pastMatchesBtn?.addEventListener('click', () => {
            // TODO: Implement past matches view
            alert('Past matches feature coming soon!');
        });
    }
}