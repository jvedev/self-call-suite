export interface View {
    render(): string;
    onMount?(): void;
    onUnmount?(): void;
}

export class Router {
    private routes: Map<string, View> = new Map();
    private currentView: View | null = null;
    private mainContent: HTMLElement | null = null;

    constructor() {
        this.mainContent = document.getElementById('main-content');
        
        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            const route = event.state?.route || 'home';
            this.navigate(route, false);
        });
    }

    addRoute(path: string, view: View): void {
        this.routes.set(path, view);
    }

    navigate(path: string, pushState: boolean = true): void {
        const view = this.routes.get(path);
        
        if (!view) {
            console.error(`Route '${path}' not found`);
            return;
        }

        // Cleanup current view
        if (this.currentView && this.currentView.onUnmount) {
            this.currentView.onUnmount();
        }

        // Set new view
        this.currentView = view;
        
        if (this.mainContent) {
            this.mainContent.innerHTML = view.render();
        }

        // Initialize new view
        if (view.onMount) {
            view.onMount();
        }

        // Update browser history
        if (pushState) {
            window.history.pushState({ route: path }, '', `#${path}`);
        }
    }
}