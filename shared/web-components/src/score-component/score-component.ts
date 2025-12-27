import html from "./score-component.html?raw"
import css from "./score-component.css?raw"
import {BaseComponent} from "../base-component/base-component.ts";
import {ScoreType} from "./score.types.ts";

export type Player = 'red' | 'blue'

export class ScoreComponent extends BaseComponent {
    private _scoreOptions: number[] = [];
    private scoreRed: number = 0;
    private scoreBlue: number = 0;

    public get scoreButtonPlaceholder(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.score-buttons')!;
    }

    public get backButton(){
        return this.queryRoot<HTMLButtonElement>('.back');
    }

    public get hitButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.hit');
    }

    public get redFirst(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.score-types .red');
    }


    public get blueFirst(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.score-types .blue');
    }

    public get doubleButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.double')!;
    }

    public get noScoreButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.no-score')!;
    }

    public get unclearButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.unclear')!;
    }

    public get scoreOptions(): number[] {
        return this._scoreOptions;
    }

    public set scoreOptions(options: number[]) {
        this._scoreOptions = options
        this.renderScoreButtons()
    }

    constructor() {
        super();
        this.render(css, html);
    }

    renderScoreButtons() {
        this.scoreOptions.forEach((point: number) => {
            this.renderButton(point, 'red');
            this.renderButton(point, 'blue');
        })
    }

    renderButton(point: number, player: Player) {
        const button = document.createElement('button');
        button.className = `button ${player}`;
        button.innerHTML = `${point}`;
        button.setAttribute('data-points', point.toString());
        button.addEventListener('click', () => {
            this.scoreButtonSelected(point, player);
        });
        this.scoreButtonPlaceholder.appendChild(button);


    }

    deselectAllButtons() {
        const buttons = this.scoreButtonPlaceholder.querySelectorAll('.button');
        buttons.forEach((btn) => {
            (btn as HTMLButtonElement).classList.remove('selected');
        });
    }

    scoreButtonSelected(point: number, player: Player) {
        //check if the clicked button is selected already
        //if so set the

        this.deselectAllButtons()
        if (player === 'red') {
            this.scoreRed = (this.scoreRed === point) ? 0 : point;


        }
        if (player === 'blue') {
            this.scoreBlue = (this.scoreBlue === point) ? 0 : point;

        }

        if (this.scoreBlue) {
            const redButton = this.queryRoot<HTMLButtonElement>(`.blue[data-points='${this.scoreBlue}']`)
            if (redButton) {
                redButton.classList.add('selected');
            }
        }
        if (this.scoreRed) {
            const blueButton = this.queryRoot<HTMLButtonElement>(`.red[data-points='${this.scoreRed}']`)

            if (blueButton) {
                blueButton.classList.add('selected');
            }
        }
        this.setButtons()
    }

    setButtons() {
        const {scoreRed, scoreBlue} = this;
        const double = (scoreRed > 0 && scoreBlue > 0)
        const hit = !double && (scoreRed > 0 || scoreBlue > 0)
        // set all buttons to disabled
        this.doubleButton.disabled = true;
        this.redFirst.disabled = true;
        this.blueFirst.disabled = true;
        this.hitButton.disabled = true;


        // Enable/disable buttons based on scores
        if (double) {
            this.doubleButton.disabled = false;
            this.redFirst.disabled = false;
            this.blueFirst.disabled = false;
            return;
        }

        if (hit) {
            this.hitButton.disabled = false;
        }
    }

    connectedCallback() {
        this.hitButton.addEventListener('click', () => this.score('hit'), this.eventCleanup)
        this.doubleButton.addEventListener('click', () => this.score('double'), this.eventCleanup)
        this.redFirst.addEventListener('click', () => this.score('red-first'), this.eventCleanup)
        this.blueFirst.addEventListener('click', () => this.score('blue-first'), this.eventCleanup)
        this.noScoreButton.addEventListener('click', () => this.score('no-score'), this.eventCleanup)
        this.unclearButton.addEventListener('click', () => this.score('unclear'), this.eventCleanup)
        this.backButton.addEventListener('click' ,()=>this.dispatchCustomEvent("back"), this.eventCleanup)
    }

    score(type: ScoreType) {
        //dispatch a game-event with the warning details on window level
        if (['no-score', 'unclear'].includes(type)) {
            this.scoreRed = 0;
            this.scoreBlue = 0;
        }
        const detail = {
            type: 'score',
            scoreType: type,
            scoreRed: this.scoreRed,
            scoreBlue: this.scoreBlue,
        };
        //dispatch a custom event on window
        window.dispatchEvent(new CustomEvent('game-event', {detail}));
        this.scoreRed = 0;
        this.scoreBlue = 0;
        this.deselectAllButtons();
        this.setButtons()
    }

}

customElements.define('score-component', ScoreComponent);
export default ScoreComponent;
