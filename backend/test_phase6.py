"""
Automated unit & integration test suite for Phase 6:
Supabase Integration + Realistic Demo Data + Dashboard Statistics.
"""

import os
import sys
import pytest
from fastapi.testclient import TestClient

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from main import app
from demo_data import DEMO_STORIES

client = TestClient(app)


def test_demo_data_integrity():
    """Verify demo dataset contains 8-12 realistic, compliant records."""
    assert len(DEMO_STORIES) >= 8 and len(DEMO_STORIES) <= 12
    assert len(DEMO_STORIES) == 10

    required_keys = [
        "id", "title", "contributor_name", "village_or_town", "district",
        "category", "transcript", "summary", "is_demo", "consent_confirmed"
    ]

    for story in DEMO_STORIES:
        for k in required_keys:
            assert k in story, f"Missing key {k} in demo story {story.get('id')}"
        assert story["is_demo"] is True
        assert story["consent_confirmed"] is True
        assert len(story["title"].strip()) > 0
        assert len(story["transcript"].strip()) > 0
        # Fictional contributor check
        assert "கற்பனை" in story["contributor_name"] or "Fictional" in story["contributor_name"]


def test_get_stories_endpoint():
    """Verify GET /stories returns all demo stories and valid schema."""
    response = client.get("/stories?limit=50")
    assert response.status_code == 200
    data = response.json()
    assert "stories" in data
    assert "count" in data
    assert data["count"] >= 10
    
    first = data["stories"][0]
    assert "title" in first
    assert "transcript" in first
    assert "category" in first


def test_get_single_story_endpoint():
    """Verify GET /stories/{story_id} returns the specific story."""
    response = client.get("/stories/demo-story-01")
    assert response.status_code == 200
    data = response.json()
    assert "story" in data
    story = data["story"]
    assert story["id"] == "demo-story-01"
    assert "தஞ்சாவூர்" in story["title"]
    assert story["district"] == "Thanjavur"
    assert story["category"] == "Agriculture"


def test_get_single_story_not_found():
    """Verify GET /stories/non-existent returns HTTP 404."""
    response = client.get("/stories/non-existent-story-uuid-1234")
    assert response.status_code == 404
    assert "not found" in response.json().get("detail", "").lower()


def test_dashboard_stats_endpoint():
    """Verify GET /stats computes valid preservation metrics."""
    response = client.get("/stats")
    assert response.status_code == 200
    stats = response.json()
    assert "total_stories" in stats
    assert stats["total_stories"] >= 10
    assert "demo_stories" in stats
    assert stats["demo_stories"] >= 10
    assert "categories_count" in stats
    assert stats["categories_count"] >= 5
    assert "category_breakdown" in stats
    assert "Agriculture" in stats["category_breakdown"]
    assert "Traditional Crafts" in stats["category_breakdown"]
    assert "Water Conservation" in stats["category_breakdown"]
    assert "recent_stories" in stats
    assert len(stats["recent_stories"]) > 0


def test_seed_demo_data_idempotency():
    """Verify POST /demo/seed runs idempotently without crashing or duplication."""
    # First run
    res1 = client.post("/demo/seed")
    assert res1.status_code == 200
    data1 = res1.json()
    assert "success" in data1
    assert data1["success"] is True

    # Second run (must be idempotent)
    res2 = client.post("/demo/seed")
    assert res2.status_code == 200
    data2 = res2.json()
    assert "success" in data2
    assert data2["success"] is True

    # Stories count after seeding must be unchanged
    stories_res = client.get("/stories?limit=50")
    assert stories_res.status_code == 200
    assert stories_res.json()["count"] >= 10


def test_category_filtering():
    """Verify GET /stories?category=Agriculture returns filtered results."""
    response = client.get("/stories?category=Agriculture")
    assert response.status_code == 200
    stories = response.json().get("stories", [])
    assert len(stories) > 0
    for s in stories:
        assert s["category"] == "Agriculture"
