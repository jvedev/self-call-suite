import {Time} from "./time.ts";

export type  GameEvent = {
    type:'warning' | 'score' | 'time',
    warning?: WarningEvent,
    ScoreEvent?: ScoreEvent,
    time: Time,
}

export type WarningEvent = {
    warning: string;
    player: 'red' | 'blue';
    penalty?: number;
}

export type ScoreType = 'hit' | 'double' | 'blue-first' | 'red-first' | 'no-score' | 'unclear';

export type  ScoreEvent = {
    scoreType: ScoreType,
    scoreRed: number,
    scoreBlue: number,
};