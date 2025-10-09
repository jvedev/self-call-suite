# Match score logic and settings

# general terms:

    - Match: a match between two competitors blue and red
    - round: a part of the Match with a set time limit and rules a Match can be one or more rounds
    - hit: a successful strike or technique that scores points
    - score: the points awarded for a hit
    - warning: a penalty given to a competitor for a rule infraction
    - timeout: a pause in the Match requested by a competitor or table crew or refery
    - sudden death: an overtime period where the first competitor to score wins
    - extentsion: an additional round added to the Match if the score is tied at the end of regular time
    - right of way: a rule that determines which competitor has the priority to attack or defend
    - double hit: when both competitors score a hit at the same time
    - afterblow: a hit that occurs after being hit within the same tempo
    - tempo: the time frame in which actions are considered simultaneous


# settings

```typescript
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
```


- round duration: in minutes and seconds
- sudden death: yes or no
- last exchange time: in seconds
- right of way: yes or no
- count mode: normal or difference only
- count doubles: yes or no
- count after blow: yes or no
- extend last round: in seconds
- extensions last round: number of extensions allowed
- rounds per Match: number of rounds in a Match
- Point Cap: number of points or null for no limit
- warnings an array of warning description
- score values: an array of numbers for score values typically [0, 2, 3] but can be any number of values

# score logic

## when a single hit is registered
- the score value is added to the selected competitor

## when a double hit is registered
- if count doubles is yes both competitors get the score value added to their score
- if count doubles is no neither competitor gets the score value added to their score
- depending on the count mode the score is calculated differently
  - normal: both competitors get their score added to their total score
  - difference only: the score difference is calculated and added to the leading competitor's score
  - if the scores are equal neither competitor gets their score added to their total score no score is called and logged

## hit and afterblow 
- if right of way is yes the competitor with right of way gets the score value added to their score
- if right of way is no both competitors get their score value added to their score using the same logic as double hit

## when a warning is registered
- the warning is added to the selected competitor's warning list

## when a timeout is registered
- the timeout is added to the Match log with the reason and time
- the Match clock is paused
- the Match clock is resumed when the timeout is over
- the Match clock is adjusted if needed

## Last exchange time
- when the time left off the clock is less than or equal to the last exchange time the app will indicate this by the timer going orange and last exchange is called
- the round will end after the last exchange. this means there is no fixed end time the clock will continue to run until the last exchange is over

## Extend last round
- if extend last round is yes and
- and the contesters are tied in rounds and 
- the contesters are in a tied in points in the curent round 
- the round can be extended by the set amount of seconds this is indicated by the timer going to yellow
- this can be done the set amount of times

## Sudden death
- if the last round including extensions is over and there is a tie in rounds and points
- if sudden death is yes a sudden death time is indicated (the timer goes to red) and the Match continues until one competitor scores
- if sudden death is no the Match ends in a draw

## Match end
- the Match ends when the set number of rounds is completed including extensions and sudden death if applicable
- the Match ends when one competitor reaches the Point Cap if applicable
- the Match ends when one competitor is disqualified
- the Match ends when one competitor is unable to continue

# Match event logging 

```typescript
type Competitor = 'red' | 'blue' | 'both' | 'none';

type MatchEventType =
    | 'hit'
    | 'doubleHit'
    | 'warning'
    | 'timeout'
    | 'matchEnd';

type MatchEventEntry = {
    time: number; // seconds since match start (taking timeouts into account)
    type: MatchEventType;
    competitor: Competitor;
    scoreValue?: number;
    warningType?: string;
    timeoutReason?: string;
}

```

each event in the Match is logged with the following information:
- time: the time the event occurred in the Match
- type: the type of event (hit, double hit, warning, timeout, Match end)
- competitor: the competitor involved in the event (red, blue, both, none)
- score value: the score value awarded for the event if applicable
- warning type: the type of warning given if applicable
- timeout reason: the reason for the timeout if applicable

## round summary
at the end of each round a summary is generated with the following information:
- round number: the number of the round
- score red: the score for the red competitor
- score blue: the score for the blue competitor
- round winner: the winner of the round or draw if applicable
- warnings red: the number of warnings for the red competitor
- warnings blue: the number of warnings for the blue competitor
- round duration: the duration of the round including extensions and last exchange if applicable
- round log: a detailed log of all events that occurred during the round

## Match summary
at the end of the Match a summary is generated with the following information:
- name red: the name of the red competitor
- name blue: the name of the blue competitor
- final score: the final score for both competitors when the Match is one round the score will be the score off the round if not the score will be the number of rounds won
- winner: the winner of the Match or draw if applicable
- total hits: the total number of hits for both competitors
- total warnings: the total number of warnings for both competitors
- Match duration: the total duration of the Match including extensions and sudden death if applicable
- Match log: a detailed log of all events that occurred during the Match

# timer
the timer counts down from the set round duration to zero
each event will be logged with the time in seconds and minutes since the start of the Match taking timeouts into account
the timer can be paused and resumed for timeouts

### timer colors:
- normal time: default color
- last exchange time: orange
- extend last round: yellow
- sudden death: red
- paused: grey
