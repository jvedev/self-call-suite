export type Competitor = 'red' | 'blue' | 'both' | 'none';

export type MatchEventType =
    | 'hit'
    | 'doubleHit'
    | 'warning'
    | 'timeout-start'
    | 'timeout-end'
    | 'matchStart'
    | 'matchEnd';

export type MatchEventEntry = {
    time: number; // seconds since match start (taking timeouts into account)
    type: MatchEventType;
    competitor: Competitor;
    scoreValue?: number;
    warningType?: string;
    timeoutReason?: string;
}