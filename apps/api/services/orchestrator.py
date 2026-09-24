from typing import List, Dict
import uuid
from schemas import (
    VerificationReport, 
    ClaimDetail, 
    EvidenceGraph, 
    GraphNode, 
    GraphEdge
)
from services.decomposer import decompose_claim
from services.retrieval import retrieve_evidence
from services.evaluator import evaluate_relationship

def run_verification(claim_text: str, verification_id: str) -> VerificationReport:
    decomposition = decompose_claim(claim_text)
    
    nodes = []
    edges = []
    claims_details = []
    
    # Add root claim node
    nodes.append(GraphNode(id="root", type="claim", label=claim_text[:50] + "..."))
    
    for ac in decomposition.atomic_claims:
        evidence_items = retrieve_evidence([ac])
        
        # Add atomic claim node
        nodes.append(GraphNode(id=ac.id, type="claim", label=ac.text))
        edges.append(GraphEdge(source="root", target=ac.id, type="CONTAINS"))
        
        for item in evidence_items:
            # Evaluate relationship dynamically
            evaluation = evaluate_relationship(ac, item.passage)
            item.relation = evaluation.relation
            item.confidence = evaluation.confidence
            item.rationale = evaluation.rationale
            
            # Add evidence and source nodes
            if not any(n.id == item.id for n in nodes):
                nodes.append(GraphNode(id=item.id, type="evidence", label=item.passage[:30] + "..."))
                
            source_id = f"src_{hash(item.source.canonical_url)}"
            if not any(n.id == source_id for n in nodes):
                nodes.append(GraphNode(id=source_id, type="source", label=item.source.title))
                
            edges.append(GraphEdge(source=ac.id, target=item.id, type=f"{item.relation}_BY", confidence=item.confidence))
            edges.append(GraphEdge(source=item.id, target=source_id, type="DERIVED_FROM"))
            
        claims_details.append(
            ClaimDetail(
                claim=ac,
                evidence=evidence_items,
                coverage_score=0.0
            )
        )
        
    total_weight = len(decomposition.atomic_claims)
    coverage_sum = 0.0
    
    for cd in claims_details:
        if not cd.evidence:
            continue
        
        # Use the highest scoring relation for this claim
        relations = [e.relation for e in cd.evidence]
        if 'SUPPORTS' in relations:
            coverage_sum += 1.0
            cd.coverage_score = 1.0
        elif 'PARTIALLY_SUPPORTS' in relations:
            coverage_sum += 0.6
            cd.coverage_score = 0.6
        elif 'MENTIONS_ONLY' in relations:
            coverage_sum += 0.1
            cd.coverage_score = 0.1
        else:
            cd.coverage_score = 0.0
            
    final_coverage = coverage_sum / total_weight if total_weight > 0 else 0.0
    
    graph = EvidenceGraph(nodes=nodes, edges=edges)
    
    return VerificationReport(
        verification_id=verification_id,
        original_claim=claim_text,
        coverage_score=final_coverage,
        status="completed",
        claims=claims_details,
        graph=graph
    )
