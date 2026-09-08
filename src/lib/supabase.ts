/**
 * Supabase client helpers.
 * Returns null when credentials are not configured so the app
 * continues with in-memory / deterministic behavior.
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Placeholder for future Supabase client.
 * Do not import @supabase/supabase-js until the dependency is added
 * and credentials are present.
 */
export function getSupabaseStatus(): {
  configured: boolean;
  message: string;
} {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      message:
        "Supabase not configured. Using in-memory sessions and cache.",
    };
  }
  return {
    configured: true,
    message: "Supabase credentials detected.",
  };
}
