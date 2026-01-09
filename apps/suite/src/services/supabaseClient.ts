/**
 * Supabase Client Configuration
 * Shared across all Suite services
 */

import { createClient } from '@supabase/supabase-js'

// Vite automatically replaces import.meta.env in browser
// For tests, we'll use process.env as fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

