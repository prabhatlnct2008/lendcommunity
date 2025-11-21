/**
 * Startups API types
 */

export type ProfileStatus = 'incomplete' | 'basic_complete' | 'full_complete';
export type InvestmentStatus = 'draft' | 'pending_review' | 'live' | 'closed';

export interface Startup {
  id: string;
  user_id: string;
  name: string;
  founder_name: string;
  email: string;
  phone: string;
  website: string | null;
  profile_status: ProfileStatus;
  created_at: string;
  updated_at: string;
}

export interface StartupCreateRequest {
  name: string;
  founder_name: string;
  email: string;
  phone: string;
  website?: string;
}

export interface Investment {
  id: string;
  startup_id: string;
  total_investment_sought: number;
  equity_offered: number;
  current_valuation: number;
  start_date: string;
  end_date: string;
  status: InvestmentStatus;
  start_year: number | null;
  is_pre_revenue: boolean;
  last_month_revenue: number | null;
  arr: number | null;
  churn_rate: number | null;
  competitors: string | null;
  pitch_deck_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvestmentRoundCreateRequest {
  total_investment_sought: number;
  equity_offered: number;
  duration_days: number;
}

export interface InvestmentMetricsRequest {
  start_year: number;
  is_pre_revenue: boolean;
  last_month_revenue?: number;
  arr?: number;
  churn_rate?: number;
  competitors?: string;
  pitch_deck_url?: string;
}
