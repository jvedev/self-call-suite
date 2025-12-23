import { MatchSettings } from '../types';

export const DEFAULT_MATCH_SETTINGS: MatchSettings = {
    roundDuration: { minutes: 3, seconds: 0 },
    suddenDeath: false,
    lastExchangeTime: 15, // seconds
    rightOfWay: false,
    countMode: 'normal',
    countDoubles: false,
    countAfterBlow: true,
    extendLastRound: false,
    extendLastRoundSeconds: 0,
    extensionsLastRound: 0,
    roundsPerMatch: 1,
    pointCap: null,
    warnings: [
        {description: 'Bad sportsmanship', minPenalty: 1, maxPenalty: 8},
        {description: 'Late to the ring', minPenalty: 1, maxPenalty: 3},
        {description: 'Influencing jurors', minPenalty: 1, maxPenalty: 3},
        {description: 'Show back off head', minPenalty: 1, maxPenalty: 3},
        {description: 'Illegal target', minPenalty: 1, maxPenalty: 3},
        {description: 'excessive force', minPenalty: 1, maxPenalty: 3},
        {description: 'Striking with the pommel', minPenalty: 1, maxPenalty: 3},
        {description: 'Striking with the crossguard', minPenalty: 1, maxPenalty: 3},
        {description: 'Uncontrolled and dangerous throws or takedown', minPenalty: 1, maxPenalty: 3},
        {description: 'Joint lock', minPenalty: 1, maxPenalty: 3},
        {description: 'Kicking or punching', minPenalty: 1, maxPenalty: 3},
        {description: 'Self-calling hits', minPenalty: 1, maxPenalty: 3},
        {description: 'Ring-out', minPenalty: 1, maxPenalty: 3},
        {description: 'ground strike', minPenalty: 1, maxPenalty: 3},
        {description: 'Being a Dick', minPenalty: 1, maxPenalty: 9}]
    ,
    scoreValues: [0, 2, 3, 4]
};

export class SettingsManager {
    private settings: MatchSettings;

    constructor(initialSettings?: Partial<MatchSettings>) {
        this.settings = { ...DEFAULT_MATCH_SETTINGS, ...initialSettings };
    }

    getSettings(): MatchSettings {
        return { ...this.settings };
    }

    updateSettings(newSettings: Partial<MatchSettings>): void {
        this.settings = { ...this.settings, ...newSettings };
    }

    resetToDefaults(): void {
        this.settings = { ...DEFAULT_MATCH_SETTINGS };
    }
}