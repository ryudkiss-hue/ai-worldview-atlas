# The AI Worldview Atlas

A 144-statement questionnaire that maps where you land on AI across eight axes and compares you with 50 named viewpoints from the current debate. It is meant for learning and personal reflection.

Live at **[ryudkiss-hue.github.io/ai-worldview-atlas](https://ryudkiss-hue.github.io/ai-worldview-atlas/)**

The Atlas combines two earlier quizzes, the original eight-axis Atlas and the Synthetic Compass on machine minds, into one set of statements so that nothing is measured twice. It is in English only.

---

## Why it exists

Most quizzes about AI opinions sort people along one line, from "for AI" to "against AI". That loses most of the disagreement, because whether AI poses an extinction risk and whether a chatbot could suffer are separate questions that people answer in every combination. The Atlas keeps eight of those questions apart, and groups its 50 viewpoints into seven families so it's easy to see which camps are large and which are narrow.

It also tries to keep the wording of a statement, the order statements appear in and the habit of agreeing from deciding anyone's result. The next two sections describe how.

---

## How the statements are built

Every statement passes five checks:

1. It has a mirrored partner on the same topic, under the same conditions, that takes the other side (ids 1–2, 3–4 and so on). A person who agrees with everything, or disagrees with everything, lands at exactly 0 on every axis.
2. It makes one claim, with no premise bundled in and no second clause a reader could accept on its own.
3. It asks what is true in principle or what should happen, so answers reflect values and judgments; predictions about what will happen are left out.
4. Both statements in a pair are about equally easy to agree with, and neither uses loaded words.
5. Each pair measures its own axis's question. Statements about relationships with AI sit on Relationships, for example, even though they often travel with views on Moral Standing.

Each axis has 9 pairs: 4 about today's and near-term AI (T1) and 5 about what is possible in principle or in the long run (T2). There are four answers and no neutral midpoint, plus "I have no settled view on this", which is left out of the score.

Statements, scenarios, archetype names and report text follow the plain-language rules in [`docs/LANGUAGE_GUIDE.md`](docs/LANGUAGE_GUIDE.md): everyday words, AI systems described as products built and run by people, people described the way they describe themselves, and claims attributed to the people who make them.

---

## The 8 axes

Positive scores lean toward pole A and negative scores toward pole B. The axes fall into four groups: what AI is (1), how we live with it (2 and 3), what future to build (4 and 5), and who decides and how fast (6 to 8).

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

Each axis is also scored separately for T1 and T2, since many people's views differ between the near term and the long run.

---

## The 50 archetypes, in 7 groups

Every archetype belongs to one of seven groups ([`archetypeClusters.ts`](src/data/archetypeClusters.ts)), and each match on the results page names its group and how many archetypes share it.

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

[`profiles.ts`](src/data/profiles.ts) holds each archetype's eight coordinates and one-paragraph summary. Each archetype also has a full report in [`profileReports.ts`](src/data/profileReports.ts) and [`profileExpansions.ts`](src/data/profileExpansions.ts): a narrative, its reasons on each axis, the strongest objections with the replies its supporters give, real-world landmarks with sources, related thinkers, further reading, where to look further, the archetype it's most often confused with and what separates them, and the assumptions it tends to rest on. The reports and a longer essay for each, "The Case for This View" ([`manifestoContents.ts`](src/data/manifestoContents.ts)), describe each view in the third person, as the people who hold it see it.

Every landmark and reading in the reports, and every thinker with an encyclopedia entry, links to the work, record or entry it was checked against ([`reportSources.ts`](src/data/reportSources.ts)). The links came from Open Library, Crossref, arXiv, Wikipedia and web searches, and each one was opened to confirm it points at the thing named; quotations, dates and figures in the reports were checked against those pages, and the ones that didn't hold up were corrected or removed. Each report shows the date the sources were last checked, and a test fails if a reading or landmark has no link.

---

## How scoring works

```
Answer: strongly disagree, disagree, agree, strongly agree  →  -2, -1, +1, +2   ("no settled view" is left out)
   → flipped for pole-B statements, summed per axis and horizon
   → scaled to -10..+10:  10 × sum ÷ (2 × base), where base = statements answered in that horizon,
     never less than half of them (so one strong answer can't give an extreme score)
   → T1 and T2 combined in proportion to their bases, i.e. the average over all answered statements
   → weighted distance to each of the 50 archetypes: √(8 × Σ kᵢΔᵢ² ÷ Σ kᵢ), where kᵢ is your axis weight
     (Less 0.5, Normal 1, More 2) times the archetype's: 2 on axes that define it, 0.5 on axes outside its
     concerns, 0.75 where it says an axis matters less, otherwise 1 (archetypeSalience.ts)
   → the closest 3 shown as average gap per axis (distance ÷ √8)
   → a close call when the second match is less than 0.4 farther away than the first
   → the core-three reading from the tiers of Machine Experience, Moral Standing and Growth and Limits
```

All statements count equally, because there is no response data that would justify weighting one above another. The archetype weights come from each archetype's own text. Without them, an archetype placed at 0 on an axis it barely takes a side on would treat a strong view there as a disagreement. A weight of a quarter was tried for those axes, but on simulated random answer sheets it turned archetypes with many such axes into catch-all matches, so half is the floor. With every weight at 1 the distance is the ordinary Euclidean distance.

The scenarios and stakeholder tags never enter this pipeline, and the 26 thought experiments are unscored. See [`src/lib/scoring.ts`](src/lib/scoring.ts).

### The core-three reading

Results also place you among 27 archetypes built from three axes about AI systems themselves and what they are for: Machine Experience (X), Moral Standing (Y) and Growth and Limits read in reverse (Z, from growth first to within limits). Each axis splits into three tiers at −2 and +2, and the three tiers pick one cell of a 3 × 3 × 3 grid. Each description is built from one sentence per tier, so a tier always reads the same way. See [`coreThree.ts`](src/data/coreThree.ts).

### Safeguards

- Pole labels are hidden while you answer, and statements are reshuffled within each axis on every attempt ([`shuffle.ts`](src/lib/shuffle.ts)).
- Every axis and horizon has as many pole-A as pole-B statements, and a test checks that uniform answer sheets score exactly 0.
- Matches lead with the average gap per axis, which follows the ranking, along with how many axes put you on the same side as the archetype and the two axes where you differ most. An earlier match percentage put very different archetypes in the 70s and 80s, so it was dropped.
- A close call is flagged when the top two archetypes are less than 0.4 apart. In simulation on synthetic sheets ([`analysis/closecall_sim.py`](analysis/closecall_sim.py)), below that gap a different handful of statements on the same themes swaps the top match about half the time. The notice names the axes that separate the two.
- [`classificationBias.test.ts`](src/lib/classificationBias.test.ts) classifies 500 seeded random answer sheets and fails if any archetype other than Pragmatic Centrist wins 15% or more of them.
- [`profileRedundancy.test.ts`](src/data/profileRedundancy.test.ts) fails if any two archetypes sit closer than 5.0 apart. It caught three near-duplicate pairs during development. It doesn't guarantee that archetypes win equal shares of random sheets.
- Statements are held to a Flesch-Kincaid grade of 15 or below with an average between 8 and 12, profile summaries, scenarios and tag descriptions to 14, and the How This Works text to 10 ([`readability.ts`](src/lib/readability.ts)). The reports are read after scoring and are exempt.
- Stakeholder tags (what you have at stake, such as a job that could be automated) are kept in their own state, never reach `computeRawAxisScores` or `classify`, and appear on the results page as a separate section.
- Each answer scale is a labelled radio group named by its statement, and the arrow, Home and End keys move between its four answers. An automated accessibility scan (axe) of every page finds no violations; a pass with a real screen reader is still worth doing by hand.
- The How This Works section on the results page says plainly that the Atlas hasn't been through psychometric testing, and explains the answer scale, the "no settled view" choice and how matching weights each axis.

---

## Other parts of the site

- The short version uses 48 of the 144 statements, three mirrored pairs per axis ([`shortForm.ts`](src/data/shortForm.ts)). Its scores sit on the same −10 to +10 scale with less precision, and the results page offers to answer the other 96 without losing anything.
- "What matters most to you" on the results page lets you mark any axis Less, Normal or More. Only the archetype ranking changes; your scores stay the same, and the weights travel in share links.
- "Statement by statement" sets your answer to each statement beside the answer each of your three closest archetypes would be expected to give. Archetypes never answered anything, so those answers are estimated from the archetype's position on that axis (strongly agree at 6 or more toward the statement's pole, agree at 2 or more, no clear lean in between), and the page says so.
- The focus module on friends, partners and therapists (`/intimacy`) has 18 mirrored statements on AI as a best friend, partner or therapist and what that may do to attachment, critical thinking, identity, loneliness and intimacy ([`intimacyModule.ts`](src/data/intimacyModule.ts)). It has its own score, theme breakdown, reflection questions and a research summary that covers both sides, drawing on the American Psychological Association's 2025 health advisories, the World Health Organization's Commission on Social Connection, peer-reviewed studies and WIRED. It never touches the Atlas score, the match or share links.
- "Compare with someone" (`/compare`) takes two share links and sets the two results side by side, axis by axis, with each person's closest archetype and the widest gaps. The links carry the scores, so nothing is sent anywhere ([`compare.ts`](src/lib/compare.ts)).
- Each match card names the axes that count double for that archetype and the ones that count for less, the same weights the match uses.
- The 26 thought experiments (`/thought-experiments`, listed in [`THOUGHT_EXPERIMENTS.md`](THOUGHT_EXPERIMENTS.md)) are short dilemmas with discussion questions.
- The paper edition is a 39-page printable booklet ([`public/ai-worldview-atlas-paper.pdf`](public/ai-worldview-atlas-paper.pdf)) with the same statements and hand scoring by addition and a lookup table. Entering its 16 nets and counts of "no settled view" at `/paper` gives the exact online results. The intro page links to both.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 and TypeScript, built with Vite 8 |
| Routing | React Router 7 (`HashRouter`, for static GitHub Pages hosting); pages after the quiz load on demand |
| State | One `QuizContext` (`useReducer`) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| PDF export | `@react-pdf/renderer`, in the browser, loaded only when you download a report |
| Tests | Vitest and React Testing Library |
| Hosting | GitHub Pages, deployed by GitHub Actions on every push to `master` |

There is no backend, database, analytics or account system. Answers are saved as you go in your browser's local storage, so a refresh or a closed tab doesn't lose them, and "Start over" clears them. A finished result can become a share link (your raw per-axis scores and answered counts, base64-encoded into the URL; see [`shareLink.ts`](src/lib/shareLink.ts)), a PDF or an image, and nothing is sent to a server.

---

## Project structure

```
src/
├── data/
│   ├── axes.ts                  8 axis definitions (id, name, question, poles)
│   ├── questions/               144 statements in mirrored pairs, 18 per axis, one file per axis
│   ├── profiles.ts              50 archetypes: id, name, coordinates, summary
│   ├── archetypeClusters.ts     the 7 groups
│   ├── archetypeSalience.ts     which axes define each archetype and which fall outside its concerns
│   ├── profileReports.ts        report content per archetype
│   ├── profileExpansions.ts     added narrative, axis reasons, objections and landmarks
│   ├── reportSources.ts         checked links for every reading, landmark and thinker, and the date they were checked
│   ├── manifestoContents.ts     the 50 "Case for This View" essays
│   ├── coreThree.ts             the 27-archetype core-three reading
│   ├── shortForm.ts             the 48-statement short version
│   ├── scenarios.ts             8 optional scenarios
│   ├── stakeholderTags.ts       13 optional stakeholder tags
│   ├── intimacyModule.ts        the focus module: statements, scoring, research and sources
│   ├── thoughtExperiments.ts    the 26 thought experiments
│   └── types.ts                 shared TypeScript interfaces
├── lib/
│   ├── scoring.ts               the scoring pipeline above
│   ├── shareLink.ts             results in a URL
│   ├── compare.ts               two results from share links, axis by axis
│   ├── resultHistory.ts         earlier results in this browser, for comparison
│   ├── axisPositions.ts         an archetype's positions in words; biggest gaps between two positions
│   ├── statementComparison.ts   expected answers of an archetype
│   ├── readability.ts           Flesch-Kincaid grade checker
│   ├── pdfReport.tsx            the PDF report
│   └── shareCard.ts             the share image
├── state/QuizContext.tsx         answers, order, tags, scenario picks, version, weights, focus-module answers
├── components/                  RadarChart, ProfileCard, ReportPreview, MethodologySection, ...
└── pages/                       Intro, Axis (/quiz/:n), Scenario, Results, Compare, ThoughtExperiments, Intimacy, PaperScores (/paper)
paper/                           the booklet builder (build.py, render.py) and its check against the app (verify.py)
analysis/                        the close-call simulation and its reference data
scripts/                         exporters that write the booklet and simulation data from the quiz source
docs/LANGUAGE_GUIDE.md           the writing rules
```

---

## Running it locally

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # the Vitest suite
npm run build     # type-check and production build to dist/
npm run preview   # serve the production build
```

The close-call simulation and the booklet are rebuilt from the quiz source:

```bash
npx vite-node scripts/export_sim_reference.ts && python3 analysis/closecall_sim.py   # add --short or --equal
npx vite-node scripts/export_paper_data.ts && python3 paper/build.py && python3 paper/render.py
npx vite-node paper/gen_engine.ts && python3 paper/verify.py                         # booklet vs app, 3,000 synthetic sheets
```

Tests fail if either data file drifts from the quiz. The booklet render needs Python Playwright.

---

## Extending it

- The sign convention (positive = pole A), the linear scaling and the mirrored pairs hold the scoring together. A new statement needs its mirrored partner on the same axis and horizon, and `questions/index.test.ts` fails without one. Changing the statements or the scaling also means bumping `SHARE_LINK_VERSION` and checking that the 50 archetypes are still recovered.
- A new archetype needs coordinates, a group, its axis weights in `archetypeSalience.ts` and a report. The redundancy test names any existing archetype it sits too close to.
- Statements stay at or below grade 15 (average 8 to 12) and the How This Works text at or below grade 10; tests check both with `fleschKincaidGrade()`.
- Stakeholder tags and scenario answers stay out of `computeRawAxisScores` and `classify`. That separation is deliberate and tested.

---

## Disclaimer

The Atlas is a tool for learning, self-reflection and discussion, made for anyone curious about the debate over AI. It hasn't been through test-retest reliability studies, factor analysis or independent peer review, so it isn't a validated psychometric instrument. Your result is a starting point for conversation and a way to see the shape of a crowded debate.
