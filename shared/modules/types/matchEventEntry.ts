export type Competitor = 'red' | 'blue' | 'both' | 'none';

export type MatchEventType =
    | 'hit'
    | 'doubleHit'
    | 'warning'
    | 'timeout'
    | 'matchEnd';

export type MatchEventEntry = {
    time: number; // seconds since match start (taking timeouts into account)
    type: MatchEventType;
    competitor: MatchEventEntry;
    scoreValue?: number;
    warningType?: string;
    timeoutReason?: string;
}