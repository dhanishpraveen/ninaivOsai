"""
Standalone CLI Demo Data Seeder for Supabase (Phase 6)
======================================================
Idempotently seeds 10 realistic Tamil oral-history demo stories into the connected
Supabase database table 'public.stories'.

Usage:
    python seed_demo_data.py
"""

import os
import sys
import asyncio
from dotenv import load_dotenv

current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

load_dotenv()

from services.supabase_service import SupabaseService
from demo_data import DEMO_STORIES


async def main():
    print("==================================================================")
    print("TAMIL HERITAGE (நினைவோசை) - SUPABASE DEMO DATA SEEDER")
    print("==================================================================")
    service = SupabaseService.get_instance()
    status_info = service.get_status()

    print(f"Project Reference : {status_info.get('project_ref')}")
    print(f"Supabase URL      : {status_info.get('supabase_url')}")
    print(f"Configured        : {status_info.get('configured')}")
    print(f"Total Demo Stories: {len(DEMO_STORIES)}")
    print("------------------------------------------------------------------")

    result = await service.seed_demo_data()

    print("Result Status     :", result.get("status"))
    print("Message           :", result.get("message"))
    if "seeded_count" in result:
        print(f"Newly Seeded      : {result['seeded_count']}")
        print(f"Already Existing  : {result.get('already_existing_count', 0)}")
    print("==================================================================")


if __name__ == "__main__":
    asyncio.run(main())
