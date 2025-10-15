import Views, {View} from "@shared/views";




export class Router {
    private routes: Map<string, View> = new Map();
    private currentView: HTMLElement | null = null;
    private mainContent: HTMLElement | null = null;

    constructor() {
        this.mainContent = document.getElementById('main-content');
        
        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            const route = event.state?.route || 'home';
            this.navigate(route, false);
        });
    }

    addRoute(path: string, view: HTMLElement): void {
        this.routes.set(path, view);
    }

    navigate(path: string, pushState: boolean = true): void {
        const view:View = this.routes.get(path);
        
        if (!view) {
            console.error(`Route '${path}' not found`);
            return;
        }


        // Set new view
        this.currentView = view;
        
        if (this.mainContent) {
            this.mainContent.innerHTML = view.render();
        }


        // Update browser history
        if (pushState) {
            window.history.pushState({ route: path }, '', `#${path}`);
        }
    }
}