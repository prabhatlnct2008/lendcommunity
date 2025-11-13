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
      aria-labelledby="hero-headline"
    >
      <div className="hero__overlay">
        <div className="hero__content">
          <div className="hero__text">
            <span className="hero__badge">
              🤝 Crowdfunding for Our Community
            </span>

            <h1 id="hero-headline" className="hero__headline">
              Fund Dreams.
              <br />
              <span className="hero__headline--accent">Build Community.</span>
            </h1>

            {hero.subheadline && (
              <p className="hero__subheadline">{hero.subheadline}</p>
            )}

            {/* Inline email form and buttons */}
            <div className="hero__actions">
              <div className="hero__email-inline">
                <EmailJoinForm
                  onSubmit={onEmailSubmit}
                  source="hero"
                  inline={true}
                />
              </div>
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

            {/* Trust badges with circular avatars */}
            <div className="hero__trust">
              <div className="hero__avatars">
                <div className="avatar"></div>
                <div className="avatar"></div>
                <div className="avatar"></div>
                <div className="avatar"></div>
                <div className="avatar"></div>
              </div>
              <div className="hero__trust-text">
                <div className="hero__trust-count">200+ Community Members</div>
                <div className="hero__trust-label">Supporting local founders</div>
              </div>
            </div>
          </div>

          {/* Hero visual with stat card */}
          <div className="hero__visual">
            <div className="hero__image">
              <img
                src={hero.bg_image_url || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"}
                alt="Community members collaborating"
              />
            </div>
            <div className="hero__stat-card">
              <div className="hero__stat-icon">💰</div>
              <div className="hero__stat-value">$250K+</div>
              <div className="hero__stat-label">Funded This Year</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
