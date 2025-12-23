import html from "./warning-summery.html?raw"
import css from "./warning-summery.css?raw"
import {BaseComponent} from "../../base-component/base-component.ts";

type Warning = {
    description: string;
    minPenalty: number;
    maxPenalty: number
}


export default class WarningSummery extends BaseComponent {

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
        return this.queryRoot<HTMLDivElement>('.placeholder') ;
    }



    constructor() {
        super();
        this.render(css, html);
    }









    private renderDeductionButtons() {
        const {minPenalty, maxPenalty} = this.warning;
        this.placeholder.innerHTML = '<button class="no-penalty button green">No Penalty</button>';
        for (let penalty = minPenalty; penalty <= maxPenalty; penalty++) {
            const button = document.createElement('button');
            button.textContent = penalty.toString();
            button.className = 'red button';
            button.addEventListener('click', () => {
                this.penalty = penalty;
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

customElements.define('warning-summery', WarningSummery);
