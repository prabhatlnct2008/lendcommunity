"""Stub Discovery adapter for MVP."""
from typing import List

from app.modules.landing.domain import StartupCardVM
from app.core.utils import dict_hash


class DiscoveryStub:
    """Stub implementation of Discovery adapter."""

    def get_top_campaigns(self, limit: int = 3) -> List[StartupCardVM]:
        """Get top campaigns for teaser."""
        # Mock data
        campaigns = [
            StartupCardVM(
                id="camp_001",
                name="FreshBites",
                tagline="Farm-to-table meal delivery for busy professionals",
                raised_cents=75000_00,
                goal_cents=100000_00,
                percent_funded=75.0,
                logo_url="https://via.placeholder.com/100x100?text=FB",
                cover_url="https://images.unsplash.com/photo-1498837167922-ddd27525d352",
            ),
            StartupCardVM(
                id="camp_002",
                name="CodeMentor",
                tagline="1-on-1 coding mentorship for career changers",
                raised_cents=120000_00,
                goal_cents=150000_00,
                percent_funded=80.0,
                logo_url="https://via.placeholder.com/100x100?text=CM",
                cover_url="https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
            ),
            StartupCardVM(
                id="camp_003",
                name="GreenCycle",
                tagline="Smart recycling solutions for urban communities",
                raised_cents=45000_00,
                goal_cents=80000_00,
                percent_funded=56.25,
                logo_url="https://via.placeholder.com/100x100?text=GC",
                cover_url="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
            ),
        ]

        return campaigns[:limit]

    def get_discovery_revision(self, limit: int = 3) -> str:
        """Get discovery revision hash based on current campaigns."""
        campaigns = self.get_top_campaigns(limit)
        # Create a deterministic hash from campaign data
        data = {c.id: c.percent_funded for c in campaigns}
        return dict_hash(data)
