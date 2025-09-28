// const { createClient } = require("@supabase/supabase-js");

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

<<<<<<< HEAD
// if (!supabaseUrl || !supabaseServiceKey) {
//   throw new Error(
//     "Missing Supabase configuration. Please check your environment variables."
//   );
// }

// // Service role client for server-side operations
// const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
//   auth: {
//     persistSession: false,
//     autoRefreshToken: false,
//   },
// });
=======
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase configuration. Please check your environment variables."
  );
}

// Warn if service key is missing
if (
  !supabaseServiceKey ||
  supabaseServiceKey === "your_supabase_service_role_key_here"
) {
  console.warn(
    "⚠️  WARNING: SUPABASE_SERVICE_KEY not set. Using anon key for admin operations (NOT RECOMMENDED FOR PRODUCTION)"
  );
  console.warn(
    "📝 To fix: Go to Supabase Dashboard → Settings → API → Copy service_role key"
  );
}

// Service role client for server-side operations
// Use service key if available, fallback to anon key for development
const adminKey =
  supabaseServiceKey &&
  supabaseServiceKey !== "your_supabase_service_role_key_here"
    ? supabaseServiceKey
    : supabaseAnonKey;

const supabaseAdmin = createClient(supabaseUrl, adminKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
>>>>>>> e2783ad38f5cee2a036891766cb72fd9948412f5

// // Anonymous client for public operations
// const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// module.exports = {
//   supabaseAdmin,
//   supabaseAnon,
// };
