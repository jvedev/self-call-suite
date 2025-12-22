import sharedcss from '../styles/shared.css?raw';
export class BaseComponent extends HTMLElement {
    private resizeObserver?: ResizeObserver;

    //signal and controller for cleaning up events
    private abortController = new AbortController();

    protected signal = this.abortController.signal;
    protected eventCleanup = {signal: this.signal}

    protected get placeHolder(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.placeholder')
    }
    public getParentHost<T = HTMLElement>(): T {
        return this.root.host as T
    }

    public get root(): ShadowRoot {
        if (!this.shadowRoot) throw new Error('SubProcedureToken has no shadowRoot.');
        return this.shadowRoot
    }

    disconnectedCallback() {
        this.abortController.abort();
        this.resizeObserver?.disconnect();
    }

    constructor() {
        super();
        const sharedStyles = new CSSStyleSheet();
        sharedStyles.replaceSync(sharedcss);
        this.attachShadow({mode: 'open'});
        this.root.adoptedStyleSheets = [sharedStyles];
    }

    render(style: string = '', html: string = '') {
        this.root.innerHTML =
            `<style>
                ${style}
             </style>
             ${html}`;
    }


    public queryRoot<ElementType>(query: string): ElementType {
        const element = this.root.querySelector(query);

        if (!element) {
            if (undefined as unknown as ElementType === undefined) {
                return undefined as ElementType; // Return undefined if it's expected
            }
            throw new Error(`Element not found for query ${query}`);
        }

        return element as ElementType;
    }

    public dispatchCustomEvent(eventName: string, data?:any) {
        //throw a custom event from this component including data if any is provided
        this.dispatchEvent(new CustomEvent(eventName, {detail: data}));
    }

    public queryRootAll<ElementType extends Element>(query: string): NodeListOf<ElementType> {
        return this.root.querySelectorAll(query) as NodeListOf<ElementType>
    }

}



