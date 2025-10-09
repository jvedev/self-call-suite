import { appState, appActions } from '../../../shared/modules/state';
import { logger } from '../../../shared/modules/logging';
import { Router } from './router';
import { HomeView } from './views/home-view';
import { NewMatchView } from './views/new-match-view';
import { MatchView } from './views/match-view';
import { MatchSettingsView } from './views/match-settings-view';

class SelfCallApp {
    private router: Router;

    constructor() {
        this.router = new Router();
        this.setupRoutes();
        this.setupTheme();
        this.init();
    }

    private setupRoutes(): void {
        this.router.addRoute('home', new HomeView());
        this.router.addRoute('new-match', new NewMatchView());
        this.router.addRoute('match', new MatchView());
        this.router.addRoute('match-settings', new MatchSettingsView());
    }

    private setupTheme(): void {
        // Apply saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        appState.theme = savedTheme as 'light' | 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
            themeToggle.addEventListener('click', () => {
                appActions.toggleTheme();
                const newTheme = appState.theme;
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
            });
        }

        // Listen for navigation events
        window.addEventListener('navigate', (event: any) => {
            this.router.navigate(event.detail);
        });
    }

    private init(): void {
        logger.info('Self Call App initialized');
        this.router.navigate('home');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SelfCallApp();
});