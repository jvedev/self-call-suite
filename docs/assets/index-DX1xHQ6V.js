(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=e(r);fetch(r.href,i)}})();const p=`/* variables */\r
:host{\r
    --green: green;\r
    --red: red;\r
    --blue: blue;\r
}\r
\r
.button {\r
    color: inherit;\r
    cursor: pointer;\r
    font-size: 2rem;\r
    border-radius: 0.5rem;\r
    border-color: transparent;\r
    &:disabled {\r
        cursor: default;\r
        opacity: 0.6;\r
    }\r
}\r
\r
.red {\r
    background-color: var(--red);\r
    color: black;\r
}\r
\r
.blue {\r
    background-color: var(--blue);\r
}\r
\r
.green{\r
    background-color: var(--green);\r
}\r
.orange{\r
    background-color: orange;\r
    color: black;\r
}\r
\r
.yellow{\r
    background-color: yellow;\r
    color: black;\r
}\r
\r
.text-red {\r
    color: var(--red);\r
}\r
.text-blue {\r
    color: var(--blue);\r
}\r
`;class l extends HTMLElement{constructor(){super(),this.abortController=new AbortController,this.signal=this.abortController.signal,this.eventCleanup={signal:this.signal};const t=new CSSStyleSheet;t.replaceSync(p),this.attachShadow({mode:"open"}),this.root.adoptedStyleSheets=[t]}get placeHolder(){return this.queryRoot(".placeholder")}getParentHost(){return this.root.host}get root(){if(!this.shadowRoot)throw new Error("SubProcedureToken has no shadowRoot.");return this.shadowRoot}disconnectedCallback(){this.abortController.abort(),this.resizeObserver?.disconnect()}render(t="",e=""){this.root.innerHTML=`<style>
                ${t}
             </style>
             ${e}`}queryRoot(t){const e=this.root.querySelector(t);if(!e)throw new Error(`Element not found for query ${t}`);return e}dispatchCustomEvent(t,e){this.dispatchEvent(new CustomEvent(t,{detail:e}))}queryRootAll(t){return this.root.querySelectorAll(t)}}class g extends HTMLElement{static get observedAttributes(){return["path"]}get path(){return this.getAttribute("path")||""}connectedCallback(){this.style.display="none"}}class m extends l{render(){throw new Error("Method not implemented.")}attachEventListeners(){throw new Error("Method not implemented.")}removeEventListeners(){throw new Error("Method not implemented.")}constructor(){super(),this.observer=new MutationObserver(()=>this.updateRoute())}connectedCallback(){window.addEventListener("popstate",()=>this.updateRoute()),this.observer.observe(this,{childList:!0,subtree:!0}),this.updateRoute()}disconnectedCallback(){window.removeEventListener("popstate",()=>this.updateRoute()),this.observer.disconnect()}updateRoute(){const t=window.location.pathname;let e=!1;if(Array.from(this.querySelectorAll("view-route, .route-404")).forEach(r=>{r.path===t?(r.style.display="",e=!0):r.style.display="none"}),e)return e;this.show404()}show404(){let t=this.querySelector(".route-404");t||(t=document.createElement("div"),t.textContent="404 Not Found",t.className="route-404",this.appendChild(t)),t.style.display=""}}customElements.define("app-router",m);customElements.define("view-route",g);const y=`<div class="placeholder" mode="stop">\r
    <div class="minutes clock">20</div>\r
    <div class="adjuster adjust-minutes">\r
        <button class="increase">▲</button>\r
        <button class="decrease">▼</button>\r
    </div>\r
    <div class="divider clock">:</div>\r
    <div class="seconds clock">34</div>\r
    <div class="adjuster adjust-seconds">\r
        <button class="increase">▲</button>\r
        <button class="decrease">▼</button>\r
    </div>\r
    <button class="update">OK</button>\r
    <div class="controls">\r
        <button class="start">Start</button>\r
        <button class="pause">Timeout</button>\r
        <button class="resume">Resume</button>\r
        <button class="edit">Edit</button>\r
    </div>\r
</div>\r
\r
`,b=`button {\r
    background-color: transparent;\r
    color: inherit;\r
    cursor: pointer;\r
    font-size: 2rem;\r
    border-radius: 0.5rem;\r
    border-color: transparent;\r
}\r
\r
.start {\r
    background-color: green;\r
    color: white;\r
}\r
\r
.pause{\r
    background-color: orange;\r
    color: black;\r
}\r
\r
.resume{\r
    display:none;\r
    background-color: orange;\r
    color: black;\r
}\r
\r
.edit{\r
    background-color: blue;\r
    color: white;\r
}\r
\r
:host {\r
\r
    display: block;\r
    container-type: size;\r
    box-sizing: border-box;\r
    inline-size: 100%;\r
    height: 3em;\r
    width: 100%;\r
    min-height: 0;\r
    min-width: 0;\r
\r
    font-size: clamp(12px, 8vw + 0.5rem, 50px);\r
\r
\r
\r
    .placeholder{\r
        .update,\r
        .adjuster {\r
            display:none;\r
        }\r
\r
        .controls{\r
            display:grid;\r
            grid-column: 1 / -1;\r
            grid-template-columns: 1fr 1fr;\r
            grid-gap: 1rem;\r
        }\r
        padding:.3rem;\r
        background-color: inherit;\r
        display:grid;\r
        grid-template-columns: 1fr 3rem 1fr;\r
        grid-template-rows: 1fr 3rem;\r
        .clock{\r
            font-size: 3em;\r
        }\r
        div {\r
            text-align: center;\r
            font-weight: bold;\r
        }\r
\r
\r
        .resume{\r
            display:none;\r
        }\r
\r
    }\r
\r
\r
}\r
\r
:Host([state="paused"]) {\r
    .edit,\r
    .resume{\r
        display:block;\r
    }\r
\r
    .pause,\r
    .start{\r
        display:none;\r
    }\r
\r
}\r
\r
:Host([state="running"]) {\r
    .edit,\r
    .pause{\r
        display:block;\r
    }\r
    .start,\r
\r
    .resume{\r
        display:none;\r
    }\r
\r
}\r
\r
:host([state="stopped"]) {\r
    .edit,\r
    .start{\r
        display:block;\r
    }\r
    .pause,\r
    .resume{\r
        display:none;\r
    }\r
}\r
\r
\r
:host([mode="edit"]) {\r
\r
    .placeholder{\r
      grid-template-columns: 1fr auto 1fr auto;\r
\r
        .adjuster {\r
            display:grid;\r
            grid-template-rows: 1fr 1fr;\r
            background-color: transparent;\r
            button {\r
                font-size: 2rem;\r
                background-color: transparent;\r
                border:none;\r
                color: inherit;\r
                cursor: pointer;\r
\r
                &.increase{\r
                    padding-top:1rem;\r
                }\r
\r
                &.decrease{\r
                    padding-bottom:1rem;\r
                }\r
            }\r
\r
        }\r
        .update {\r
            font-family:   monospace, sans-serif;\r
            background-color: green;\r
            font-size: 2rem;\r
            color: white;\r
\r
            display:block;\r
            /* span all columns */\r
            grid-column: 1 / -1;\r
        }\r
        .controls{\r
\r
            display:none;\r
        }\r
        .divider{\r
            display:none;\r
        }\r
    }\r
}`;class w extends l{constructor(){super(),this.minutes=0,this.seconds=0,this.duration=0,this.startTime=0,this.intervalId=null,this.negative=-30,this.ending=15,this.sign="",this.modeStyles={stop:"color:lightblue;",running:"color:white;",pause:"color:orange;",edit:"color:lightblue;",ending:"color:red;"},this.render(b,y),this.reflectState("stopped")}set state(t){this.setAttribute("state",t)}get state(){return this.getAttribute("state")}get placeholder(){return this.queryRoot(".placeholder")}set mode(t){this.setAttribute("mode",t),this.applyModeStyle(t)}get mode(){return this.getAttribute("mode")||"stop"}applyModeStyle(t){this.modeStyles[t]&&this.placeholder.setAttribute("style",this.modeStyles[t])}connectedCallback(){const t=getComputedStyle(this).backgroundColor,{placeholder:e}=this;e.style.backgroundColor=t,this.queryRoot(".start").addEventListener("click",this.start.bind(this),this.eventCleanup),this.queryRoot(".pause").addEventListener("click",this.pause.bind(this),this.eventCleanup),this.queryRoot(".resume").addEventListener("click",this.resume.bind(this),this.eventCleanup),this.queryRoot(".edit").addEventListener("click",this.edit.bind(this),this.eventCleanup),this.queryRoot(".update").addEventListener("click",this.update.bind(this),this.eventCleanup),this.queryRoot(".adjust-minutes .increase").addEventListener("click",()=>this.adjustSeconds(60),this.eventCleanup),this.queryRoot(".adjust-minutes .decrease").addEventListener("click",()=>this.adjustSeconds(-60),this.eventCleanup),this.queryRoot(".adjust-seconds .increase").addEventListener("click",()=>this.adjustSeconds(1),this.eventCleanup),this.queryRoot(".adjust-seconds .decrease").addEventListener("click",()=>this.adjustSeconds(-1),this.eventCleanup),this.startTime=this.duration,this.updateDisplay(),this.reflectState("stopped")}get passedTime(){const t=this.startTime-this.duration,e=Math.floor(t/60),n=e.toString().padStart(2,"0"),r=t%60,i=r.toString().padStart(2,"0");return{minutes:e,seconds:r,asString:`${n}:${i}`}}start(){this.reflectState("running"),this.run()}set(t,e){this.duration=t*60+e,this.startTime=this.duration,this.updateDisplay()}pause(){this.reflectState("paused"),this.intervalId!==null&&(clearInterval(this.intervalId),this.intervalId=null)}resume(){this.reflectState("running"),this.run()}edit(){this.pause(),this.mode="edit"}reflectState(t){switch(t&&(this.state=t),this.state){case"running":this.mode=this.duration<=this.ending?"ending":"running";break;case"paused":this.mode="pause";break;case"stopped":this.mode="stop";break}}update(){this.duration=this.minutes*60+this.seconds,this.updateDisplay(),this.reflectState("running"),this.run()}run(){this.intervalId===null&&(this.tick(),this.intervalId=setInterval(()=>this.tick(),1e3))}adjustSeconds(t){this.duration+=t,this.updateDisplay()}updateSecondsAndMinutes(){const t=Math.abs(this.duration);this.sign=this.duration<0?"-":"",this.minutes=Math.floor(t/60),this.seconds=Math.abs(t%60)}tick(){const t={type:"time",time:this.passedTime,state:this.state};if(this.dispatchCustomEvent("tick",{details:t}),this.state!="paused"){if(this.duration<this.negative){this.pause();return}this.duration--,this.updateDisplay(),this.dispatchCustomEvent("tick",{details:t})}}updateDisplay(){this.updateSecondsAndMinutes(),this.duration<=this.ending&&this.mode!=="edit"&&(this.mode="ending");const t=this.sign+this.minutes.toString().padStart(2,"0"),e=this.seconds.toString().padStart(2,"0");this.queryRoot(".minutes").textContent=t,this.queryRoot(".seconds").textContent=e}}customElements.define("timer-component",w);const v=`<div class="placeholder" >\r
    <div class="instructions"></div>\r
    <warning-player></warning-player>\r
    <warning-selector></warning-selector>\r
    <warning-deduction></warning-deduction>\r
    <warning-summery></warning-summery>\r
\r
    <div class="controls">\r
        <button class="back button blue" >back</button>\r
        <button class="cancel button green">cancel</button>\r
        <button class="confirm button" disabled="disabled">ok</button>\r
    </div>\r
</div>\r
\r
`,f=`:host {\r
    display: block;\r
    height: 100vh;\r
    box-sizing: border-box;\r
    inline-size: 100%;\r
    width: 100%;\r
    min-height: 0;\r
    min-width: 0;\r
    container-type: size;\r
    font-size: clamp(12px, 8vw + 0.5rem, 50px);\r
\r
    .placeholder {\r
        height: 100%;\r
        /*height: calc(100% - 2rem);*/\r
        box-sizing: border-box;\r
        display: grid;\r
        grid-template-rows: 2em 1fr 1.2em ;\r
        grid-gap: 1rem;\r
        padding:.5em;\r
\r
\r
        .instructions {\r
            padding-top: 1.5rem;\r
            font-size: .8em;\r
            text-align: center;\r
\r
            span{\r
                font-weight: bold;\r
                padding-left: 1em;\r
                padding-right: 1em;\r
\r
            }\r
        }\r
\r
\r
        .description {\r
            font-size: 1.5rem;\r
        }\r
\r
        .controls{\r
            display: grid;\r
            grid-template-columns: 1fr 1fr 1fr;\r
            grid-gap: 1rem;\r
\r
            button.confirm:not(:disabled){\r
                background-color: var(--green);\r
                color: black;\r
            }\r
\r
        }\r
    }\r
\r
\r
\r
}\r
\r
\r
\r
\r
`;class k extends l{constructor(){super(),this._stage="player",this.render(f,v)}get warning(){return this.warningSelector.warning}set warning(t){this.warningSelector.warning=t}get player(){return this.playerSelector.player}set player(t){this.playerSelector.player=t}set penalty(t){this.warningDeduction.penalty=t}get penalty(){return this.warningDeduction.penalty}set stage(t){this._stage=t,this.stageChanged()}get stage(){return this._stage}get warningSelector(){return this.queryRoot("warning-selector")}get summery(){return this.queryRoot("warning-summery")}get playerSelector(){return this.queryRoot("warning-player")}get warningDeduction(){return this.queryRoot("warning-deduction")}get cancelButton(){return this.queryRoot(".cancel")}get backButton(){return this.queryRoot(".back")}get confirmButton(){return this.queryRoot(".confirm")}set warnings(t){this.warningSelector.warnings=t}set instructions(t){this.queryRoot(".instructions").innerHTML=t}back(){switch(this.stage){case"player":this.dispatchCustomEvent("back");return;case"warning":this.stage="player";return;case"deduction":this.stage="warning";return;case"summery":this.stage="deduction";return}}stageChanged(){this.warningDeduction.style.display="none",this.playerSelector.style.display="none",this.warningSelector.style.display="none",this.summery.style.display="none",this.confirmButton.disabled=!0;const t=this.playerSelector.player;switch(this.stage){case"player":this.playerSelector.style.display="block",this.instructions="Select a player";return;case"warning":this.warningSelector.style.display="block",this.instructions=`Warning <span class="${t}">${t}</span>`;return;case"deduction":this.instructions=`Deduction <span class="${t}">${t}</span>`,this.warningDeduction.style.display="block";return;case"summery":this.instructions="Warning Summary",this.summery.style.display="block",this.summery.player=this.playerSelector.player,this.summery.warning=this.warningSelector.warning,this.summery.penalty=this.warningDeduction.penalty,this.confirmButton.disabled=!1;return}}connectedCallback(){this.stage="player",this.stageChanged(),this.backButton.addEventListener("click",()=>this.back()),this.cancelButton.addEventListener("click",()=>this.dispatchCustomEvent("cancel")),this.confirmButton.addEventListener("click",this.confirm.bind(this)),this.playerSelector.addEventListener("player-selected",()=>{this.stage="warning"}),this.warningSelector.addEventListener("warning-selected",()=>{this.warningDeduction.warning=this.warningSelector.warning,this.stage="deduction"}),this.warningDeduction.addEventListener("deduction-selected",()=>{if(this.penalty===0){this.confirm();return}})}confirm(){const t={type:"warning",warning:{player:this.player,warning:this.warning.description,penalty:this.penalty}};window.dispatchEvent(new CustomEvent("game-event",{detail:t})),this.stage="player"}}customElements.define("warning-component",k);const E=`<div class="placeholder" ></div>\r
\r
`,S=`:host {\r
    display: grid;\r
    grid-template-rows: 1fr; /* or a fixed value */\r
    height: 100%;\r
\r
    .placeholder {\r
        display: block;\r
        /*padding: 1em .2em .2em .2em;*/\r
        overflow-y: auto;\r
        height: calc(100vh - 5em);\r
\r
        /* Hide scrollbar for Webkit browsers */\r
\r
        &::-webkit-scrollbar {\r
            display: none;\r
        }\r
\r
        /* Hide scrollbar for Firefox */\r
        scrollbar-width: none;\r
        /* Hide scrollbar for IE and Edge */\r
        -ms-overflow-style: none;\r
\r
        .warning-option {\r
            margin-bottom: .5em;\r
            padding: .2em;\r
            background-color: blue;\r
            font-size: .8em;\r
            color: inherit;\r
            cursor: pointer;\r
            border-radius: 0.5rem;\r
            border-color: transparent;\r
        }\r
    }\r
}\r
\r
\r
\r
\r
\r
`;class C extends l{constructor(){super(),this._warnings=[],this.render(S,E)}get warning(){if(!this._warning)throw new Error("No warning selected");return this._warning}set warning(t){this._warning=t}set warnings(t){this._warnings=t,this.renderWarnings()}connectedCallback(){}renderWarnings(){const{placeHolder:t}=this;t.innerHTML="",this._warnings.forEach(e=>{const n=document.createElement("div");n.classList.add("warning-option"),n.innerHTML=e.description,t.appendChild(n),n.addEventListener("click",()=>this.warningSelected(e))})}warningSelected(t){console.log(`Warning selected: ${JSON.stringify(t)}`),this._warning=t,this.dispatchEvent(new CustomEvent("warning-selected",{detail:{warning:t}}))}}customElements.define("warning-selector",C);const x=`<div class="placeholder" >\r
\r
</div>\r
\r
`,R=`:host {\r
    display: block;\r
    height: 100%;\r
    width: 100%;\r
\r
    .placeholder {\r
        height: 100%;\r
        box-sizing: border-box;\r
        display: grid;\r
        grid-gap: 1rem;\r
        grid-template-columns: 1fr 1fr;\r
        .no-penalty {\r
            /*colspan off 2*/\r
            grid-column: span 2;\r
        }\r
    }\r
\r
}\r
\r
\r
`;class L extends l{constructor(){super(),this.penalty=0,this.render(R,x)}set warning(t){this._warning=t,this.renderDeductionButtons()}get warning(){if(!this._warning)throw new Error("Warning is not set");return this._warning}get placeholder(){return this.queryRoot(".placeholder")}onSelect(t){this.penalty=t,this.dispatchEvent(new CustomEvent("deduction-selected",{detail:{penalty:t},bubbles:!0,composed:!0}))}renderDeductionButtons(){this.placeholder.innerHTML="";const{minPenalty:t,maxPenalty:e}=this.warning,n=document.createElement("button");n.addEventListener("click",()=>this.onSelect(0)),n.className="no-penalty button green",n.innerText="No penalty",this.placeholder.appendChild(n);for(let r=t;r<=e;r++){const i=document.createElement("button");i.textContent=r.toString(),i.className="red button",i.addEventListener("click",()=>this.onSelect(r)),this.placeholder.appendChild(i)}}}customElements.define("warning-deduction",L);const B=`<div class="placeholder" >\r
    <button class="red button" data-color="red"> red</button>\r
    <button class="blue button" data-color="blue"> blue</button>\r
</div>\r
\r
`,q=`:host {\r
    display: block;\r
    height: 100%;\r
}\r
\r
.placeholder {\r
    display: grid;\r
    box-sizing: border-box;\r
    grid-template-rows: 1fr 1fr;\r
    grid-gap: 1rem;\r
\r
    height: 100%;\r
\r
    button {\r
        display: block;\r
        height: 100%;\r
        width: 100%;\r
        font-size: 1.5em;\r
    }\r
}\r
\r
\r
`;class H extends l{constructor(){super(),this._player=void 0,this.render(q,B)}set player(t){this._player=t,this.dispatchEvent(new CustomEvent("player-selected",{detail:{player:t}}))}get player(){return this._player}connectedCallback(){this.queryRoot("button.red").addEventListener("click",()=>this.player="red"),this.queryRoot("button.blue").addEventListener("click",()=>this.player="blue")}}customElements.define("warning-player",H);const O=`<div class="placeholder" >\r
  <div>Player: </div><div class="player"></div>\r
  <div class="row">Warning: </div><div class="row warning text-red"></div>\r
  <div>penalty: </div><div class="penalty text-red"></div>\r
</div>\r
\r
`,$=`:host {\r
    display: block;\r
    height: 100%;\r
    width: 100%;\r
\r
    .placeholder {\r
        height: 100%;\r
        box-sizing: border-box;\r
        display: grid;\r
        grid-template-columns: 5em 1fr;\r
        grid-template-rows: 1.5em 1.5em 1fr 2em;\r
        .row {\r
            /*colspan off 2*/\r
            grid-column: span 2;\r
        }\r
    }\r
\r
}\r
\r
\r
`;class M extends l{set warning(t){this.queryRoot(".warning").innerHTML=t.description}set player(t){const e=this.queryRoot(".player");e.innerHTML=t||"",e.className=`player text-${t}`}set penalty(t){this.queryRoot(".penalty").innerHTML=t.toString()}get placeholder(){return this.queryRoot(".placeholder")}constructor(){super(),this.render($,O)}}customElements.define("warning-summery",M);const T=`<div class="placeholder">\r
    <div class="score-buttons"></div>\r
    <div class="score-types">\r
        <button class="hit button green" disabled="disabled">Hit</button>\r
        <div class="two-button-row">\r
            <button class="button red" disabled="disabled">red first</button>\r
            <button class="button blue" disabled="disabled">blue first</button>\r
\r
        </div>\r
        <button class="double button orange" disabled="disabled">Double</button>\r
        <div class="three-bottom-row">\r
            <button class="back button blue">Back</button>\r
            <button class="no-score button green">No score</button>\r
            <button class="unclear button green">Unclear</button>\r
        </div>\r
    </div>\r
</div>\r
\r
`,P=`:host {\r
    display: block;\r
    box-sizing: border-box;\r
    inline-size: 100%;\r
    height: 100%;\r
    width: 100%;\r
    min-height: 0;\r
    min-width: 0;\r
    container-type: size;\r
    font-size: clamp(12px, 8vw + 0.5rem, 50px);\r
\r
    .placeholder {\r
        height: 100%;\r
        min-height: 0;\r
        min-width: 0;\r
        box-sizing: border-box;\r
        display: grid;\r
        grid-template-rows: 1fr 5em;\r
        grid-gap: 1rem;\r
        padding: .5rem;\r
        font-size: 1em;\r
\r
        .score-buttons {\r
            display: grid;\r
            grid-template-columns: 1fr 1fr;\r
            grid-template-rows: repeat(auto-fit, minmax(0, 1fr));\r
            grid-gap: .4em;\r
            align-items: stretch;\r
\r
            button {\r
                font-size: 1em;\r
                &[data-points="-1"] {\r
                    font-size: .8em;\r
                }\r
                filter: brightness(0.3); /* darken but preserve color */\r
                height: 100%;\r
                width: 100%;\r
                &.selected {\r
                    filter: none;\r
                }\r
            }\r
        }\r
        .score-types{\r
            display: grid;\r
            grid-template-columns: 1fr ;\r
            grid-template-rows: repeat(auto-fit, minmax(0, 1fr));\r
            grid-gap: 1rem;\r
            .two-button-row{\r
                display: grid;\r
                grid-template-columns: 1fr 1fr ;\r
                grid-gap: 1rem;\r
            }\r
\r
            .three-bottom-row {\r
                display: grid;\r
                grid-template-columns: auto auto auto ;\r
                grid-gap: 1rem;\r
            }\r
\r
            .button[disabled] {\r
                cursor: default;\r
                opacity: 0.2;\r
            }\r
        }\r
    }\r
}\r
`;class z extends l{constructor(){super(),this._scoreOptions=[],this.scoreRed=0,this.scoreBlue=0,this.render(P,T)}get scoreButtonPlaceholder(){return this.queryRoot(".score-buttons")}get backButton(){return this.queryRoot(".back")}get hitButton(){return this.queryRoot(".hit")}get redFirst(){return this.queryRoot(".score-types .red")}get blueFirst(){return this.queryRoot(".score-types .blue")}get doubleButton(){return this.queryRoot(".double")}get noScoreButton(){return this.queryRoot(".no-score")}get unclearButton(){return this.queryRoot(".unclear")}get scoreOptions(){return this._scoreOptions}set scoreOptions(t){this._scoreOptions=t,this.renderScoreButtons()}renderScoreButtons(){this.renderNoQualityButton("red"),this.renderNoQualityButton("blue"),this.scoreOptions.forEach(t=>{this.renderButton(t,"red"),this.renderButton(t,"blue")})}renderNoQualityButton(t){const e=document.createElement("button");e.className=`button ${t}`,e.innerHTML="Low quality",e.setAttribute("data-points","low-quality"),e.addEventListener("click",()=>{this.scoreButtonSelected("low-quality",t)}),this.scoreButtonPlaceholder.appendChild(e)}renderButton(t,e){const n=document.createElement("button");n.className=`button ${e}`,n.innerHTML=t.toString(),n.setAttribute("data-points",t.toString()),n.addEventListener("click",()=>{this.scoreButtonSelected(t,e)}),this.scoreButtonPlaceholder.appendChild(n)}deselectAllButtons(){this.scoreButtonPlaceholder.querySelectorAll(".button").forEach(e=>{e.classList.remove("selected")})}scoreButtonSelected(t,e){if(this.deselectAllButtons(),e==="red"&&(this.scoreRed=this.scoreRed===t?0:t),e==="blue"&&(this.scoreBlue=this.scoreBlue===t?0:t),this.scoreBlue){const n=this.queryRoot(`.blue[data-points='${this.scoreBlue}']`);n&&n.classList.add("selected")}if(this.scoreRed){const n=this.queryRoot(`.red[data-points='${this.scoreRed}']`);n&&n.classList.add("selected")}this.setButtons()}setButtons(){const{scoreRed:t,scoreBlue:e}=this,n=t!==0&&e!==0,r=!n&&(t!==0||e!==0);if(this.doubleButton.disabled=!0,this.redFirst.disabled=!0,this.blueFirst.disabled=!0,this.hitButton.disabled=!0,n){this.doubleButton.disabled=!1,this.redFirst.disabled=!1,this.blueFirst.disabled=!1;return}r&&(this.hitButton.disabled=!1)}connectedCallback(){this.hitButton.addEventListener("click",()=>this.score("hit"),this.eventCleanup),this.doubleButton.addEventListener("click",()=>this.score("double"),this.eventCleanup),this.redFirst.addEventListener("click",()=>this.score("red-first"),this.eventCleanup),this.blueFirst.addEventListener("click",()=>this.score("blue-first"),this.eventCleanup),this.noScoreButton.addEventListener("click",()=>this.score("no-score"),this.eventCleanup),this.unclearButton.addEventListener("click",()=>this.score("unclear"),this.eventCleanup),this.backButton.addEventListener("click",()=>this.dispatchCustomEvent("back"),this.eventCleanup)}score(t){["no-score","unclear"].includes(t)&&(this.scoreRed=0,this.scoreBlue=0);const e={type:"score",score:{type:t,scoreRed:this.scoreRed,scoreBlue:this.scoreBlue}};window.dispatchEvent(new CustomEvent("game-event",{detail:e})),this.scoreRed=0,this.scoreBlue=0,this.deselectAllButtons(),this.setButtons()}}customElements.define("score-component",z);const A=`<div class="placeholder">\r
    <div class="main-view">\r
        <timer-component id="timer" mode="edit"></timer-component>\r
        <div class="players">\r
            <div class="player red">\r
                <div class="score">0</div>\r
                <div class="name"></div>\r
            </div>\r
            <div class="player blue">\r
                <div class="score">0</div>\r
                <div class="name"></div>\r
            </div>\r
        </div>\r
        <button class="button green" id="hit">hit</button>\r
        <button class="button red" id="warning">warning</button>\r
        <button class="button orange" id="history">Match history</button>\r
        <div class="bottom-buttons">\r
            <button class="back button blue" id="back" >Back</button>\r
\r
            <button class="button blue" id="extent">Extent</button>\r
            <button class="button red" id="stop">Stop</button>\r
        </div>\r
    </div>\r
\r
    <match-history id="match-history"></match-history>\r
    <score-component id="score-component"></score-component>\r
    <warning-component id="warning"></warning-component>\r
    <call-out id="call-out"></call-out>\r
</div>\r
\r
`,D=`:host {\r
    display: block;\r
    box-sizing: border-box;\r
    inline-size: 100%;\r
    height: 100%;\r
    width: 100%;\r
\r
    .placeholder {\r
        height: 100%;\r
        width: 100%;\r
        min-height: 0;\r
        min-width: 0;\r
\r
        .main-view {\r
            height: 100%;\r
            display: grid;\r
            grid-template-rows: 23vh 1fr 5em 5em 5em 3em .5em;\r
            grid-gap: .8em;\r
\r
            .players {\r
                margin: .4rem;\r
                display: grid;\r
                grid-template-columns: 1fr 1fr;\r
                grid-gap: 1rem;\r
\r
                .player {\r
                    border: 1px solid black;\r
                    border-radius: 0.5rem;\r
                    display: grid;\r
                    grid-template-rows: auto 4em;\r
\r
                    .score {\r
                        text-align: center;\r
                        display: flex;\r
                        align-items: center;\r
                        justify-content: center;\r
\r
                        font-size: clamp(1em, 17cqw, 5em);\r
                    }\r
\r
                    .name {\r
\r
                        text-align: center;\r
                        font-size: clamp(1em, 7cqw, 2em);\r
\r
                    }\r
                }\r
\r
            }\r
        }\r
\r
        .button {\r
            margin-left: .5rem;\r
            margin-right: .5rem;\r
        }\r
        .bottom-buttons{\r
            display: grid;\r
            grid-template-columns: 1fr 1fr 1fr;\r
        }\r
    }\r
\r
    /*timer-component {*/\r
    /*    display: block;*/\r
    /*    min-height: 0;*/\r
    /*    min-width: 0;*/\r
    /*}*/\r
\r
    /*score-component {*/\r
    /*    min-height: 0;*/\r
    /*    min-width: 0;*/\r
    /*    height: 100%;*/\r
    /*    width: 100%;*/\r
    /*    overflow: hidden;*/\r
    /*    display: block;*/\r
    /*}*/\r
\r
    call-out,\r
    score-component {\r
        height:100vh;\r
        display: none;\r
    }\r
\r
    warning-component {\r
        display: none;\r
    }\r
\r
}\r
\r
\r
`;class N extends l{constructor(){super(),this.settings={calloutOnScore:!0},this.render(D,A)}set playerRed(t){const e=this.queryRoot(".player.red .name");e.textContent=t}get playerRed(){return this.queryRoot(".player.red .name").textContent}get playerBlue(){return this.queryRoot(".player.blue .name").textContent}set playerBlue(t){const e=this.queryRoot(".player.blue .name");e.textContent=t}set scoreRed(t){const e=this.queryRoot(".player.red .score");e.textContent=t.toString()}get scoreRed(){const t=this.queryRoot(".player.red .score");return parseInt(t.textContent)}set scoreBlue(t){const e=this.queryRoot(".player.blue .score");e.textContent=t.toString()}get scoreBlue(){const t=this.queryRoot(".player.blue .score");return parseInt(t.textContent)}get main(){return this.queryRoot(".main-view")}get timer(){return this.queryRoot("timer-component")}get score(){return this.queryRoot("score-component")}get warning(){return this.queryRoot("warning-component")}get history(){return this.queryRoot("#match-history")}get callOut(){return this.queryRoot("call-out")}get hitButton(){return this.queryRoot("#hit")}get warningButton(){return this.queryRoot("#warning")}get historyButton(){return this.queryRoot("#history")}get extentButton(){return this.queryRoot("#extent")}get stopButton(){return this.queryRoot("#stop")}connectedCallback(){this.timer.addEventListener("tick",()=>this.updateGameState("time"),this.eventCleanup),this.historyButton.addEventListener("click",this.showHistory.bind(this),this.eventCleanup),this.hitButton.addEventListener("click",this.showScore.bind(this),this.eventCleanup),this.warningButton.addEventListener("click",this.showWarning.bind(this),this.eventCleanup),this.warning.addEventListener("back",this.showMain.bind(this),this.eventCleanup),this.score.addEventListener("back",this.showMain.bind(this),this.eventCleanup),this.callOut.addEventListener("click",this.showMain.bind(this),this.eventCleanup),window.addEventListener("game-event",this.gameEvent.bind(this),this.eventCleanup)}gameEvent(t){const{detail:e}=t;if(e.type=="score"){const n=e.score;if(n.scoreRed!=="low-quality"&&(this.scoreRed+=n.scoreRed),n.scoreBlue!=="low-quality"&&(this.scoreBlue+=n.scoreBlue),this.settings.calloutOnScore){this.callOut.score=n,this.showCallOut(),this.updateGameState(e);return}}if(e.type=="warning"){const{player:n,penalty:r}=e;r&&(n=="blue"&&(this.scoreBlue-=r),n=="red"&&(this.scoreRed-=r))}this.updateGameState(e),this.showMain()}hideAll(){this.main.style.display="none",this.warning.style.display="none",this.score.style.display="none",this.callOut.style.display="none",this.history.style.display="none"}showMain(){this.hideAll(),this.main.style.display=""}showWarning(){this.hideAll(),this.warning.style.display="block"}showCallOut(){this.hideAll(),this.callOut.style.display="block"}showScore(){this.hideAll(),this.score.style.display="block"}showHistory(){this.hideAll(),this.history.style.display="block"}updateGameState(t){const{scoreRed:e,scoreBlue:n,playerRed:r,playerBlue:i}=this,{state:o,passedTime:d}=this.timer,a={scoreRed:e,scoreBlue:n,playerRed:r,playerBlue:i,state:o,passedTime:d,lastEvent:t};window.dispatchEvent(new CustomEvent("state-change",{detail:a}))}}customElements.define("match-view",N);const W=`<div class="placeholder">\r
    <div class="call-out"></div>\r
    <button class="button green ok">Ok</button>\r
</div>\r
\r
`,_=`:host {\r
    display: block;\r
    box-sizing: border-box;\r
    inline-size: 100%;\r
    height: 100%;\r
    width: 100%;\r
\r
    .placeholder {\r
        display:grid;\r
        grid-template-rows: 1fr 5em;\r
        grid-gap: 1rem;\r
        padding: .5rem;\r
        font-size: 1em;\r
        height:100%;\r
        .call-out{\r
            padding:1em;\r
            font-size:2.5em;\r
            span{\r
               font-weight:bold;\r
            }\r
\r
        }\r
        .three-bottom-row {\r
            display: grid;\r
            grid-template-columns: auto auto auto ;\r
            grid-gap: 1rem;\r
        }\r
    }\r
}\r
\r
\r
`;class j extends l{get callOut(){return this.queryRoot(".call-out")}get okButton(){return this.queryRoot(".ok")}constructor(){super(),this.render(_,W)}set warning(t){this.callOut.innerHTML="";const{player:e,warning:n,penalty:r}=t,i=r>1?"points":"point",o=r>0?`penalty ${r} ${i}`:"No penalty";this.callOut.innerHTML=`Warning <span class="${e}">${e?.toUpperCase()}</span> ${n}<br>${o} `}callOutHit(t,e){return t==="low-quality"?`No points <span class="text-${e}">${e.toUpperCase()}</span> <br> (Low Quality)`:t==1?`${t} point <span class="text-${e}">${e.toUpperCase()}</span>`:`${t} points <span class="text-${e}">${e.toUpperCase()}</span>`}set score(t){this.callOut.innerHTML="";const{type:e,scoreRed:n,scoreBlue:r}=t;switch(e){case"no-score":this.callOut.innerHTML="No Score";return;case"unclear":this.callOut.innerHTML="No Score";return;case"hit":if(!r){this.callOut.innerHTML=this.callOutHit(n,"red");return}if(r=="low-quality"){this.callOut.innerHTML=this.callOutHit(r,"blue");return}this.callOut.innerHTML=this.callOutHit(r,"blue");return;case"double":this.callOut.innerHTML="Double hit<br><br>",this.callOut.innerHTML+=this.callOutHit(n,"red"),this.callOut.innerHTML+="<br><br>",this.callOut.innerHTML+=this.callOutHit(r,"blue");return;case"blue-first":this.callOut.innerHTML=' After blow <span class="text-red">RED</span><br><br>',this.callOut.innerHTML+=this.callOutHit(n,"red"),this.callOut.innerHTML+="<br><br>",this.callOut.innerHTML+=this.callOutHit(r,"blue");return;case"red-first":this.callOut.innerHTML='After blow <span class="text-blue">BLUE</span><br><br>',this.callOut.innerHTML+=this.callOutHit(n,"red"),this.callOut.innerHTML+="<br><br>",this.callOut.innerHTML+=this.callOutHit(r,"blue");return}}connectedCallback(){}}customElements.define("call-out",j);const I=`<div class="placeholder">\r
    <h1 class="blue">History</h1>\r
    <div class="history-container"> </div>\r
</div>\r
`,F=`:host {\r
    display: block;\r
    box-sizing: border-box;\r
    inline-size: 100%;\r
    height: 100%;\r
    width: 100%;\r
\r
    .placeholder {\r
        height: 100%;\r
        width: 100%;\r
        min-height: 0;\r
        min-width: 0;\r
\r
        h1 {\r
            text-align: center;\r
            padding: .2em;\r
        }\r
\r
        .history-container {\r
            display: grid;\r
            grid-template-rows: 1fr;\r
            row-gap: .5em;\r
            font-size: 1.2em;\r
            span{\r
                padding: 0 .2em 0 .2em;\r
            }\r
            .score {\r
                display: grid;\r
                grid-template-columns: 3em auto 10em 10em;\r
            }\r
            .warning {\r
                display: grid;\r
                /*grid-template-rows: 1fr 1fr;*/\r
                grid-template-columns: 3em auto 10em;\r
\r
                /*.penalty{*/\r
                /*    grid-column: 3 / 3;*/\r
                /*    grid-row:2;*/\r
                /*}*/\r
                /*.description {*/\r
                /*     grid-column: 2 / 3;*/\r
                /*}*/\r
            }\r
\r
        }\r
    }\r
\r
}\r
`;function U(s){return s?!!s.warning:!1}function G(s){return s?!!s.score:!1}function u(s){return s?s==="time":!1}class Q extends l{constructor(){super(),this.history=[],this.render(F,I),this.historyContainer=this.queryRoot(".history-container")}connectedCallback(){window.addEventListener("state-change",this.stateChange.bind(this),this.eventCleanup)}stateChange(t){const n=t.detail;u(n.lastEvent)||(this.history.push(n),console.log(this.history),this.updateHistory())}updateHistory(){this.historyContainer.innerHTML="",this.history.forEach(this.renderHistoryEntry.bind(this))}renderWarningEvent(t,e,n){const r=t.passedTime.asString,{warning:i,player:o,penalty:d}=e.warning,a=document.createElement("div");a.setAttribute("data-index",n.toString()),a.classList.add("warning");const h=d>0?`penalty: ${d} to ${o}`:`no penalty to ${o}`;a.innerHTML=`
                <div>${r}</div> 
                <div class="description">${i} </div>
                <div class="${o} penalty">${h}</div>
            `,this.historyContainer.appendChild(a)}renderScoreEvent(t,e,n){const{type:r,scoreRed:i,scoreBlue:o}=e.score,d=t.passedTime.asString,a=document.createElement("div");a.classList.add("score"),a.setAttribute("data-index",n.toString()),a.innerHTML=`
                <div>${d}</div>
                <div> ${r}</div>
                <div class="red"> red: ${i} </div>
                <div class="blue"> blue : ${o}</div>
            `,this.historyContainer.appendChild(a)}renderHistoryEntry(t,e){const{lastEvent:n}=t;u(n)||(G(n)&&this.renderScoreEvent(t,n,e),U(n)&&this.renderWarningEvent(t,n,e))}}customElements.define("match-history",Q);let c=null;window.addEventListener("load",()=>{const s=document.getElementById("match-view");c=s.timer;const t=s.warning,e=s.score;s.playerRed="Jeroen",s.playerBlue="Diego",t.warnings=[{description:"Bad sportsmanship",minPenalty:1,maxPenalty:8},{description:"Late to the ring",minPenalty:1,maxPenalty:3},{description:"Influencing jurors",minPenalty:1,maxPenalty:3},{description:"Show back off head",minPenalty:1,maxPenalty:3},{description:"Illegal target",minPenalty:1,maxPenalty:3},{description:"excessive force",minPenalty:1,maxPenalty:3},{description:"Striking with the pommel",minPenalty:1,maxPenalty:3},{description:"Striking with the crossguard",minPenalty:1,maxPenalty:3},{description:"Uncontrolled and dangerous throws or takedown",minPenalty:1,maxPenalty:3},{description:"Joint lock",minPenalty:1,maxPenalty:3},{description:"Kicking or punching",minPenalty:1,maxPenalty:3},{description:"Self-calling hits",minPenalty:1,maxPenalty:3},{description:"Ring-out",minPenalty:1,maxPenalty:3},{description:"ground strike",minPenalty:1,maxPenalty:3},{description:"Being a Dick",minPenalty:1,maxPenalty:9}],c&&(c.set(3,0),c.start()),e.scoreOptions=[2,3]});window.addEventListener("state-change",s=>{const t=s;u(t.detail.lastEvent)||console.log("state-change",t.detail)});"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",s=>{s.data&&s.data.type==="RELOAD_PAGE"&&window.location.reload()});
