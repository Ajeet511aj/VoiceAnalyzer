// ═══════════════════════════════════════════════
//  APP INIT
// ═══════════════════════════════════════════════
async function init() {
  initSupabase();

  if (supabaseClient) {
    // Check existing session
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
      State.user = session.user;
      await loadProfile();
      navigate('dashboard');
      return;
    }

    // Listen for auth changes
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        State.user = session.user;
        loadProfile().then(() => navigate('dashboard'));
      } else if (event === 'SIGNED_OUT') {
        State.user = null;
        navigate('home');
      }
    });
  }

  navigate('home');
}

init();
