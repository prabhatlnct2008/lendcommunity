import React from 'react';
import './SocialProof.css';

export const ImpactMetrics: React.FC = () => {
  const metrics = [
    {
      value: '$250K+',
      label: 'Total Funded',
      icon: '💵',
      color: 'teal'
    },
    {
      value: '52',
      label: 'Active Campaigns',
      icon: '🚀',
      color: 'orange'
    },
    {
      value: '200+',
      label: 'Community Members',
      icon: '👥',
      color: 'blue'
    },
    {
      value: '85%',
      label: 'Success Rate',
      icon: '📈',
      color: 'purple'
    },
  ];

  return (
    <section className="impact-metrics" id="impact" aria-labelledby="impact-title">
      <div className="impact-metrics__grid">
        {metrics.map((metric, index) => (
          <div key={index} className="impact-metric">
            <div className={`impact-metric__icon impact-metric__icon--${metric.color}`}>
              {metric.icon}
            </div>
            <div className="impact-metric__value">{metric.value}</div>
            <div className="impact-metric__label">{metric.label}</div>
          </div>
        ))}
      </div>

      <div className="impact-metrics__cta">
        <span className="section-badge">🎯 Top Performing Campaigns</span>
        <h2 id="impact-title" className="impact-metrics__title">
          Help Local Founders Succeed
        </h2>
      </div>
    </section>
  );
};
