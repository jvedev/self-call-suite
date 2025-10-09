export abstract class BaseComponent extends HTMLElement {
    protected shadow: ShadowRoot;
    protected template: HTMLTemplateElement;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.template = document.createElement('template');
    }

    connectedCallback(): void {
        this.render();
        this.attachEventListeners();
    }

    disconnectedCallback(): void {
        this.removeEventListeners();
    }

    protected abstract render(): void;
    protected abstract attachEventListeners(): void;
    protected abstract removeEventListeners(): void;

    protected createElement(tag: string, className?: string, textContent?: string): HTMLElement {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }

    protected addStyles(css: string): void {
        const style = document.createElement('style');
        style.textContent = css;
        this.shadow.appendChild(style);
    }
}