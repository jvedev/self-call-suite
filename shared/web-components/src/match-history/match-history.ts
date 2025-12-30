import html from "./match-history.html?raw"
import css from "./match-history.css?raw"
import {BaseComponent} from "../base-component/base-component.ts";
import {
    GameState,
    isScoreEvent,
    isTimeEvent,
    isWarningEvent,
    ScoreEvent,
    SingleGameEvent,
    WarningEvent
} from "@shared/types";

export class MatchHistoryComponent extends BaseComponent {

    private historyContainer: HTMLElement

    public history: SingleGameEvent[] = []

    constructor() {
        super()
        this.render(css, html)
        this.historyContainer = this.queryRoot<HTMLElement>('.history-container');
    }

    connectedCallback() {
        window.addEventListener('state-change', this.stateChange.bind(this), this.eventCleanup);
    }

    stateChange(event: Event) {
        const customEvent = event as CustomEvent;
        const detail = customEvent.detail as GameState;
        if (isTimeEvent(detail.lastEvent)) return;
        this.history.push(detail);
        console.log(this.history);
        this.updateHistory();
    }

    public updateHistory() {

        this.historyContainer.innerHTML = '';
        this.history.forEach(this.renderHistoryEntry.bind(this));


    }

    private renderWarningEvent(state: SingleGameEvent, lastEvent: WarningEvent, index: number) {
        const time = state.passedTime.asString;
        const {warning, player, penalty} = lastEvent.warning;

        const entry = document.createElement('div');
        entry.setAttribute('data-index', index.toString());
        entry.classList.add('warning');

        const penaltyDescription = (penalty > 0) ?
            `penalty: ${penalty} to ${player}` : `no penalty to ${player}`;


        entry.innerHTML = `
                <div>${time}</div> 
                <div class="description">${warning} </div>
                <div class="${player} penalty">${penaltyDescription}</div>
            `;
        this.historyContainer.appendChild(entry);
    }

    private renderScoreEvent(state: SingleGameEvent, lastEvent: ScoreEvent, index: number) {
        const {type, scoreRed, scoreBlue} = lastEvent.score;
        const time = state.passedTime.asString;


        const entry = document.createElement('div');
        entry.classList.add('score');
        entry.setAttribute('data-index', index.toString());

        entry.innerHTML = `
                <div>${time}</div>
                <div> ${type}</div>
                <div class="red"> red: ${scoreRed} </div>
                <div class="blue"> blue : ${scoreBlue}</div>
            `;
        this.historyContainer.appendChild(entry);
    }

    private renderHistoryEntry(state: SingleGameEvent, index: number) {
        const {lastEvent} = state;
        if (isTimeEvent(lastEvent)) return;
        if (isScoreEvent(lastEvent)) this.renderScoreEvent(state, lastEvent, index);
        if (isWarningEvent(lastEvent)) this.renderWarningEvent(state, lastEvent, index);

    }
}

customElements.define('match-history', MatchHistoryComponent);

