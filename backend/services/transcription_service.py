import os
import sys
import time
import logging
import threading
import tempfile
import asyncio
from typing import Optional, Dict, Any, Tuple
import numpy as np
from scipy import signal

logger = logging.getLogger("transcription_service")
logging.basicConfig(level=logging.INFO)

MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB max size


class AudioProcessingError(Exception):
    """Raised when audio cannot be read or validated."""
    pass


class ModelNotReadyError(Exception):
    """Raised when the transcription model is still loading or failed to load."""
    pass


class TranscriptionError(Exception):
    """Raised during inference execution failure."""
    pass


class TranscriptionService:
    """
    Singleton service managing the Hugging Face vasista22/whisper-tamil-small model.
    Loads model once during startup/initialization and reuses it for all requests.
    Thread-safe and asynchronous inference wrapper.
    """
    _instance: Optional["TranscriptionService"] = None
    _lock = threading.Lock()

    def __init__(self):
        self.model_name = "vasista22/whisper-tamil-small"
        self._pipeline = None
        self._is_loading = False
        self._load_error: Optional[str] = None
        self._device: str = "cpu"
        self._init_lock = threading.Lock()

    @classmethod
    def get_instance(cls) -> "TranscriptionService":
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = cls()
        return cls._instance

    @property
    def is_ready(self) -> bool:
        return self._pipeline is not None

    @property
    def is_loading(self) -> bool:
        return self._is_loading

    @property
    def load_error(self) -> Optional[str]:
        return self._load_error

    @property
    def device(self) -> str:
        return self._device

    def initialize_model(self) -> bool:
        """
        Loads the Hugging Face model and pipeline once.
        Thread-safe; does not reload if already initialized.
        """
        if self._pipeline is not None:
            return True

        with self._init_lock:
            if self._pipeline is not None:
                return True

            self._is_loading = True
            self._load_error = None
            start_time = time.time()
            logger.info("Initializing Hugging Face model %s...", self.model_name)

            try:
                import torch
                from transformers import pipeline

                # Determine hardware device
                self._device = "cuda:0" if torch.cuda.is_available() else "cpu"
                logger.info("Selected inference device: %s", self._device)

                # Initialize Automatic Speech Recognition pipeline
                transcribe_pipeline = pipeline(
                    task="automatic-speech-recognition",
                    model=self.model_name,
                    chunk_length_s=30,
                    device=self._device,
                )

                # Configure forced decoder tokens for Tamil transcription
                try:
                    forced_decoder_ids = transcribe_pipeline.tokenizer.get_decoder_prompt_ids(
                        language="ta",
                        task="transcribe",
                    )
                    transcribe_pipeline.model.config.forced_decoder_ids = forced_decoder_ids
                    if hasattr(transcribe_pipeline.model, "generation_config") and transcribe_pipeline.model.generation_config is not None:
                        transcribe_pipeline.model.generation_config.forced_decoder_ids = forced_decoder_ids
                    logger.info("Tamil forced decoder prompt configured: %s", forced_decoder_ids)
                except Exception as config_err:
                    logger.warning(
                        "Could not configure forced_decoder_ids directly (%s).",
                        config_err,
                    )

                self._pipeline = transcribe_pipeline
                load_duration = time.time() - start_time
                logger.info(
                    "Model %s successfully loaded on %s in %.2f seconds.",
                    self.model_name,
                    self._device,
                    load_duration,
                )
                self._is_loading = False
                return True

            except Exception as e:
                self._load_error = str(e)
                self._is_loading = False
                logger.error("Failed to load model %s: %s", self.model_name, e, exc_info=True)
                return False

    def validate_audio_file(self, file_bytes: bytes, filename: str) -> None:
        """
        Validates file size and basic audio magic headers.
        """
        if not file_bytes:
            raise AudioProcessingError("The submitted audio file is empty (0 bytes).")

        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise AudioProcessingError(
                f"File size exceeds maximum allowed limit of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB."
            )

        # Inspect binary magic signatures without trusting the file extension blindly
        if len(file_bytes) >= 4:
            is_riff = file_bytes.startswith(b"RIFF")
            is_ogg = file_bytes.startswith(b"OggS")
            is_mp3 = file_bytes.startswith(b"ID3") or file_bytes[:2] in (b"\xff\xfb", b"\xff\xfa", b"\xff\xf3")
            is_flac = file_bytes.startswith(b"fLaC")
            is_ebml = file_bytes.startswith(b"\x1a\x45\xdf\xa3")  # WebM container
            is_mp4 = len(file_bytes) >= 12 and file_bytes[4:8] == b"ftyp"

            if not (is_riff or is_ogg or is_mp3 or is_flac or is_ebml or is_mp4):
                # We log warning but allow soundfile attempt if headers vary
                logger.warning("Unrecognized audio magic signature for file: %s", filename)

    def load_and_preprocess_audio(self, file_bytes: bytes, filename: str) -> Tuple[np.ndarray, float]:
        """
        Decodes audio into 16kHz mono float32 NumPy array and returns (samples, duration_seconds).
        Cleans up any temporary file created.
        """
        import io
        import soundfile as sf

        self.validate_audio_file(file_bytes, filename)

        # Try in-memory decoding with soundfile first
        temp_path = None
        try:
            try:
                audio_data, original_sr = sf.read(io.BytesIO(file_bytes), dtype="float32")
            except Exception:
                # If in-memory stream fails, write to temporary file with safe extension
                suffix = os.path.splitext(filename)[1] or ".tmp"
                with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                    tmp.write(file_bytes)
                    temp_path = tmp.name

                audio_data, original_sr = sf.read(temp_path, dtype="float32")

            # Convert multi-channel (stereo) to mono
            if audio_data.ndim > 1:
                audio_data = audio_data.mean(axis=1)

            # Resample to 16,000 Hz if needed
            target_sr = 16000
            if original_sr != target_sr:
                num_target_samples = int(len(audio_data) * target_sr / original_sr)
                audio_data = signal.resample(audio_data, num_target_samples)

            audio_data = audio_data.astype(np.float32)
            duration_seconds = round(float(len(audio_data)) / target_sr, 2)

            if len(audio_data) == 0:
                raise AudioProcessingError("Audio contains 0 playable samples.")

            return audio_data, duration_seconds

        except Exception as err:
            logger.error("Audio decoding failed for %s: %s", filename, err)
            raise AudioProcessingError(f"Could not decode audio: {err}") from err

        finally:
            if temp_path and os.path.exists(temp_path):
                try:
                    os.unlink(temp_path)
                except Exception as cleanup_err:
                    logger.warning("Failed to delete temp file %s: %s", temp_path, cleanup_err)

    def _sync_transcribe(self, audio_data: np.ndarray) -> str:
        """
        Synchronous inference call to the Hugging Face Whisper pipeline.
        Must be executed in a worker thread to avoid blocking the async event loop.
        """
        if self._pipeline is None:
            raise ModelNotReadyError("Transcription model pipeline is not initialized.")

        try:
            input_dict = {"raw": audio_data, "sampling_rate": 16000}
            
            # Execute pipeline with 16kHz mono audio input
            result = self._pipeline(input_dict)

            if isinstance(result, dict):
                recognized_text = result.get("text", "")
            elif isinstance(result, list) and len(result) > 0:
                recognized_text = result[0].get("text", "")
            else:
                recognized_text = str(result)

            return recognized_text.strip()

        except Exception as e:
            logger.error("Inference execution exception: %s", e, exc_info=True)
            raise TranscriptionError(f"Speech recognition inference error: {e}") from e

    async def transcribe_audio_file(
        self, file_bytes: bytes, filename: str
    ) -> Dict[str, Any]:
        """
        Asynchronous entry point for audio transcription.
        Decodes audio, offloads synchronous inference to a worker thread,
        and returns recognition metadata.
        """
        if not self.is_ready:
            if self.is_loading:
                raise ModelNotReadyError(
                    "Model vasista22/whisper-tamil-small is currently downloading/initializing. Please try again in a few moments."
                )
            if self.load_error:
                raise ModelNotReadyError(
                    f"Model initialization failed: {self.load_error}"
                )
            # Try initializing now
            initialized = await asyncio.to_thread(self.initialize_model)
            if not initialized:
                raise ModelNotReadyError(
                    f"Model could not be initialized: {self.load_error}"
                )

        # 1. Decode & preprocess audio
        audio_data, duration_seconds = await asyncio.to_thread(
            self.load_and_preprocess_audio, file_bytes, filename
        )

        # 2. Run model inference in thread pool
        start_time = time.time()
        recognized_text = await asyncio.to_thread(self._sync_transcribe, audio_data)
        inference_time = round(time.time() - start_time, 2)

        return {
            "success": True,
            "text": recognized_text,
            "duration_seconds": duration_seconds,
            "inference_time_seconds": inference_time,
            "language": "ta",
            "model": self.model_name,
            "device": self._device,
        }
