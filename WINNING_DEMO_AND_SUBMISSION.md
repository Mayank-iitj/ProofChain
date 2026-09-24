# PROOFCHAIN — Winning Demo, Evaluation & Submission Playbook

## 1. Objective

The project should be judged as a **new evidence-intelligence system**, not an AI chatbot.

The demo must prove four things:

```text
1. We understand a real problem.
2. We built a technically meaningful pipeline.
3. The output is auditable.
4. The product can become a real platform.
```

The hackathon scoring weights Innovation & Originality 25%, Technical Implementation 25%, Real-World Impact 20%, Feasibility & Scalability 15%, UX & Design 10%, and Presentation & Demonstration 5%.

---

## 2. The Demo Story

### Opening

Start with:

> “An LLM can answer a question. A search engine can find pages. But neither automatically tells you which exact piece of evidence supports each exact part of a claim.”

Then show:

```text
CLAIM
“X reduced electricity consumption by 40% across
100 stores in 2025.”
```

Click **Verify**.

---

## 3. 90-Second Demo Sequence

### 0–10 sec — Claim

Paste a compound claim.

### 10–20 sec — Decomposition

Show:

```text
4 atomic claims detected
```

Click one:

```text
40% reduction
100 stores
2025
Electricity consumption
```

### 20–40 sec — Research trace

Show animated progress:

```text
13 queries
37 candidates
24 unique sources
19 evidence passages
```

### 40–60 sec — Evidence graph

Show:

```text
CLAIM
 ├── Source A ✓ SUPPORTS
 ├── Source B ◐ PARTIAL
 └── Source C ! CONTRADICTS
```

### 60–75 sec — Evidence passage

Open Source A and show the exact passage.

### 75–90 sec — Coverage

Show:

```text
Evidence Coverage: 72%

2 Supported
1 Partial
1 Contradicted
2 Unresolved
```

Say:

> “The important output isn't a green badge. It's the evidence graph that explains why the badge exists—and where the evidence disagrees.”

---

## 4. Technical Wow Moments

### Wow Moment 1 — Compound claim decomposition

This visibly proves the system understands factual structure.

### Wow Moment 2 — Contradiction detection

Open a conflict instead of hiding it.

### Wow Moment 3 — Exact evidence passage

Jump from graph edge → source passage.

### Wow Moment 4 — Evidence gap

Show what is missing:

```text
The retrieved sources address the reduction percentage,
but none independently establish the “100 stores” scope.
```

### Wow Moment 5 — Process transparency

Show:

```text
Claim → Queries → Sources → Evidence → Relations → Graph
```

Do not expose hidden chain-of-thought. Show safe process metadata and concise evidence-grounded rationales.

---

## 5. Evaluation Mapping

| Criterion | Weight | What to demonstrate |
|---|---:|---|
| Innovation & Originality | 25% | Claim-to-evidence graph + explicit disagreement + coverage |
| Technical Implementation | 25% | Decomposition, hybrid retrieval, embeddings, reranking, NLI/LLM, graph model, calibration |
| Real-World Impact | 20% | Research, journalism, education, analytics, evidence literacy |
| Feasibility & Scalability | 15% | API-driven modular pipeline, managed Postgres/vector stack, provider adapters |
| UX & Design | 10% | Evidence-first workspace, graph, source drawer, accessible states |
| Presentation & Demonstration | 5% | 90-second end-to-end scenario |

The table maps the product directly to the official evaluation categories.

---

## 6. Metrics to Put on the Dashboard

Do not invent performance values.

Before submission, run the benchmark and display actual measurements such as:

```text
Atomic claim extraction F1     XX%
Evidence Recall@10             XX%
Relation classification F1     XX%
Citation correctness            XX%
Calibration ECE                 XX%
Median verification time        XXs
```

Most persuasive metric:

> **Citation correctness / traceability**

Because it measures the product's core promise.

---

## 7. Judges' Likely Questions

### “Why can't I just use ChatGPT/Gemini?”

Answer:

> “A normal LLM returns an answer. PROOFCHAIN builds an auditable intermediate representation of the claim, retrieves evidence independently, classifies the relationship between each claim and each passage, scores evidence quality separately, and preserves provenance in a graph.”

### “How do you handle hallucinations?”

Answer:

> “The model cannot create a source. A citation must map to a retrieved source object and evidence passage in our database. Generation happens after retrieval and classification, not before.”

### “How do you know a source is trustworthy?”

Answer:

> “We do not equate source quality with truth. We model authority, primary-source status, directness, specificity, temporal relevance, and corroboration as separate evidence-quality signals.”

### “What if sources disagree?”

Answer:

> “Contradiction is a first-class result. We preserve both edges, compare scope and timeframe, and surface mixed evidence instead of forcing an arbitrary winner.”

### “Isn't the 72% score subjective?”

Answer:

> “Coverage is a transparent aggregation over atomic claims, not a probability of truth. We show its components and keep confidence and evidence quality separate.”

### “How will you scale this?”

Answer:

> “The MVP uses one FastAPI service and Postgres/pgvector. At scale, retrieval, embeddings, classification, and report generation can become independent workers behind a queue, while source adapters and content hashes reduce duplicate work.”

### “What makes this technically difficult?”

Answer:

> “The hard part isn't producing text. It's maintaining correct relationships between claims, evidence, sources, scope, quantities, and uncertainty across multiple retrieval systems.”

---

## 8. Recommended Pitch Deck

### Slide 1 — PROOFCHAIN

**Evidence before belief.**

Visual: claim exploding into a graph.

### Slide 2 — The Problem

```text
Claim → search results → confusion
```

Users still have to manually connect evidence to the claim.

### Slide 3 — The Insight

> Truth checking is not a single answer problem. It is a claim–evidence relationship problem.

### Slide 4 — Product

Show the verification workspace.

### Slide 5 — How It Works

```text
Decompose → Retrieve → Compare → Score → Graph
```

### Slide 6 — Technical Architecture

One architecture diagram only.

### Slide 7 — Live Evidence Graph

Use a real demo screenshot.

### Slide 8 — Contradiction Example

Show two sources disagreeing and how the system preserves both.

### Slide 9 — Impact & Scale

```text
Students
Researchers
Journalists
Analysts
Organizations
```

### Slide 10 — Future

PROOFCHAIN API + browser extension + continuous claim monitoring.

### Slide 11 — Closing

> “Don't trust the answer. Trace the evidence.”

---

## 9. Demo Data Requirements

Prepare the data before the final presentation.

### Dataset A: strong support

A compound quantitative claim where the primary document contains the exact numeric statement.

### Dataset B: disagreement

Two credible sources with materially different values or conclusions and different/unclear scope.

### Dataset C: evidence gap

A plausible claim for which retrieval finds adjacent but non-probative material.

Keep a local fallback copy of the source metadata and snippets required for the demo, while still showing live retrieval when available.

---

## 10. Live-Demo Resilience

The demo should have two modes.

### Live Mode

Use real retrieval and AI.

### Demo-Safe Mode

A precomputed verification run can instantly render the same graph if an API or source becomes unavailable.

The fallback must be clearly labeled as a demo dataset/run; never pretend cached evidence is freshly retrieved.

---

## 11. Submission Checklist

Before submitting:

### Product

- working web demo;
- polished claim verification flow;
- graph interaction;
- source passage drawer;
- report export.

### Engineering

- public/private repository as required;
- README with architecture;
- `.env.example`;
- setup instructions;
- database migrations;
- evaluation script;
- tests;
- API documentation.

### Documentation

- PRD;
- TRD;
- Design.md;
- Architecture.md;
- responsible-AI/security notes;
- known limitations.

### Presentation

- pitch deck;
- short demo video;
- one main demo scenario;
- backup demo dataset;
- actual benchmark metrics.

The hackathon brief lists a working prototype/product, project description, source code/repository, project documentation, demonstration video, presentation/pitch deck, technology stack, and demo/deployment link as possible final submission materials.

---

## 12. Final Engineering Quality Bar

The project should feel credible because:

```text
No fake citations
No mystery scores
No “AI says true” button
No invented source URLs
No unsupported claims presented as facts
No black-box final verdict
```

Instead:

```text
Claim
 ↓
Evidence
 ↓
Relationship
 ↓
Source
 ↓
Quality
 ↓
Coverage
 ↓
Uncertainty
```

That is the product.

