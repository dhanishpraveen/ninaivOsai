"""
Independent Unit & Integration Tests for Story Metadata Service (Phase 5)
=========================================================================
Tests:
- Valid Tamil transcript input (Mock fixture mode)
- Empty transcript rejection (HTTP 400/422)
- Excessively long transcript rejection (HTTP 422)
- Schema and Canonical Category validation
- Malformed LLM response handling (HTTP 502 - Never fabricates fake success)
- API Timeout handling (HTTP 504)
- Provider failure handling (HTTP 502)
- Unconfigured LLM error handling (HTTP 503)
- Cultural domain classification (Agriculture, Medicine, Folk Songs, Water)
- Verification that Phase 4 files remain untouched
"""

import os
import sys
import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

# Ensure backend path is configured
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from phase5_integration_adapter import app
from services.story_metadata_service import (
    StoryMetadataService,
    LLMTimeoutError,
    LLMProviderError,
    LLMMalformedResponseError,
    CANONICAL_CATEGORIES,
)
from schemas.story_metadata import StoryMetadataRequest, StoryMetadataResponse


# Test fixtures: Authentic Tamil oral-history transcripts
SAMPLE_TAMIL_AGRICULTURE_TRANSCRIPT = (
    "எங்க தாத்தா காலத்துல இருந்தே நாங்க தஞ்சாவூர் பக்கத்துல காவிரி பாசனத்துல விவசாயம் பார்க்கிறோம். "
    "சீரக சம்பா, மாப்பிள்ளை சம்பா போன்ற பாரம்பரிய நெல் விதைகளை வீட்டு மச்சான்ல சாம்பல் தடவி பத்திரப்படுத்தி "
    "வைப்போம். பூச்சி தாக்குதல் வந்தா வேப்பெண்ணெய் கரைசலும் பஞ்சகவ்யமும் தெளிப்போம். மண் வளம் கெடாம இருக்க "
    "பசுந்தாள் உரம் போடுவோம். இந்த பாரம்பரிய உழவு முறை நம்ம உடலுக்கும் மண்ணுக்கும் நல்லது."
)

SAMPLE_TAMIL_MEDICINE_TRANSCRIPT = (
    "எங்க கிராமத்துல சின்ன வயசுல சளி, காய்ச்சல் வந்தா உடனே சித்த மருத்துவர் கிட்ட தான் போவோம். "
    "வீட்டு கொல்லைப்புறத்துல இருக்கிற ஆடாதோடை, தூதுவளை, துளசி இலைகளை பறிச்சு கசாயம் போட்டு தருவாங்க. "
    "எந்தவித பக்கவிளைவும் இல்லாம ஒரே நாள்ல சளி இறங்கிடும். இந்த மூலிகை மருத்துவ அறிவை நாம அடுத்த தலைமுறைக்கு சொல்லணும்."
)

SAMPLE_TAMIL_FOLK_TRANSCRIPT = (
    "நாங்க வயல்ல நாத்து நடும் போதும், களை எடுக்கும் போதும் வாய்மொழியா நாட்டுப்புறப் பாட்டு பாடுவோம். "
    "ஏலேலோ ஐலசா என்று பாடினால் வேலை அலுப்பு தெரியாது. எங்க பாட்டி நிறைய கிராமிய தொன்மக் கதைகளையும் "
    "பாட்டுகளையும் சொல்லிக் கொடுத்தாங்க."
)

SAMPLE_TAMIL_WATER_TRANSCRIPT = (
    "எங்க ஊர்ல மூணு பெரிய ஏரிகளும் இருபது கண்மாய்களும் இருந்துச்சு. மழைக்காலத்துல வரத்துக் கால்வாய் வழியா "
    "நீர் வந்து ஏரி நிரம்பும். கிராம மக்கள் ஒன்னா சேர்ந்து குடிமராமத்து செய்து ஏரியையும் மடைகளையும் தூர்வாருவோம்."
)


@pytest.fixture
def client():
    """Provides FastAPI test client for Phase 5 adapter."""
    return TestClient(app)


@pytest.fixture(autouse=True)
def reset_service():
    """Ensure service instance is fresh and configured for test fixture mode."""
    StoryMetadataService.reset_instance()
    os.environ["LLM_TEST_MODE"] = "true"
    os.environ["LLM_PROVIDER"] = "mock"
    yield
    StoryMetadataService.reset_instance()


# ------------------------------------------------------------------------------
# 1. Valid Tamil Transcript Input (Mock Mode)
# ------------------------------------------------------------------------------
def test_valid_tamil_transcript_mock_mode(client):
    """
    Test metadata generation with authentic Tamil agricultural oral history.
    Verifies title, summary, keywords, category, and tags.
    """
    payload = {
        "transcript": SAMPLE_TAMIL_AGRICULTURE_TRANSCRIPT,
        "language": "ta",
        "include_english_summary": True,
    }

    response = client.post("/metadata/generate", json=payload)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    
    data = response.json()
    assert "title" in data and len(data["title"]) > 0
    assert "summary" in data and len(data["summary"]) > 0
    assert "keywords" in data and isinstance(data["keywords"], list) and len(data["keywords"]) > 0
    assert "category" in data and data["category"] in CANONICAL_CATEGORIES
    assert data["category"] == "Agriculture"
    assert "tags" in data and len(data["tags"]) > 0
    assert data["english_summary"] is not None and len(data["english_summary"]) > 0
    # Explicitly labeled as test fixture
    assert data["is_mock"] is True
    assert data["provider"] == "mock"


# ------------------------------------------------------------------------------
# 2. Empty & Whitespace Transcript Rejection
# ------------------------------------------------------------------------------
def test_empty_transcript_rejection(client):
    """
    Test rejection of empty string, whitespace string, or missing transcript.
    """
    # Empty string
    res_empty = client.post("/metadata/generate", json={"transcript": ""})
    assert res_empty.status_code in (400, 422)

    # Whitespace only
    res_whitespace = client.post("/metadata/generate", json={"transcript": "     \n\t   "})
    assert res_whitespace.status_code in (400, 422)

    # Missing field
    res_missing = client.post("/metadata/generate", json={})
    assert res_missing.status_code == 422


# ------------------------------------------------------------------------------
# 3. Too Short & Excessively Long Transcript Rejection
# ------------------------------------------------------------------------------
def test_transcript_length_limits(client):
    """
    Test rejection of transcripts that are too short (<10 chars) or excessively long (>30000 chars).
    """
    # Too short (< 10 chars)
    res_short = client.post("/metadata/generate", json={"transcript": "வணக்கம்"})
    assert res_short.status_code in (400, 422)

    # Excessively long (> 30000 chars)
    huge_text = "விவசாயம் " * 4000  # > 32000 chars
    res_long = client.post("/metadata/generate", json={"transcript": huge_text})
    assert res_long.status_code in (400, 422)


# ------------------------------------------------------------------------------
# 4. Optional English Summary Omission
# ------------------------------------------------------------------------------
def test_omit_english_summary(client):
    """
    Test that english_summary is None when include_english_summary=False.
    """
    payload = {
        "transcript": SAMPLE_TAMIL_AGRICULTURE_TRANSCRIPT,
        "language": "ta",
        "include_english_summary": False,
    }
    response = client.post("/metadata/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["english_summary"] is None


# ------------------------------------------------------------------------------
# 5. Cultural Domain Classification
# ------------------------------------------------------------------------------
def test_cultural_domain_classification(client):
    """
    Test that distinct cultural domains map to their appropriate canonical categories.
    """
    # Traditional Medicine
    res_med = client.post("/metadata/generate", json={"transcript": SAMPLE_TAMIL_MEDICINE_TRANSCRIPT})
    assert res_med.status_code == 200
    assert res_med.json()["category"] == "Traditional Medicine & Practices"

    # Folk Songs
    res_folk = client.post("/metadata/generate", json={"transcript": SAMPLE_TAMIL_FOLK_TRANSCRIPT})
    assert res_folk.status_code == 200
    assert res_folk.json()["category"] == "Folk Songs & Storytelling"

    # Water Conservation
    res_water = client.post("/metadata/generate", json={"transcript": SAMPLE_TAMIL_WATER_TRANSCRIPT})
    assert res_water.status_code == 200
    assert res_water.json()["category"] == "Water Conservation"


# ------------------------------------------------------------------------------
# 6. Malformed LLM Response Handling (Never fabricate fake success)
# ------------------------------------------------------------------------------
def test_malformed_llm_response_handling(client):
    """
    Test that malformed/corrupted JSON from an LLM raises HTTP 502 and does NOT fabricate fake success.
    """
    service = StoryMetadataService.get_instance()
    service.test_mode = False
    service.api_key = "fake_key_for_mocking"
    service.provider = "gemini"

    # Mock _call_provider returning broken JSON
    with patch.object(service, "_call_provider", AsyncMock(return_value="BROKEN NON-JSON RESPONSE <<>>")):
        response = client.post("/metadata/generate", json={"transcript": SAMPLE_TAMIL_AGRICULTURE_TRANSCRIPT})
        assert response.status_code == 502
        detail = response.json().get("detail", "")
        assert "malformed" in detail.lower() or "invalid json" in detail.lower()


def test_missing_required_field_in_llm_response(client):
    """
    Test that LLM response missing 'title' is rejected with HTTP 502.
    """
    service = StoryMetadataService.get_instance()
    service.test_mode = False
    service.api_key = "fake_key_for_mocking"
    service.provider = "gemini"

    partial_json = '{"summary": "Only summary", "keywords": ["விவசாயம்"], "category": "Agriculture"}'
    with patch.object(service, "_call_provider", AsyncMock(return_value=partial_json)):
        response = client.post("/metadata/generate", json={"transcript": SAMPLE_TAMIL_AGRICULTURE_TRANSCRIPT})
        assert response.status_code == 502
        assert "title" in response.json().get("detail", "").lower()


# ------------------------------------------------------------------------------
# 7. LLM Timeout Handling
# ------------------------------------------------------------------------------
def test_llm_timeout_handling(client):
    """
    Test that LLM provider timeout results in HTTP 504 Gateway Timeout.
    """
    service = StoryMetadataService.get_instance()
    service.test_mode = False
    service.api_key = "fake_key_for_mocking"
    service.provider = "gemini"

    with patch.object(service, "_call_provider", AsyncMock(side_effect=LLMTimeoutError("Timed out"))):
        response = client.post("/metadata/generate", json={"transcript": SAMPLE_TAMIL_AGRICULTURE_TRANSCRIPT})
        assert response.status_code == 504
        assert "timed out" in response.json().get("detail", "").lower()


# ------------------------------------------------------------------------------
# 8. LLM Provider Failure Handling
# ------------------------------------------------------------------------------
def test_llm_provider_failure_handling(client):
    """
    Test that upstream LLM failure (e.g. HTTP 500 from provider) results in HTTP 502 Bad Gateway.
    """
    service = StoryMetadataService.get_instance()
    service.test_mode = False
    service.api_key = "fake_key_for_mocking"
    service.provider = "gemini"

    with patch.object(service, "_call_provider", AsyncMock(side_effect=LLMProviderError("Upstream rate limited or 500"))):
        response = client.post("/metadata/generate", json={"transcript": SAMPLE_TAMIL_AGRICULTURE_TRANSCRIPT})
        assert response.status_code == 502
        assert "failure" in response.json().get("detail", "").lower() or "provider" in response.json().get("detail", "").lower()


# ------------------------------------------------------------------------------
# 9. Unconfigured Provider Error Handling
# ------------------------------------------------------------------------------
def test_unconfigured_provider_error(client):
    """
    Test that if no API key is provided and test mode is disabled, an HTTP 503 is returned
    with a clear resolution instruction.
    """
    service = StoryMetadataService.get_instance()
    service.test_mode = False
    service.api_key = ""

    response = client.post("/metadata/generate", json={"transcript": SAMPLE_TAMIL_AGRICULTURE_TRANSCRIPT})
    assert response.status_code == 503
    data = response.json()
    assert "detail" in data
    detail = data["detail"]
    assert detail.get("configured") is False
    assert "LLM_API_KEY" in detail.get("resolution", "")


# ------------------------------------------------------------------------------
# 10. Metadata Service Status Endpoint
# ------------------------------------------------------------------------------
def test_metadata_service_status_endpoint(client):
    """
    Test GET /metadata/status endpoint.
    """
    response = client.get("/metadata/status")
    assert response.status_code == 200
    data = response.json()
    assert "configured" in data
    assert "provider" in data
    assert "model" in data
    assert "test_mode" in data
    assert "supported_providers" in data


# ------------------------------------------------------------------------------
# 11. Preservation of Existing Phase 4 Files (Strict Parallel Rule)
# ------------------------------------------------------------------------------
def test_existing_phase4_files_integrity():
    """
    Ensures that existing core files were not deleted or corrupted during Phase 5 development.
    """
    expected_files = [
        os.path.join(current_dir, "main.py"),
        os.path.join(current_dir, "requirements.txt"),
        os.path.join(current_dir, "supabase_schema.sql"),
        os.path.join(current_dir, "services", "transcription_service.py"),
        os.path.join(current_dir, "services", "supabase_service.py"),
        os.path.join(current_dir, "test_phase4.py"),
    ]

    for file_path in expected_files:
        assert os.path.exists(file_path), f"Critical file was modified or deleted: {file_path}"
        assert os.path.getsize(file_path) > 0, f"Critical file is empty: {file_path}"
