-- Script to setup HEMA disciplines in Supabase
drop table if exists disciplines cascade;
create table disciplines (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    logo_url text default null
);

-- Insert common HEMA disciplines
insert into disciplines (name, description) values
('Longsword', 'Traditional two-handed sword used in HEMA competitions'),
('Messers', 'Large single-edged sword, similar to a falchion'),
('Sword & Buckler', 'One-handed sword paired with a small shield'),
('Dagger', 'Short blade used for close combat and self-defense'),
('Smallsword', 'Light thrusting sword, used in dueling and civilian self-defense'),
('Spear', 'Pole weapon used for thrusting and throwing'),
('Sabre', 'Cutting and thrusting sword, used in military and sport contexts'),
('Poleaxe', 'Pole weapon with axe, hammer, and spike'),
('Montante', 'Large two-handed sword, also known as spadone or greatsword'),
('Quarter Staff', 'Simple long stick used for striking and defense'),
('Single Stick', 'Wooden training weapon for simulating swordplay'),
('Rapier', 'Thrust-oriented sword, popular in Renaissance fencing')
;

