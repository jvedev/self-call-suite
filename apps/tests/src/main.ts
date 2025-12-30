import '@shared/web-components';
import {MatchViewComponent, TimerComponent} from "@shared/web-components";
import {isTimeEvent} from "@shared/types";

let timer:TimerComponent|null = null;
window.addEventListener('load', ()=>{
    const matchView = document.getElementById('match-view') as MatchViewComponent;
    timer = matchView.timer!;
    const warning = matchView.warning!;
    const score = matchView.score!;

    matchView.playerRed = "Jeroen";
    matchView.playerBlue = "Diego";

    warning.warnings = [
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
        {description: 'Being a Dick', minPenalty: 1, maxPenalty: 9},
    ]

if(timer){
    timer.set(3, 0);
    timer.start()
}

    score.scoreOptions = [2,3]

    matchView.history.history = [
        {
            "scoreRed": 2,
            "scoreBlue": 2,
            "playerRed": "Jeroen",
            "playerBlue": "Diego",
            "state": "running",
            "passedTime": {
                "minutes": 0,
                "seconds": 14,
                "asString": "00:14"
            },
            "lastEvent": {
                "type": "score",
                "score": {
                    "type": "double",
                    "scoreRed": 2,
                    "scoreBlue": 2
                }
            }
        },
        {
            "scoreRed": 5,
            "scoreBlue": 2,
            "playerRed": "Jeroen",
            "playerBlue": "Diego",
            "state": "running",
            "passedTime": {
                "minutes": 0,
                "seconds": 22,
                "asString": "00:22"
            },
            "lastEvent": {
                "type": "score",
                "score": {
                    "type": "blue-first",
                    "scoreRed": 3,
                    "scoreBlue": "low-quality"
                }
            }
        },
        {
            "scoreRed": 5,
            "scoreBlue": 4,
            "playerRed": "Jeroen",
            "playerBlue": "Diego",
            "state": "running",
            "passedTime": {
                "minutes": 0,
                "seconds": 48,
                "asString": "00:48"
            },
            "lastEvent": {
                "type": "score",
                "score": {
                    "type": "double",
                    "scoreRed": "low-quality",
                    "scoreBlue": 2
                }
            }
        },
        {
            "scoreRed": 5,
            "scoreBlue": 4,
            "playerRed": "Jeroen",
            "playerBlue": "Diego",
            "state": "running",
            "passedTime": {
                "minutes": 0,
                "seconds": 54,
                "asString": "00:54"
            },
            "lastEvent": {
                "type": "warning",
                "warning": {
                    "player": "blue",
                    "warning": "Illegal target",
                    "penalty": 2
                }
            }
        },
        {
            "scoreRed": 5,
            "scoreBlue": 4,
            "playerRed": "Jeroen",
            "playerBlue": "Diego",
            "state": "running",
            "passedTime": {
                "minutes": 1,
                "seconds": 1,
                "asString": "01:01"
            },
            "lastEvent": {
                "type": "warning",
                "warning": {
                    "player": "red",
                    "warning": "Influencing jurors",
                    "penalty": 0
                }
            }
        }
    ]

     matchView.showHistory()
     matchView.history.updateHistory();
})
window.addEventListener('state-change', (event: Event) => {
    const customEvent = event as CustomEvent;
    if(!isTimeEvent(customEvent.detail.lastEvent))
    console.log('state-change', customEvent.detail);
});

// Listen for service worker reload message
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'RELOAD_PAGE') {
      window.location.reload();
    }
  });
}
