import React, { useCallback, useEffect, useState } from 'react';
import { landingAPI } from '../api/client';
import type { EmailSource, ExitIntentCopyVM, LandingPageVM } from '../api/types';
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
  const [exitIntentData, setExitIntentData] = useState<ExitIntentCopyVM | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exitIntentCaptured, setExitIntentCaptured] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return sessionStorage.getItem('exit_intent_captured') === 'true';
  });

  const exitIntentTriggerCount = useExitIntent();
  const [showExitIntentModal, setShowExitIntentModal] = useState(false);

  useEffect(() => {
    const fetchLandingPage = async () => {
      try {
        const data = await landingAPI.getLandingPage();
        setLandingData(data);
        setExitIntentData(data.exit_intent ?? null);
      } catch (err) {
        console.error('Error fetching landing page:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchLandingPage();
  }, []);

  const ensureExitIntentData = useCallback(async () => {
    if (exitIntentData?.can_show_now) {
      return exitIntentData;
    }

    try {
      const latest = await landingAPI.getExitIntent();
      if (latest) {
        setExitIntentData(latest);
      }
      return latest;
    } catch (err) {
      console.error('Error fetching exit intent:', err);
      return null;
    }
  }, [exitIntentData]);

  const openExitIntentModal = useCallback(() => {
    if (exitIntentCaptured) {
      return;
    }
    setShowExitIntentModal(true);
  }, [exitIntentCaptured]);

  useEffect(() => {
    if (!exitIntentTriggerCount || exitIntentCaptured) return;

    const fetchAndShow = async () => {
      const data = await ensureExitIntentData();
      const canShow = data?.can_show_now ?? false;
      console.log('Exit intent triggered, can_show_now:', canShow);
      if (canShow) {
        openExitIntentModal();
      }
    };

    fetchAndShow();
  }, [exitIntentTriggerCount, ensureExitIntentData, openExitIntentModal, exitIntentCaptured]);

  const handleCTAClick = (placement: string, label: string, action: string) => {
    landingAPI.trackCTAClick(placement, label, action);
  };

  const handleEmailSubmit = async (email: string, source: EmailSource = 'hero') => {
    await landingAPI.submitEmail(email, source);
    if (source === 'exit_intent') {
      setExitIntentCaptured(true);
      sessionStorage.setItem('exit_intent_captured', 'true');
    }
  };

  const handleJoinClick = () => {
    const heroSection = document.getElementById('hero');
    heroSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUnlockClick = () => {
    handleCTAClick('teaser_mask', 'Join to view more', 'open_signup');
    if (exitIntentCaptured) {
      return;
    }
    ensureExitIntentData().then((data) => {
      if (data?.can_show_now) {
        openExitIntentModal();
      }
    });
  };

  const handleLaunchClick = () => {
    handleCTAClick('founder_cta', 'Launch Your Campaign', 'launch_campaign');
    window.location.href = '/launch';
  };

  const handleExitIntentCTA = () => {
    if (exitIntentData) {
      landingAPI.trackCTAClick(
        'exit_intent',
        exitIntentData.cta_label,
        exitIntentData.cta_action
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

      {showExitIntentModal && exitIntentData && (
        <ExitIntentModal
          exitIntent={exitIntentData}
          onCTAClick={handleExitIntentCTA}
          onClose={() => setShowExitIntentModal(false)}
          onEmailSubmit={handleEmailSubmit}
        />
      )}
    </div>
  );
};

export default LandingPage;
