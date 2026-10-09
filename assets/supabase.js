// ============================================
// GRACAIS E-PORTAL
// SUPABASE CONNECTION
// ============================================
// Replace these two values with credentials
// from your NEW Supabase project.
const SUPABASE_URL = "YOUR_NEW_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "YOUR_NEW_SUPABASE_PUBLISHABLE_OR_ANON_KEY";
// ============================================
// INITIALIZE SUPABASE
// ============================================
let supabase = null;
let supabaseReady = false;
try {
  if (
    SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("YOUR_NEW_") &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.includes("YOUR_NEW_")
  ) {
    // The Supabase client must be installed or imported
    // using the method selected for this project.
    console.info("GRACAIS Supabase credentials are configured.");
  } else {
    console.warn(
      "GRACAIS Supabase is not configured yet."
    );
  }
} catch (error) {
  console.error(
    "GRACAIS Supabase initialization error:",
    error
  );
}
export {
  supabase,
  supabaseReady
};