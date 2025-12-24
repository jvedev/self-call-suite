import html from "./warning-deduction.html?raw"
import css from "./warning-deduction.css?raw"
import {BaseComponent} from "../../base-component/base-component.ts";

type Warning = {
    description: string;
    minPenalty: number;
    maxPenalty: number
}


export default class WarningDeduction extends BaseComponent {

    private _warning: Warning | undefined;
    public penalty: number = 0;

    public set warning(warning: Warning | undefined) {
        this._warning = warning
        this.renderDeductionButtons();
    }

    get warning(): Warning {
        if (!this._warning) throw new Error("Warning is not set");
        return this._warning;
    }

    get placeholder(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.placeholder');
    }


    constructor() {
        super();
        this.render(css, html);
    }


    private onSelect(penalty: number) {
        this.penalty = penalty;
        this.dispatchEvent(new CustomEvent('deduction-selected', {
            detail: {penalty},
            bubbles: true,
            composed: true
        }));
    }

    private renderDeductionButtons() {
        this.placeholder.innerHTML = '';
        const {minPenalty, maxPenalty} = this.warning;

        const noPenaltyButton = document.createElement("button");
        noPenaltyButton.addEventListener('click', () => this.onSelect(0))
        noPenaltyButton.className = "no-penalty button green"
        noPenaltyButton.innerText = "No penalty"
        this.placeholder.appendChild(noPenaltyButton);

        for (let penalty = minPenalty; penalty <= maxPenalty; penalty++) {
            const button = document.createElement('button');
            button.textContent = penalty.toString();
            button.className = 'red button';
            button.addEventListener('click', () => this.onSelect(penalty));
            this.placeholder.appendChild(button);
        }
    }
}

customElements.define('warning-deduction', WarningDeduction);
