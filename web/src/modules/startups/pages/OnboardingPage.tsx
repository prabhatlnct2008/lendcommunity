/**
 * Onboarding Page - Basic Info collection
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { startupsAPI } from '../api/client';
import { BasicInfoForm } from '../components/BasicInfoForm';
import type { StartupCreateRequest } from '../api/types';
import './OnboardingPage.css';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: StartupCreateRequest) => {
    if (!token) {
      setError('You must be logged in to continue');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await startupsAPI.createStartup(data, token);

      // Redirect to investment round creation
      navigate('/founder/create-round');
    } catch (err) {
      console.error('Failed to create startup:', err);
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-page__container">
        <div className="onboarding-page__header">
          <div className="onboarding-page__progress">
            <div className="onboarding-page__progress-bar" style={{ width: '33%' }}></div>
          </div>
          <h1 className="onboarding-page__title">Tell Us About Your Startup</h1>
          <p className="onboarding-page__subtitle">
            Let's start with the basics. This information will be displayed on your campaign page.
          </p>
        </div>

        {error && (
          <div className="onboarding-page__error">
            <div className="onboarding-page__error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        <div className="onboarding-page__form">
          <BasicInfoForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        <div className="onboarding-page__footer">
          <p className="onboarding-page__step">Step 1 of 3</p>
          <p className="onboarding-page__help">
            Need help? <a href="mailto:support@lendcommunity.com">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
