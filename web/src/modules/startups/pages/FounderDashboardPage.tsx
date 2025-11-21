/**
 * Founder Dashboard - Main dashboard for founders
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { startupsAPI } from '../api/client';
import type { Startup, Investment } from '../api/types';
import { Header } from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { Container } from '@/shared/components/Container';
import './FounderDashboardPage.css';

const FounderDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
  const [startup, setStartup] = useState<Startup | null>(null);
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!token) return;

      try {
        const startupData = await startupsAPI.getMyStartup(token);
        setStartup(startupData);

        try {
          const investmentData = await startupsAPI.getMyInvestment(token);
          setInvestment(investmentData);
        } catch (err) {
          // No investment yet
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token]);

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  if (!startup) {
    navigate('/founder/onboarding');
    return null;
  }

  return (
    <div className="founder-dashboard">
      <Header onJoinClick={() => navigate('/')} />

      <main id="main-content" className="dashboard-main">
        <Container>
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
              <p className="dashboard-subtitle">{startup.name}</p>
            </div>
            <button onClick={logout} className="btn-logout">
              Logout
            </button>
          </div>

          {/* No Investment State */}
          {!investment && (
            <div className="dashboard-empty">
              <div className="dashboard-empty__icon">🚀</div>
              <h2>Ready to Launch Your Campaign?</h2>
              <p>Create your first investment round to start raising funds</p>
              <button
                onClick={() => navigate('/founder/create-round')}
                className="btn-primary"
              >
                Create Investment Round
              </button>
            </div>
          )}

          {/* Active Investment */}
          {investment && (
            <>
              {/* Stats Cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card__label">Investment Goal</div>
                  <div className="stat-card__value">
                    ${investment.total_investment_sought.toLocaleString()}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__label">Equity Offered</div>
                  <div className="stat-card__value">{investment.equity_offered}%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__label">Valuation</div>
                  <div className="stat-card__value">
                    ${investment.current_valuation.toLocaleString()}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-card__label">Status</div>
                  <div className={`stat-card__status stat-card__status--${investment.status}`}>
                    {investment.status.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Campaign Info */}
              <div className="dashboard-section">
                <h2 className="section-title">Campaign Details</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Start Date:</span>
                    <span className="info-value">
                      {new Date(investment.start_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">End Date:</span>
                    <span className="info-value">
                      {new Date(investment.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  {investment.start_year && (
                    <div className="info-item">
                      <span className="info-label">Founded:</span>
                      <span className="info-value">{investment.start_year}</span>
                    </div>
                  )}
                  {investment.is_pre_revenue ? (
                    <div className="info-item">
                      <span className="info-label">Revenue:</span>
                      <span className="info-value">Pre-revenue</span>
                    </div>
                  ) : (
                    <>
                      {investment.last_month_revenue && (
                        <div className="info-item">
                          <span className="info-label">Last Month Revenue:</span>
                          <span className="info-value">
                            ${investment.last_month_revenue.toLocaleString()}
                          </span>
                        </div>
                      )}
                      {investment.arr && (
                        <div className="info-item">
                          <span className="info-label">ARR:</span>
                          <span className="info-value">
                            ${investment.arr.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Status Message */}
              {investment.status === 'draft' && (
                <div className="dashboard-alert dashboard-alert--info">
                  <strong>Draft:</strong> Your campaign is not yet live. Complete all required fields to submit for review.
                </div>
              )}
              {investment.status === 'pending_review' && (
                <div className="dashboard-alert dashboard-alert--warning">
                  <strong>Pending Review:</strong> Our team is reviewing your campaign. You'll be notified once it's approved.
                </div>
              )}
              {investment.status === 'live' && (
                <div className="dashboard-alert dashboard-alert--success">
                  <strong>Live:</strong> Your campaign is now live and visible to investors!
                </div>
              )}
            </>
          )}
        </Container>
      </main>

      <Footer disclaimersHtml="" />
    </div>
  );
};

export default FounderDashboardPage;
