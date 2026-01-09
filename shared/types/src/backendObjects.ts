export type event = {
    id: string, //uuid
    name: string,
    locations: venue[], //uuid references to venues
    startDateTime: Date,
    endDateTime: Date,
    organizerId: string, //uuid references to clubs
    logoUrl?: string,
    bannerUrl?: string,
    contactEmail: string,
    contactPersonId: string, //uuid references to profiles
    capacity?: number,
}

export type tournament = {
    id: string, //uuid
    name: string,
    eventId: string, //uuid references to events
    description?: string,
}


export type arena = {
    id: string, //uuid
    name: string,
    venue: venue,
    description?: string,
    eventId: string, //uuid references to events
}

export type pool = {
    id: string, //uuid
    tournamentId: string, //uuid references to tournaments
    arenaId: string, //uuid references to arenas
    description?: string,
    startDateTime: Date,
}

type pool_judges = {
    poolId: string, //uuid references to pools
    participantId: string, //uuid references to participant
}

type pool_jury = {
    poolId: string, //uuid references to pools
    participantId: string, //uuid references to participant
}

type pool_crew = {
    poolId: string, //uuid references to pools
    participantId: string, //uuid references to participant
}

type pool_fighters = {
    poolId: string, //uuid references to pools
    participantId: string, //uuid references to participant
}

export type fight = {
    id: string, //uuid
    poolId: string, //uuid references to pools
    redParticipantId: string, //uuid references to participant
    blueParticipantId: string, //uuid references to participant
    scheduledDateTime: Date,
    scoreRed: number,
    scoreBlue: number,
}

export type match = {
    id: string, //uuid
    fightId: string, //uuid references to fights
}

export type exchange = {
    id: string, //uuid
    matchId: string, //uuid references to fights
    passedTime: number,
    scoreRed: score,
    scoreBlue: score,
    warningRed?: warning,
    warningBlue?: warning,
}

export type warning = {
    warning: string;
    player: 'red' | 'blue';
    penalty: number;
}


export type scoreType = 'hit' | 'double' | 'blue-first' | 'red-first' | 'no-score' | 'unclear';

export type score = {
    type: scoreType,
    scoreRed: number,
    lowQualityRed: boolean,
    scoreBlue: number,
    lowQualityBlue: boolean,
};


export type participant = {
    id: string, //uuid
    profileId: string, //uuid references to profiles
    tournamentId: string, //uuid references to tournaments
    registrationDate: Date,
    roles: participantRoles[],
}

export type participantRoles = 'fighter' | 'judge' | 'jury' | 'crew';

export type profile = {
    id: string, //uuid references to auth.users
    name: string,
    email: string,
    affiliatedClubs: club[],
    profileImageUrl?: string,
}

export type venue = {
    id: string, //uuid
    country: string,
    city: string,
    address: string,
    postalCode?: string,
    type: string
}

export type club = {
    id: string, //uuid
    name: string,
    locations: venue[], //uuid references to venues
    contactEmail: string,
    contactPersonId: string, //uuid references to profiles
    site?: string,
    logoUrl?: string,
}
