import {timerState, TimeTypes} from "./time.types..ts";
import { ScoreEvent, WarningEvent} from "./game-event.types.ts";

type gameStateLastEvent = ScoreEvent | WarningEvent | 'time';

export type GameState = {
    scoreRed: number,
    scoreBlue: number,
    playerRed: string,
    playerBlue: string,
    state: timerState,
    passedTime: TimeTypes,
    onCallRed:string;
    onCallBlue:string;
    lastEvent:gameStateLastEvent
}

export type SingleGameEvent =  Omit<GameState, 'onCallRed'| 'onCallBlue'>;

export function isWarningEvent(event: gameStateLastEvent): event is WarningEvent {
    if(!event) return false;
    return !!(event as WarningEvent).warning;
}

export function isScoreEvent(event: gameStateLastEvent): event is ScoreEvent {
    if(!event) return false;
    return !!(event as ScoreEvent).score
}
export function isTimeEvent(event:gameStateLastEvent): event is 'time' {
    if(!event) return false;
    return event === 'time';
}