import {BaseComponent} from "./base-component/base-component.ts";

export class ViewRoute extends HTMLElement {
    static get observedAttributes() {
        return ['path'];
    }

    get path() {
        return this.getAttribute('path') || '';
    }

    connectedCallback() {
        this.style.display = 'none';
    }
}

export class AppRouter extends BaseComponent {
    public render(): void {
        throw new Error("Method not implemented.");
    }
    protected attachEventListeners(): void {
        throw new Error("Method not implemented.");
    }
    protected removeEventListeners(): void {
        throw new Error("Method not implemented.");
    }
    private observer: MutationObserver;

    constructor() {
        super();
        this.observer = new MutationObserver(() => this.updateRoute());
    }

    connectedCallback() {
        window.addEventListener('popstate', () => this.updateRoute());
        this.observer.observe(this, {childList: true, subtree: true});
        this.updateRoute();
    }

    disconnectedCallback() {
        window.removeEventListener('popstate', () => this.updateRoute());
        this.observer.disconnect();
    }

    updateRoute() {
        const path = window.location.pathname;
        let matched = false;
        const routes = Array.from(this.querySelectorAll('view-route, .route-404')) as ViewRoute[];
        routes.forEach(route => {
            if (route.path === path) {
                route.style.display = '';
                matched = true;
            } else {
                route.style.display = 'none';
            }
        });
        if (matched) return matched;
        // no matched route, show 404
        this.show404();

    }

    show404() {
        let notFound = this.querySelector('.route-404') as HTMLElement;
        if (!notFound) {
            notFound = document.createElement('div');
            notFound.textContent = '404 Not Found';
            notFound.className = 'route-404';
            this.appendChild(notFound);
        }
        notFound.style.display = '';
    }
}

customElements.define('app-router', AppRouter);
customElements.define('view-route', ViewRoute);
