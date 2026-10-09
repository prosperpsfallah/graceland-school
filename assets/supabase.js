// ============================================
// GRACAIS E-PORTAL
// SUPABASE CONNECTION
// ============================================

import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// EXISTING SUPABASE PROJECT
// ============================================

const SUPABASE_URL =
  "https://zrrfiieqnjeizwmxkffp.supabase.co";

// IMPORTANT:
// Replace the placeholder below with your
// project's actual publishable/anon key.
// Never put a service_role or secret key here.

const SUPABASE_ANON_KEY =
  "PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE";

// ============================================
// INITIALIZE CONNECTION
// ============================================

let supabase = null;
let supabaseReady = false;

try {
  const keyIsConfigured =
    SUPABASE_ANON_KEY.length > 20 &&
    !SUPABASE_ANON_KEY.includes("PASTE_YOUR_");

  if (
    SUPABASE_URL.startsWith("https://") &&
    keyIsConfigured
  ) {
    supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    supabaseReady = true;

    console.info(
      "GRACAIS Supabase client initialized."
    );
  } else {
    console.warn(
      "GRACAIS Supabase needs its publishable/anon key."
    );
  }
} catch (error) {
  console.error(
    "GRACAIS Supabase initialization failed:",
    error
  );

  supabase = null;
  supabaseReady = false;
}

// ============================================
// EXPORT FOR PORTAL FILES
// ============================================

export {
  supabase,
  supabaseReady
};