"""
Story Metadata Service (Phase 5)
================================
AI-powered metadata generation for reviewed Tamil oral-history transcripts.
Extracts:
1. Meaningful story title in Tamil
2. Concise Tamil summary
3. Relevant topic keywords
4. Canonical category suggestion
5. Search & discovery tags
6. Optional English summary for bilingual indexing

All information is strictly grounded in the supplied transcript without hallucination.
Supports Gemini, OpenAI, Groq, and a documented Mock/Test mode.
"""

import os
import re
import json
import logging
import asyncio
from pathlib import Path
from typing import Dict, Any, Optional, List
import httpx
from dotenv import load_dotenv

from schemas.story_metadata import (
    StoryMetadataRequest,
    StoryMetadataResponse,
    CANONICAL_CATEGORIES,
)

# Load environment configuration from backend/.env if available
_backend_env = Path(__file__).resolve().parent.parent / ".env"
if _backend_env.exists():
    load_dotenv(dotenv_path=_backend_env, override=False)
else:
    load_dotenv(override=False)

logger = logging.getLogger("ninaivosai.metadata")
logging.basicConfig(level=logging.INFO)


class MetadataServiceError(Exception):
    """Base exception for story metadata service."""
    pass


class LLMNotConfiguredError(MetadataServiceError):
    """Raised when no LLM API key or provider is configured and test mode is disabled."""
    pass


class LLMTimeoutError(MetadataServiceError):
    """Raised when the LLM provider call exceeds the configured timeout."""
    pass


class LLMProviderError(MetadataServiceError):
    """Raised when the LLM provider returns an HTTP error or unreachable status."""
    pass


class LLMMalformedResponseError(MetadataServiceError):
    """Raised when the LLM returns invalid JSON or schema-noncompliant structure."""
    pass


class TranscriptValidationError(MetadataServiceError):
    """Raised when the input transcript fails length or content validation."""
    pass


SYSTEM_PROMPT = """You are an expert Tamil oral history preservation archivist and cultural ethnographer.
You will be provided with a human-reviewed Tamil transcript spoken by an elder, artisan, farmer, or community member.

Your task is to analyze the transcript and generate structured metadata for digital preservation.

CRITICAL ARCHIVAL INTEGRITY RULES:
1. Base all generated information STRICTLY AND EXCLUSIVELY on what is stated in the transcript.
2. DO NOT hallucinate, fabricate, or assume historical dates, names of people, locations, or cultural claims not explicitly supported by the transcript.
3. If specific details (e.g., exact year or village) are not mentioned, summarize what IS mentioned without guessing.
4. Output MUST be valid JSON adhering strictly to the schema provided.

Output JSON Schema:
{
  "title": "A respectful, culturally evocative, and accurate title in Tamil script (5-10 words)",
  "summary": "A concise, faithful 2-4 sentence summary in Tamil script summarizing the spoken oral history",
  "keywords": ["3 to 6 cultural, agricultural, or thematic Tamil keywords directly mentioned or central to the text"],
  "category": "Exactly one canonical category from: Agriculture, Traditional Medicine & Practices, Folk Songs & Storytelling, Festivals & Rituals, Traditional Crafts, Food Traditions, Water Conservation, Local History, Other",
  "tags": ["4 to 8 search tags in Tamil and English relevant for discovery"],
  "english_summary": "If requested, a faithful 2-3 sentence English summary for bilingual archival discovery. If not requested, null"
}
"""


class StoryMetadataService:
    """
    Singleton service managing LLM integration, prompt execution, and metadata validation.
    """
    _instance: Optional["StoryMetadataService"] = None

    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "gemini").strip().lower()
        self.api_key = (
            os.getenv("LLM_API_KEY")
            or os.getenv("GEMINI_API_KEY")
            or os.getenv("GOOGLE_API_KEY")
            or os.getenv("OPENAI_API_KEY")
            or os.getenv("GROQ_API_KEY")
            or ""
        ).strip()
        
        # Configure model defaults based on provider
        default_model = "gemini-3.1-flash-lite"
        if self.provider == "openai":
            default_model = "gpt-4o-mini"
        elif self.provider == "groq":
            default_model = "llama-3.3-70b-versatile"
        elif self.provider == "mock":
            default_model = "deterministic-mock-fixture"

        configured_model = os.getenv("LLM_MODEL", default_model).strip()
        # Fallback for deprecated Gemini models in v1beta
        if self.provider == "gemini" and configured_model in ("gemini-1.5-flash", "gemini-2.5-flash"):
            logger.info("Configured Gemini model '%s' is deprecated/sunset; using 'gemini-3.1-flash-lite'", configured_model)
            self.model = "gemini-3.1-flash-lite"
        else:
            self.model = configured_model

        self.base_url = os.getenv("LLM_BASE_URL", "").strip()
        self.timeout_seconds = float(os.getenv("LLM_TIMEOUT_SECONDS", "30.0"))
        
        # Explicit test mode flag
        test_mode_env = os.getenv("LLM_TEST_MODE", "").strip().lower()
        self.test_mode = test_mode_env in ("true", "1", "yes") or self.provider == "mock"

        logger.info(
            f"Initialized StoryMetadataService (provider={self.provider}, "
            f"model={self.model}, has_api_key={bool(self.api_key)}, test_mode={self.test_mode})"
        )

    @classmethod
    def get_instance(cls) -> "StoryMetadataService":
        if cls._instance is None:
            cls._instance = StoryMetadataService()
        return cls._instance

    @classmethod
    def reset_instance(cls) -> None:
        """Utility to reset instance during testing."""
        cls._instance = None

    def get_status(self) -> Dict[str, Any]:
        """
        Returns the operational status of the metadata service.
        """
        is_configured = bool(self.api_key) or self.test_mode
        message = (
            "Story metadata AI service is configured and ready."
            if is_configured
            else "LLM provider is not configured. Missing API key in environment (set LLM_API_KEY in backend/.env)."
        )
        if self.test_mode:
            message = "Story metadata service is running in documented TEST/MOCK mode."

        return {
            "configured": is_configured,
            "provider": self.provider,
            "model": self.model,
            "test_mode": self.test_mode,
            "has_api_key": bool(self.api_key),
            "supported_providers": ["gemini", "openai", "groq", "mock"],
            "message": message,
        }

    async def generate_metadata(self, request: StoryMetadataRequest) -> StoryMetadataResponse:
        """
        Main entry point: Generates structured metadata for a reviewed Tamil transcript.
        Validates input, invokes configured LLM, and enforces schema integrity.
        """
        # 1. Validation check
        transcript = request.transcript.strip()
        if not transcript:
            raise TranscriptValidationError("Transcript cannot be empty.")

        # 2. Check configuration
        if not self.api_key and not self.test_mode:
            raise LLMNotConfiguredError(
                f"LLM Provider '{self.provider}' is not configured. "
                "Please configure LLM_API_KEY in backend/.env, or enable test mode via LLM_TEST_MODE=true."
            )

        # 3. If in test fixture mode, return mock output
        if self.test_mode or self.provider == "mock":
            logger.info("[StoryMetadataService] Generating metadata using documented mock fixture engine.")
            return self._generate_mock_metadata(transcript, request.include_english_summary)

        # 4. Execute LLM call based on provider
        raw_llm_json_str = await self._call_provider(transcript, request.include_english_summary)

        # 5. Parse, sanitize, and validate JSON output
        parsed_data = self._parse_and_validate_json(raw_llm_json_str, request.include_english_summary)

        return StoryMetadataResponse(
            title=parsed_data["title"],
            summary=parsed_data["summary"],
            keywords=parsed_data["keywords"],
            category=parsed_data["category"],
            tags=parsed_data["tags"],
            english_summary=parsed_data.get("english_summary"),
            is_mock=False,
            provider=self.provider,
            model=self.model,
        )

    async def _call_provider(self, transcript: str, include_english_summary: bool) -> str:
        """
        Routes the metadata prompt to the active LLM provider.
        """
        if self.provider == "gemini":
            return await self._call_gemini(transcript, include_english_summary)
        elif self.provider in ("openai", "groq"):
            return await self._call_openai_compatible(transcript, include_english_summary)
        else:
            raise LLMProviderError(f"Unsupported LLM provider: '{self.provider}'. Supported: gemini, openai, groq, mock")

    async def _call_gemini(self, transcript: str, include_english_summary: bool) -> str:
        """
        Direct REST integration with Google Gemini API (no proprietary heavy SDK needed).
        Includes retry with backoff for transient 503 high-demand errors.
        """
        user_content = (
            f"Tamil Oral History Transcript:\n\"\"\"\n{transcript}\n\"\"\"\n\n"
            f"Generate structured metadata JSON in Tamil.\n"
            f"Include English summary: {'true' if include_english_summary else 'false'}."
        )

        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{SYSTEM_PROMPT}\n\n{user_content}"}],
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json",
            },
        }

        # Candidate models to try in case of sunset/404 or transient 503 errors
        models_to_try = [self.model]
        if "gemini-3.1-flash-lite" not in models_to_try:
            models_to_try.append("gemini-3.1-flash-lite")
        if "gemini-3.1-flash-lite-preview" not in models_to_try:
            models_to_try.append("gemini-3.1-flash-lite-preview")

        last_error_msg = ""
        last_status_code = 0

        for current_model in models_to_try:
            url = (
                f"https://generativelanguage.googleapis.com/v1beta/models/{current_model}:generateContent"
                f"?key={self.api_key}"
            )
            # Try up to 2 attempts per candidate model
            for attempt in range(1, 3):
                try:
                    async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                        response = await client.post(url, json=payload)

                    last_status_code = response.status_code
                    if response.status_code == 200:
                        res_json = response.json()
                        candidates = res_json.get("candidates", [])
                        if not candidates:
                            raise LLMMalformedResponseError("Gemini returned empty candidate list.")

                        content_parts = candidates[0].get("content", {}).get("parts", [])
                        if not content_parts or "text" not in content_parts[0]:
                            raise LLMMalformedResponseError("Gemini response missing text parts.")

                        return content_parts[0]["text"]

                    elif response.status_code == 503:
                        last_error_msg = f"Gemini model {current_model} is experiencing high demand (HTTP 503)."
                        logger.warning("Gemini API HTTP 503 (attempt %d/2) for model %s. Retrying...", attempt, current_model)
                        await asyncio.sleep(1.0)
                        continue
                    elif response.status_code == 404:
                        last_error_msg = f"Model '{current_model}' not found on Gemini API (HTTP 404)."
                        logger.warning("Gemini model %s returned 404. Trying fallback model...", current_model)
                        break
                    else:
                        error_msg = f"Gemini API returned HTTP {response.status_code}: {response.text[:300]}"
                        logger.error(error_msg)
                        raise LLMProviderError(f"Gemini API call failed with status {response.status_code}")

                except httpx.TimeoutException as te:
                    logger.error(f"Gemini API timed out after {self.timeout_seconds}s: {te}")
                    raise LLMTimeoutError(f"Gemini API request timed out after {self.timeout_seconds} seconds.")
                except httpx.RequestError as re:
                    logger.error(f"Network error connecting to Gemini API: {re}")
                    raise LLMProviderError(f"Network failure connecting to Gemini API: {str(re)}")

        if last_status_code == 503:
            raise LLMProviderError("Google Gemini API is currently experiencing temporary high demand (HTTP 503). Please retry in a few moments.")
        raise LLMProviderError(f"Gemini API call failed with status {last_status_code}: {last_error_msg}")

    async def _call_openai_compatible(self, transcript: str, include_english_summary: bool) -> str:
        """
        Calls OpenAI or Groq chat completions endpoint with json_object mode.
        """
        if self.provider == "groq":
            default_endpoint = "https://api.groq.com/openai/v1/chat/completions"
        else:
            default_endpoint = "https://api.openai.com/v1/chat/completions"

        endpoint = self.base_url or default_endpoint

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        user_content = (
            f"Tamil Oral History Transcript:\n\"\"\"\n{transcript}\n\"\"\"\n\n"
            f"Please generate structured metadata adhering to the archival JSON schema.\n"
            f"Include English summary: {'true' if include_english_summary else 'false'}."
        )

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
                response = await client.post(endpoint, json=payload, headers=headers)

            if response.status_code != 200:
                logger.error(f"{self.provider} API HTTP {response.status_code}: {response.text[:300]}")
                raise LLMProviderError(f"{self.provider.capitalize()} API call failed with status {response.status_code}")

            res_json = response.json()
            choices = res_json.get("choices", [])
            if not choices:
                raise LLMMalformedResponseError(f"{self.provider} returned empty choices array.")

            message = choices[0].get("message", {})
            content = message.get("content", "")
            if not content:
                raise LLMMalformedResponseError(f"{self.provider} returned empty message content.")

            return content

        except httpx.TimeoutException as te:
            logger.error(f"{self.provider} API timed out: {te}")
            raise LLMTimeoutError(f"{self.provider.capitalize()} API request timed out after {self.timeout_seconds} seconds.")
        except httpx.RequestError as re:
            logger.error(f"Network error connecting to {self.provider} API: {re}")
            raise LLMProviderError(f"Network failure connecting to {self.provider} API: {str(re)}")

    def _parse_and_validate_json(self, raw_str: str, include_english_summary: bool) -> Dict[str, Any]:
        """
        Sanitizes JSON string from LLM, strips code blocks, and validates required fields.
        """
        cleaned = raw_str.strip()
        # Remove markdown code fences if LLM included them
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)
            cleaned = cleaned.strip()

        try:
            data = json.loads(cleaned)
        except json.JSONDecodeError as jde:
            logger.error(f"Failed to parse LLM JSON output: {jde}. Raw text: {raw_str[:300]}")
            raise LLMMalformedResponseError(f"LLM produced invalid JSON: {jde.msg}")

        if not isinstance(data, dict):
            raise LLMMalformedResponseError("LLM response root is not a JSON object.")

        # Validate title
        title = str(data.get("title", "")).strip()
        if not title:
            raise LLMMalformedResponseError("LLM output is missing required 'title' field.")

        # Validate summary
        summary = str(data.get("summary", "")).strip()
        if not summary:
            raise LLMMalformedResponseError("LLM output is missing required 'summary' field.")

        # Validate keywords
        raw_keywords = data.get("keywords", [])
        if isinstance(raw_keywords, list):
            keywords = [str(k).strip() for k in raw_keywords if str(k).strip()]
        elif isinstance(raw_keywords, str):
            keywords = [k.strip() for k in raw_keywords.split(",") if k.strip()]
        else:
            keywords = []

        # Validate category
        raw_category = str(data.get("category", "")).strip()
        category = self._normalize_category(raw_category)

        # Validate tags
        raw_tags = data.get("tags", [])
        if isinstance(raw_tags, list):
            tags = [str(t).strip() for t in raw_tags if str(t).strip()]
        elif isinstance(raw_tags, str):
            tags = [t.strip() for t in raw_tags.split(",") if t.strip()]
        else:
            tags = []

        # English summary handling
        english_summary = None
        if include_english_summary and data.get("english_summary"):
            english_summary = str(data["english_summary"]).strip()

        return {
            "title": title,
            "summary": summary,
            "keywords": keywords,
            "category": category,
            "tags": tags,
            "english_summary": english_summary,
        }

    def _normalize_category(self, raw_category: str) -> str:
        """
        Normalizes category string to one of the canonical oral history categories.
        """
        if not raw_category:
            return "Other"

        # Direct match check
        for cat in CANONICAL_CATEGORIES:
            if cat.lower() == raw_category.lower():
                return cat

        # Keyword heuristics for Tamil & English category variants
        lower = raw_category.lower()
        if any(w in lower for w in ["agri", "farm", "crop", "விவசாய", "உழவு", "நெல்", "விதை"]):
            return "Agriculture"
        if any(w in lower for w in ["med", "herb", "மருத்துவ", "சித்த", "மூலிகை"]):
            return "Traditional Medicine & Practices"
        if any(w in lower for w in ["song", "story", "folk", "நாட்டுப்புற", "பாட்டு", "கதை"]):
            return "Folk Songs & Storytelling"
        if any(w in lower for w in ["festival", "ritual", "temple", "திருவிழா", "வழிபாடு", "கோவில்"]):
            return "Festivals & Rituals"
        if any(w in lower for w in ["craft", "weave", "pot", "கைவினை", "நெசவு", "மண்பாண்ட"]):
            return "Traditional Crafts"
        if any(w in lower for w in ["food", "recipe", "உணவு", "சமையல்", "தானியம்"]):
            return "Food Traditions"
        if any(w in lower for w in ["water", "tank", "lake", "canal", "நீர்", "ஏரி", "குளம்", "கண்மாய்"]):
            return "Water Conservation"
        if any(w in lower for w in ["history", "village", "town", "வரலாறு", "தொன்மம்", "ஊர்"]):
            return "Local History"

        return "Other"

    def _generate_mock_metadata(self, transcript: str, include_english_summary: bool) -> StoryMetadataResponse:
        """
        Documented test fixture generator for testing without an active LLM API key.
        Analyzes the transcript keywords deterministically to produce realistic Tamil metadata.
        Explicitly marked with is_mock=True.
        """
        lower_t = transcript.lower()

        # Score matching keywords for each domain
        scores = {
            "Traditional Medicine & Practices": sum(
                1 for w in ["மருத்துவ", "மூலிகை", "சித்த", "கசாயம்", "நோய்", "ஆடாதோடை", "தூதுவளை", "துளசி", "சளி"] if w in lower_t
            ),
            "Folk Songs & Storytelling": sum(
                1 for w in ["பாட்டு", "பாடல்", "நாடோடி", "வில்லுப்பாட்டு", "நாட்டுப்புற", "ஏலேலோ", "ஐலசா", "கதை"] if w in lower_t
            ),
            "Water Conservation": sum(
                1 for w in ["ஏரி", "கண்மாய்", "மடை", "குடிமராமத்து", "வரத்துக் கால்வாய்", "தண்ணீர்", "மழைநீர்", "குளம்"] if w in lower_t
            ),
            "Agriculture": sum(
                1 for w in ["விவசாய", "நெல்", "உழவு", "விதை", "பயிர்", "காவிரி", "நாற்று", "சாம்பல்", "பஞ்சகவ்யம்", "பசுந்தாள்", "உரம்", "வயல்"] if w in lower_t
            ),
            "Festivals & Rituals": sum(
                1 for w in ["திருவிழா", "வழிபாடு", "கோவில்", "சாமி", "பூஜை", "தேரோட்டம்"] if w in lower_t
            ),
            "Traditional Crafts": sum(
                1 for w in ["கைவினை", "நெசவு", "மண்பாண்டம்", "சிற்பம்", "கொல்லர்", "தச்சர்"] if w in lower_t
            ),
            "Food Traditions": sum(
                1 for w in ["உணவு", "சமையல்", "தானியம்", "களி", "கூழ்", "பலகாரம்"] if w in lower_t
            ),
        }

        # Select highest-scoring domain
        best_category = max(scores, key=scores.get)
        highest_score = scores[best_category]

        if highest_score == 0:
            best_category = "Local History"

        if best_category == "Traditional Medicine & Practices":
            title = "கிராமத்து பாரம்பரிய சித்த மருத்துவ மூலிகைப் பயன்பாடு"
            summary = (
                "இப்பதிவில் எளிய கிராமிய நோய்களுக்கு வீட்டருகே கிடைக்கும் மூலிகைகள், கசாயங்கள் மற்றும் தலைமுறை தலைமுறையாக "
                "கற்றுவந்த சித்த மருத்துவ முறைகள் குறித்த அரிய தகவல்கள் விவரிக்கப்பட்டுள்ளன."
            )
            keywords = ["சித்த மருத்துவம்", "நாட்டு மூலிகைகள்", "பாரம்பரிய சிகிச்சை", "மூலிகை கசாயம்"]
            category = "Traditional Medicine & Practices"
            tags = ["நாட்டு மருத்துவம்", "சித்த மருத்துவம்", "மூலிகைகள்", "siddha medicine", "herbal remedies"]
            english_summary = (
                "An oral testimony regarding indigenous Tamil Siddha medicine, home herbal remedies, "
                "and healing wisdom passed across generations."
            )

        elif best_category == "Folk Songs & Storytelling":
            title = "வாய்மொழி நாட்டுப்புறப் பாடல்கள் மற்றும் கிராமியக் கதை மரபு"
            summary = (
                "கிராமப்புற மக்களின் வாழ்வியலோடு கலந்த நாட்டுப்புற பாடல்கள், உழைப்பின் போது பாடும் ஏற்றப்பாட்டு மற்றும் "
                "தொன்மக் கதைகளின் வாய்மொழிப் பதிவு இதுவாகும்."
            )
            keywords = ["நாட்டுப்புறப் பாடல்", "ஏற்றப்பாட்டு", "வாய்மொழிக் கதை", "கிராமிய இசை"]
            category = "Folk Songs & Storytelling"
            tags = ["நாட்டுப்புற கலை", "நாட்டுப்புற பாடல்கள்", "வாய்மொழி வரலாறு", "folk songs", "oral narratives"]
            english_summary = (
                "Oral preservation of traditional Tamil folk songs and community storytelling recounting rural life and cultural expressions."
            )

        elif best_category == "Water Conservation":
            title = "பாரம்பரிய நீர் மேலாண்மை மற்றும் ஏரி கண்மாய் பராமரிப்பு"
            summary = (
                "பழங்கால தமிழர்களின் ஏரி, கண்மாய் பராமரிப்பு முறை, குடவோலை பாசன விநியோகம் மற்றும் மழைநீரை சேமித்து வறட்சியை "
                "எதிர்கொண்ட சமூக நீர் மேலாண்மை மரபு பகிரப்பட்டுள்ளது."
            )
            keywords = ["கண்மாய் பாசனம்", "ஏரி பராமரிப்பு", "நீர் மேலாண்மை", "மழைநீர் சேமிப்பு"]
            category = "Water Conservation"
            tags = ["நீர் மேலாண்மை", "ஏரிகள்", "கண்மாய்", "water management", "traditional irrigation"]
            english_summary = (
                "Oral history documentation of traditional Tamil community water conservation, lake maintenance, and equitable canal irrigation."
            )

        elif best_category == "Agriculture":
            title = "பாரம்பரிய உழவு முறை மற்றும் விதை பாதுகாப்பு அனுபவங்கள்"
            summary = (
                "இத்தமிழ்ச் சமூக வாய்மொழி வரலாற்றில், பாரம்பரிய இயற்கை உழவு முறை, பாரம்பரிய நெல் ரகங்களை பாதுகாத்தல் "
                "மற்றும் பருவ காலங்களை கணித்து பயிரிடும் தொன்றுதொட்ட உழவு நுணுக்கங்கள் விரிவாக பகிரப்பட்டுள்ளன."
            )
            keywords = ["பாரம்பரிய நெல்", "இயற்கை உழவு", "விதை சேமிப்பு", "காவிரி பாசனம்"]
            category = "Agriculture"
            tags = ["விதை சேமிப்பு", "இயற்கை விவசாயம்", "நெல் ரகங்கள்", "உழவு மரபு", "organic farming"]
            english_summary = (
                "An oral history recording detailing ancestral agricultural wisdom, indigenous seed preservation, "
                "and traditional cultivation practices in Tamil Nadu."
            )

        else:
            title = "தமிழ் கிராமிய வாழ்வியல் மற்றும் பண்பாட்டு வாய்மொழி வரலாறு"
            summary = (
                "இப்பதிவில் கடந்த தலைமுறையினரின் கிராமிய வாழ்க்கை முறை, சமூக வழக்கங்கள், விழாக்கள் மற்றும் "
                "முன்னோர்களின் பண்பாட்டு நினைவுகள் வாய்மொழியாக ஆவணப்படுத்தப்பட்டுள்ளன."
            )
            keywords = ["வாய்மொழி வரலாறு", "கிராமிய வாழ்வியல்", "பண்பாட்டு மரபு"]
            category = "Local History"
            tags = ["வாய்மொழி வரலாறு", "தமிழர் பண்பாடு", "ஊர் நினைவுகள்", "cultural heritage", "local history"]
            english_summary = (
                "A community oral history documenting rural Tamil traditions, socio-cultural practices, and memories."
            )

        return StoryMetadataResponse(
            title=title,
            summary=summary,
            keywords=keywords,
            category=category,
            tags=tags,
            english_summary=english_summary if include_english_summary else None,
            is_mock=True,
            provider="mock",
            model="deterministic-mock-fixture",
        )
