
import { createClient } from
  "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL =
  "https://vmqxzylwaeowgoqhyaxm.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtcXh6eWx3YWVvd2dvcWh5YXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NjUzMTUsImV4cCI6MjEwNzI0MTMxNX0.m47dkyHqzoeCl-zLTktmdwxIkj3ms2sBZjoEDvaTC3Q";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const supabaseReady = true;

export { supabase, supabaseReady };
