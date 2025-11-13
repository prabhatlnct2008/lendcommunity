import React, { useEffect, useState } from 'react';
import { landingAPI } from '../api/client';
import type { LandingPageVM } from '../api/types';
import { Header } from '@/shared/components/Header';
import { Container } from '@/shared/components/Container';
import { Footer } from '@/shared/components/Footer';
import { Hero } from '../components/Hero';
import { ImpactMetrics } from '../components/SocialProof';
import { TeaserGrid } from '../components/TeaserGrid';
import { Testimonials } from '../components/Testimonials';
import { FounderCTA } from '../components/FounderCTA';
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
    // Show exit intent modal when trigger fires
    // We check can_show_now if it exists, otherwise default to true
    if (showExitIntentTrigger && landingData?.exit_intent) {
      const canShow = landingData.exit_intent.can_show_now ?? true;
      console.log('Exit intent triggered, can_show_now:', canShow);
      if (canShow) {
        setShowExitIntentModal(true);
      }
    }
  }, [showExitIntentTrigger, landingData]);

  const handleCTAClick = (placement: string, label: string, action: string) => {
    landingAPI.trackCTAClick(placement, label, action);
  };

  const handleEmailSubmit = async (email: string) => {
    await landingAPI.submitEmail(email, 'hero');
  };

  const handleJoinClick = () => {
    const heroSection = document.getElementById('hero');
    heroSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUnlockClick = () => {
    handleCTAClick('teaser_mask', 'Join to view more', 'open_signup');
    setShowExitIntentModal(true);
  };

  const handleLaunchClick = () => {
    handleCTAClick('founder_cta', 'Launch Your Campaign', 'launch_campaign');
    window.location.href = '/launch';
  };

  const handleExitIntentCTA = () => {
    if (landingData?.exit_intent) {
      landingAPI.trackCTAClick(
        'exit_intent',
        landingData.exit_intent.cta_label,
        landingData.exit_intent.cta_action
      );
    }
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
      <Header onJoinClick={handleJoinClick} />

      <main id="main-content">
        <section id="hero">
          <Hero
            hero={landingData.hero}
            onCTAClick={handleCTAClick}
            onEmailSubmit={handleEmailSubmit}
            showInlineForm={true}
          />
        </section>

        <ImpactMetrics />

        {landingData.teaser && landingData.teaser.items.length > 0 && (
          <TeaserGrid
            teaser={landingData.teaser}
            onUnlockClick={handleUnlockClick}
          />
        )}

        {landingData.testimonials && landingData.testimonials.length > 0 && (
          <Testimonials testimonials={landingData.testimonials} />
        )}

        <FounderCTA onLaunchClick={handleLaunchClick} />
      </main>

      <Footer
        disclaimersHtml={landingData.disclaimers_html}
      />

      {showExitIntentModal && landingData.exit_intent && (
        <ExitIntentModal
          exitIntent={landingData.exit_intent}
          onCTAClick={handleExitIntentCTA}
          onClose={() => setShowExitIntentModal(false)}
          onEmailSubmit={handleEmailSubmit}
        />
      )}
    </div>
  );
};

export default LandingPage;
