import { proxy } from 'valtio';
import { MatchState, MatchEvent, TimerState } from './types.js';

export const MatchStore = proxy<{
  current: MatchState | null;
  timer: TimerState;
  history: MatchState[];
}>({
  current: null,
  timer: {
    display: 'normal',
    color: 'default',
  },
  history: [],
});

// Match management functions
export const createMatch = (
  redFighterName: string,
  blueFighterName: string
): string => {
  const matchId = `match_${Date.now()}`;
  const match: MatchState = {
    id: matchId,
    redFighter: { name: redFighterName, color: 'red' },
    blueFighter: { name: blueFighterName, color: 'blue' },
    redScore: 0,
    blueScore: 0,
    redWarnings: [],
    blueWarnings: [],
    currentRound: 1,
    timeRemaining: 3 * 60 * 1000, // 3 minutes in milliseconds
    isRunning: false,
    isPaused: false,
    status: 'not_started',
    events: [],
    createdAt: Date.now(),
  };

  MatchStore.current = match;
  return matchId;
};

export const startMatch = () => {
  if (MatchStore.current) {
    MatchStore.current.status = 'running';
    MatchStore.current.isRunning = true;
    addEvent({
      id: `event_${Date.now()}`,
      timestamp: 0,
      type: 'match_start',
    });
  }
};

export const pauseMatch = () => {
  if (MatchStore.current) {
    MatchStore.current.isRunning = false;
    MatchStore.current.isPaused = true;
    MatchStore.current.status = 'paused';
    MatchStore.timer.display = 'paused';
    MatchStore.timer.color = 'grey';
  }
};

export const resumeMatch = () => {
  if (MatchStore.current) {
    MatchStore.current.isRunning = true;
    MatchStore.current.isPaused = false;
    MatchStore.current.status = 'running';
    MatchStore.timer.display = 'normal';
    MatchStore.timer.color = 'default';
  }
};

export const endMatch = () => {
  if (MatchStore.current) {
    MatchStore.current.status = 'finished';
    MatchStore.current.isRunning = false;
    MatchStore.current.finishedAt = Date.now();
    
    addEvent({
      id: `event_${Date.now()}`,
      timestamp: getCurrentMatchTime(),
      type: 'match_end',
    });

    // Add to history
    MatchStore.history.push({ ...MatchStore.current });
  }
};

export const addEvent = (event: MatchEvent) => {
  if (MatchStore.current) {
    MatchStore.current.events.push(event);
  }
};

export const getCurrentMatchTime = (): number => {
  if (!MatchStore.current) return 0;
  return Date.now() - MatchStore.current.createdAt;
};

export const addScore = (fighter: 'red' | 'blue', points: number) => {
  if (!MatchStore.current) return;
  
  if (fighter === 'red') {
    MatchStore.current.redScore += points;
  } else {
    MatchStore.current.blueScore += points;
  }
  
  addEvent({
    id: `event_${Date.now()}`,
    timestamp: getCurrentMatchTime(),
    type: 'hit',
    fighter,
    points,
  });
};

export const addWarning = (fighter: 'red' | 'blue', warning: string) => {
  if (!MatchStore.current) return;
  
  if (fighter === 'red') {
    MatchStore.current.redWarnings.push(warning);
  } else {
    MatchStore.current.blueWarnings.push(warning);
  }
  
  addEvent({
    id: `event_${Date.now()}`,
    timestamp: getCurrentMatchTime(),
    type: 'warning',
    fighter,
    warning,
  });
};