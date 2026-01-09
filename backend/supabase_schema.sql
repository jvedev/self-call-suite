-- Supabase SQL schema for tournament suite
-- Auth roles: admin, table-crew, staff (for authentication)
-- Tournament roles: fighter, judge, referee, table-crew (for participants)

-- 1. venues
drop table if exists venues cascade;
create table venues (
    id uuid primary key default gen_random_uuid(),
    country text not null,
    city text not null,
    address text not null,
    postal_code text,
    type text not null
);

-- 2. profiles (linked to auth.users)
drop table if exists profiles cascade;
create table profiles (
    id uuid primary key, -- references auth.users.id
    name text not null,
    alias text not null,
    email text not null unique,
    profile_image_url text,
    referee_rating integer not null default 0,
    jury_rating integer not null default 0,
    first_aid_certified boolean not null default false,
    use_alias boolean not null default false,
    public_profile boolean not null default true
);

-- 3. clubs
drop table if exists clubs cascade;
create table clubs (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    contact_email text not null,
    contact_person_id uuid references profiles(id),
    site text,
    logo_url text
);

-- 4. club_locations (many-to-many)
drop table if exists club_locations cascade;
create table club_locations (
    club_id uuid references clubs(id) on delete cascade,
    venue_id uuid references venues(id) on delete cascade,
    primary key (club_id, venue_id)
);

-- 5. events
drop table if exists events cascade;
create table events (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    start_datetime timestamptz not null,
    end_datetime timestamptz not null,
    organizer_id uuid references clubs(id),
    logo_url text,
    banner_url text,
    contact_email text not null,
    contact_person_id uuid references profiles(id),
    capacity integer,
    is_private boolean not null default false, -- Added for RLS
    is_published boolean not null default false -- Added for manager-only visibility
);

-- 6. event_locations (many-to-many)
drop table if exists event_locations cascade;
create table event_locations (
    event_id uuid references events(id) on delete cascade,
    venue_id uuid references venues(id) on delete cascade,
    primary key (event_id, venue_id)
);

-- 7. tournaments
drop table if exists tournaments cascade;
create table tournaments (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    event_id uuid references events(id) on delete cascade,
    description text,
    open_registration boolean not null default false,
    registration_deadline timestamptz,
    max_participants integer,
    state text not null check (state in ('open', 'live', 'ended', 'closed')) default 'open', -- Already present
    is_private boolean not null default false, -- Added for RLS
    is_published boolean not null default false -- Added for manager-only visibility
);

-- 8. arenas
drop table if exists arenas cascade;
create table arenas (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    venue_id uuid references venues(id),
    description text,
    event_id uuid references events(id)
);

-- 9. profile_clubs (many-to-many)
drop table if exists profile_clubs cascade;
create table profile_clubs (
    profile_id uuid references profiles(id) on delete cascade,
    club_id uuid references clubs(id) on delete cascade,
    primary key (profile_id, club_id)
);

-- 10. participants
drop table if exists participants cascade;
create table participants (
    id uuid primary key default gen_random_uuid(),
    profile_id uuid references profiles(id),
    tournament_id uuid references tournaments(id),
    registration_date timestamptz not null
);

-- 11. participant_roles (many-to-many)
drop table if exists participant_roles cascade;
create table participant_roles (
    participant_id uuid references participants(id) on delete cascade,
    role text check (role in ('fighter', 'judge', 'jury', 'crew', 'referee')),
    primary key (participant_id, role)
);

-- 12. pools
drop table if exists pools cascade;
create table pools (
    id uuid primary key default gen_random_uuid(),
    tournament_id uuid references tournaments(id),
    arena_id uuid references arenas(id),
    description text,
    start_datetime timestamptz not null
);

-- 13. pool_judges
drop table if exists pool_judges cascade;
create table pool_judges (
    pool_id uuid references pools(id) on delete cascade,
    participant_id uuid references participants(id) on delete cascade,
    primary key (pool_id, participant_id)
);

-- 14. pool_jury
drop table if exists pool_jury cascade;
create table pool_jury (
    pool_id uuid references pools(id) on delete cascade,
    participant_id uuid references participants(id) on delete cascade,
    primary key (pool_id, participant_id)
);

-- 15. pool_crew
drop table if exists pool_crew cascade;
create table pool_crew (
    pool_id uuid references pools(id) on delete cascade,
    participant_id uuid references participants(id) on delete cascade,
    primary key (pool_id, participant_id)
);

-- 16. pool_fighters
drop table if exists pool_fighters cascade;
create table pool_fighters (
    pool_id uuid references pools(id) on delete cascade,
    participant_id uuid references participants(id) on delete cascade,
    primary key (pool_id, participant_id)
);

-- 17. fights
drop table if exists fights cascade;
create table fights (
    id uuid primary key default gen_random_uuid(),
    pool_id uuid references pools(id),
    red_participant_id uuid references participants(id),
    blue_participant_id uuid references participants(id),
    scheduled_datetime timestamptz not null,
    score_red integer not null default 0,
    score_blue integer not null default 0
);

-- 18. matches
drop table if exists matches cascade;
create table matches (
    id uuid primary key default gen_random_uuid(),
    fight_id uuid references fights(id)
);

-- 19. warnings
drop table if exists warnings cascade;
create table warnings (
    id uuid primary key default gen_random_uuid(),
    warning text not null,
    player text check (player in ('red', 'blue')),
    penalty integer not null
);

-- 20. exchanges
drop table if exists exchanges cascade;
create table exchanges (
    id uuid primary key default gen_random_uuid(),
    match_id uuid references matches(id),
    passed_time integer not null,
    score_red_type text check (score_red_type in ('hit', 'double', 'blue-first', 'red-first', 'no-score', 'unclear')),
    score_red integer not null,
    low_quality_red boolean not null,
    score_blue_type text check (score_blue_type in ('hit', 'double', 'blue-first', 'red-first', 'no-score', 'unclear')),
    score_blue integer not null,
    low_quality_blue boolean not null,
    warning_red_id uuid references warnings(id),
    warning_blue_id uuid references warnings(id)
);

-- 21. Authentication roles (admin, table-crew, staff)
-- Use Supabase Auth policies and the auth.users table for authentication.
-- You can add a 'role' column to the profiles table or use a separate user_roles table if needed.

drop table if exists user_roles cascade;
create table user_roles (
    user_id uuid references auth.users(id) on delete cascade,
    role text check (role in ('admin', 'table-crew', 'staff')),
    primary key (user_id, role)
);

-- Indexes and constraints can be added as needed for performance and integrity.


-- list off disciples drop table if exists disciplines cascade;
drop table if exists disciplines cascade;
create table disciplines (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    logo_url text default null
);

-- many-to-many relationship between tournaments and disciplines
drop table if exists tournament_disciplines cascade;
create table tournament_disciplines (
    tournament_id uuid references tournaments(id) on delete cascade,
    discipline_id uuid references disciplines(id) on delete cascade,
    primary key (tournament_id, discipline_id)
);

-- rating per profile and discipline
drop table if exists profile_discipline_ratings cascade;
create table profile_discipline_ratings (
    profile_id uuid references profiles(id) on delete cascade,
    discipline_id uuid references disciplines(id) on delete cascade,
    rating integer not null default 0,
    primary key (profile_id, discipline_id)
);
