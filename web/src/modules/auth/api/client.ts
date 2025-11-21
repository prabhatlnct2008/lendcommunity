/**
 * Auth API client
 */
import type { AuthToken, GoogleAuthResponse, GoogleCallbackRequest, User } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class AuthAPIClient {
  /**
   * Get Google OAuth login URL
   */
  async getGoogleLoginUrl(): Promise<GoogleAuthResponse> {
    const response = await fetch(`${API_BASE}/auth/google/login`);
    if (!response.ok) {
      throw new Error('Failed to get Google login URL');
    }
    return response.json();
  }

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code: string, state: string): Promise<AuthToken> {
    const response = await fetch(`${API_BASE}/auth/google/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state } as GoogleCallbackRequest),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate with Google');
    }

    return response.json();
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  }

  /**
   * Logout (clear local state)
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

export const authAPI = new AuthAPIClient();
