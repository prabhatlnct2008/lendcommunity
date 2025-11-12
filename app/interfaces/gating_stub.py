"""Stub Gating adapter for MVP."""
from typing import Optional


class GatingStub:
    """Stub implementation of Gating adapter."""

    def evaluate_rule(
        self, rule_name: str, session_id: Optional[str] = None
    ) -> bool:
        """Evaluate a gating rule."""
        # For MVP, always allow exit intent
        if rule_name == "landing.exit_intent":
            return True

        # Default to allowing
        return True

    def can_show_exit_intent(self, session_id: Optional[str] = None) -> bool:
        """Check if exit intent can be shown."""
        return self.evaluate_rule("landing.exit_intent", session_id)
