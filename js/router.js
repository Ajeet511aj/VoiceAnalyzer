// ═══════════════════════════════════════════════
//  ROUTER
// ═══════════════════════════════════════════════
function navigate(view, data={}, push=true) {
  State.view = view;
  if (data.analysis) State.currentAnalysis = data.analysis;
  
  // Update browser history (use hash for simplest SPA support)
  if (push) {
    history.pushState({view, data}, "", `#${view}`);
  }

  // Destroy charts before re-render
  Object.values(State.charts).forEach(c => { try { c.destroy(); } catch(e){} });
  State.charts = {};
  renderView();
}

// Handle browser Back/Forward buttons
window.onpopstate = (e) => {
  const hashView = location.hash.replace('#', '');
  if (e.state && e.state.view) {
    navigate(e.state.view, e.state.data, false);
  } else if (hashView) {
    navigate(hashView, {}, false);
  } else {
    navigate('home', {}, false);
  }
};

// Handle initial load based on URL hash
window.addEventListener('load', () => {
  const hashView = location.hash.replace('#', '');
  if (hashView && hashView !== State.view) {
    navigate(hashView, {}, false);
  }
});

function renderView() {
  const container = document.getElementById('view-container');
  switch(State.view) {
    case 'home':        container.innerHTML = renderHome(); bindHome(); break;
    case 'auth':        container.innerHTML = renderAuth(); bindAuth(); break;
    case 'dashboard':   container.innerHTML = renderDashboard(); bindDashboard(); break;
    case 'processing':  container.innerHTML = renderProcessing(); startProcessing(); break;
    case 'results':     container.innerHTML = renderResults(); bindResults(); break;
    case 'history':     container.innerHTML = renderHistory(); bindHistory(); loadHistory(); break;
    case 'pricing':     container.innerHTML = renderPricing(); bindPricing(); break;
  }
}
