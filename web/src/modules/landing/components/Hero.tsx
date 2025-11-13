import React from 'react';
import type { HeroVM } from '../api/types';
import { Button } from '@/shared/components/Button';
import { EmailJoinForm } from './EmailJoinForm';
import './Hero.css';

interface HeroProps {
  hero: HeroVM;
  onCTAClick: (placement: string, label: string, action: string) => void;
  onEmailSubmit: (email: string) => Promise<void>;
  showInlineForm?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  hero,
  onCTAClick,
  onEmailSubmit,
  showInlineForm = true
}) => {
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
          <div className="hero__text">
            <h1 id="hero-headline" className="hero__headline">
              {hero.headline}
            </h1>
            {hero.subheadline && (
              <p className="hero__subheadline">{hero.subheadline}</p>
            )}

            {/* Trust badges */}
            <div className="hero__trust-badges">
              <div className="trust-badge">
                <span className="trust-badge__value">2,100+</span>
                <span className="trust-badge__label">Community Members</span>
              </div>
              <div className="trust-badge">
                <span className="trust-badge__value">$4.2M</span>
                <span className="trust-badge__label">Funded</span>
              </div>
              <div className="trust-badge">
                <span className="trust-badge__value">87</span>
                <span className="trust-badge__label">Startups Backed</span>
              </div>
            </div>

            {!showInlineForm && (
              <div className="hero__ctas">
                <Button
                  onClick={() => {
                    onCTAClick('hero.primary', hero.primary_cta.label, hero.primary_cta.action);
                    document.getElementById('email-join')?.scrollIntoView({ behavior: 'smooth' });
                  }}
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
            )}
          </div>

          {showInlineForm && (
            <div className="hero__form-card">
              <h2 className="hero__form-title">Get Early Access</h2>
              <p className="hero__form-subtitle">
                Join 2,100+ investors supporting local entrepreneurs
              </p>
              <EmailJoinForm
                onSubmit={onEmailSubmit}
                source="hero"
              />
              <p className="hero__form-disclaimer">
                Free to join. Accredited investors only.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
