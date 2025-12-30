import {timerState, TimeTypes} from "./time.types..ts";
import {GameEventType} from "./game-event.types.ts";

export type GameState = {
    scoreRed: number,
    scoreBlue: number,
    playerRed: string,
    playerBlue: string,
    state: timerState,
    passedTime: TimeTypes,
    type: GameEventType,
    onCallRed:string;
    onCallBlue:string;
}

export type SingleGameEvent =  Omit<GameState, 'onCallRed'| 'onCallBlue'>;