import React from 'react';
import './HowItWorks.css';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Join the Community',
      description: 'Sign up free. Connect with local investors and founders in Virginia.',
    },
    {
      number: '2',
      title: 'Browse Opportunities',
      description: 'Explore vetted startups. Review business plans, financials, and team backgrounds.',
    },
    {
      number: '3',
      title: 'Invest Securely',
      description: 'Fund startups you believe in. Track progress and returns through your dashboard.',
    },
    {
      number: '4',
      title: 'Watch Growth',
      description: 'Get updates from founders. See your investment fuel community success.',
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works" aria-labelledby="how-title">
      <h2 id="how-title" className="how-it-works__title">
        How it Works
      </h2>
      <div className="how-it-works__timeline">
        {steps.map((step, index) => (
          <div key={index} className="timeline-step">
            <div className="timeline-step__number">{step.number}</div>
            <div className="timeline-step__content">
              <h3 className="timeline-step__title">{step.title}</h3>
              <p className="timeline-step__description">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
