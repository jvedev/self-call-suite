// Simple router for navigation between views
import { BaseView } from './base-view.js';

export interface Route {
  path: string;
  view: new (container: HTMLElement) => BaseView;
  title?: string;
}

export class Router {
  private routes: Map<string, Route> = new Map();
  private currentView: BaseView | null = null;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.initializeRouter();
  }

  private initializeRouter() {
    window.addEventListener('popstate', () => {
      this.handleRouteChange();
    });
  }

  addRoute(route: Route) {
    this.routes.set(route.path, route);
  }

  navigate(path: string, pushState = true) {
    const route = this.routes.get(path);
    if (!route) {
      console.warn(`Route not found: ${path}`);
      return;
    }

    // Clean up current view
    if (this.currentView) {
      this.currentView.destroy();
    }

    // Create and render new view
    this.currentView = new route.view(this.container);
    this.currentView.render();

    // Update browser history
    if (pushState && window.location.pathname !== path) {
      window.history.pushState({ path }, route.title || '', path);
    }

    // Update document title
    if (route.title) {
      document.title = route.title;
    }
  }

  private handleRouteChange() {
    const currentPath = window.location.pathname;
    this.navigate(currentPath, false);
  }

  getCurrentPath(): string {
    return window.location.pathname;
  }

  back() {
    window.history.back();
  }

  forward() {
    window.history.forward();
  }
}