from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime
from uuid import UUID

class Quantity(BaseModel):
    value: float
    unit: str

class AtomicClaim(BaseModel):
    id: str
    text: str
    claim_type: str
    entities: List[str]
    metric: Optional[str] = None
    quantity: Optional[Quantity] = None
    timeframe: Optional[str] = None
    population: Optional[str] = None
    scope: Optional[str] = None
    search_queries: List[str]
    confidence: float

class DecompositionResult(BaseModel):
    parent_claim: str
    atomic_claims: List[AtomicClaim]

class RelationClassification(BaseModel):
    relation: str # SUPPORTS, PARTIALLY_SUPPORTS, CONTRADICTS, MENTIONS_ONLY, INSUFFICIENT
    confidence: float
    covered_aspects: List[str]
    unsupported_aspects: List[str]
    contradicted_aspects: List[str]
    rationale: str

class EvidenceSource(BaseModel):
    canonical_url: str
    title: str
    publisher: Optional[str] = None
    published_at: Optional[str] = None
    source_type: str
    quality_score: float

class EvidenceItem(BaseModel):
    id: str
    source: EvidenceSource
    passage: str
    relation: str
    confidence: float
    rationale: str

class ClaimDetail(BaseModel):
    claim: AtomicClaim
    evidence: List[EvidenceItem]
    coverage_score: float

class GraphNode(BaseModel):
    id: str
    type: str # claim, evidence, source, entity
    label: str

class GraphEdge(BaseModel):
    source: str
    target: str
    type: str
    confidence: Optional[float] = None

class EvidenceGraph(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class VerificationReport(BaseModel):
    verification_id: str
    user_id: Optional[str] = None
    original_claim: str
    coverage_score: float
    status: str
    claims: List[ClaimDetail]
    graph: EvidenceGraph
