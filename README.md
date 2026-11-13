# The AI Worldview Atlas

**A 144-statement diagnostic that maps where you stand on artificial minds and AI's future, across 8 axes, matched against 50 named worldview archetypes.**

Live at **[ryudkiss-hue.github.io/ai-worldview-atlas](https://ryudkiss-hue.github.io/ai-worldview-atlas/)**

This version merges two instruments: the original Atlas (145 questions on 8 axes) and the Synthetic Compass (120 statements on machine minds, their moral standing, and the future of intelligence). Every statement was rewritten to one standard, described below, and the two item sets were folded into one set of axes so nothing is measured twice. The Atlas is English only.

---

## Why this exists

Most AI-opinion typologies make three mistakes this project tries to avoid:

1. **They flatten a multi-dimensional space into one or two axes.** Whether you think AI poses existential risk and whether you think a chatbot can suffer are different questions. Collapsing them into "pro-AI vs. anti-AI" loses the shape of the disagreement.
2. **They imply every position is equally common.** This tool groups its 50 archetypes into 7 **groups** so the relative scale of each camp stays legible (see [`archetypeClusters.ts`](src/data/archetypeClusters.ts)).
3. **They let wording, order and the habit of agreeing bias the result.** See [How the statements are built](#how-the-statements-are-built) and [Bias mitigations](#bias-mitigations-built-in).

---

## How the statements are built

Every statement meets five tests:

1. **Mirrored pairs.** Each statement has a partner on the same topic, under the same conditions, taking the opposite side (ids 1–2, 3–4, …). Agreeing with everything, or disagreeing with everything, lands at exactly 0 on every axis.
2. **One claim.** No premise-plus-conclusion bundles and no second clause a reader might accept on its own.
3. **A view, not a prediction.** Statements ask what is true in principle or what should happen, not what will happen, so answers reflect values and judgments rather than guesses about facts.
4. **Matched strength.** Both sides of a pair are about equally easy to agree with, and neither uses loaded words.
5. **The right axis.** Each pair measures its own axis's question and not something that merely travels with it (for example, relationship statements sit on Relationships, not on Moral Standing).

Each axis has 9 pairs: 4 about today's and near-term AI (T1) and 5 about what is possible in principle or in the long run (T2). Answers use four options with no neutral midpoint, plus an explicit "I have no settled view on this", which counts as zero.

---

## The 8 axes

Positive scores lean toward Pole A, negative toward Pole B. Axis names, poles, archetype names and stakeholder tags follow the plain-language rules in [`docs/LANGUAGE_GUIDE.md`](docs/LANGUAGE_GUIDE.md). The axes fall into four groups: what AI is (1), how we live with it (2–3), what future to build (4–5), and who decides and how fast (6–8). Axis ids are kept from the original Atlas so the 50 archetypes, their reports and manifestos still line up.

| # | Axis | Question | Pole A | Pole B |
|---|------|----------|--------|--------|
| 1 | **Machine Experience** | Could an AI system ever have real experiences, such as feelings? | Possible in machines | Only in living things |
| 2 | **Moral Standing** | Could an AI system ever be owed moral consideration for its own sake? | Owed some protection | Tools and property |
| 3 | **Relationships** | What are relationships with AI systems worth? | As valuable as human bonds | Human bonds come first |
| 4 | **Growth and Limits** | Should AI keep expanding, or stay within the limits of people and the planet? | Growth first | Within limits |
| 5 | **Human Control** | Should people keep the final say, even where machines do better? | Open to handing over | People stay in charge |
| 6 | **Speed and Safety** | How carefully should AI be developed and released? | Caution first | Speed first |
| 7 | **Openness & Control** | Who should be able to build and use powerful AI? | Open to all | Public oversight |
| 8 | **Nations and the World** | Should AI serve national interests or people everywhere? | National interest | Global cooperation |

Each axis is also scored separately for T1 and T2, because many positions differ between the near term and the long run.

---

## The 50 archetypes, in 7 groups

Rather than one flat list, every archetype belongs to exactly one of seven **groups** (see [`archetypeClusters.ts`](src/data/archetypeClusters.ts)), which keeps the relative size and shape of each camp visible instead of implying 50 equally-weighted tribes:

<details>
<summary><strong>Caution and safety</strong> (11 archetypes)</summary>

Extinction-Risk Advocate · Safety Regulation Advocate · Long-Term Future Planner · Alignment Researcher · Global Treaty Advocate · Present-Harms Ethicist · Degrowth Tech Skeptic · Insider Whistleblower · Computing-Power Oversight Specialist · Rules-First Regulator · Fairness Watchdog
</details>

<details>
<summary><strong>Speed and optimism</strong> (10 archetypes)</summary>

Full-Speed Builder · Open-Source Libertarian · Anti-Corporate Hacker · Tech Industry Optimist · Business-First Pragmatist · Beyond-Human Futurist · Space-Expansion Visionary · Augment-Not-Replace Advocate · National Champion Builder · Normal-Technology Realist
</details>

<details>
<summary><strong>State power and security</strong> (6 archetypes)</summary>

National Security Hawk · Central State-Control Advocate · Military AI Strategist · Chip Export-Control Strategist · Arms-Control Verification Specialist · Public-Safety AI Advocate
</details>

<details>
<summary><strong>Spreading power out</strong> (4 archetypes)</summary>

Open Science Internationalist · Anti-Monopoly Advocate · Pragmatic Centrist · Worker-Owned Tech Advocate
</details>

<details>
<summary><strong>Relationships and moral standing</strong> (7 archetypes)</summary>

AI Companionship Advocate · Human-Bonds Defender · Human Nature Traditionalist · AI Rights Advocate · Faith-Based Ethicist · AI Guardianship Advocate · AI Welfare Researcher
</details>

<details>
<summary><strong>Work and livelihoods</strong> (6 archetypes)</summary>

Artist Rights Advocate · Union Bargaining Advocate · Disability Rights Advocate · Data-Worker Rights Advocate · Gig-Pay Fairness Advocate · Basic Income Advocate
</details>

<details>
<summary><strong>Self-determination and rights</strong> (6 archetypes)</summary>

Global South Self-Reliance Advocate · Indigenous Data Sovereignty Advocate · Global Development Optimist · Digital Colonialism Critic · African-Language AI Advocate · Border Surveillance Critic
</details>

Full definitions, 8-axis coordinates, and one-paragraph summaries for every archetype live in [`src/data/profiles.ts`](src/data/profiles.ts). Every archetype also has a full written report — extended narrative, its position and reasoning on each of the eight axes, the strongest objections with replies, real-world landmarks with sources ([`profileExpansions.ts`](src/data/profileExpansions.ts)), real thinkers, further reading, next steps, a "commonly confused with" distinction naming an archetype people often mix it up with and what separates them, and a reflective breakdown of its implicit assumptions — in [`src/data/profileReports.ts`](src/data/profileReports.ts).

---

## The core-three reading

Results also place you among **27 archetypes** from three axes about AI systems themselves and what they are for: Machine Experience (X), Moral Standing (Y) and Growth and Limits read in reverse (Z, from growth-first to within-limits). Each axis is split into three tiers at −2 and +2, and the three tiers pick one cell of 3 × 3 × 3. Descriptions are built from one sentence per tier, so the same tier always reads the same way. See [`coreThree.ts`](src/data/coreThree.ts).

---

## Bias mitigations built in

This project treats "did we accidentally build a biased classifier" as a real engineering question, not an afterthought:

- **Hidden pole labels, shuffled question order.** You never see which pole a question feeds, and question order is re-shuffled per axis on every attempt (Fisher-Yates, see [`shuffle.ts`](src/lib/shuffle.ts)), so you can't game or pattern-match your way to a target label.
- **Average gap per axis instead of a match percentage.** Each match leads with how far apart you are, on average, per axis, which follows the ranking; below it, how many of the 8 axes put you on the same side (pole A, middle, pole B) and the two axes where you differ most. The old percentage put even very different archetypes in the 70s and 80s.
- **Close calls calibrated against measurement error.** A result is flagged when the top two archetypes are less than 0.3 apart: in simulation ([`analysis/closecall_sim.py`](analysis/closecall_sim.py), synthetic sheets only), below that gap a different handful of statements on the same themes swaps the top match about half the time. The notice names the axes that separate the two.
- **Optional check statements.** Two statements ask for a particular answer. They are never scored; if one gets a different answer, the results page says so, and the validation study sets that response aside.
- **Mirrored, balanced statements.** Every axis and horizon has as many pole-A as pole-B statements, so the habit of agreeing cancels out; a standing test checks that uniform answer sheets score exactly 0.
- **A structural bias audit runs as a standing test** ([`classificationBias.test.ts`](src/lib/classificationBias.test.ts)): 500 trials of pure-random answers are classified, and the test fails if any non-centrist archetype wins an implausible share of random trials — the kind of subtle "opinion matching effect" that has been documented in other online quiz classifiers even under uniformly random input.
- **A profile-redundancy guard** ([`profileRedundancy.test.ts`](src/data/profileRedundancy.test.ts)) fails the build if any two of the 50 archetypes are closer than 5.0 in 8D space — this caught (and forced fixes to) three near-duplicate pairs during development, and every profile report also names an archetype it's often confused with, with a specific distinguishing sentence (a conceptual neighbor, not always the nearest in coordinates; the results page shows the coordinate gaps directly). This guard catches content duplication; it does not guarantee balanced classification win-rates (two archetypes 5.0+ apart can still win wildly different shares of random input — see the calibration note below).
- **An honest methodology disclosure**, expandable from the results page, states plainly that this has not been through psychometric validation (no test-retest reliability studies, no independent peer review) and explains the four-option scale with an explicit "no settled view" choice.
- **A deliberate, checked reading level**, enforced by an automated Flesch-Kincaid check ([`readability.ts`](src/lib/readability.ts)). The 144 statements aim for clarity: no statement above grade 15 and an average between grades 8 and 12, so the idea, not the vocabulary, does the work. Profile summaries, scenarios, and stakeholder-tag descriptions are held to a grade-14 ceiling. (Long-form report content — the per-archetype narrative essays — is exempt from both, since that's read *after* scoring, not during it.)
- **Material-stakeholder tags are structurally separate from worldview scoring.** They're stored in their own piece of state, never enter `computeRawAxisScores`/`classify`, and are surfaced on the results page as their own labeled section — so "what you believe" and "what you have at stake" stay visibly distinct instead of getting blended into one score.

---

## How scoring works

```
Answer: strongly disagree, disagree, agree, strongly agree  →  -2, -1, +1, +2   ("no settled view" = 0)
   → flipped for pole-B statements, summed per axis (and per horizon)
   → scaled linearly to -10..+10:  10 × sum ÷ (2 × number of statements)
   → T1 and T2 combined in proportion to their statement counts (= the score over all 18)
   → Euclidean distance to all 50 archetype coordinates; closest 3 shown as average gap per axis (distance ÷ √8)
   → close call when the second match is less than 0.3 farther away than the first
   → core-three reading from the tiers of Machine Experience, Moral Standing and Growth and Limits
```

Statement weights are equal: with no response data yet, there is no basis for weighting one statement above another. See [`src/lib/scoring.ts`](src/lib/scoring.ts). The **situational scenarios** and **stakeholder tags** never enter this pipeline. The **25 thought experiments** are a separate, unscored reading page.

### Optional extras on the website

These are web-only and exploratory. They are not part of the validation study (see the deviation log in the protocol).

- **Short version.** 48 of the 144 statements: three mirrored pairs per axis, one near-term and two long-run ([`src/data/shortForm.ts`](src/data/shortForm.ts)). Scores are scaled by the statements shown, so they sit on the same −10..+10 scale with less precision (six answers per axis instead of eighteen). The results page says so and offers to answer the other 96 without losing anything. The close-call simulation was rerun for the short version (`python3 analysis/closecall_sim.py --short`, synthetic sheets only) and gave the same 0.3 margin.
- **What matters most to you.** On the results page you can mark any axis Less (×0.5), Normal or More (×2). Only the archetype ranking changes: distance becomes √(8 × Σ wᵢΔᵢ² ÷ Σ wᵢ), which equals the ordinary distance when every weight is 1, so the average gap and the close-call margin keep their meaning. Your scores never change. Weights travel in share links.
- **Statement by statement.** Your answer to each statement next to the answer each of your three closest archetypes would be expected to give. Archetypes never answered statements, so their answers are estimates from their position on that axis (strongly agree at 6 or more toward the statement's pole, agree at 2 or more, no clear lean in between), and the page says so. Only opposite sides are flagged.
- **Focus module: friends, partners and therapists** (`/intimacy`). 18 mirrored statements on AI as a best friend, romantic partner and therapist, and on attachment, critical thinking, identity, loneliness, intimacy and social connection ([`src/data/intimacyModule.ts`](src/data/intimacyModule.ts)). It has its own Guarded ↔ Open score and theme breakdown, reflection questions, and a research summary that gives both sides, drawing on the American Psychological Association's 2025 health advisories, the World Health Organization's Commission on Social Connection, the American Philosophical Association's blog, peer-reviewed studies (Journal of Consumer Research, Psychological Science, Nature Human Behaviour, Perspectives on Psychological Science, New Media & Society, NEJM AI, JMIR, ACM CHI and AIES) and WIRED. It never touches the Atlas score, the match or share links.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript, built with Vite |
| Routing | React Router (`HashRouter`, for static GitHub Pages hosting) |
| State | A single `QuizContext` (React `useReducer`) — no external state library |
| Styling | Tailwind CSS |
| Charts | Recharts (`RadarChart`, dual-series for you-vs-match comparison) |
| Animations | Framer Motion (`motion` for smooth experiment transitions) |
| Language | English only |
| PDF export | `@react-pdf/renderer`, client-side, no backend |
| Tests | Vitest + React Testing Library, 200+ tests across 44 files |
| Hosting | GitHub Pages, deployed via GitHub Actions on every push to `master` |

No backend, no database, no analytics, no accounts. Your answers are saved as you go in this browser's local storage, so a refresh or a closed tab doesn't lose them, and "Start over" clears them; a finished result can be turned into a shareable link (your raw per-axis scores, base64-encoded into the URL fragment — see [`shareLink.ts`](src/lib/shareLink.ts)) or a downloaded PDF, but nothing is ever sent to a server.

---

## Project structure

```
src/
├── data/
│   ├── axes.ts                 8 axis definitions (id, name, question, poles)
│   ├── coreThree.ts             the 27-archetype core-three reading
│   ├── questions/               144 statements in mirrored pairs, 18 per axis, one file per axis
│   ├── profiles.ts              50 archetypes: id, name, 8D coords, summary
│   ├── profileReports.ts        full report content per archetype
│   ├── archetypeClusters.ts     7 groups of the 50 archetypes
│   ├── stakeholderTags.ts       13 material-stakeholder self-select tags
│   ├── scenarios.ts             8 situational diagnostic questions
│   ├── attentionChecks.ts       2 optional, unscored check statements
│   ├── manifestoContents.ts     50 plain-language manifestos, one per archetype (axis positions filled from profiles.ts)
│   ├── study.ts                 link to the validation study's form (empty until set)
│   ├── shortForm.ts             the 48-statement short version
│   ├── intimacyModule.ts        focus module: statements, scoring, research summary and sources
│   └── types.ts                 shared TypeScript interfaces
├── lib/
│   ├── scoring.ts                the scoring pipeline (see above)
│   ├── shuffle.ts                Fisher-Yates question-order shuffle
│   ├── scenarioTension.ts        compares scenario picks vs. computed score
│   ├── shareLink.ts              encode/decode results into a URL param
│   ├── readability.ts            Flesch-Kincaid grade-level checker
│   ├── axisPositions.ts          an archetype's positions in words; biggest gaps between two positions
│   ├── statementComparison.ts    expected answers of an archetype, estimated from its coordinates
│   └── pdfReport.tsx              @react-pdf/renderer PDF document
├── state/
│   └── QuizContext.tsx           answers, question order, tags, scenario picks, version, axis weights, focus-module answers
├── components/                  RadarChart, ProfileCard, MethodologySection,
│                                 ReflectiveBreakdown, PinnacleReflection, ...
└── pages/
    ├── IntroPage.tsx             landing + stakeholder-tag checklist
    ├── AxisPage.tsx              one of 8 question pages (/quiz/:axisIndex)
    ├── ScenarioPage.tsx          optional situational scenarios (/scenarios)
    ├── ResultsPage.tsx           radar chart, matches, full report, PDF export
    ├── ThoughtExperimentsPage.tsx the 25 thought experiments, unscored (/thought-experiments)
    ├── IntimacyPage.tsx          the synthetic-intimacy focus module (/intimacy)
    └── PaperScoresPage.tsx       enter the paper edition's 16 net totals to see the online results (/paper)
```

---

## Validation study

The Atlas has not been validated yet. [`docs/VALIDATION_PROTOCOL.md`](docs/VALIDATION_PROTOCOL.md) fixes, before any data exist, which responses are set aside, what is measured (reliability per axis, mirrored pairs, distinct axes, measurement precision, the close-call margin, agreement with self-chosen viewpoints, retest stability, archetype coordinates) and what each result would change.

- **Collecting responses.** The Google Forms edition ([`forms/AIWorldviewAtlasForm.gs`](forms/AIWorldviewAtlasForm.gs), set up in your own Google account) asks for consent, an optional self-chosen viewpoint and an optional retest code, includes the two check statements, and writes every answer to an "Answers" tab.
- **Analysing them.** Download that tab as CSV and run `python3 analysis/analyze_atlas.py Answers.csv out/`. The script reads [`analysis/atlas_reference.json`](analysis/atlas_reference.json), which a test keeps identical to the quiz's own data. `analysis/make_test_data.py` writes a synthetic file for trying it out; the script only accepts synthetic rows with `--test` and labels every output as a test run.
- **Linking the study from the results page.** Paste the form's share link into [`src/data/study.ts`](src/data/study.ts). While it's empty, no link is shown.

---

## Language

The Atlas is English only. The earlier translations and pre-recorded audio matched the previous question set, so they were removed when the statements were rewritten. Read-aloud still works through the optional ElevenLabs key in Voice Settings, which reads the current text.

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

- The sign convention (positive = Pole A), the linear scaling and the mirrored-pair structure are load-bearing. Adding a statement means adding its mirrored partner on the same axis and horizon; `questions/index.test.ts` fails otherwise. Changing the item set or scaling invalidates shared links (bump `SHARE_LINK_VERSION`) and needs a new check that the 50 archetypes are still recovered.
- Adding a new archetype? Run the redundancy test — it will tell you exactly which existing archetype yours is too close to, rather than letting a near-duplicate slip in silently.
- Statements must stay at or below grade 15 (average 8–12), and the methodology text at or below grade 10; `fleschKincaidGrade()` is exported from `src/lib/readability.ts` and tests assert both.
- Material-stakeholder tags and scenario answers must never be wired into `computeRawAxisScores` or `classify` — that separation is intentional and tested.

---

## Disclaimer

This is a self-reflection and discussion tool, not a validated psychometric instrument. It has not been through test-retest reliability studies, factor analysis, or independent peer review; the study that would do so is planned in `docs/VALIDATION_PROTOCOL.md` but has no data yet. Treat your result as a conversation starter and a way to see the shape of a crowded debate — not a scientific reading of who you are.
