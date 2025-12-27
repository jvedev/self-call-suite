import html from "./timer-component.html?raw"
import css from "./timer-component.css?raw"
import {GameEvent, TimeTypes, timerState} from "@shared/types";
import {BaseComponent} from "../base-component/base-component.ts";


type Modes = 'stop' | 'running' | 'pause' | 'edit' | 'ending';

export class TimerComponent extends BaseComponent {
    private minutes = 0;
    private seconds = 0;
    private duration = 0;
    private startTime = 0;
    private intervalId: any = null;

    set state(value: timerState) {
        this.setAttribute('state', value);
    }

    get state(): timerState {
        return this.getAttribute('state') as timerState
    }

    public negative = -30;

    public ending = 15; // seconds for ending mode
    private sign: string = '';

    private get placeholder(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.placeholder');

    }


    public modeStyles: Record<Modes, string> = {
        'stop': 'color:lightblue;',
        'running': 'color:white;',
        'pause': 'color:orange;',
        'edit': 'color:lightblue;',
        'ending': 'color:red;'
    }


    public set mode(value: Modes) {
        this.setAttribute("mode", value);
        this.applyModeStyle(value);
    }

    public get mode(): string {
        return this.getAttribute("mode") || 'stop';
    }

    private applyModeStyle(mode: Modes) {
        if (this.modeStyles[mode]) {
            this.placeholder.setAttribute("style", this.modeStyles[mode]);
        }
    }

    constructor() {
        super();

        this.render(css, html);
        this.reflectState('stopped')
    }


    connectedCallback() {
        const bgColor = getComputedStyle(this).backgroundColor;
        const {placeholder} = this;
        placeholder.style.backgroundColor = bgColor;
        this.queryRoot<HTMLDivElement>('.start').addEventListener('click', this.start.bind(this), this.eventCleanup);
        this.queryRoot<HTMLDivElement>('.pause').addEventListener('click', this.pause.bind(this), this.eventCleanup);
        this.queryRoot<HTMLDivElement>('.resume').addEventListener('click', this.resume.bind(this), this.eventCleanup);
        this.queryRoot<HTMLDivElement>('.edit').addEventListener('click', this.edit.bind(this), this.eventCleanup);
        this.queryRoot<HTMLDivElement>('.update').addEventListener('click', this.update.bind(this), this.eventCleanup);

        // Add click handlers for adjusters
        this.queryRoot<HTMLDivElement>('.adjust-minutes .increase')!
            .addEventListener('click', () => this.adjustSeconds(60), this.eventCleanup);
        this.queryRoot<HTMLDivElement>('.adjust-minutes .decrease')!
            .addEventListener('click', () => this.adjustSeconds(-60), this.eventCleanup);
        this.queryRoot<HTMLDivElement>('.adjust-seconds .increase')!
            .addEventListener('click', () => this.adjustSeconds(1), this.eventCleanup);
        this.queryRoot<HTMLDivElement>('.adjust-seconds .decrease')!
            .addEventListener('click', () => this.adjustSeconds(-1), this.eventCleanup);
        this.startTime = this.duration;

        this.updateDisplay();
        this.reflectState('stopped');
    }

    public get passedTime(): TimeTypes {
        const passed = this.startTime - this.duration;

        const minutes = Math.floor(passed / 60);
        const min = minutes.toString().padStart(2, '0');
        const seconds = (passed % 60)
        const sec = seconds.toString().padStart(2, '0');
        return {minutes, seconds, asString: `${min}:${sec}`};
    }


    start() {
        this.reflectState('running');

        this.run();
    }

    public set(minutes: number, seconds: number) {
        this.duration = minutes * 60 + seconds;
        this.startTime = this.duration;
        this.updateDisplay();
    }

    pause() {
        this.reflectState('paused');

        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }


    resume() {
        this.reflectState('running');
        this.run();
    }

    edit() {
        this.pause()
        this.mode = "edit"
    }

    reflectState(state?: 'running' | 'paused' | 'stopped') {
        if (state) {
            this.state = state
        }
        switch (this.state) {
            case 'running':
                this.mode = this.duration <= this.ending ? 'ending' : 'running';
                break;
            case 'paused':
                this.mode = 'pause';
                break;
            case 'stopped':
                this.mode = 'stop';
                break;
        }
    }


    update() {
        this.duration = this.minutes * 60 + this.seconds;
        this.updateDisplay();
        this.reflectState('running');
        this.run()
    }

    private run() {
        if (this.intervalId !== null) return;
        this.tick();
        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    private adjustSeconds(number: number) {
        this.duration += number;
        this.updateDisplay();
    }

    private updateSecondsAndMinutes() {
        const absSeconds = Math.abs(this.duration);
        this.sign = this.duration < 0 ? '-' : '';
        this.minutes = Math.floor(absSeconds / 60);
        this.seconds = Math.abs(absSeconds % 60);
    }

    private tick() {
        const details: GameEvent = {
            type: 'time',
            time: this.passedTime,
            state: this.state
        }
        this.dispatchCustomEvent("tick", {details});
        //no ticks when paused.
        if (this.state == 'paused') return;

        //stop at negative limit
        if (this.duration < this.negative) {
            this.pause();
            return;
        }

        //decrease duration and update display
        this.duration--;

        this.updateDisplay();

    }

    private updateDisplay() {
        this.updateSecondsAndMinutes()
        if (this.duration <= this.ending && this.mode !== 'edit') {
            this.mode = 'ending';
        }
        const min = this.sign + this.minutes.toString().padStart(2, '0');
        const sec = this.seconds.toString().padStart(2, '0');
        this.queryRoot<HTMLDivElement>('.minutes')!.textContent = min;
        this.queryRoot<HTMLDivElement>('.seconds')!.textContent = sec;
    }


}

customElements.define('timer-component', TimerComponent);
export default TimerComponent;
