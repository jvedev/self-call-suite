/**
 * Role definitions and permission types for Suite application
 */

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  APPLICATION_ADMIN = 'application_admin',
  CLUB_ADMIN = 'club_admin',
  EVENT_DIRECTOR = 'event_director',
  EVENT_PARTICIPANT = 'event_participant',
  TABLE_OFFICIAL = 'table_official',
}

export enum Permission {
  // Super Admin permissions
  DELETE_CLUBS = 'delete_clubs',
  DELETE_USERS = 'delete_users',
  CHANGE_FIGHT_OUTCOMES_AFTER_END = 'change_fight_outcomes_after_end',

  // Admin permissions
  CREATE_CLUBS = 'create_clubs',
  EDIT_CLUBS = 'edit_clubs',
  MANAGE_ADMINS = 'manage_admins',
  CREATE_EVENTS = 'create_events',
  EDIT_EVENTS = 'edit_events',
  MANAGE_VENUES = 'manage_venues',
  MANAGE_USERS = 'manage_users',

  // Club Admin permissions
  MANAGE_CLUB_PROFILE = 'manage_club_profile',
  MANAGE_CLUB_VENUES = 'manage_club_venues',
  MANAGE_CLUB_MEMBERS = 'manage_club_members',
  CREATE_CLUB_EVENTS = 'create_club_events',
  EDIT_CLUB_EVENTS = 'edit_club_events',

  // Event Director permissions
  MANAGE_EVENT_DATA = 'manage_event_data',
  ASSIGN_EVENT_DIRECTORS = 'assign_event_directors',
  ASSIGN_TABLE_OFFICIALS = 'assign_table_officials',

  // Table Official permissions
  MANAGE_FIGHT_DATA = 'manage_fight_data',
  UPDATE_SCORES = 'update_scores',
  RECORD_WARNINGS = 'record_warnings',

  // General permissions
  VIEW_PROFILE = 'view_profile',
  EDIT_PROFILE = 'edit_profile',
  VIEW_EVENTS = 'view_events',
  REGISTER_EVENTS = 'register_events',
}

export enum TournamentState {
  OPEN = 'open',
  LIVE = 'live',
  ENDED = 'ended',
  CLOSED = 'closed',
}

export interface UserProfile {
  id: string;
  name: string;
  alias: string;
  email: string;
  profileImageUrl?: string;
  refereeRating: number;
  juryRating: number;
  firstAidCertified: boolean;
  useAlias: boolean;
  publicProfile: boolean;
  roles: UserRole[];
  clubs: string[]; // club IDs
}

export interface Club {
  id: string;
  name: string;
  contactEmail: string;
  contactPersonId?: string;
  site?: string;
  logoUrl?: string;
}

export interface Event {
  id: string;
  name: string;
  startDatetime: Date;
  endDatetime: Date;
  organizerId: string;
  logoUrl?: string;
  bannerUrl?: string;
  contactEmail: string;
  contactPersonId?: string;
  capacity?: number;
  isPrivate: boolean;
  isPublished: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  eventId: string;
  description?: string;
  openRegistration: boolean;
  registrationDeadline?: Date;
  maxParticipants?: number;
  state: TournamentState;
  isPrivate: boolean;
  isPublished: boolean;
}

export interface Participant {
  id: string;
  profileId: string;
  tournamentId: string;
  registrationDate: Date;
  roles: ParticipantRole[];
}

export enum ParticipantRole {
  FIGHTER = 'fighter',
  JUDGE = 'judge',
  JURY = 'jury',
  CREW = 'crew',
  REFEREE = 'referee',
}

export interface Pool {
  id: string;
  tournamentId: string;
  arenaId?: string;
  description?: string;
  startDatetime: Date;
}

export interface Fight {
  id: string;
  poolId: string;
  redParticipantId: string;
  blueParticipantId: string;
  scheduledDatetime: Date;
  scoreRed: number;
  scoreBlue: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  currentClub?: Club;
  currentEvent?: Event;
  currentTournament?: Tournament;
  uiState: {
    sidebarOpen: boolean;
    currentRoute: string;
  };
}

