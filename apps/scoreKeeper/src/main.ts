import '@shared/web-components';
import {TimerComponent, WarningComponent} from "@shared/web-components";

const timer = document.getElementById('timer') as TimerComponent;
const warning = document.getElementById('warning') as WarningComponent;

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

warning.player = 'red'
warning.warning = {description: 'Being a Dick', minPenalty: 1, maxPenalty: 9}
warning.penalty = 7
warning.stage = 'summery'

//warning.player = 'red';
//warning.stage = 'player';
timer.set(0, 25);




