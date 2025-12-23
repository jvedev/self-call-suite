import '@shared/web-components';
import {ScoreComponent, TimerComponent, WarningComponent} from "@shared/web-components";

const timer = document.getElementById('timer') as TimerComponent;
const warning = document.getElementById('warning') as WarningComponent;
const score = document.getElementById('score-component') as ScoreComponent;
// warning.warnings = [
//     {description: 'Bad sportsmanship', minPenalty: 1, maxPenalty: 8},
//     {description: 'Late to the ring', minPenalty: 1, maxPenalty: 3},
//     {description: 'Influencing jurors', minPenalty: 1, maxPenalty: 3},
//     {description: 'Show back off head', minPenalty: 1, maxPenalty: 3},
//     {description: 'Illegal target', minPenalty: 1, maxPenalty: 3},
//     {description: 'excessive force', minPenalty: 1, maxPenalty: 3},
//     {description: 'Striking with the pommel', minPenalty: 1, maxPenalty: 3},
//     {description: 'Striking with the crossguard', minPenalty: 1, maxPenalty: 3},
//     {description: 'Uncontrolled and dangerous throws or takedown', minPenalty: 1, maxPenalty: 3},
//     {description: 'Joint lock', minPenalty: 1, maxPenalty: 3},
//     {description: 'Kicking or punching', minPenalty: 1, maxPenalty: 3},
//     {description: 'Self-calling hits', minPenalty: 1, maxPenalty: 3},
//     {description: 'Ring-out', minPenalty: 1, maxPenalty: 3},
//     {description: 'ground strike', minPenalty: 1, maxPenalty: 3},
//     {description: 'Being a Dick', minPenalty: 1, maxPenalty: 9},
// ]


timer.set(0, 25);
score.scoreOptions = [2,3,4]


