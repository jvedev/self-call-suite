import { proxy } from 'valtio';
import { Match, MatchSettings, MatchEventEntry } from '../types';

export interface MatchState {
    currentMatch: Match | null;
    isMatchActive: boolean;
    isPaused: boolean;
    currentTime: number; // seconds since match start
    timerColor: 'normal' | 'orange' | 'yellow' | 'red' | 'grey';
}

export const matchState = proxy<MatchState>({
    currentMatch: null,
    isMatchActive: false,
    isPaused: false,
    currentTime: 0,
    timerColor: 'normal'
});

export const matchActions = {
    startMatch(redFighter: string, blueFighter: string, settings: MatchSettings): void {
        const match: Match = {
            id: crypto.randomUUID(),
            competitorRed: redFighter,
            competitorBlue: blueFighter,
            settings,
            rounds: [],
            currentRound: 0,
            matchLog: [],
            startTime: new Date(),
            winner: null
        };

        matchState.currentMatch = match;
        matchState.isMatchActive = true;
        matchState.isPaused = false;
        matchState.currentTime = 0;
        matchState.timerColor = 'normal';
    },

    endMatch(): void {
        if (matchState.currentMatch) {
            matchState.currentMatch.endTime = new Date();
            matchState.isMatchActive = false;
        }
    },

    pauseTimer(): void {
        matchState.isPaused = true;
        matchState.timerColor = 'grey';
    },

    resumeTimer(): void {
        matchState.isPaused = false;
        matchState.timerColor = 'normal';
    },

    addEvent(event: MatchEventEntry): void {
        if (matchState.currentMatch) {
            matchState.currentMatch.matchLog.push(event);
        }
    }
};