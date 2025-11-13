import React, { useEffect, useRef, useState } from 'react';
import type { ExitIntentCopyVM } from '../api/types';
import './ExitIntentModal.css';

interface ExitIntentModalProps {
  exitIntent: ExitIntentCopyVM;
  onCTAClick: () => void;
  onClose: () => void;
  onEmailSubmit: (email: string) => Promise<void>;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
  exitIntent,
  onCTAClick,
  onClose,
  onEmailSubmit,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onEmailSubmit(email);
      onCTAClick();
      onClose();
    } catch (error) {
      console.error('Failed to submit email:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="exit-intent-modal__backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-headline"
    >
      <div className="exit-intent-modal" ref={modalRef}>
        <button
          ref={closeButtonRef}
          className="exit-intent-modal__close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕ ✨
        </button>

        <div className="exit-intent-modal__icon">
          <div className="exit-intent-modal__icon-inner">!</div>
        </div>

        <h2 id="exit-intent-headline" className="exit-intent-modal__headline">
          Wait! Don't Miss Out 🚀
        </h2>

        <p className="exit-intent-modal__body">
          Join our community to discover amazing startups and get exclusive updates on new campaigns!
        </p>

        <form onSubmit={handleSubmit} className="exit-intent-modal__form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="exit-intent-modal__input"
            required
          />

          <button
            type="submit"
            className="exit-intent-modal__cta"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Yes, Keep Me Updated!'}
          </button>
        </form>

        <button className="exit-intent-modal__skip" onClick={onClose}>
          No thanks, I'll browse without updates
        </button>

        <div className="exit-intent-modal__stats">
          <div className="exit-intent-modal__stat">
            <div className="exit-intent-modal__stat-value">50+</div>
            <div className="exit-intent-modal__stat-label">Active Campaigns</div>
          </div>
          <div className="exit-intent-modal__stat">
            <div className="exit-intent-modal__stat-value">$250K+</div>
            <div className="exit-intent-modal__stat-label">Funded</div>
          </div>
          <div className="exit-intent-modal__stat">
            <div className="exit-intent-modal__stat-value">85%</div>
            <div className="exit-intent-modal__stat-label">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};
