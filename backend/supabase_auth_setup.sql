-- Supabase Auth Setup Script: Email/Password Auth, JWT, Password Recovery
-- This script is for use with Supabase CLI or SQL editor. Some steps require dashboard/API configuration.

-- 1. Enable email/password authentication (no SQL needed; Supabase enables by default)
-- If you want to disable other providers, use the Supabase dashboard or API.

-- 2. Configure SMTP for password recovery (must be done in Supabase dashboard or via API)
-- Example API call (replace with your SMTP credentials):
-- curl -X POST 'https://api.supabase.io/v1/projects/<project_ref>/auth/config' \
--   -H 'Authorization: Bearer <service_role_token>' \
--   -H 'Content-Type: application/json' \
--   -d '{"SMTP_ADMIN_EMAIL":"your@email.com","SMTP_HOST":"smtp.example.com","SMTP_PORT":587,"SMTP_USER":"smtp_user","SMTP_PASS":"smtp_pass"}'

-- 3. JWT is automatically issued by Supabase Auth on login; no SQL needed.
-- You can verify JWT settings in the dashboard (Settings > Auth > JWT Secret).

-- 4. Optional: Restrict signups to invited users only
-- update auth.settings set signup_enabled = false;
-- Or allow open signups (default):
-- update auth.settings set signup_enabled = true;

-- 5. Optional: Set password policy (minimum length, complexity)
-- update auth.settings set password_min_length = 8;
-- update auth.settings set password_require_special = true;
-- update auth.settings set password_require_number = true;
-- update auth.settings set password_require_upper = true;
-- update auth.settings set password_require_lower = true;

-- 6. Optional: Enable email confirmation
-- update auth.settings set email_confirm_enabled = true;

-- 7. Optional: Set session expiration (JWT lifetime)
-- update auth.settings set jwt_exp = 3600; -- 1 hour

-- 8. Password recovery is handled by Supabase Auth; users can request password reset via API/JS client.
-- No SQL needed. Example JS:
-- supabase.auth.resetPasswordForEmail(email);

-- 9. For PWA: Use Supabase JS client to handle login, JWT, and session management.
-- No SQL needed. Example JS:
-- const { user, session, error } = await supabase.auth.signInWithPassword({ email, password });
-- supabase.auth.onAuthStateChange((event, session) => { /* handle JWT/session */ });

-- 10. For advanced hooks (e.g., custom email templates), use the dashboard or API.

-- Summary: Most authentication features are managed by Supabase Auth and configured via dashboard/API, not SQL. This script provides SQL for password policy and signup settings, and API examples for SMTP and JWT config.

