/**
 * Founder Landing Page - Value proposition for startup founders
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Header } from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { Container } from '@/shared/components/Container';
import { GoogleLoginButton } from '@/modules/auth/components/GoogleLoginButton';
import './FounderLandingPage.css';

const FounderLandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLaunchClick = () => {
    if (user) {
      // Already authenticated, go to dashboard
      navigate('/founder/dashboard');
    } else {
      // Scroll to login section
      const loginSection = document.getElementById('get-started');
      loginSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="founder-landing">
      <Header onJoinClick={() => navigate('/')} />

      <main id="main-content">
        {/* Hero Section */}
        <section className="founder-hero">
          <Container>
            <div className="founder-hero__content">
              <h1 className="founder-hero__headline">
                Launch Your Fundraising
                <span className="founder-hero__headline--gradient"> Campaign in Minutes</span>
              </h1>
              <p className="founder-hero__subtitle">
                Connect with a community of passionate investors ready to back innovative startups.
                No complicated paperwork, no lengthy approval processes.
              </p>
              <button onClick={handleLaunchClick} className="founder-hero__cta">
                {user ? 'Go to Dashboard' : 'Launch Your Campaign'}
              </button>
            </div>
            <div className="founder-hero__stats">
              <div className="founder-hero__stat">
                <div className="founder-hero__stat-value">$2.5M+</div>
                <div className="founder-hero__stat-label">Total Raised</div>
              </div>
              <div className="founder-hero__stat">
                <div className="founder-hero__stat-value">150+</div>
                <div className="founder-hero__stat-label">Funded Startups</div>
              </div>
              <div className="founder-hero__stat">
                <div className="founder-hero__stat-value">92%</div>
                <div className="founder-hero__stat-label">Success Rate</div>
              </div>
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="founder-how-it-works">
          <Container>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Simple, fast, and effective fundraising in 3 steps</p>

            <div className="steps-grid">
              <div className="step-card">
                <div className="step-card__number">1</div>
                <h3 className="step-card__title">Create Your Profile</h3>
                <p className="step-card__description">
                  Sign up with Google and provide basic information about your startup.
                  Takes less than 5 minutes.
                </p>
              </div>

              <div className="step-card">
                <div className="step-card__number">2</div>
                <h3 className="step-card__title">Set Up Your Round</h3>
                <p className="step-card__description">
                  Define your investment goals, equity offer, and share your pitch deck.
                  Our wizard makes it easy.
                </p>
              </div>

              <div className="step-card">
                <div className="step-card__number">3</div>
                <h3 className="step-card__title">Go Live & Raise</h3>
                <p className="step-card__description">
                  Launch your campaign and start connecting with investors. Track interest
                  and engagement in real-time.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Benefits */}
        <section className="founder-benefits">
          <Container>
            <h2 className="section-title">Why Choose LendCommunity?</h2>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-card__icon benefit-card__icon--speed">⚡</div>
                <h3 className="benefit-card__title">Launch in Minutes</h3>
                <p className="benefit-card__description">
                  No lengthy approval process. Get your campaign live the same day.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-card__icon benefit-card__icon--network">🌐</div>
                <h3 className="benefit-card__title">Access Investor Network</h3>
                <p className="benefit-card__description">
                  Connect with thousands of investors actively looking for opportunities.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-card__icon benefit-card__icon--analytics">📊</div>
                <h3 className="benefit-card__title">Real-Time Analytics</h3>
                <p className="benefit-card__description">
                  Track views, interest, and engagement with comprehensive analytics.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-card__icon benefit-card__icon--support">🤝</div>
                <h3 className="benefit-card__title">Community Support</h3>
                <p className="benefit-card__description">
                  Get guidance from experienced founders and our support team.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Success Stories */}
        <section className="founder-success">
          <Container>
            <h2 className="section-title">Success Stories</h2>
            <p className="section-subtitle">Real founders, real results</p>

            <div className="success-grid">
              <div className="success-card">
                <div className="success-card__quote">"</div>
                <p className="success-card__text">
                  We raised $250K in just 2 weeks through LendCommunity. The platform made it
                  incredibly easy to connect with the right investors.
                </p>
                <div className="success-card__author">
                  <div className="success-card__avatar">JD</div>
                  <div>
                    <div className="success-card__name">Jane Doe</div>
                    <div className="success-card__company">TechStartup Inc.</div>
                  </div>
                </div>
                <div className="success-card__amount">$250K Raised</div>
              </div>

              <div className="success-card">
                <div className="success-card__quote">"</div>
                <p className="success-card__text">
                  The analytics dashboard helped us understand our investors better and
                  refine our pitch. Highly recommend!
                </p>
                <div className="success-card__author">
                  <div className="success-card__avatar">MS</div>
                  <div>
                    <div className="success-card__name">Mike Smith</div>
                    <div className="success-card__company">GrowthCo</div>
                  </div>
                </div>
                <div className="success-card__amount">$180K Raised</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Get Started */}
        <section id="get-started" className="founder-get-started">
          <Container>
            <div className="founder-get-started__content">
              <h2 className="founder-get-started__title">Ready to Launch?</h2>
              <p className="founder-get-started__subtitle">
                Join hundreds of successful founders who raised funding through LendCommunity
              </p>

              {user ? (
                <button
                  onClick={() => navigate('/founder/dashboard')}
                  className="founder-get-started__cta"
                >
                  Go to Dashboard
                </button>
              ) : (
                <div className="founder-get-started__auth">
                  <GoogleLoginButton
                    text="Get Started with Google"
                    className="google-login-button--full"
                  />
                  <p className="founder-get-started__terms">
                    By signing up, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              )}
            </div>
          </Container>
        </section>
      </main>

      <Footer disclaimersHtml="" />
    </div>
  );
};

export default FounderLandingPage;
