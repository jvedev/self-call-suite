import html from "./match-view.html?raw"
import css from "./match-view.css?raw"
import {BaseComponent} from "../base-component/base-component.ts";
import {TimerComponent} from "../timer-component/timer-component.ts";
import {ScoreComponent} from "../score-component/score-component.ts";
import {WarningComponent} from "../warning-component/warning-component.ts";

export class MatchViewComponent extends BaseComponent {
    public get timer(): TimerComponent {
       return this.queryRoot<TimerComponent>('timer-component');
    }

    public get score(): ScoreComponent | null {
        return this.queryRoot<ScoreComponent>('score-component');
    }

    public get warning(): WarningComponent | null {
        return this.queryRoot<WarningComponent>('warning-component');
    }

    public get hitButton():HTMLButtonElement{
        return this.queryRoot<HTMLButtonElement>('#hit');
    }
    public get warningButton():HTMLButtonElement{
        return this.queryRoot<HTMLButtonElement>('#warning');
    }
    public get timeoutButton():HTMLButtonElement{
        return this.queryRoot<HTMLButtonElement>('#timeout');
    }
    constructor() {
        super()
        this.render(css, html)

    }

    connectedCallback(){

    }


}

customElements.define('match-view', MatchViewComponent);

