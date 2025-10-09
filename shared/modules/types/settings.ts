

export type MatchSettings = {
    roundDuration: { minutes: number; seconds: number };
    suddenDeath: boolean;
    lastExchangeTime: number; // in seconds
    rightOfWay: boolean;
    countMode: 'normal' | 'differenceOnly';
    countDoubles: boolean;
    countAfterBlow: boolean;
    extendLastRound: boolean;
    extendLastRoundSeconds: number;
    extensionsLastRound: number;
    roundsPerMatch: number;
    pointCap: number | null;
    warnings: string[];
    scoreValues: number[];
}