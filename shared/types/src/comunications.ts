

export type UserType = 'referee' | 'judge' | 'fighter' | 'table-crew' | 'admin' | 'staff';

export type User = {
    name: string,
    type: UserType
}
export type Fighter = {
    name: string
}

export type Crew = {
    referees: User[],
    judges: User[],
    crew: User[],
}

export type Pool = {
    description?: string,
    crew: Crew,
    arena: string,
    startTime: string
    fights: Fight[]
}

export type PoolResult = Pool & {
    id: string
    fightsResults: FightResult[]
}

export type Fight = {
    red: Fighter,
    blue: Fighter,
}
export type FightResult = Fight & {
    // neto exchange results (counter might have been deducted depending on the rules)
    endScoreRed: number,
    endScoreBlue: number,

    //all points scored during the fight (before deductions)
    allScoresRed: number,
    allScoresBlue: number,

    exchangesWonRed: number,
    exchangesWonBlue: number,

    doubles: number,
    redFirsts: number,
    blueFirsts: number,

    penaltiesRed: number,
    penaltiesBlue: number,

    winner: 'red' | 'blue' | 'draw'
}


export type ScoreBoardState = {
    arena: string,
    description: string,
    fighterRed: Fighter,
    fighterBlue: Fighter,
    scoreRed: number,
    scoreBlue: number,
    remainingTime: string,
    startTime: string,
    state: 'expected' | 'end' | 'running' | 'timeout',
    onCallRed: Fighter,
    onCallBlue: Fighter,
}


