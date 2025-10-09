import '@shared/styles/dist/index.css';
import '@shared/web-components';

import { Router } from '@shared/views';
import { loadSettingsFromLocalStorage } from '@shared/modules/settings';

import { HomeView } from './views/home-view.js';
import { NewMatchView } from './views/new-match-view.js';
import { MatchView } from './views/match-view.js';
import { MatchSettingsView } from './views/match-settings-view.js';
import { PastMatchesView } from './views/past-matches-view.js';

class SelfCallApp {
  private router: Router;

  constructor() {
    const appContainer = document.getElementById('app');
    if (!appContainer) {
      throw new Error('App container not found');
    }

    // Clear loading screen
    appContainer.innerHTML = '';

    // Initialize router
    this.router = new Router(appContainer);
    this.setupRoutes();
    this.initialize();
  }

  private setupRoutes() {
    this.router.addRoute({
      path: '/',
      view: HomeView,
      title: 'HEMA Self Call - Home'
    });

    this.router.addRoute({
      path: '/new-match',
      view: NewMatchView,
      title: 'New Match - HEMA Self Call'
    });

    this.router.addRoute({
      path: '/match',
      view: MatchView,
      title: 'Match - HEMA Self Call'
    });

    this.router.addRoute({
      path: '/match-settings',
      view: MatchSettingsView,
      title: 'Match Settings - HEMA Self Call'
    });

    this.router.addRoute({
      path: '/past-matches',
      view: PastMatchesView,
      title: 'Past Matches - HEMA Self Call'
    });
  }

  private initialize() {
    // Load saved settings
    loadSettingsFromLocalStorage();

    // Setup theme handling
    this.setupThemeHandling();

    // Navigate to initial route
    const currentPath = this.router.getCurrentPath();
    if (currentPath === '/' || currentPath === '') {
      this.router.navigate('/', false);
    } else {
      this.router.navigate(currentPath, false);
    }

    console.log('HEMA Self Call app initialized');
  }

  private setupThemeHandling() {
    // Apply saved theme or system preference
    const savedTheme = localStorage.getItem('hema-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Use system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!document.documentElement.getAttribute('data-theme')) {
        // Only apply if no manual theme is set
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SelfCallApp());
} else {
  new SelfCallApp();
}