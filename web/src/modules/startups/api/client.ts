/**
 * Startups API client
 */
import type {
  Startup,
  StartupCreateRequest,
  Investment,
  InvestmentRoundCreateRequest,
  InvestmentMetricsRequest,
} from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class StartupsAPIClient {
  /**
   * Create a new startup
   */
  async createStartup(data: StartupCreateRequest, token: string): Promise<Startup> {
    const response = await fetch(`${API_BASE}/startups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create startup');
    }

    return response.json();
  }

  /**
   * Get current user's startup
   */
  async getMyStartup(token: string): Promise<Startup> {
    const response = await fetch(`${API_BASE}/startups/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NOT_FOUND');
      }
      throw new Error('Failed to get startup');
    }

    return response.json();
  }

  /**
   * Get startup by ID
   */
  async getStartup(startupId: string): Promise<Startup> {
    const response = await fetch(`${API_BASE}/startups/${startupId}`);

    if (!response.ok) {
      throw new Error('Failed to get startup');
    }

    return response.json();
  }

  /**
   * Create a new investment round
   */
  async createInvestmentRound(
    data: InvestmentRoundCreateRequest,
    token: string
  ): Promise<Investment> {
    const response = await fetch(`${API_BASE}/investments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to create investment round');
    }

    return response.json();
  }

  /**
   * Add metrics and pitch to investment
   */
  async addInvestmentMetrics(
    investmentId: string,
    data: InvestmentMetricsRequest,
    token: string
  ): Promise<Investment> {
    const response = await fetch(`${API_BASE}/investments/${investmentId}/metrics`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to add metrics');
    }

    return response.json();
  }

  /**
   * Get current user's investment
   */
  async getMyInvestment(token: string): Promise<Investment> {
    const response = await fetch(`${API_BASE}/investments/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('NOT_FOUND');
      }
      throw new Error('Failed to get investment');
    }

    return response.json();
  }

  /**
   * Get investment by ID
   */
  async getInvestment(investmentId: string): Promise<Investment> {
    const response = await fetch(`${API_BASE}/investments/${investmentId}`);

    if (!response.ok) {
      throw new Error('Failed to get investment');
    }

    return response.json();
  }
}

export const startupsAPI = new StartupsAPIClient();
