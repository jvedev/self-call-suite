# Security Policies for Tournament Management Application

## 1. Super Admin
- Has the highest level of access across the platform.
- Only Super Admin can delete clubs or users/profiles.
- Only Super Admin can change outcomes of fights after a tournament has ended.
- Can perform all actions available to Application Admin.
- Responsible for critical system-wide changes and emergency interventions.

## 2. Application Admin
- Has full access to all data and management features across the platform, except for actions reserved for Super Admin.
- Can create, edit, and manage clubs, events, venues, and users.
- Responsible for onboarding new clubs and assigning initial club admins.
- Can assign or revoke any role for any user, except Super Admin.
- Cannot delete clubs or users/profiles (reserved for Super Admin).
- Cannot change outcomes of fights after a tournament has ended (reserved for Super Admin).

## 3. Club Admin
- Assigned by an application admin or another club admin.
- Can manage their club's profile, venues, and members.
- Can assign or revoke club admin roles within their club.
- Can create and manage events under their club.
- Cannot access or modify data belonging to other clubs.
- Cannot delete their club or users/profiles (reserved for Super Admin).

## 4. Event Director
- Assigned to an event by a club admin or application admin.
- Can manage all data related to their assigned event (e.g., schedule, participants, pools, fights) while the event/tournament is in 'open' or 'live' state.
- Can assign additional event directors to the same event.
- Can assign table officials to specific pools or fights within their event.
- Cannot access or modify events they are not assigned to.
- Cannot change outcomes of fights after a tournament has ended (reserved for Super Admin).

## 5. Table Official
- Assigned to a pool or fight by an event director.
- Can manage all fight-related data for the pools/fights they are assigned to (e.g., scores, warnings, match results) while the event/tournament is in 'open' or 'live' state.
- Cannot access or modify data for pools/fights they are not assigned to.
- Cannot change outcomes of fights after a tournament has ended (reserved for Super Admin).

## 6. State Management (open/live/ended)
- Each event/tournament has a state: 'open', 'live', or 'ended'.
- 'Open':
  - Event/tournament is being set up; data can be freely edited by authorized roles.
  - All data on open tournaments can be publicly viewed.
  - Only the name or alias and club affiliation will be shown for fighters; no other personal or sensitive information is public.
- 'Live':
  - Event/tournament is in progress; data can be updated by authorized roles.
  - Public visibility is the same as 'open' unless otherwise restricted by event settings.
- 'Ended':
  - Event/tournament is finished; only Super Admin can make changes to fight outcomes or other critical data.
  - Public can view results as in 'open', but no further edits are allowed except by Super Admin for specific cases.
- Closed tournaments:
  - Only club members can see closed tournaments from their own club.
  - Data from closed tournaments is not publicly visible.
- State transitions should be logged and require confirmation by an Application Admin or higher.

## 7. General Principles
- All actions must be logged for audit purposes.
- Users can only access data relevant to their assigned roles and responsibilities (principle of least privilege).
- Role assignments and permissions should be enforced using Supabase Row Level Security (RLS) policies.
- Sensitive operations (e.g., role changes, deletions) should require confirmation and, where possible, multi-factor authentication.

---

# Suggestions for Further Security Improvements

1. **Enforce Row Level Security (RLS) in Supabase**
   - Define RLS policies for each table to restrict access based on user roles and relationships (e.g., only club admins can modify their club's data).
   - Regularly review and test RLS policies for gaps.

2. **Implement Least Privilege Principle**
   - Ensure users only have the minimum permissions necessary for their role.
   - Periodically audit user roles and permissions.

3. **Secure Authentication**
   - Use strong password policies and encourage multi-factor authentication (MFA) for all admin roles.
   - Monitor for suspicious login activity.

4. **Comprehensive Logging and Auditing**
   - Log all sensitive actions (role changes, deletions, data exports) with user ID and timestamp.
   - Regularly review logs for unauthorized or suspicious activity.

5. **Regular Security Reviews**
   - Schedule periodic reviews of security policies, RLS rules, and user permissions.
   - Update policies as new features or roles are added.

6. **Data Validation and Input Sanitization**
   - Validate all user input on both client and server sides to prevent injection attacks.
   - Use parameterized queries and ORM features to avoid SQL injection.

7. **Secure API Endpoints**
   - Protect all API endpoints with authentication and authorization checks.
   - Rate-limit sensitive endpoints to prevent abuse.

8. **User Privacy Controls**
   - Allow users to control the visibility of their profiles and personal data.
   - Comply with relevant data protection regulations (e.g., GDPR).

9. **Incident Response Plan**
   - Develop and document a plan for responding to security incidents, including notification procedures and recovery steps.

10. **Training and Awareness**
    - Provide regular security training for admins and staff.
    - Encourage reporting of suspicious activity or potential vulnerabilities.

---

_These policies and suggestions should be reviewed and updated regularly to adapt to new threats and changes in application functionality._
