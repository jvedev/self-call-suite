import html from "./match-view.html?raw"
import css from "./match-view.css?raw"
import {BaseComponent} from "../base-component/base-component.ts";
import {TimerComponent} from "../timer-component/timer-component.ts";
import {ScoreComponent} from "../score-component/score-component.ts";
import {WarningComponent} from "../warning-component/warning-component.ts";
import {CallOut} from "./call-out/call-out.ts";
import {AppSettings} from "../../../modules/AppSettings.ts";
import {AllEvents,  ScoreEvent} from "@shared/types";
import {MatchHistoryComponent} from "../match-history/match-history.ts";
import {SingleGameEvent} from "@shared/types";

export class MatchViewComponent extends BaseComponent {

    public settings: Pick<AppSettings, 'calloutOnScore'> = {
        calloutOnScore: true,
    };
    public set playerRed(name: string) {
        const el = this.queryRoot<HTMLElement>('.player.red .name');
        el.textContent = name;
    }

    public get playerRed(): string {
        const el = this.queryRoot<HTMLElement>('.player.red .name');
        return el.textContent;
    }

    public get playerBlue(): string {
        const el = this.queryRoot<HTMLElement>('.player.blue .name');
        return el.textContent;
    }

    public set playerBlue(name: string) {
        const el = this.queryRoot<HTMLElement>('.player.blue .name');
        el.textContent = name;
    }

    set scoreRed(nr: number) {
        const el = this.queryRoot<HTMLElement>('.player.red .score');
        el.textContent = nr.toString();
    }

    get scoreRed(): number {
        const el = this.queryRoot<HTMLElement>('.player.red .score');
        return parseInt(el.textContent);
    }

    set scoreBlue(nr: number) {
        const el = this.queryRoot<HTMLElement>('.player.blue .score');
        el.textContent = nr.toString();
    }

    get scoreBlue(): number {
        const el = this.queryRoot<HTMLElement>('.player.blue .score');
        return parseInt(el.textContent);
    }

    public get main(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.main-view');
    }

    public get timer(): TimerComponent {
        return this.queryRoot<TimerComponent>('timer-component');
    }

    public get score(): ScoreComponent {
        return this.queryRoot<ScoreComponent>('score-component');
    }

    public get warning(): WarningComponent {
        return this.queryRoot<WarningComponent>('warning-component');
    }

    public get history(): MatchHistoryComponent {
        return this.queryRoot<MatchHistoryComponent>('#match-history');
    }



    public get callOut(): CallOut {
        return this.queryRoot<CallOut>('call-out');
    }

    public get hitButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('#hit');
    }

    public get warningButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('#warning');
    }

    public get historyButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('#history');
    }

    public get extentButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('#extent');
    }

    public get stopButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('#stop');
    }

    constructor() {
        super()
        this.render(css, html)
    }

    connectedCallback() {
        this.timer.addEventListener("tick", () => this.updateGameState('time'), this.eventCleanup);
        this.historyButton.addEventListener('click', this.showHistory.bind(this), this.eventCleanup)
        this.hitButton.addEventListener('click', this.showScore.bind(this), this.eventCleanup)
        this.warningButton.addEventListener('click', this.showWarning.bind(this), this.eventCleanup)
        this.warning.addEventListener('back', this.showMain.bind(this), this.eventCleanup)
        this.score.addEventListener('back', this.showMain.bind(this), this.eventCleanup)
        this.callOut.addEventListener('click', this.showMain.bind(this), this.eventCleanup)
        window.addEventListener('game-event', this.gameEvent.bind(this), this.eventCleanup)
    }

    gameEvent(event: Event) {
        const {detail} = event as CustomEvent;
        if (detail.type == 'score') {
            const score = detail.score as ScoreEvent;
            if(score.scoreRed!=='low-quality') {
                this.scoreRed += score.scoreRed;
            }
            if(score.scoreBlue!=='low-quality') {
                this.scoreBlue += score.scoreBlue;
            }

            if(this.settings.calloutOnScore){
                this.callOut.score = score;
                this.showCallOut()
                this.updateGameState(detail)
                return;
            }
        }

        if (detail.type == 'warning') {
            const {player, penalty} = detail;
            if (penalty) {
                if (player == 'blue') {
                    this.scoreBlue -= penalty;
                }
                if (player == 'red') {
                    this.scoreRed -= penalty;
                }
            }
        }
        this.updateGameState(detail)
        this.showMain()
    }

    hideAll() {
        this.main.style.display = 'none';
        this.warning.style.display = 'none';
        this.score.style.display = 'none';
        this.callOut.style.display = 'none';
        this.history.style.display = 'none';
    }

    showMain() {
        this.hideAll()
        this.main.style.display = '';
    }

    showWarning() {
        this.hideAll()
        this.warning.style.display = 'block';

    }

    showCallOut() {
        this.hideAll()
        this.callOut.style.display = 'block';
    }

    showScore() {
        this.hideAll()
        this.score.style.display = 'block';
    }

    showHistory() {
        this.hideAll()
        this.history.style.display = 'block';
    }



    updateGameState(gameEvent:AllEvents):void{


        const {scoreRed, scoreBlue, playerRed, playerBlue} = this;
        const {state, passedTime} = this.timer;
        const detail:SingleGameEvent= {
            scoreRed,
            scoreBlue,
            playerRed,
            playerBlue,
            state,
            passedTime,
            lastEvent:gameEvent
        }
        window.dispatchEvent(new CustomEvent('state-change', {detail}));

    }
}

customElements.define('match-view', MatchViewComponent);

