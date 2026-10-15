/**
 * Isolated API service for Phase 5 Story Metadata Generation.
 * Communicates with FastAPI /metadata endpoints.
 * Includes automatic failover between primary backend (port 8001) and Phase 5 adapter (port 8002).
 */

const DEFAULT_PRIMARY_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001';
const ADAPTER_FALLBACK_URL = import.meta.env.VITE_METADATA_API_URL || 'http://127.0.0.1:8002';

/**
 * Checks metadata service health/status
 */
export async function fetchMetadataServiceStatus(customUrl = null) {
  const baseUrls = customUrl ? [customUrl] : [DEFAULT_PRIMARY_URL, ADAPTER_FALLBACK_URL];

  for (const base of baseUrls) {
    try {
      const res = await fetch(`${base}/metadata/status`, {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        return { ...data, baseUrl: base };
      }
    } catch {
      // Try next base URL
    }
  }

  throw new Error('Metadata service is currently unreachable on ports 8001 and 8002.');
}

/**
 * Invokes AI Story Metadata generation for a reviewed Tamil transcript.
 * 
 * @param {Object} params
 * @param {string} params.transcript - Reviewed Tamil oral transcript
 * @param {string} [params.language='ta'] - Language code
 * @param {boolean} [params.includeEnglishSummary=true] - Bilingual summary option
 * @param {string} [params.apiBaseUrl] - Optional explicit backend URL
 * @returns {Promise<Object>} Generated metadata
 */
export async function generateStoryMetadata({
  transcript,
  language = 'ta',
  includeEnglishSummary = true,
  apiBaseUrl = null,
}) {
  if (!transcript || !transcript.trim()) {
    throw new Error('Transcript text is required to generate metadata.');
  }

  const baseUrls = apiBaseUrl ? [apiBaseUrl] : [DEFAULT_PRIMARY_URL, ADAPTER_FALLBACK_URL];
  let lastError = null;

  for (const base of baseUrls) {
    try {
      const response = await fetch(`${base}/metadata/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript.trim(),
          language,
          include_english_summary: includeEnglishSummary,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { ...data, _sourceUrl: base };
      }

      // If 404 (endpoint not mounted yet on this port), continue loop to adapter
      if (response.status === 404 && baseUrls.length > 1 && base === DEFAULT_PRIMARY_URL) {
        continue;
      }

      // Handle server error responses
      let errorDetail = `Metadata generation failed with HTTP ${response.status}`;
      let resolution = null;
      try {
        const errJson = await response.json();
        if (typeof errJson.detail === 'string') {
          errorDetail = errJson.detail;
        } else if (errJson.detail?.message) {
          errorDetail = errJson.detail.message;
          resolution = errJson.detail.resolution;
        }
      } catch {
        // Fallback
      }

      const err = new Error(errorDetail);
      err.status = response.status;
      err.resolution = resolution;
      throw err;
    } catch (err) {
      if (err.status) {
        // Explicit HTTP error from the server, don't silently swallow
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError || new Error('Could not connect to metadata generation backend.');
}
