import os
import json
import uuid
from typing import List
from schemas import DecompositionResult, AtomicClaim, Quantity
from openai import OpenAI

def decompose_claim(claim_text: str) -> DecompositionResult:

    # Use OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not found in environment. Using fallback decomposition.")
        return DecompositionResult(
            parent_claim=claim_text,
            atomic_claims=[
                AtomicClaim(
                    id=str(uuid.uuid4()),
                    text=claim_text,
                    claim_type="unknown",
                    entities=[],
                    search_queries=[claim_text],
                    confidence=0.5
                )
            ]
        )

    client = OpenAI(api_key=api_key)

    prompt = f"""
    Decompose the following compound statement into atomic claims.
    Preserve parent-child relationships, numeric values, units, timeframe, and scope.
    
    Statement: "{claim_text}"
    
    Return a structured JSON output with the following schema:
    {{
      "parent_claim": "string",
      "atomic_claims": [
        {{
          "id": "unique-string",
          "text": "string",
          "claim_type": "string",
          "entities": ["string"],
          "search_queries": ["highly specific search engine queries to find factual proof, news, or statistics (DO NOT use single generic brand names like 'Microsoft')"],
          "confidence": 0.9
        }}
      ]
    }}
    """
    
    try:
        try:
            response = client.chat.completions.create(
                model="gpt-5-nano",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
        except Exception:
            # Fallback if gpt-5-nano is not available on this API key yet
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
        data = json.loads(response.choices[0].message.content)
        # simplistic parse, assuming OpenAI perfectly returned it
        atomic_claims = []
        # Support if the model incorrectly called it 'claims' instead of 'atomic_claims'
        claims_list = data.get("atomic_claims") or data.get("claims") or []
        for ac in claims_list:
            quantity_data = ac.get("quantity")
            qty = Quantity(**quantity_data) if quantity_data else None
            atomic_claims.append(
                AtomicClaim(
                    id=ac.get("id", str(uuid.uuid4())),
                    text=ac.get("text", ""),
                    claim_type=ac.get("claim_type", "other"),
                    entities=ac.get("entities", []),
                    metric=ac.get("metric"),
                    quantity=qty,
                    timeframe=ac.get("timeframe"),
                    population=ac.get("population"),
                    scope=ac.get("scope"),
                    search_queries=ac.get("search_queries", [ac.get("text", "")]),
                    confidence=ac.get("confidence", 0.9)
                )
            )
        
        if not atomic_claims:
            raise ValueError("Model returned empty atomic claims")
        
        return DecompositionResult(
            parent_claim=data.get("parent_claim", claim_text),
            atomic_claims=atomic_claims
        )
    except Exception as e:
        # Fallback to a single generic atomic claim if parsing fails
        print(f"Error calling OpenAI: {e}")
        return DecompositionResult(
            parent_claim=claim_text,
            atomic_claims=[
                AtomicClaim(
                    id=str(uuid.uuid4()),
                    text=claim_text,
                    claim_type="unknown",
                    entities=[],
                    search_queries=[claim_text],
                    confidence=0.5
                )
            ]
        )
