// ═══════════════════════════════════════════════
//  PRICING VIEW
// ═══════════════════════════════════════════════

function renderPricing() {
  // SEO Updates
  document.title = "Pricing — VoxIQ AI Voice Analyzer";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", "Choose the best plan for your voice analysis needs. Affordable pricing in INR for individuals and businesses.");
  } else {
    const meta = document.createElement('meta');
    meta.name = "description";
    meta.content = "Choose the best plan for your voice analysis needs. Affordable pricing in INR for individuals and businesses.";
    document.head.appendChild(meta);
  }

  return `
    <div class="page fade-in">
      <nav class="topnav">
        <div class="logo" onclick="navigate('home')" style="cursor:pointer">
          <div class="logo-icon"></div>
          <span class="logo-text">VoxIQ</span>
        </div>
        <div class="nav-links">
          <a class="nav-link" onclick="navigate('home')">Home</a>
          <a class="nav-link active">Pricing</a>
        </div>
        <div class="flex items-center gap-4">
            <button class="btn btn-ghost btn-sm" onclick="navigate('auth')">Log In</button>
            <button class="btn btn-primary btn-sm" onclick="navigate('auth')">Get Started</button>
        </div>
      </nav>

      <div class="pricing-container" style="padding-top: 80px; text-align: center;">
        <h1 class="t-xl grad-text" style="margin-bottom: 16px;">Simple, Transparent Pricing</h1>
        <p class="muted t-md" style="max-width: 600px; margin: 0 auto 48px;">
          Invest in your communication skills with our AI-powered voice analysis. Choose a plan that fits your goals.
        </p>

        <div class="grid-3">
          <!-- Free Plan -->
          <div class="card pricing-card">
            <div class="pricing-badge">Basic</div>
            <h3 class="t-md">Starter</h3>
            <div class="price">
              <span class="currency">₹</span>
              <span class="amount">0</span>
              <span class="period">/mo</span>
            </div>
            <ul class="pricing-features">
              <li>5 Analyses per month</li>
              <li>Basic Voice Metrics</li>
              <li>7-day History</li>
              <li>Standard Support</li>
            </ul>
            <button class="btn btn-ghost w-full" onclick="navigate('auth')">Start for Free</button>
          </div>

          <!-- Pro Plan -->
          <div class="card pricing-card featured">
            <div class="pricing-badge featured">Popular</div>
            <h3 class="t-md">Pro</h3>
            <div class="price">
              <span class="currency">₹</span>
              <span class="amount">499</span>
              <span class="period">/mo</span>
            </div>
            <ul class="pricing-features">
              <li>Unlimited Analyses</li>
              <li>Advanced AI Insights</li>
              <li>Lifetime History</li>
              <li>Detailed PDF Reports</li>
              <li>Priority Support</li>
            </ul>
            <button class="btn btn-primary w-full" onclick="navigate('auth')">Upgrade to Pro</button>
          </div>

          <!-- Business Plan -->
          <div class="card pricing-card">
            <div class="pricing-badge">Business</div>
            <h3 class="t-md">Enterprise</h3>
            <div class="price">
              <span class="currency">₹</span>
              <span class="amount">1,499</span>
              <span class="period">/mo</span>
            </div>
            <ul class="pricing-features">
              <li>Team Collaboration</li>
              <li>API Access</li>
              <li>Custom Branding</li>
              <li>Dedicated Account Manager</li>
              <li>SSO Integration</li>
            </ul>
            <button class="btn btn-ghost w-full" onclick="navigate('auth')">Contact Sales</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function bindPricing() {
  // Interaction logic if needed
}
