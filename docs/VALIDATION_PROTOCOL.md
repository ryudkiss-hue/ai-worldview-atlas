# Validation protocol for the AI Worldview Atlas

**Protocol 2.0, fixed 2026-11-13.** This protocol is written before any responses are collected. It says what data will be gathered, which responses will be set aside, what will be measured, and what each result would lead to. Changing any rule or threshold after this date is a deviation: it goes in the log at the end, with a date and a reason, before the data it affects are analysed.

It replaces the Synthetic Compass study protocol (1.2), which covered the earlier three-axis quiz, and the older pilot plan that used to sit in `PILOT_TESTING_PROTOCOL.md`.

## 1. What is being tested

The Atlas claims to place people on eight axes and to name the archetypes closest to them. Before anyone leans on those claims, four questions need answers from real responses:

1. **Does each axis hang together?** The 18 statements on an axis should agree with each other (reliability).
2. **Do the mirrored pairs work as opposites, and does the mirroring cancel a habit of agreeing?**
3. **Are the eight axes distinct**, rather than two or three underlying views measured several times?
4. **Do the results mean anything to the person?** People who pick a viewpoint for themselves should land near it, and people who take the quiz twice should land in about the same place.

## 2. Instrument

| Record | Value |
|---|---|
| Item set | 144 statements, 8 axes × 9 mirrored pairs; identifier `2026-11-13-61dbdadfc894` (first 12 hex digits of the SHA-256 of `id\|statement` lines) |
| Scoring | As in `src/lib/scoring.ts`: linear, −10 to +10 per axis; "no settled view" = 0; tiers at ±2; close call when the top two archetypes are less than 0.3 apart |
| Archetypes | 50, coordinates as in `src/data/profiles.ts` on 2026-11-13 |
| Analysis script | `analysis/analyze_atlas.py`, SHA-256 `67b814ac705b8e07…`; reference data `analysis/atlas_reference.json`, SHA-256 `0080d52f9ea06a78…` |
| Attention checks | Two optional statements (901 asks for "Disagree", 902 for "Strongly agree"), never scored |

A test in the repository (`src/data/analysisReference.test.ts`) fails if the reference data drifts from the quiz's own statements, directions or coordinates.

## 3. Data collection

Responses come from the Google Forms edition (`forms/AIWorldviewAtlasForm.gs`), which the study owner sets up in their own Google account. The online quiz sends nothing anywhere and is not a data source.

- **Consent.** The form's first question asks whether the answers may be used in the study. Only "Yes" responses are analysed. No name is asked for. Email is collected only if the owner turns on emailed results, and the analysis never reads it.
- **Self-identification (optional).** Before answering, a person may pick the one of the 50 viewpoint names that sounds closest to their own, from the names alone.
- **Retest code (optional).** A made-up code word links a later retake to the first one.
- **Answers tab.** The form script writes one row per response to an "Answers" tab: the item-set identifier, consent, self-identification, retest code, the two checks, and all 144 answers (−2 to +2, 0 = no settled view). The analysis reads this tab, downloaded as CSV.
- **Who.** Adults (18+). Recruitment should aim for spread across the axes rather than one community; the report states where respondents were recruited.

## 4. Exclusions (fixed)

A response is set aside if any of these apply. Each exclusion is listed with its reason in `exclusions.csv`.

| Rule | Condition |
|---|---|
| E1 | Item set differs from `2026-11-13-61dbdadfc894`, or the answer row is incomplete |
| E2 | Duplicate response ID (the first is kept) |
| E3 | Consent is not "Yes" |
| E4 | More than 36 of 144 statements (25%) answered "no settled view" |
| E5 | 90% or more of answered statements given the identical answer |
| E6 | Either check statement answered, and answered differently from what it asks (skipping a check is fine) |

Flag only, not excluded: 20 or more mirrored pairs answered with the same strong answer on both sides.

## 5. Analyses and what each result would lead to

Each analysis runs only when its minimum sample is met; otherwise the report says it was not run.

| | Analysis | Minimum N | Criterion | If it fails |
|---|---|---|---|---|
| A2 | Cronbach's alpha per axis (18 statements, with 95% bootstrap CI) and per time frame | 30 | ≥ 0.70 acceptable; 0.60–0.70 marginal; < 0.60 needs revision | Revise the axis's weakest pairs (from A3) before further data collection |
| A3 | Correlation between mirrored partners; each statement's correlation with the rest of its axis | 30 | Partners below −0.10; item-rest ≥ 0.20 | Rewrite flagged pairs; a pair that fails twice is replaced |
| A4 | Correlation of each person's average raw answer with each axis score | 30 | Small (|r| < 0.20 expected) | Check pair balance on that axis |
| A5 | Correlations between axis scores | 100 | No pair at |r| ≥ 0.70 | Consider merging or redefining the two axes |
| A6 | Standard error of measurement per axis; implied tier boundary = 1.96 × SEM, to the nearest 0.5, between 1 and 4 | 200 | Applied only where alpha ≥ 0.70 | Boundary stays at ±2 for that axis |
| A7 | Close-call margin: for each person, how often the top match survives resampling their statements; the gap that best separates "survives under half the time" | 200 | Report suggested margin | Adopt the suggested margin |
| A8 | Distribution of top matches | any | Descriptive | — |
| A9 | Share of self-identifiers whose chosen viewpoint is their top match, and in their top three | 100 with a choice | Well above chance (2% and 6%) | If top-three agreement is below 25%, archetype matching is presented as exploratory only |
| A10 | Retest: same code, at least 7 days apart; per-axis correlation and same-top-match rate | 30 pairs | Axis r ≥ 0.70 | Axes below 0.70 are reported as unstable in the methodology text |
| A11 | Archetype coordinates against the mean scores of people who chose that archetype | 15 per archetype | Coordinate within 2 points of the mean, or inside its 95% CI | Move the coordinate to the rounded mean; log it below |

## 6. Reporting

Every report states the protocol version, the SHA-256 of the input file, the script and the reference data, the item-set identifier, the random seed, the number of responses before and after exclusions, and the count excluded by each rule. Results are reported whether or not they favour the quiz. A test run on synthetic data (`analysis/make_test_data.py`) must use `--test`, and every output is then labeled as synthetic; the script refuses to mix the two.

## 7. What the quiz says until then

Until A2, A9 and A10 have run on real data, the quiz's methodology note says plainly that it has not been validated, and archetype matches are framed as prompts to reflect, not measurements.

## Changes made before this protocol was fixed

These were made on 2026-11-13, before any responses existed, and are recorded so the starting point is clear.

- Seven mirrored pairs rewritten: 43/44 (romantic relationships with AI, replacing a pair about children), 59/60 (general intelligence or tools for needs, replacing local power bills), 63/64 (sacrifices for spreading intelligence beyond Earth), 75/76 (keeping up skills AI does better, replacing human review of automated decisions), 97/98 (pulling AI systems after a serious accident), 123/124 (responsibility for openly released models, replacing a weapons pair), 133/134 (researchers from rival countries, replacing cultural data).
- Five coordinates corrected where an archetype's own manifesto argued the other side of the axis: Techno-Nationalist Hawk (Ends of Intelligence −3 → +4, Risk −1 → −6), AI-for-Global-Development Optimist (Risk +4 → −4), Effective Altruist Longtermist (Ends of Intelligence −3 → +7), AI Safety Institutionalist (Moral Standing +2 → −2).
- Close-call margin set to 0.3 by simulation (`analysis/closecall_sim.py`: synthetic answer sheets only).

## Deviation log

| Date | Change | Reason |
|---|---|---|
| 2026-11-13 | Four web-only features added after the protocol was fixed: a 48-statement short version (three mirrored pairs per axis), optional axis weights (Less ×0.5, Normal, More ×2) that change only the archetype ranking, a statement-by-statement comparison with the top three archetypes, and an optional 18-statement focus module on synthetic intimacy with its own score. None of them is part of the study instrument: the Form still asks all 144 statements, scores with equal weights and never shows the module. Short-version and weighted results are not study data. Two exploratory checks are added and will be reported as exploratory, not as tests of this protocol: (E1) rescore each included full sheet on the 48 short-version statements and report, per axis, the correlation with the full score and how often the top archetype stays the same; (E2) rerun the close-call simulation for the short version on real sheets (the synthetic run gave the same 0.3 margin). | Requested features for quiz takers. Logged so the fixed analyses stay as written and the new features are not mistaken for validated ones. |
