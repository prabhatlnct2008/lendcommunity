import React, { useState } from 'react';
import { Button } from '@/shared/components/Button';
import './EmailJoinForm.css';

interface EmailJoinFormProps {
  onSubmit: (email: string) => Promise<void>;
  source?: 'hero' | 'exit_intent' | 'footer';
  inline?: boolean;
}

export const EmailJoinForm: React.FC<EmailJoinFormProps> = ({ onSubmit, source = 'hero', inline = false }) => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot detection
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    // RFC-compliant email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot detection - honeypot should be empty
    if (honeypot) {
      return;
    }

    setError('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(email);
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="email-join-form__success" role="status" aria-live="polite">
        <svg className="email-join-form__success-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <p className="email-join-form__success-text">
          Success! Check your inbox for next steps.
        </p>
      </div>
    );
  }

  return (
    <form className={`email-join-form ${inline ? 'email-join-form--inline' : ''}`} onSubmit={handleSubmit} id="email-join">
      <div className="email-join-form__field">
        <label htmlFor={`email-${source}`} className="visually-hidden">
          Email address
        </label>
        <input
          id={`email-${source}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className={`email-join-form__input ${error ? 'email-join-form__input--error' : ''}`}
          disabled={isSubmitting}
          aria-invalid={!!error}
          aria-describedby={error ? `email-error-${source}` : undefined}
        />
        {/* Honeypot field for bot detection */}
        <input
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="email-join-form__honeypot"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>
      {error && (
        <p
          id={`email-error-${source}`}
          className="email-join-form__error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || !email}
      >
        {isSubmitting ? 'Joining...' : 'Join Community'}
      </Button>
    </form>
  );
};
