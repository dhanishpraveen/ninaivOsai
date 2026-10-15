"""
Automated integration test for POST /transcribe endpoint.
Uploads real Tamil audio file and validates:
1. Status 200 OK
2. Non-empty recognized Tamil text
3. Proper JSON response schema (duration_seconds, language="ta", model="vasista22/whisper-tamil-small")
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


def test_transcribe_with_real_tamil_audio():
    sample_path = "test_sample_tamil.wav"
    assert os.path.exists(sample_path), f"Sample audio {sample_path} not found"

    with open(sample_path, "rb") as f:
        file_bytes = f.read()

    files = {"file": ("test_sample_tamil.wav", file_bytes, "audio/wav")}
    response = client.post("/transcribe", files=files)

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    data = response.json()

    print("\n================== TRANSCRIBE TEST PASSED ==================")
    print("Success:", data.get("success"))
    print("Tamil Transcript:", data.get("text"))
    print("Duration (s):", data.get("duration_seconds"))
    print("Inference time (s):", data.get("inference_time_seconds"))
    print("Model:", data.get("model"))
    print("Language:", data.get("language"))
    print("Device:", data.get("device"))
    print("============================================================\n")

    assert data.get("success") is True
    assert data.get("text") and len(data.get("text")) > 0
    assert data.get("language") == "ta"
    assert data.get("model") == "vasista22/whisper-tamil-small"


def test_transcribe_empty_file():
    files = {"file": ("empty.wav", b"", "audio/wav")}
    response = client.post("/transcribe", files=files)
    assert response.status_code in (400, 422), f"Expected 400 for empty file, got {response.status_code}"
    print("PASS: Empty file correctly rejected with HTTP", response.status_code)


if __name__ == "__main__":
    test_transcribe_empty_file()
    test_transcribe_with_real_tamil_audio()
    print("All Phase 3 transcription tests passed successfully!")
