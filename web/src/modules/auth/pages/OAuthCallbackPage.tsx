/**
 * OAuth Callback Page - Handles Google OAuth redirect
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../api/client';
import { startupsAPI } from '@/modules/startups/api/client';
import './OAuthCallbackPage.css';

const OAuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get code and state from URL params
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        // Verify state matches
        const storedState = sessionStorage.getItem('oauth_state');
        if (state !== storedState) {
          throw new Error('Invalid state parameter');
        }

        // Exchange code for token
        const authToken = await authAPI.handleGoogleCallback(code, state);

        // Update auth context
        setAuthData(authToken);

        // Clear stored state
        sessionStorage.removeItem('oauth_state');

        // Check if user has a startup profile
        try {
          await startupsAPI.getMyStartup(authToken.access_token);
          // Has profile, redirect to dashboard
          navigate('/founder/dashboard');
        } catch (err) {
          // No profile, redirect to onboarding
          navigate('/founder/onboarding');
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');

        // Redirect to home after error
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate, setAuthData]);

  if (error) {
    return (
      <div className="oauth-callback">
        <div className="oauth-callback__error">
          <div className="oauth-callback__icon oauth-callback__icon--error">✕</div>
          <h1>Authentication Failed</h1>
          <p>{error}</p>
          <p className="oauth-callback__redirect">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="oauth-callback">
      <div className="oauth-callback__loading">
        <div className="oauth-callback__spinner"></div>
        <h1>Completing sign in...</h1>
        <p>Please wait while we authenticate your account.</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;
