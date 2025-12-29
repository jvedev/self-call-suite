import html from "./call-out.html?raw"
import css from "./call-out.css?raw"
import {BaseComponent} from "../../base-component/base-component.ts";
import {Score, ScoreEvent, WarningEvent} from "@shared/types";



export class CallOut extends BaseComponent {

    get callOut(): HTMLElement {
        return this.queryRoot('.call-out')
    }

    get okButton(): HTMLButtonElement {
        return this.queryRoot<HTMLButtonElement>('.ok')
    }

    constructor() {
        super()
        this.render(css, html)
    }

    set warning(warning: WarningEvent) {
        this.callOut.innerHTML = ""
        const {player, warning: warningText, penalty} = warning
        const point = penalty > 1 ? 'points' : 'point'
        const penaltyText = penalty > 0 ? `penalty ${penalty} ${point}` : 'No penalty'
        this.callOut.innerHTML = `Warning <span class="${player}">${player?.toUpperCase()}</span> ${warningText}<br>${penaltyText} `
    }

    callOutHit(score: Score, player: 'red' | 'blue'): string {
        if (score === 'low-quality' ) {
            return `No points <span class="text-${player}">${player.toUpperCase()}</span> <br> (Low Quality)`
        }
        if (score == 1) {
            return `${score} point <span class="text-${player}">${player.toUpperCase()}</span>`
        }

        return `${score} points <span class="text-${player}">${player.toUpperCase()}</span>`

    }

    set score(score: ScoreEvent) {
        this.callOut.innerHTML = ""
        const {type, scoreRed, scoreBlue} = score

        switch (type) {
            case 'no-score':
                this.callOut.innerHTML = `No Score`
                return;
            case 'unclear':
                this.callOut.innerHTML = `No Score`
                return;
            case 'hit': //single hit by one person
                if (!scoreBlue) { //red scores
                    this.callOut.innerHTML = this.callOutHit(scoreRed, 'red')
                    return;
                }
                if(scoreBlue =="low-quality"){
                    this.callOut.innerHTML = this.callOutHit(scoreBlue, 'blue')
                    return;
                }
                //blue scores
                this.callOut.innerHTML = this.callOutHit(scoreBlue, 'blue')
                return;
            case 'double': //both score
                this.callOut.innerHTML = "Double hit<br><br>"
                this.callOut.innerHTML += this.callOutHit(scoreRed, 'red')
                this.callOut.innerHTML += '<br><br>'
                this.callOut.innerHTML += this.callOutHit(scoreBlue, 'blue')
                return;
            case "blue-first":
                this.callOut.innerHTML = ` After blow <span class="text-red">RED</span><br><br>`
                this.callOut.innerHTML += this.callOutHit(scoreRed, 'red')
                this.callOut.innerHTML += '<br><br>'
                this.callOut.innerHTML += this.callOutHit(scoreBlue, 'blue')
                return;
            case "red-first":
                this.callOut.innerHTML = `After blow <span class="text-blue">BLUE</span><br><br>`
                this.callOut.innerHTML += this.callOutHit(scoreRed, 'red')
                this.callOut.innerHTML += '<br><br>'
                this.callOut.innerHTML += this.callOutHit(scoreBlue, 'blue')
                return;
        }
    }


    connectedCallback() {
    }
}

customElements.define('call-out', CallOut);

