export interface Fighter {
  name: string;
  color: 'red' | 'blue';
}

export interface MatchEvent {
  id: string;
  timestamp: number; // milliseconds since match start
  type: 'hit' | 'warning' | 'timeout' | 'adjustment' | 'match_start' | 'match_end';
  fighter?: 'red' | 'blue';
  points?: number;
  warning?: string;
  timeoutReason?: string;
  adjustment?: {
    type: 'time' | 'score';
    value: number;
    reason: string;
  };
}

export interface MatchState {
  id: string;
  redFighter: Fighter;
  blueFighter: Fighter;
  redScore: number;
  blueScore: number;
  redWarnings: string[];
  blueWarnings: string[];
  currentRound: number;
  timeRemaining: number; // in milliseconds
  isRunning: boolean;
  isPaused: boolean;
  status: 'not_started' | 'running' | 'paused' | 'finished';
  events: MatchEvent[];
  createdAt: number;
  finishedAt?: number;
}

export interface TimerState {
  display: 'normal' | 'last_exchange' | 'extend' | 'sudden_death' | 'paused';
  color: 'default' | 'orange' | 'yellow' | 'red' | 'grey';
}