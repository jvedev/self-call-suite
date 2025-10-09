import {MatchEventEntry} from './matchEventEntry';
import {MatchSettings} from './settings';
import {Round} from './round';

// Represents the overall match
export type Match = {
    id: string;
    competitorRed: string;
    competitorBlue: string;
    settings: MatchSettings;
    rounds: Round[];
    currentRound: number;
    matchLog: MatchEventEntry[];
    startTime: Date;
    endTime?: Date;
    winner: 'red' | 'blue' | 'draw' | null;
    disqualified?: 'red' | 'blue' | null;
}
