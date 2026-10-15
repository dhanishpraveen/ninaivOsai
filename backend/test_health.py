"""
Health check automated test for Phase 1
Verifies that FastAPI backend starts and GET /health returns HTTP 200 with expected schema.
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
    assert "Phase 1" in data["phase"]
    print("PASS: GET /health returned 200 with valid schema.")
    print("Response payload:", data)


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    print("PASS: GET / returned 200 online status.")


if __name__ == "__main__":
    test_health_endpoint()
    test_root_endpoint()
    print("All Phase 1 backend tests passed successfully!")
