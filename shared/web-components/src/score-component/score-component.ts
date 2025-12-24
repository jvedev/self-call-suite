import html from "./score-component.html?raw"
import css from "./score-component.css?raw"
import {BaseComponent} from "../base-component/base-component.ts";
import {ScoreType} from "./score.types.ts";

export type Player = 'red' | 'blue'

export class ScoreComponent extends BaseComponent {
    private _scoreOptions: number[] = [];
    private scoreRed: number = 0;
    private scoreBlue: number = 0;
    // private get scoreRed():number{
    //     const selectedButton = this.scoreButtonPlaceholder.querySelector('.button.red.selected') as HTMLButtonElement;
    //     return selectedButton ? parseInt(selectedButton.innerHTML) : 0;
    // }
    // private get scoreBlue():number{
    //     const selectedButton = this.scoreButtonPlaceholder.querySelector('.button.blue.selected') as HTMLButtonElement;
    //     return selectedButton ? parseInt(selectedButton.innerHTML) : 0;
    // }
    public get scoreButtonPlaceholder(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.score-buttons')!;
    }

    public get hitButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.hit')!;
    }

    public get afterBlowButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.after-blow')!;
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
        this.afterBlowButton.disabled = true;
        this.hitButton.disabled = true;


        // Enable/disable buttons based on scores
        if (double) {
            this.doubleButton.disabled = false;
            this.afterBlowButton.disabled = false;
            return;
        }

        if (hit) {
            this.hitButton.disabled = false;
            ;
        }


    }

    connectedCallback() {
        this.hitButton.addEventListener('click', () => this.score('hit'), this.eventCleanup)
        this.doubleButton.addEventListener('click', () => this.score('double'), this.eventCleanup)
        this.afterBlowButton.addEventListener('click', () => this.score('after-blow'), this.eventCleanup)
        this.noScoreButton.addEventListener('click', () => this.score('no-score'), this.eventCleanup)
        this.unclearButton.addEventListener('click', () => this.score('unclear'), this.eventCleanup)
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
