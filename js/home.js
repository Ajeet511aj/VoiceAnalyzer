// ═══════════════════════════════════════════════
//  HOME VIEW
// ═══════════════════════════════════════════════

function renderHome() {
  // SEO Updates
  document.title = "VoxIQ — AI Voice Analyzer | Improve Your Communication";
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", "Unlock the power of your voice with VoxIQ. Get AI-powered insights on your pacing, tone, and confidence. Start your free analysis today.");
  }

  return `
    <div class="page-container fade-in">
      <div class="topnav">
        <div class="logo" onclick="navigate('home')" style="cursor:pointer">
          <div class="logo-icon"></div>
          <span class="logo-text">VoxIQ</span>
        </div>
        <div class="nav-links">
          <a class="nav-link" href="#features">Features</a>
          <a class="nav-link" onclick="navigate('pricing')">Pricing</a>
        </div>
        <div class="flex items-center gap-4">
            <button class="btn btn-ghost btn-sm" id="login-btn">Log In</button>
            <button class="btn btn-primary btn-sm" id="signup-btn">Get Started</button>
        </div>
      </div>

      <!-- HERO SECTION -->
      <section class="dash-hero text-center" style="margin-top: 80px; padding-bottom: 0;">
        <div class="badge badge-purple" style="margin-bottom: 24px;">✨ New: Emotion Analysis 2.0</div>
        <h1 class="t-xl grad-text" style="max-width: 800px; margin: 0 auto;">Master the Art of Perfect Communication</h1>
        <p class="t-md muted" style="max-width: 650px; margin: 24px auto 40px;">
          VoxIQ uses state-of-the-art AI to analyze your speech patterns, pacing, and tone in real-time. Whether you're preparing for a keynote or an interview, we help you speak with absolute confidence.
        </p>
        <div class="flex justify-center gap-4">
            <button class="btn btn-primary btn-lg" id="hero-get-started-btn">Start Your Free Analysis</button>
            <button class="btn btn-ghost btn-lg" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})">Explore Features</button>
        </div>

        <div class="hero-visual slide-up" style="margin-top: 80px;">
          <img src="C:/Users/Lenovo/.gemini/antigravity/brain/be0e8e34-7992-4c42-bd69-c9bef9271ccf/voxiq_dashboard_hero_1774169826945.png" alt="VoxIQ Dashboard Hero">
        </div>
      </section>

      <!-- TRUST BAR -->
      <div class="trust-bar section-header">
        <div class="trust-item">
            <div class="trust-val">100k+</div>
            <div class="trust-lbl">Voices Analyzed</div>
        </div>
        <div class="trust-item">
            <div class="trust-val">50k+</div>
            <div class="trust-lbl">Global Users</div>
        </div>
        <div class="trust-item">
            <div class="trust-val">99%</div>
            <div class="trust-lbl">AI Accuracy</div>
        </div>
        <div class="trust-item">
            <div class="trust-val">4.9/5</div>
            <div class="trust-lbl">User Rating</div>
        </div>
      </div>

      <!-- FEATURES SECTION -->
      <section id="features" style="padding: 100px 24px;">
        <div class="text-center" style="margin-bottom: 80px;">
            <h2 class="t-lg grad-text">Advanced AI Analysis Features</h2>
            <p class="muted" style="max-width: 500px; margin: 16px auto;">Everything you need to refine your verbal presence and impact.</p>
        </div>

        <div class="feat-row">
            <div class="feat-img">
                <div style="padding: 40px; background: var(--bg2); aspect-ratio: 16/9; display: flex; align-items: center; justify-content: center;">
                    <div class="mic-btn recording" style="transform: scale(1.5);">🎙️</div>
                </div>
            </div>
            <div class="feat-content">
                <div class="badge badge-cyan" style="margin-bottom: 16px;">Real-time</div>
                <h2 class="t-lg">Instant Vocal Coaching</h2>
                <p class="muted">Get live feedback on your pacing, volume, and filler words as you speak. Our AI provides micro-corrections to help you stay on track and maintain audience engagement.</p>
                <ul class="pricing-features" style="margin-left: 0;">
                    <li>Live Pacing Monitor</li>
                    <li>Filler Word Detection</li>
                    <li>Tone Sentiment Analysis</li>
                </ul>
            </div>
        </div>

        <div class="feat-row rev">
            <div class="feat-img">
                <div style="padding: 40px; background: var(--bg2); aspect-ratio: 16/9; display: flex; flex-direction: column; gap: 20px;">
                    <div class="progress-bar"><div class="progress-fill" style="width: 85%;"></div></div>
                    <div class="progress-bar"><div class="progress-fill" style="width: 60%; background: var(--purple);"></div></div>
                    <div class="progress-bar"><div class="progress-fill" style="width: 75%; background: var(--green);"></div></div>
                </div>
            </div>
            <div class="feat-content">
                <div class="badge badge-purple" style="margin-bottom: 16px;">Insights</div>
                <h2 class="t-lg">Deep Analytics Dashboard</h2>
                <p class="muted">Review your history and see your progress over time. Our detailed reports break down your vocabulary, emotional resonance, and structural clarity.</p>
                <button class="btn btn-ghost btn-sm" id="view-demo-btn">View Sample Report</button>
            </div>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section style="padding: 100px 24px; background: linear-gradient(180deg, transparent, var(--bg2));">
        <div class="text-center" style="margin-bottom: 60px;">
            <h2 class="t-lg">Loved by Professionals</h2>
        </div>
        <div class="grid-3">
            <div class="glass-card testimonial-card">
                <div class="quote">"VoxIQ completely changed how I prepare for my investor pitches. The pacing feedback was a game-changer for my confidence."</div>
                <div class="user-info">
                    <div class="user-img"></div>
                    <div>
                        <div class="user-name">Sarah Jenkins</div>
                        <div class="user-role">Startup Founder</div>
                    </div>
                </div>
            </div>
            <div class="glass-card testimonial-card">
                <div class="quote">"As a professional speaker, I'm always looking for ways to improve. VoxIQ's emotion analysis helps me hit the right note every time."</div>
                <div class="user-info">
                    <div class="user-img" style="background: var(--grad2);"></div>
                    <div>
                        <div class="user-name">David Chen</div>
                        <div class="user-role">Keynote Speaker</div>
                    </div>
                </div>
            </div>
            <div class="glass-card testimonial-card">
                <div class="quote">"The filler word detection is incredibly accurate. I've reduced my 'umms' and 'ahhs' by 80% in just two weeks of use."</div>
                <div class="user-info">
                    <div class="user-img" style="background: var(--amber);"></div>
                    <div>
                        <div class="user-name">Anita Rao</div>
                        <div class="user-role">HR Executive</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <!-- FAQ SECTION -->
      <section style="padding: 100px 24px; max-width: 800px; margin: 0 auto;">
        <h2 class="t-lg text-center" style="margin-bottom: 60px;">Frequently Asked Questions</h2>
        <div class="faq-container">
            <div class="faq-item">
                <div class="faq-q"><span>How accurate is the AI analysis?</span> <span class="faq-icon">↓</span></div>
                <div class="faq-a">Our AI models are trained on over 500,000 hours of professional speech data, achieving over 99% accuracy in pacing and word detection.</div>
            </div>
            <div class="faq-item">
                <div class="faq-q"><span>What audio formats do you support?</span> <span class="faq-icon">↓</span></div>
                <div class="faq-a">We support MP3, WAV, M4A, OGG, and WebM formats up to 50MB per file.</div>
            </div>
            <div class="faq-item">
                <div class="faq-q"><span>Is my voice data kept private?</span> <span class="faq-icon">↓</span></div>
                <div class="faq-a">Yes, we prioritize security. All recordings are encrypted, and we never use your voice data for training without explicit consent.</div>
            </div>
        </div>
      </section>

      <!-- CTA SECTION -->
      <section class="text-center glass-card" style="margin: 100px 24px; padding: 80px 40px;">
        <h2 class="t-xl grad-text" style="margin-bottom: 24px;">Ready to Elevate Your Voice?</h2>
        <p class="muted t-md" style="margin-bottom: 40px;">Join 50,000+ professionals who are already using VoxIQ to speak better.</p>
        <button class="btn btn-primary btn-lg" id="cta-signup-btn">Get Started for Free</button>
      </section>

      <!-- FOOTER -->
      <footer>
        <div class="footer-grid">
            <div class="footer-col">
                <div class="logo" style="margin-bottom: 20px;">
                    <div class="logo-icon"></div>
                    <span class="logo-text">VoxIQ</span>
                </div>
                <p class="muted t-sm">Predictive AI voice analysis to help you become a better communicator, one recording at a time.</p>
            </div>
            <div class="footer-col">
                <h4>Product</h4>
                <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a onclick="navigate('pricing')">Pricing</a></li>
                    <li><a href="#">Roadmap</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Press</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Support</h4>
                <ul>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Contact Support</a></li>
                    <li><a href="#">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <div>© 2026 VoxIQ AI. All rights reserved.</div>
            <div class="flex gap-4">
                <a href="#" class="muted">Twitter</a>
                <a href="#" class="muted">LinkedIn</a>
                <a href="#" class="muted">GitHub</a>
            </div>
        </div>
      </footer>
    </div>
  `;
}

function bindHome() {
    document.getElementById('login-btn').addEventListener('click', () => navigate('auth'));
    document.getElementById('signup-btn').addEventListener('click', () => navigate('auth'));
    document.getElementById('hero-get-started-btn').addEventListener('click', () => navigate('auth'));
    document.getElementById('cta-signup-btn')?.addEventListener('click', () => navigate('auth'));
    
    // FAQ Accordion
    document.querySelectorAll('.faq-q').forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            item.classList.toggle('active');
        });
    });

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}
