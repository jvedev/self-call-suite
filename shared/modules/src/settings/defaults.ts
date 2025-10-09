import { MatchSettings, UserSettings } from './types.js';

export const DEFAULT_MATCH_SETTINGS: MatchSettings = {
  roundDuration: { minutes: 3, seconds: 0 },
  suddenDeath: false,
  lastExchangeTime: 15,
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
    'Late for a fight',
    'Turning the back',
    'Forbidden target: Feet, back, groin',
    'Throw',
    'Chokeholds or breaking techniques',
    'Throwing the weapon',
    'Hitting the floor with the weapon',
    'Unnecessary non-scoring violence',
    'Offensively using the crossguard',
    'Using disproportionate force',
    'Continuing to fight after break',
    'Talking to the table or jury',
    'Swearing, cursing, or shouting',
    'Dismissing a point',
    'Being a dick',
  ],
  scoreValues: [0, 2, 3],
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'auto',
  language: 'en',
  soundEnabled: true,
  notificationsEnabled: true,
};