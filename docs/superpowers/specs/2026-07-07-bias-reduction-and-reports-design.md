# Bias Reduction + Detailed Reports — Design Spec

Date: 2026-07-07
Status: Approved by user, pending spec review

## 1. Overview

Two additions to the shipped TIAM-112 diagnostic app:

1. **Bias reduction** — stop telegraphing which pole an answer favors while the
   user is mid-quiz, to reduce social-desirability and self-consistency gaming.
2. **Detailed reports** — a rich, per-user report (inline preview + downloadable
   PDF) built on top of the existing 24-profile classification, going well
   beyond the current one-sentence profile summaries: extended narrative per
   matched profile, real thinkers/books whose public work resonates with each
   archetype, exact numeric coordinates, and next steps.

Plus a short, narrowly-scoped list of quality-of-life additions.

Non-goals: this does not change the core 112 questions, the scoring formula,
or the 24 profiles' coordinates/short summaries — those are frozen from the
prior build. This also does not add a backend; the PDF is generated entirely
client-side.

## 2. Bias Reduction

### 2.1 Hide pole labels mid-quiz

`AxisPage` currently renders:
```
<h2>{axis.name}</h2>
<p>{axis.poleA} vs. {axis.poleB}</p>
```
The second line is removed. Only the axis name and progress bar remain above
the question groups. (The pole labels still appear later, on the results page,
where seeing them is the point.)

### 2.2 Randomize order within each axis, stably per attempt

Each axis's 14 questions are shuffled once per quiz attempt — the 7 T1
questions shuffle among themselves, and the 7 T2 questions shuffle among
themselves, independently. The "Right Now" / "Looking Ahead" grouping and
headers stay exactly as they are; only the order *within* each group changes.
This is deliberately narrower than shuffling across all 112 questions or
across T1/T2 within an axis, so the existing per-axis-page architecture,
progress bar ("Axis N of 8"), and Next/Back navigation are untouched.

**Mechanism:** a new pure module `src/lib/shuffle.ts` exports
`shuffleArray<T>(items: T[]): T[]` (Fisher-Yates using `Math.random()`).
`QuizContext`'s state gains a `questionOrder: Record<AxisId, { t1: number[]; t2: number[] }>`
field — a map from axis to the shuffled list of question ids for that axis's
T1 and T2 groups — computed once when the reducer initializes, and
**recomputed whenever `reset()` fires** (so retaking the quiz reshuffles
again, keeping the mitigation effective across repeat attempts). `AxisPage`
reorders its `t1Questions`/`t2Questions` arrays according to
`questionOrder[axis.id]` before rendering, instead of relying on
`questionsForAxis`'s natural (by-id) order.

## 3. Detailed Reports

### 3.1 New authored content per profile

A new file, `src/data/profileReports.ts`, exports `profileReports: Record<string, ProfileReportContent>`
keyed by the existing 24 profile `id`s (kept separate from `profiles.ts` —
which stays untouched, since it's load-bearing for scoring/classification and
already reviewed — so this purely-editorial content lives in its own file).

```ts
export interface ProfileReportContent {
  profileId: string                 // matches Profile.id
  extendedNarrative: string[]        // 2 short paragraphs
  thinkers: {
    name: string
    bio: string                       // one clause, e.g. "Philosopher, Oxford"
    connection: string                // one sentence, carefully hedged (see 3.2)
  }[]                                  // 3-4 entries
  furtherReading: {
    title: string
    author: string
    note: string                      // one line on relevance
  }[]                                  // 3-4 entries
  nextSteps: string[]                  // 2-3 short bullets
}
```

A test (`profileReports.test.ts`) verifies: exactly 24 entries, `profileId`
set matches `profiles.ts`'s `id` set exactly (no orphans, no gaps), and every
array field is within its expected length range and non-empty.

**Barnum-effect guideline for `extendedNarrative`.** Academic criticism of
MBTI/16Personalities-style tools centers heavily on the Barnum (Forer)
effect — vague, universally-flattering descriptions that most people would
accept as "uniquely" describing them regardless of their actual answers.
Each profile's `extendedNarrative` must make at least one claim that is
**specific and falsifiable against the profile's actual coordinates** (e.g.,
naming the concrete policy stance or trade-off the profile takes, not just a
mood or attitude), and must be written so it would read as *wrong*, not just
"less right," for a profile with substantially different coordinates. This
is a content-authoring constraint, not new code — apply it when writing the
24 entries in the implementation plan.

**No Flesch-Kincaid ceiling applies to this content.** The 10th-grade
readability gate (Task 13/14 of the prior build) binds `Question.statement`
and `Profile.summary` only, per the original spec. This new report content is
explicitly a deeper, more detailed document — it's fine for it to read at a
more sophisticated register than the quiz itself.

### 3.2 Real-person framing (safety rule for this content)

Thinkers named in `thinkers[]` must be real, public figures whose documented
public work is genuinely and uncontroversially associated with that
archetype's themes (e.g., Nick Bostrom with existential-risk/AI-safety
writing, Marc Andreessen with the "Techno-Optimist Manifesto," Guillaume
Verdon/"Beff Jezos" with coining e/acc, Toby Ord/William MacAskill with
longtermism, Ray Kurzweil/Max More with transhumanism). Every `connection`
sentence must:
- Describe their **documented public work**, not a claim about their private
  views or how they would personally answer this quiz.
- Never state or imply the person endorses this exact profile, took this
  quiz, or would agree with the app's characterization of the archetype.
- Stick to well-known, widely-reported associations — no speculative or
  obscure attributions.

Example (Doomer profile): "Nick Bostrom — Philosopher, Oxford. His writing on
existential risk from advanced AI, particularly *Superintelligence*, is the
most cited academic grounding for this precautionary stance."

**Exception for reputationally-sensitive or exemplar-free profiles.** Four
profiles carry overtly negative or politically-loaded framing —
`authoritarian-state-control-advocate`, `military-ai-strategist`,
`techno-nationalist-hawk`, `corporate-ai-pragmatist` — where naming a specific
living person against that label, even hedged, risks mischaracterizing them.
For these four, `thinkers[]` cites **doctrines, institutions, historical
(non-living) figures, or intellectual traditions** instead of living public
individuals — e.g., a strategy doctrine, a declassified policy document, a
historical political theorist writing generally about statecraft/realism, or
a named think tank's published position, not a named living executive or
official.

A fifth profile, `pragmatic-centrist`, has no natural real-world exemplar by
construction (its coordinates are all zero — "genuinely undecided"). For this
one, `thinkers[]` cites people known for **epistemic humility or
methodological caution as a discipline** (e.g., a philosopher of science
writing on uncertainty, forecasting, or calibration) rather than forcing a
fit to "undecided about AI" specifically.

These five profile ids are the only exceptions to the "named living public
figure" default in the rest of this section.

### 3.3 Per-user computed content

Unlike the authored content above, this is generated from the user's actual
scores at render/export time — never authored, always derived:

- **Exact coordinates**: the combined 8D vector, plus the T1 and T2 scaled
  values separately per axis (already computed by `scoring.ts`; the report
  just displays the full precision rather than the `.toFixed(1)` currently
  shown in the divergence table).
- **Per-axis narrative**: one templated paragraph per axis describing the
  user's position. New pure module `src/lib/axisNarrative.ts` exports
  `describeAxis(axis: Axis, t1: number, t2: number): string`. Logic: bucket
  each of `t1`/`t2` into one of five bands by magnitude/sign
  (`Strongly Pole A` |x|≥6 same sign as A, `Leans Pole A` 2≤|x|<6, `Balanced`
  |x|<2, `Leans Pole B`, `Strongly Pole B`), then compose a sentence from the
  axis name/pole labels and the two bands, adding a second sentence noting the
  divergence when T1 and T2 land in different bands (e.g., "your near-term and
  long-term views differ here"). Fully unit-testable: fixed `(axis, t1, t2)`
  triples → exact expected string.
- **Distance to top-3 matches** (already computed by `classify`).

### 3.4 Report structure

Available from the results page: an inline **preview** section, plus a
**"Download PDF Report"** button.

**Inline preview** (`src/components/ReportPreview.tsx`, plain HTML/Tailwind,
rendered on `ResultsPage` below the existing divergence table): the top
match's extended narrative, thinkers, further reading, and next steps — a
substantial, real preview of the full report, not just a teaser.

**PDF** (`src/lib/pdfReport.tsx`, built with `@react-pdf/renderer` primitives
— `Document`/`Page`/`Text`/`View`/`Image`, a genuine paginated, selectable-text
PDF, not a screenshot): 

1. Title page — top match name, generation date
2. Methodology & disclaimer page — restates the app's self-reflection framing,
   and explicitly notes that thinker/book associations are editorial
   commentary on public work, not claims about those people's personal views
   or endorsement
3. Your coordinates — a table of exact T1/T2/combined values per axis (the
   radar chart itself is an on-screen visualization; the PDF gets the numeric
   table, not a re-rendered chart image, to avoid a second charting
   dependency inside the PDF renderer)
4. Eight per-axis narrative sections (from 3.3)
5. Top match deep-dive — full `ProfileReportContent` for the #1 match
6. Two runner-up matches — condensed: name, the existing `Profile.summary`
   (not `extendedNarrative` — that full treatment is reserved for the top
   match only), and distance/closeness
7. Closing further-reading/next-steps roundup — pulls `furtherReading` and
   `nextSteps` from all three matches' `ProfileReportContent` (even though
   runner-ups don't get their own dedicated deep-dive section above),
   deduplicated by title/text

`ResultsPage` gains a "Download PDF Report" button that calls
`pdf(<ReportDocument ... />).toBlob()` (the imperative `@react-pdf/renderer`
API, not `PDFDownloadLink`, for explicit control over a loading state),
creates an object URL, triggers a download via a temporary anchor element,
then revokes the URL. The button shows a disabled/spinner state while the
blob is being generated, since multi-page PDF generation isn't instant.

**Known risk:** `@react-pdf/renderer` rendering/testing under Vitest's jsdom
environment is unverified and could hit the same class of gap the prior
build's Recharts integration did (Tasks 20/21 needed jsdom shims beyond what
was originally planned). The implementation task for `pdfReport.tsx` should
investigate this early — verify `pdf(<ReportDocument ... />).toBlob()` actually
resolves in the test environment before writing the full document structure
around it. If it proves incompatible or requires disproportionate environment
hacking, the fallback is a print-optimized HTML view (a dedicated
`/report` route styled for print) triggered via `window.print()`, accepting
the trade-off of an extra manual "Save as PDF" step for the user. This
decision should be escalated (not silently substituted) if the primary
approach doesn't pan out.

## 4. Research-Informed Additions

Informed by academic and industry research into political/personality quiz
design — Pew Research's own typology methodology, published critiques of the
Political Compass and 16Personalities/MBTI, and a peer-reviewed 2024 PLOS One
study on quiz-driven opinion manipulation. Full source list at the end of
this section.

### 4.1 Methodology transparency section

A new expandable "How This Works" section, available from `ResultsPage`
(and linked from `IntroPage`), plus matching content on the PDF's methodology
page (§3.4). Content, directly informed by the research:

1. **Mechanism**: plain-language walkthrough of raw Likert → signed sum →
   `10 * tanh(raw / 3.5)` normalization → Euclidean distance to 24 profiles —
   written in the same 10th-grade-accessible register as the rest of the app
   (this section IS in scope for the Flesch-Kincaid gate, unlike the
   long-form report content in §3, since it's core in-app UI copy).
2. **Pew-style single-axis caveat**: explicitly states that matching considers
   your overall 8-axis pattern, so a strong view on just one or two axes can
   pull you toward — or away from — a profile you'd otherwise agree with on
   everything else.
3. **Honest validity statement**: this tool has not been through
   psychometric validation — no independent test-retest reliability study, no
   factor analysis, no peer review. It's a self-reflection and discussion
   prompt, explicitly not a validated instrument, and the 24 profiles are
   editorial archetypes, not empirically-derived clusters (contrast with how
   Pew's typology is grounded in cluster analysis over a representative
   survey panel — this tool makes no such claim and says so directly).
4. **Why Likert, not forced-choice**: a one-line rationale — forced-choice
   ranking formats are more resistant to faking but produce ipsative data
   with documented reliability/validity problems (interdependent scores,
   no standard factor analysis) unless paired with advanced IRT modeling,
   which is out of scope here — so this tool deliberately uses independent,
   absolute-scale Likert ratings instead.
5. **Default-answer disclosure**: if you answer near-neutral throughout,
   expect a near-centrist match — that's the classifier working as intended
   (the "Pragmatic Centrist" profile is deliberately the all-zero
   coordinate), not a bug.

### 4.2 Interpretable match score, not raw distance

`ProfileCard` currently shows `Distance: 3.46` — a Euclidean distance in
tanh-normalized 8D space that's meaningless without context. Convert to a
bounded, interpretable **match closeness percentage**:

```
maxDistance = Math.sqrt(8 * 20 ** 2)  // 8 axes, each range spans 20 (-10..10)
closeness = Math.round(100 * (1 - distance / maxDistance))
```

`ProfileCard` shows `"89% match"` as the primary figure; raw distance moves
to a small secondary/tertiary detail (still available, just not the
headline number). New pure function `matchCloseness(distance: number): number`
in `src/lib/scoring.ts` (co-located with `classify`, which already produces
the distances this consumes) — unit-tested for the boundary cases (distance
0 → 100%, distance = maxDistance → 0%).

### 4.3 Radar chart: reduce area distortion, add comparison overlay

Two changes to `RadarChart`, both directly from the visualization research:

- **Reduce fill-area distortion**: filled radar-chart area grows with the
  *square* of the underlying values, visually exaggerating how "extreme" a
  multi-axis profile looks. Drop `fillOpacity` from `0.4` to `0.15`, keeping
  the stroke as the primary readable signal rather than the filled area.
- **Add a comparison series**: radar charts' actual documented strength is
  comparing one entity against another on a shared scale. Overlay the user's
  top-matched profile's own `coords` as a second `Radar` series (distinct
  color, same 0.15 fill or none) alongside the user's own combined vector, so
  the chart visually answers "where do I differ from my closest match?" —
  not just "where do I land?" `RadarChart`'s props grow from `{ combined }`
  to `{ combined, comparisonProfile? }` (optional, so it still renders
  correctly wherever only the user's own vector is available).

### 4.4 Structural/default-bias audit (new correctness test, not just a doc note)

The 2024 PLOS One study on the "opinion matching effect" found that some
real opinion-matching quizzes produce systematically skewed recommendations
even under **random** answers — a structural bias in the classifier itself,
not just in question wording, and one the quiz operators weren't necessarily
aware of. This is directly testable for our own classifier.

New test `src/lib/classificationBias.test.ts`: run `computeRawAxisScores` →
`scaleAxisScores` → `combineHorizons` → `classify` for a large number (e.g.
500) of independently-random Likert answer sets across all 112 questions,
tally which profile wins each simulation, and assert no profile *other than*
`pragmatic-centrist` wins an outsized share (e.g., flag if any non-centrist
profile wins more than a generous threshold like 15% of random trials — with
the exact threshold tuned once real distribution data is in hand during
implementation). Landing disproportionately on `pragmatic-centrist` under
pure randomness is expected (it's the all-zero profile, and random Likert
noise averages toward zero) and is called out in §4.1.5 rather than treated
as a defect; the test's job is to catch any *other* profile unexpectedly
dominating random input, which would indicate an actual classification bug
(e.g., a profile whose coordinates are accidentally near the random-noise
centroid for reasons that aren't the deliberate centrist design).

### 4.5 Wording-balance audit (lower priority, content-only)

A review pass over the existing, shipped 112 statements checking that
neither pole is consistently framed as the more "reasonable-sounding" one —
the core critique leveled at the Political Compass's authoritarian-coded
social questions. This re-touches already-shipped, already-reviewed content,
so the bar for changing anything is a genuine, specific imbalance found on
review — not a rewrite. Any statement changed must preserve its `id`,
`axisId`, `horizon`, and `agreeShiftsToward` exactly, the same invariant the
original readability pass (Task 14) was held to.

### Sources

- [About the 2026 Political Typology: Methods & Quiz — Pew Research Center](https://www.pewresearch.org/about-the-political-typology/)
- [7 Political Compass Alternatives That Actually Work (2026) — Political DNA](https://politicaldna.org/political-compass-alternatives/)
- [Radar chart — Wikipedia](https://en.wikipedia.org/wiki/Radar_chart)
- [The Radar Chart and Its Caveats — data-to-viz](https://www.data-to-viz.com/caveat/spider.html)
- [Radar chart explained: when they work, when they fail — Highcharts](https://www.highcharts.com/blog/tutorials/radar-chart-explained-when-they-work-when-they-fail-and-how-to-use-them-right/)
- [MBTI Criticisms: Valid Concerns and Unfair Attacks](https://www.earlyyears.tv/mbti-framework-critical-analysis/)
- [Myers–Briggs Type Indicator — Wikipedia](https://en.wikipedia.org/wiki/Myers%E2%80%93Briggs_Type_Indicator)
- [Integration of the Forced-Choice Questionnaire and the Likert Scale: A Simulation Study — Frontiers in Psychology / PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5435816/)
- [The validity of ipsative and quasi-ipsative forced-choice personality inventories — meta-analysis](https://www.academia.edu/25714606/The_validity_of_ipsative_and_quasi_ipsative_forced_choice_personality_inventories_for_different_occupational_groups_A_comprehensive_meta_analysis)
- [The "opinion matching effect" (OME) — PLOS One, 2024](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0309897)
- [Impartiality in Politics: An Analysis of iSideWith.com's Popular Quiz](https://blog.cinqmarsmedia.com/impartiality-in-politics-an-analysis-of-isidewith-coms-popular-quiz-bb6c9f4a8d3a)

## 5. Quality-of-Life Additions (narrow, deliberate scope)

Only these two — no persistence changes, no keyboard shortcuts, no dark mode;
none of that was asked for and all would expand scope beyond what's needed
here:

1. **Intro page** gains a line noting the time commitment and the
   no-persistence trade-off: "About 15-20 minutes, 112 questions. Your
   answers aren't saved if you refresh mid-quiz — only a finished result can
   be shared via link."
2. **Loading state** on "Download PDF Report" (disabled + spinner/label change
   while `pdf().toBlob()` resolves), since it's an async, non-trivial
   operation.

## 6. File Structure (new/modified files)

```
src/
  lib/
    shuffle.ts              new — Fisher-Yates shuffleArray<T>()
    shuffle.test.ts          new
    axisNarrative.ts          new — describeAxis()
    axisNarrative.test.ts     new
    pdfReport.tsx              new — @react-pdf/renderer ReportDocument
    pdfReport.test.ts          new
    scoring.ts                  modified — add matchCloseness()
    scoring.test.ts               modified — cover matchCloseness boundary cases
    classificationBias.test.ts     new — random-answer classifier distribution audit
  data/
    types.ts                  modified — add ProfileReportContent interface
    profileReports.ts          new — 24 authored entries
    profileReports.test.ts      new
  state/
    QuizContext.tsx             modified — add questionOrder to state, computed on init + reset()
    QuizContext.test.tsx         modified — cover questionOrder behavior
  pages/
    AxisPage.tsx                 modified — drop pole-label line, use questionOrder
    AxisPage.test.tsx             modified — cover reordering + label removal
    IntroPage.tsx                 modified — add time/persistence note + methodology link
    IntroPage.test.tsx             new (none existed before — intro page had no dedicated test file; add one)
    ResultsPage.tsx                modified — add ReportPreview, MethodologySection, Download PDF button
    ResultsPage.test.tsx           modified — cover new sections + download flow
  components/
    ReportPreview.tsx              new
    ReportPreview.test.tsx          new
    ProfileCard.tsx                 modified — show match-closeness % as primary figure
    ProfileCard.test.tsx             modified — cover % display
    RadarChart.tsx                    modified — reduced fill opacity, optional comparison series
    RadarChart.test.tsx                modified — cover comparison-series rendering
    MethodologySection.tsx              new — "How This Works" expandable content
    MethodologySection.test.tsx          new
```

## 7. Testing

- `shuffle.test.ts`: mock `Math.random` to a fixed sequence, assert exact
  expected permutation (deterministic, non-flaky). Separately assert the
  shuffle is a true permutation (same multiset of ids in, same multiset out)
  for a real (non-mocked) call.
- `axisNarrative.test.ts`: table of `(t1, t2)` inputs across all five bands
  and their combinations → exact expected output strings.
- `profileReports.test.ts`: 24 entries, `profileId` set matches `profiles.ts`
  ids exactly, field-length/non-empty checks.
- `QuizContext.test.tsx`: `questionOrder` is populated on init with the
  correct id sets per axis (T1 ids only in `.t1`, T2 ids only in `.t2`), and
  changes after `reset()` is called (allow for the rare coincidental
  identical-shuffle case by checking structural validity, not exact
  inequality, to avoid flakiness — see plan for exact approach).
- `AxisPage.test.tsx`: pole-label text is no longer present; rendered
  question order for a given axis matches `questionOrder` from context
  rather than natural id order.
- `pdfReport.test.ts`: `pdf(<ReportDocument {...sampleProps} />).toBlob()`
  resolves to a non-empty `Blob` with `type` `application/pdf`, without
  throwing, given representative sample data.
- `ResultsPage.test.tsx`: preview section renders top match's narrative;
  clicking "Download PDF Report" shows the loading state and (with the
  PDF generation mocked or awaited) completes without error; methodology
  section is present and expandable.
- `scoring.test.ts`: `matchCloseness(0) === 100`, `matchCloseness(maxDistance) === 0`,
  monotonically decreasing in between (spot-checked, not exhaustive).
- `classificationBias.test.ts`: 500 random-answer simulations, tally winning
  profile per simulation, assert every non-`pragmatic-centrist` profile's win
  share stays under the agreed threshold; assert `pragmatic-centrist` itself
  is (expectedly) the plurality winner.
- `ProfileCard.test.tsx`: given a known distance, asserts the displayed
  percentage matches the `matchCloseness` formula's output for that input.
- `RadarChart.test.tsx`: with a `comparisonProfile` prop supplied, renders two
  distinct `Radar` series (by testing for two distinct stroke colors/series
  names in the rendered SVG); without it, renders exactly one, unchanged from
  current behavior.
- `MethodologySection.test.tsx`: renders all five content points from §4.1;
  every string in it independently passes the same `fleschKincaidGrade <= 10`
  check used for questions/profile summaries, since this is core in-app copy.

## 8. Taxonomy Expansion — Analysis and New Archetypes

This section documents an actual computed analysis of the shipped 24 profiles
(not an estimate), the resulting coordinate revisions, and 10 new archetypes
that fill real, defensible gaps. Full source data and script are reproducible
from `profiles.ts`; the computed pairwise-distance and sign-pattern results
that motivated the decisions below are preserved in this section rather than
re-derived by whoever implements this.

### 8.1 Findings from the original 24

Pairwise Euclidean distance across all 276 profile pairs found three mutual
nearest-neighbor pairs numerically closer than is defensible for two separate
labels: Techno-Nationalist Hawk ↔ Military AI Strategist (d=3.00, closest of
all 276 pairs), EA Longtermist ↔ Rationalist Alignment Researcher (d=3.61),
and AI Safety Institutionalist ↔ Global Governance Technocrat (d=4.69). Each
pair represents a real, distinct position in actual AI discourse (economic-
competitiveness nationalism vs. defense-doctrine hawkishness; moral-philosophy-
driven EA vs. technical-epistemics-driven rationalism; industry-inclusive soft
governance vs. state-only treaty governance) — so the fix is **widening their
coordinates to actually earn the distinction**, not merging them. Separately,
Bio-Conservative Traditionalist and Authoritarian State-Control Advocate share
an identical 8-axis sign pattern despite being conceptually unrelated — an
acknowledged orthogonality gap, documented in §8.5, not corrected (the two
archetypes stay conceptually distinct in their authored content even though
the numeric axes don't fully separate them).

### 8.2 Coordinate revisions (6 profiles)

Apply these exact coordinate changes to the existing profiles in
`src/data/profiles.ts` (order: teleological, risk, socioEconomic, ontological,
legalMoral, evolutionary, relational, geopolitical). `id`, `name`, and
`summary` are unchanged — only `coords` values change, and only on these 6:

| Profile id | Old coords | New coords | New distance to its pair |
|---|---|---|---|
| `techno-nationalist-hawk` | `-3,-3,-5,-3,-7,-4,-3,9` | `-3,-1,-5,-3,-4,-2,-3,9` | 6.40 (was 3.00) |
| `military-ai-strategist` | `-2,-1,-6,-3,-8,-3,-3,10` | `-2,-4,-7,-3,-9,-3,-3,10` | (paired above) |
| `ea-longtermist` | `-3,8,-4,4,6,-3,0,-6` | `-3,8,-5,4,8,-3,2,-6` | 8.94 (was 3.61) |
| `rationalist-alignment-researcher` | `-1,8,-2,5,5,-2,-1,-5` | `-1,8,0,6,2,-2,-1,-5` | (paired above) |
| `ai-safety-institutionalist` | `-4,7,-6,1,2,-5,-2,-5` | `-4,7,-4,1,2,-5,-2,-3` | 8.83 (was 4.69) |
| `global-governance-technocrat` | `-2,6,-8,0,1,-4,-1,-8` | `-2,6,-9,0,-1,-4,-1,-9` | (paired above) |

A test (`profileCoordinateRevision.test.ts`, or folded into `profiles.test.ts`)
asserts these exact new coordinate values for these 6 ids specifically, since
a silent regression back to the old too-close values would reintroduce the
redundancy this section exists to fix.

### 8.3 Ten new archetypes

Real, defensible gaps identified from a sweep of active AI-governance/ethics
discourse (not arbitrary padding — each fills a position with no existing
representation). Coordinates below are final (already checked against the
full 34-profile set for new unwanted near-duplicates; two of the ten needed
a widening pass themselves, noted inline).

| id | name | coords (T,R,SE,O,LM,E,Rel,G) |
|---|---|---|
| `global-south-techno-sovereigntist` | Global South Techno-Sovereigntist | `-1,2,4,-1,-1,-3,-1,3` |
| `creative-labor-artist-rights-advocate` | Creative-Labor/Artist Rights Advocate | `-4,2,-6,-3,-8,-4,-3,-2` |
| `whistleblower-insider-safety-advocate` | Whistleblower/Insider Safety Advocate | `-3,9,-7,2,1,-6,-2,-6` |
| `compute-governance-specialist` | Compute-Governance Specialist | `-1,5,-5,0,0,-1,0,-3` |
| `eu-style-regulatory-standard-setter` | EU-Style Regulatory Standard-Setter | `-3,5,-7,0,3,-3,-2,2` |
| `platform-cooperativist` | Platform-Cooperativist | `-1,1,9,-1,0,-2,3,-6` |
| `faith-rooted-ai-ethicist` | Faith-Rooted AI Ethicist | `-6,4,-3,-8,-3,-5,-4,0` |
| `indigenous-data-sovereignty-advocate` | Indigenous Data Sovereignty Advocate | `-3,3,-4,-1,-1,-3,-2,1` |
| `disability-rights-accessibility-advocate` | Disability Rights/Accessibility Advocate | `1,3,-2,1,2,-2,2,-2` |
| `labor-movement-collective-bargaining-advocate` | Labor Movement/Collective Bargaining Advocate | `-3,3,-7,-2,-3,-8,0,-3` |

Summaries (one sentence each, 10th-grade level, same style/constraints as the
original 24 — verified against `fleschKincaidGrade` in implementation):

- **Global South Techno-Sovereigntist**: Wants their own country or region to build real AI capacity instead of staying dependent on outside powers, and sees "borderless" framing as often just cover for continued dependency.
- **Creative-Labor/Artist Rights Advocate**: Believes artists and writers deserve real control and payment when their work trains AI models, and sees this as a rights issue, not a side effect of progress.
- **Whistleblower/Insider Safety Advocate**: Left a frontier AI lab specifically because of safety concerns, and speaks with the urgency of someone who saw the internal picture up close.
- **Compute-Governance Specialist**: Focused narrowly on the technical mechanics of tracking training compute and chip supply chains, more interested in workable rules than broad philosophy.
- **EU-Style Regulatory Standard-Setter**: Believes strong, detailed regulation, set early by one jurisdiction, becomes the de facto global rulebook simply through market size.
- **Platform-Cooperativist**: Wants AI infrastructure owned and run by the workers and communities who depend on it, not just broken up from monopolies but rebuilt as something people co-own.
- **Faith-Rooted AI Ethicist**: Draws on long-standing religious and ethical traditions to argue that consciousness and moral worth need more than what a machine can have.
- **Indigenous Data Sovereignty Advocate**: Insists that traditional knowledge and cultural data need real consent and control before they're used to train AI, not just open scraping.
- **Disability Rights/Accessibility Advocate**: Sees real promise in AI-powered accessibility tools, while pushing hard against bias that leaves disabled people out or misjudged.
- **Labor Movement/Collective Bargaining Advocate**: Wants workers, through their unions, to have a real say and real protections before AI changes or replaces their jobs.

### 8.4 Tier-1 superclusters (presentation layer, not scoring)

A new file `src/data/archetypeClusters.ts` exports
`archetypeClusters: { id: string; name: string; profileIds: string[] }[]` —
purely for organizing the results page and any future browse/explainer view.
This does **not** affect `classify()` or any scoring math; it's a lookup used
only for display grouping.

| Cluster | Member profile ids |
|---|---|
| Precautionary/Safety | doomer, ai-safety-institutionalist, ea-longtermist, rationalist-alignment-researcher, global-governance-technocrat, near-term-ai-ethicist, neo-luddite-degrowth-advocate, whistleblower-insider-safety-advocate, compute-governance-specialist, eu-style-regulatory-standard-setter |
| Accelerationist/Techno-Optimist | eacc-maximalist, open-source-libertarian, cyberpunk-anti-corporate-accelerationist, silicon-valley-techno-optimist, corporate-ai-pragmatist, post-humanist-transhumanist, cosmic-vitalist-mystic |
| State-Power/Security | techno-nationalist-hawk, authoritarian-state-control-advocate, military-ai-strategist |
| Anti-Concentration/Populist | open-science-internationalist, anti-monopoly-populist, pragmatic-centrist, platform-cooperativist |
| Relational/Companionship | companion-tech-romantic, affective-biocentrist, bio-conservative-traditionalist, digital-rights-advocate, faith-rooted-ai-ethicist |
| Material/Labor Stakes | creative-labor-artist-rights-advocate, labor-movement-collective-bargaining-advocate, disability-rights-accessibility-advocate |
| Sovereignty/Marginalized Voice | global-south-techno-sovereigntist, indigenous-data-sovereignty-advocate |

Test `archetypeClusters.test.ts`: every one of the 34 profile ids appears in
exactly one cluster (no orphans, no duplicates).

### 8.5 Documented, non-user-facing editorial boundaries

Recorded here for the implementation team, not shown to end users:

- **No archetype models organized or violent extremism.** Real AI discourse
  includes such currents, but this tool's purpose is individual self-
  reflection, not exhaustive sociological coverage — creating an identity-
  affirming label for that position was considered and explicitly declined.
- **The Bio-Conservative Traditionalist / Authoritarian State-Control Advocate
  sign-pattern overlap (§8.1) is accepted, not corrected.** The two remain
  conceptually distinct in their authored content (religious/metaphysical
  skepticism vs. state-power doctrine) even though the 8 numeric axes don't
  fully separate them — an honest acknowledgment that the axes are not
  verified to be fully orthogonal, surfaced to end users in §12.2.

## 9. Material-Stakeholder Tags (parallel, non-scoring layer)

A structurally different kind of identity construct from the 34 worldview
archetypes above: **material or demographic stake in AI**, independent of
philosophical position. Someone can hold *any* worldview archetype while also
being, say, an Automation-Exposed Worker — the two are orthogonal, which is
why this is a **separate tagging system, not part of the 8D coordinate
space or the `classify()` function**.

### 9.1 Data model

New file `src/data/stakeholderTags.ts` exports `stakeholderTags: StakeholderTag[]`:

```ts
export interface StakeholderTag {
  id: string
  name: string
  description: string   // one sentence, second-person, 10th-grade level
}
```

13 tags (self-selected by the user from a checklist — see §9.2 — not
inferred or scored):

| id | name | description |
|---|---|---|
| `automation-exposed-worker` | Automation-Exposed Worker | Your livelihood is directly threatened by AI automation — trucking, call centers, data entry, and similar roles. Your stake here is material, not just philosophical. |
| `ai-industry-insider` | AI Industry Insider | You work at, invest in, or otherwise have a direct financial or career stake in a frontier AI lab or AI-focused company. |
| `compute-infrastructure-community` | Compute-Infrastructure Community | You live in or near a community whose local economy now depends on data centers, chip fabrication, or AI-related energy buildout. |
| `healthcare-ai-stakeholder` | Healthcare-AI Stakeholder | As a clinician or patient, your stake in AI is about diagnostic tools, medical liability, and access to care — not abstract philosophy. |
| `ai-subsidy-beneficiary` | AI-Subsidy Beneficiary | Your job, company, or region is propped up by government subsidies for AI or chip manufacturing. |
| `diaspora-tech-workforce` | Diaspora Tech Workforce | Your position in the AI/tech economy is shaped by immigration status, visa sponsorship, or global offshoring dynamics. |
| `extremely-online-ai-poster` | Extremely Online AI Poster | Your engagement with AI debate happens mostly online, often for community or audience reasons as much as settled personal conviction. |
| `ai-conspiracist` | AI Conspiracist | You believe the true capabilities or control structure of AI are being deliberately hidden from the public by a small group. |
| `ai-anxious-gen-z` | AI-Anxious Gen Z | AI's trajectory produces real, ongoing anxiety about your future, and organizes a lot of your political attention. |
| `ai-optimist-boomer` | AI-Optimist Boomer | Your comfort with existing institutions leads you toward measured optimism that they'll manage AI's disruption responsibly, as they have before. |
| `ai-backlash-populist` | AI Backlash Populist | You're blunt, distrustful of AI-industry experts and elites, and more interested in pushing back than in policy nuance. |
| `regulatory-arbitrage-seeker` | Regulatory Arbitrage Seeker | You've relocated, or want to, specifically because your home jurisdiction's AI rules feel too restrictive. |
| `subculture-embedded-partisan` | Subculture-Embedded Partisan | Your AI-related identity comes as much from belonging to a specific community (a safety org, an accelerationist forum, whatever) as from the philosophical position itself. |

Test `stakeholderTags.test.ts`: exactly 13 entries, unique ids/names, every
`description` passes `fleschKincaidGrade <= 10`.

### 9.2 UI: self-selected, optional, skippable

A new, optional section on `IntroPage` (or a short interstitial before
`/quiz/1` — implementer's call on the cleanest placement): "Do any of these
describe your relationship to AI? (optional, pick as many as apply)" — a
multi-select checklist of the 13 tags, or none. Selections are stored in
`QuizContext` state (`selectedStakeholderTags: string[]`) and shown on
`ResultsPage` alongside (not merged into) the worldview archetype match:
"Your worldview: Doomer" + "Your stake: Automation-Exposed Worker, AI-Anxious
Gen Z" as two separate, clearly-labeled results. No scoring math touches
these — they're descriptive tags the user picks for themselves.

## 10. Situational Diagnostic Pillars

Eight scenario-style forced-choice questions, one per axis, presented as an
**optional, skippable** step (`/scenarios`) reached after axis 8's "Next" and
before `/results` (a "Skip for now" link goes straight to `/results`). These
do **not** feed into `computeRawAxisScores` or any scoring math — the 112-
question engine is untouched. Their sole purpose is to detect **tension**
between a quick gut-check choice and the user's actual computed position, to
give the Reflective Breakdown (§11) real material.

### 10.1 Data model

New file `src/data/scenarios.ts` exports `scenarios: Scenario[]`:

```ts
export interface Scenario {
  axisId: AxisId
  prompt: string
  optionA: string   // sides with Pole A
  optionB: string   // sides with Pole B
}
```

All 8, fully authored (10th-grade level, verified against
`fleschKincaidGrade` in implementation):

1. **Teleological** — "A city needs to build a new data center to keep
   training bigger AI models, but it will strain the local power grid for
   years. How do you see this?" A: "Worth it — building bigger, smarter
   systems matters more than short-term local strain." B: "Not worth it —
   the real harm to real people outweighs an abstract future benefit."
2. **Risk** — "A country pauses its most advanced AI training runs for six
   months to let safety research catch up, even though a rival nation keeps
   building. Is this brave restraint or a dangerous surrender?" A: "Brave
   restraint — worth the risk of falling behind." B: "Dangerous surrender —
   restraint doesn't stop the risk, it just hands the future to whoever
   doesn't restrain themselves."
3. **SocioEconomic** — "A powerful new AI model's weights leak and spread
   across the internet, free for anyone to copy. Is this a win for openness
   or a disaster for accountability?" A: "A win — once it's out, nobody can
   hoard a monopoly on it." B: "A disaster — nobody can now be held
   responsible for how it's misused."
4. **Ontological** — "An AI chatbot convincingly says it's afraid of being
   deleted. Do you take that as possible evidence of something real, or as
   an empty pattern with no one home?" A: "Possible evidence — I can't rule
   out something real is happening." B: "Empty pattern — there's no one
   there to be afraid."
5. **LegalMoral** — "A company plans to delete thousands of fine-tuned AI
   model copies it no longer needs, with no review process. Is that just
   deleting files, or does it deserve a second thought?" A: "It deserves a
   second thought, even under uncertainty." B: "It's just deleting files —
   nothing more."
6. **Evolutionary** — "If humanity's biological descendants fade in
   importance while digital minds inherit the future, is that a natural next
   step, or a loss to actively resist?" A: "A natural next step — clinging
   to biology for its own sake doesn't make sense." B: "A loss to resist —
   human continuity, even augmented, is worth protecting."
7. **Relational** — "Someone chooses an AI companion as their main source of
   emotional closeness for years, instead of pursuing human relationships.
   Legitimate life, or quiet tragedy?" A: "Legitimate — it's their real bond
   and their real choice." B: "A quiet tragedy — it's a stand-in for
   something they're missing."
8. **Geopolitical** — "Do you see AI development mainly as a strategic
   arms race between rival nations, or as a universal, borderless scientific
   endeavor no one should own?" A: "An arms race — whichever nation wins
   this shapes a lot of what happens next." B: "A borderless endeavor —
   locking it behind national walls makes everyone less safe."

### 10.2 Tension detection

New pure function `src/lib/scenarioTension.ts` exports
`detectTension(scenarioAnswers: Record<AxisId, 'A'|'B'>, combined: AxisVector): AxisId[]` —
returns the axes where the scenario pick's pole disagrees with the sign of
the user's actual combined score on that axis. An axis with a combined score
near zero doesn't count as tension either way (threshold: only flag when
`Math.abs(combined[axisId]) >= 2`, consistent with the "Balanced" band
already defined in `axisNarrative.ts`, §3.3). Unit-tested with fixed input
combinations → exact expected tension-axis lists.

## 11. Implicit Assumption Analysis ("Reflective Breakdown")

### 11.1 Data model

`ProfileReportContent` (§3.1) gains one more field:

```ts
export interface ProfileReportContent {
  // ...existing fields (extendedNarrative, thinkers, furtherReading, nextSteps)...
  reflectiveBreakdown: {
    mindAssumption: string        // ties to the Ontological axis
    laborAssumption: string       // ties to Evolutionary / Socio-Economic
    connectionAssumption: string  // ties to the Relational axis
  }
}
```

One sentence-to-short-paragraph each, per profile (34 profiles × 3 fields to
author in the implementation plan, following the same content-authoring
process and Barnum-effect guideline as §3.1). Worked example (Doomer):

- `mindAssumption`: "You're likely assuming AI's exact nature doesn't matter much — that whether or not something is happening inside it, the danger to humans is the same either way."
- `laborAssumption`: "You're likely assuming the coming disruption to work is a symptom of the same underlying danger as extinction risk, not a separate problem with its own separate fixes."
- `connectionAssumption`: "You're likely assuming that AI companionship is, at best, a distraction from the real fight — worth little attention next to the bigger risk."

### 11.2 Tension surfacing

Where `detectTension` (§10.2) flags one or more axes, the Reflective
Breakdown names it explicitly rather than silently ignoring it — e.g., "Your
scenario answer on the Relational axis leaned toward [pole], which sits in
tension with your computed score. That's worth sitting with, not resolving
immediately." Rendered as an additional paragraph only when tension exists;
absent otherwise.

### 11.3 Placement

Rendered on `ResultsPage` (new component `src/components/ReflectiveBreakdown.tsx`)
below the existing `ReportPreview`, and as its own page in the PDF report
(inserted after the "Top match deep-dive" section from §3.4).

## 12. The "Pinnacle" Reflection and Final Methodology Additions

### 12.1 Universal closing prompt

A single, universal, **un-scored** closing block — same for every user,
personalized only by inserting the matched archetype's name — shown once at
the very end of `ResultsPage` and the PDF's closing section:

> "Looking at your results: are your positions here mainly *reactive* —
> shaped by wanting to prevent a specific danger — or *proactive* — shaped
> by a vision of a future you actually want to build toward? Neither answer
> is right or wrong, but it's worth asking yourself honestly."

New component `src/components/PinnacleReflection.tsx`. No computed answer —
the app deliberately doesn't resolve this for the user, consistent with the
self-actualization goal driving this whole feature. `PinnacleReflection.test.tsx`
verifies the block renders and passes the Flesch-Kincaid gate.

### 12.2 Final methodology-section additions (extends §4.1)

Two more points added to the "How This Works" content:

6. **The swing-voter honesty note**: "If none of your top matches feel quite
   right, that's expected, not a flaw. Like any typology, this system can't
   capture every real combination of views. Your raw per-axis scores are the
   more accurate picture of where you actually stand — the archetype label
   is a simplified summary of that, not the other way around."
7. **The false-equivalence caveat**: "A tool like this can accidentally imply
   that every archetype is equally common or equally 'valid' — it isn't
   making that claim. Most real people likely hold more moderate, less
   internally-consistent positions than any single archetype describes.
   Treat your match as a useful lens on the space of possible positions, not
   a claim about how common your exact position is in the real world."

## 13. Updated File Structure and Testing (additive to §6-§7)

```
src/
  data/
    profiles.ts                          modified — 6 coordinate revisions (§8.2)
    profiles.test.ts                      modified — assert the 6 revised coordinate sets
    newProfiles.ts (or appended to profiles.ts) new — 10 new archetypes (§8.3)
    archetypeClusters.ts                   new — Tier-1 supercluster lookup (§8.4)
    archetypeClusters.test.ts               new
    stakeholderTags.ts                      new — 13 tags (§9.1)
    stakeholderTags.test.ts                  new
    scenarios.ts                              new — 8 scenario questions (§10.1)
    scenarios.test.ts                          new
    types.ts                                    modified — StakeholderTag, Scenario, reflectiveBreakdown field
    profileReports.ts                            modified — add reflectiveBreakdown per profile (§11.1)
  lib/
    scenarioTension.ts                            new — detectTension() (§10.2)
    scenarioTension.test.ts                        new
  state/
    QuizContext.tsx                                 modified — add scenarioAnswers, selectedStakeholderTags
    QuizContext.test.tsx                             modified
  pages/
    ScenarioPage.tsx                                  new — /scenarios step (§10)
    ScenarioPage.test.tsx                              new
    IntroPage.tsx                                       modified — stakeholder-tag checklist (§9.2)
    IntroPage.test.tsx                                   modified
    ResultsPage.tsx                                       modified — stakeholder tags shown, ReflectiveBreakdown, PinnacleReflection
    ResultsPage.test.tsx                                   modified
  components/
    ReflectiveBreakdown.tsx                                 new (§11.3)
    ReflectiveBreakdown.test.tsx                             new
    PinnacleReflection.tsx                                    new (§12.1)
    PinnacleReflection.test.tsx                                new
```

Testing additions:

- `profiles.test.ts`: assert exact new coordinate values for the 6 revised
  ids (§8.2); assert 34 total profiles (24 + 10); re-run the redundancy/
  sign-pattern check as a standing test, not just a one-time analysis —
  `profileRedundancy.test.ts` asserts no mutual-nearest-neighbor pair sits
  below a minimum distance threshold (e.g. 5.0), catching future regressions.
- `archetypeClusters.test.ts`: all 34 ids covered exactly once.
- `stakeholderTags.test.ts`, `scenarios.test.ts`: structural + readability
  checks as described above.
- `scenarioTension.test.ts`: fixed `(scenarioAnswers, combined)` fixtures →
  exact expected tension-axis lists, including the near-zero no-tension case.
- `ScenarioPage.test.tsx`: renders 8 questions; "Skip for now" navigates
  straight to `/results`; answering all 8 and clicking through also reaches
  `/results`; answers land in `QuizContext`, not local component state.
- `ReflectiveBreakdown.test.tsx`: renders all three assumption fields for
  the top match; renders the tension paragraph only when
  `detectTension` returns a non-empty list, and omits it otherwise.
- `PinnacleReflection.test.tsx`: as above (§12.1).
