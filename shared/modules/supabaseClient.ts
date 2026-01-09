import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:3000';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '<your-anon-key-here>';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example: sign in with email/password
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user, session: data.session };
}

// Example: sign in with OAuth
export async function signInWithProvider(provider: 'google' | 'github') {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) throw error;
  return data; // data contains { provider, url }
}

// Example: get JWT
export async function getJWT() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session?.access_token;
}
