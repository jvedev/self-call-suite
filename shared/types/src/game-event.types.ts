import {TimeTypes, timerState} from "./time.types..ts";
import {Player} from "./pLayer.types.ts";

export type GameEventType = 'warning' | 'score' | 'time'

export type  GameEvent = {
    type: GameEventType,
    state: timerState
    warning?: WarningEvent,
    score?: ScoreEvent,
    time: TimeTypes,
}

export type AllEvents = ScoreEvent | WarningEvent | 'time'

export type  UntimedGameEvent = Omit<GameEvent, 'time' | 'state'>

export type WarningEvent = {
    type:"warning",
    warning: {
        warning: string;
        player: Player;
        penalty: number;
    }
}

export type ScoreType = 'hit' | 'double' | 'blue-first' | 'red-first' | 'no-score' | 'unclear';

export type Score = number | 'low-quality';

export type  ScoreEvent = {
    type:"score"
    score: {
        type: ScoreType,
        scoreRed: Score,
        scoreBlue: Score,
    }
};