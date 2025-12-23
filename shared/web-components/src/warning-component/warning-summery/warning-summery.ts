import html from "./warning-summery.html?raw"
import css from "./warning-summery.css?raw"
import {BaseComponent} from "../../base-component/base-component.ts";

type Warning = {
    description: string;
    minPenalty: number;
    maxPenalty: number
}


export default class WarningSummery extends BaseComponent {

    public set warning(warning: Warning) {
        this.queryRoot<HTMLDivElement>(".warning").innerHTML = warning.description;
    }
    public set player(name: string) {
        const playerDiv = this.queryRoot<HTMLDivElement>(".player")
        playerDiv.innerHTML = name;
        playerDiv.className = `player text-${name}`;
    }

    public set penalty(penalty: number) {
        this.queryRoot<HTMLDivElement>(".penalty").innerHTML = penalty.toString();
    }

    get placeholder(): HTMLDivElement {
        return this.queryRoot<HTMLDivElement>('.placeholder') ;
    }



    constructor() {
        super();
        this.render(css, html);
    }

}

customElements.define('warning-summery', WarningSummery);
