import React, { useEffect, useState } from 'react';
import { landingAPI } from '../api/client';
import type { LandingPageVM } from '../api/types';
import { Container } from '@/shared/components/Container';
import { Hero } from '../components/Hero';
import { EmailJoinForm } from '../components/EmailJoinForm';
import { TeaserGrid } from '../components/TeaserGrid';
import { Testimonials } from '../components/Testimonials';
import { ExitIntentModal } from '../components/ExitIntentModal';
import { useExitIntent } from '@/shared/hooks/useExitIntent';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const [landingData, setLandingData] = useState<LandingPageVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const showExitIntentTrigger = useExitIntent();
  const [showExitIntentModal, setShowExitIntentModal] = useState(false);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const data = await landingAPI.getLandingPage();
        setLandingData(data);
      } catch (err) {
        console.error('Error fetching landing page:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, []);

  useEffect(() => {
    // Show exit intent modal when trigger fires AND gating allows
    if (showExitIntentTrigger && landingData?.exit_intent?.can_show_now) {
      setShowExitIntentModal(true);
    }
  }, [showExitIntentTrigger, landingData]);

  const handleCTAClick = (placement: string, label: string, action: string) => {
    landingAPI.trackCTAClick(placement, label, action);
  };

  const handleEmailSubmit = async (email: string) => {
    await landingAPI.submitEmail(email, 'hero');
  };

  const handleExitIntentCTA = () => {
    if (landingData?.exit_intent) {
      landingAPI.trackCTAClick(
        'exit_intent',
        landingData.exit_intent.cta_label,
        landingData.exit_intent.cta_action
      );
    }
    // Scroll to email form
    const emailSection = document.getElementById('email-join');
    emailSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="landing-page">
        <div className="landing-page__loading">
          <div className="skeleton skeleton--hero"></div>
          <Container>
            <div className="skeleton skeleton--grid">
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
              <div className="skeleton-card"></div>
            </div>
          </Container>
        </div>
      </div>
    );
  }

  if (error || !landingData) {
    return (
      <div className="landing-page">
        <Container>
          <div className="landing-page__error">
            <h1>We'll be back shortly</h1>
            <p>Please check back soon.</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <main id="main-content">
        <Hero
          hero={landingData.hero}
          onCTAClick={handleCTAClick}
          onEmailSubmit={handleEmailSubmit}
        />

        <Container>
          <section className="landing-page__join-section">
            <EmailJoinForm onSubmit={handleEmailSubmit} source="hero" />
          </section>
        </Container>

        {landingData.teaser && landingData.teaser.items.length > 0 && (
          <Container>
            <TeaserGrid teaser={landingData.teaser} />
          </Container>
        )}

        {landingData.testimonials && landingData.testimonials.length > 0 && (
          <Testimonials testimonials={landingData.testimonials} />
        )}

        {landingData.disclaimers_html && (
          <Container>
            <footer className="landing-page__footer">
              <div
                className="landing-page__disclaimers"
                dangerouslySetInnerHTML={{ __html: landingData.disclaimers_html }}
              />
            </footer>
          </Container>
        )}
      </main>

      {showExitIntentModal && landingData.exit_intent && (
        <ExitIntentModal
          exitIntent={landingData.exit_intent}
          onCTAClick={handleExitIntentCTA}
          onClose={() => setShowExitIntentModal(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;
