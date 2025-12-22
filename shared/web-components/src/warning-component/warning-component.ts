import html from "./warning-component.html?raw"
import css from "./warning-component.css?raw"
import {WarningList} from "./warning.types.ts";
import {BaseComponent} from "../base-component/base-component.ts";
import WarningSelector from "./warning-selector/warning-selector.ts";
import WarningPlayer from "./warning-player/warning-player.ts";
import WarningDeduction from "./warning-deduction/warning-deduction.ts";

type WarningStage = 'player' | 'warning' | 'deduction' | 'summery';

export class WarningComponent extends BaseComponent {
    private _stage: WarningStage = 'player';
    private set stage(stage: WarningStage) {
        this._stage = stage;
        this.stageChanged();
    }
    private get stage(): WarningStage {
        return this._stage;
    }

    get warningSelector(): WarningSelector {
        return this.queryRoot<WarningSelector>("warning-selector");
    }

    get playerSelector() {
        return this.queryRoot<WarningPlayer>("warning-player");
    }

    get warningDeduction() {
        return this.queryRoot<WarningDeduction>("warning-deduction");
    }

    get cancelButton():HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.cancel');
    }

    get backButton():HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.back');
    }

    get confirmButton():HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.confirm');
    }

    set warnings(warnings: WarningList) {
        this.warningSelector.warnings = warnings;
    }

    set instructions(html:string){
        this.queryRoot<HTMLDivElement>(".instructions").innerHTML = html;
    }
    back(){
        switch(this.stage){
            case 'player':
                this.dispatchCustomEvent("back");
                return;
            case 'warning':
                this.stage = 'player';
                return;
            case 'deduction':
                this.stage = 'warning';
                return;
        }
    }

    public hide(){
        this.stage = 'player'
        this.style.display = 'none';
    }
    public show() {
        this.style.display = 'block';
        this.stage = 'player';
        this.stageChanged();
    }
    public stageChanged() {
        this.warningDeduction.style.display = 'none';
        this.playerSelector.style.display = 'none';
        this.warningSelector.style.display = 'none';
        switch (this.stage) {
            case 'player':
                this.playerSelector.style.display = 'block';
                this.instructions = "Select a player";
                return;
            case 'warning':
                this.warningSelector.style.display = 'block';
                const player = this.playerSelector.player;
                this.instructions = `Select a warning for <span class="${player}">${player}</span>`;
                return;
            case 'deduction':
                this.warningDeduction.style.display = 'block';
                return;
        }
    }

    constructor() {
        super();
        this.render(css, html);
    }

    connectedCallback() {
        this.show();
        this.backButton.addEventListener("click", ()=>this.back())
        this.cancelButton.addEventListener("click", ()=>this.dispatchCustomEvent("cancel"))
        this.confirmButton.addEventListener("click", ()=>this.dispatchCustomEvent("confirm"))
        this.playerSelector.addEventListener('player-selected', () => {
            this.stage = 'warning';
        });
        this.warningSelector.addEventListener('warning-selected', () => {
            this.stage = 'deduction';
        });
    }
}

customElements.define('warning-component', WarningComponent);
export default WarningComponent;
