// ═══════════════════════════════════════════════
//  AUTH VIEW
// ═══════════════════════════════════════════════
function renderAuth() {
  return `
  <div class="auth-bg fade-in">
    <div class="auth-card card card-glow">
      <div onclick="navigate('home')" style="display:flex;align-items:center;gap:10px;margin-bottom:28px;cursor:pointer">
        <div class="logo-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" fill="white"/></svg></div>
        <span class="logo-text" style="font-size:1.3rem">VoxIQ</span>
      </div>
      <a onclick="navigate('home')" class="muted t-xs" style="display:block;margin-bottom:20px;text-decoration:none;cursor:pointer">← Back to Home</a>
      <div id="auth-mode-login">
        <h2 class="auth-title">Welcome back</h2>
        <p class="auth-subtitle">Sign in to your voice analysis dashboard</p>
        <div id="auth-error" class="error-msg hidden"></div>
        <div id="auth-success" class="success-msg hidden"></div>
        <div class="form-group">
          <label class="label">Email address</label>
          <input id="login-email" class="input" type="email" placeholder="you@example.com" autocomplete="email"/>
        </div>
        <div class="form-group">
          <label class="label">Password</label>
          <input id="login-password" class="input" type="password" placeholder="••••••••" autocomplete="current-password"/>
        </div>
        <button id="btn-login" class="btn btn-primary w-full btn-lg" style="margin-top:4px">
          <span>Sign In</span>
        </button>
        <div class="switch-mode">Don't have an account? <a onclick="toggleAuthMode()">Create one free</a></div>
      </div>
      <div id="auth-mode-register" class="hidden">
        <h2 class="auth-title">Get started free</h2>
        <p class="auth-subtitle">Analyze your voice with AI in seconds</p>
        <div id="reg-error" class="error-msg hidden"></div>
        <div id="reg-success" class="success-msg hidden"></div>
        <div class="form-group">
          <label class="label">Full Name</label>
          <input id="reg-name" class="input" type="text" placeholder="Your name" autocomplete="name"/>
        </div>
        <div class="form-group">
          <label class="label">Email address</label>
          <input id="reg-email" class="input" type="email" placeholder="you@example.com" autocomplete="email"/>
        </div>
        <div class="form-group">
          <label class="label">Password</label>
          <input id="reg-password" class="input" type="password" placeholder="Min 6 characters" autocomplete="new-password"/>
        </div>
        <button id="btn-register" class="btn btn-primary w-full btn-lg" style="margin-top:4px">
          <span>Create Account</span>
        </button>
        <div class="switch-mode">Already have an account? <a onclick="toggleAuthMode()">Sign in</a></div>
      </div>
      ${!CONFIG.SUPABASE_URL ? `
      <div style="margin-top:20px;padding:12px 14px;background:var(--amber-dim);border:1px solid rgba(245,158,11,.3);border-radius:10px;font-size:.82rem;color:var(--amber)">
        ⚠️ Supabase not configured.
        <br/><br/>
        <button onclick="demoLogin()" class="btn btn-ghost btn-sm w-full" style="margin-top:8px">Continue in Demo Mode →</button>
      </div>` : ''}
    </div>
  </div>`;
}

function toggleAuthMode() {
  document.getElementById('auth-mode-login').classList.toggle('hidden');
  document.getElementById('auth-mode-register').classList.toggle('hidden');
}

function bindAuth() {
  const btnLogin = document.getElementById('btn-login');
  const btnReg = document.getElementById('btn-register');
  if (btnLogin) btnLogin.addEventListener('click', handleLogin);
  if (btnReg) btnReg.addEventListener('click', handleRegister);

  // Enter key
  document.getElementById('login-password')?.addEventListener('keydown', e => { if(e.key==='Enter') handleLogin(); });
  document.getElementById('reg-password')?.addEventListener('keydown', e => { if(e.key==='Enter') handleRegister(); });
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const btn = document.getElementById('btn-login');
  const errEl = document.getElementById('auth-error');
  errEl.classList.add('hidden');

  if (!email || !pass) { errEl.textContent='Please fill in all fields'; errEl.classList.remove('hidden'); return; }
  btn.disabled = true; btn.innerHTML = '<div class="spinner"></div><span>Signing in...</span>';

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
  if (error) {
    errEl.textContent = error.message; errEl.classList.remove('hidden');
    btn.disabled=false; btn.innerHTML='<span>Sign In</span>';
  } else {
    State.user = data.user;
    await loadProfile();
    navigate('dashboard');
  }
}

async function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value;
  const btn = document.getElementById('btn-register');
  const errEl = document.getElementById('reg-error');
  const sucEl = document.getElementById('reg-success');
  errEl.classList.add('hidden'); sucEl.classList.add('hidden');

  if (!name || !email || !pass) { errEl.textContent='Please fill all fields'; errEl.classList.remove('hidden'); return; }
  if (pass.length < 6) { errEl.textContent='Password must be at least 6 characters'; errEl.classList.remove('hidden'); return; }

  btn.disabled=true; btn.innerHTML='<div class="spinner"></div><span>Creating account...</span>';

  const { data, error } = await supabaseClient.auth.signUp({ email, password: pass, options: { data: { full_name: name } } });
  if (error) {
    errEl.textContent = error.message; errEl.classList.remove('hidden');
    btn.disabled=false; btn.innerHTML='<span>Create Account</span>';
  } else {
    sucEl.textContent = 'Account created! Please check your email to verify, then sign in.';
    sucEl.classList.remove('hidden');
    btn.disabled=false; btn.innerHTML='<span>Create Account</span>';
    // Insert profile
    if (data.user) {
      await supabaseClient.from('profiles').upsert({ id: data.user.id, full_name: name });
    }
  }
}

function demoLogin() {
  State.user = { id: 'demo', email: 'demo@voxiq.ai', user_metadata: { full_name: 'Demo User' } };
  State.profile = { full_name: 'Demo User', plan: 'pro' };
  navigate('dashboard');
}

async function loadProfile() {
  if (!supabaseClient || !State.user) return;
  const { data } = await supabaseClient.from('profiles').select('*').eq('id', State.user.id).single();
  State.profile = data;
}

async function logout() {
  if (supabaseClient) await supabaseClient.auth.signOut();
  State.user = null; State.profile = null; State.audioBlob = null; State.audioURL = null;
  navigate('auth');
}
