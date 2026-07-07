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
6. Two runner-up matches — condensed (name, summary, distance, one paragraph)
7. Closing further-reading/next-steps roundup (deduplicated across the three
   matches shown)

`ResultsPage` gains a "Download PDF Report" button that calls
`pdf(<ReportDocument ... />).toBlob()` (the imperative `@react-pdf/renderer`
API, not `PDFDownloadLink`, for explicit control over a loading state),
creates an object URL, triggers a download via a temporary anchor element,
then revokes the URL. The button shows a disabled/spinner state while the
blob is being generated, since multi-page PDF generation isn't instant.

## 4. Quality-of-Life Additions (narrow, deliberate scope)

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

## 5. File Structure (new/modified files)

```
src/
  lib/
    shuffle.ts              new — Fisher-Yates shuffleArray<T>()
    shuffle.test.ts          new
    axisNarrative.ts          new — describeAxis()
    axisNarrative.test.ts     new
    pdfReport.tsx              new — @react-pdf/renderer ReportDocument
    pdfReport.test.ts          new
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
    IntroPage.tsx                 modified — add time/persistence note
    IntroPage.test.tsx             new (none existed before — intro page had no dedicated test file; add one)
    ResultsPage.tsx                modified — add ReportPreview + Download PDF button
    ResultsPage.test.tsx           modified — cover new section + download flow
  components/
    ReportPreview.tsx              new
    ReportPreview.test.tsx          new
```

## 6. Testing

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
  PDF generation mocked or awaited) completes without error.
