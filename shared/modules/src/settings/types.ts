export interface MatchSettings {
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

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface AppSettings {
  version: string;
  environment: 'development' | 'production';
  apiUrl: string;
}