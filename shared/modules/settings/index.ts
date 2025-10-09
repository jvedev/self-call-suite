import { MatchSettings } from '../types/settings';

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
        "Late for a fight",
        "Turning the back",
        "Forbidden target Feet, back, groin",
        "Throw",
        "Chokeholds or breaking techniques",
        "Throwing the weapon",
        "Hitting the floor with the weapon",
        "Unnecessary non-scoring violence",
        "Offensively using the crossguard",
        "Using disproportionate force",
        "Continuing to fight after break",
        "Talking to the table or jury",
        "Swearing, cursing, or shouting",
        "dismissing a point",
        "being a dick"
    ],
    scoreValues: [0, 2, 3]
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