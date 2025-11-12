// API Types matching backend models

export type CTAAction = 'open_signup' | 'open_browse' | 'custom_url';
export type EmailSource = 'hero' | 'exit_intent' | 'footer';

export interface CTA {
  label: string;
  action: CTAAction;
  url?: string;
}

export interface HeroVM {
  headline: string;
  subheadline?: string;
  primary_cta: CTA;
  secondary_cta?: CTA;
  bg_image_url?: string;
}

export interface TestimonialVM {
  author_name: string;
  author_title?: string;
  quote: string;
  avatar_url?: string;
}

export interface StartupCardVM {
  id: string;
  name: string;
  tagline?: string;
  raised_cents: number;
  goal_cents: number;
  percent_funded: number;
  logo_url?: string;
  cover_url?: string;
}

export interface TeaserSectionVM {
  title?: string;
  items: StartupCardVM[];
  mask_after: number;
}

export interface ExitIntentCopyVM {
  headline: string;
  body?: string;
  cta_label: string;
  cta_action: CTAAction;
  cta_url?: string;
  image_url?: string;
  can_show_now: boolean;
}

export interface LandingPageVM {
  locale: string;
  version: number;
  etag: string;
  hero: HeroVM;
  teaser: TeaserSectionVM;
  testimonials: TestimonialVM[];
  disclaimers_html?: string;
  exit_intent?: ExitIntentCopyVM;
}

export interface JoinEmailRequest {
  email: string;
  locale?: string;
  source?: EmailSource;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer_url?: string;
}

export interface JoinEmailResponse {
  ok: boolean;
  message: string;
}

export interface CTAClickRequest {
  placement: string;
  label: string;
  action: CTAAction;
  locale?: string;
  session_id?: string;
}
