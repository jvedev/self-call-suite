import {appState, appActions} from '@shared/modules/state';
import {logger} from '@shared/modules/logging';
import {addMainStyle} from "@shared/styles/index.ts"; // registreert de webcomponents
import {HomeView, NewMatchView, MatchSettingsView, MatchView} from "@shared/views";
import '@shared/web-components/src/app-router';

class SelfCallApp {

    constructor() {
        this.setupTheme();
        this.init();
    }


    private setupTheme(): void {
        // Apply saved theme
        const savedTheme = localStorage.getItem('theme')=="dark" ? 'dark' : 'light'  ;
        appState.theme =  savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    private init(): void {
        logger.info('Self Call App initialized');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    debugger;
    addMainStyle();
    new SelfCallApp();
});