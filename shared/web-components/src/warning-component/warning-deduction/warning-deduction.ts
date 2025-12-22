import html from "./warning-deduction.html?raw"
import css from "./warning-deduction.css?raw"

type Warning = {
    description: string;
    minPenalty: number;
    maxPenalty: number
}


export default class WarningDeduction extends HTMLElement {
    private _shadow: ShadowRoot;
    private _warning: Warning | undefined;
    private set warning(warning: Warning | undefined) {
        this._warning = warning
        this.renderDeductionButtons();
    }

    get warning(): Warning {
        if (!this._warning) throw new Error("Warning is not set");
        return this._warning;
    }

    get placeholder(): HTMLDivElement {
        return this.shadow.querySelector('.deduction-buttons-placeholder') as HTMLDivElement;
    }

    get shadow(): ShadowRoot {
        if (!this._shadow) {
            this._shadow = this.attachShadow({mode: 'open'});
        }
        return this._shadow;
    }


    constructor() {
        super();
        this._shadow = this.attachShadow({mode: 'open'});
        this.render();
    }


    connectedCallback() {

    }

    disconnectedCallback() {
    }


    private render() {
        this.shadow.innerHTML = `<style>${css}</style>${html}`
    }


    private renderDeductionButtons() {
        const {minPenalty, maxPenalty} = this.warning;
        for (let penalty = minPenalty; penalty <= maxPenalty; penalty++) {
            const button = document.createElement('button');
            button.textContent = `${penalty} Point${penalty > 1 ? 's' : ''}`;
            button.className = 'deduction-button';
            button.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('deduction-selected', {
                    detail: {penalty},
                    bubbles: true,
                    composed: true
                }));
            });
            this.placeholder.appendChild(button);
        }
    }
}

customElements.define('warning-deduction', WarningDeduction);
