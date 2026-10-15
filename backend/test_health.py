"""
Health check automated test for Phase 3
Verifies that FastAPI backend starts and GET /health returns HTTP 200 with Whisper STT status.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    assert data["status"] == "ok"
    assert "Tamil" in data["app"]
    assert "Phase 3" in data["phase"]
    assert data["model"] == "vasista22/whisper-tamil-small"
    print("PASS: GET /health returned 200 with Phase 3 schema.")
    print("Response payload:", data)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "Phase 3" in data["phase"]
    print("PASS: GET / returned 200 online status.")


def test_transcribe_status_endpoint():
    response = client.get("/transcribe/status")
    assert response.status_code == 200
    data = response.json()
    assert data["model"] == "vasista22/whisper-tamil-small"
    print("PASS: GET /transcribe/status returned 200 with model info.")


if __name__ == "__main__":
    test_health_endpoint()
    test_root_endpoint()
    test_transcribe_status_endpoint()
    print("All Phase 3 backend health tests passed successfully!")
