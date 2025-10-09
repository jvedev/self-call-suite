import { MatchEventEntry } from './matchEventEntry';

// Represents a single round in a match
export type Round = {
    roundNumber: number;
    scoreRed: number;
    scoreBlue: number;
    winner: 'red' | 'blue' | 'draw' | null;
    warningsRed: number;
    warningsBlue: number;
    duration: number; // in seconds
    log: MatchEventEntry[];
    extended: boolean;
    suddenDeath: boolean;
}