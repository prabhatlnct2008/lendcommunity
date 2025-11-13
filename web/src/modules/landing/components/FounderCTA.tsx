import React from 'react';
import { Button } from '@/shared/components/Button';
import './FounderCTA.css';

interface FounderCTAProps {
  onLaunchClick?: () => void;
}

export const FounderCTA: React.FC<FounderCTAProps> = ({ onLaunchClick }) => {
  const stats = [
    { value: '48hrs', label: 'Average approval time' },
    { value: '85%', label: 'Success rate' },
    { value: '$12K', label: 'Average raised' },
  ];

  return (
    <section className="founder-cta" aria-labelledby="founder-cta-title">
      <div className="founder-cta__overlay">
        <div className="founder-cta__content">
          <span className="section-badge section-badge--light">🚀 For Founders</span>

          <h2 id="founder-cta-title" className="founder-cta__title">
            Ready to Launch Your Startup?
          </h2>

          <p className="founder-cta__subtitle">
            Get the funding you need from people who believe in you. Join 50+ Southeast Asian founders who've raised capital through our platform.
          </p>

          <button
            className="founder-cta__button"
            onClick={onLaunchClick}
          >
            🚀 Launch Your Campaign
          </button>

          <div className="founder-cta__stats">
            {stats.map((stat, index) => (
              <div key={index} className="founder-cta__stat">
                <div className="founder-cta__stat-value">{stat.value}</div>
                <div className="founder-cta__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
