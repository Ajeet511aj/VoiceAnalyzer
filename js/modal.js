// ═══════════════════════════════════════════════
//  SETUP MODAL
// ═══════════════════════════════════════════════
function showSetupModal() {
  const modals = document.getElementById('modals');
  modals.innerHTML = `
  <div class="modal-overlay" id="setup-modal" onclick="if(event.target.id==='setup-modal')closeModal()">
    <div class="modal" style="max-width:560px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
        <h3 style="font-size:1.1rem;font-weight:700">⚙️ Supabase Setup</h3>
        <button class="btn btn-ghost btn-sm" onclick="closeModal()">✕</button>
      </div>
      <p class="muted" style="font-size:.85rem;margin-bottom:20px">Enter your Supabase project credentials to enable authentication and data storage.</p>
      <div class="form-group">
        <label class="label">Supabase Project URL</label>
        <input id="sb-url" class="input" type="text" placeholder="https://xxxx.supabase.co" value="${CONFIG.SUPABASE_URL}"/>
      </div>
      <div class="form-group">
        <label class="label">Supabase Anon Key</label>
        <input id="sb-anon" class="input" type="text" placeholder="eyJhbGciOi..." value="${CONFIG.SUPABASE_ANON}"/>
      </div>
      <div class="flex gap-3">
        <button class="btn btn-primary flex-1" onclick="saveSupabaseConfig()">Save & Connect</button>
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  </div>`;
}

function saveSupabaseConfig() {
  toast('Supabase is already connected!', 'success');
  closeModal();
}

function closeModal() {
  document.getElementById('modals').innerHTML = '';
}
