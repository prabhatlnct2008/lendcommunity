import React from 'react';
import type { TeaserSectionVM } from '../api/types';
import './TeaserGrid.css';

interface TeaserGridProps {
  teaser: TeaserSectionVM;
  onUnlockClick?: () => void;
}

export const TeaserGrid: React.FC<TeaserGridProps> = ({ teaser, onUnlockClick }) => {
  if (!teaser.items || teaser.items.length === 0) {
    return null;
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <section className="teaser-grid" aria-labelledby="teaser-title">
      {teaser.title && (
        <h2 id="teaser-title" className="teaser-grid__title">
          {teaser.title}
        </h2>
      )}
      <div className="teaser-grid__items">
        {teaser.items.map((item, index) => {
          const isMasked = index >= teaser.mask_after;

          return (
            <div
              key={item.id}
              className={`teaser-card ${isMasked ? 'teaser-card--masked' : ''}`}
              aria-label={isMasked ? 'Locked startup - join to view' : item.name}
            >
              {isMasked && (
                <button
                  className="teaser-card__mask"
                  onClick={onUnlockClick}
                  aria-label="Unlock more startups"
                >
                  <svg
                    className="teaser-card__lock-icon"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p className="teaser-card__mask-text">
                    Unlock More Startups
                  </p>
                  <p className="teaser-card__mask-cta">
                    Join Free →
                  </p>
                </button>
              )}

              {item.cover_url && (
                <div
                  className="teaser-card__cover"
                  style={{ backgroundImage: `url(${item.cover_url})` }}
                  role="img"
                  aria-label={`${item.name} cover image`}
                />
              )}

              <div className="teaser-card__content">
                {item.logo_url && (
                  <img
                    src={item.logo_url}
                    alt={`${item.name} logo`}
                    className="teaser-card__logo"
                  />
                )}

                <h3 className="teaser-card__name">{item.name}</h3>

                {item.tagline && (
                  <p className="teaser-card__tagline">{item.tagline}</p>
                )}

                <div className="teaser-card__progress">
                  <div className="teaser-card__progress-bar">
                    <div
                      className="teaser-card__progress-fill"
                      style={{ width: `${Math.min(item.percent_funded, 100)}%` }}
                      role="progressbar"
                      aria-valuenow={item.percent_funded}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${item.percent_funded}% funded`}
                    />
                  </div>
                  <div className="teaser-card__stats">
                    <span className="teaser-card__funded">
                      {item.percent_funded.toFixed(0)}% funded
                    </span>
                    <span className="teaser-card__amounts">
                      {formatCurrency(item.raised_cents)} / {formatCurrency(item.goal_cents)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
