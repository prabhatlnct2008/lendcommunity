import React from 'react';
import './SocialProof.css';

export const LogoRail: React.FC = () => {
  const partners = [
    'Virginia Tech',
    'George Mason',
    'Richmond Chamber',
    'NVCC',
  ];

  return (
    <section className="logo-rail" aria-label="Backed by">
      <p className="logo-rail__label">Backed by</p>
      <div className="logo-rail__logos">
        {partners.map((partner, index) => (
          <div key={index} className="logo-rail__logo">
            {partner}
          </div>
        ))}
      </div>
    </section>
  );
};

export const ImpactMetrics: React.FC = () => {
  const metrics = [
    { value: '340+', label: 'Jobs Created' },
    { value: '18%', label: 'Average Return' },
    { value: '$4.2M', label: 'Capital Deployed' },
    { value: '87', label: 'Active Startups' },
  ];

  return (
    <section className="impact-metrics" id="impact" aria-labelledby="impact-title">
      <h2 id="impact-title" className="impact-metrics__title">
        Community Impact
      </h2>
      <div className="impact-metrics__grid">
        {metrics.map((metric, index) => (
          <div key={index} className="impact-metric">
            <div className="impact-metric__value">{metric.value}</div>
            <div className="impact-metric__label">{metric.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
