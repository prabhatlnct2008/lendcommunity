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

  return (
    <section className="testimonials" aria-labelledby="testimonials-title">
      <h2 id="testimonials-title" className="testimonials__title">
        What Our Community Says
      </h2>
      <div className="testimonials__grid">
        {testimonials.map((testimonial, index) => (
          <blockquote key={index} className="testimonial">
            {testimonial.avatar_url && (
              <img
                src={testimonial.avatar_url}
                alt={`${testimonial.author_name}'s avatar`}
                className="testimonial__avatar"
              />
            )}
            <p className="testimonial__quote">"{testimonial.quote}"</p>
            <footer className="testimonial__author">
              <cite className="testimonial__name">{testimonial.author_name}</cite>
              {testimonial.author_title && (
                <span className="testimonial__title">{testimonial.author_title}</span>
              )}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};
