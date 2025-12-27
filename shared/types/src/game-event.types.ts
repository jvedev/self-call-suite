export type  GameEvent = {
    type:'warning' | 'score',
    warning?: WarningEvent,
    ScoreEvent?: ScoreEvent,
    time: {minutes: number, seconds: number},
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