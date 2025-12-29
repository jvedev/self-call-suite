import {TimeTypes, timerState} from "./time.types..ts";
import {Player} from "./pLayer.types.ts";

export type  GameEvent = {
    type:'warning' | 'score' | 'time',
    state:timerState
    warning?: WarningEvent,
    score?: ScoreEvent,
    time: TimeTypes,
}



export type  UntimedGameEvent = Omit<GameEvent, 'time'| 'state'>

export type WarningEvent = {
    warning: string;
    player: Player;
    penalty: number;
}

export type ScoreType = 'hit' | 'double' | 'blue-first' | 'red-first' | 'no-score' | 'unclear';

export type Score = number | 'low-quality';

export type  ScoreEvent = {
    type: ScoreType,
    scoreRed: Score,
    scoreBlue: Score,
};