import { proxy } from 'valtio';
import { MatchSettings, UserSettings } from './types.js';
import { DEFAULT_MATCH_SETTINGS, DEFAULT_USER_SETTINGS } from './defaults.js';

interface SettingsState {
  match: MatchSettings;
  user: UserSettings;
}

export const SettingsStore = proxy<SettingsState>({
  match: { ...DEFAULT_MATCH_SETTINGS },
  user: { ...DEFAULT_USER_SETTINGS },
});

// Helper functions to update settings
export const updateMatchSettings = (settings: Partial<MatchSettings>) => {
  Object.assign(SettingsStore.match, settings);
};

export const updateUserSettings = (settings: Partial<UserSettings>) => {
  Object.assign(SettingsStore.user, settings);
};

export const resetMatchSettings = () => {
  Object.assign(SettingsStore.match, DEFAULT_MATCH_SETTINGS);
};

export const resetUserSettings = () => {
  Object.assign(SettingsStore.user, DEFAULT_USER_SETTINGS);
};

// Persistence helpers
export const saveSettingsToLocalStorage = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('hema-settings', JSON.stringify(SettingsStore));
  }
};

export const loadSettingsFromLocalStorage = () => {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('hema-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(SettingsStore, parsed);
      } catch (error) {
        console.warn('Failed to load settings from localStorage:', error);
      }
    }
  }
};