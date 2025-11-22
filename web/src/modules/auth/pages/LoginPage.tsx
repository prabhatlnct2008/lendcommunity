/**
 * Login Page - Email/Password Authentication
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/client';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const authToken = await authAPI.loginWithEmail(email, password);

      // Store token and user
      localStorage.setItem('auth_token', authToken.access_token);
      localStorage.setItem('auth_user', JSON.stringify(authToken.user));

      // Redirect based on role
      if (authToken.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/founder/dashboard');
      }

      // Reload to refresh auth context
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>LendCommunity</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div className="login-error">
            <span className="login-error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-demo-accounts">
          <p className="demo-title">Demo Accounts:</p>
          <div className="demo-account">
            <strong>Founder:</strong> founder@demo.com / password
          </div>
          <div className="demo-account">
            <strong>Admin:</strong> admin@lendcommunity.com / password
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
