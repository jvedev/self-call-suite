import html from "./match-history.html?raw"
import css from "./match-history.css?raw"
import {BaseComponent} from "../base-component/base-component.ts";
import {GameEvent} from "@shared/types";

export class MatchHistoryComponent extends BaseComponent {


    public history:GameEvent[] = []

    constructor() {
        super()
        this.render(css, html)
    }

    connectedCallback() {
        //window.
    }
}

customElements.define('match-history', MatchHistoryComponent);

