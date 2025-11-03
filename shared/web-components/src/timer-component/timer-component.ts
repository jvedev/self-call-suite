import html from "./timer-component.html?raw"
import css from "./timer-component.css?raw"

type Modes = 'stop' | 'running' | 'pause' | 'edit' | 'ending';
export class TimerComponent extends HTMLElement {
    private minutes = 0;
    private seconds = 0;
    private duration = 0;
    private startTime = 0;
    private intervalId: any = null;
    private running: boolean = false;
    public negative = -30;

    public ending = 30; // seconds for ending mode
    private sign: string = '';

    private get placeholder(): HTMLDivElement {
        return this.shadow.querySelector('.placeholder') as HTMLDivElement;

    }
    private get paused(): boolean {
       return this.mode === 'pause';
    }
    private set paused(value: boolean) {
        if (value) {
            this.mode = 'pause';
        }
    }

    private shadow: ShadowRoot;

    public modeStyles:Record<Modes, string> = {
        'stop':'color:lightblue;',
        'running':'color:white;',
        'pause':'color:orange;',
        'edit':'color:lightblue;',
        'ending':'color:red;'
    }


    public set mode(value: Modes) {
        this.setAttribute("mode", value);
        this.applyModeStyle(value);
    }

    public get mode(): string {
        return this.getAttribute("mode") || 'stop';
    }

    private applyModeStyle(mode: Modes) {
        if(this.modeStyles[mode]){
            this.shadow.querySelector(".placeholder")!.setAttribute("style", this.modeStyles[mode]);
        }
    }

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
        this.mode = 'stop';
    }


    connectedCallback() {
        const bgColor = getComputedStyle(this).backgroundColor;
        const {placeholder} = this;
        placeholder.style.backgroundColor = bgColor;
        placeholder.addEventListener('dblclick', () => {});
        this.shadow.querySelector('.start')!.addEventListener('click', this.start.bind(this));
        this.shadow.querySelector('.pause')!.addEventListener('click', this.pause.bind(this));
        this.shadow.querySelector('.resume')!.addEventListener('click', this.resume.bind(this));
        this.shadow.querySelector('.edit')!.addEventListener('click', this.edit.bind(this));
        this.shadow.querySelector('.update')!.addEventListener('click',  this.update.bind(this));

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
        this.mode = 'stop'
    }

    public get passedTime(): string {
        const passed = this.startTime - this.duration;
        const min = Math.floor(passed / 60).toString().padStart(2, '0');
        const sec = (passed % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    }

    update() {
        if(this.running)return this.start()

        this.mode = 'stop'

        this.duration = this.minutes * 60 + this.seconds;
        this.updateSecondsAndMinutes()
        this.updateDisplay()
    }

    start() {
        this.running = true;
        this.mode = 'running';
        this.duration = this.minutes * 60 + this.seconds;

        this.tick();
        this.run();
    }

    pause() {
        this.paused = true;
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }


    public set(minutes: number, seconds: number) {
        this.duration = minutes * 60 + seconds;
        this.updateSecondsAndMinutes()
        this.updateDisplay();
    }

    resume() {
        if (!this.paused) return;
        this.start();
    }

    edit(){
        this.pause()
        this.mode="edit"
    }

    private run() {
        if (this.intervalId !== null) return;
        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    private adjustSeconds(number: number) {
        this.duration+=number;
        this.updateSecondsAndMinutes()
        this.updateDisplay();
    }

private updateSecondsAndMinutes(){

    const absSeconds = Math.abs(this.duration);
    this.sign = this.duration < 0 ? '-' : '';


    this.minutes =Math.floor(absSeconds / 60);
    this.seconds = Math.abs(absSeconds % 60);
}

    private tick() {
        if (this.paused) return;
        if (this.duration > this.negative) {
            this.duration--;
            this.updateSecondsAndMinutes()
            this.updateDisplay();
        } else {
            this.pause();
        }
    }

    private updateDisplay() {
        if(this.duration <= this.ending && this.mode !== 'edit') {
            this.mode = 'ending';
        }
        const min =this.sign + this.minutes.toString().padStart(2, '0');
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
