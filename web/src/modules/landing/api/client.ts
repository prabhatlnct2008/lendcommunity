import type {
  LandingPageVM,
  ExitIntentCopyVM,
  JoinEmailRequest,
  JoinEmailResponse,
  CTAClickRequest,
} from './types';

const API_BASE = '/landing/v1';

class LandingAPI {
  private sessionId: string;
  private cachedETag: string | null = null;

  constructor() {
    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  private getUTMParams(): {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    referrer_url?: string;
  } {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
      referrer_url: document.referrer || undefined,
    };
  }

  async getLandingPage(locale: string = 'en-US'): Promise<LandingPageVM> {
    const headers: HeadersInit = {
      'X-Session-ID': this.sessionId,
    };

    if (this.cachedETag) {
      headers['If-None-Match'] = this.cachedETag;
    }

    const response = await fetch(`${API_BASE}/page?locale=${locale}`, {
      headers,
    });

    if (response.status === 304) {
      // Not modified - would need cached data from state
      throw new Error('NOT_MODIFIED');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch landing page: ${response.statusText}`);
    }

    // Store ETag for future requests
    const etag = response.headers.get('ETag');
    if (etag) {
      this.cachedETag = etag;
    }

    return response.json();
  }

  async getExitIntent(locale: string = 'en-US'): Promise<ExitIntentCopyVM | null> {
    const response = await fetch(`${API_BASE}/exit-intent?locale=${locale}`, {
      headers: {
        'X-Session-ID': this.sessionId,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch exit intent');
      return null;
    }

    return response.json();
  }

  async submitEmail(
    email: string,
    source: 'hero' | 'exit_intent' | 'footer' = 'hero',
    locale: string = 'en-US'
  ): Promise<JoinEmailResponse> {
    const utm = this.getUTMParams();

    const request: JoinEmailRequest = {
      email,
      locale,
      source,
      ...utm,
    };

    const response = await fetch(`${API_BASE}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': this.sessionId,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit email: ${response.statusText}`);
    }

    return response.json();
  }

  async trackCTAClick(
    placement: string,
    label: string,
    action: string,
    locale: string = 'en-US'
  ): Promise<void> {
    const request: CTAClickRequest = {
      placement,
      label,
      action: action as any,
      locale,
      session_id: this.sessionId,
    };

    try {
      await fetch(`${API_BASE}/cta-click`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
    } catch (error) {
      // Fire-and-forget, don't throw
      console.error('Failed to track CTA click:', error);
    }
  }
}

export const landingAPI = new LandingAPI();
