# TIAM-112 Diagnostic

**A 142-question diagnostic that maps where you actually stand on AI's future — across 8 independent axes, matched against 41 named worldview archetypes.**

Live at **[ryudkiss-hue.github.io/tiam-diagnostic](https://ryudkiss-hue.github.io/tiam-diagnostic/)**

TIAM stands for **T**eleological, **I**ntelligence, **A**lignment, **M**oral-status — the four broad clusters of questions the axes below cut across. Instead of collapsing "what do you think about AI?" into a single left-right slider, this tool asks 142 agree/disagree questions and scores your answers across eight genuinely independent dimensions, then finds which of 41 named viewpoints your combined position sits closest to.

---

## Why this exists

Most AI-opinion typologies (and most political-compass-style tools generally) make three mistakes this project tries to avoid:

1. **They flatten a multi-dimensional space into one or two axes.** Whether you think AI poses existential risk and whether you think a chatbot can suffer are *different questions* — someone can be a safety-maximalist and a machine-consciousness skeptic at the same time. Collapsing that into "pro-AI vs. anti-AI" loses the actual shape of the disagreement.
2. **They imply every position is equally common.** A flat list of 41 labels can make a niche academic stance and a mainstream one look like peers. This tool groups all 41 archetypes into 7 **Tier-1 superclusters** so the relative scale of each camp stays legible (see [`archetypeClusters.ts`](src/data/archetypeClusters.ts)).
3. **They let question order and framing quietly bias the result.** See [Bias mitigations](#bias-mitigations-built-in) below for what this project does about it — including a standing automated test that audits the classifier itself for structural bias.

---

## What you actually do

1. **(Optional) Tag yourself.** Before starting, you can flag things like *Automation-Exposed Worker* or *AI Industry Insider* — 13 material-stakeholder tags that describe your relationship to AI without affecting your score. These never feed the algorithm; they're shown next to your result so a reader can weigh "this person's worldview" against "this person's skin in the game" separately.
2. **Answer 142 questions** — 14 per axis for teleological, the only axis still at its base count; 18 for six axes (risk, socio-economic, ontological, evolutionary, relational, geopolitical) that needed extra resolution; and 20 for legal & moral, which needed the most: first for a distinct fault line (whether a model's stated chain-of-thought reasoning is trustworthy, or whether tokenization mechanics bear on genuine understanding), then again, narrower still (whether an AI that causes harm bears any responsibility of its own, separate from the humans and companies that built and deployed it). Relational and geopolitical were the latest to expand, once a nearest-neighbor analysis of the (then-38) archetypes showed both were the single biggest differentiator among the closest, hardest-to-tell-apart archetype pairs. Every axis is split evenly between near-term (next 2–5 years) and long-term (next 20–50 years) framing, on a 1–5 agree/disagree scale. Pole labels are hidden and question order is shuffled per axis on every attempt, so you're reacting to the statement itself, not pattern-matching the axis's "team."
3. **(Optional) Eight quick scenarios.** Concrete, one-paragraph situations ("a country pauses frontier training for six months…") that don't touch your score but get compared against it — if your gut pick on a scenario contradicts your computed axis score, that gets surfaced back to you as something worth sitting with, not resolved for you.
4. **Get your result:** an 8-axis radar chart (drawn against your closest match, so you can see exactly where you diverge), your top 3 matches with an interpretable **match-closeness %**, a full written report on your top match (extended narrative, real thinkers whose public work resonates with the stance, further reading, next steps), a **Reflective Breakdown** naming the implicit assumptions your result carries, and a closing **Pinnacle Reflection** prompt.
5. **Share or export.** A results page state round-trips through a compact URL param (no backend, no accounts, nothing stored) or downloads as a formatted PDF.

---

## The 8 axes

Each axis has a **Pole A** and **Pole B** — positive scores lean toward A, negative toward B. None of the eight is a stand-in for "pro-AI" or "anti-AI"; they're deliberately close to orthogonal.

| # | Axis | Pole A | Pole B |
|---|------|--------|--------|
| 1 | **Teleological** | Cosmic Vitalism | Anthropocentric Humanism |
| 2 | **Risk Profile** | X-Risk Precautionary | Accelerationary / Stagnation-Averse |
| 3 | **Socio-Economic** | Permissionless Open-Source | Managed Technocracy & Regulation |
| 4 | **Ontological** | Silicon Functionalism | Substrate Exceptionalism |
| 5 | **Legal & Moral** | Machine Patienthood | Pure Instrumentalism & Property |
| 6 | **Evolutionary** | Post-Human Replacement | Directed Cybernetic Co-Evolution |
| 7 | **Relational** | Post-Biological Pluralism | Affective Biocentrism |
| 8 | **Geopolitical** | Techno-Nationalism | Borderless Networkism |

Each axis is scored separately for **T1 (next 2–5 years)** and **T2 (next 20–50 years)**, because plenty of real positions are asymmetric across time horizons — e.g. cautious about near-term deployment but optimistic about the long run, or the reverse.

---

## The 41 archetypes, in 7 superclusters

Rather than one flat list, every archetype belongs to exactly one of seven **Tier-1 superclusters** (see [`archetypeClusters.ts`](src/data/archetypeClusters.ts)), which keeps the relative size and shape of each camp visible instead of implying 41 equally-weighted tribes:

<details>
<summary><strong>Precautionary / Safety</strong> (11 archetypes)</summary>

Doomer · AI Safety Institutionalist · Effective Altruist Longtermist · Rationalist Alignment Researcher · Global Governance Technocrat · Near-Term AI Ethicist · Neo-Luddite Degrowth Advocate · Whistleblower/Insider Safety Advocate · Compute-Governance Specialist · EU-Style Regulatory Standard-Setter · AI Ethics/Fairness Watchdog
</details>

<details>
<summary><strong>Accelerationist / Techno-Optimist</strong> (10 archetypes)</summary>

e/acc Maximalist · Open-Source Libertarian · Cyberpunk Anti-Corporate Accelerationist · Silicon Valley Techno-Optimist · Corporate AI Pragmatist · Post-Humanist Transhumanist · Cosmic Vitalist Mystic · Human-AI Augmentation Advocate · National Champion Accelerationist · Normal-Technology Gradualist
</details>

<details>
<summary><strong>State-Power / Security</strong> (3 archetypes)</summary>

Techno-Nationalist Hawk · Authoritarian State-Control Advocate · Military AI Strategist
</details>

<details>
<summary><strong>Anti-Concentration / Populist</strong> (4 archetypes)</summary>

Open Science Internationalist · Anti-Monopoly Populist · Pragmatic Centrist · Platform-Cooperativist
</details>

<details>
<summary><strong>Relational / Companionship</strong> (7 archetypes)</summary>

Companion-Tech Romantic · Affective Biocentrist · Bio-Conservative Traditionalist · Digital Rights Advocate · Faith-Rooted AI Ethicist · Xenocentric Steward · Corporate AI Welfare Researcher
</details>

<details>
<summary><strong>Material / Labor Stakes</strong> (3 archetypes)</summary>

Creative-Labor/Artist Rights Advocate · Labor Movement/Collective Bargaining Advocate · Disability Rights/Accessibility Advocate
</details>

<details>
<summary><strong>Sovereignty / Marginalized Voice</strong> (3 archetypes)</summary>

Global South Techno-Sovereigntist · Indigenous Data Sovereignty Advocate · AI-for-Global-Development Optimist
</details>

Full definitions, 8-axis coordinates, and one-paragraph summaries for every archetype live in [`src/data/profiles.ts`](src/data/profiles.ts). Every archetype also has a full written report — extended narrative, real thinkers, further reading, next steps, a "commonly confused with" distinction naming its actual nearest neighbor, and a reflective breakdown of its implicit assumptions — in [`src/data/profileReports.ts`](src/data/profileReports.ts).

---

## Bias mitigations built in

This project treats "did we accidentally build a biased classifier" as a real engineering question, not an afterthought:

- **Hidden pole labels, shuffled question order.** You never see which pole a question feeds, and question order is re-shuffled per axis on every attempt (Fisher-Yates, see [`shuffle.ts`](src/lib/shuffle.ts)), so you can't game or pattern-match your way to a target label.
- **Interpretable match-closeness %**, not just a raw Euclidean distance — makes it obvious when your *best* match is still not a great fit, rather than implying false precision.
- **A structural bias audit runs as a standing test** ([`classificationBias.test.ts`](src/lib/classificationBias.test.ts)): 500 trials of pure-random answers are classified, and the test fails if any non-centrist archetype wins an implausible share of random trials — the kind of subtle "opinion matching effect" that has been documented in other online quiz classifiers even under uniformly random input.
- **A profile-redundancy guard** ([`profileRedundancy.test.ts`](src/data/profileRedundancy.test.ts)) fails the build if any two of the 41 archetypes are closer than 5.0 in 8D space — this caught (and forced fixes to) three near-duplicate pairs during development, and every profile report also names its actual nearest neighbor with a specific distinguishing sentence. This guard catches content duplication; it does not guarantee balanced classification win-rates (two archetypes 5.0+ apart can still win wildly different shares of random input — see the calibration note below).
- **An honest methodology disclosure**, expandable from the results page, states plainly that this has not been through psychometric validation (no test-retest reliability studies, no independent peer review) and explains *why* a 1–5 Likert scale was chosen over a forced-ranking format (forced-choice/ipsative data has its own well-documented statistical problems).
- **A deliberate, checked reading level**, enforced by an automated Flesch-Kincaid check ([`readability.ts`](src/lib/readability.ts)). The 142 core questions target roughly a 10th-to-11th-grade level on average (precise enough phrasing to draw a real distinction, without requiring a graduate vocabulary); scenarios, stakeholder-tag descriptions, and other in-app UI copy stay at or below 10th grade, since those are read quickly rather than deliberated over. (Long-form report content — the per-archetype narrative essays — is exempt from both, since that's read *after* scoring, not during it.)
- **Material-stakeholder tags are structurally separate from worldview scoring.** They're stored in their own piece of state, never enter `computeRawAxisScores`/`classify`, and are surfaced on the results page as their own labeled section — so "what you believe" and "what you have at stake" stay visibly distinct instead of getting blended into one score.

---

## How scoring works

```
Likert answer (1–5)
   → signed (-2..+2), flipped if the question's pole is reversed
   → summed per axis, separately for T1 and T2
   → scaled to -10..+10 via  10 * tanh(raw / 3.5)
   → T1 and T2 averaged into one combined 8D vector
   → Euclidean distance computed to all 41 archetype coordinates
   → sorted ascending; closest 3 shown
   → distance converted to an interpretable 0-100% "match closeness"
```

See [`src/lib/scoring.ts`](src/lib/scoring.ts) for the exact implementation. The **situational scenarios** and **material-stakeholder tags** never enter this pipeline — scenarios are only ever compared *after the fact* against your already-computed score (via [`scenarioTension.ts`](src/lib/scenarioTension.ts)) to surface tension, not to adjust it.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript, built with Vite |
| Routing | React Router (`HashRouter`, for static GitHub Pages hosting) |
| State | A single `QuizContext` (React `useReducer`) — no external state library |
| Styling | Tailwind CSS |
| Charts | Recharts (`RadarChart`, dual-series for you-vs-match comparison) |
| PDF export | `@react-pdf/renderer`, client-side, no backend |
| Tests | Vitest + React Testing Library, 130+ tests across 40 files |
| Hosting | GitHub Pages, deployed via GitHub Actions on every push to `master` |

No backend, no database, no analytics, no accounts. Your in-progress answers live only in memory for the current tab; a finished result can be turned into a shareable link (your raw per-axis scores, base64-encoded into the URL fragment — see [`shareLink.ts`](src/lib/shareLink.ts)) or a downloaded PDF, but nothing is ever sent to a server.

---

## Project structure

```
src/
├── data/
│   ├── axes.ts                 8 axis definitions (id, name, pole labels)
│   ├── questions/               142 questions, one file per axis (14 for teleological, 18 for six, 20 for legal & moral)
│   ├── profiles.ts              41 archetypes: id, name, 8D coords, summary
│   ├── profileReports.ts        full report content per archetype
│   ├── archetypeClusters.ts     7 Tier-1 superclusters grouping the 41
│   ├── stakeholderTags.ts       13 material-stakeholder self-select tags
│   ├── scenarios.ts             8 situational diagnostic questions
│   └── types.ts                 shared TypeScript interfaces
├── lib/
│   ├── scoring.ts                the scoring pipeline (see above)
│   ├── shuffle.ts                Fisher-Yates question-order shuffle
│   ├── scenarioTension.ts        compares scenario picks vs. computed score
│   ├── shareLink.ts              encode/decode results into a URL param
│   ├── readability.ts            Flesch-Kincaid grade-level checker
│   └── pdfReport.tsx              @react-pdf/renderer PDF document
├── state/
│   └── QuizContext.tsx           answers, question order, tags, scenario picks
├── components/                  RadarChart, ProfileCard, MethodologySection,
│                                 ReflectiveBreakdown, PinnacleReflection, ...
└── pages/
    ├── IntroPage.tsx             landing + stakeholder-tag checklist
    ├── AxisPage.tsx              one of 8 question pages (/quiz/:axisIndex)
    ├── ScenarioPage.tsx          optional situational scenarios (/scenarios)
    └── ResultsPage.tsx           radar chart, matches, full report, PDF export
```

---

## Running it locally

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm test          # run the full Vitest suite
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

Deployment is automatic: every push to `master` runs the test suite, builds, and publishes to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## Contributing / extending

A few invariants the codebase deliberately enforces — worth knowing before touching things:

- The sign convention (positive = Pole A) and the `10 * tanh(raw / 3.5)` scaling formula are load-bearing; changing either invalidates every existing shared link and every archetype's calibrated coordinates.
- Adding a new archetype? Run the redundancy test — it will tell you exactly which existing archetype yours is too close to, rather than letting a near-duplicate slip in silently.
- New in-app UI copy (not long-form report content) should pass the Flesch-Kincaid 10th-grade gate — `fleschKincaidGrade()` is exported from `src/lib/readability.ts` and every relevant data file has a test asserting this.
- Material-stakeholder tags and scenario answers must never be wired into `computeRawAxisScores` or `classify` — that separation is intentional and tested.

---

## Disclaimer

This is a self-reflection and discussion tool, not a validated psychometric instrument. It has not been through test-retest reliability studies, factor analysis, or independent peer review. Treat your result as a conversation starter and a way to see the shape of a crowded debate — not a scientific reading of who you are.
