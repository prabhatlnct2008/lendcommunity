import React from 'react';
import type { TestimonialVM } from '../api/types';
import './Testimonials.css';

interface TestimonialsProps {
  testimonials: TestimonialVM[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Mock data for demonstration - in real app this would come from API
  const enhancedTestimonials = testimonials.map((t, index) => ({
    ...t,
    stats: index === 0
      ? { type: 'founder', raised: '$22,000', backers: 67 }
      : index === 1
      ? { type: 'backer', funded: 8, rating: 5 }
      : { type: 'founder', raised: '$15,000', backers: 45 }
  }));

  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <span className="section-badge">💬 Community Stories</span>

      <h2 id="testimonials-title" className="testimonials__title">
        Real People. Real Success.
      </h2>

      <p className="testimonials__subtitle">
        Hear from founders and backers who are building something special together.
      </p>

      <div className="testimonials__grid">
        {enhancedTestimonials.map((testimonial, index) => (
          <blockquote key={index} className="testimonial">
            <div className="testimonial__quote-icon">❝</div>

            <p className="testimonial__quote">"{testimonial.quote}"</p>

            <footer className="testimonial__author">
              {testimonial.avatar_url && (
                <img
                  src={testimonial.avatar_url}
                  alt={`${testimonial.author_name}'s avatar`}
                  className="testimonial__avatar"
                />
              )}
              <div className="testimonial__author-info">
                <cite className="testimonial__name">{testimonial.author_name}</cite>
                {testimonial.author_title && (
                  <span className="testimonial__title">{testimonial.author_title}</span>
                )}
              </div>
            </footer>

            {testimonial.stats && (
              <div className="testimonial__stats">
                {testimonial.stats.type === 'backer' ? (
                  <>
                    <div className="testimonial__stat">
                      <div className="testimonial__stat-label">Funded {testimonial.stats.funded} startups</div>
                      <div className="testimonial__rating">
                        {'⭐'.repeat(testimonial.stats.rating)}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="testimonial__stat-row">
                    <div className="testimonial__stat">
                      <div className="testimonial__stat-label">Raised</div>
                      <div className="testimonial__stat-value">{testimonial.stats.raised}</div>
                    </div>
                    <div className="testimonial__stat">
                      <div className="testimonial__stat-label">Backers</div>
                      <div className="testimonial__stat-value">{testimonial.stats.backers}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </blockquote>
        ))}
      </div>
    </section>
  );
};
