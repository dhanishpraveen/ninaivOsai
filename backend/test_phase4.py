"""
Automated unit and validation tests for Phase 4:
Story Details, Review, and Publish Workflow endpoints.
"""

import os
import sys
from fastapi.testclient import TestClient
from main import app

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

client = TestClient(app)


def test_supabase_status_endpoint():
    response = client.get("/supabase/status")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert "configured" in data
    assert data.get("project_ref") == "cfnqbwxgtzusysfmirby"
    assert "missing_credentials" in data
    print("PASS: /supabase/status correctly reports project_ref and credential status.")


def test_publish_validation_missing_consent():
    files = {"audio_file": ("test.wav", b"RIFF....WAVE", "audio/wav")}
    data = {
        "title": "தஞ்சை நெல் வரலாறு",
        "contributor_name": "ராமசாமி",
        "village_or_town": "திருவையாறு",
        "district": "தஞ்சாவூர்",
        "category": "Agriculture",
        "transcript": "நெல் சாகுபடி பற்றிய பாரம்பரிய அறிவு.",
        "consent_confirmed": "false",
    }
    response = client.post("/stories/publish", data=data, files=files)
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    assert "consent" in response.text.lower()
    print("PASS: Missing consent correctly rejected with HTTP 400.")


def test_publish_validation_missing_title():
    files = {"audio_file": ("test.wav", b"RIFF....WAVE", "audio/wav")}
    data = {
        "title": "",
        "contributor_name": "ராமசாமி",
        "village_or_town": "திருவையாறு",
        "district": "தஞ்சாவூர்",
        "category": "Agriculture",
        "transcript": "நெல் சாகுபடி பற்றிய பாரம்பரிய அறிவு.",
        "consent_confirmed": "true",
    }
    response = client.post("/stories/publish", data=data, files=files)
    assert response.status_code == 400
    assert "title" in response.text.lower()
    print("PASS: Missing title correctly rejected with HTTP 400.")


def test_publish_validation_missing_contributor():
    files = {"audio_file": ("test.wav", b"RIFF....WAVE", "audio/wav")}
    data = {
        "title": "தஞ்சை நெல் வரலாறு",
        "contributor_name": "",
        "village_or_town": "திருவையாறு",
        "district": "தஞ்சாவூர்",
        "category": "Agriculture",
        "transcript": "நெல் சாகுபடி பற்றிய பாரம்பரிய அறிவு.",
        "consent_confirmed": "true",
    }
    response = client.post("/stories/publish", data=data, files=files)
    assert response.status_code == 400
    assert "contributor" in response.text.lower()
    print("PASS: Missing contributor correctly rejected with HTTP 400.")


def test_publish_validation_missing_transcript():
    files = {"audio_file": ("test.wav", b"RIFF....WAVE", "audio/wav")}
    data = {
        "title": "தஞ்சை நெல் வரலாறு",
        "contributor_name": "ராமசாமி",
        "village_or_town": "திருவையாறு",
        "district": "தஞ்சாவூர்",
        "category": "Agriculture",
        "transcript": "   ",
        "consent_confirmed": "true",
    }
    response = client.post("/stories/publish", data=data, files=files)
    assert response.status_code == 400
    assert "transcript" in response.text.lower()
    print("PASS: Empty transcript correctly rejected with HTTP 400.")


def test_publish_validation_empty_audio():
    files = {"audio_file": ("test.wav", b"", "audio/wav")}
    data = {
        "title": "தஞ்சை நெல் வரலாறு",
        "contributor_name": "ராமசாமி",
        "village_or_town": "திருவையாறு",
        "district": "தஞ்சாவூர்",
        "category": "Agriculture",
        "transcript": "நெல் சாகுபடி பற்றிய பாரம்பரிய அறிவு.",
        "consent_confirmed": "true",
    }
    response = client.post("/stories/publish", data=data, files=files)
    assert response.status_code == 400
    assert "audio" in response.text.lower()
    print("PASS: Empty audio correctly rejected with HTTP 400.")


def test_publish_supabase_missing_credentials_handling():
    """
    When all fields and audio are valid, but Supabase credentials are not yet
    configured in .env, the backend must return HTTP 503 with exact instructions
    and not falsely claim the story was persisted.
    """
    files = {"audio_file": ("test_sample_tamil.wav", b"RIFF....WAVE_TEST_DATA", "audio/wav")}
    data = {
        "title": "தஞ்சாவூர் நெல் சாகுபடி வாய்மொழி வரலாறு",
        "contributor_name": "ராமசாமி (Ramasamy)",
        "village_or_town": "திருவையாறு (Thiruvaiyaru)",
        "district": "Thanjavur",
        "category": "Agriculture",
        "transcript": "வணக்கம் தஞ்சாவூர் நெல் சாகுபடி பற்றிய வாய்மொழி வரலாறு.",
        "consent_confirmed": "true",
        "uploader_name": "தனிஷ் (Dhanish)",
        "crop_or_topic": "Paddy (Rice)",
        "tags": "paddy, irrigation, delta history",
    }
    response = client.post("/stories/publish", data=data, files=files)
    # If Supabase is not configured, it returns 503
    # If configured, it returns 201
    assert response.status_code in (201, 503), f"Unexpected status: {response.status_code}"
    if response.status_code == 503:
        detail = response.json().get("detail", {})
        assert detail.get("configured") is False
        assert detail.get("project_ref") == "cfnqbwxgtzusysfmirby"
        print("PASS: Unconfigured Supabase gracefully returns HTTP 503 with missing credentials detail.")
    else:
        print("PASS: Story persisted to live Supabase with HTTP 201.")


if __name__ == "__main__":
    test_supabase_status_endpoint()
    test_publish_validation_missing_consent()
    test_publish_validation_missing_title()
    test_publish_validation_missing_contributor()
    test_publish_validation_missing_transcript()
    test_publish_validation_empty_audio()
    test_publish_supabase_missing_credentials_handling()
    print("\nAll Phase 4 backend validation and workflow tests PASSED successfully!")
