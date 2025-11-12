import React, { useEffect, useRef } from 'react';
import type { ExitIntentCopyVM } from '../api/types';
import { Button } from '@/shared/components/Button';
import './ExitIntentModal.css';

interface ExitIntentModalProps {
  exitIntent: ExitIntentCopyVM;
  onCTAClick: () => void;
  onClose: () => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
  exitIntent,
  onCTAClick,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Focus trap
    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    // Focus close button on mount
    closeButtonRef.current?.focus();

    // Handle Tab key for focus trap
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && focusableElements) {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

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
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {exitIntent.image_url && (
          <div className="exit-intent-modal__image">
            <img src={exitIntent.image_url} alt="" />
          </div>
        )}

        <div className="exit-intent-modal__content">
          <h2 id="exit-intent-headline" className="exit-intent-modal__headline">
            {exitIntent.headline}
          </h2>

          {exitIntent.body && (
            <p className="exit-intent-modal__body">{exitIntent.body}</p>
          )}

          <Button
            onClick={() => {
              onCTAClick();
              onClose();
            }}
            variant="primary"
          >
            {exitIntent.cta_label}
          </Button>
        </div>
      </div>
    </div>
  );
};
