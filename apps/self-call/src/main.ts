import {appState, appActions} from '@shared/modules/state';
import {logger} from '@shared/modules/logging';
import {addMainStyle} from "@shared/styles/index.ts";
// Import web components for side effects to register custom elements
import '@shared/web-components/src/app-router';
import '@shared/views/home-view/home-view';
import '@shared/views/new-match-view/new-match-view';
import '@shared/views/match-view/match-view';
import '@shared/views/match-settings-view/match-settings-view';

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