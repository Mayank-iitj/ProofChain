import os
import json
from schemas import AtomicClaim, EvidenceSource, EvidenceItem, RelationClassification
from openai import OpenAI

def evaluate_relationship(claim: AtomicClaim, passage: str) -> RelationClassification:
    # Use real OpenAI if key exists, else mock
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        # Mock logic for the MVP demo
        if "only dropped by 8%" in passage:
            return RelationClassification(
                relation="CONTRADICTS",
                confidence=0.88,
                covered_aspects=[],
                unsupported_aspects=["quantity"],
                contradicted_aspects=["quantity"],
                rationale="Passage states an 8% drop, contradicting the 40% claim."
            )
        else:
            return RelationClassification(
                relation="SUPPORTS",
                confidence=0.93,
                covered_aspects=["quantity", "timeframe"],
                unsupported_aspects=[],
                contradicted_aspects=[],
                rationale="Passage directly confirms the 40% reduction and timeframe."
            )
            
    client = OpenAI(api_key=api_key)
    
    prompt = f"""
    Rule 1: use only supplied evidence.
    Rule 2: do not invent facts.
    Rule 3: preserve quantities and units.
    Rule 4: preserve scope and timeframe.
    Rule 5: if evidence does not answer the claim, say INSUFFICIENT.
    Rule 6: if evidence conflicts, identify the conflict explicitly.
    Rule 7: return schema-valid JSON.

    <CLAIM>
    {claim.text}
    </CLAIM>

    <EVIDENCE>
    {passage}
    </EVIDENCE>

    Classify the relationship as SUPPORTS, PARTIALLY_SUPPORTS, CONTRADICTS, MENTIONS_ONLY, or INSUFFICIENT.
    """
    
    try:
        try:
            response = client.chat.completions.create(
                model="gpt-5-nano",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
        except Exception:
            # Fallback if gpt-5-nano is not available on this API key
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
        data = json.loads(response.choices[0].message.content)
        return RelationClassification(
            relation=data.get("relation", "INSUFFICIENT"),
            confidence=data.get("confidence", 0.7),
            covered_aspects=data.get("covered_aspects", []),
            unsupported_aspects=data.get("unsupported_aspects", []),
            contradicted_aspects=data.get("contradicted_aspects", []),
            rationale=data.get("rationale", "AI Evaluation")
        )
    except Exception as e:
        print(f"Error in evaluate_relationship: {e}")
        return RelationClassification(
            relation="INSUFFICIENT",
            confidence=0.5,
            covered_aspects=[],
            unsupported_aspects=[],
            contradicted_aspects=[],
            rationale="Error parsing evaluation."
        )

def calculate_quality_score(source_metadata: dict) -> float:
    # Heuristic based on TRD
    # Authority (0.25), Primary-source (0.20), Directness (0.20), Specificity (0.15), Recency (0.10), Corroboration (0.10)
    score = 0.5 # Base score
    source_type = source_metadata.get("source_type", "")
    
    if source_type == "primary_document":
        score += 0.3
    elif source_type == "academic":
        score += 0.25
    elif source_type == "news":
        score += 0.15
        
    return min(1.0, score)
