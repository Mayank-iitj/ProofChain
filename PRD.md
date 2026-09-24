# PROOFCHAIN — Product Requirements Document (PRD)

**Version:** 1.0
**Date:** 23 September 2026
**Status:** Hackathon MVP specification
**Product:** PROOFCHAIN
**Tagline:** *Turn claims into evidence graphs.*

---

## 1. Executive Summary

PROOFCHAIN is an evidence-intelligence platform that evaluates whether an explicit claim is supported by accessible evidence. It does not behave like a conventional chatbot that returns a single “true/false” answer. Instead, it decomposes a user statement into atomic claims, retrieves candidate evidence, evaluates support/contradiction/partial-support relationships, scores source quality, and renders a transparent evidence graph.

The product's central design principle is:

> **No claim status without linked evidence.**

Every conclusion in the interface must be traceable to one or more source passages, with source metadata, retrieval timestamp, relationship type, and confidence.

### Hackathon fit

The competition's evaluation weights are Innovation & Originality 25%, Technical Implementation 25%, Real-World Impact 20%, Feasibility & Scalability 15%, User Experience & Design 10%, and Presentation & Demonstration 5%. PROOFCHAIN is intentionally designed around those criteria: the novelty is the evidence-graph workflow; the technical depth comes from claim decomposition, hybrid retrieval, NLI/semantic reasoning, source-quality scoring, graph construction, and calibrated confidence; the impact is improved evidence literacy and traceability. The hackathon also requests problem, solution, innovation, technical implementation, demonstration, impact, scalability, and future scope in the final presentation.

---

## 2. Problem Statement

The modern information environment creates a recurring failure mode:

1. A user encounters a factual-looking statement.
2. The statement contains multiple hidden sub-claims.
3. Search engines return pages, but do not clearly map evidence to each sub-claim.
4. LLMs can summarize information fluently while obscuring which source supports which sentence.
5. Sources can agree, partially support, contradict, or simply fail to address a claim.
6. Users therefore need to manually reconstruct an evidence trail.

### Current gap

Most tools answer:

> “What is the answer?”

PROOFCHAIN answers:

> “What exactly is being claimed, what evidence addresses each part, what does that evidence say, how strong is the source, and where does uncertainty remain?”

---

## 3. Product Vision

Build an **evidence operating layer for claims** that can be used by students, researchers, analysts, journalists, educators, product teams, and everyday internet users.

### Long-term vision

Every important factual claim becomes a structured object:

```text
Claim
 ├── Atomic Claim A
 │    ├── Evidence 1 → SUPPORTS
 │    └── Evidence 2 → PARTIAL
 ├── Atomic Claim B
 │    └── Evidence 3 → CONTRADICTS
 └── Atomic Claim C
      └── No adequate evidence
```

The user can inspect the graph, source passages, and scoring rationale instead of trusting a black-box answer.

---

## 4. Target Users

### Primary users

**Researchers / students**
- Verify statements in papers, reports, articles, and presentations.
- Find supporting and contradictory literature quickly.

**Analysts / knowledge workers**
- Check executive claims, market statements, technical assertions, and reports.

**Journalists / fact-checkers**
- Create auditable evidence trails before publishing.

**General users**
- Investigate claims encountered online without needing advanced research skills.

### Secondary users

- Educators teaching evidence literacy.
- Organizations creating evidence-backed reports.
- Research teams building claim/evidence datasets.

---

## 5. Jobs To Be Done

> When I encounter a factual claim, help me understand exactly what is being claimed and show me the strongest evidence for and against it.

> When a statement contains several facts, separate them so I can see which parts are supported and which are not.

> When different sources disagree, show the disagreement rather than hiding it inside one generated answer.

> When I cite a source, let me inspect the exact passage that supports the claim.

---

## 6. Product Principles

1. **Evidence before generation.**
2. **Atomic claims before verdicts.**
3. **Source-linked reasoning.**
4. **Uncertainty is a first-class output.**
5. **Source quality is not the same as truth.**
6. **The system must never invent citations.**
7. **Every generated statement in the result must be traceable.**
8. **Human-readable explanations; machine-readable provenance.**
9. **Graceful degradation if a source cannot be fetched.**
10. **No single LLM judgment is sufficient for high-impact claims.**

---

## 7. Core User Flow

```text
Landing page
    ↓
Enter claim / paste article / upload text or PDF
    ↓
Claim decomposition
    ↓
Search plan generated
    ↓
Evidence retrieval
    ↓
Source normalization
    ↓
Relevance filtering
    ↓
Support / contradiction analysis
    ↓
Source-quality analysis
    ↓
Evidence graph construction
    ↓
Coverage + confidence calculation
    ↓
Interactive result
    ↓
User opens sources and evidence passages
```

---

## 8. MVP Feature Set

### P0 — Must have

#### F1. Claim Intake
- Single claim text input.
- Multi-sentence text input.
- Optional URL ingestion.
- Optional PDF/text upload.
- Character/token limits with clear feedback.

#### F2. Claim Decomposition
Convert a compound statement into atomic claims.

Example:

> “Company X reduced electricity use by 40% across 100 stores in 2025.”

Becomes:

- Company X reduced electricity consumption.
- The reduction was 40%.
- The scope was 100 stores.
- The timeframe was 2025.

Each atomic claim receives structured fields:

```json
{
  "claim_id": "c_001",
  "text": "The reduction was 40%.",
  "entities": ["Company X"],
  "metric": "electricity consumption",
  "quantity": 40,
  "unit": "percent",
  "timeframe": "2025",
  "scope": "100 stores"
}
```

#### F3. Hybrid Evidence Retrieval
Retrieve candidate evidence using:

- keyword search;
- semantic embeddings;
- source-specific queries;
- optional Google Search grounding;
- scholarly metadata sources such as Crossref / Semantic Scholar where applicable.

#### F4. Evidence Extraction
For every candidate source:

- title;
- URL;
- publisher/domain;
- publication/update date if available;
- author if available;
- source type;
- exact relevant passage;
- retrieval timestamp.

#### F5. Relationship Classification
For each claim-evidence pair, classify:

- `SUPPORTS`
- `PARTIALLY_SUPPORTS`
- `CONTRADICTS`
- `MENTIONS_ONLY`
- `INSUFFICIENT`

#### F6. Source Quality Scoring
Score evidence-source quality independently from claim relationship.

Illustrative factors:

```text
Authority                 0–25
Directness                0–25
Specificity               0–15
Recency relevance         0–10
Primary-source status     0–15
Corroboration              0–10
                         -----
Total                    0–100
```

This is an evidence-quality heuristic, not a statement that a source is factually correct.

#### F7. Evidence Graph
Interactive graph showing:

```text
CLAIM → EVIDENCE → SOURCE
   │        │
   │        └── SUPPORTS / CONTRADICTS / PARTIAL
   └──────────── COVERAGE / CONFIDENCE
```

#### F8. Evidence Coverage
Calculate how much of the compound statement is actually addressed by evidence.

Example:

```text
Evidence Coverage: 72%

Supported:            2
Partially supported:  1
Contradicted:         1
Unverified:           2
```

#### F9. Claim Detail Drawer
Clicking a claim opens:

- claim text;
- extracted entities/quantities;
- relationship distribution;
- top evidence;
- exact source passage;
- why relationship was classified;
- source-quality factors;
- uncertainty notes.

#### F10. Shareable Report
Generate a report containing:

- original claim;
- atomic claim list;
- evidence graph snapshot;
- source table;
- relationship labels;
- coverage score;
- limitations;
- retrieval timestamp.

---

## 9. P1 Features — Strong Differentiators

### F11. Contradiction Radar
Identify explicit disagreement patterns:

```text
Source A → SUPPORTS
Source B → CONTRADICTS
Source C → PARTIAL
```

### F12. Evidence Gap Detector
Ask:

> “What would I need to know to establish this claim more strongly?”

Examples:

- Missing timeframe.
- No primary source.
- No denominator.
- Study sample size absent.
- Correlation/causation ambiguity.
- Source discusses a different population.

### F13. Citation Trace
Each generated summary sentence maps to evidence IDs.

### F14. Source Comparison
Side-by-side comparison of conflicting sources.

### F15. Search Strategy View
Show the search queries generated for each atomic claim.

This makes the system auditable and gives judges a visible technical artifact.

---

## 10. P2 / Future Features

- Browser extension.
- Team workspaces.
- Organization source policies.
- Claim monitoring over time.
- Research literature mode.
- Document-to-claim batch processing.
- Multilingual evidence extraction.
- Knowledge graph export.
- API / SDK.
- Evidence dataset export.
- Human-review workflows.

---

## 11. Functional Requirements

### FR-01 — Intake
The system shall accept a factual claim as text.

### FR-02 — Decomposition
The system shall split compound text into atomic claims and preserve parent-child relationships.

### FR-03 — Retrieval
The system shall retrieve multiple candidate sources per atomic claim.

### FR-04 — Evidence passage
The system shall store the precise source excerpt used for classification.

### FR-05 — Relationship classification
The system shall assign one relationship to each claim-evidence pair and store a confidence value.

### FR-06 — Quality scoring
The system shall compute source/evidence quality independently of relationship classification.

### FR-07 — Coverage
The system shall compute an aggregate evidence coverage score over atomic claims.

### FR-08 — Graph
The system shall represent claims, evidence, and sources as a graph.

### FR-09 — Provenance
Every result shall have retrieval time and source URL metadata.

### FR-10 — Explainability
Every classification shall expose a short evidence-grounded rationale.

### FR-11 — No fabricated source
A source citation must correspond to an actually retrieved source object.

### FR-12 — Export
The user shall be able to export/share a structured verification report.

---

## 12. Non-Functional Requirements

### Performance
- First meaningful UI feedback: <2 s where possible.
- Target verification completion for a normal claim: 10–30 s.
- Progressive results instead of blocking the entire UI.

### Reliability
- Retry transient source/API errors.
- Continue verification when one source provider fails.
- Mark unavailable evidence explicitly.

### Security
- Treat retrieved web content as untrusted data.
- Prevent prompt injection from webpages/documents.
- Sanitize rendered HTML.
- Never execute downloaded content.
- Protect user-uploaded documents.

### Privacy
- Minimize retention of uploaded documents.
- Allow deletion of projects and evidence.
- Do not expose private uploads through public URLs.

### Accessibility
- Keyboard navigable.
- High contrast.
- Semantic labels.
- Screen-reader friendly graph alternative.

---

## 13. Success Metrics

### Product metrics
- Claim verification completion rate.
- Median verification latency.
- Evidence clicks per verified claim.
- Percentage of results with at least one traceable evidence passage.
- User-rated usefulness.

### Technical metrics
- Claim decomposition precision/recall on benchmark set.
- Evidence retrieval Recall@K.
- Pairwise relationship F1.
- Calibration error / Brier score.
- Citation correctness rate.
- Unsupported-generation rate.

### Hackathon demo metrics
A compelling benchmark dashboard should show:

```text
Atomic claim extraction      94%
Evidence Recall@10           91%
Relationship F1              88%
Citation traceability        100%
Unsupported answer rate       0%
```

These values must be measured on the project's own evaluation set before presentation; they are target thresholds, not pre-existing results.

---

## 14. Competitive Positioning

### Typical chatbot
```text
Question → LLM → Answer
```

### Typical search
```text
Question → Search → Pages
```

### PROOFCHAIN
```text
Claim
 ↓
Atomic claims
 ↓
Search plan
 ↓
Hybrid retrieval
 ↓
Evidence passages
 ↓
Pairwise relationships
 ↓
Source quality
 ↓
Evidence graph
 ↓
Coverage + uncertainty
```

The differentiator is **traceability and structured disagreement**, not simply generative answers.

---

## 15. Responsible Product Behavior

PROOFCHAIN must not present its score as an absolute truth score.

Preferred language:

- “Supported by the retrieved evidence.”
- “Partially supported.”
- “Evidence found that contradicts this statement.”
- “Insufficient evidence retrieved.”
- “This source has strong/weak evidence-quality signals.”

Avoid:

- “100% true.”
- “This source is definitely trustworthy.”
- “AI has proven the claim.”

For contested claims, the system should display the disagreement and underlying evidence rather than forcing consensus.

---

## 16. Hackathon MVP Scope

### Build now

```text
Claim input
→ Atomic decomposition
→ Search
→ 8–15 evidence candidates
→ Top 5 evidence passages
→ Relationship classification
→ Source-quality score
→ Evidence graph
→ Coverage score
→ Report
```

### Do not build during the hackathon

- Full browser extension.
- Organization administration.
- Complex user billing.
- Massive graph infrastructure.
- Custom foundation model.
- Large-scale crawler.

The objective is a highly polished vertical slice, not maximum feature count.

---

## 17. One-Sentence Pitch

> **PROOFCHAIN turns a claim into an auditable evidence graph—showing what is supported, what is contradicted, what is only partially supported, and exactly which sources prove each part.**

## 18. 30-Second Pitch

> The internet gives us endless information, but almost no structure for understanding whether a claim is actually supported. PROOFCHAIN breaks a claim into atomic statements, retrieves evidence from the web and scholarly sources, compares each source against each claim, detects support and contradiction, scores evidence quality, and renders the result as an interactive evidence graph. Instead of asking users to trust an AI answer, PROOFCHAIN lets them inspect the evidence behind it.

