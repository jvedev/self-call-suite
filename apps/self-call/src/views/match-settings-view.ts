import { View } from '../router';
import { DEFAULT_MATCH_SETTINGS, SettingsManager } from '../../../../shared/modules/settings';

export class MatchSettingsView implements View {
    private settingsManager = new SettingsManager();

    render(): string {
        const settings = this.settingsManager.getSettings();
        
        return `
            <div class="container">
                <h2>Match Settings</h2>
                
                <form id="settings-form">
                    <div class="form-field">
                        <label class="form-label">Match Duration</label>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <input 
                                type="number" 
                                id="duration-minutes" 
                                class="form-input"
                                value="${settings.roundDuration.minutes}"
                                min="0" 
                                max="30"
                                style="width: 80px;"
                            >
                            <span>minutes</span>
                            <input 
                                type="number" 
                                id="duration-seconds" 
                                class="form-input"
                                value="${settings.roundDuration.seconds}"
                                min="0" 
                                max="59"
                                style="width: 80px;"
                            >
                            <span>seconds</span>
                        </div>
                    </div>

                    <div class="form-field">
                        <label class="form-label">
                            <input type="checkbox" id="sudden-death" ${settings.suddenDeath ? 'checked' : ''}>
                            Sudden Death
                        </label>
                    </div>

                    <div class="form-field">
                        <label class="form-label">Last Exchange Time (seconds)</label>
                        <input 
                            type="number" 
                            id="last-exchange-time" 
                            class="form-input"
                            value="${settings.lastExchangeTime}"
                            min="5" 
                            max="60"
                        >
                    </div>

                    <div class="form-field">
                        <label class="form-label">
                            <input type="checkbox" id="right-of-way" ${settings.rightOfWay ? 'checked' : ''}>
                            Right of Way
                        </label>
                    </div>

                    <div class="form-field">
                        <label class="form-label">Count Mode</label>
                        <div class="button-group">
                            <input type="radio" id="count-normal" name="count-mode" value="normal" class="radio-button" ${settings.countMode === 'normal' ? 'checked' : ''}>
                            <label for="count-normal">Normal</label>
                            
                            <input type="radio" id="count-difference" name="count-mode" value="differenceOnly" class="radio-button" ${settings.countMode === 'differenceOnly' ? 'checked' : ''}>
                            <label for="count-difference">Difference Only</label>
                        </div>
                    </div>

                    <div class="form-field">
                        <label class="form-label">
                            <input type="checkbox" id="count-doubles" ${settings.countDoubles ? 'checked' : ''}>
                            Count Doubles
                        </label>
                    </div>

                    <div class="form-field">
                        <label class="form-label">
                            <input type="checkbox" id="count-after-blow" ${settings.countAfterBlow ? 'checked' : ''}>
                            Count After Blow
                        </label>
                    </div>

                    <div class="form-field">
                        <label class="form-label">Rounds per Match</label>
                        <input 
                            type="number" 
                            id="rounds-per-match" 
                            class="form-input"
                            value="${settings.roundsPerMatch}"
                            min="1" 
                            max="5"
                        >
                    </div>

                    <div class="form-field">
                        <label class="form-label">Score Values (comma-separated)</label>
                        <input 
                            type="text" 
                            id="score-values" 
                            class="form-input"
                            value="${settings.scoreValues.join(', ')}"
                            placeholder="0, 2, 3"
                        >
                    </div>

                    <div class="button-group">
                        <button type="submit" class="btn btn-primary">Save Settings</button>
                        <button type="button" id="reset-btn" class="btn">Reset to Defaults</button>
                        <button type="button" id="back-btn" class="btn">Back</button>
                    </div>
                </form>
            </div>
        `;
    }

    onMount(): void {
        const form = document.getElementById('settings-form') as HTMLFormElement;
        const resetBtn = document.getElementById('reset-btn');
        const backBtn = document.getElementById('back-btn');

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        resetBtn?.addEventListener('click', () => {
            if (confirm('Reset all settings to defaults?')) {
                this.settingsManager.resetToDefaults();
                this.refreshForm();
            }
        });

        backBtn?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
        });
    }

    private saveSettings(): void {
        const durationMinutes = parseInt((document.getElementById('duration-minutes') as HTMLInputElement).value);
        const durationSeconds = parseInt((document.getElementById('duration-seconds') as HTMLInputElement).value);
        const suddenDeath = (document.getElementById('sudden-death') as HTMLInputElement).checked;
        const lastExchangeTime = parseInt((document.getElementById('last-exchange-time') as HTMLInputElement).value);
        const rightOfWay = (document.getElementById('right-of-way') as HTMLInputElement).checked;
        const countMode = (document.querySelector('input[name="count-mode"]:checked') as HTMLInputElement)?.value as 'normal' | 'differenceOnly';
        const countDoubles = (document.getElementById('count-doubles') as HTMLInputElement).checked;
        const countAfterBlow = (document.getElementById('count-after-blow') as HTMLInputElement).checked;
        const roundsPerMatch = parseInt((document.getElementById('rounds-per-match') as HTMLInputElement).value);
        const scoreValuesText = (document.getElementById('score-values') as HTMLInputElement).value;

        const scoreValues = scoreValuesText
            .split(',')
            .map(v => parseInt(v.trim()))
            .filter(v => !isNaN(v));

        this.settingsManager.updateSettings({
            roundDuration: { minutes: durationMinutes, seconds: durationSeconds },
            suddenDeath,
            lastExchangeTime,
            rightOfWay,
            countMode,
            countDoubles,
            countAfterBlow,
            roundsPerMatch,
            scoreValues
        });

        alert('Settings saved successfully!');
    }

    private refreshForm(): void {
        // Re-render the view with updated settings
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML = this.render();
            this.onMount();
        }
    }
}