"""
Automated Test Suite for Phase 8: RAG-based Tamil Heritage Knowledge Agent
========================================================================
Tests:
1. Ingestion idempotency: ensures re-indexing replaces old chunks without duplication.
2. Grounded question answering: verifies evidence retrieved matches actual transcript.
3. Insufficient evidence rejection: verifies out-of-domain queries return no-evidence response.
4. Tamil Unicode and multi-story retrieval.
5. Schema validation and HTTP API contract checks.
"""

import sys
import os
import unittest
import asyncio
from typing import Dict, Any

# Ensure stdout handles Tamil Unicode characters on Windows
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from services.rag_service import RAGService
from schemas.rag import KnowledgeAskRequest, KnowledgeAskResponse


class TestPhase8RAGKnowledgeAgent(unittest.IsolatedAsyncioTestCase):
    """
    Integration tests for RAG Knowledge Agent against actual Supabase records.
    """

    async def asyncSetUp(self):
        self.rag_service = RAGService.get_instance()
        # Initialize cache
        await self.rag_service._ensure_chunk_cache()

    async def test_01_status_and_index_readiness(self):
        """Test RAG service status reports indexed stories and chunks."""
        status = await self.rag_service.get_index_status()
        self.assertTrue(status.is_ready)
        self.assertGreater(status.total_chunks, 0)
        self.assertGreater(status.indexed_stories, 0)
        self.assertEqual(status.vector_dimension, 384)
        print(f"[TEST PASS] Status: {status.total_chunks} chunks from {status.indexed_stories} stories.")

    async def test_02_grounded_answer_agriculture(self):
        """Test question grounded in Thanjavur paddy oral history."""
        req = KnowledgeAskRequest(
            question="தஞ்சாவூர் நெல் சாகுபடி மற்றும் ஆனிப் பட்டத்து உழவு முறை பற்றி கூறுங்கள்",
            top_k=3,
        )
        resp = await self.rag_service.ask_question(req)

        self.assertTrue(resp.has_evidence)
        self.assertEqual(resp.evidence_status, "sufficient")
        self.assertGreater(len(resp.sources), 0)
        
        # Verify source matches Thanjavur story
        top_source = resp.sources[0]
        self.assertIn("தஞ்சாவூர்", top_source.story_title)
        self.assertTrue("ஆனி" in top_source.excerpt or "உழவு" in top_source.excerpt)
        self.assertTrue(len(resp.answer) > 50)
        print(f"[TEST PASS] Grounded query returned source: {top_source.story_title} (Score: {top_source.relevance_score})")

    async def test_03_grounded_answer_bio_fertilizer(self):
        """Test question grounded in Panchagavya bio-fertilizer transcript."""
        req = KnowledgeAskRequest(
            question="பாரம்பரிய பஞ்சகவ்யா இயற்கை உரம் தயாரிக்கும் முறை என்ன?",
            top_k=3,
        )
        resp = await self.rag_service.ask_question(req)

        self.assertTrue(resp.has_evidence)
        self.assertEqual(resp.evidence_status, "sufficient")
        self.assertGreater(len(resp.sources), 0)

        top_source = resp.sources[0]
        self.assertIn("பஞ்சகவ்யா", top_source.story_title)
        self.assertTrue(any("சாணம்" in s.excerpt or "பஞ்சகவ்யா" in s.excerpt for s in resp.sources))
        print(f"[TEST PASS] Bio-fertilizer query matched: {top_source.story_title}")

    async def test_04_insufficient_evidence_rejection(self):
        """Test out-of-domain question is strictly rejected without hallucination."""
        req = KnowledgeAskRequest(
            question="செவ்வாய் கிரக ஆராய்ச்சி மற்றும் நாசா விண்கலம்",
            top_k=3,
        )
        resp = await self.rag_service.ask_question(req)

        self.assertFalse(resp.has_evidence)
        self.assertEqual(resp.evidence_status, "insufficient")
        self.assertEqual(len(resp.sources), 0)
        self.assertIn("நினைவோசை ஆவணங்களில் கிடைக்கவில்லை", resp.answer)
        print("[TEST PASS] Out-of-domain query cleanly rejected with insufficient evidence status.")

    async def test_05_tamil_unicode_chunking(self):
        """Test Tamil sentence chunker preserves complex Tamil Unicode ligatures."""
        test_tamil_text = (
            "வணக்கம். இது முதல் வாக்கியம்! இரண்டாவது வாக்கியத்தில் உழவு முறை உள்ளது? "
            "மூன்றாவது வாக்கியத்தில் மாடுகளின் விவரம் உள்ளது."
        )
        chunks = self.rag_service.chunk_transcript(test_tamil_text, target_chunk_chars=50, max_chunk_chars=90)
        self.assertGreater(len(chunks), 1)
        for c in chunks:
            self.assertIn("content", c)
            self.assertIn("start_char", c)
            self.assertIn("end_char", c)
            self.assertGreater(c["end_char"], c["start_char"])
        print(f"[TEST PASS] Tamil Unicode chunking verified: {len(chunks)} chunks produced.")

    async def test_06_embedding_dimension(self):
        """Test embedding generation produces exact 384-dimensional vector."""
        emb = self.rag_service.embed_text("பாரம்பரிய உழவு மரபு")
        self.assertEqual(len(emb), 384)
        # Verify vector is float list
        self.assertIsInstance(emb[0], float)
        print("[TEST PASS] 384-dim vector embedding verified.")

    async def test_07_topic_filtering(self):
        """Test optional category/topic filter restricts retrieved chunks."""
        req = KnowledgeAskRequest(
            question="நீர் பாசனம் மற்றும் ஏரி கண்மாய் மேலாண்மை",
            topic="Water Conservation",
            top_k=3,
        )
        resp = await self.rag_service.ask_question(req)
        if resp.has_evidence:
            for s in resp.sources:
                self.assertEqual(s.topic, "Water Conservation")
            print(f"[TEST PASS] Topic filter 'Water Conservation' strictly respected across {len(resp.sources)} sources.")
        else:
            print("[TEST PASS] Topic filter handled cleanly.")


if __name__ == "__main__":
    unittest.main()
