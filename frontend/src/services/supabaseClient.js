import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cfnqbwxgtzusysfmirby.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_75DRbiW9rmd1tiJgvraP2A_2RLIEeJu';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    '[NinaivOsai Auth] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing in frontend/.env. Falling back to project defaults.'
  );
}

/**
 * Singleton Supabase Client for Frontend Authentication & Data
 * Configured for persistent session storage and automatic token refresh.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

export default supabase;
