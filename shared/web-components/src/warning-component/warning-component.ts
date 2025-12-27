import html from "./warning-component.html?raw"
import css from "./warning-component.css?raw"
import {Warning, WarningList} from "./warning.types.ts";
import {BaseComponent} from "../base-component/base-component.ts";
import WarningSelector from "./warning-selector/warning-selector.ts";
import WarningPlayer from "./warning-player/warning-player.ts";
import WarningDeduction from "./warning-deduction/warning-deduction.ts";
import WarningSummery from "./warning-summery/warning-summery.ts";
import {Player, UntimedGameEvent} from "@shared/types";

type WarningStage = 'player' | 'warning' | 'deduction' | 'summery';

export class WarningComponent extends BaseComponent {
    private _stage: WarningStage = 'player';

    get warning(): Warning {
        return this.warningSelector.warning
    }

    set warning(warning: Warning) {
        this.warningSelector.warning = warning;
    }

    get player(): Player | undefined {
        return this.playerSelector.player
    }

    set player(player: Player) {
        this.playerSelector.player = player;
    }

    set penalty(penalty: number) {
        this.warningDeduction.penalty = penalty;
    }

    get penalty(): number {
        return this.warningDeduction.penalty
    }

    public set stage(stage: WarningStage) {
        this._stage = stage;
        this.stageChanged();
    }

    public get stage(): WarningStage {
        return this._stage;
    }

    get warningSelector(): WarningSelector {
        return this.queryRoot<WarningSelector>("warning-selector");
    }

    get summery(): WarningSummery {
        return this.queryRoot<WarningSummery>("warning-summery");
    }

    get playerSelector() {
        return this.queryRoot<WarningPlayer>("warning-player");
    }

    get warningDeduction() {
        return this.queryRoot<WarningDeduction>("warning-deduction");
    }

    get cancelButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.cancel');
    }

    get backButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.back');
    }

    get confirmButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.confirm');
    }

    set warnings(warnings: WarningList) {
        this.warningSelector.warnings = warnings;
    }

    set instructions(html: string) {
        this.queryRoot<HTMLDivElement>(".instructions").innerHTML = html;
    }

    back() {
        switch (this.stage) {
            case 'player':
                this.dispatchCustomEvent("back");
                return;
            case 'warning':
                this.stage = 'player';
                return;
            case 'deduction':
                this.stage = 'warning';
                return;
            case 'summery':
                this.stage = 'deduction';
                return;
        }
    }

    public hide() {
        this.stage = 'player'
        this.style.display = 'none';
    }

    public stageChanged() {
        this.warningDeduction.style.display = 'none';
        this.playerSelector.style.display = 'none';
        this.warningSelector.style.display = 'none';
        this.summery.style.display = 'none';
        this.confirmButton.disabled = true;
        const player = this.playerSelector.player;

        switch (this.stage) {
            case 'player':
                this.playerSelector.style.display = 'block';
                this.instructions = "Select a player";
                return;
            case 'warning':
                this.warningSelector.style.display = 'block';
                this.instructions = `Warning <span class="${player}">${player}</span>`;
                return;
            case 'deduction':
                this.instructions = `Deduction <span class="${player}">${player}</span>`;
                this.warningDeduction.style.display = 'block';
                return;
            case 'summery':
                this.instructions = "Warning Summary";
                this.summery.style.display = 'block';
                this.summery.player = this.playerSelector.player;
                this.summery.warning = this.warningSelector.warning;
                this.summery.penalty = this.warningDeduction.penalty;
                this.confirmButton.disabled = false;
                return;
        }
    }

    constructor() {
        super();
        this.render(css, html);
    }

    connectedCallback() {
        this.stage = 'player';
        this.stageChanged();
        this.backButton.addEventListener("click", () => this.back())
        this.cancelButton.addEventListener("click", () => this.dispatchCustomEvent("cancel"))
        this.confirmButton.addEventListener("click", this.confirm.bind(this))
        this.playerSelector.addEventListener('player-selected', () => {
            this.stage = 'warning';
        });
        this.warningSelector.addEventListener('warning-selected', () => {
            this.warningDeduction.warning = this.warningSelector.warning
            this.stage = 'deduction';
        });
        this.warningDeduction.addEventListener('deduction-selected', () => {
            if(this.penalty === 0){
                this.confirm();
                return
            }
            this.stage = 'summery';
        });
    }

    confirm(){

        //dispatch a game-event with the warning details on window level
        const detail:UntimedGameEvent = {
            type:'warning',
            warning:{
                player: this.player,
                warning: this.warning.description,
                penalty: this.penalty
            }
        };

        //dispatch a custom event on window
        window.dispatchEvent(new CustomEvent('game-event', { detail }));
        //reset to initial state
        this.stage = 'player';
    }
}

customElements.define('warning-component', WarningComponent);
export default WarningComponent;
