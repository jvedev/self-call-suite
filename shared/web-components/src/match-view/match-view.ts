import html from "./match-view.html?raw"
import css from "./match-view.css?raw"
import {BaseComponent} from "../base-component/base-component.ts";
import {TimerComponent} from "../timer-component/timer-component.ts";
import {ScoreComponent} from "../score-component/score-component.ts";
import {WarningComponent} from "../warning-component/warning-component.ts";

export class MatchViewComponent extends BaseComponent {

    public set playerRed(name: string) {
        const el = this.queryRoot<HTMLElement>('.player.red .name');
        el.textContent = name;
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

    public get main ():HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.main-view');
    }
    public get timer(): TimerComponent {
        return this.queryRoot<TimerComponent>('timer-component');
    }

    public get score(): ScoreComponent{
        return this.queryRoot<ScoreComponent>('score-component');
    }

    public get warning(): WarningComponent  {
        return this.queryRoot<WarningComponent>('warning-component');
    }

    public get hitButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('#hit');
    }

    public get warningButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('#warning');
    }

    public get timeoutButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('#timeout');
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
        this.timeoutButton.addEventListener('click', this.pause.bind(this), this.eventCleanup)
        this.hitButton.addEventListener('click', this.showScore.bind(this), this.eventCleanup)
        window.addEventListener('game-event', this.gameEvent.bind(this), this.eventCleanup)
    }

    gameEvent(event: Event) {
        const {detail} = event as CustomEvent;
        debugger;
        if(detail.type=='score') {
            this.scoreRed += detail.scoreRed;
            this.scoreBlue += detail.scoreBlue;
        }
        this.main.style.display = '';
        this.score.style.display = 'none';
        console.log('Game event', detail);
    }


    showScore(){
        this.main.style.display = 'none';
        this.score.style.display = 'block';
    }
    pause(){
        //check if the timer is allready paused
        if(this.timer.mode=='pause'){
            this.timer.resume()
            this.timeoutButton.innerText = 'Timeout'
            return;
        }
        this.timer.pause()
        this.timeoutButton.innerText = 'Resume'

    }



}

customElements.define('match-view', MatchViewComponent);

