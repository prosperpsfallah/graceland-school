
import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// GRACAIS E-PORTAL — SUPABASE CONNECTION
// ============================================

const SUPABASE_URL =
  "https://vmqxzylwaeowgoqhyaxm.supabase.co";

// Replace this placeholder with your actual
// publishable key or legacy anon key.
// Never use a service_role or secret key.

const SUPABASE_ANON_KEY =
  "INSERT_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE";

// ============================================
// INITIALIZE SUPABASE
// ============================================

let supabase = null;
let supabaseReady = false;

const keyIsConfigured =
  SUPABASE_ANON_KEY.length > 20 &&
  !SUPABASE_ANON_KEY.includes("INSERT_YOUR_");

if (
  SUPABASE_URL.startsWith("https://") &&
  keyIsConfigured
) {
  try {
    supabase = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    supabaseReady = true;

    console.info(
      "GRACAIS Supabase client initialized."
    );
  } catch (error) {
    console.error(
      "GRACAIS Supabase initialization failed:",
      error
    );
  }
} else {
  console.warn(
    "GRACAIS Supabase URL or publishable key is not configured."
  );
}

export { supabase, supabaseReady };
