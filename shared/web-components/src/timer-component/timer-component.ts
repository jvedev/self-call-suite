import html from "./timer-component.html?raw"
import css from "./timer-component.css?raw"

type Modes = 'stop' | 'running' | 'pause' | 'edit' | 'ending';

export class TimerComponent extends HTMLElement {
    private minutes = 0;
    private seconds = 0;
    private duration = 0;
    private startTime = 0;
    private intervalId: any = null;

    set state(value: 'stopped' | 'running' | 'paused') {
        this.setAttribute('state', value);
    }

    get state(): 'stopped' | 'running' | 'paused' {
        return this.getAttribute('state') as 'stopped' | 'running' | 'paused'
    }

    public negative = -30;

    public ending = 15; // seconds for ending mode
    private sign: string = '';

    private get placeholder(): HTMLDivElement {
        return this.shadow.querySelector('.placeholder') as HTMLDivElement;

    }

    private shadow: ShadowRoot;

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
            this.shadow.querySelector(".placeholder")!.setAttribute("style", this.modeStyles[mode]);
        }
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.render();
        this.reflectState('stopped')
    }


    connectedCallback() {
        const bgColor = getComputedStyle(this).backgroundColor;
        const {placeholder} = this;
        placeholder.style.backgroundColor = bgColor;
        placeholder.addEventListener('dblclick', () => {
        });
        this.shadow.querySelector('.start')!.addEventListener('click', this.start.bind(this));
        this.shadow.querySelector('.pause')!.addEventListener('click', this.pause.bind(this));
        this.shadow.querySelector('.resume')!.addEventListener('click', this.resume.bind(this));
        this.shadow.querySelector('.edit')!.addEventListener('click', this.edit.bind(this));
        this.shadow.querySelector('.update')!.addEventListener('click', this.update.bind(this));

        // Add click handlers for adjusters
        this.shadow.querySelector('.adjust-minutes .increase')!
            .addEventListener('click', () => this.adjustSeconds(60));
        this.shadow.querySelector('.adjust-minutes .decrease')!
            .addEventListener('click', () => this.adjustSeconds(-60));
        this.shadow.querySelector('.adjust-seconds .increase')!
            .addEventListener('click', () => this.adjustSeconds(1));
        this.shadow.querySelector('.adjust-seconds .decrease')!
            .addEventListener('click', () => this.adjustSeconds(-1));
        this.startTime = this.duration;

        this.updateDisplay();
        this.reflectState('stopped');
    }

    public get passedTime(): string {
        const passed = this.startTime - this.duration;
        const min = Math.floor(passed / 60).toString().padStart(2, '0');
        const sec = (passed % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    }


    start() {
        this.reflectState('running');

        this.run();
    }

    public set(minutes: number, seconds: number) {
        this.duration = minutes * 60 + seconds;
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
        this.reflectState('paused')
        this.duration = this.minutes * 60 + this.seconds;
        this.updateDisplay()
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
        this.shadow.querySelector('.minutes')!.textContent = min;
        this.shadow.querySelector('.seconds')!.textContent = sec;
    }

    private render() {
        this.shadow.innerHTML = `<style>${css}</style>${html}`
    }


}

customElements.define('timer-component', TimerComponent);
export default TimerComponent;
