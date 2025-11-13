import React from 'react';
import './WhyLendCommunity.css';

export const WhyLendCommunity: React.FC = () => {
  const reasons = [
    {
      icon: '🎯',
      title: 'Local Focus',
      description: 'Support Southeast Asian entrepreneurs in Virginia. Your investment stays in the community.',
    },
    {
      icon: '✓',
      title: 'Regulatory Compliance',
      description: 'SEC-compliant platform. All campaigns vetted. Full transparency and legal protection.',
    },
    {
      icon: '⭐',
      title: 'Curated Deals',
      description: 'Hand-picked startups with growth potential. Expert due diligence on every opportunity.',
    },
  ];

  return (
    <section className="why-section" id="why-lendcommunity" aria-labelledby="why-title">
      <h2 id="why-title" className="why-section__title">
        Why LendCommunity?
      </h2>
      <div className="why-section__grid">
        {reasons.map((reason, index) => (
          <div key={index} className="why-card">
            <div className="why-card__icon" aria-hidden="true">{reason.icon}</div>
            <h3 className="why-card__title">{reason.title}</h3>
            <p className="why-card__description">{reason.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
