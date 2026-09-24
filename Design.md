# PROOFCHAIN — Product & UX Design Specification

**Version:** 1.0
**Design direction:** Evidence-first / research-grade / modern analytical UI
**Primary goal:** Make complex evidence relationships understandable in under 10 seconds.

---

## 1. Design North Star

PROOFCHAIN should feel like a combination of:

- a premium research workspace;
- an analytical dashboard;
- an evidence map;
- a citation inspector.

It should **not** look like:

- a generic chatbot;
- a fact-checking blog;
- a dashboard overloaded with gauges;
- a sci-fi “AI magic” interface.

### Core visual idea

> **The evidence is the product. The AI is the orchestration layer.**

---

## 2. Information Hierarchy

The UI must make these five questions immediately visible:

1. **What is the claim?**
2. **What parts of the claim were identified?**
3. **What evidence supports or contradicts each part?**
4. **Where is the uncertainty?**
5. **Can I inspect the original source?**

---

## 3. Navigation

```text
PROOFCHAIN
│
├── Verify
├── Projects
├── Evidence Library
├── Reports
└── Settings
```

Hackathon MVP may expose only:

```text
Verify | History
```

Keep the rest behind a “Coming soon” state or omit it entirely.

---

## 4. Landing Page

### Hero

```text
PROOFCHAIN
Evidence before belief.

Turn any factual claim into an auditable evidence graph.

[ Verify a claim ]
```

Subtext:

> Decompose claims. Find evidence. Detect contradiction. Trace every conclusion.

### Hero interaction

A single large input:

```text
┌─────────────────────────────────────────────────────┐
│ Paste a claim, paragraph, URL, or report…           │
│                                                     │
│                                           [Verify]  │
└─────────────────────────────────────────────────────┘
```

Below:

```text
Try an example → “X reduced electricity consumption by 40%.”
```

---

## 5. Verification Workspace

### Desktop layout

```text
┌────────────────────────────────────────────────────────────────┐
│ PROOFCHAIN        New Verification          Share   Export     │
├───────────────────────┬────────────────────────────────────────┤
│                       │                                        │
│ CLAIMS                │            EVIDENCE GRAPH              │
│                       │                                        │
│ ● Atomic claim 1      │       ┌───────────────┐                │
│ ✓ Supported           │       │   CLAIM       │                │
│                       │       └───────┬───────┘                │
│ ● Atomic claim 2      │               │                        │
│ ◐ Partial             │        ┌──────┴──────┐                 │
│                       │        ↓             ↓                  │
│ ● Atomic claim 3      │     Source A      Source B              │
│ ! Contradicted        │     SUPPORTS      CONTRADICTS           │
│                       │                                        │
│ ● Atomic claim 4      │                                        │
│ ? Unverified          │                                        │
│                       │                                        │
├───────────────────────┴────────────────────────────────────────┤
│ Evidence Coverage 72%      2 Supported  1 Partial  1 Conflict │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. Visual Language

### Status colors

Use color only as a secondary signal. Every status must also have an icon and text label.

```text
SUPPORTS              ✓
PARTIAL               ◐
CONTRADICTS           !
INSUFFICIENT          ?
MENTIONS_ONLY         •
```

Recommended palette direction:

- near-black / charcoal base;
- white/soft-gray surfaces;
- restrained indigo accent;
- green for support;
- amber for partial;
- red for contradiction;
- gray for insufficient.

Do not make the entire screen green/red. Evidence analysis should feel calm and professional.

---

## 7. Typography

Recommended:

- Inter / Geist for UI.
- IBM Plex Mono / JetBrains Mono for numeric IDs, scores, metadata.

Hierarchy:

```text
Display:     48–64px
Page title:  32px
Section:     20–24px
Body:        14–16px
Metadata:    12–13px
```

Use sentence case rather than excessive uppercase labels.

---

## 8. Claim Card

Example:

```text
┌──────────────────────────────────────────┐
│ Claim 01                          ✓       │
│                                          │
│ “X reduced electricity usage by 40% in  │
│ 2025 across 100 stores.”                │
│                                          │
│ Coverage                  91%            │
│ Evidence                 3 sources       │
│                                          │
│ [Inspect evidence]                       │
└──────────────────────────────────────────┘
```

The claim card should display:

- relation status;
- coverage;
- evidence count;
- important missing dimensions;
- expand/collapse control.

---

## 9. Evidence Drawer

When a user clicks “Inspect evidence”:

```text
┌───────────────────────────────────────────┐
│ Evidence for Claim 01                ×   │
├───────────────────────────────────────────┤
│ SOURCE                                    │
│ Company Annual Report                     │
│ annual-report.example                     │
│ Published: 2025-04-15                     │
│                                           │
│ RELATION                                  │
│ ✓ SUPPORTS                    93%          │
│                                           │
│ EVIDENCE PASSAGE                          │
│ ┌───────────────────────────────────────┐ │
│ │ “Electricity consumption declined     │ │
│ │ by 40% across the…”                   │ │
│ └───────────────────────────────────────┘ │
│                                           │
│ WHY                                       │
│ Supports quantity + timeframe.            │
│                                           │
│ Evidence quality                          │
│ Authority             █████████  92       │
│ Directness            █████████  95       │
│ Specificity           ████████   87       │
│                                           │
│ [Open source]                             │
└───────────────────────────────────────────┘
```

---

## 10. Evidence Graph

### Node types

**Claim**
- larger node;
- primary interaction target.

**Evidence**
- passage snippet;
- relation badge.

**Source**
- domain + title;
- optional favicon.

### Edge semantics

```text
solid green      supports
solid amber      partial
solid red        contradiction
dashed gray      mention / weak link
```

### Interaction

- Hover edge → relationship + confidence.
- Click evidence → opens evidence drawer.
- Click source → metadata + source link.
- Drag nodes.
- Fit graph.
- Filter by relationship.

### Mobile fallback

Do not attempt a tiny unreadable graph.

Instead show:

```text
Claim
 ↓
Evidence cards
 ↓
Source cards
```

with a “Graph view” toggle.

---

## 11. Coverage Visualization

Avoid a giant “truth meter.”

Use an evidence coverage ring or compact bar:

```text
Evidence coverage
██████████████░░░░ 72%
```

Under it:

```text
2 supported · 1 partial · 1 contradicted · 2 unresolved
```

Tooltip:

> Coverage indicates how much of the claim is addressed by retrieved evidence. It is not a probability that the statement is true.

---

## 12. Search Activity View

This is a key “technical wow” moment.

Display:

```text
RESEARCH TRACE

✓ Decomposed into 4 atomic claims
✓ Generated 13 query variants
✓ Retrieved 37 candidate sources
✓ Deduplicated to 24 sources
✓ Extracted 19 evidence passages
✓ Compared 19 claim/evidence pairs
✓ Detected 2 contradictory relationships
✓ Built evidence graph
```

This communicates engineering effort without exposing chain-of-thought.

Do not expose hidden model reasoning. Show only safe, high-level process metadata and evidence-grounded rationales.

---

## 13. Sources Panel

```text
SOURCES (8)

01  Annual Report             Quality 92
02  Crossref record           Quality 88
03  University research       Quality 87
04  News report               Quality 76
05  Company blog              Quality 71
```

The source list must be sortable by:

- evidence relation;
- evidence quality;
- recency;
- domain.

---

## 14. Contradiction Mode

Click:

`2 conflicts detected`

Then open:

```text
CONFLICT #01

                    Claim
                      │
            ┌─────────┴─────────┐
            ↓                   ↓
        Source A             Source B
        Supports              Contradicts

Source A:
“40% reduction...”

Source B:
“8% reduction...”

Potential reason:
Different reporting scopes may be involved.

[Compare sources]
```

This is more powerful than an arbitrary “winner” badge.

---

## 15. Empty / Loading / Failure States

### Loading

```text
Building your evidence graph…

[✓] Understanding claim
[✓] Finding sources
[ ] Comparing evidence
[ ] Calculating coverage
```

### No evidence

> No sufficiently relevant evidence was retrieved. Try adding a timeframe, named entity, location, or metric.

### Partial provider failure

> Evidence search completed with limited source access. Some sources could not be fetched independently.

### Contradictory evidence

Do not show an error. Contradiction is a legitimate result.

---

## 16. Report Design

One-page executive view:

```text
PROOFCHAIN REPORT

Original claim

Evidence coverage: 72%

Atomic claims
1. ✓ Supported
2. ◐ Partial
3. ! Contradicted
4. ? Insufficient

Evidence map

Top evidence

Limitations

Retrieved: 23 Sep 2026 18:32 IST
```

A detailed appendix contains:

- source URLs;
- passages;
- relationship rationale;
- score components;
- model versions;
- search queries.

---

## 17. Design System Tokens

```css
--bg: #0B0D10;
--surface: #11151A;
--surface-2: #171C22;
--border: #26303A;
--text: #F3F5F7;
--muted: #9AA5B1;
--accent: #6D7CFF;
--support: #2DBE86;
--partial: #E8A94A;
--contradiction: #E56B6F;
--unknown: #82909F;
--radius-sm: 8px;
--radius-md: 14px;
--radius-lg: 20px;
```

Keep the visual system quiet; information hierarchy matters more than decoration.

---

## 18. Accessibility Requirements

- Every icon has accessible text.
- Color never communicates status alone.
- Focus ring visible.
- 44px minimum touch targets on mobile.
- Graph has an accessible list alternative.
- Reduced-motion preference supported.
- Font scaling up to 200% without content loss.

---

## 19. Design Acceptance Criteria

The design is ready for demo when a first-time user can:

1. paste a claim;
2. understand the system is researching rather than chatting;
3. see atomic claims;
4. identify support/partial/contradiction/unresolved states;
5. click an evidence relationship;
6. read the exact evidence passage;
7. open the source;
8. understand what coverage means;
9. export the report;
10. do all of the above without reading documentation.

---

## 20. Demo-First Interaction Principle

The first 60 seconds should demonstrate:

```text
CLAIM
 ↓
DECOMPOSE
 ↓
SEARCH
 ↓
DISCOVER CONFLICT
 ↓
EVIDENCE GRAPH
 ↓
SOURCE PASSAGE
```

Avoid beginning with an onboarding tour or a long marketing page.

