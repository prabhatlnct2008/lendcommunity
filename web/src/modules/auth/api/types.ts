/**
 * Auth API types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  auth_provider: 'google' | 'email';
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

export interface GoogleAuthResponse {
  authorization_url: string;
  state: string;
}

export interface GoogleCallbackRequest {
  code: string;
  state: string;
}
