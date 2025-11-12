"""Pytest configuration for landing module tests."""
import sys
from pathlib import Path

# Add app to Python path
app_dir = Path(__file__).resolve().parent.parent.parent.parent
sys.path.insert(0, str(app_dir))
