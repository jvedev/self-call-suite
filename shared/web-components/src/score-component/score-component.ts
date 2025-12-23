import html from "./score-component.html?raw"
import css from "./score-component.css?raw"
import {BaseComponent} from "../base-component/base-component.ts";
export type Player =  'red' | 'blue'

export class ScoreComponent extends BaseComponent {
    private _scoreOptions: number[] = [];

    public get scoreButtonPlaceholder(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.score-buttons')!;
    }

    public get hitButton(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.hit')!;
    }

    public get afterBlowButton(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.after-blow')!;
    }


    public get doubleButton(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.double')!;
    }

    public get noScoreButton(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.no-score')!;
    }

    public get unclearButton(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.unclear')!;
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
        this.scoreOptions.forEach((point:number) => {
            this.renderButton(point, 'red');
            this.renderButton(point, 'blue');
        })
    }

    renderButton(point: number, player: Player) {
        const button = document.createElement('button');
        button.className = `button ${player}`;
        button.innerHTML = `${point}`;
        button.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('score-selected', {
                detail: {
                    player,
                    point
                }
            }));
        });
        this.scoreButtonPlaceholder.appendChild(button);
    }


    connectedCallback() {

    }


}

customElements.define('score-component', ScoreComponent);
export default ScoreComponent;
