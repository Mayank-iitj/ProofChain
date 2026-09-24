import os
from supabase import create_client, Client
from openai import OpenAI

def get_supabase_client() -> Client:
    url: str = os.getenv("SUPABASE_URL", "")
    key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    if not url or not key:
        print("Supabase credentials missing, skipping DB write.")
        return None
        
    return create_client(url, key)

def get_embedding(text: str) -> list[float]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return [0.0] * 1536 # Mock embedding
        
    client = OpenAI(api_key=api_key)
    result = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    if result.data and len(result.data) > 0:
        return result.data[0].embedding
    return [0.0] * 1536

def store_evidence(evidence_data: dict):
    client = get_supabase_client()
    if not client: return
    
    # Generate embedding for the passage
    passage = evidence_data.get("passage", "")
    if passage:
        evidence_data["embedding"] = get_embedding(passage)
        
    try:
        client.table("evidence").insert(evidence_data).execute()
    except Exception as e:
        print(f"Error storing evidence: {e}")

def store_verification_run(verification_id: str, user_id: str, report_dict: dict):
    client = get_supabase_client()
    if not client: return
    
    # Strip 'vrf_' prefix for uuid if needed, or generate new UUID
    import uuid
    db_id = str(uuid.uuid4())
    
    try:
        client.table("verification_runs").insert({
            "id": db_id, # Or use verification_id if it's a UUID
            "user_id": user_id,
            "status": report_dict.get("status"),
            "coverage_score": report_dict.get("coverage_score"),
            "json_data": report_dict
        }).execute()
    except Exception as e:
        print(f"Error storing verification_run: {e}")

def get_verification_run(verification_id: str) -> dict:
    client = get_supabase_client()
    if not client: return None
    
    try:
        # Search inside json_data for the ID
        res = client.table("verification_runs").select("json_data").eq("json_data->>verification_id", verification_id).execute()
        if res.data and len(res.data) > 0:
            return res.data[0]["json_data"]
    except Exception as e:
        print(f"Error getting verification_run: {e}")
    return None

def get_user_verifications(user_id: str) -> list[dict]:
    client = get_supabase_client()
    if not client: return []
    
    try:
        res = client.table("verification_runs").select("json_data").eq("user_id", user_id).execute()
        if res.data:
            return [row["json_data"] for row in res.data]
    except Exception as e:
        print(f"Error getting user verifications: {e}")
    return []
