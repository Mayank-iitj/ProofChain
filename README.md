# PROOFCHAIN

**Evidence before belief.**

PROOFCHAIN is an evidence-intelligence platform that transforms factual claims into auditable evidence graphs.

## Documentation

- [PRD](PRD.md) — product vision, personas, features, requirements, metrics, MVP scope
- [TRD](TRD.md) — technical architecture, algorithms, data model, APIs, security, testing
- [Design](Design.md) — UX/UI system, screens, interaction states, accessibility
- [Architecture](Architecture.md) — system architecture, sequences, components, deployment
- [Winning Demo & Submission](WINNING_DEMO_AND_SUBMISSION.md) — judging strategy, demo script, pitch deck, checklist

## Core pipeline

```text
Claim
 ↓
Claim decomposition
 ↓
Query planning
 ↓
Hybrid retrieval
 ↓
Evidence extraction
 ↓
Relation classification
 ↓
Source-quality scoring
 ↓
Confidence calibration
 ↓
Evidence graph
 ↓
Coverage + uncertainty
```

## Proposed stack

Next.js + TypeScript + FastAPI + Gemini + embeddings + Supabase PostgreSQL/pgvector + search/scholarly adapters + React Flow.

## Important product constraint

PROOFCHAIN does not claim to produce an absolute “truth score.” It reports how strongly retrieved evidence supports, partially supports, contradicts, or fails to address each atomic claim.
# ProofChain
