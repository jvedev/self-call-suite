-- Supabase RLS Policy Script for Tournament Suite
-- Enable RLS and implement least privilege, role-based access control

-- 1. Enable RLS on all relevant tables
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE fights ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_fighters ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_jury ENABLE ROW LEVEL SECURITY;
ALTER TABLE warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_discipline_ratings ENABLE ROW LEVEL SECURITY;

-- 2. Only club admins and super admins can update their club
CREATE POLICY "Club admins and super admins can update their club"
  ON clubs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profile_clubs pc
      JOIN user_roles ur ON pc.profile_id = auth.uid()
      WHERE pc.club_id = clubs.id
        AND ur.role IN ('club_admin', 'super_admin')
    )
  );

-- 3. Only club members can view closed tournaments from their club
CREATE POLICY "Club members can view closed tournaments"
  ON tournaments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM participants p
      JOIN profile_clubs pc ON p.profile_id = pc.profile_id
      WHERE p.tournament_id = tournaments.id
        AND pc.club_id = (SELECT organizer_id FROM events WHERE events.id = tournaments.event_id)
        AND pc.profile_id = auth.uid()
    )
    AND tournaments.state = 'closed'
  );

-- 4. Public can view open tournaments (limited fields)
CREATE POLICY "Public can view open tournaments"
  ON tournaments
  FOR SELECT
  USING (
    tournaments.state = 'open' AND tournaments.is_private = false
  );

-- 11. Only club members can view private tournaments
CREATE POLICY "Only club members can view private tournaments"
  ON tournaments
  FOR SELECT
  USING (
    tournaments.is_private = true
    AND EXISTS (
      SELECT 1 FROM participants p
      JOIN profile_clubs pc ON p.profile_id = pc.profile_id
      WHERE p.tournament_id = tournaments.id
        AND pc.club_id = (SELECT organizer_id FROM events WHERE events.id = tournaments.event_id)
        AND pc.profile_id = auth.uid()
    )
  );

-- 12. Only club members can view private events
CREATE POLICY "Only club members can view private events"
  ON events
  FOR SELECT
  USING (
    events.is_private = true
    AND EXISTS (
      SELECT 1 FROM profile_clubs pc
      WHERE pc.club_id = events.organizer_id
        AND pc.profile_id = auth.uid()
    )
  );

-- 13. Public can view open events (if not private)
CREATE POLICY "Public can view open events"
  ON events
  FOR SELECT
  USING (
    events.is_private = false
  );

-- 14. Only managers can view unpublished tournaments
CREATE POLICY "Only managers can view unpublished tournaments"
  ON tournaments
  FOR SELECT
  USING (
    tournaments.is_published = false
    AND (
      EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.role IN ('super_admin', 'application_admin')
      )
      OR EXISTS (
        SELECT 1 FROM profile_clubs pc
        JOIN user_roles ur ON pc.profile_id = ur.user_id
        WHERE pc.club_id = (SELECT organizer_id FROM events WHERE events.id = tournaments.event_id)
          AND ur.role = 'club_admin' AND ur.user_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1 FROM participants p
        JOIN participant_roles pr ON pr.participant_id = p.id
        WHERE p.tournament_id = tournaments.id
          AND pr.role = 'event_director'
          AND p.profile_id = auth.uid()
      )
    )
  );

-- 15. Only managers can view unpublished events
CREATE POLICY "Only managers can view unpublished events"
  ON events
  FOR SELECT
  USING (
    events.is_published = false
    AND (
      EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.role IN ('super_admin', 'application_admin')
      )
      OR EXISTS (
        SELECT 1 FROM profile_clubs pc
        JOIN user_roles ur ON pc.profile_id = ur.user_id
        WHERE pc.club_id = events.organizer_id
          AND ur.role = 'club_admin' AND ur.user_id = auth.uid()
      )
      OR events.contact_person_id = auth.uid()
    )
  );

-- 5. Only super admin can delete clubs or users
CREATE POLICY "Only super admin can delete clubs"
  ON clubs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'super_admin'
    )
  );

CREATE POLICY "Only super admin can delete users"
  ON profiles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'super_admin'
    )
  );

-- 6. Only authorized roles can update fights in open/live tournaments
CREATE POLICY "Authorized roles can update fights in live/open tournaments"
  ON fights
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role IN ('event_director', 'table_official', 'super_admin')
    )
    AND (SELECT state FROM tournaments t WHERE t.id = (SELECT tournament_id FROM pools WHERE pools.id = fights.pool_id)) IN ('open', 'live')
  );

-- 7. Only super admin can update fights after tournament ended
CREATE POLICY "Only super admin can update fights after tournament ended"
  ON fights
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
        AND ur.role = 'super_admin'
    )
    AND (SELECT state FROM tournaments t WHERE t.id = (SELECT tournament_id FROM pools WHERE pools.id = fights.pool_id)) = 'closed'
  );

-- 8. Only show name/alias and club affiliation for fighters in open tournaments
-- (Create a view for public data and restrict direct access to sensitive columns)
-- Example view:
-- CREATE VIEW public_fighters AS
-- SELECT p.id, p.name, p.alias, pc.club_id
-- FROM profiles p
-- JOIN participants pa ON pa.profile_id = p.id
-- JOIN pool_fighters pf ON pf.participant_id = pa.id
-- JOIN tournaments t ON pa.tournament_id = t.id
-- JOIN profile_clubs pc ON pc.profile_id = p.id
-- WHERE t.state = 'open';

-- 9. Regularly review and test RLS policies for gaps
-- (Add this to your security review checklist)

-- 10. Implement least privilege for all other tables as needed
-- (Repeat similar patterns for other tables and actions)
