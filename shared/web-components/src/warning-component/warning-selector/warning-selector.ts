import html from "./warning-selector.html?raw"
import css from "./warning-selector.css?raw"
import {Warning, WarningList} from "../warning.types.ts";
import {BaseComponent} from "../../base-component/base-component.ts";



export class WarningSelector extends BaseComponent {
    private _warnings: WarningList = [];
    private  _warning?:Warning;

    public get warning():Warning{
        if(!this._warning){
            throw new Error("No warning selected")
        }
        return this._warning;
    }

    public set warning(value:Warning){
        this._warning = value;
    }

    set warnings(warnings: WarningList) {
        this._warnings = warnings;
        this.renderWarnings();
    }


    constructor() {
        super();
        this.render( css, html);
    }


    connectedCallback() {

    }


    private renderWarnings() {
        const {placeHolder} = this;
        placeHolder.innerHTML = '';
        this._warnings.forEach(warning => {
            const warningDiv = document.createElement('div');
            warningDiv.classList.add('warning-option');
            warningDiv.innerHTML = warning.description
            placeHolder.appendChild(warningDiv);
            warningDiv.addEventListener('click', ()=>this.warningSelected( warning));

            console.log(JSON.stringify(warning))
        })
    }

    warningSelected(warning: {description: string; minPenalty: number; maxPenalty: number}) {
        console.log(`Warning selected: ${JSON.stringify(warning)}`);
        this._warning = warning;
        this.dispatchEvent(new CustomEvent('warning-selected', { detail: { warning } }));
    }

}

customElements.define('warning-selector', WarningSelector);
export default WarningSelector;
