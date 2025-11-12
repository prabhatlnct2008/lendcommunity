import React from 'react';
import type { HeroVM } from '../api/types';
import { Button } from '@/shared/components/Button';
import './Hero.css';

interface HeroProps {
  hero: HeroVM;
  onCTAClick: (placement: string, label: string, action: string) => void;
  onEmailSubmit?: (email: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ hero, onCTAClick, onEmailSubmit }) => {
  const handlePrimaryCTA = () => {
    onCTAClick('hero.primary', hero.primary_cta.label, hero.primary_cta.action);
    if (hero.primary_cta.action === 'open_signup' && onEmailSubmit) {
      // Scroll to email form or trigger modal
      const emailSection = document.getElementById('email-join');
      emailSection?.scrollIntoView({ behavior: 'smooth' });
    } else if (hero.primary_cta.url) {
      window.location.href = hero.primary_cta.url;
    }
  };

  const handleSecondaryCTA = () => {
    if (!hero.secondary_cta) return;
    onCTAClick('hero.secondary', hero.secondary_cta.label, hero.secondary_cta.action);
    if (hero.secondary_cta.url) {
      window.location.href = hero.secondary_cta.url;
    }
  };

  return (
    <section
      className="hero"
      style={hero.bg_image_url ? { backgroundImage: `url(${hero.bg_image_url})` } : undefined}
      aria-labelledby="hero-headline"
    >
      <div className="hero__overlay">
        <div className="hero__content">
          <h1 id="hero-headline" className="hero__headline">
            {hero.headline}
          </h1>
          {hero.subheadline && (
            <p className="hero__subheadline">{hero.subheadline}</p>
          )}
          <div className="hero__ctas">
            <Button
              onClick={handlePrimaryCTA}
              variant="primary"
              ariaLabel={hero.primary_cta.label}
            >
              {hero.primary_cta.label}
            </Button>
            {hero.secondary_cta && (
              <Button
                onClick={handleSecondaryCTA}
                variant="secondary"
                ariaLabel={hero.secondary_cta.label}
              >
                {hero.secondary_cta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
