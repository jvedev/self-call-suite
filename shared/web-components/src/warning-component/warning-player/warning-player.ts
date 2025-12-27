import html from "./warning-player.html?raw"
import css from "./warning-player.css?raw"
import {BaseComponent} from "../../base-component/base-component.ts";
import {Player} from "@shared/types";
export class WarningPlayer extends BaseComponent {

    private _player?: Player = undefined;
    set player(player: Player) {
        this._player = player;
        this.dispatchEvent(new CustomEvent('player-selected', { detail: { player } }));
    }

    get player(): Player {
        return this._player;
    }

    constructor() {
        super();
        this.render(css, html);
    }


    connectedCallback() {
        this.queryRoot<HTMLButtonElement>('button.red')!.addEventListener('click', () => this.player = 'red');
        this.queryRoot<HTMLButtonElement>('button.blue')!.addEventListener('click', () => this.player = 'blue');
    }








}

customElements.define('warning-player', WarningPlayer);
export default WarningPlayer;
