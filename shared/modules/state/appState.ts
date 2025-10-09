import { proxy } from 'valtio';

export interface AppState {
    currentView: string;
    theme: 'light' | 'dark';
    language: string;
    isAuthenticated: boolean;
    currentUser: string | null;
}

export const appState = proxy<AppState>({
    currentView: 'home',
    theme: 'light',
    language: 'en',
    isAuthenticated: false,
    currentUser: null
});

export const appActions = {
    navigateTo(view: string): void {
        appState.currentView = view;
    },

    toggleTheme(): void {
        appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    },

    setLanguage(language: string): void {
        appState.language = language;
    },

    login(username: string): void {
        appState.isAuthenticated = true;
        appState.currentUser = username;
    },

    logout(): void {
        appState.isAuthenticated = false;
        appState.currentUser = null;
        appState.currentView = 'login';
    }
};