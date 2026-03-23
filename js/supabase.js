// ═══════════════════════════════════════════════
//  SUPABASE INIT
// ═══════════════════════════════════════════════
function initSupabase() {
  try {
    supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON);
    console.log('✅ Supabase connected:', CONFIG.SUPABASE_URL);
    return true;
  } catch(e) {
    console.error('❌ Supabase init failed:', e);
    return false;
  }
}
