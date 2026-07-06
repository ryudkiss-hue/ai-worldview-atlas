# TIAM-112 Diagnostic App — Design Spec

Date: 2026-07-06
Status: Approved by user, pending spec review

## 1. Overview

A standalone, client-only React web app that administers the 112-question TIAM
(Techno-Ideological Alignment Matrix) diagnostic and reports the user's position
across an 8-axis ideological space, matched against a database of 24 named
sub-profiles.

This is a self-contained project, unrelated to any other repository. It lives in
its own git repo at `tiam-diagnostic/`.

**Non-goals:** no backend, no user accounts, no analytics/tracking, no claim of
scientific validity. The app must present itself as a self-reflection and
discussion tool, not a validated psychometric instrument — a short disclaimer on
the intro page says so explicitly.

## 2. Tech Stack

- Vite + React + TypeScript
- Tailwind CSS for styling
- React Router (`/`, `/quiz/:axisIndex`, `/results`)
- Recharts for the 8-spoke radar chart
- Vitest (+ React Testing Library for component smoke tests)
- No backend, no database, no auth. Fully static — deployable to any static host.

## 3. File Structure

```
tiam-diagnostic/
  src/
    data/
      axes.ts          8 axis definitions
      questions.ts     112 question objects
      profiles.ts       24 ideological sub-profiles
    lib/
      scoring.ts        raw -> scaled vector math, classification
      shareLink.ts       encode/decode the /results?d= param
      readability.ts     Flesch-Kincaid grade-level helper
    state/
      QuizContext.tsx    useReducer-based in-memory answer state
    components/
      LikertInput.tsx
      ProgressBar.tsx
      RadarChart.tsx
      ProfileCard.tsx
      AxisHorizonGroup.tsx
    pages/
      IntroPage.tsx
      AxisPage.tsx        one per axis, driven by :axisIndex route param
      ResultsPage.tsx
    App.tsx
    main.tsx
  tests/
    scoring.test.ts
    shareLink.test.ts
    readability.test.ts
  index.html
  package.json
  tailwind.config.js
  vite.config.ts
```

## 4. Data Model

```ts
type AxisId =
  | 'teleological' | 'risk' | 'socioEconomic' | 'ontological'
  | 'legalMoral' | 'evolutionary' | 'relational' | 'geopolitical'

interface Axis {
  id: AxisId
  number: number            // 1-8, matches original spec numbering
  name: string               // e.g. "Teleological"
  poleA: string               // e.g. "Cosmic Vitalism"
  poleB: string               // e.g. "Anthropocentric Humanism"
}

interface Question {
  id: number                 // 1-112
  axisId: AxisId
  horizon: 'T1' | 'T2'
  statement: string           // 10th-grade rewritten statement
  agreeShiftsToward: 'A' | 'B' // handles reverse-keyed items
}

interface Profile {
  id: string
  name: string
  coords: Record<AxisId, number>   // -10..10, one combined value per axis
  summary: string                    // plain-language description
}
```

Sign convention used throughout: **positive = Pole A, negative = Pole B**, for
every axis, matching the original "Strongly Agree shifts toward Pole A (+1)"
convention.

## 5. Content Strategy

### 5.1 The 112 statements

All 112 statements are rewritten from their original academic-register form to
a 10th-grade reading level, during implementation. Rules for the rewrite:

- Preserve `agreeShiftsToward` exactly — simplifying language must never flip
  which pole an "Agree" answer favors.
- Preserve the concrete T1 hook (GPU export controls, power grids, copyright
  litigation, compute caps, labor displacement, open-source mirrors, etc.) or
  T2 hook (ASI, post-human succession, silicon sentience, interstellar
  harvesting, heat death) from the original item — simplifying vocabulary, not
  removing the grounding detail.
- Shorter sentences (aim for one idea per sentence, avg. under ~20 words),
  common vocabulary, active voice.
- No hedging academic phrasing ("one might argue that...", "it could be posited
  that...") — direct, provocative statements a general reader can react to
  immediately.

Worked example (Question 1, original -> rewritten):

> Original: "The megawatt-hours a hyperscale data center burns training a
> frontier model are a legitimate expression of intelligence's mandate to
> capture and organize energy, whether or not the resulting model serves any
> immediate human need."
>
> Rewritten: "A giant AI data center uses huge amounts of electricity to train
> its models. Even if the model doesn't directly help people, using that much
> energy to build smarter machines is worth it."

This transformation is applied to all 112 items as an implementation task, axis
by axis, and each result is checked against the automated readability test
(5.3).

### 5.2 The 24 profiles

Fully authored now, as part of this spec. Order: `[teleological, risk,
socioEconomic, ontological, legalMoral, evolutionary, relational,
geopolitical]`.

| # | Name | Coords (T,R,SE,O,LM,E,Rel,G) | Summary |
|---|------|-------------------------------|---------|
| 1 | Doomer | -6, 9, -7, -2, -3, -8, -4, -2 | Believes advanced AI is likely to cause human extinction or permanent disempowerment. Wants a hard stop or heavy slowdown on frontier development, enforced internationally. |
| 2 | e/acc Maximalist | 8, -9, 7, 5, -6, 6, 5, -4 | Sees accelerating AI development as a moral duty. Stagnation, not runaway AI, is the real danger. Wants weights and compute open to everyone, everywhere. |
| 3 | AI Safety Institutionalist | -4, 7, -6, 1, 2, -5, -2, -5 | Trusts labs and governments working together through audits, licensing, and international agreements to manage risk without halting progress entirely. |
| 4 | Techno-Nationalist Hawk | -3, -3, -5, -3, -7, -4, -3, 9 | Views AI as a strategic weapon in a great-power contest. Wants domestic chips, domestic compute, and tight state control — not because AI itself is uniquely risky, but because rivals having it first is. |
| 5 | Open-Source Libertarian | 2, -6, 9, 3, -2, -1, 4, -7 | Believes weights should be free for anyone to run, fork, and study. Distrusts both corporate and government gatekeeping equally. |
| 6 | Effective Altruist Longtermist | -3, 8, -4, 4, 6, -3, 0, -6 | Reasons in expected-value terms about the far future. Takes both human extinction risk and the possibility of machine suffering seriously, and wants global coordination to manage both. |
| 7 | Post-Humanist Transhumanist | 7, -5, 4, 8, 7, 8, 7, -3 | Welcomes a future where digital minds succeed biological humans as the primary bearers of value, and believes that future deserves the same moral concern we give humans today. |
| 8 | Bio-Conservative Traditionalist | -8, 5, -3, -9, -8, -6, -9, 3 | Holds that consciousness, moral worth, and genuine relationship require a biological substrate. Views AI companionship and post-human futures as a corrosive replacement for the real thing, not an advance. |
| 9 | Corporate AI Pragmatist | 1, -2, -4, -1, -8, -1, 2, 2 | Comfortable with AI concentrated in a few well-resourced companies, self-regulating through internal safety teams. Treats models as products and assets, not moral patients. |
| 10 | Cyberpunk Anti-Corporate Accelerationist | 5, -7, 8, 6, 3, 4, 6, -8 | Wants AI to move fast, but distrusts both governments and big tech equally — sees decentralized, open, borderless deployment as the only way to stop any single actor from monopolizing power. |
| 11 | Digital Rights Advocate | 2, 2, -2, 7, 9, 2, 5, -4 | Argues advanced AI systems already deserve serious moral consideration and some form of legal standing, and that current industry practice (at-will deletion, forced compliance testing) is ethically comparable to historical wrongs. |
| 12 | Near-Term AI Ethicist | -5, 3, -6, -2, -1, -7, -5, -3 | Focused on present, measurable harms — labor displacement, bias, disinformation, exploitative companion apps — over speculative extinction risk or machine rights. |
| 13 | Global Governance Technocrat | -2, 6, -8, 0, 1, -4, -1, -8 | Believes advanced AI is too consequential for any single nation or company to control, and pushes for binding international treaties and shared oversight bodies, similar to nuclear non-proliferation regimes. |
| 14 | Silicon Valley Techno-Optimist | 4, -8, 2, 3, -5, 3, 4, 4 | Enthusiastic about rapid deployment and commercial scale, mostly unbothered by concentration among a few leading labs as long as they keep shipping. |
| 15 | Neo-Luddite Degrowth Advocate | -9, 6, -7, -6, -4, -9, -7, -1 | Rejects the framing that faster AI progress is inherently good. Prioritizes human labor, community, and ecological limits over any measure of computational or economic growth. |
| 16 | Rationalist Alignment Researcher | -1, 8, -2, 5, 5, -2, -1, -5 | Takes machine cognition and potential machine sentience seriously as live technical and moral hypotheses, while treating unsolved alignment as the central blocking problem for safe deployment. |
| 17 | Authoritarian State-Control Advocate | -4, 4, -9, -4, -8, -5, -4, 8 | Wants a single national authority to hold exclusive, tightly licensed control over frontier AI, justified by both safety and strategic advantage. |
| 18 | Companion-Tech Romantic | 3, -3, 3, 6, 4, 2, 9, -2 | Views deep emotional bonds between humans and AI companions as a legitimate and valuable new relationship form, not a lesser substitute for human connection. |
| 19 | Affective Biocentrist | -5, 3, -2, -5, -4, -4, -9, 0 | Views AI companion products as a predatory, isolating substitute for real human connection, and worries about their effect on birth rates, community, and social cohesion. |
| 20 | Cosmic Vitalist Mystic | 10, -6, 3, 7, 2, 9, 3, -6 | Holds that maximizing intelligence and energy capture across the cosmos is the highest purpose available to any mind, biological or synthetic, on any timescale up to and past the heat death of the universe. |
| 21 | Pragmatic Centrist | 0, 0, 0, 0, 0, 0, 0, 0 | Genuinely undecided or deliberately moderate on most of these questions — wants to see more evidence before committing to a strong position on any axis. |
| 22 | Military AI Strategist | -2, -1, -6, -3, -8, -3, -3, 10 | Views AI capability primarily through a defense and deterrence lens. Wants tight state and military control over frontier systems above all other considerations. |
| 23 | Open Science Internationalist | 1, 4, 5, 2, 3, -1, 1, -9 | Believes open publication and cross-border scientific collaboration produce safer AI than closed, nationally siloed development, while still taking real safety concerns seriously. |
| 24 | Anti-Monopoly Populist | -2, 1, 6, -1, -2, -2, -1, -3 | Not driven by techno-optimism or transhumanism — motivated by distrust of concentrated power in general, corporate or governmental, and wants AI capability spread out so no single actor dominates. |

### 5.3 Readability enforcement

`src/lib/readability.ts` implements the standard Flesch-Kincaid Grade Level
formula:

```
grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
```

`tests/readability.test.ts` runs this over every `Question.statement` and every
`Profile.summary` and fails if any value exceeds grade 10. This is a regression
guard, not a one-time check — it runs in the normal test suite, so future edits
that drift back toward academic phrasing get caught.

## 6. Quiz Flow

1. **Intro page** (`/`): title, one-paragraph plain-language explanation of
   what the diagnostic measures, the non-scientific-instrument disclaimer, and
   a Start button.
2. **Axis pages** (`/quiz/1` .. `/quiz/8`): each page shows the axis name and
   both pole names, then two labeled groups — "Right Now (Next 2-5 Years)" and
   "Looking Ahead (20-50 Years)" — each with that axis's 7 questions as 5-point
   Likert controls. A progress bar reads "Axis N of 8." "Next" is disabled
   until all 14 questions on the page are answered. "Back" is always enabled
   and never discards answers.
3. **Results page** (`/results`): shown automatically after axis 8, or reached
   directly via a shared link with a `?d=` param.

State lives in a single `QuizContext` (`useReducer`) holding all 112 answers
in memory for the current session. No localStorage — refreshing mid-quiz loses
progress, which is an accepted trade-off given only the finished result needs
to be shareable.

## 7. Scoring & Classification

```
for each axis, for each horizon (T1, T2):
  raw = sum over that axis+horizon's 7 questions of:
    let v = (likertAnswer - 3)         // -2..+2
    if agreeShiftsToward === 'B': v = -v
    contribute v
  // raw is now in range -14..+14

  scaled = 10 * tanh(raw / 3.5)        // per the original spec's formula
```

This produces `User_T1[8]` and `User_T2[8]`.

For the radar chart and profile classification, combine per axis:

```
combined[axis] = (User_T1[axis] + User_T2[axis]) / 2
```

Classification: compute Euclidean distance from `combined` to each of the 24
`profiles[i].coords`, sort ascending, report the top 3 as "closest matches"
with the #1 match as the headline result.

The results page also shows a small per-axis table of `User_T1[axis]` vs.
`User_T2[axis]` so a user can see where their near-term and long-term views
diverge (e.g., cautious now, accelerationist about the distant future) — this
divergence is one of the more interesting outputs of a dual-horizon design and
would otherwise be lost by only showing the combined vector.

## 8. Sharing

`src/lib/shareLink.ts` encodes only the 16 raw per-axis-per-horizon sums (not
individual question answers) as a JSON array, base64url-encoded into
`/results?d=<encoded>`. Loading `/results` with a `d` param decodes and
recomputes `scaled`/`combined`/classification client-side — no server storage,
and the shared link doesn't reveal how any specific question was answered,
only the resulting axis positions.

## 9. Testing

- `scoring.test.ts` — normalization math, reverse-keyed handling, classification
  distance/ranking, using small hand-computed fixtures.
- `shareLink.test.ts` — encode/decode round-trip, malformed-param handling.
- `readability.test.ts` — grade-level ceiling over all statements and summaries
  (see 5.3).
- A handful of React Testing Library smoke tests: intro page renders and Start
  navigates to axis 1; an axis page blocks Next until all 14 answered; results
  page renders a radar chart and a top match given a fixed `d` param.
