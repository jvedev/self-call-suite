class TimerComponent extends HTMLElement {
    private minutes = 0;
    private seconds = 0;
    private duration = 0;
    private intervalId: any = null;
    private paused = true;
    private shadow: ShadowRoot;
    private editMode = false;

    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.shadow.querySelector('.timer')?.addEventListener('click', () => {
            if (this.paused) {
                this.resume();
            } else {
                this.pause();
            }
        });
        this.shadow.querySelector('.timer')?.addEventListener('dblclick', () => {
            this.setEditMode(true);
        });
        this.shadow.querySelector('.minutes')?.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            this.pause();
            this.setEditMode(true);
        });
        this.shadow.querySelector('.seconds')?.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            this.pause();
            this.setEditMode(true);
        });
    }

    disconnectedCallback() {
        this.pause();
    }

    set(minutes: number, seconds: number) {
        this.minutes = minutes;
        this.seconds = seconds;
        this.duration = minutes * 60 + seconds;
        this.updateDisplay();
    }

    start() {
        this.paused = false;
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

    resume() {
        if (!this.paused) return;
        this.paused = false;
        this.run();
    }

    setEditMode(on: boolean) {
        this.editMode = on;
        this.render();
        if (on) {
            this.shadow.querySelector('.timer')?.classList.add('editing');
        } else {
            this.shadow.querySelector('.timer')?.classList.remove('editing');
        }
        this.dispatchEvent(new CustomEvent('editmodechange', { detail: { editMode: on } }));
    }

    private run() {
        if (this.intervalId !== null) return;
        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    private tick() {
        if (this.paused) return;
        if (this.duration > 0) {
            this.duration--;
            this.minutes = Math.floor(this.duration / 60);
            this.seconds = this.duration % 60;
            this.updateDisplay();
        } else {
            this.pause();
        }
    }

    private updateDisplay() {
        const min = this.minutes.toString().padStart(2, '0');
        const sec = this.seconds.toString().padStart(2, '0');
        this.shadow.querySelector('.minutes')!.textContent = min;
        this.shadow.querySelector('.seconds')!.textContent = sec;
    }

    private render() {
        const flashing = this.paused && !this.editMode ? ' flashing' : '';
        this.shadow.innerHTML = `
        <style>
        .timer {
            font-size: 8em;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #0f172a;
            color: white;
            border-radius: 1em;
            user-select: none;
            cursor: pointer;
            position: relative;
            transition: opacity 0.7s;
            opacity: 1;
        }
        .timer.editing {
            outline: 2px solid #38bdf8;
        }
        @keyframes flash-blue-white {
            0% { color: #fff; }
            50% { color: #38bdf8; }
            100% { color: #fff; }
        }
        .digit {
            background-color: #0f172a;
            font-size: inherit;
            margin: 0;
            width: 45%;
            color: white;
            text-align: center;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .digit.flashing {
            animation: flash-blue-white 1.2s steps(1, end) infinite;
        }
        .divider {
            width: 10%;
            margin: .1em;
            text-align: center;
        }
        .edit-controls {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
        .edit-controls.left {
            left: -1.8em;
        }
        .edit-controls.right {
            right: -1.8em;
        }
        .edit-btn {
            background: #38bdf8;
            color: #0f172a;
            border: none;
            border-radius: 0.3em;
            width: 1.2em;
            height: 1.2em;
            font-size: 0.7em;
            margin: 0.1em 0;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }
        .edit-btn:active {
            background: #0ea5e9;
        }
        .ok-btn {
            background: #22c55e;
            color: white;
            border: none;
            border-radius: 0.5em;
            width: 2em;
            height: 2em;
            font-size: 1.2em;
            position: absolute;
            bottom: 0.7em;
            right: 0.7em;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px #0002;
            transition: background 0.2s;
        }
        .ok-btn:active {
            background: #16a34a;
        }
        </style>
        <div class="timer${this.editMode ? ' editing' : ''}">
            ${this.editMode ? `
            <span class="edit-controls left">
                <button class="edit-btn min-up" tabindex="0">▲</button>
                <button class="edit-btn min-down" tabindex="0">▼</button>
            </span>` : ''}
            <div class="digit minutes${flashing}">
                ${this.minutes.toString().padStart(2, '0')}
            </div>
            <div class="divider">:</div>
            <div class="digit seconds${flashing}">
                ${this.seconds.toString().padStart(2, '0')}
            </div>
            ${this.editMode ? `
            <span class="edit-controls right">
                <button class="edit-btn sec-up" tabindex="0">▲</button>
                <button class="edit-btn sec-down" tabindex="0">▼</button>
            </span>
            <button class="ok-btn" tabindex="0">&#10003;</button>
            ` : ''}
        </div>
        `;
        if (this.editMode) {
            this.shadow.querySelector('.min-up')?.addEventListener('click', () => this.changeValue('minutes', 1));
            this.shadow.querySelector('.min-down')?.addEventListener('click', () => this.changeValue('minutes', -1));
            this.shadow.querySelector('.sec-up')?.addEventListener('click', () => this.changeValue('seconds', 1));
            this.shadow.querySelector('.sec-down')?.addEventListener('click', () => this.changeValue('seconds', -1));
            this.shadow.querySelector('.ok-btn')?.addEventListener('click', () => {
                this.pause();
                this.setEditMode(false);
            });
        }
    }

    private changeValue(field: 'minutes' | 'seconds', delta: number) {
        if (field === 'minutes') {
            this.minutes = Math.max(0, Math.min(99, this.minutes + delta));
        } else {
            this.seconds = Math.max(0, Math.min(59, this.seconds + delta));
        }
        this.duration = this.minutes * 60 + this.seconds;
        this.render();
    }
}

customElements.define('timer-component', TimerComponent);
export default TimerComponent;
