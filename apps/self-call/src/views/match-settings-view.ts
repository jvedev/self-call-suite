import { BaseView } from '@shared/views';
import { SettingsStore, updateMatchSettings } from '@shared/modules/settings';

export class MatchSettingsView extends BaseView {
  render() {
    this.clear();

    // Header
    const header = this.createElement('header', 'view-header');
    const title = this.createElement('h1', 'view-title', 'Match Settings');
    const backBtn = this.createButton('← Back', 'btn btn--sm', () => {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    
    header.appendChild(backBtn);
    header.appendChild(title);

    // Settings form
    const form = this.createElement('form', 'settings-form');
    
    // Round Duration
    const durationGroup = this.createElement('div', 'form-group');
    durationGroup.innerHTML = `
      <label>Round Duration</label>
      <div class="duration-inputs">
        <input type="number" id="minutes" min="0" max="60" value="${SettingsStore.match.roundDuration.minutes}">
        <span>minutes</span>
        <input type="number" id="seconds" min="0" max="59" value="${SettingsStore.match.roundDuration.seconds}">
        <span>seconds</span>
      </div>
    `;

    // Boolean settings with radio button groups
    const booleanSettings = [
      { key: 'suddenDeath', label: 'Sudden Death' },
      { key: 'rightOfWay', label: 'Right of Way' },
      { key: 'countDoubles', label: 'Count Doubles' },
      { key: 'countAfterBlow', label: 'Count After Blow' },
      { key: 'extendLastRound', label: 'Extend Last Round' }
    ];

    booleanSettings.forEach(setting => {
      const group = this.createElement('div', 'form-group');
      const value = SettingsStore.match[setting.key as keyof typeof SettingsStore.match];
      
      group.innerHTML = `
        <label>${setting.label}</label>
        <div class="radio-group">
          <label>
            <input type="radio" name="${setting.key}" value="true" ${value ? 'checked' : ''}>
            Yes
          </label>
          <label>
            <input type="radio" name="${setting.key}" value="false" ${!value ? 'checked' : ''}>
            No
          </label>
        </div>
      `;
      
      form.appendChild(group);
    });

    // Count Mode
    const countModeGroup = this.createElement('div', 'form-group');
    countModeGroup.innerHTML = `
      <label>Count Mode</label>
      <div class="radio-group">
        <label>
          <input type="radio" name="countMode" value="normal" ${SettingsStore.match.countMode === 'normal' ? 'checked' : ''}>
          Normal
        </label>
        <label>
          <input type="radio" name="countMode" value="differenceOnly" ${SettingsStore.match.countMode === 'differenceOnly' ? 'checked' : ''}>
          Difference Only
        </label>
      </div>
    `;

    // Numeric settings
    const numericSettings = [
      { key: 'lastExchangeTime', label: 'Last Exchange Time (seconds)', min: 0, max: 60 },
      { key: 'extendLastRoundSeconds', label: 'Extend Last Round (seconds)', min: 0, max: 300 },
      { key: 'extensionsLastRound', label: 'Extensions Allowed', min: 0, max: 10 },
      { key: 'roundsPerMatch', label: 'Rounds per Match', min: 1, max: 20 }
    ];

    numericSettings.forEach(setting => {
      const group = this.createElement('div', 'form-group');
      const value = SettingsStore.match[setting.key as keyof typeof SettingsStore.match];
      
      group.innerHTML = `
        <label>${setting.label}</label>
        <input type="number" id="${setting.key}" min="${setting.min}" max="${setting.max}" value="${value}">
      `;
      
      form.appendChild(group);
    });

    // Save button
    const saveBtn = this.createButton('Save Settings', 'btn btn--primary btn--lg', () => {
      this.saveSettings();
    });

    // Reset button
    const resetBtn = this.createButton('Reset to Defaults', 'btn btn--lg', () => {
      if (confirm('Are you sure you want to reset all settings to defaults?')) {
        this.resetSettings();
      }
    });

    form.appendChild(durationGroup);
    form.appendChild(countModeGroup);
    form.appendChild(saveBtn);
    form.appendChild(resetBtn);

    this.container.appendChild(header);
    this.container.appendChild(form);

    // Add custom styles
    this.addSettingsStyles();

    this.isRendered = true;
  }

  destroy() {
    // Remove custom styles
    const styles = document.querySelectorAll('style');
    styles.forEach(style => {
      if (style.textContent?.includes('settings-form')) {
        style.remove();
      }
    });
    
    this.clear();
    this.isRendered = false;
  }

  private saveSettings() {
    try {
      // Collect form values
      const formData = new FormData(this.container.querySelector('form') as HTMLFormElement);
      const minutes = parseInt((document.getElementById('minutes') as HTMLInputElement).value);
      const seconds = parseInt((document.getElementById('seconds') as HTMLInputElement).value);
      
      const settings = {
        roundDuration: { minutes, seconds },
        suddenDeath: formData.get('suddenDeath') === 'true',
        rightOfWay: formData.get('rightOfWay') === 'true',
        countDoubles: formData.get('countDoubles') === 'true',
        countAfterBlow: formData.get('countAfterBlow') === 'true',
        extendLastRound: formData.get('extendLastRound') === 'true',
        countMode: formData.get('countMode') as 'normal' | 'differenceOnly',
        lastExchangeTime: parseInt((document.getElementById('lastExchangeTime') as HTMLInputElement).value),
        extendLastRoundSeconds: parseInt((document.getElementById('extendLastRoundSeconds') as HTMLInputElement).value),
        extensionsLastRound: parseInt((document.getElementById('extensionsLastRound') as HTMLInputElement).value),
        roundsPerMatch: parseInt((document.getElementById('roundsPerMatch') as HTMLInputElement).value)
      };

      updateMatchSettings(settings);
      
      // Show success message
      this.showMessage('Settings saved successfully!', 'success');
      
    } catch (error) {
      this.showMessage('Failed to save settings. Please try again.', 'error');
      console.error('Error saving settings:', error);
    }
  }

  private resetSettings() {
    // Reload the page to reset to defaults
    window.location.reload();
  }

  private showMessage(text: string, type: 'success' | 'error') {
    // Remove any existing messages
    const existingMsg = this.container.querySelector('.message');
    if (existingMsg) existingMsg.remove();

    const message = this.createElement('div', `message message--${type}`, text);
    this.container.insertBefore(message, this.container.firstChild);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 3000);
  }

  private addSettingsStyles() {
    const styles = `
      <style>
        .settings-form {
          max-width: 500px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        
        .duration-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .duration-inputs input {
          width: 80px;
        }
        
        .duration-inputs span {
          font-size: 0.875rem;
          color: var(--theme-text-secondary);
        }
        
        .radio-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .radio-group input[type="radio"] {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }
        
        .radio-group label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border: 1px solid var(--theme-border-medium);
          border-radius: var(--radius-md);
          background-color: var(--theme-button-bg);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-size: 0.875rem;
          min-width: 60px;
        }
        
        .radio-group label:hover {
          background-color: var(--theme-button-bg-hover);
          border-color: var(--theme-border-heavy);
        }
        
        .radio-group label:has(input:checked) {
          background-color: var(--color-primary-blue);
          color: white;
          border-color: var(--color-primary-blue-dark);
        }
        
        .message {
          padding: 0.75rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
          font-weight: 500;
        }
        
        .message--success {
          background-color: var(--color-success);
          color: white;
        }
        
        .message--error {
          background-color: var(--color-error);
          color: white;
        }
        
        @media (max-width: 480px) {
          .settings-form {
            padding: 0 1.5rem;
          }
          
          .duration-inputs {
            flex-wrap: wrap;
          }
          
          .radio-group {
            flex-direction: column;
          }
          
          .radio-group label {
            text-align: center;
          }
        }
      </style>
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = styles.replace(/<\/?style>/g, '');
    document.head.appendChild(styleElement);
  }
}