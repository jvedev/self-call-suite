import '@shared/web-components';
import {MatchViewComponent} from "@shared/web-components";

const matchView = document.getElementById('match-view') as MatchViewComponent;
const timer = matchView.timer!;
const warning = matchView.warning!;
const score = matchView.score!;
warning.warnings = [
    {description: 'Bad sportsmanship', minPenalty: 1, maxPenalty: 8},
    {description: 'Late to the ring', minPenalty: 1, maxPenalty: 3},
    {description: 'Influencing jurors', minPenalty: 1, maxPenalty: 3},
    {description: 'Show back off head', minPenalty: 1, maxPenalty: 3},
    {description: 'Illegal target', minPenalty: 1, maxPenalty: 3},
    {description: 'excessive force', minPenalty: 1, maxPenalty: 3},
    {description: 'Striking with the pommel', minPenalty: 1, maxPenalty: 3},
    {description: 'Striking with the crossguard', minPenalty: 1, maxPenalty: 3},
    {description: 'Uncontrolled and dangerous throws or takedown', minPenalty: 1, maxPenalty: 3},
    {description: 'Joint lock', minPenalty: 1, maxPenalty: 3},
    {description: 'Kicking or punching', minPenalty: 1, maxPenalty: 3},
    {description: 'Self-calling hits', minPenalty: 1, maxPenalty: 3},
    {description: 'Ring-out', minPenalty: 1, maxPenalty: 3},
    {description: 'ground strike', minPenalty: 1, maxPenalty: 3},
    {description: 'Being a Dick', minPenalty: 1, maxPenalty: 9},
]


timer.set(1, 23);
timer.start()
score.scoreOptions = [2,3,4]

window.addEventListener('game-event', (event: Event) => {
    const customEvent = event as CustomEvent;
    const{passedTime} = timer
    console.log('Game event', {...customEvent.detail, passedTime});

});
