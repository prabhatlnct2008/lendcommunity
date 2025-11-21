/**
 * Create Round Page - 2-step wizard for investment round creation
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { startupsAPI } from '../api/client';
import type { InvestmentRoundCreateRequest, InvestmentMetricsRequest } from '../api/types';
import './CreateRoundPage.css';

const CreateRoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [investmentId, setInvestmentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Round Setup
  const [roundData, setRoundData] = useState<InvestmentRoundCreateRequest>({
    total_investment_sought: 0,
    equity_offered: 0,
    duration_days: 90,
  });

  // Step 2: Metrics & Pitch
  const [metricsData, setMetricsData] = useState<InvestmentMetricsRequest>({
    start_year: new Date().getFullYear(),
    is_pre_revenue: false,
    last_month_revenue: undefined,
    arr: undefined,
    churn_rate: undefined,
    competitors: '',
    pitch_deck_url: '',
  });

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const investment = await startupsAPI.createInvestmentRound(roundData, token);
      setInvestmentId(investment.id);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create round');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !investmentId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Remove empty fields
      const cleanData = { ...metricsData };
      if (!cleanData.last_month_revenue) delete cleanData.last_month_revenue;
      if (!cleanData.arr) delete cleanData.arr;
      if (!cleanData.churn_rate) delete cleanData.churn_rate;
      if (!cleanData.competitors?.trim()) delete cleanData.competitors;
      if (!cleanData.pitch_deck_url?.trim()) delete cleanData.pitch_deck_url;

      await startupsAPI.addInvestmentMetrics(investmentId, cleanData, token);
      navigate('/founder/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add metrics');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-round-page">
      <div className="create-round-page__container">
        {/* Progress */}
        <div className="create-round-page__progress">
          <div
            className="create-round-page__progress-bar"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>

        {error && (
          <div className="create-round-page__error">
            <div className="create-round-page__error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        )}

        {/* Step 1: Round Setup */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="create-round-form">
            <h1 className="create-round-page__title">Set Up Your Investment Round</h1>
            <p className="create-round-page__subtitle">
              Define your fundraising goals and terms
            </p>

            <div className="form-field">
              <label>Investment Sought ($)</label>
              <input
                type="number"
                value={roundData.total_investment_sought || ''}
                onChange={(e) =>
                  setRoundData({ ...roundData, total_investment_sought: Number(e.target.value) })
                }
                min="1000"
                required
              />
            </div>

            <div className="form-field">
              <label>Equity Offered (%)</label>
              <input
                type="number"
                value={roundData.equity_offered || ''}
                onChange={(e) =>
                  setRoundData({ ...roundData, equity_offered: Number(e.target.value) })
                }
                min="0.1"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div className="form-field">
              <label>Campaign Duration (days)</label>
              <select
                value={roundData.duration_days}
                onChange={(e) =>
                  setRoundData({ ...roundData, duration_days: Number(e.target.value) })
                }
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="120">120 days</option>
              </select>
            </div>

            <button type="submit" disabled={isSubmitting} className="form-submit">
              {isSubmitting ? 'Creating...' : 'Continue to Metrics'}
            </button>
          </form>
        )}

        {/* Step 2: Metrics & Pitch */}
        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="create-round-form">
            <h1 className="create-round-page__title">Add Your Metrics & Pitch</h1>
            <p className="create-round-page__subtitle">
              Help investors understand your traction
            </p>

            <div className="form-field">
              <label>Founded Year</label>
              <input
                type="number"
                value={metricsData.start_year}
                onChange={(e) =>
                  setMetricsData({ ...metricsData, start_year: Number(e.target.value) })
                }
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>

            <div className="form-field">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={metricsData.is_pre_revenue}
                  onChange={(e) =>
                    setMetricsData({ ...metricsData, is_pre_revenue: e.target.checked })
                  }
                />
                <span>We are pre-revenue</span>
              </label>
            </div>

            {!metricsData.is_pre_revenue && (
              <>
                <div className="form-field">
                  <label>Last Month Revenue ($)</label>
                  <input
                    type="number"
                    value={metricsData.last_month_revenue || ''}
                    onChange={(e) =>
                      setMetricsData({
                        ...metricsData,
                        last_month_revenue: Number(e.target.value),
                      })
                    }
                    min="0"
                  />
                </div>

                <div className="form-field">
                  <label>ARR ($)</label>
                  <input
                    type="number"
                    value={metricsData.arr || ''}
                    onChange={(e) =>
                      setMetricsData({ ...metricsData, arr: Number(e.target.value) })
                    }
                    min="0"
                  />
                </div>

                <div className="form-field">
                  <label>Churn Rate (%)</label>
                  <input
                    type="number"
                    value={metricsData.churn_rate || ''}
                    onChange={(e) =>
                      setMetricsData({ ...metricsData, churn_rate: Number(e.target.value) })
                    }
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </>
            )}

            <div className="form-field">
              <label>Competitors (Optional)</label>
              <textarea
                value={metricsData.competitors}
                onChange={(e) => setMetricsData({ ...metricsData, competitors: e.target.value })}
                placeholder="List your main competitors..."
                rows={3}
              />
            </div>

            <div className="form-field">
              <label>Pitch Deck URL (Optional)</label>
              <input
                type="url"
                value={metricsData.pitch_deck_url}
                onChange={(e) =>
                  setMetricsData({ ...metricsData, pitch_deck_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="form-back"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button type="submit" disabled={isSubmitting} className="form-submit">
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </form>
        )}

        <p className="create-round-page__step">
          Step {step} of 2 • {step === 1 ? 'Round Setup' : 'Metrics & Pitch'}
        </p>
      </div>
    </div>
  );
};

export default CreateRoundPage;
