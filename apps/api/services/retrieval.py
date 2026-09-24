from typing import List
import uuid
import datetime
from schemas import AtomicClaim, EvidenceSource, EvidenceItem
from services.db import get_supabase_client, get_embedding

try:
    from duckduckgo_search import DDGS
except ImportError:
    DDGS = None

def retrieve_evidence(atomic_claims: List[AtomicClaim]) -> List[EvidenceItem]:
    client = get_supabase_client()
    results = []
    
    for ac in atomic_claims:
        text_to_search = ac.text
        if ac.search_queries and len(ac.search_queries) > 0:
            text_to_search = ac.search_queries[0]
            
        # 1. Search Internal Supabase DB (if available)
        if client:
            emb = get_embedding(text_to_search)
            try:
                response = client.rpc('match_evidence', {
                    'query_embedding': emb,
                    'match_threshold': 0.3,
                    'match_count': 3
                }).execute()
                
                matches = response.data
                for match in matches:
                    source_resp = client.table("sources").select("*").eq("id", match["source_id"]).execute()
                    if source_resp.data:
                        source_data = source_resp.data[0]
                        results.append(
                            EvidenceItem(
                                id=str(uuid.uuid4()),
                                source=EvidenceSource(
                                    canonical_url=source_data.get("canonical_url", ""),
                                    title=source_data.get("title", ""),
                                    publisher=source_data.get("publisher", "Internal Database"),
                                    published_at=source_data.get("published_at"),
                                    source_type=source_data.get("source_type", "database"),
                                    quality_score=0.9
                                ),
                                passage=match["passage"],
                                relation="UNKNOWN",
                                confidence=0.0,
                                rationale=""
                            )
                        )
            except Exception as e:
                print(f"Error querying Supabase: {e}")

        # 2. Real-Time Web Search (DuckDuckGo) to support ANY claim
        if DDGS:
            try:
                with DDGS(timeout=5) as ddgs:
                    # Fetch top 2 results from the web
                    web_results = list(ddgs.text(text_to_search, max_results=2))
                    for web_res in web_results:
                        results.append(
                            EvidenceItem(
                                id=str(uuid.uuid4()),
                                source=EvidenceSource(
                                    canonical_url=web_res.get("href", ""),
                                    title=web_res.get("title", ""),
                                    publisher=web_res.get("href", "").split("/")[2] if "href" in web_res else "Web",
                                    published_at=datetime.datetime.now().isoformat(),
                                    source_type="web",
                                    quality_score=0.75 # Slightly lower confidence than internal vetted DB
                                ),
                                passage=web_res.get("body", ""),
                                relation="UNKNOWN",
                                confidence=0.0,
                                rationale=""
                            )
                        )
            except Exception as e:
                print(f"Error querying DDGS: {e}")

    return results
