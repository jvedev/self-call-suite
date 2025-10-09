import { View } from '../router';
import { matchState, matchActions } from '../../../../shared/modules/state';

export class MatchView implements View {
    private timerInterval: number | null = null;

    render(): string {
        const match = matchState.currentMatch;
        if (!match) {
            return '<div>No active match</div>';
        }

        return `
            <div class="container">
                <div class="match-header">
                    <h2>Match in Progress</h2>
                    <div class="competitors">
                        <span class="red-competitor">${match.competitorRed}</span>
                        <span class="vs">vs</span>
                        <span class="blue-competitor">${match.competitorBlue}</span>
                    </div>
                </div>

                <div class="timer-section">
                    <div id="timer" class="timer timer-${matchState.timerColor}">
                        ${this.formatTime(matchState.currentTime)}
                    </div>
                    <div class="timer-controls">
                        <button id="pause-btn" class="btn">
                            ${matchState.isPaused ? 'Resume' : 'Pause'}
                        </button>
                    </div>
                </div>

                <div class="scoring-section">
                    <div class="score-display">
                        <div class="red-score">
                            <h3>Red: 0</h3>
                        </div>
                        <div class="blue-score">
                            <h3>Blue: 0</h3>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button id="hit-btn" class="btn btn-primary">Hit</button>
                        <button id="warning-btn" class="btn">Warning</button>
                        <button id="timeout-btn" class="btn">Timeout</button>
                        <button id="adjust-time-btn" class="btn">Adjust Time</button>
                        <button id="end-match-btn" class="btn btn-danger">End Match</button>
                    </div>
                </div>
            </div>

            <style>
                .match-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                
                .competitors {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                
                .red-competitor {
                    color: var(--color-primary-red);
                    font-weight: bold;
                    font-size: 1.25rem;
                }
                
                .blue-competitor {
                    color: var(--color-primary-blue);
                    font-weight: bold;
                    font-size: 1.25rem;
                }
                
                .vs {
                    font-weight: bold;
                    color: var(--color-text-muted);
                }
                
                .timer-section {
                    text-align: center;
                    margin-bottom: 2rem;
                }
                
                .timer {
                    font-size: 3rem;
                    font-weight: bold;
                    font-family: 'Courier New', monospace;
                    margin-bottom: 1rem;
                }
                
                .timer-normal { color: var(--timer-normal); }
                .timer-orange { color: var(--timer-orange); }
                .timer-yellow { color: var(--timer-yellow); }
                .timer-red { color: var(--timer-red); }
                .timer-grey { color: var(--timer-grey); }
                
                .score-display {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 2rem;
                }
                
                .red-score h3 {
                    color: var(--color-primary-red);
                    font-size: 2rem;
                }
                
                .blue-score h3 {
                    color: var(--color-primary-blue);
                    font-size: 2rem;
                }
                
                .action-buttons {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }
                
                @media (max-width: 768px) {
                    .action-buttons {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;
    }

    onMount(): void {
        this.setupEventListeners();
        this.startTimer();
    }

    onUnmount(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    private setupEventListeners(): void {
        const pauseBtn = document.getElementById('pause-btn');
        const hitBtn = document.getElementById('hit-btn');
        const warningBtn = document.getElementById('warning-btn');
        const timeoutBtn = document.getElementById('timeout-btn');
        const endMatchBtn = document.getElementById('end-match-btn');

        pauseBtn?.addEventListener('click', () => {
            if (matchState.isPaused) {
                matchActions.resumeTimer();
            } else {
                matchActions.pauseTimer();
            }
            this.updatePauseButton();
        });

        hitBtn?.addEventListener('click', () => {
            // TODO: Navigate to hit selection view
            alert('Hit scoring coming soon!');
        });

        warningBtn?.addEventListener('click', () => {
            // TODO: Navigate to warning view
            alert('Warning system coming soon!');
        });

        timeoutBtn?.addEventListener('click', () => {
            // TODO: Navigate to timeout view
            alert('Timeout system coming soon!');
        });

        endMatchBtn?.addEventListener('click', () => {
            if (confirm('Are you sure you want to end this match?')) {
                matchActions.endMatch();
                window.dispatchEvent(new CustomEvent('navigate', { detail: 'home' }));
            }
        });
    }

    private startTimer(): void {
        this.timerInterval = window.setInterval(() => {
            if (!matchState.isPaused && matchState.isMatchActive) {
                matchState.currentTime++;
                this.updateTimerDisplay();
            }
        }, 1000);
    }

    private updateTimerDisplay(): void {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.formatTime(matchState.currentTime);
        }
    }

    private updatePauseButton(): void {
        const pauseBtn = document.getElementById('pause-btn');
        if (pauseBtn) {
            pauseBtn.textContent = matchState.isPaused ? 'Resume' : 'Pause';
        }
    }

    private formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}