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
