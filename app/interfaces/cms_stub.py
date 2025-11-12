"""Stub CMS adapter for MVP."""
from typing import Dict, List, Optional

from app.modules.landing.domain import CTA, HeroVM, TestimonialVM, ExitIntentCopyVM


class CMSStub:
    """Stub implementation of CMS adapter."""

    def get_published_landing_content(self, locale: str = "en-US") -> Dict:
        """Get published landing content."""
        return {
            "cms_etag": "cms_v1",
            "version": 1,
            "locale": locale,
            "hero": {
                "headline": "Crowdfunding for Southeast Asians in Virginia",
                "subheadline": "Invest in local startups. Empower your community.",
                "primary_cta": {
                    "label": "Join the Community",
                    "action": "open_signup",
                    "url": None,
                },
                "secondary_cta": {
                    "label": "Browse Startups",
                    "action": "open_browse",
                    "url": None,
                },
                "bg_image_url": "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
            },
            "testimonials": [
                {
                    "author_name": "Sarah Chen",
                    "author_title": "Founder, TechStart",
                    "quote": "We closed our seed round with community support. The local backing made all the difference!",
                    "avatar_url": None,
                },
                {
                    "author_name": "Michael Nguyen",
                    "author_title": "Early Backer",
                    "quote": "Investing in my community feels amazing. I get to support local entrepreneurs building the future.",
                    "avatar_url": None,
                },
            ],
            "disclaimers_html": "<p><small>Investing involves risk. Please read all disclosures carefully. "
            "This platform is for accredited investors only.</small></p>",
            "exit_intent": {
                "headline": "Wait! Don't miss out on exclusive opportunities",
                "body": "Join our community to get early access to local startups seeking funding.",
                "cta_label": "Join Now",
                "cta_action": "open_signup",
                "cta_url": None,
                "image_url": None,
            },
            "teaser_config": {"mask_after": 2},
        }

    def get_hero(self, locale: str = "en-US") -> HeroVM:
        """Get hero section."""
        content = self.get_published_landing_content(locale)
        return HeroVM(**content["hero"])

    def get_testimonials(self, locale: str = "en-US") -> List[TestimonialVM]:
        """Get testimonials."""
        content = self.get_published_landing_content(locale)
        return [TestimonialVM(**t) for t in content["testimonials"]]

    def get_exit_intent_copy(self, locale: str = "en-US") -> ExitIntentCopyVM:
        """Get exit intent copy."""
        content = self.get_published_landing_content(locale)
        return ExitIntentCopyVM(**content["exit_intent"], can_show_now=False)

    def get_disclaimers_html(self, locale: str = "en-US") -> Optional[str]:
        """Get disclaimers HTML."""
        content = self.get_published_landing_content(locale)
        return content.get("disclaimers_html")

    def get_teaser_config(self, locale: str = "en-US") -> Dict:
        """Get teaser configuration."""
        content = self.get_published_landing_content(locale)
        return content.get("teaser_config", {"mask_after": 2})

    def get_cms_etag(self, locale: str = "en-US") -> str:
        """Get CMS content etag."""
        content = self.get_published_landing_content(locale)
        return content["cms_etag"]
