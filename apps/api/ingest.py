import os
import uuid
import asyncio
from datetime import datetime
from services.db import get_supabase_client, get_embedding

def seed_database():
    client = get_supabase_client()
    if not client:
        print("No Supabase client, aborting.")
        return

    # Clear old data (optional, but good for testing)
    # Using raw SQL via RPC or just deleting
    
    print("Adding sources...")
    source1_id = str(uuid.uuid4())
    client.table("sources").insert({
        "id": source1_id,
        "canonical_url": "https://example.org/annual-report-2025",
        "title": "Annual Report 2025",
        "publisher": "Company X",
        "source_type": "primary_document"
    }).execute()

    source2_id = str(uuid.uuid4())
    client.table("sources").insert({
        "id": source2_id,
        "canonical_url": "https://news.example.com/company-x-sustainability",
        "title": "Company X Sustainability Review",
        "publisher": "News Example",
        "source_type": "news"
    }).execute()

    source3_id = str(uuid.uuid4())
    client.table("sources").insert({
        "id": source3_id,
        "canonical_url": "https://example.org/energy-policy",
        "title": "Energy Policy 2024",
        "publisher": "Company X",
        "source_type": "policy"
    }).execute()

    print("Adding evidence passages and calculating embeddings...")
    passages = [
        (source1_id, "Electricity consumption declined by 40% across the 100 stores surveyed in 2025."),
        (source2_id, "Despite claims, our independent review found electricity consumption only dropped by 8% in 2025."),
        (source3_id, "Company X has prioritized reducing its electricity consumption footprint.")
    ]

    for src_id, text in passages:
        print(f"Embedding: {text[:30]}...")
        emb = get_embedding(text)
        client.table("evidence").insert({
            "id": str(uuid.uuid4()),
            "source_id": src_id,
            "passage": text,
            "embedding": emb
        }).execute()
        
    print("Database seeding complete!")

if __name__ == "__main__":
    seed_database()
