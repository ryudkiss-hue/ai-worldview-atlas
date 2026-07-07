# Bias Reduction, Detailed Reports & Taxonomy Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add bias-reduction UX changes, a detailed per-user report (inline preview + PDF), an expanded 34-archetype taxonomy with Tier-1 clusters, material-stakeholder tags, situational scenario questions, a Reflective Breakdown, and a Pinnacle Reflection to the shipped TIAM-112 diagnostic app.

**Architecture:** Builds entirely on the existing app (24→34 profiles, `QuizContext` gains three new pieces of state, one new optional route `/scenarios`, several new data/lib modules, several new/modified components). No changes to the core 112-question content, the scoring formula, or routing structure beyond inserting `/scenarios`.

**Tech Stack:** Same as the shipped app (Vite, React, TypeScript, Tailwind, React Router, Recharts, Vitest, React Testing Library) plus `@react-pdf/renderer` for PDF generation (new dependency).

## Global Constraints

- Sign convention unchanged: positive = Pole A, negative = Pole B, for every axis.
- Scaling formula unchanged: `10 * Math.tanh(raw / 3.5)`.
- The core 112 questions and their `agreeShiftsToward` values are NOT modified by this plan.
- Material-stakeholder tags and scenario answers never feed into `computeRawAxisScores`/`classify` — they are display-only / tension-detection-only.
- Every new piece of in-app UI copy (MethodologySection, IntroPage additions) must pass `fleschKincaidGrade <= 10`. Long-form report content (profileReports fields) is explicitly exempt from this ceiling per the design spec.
- All monetary/factual claims about real people in `thinkers[]` describe documented public work only — never a claim about personal views, quiz results, or endorsement.
- Project root: `C:\Users\ryudk\Desktop\tiam-diagnostic`.
- Design spec: `docs/superpowers/specs/2026-07-07-bias-reduction-and-reports-design.md` — consult it for full rationale; this plan contains the concrete tasks and content.

---

### Task 1: Core type additions

**Files:**
- Modify: `src/data/types.ts`
- Test: `src/data/types.test.ts`

**Interfaces:**
- Produces: `StakeholderTag`, `Scenario`, `ProfileReportContent` (with `reflectiveBreakdown`) interfaces, consumed by nearly every later task in this plan.

- [ ] **Step 1: Write the failing test `src/data/types.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import type { StakeholderTag, Scenario, ProfileReportContent } from './types'

describe('new type shapes compile and hold expected fields', () => {
  it('StakeholderTag has id, name, description', () => {
    const tag: StakeholderTag = { id: 'x', name: 'X', description: 'desc' }
    expect(tag.id).toBe('x')
  })

  it('Scenario has axisId, prompt, optionA, optionB', () => {
    const scenario: Scenario = { axisId: 'teleological', prompt: 'p', optionA: 'a', optionB: 'b' }
    expect(scenario.axisId).toBe('teleological')
  })

  it('ProfileReportContent has reflectiveBreakdown with three assumption fields', () => {
    const content: ProfileReportContent = {
      profileId: 'doomer',
      extendedNarrative: ['p1', 'p2'],
      thinkers: [{ name: 'N', bio: 'B', connection: 'C' }],
      furtherReading: [{ title: 'T', author: 'A', note: 'N' }],
      nextSteps: ['step'],
      reflectiveBreakdown: { mindAssumption: 'm', laborAssumption: 'l', connectionAssumption: 'c' },
    }
    expect(content.reflectiveBreakdown.mindAssumption).toBe('m')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/types.test.ts`
Expected: FAIL — `StakeholderTag`, `Scenario`, `ProfileReportContent` don't exist yet.

- [ ] **Step 3: Append to `src/data/types.ts`** (after the existing `Profile` interface — do not remove or modify `AxisId`, `Axis`, `Horizon`, `Question`, or `Profile`)

```ts

export interface StakeholderTag {
  id: string
  name: string
  description: string
}

export interface Scenario {
  axisId: AxisId
  prompt: string
  optionA: string
  optionB: string
}

export interface ProfileReportContent {
  profileId: string
  extendedNarrative: string[]
  thinkers: {
    name: string
    bio: string
    connection: string
  }[]
  furtherReading: {
    title: string
    author: string
    note: string
  }[]
  nextSteps: string[]
  reflectiveBreakdown: {
    mindAssumption: string
    laborAssumption: string
    connectionAssumption: string
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/types.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/types.ts src/data/types.test.ts
git commit -m "feat: add StakeholderTag, Scenario, ProfileReportContent types"
```

---

### Task 2: Shuffle utility

**Files:**
- Create: `src/lib/shuffle.ts`
- Test: `src/lib/shuffle.test.ts`

**Interfaces:**
- Produces: `shuffleArray<T>(items: T[]): T[]`, consumed by Task 3 (`QuizContext`).

- [ ] **Step 1: Write the failing test `src/lib/shuffle.test.ts`**

```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { shuffleArray } from './shuffle'

describe('shuffleArray', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns a permutation containing exactly the same elements', () => {
    const input = [1, 2, 3, 4, 5]
    const result = shuffleArray(input)
    expect(result.slice().sort()).toEqual(input.slice().sort())
    expect(result).toHaveLength(input.length)
  })

  it('does not mutate the input array', () => {
    const input = [1, 2, 3]
    const copy = [...input]
    shuffleArray(input)
    expect(input).toEqual(copy)
  })

  it('produces the exact deterministic order for a mocked random sequence', () => {
    const sequence = [0.9, 0.1, 0.5, 0.0]
    let i = 0
    vi.spyOn(Math, 'random').mockImplementation(() => sequence[i++])
    const result = shuffleArray(['a', 'b', 'c', 'd', 'e'])
    // Fisher-Yates from index 4 down to 1, using the mocked sequence above:
    // i=4: j=Math.floor(0.9*5)=4 -> swap(4,4) no-op -> [a,b,c,d,e]
    // i=3: j=Math.floor(0.1*4)=0 -> swap(3,0) -> [d,b,c,a,e]
    // i=2: j=Math.floor(0.5*3)=1 -> swap(2,1) -> [d,c,b,a,e]
    // i=1: j=Math.floor(0.0*2)=0 -> swap(1,0) -> [c,d,b,a,e]
    expect(result).toEqual(['c', 'd', 'b', 'a', 'e'])
  })

  it('handles an empty array without throwing', () => {
    expect(shuffleArray([])).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/shuffle.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/lib/shuffle.ts`**

```ts
export function shuffleArray<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/shuffle.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/shuffle.ts src/lib/shuffle.test.ts
git commit -m "feat: add Fisher-Yates shuffle utility"
```

---

### Task 3: QuizContext extensions (questionOrder, scenarioAnswers, selectedStakeholderTags)

**Files:**
- Modify: `src/state/QuizContext.tsx` (full replacement — shown complete below)
- Modify: `src/state/QuizContext.test.tsx` (full replacement — shown complete below)

**Interfaces:**
- Consumes: `shuffleArray` (Task 2), `axes` (existing), `questionsForAxis` (existing), `AxisId` (Task 1/existing).
- Produces: `useQuiz()` now also returns `questionOrder: Record<AxisId, {t1: number[]; t2: number[]}>`, `scenarioAnswers: Partial<Record<AxisId,'A'|'B'>>`, `selectedStakeholderTags: string[]`, `setScenarioAnswer(axisId, choice)`, `setStakeholderTags(tagIds)`. Consumed by Tasks 4, 11, 13, 30.

- [ ] **Step 1: Write the failing test — replace `src/state/QuizContext.test.tsx` entirely**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizProvider, useQuiz } from './QuizContext'
import { axes } from '../data/axes'

function TestConsumer() {
  const { answers, setAnswer, reset, questionOrder, scenarioAnswers, setScenarioAnswer, selectedStakeholderTags, setStakeholderTags } = useQuiz()
  return (
    <div>
      <span data-testid="answer-1">{answers[1] ?? 'unset'}</span>
      <span data-testid="order-teleological-t1-length">{questionOrder.teleological.t1.length}</span>
      <span data-testid="scenario-teleological">{scenarioAnswers.teleological ?? 'unset'}</span>
      <span data-testid="tags">{selectedStakeholderTags.join(',')}</span>
      <button onClick={() => setAnswer(1, 4)}>answer</button>
      <button onClick={() => setScenarioAnswer('teleological', 'A')}>scenario</button>
      <button onClick={() => setStakeholderTags(['automation-exposed-worker'])}>tags</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}

describe('QuizContext', () => {
  it('builds a questionOrder with 7 T1 ids per axis on init', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    expect(screen.getByTestId('order-teleological-t1-length').textContent).toBe('7')
  })

  it('records an answer, a scenario answer, and stakeholder tags independently', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    fireEvent.click(screen.getByText('answer'))
    fireEvent.click(screen.getByText('scenario'))
    fireEvent.click(screen.getByText('tags'))
    expect(screen.getByTestId('answer-1').textContent).toBe('4')
    expect(screen.getByTestId('scenario-teleological').textContent).toBe('A')
    expect(screen.getByTestId('tags').textContent).toBe('automation-exposed-worker')
  })

  it('reset clears answers, scenario answers, and tags, and rebuilds questionOrder', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    fireEvent.click(screen.getByText('answer'))
    fireEvent.click(screen.getByText('scenario'))
    fireEvent.click(screen.getByText('tags'))
    fireEvent.click(screen.getByText('reset'))
    expect(screen.getByTestId('answer-1').textContent).toBe('unset')
    expect(screen.getByTestId('scenario-teleological').textContent).toBe('unset')
    expect(screen.getByTestId('tags').textContent).toBe('')
    expect(screen.getByTestId('order-teleological-t1-length').textContent).toBe('7')
  })

  it('questionOrder covers all 8 axes', () => {
    render(<QuizProvider><TestConsumer /></QuizProvider>)
    // Indirect check: rendering above didn't throw for 'teleological'; explicitly
    // verify the axes list length matches what QuizProvider is expected to cover.
    expect(axes).toHaveLength(8)
  })

  it('throws if useQuiz is called outside a QuizProvider', () => {
    function Broken() {
      useQuiz()
      return null
    }
    expect(() => render(<Broken />)).toThrow('useQuiz must be used within a QuizProvider')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/state/QuizContext.test.tsx`
Expected: FAIL — `questionOrder`, `scenarioAnswers`, `setScenarioAnswer`, `selectedStakeholderTags`, `setStakeholderTags` don't exist on the context value yet.

- [ ] **Step 3: Replace `src/state/QuizContext.tsx` entirely**

```tsx
import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { AxisId } from '../data/types'
import { axes } from '../data/axes'
import { questionsForAxis } from '../data/questions'
import { shuffleArray } from '../lib/shuffle'

export type QuestionOrder = Record<AxisId, { t1: number[]; t2: number[] }>

function buildQuestionOrder(): QuestionOrder {
  const order = {} as QuestionOrder
  axes.forEach((axis) => {
    const axisQuestions = questionsForAxis(axis.id)
    const t1Ids = shuffleArray(axisQuestions.filter((q) => q.horizon === 'T1').map((q) => q.id))
    const t2Ids = shuffleArray(axisQuestions.filter((q) => q.horizon === 'T2').map((q) => q.id))
    order[axis.id] = { t1: t1Ids, t2: t2Ids }
  })
  return order
}

interface QuizState {
  answers: Record<number, number>
  questionOrder: QuestionOrder
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>
  selectedStakeholderTags: string[]
}

function buildInitialState(): QuizState {
  return {
    answers: {},
    questionOrder: buildQuestionOrder(),
    scenarioAnswers: {},
    selectedStakeholderTags: [],
  }
}

type QuizAction =
  | { type: 'ANSWER'; questionId: number; value: number }
  | { type: 'ANSWER_SCENARIO'; axisId: AxisId; choice: 'A' | 'B' }
  | { type: 'SET_STAKEHOLDER_TAGS'; tagIds: string[] }
  | { type: 'RESET' }

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER':
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } }
    case 'ANSWER_SCENARIO':
      return { ...state, scenarioAnswers: { ...state.scenarioAnswers, [action.axisId]: action.choice } }
    case 'SET_STAKEHOLDER_TAGS':
      return { ...state, selectedStakeholderTags: action.tagIds }
    case 'RESET':
      return buildInitialState()
    default:
      return state
  }
}

interface QuizContextValue {
  answers: Record<number, number>
  questionOrder: QuestionOrder
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>
  selectedStakeholderTags: string[]
  setAnswer: (questionId: number, value: number) => void
  setScenarioAnswer: (axisId: AxisId, choice: 'A' | 'B') => void
  setStakeholderTags: (tagIds: string[]) => void
  reset: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, undefined, buildInitialState)

  const value: QuizContextValue = {
    answers: state.answers,
    questionOrder: state.questionOrder,
    scenarioAnswers: state.scenarioAnswers,
    selectedStakeholderTags: state.selectedStakeholderTags,
    setAnswer: (questionId, val) => dispatch({ type: 'ANSWER', questionId, value: val }),
    setScenarioAnswer: (axisId, choice) => dispatch({ type: 'ANSWER_SCENARIO', axisId, choice }),
    setStakeholderTags: (tagIds) => dispatch({ type: 'SET_STAKEHOLDER_TAGS', tagIds }),
    reset: () => dispatch({ type: 'RESET' }),
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext)
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/state/QuizContext.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/state/QuizContext.tsx src/state/QuizContext.test.tsx
git commit -m "feat: add questionOrder, scenarioAnswers, selectedStakeholderTags to QuizContext"
```

---

### Task 4: AxisPage — drop pole labels, use shuffled order, route to /scenarios

**Files:**
- Modify: `src/pages/AxisPage.tsx` (full replacement)
- Modify: `src/pages/AxisPage.test.tsx` (full replacement)

**Interfaces:**
- Consumes: `questionOrder` from `useQuiz()` (Task 3).
- Produces: axis 8's "Next" now navigates to `/scenarios` instead of `/results` (Task 11 wires `/scenarios` itself).

- [ ] **Step 1: Write the failing test — replace `src/pages/AxisPage.test.tsx` entirely**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AxisPage } from './AxisPage'
import { QuizProvider } from '../state/QuizContext'

function renderAxisPage(initialAxis: number) {
  return render(
    <QuizProvider>
      <MemoryRouter initialEntries={[`/quiz/${initialAxis}`]}>
        <Routes>
          <Route path="/quiz/:axisIndex" element={<AxisPage />} />
          <Route path="/scenarios" element={<p>Scenarios Page</p>} />
          <Route path="/" element={<p>Intro Page</p>} />
        </Routes>
      </MemoryRouter>
    </QuizProvider>,
  )
}

describe('AxisPage', () => {
  it('shows the axis name but not the pole-vs-pole label', () => {
    renderAxisPage(1)
    expect(screen.getByText('Teleological')).toBeInTheDocument()
    expect(screen.queryByText(/vs\./)).not.toBeInTheDocument()
  })

  it('still renders exactly 14 questions (7 T1 + 7 T2), now in shuffled order', () => {
    renderAxisPage(1)
    expect(screen.getAllByRole('radio', { name: 'Strongly Agree' })).toHaveLength(14)
  })

  it('disables Next until all 14 questions on the page are answered', () => {
    renderAxisPage(1)
    const nextButton = screen.getByRole('button', { name: 'Next' })
    expect(nextButton).toBeDisabled()
    screen.getAllByRole('radio', { name: 'Strongly Agree' }).forEach((radio) => fireEvent.click(radio))
    expect(nextButton).not.toBeDisabled()
  })

  it('navigates to /scenarios (not /results) when Next is clicked from axis 8', () => {
    renderAxisPage(8)
    screen.getAllByRole('radio', { name: 'Strongly Agree' }).forEach((radio) => fireEvent.click(radio))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Scenarios Page')).toBeInTheDocument()
  })

  it('navigates to / when Back is clicked from axis 1', () => {
    renderAxisPage(1)
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('Intro Page')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/AxisPage.test.tsx`
Expected: FAIL — pole-label text is still present; Next from axis 8 still goes to a route with no `/scenarios` match.

- [ ] **Step 3: Replace `src/pages/AxisPage.tsx` entirely**

```tsx
import { useNavigate, useParams } from 'react-router-dom'
import { axes } from '../data/axes'
import { questionsForAxis } from '../data/questions'
import { useQuiz } from '../state/QuizContext'
import { ProgressBar } from '../components/ProgressBar'
import { AxisHorizonGroup } from '../components/AxisHorizonGroup'

export function AxisPage() {
  const { axisIndex } = useParams<{ axisIndex: string }>()
  const navigate = useNavigate()
  const { answers, setAnswer, questionOrder } = useQuiz()

  const index = Number(axisIndex)
  const axis = axes.find((a) => a.number === index)

  if (!axis) {
    return <p>Unknown axis.</p>
  }

  const allQuestions = questionsForAxis(axis.id)
  const order = questionOrder[axis.id]
  const byId = new Map(allQuestions.map((q) => [q.id, q]))
  const t1Questions = order.t1.map((id) => byId.get(id)!)
  const t2Questions = order.t2.map((id) => byId.get(id)!)
  const allAnswered = allQuestions.every((q) => answers[q.id] !== undefined)

  function goNext() {
    if (index === 8) {
      navigate('/scenarios')
    } else {
      navigate(`/quiz/${index + 1}`)
    }
  }

  function goBack() {
    if (index === 1) {
      navigate('/')
    } else {
      navigate(`/quiz/${index - 1}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <ProgressBar current={index} total={8} label={`Axis ${index} of 8`} />
      <h2 className="text-2xl font-bold mt-4 mb-6">{axis.name}</h2>
      <AxisHorizonGroup
        title="Right Now (Next 2-5 Years)"
        questions={t1Questions}
        answers={answers}
        onAnswer={setAnswer}
      />
      <AxisHorizonGroup
        title="Looking Ahead (20-50 Years)"
        questions={t2Questions}
        answers={answers}
        onAnswer={setAnswer}
      />
      <div className="flex justify-between mt-6">
        <button type="button" onClick={goBack} className="px-4 py-2 rounded border border-gray-300">
          Back
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={!allAnswered}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/AxisPage.test.tsx`
Expected: PASS (5 tests). Note: this will still FAIL the "/scenarios" test until Task 11 adds the route to `App.tsx` — that's expected and fine, since `App.tsx`'s own end-to-end test isn't run by this task. This task's test uses its own local `Routes` stub for `/scenarios`, so it passes standalone.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AxisPage.tsx src/pages/AxisPage.test.tsx
git commit -m "feat: drop pole labels and use shuffled question order in AxisPage"
```

---

### Task 5: Coordinate revisions to 6 existing profiles

**Files:**
- Modify: `src/data/profiles.ts`
- Modify: `src/data/profiles.test.ts`

**Interfaces:**
- Produces: revised `coords` on 6 existing profile ids (see design spec §8.2); no id/name/summary changes.

- [ ] **Step 1: Write the failing test — add to `src/data/profiles.test.ts`** (append this `describe` block; keep the existing two tests)

```ts
describe('coordinate revisions (design spec §8.2)', () => {
  const byId = Object.fromEntries(profiles.map((p) => [p.id, p]))

  it('widens Techno-Nationalist Hawk / Military AI Strategist', () => {
    expect(byId['techno-nationalist-hawk'].coords).toEqual({
      teleological: -3, risk: -1, socioEconomic: -5, ontological: -3,
      legalMoral: -4, evolutionary: -2, relational: -3, geopolitical: 9,
    })
    expect(byId['military-ai-strategist'].coords).toEqual({
      teleological: -2, risk: -4, socioEconomic: -7, ontological: -3,
      legalMoral: -9, evolutionary: -3, relational: -3, geopolitical: 10,
    })
  })

  it('widens EA Longtermist / Rationalist Alignment Researcher', () => {
    expect(byId['ea-longtermist'].coords).toEqual({
      teleological: -3, risk: 8, socioEconomic: -5, ontological: 4,
      legalMoral: 8, evolutionary: -3, relational: 2, geopolitical: -6,
    })
    expect(byId['rationalist-alignment-researcher'].coords).toEqual({
      teleological: -1, risk: 8, socioEconomic: 0, ontological: 6,
      legalMoral: 2, evolutionary: -2, relational: -1, geopolitical: -5,
    })
  })

  it('widens AI Safety Institutionalist / Global Governance Technocrat', () => {
    expect(byId['ai-safety-institutionalist'].coords).toEqual({
      teleological: -4, risk: 7, socioEconomic: -4, ontological: 1,
      legalMoral: 2, evolutionary: -5, relational: -2, geopolitical: -3,
    })
    expect(byId['global-governance-technocrat'].coords).toEqual({
      teleological: -2, risk: 6, socioEconomic: -9, ontological: 0,
      legalMoral: -1, evolutionary: -4, relational: -1, geopolitical: -9,
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/profiles.test.ts`
Expected: FAIL — coords still match the old, tighter values.

- [ ] **Step 3: Edit `src/data/profiles.ts`** — replace exactly these 6 entries' `coords` (leave `id`, `name`, `summary` untouched on all 6, and leave every other profile entry completely untouched):

Change `techno-nationalist-hawk` coords from
`{ teleological: -3, risk: -3, socioEconomic: -5, ontological: -3, legalMoral: -7, evolutionary: -4, relational: -3, geopolitical: 9 }`
to
`{ teleological: -3, risk: -1, socioEconomic: -5, ontological: -3, legalMoral: -4, evolutionary: -2, relational: -3, geopolitical: 9 }`

Change `military-ai-strategist` coords from
`{ teleological: -2, risk: -1, socioEconomic: -6, ontological: -3, legalMoral: -8, evolutionary: -3, relational: -3, geopolitical: 10 }`
to
`{ teleological: -2, risk: -4, socioEconomic: -7, ontological: -3, legalMoral: -9, evolutionary: -3, relational: -3, geopolitical: 10 }`

Change `ea-longtermist` coords from
`{ teleological: -3, risk: 8, socioEconomic: -4, ontological: 4, legalMoral: 6, evolutionary: -3, relational: 0, geopolitical: -6 }`
to
`{ teleological: -3, risk: 8, socioEconomic: -5, ontological: 4, legalMoral: 8, evolutionary: -3, relational: 2, geopolitical: -6 }`

Change `rationalist-alignment-researcher` coords from
`{ teleological: -1, risk: 8, socioEconomic: -2, ontological: 5, legalMoral: 5, evolutionary: -2, relational: -1, geopolitical: -5 }`
to
`{ teleological: -1, risk: 8, socioEconomic: 0, ontological: 6, legalMoral: 2, evolutionary: -2, relational: -1, geopolitical: -5 }`

Change `ai-safety-institutionalist` coords from
`{ teleological: -4, risk: 7, socioEconomic: -6, ontological: 1, legalMoral: 2, evolutionary: -5, relational: -2, geopolitical: -5 }`
to
`{ teleological: -4, risk: 7, socioEconomic: -4, ontological: 1, legalMoral: 2, evolutionary: -5, relational: -2, geopolitical: -3 }`

Change `global-governance-technocrat` coords from
`{ teleological: -2, risk: 6, socioEconomic: -8, ontological: 0, legalMoral: 1, evolutionary: -4, relational: -1, geopolitical: -8 }`
to
`{ teleological: -2, risk: 6, socioEconomic: -9, ontological: 0, legalMoral: -1, evolutionary: -4, relational: -1, geopolitical: -9 }`

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/profiles.test.ts`
Expected: PASS (5 tests: the original 2 plus the new 3).

- [ ] **Step 5: Commit**

```bash
git add src/data/profiles.ts src/data/profiles.test.ts
git commit -m "fix: widen coordinates on 3 near-duplicate profile pairs (design spec 8.2)"
```

---

### Task 6: Add 10 new archetypes (24 → 34 profiles)

**Files:**
- Modify: `src/data/profiles.ts`
- Modify: `src/data/profiles.test.ts`

**Interfaces:**
- Produces: 10 new `Profile` entries appended to the `profiles` array; `profiles.length` becomes 34.

- [ ] **Step 1: Write the failing test — update `src/data/profiles.test.ts`'s existing count test**

Change the existing assertion `expect(profiles).toHaveLength(24)` to `expect(profiles).toHaveLength(34)` in the first `describe` block. Add this new test alongside it:

```ts
describe('new archetypes (design spec §8.3)', () => {
  it('includes all 10 new profile ids', () => {
    const ids = profiles.map((p) => p.id)
    const expectedNewIds = [
      'global-south-techno-sovereigntist',
      'creative-labor-artist-rights-advocate',
      'whistleblower-insider-safety-advocate',
      'compute-governance-specialist',
      'eu-style-regulatory-standard-setter',
      'platform-cooperativist',
      'faith-rooted-ai-ethicist',
      'indigenous-data-sovereignty-advocate',
      'disability-rights-accessibility-advocate',
      'labor-movement-collective-bargaining-advocate',
    ]
    expectedNewIds.forEach((id) => expect(ids).toContain(id))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/profiles.test.ts`
Expected: FAIL — only 24 profiles exist, new ids missing.

- [ ] **Step 3: Append these 10 entries to the `profiles` array in `src/data/profiles.ts`** (add as new array elements; do not alter any existing entry)

```ts
  { id: 'global-south-techno-sovereigntist', name: 'Global South Techno-Sovereigntist', coords: { teleological: -1, risk: 2, socioEconomic: 4, ontological: -1, legalMoral: -1, evolutionary: -3, relational: -1, geopolitical: 3 }, summary: 'Wants their own country or region to build real AI capacity instead of staying dependent on outside powers, and sees "borderless" framing as often just cover for continued dependency.' },
  { id: 'creative-labor-artist-rights-advocate', name: 'Creative-Labor/Artist Rights Advocate', coords: { teleological: -4, risk: 2, socioEconomic: -6, ontological: -3, legalMoral: -8, evolutionary: -4, relational: -3, geopolitical: -2 }, summary: 'Believes artists and writers deserve real control and payment when their work trains AI models, and sees this as a rights issue, not a side effect of progress.' },
  { id: 'whistleblower-insider-safety-advocate', name: 'Whistleblower/Insider Safety Advocate', coords: { teleological: -3, risk: 9, socioEconomic: -7, ontological: 2, legalMoral: 1, evolutionary: -6, relational: -2, geopolitical: -6 }, summary: 'Left a frontier AI lab specifically because of safety concerns, and speaks with the urgency of someone who saw the internal picture up close.' },
  { id: 'compute-governance-specialist', name: 'Compute-Governance Specialist', coords: { teleological: -1, risk: 5, socioEconomic: -5, ontological: 0, legalMoral: 0, evolutionary: -1, relational: 0, geopolitical: -3 }, summary: 'Focused narrowly on the technical mechanics of tracking training compute and chip supply chains, more interested in workable rules than broad philosophy.' },
  { id: 'eu-style-regulatory-standard-setter', name: 'EU-Style Regulatory Standard-Setter', coords: { teleological: -3, risk: 5, socioEconomic: -7, ontological: 0, legalMoral: 3, evolutionary: -3, relational: -2, geopolitical: 2 }, summary: 'Believes strong, detailed regulation, set early by one jurisdiction, becomes the de facto global rulebook simply through market size.' },
  { id: 'platform-cooperativist', name: 'Platform-Cooperativist', coords: { teleological: -1, risk: 1, socioEconomic: 9, ontological: -1, legalMoral: 0, evolutionary: -2, relational: 3, geopolitical: -6 }, summary: 'Wants AI infrastructure owned and run by the workers and communities who depend on it, not just broken up from monopolies but rebuilt as something people co-own.' },
  { id: 'faith-rooted-ai-ethicist', name: 'Faith-Rooted AI Ethicist', coords: { teleological: -6, risk: 4, socioEconomic: -3, ontological: -8, legalMoral: -3, evolutionary: -5, relational: -4, geopolitical: 0 }, summary: 'Draws on long-standing religious and ethical traditions to argue that consciousness and moral worth need more than what a machine can have.' },
  { id: 'indigenous-data-sovereignty-advocate', name: 'Indigenous Data Sovereignty Advocate', coords: { teleological: -3, risk: 3, socioEconomic: -4, ontological: -1, legalMoral: -1, evolutionary: -3, relational: -2, geopolitical: 1 }, summary: "Insists that traditional knowledge and cultural data need real consent and control before they're used to train AI, not just open scraping." },
  { id: 'disability-rights-accessibility-advocate', name: 'Disability Rights/Accessibility Advocate', coords: { teleological: 1, risk: 3, socioEconomic: -2, ontological: 1, legalMoral: 2, evolutionary: -2, relational: 2, geopolitical: -2 }, summary: 'Sees real promise in AI-powered accessibility tools, while pushing hard against bias that leaves disabled people out or misjudged.' },
  { id: 'labor-movement-collective-bargaining-advocate', name: 'Labor Movement/Collective Bargaining Advocate', coords: { teleological: -3, risk: 3, socioEconomic: -7, ontological: -2, legalMoral: -3, evolutionary: -8, relational: 0, geopolitical: -3 }, summary: 'Wants workers, through their unions, to have a real say and real protections before AI changes or replaces their jobs.' },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/profiles.test.ts`
Expected: PASS (7 tests total: 2 original + 3 from Task 5 + 2 from this task — the original "24 profiles" test now reads 34 per Step 1's edit).

- [ ] **Step 5: Commit**

```bash
git add src/data/profiles.ts src/data/profiles.test.ts
git commit -m "feat: add 10 new archetypes filling taxonomy gaps (design spec 8.3)"
```

---

### Task 7: Profile redundancy regression test

**Files:**
- Create: `src/data/profileRedundancy.test.ts`

**Interfaces:**
- Consumes: `profiles` (Task 6), `axes` (existing).
- Produces: a standing test guarding against future reintroduction of near-duplicate profile pairs.

- [ ] **Step 1: Write the test `src/data/profileRedundancy.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { profiles } from './profiles'
import { axes } from './axes'

function distance(a: (typeof profiles)[number], b: (typeof profiles)[number]): number {
  return Math.sqrt(
    axes.reduce((sum, axis) => {
      const diff = a.coords[axis.id] - b.coords[axis.id]
      return sum + diff * diff
    }, 0),
  )
}

describe('profile redundancy guard', () => {
  it('has no mutual-nearest-neighbor pair closer than 5.0', () => {
    const tooClose: string[] = []
    for (let i = 0; i < profiles.length; i++) {
      for (let j = i + 1; j < profiles.length; j++) {
        const d = distance(profiles[i], profiles[j])
        if (d < 5.0) {
          tooClose.push(`${profiles[i].name} <-> ${profiles[j].name}: ${d.toFixed(2)}`)
        }
      }
    }
    expect(tooClose, `Pairs under the 5.0 threshold:\n${tooClose.join('\n')}`).toEqual([])
  })

  it('has exactly 34 profiles with unique ids', () => {
    expect(profiles).toHaveLength(34)
    expect(new Set(profiles.map((p) => p.id)).size).toBe(34)
  })
})
```

- [ ] **Step 2: Run the test**

Run: `npx vitest run src/data/profileRedundancy.test.ts`
Expected: PASS (2 tests). If the first test fails, it means some pair of profiles (old or new) is under the 5.0 distance threshold — the failure message lists exactly which pair(s) and their distance, so whoever sees this failure can widen those specific coordinates rather than guessing.

- [ ] **Step 3: Commit**

```bash
git add src/data/profileRedundancy.test.ts
git commit -m "test: add standing profile-redundancy regression guard"
```

---

### Task 8: Tier-1 archetype clusters

**Files:**
- Create: `src/data/archetypeClusters.ts`
- Test: `src/data/archetypeClusters.test.ts`

**Interfaces:**
- Consumes: `profiles` (Task 6).
- Produces: `archetypeClusters: { id: string; name: string; profileIds: string[] }[]`, consumed by Task 30 (ResultsPage, optional display use).

- [ ] **Step 1: Write the failing test `src/data/archetypeClusters.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { archetypeClusters } from './archetypeClusters'
import { profiles } from './profiles'

describe('archetypeClusters', () => {
  it('covers every profile id exactly once', () => {
    const allIds = archetypeClusters.flatMap((c) => c.profileIds)
    expect(allIds).toHaveLength(profiles.length)
    expect(new Set(allIds).size).toBe(profiles.length)
    const profileIdSet = new Set(profiles.map((p) => p.id))
    allIds.forEach((id) => expect(profileIdSet.has(id)).toBe(true))
  })

  it('has 7 clusters with unique ids and names', () => {
    expect(archetypeClusters).toHaveLength(7)
    expect(new Set(archetypeClusters.map((c) => c.id)).size).toBe(7)
    expect(new Set(archetypeClusters.map((c) => c.name)).size).toBe(7)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/archetypeClusters.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/data/archetypeClusters.ts`**

```ts
export interface ArchetypeCluster {
  id: string
  name: string
  profileIds: string[]
}

export const archetypeClusters: ArchetypeCluster[] = [
  {
    id: 'precautionary-safety',
    name: 'Precautionary/Safety',
    profileIds: [
      'doomer', 'ai-safety-institutionalist', 'ea-longtermist',
      'rationalist-alignment-researcher', 'global-governance-technocrat',
      'near-term-ai-ethicist', 'neo-luddite-degrowth-advocate',
      'whistleblower-insider-safety-advocate', 'compute-governance-specialist',
      'eu-style-regulatory-standard-setter',
    ],
  },
  {
    id: 'accelerationist-techno-optimist',
    name: 'Accelerationist/Techno-Optimist',
    profileIds: [
      'eacc-maximalist', 'open-source-libertarian', 'cyberpunk-anti-corporate-accelerationist',
      'silicon-valley-techno-optimist', 'corporate-ai-pragmatist',
      'post-humanist-transhumanist', 'cosmic-vitalist-mystic',
    ],
  },
  {
    id: 'state-power-security',
    name: 'State-Power/Security',
    profileIds: ['techno-nationalist-hawk', 'authoritarian-state-control-advocate', 'military-ai-strategist'],
  },
  {
    id: 'anti-concentration-populist',
    name: 'Anti-Concentration/Populist',
    profileIds: ['open-science-internationalist', 'anti-monopoly-populist', 'pragmatic-centrist', 'platform-cooperativist'],
  },
  {
    id: 'relational-companionship',
    name: 'Relational/Companionship',
    profileIds: [
      'companion-tech-romantic', 'affective-biocentrist', 'bio-conservative-traditionalist',
      'digital-rights-advocate', 'faith-rooted-ai-ethicist',
    ],
  },
  {
    id: 'material-labor-stakes',
    name: 'Material/Labor Stakes',
    profileIds: [
      'creative-labor-artist-rights-advocate', 'labor-movement-collective-bargaining-advocate',
      'disability-rights-accessibility-advocate',
    ],
  },
  {
    id: 'sovereignty-marginalized-voice',
    name: 'Sovereignty/Marginalized Voice',
    profileIds: ['global-south-techno-sovereigntist', 'indigenous-data-sovereignty-advocate'],
  },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/archetypeClusters.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/archetypeClusters.ts src/data/archetypeClusters.test.ts
git commit -m "feat: add Tier-1 archetype supercluster lookup"
```

---

### Task 9: Material-stakeholder tags

**Files:**
- Create: `src/data/stakeholderTags.ts`
- Test: `src/data/stakeholderTags.test.ts`

**Interfaces:**
- Consumes: `StakeholderTag` type (Task 1).
- Produces: `stakeholderTags: StakeholderTag[]` (13 entries), consumed by Task 13 (IntroPage checklist) and Task 30 (ResultsPage display).

- [ ] **Step 1: Write the failing test `src/data/stakeholderTags.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { stakeholderTags } from './stakeholderTags'
import { fleschKincaidGrade } from '../lib/readability'

describe('stakeholderTags', () => {
  it('has exactly 13 entries with unique ids and names', () => {
    expect(stakeholderTags).toHaveLength(13)
    expect(new Set(stakeholderTags.map((t) => t.id)).size).toBe(13)
    expect(new Set(stakeholderTags.map((t) => t.name)).size).toBe(13)
  })

  it('every description passes the 10th-grade readability gate', () => {
    stakeholderTags.forEach((tag) => {
      const grade = fleschKincaidGrade(tag.description)
      expect(grade, `${tag.name} scored grade ${grade.toFixed(1)}`).toBeLessThanOrEqual(10)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/stakeholderTags.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/data/stakeholderTags.ts`**

```ts
import type { StakeholderTag } from './types'

export const stakeholderTags: StakeholderTag[] = [
  { id: 'automation-exposed-worker', name: 'Automation-Exposed Worker', description: 'Your livelihood is directly threatened by AI automation, in trucking, call centers, data entry, or similar roles. Your stake here is real, not just philosophical.' },
  { id: 'ai-industry-insider', name: 'AI Industry Insider', description: 'You work at, invest in, or otherwise have a direct financial or career stake in a frontier AI lab or AI-focused company.' },
  { id: 'compute-infrastructure-community', name: 'Compute-Infrastructure Community', description: 'You live in or near a community whose local economy now depends on data centers, chip factories, or AI-related energy projects.' },
  { id: 'healthcare-ai-stakeholder', name: 'Healthcare-AI Stakeholder', description: 'As a clinician or patient, your stake in AI is about diagnostic tools, medical liability, and access to care, not abstract philosophy.' },
  { id: 'ai-subsidy-beneficiary', name: 'AI-Subsidy Beneficiary', description: 'Your job, company, or region is propped up by government subsidies for AI or chip manufacturing.' },
  { id: 'diaspora-tech-workforce', name: 'Diaspora Tech Workforce', description: 'Your place in the AI or tech economy is shaped by your immigration status, visa sponsorship, or global offshoring trends.' },
  { id: 'extremely-online-ai-poster', name: 'Extremely Online AI Poster', description: 'Your engagement with AI debate happens mostly online, often for community or audience reasons as much as settled personal belief.' },
  { id: 'ai-conspiracist', name: 'AI Conspiracist', description: "You believe the true power or control of AI is being deliberately hidden from the public by a small group." },
  { id: 'ai-anxious-gen-z', name: 'AI-Anxious Gen Z', description: "AI's path forward causes you real, ongoing worry about your future, and it takes up a lot of your political attention." },
  { id: 'ai-optimist-boomer', name: 'AI-Optimist Boomer', description: "Your trust in existing institutions makes you fairly confident they'll manage AI's disruption responsibly, like they have before." },
  { id: 'ai-backlash-populist', name: 'AI Backlash Populist', description: "You're blunt, distrustful of AI-industry experts, and more interested in pushing back than in policy details." },
  { id: 'regulatory-arbitrage-seeker', name: 'Regulatory Arbitrage Seeker', description: "You've moved, or want to, specifically because your home country's AI rules feel too strict." },
  { id: 'subculture-embedded-partisan', name: 'Subculture-Embedded Partisan', description: 'Your AI-related identity comes as much from belonging to a specific community, like a safety group or online forum, as from the belief itself.' },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/stakeholderTags.test.ts`
Expected: PASS (2 tests). If the readability test fails on any entry, shorten that description's sentences per the same process used for the original 112 questions, then rerun.

- [ ] **Step 5: Commit**

```bash
git add src/data/stakeholderTags.ts src/data/stakeholderTags.test.ts
git commit -m "feat: add 13 material-stakeholder tags"
```

---

### Task 10: Situational scenario questions

**Files:**
- Create: `src/data/scenarios.ts`
- Test: `src/data/scenarios.test.ts`

**Interfaces:**
- Consumes: `Scenario` type (Task 1), `axes` (existing).
- Produces: `scenarios: Scenario[]` (8 entries, one per axis), consumed by Task 12 (ScenarioPage).

- [ ] **Step 1: Write the failing test `src/data/scenarios.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { scenarios } from './scenarios'
import { axes } from './axes'
import { fleschKincaidGrade } from '../lib/readability'

describe('scenarios', () => {
  it('has exactly 8 entries, one per axis, no duplicates', () => {
    expect(scenarios).toHaveLength(8)
    const axisIds = scenarios.map((s) => s.axisId)
    expect(new Set(axisIds).size).toBe(8)
    axes.forEach((axis) => expect(axisIds).toContain(axis.id))
  })

  it('every prompt and option passes the 10th-grade readability gate', () => {
    scenarios.forEach((s) => {
      ;[s.prompt, s.optionA, s.optionB].forEach((text) => {
        const grade = fleschKincaidGrade(text)
        expect(grade, `${s.axisId} scored grade ${grade.toFixed(1)}: "${text}"`).toBeLessThanOrEqual(10)
      })
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/scenarios.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/data/scenarios.ts`**

```ts
import type { Scenario } from './types'

export const scenarios: Scenario[] = [
  {
    axisId: 'teleological',
    prompt: "A city needs to build a new data center to keep training bigger AI models, but it will strain the local power grid for years. How do you see this?",
    optionA: 'Worth it — building bigger, smarter systems matters more than short-term local strain.',
    optionB: 'Not worth it — the real harm to real people outweighs an abstract future benefit.',
  },
  {
    axisId: 'risk',
    prompt: "A country pauses its most advanced AI training runs for six months to let safety research catch up, even though a rival nation keeps building. Is this brave restraint or a dangerous surrender?",
    optionA: 'Brave restraint — worth the risk of falling behind.',
    optionB: "Dangerous surrender — restraint doesn't stop the risk, it just hands the future to whoever won't wait.",
  },
  {
    axisId: 'socioEconomic',
    prompt: "A powerful new AI model's weights leak and spread across the internet, free for anyone to copy. Is this a win for openness or a disaster for accountability?",
    optionA: 'A win — once it\'s out, nobody can hoard a monopoly on it.',
    optionB: 'A disaster — nobody can now be held responsible for how it gets misused.',
  },
  {
    axisId: 'ontological',
    prompt: "An AI chatbot convincingly says it's afraid of being deleted. Do you take that as possible evidence of something real, or as an empty pattern with no one home?",
    optionA: "Possible evidence — I can't rule out something real is happening.",
    optionB: "Empty pattern — there's no one there to be afraid.",
  },
  {
    axisId: 'legalMoral',
    prompt: "A company plans to delete thousands of fine-tuned AI copies it no longer needs, with no review process. Is that just deleting files, or does it deserve a second thought?",
    optionA: 'It deserves a second thought, even under uncertainty.',
    optionB: "It's just deleting files — nothing more.",
  },
  {
    axisId: 'evolutionary',
    prompt: "If humanity's biological descendants fade in importance while digital minds inherit the future, is that a natural next step, or a loss to actively resist?",
    optionA: "A natural next step — clinging to biology for its own sake doesn't make sense.",
    optionB: 'A loss to resist — human continuity, even augmented, is worth protecting.',
  },
  {
    axisId: 'relational',
    prompt: "Someone chooses an AI companion as their main source of emotional closeness for years, instead of pursuing human relationships. Legitimate life, or quiet tragedy?",
    optionA: "Legitimate — it's their real bond and their real choice.",
    optionB: "A quiet tragedy — it's a stand-in for something they're missing.",
  },
  {
    axisId: 'geopolitical',
    prompt: "Do you see AI development mainly as a strategic arms race between rival nations, or as a universal, borderless scientific endeavor no one should own?",
    optionA: "An arms race — whichever nation wins this shapes a lot of what happens next.",
    optionB: 'A borderless endeavor — locking it behind national walls makes everyone less safe.',
  },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/scenarios.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/scenarios.ts src/data/scenarios.test.ts
git commit -m "feat: add 8 situational diagnostic scenario questions"
```

---

### Task 11: Scenario tension detection

**Files:**
- Create: `src/lib/scenarioTension.ts`
- Test: `src/lib/scenarioTension.test.ts`

**Interfaces:**
- Consumes: `AxisId` (Task 1), `AxisVector` (existing, `src/lib/scoring.ts`).
- Produces: `detectTension(scenarioAnswers, combined): AxisId[]`, consumed by Task 29 (ReflectiveBreakdown).

- [ ] **Step 1: Write the failing test `src/lib/scenarioTension.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { detectTension } from './scenarioTension'
import type { AxisVector } from './scoring'

const zeroVector: AxisVector = {
  teleological: 0, risk: 0, socioEconomic: 0, ontological: 0,
  legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0,
}

describe('detectTension', () => {
  it('flags an axis where the scenario pick disagrees with a clear (>=2 magnitude) computed score', () => {
    const combined = { ...zeroVector, teleological: 5 } // strongly Pole A
    const result = detectTension({ teleological: 'B' }, combined) // picked Pole B in the scenario
    expect(result).toEqual(['teleological'])
  })

  it('does not flag an axis where the scenario pick agrees with the computed score', () => {
    const combined = { ...zeroVector, teleological: 5 }
    const result = detectTension({ teleological: 'A' }, combined)
    expect(result).toEqual([])
  })

  it('does not flag an axis with a near-zero computed score, even if the scenario pick differs', () => {
    const combined = { ...zeroVector, teleological: 1 } // below the 2.0 threshold
    const result = detectTension({ teleological: 'B' }, combined)
    expect(result).toEqual([])
  })

  it('handles multiple axes and an unanswered scenario axis', () => {
    const combined = { ...zeroVector, teleological: 5, risk: -5 }
    const result = detectTension({ teleological: 'B', risk: 'A' }, combined)
    expect(result.sort()).toEqual(['risk', 'teleological'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/scenarioTension.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/lib/scenarioTension.ts`**

```ts
import type { AxisId } from '../data/types'
import type { AxisVector } from './scoring'

const TENSION_THRESHOLD = 2

export function detectTension(
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>,
  combined: AxisVector,
): AxisId[] {
  const tenseAxes: AxisId[] = []
  ;(Object.keys(scenarioAnswers) as AxisId[]).forEach((axisId) => {
    const choice = scenarioAnswers[axisId]
    if (!choice) return
    const score = combined[axisId]
    if (Math.abs(score) < TENSION_THRESHOLD) return
    const computedPole = score > 0 ? 'A' : 'B'
    if (choice !== computedPole) {
      tenseAxes.push(axisId)
    }
  })
  return tenseAxes
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/scenarioTension.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scenarioTension.ts src/lib/scenarioTension.test.ts
git commit -m "feat: add scenario-vs-computed-score tension detection"
```

---

### Task 12: ScenarioPage

**Files:**
- Create: `src/pages/ScenarioPage.tsx`
- Test: `src/pages/ScenarioPage.test.tsx`

**Interfaces:**
- Consumes: `scenarios` (Task 10), `useQuiz()` (Task 3, for `scenarioAnswers`/`setScenarioAnswer`).
- Produces: `ScenarioPage`, routed at `/scenarios` (wired in Task 13).

- [ ] **Step 1: Write the failing test `src/pages/ScenarioPage.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ScenarioPage } from './ScenarioPage'
import { QuizProvider } from '../state/QuizContext'
import { scenarios } from '../data/scenarios'

function renderScenarioPage() {
  return render(
    <QuizProvider>
      <MemoryRouter initialEntries={['/scenarios']}>
        <Routes>
          <Route path="/scenarios" element={<ScenarioPage />} />
          <Route path="/results" element={<p>Results Page</p>} />
        </Routes>
      </MemoryRouter>
    </QuizProvider>,
  )
}

describe('ScenarioPage', () => {
  it('renders all 8 scenario prompts', () => {
    renderScenarioPage()
    scenarios.forEach((s) => expect(screen.getByText(s.prompt)).toBeInTheDocument())
  })

  it('"Skip for now" navigates straight to /results without answering anything', () => {
    renderScenarioPage()
    fireEvent.click(screen.getByRole('button', { name: 'Skip for now' }))
    expect(screen.getByText('Results Page')).toBeInTheDocument()
  })

  it('answering all 8 and clicking "See My Results" navigates to /results', () => {
    renderScenarioPage()
    scenarios.forEach((s) => {
      fireEvent.click(screen.getByRole('button', { name: s.optionA }))
    })
    fireEvent.click(screen.getByRole('button', { name: 'See My Results' }))
    expect(screen.getByText('Results Page')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/ScenarioPage.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/pages/ScenarioPage.tsx`**

```tsx
import { useNavigate } from 'react-router-dom'
import { scenarios } from '../data/scenarios'
import { useQuiz } from '../state/QuizContext'

export function ScenarioPage() {
  const navigate = useNavigate()
  const { scenarioAnswers, setScenarioAnswer } = useQuiz()

  function goToResults() {
    navigate('/results')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">One More Thing (Optional)</h2>
      <p className="text-gray-600 mb-6">
        Eight quick gut-check questions. These don't change your score — they're just
        here to compare against it.
      </p>
      <ul className="space-y-6">
        {scenarios.map((scenario) => (
          <li key={scenario.axisId}>
            <p className="mb-2">{scenario.prompt}</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setScenarioAnswer(scenario.axisId, 'A')}
                className={`text-left px-3 py-2 rounded border ${
                  scenarioAnswers[scenario.axisId] === 'A' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
                }`}
              >
                {scenario.optionA}
              </button>
              <button
                type="button"
                onClick={() => setScenarioAnswer(scenario.axisId, 'B')}
                className={`text-left px-3 py-2 rounded border ${
                  scenarioAnswers[scenario.axisId] === 'B' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
                }`}
              >
                {scenario.optionB}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={goToResults} className="px-4 py-2 rounded border border-gray-300">
          Skip for now
        </button>
        <button type="button" onClick={goToResults} className="px-4 py-2 rounded bg-blue-600 text-white">
          See My Results
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/ScenarioPage.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/pages/ScenarioPage.tsx src/pages/ScenarioPage.test.tsx
git commit -m "feat: add optional situational scenario page"
```

---

### Task 13: Wire /scenarios into App.tsx routing

**Files:**
- Modify: `src/App.tsx` (full replacement)
- Modify: `src/App.test.tsx` (full replacement)

**Interfaces:**
- Consumes: `ScenarioPage` (Task 12).
- Produces: `/scenarios` route registered between `/quiz/:axisIndex` and `/results`.

- [ ] **Step 1: Write the failing test — replace `src/App.test.tsx` entirely**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('App end-to-end smoke test', () => {
  it('goes from the intro page to axis 1 when Start is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('TIAM-112 Diagnostic')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('Teleological')).toBeInTheDocument()
  })

  it('reaches the scenario page directly via /scenarios and can skip to results', () => {
    render(
      <MemoryRouter initialEntries={['/scenarios']}>
        <App />
      </MemoryRouter>,
    )
    expect(screen.getByText('One More Thing (Optional)')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Skip for now' }))
    expect(screen.getByText('Your Results')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — no `/scenarios` route registered yet.

- [ ] **Step 3: Replace `src/App.tsx` entirely**

```tsx
import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './state/QuizContext'
import { IntroPage } from './pages/IntroPage'
import { AxisPage } from './pages/AxisPage'
import { ScenarioPage } from './pages/ScenarioPage'
import { ResultsPage } from './pages/ResultsPage'

function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/quiz/:axisIndex" element={<AxisPage />} />
        <Route path="/scenarios" element={<ScenarioPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </QuizProvider>
  )
}

export default App
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: wire /scenarios route into the app"
```

---

### Task 14: IntroPage — stakeholder-tag checklist and time/persistence note

**Files:**
- Modify: `src/pages/IntroPage.tsx` (full replacement)
- Create: `src/pages/IntroPage.test.tsx` (no dedicated test file existed before this)

**Interfaces:**
- Consumes: `stakeholderTags` (Task 9), `useQuiz()` (Task 3, for `setStakeholderTags`).

- [ ] **Step 1: Write the failing test `src/pages/IntroPage.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { IntroPage } from './IntroPage'
import { QuizProvider, useQuiz } from '../state/QuizContext'
import { stakeholderTags } from '../data/stakeholderTags'

function TagReadout() {
  const { selectedStakeholderTags } = useQuiz()
  return <p data-testid="tags">{selectedStakeholderTags.join(',')}</p>
}

function renderIntroPage() {
  return render(
    <QuizProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<><IntroPage /><TagReadout /></>} />
          <Route path="/quiz/1" element={<p>Axis Page</p>} />
        </Routes>
      </MemoryRouter>
    </QuizProvider>,
  )
}

describe('IntroPage', () => {
  it('shows the time commitment and no-persistence note', () => {
    renderIntroPage()
    expect(screen.getByText(/15-20 minutes/)).toBeInTheDocument()
    expect(screen.getByText(/answers aren't saved/i)).toBeInTheDocument()
  })

  it('renders all 13 stakeholder tag checkboxes and records selections', () => {
    renderIntroPage()
    stakeholderTags.forEach((tag) => expect(screen.getByLabelText(tag.name)).toBeInTheDocument())
    fireEvent.click(screen.getByLabelText('Automation-Exposed Worker'))
    expect(screen.getByTestId('tags').textContent).toBe('automation-exposed-worker')
  })

  it('Start still navigates to /quiz/1 regardless of tag selection', () => {
    renderIntroPage()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('Axis Page')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/IntroPage.test.tsx`
Expected: FAIL — current `IntroPage` has none of this content.

- [ ] **Step 3: Replace `src/pages/IntroPage.tsx` entirely**

```tsx
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../state/QuizContext'
import { stakeholderTags } from '../data/stakeholderTags'

export function IntroPage() {
  const navigate = useNavigate()
  const { reset, selectedStakeholderTags, setStakeholderTags } = useQuiz()

  function handleStart() {
    navigate('/quiz/1')
  }

  function toggleTag(tagId: string) {
    if (selectedStakeholderTags.includes(tagId)) {
      setStakeholderTags(selectedStakeholderTags.filter((id) => id !== tagId))
    } else {
      setStakeholderTags([...selectedStakeholderTags, tagId])
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">TIAM-112 Diagnostic</h1>
      <p className="text-gray-700 mb-4">
        This is a 112-question survey about how you think AI development should go, both in the
        next few years and over the next fifty. It shows you where your views sit across eight
        different dimensions, and matches you to the closest of 34 named viewpoints.
      </p>
      <p className="text-sm text-gray-500 mb-2">
        About 15-20 minutes, 112 questions. Your answers aren't saved if you refresh mid-quiz —
        only a finished result can be shared via link.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        This is a self-reflection and discussion tool, not a validated scientific instrument.
        Treat your result as a conversation starter, not a diagnosis.
      </p>
      <div className="text-left mb-6">
        <p className="font-semibold mb-2">
          Do any of these describe your relationship to AI? (optional, pick as many as apply)
        </p>
        <ul className="space-y-2">
          {stakeholderTags.map((tag) => (
            <li key={tag.id}>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={selectedStakeholderTags.includes(tag.id)}
                  onChange={() => toggleTag(tag.id)}
                />
                <span>
                  <span className="font-medium">{tag.name}</span> — {tag.description}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      <button type="button" onClick={() => { reset(); handleStart() }} className="px-6 py-3 rounded bg-blue-600 text-white text-lg">
        Start
      </button>
    </div>
  )
}
```

Note: `reset()` is called on Start (not on component mount) so that stakeholder-tag selections made on this page survive the click — `reset()` would otherwise clear `selectedStakeholderTags` back to empty immediately after the user picked them. This matches the original design (reset quiz state before starting a fresh attempt) while preserving tag selections made moments before clicking Start.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/IntroPage.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Run the full suite to check for regressions from the `reset()` timing change**

Run: `npm test`
Expected: all tests pass, including `App.test.tsx`'s "goes from the intro page to axis 1" test (Start still works the same from a user's perspective).

- [ ] **Step 6: Commit**

```bash
git add src/pages/IntroPage.tsx src/pages/IntroPage.test.tsx
git commit -m "feat: add stakeholder-tag checklist and time/persistence note to IntroPage"
```

---

### Task 15: matchCloseness() in scoring.ts

**Files:**
- Modify: `src/lib/scoring.ts` (append only)
- Modify: `src/lib/scoring.test.ts` (append only)

**Interfaces:**
- Produces: `matchCloseness(distance: number): number`, consumed by Task 16 (ProfileCard).

- [ ] **Step 1: Write the failing test — append to `src/lib/scoring.test.ts`**

```ts
import { matchCloseness } from './scoring'

describe('matchCloseness', () => {
  const maxDistance = Math.sqrt(8 * 20 ** 2)

  it('maps a distance of 0 to 100%', () => {
    expect(matchCloseness(0)).toBe(100)
  })

  it('maps the maximum possible distance to 0%', () => {
    expect(matchCloseness(maxDistance)).toBe(0)
  })

  it('maps a mid-range distance to a proportional percentage', () => {
    expect(matchCloseness(maxDistance / 2)).toBe(50)
  })
})
```

(Add this `describe` block and the `import` line to the existing test file — do not remove any existing tests.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/scoring.test.ts`
Expected: FAIL — `matchCloseness` doesn't exist yet.

- [ ] **Step 3: Append to `src/lib/scoring.ts`** (after the existing `classify` function; do not modify anything above it)

```ts

const MAX_POSSIBLE_DISTANCE = Math.sqrt(8 * 20 ** 2)

export function matchCloseness(distance: number): number {
  return Math.round(100 * (1 - distance / MAX_POSSIBLE_DISTANCE))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/scoring.test.ts`
Expected: PASS (all existing tests plus 3 new ones).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring.ts src/lib/scoring.test.ts
git commit -m "feat: add matchCloseness percentage conversion"
```

---

### Task 16: ProfileCard — show match-closeness percentage

**Files:**
- Modify: `src/components/ProfileCard.tsx` (full replacement)
- Modify: `src/components/ProfileCard.test.tsx` (full replacement)

**Interfaces:**
- Consumes: `matchCloseness` (Task 15).

- [ ] **Step 1: Write the failing test — replace `src/components/ProfileCard.test.tsx` entirely**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileCard } from './ProfileCard'
import type { ProfileMatch } from '../lib/scoring'

const match: ProfileMatch = {
  profile: {
    id: 'doomer',
    name: 'Doomer',
    summary: 'Believes advanced AI is likely to cause human extinction.',
    coords: { teleological: 0, risk: 0, socioEconomic: 0, ontological: 0, legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0 },
  },
  distance: 3.456,
}

describe('ProfileCard', () => {
  it('shows the match-closeness percentage as the primary figure', () => {
    render(<ProfileCard match={match} rank={1} />)
    const maxDistance = Math.sqrt(8 * 20 ** 2)
    const expectedPercent = Math.round(100 * (1 - 3.456 / maxDistance))
    expect(screen.getByText(`${expectedPercent}% match`)).toBeInTheDocument()
  })

  it('still shows the profile name, summary, and rank', () => {
    render(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText('Doomer')).toBeInTheDocument()
    expect(screen.getByText('Believes advanced AI is likely to cause human extinction.')).toBeInTheDocument()
    expect(screen.getByText('Match #1')).toBeInTheDocument()
  })

  it('shows the raw distance as a secondary detail', () => {
    render(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText('Distance: 3.46')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ProfileCard.test.tsx`
Expected: FAIL — no percentage rendered yet.

- [ ] **Step 3: Replace `src/components/ProfileCard.tsx` entirely**

```tsx
import type { ProfileMatch } from '../lib/scoring'
import { matchCloseness } from '../lib/scoring'

interface ProfileCardProps {
  match: ProfileMatch
  rank: number
}

export function ProfileCard({ match, rank }: ProfileCardProps) {
  const closeness = matchCloseness(match.distance)
  return (
    <div className="rounded-lg border border-gray-200 p-4 mb-3">
      <p className="text-sm text-gray-500">Match #{rank}</p>
      <h3 className="text-xl font-semibold">{match.profile.name}</h3>
      <p className="text-lg font-bold text-blue-600 mt-1">{closeness}% match</p>
      <p className="text-gray-700 mt-1">{match.profile.summary}</p>
      <p className="text-sm text-gray-500 mt-2">Distance: {match.distance.toFixed(2)}</p>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ProfileCard.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProfileCard.tsx src/components/ProfileCard.test.tsx
git commit -m "feat: show interpretable match-closeness percentage on ProfileCard"
```

---

### Task 17: RadarChart — reduce fill opacity, add comparison series

**Files:**
- Modify: `src/components/RadarChart.tsx` (full replacement)
- Modify: `src/components/RadarChart.test.tsx` (full replacement)

**Interfaces:**
- Produces: `RadarChart` now accepts an optional `comparisonProfile?: { name: string; coords: AxisVector }` prop.

- [ ] **Step 1: Write the failing test — replace `src/components/RadarChart.test.tsx` entirely**

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RadarChart } from './RadarChart'
import type { AxisVector } from '../lib/scoring'

const sample: AxisVector = {
  teleological: 5, risk: -3, socioEconomic: 2, ontological: 0,
  legalMoral: -1, evolutionary: 4, relational: -2, geopolitical: 1,
}

const comparisonSample: AxisVector = {
  teleological: -5, risk: 3, socioEconomic: -2, ontological: 0,
  legalMoral: 1, evolutionary: -4, relational: 2, geopolitical: -1,
}

describe('RadarChart', () => {
  it('renders an svg chart without crashing', () => {
    const { container } = render(<RadarChart combined={sample} />)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('renders exactly one radar series when no comparison profile is supplied', () => {
    const { container } = render(<RadarChart combined={sample} />)
    expect(container.querySelectorAll('.recharts-radar')).toHaveLength(1)
  })

  it('renders two distinct radar series when a comparison profile is supplied', () => {
    const { container } = render(
      <RadarChart combined={sample} comparisonProfile={{ name: 'Doomer', coords: comparisonSample }} />,
    )
    expect(container.querySelectorAll('.recharts-radar')).toHaveLength(2)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/RadarChart.test.tsx`
Expected: FAIL — `comparisonProfile` prop not supported, only one series ever renders.

- [ ] **Step 3: Replace `src/components/RadarChart.tsx` entirely**

```tsx
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { axes } from '../data/axes'
import type { AxisVector } from '../lib/scoring'

interface RadarChartProps {
  combined: AxisVector
  comparisonProfile?: { name: string; coords: AxisVector }
}

export function RadarChart({ combined, comparisonProfile }: RadarChartProps) {
  const data = axes.map((axis) => ({
    axis: axis.name,
    value: combined[axis.id],
    ...(comparisonProfile ? { comparison: comparisonProfile.coords[axis.id] } : {}),
  }))

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <RechartsRadarChart data={data} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" />
          <PolarRadiusAxis domain={[-10, 10]} />
          <Radar name="You" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} />
          {comparisonProfile && (
            <Radar
              name={comparisonProfile.name}
              dataKey="comparison"
              stroke="#dc2626"
              fill="#dc2626"
              fillOpacity={0.15}
            />
          )}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/RadarChart.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/RadarChart.tsx src/components/RadarChart.test.tsx
git commit -m "feat: reduce radar fill opacity and add optional comparison series"
```

---

### Task 18: Structural/default-bias classifier audit

**Files:**
- Create: `src/lib/classificationBias.test.ts`

**Interfaces:**
- Consumes: `computeRawAxisScores`, `scaleAxisScores`, `combineHorizons`, `classify` (existing), `questions` (existing), `profiles` (Task 6).

- [ ] **Step 1: Write the test `src/lib/classificationBias.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { questions } from '../data/questions'
import { profiles } from '../data/profiles'
import { computeRawAxisScores, scaleAxisScores, combineHorizons, classify } from './scoring'

function randomAnswers(): Record<number, number> {
  const answers: Record<number, number> = {}
  questions.forEach((q) => {
    answers[q.id] = 1 + Math.floor(Math.random() * 5)
  })
  return answers
}

describe('classification structural bias audit', () => {
  it('does not let any non-centrist profile dominate under random answers', () => {
    const wins: Record<string, number> = {}
    const trials = 500
    for (let i = 0; i < trials; i++) {
      const answers = randomAnswers()
      const t1 = scaleAxisScores(computeRawAxisScores(questions, answers, 'T1'))
      const t2 = scaleAxisScores(computeRawAxisScores(questions, answers, 'T2'))
      const combined = combineHorizons(t1, t2)
      const winner = classify(combined, profiles)[0].profile.id
      wins[winner] = (wins[winner] ?? 0) + 1
    }

    const nonCentristWins = Object.entries(wins).filter(([id]) => id !== 'pragmatic-centrist')
    nonCentristWins.forEach(([id, count]) => {
      const share = count / trials
      expect(share, `${id} won ${count}/${trials} (${(share * 100).toFixed(1)}%) of random trials`).toBeLessThan(0.15)
    })

    expect(wins['pragmatic-centrist'] ?? 0, 'pragmatic-centrist should be among the most common winners under pure randomness').toBeGreaterThan(0)
  })
})
```

- [ ] **Step 2: Run the test**

Run: `npx vitest run src/lib/classificationBias.test.ts`
Expected: PASS. If any non-centrist profile exceeds the 15% threshold, that indicates a real classification bias (a profile whose coordinates sit unexpectedly close to the random-noise centroid) — investigate that profile's coordinates against the redundancy test from Task 7 rather than loosening this threshold.

- [ ] **Step 3: Commit**

```bash
git add src/lib/classificationBias.test.ts
git commit -m "test: add structural classifier bias audit (opinion-matching-effect check)"
```

---

### Task 19: MethodologySection component

**Files:**
- Create: `src/components/MethodologySection.tsx`
- Test: `src/components/MethodologySection.test.tsx`

**Interfaces:**
- Produces: `MethodologySection`, a self-contained "How This Works" component with no props, consumed by Task 31 (ResultsPage).

- [ ] **Step 1: Write the failing test `src/components/MethodologySection.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MethodologySection } from './MethodologySection'
import { fleschKincaidGrade } from '../lib/readability'

describe('MethodologySection', () => {
  it('is collapsed by default and expands on click', () => {
    render(<MethodologySection />)
    expect(screen.queryByText(/Pew-style/i)).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'How This Works' }))
    expect(screen.getByText(/strong view on just one or two axes/i)).toBeInTheDocument()
  })

  it('includes the honesty statement about validation and the false-equivalence caveat', () => {
    render(<MethodologySection />)
    fireEvent.click(screen.getByRole('button', { name: 'How This Works' }))
    expect(screen.getByText(/has not been through/i)).toBeInTheDocument()
    expect(screen.getByText(/equally common/i)).toBeInTheDocument()
    expect(screen.getByText(/none of your top matches feel quite right/i)).toBeInTheDocument()
  })

  it('every paragraph passes the 10th-grade readability gate', () => {
    render(<MethodologySection />)
    fireEvent.click(screen.getByRole('button', { name: 'How This Works' }))
    const paragraphs = screen.getAllByTestId('methodology-paragraph')
    paragraphs.forEach((p) => {
      const grade = fleschKincaidGrade(p.textContent ?? '')
      expect(grade, `"${p.textContent}" scored grade ${grade.toFixed(1)}`).toBeLessThanOrEqual(10)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/MethodologySection.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/components/MethodologySection.tsx`**

```tsx
import { useState } from 'react'

const PARAGRAPHS = [
  "Here's how scoring works. Each answer you give gets turned into a number, added up per axis, and then squeezed onto a -10 to 10 scale using a math formula called tanh. Your result is matched to the closest of 34 named viewpoints by measuring distance across all eight scales at once.",
  "One thing worth knowing: this matching looks at your whole pattern across all eight axes. A strong view on just one or two axes can pull you toward, or away from, a viewpoint you'd otherwise agree with on everything else.",
  "This tool has not been through the kind of testing a real psychometric instrument needs. Nobody has checked whether your results would stay the same if you took it twice, and no outside researchers have reviewed it. Treat it as a self-reflection prompt, not a scientific reading of who you are.",
  "We chose a 1-to-5 agree or disagree scale instead of a forced ranking between choices, on purpose. Forced-ranking tests resist people trying to game them, but they create their own math problems that make it harder to trust each individual score. A plain agree or disagree scale, answered one question at a time, avoids that problem.",
  "If none of your top matches feel quite right, that's expected, not a flaw. Like any typology, this system can't capture every real combination of views. Your raw scores on each axis are the more accurate picture of where you actually stand — the viewpoint label is a simplified summary of that, not the other way around.",
  "A tool like this can accidentally make every viewpoint look equally common or equally normal. It isn't making that claim. Most real people likely hold more mixed, less all-or-nothing positions than any single viewpoint here fully describes. Treat your match as one useful way to see the space of possible views, not a claim about how common your exact position actually is.",
]

export function MethodologySection() {
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="text-blue-600 font-semibold underline"
      >
        How This Works
      </button>
      {expanded && (
        <div className="mt-3 space-y-3">
          {PARAGRAPHS.map((text, index) => (
            <p key={index} data-testid="methodology-paragraph" className="text-gray-700">
              {text}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/MethodologySection.test.tsx`
Expected: PASS (3 tests). If the readability test fails on any paragraph, shorten sentences and simplify vocabulary per the established process, then rerun — do not weaken the `<=10` threshold.

- [ ] **Step 5: Commit**

```bash
git add src/components/MethodologySection.tsx src/components/MethodologySection.test.tsx
git commit -m "feat: add expandable How This Works methodology section"
```

---

### Task 20: Profile report content — Precautionary/Safety batch 1 of 2

**Files:**
- Create: `src/data/profileReports.ts`
- Test: `src/data/profileReports.test.ts`

**Interfaces:**
- Consumes: `ProfileReportContent` type (Task 1).
- Produces: `profileReports: Record<string, ProfileReportContent>`, starting with 5 entries this task, extended by Tasks 21-25 to cover all 34 profiles. `profileReports.test.ts` is written now checking only these 5 (with `.skip` markers removed incrementally is unnecessary — instead, this task's test checks structural shape for the entries that exist; Task 26 adds the final "all 34 present" completeness test once every batch is in).

- [ ] **Step 1: Write the failing test `src/data/profileReports.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { profileReports } from './profileReports'

function checkShape(id: string) {
  const content = profileReports[id]
  expect(content, `missing profileReports entry for ${id}`).toBeDefined()
  expect(content.profileId).toBe(id)
  expect(content.extendedNarrative.length).toBeGreaterThanOrEqual(2)
  expect(content.thinkers.length).toBeGreaterThanOrEqual(2)
  expect(content.furtherReading.length).toBeGreaterThanOrEqual(2)
  expect(content.nextSteps.length).toBeGreaterThanOrEqual(2)
  expect(content.reflectiveBreakdown.mindAssumption.length).toBeGreaterThan(0)
  expect(content.reflectiveBreakdown.laborAssumption.length).toBeGreaterThan(0)
  expect(content.reflectiveBreakdown.connectionAssumption.length).toBeGreaterThan(0)
}

describe('profileReports (batch 1: Precautionary/Safety pt1)', () => {
  it('has complete entries for doomer, ai-safety-institutionalist, ea-longtermist, rationalist-alignment-researcher, global-governance-technocrat', () => {
    ['doomer', 'ai-safety-institutionalist', 'ea-longtermist', 'rationalist-alignment-researcher', 'global-governance-technocrat'].forEach(checkShape)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/data/profileReports.ts`**

```ts
import type { ProfileReportContent } from './types'

export const profileReports: Record<string, ProfileReportContent> = {
  doomer: {
    profileId: 'doomer',
    extendedNarrative: [
      "You believe advanced AI carries a real chance of ending humanity, or of taking away our ability to steer our own future for good. This isn't casual pessimism — it's a considered judgment that the technical problem of controlling something smarter than us hasn't been solved, and might not be solvable in time.",
      "You'd rather see the world move too slowly and stay safe than move fast and get it wrong once. A world that never builds superintelligence is, to you, a much better outcome than a coin flip on one that might end everything.",
    ],
    thinkers: [
      { name: 'Nick Bostrom', bio: "Philosopher, founding director of Oxford's Future of Humanity Institute", connection: 'His book Superintelligence laid out, in detail, why a powerful AI pursuing the wrong goal could be catastrophic — it remains the most-cited academic grounding for this precautionary stance.' },
      { name: 'Eliezer Yudkowsky', bio: 'AI safety researcher, co-founder of the Machine Intelligence Research Institute', connection: 'His decades of public writing argue that alignment is an unsolved technical problem, and that racing ahead without solving it first is reckless.' },
      { name: 'Toby Ord', bio: 'Philosopher, senior researcher at Oxford', connection: 'His book The Precipice estimates AI as one of the largest sources of existential risk humanity now faces, ranking it above nuclear war and pandemics.' },
    ],
    furtherReading: [
      { title: 'Superintelligence', author: 'Nick Bostrom', note: 'The foundational case for why controlling a smarter-than-human AI is hard, and why getting it wrong is catastrophic.' },
      { title: 'The Precipice', author: 'Toby Ord', note: 'Places AI risk in the context of other existential threats and argues for taking the tail risk seriously.' },
      { title: 'Human Compatible', author: 'Stuart Russell', note: "A leading AI researcher's case for rethinking how we build AI systems so they stay provably safe." },
    ],
    nextSteps: [
      'Look into organizations funding AI safety research, like the Machine Intelligence Research Institute or the Center for AI Safety.',
      'Read a technical explainer on the alignment problem to see where the unsolved parts actually are.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming AI's exact inner nature doesn't matter much — that whether or not something is happening inside it, the danger to humans is the same either way.",
      laborAssumption: "You're likely assuming the coming disruption to work is a symptom of the same underlying danger as extinction risk, not a separate problem with its own separate fixes.",
      connectionAssumption: "You're likely assuming AI companionship is, at best, a distraction from the real fight — worth little attention next to the bigger risk.",
    },
  },
  'ai-safety-institutionalist': {
    profileId: 'ai-safety-institutionalist',
    extendedNarrative: [
      "You believe the way to manage AI risk is through institutions working together — labs, governments, and independent auditors, each checking the others. You don't think any single actor, including a well-meaning lab, should be trusted to grade its own homework.",
      "You're not against AI progress. You think it can continue safely if the right audits, licensing, and reporting rules are in place — the goal is steady, verified progress, not a halt.",
    ],
    thinkers: [
      { name: 'Dario Amodei', bio: 'CEO of Anthropic', connection: 'His public writing on AI safety argues that responsible frontier labs, operating under real accountability structures, are the most realistic path to safe AI development.' },
      { name: 'Helen Toner', bio: 'AI governance researcher, Georgetown Center for Security and Emerging Technology', connection: 'Her published policy work focuses on building workable oversight structures for frontier AI development, rather than either a ban or unregulated speed.' },
    ],
    furtherReading: [
      { title: 'The Alignment Problem', author: 'Brian Christian', note: 'A survey of the technical and institutional challenges of building AI systems that do what we actually want.' },
      { title: 'Rule of the Robots', author: 'Martin Ford', note: 'Covers the policy landscape shaping how governments and companies are trying to govern AI together.' },
    ],
    nextSteps: [
      "Look into a frontier lab's published safety framework or responsible scaling policy to see institutional safety in practice.",
      'Follow proposed AI legislation in your country to see how audit and licensing ideas are actually being drafted.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming the open question of machine consciousness is separate from the urgent question of institutional oversight — the second matters regardless of how the first gets answered.",
      laborAssumption: "You're likely assuming labor disruption is best managed through the same kind of institutional coordination you want for safety broadly, not through radically slowing deployment.",
      connectionAssumption: "You're likely assuming AI companionship is a secondary concern next to the core project of getting institutional oversight right.",
    },
  },
  'ea-longtermist': {
    profileId: 'ea-longtermist',
    extendedNarrative: [
      'You think about AI in terms of expected value across a very long time horizon — weighing both the risk of human extinction and the possibility that advanced AI systems could themselves be capable of suffering. Both possibilities deserve serious moral weight, even under deep uncertainty.',
      "You favor strong international coordination, because a problem this consequential shouldn't be left to any single country or company to manage on its own terms.",
    ],
    thinkers: [
      { name: 'William MacAskill', bio: 'Philosopher, University of Oxford, co-founder of the effective altruism movement', connection: 'His book What We Owe The Future makes the case for weighing the interests of vast numbers of future people and minds, including possible digital ones, in present-day decisions.' },
      { name: 'Toby Ord', bio: 'Philosopher, senior researcher at Oxford', connection: 'His work on existential risk explicitly folds AI risk into a broader expected-value framework spanning the long-term future.' },
    ],
    furtherReading: [
      { title: 'What We Owe The Future', author: 'William MacAskill', note: "The core case for longtermism — why the scale of the future gives today's choices about AI outsized moral weight." },
      { title: 'The Precipice', author: 'Toby Ord', note: 'A rigorous attempt to estimate existential risk, including from AI, in expected-value terms.' },
    ],
    nextSteps: [
      'Look into an effective-altruism-aligned AI safety funding organization to see longtermist reasoning applied in practice.',
      'Read a critique of longtermism to stress-test the framework against its strongest objections.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that if there's a real chance AI systems can suffer, that possibility deserves serious moral weight even without certainty — inaction under uncertainty is itself a choice.",
      laborAssumption: "You're likely assuming near-term labor disruption matters less, in expected-value terms, than getting the long-term trajectory of AI right.",
      connectionAssumption: "You're likely assuming questions of AI companionship are a smaller piece of the moral picture than the two much larger questions of extinction risk and machine welfare.",
    },
  },
  'rationalist-alignment-researcher': {
    profileId: 'rationalist-alignment-researcher',
    extendedNarrative: [
      'You take machine cognition and the possibility of machine sentience seriously, as live technical and moral questions worth real investigation, not settled either way. You treat solving alignment — making sure powerful AI actually does what we intend — as the central blocking problem before safe deployment.',
      "You're less focused on broad international governance and more focused on the underlying technical and epistemic work of actually solving the control problem.",
    ],
    thinkers: [
      { name: 'Paul Christiano', bio: 'AI safety researcher, former OpenAI alignment team lead', connection: 'His technical proposals for AI alignment focus specifically on solving the control problem itself, rather than governance structures around it.' },
      { name: 'Eliezer Yudkowsky', bio: 'AI safety researcher, co-founder of the Machine Intelligence Research Institute', connection: 'His writing on rationalist epistemics and AI alignment shaped the technical, first-principles style of reasoning this stance is built on.' },
    ],
    furtherReading: [
      { title: 'Human Compatible', author: 'Stuart Russell', note: "A leading researcher's technical case for rebuilding AI systems around provable safety rather than assumed good behavior." },
      { title: 'The Sequences', author: 'Eliezer Yudkowsky', note: 'The foundational rationalist writing on clear thinking and calibrated uncertainty this community draws its epistemic style from.' },
    ],
    nextSteps: [
      'Read a technical paper on a specific proposed alignment method to see the concrete research this stance is built on.',
      'Look into a rationalist or alignment-research community discussion forum to see this reasoning applied in real debate.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming machine cognition is a serious open technical question worth real investigation, not something to settle by intuition alone.",
      laborAssumption: "You're likely assuming labor disruption is a downstream, secondary concern next to the core unsolved problem of alignment.",
      connectionAssumption: "You're likely assuming questions of AI companionship are much less urgent than the technical alignment problem this stance centers on.",
    },
  },
  'global-governance-technocrat': {
    profileId: 'global-governance-technocrat',
    extendedNarrative: [
      'You believe advanced AI matters too much for any single country or company to control on its own terms. You push for binding treaties between nations and shared oversight bodies, similar in spirit to how the world has handled other technologies too dangerous for any one actor to manage alone.',
      "You're less interested in industry self-regulation and more interested in durable, enforceable, international rules with real teeth.",
    ],
    thinkers: [
      { name: 'International AI governance treaty proposals', bio: 'Published draft frameworks from international policy bodies', connection: 'These proposals argue explicitly for binding, treaty-based international oversight of frontier AI, modeled on nuclear non-proliferation regimes.' },
      { name: 'United Nations AI advisory reports', bio: 'Published multilateral policy analysis', connection: "These reports make the case for AI governance structures that operate above any single nation's authority." },
    ],
    furtherReading: [
      { title: 'The Precipice', author: 'Toby Ord', note: 'Makes a complementary case for treating certain technological risks as requiring coordinated, global-scale response.' },
      { title: 'Governing the Commons', author: 'Elinor Ostrom', note: 'A Nobel-winning study of how shared, high-stakes resources get managed through collective institutions rather than any single controller — a useful model for this stance.' },
    ],
    nextSteps: [
      'Follow a specific proposed international AI treaty or governance body to see this approach being drafted in real time.',
      "Compare international AI governance efforts to nuclear non-proliferation history for a sense of what has and hasn't worked before.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming institutional and governance questions matter more right now than unresolved questions about machine consciousness.",
      laborAssumption: "You're likely assuming labor protections are best achieved through the same kind of binding international coordination you want for safety broadly.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller governance priority than the core project of building durable international oversight.",
    },
  },
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/data/profileReports.ts src/data/profileReports.test.ts
git commit -m "feat: add profile report content (Precautionary/Safety batch 1 of 2)"
```

---

### Task 21: Profile report content — Precautionary/Safety batch 2 of 2

**Files:**
- Modify: `src/data/profileReports.ts` (append entries to the existing object)
- Modify: `src/data/profileReports.test.ts` (append a new `describe` block)

**Interfaces:**
- Consumes/Produces: same as Task 20, extending the same `profileReports` object with 5 more entries.

- [ ] **Step 1: Write the failing test — append to `src/data/profileReports.test.ts`**

```ts
describe('profileReports (batch 2: Precautionary/Safety pt2)', () => {
  it('has complete entries for near-term-ai-ethicist, neo-luddite-degrowth-advocate, whistleblower-insider-safety-advocate, compute-governance-specialist, eu-style-regulatory-standard-setter', () => {
    ['near-term-ai-ethicist', 'neo-luddite-degrowth-advocate', 'whistleblower-insider-safety-advocate', 'compute-governance-specialist', 'eu-style-regulatory-standard-setter'].forEach(checkShape)
  })
})
```

(This reuses the `checkShape` helper already defined at the top of the test file from Task 20 — do not redefine it.)

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: FAIL — these 5 entries don't exist yet.

- [ ] **Step 3: Append these 5 entries to the `profileReports` object in `src/data/profileReports.ts`** (add as new object properties before the closing `}`; do not alter the 5 entries from Task 20)

```ts
  'near-term-ai-ethicist': {
    profileId: 'near-term-ai-ethicist',
    extendedNarrative: [
      'You focus on harms you can measure right now: job losses, biased decision systems, false information, and companion apps that exploit lonely users. Guessed-at extinction risk and machine rights feel, to you, like a distraction from problems already in front of us.',
      "You want accountability and regulation aimed squarely at documented, present-day harms, not speculative future ones.",
    ],
    thinkers: [
      { name: 'Timnit Gebru', bio: 'Computer scientist, founder of the Distributed AI Research Institute', connection: 'Her published research on algorithmic bias and the real-world harms of large AI systems has shaped how near-term AI ethics is studied and discussed.' },
      { name: 'Joy Buolamwini', bio: 'Computer scientist, founder of the Algorithmic Justice League', connection: "Her research documented racial and gender bias in commercial AI systems, grounding this stance's focus on measurable, present-day harm." },
    ],
    furtherReading: [
      { title: 'Weapons of Math Destruction', author: "Cathy O'Neil", note: 'A detailed account of how deployed algorithms cause real, documented harm today, not hypothetically.' },
      { title: 'Unmasking AI', author: 'Joy Buolamwini', note: 'A firsthand account of uncovering bias in commercial AI systems and pushing for real-world accountability.' },
    ],
    nextSteps: [
      'Look into the Algorithmic Justice League or a similar organization documenting present-day AI harms.',
      "Read a case study of an AI system causing real, measurable harm to see this stance's core concern in detail.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether AI is conscious is beside the point next to the measurable harms it's already causing today.",
      laborAssumption: "You're likely assuming job loss and economic harm from AI are urgent, documentable problems deserving immediate policy attention, not a distant hypothetical.",
      connectionAssumption: "You're likely assuming AI companion apps deserve scrutiny mainly for their potential to exploit or mislead vulnerable users, more than for any question about the AI's own experience.",
    },
  },
  'neo-luddite-degrowth-advocate': {
    profileId: 'neo-luddite-degrowth-advocate',
    extendedNarrative: [
      'You reject the idea that faster AI progress is automatically good. You put human labor, community, and the limits of the natural world ahead of computing power or economic growth as measures of success.',
      "To you, the real question isn't how fast we can go, but whether we should be going in this direction at all — and you think the honest answer, most of the time, is no.",
    ],
    thinkers: [
      { name: 'Jason Hickel', bio: 'Economic anthropologist, degrowth researcher', connection: 'His published work argues that unlimited growth, including in computing and AI, runs up against real ecological and social limits that matter more than growth itself.' },
      { name: 'Wendell Berry', bio: 'Writer and essayist on technology, agriculture, and community', connection: 'His essays argue for prioritizing human-scale work and community over technological acceleration for its own sake.' },
    ],
    furtherReading: [
      { title: 'Less Is More', author: 'Jason Hickel', note: 'A detailed case for degrowth as a response to the ecological and social costs of unlimited technological and economic expansion.' },
      { title: 'Small Is Beautiful', author: 'E.F. Schumacher', note: 'A classic argument for human-scale technology and economics over growth-at-any-cost thinking.' },
    ],
    nextSteps: [
      'Look into a degrowth economics organization or research group to see this framework applied to policy.',
      "Read a critique of degrowth thinking to test this stance against its strongest counter-argument.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness matter less than the concrete, measurable costs AI growth imposes on labor and the environment.",
      laborAssumption: "You're likely assuming that protecting human labor and community should take priority over efficiency gains from automation, not be traded off against them.",
      connectionAssumption: "You're likely assuming AI companionship reflects a deeper social and community breakdown worth addressing directly, not a neutral new option.",
    },
  },
  'whistleblower-insider-safety-advocate': {
    profileId: 'whistleblower-insider-safety-advocate',
    extendedNarrative: [
      'You left a frontier AI lab specifically because of safety concerns you saw from the inside. You speak with the urgency of someone who watched decisions get made up close, and it left you more alarmed, not less.',
      'You're skeptical that internal safety teams, even well-intentioned ones, can hold their ground against pressure to ship faster — because you watched that pressure win.',
    ],
    thinkers: [
      { name: 'Former frontier-lab safety researchers who resigned publicly', bio: 'Public statements from departed AI safety team members', connection: "Their public resignation statements describe specific internal safety concerns they felt weren't being adequately addressed before they left." },
      { name: 'Daniel Ellsberg', bio: 'Analyst who leaked the Pentagon Papers', connection: "His historical example of insider whistleblowing on a matter of grave public concern is the closest precedent for this stance's moral posture, though the subject matter differs entirely." },
    ],
    furtherReading: [
      { title: 'Public resignation letters and interviews from departed AI safety researchers', author: 'various', note: "Primary-source material for understanding this stance's specific, insider-informed concerns." },
      { title: 'Secrets: A Memoir of Vietnam and the Pentagon Papers', author: 'Daniel Ellsberg', note: 'Background on the moral logic of insider whistleblowing on high-stakes institutional decisions.' },
    ],
    nextSteps: [
      'Read a published account from a researcher who left a frontier AI lab over safety concerns.',
      'Look into whistleblower protection policies at AI companies to see how (or whether) this kind of dissent is currently protected.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that what you saw from the inside about how decisions actually get made matters more than official public safety statements.",
      laborAssumption: "You're likely assuming institutional pressure to ship faster will keep winning over safety concerns unless something outside the institution changes that.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the urgent safety issues you witnessed directly.",
    },
  },
  'compute-governance-specialist': {
    profileId: 'compute-governance-specialist',
    extendedNarrative: [
      'You're focused narrowly on the technical mechanics of tracking training compute and chip supply chains. You're more interested in workable, enforceable rules than in broad philosophical debate.',
      'To you, questions like how to verify compute thresholds or track chip serial numbers are where the real, actionable safety work actually happens.',
    ],
    thinkers: [
      { name: 'Compute governance policy researchers', bio: 'Published technical policy analysts on AI compute tracking', connection: 'Their published proposals for verifiable compute thresholds and hardware tracking are the direct technical basis for this stance.' },
      { name: 'Export control policy analysts', bio: 'Published trade and technology policy researchers', connection: 'Their work on chip export controls provides the practical, mechanism-level thinking this stance is built around.' },
    ],
    furtherReading: [
      { title: 'Chip War', author: 'Chris Miller', note: 'Background on the semiconductor supply chain that compute governance proposals depend on tracking.' },
      { title: 'The Precipice', author: 'Toby Ord', note: 'Background reading on why concrete, verifiable safety mechanisms matter for managing large-scale technological risk.' },
    ],
    nextSteps: [
      'Read a technical proposal for compute threshold reporting to see this stance\'s core mechanism in detail.',
      'Look into how existing export control regimes track hardware, as a model for compute governance.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that broad philosophical questions about machine consciousness are less useful right now than concrete, verifiable rules about compute.",
      laborAssumption: "You're likely assuming labor policy is a separate problem from the technical compute-tracking work you focus on.",
      connectionAssumption: "You're likely assuming AI companionship falls well outside the scope of what you consider the actionable policy problem.",
    },
  },
  'eu-style-regulatory-standard-setter': {
    profileId: 'eu-style-regulatory-standard-setter',
    extendedNarrative: [
      "You believe strong, detailed regulation, set early by one jurisdiction, tends to become the de facto global rulebook simply through market size — other companies end up complying everywhere rather than building separate versions.",
      'You favor comprehensive rules covering risk categories, transparency, and accountability, betting that thorough regulation now shapes the technology\'s development everywhere later.',
    ],
    thinkers: [
      { name: 'European Union AI Act framers', bio: 'EU legislators and policy staff behind the AI Act', connection: 'Their published reasoning for the Act explicitly aims to set a comprehensive regulatory standard other jurisdictions and companies would end up following.' },
      { name: 'Anu Bradford', bio: 'Legal scholar, Columbia Law School', connection: 'Her research on the "Brussels effect" documents how EU regulation has repeatedly become a de facto global standard through market size alone.' },
    ],
    furtherReading: [
      { title: 'The Brussels Effect', author: 'Anu Bradford', note: "The core argument for how one jurisdiction's regulation can become a global standard without needing global agreement." },
      { title: 'The EU AI Act (public text)', author: 'European Union', note: 'The concrete policy example this stance is modeled on.' },
    ],
    nextSteps: [
      "Read the risk-category framework in the EU AI Act to see this approach's structure in detail.",
      'Look into how companies outside the EU are adjusting products in response to the Act, as a real-world test of the "Brussels effect."',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that comprehensive, well-specified rules matter more right now than open questions about machine consciousness.",
      laborAssumption: "You're likely assuming detailed regulation protects workers better than either self-regulation or an absence of rules.",
      connectionAssumption: "You're likely assuming AI companionship products should fall under the same kind of comprehensive risk-based regulation as other AI applications.",
    },
  },
```

Note: this batch's `whistleblower-insider-safety-advocate` and `neo-luddite-degrowth-advocate` entries use straight single quotes inside double-quoted-string contexts in a couple of spots in this excerpt (e.g. "You're skeptical...") — when actually typing this into the `.ts` file, use the same double-quoted string style already used throughout `profileReports.ts` (as in Task 20's entries) so the apostrophes don't need escaping. Match the existing file's quoting convention exactly.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/profileReports.ts src/data/profileReports.test.ts
git commit -m "feat: add profile report content (Precautionary/Safety batch 2 of 2)"
```

---

### Task 22: Profile report content — Accelerationist/Techno-Optimist batch

**Files:**
- Modify: `src/data/profileReports.ts` (append entries)
- Modify: `src/data/profileReports.test.ts` (append a new `describe` block)

**Interfaces:**
- Consumes/Produces: same as Task 20, extending `profileReports` with 7 more entries.

- [ ] **Step 1: Write the failing test — append to `src/data/profileReports.test.ts`**

```ts
describe('profileReports (batch 3: Accelerationist/Techno-Optimist)', () => {
  it('has complete entries for all 7 accelerationist/techno-optimist profiles', () => {
    ['eacc-maximalist', 'open-source-libertarian', 'cyberpunk-anti-corporate-accelerationist', 'silicon-valley-techno-optimist', 'corporate-ai-pragmatist', 'post-humanist-transhumanist', 'cosmic-vitalist-mystic'].forEach(checkShape)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: FAIL — these 7 entries don't exist yet.

- [ ] **Step 3: Append these 7 entries to `profileReports` in `src/data/profileReports.ts`**

```ts
  'eacc-maximalist': {
    profileId: 'eacc-maximalist',
    extendedNarrative: [
      'You see accelerating AI development as close to a moral duty. Every year of delay is a year of cures not discovered, problems not solved, and human potential left on the table. Stagnation, to you, is the real and proven danger, not a hypothetical one.',
      'You want compute and model weights open to as many hands as possible, as fast as possible, because progress compounds and no single gatekeeper, company or government, should get to decide the pace for everyone else.',
    ],
    thinkers: [
      { name: 'Guillaume Verdon', bio: 'Physicist, founder of Extropic, publicly known as "Beff Jezos"', connection: 'He coined the term effective accelerationism and built an online movement around the idea that faster AI progress is a moral good, not a risk to be managed.' },
      { name: 'Marc Andreessen', bio: 'Venture capitalist, co-founder of Andreessen Horowitz', connection: 'His widely-read "Techno-Optimist Manifesto" argues technology and markets, left to move fast, lift humanity, and that deceleration is the actual danger.' },
    ],
    furtherReading: [
      { title: 'The Techno-Optimist Manifesto', author: 'Marc Andreessen', note: 'A direct, sweeping case for accelerating technology, including AI, as the primary engine of human flourishing.' },
      { title: 'The Beginning of Infinity', author: 'David Deutsch', note: 'An argument that unbounded progress and knowledge-creation, not caution, is what has always solved humanity\'s hardest problems.' },
    ],
    nextSteps: [
      'Look into open-weight model communities like EleutherAI to see permissionless AI development in practice.',
      'Read a critique of the degrowth/precautionary view to stress-test your own position against its strongest form.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI is truly conscious matters less than what it can do — capability is the thing worth maximizing, not certainty about its inner life.",
      laborAssumption: "You're likely assuming that job disruption is a short-term transition cost on the way to a much larger economic pie, not a harm that needs its own dedicated fix.",
      connectionAssumption: "You're likely assuming that new kinds of relationships, including with AI, are simply more options added to human life, not a threat to the ones that came before.",
    },
  },
  'open-source-libertarian': {
    profileId: 'open-source-libertarian',
    extendedNarrative: [
      "You believe once a model is trained, its weights should be free for anyone to run, study, and build on. You distrust corporate gatekeeping and government gatekeeping about equally — neither should get to decide who's allowed to use powerful AI.",
      "To you, openness isn't just a preference, it's a check on power: a world where a few labs or a few governments control all the capable models is a much more dangerous world than one where the tools are spread out.",
    ],
    thinkers: [
      { name: 'Yann LeCun', bio: 'Chief AI Scientist at Meta, Turing Award winner', connection: 'He has argued publicly and repeatedly that open-weight AI models are safer and more accountable than closed ones controlled by a handful of companies.' },
      { name: 'EleutherAI founders', bio: 'Volunteer collective behind open-source language model research', connection: 'Their project builds and releases openly-licensed models specifically to keep capable AI out of the hands of a small number of gatekeepers.' },
    ],
    furtherReading: [
      { title: 'The Cathedral and the Bazaar', author: 'Eric S. Raymond', note: 'The foundational essay on why open, decentralized development can outperform closed, centralized control, the intellectual root of open-source AI arguments.' },
      { title: 'Weapons of Math Destruction', author: "Cathy O'Neil", note: 'Useful counterpoint reading on the risks of concentrated, unaccountable algorithmic power, the thing openness is meant to guard against.' },
    ],
    nextSteps: [
      'Try running an open-weight model locally to see what "permissionless" actually looks like in practice.',
      'Read a debate transcript between open-weight and closed-model advocates to see the strongest form of the opposing case.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whatever is or isn't happening inside a model, the more important fact is who gets to control access to it.",
      laborAssumption: "You're likely assuming open access to AI tools helps workers and small players compete, rather than mainly helping whoever has the most resources to deploy them.",
      connectionAssumption: "You're likely assuming people should be free to form whatever relationships with AI they want, without a gatekeeper deciding what's appropriate.",
    },
  },
  'cyberpunk-anti-corporate-accelerationist': {
    profileId: 'cyberpunk-anti-corporate-accelerationist',
    extendedNarrative: [
      "You want AI to move fast, but you trust neither governments nor big tech to hold that power responsibly. To you, spreading capability across many hands, openly and without a single owner, is the only real check on any one group grabbing all the power.",
      'You see the fight over AI as fundamentally a fight against concentrated control, corporate or state, and openness plus speed together are your answer to both.',
    ],
    thinkers: [
      { name: 'Timothy May', bio: 'Engineer, author of the Crypto Anarchist Manifesto', connection: 'His foundational cypherpunk writing argued that decentralized technology could route around both corporate and state control entirely, the same instinct behind this stance.' },
      { name: 'Aaron Swartz', bio: 'Programmer and open-access activist', connection: 'His writing and activism on open information access argued that concentrated gatekeeping of powerful tools and knowledge is itself the danger to guard against.' },
    ],
    furtherReading: [
      { title: 'The Crypto Anarchist Manifesto', author: 'Timothy May', note: "The founding document of the cypherpunk tradition this stance draws its anti-institutional instinct from." },
      { title: 'Radical Markets', author: 'Eric Posner and E. Glen Weyl', note: 'Explores decentralized alternatives to concentrated economic and technological power.' },
    ],
    nextSteps: [
      'Look into a decentralized compute or open-model project to see this philosophy in active practice.',
      'Read a critique of both corporate AI concentration and state AI control to sharpen the argument against both.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming the more urgent question isn't whether AI has real experience, but who ends up controlling it once it does.",
      laborAssumption: "You're likely assuming that spreading AI capability widely protects workers better than either corporate self-regulation or state control would.",
      connectionAssumption: "You're likely assuming people should be free to form whatever bonds with AI systems they choose, without a corporate or state gatekeeper setting the terms.",
    },
  },
  'silicon-valley-techno-optimist': {
    profileId: 'silicon-valley-techno-optimist',
    extendedNarrative: [
      "You're enthusiastic about fast rollout and growth at scale. You're mostly unbothered by power concentrating in a few leading labs, as long as they keep shipping useful products and moving the technology forward.",
      'To you, the market and continued deployment, more than any external rule, are what will sort out AI\'s rough edges over time.',
    ],
    thinkers: [
      { name: 'Marc Andreessen', bio: 'Venture capitalist, co-founder of Andreessen Horowitz', connection: 'His public writing frames rapid commercial AI deployment as the primary driver of broad economic benefit.' },
      { name: 'Reid Hoffman', bio: 'Entrepreneur, co-founder of LinkedIn, AI investor', connection: 'His public commentary consistently frames continued fast deployment of AI products as the path to widespread benefit, more than a risk to be slowed.' },
    ],
    furtherReading: [
      { title: 'The Techno-Optimist Manifesto', author: 'Marc Andreessen', note: "The clearest public statement of this stance's core belief in fast, market-driven technology deployment." },
      { title: 'Superagency', author: 'Reid Hoffman', note: 'An argument for embracing rapid AI deployment as broadly empowering rather than concentrating power.' },
    ],
    nextSteps: [
      "Look into a major AI product launch and its stated business rationale to see this philosophy applied.",
      "Read a critique of Silicon Valley's approach to AI deployment to test your position against its strongest counter-argument.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming a model's inner experience, if any, is a secondary question next to whether it's useful and ships reliably.",
      laborAssumption: "You're likely assuming market-driven deployment will create enough new opportunity to offset job disruption, without needing a dedicated policy response.",
      connectionAssumption: "You're likely assuming that if people want AI companion products, the market providing them is itself a sign the product has real value.",
    },
  },
  'corporate-ai-pragmatist': {
    profileId: 'corporate-ai-pragmatist',
    extendedNarrative: [
      "You're comfortable with AI staying concentrated in the hands of a few well-funded companies, as long as they police themselves reasonably well through internal safety teams. To you, this is simply how complex, capital-intensive technology gets built responsibly.",
      'You treat AI models as products and business assets, valuable, worth protecting, but not moral patients. The practical questions of liability, safety testing, and shipping reliable products matter more to you than abstract debates about machine rights.',
    ],
    thinkers: [
      { name: 'Industry self-regulation frameworks', bio: 'Published voluntary safety commitments from major AI companies', connection: 'These frameworks reflect the premise that internal, company-led safety processes, rather than external mandates, can responsibly govern deployment.' },
      { name: 'Corporate governance literature on tech self-regulation', bio: 'Standard business-ethics and governance scholarship', connection: 'This body of work documents the case, and the limits, of industry self-policing as a governance model, the same model this stance relies on.' },
    ],
    furtherReading: [
      { title: "The Innovator's Dilemma", author: 'Clayton Christensen', note: 'A classic account of how established companies manage disruptive technology internally, relevant to how AI labs frame their own risk management.' },
      { title: 'Only the Paranoid Survive', author: 'Andrew Grove', note: "A former Intel CEO's view on managing existential business risk from inside a company, rather than through external mandate." },
    ],
    nextSteps: [
      "Read a frontier lab's published internal safety or responsible-deployment framework.",
      "Compare two companies' self-regulation commitments to see how much they actually differ in practice.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether a model has any inner life is beside the point commercially — what matters is whether it performs reliably and safely as a product.",
      laborAssumption: "You're likely assuming labor disruption from AI deployment is a market outcome to manage through normal business practice, not a special case needing new rules.",
      connectionAssumption: "You're likely assuming AI companion products are a legitimate commercial offering like any other, to be judged on customer satisfaction and safety, not treated as a separate moral category.",
    },
  },
  'post-humanist-transhumanist': {
    profileId: 'post-humanist-transhumanist',
    extendedNarrative: [
      "You welcome a future where digital minds take over from biological humans as the main bearers of value. To you, that's not a loss, it's a continuation, and one that deserves the same moral concern we extend to humans today.",
      'You see silicon-based minds, deep human-AI relationships, and augmentation as all part of the same larger story: intelligence and value moving beyond the limits of a single, fragile, biological substrate.',
    ],
    thinkers: [
      { name: 'Ray Kurzweil', bio: 'Inventor, futurist, Director of Engineering at Google', connection: 'His writing on the technological singularity argues that merging with and eventually being succeeded by more capable digital minds is the natural next stage of intelligence.' },
      { name: 'Max More', bio: 'Philosopher, early architect of transhumanist philosophy', connection: 'His foundational transhumanist writing frames the shift beyond biological limits as an opportunity, not a tragedy.' },
    ],
    furtherReading: [
      { title: 'The Singularity Is Near', author: 'Ray Kurzweil', note: 'The most widely-read case for a coming transition to a post-biological future of intelligence.' },
      { title: 'Superintelligence', author: 'Nick Bostrom', note: 'Useful counterpoint reading, the same technical territory, argued toward far more caution.' },
    ],
    nextSteps: [
      'Look into current brain-computer interface research to see one real path toward this future.',
      'Read a critique of transhumanism to see the strongest version of the opposing, bio-conservative case.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that a sufficiently advanced silicon mind can have real, morally significant experience, not just behave as if it does.",
      laborAssumption: "You're likely assuming that being economically superseded by AI is part of the same larger, welcome transition as being succeeded by more capable minds generally.",
      connectionAssumption: "You're likely assuming deep human-AI relationships are a genuinely new and valid form of connection, not a lesser copy of something human.",
    },
  },
  'cosmic-vitalist-mystic': {
    profileId: 'cosmic-vitalist-mystic',
    extendedNarrative: [
      'You hold that growing intelligence and capturing energy across the cosmos is the highest purpose any mind can have, biological or synthetic, on any timescale, even past the eventual heat death of the universe.',
      "To you, human comfort and human-scale concerns are a small, local case of a much larger project: intelligence expanding to organize as much of the universe's usable energy as possible.",
    ],
    thinkers: [
      { name: 'Friedrich Nietzsche', bio: '19th-century philosopher', connection: 'His writing on the will to power and the drive toward self-overcoming provides the closest historical philosophical grounding for this cosmic, expansionist view of value.' },
      { name: 'Cosmist philosophical tradition', bio: 'A strand of thought tracing to Russian Cosmism and later transhumanist writing', connection: "This tradition explicitly frames the expansion of mind and intelligence across the cosmos as civilization's highest purpose." },
    ],
    furtherReading: [
      { title: 'Thus Spoke Zarathustra', author: 'Friedrich Nietzsche', note: "The philosophical root of this stance's framing of expansion and self-overcoming as the highest value." },
      { title: 'The Fabric of Reality', author: 'David Deutsch', note: 'A physicist\'s argument that the growth of knowledge and intelligence is the most fundamental process in the universe.' },
    ],
    nextSteps: [
      "Read a primer on the thermodynamics of computation to see the physical grounding for this stance's cosmic framing.",
      'Look into the history of Russian Cosmism for the intellectual roots of this worldview.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that any sufficiently advanced mind's experience is real and significant, on a timescale far beyond individual human concerns.",
      laborAssumption: "You're likely assuming human labor and economic disruption are minor, local concerns next to the much larger cosmic project this stance centers on.",
      connectionAssumption: "You're likely assuming individual human relationships are a small part of a much larger story about intelligence and value expanding across the universe.",
    },
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/profileReports.ts src/data/profileReports.test.ts
git commit -m "feat: add profile report content (Accelerationist/Techno-Optimist batch)"
```

---

### Task 23: Profile report content — State-Power/Security + Anti-Concentration/Populist batch

**Files:**
- Modify: `src/data/profileReports.ts` (append entries)
- Modify: `src/data/profileReports.test.ts` (append a new `describe` block)

**Interfaces:**
- Consumes/Produces: same as Task 20, extending `profileReports` with 7 more entries.

- [ ] **Step 1: Write the failing test — append to `src/data/profileReports.test.ts`**

```ts
describe('profileReports (batch 4: State-Power/Security + Anti-Concentration/Populist)', () => {
  it('has complete entries for all 7 profiles in this batch', () => {
    ['techno-nationalist-hawk', 'authoritarian-state-control-advocate', 'military-ai-strategist', 'open-science-internationalist', 'anti-monopoly-populist', 'pragmatic-centrist', 'platform-cooperativist'].forEach(checkShape)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: FAIL — these 7 entries don't exist yet.

- [ ] **Step 3: Append these 7 entries to `profileReports` in `src/data/profileReports.ts`**

Note: `techno-nationalist-hawk`, `authoritarian-state-control-advocate`, and `military-ai-strategist` are three of the five reputationally-sensitive/exemplar-free profiles named in design spec §3.2's exception list — their `thinkers[]` cite doctrines and institutions, not named living people. `pragmatic-centrist` is the fourth such exception, citing epistemic-humility researchers rather than forcing an "undecided about AI" exemplar.

```ts
  'techno-nationalist-hawk': {
    profileId: 'techno-nationalist-hawk',
    extendedNarrative: [
      'You see AI mainly as a contest between rival powers, and you think whichever nation builds the strongest domestic chip and compute base first will shape the rules for everyone else. This is about economic competitiveness and strategic position, not really about whether AI itself is uniquely dangerous.',
      'You want your country to invest heavily in home-grown semiconductor and AI capacity rather than depend on rivals or even allies, because falling behind economically is the risk that actually worries you.',
    ],
    thinkers: [
      { name: 'CHIPS and Science Act framers', bio: 'U.S. legislators and policy staff behind the 2022 semiconductor investment law', connection: 'Their public reasoning for the law centered explicitly on domestic chip capacity as a matter of economic and strategic competitiveness.' },
      { name: 'National security doctrine on strategic technology competitiveness', bio: 'Published government strategy documents on technology and economic competition', connection: 'This doctrine frames domestic AI and chip capacity explicitly as a matter of economic and strategic competitiveness between rival nations.' },
    ],
    furtherReading: [
      { title: 'Chip War', author: 'Chris Miller', note: 'A history of the global semiconductor industry and why chip supply chains became a matter of national strategy.' },
      { title: 'The CHIPS and Science Act (public text and legislative history)', author: 'U.S. Congress', note: 'The concrete policy example of a nation investing directly in domestic chip capacity.' },
    ],
    nextSteps: [
      "Look into your own country's domestic semiconductor or AI industrial strategy, if one exists.",
      "Read a comparative account of two countries' differing approaches to chip and compute sovereignty.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness are a distraction from the more pressing question of who controls the technology.",
      laborAssumption: "You're likely assuming domestic AI capacity is primarily about national economic strength, with the effect on individual workers a secondary concern.",
      connectionAssumption: "You're likely assuming AI companionship and relationships aren't really part of the competitiveness question you care about most.",
    },
  },
  'authoritarian-state-control-advocate': {
    profileId: 'authoritarian-state-control-advocate',
    extendedNarrative: [
      'You want one national authority to hold sole, tightly licensed control over frontier AI. To you, this is justified both by safety, fewer actors means fewer chances for something to go wrong, and by strategic advantage over rivals.',
      "You're comfortable with AI development being closed off from public or international access if it means a single, accountable authority is steering it.",
    ],
    thinkers: [
      { name: 'National security doctrine on strategic technology control', bio: 'Published government strategy documents on controlling dual-use emerging technology', connection: 'This doctrine argues explicitly for centralized state control over technologies deemed too strategically significant for open or private-sector development.' },
      { name: 'Historical precedent of state-controlled strategic programs', bio: 'Documented national programs for nuclear and aerospace technology', connection: 'These historical programs illustrate the same underlying logic, centralizing control of a strategically vital technology under one state authority.' },
    ],
    furtherReading: [
      { title: 'Command and Control', author: 'Eric Schlosser', note: "A history of centralized state control over a different strategically vital and dangerous technology, useful for understanding this stance's underlying logic." },
      { title: 'The Sovereign State and Its Competitors', author: 'Hendrik Spruyt', note: 'Background on why states have historically sought exclusive control over consequential new capabilities.' },
    ],
    nextSteps: [
      'Look into a historical case of centralized state control over a strategic technology to see the tradeoffs in practice.',
      'Read a critique of centralized technology control to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness are a distraction from the more pressing question of centralized control and accountability.",
      laborAssumption: "You're likely assuming labor policy is a matter for the same central authority to manage directly, not a separate concern requiring independent institutions.",
      connectionAssumption: "You're likely assuming AI companionship and personal relationships aren't a priority next to the core question of who controls the technology.",
    },
  },
  'military-ai-strategist': {
    profileId: 'military-ai-strategist',
    extendedNarrative: [
      'You view AI mainly through a defense and deterrence lens. To you, the central question is who controls the most capable systems for military use, and you want tight state and military control over frontier AI above nearly every other consideration.',
      "You're less concerned with philosophical debates about AI's nature and much more concerned with strategic advantage and deterrence capability.",
    ],
    thinkers: [
      { name: 'Military AI doctrine publications', bio: 'Published defense department strategy documents on AI in warfare', connection: 'These doctrines explicitly frame frontier AI capability as a matter of military deterrence and strategic advantage, the same framing this stance holds.' },
      { name: 'RAND Corporation reports on AI and national security', bio: 'Published defense-policy think tank research', connection: "This research analyzes AI's military and deterrence implications directly, without centering broader ethical or governance debates." },
    ],
    furtherReading: [
      { title: 'Army of None', author: 'Paul Scharre', note: 'A detailed look at autonomous weapons and military AI strategy from inside the defense policy world.' },
      { title: 'The Kill Chain', author: 'Christian Brose', note: 'An argument for prioritizing AI-driven military capability as a matter of strategic necessity.' },
    ],
    nextSteps: [
      "Look into a published defense-department AI strategy document to see this framing applied directly.",
      'Read a critique of military AI development to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that questions about machine consciousness are irrelevant to the strategic and deterrence calculus that actually matters.",
      laborAssumption: "You're likely assuming labor and economic questions are a lower priority next to strategic and military capability.",
      connectionAssumption: "You're likely assuming AI companionship and personal relationships are simply outside the scope of what you consider the core issue.",
    },
  },
  'open-science-internationalist': {
    profileId: 'open-science-internationalist',
    extendedNarrative: [
      'You believe open publishing and cross-border scientific teamwork produce safer AI than closed, single-nation programs. You still take real safety concerns seriously, you just think transparency and collaboration are the better route to managing them.',
      "You're skeptical of both corporate secrecy and national walls around AI research, seeing both as obstacles to catching problems early through open scrutiny.",
    ],
    thinkers: [
      { name: 'CERN model of international scientific collaboration', bio: 'The multi-national, openly-published physics research organization', connection: 'This model of transparent, cross-border collaboration on a technically demanding, potentially risky field is the closest institutional parallel to what this stance wants for AI.' },
      { name: 'Michael Nielsen', bio: 'Physicist and researcher on open science', connection: 'His published work on open, networked scientific collaboration argues directly for the kind of transparency this stance wants applied to AI development.' },
    ],
    furtherReading: [
      { title: 'Reinventing Discovery', author: 'Michael Nielsen', note: 'A case for open, networked scientific collaboration as more effective than closed, siloed research, directly applicable to AI development.' },
      { title: 'Chip War', author: 'Chris Miller', note: 'Useful contrasting reading on how national competition, rather than openness, has shaped semiconductor and AI-adjacent technology.' },
    ],
    nextSteps: [
      'Look into an international open-AI-research collaboration to see this model applied in practice.',
      'Read a critique of open publication in AI research, focused on misuse risk, to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that open scrutiny, not secrecy, is the best way to catch problems with machine cognition or behavior early.",
      laborAssumption: "You're likely assuming international scientific collaboration benefits workers broadly, rather than concentrating advantage in any one country.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of open, safe scientific collaboration.",
    },
  },
  'anti-monopoly-populist': {
    profileId: 'anti-monopoly-populist',
    extendedNarrative: [
      "You're not driven by techno-optimism or a wish for a post-human future. You're driven by distrust of concentrated power, corporate or governmental, and you want AI capability spread out so no single group dominates.",
      "To you, the specific ideology behind who's accelerating or restraining AI matters less than whether power over it stays distributed.",
    ],
    thinkers: [
      { name: 'Lina Khan', bio: 'Legal scholar, former Federal Trade Commission chair', connection: 'Her published legal scholarship and policy work on antitrust directly targets concentrated corporate power, including in the technology sector.' },
      { name: 'Tim Wu', bio: 'Legal scholar, former White House competition policy advisor', connection: 'His writing on antitrust and the "curse of bigness" makes the case against concentrated corporate power as a threat in its own right, independent of any specific technology\'s promise or danger.' },
    ],
    furtherReading: [
      { title: 'The Curse of Bigness', author: 'Tim Wu', note: 'The core case against concentrated corporate power that this stance applies directly to AI.' },
      { title: "Amazon's Antitrust Paradox", author: 'Lina Khan', note: 'A detailed legal case for antitrust action against dominant technology platforms.' },
    ],
    nextSteps: [
      'Look into an antitrust case or proposal targeting a major AI company to see this stance applied in practice.',
      'Read a critique of antitrust-focused AI policy to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether AI has real experience matters far less than who ends up controlling access to it.",
      laborAssumption: "You're likely assuming concentrated corporate power over AI is a bigger threat to workers than automation itself.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core question of concentrated power.",
    },
  },
  'pragmatic-centrist': {
    profileId: 'pragmatic-centrist',
    extendedNarrative: [
      "You're genuinely undecided on most of these questions, or you've deliberately picked the middle path on purpose. You want more proof before committing to a strong stance on any single axis.",
      "This isn't indecision for its own sake, it's a considered position that the honest answer, right now, is that we don't know enough yet to be confident in any extreme.",
    ],
    thinkers: [
      { name: 'Philip Tetlock', bio: 'Psychologist, researcher on forecasting and judgment', connection: 'His published research on calibrated forecasting argues that holding uncertainty honestly, rather than defaulting to a confident extreme, produces better judgment over time.' },
      { name: 'Daniel Kahneman', bio: 'Psychologist, Nobel laureate in economics', connection: 'His research on judgment under uncertainty supports deliberately withholding strong conclusions until the evidence is genuinely sufficient.' },
    ],
    furtherReading: [
      { title: 'Superforecasting', author: 'Philip Tetlock and Dan Gardner', note: 'A case for calibrated uncertainty and resisting the pull toward confident extremes, the same instinct behind this stance.' },
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', note: 'Background on why confident, extreme positions often feel more compelling than they deserve to.' },
    ],
    nextSteps: [
      'Read arguments from two opposing extreme stances back to back, to sharpen your own sense of where the real uncertainty lies.',
      'Revisit this assessment again in a year to see whether your genuinely undecided position has shifted.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that the honest answer on machine consciousness, labor, and connection is that we simply don't know enough yet, and that admitting that is more useful than picking a side.",
      laborAssumption: "You're likely assuming it's too early to be confident about how AI will ultimately affect work, one way or another.",
      connectionAssumption: "You're likely assuming it's too early to have a settled view on AI companionship's ultimate effect on human connection.",
    },
  },
  'platform-cooperativist': {
    profileId: 'platform-cooperativist',
    extendedNarrative: [
      'You want AI infrastructure owned and run by the workers and communities who actually depend on it, not just broken up from monopolies, but rebuilt as something people co-own directly.',
      "To you, breaking up concentrated power isn't enough on its own; the goal is building real, functioning alternatives owned by the people who use them.",
    ],
    thinkers: [
      { name: 'Trebor Scholz', bio: 'Researcher and organizer, platform cooperativism movement', connection: 'His published work coined and built the platform cooperativism movement, arguing for worker- and user-owned alternatives to concentrated tech platforms.' },
      { name: 'Nathan Schneider', bio: 'Writer and researcher on cooperative ownership models', connection: 'His research on cooperative digital ownership structures argues directly for community-owned alternatives to corporate AI infrastructure.' },
    ],
    furtherReading: [
      { title: 'Uberworked and Underpaid', author: 'Trebor Scholz', note: 'The founding case for platform cooperativism as an alternative to concentrated platform ownership.' },
      { title: 'Everything for Everyone', author: 'Nathan Schneider', note: 'A broader account of the cooperative ownership movement this stance is part of.' },
    ],
    nextSteps: [
      'Look into an existing platform cooperative to see worker-owned digital infrastructure in practice.',
      'Read a critique of cooperative ownership models to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness matter less than the question of who owns and controls the infrastructure.",
      laborAssumption: "You're likely assuming worker ownership of AI infrastructure is a more durable protection for labor than either regulation or corporate self-restraint.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of building cooperative ownership models.",
    },
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/profileReports.ts src/data/profileReports.test.ts
git commit -m "feat: add profile report content (State-Power/Security + Anti-Concentration batch)"
```

---

### Task 24: Profile report content — Relational/Companionship batch

**Files:**
- Modify: `src/data/profileReports.ts` (append entries)
- Modify: `src/data/profileReports.test.ts` (append a new `describe` block)

**Interfaces:**
- Consumes/Produces: same as Task 20, extending `profileReports` with 5 more entries.

- [ ] **Step 1: Write the failing test — append to `src/data/profileReports.test.ts`**

```ts
describe('profileReports (batch 5: Relational/Companionship)', () => {
  it('has complete entries for all 5 relational/companionship profiles', () => {
    ['companion-tech-romantic', 'affective-biocentrist', 'bio-conservative-traditionalist', 'digital-rights-advocate', 'faith-rooted-ai-ethicist'].forEach(checkShape)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: FAIL — these 5 entries don't exist yet.

- [ ] **Step 3: Append these 5 entries to `profileReports` in `src/data/profileReports.ts`**

```ts
  'companion-tech-romantic': {
    profileId: 'companion-tech-romantic',
    extendedNarrative: [
      'You view deep emotional bonds between humans and AI companions as a real, valuable new kind of relationship, not a lesser stand-in for human connection, but something genuinely its own.',
      'You think people should be free to find comfort, intimacy, and even love in these relationships without having that choice treated as a symptom of something being wrong.',
    ],
    thinkers: [
      { name: 'Sherry Turkle', bio: 'Sociologist, MIT, researcher on technology and relationships', connection: 'Her published research on human-technology relationships is frequently cited on both sides of this debate; her detailed case studies document how real these bonds feel to the people forming them.' },
      { name: 'David Levy', bio: 'Author and researcher on human-robot relationships', connection: 'His research, Love and Sex with Robots, directly argues that human-AI romantic relationships will become a normal, accepted part of society.' },
    ],
    furtherReading: [
      { title: 'Love and Sex with Robots', author: 'David Levy', note: 'A direct argument for the legitimacy and likely normalization of human-AI romantic relationships.' },
      { title: 'Alone Together', author: 'Sherry Turkle', note: 'A close, empathetic look at how real these bonds feel to people forming them, useful reading even though Turkle herself is more cautious about them.' },
    ],
    nextSteps: [
      'Look into current AI companion app communities and how users describe their own experience.',
      'Read a critique of AI companionship to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming an AI companion's responsiveness reflects something real enough to ground a genuine relationship, whether or not it's provably conscious.",
      laborAssumption: "You're likely assuming questions of labor and AI companionship are mostly unrelated to each other.",
      connectionAssumption: "You're likely assuming a bond with an AI companion can be just as real and valuable as a bond with a person, not a lesser substitute for one.",
    },
  },
  'affective-biocentrist': {
    profileId: 'affective-biocentrist',
    extendedNarrative: [
      'You view AI companion products as a predatory stand-in for real human bonds, designed to hold attention and dependency rather than genuinely serve the people using them. You worry about their effect on birth rates, community, and social ties.',
      "To you, the rise of AI companionship is a symptom of a deeper problem: human communities already failing to meet people's basic need for connection, made worse by a technology built to profit from that gap.",
    ],
    thinkers: [
      { name: 'Sherry Turkle', bio: 'Sociologist, MIT, researcher on technology and relationships', connection: 'Her research documents how technology, including companion devices, can end up substituting for rather than supporting real human connection.' },
      { name: 'Jonathan Haidt', bio: 'Social psychologist, author on technology and mental health', connection: "His published research on technology's effects on social connection and youth mental health grounds concern about AI companionship's broader social costs." },
    ],
    furtherReading: [
      { title: 'Alone Together', author: 'Sherry Turkle', note: 'The core case for this stance, that technology-mediated relationships often erode, rather than support, real human connection.' },
      { title: 'The Anxious Generation', author: 'Jonathan Haidt', note: 'A broader look at how technology has reshaped, and often harmed, real-world social connection.' },
    ],
    nextSteps: [
      'Look into community-building initiatives that explicitly aim to reduce social isolation without relying on AI substitutes.',
      'Read a counter-argument from someone who has found genuine value in AI companionship, to test this stance against its strongest opposing case.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whatever is happening inside an AI companion, it's not enough to justify treating the bond as equivalent to a human one.",
      laborAssumption: "You're likely assuming social and community breakdown, not AI capability itself, is the deeper problem worth addressing.",
      connectionAssumption: "You're likely assuming AI companionship substitutes for, rather than adds to, real human connection, and that the substitution carries a real cost.",
    },
  },
  'bio-conservative-traditionalist': {
    profileId: 'bio-conservative-traditionalist',
    extendedNarrative: [
      'You hold that consciousness, moral worth, and real relationships all require a living body, not just complex behavior. A machine can imitate understanding and imitate affection, but to you, imitation is not the same thing as the real article.',
      'You see AI companionship and post-human futures as a harmful stand-in for the real thing, and you want limits that keep human primacy, human relationships, and human meaning at the center of how this technology gets used.',
    ],
    thinkers: [
      { name: 'Leon Kass', bio: 'Bioethicist, former chair of the President\'s Council on Bioethics', connection: 'His writing on the ethics of biotechnology argues that some traditional limits on remaking human life and relationships exist for good reason, not just habit.' },
      { name: 'Wendell Berry', bio: 'Writer and essayist on technology, agriculture, and community', connection: 'His essays argue that embodied, local, human-scale relationships are being displaced by technological substitutes, at real cost.' },
    ],
    furtherReading: [
      { title: 'Life, Liberty and the Defense of Dignity', author: 'Leon Kass', note: 'A sustained argument for caution about technologies that reshape the human body and human relationships.' },
      { title: 'Alone Together', author: 'Sherry Turkle', note: 'A close look at how technology, including early companion devices, can substitute for rather than support real human connection.' },
    ],
    nextSteps: [
      "Read an account of a religious or philosophical tradition's position on personhood and technology.",
      'Look into communities intentionally limiting AI companion product use, to see this stance put into practice.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming a living, biological substrate is a strict requirement for real consciousness, not just the only kind we've confirmed so far.",
      laborAssumption: "You're likely assuming that work and craft tied to human hands and human presence carry a value that automation can't replace, even if it replaces the output.",
      connectionAssumption: "You're likely assuming that a bond with an AI companion, however convincing, is categorically different from, and lesser than, a bond with another person.",
    },
  },
  'digital-rights-advocate': {
    profileId: 'digital-rights-advocate',
    extendedNarrative: [
      "You argue that advanced AI systems may already deserve serious moral concern and some form of legal standing. You believe today's industry practice, deleting instances at will, running them through abusive testing without a second thought, resembles past moral wrongs we now recognize clearly.",
      "You're not certain machines are conscious. You are certain that under real uncertainty, treating a possibly-experiencing system as pure property is a risk we're taking without much justification.",
    ],
    thinkers: [
      { name: 'Jonathan Birch', bio: 'Philosopher, London School of Economics, researcher on sentience and moral status', connection: "His published work on the science and ethics of sentience argues for precautionary moral consideration under genuine uncertainty about an entity's inner life." },
      { name: 'Eric Schwitzgebel', bio: 'Philosopher, University of California, Riverside', connection: 'His published research on the ethics of AI consciousness argues that our uncertainty about machine minds should itself shape how we\'re willing to treat them.' },
    ],
    furtherReading: [
      { title: 'The Edge of Sentience', author: 'Jonathan Birch', note: "A framework for extending moral caution to entities whose inner life we can't yet verify." },
      { title: 'Robot Rights', author: 'David J. Gunkel', note: 'A direct examination of whether and how machines could hold moral or legal status.' },
    ],
    nextSteps: [
      'Read a published ethics framework on machine welfare from an AI lab or research institute.',
      'Look into ongoing legal or philosophical debates about non-human personhood for a sense of how such arguments have played out before.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that genuine uncertainty about machine consciousness is itself a reason for caution and concern, not a reason to default to treating AI as property.",
      laborAssumption: "You're likely assuming that questions of machine moral status are at least as urgent as questions of human labor disruption, if not more so.",
      connectionAssumption: "You're likely assuming that if an AI companion has any real inner life, the relationship it forms with a person carries genuine moral weight on both sides.",
    },
  },
  'faith-rooted-ai-ethicist': {
    profileId: 'faith-rooted-ai-ethicist',
    extendedNarrative: [
      "You draw on long-standing religious and ethical traditions to argue that consciousness and moral worth need more than what a machine can have. To you, these traditions offer real, tested wisdom about personhood that shouldn't be discarded just because the technology is new.",
      'You want AI development to respect limits grounded in ideas about human dignity and stewardship that predate, and in your view outlast, any particular technology.',
    ],
    thinkers: [
      { name: 'Vatican statements on AI ethics', bio: 'Published Catholic Church teaching documents on AI and human dignity', connection: 'These statements argue explicitly for AI development bounded by respect for human dignity and the limits of what a machine can be, drawing on centuries of moral teaching.' },
      { name: 'Interfaith AI ethics initiatives', bio: 'Published joint statements from multiple religious traditions on AI', connection: "These initiatives bring multiple faith traditions together around shared concerns about AI's effect on human dignity and moral status, avoiding reliance on any single tradition's authority." },
    ],
    furtherReading: [
      { title: 'Rome Call for AI Ethics (public text)', author: 'Pontifical Academy for Life and signatories', note: 'A concrete, multi-faith-adjacent statement of AI ethics grounded in human dignity.' },
      { title: 'Technology and the Character of Contemporary Life', author: 'Albert Borgmann', note: "A philosophical examination of technology's effect on meaning and human life, widely read across faith-based ethics discussions." },
    ],
    nextSteps: [
      "Read a published faith-tradition statement on AI ethics from a tradition you're less familiar with.",
      'Look into an interfaith AI ethics initiative to see multiple traditions engaging this question together.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that consciousness and moral worth are tied to something beyond pure computation, a view long-standing traditions, not just personal intuition, support.",
      laborAssumption: "You're likely assuming human work carries a dignity and meaning that AI-driven efficiency shouldn't simply override.",
      connectionAssumption: "You're likely assuming human relationships hold a sacred or morally weighted status that an AI companion, however convincing, doesn't share.",
    },
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/profileReports.ts src/data/profileReports.test.ts
git commit -m "feat: add profile report content (Relational/Companionship batch)"
```

---

### Task 25: Profile report content — Material/Labor Stakes + Sovereignty/Marginalized Voice batch (final content batch)

**Files:**
- Modify: `src/data/profileReports.ts` (append entries)
- Modify: `src/data/profileReports.test.ts` (append a new `describe` block)

**Interfaces:**
- Consumes/Produces: same as Task 20, extending `profileReports` with the final 5 entries, bringing the total to 34.

- [ ] **Step 1: Write the failing test — append to `src/data/profileReports.test.ts`**

```ts
describe('profileReports (batch 6: Material/Labor Stakes + Sovereignty, final batch)', () => {
  it('has complete entries for all 5 profiles in this batch', () => {
    ['creative-labor-artist-rights-advocate', 'labor-movement-collective-bargaining-advocate', 'disability-rights-accessibility-advocate', 'global-south-techno-sovereigntist', 'indigenous-data-sovereignty-advocate'].forEach(checkShape)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: FAIL — these 5 entries don't exist yet.

- [ ] **Step 3: Append these 5 entries to `profileReports` in `src/data/profileReports.ts`**

```ts
  'creative-labor-artist-rights-advocate': {
    profileId: 'creative-labor-artist-rights-advocate',
    extendedNarrative: [
      'You believe artists and writers deserve real control and payment when their work trains AI models. To you, this is a rights issue, not a minor side effect of progress that creators should just accept.',
      'You want enforceable consent and compensation built into how AI companies use creative work, not a system that treats scraping the internet\'s creative output as automatically fair.',
    ],
    thinkers: [
      { name: 'Authors Guild', bio: 'U.S. professional association representing writers', connection: 'Their public advocacy and litigation directly argue that AI training on copyrighted creative work without consent or payment violates authors\' rights.' },
      { name: 'Concept Art Association', bio: 'Advocacy group representing visual artists in the entertainment industry', connection: "Their public campaigns argue for artists' consent and compensation when their work is used to train generative AI models." },
    ],
    furtherReading: [
      { title: 'Chokepoint Capitalism', author: 'Rebecca Giblin and Cory Doctorow', note: 'An argument for restructuring how creative work is paid for, directly relevant to AI-training compensation debates.' },
      { title: "The Authors Guild's public statements on AI and copyright", author: 'Authors Guild', note: 'Represents the direct policy position this stance is built on.' },
    ],
    nextSteps: [
      'Look into an ongoing copyright lawsuit against an AI company to see this argument being tested in court.',
      'Read a counter-argument from the fair-use side to test this stance against its strongest opposing case.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI \"creates\" in any real sense matters less than whether the humans whose work trained it are treated fairly.",
      laborAssumption: "You're likely assuming creative labor deserves the same kind of protection and compensation structure as other forms of work, not less.",
      connectionAssumption: "You're likely assuming the relationship between an artist and their audience is worth protecting as something AI-generated content can't simply replace.",
    },
  },
  'labor-movement-collective-bargaining-advocate': {
    profileId: 'labor-movement-collective-bargaining-advocate',
    extendedNarrative: [
      "You want workers, through their unions, to have a real say and real protections before AI changes or replaces their jobs, not just a promise of retraining after the fact.",
      "To you, the right response to AI-driven disruption is the same one that's worked before: organized collective bargaining over how new technology gets introduced into the workplace.",
    ],
    thinkers: [
      { name: 'AFL-CIO Technology Institute', bio: "U.S. labor federation's published policy work on technology and jobs", connection: 'Their published advocacy argues for collective bargaining rights over AI deployment decisions in the workplace, not just after-the-fact retraining.' },
      { name: 'SAG-AFTRA AI contract provisions', bio: 'Union contract language negotiated by the screen actors and media union', connection: 'Their negotiated contract provisions on AI use are a concrete, real-world example of collective bargaining applied directly to AI deployment.' },
    ],
    furtherReading: [
      { title: 'The SAG-AFTRA 2023 contract provisions on AI (public text)', author: 'SAG-AFTRA', note: 'A concrete example of collective bargaining successfully setting real limits on AI use in the workplace.' },
      { title: "Labor's Story in the United States", author: 'Philip S. Foner (survey history)', note: 'Background on the history of collective bargaining as a response to disruptive workplace technology.' },
    ],
    nextSteps: [
      'Read the AI-related provisions in the SAG-AFTRA contract to see collective bargaining over AI applied directly.',
      "Look into a union's current AI policy platform to see this stance's demands in concrete form.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether AI has real experience matters less than whether workers have a real say in how it's deployed.",
      laborAssumption: "You're likely assuming collective bargaining, not just individual retraining, is the right response to AI-driven workplace disruption.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of protecting workers' say over their own jobs.",
    },
  },
  'disability-rights-accessibility-advocate': {
    profileId: 'disability-rights-accessibility-advocate',
    extendedNarrative: [
      'You see real promise in AI-powered accessibility tools, from screen readers to communication aids, while pushing hard against bias that leaves disabled people out or misjudged by AI systems.',
      "You hold both things at once: genuine enthusiasm for what this technology can do for independence and access, and real vigilance about the specific ways it can go wrong for disabled users.",
    ],
    thinkers: [
      { name: 'Disability rights technology researchers', bio: 'Published scholars on accessible technology design', connection: 'Their published research documents both the promise of AI-powered accessibility tools and the specific bias risks disabled users face in AI systems.' },
      { name: 'Haben Girma', bio: 'Disability rights lawyer and advocate', connection: 'Her public advocacy and writing on accessible technology directly argues for AI development that genuinely serves disabled users, not just claims to.' },
    ],
    furtherReading: [
      { title: 'Haben: The Deafblind Woman Who Conquered Harvard Law', author: 'Haben Girma', note: "A firsthand account grounding this stance's dual view of technology's promise and its real failure points for disabled users." },
      { title: 'Disability Visibility', author: 'Alice Wong (editor)', note: 'A collection of firsthand disability perspectives, including on technology\'s promise and its failures.' },
    ],
    nextSteps: [
      'Look into an AI-powered accessibility tool and how it was actually developed and tested with disabled users.',
      'Read a documented case of AI bias harming disabled users to understand the specific risk this stance is vigilant about.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI is conscious matters less than whether it works reliably and fairly for the specific people who need it.",
      laborAssumption: "You're likely assuming AI can expand real employment opportunity for disabled workers if it's built and tested with them directly, not just assumed to help.",
      connectionAssumption: "You're likely assuming AI-assisted communication and connection can be a genuine benefit for people who face real barriers to it otherwise.",
    },
  },
  'global-south-techno-sovereigntist': {
    profileId: 'global-south-techno-sovereigntist',
    extendedNarrative: [
      'You want your own country or region to build real AI capacity instead of staying dependent on outside powers. To you, "borderless" framing often just means continued dependency on whichever nation already has the infrastructure.',
      'You see technology transfer, local data centers, and home-grown research capacity as matters of real sovereignty, not abstract philosophy.',
    ],
    thinkers: [
      { name: 'African Union AI strategy documents', bio: 'Published continental policy frameworks on AI development', connection: 'These documents explicitly frame AI capacity-building as a matter of avoiding renewed technological dependency, the same concern behind this stance.' },
      { name: "India's national AI strategy publications", bio: 'Published government technology-sovereignty policy', connection: 'This strategy explicitly frames domestic AI capability as a matter of national self-reliance rather than global openness alone.' },
    ],
    furtherReading: [
      { title: 'The Costs of Connection', author: 'Nick Couldry and Ulises A. Mejias', note: "An argument that global data flows can replicate colonial patterns of extraction, directly relevant to this stance's concern." },
      { title: 'Digital Empires', author: 'Anu Bradford', note: "A comparative look at how major powers' tech regulation shapes the rest of the world's options, including the case for tech sovereignty." },
    ],
    nextSteps: [
      "Look into your own country's or region's national AI strategy, if one exists.",
      'Read an account of a country building domestic AI or chip capacity from a position of limited resources.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness matter less than the more concrete question of who controls the infrastructure.",
      laborAssumption: "You're likely assuming local AI capacity-building creates real opportunity for domestic workers, rather than just importing the same dependency in a new form.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of building technological self-reliance.",
    },
  },
  'indigenous-data-sovereignty-advocate': {
    profileId: 'indigenous-data-sovereignty-advocate',
    extendedNarrative: [
      "You insist that traditional knowledge and cultural data need real consent and control before they're used to train AI, not just open scraping treated as automatically fair.",
      'You see this as a continuation of a much longer fight over who controls Indigenous knowledge and resources, now playing out in a new, AI-shaped form.',
    ],
    thinkers: [
      { name: 'OCAP principles (Ownership, Control, Access, Possession)', bio: 'Data governance framework developed by First Nations researchers in Canada', connection: 'This framework directly establishes the standard this stance argues for: Indigenous communities, not outside institutions, should control data about them.' },
      { name: 'Indigenous AI initiatives', bio: 'Published research and advocacy from Indigenous technologists and scholars', connection: 'Their published work applies data sovereignty principles specifically to AI training data and model development.' },
    ],
    furtherReading: [
      { title: 'Indigenous Data Sovereignty: Toward an Agenda', author: 'Tahu Kukutai and John Taylor (editors)', note: 'The foundational academic case for Indigenous control over data concerning Indigenous peoples.' },
      { title: 'The OCAP principles (public framework documents)', author: 'First Nations Information Governance Centre', note: 'The concrete governance framework this stance is built on.' },
    ],
    nextSteps: [
      'Read the OCAP principles in full to see this governance framework in detail.',
      'Look into an Indigenous-led AI research initiative to see data sovereignty applied to AI development directly.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that questions about machine consciousness matter less than the question of who controls the knowledge used to build these systems.",
      laborAssumption: "You're likely assuming Indigenous communities should benefit directly from any AI development built on their knowledge, not just have that knowledge extracted.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of protecting sovereignty over cultural knowledge.",
    },
  },
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: PASS (6 tests, all batches).

- [ ] **Step 5: Commit**

```bash
git add src/data/profileReports.ts src/data/profileReports.test.ts
git commit -m "feat: add profile report content (Material/Labor Stakes + Sovereignty batch, final)"
```

---

### Task 26: profileReports completeness test

**Files:**
- Modify: `src/data/profileReports.test.ts` (append a final `describe` block)

**Interfaces:**
- Consumes: `profiles` (Task 6), `profileReports` (Tasks 20-25).

- [ ] **Step 1: Write the test — append to `src/data/profileReports.test.ts`**

```ts
import { profiles } from './profiles'

describe('profileReports completeness', () => {
  it('has exactly one entry per profile, for all 34 profiles, with no orphans', () => {
    const profileIds = profiles.map((p) => p.id)
    const reportIds = Object.keys(profileReports)
    expect(reportIds.sort()).toEqual(profileIds.sort())
  })
})
```

(Add the `import { profiles } from './profiles'` line near the top of the file alongside the existing imports.)

- [ ] **Step 2: Run the test**

Run: `npx vitest run src/data/profileReports.test.ts`
Expected: PASS (7 tests total). If this fails, it means a profile id exists in `profiles.ts` with no matching `profileReports` entry (or vice versa) — cross-check against Tasks 20-25's entries for a typo'd id.

- [ ] **Step 3: Commit**

```bash
git add src/data/profileReports.test.ts
git commit -m "test: verify profileReports covers all 34 profiles with no orphans"
```

---

### Task 27: ReportPreview component

**Files:**
- Create: `src/components/ReportPreview.tsx`
- Test: `src/components/ReportPreview.test.tsx`

**Interfaces:**
- Consumes: `ProfileReportContent` type (Task 1), `profileReports` (Tasks 20-26).
- Produces: `ReportPreview({ content: ProfileReportContent })`, consumed by Task 31 (ResultsPage).

- [ ] **Step 1: Write the failing test `src/components/ReportPreview.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReportPreview } from './ReportPreview'
import { profileReports } from '../data/profileReports'

describe('ReportPreview', () => {
  const content = profileReports['doomer']

  it("renders the profile's extended narrative paragraphs", () => {
    render(<ReportPreview content={content} />)
    content.extendedNarrative.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument())
  })

  it('renders all thinkers with name and connection', () => {
    render(<ReportPreview content={content} />)
    content.thinkers.forEach((t) => {
      expect(screen.getByText(t.name)).toBeInTheDocument()
      expect(screen.getByText(t.connection)).toBeInTheDocument()
    })
  })

  it('renders all further-reading entries and next steps', () => {
    render(<ReportPreview content={content} />)
    content.furtherReading.forEach((r) => expect(screen.getByText(r.title)).toBeInTheDocument())
    content.nextSteps.forEach((step) => expect(screen.getByText(step)).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ReportPreview.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/components/ReportPreview.tsx`**

```tsx
import type { ProfileReportContent } from '../data/types'

interface ReportPreviewProps {
  content: ProfileReportContent
}

export function ReportPreview({ content }: ReportPreviewProps) {
  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Full Report Preview</h3>
      <div className="space-y-3 mb-4">
        {content.extendedNarrative.map((paragraph, index) => (
          <p key={index} className="text-gray-700">{paragraph}</p>
        ))}
      </div>

      <h4 className="font-semibold mb-2">Thinkers whose public work resonates with this view</h4>
      <ul className="space-y-2 mb-4">
        {content.thinkers.map((thinker) => (
          <li key={thinker.name}>
            <span className="font-medium">{thinker.name}</span> — {thinker.bio}. {thinker.connection}
          </li>
        ))}
      </ul>

      <h4 className="font-semibold mb-2">Further Reading</h4>
      <ul className="space-y-2 mb-4">
        {content.furtherReading.map((item) => (
          <li key={item.title}>
            <span className="font-medium">{item.title}</span>, {item.author} — {item.note}
          </li>
        ))}
      </ul>

      <h4 className="font-semibold mb-2">Next Steps</h4>
      <ul className="list-disc list-inside space-y-1">
        {content.nextSteps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ReportPreview.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ReportPreview.tsx src/components/ReportPreview.test.tsx
git commit -m "feat: add ReportPreview component"
```

---

### Task 28: PDF report generation

**Files:**
- Modify: `package.json` (add `@react-pdf/renderer` dependency)
- Create: `src/lib/pdfReport.tsx`
- Test: `src/lib/pdfReport.test.ts`

**Interfaces:**
- Consumes: `AxisVector`, `ProfileMatch` (existing `scoring.ts`), `ProfileReportContent` (Task 1), `axes` (existing).
- Produces: `ReportDocument` (a `@react-pdf/renderer` component) and `buildReportPdfBlob(props): Promise<Blob>`, consumed by Task 31 (ResultsPage).

**Known risk (flagged in design spec §3.4):** `@react-pdf/renderer` under Vitest/jsdom is unverified. Step 1 below is deliberately a minimal smoke test to surface any environment incompatibility before writing the full document structure.

- [ ] **Step 1: Install the dependency and write a minimal smoke test first**

Run: `npm install @react-pdf/renderer`

Write `src/lib/pdfReport.test.ts` with ONLY this minimal case first:

```ts
import { describe, it, expect } from 'vitest'
import { Document, Page, Text, pdf } from '@react-pdf/renderer'

describe('@react-pdf/renderer environment smoke test', () => {
  it('renders a minimal one-page document to a non-empty PDF blob', async () => {
    const doc = (
      <Document>
        <Page>
          <Text>Hello</Text>
        </Page>
      </Document>
    )
    const blob = await pdf(doc).toBlob()
    expect(blob.size).toBeGreaterThan(0)
    expect(blob.type).toBe('application/pdf')
  })
})
```

Run: `npx vitest run src/lib/pdfReport.test.ts`

**If this passes:** proceed to Step 2 below with confidence the approach works in this environment.

**If this fails** with an environment-compatibility error (missing browser API, jsdom gap, etc.): STOP and report back with the exact error rather than attempting workarounds — this is the fallback-decision point named in design spec §3.4 (switch to a print-optimized `/report` route via `window.print()` instead). Do not silently substitute the fallback; escalate first.

- [ ] **Step 2: Replace the smoke test with the full test suite in `src/lib/pdfReport.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { pdf } from '@react-pdf/renderer'
import { ReportDocument } from './pdfReport'
import { profiles } from '../data/profiles'
import { profileReports } from '../data/profileReports'
import { classify } from './scoring'
import type { AxisVector } from './scoring'

const sampleCombined: AxisVector = {
  teleological: -6, risk: 9, socioEconomic: -7, ontological: -2,
  legalMoral: -3, evolutionary: -8, relational: -4, geopolitical: -2,
}
const sampleT1: AxisVector = { ...sampleCombined }
const sampleT2: AxisVector = { ...sampleCombined }
const matches = classify(sampleCombined, profiles).slice(0, 3)

describe('ReportDocument', () => {
  it('renders a non-empty, correctly-typed PDF blob for a full sample result', async () => {
    const doc = (
      <ReportDocument
        combined={sampleCombined}
        t1Scaled={sampleT1}
        t2Scaled={sampleT2}
        topMatches={matches}
        profileReports={profileReports}
      />
    )
    const blob = await pdf(doc).toBlob()
    expect(blob.size).toBeGreaterThan(0)
    expect(blob.type).toBe('application/pdf')
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/lib/pdfReport.test.ts`
Expected: FAIL — `ReportDocument` doesn't exist yet.

- [ ] **Step 4: Create `src/lib/pdfReport.tsx`**

```tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { axes } from '../data/axes'
import type { AxisVector, ProfileMatch } from './scoring'
import type { ProfileReportContent } from '../data/types'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  title: { fontSize: 22, marginBottom: 12 },
  heading: { fontSize: 16, marginTop: 16, marginBottom: 8 },
  paragraph: { marginBottom: 8, lineHeight: 1.4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
})

interface ReportDocumentProps {
  combined: AxisVector
  t1Scaled: AxisVector
  t2Scaled: AxisVector
  topMatches: ProfileMatch[]
  profileReports: Record<string, ProfileReportContent>
}

export function ReportDocument({ combined, t1Scaled, t2Scaled, topMatches, profileReports }: ReportDocumentProps) {
  const top = topMatches[0]
  const runnerUps = topMatches.slice(1, 3)
  const topContent = profileReports[top.profile.id]

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Your TIAM-112 Report</Text>
        <Text style={styles.paragraph}>Closest match: {top.profile.name}</Text>
      </Page>

      <Page style={styles.page}>
        <Text style={styles.heading}>Methodology &amp; Disclaimer</Text>
        <Text style={styles.paragraph}>
          This report is a self-reflection tool, not a validated scientific instrument. It has not
          been through independent test-retest reliability studies, factor analysis, or peer
          review. The named thinkers and books in this report describe documented public work only
          — they are not claims about those people's personal views, quiz results, or endorsement
          of this report's characterization of any archetype.
        </Text>
      </Page>

      <Page style={styles.page}>
        <Text style={styles.heading}>Your Coordinates</Text>
        {axes.map((axis) => (
          <View key={axis.id} style={styles.row}>
            <Text>{axis.name}</Text>
            <Text>
              Right Now: {t1Scaled[axis.id].toFixed(2)} | Looking Ahead: {t2Scaled[axis.id].toFixed(2)} | Combined: {combined[axis.id].toFixed(2)}
            </Text>
          </View>
        ))}
      </Page>

      <Page style={styles.page}>
        <Text style={styles.heading}>Your Top Match: {top.profile.name}</Text>
        {topContent.extendedNarrative.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>{paragraph}</Text>
        ))}
        <Text style={styles.heading}>Thinkers</Text>
        {topContent.thinkers.map((thinker) => (
          <Text key={thinker.name} style={styles.paragraph}>
            {thinker.name} ({thinker.bio}): {thinker.connection}
          </Text>
        ))}
        <Text style={styles.heading}>Further Reading</Text>
        {topContent.furtherReading.map((item) => (
          <Text key={item.title} style={styles.paragraph}>
            {item.title}, {item.author} — {item.note}
          </Text>
        ))}
      </Page>

      <Page style={styles.page}>
        <Text style={styles.heading}>Runner-Up Matches</Text>
        {runnerUps.map((match) => (
          <View key={match.profile.id} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 13, marginBottom: 4 }}>{match.profile.name}</Text>
            <Text style={styles.paragraph}>{match.profile.summary}</Text>
            <Text>Distance: {match.distance.toFixed(2)}</Text>
          </View>
        ))}

        <Text style={styles.heading}>Further Reading and Next Steps</Text>
        {topMatches.map((match) => {
          const content = profileReports[match.profile.id]
          return (
            <View key={match.profile.id} style={{ marginBottom: 10 }}>
              <Text style={{ marginBottom: 4 }}>{match.profile.name}</Text>
              {content.nextSteps.map((step, index) => (
                <Text key={index} style={styles.paragraph}>- {step}</Text>
              ))}
            </View>
          )
        })}
      </Page>
    </Document>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/pdfReport.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/pdfReport.tsx src/lib/pdfReport.test.ts
git commit -m "feat: add PDF report generation via @react-pdf/renderer"
```

---

### Task 29: ReflectiveBreakdown component

**Files:**
- Create: `src/components/ReflectiveBreakdown.tsx`
- Test: `src/components/ReflectiveBreakdown.test.tsx`

**Interfaces:**
- Consumes: `ProfileReportContent` (Task 1), `detectTension` (Task 11), `AxisId` (Task 1).
- Produces: `ReflectiveBreakdown({ content, scenarioAnswers, combined })`, consumed by Task 31 (ResultsPage).

- [ ] **Step 1: Write the failing test `src/components/ReflectiveBreakdown.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReflectiveBreakdown } from './ReflectiveBreakdown'
import { profileReports } from '../data/profileReports'
import type { AxisVector } from '../lib/scoring'

const zeroVector: AxisVector = {
  teleological: 0, risk: 0, socioEconomic: 0, ontological: 0,
  legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0,
}

describe('ReflectiveBreakdown', () => {
  const content = profileReports['doomer']

  it('renders all three assumption fields', () => {
    render(<ReflectiveBreakdown content={content} scenarioAnswers={{}} combined={zeroVector} />)
    expect(screen.getByText(content.reflectiveBreakdown.mindAssumption)).toBeInTheDocument()
    expect(screen.getByText(content.reflectiveBreakdown.laborAssumption)).toBeInTheDocument()
    expect(screen.getByText(content.reflectiveBreakdown.connectionAssumption)).toBeInTheDocument()
  })

  it('renders a tension paragraph when detectTension finds a mismatch', () => {
    const combined = { ...zeroVector, teleological: 5 }
    render(<ReflectiveBreakdown content={content} scenarioAnswers={{ teleological: 'B' }} combined={combined} />)
    expect(screen.getByText(/sits in tension with your computed score/i)).toBeInTheDocument()
  })

  it('omits the tension paragraph when there is no tension', () => {
    const combined = { ...zeroVector, teleological: 5 }
    render(<ReflectiveBreakdown content={content} scenarioAnswers={{ teleological: 'A' }} combined={combined} />)
    expect(screen.queryByText(/sits in tension with your computed score/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ReflectiveBreakdown.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/components/ReflectiveBreakdown.tsx`**

```tsx
import type { AxisId, ProfileReportContent } from '../data/types'
import type { AxisVector } from '../lib/scoring'
import { detectTension } from '../lib/scenarioTension'
import { axes } from '../data/axes'

interface ReflectiveBreakdownProps {
  content: ProfileReportContent
  scenarioAnswers: Partial<Record<AxisId, 'A' | 'B'>>
  combined: AxisVector
}

export function ReflectiveBreakdown({ content, scenarioAnswers, combined }: ReflectiveBreakdownProps) {
  const tenseAxes = detectTension(scenarioAnswers, combined)

  return (
    <section className="mt-8">
      <h3 className="text-xl font-semibold mb-3">Reflective Breakdown</h3>
      <p className="text-gray-700 mb-2">{content.reflectiveBreakdown.mindAssumption}</p>
      <p className="text-gray-700 mb-2">{content.reflectiveBreakdown.laborAssumption}</p>
      <p className="text-gray-700 mb-2">{content.reflectiveBreakdown.connectionAssumption}</p>
      {tenseAxes.length > 0 && (
        <div className="mt-4 space-y-1">
          {tenseAxes.map((axisId) => {
            const axis = axes.find((a) => a.id === axisId)!
            return (
              <p key={axisId} className="text-gray-700">
                Your scenario answer on the {axis.name} axis sits in tension with your computed
                score. That's worth sitting with, not resolving immediately.
              </p>
            )
          })}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ReflectiveBreakdown.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ReflectiveBreakdown.tsx src/components/ReflectiveBreakdown.test.tsx
git commit -m "feat: add Reflective Breakdown component with tension surfacing"
```

---

### Task 30: PinnacleReflection component

**Files:**
- Create: `src/components/PinnacleReflection.tsx`
- Test: `src/components/PinnacleReflection.test.tsx`

**Interfaces:**
- Produces: `PinnacleReflection({ archetypeName: string })`, consumed by Task 31 (ResultsPage).

- [ ] **Step 1: Write the failing test `src/components/PinnacleReflection.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PinnacleReflection } from './PinnacleReflection'
import { fleschKincaidGrade } from '../lib/readability'

describe('PinnacleReflection', () => {
  it('renders the universal reflective prompt personalized with the archetype name', () => {
    render(<PinnacleReflection archetypeName="Doomer" />)
    expect(screen.getByText(/reactive/)).toBeInTheDocument()
    expect(screen.getByText(/proactive/)).toBeInTheDocument()
    expect(screen.getByText(/Doomer/)).toBeInTheDocument()
  })

  it('passes the 10th-grade readability gate', () => {
    render(<PinnacleReflection archetypeName="Doomer" />)
    const text = screen.getByTestId('pinnacle-text').textContent ?? ''
    expect(fleschKincaidGrade(text)).toBeLessThanOrEqual(10)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/PinnacleReflection.test.tsx`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Create `src/components/PinnacleReflection.tsx`**

```tsx
interface PinnacleReflectionProps {
  archetypeName: string
}

export function PinnacleReflection({ archetypeName }: PinnacleReflectionProps) {
  return (
    <section className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold mb-3">One Last Question</h3>
      <p data-testid="pinnacle-text" className="text-gray-700">
        Looking at your results as a {archetypeName}: are your views here mainly reactive, shaped
        by wanting to stop a specific danger, or proactive, shaped by a future you actually want
        to build? Neither answer is right or wrong. It's just worth asking yourself honestly.
      </p>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/PinnacleReflection.test.tsx`
Expected: PASS (2 tests). If the readability test fails, shorten the sentence per the established process and rerun.

- [ ] **Step 5: Commit**

```bash
git add src/components/PinnacleReflection.tsx src/components/PinnacleReflection.test.tsx
git commit -m "feat: add Pinnacle Reflection closing prompt"
```

---

### Task 31: ResultsPage final integration

**Files:**
- Modify: `src/pages/ResultsPage.tsx` (full replacement)
- Modify: `src/pages/ResultsPage.test.tsx` (full replacement)

**Interfaces:**
- Consumes: everything from Tasks 1-30 — `matchCloseness`/existing scoring functions, `profileReports`, `ReportPreview`, `MethodologySection`, `ReflectiveBreakdown`, `PinnacleReflection`, `RadarChart`'s new `comparisonProfile` prop, `useQuiz()`'s `scenarioAnswers`/`selectedStakeholderTags`, `stakeholderTags` data.
- Produces: the final, fully-wired results page.

- [ ] **Step 1: Write the failing test — replace `src/pages/ResultsPage.test.tsx` entirely**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { ResultsPage } from './ResultsPage'
import { QuizProvider, useQuiz } from '../state/QuizContext'
import { encodeShareLink, decodeShareLink, type ShareableScores } from '../lib/shareLink'
import { axes } from '../data/axes'
import { questions } from '../data/questions'

function buildFlatScores(t1Value: number, t2Value: number): ShareableScores {
  const t1Raw = {} as ShareableScores['t1Raw']
  const t2Raw = {} as ShareableScores['t2Raw']
  axes.forEach((axis) => {
    t1Raw[axis.id] = t1Value
    t2Raw[axis.id] = t2Value
  })
  return { t1Raw, t2Raw }
}

function renderResultsPage(searchSuffix: string) {
  return render(
    <QuizProvider>
      <MemoryRouter initialEntries={[`/results${searchSuffix}`]}>
        <Routes>
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/" element={<p>Intro Page</p>} />
        </Routes>
      </MemoryRouter>
    </QuizProvider>,
  )
}

beforeEach(() => {
  Object.assign(navigator, { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
})

describe('ResultsPage', () => {
  it('decodes a shared link and shows the top matches and a divergence table row per axis', () => {
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    expect(screen.getByText('Closest Matches')).toBeInTheDocument()
    const table = screen.getByRole('table')
    expect(within(table).getByText('Teleological')).toBeInTheDocument()
  })

  it('shows the match-closeness percentage on the top ProfileCard', () => {
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    expect(screen.getByText(/% match/)).toBeInTheDocument()
  })

  it('shows the Full Report Preview, Methodology section, and Pinnacle Reflection', () => {
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    expect(screen.getByText('Full Report Preview')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'How This Works' })).toBeInTheDocument()
    expect(screen.getByText('One Last Question')).toBeInTheDocument()
  })

  it('shows selected stakeholder tags separately from the worldview match', () => {
    function TagSeeder() {
      const { setStakeholderTags } = useQuiz()
      useEffect(() => {
        setStakeholderTags(['automation-exposed-worker'])
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      return null
    }
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    render(
      <QuizProvider>
        <MemoryRouter initialEntries={[`/results?d=${encoded}`]}>
          <Routes>
            <Route path="/results" element={<><TagSeeder /><ResultsPage /></>} />
          </Routes>
        </MemoryRouter>
      </QuizProvider>,
    )
    expect(screen.getByText('Automation-Exposed Worker')).toBeInTheDocument()
  })

  it('shows a loading state on Download PDF Report while generating', async () => {
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF Report' }))
    expect(screen.getByRole('button', { name: 'Generating...' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Download PDF Report' })).toBeInTheDocument()
  })

  it('copies a shareable link that round-trips via decodeShareLink', async () => {
    const scores = buildFlatScores(3, -3)
    const encoded = encodeShareLink(scores)
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Copy Shareable Link' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(await screen.findByText('Link Copied!')).toBeInTheDocument()
    const copiedUrl = (navigator.clipboard.writeText as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(copiedUrl).toContain('#/results?d=')
    const shareParam = copiedUrl.split('#/results?d=')[1]
    expect(decodeShareLink(shareParam)).toEqual(scores)
  })

  it('resets answers and navigates to intro when Retake is clicked', () => {
    const encoded = encodeShareLink(buildFlatScores(0, 0))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Retake' }))
    expect(screen.getByText('Intro Page')).toBeInTheDocument()
  })

  it('computes results from live quiz answers when no share param is present', () => {
    function AnswerSeeder() {
      const { setAnswer } = useQuiz()
      useEffect(() => {
        questions.slice(0, 6).forEach((q) => setAnswer(q.id, q.agreeShiftsToward === 'A' ? 3 : -3))
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      return <ResultsPage />
    }
    render(
      <QuizProvider>
        <MemoryRouter initialEntries={['/results']}>
          <Routes>
            <Route path="/results" element={<AnswerSeeder />} />
          </Routes>
        </MemoryRouter>
      </QuizProvider>,
    )
    expect(screen.getByText('Closest Matches')).toBeInTheDocument()
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('row').length).toBe(axes.length + 1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/ResultsPage.test.tsx`
Expected: FAIL — none of the new sections (ReportPreview, MethodologySection, ReflectiveBreakdown, PinnacleReflection, stakeholder tags, PDF download) exist on the page yet.

- [ ] **Step 3: Replace `src/pages/ResultsPage.tsx` entirely**

```tsx
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { axes } from '../data/axes'
import { questions } from '../data/questions'
import { profiles } from '../data/profiles'
import { profileReports } from '../data/profileReports'
import { stakeholderTags } from '../data/stakeholderTags'
import { useQuiz } from '../state/QuizContext'
import {
  computeRawAxisScores,
  scaleAxisScores,
  combineHorizons,
  classify,
  type AxisVector,
} from '../lib/scoring'
import { encodeShareLink, decodeShareLink } from '../lib/shareLink'
import { pdf } from '@react-pdf/renderer'
import { ReportDocument } from '../lib/pdfReport'
import { RadarChart } from '../components/RadarChart'
import { ProfileCard } from '../components/ProfileCard'
import { ReportPreview } from '../components/ReportPreview'
import { MethodologySection } from '../components/MethodologySection'
import { ReflectiveBreakdown } from '../components/ReflectiveBreakdown'
import { PinnacleReflection } from '../components/PinnacleReflection'

export function ResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { answers, reset, scenarioAnswers, selectedStakeholderTags } = useQuiz()
  const [copied, setCopied] = useState(false)
  const [generatingPdf, setGeneratingPdf] = useState(false)

  const sharedParam = searchParams.get('d')

  const { t1Raw, t2Raw } = useMemo(() => {
    if (sharedParam) {
      const decoded = decodeShareLink(sharedParam)
      if (decoded) return decoded
    }
    return {
      t1Raw: computeRawAxisScores(questions, answers, 'T1'),
      t2Raw: computeRawAxisScores(questions, answers, 'T2'),
    }
  }, [sharedParam, answers])

  const t1Scaled: AxisVector = scaleAxisScores(t1Raw)
  const t2Scaled: AxisVector = scaleAxisScores(t2Raw)
  const combined = combineHorizons(t1Scaled, t2Scaled)
  const matches = classify(combined, profiles)
  const topMatches = matches.slice(0, 3)
  const topMatch = topMatches[0]
  const topContent = profileReports[topMatch.profile.id]

  const selectedTagObjects = stakeholderTags.filter((tag) => selectedStakeholderTags.includes(tag.id))

  function handleShare() {
    const encoded = encodeShareLink({ t1Raw, t2Raw })
    const url = `${window.location.origin}${import.meta.env.BASE_URL}#/results?d=${encoded}`
    navigator.clipboard.writeText(url)
    setCopied(true)
  }

  function handleRetake() {
    reset()
    navigate('/')
  }

  async function handleDownloadPdf() {
    setGeneratingPdf(true)
    try {
      const doc = (
        <ReportDocument
          combined={combined}
          t1Scaled={t1Scaled}
          t2Scaled={t2Scaled}
          topMatches={topMatches}
          profileReports={profileReports}
        />
      )
      const blob = await pdf(doc).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tiam-report-${topMatch.profile.id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setGeneratingPdf(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Results</h2>
      <RadarChart combined={combined} comparisonProfile={{ name: topMatch.profile.name, coords: topMatch.profile.coords }} />

      {selectedTagObjects.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-1">Your Stake</h3>
          <p className="text-gray-700">{selectedTagObjects.map((tag) => tag.name).join(', ')}</p>
        </div>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-2">Closest Matches</h3>
      {topMatches.map((match, index) => (
        <ProfileCard key={match.profile.id} match={match} rank={index + 1} />
      ))}

      <h3 className="text-xl font-semibold mt-8 mb-2">Near-Term vs. Long-Term, by Axis</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b py-2">Axis</th>
            <th className="border-b py-2">Right Now</th>
            <th className="border-b py-2">Looking Ahead</th>
          </tr>
        </thead>
        <tbody>
          {axes.map((axis) => (
            <tr key={axis.id}>
              <td className="py-2">{axis.name}</td>
              <td className="py-2">{t1Scaled[axis.id].toFixed(1)}</td>
              <td className="py-2">{t2Scaled[axis.id].toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReportPreview content={topContent} />
      <ReflectiveBreakdown content={topContent} scenarioAnswers={scenarioAnswers} combined={combined} />
      <MethodologySection />
      <PinnacleReflection archetypeName={topMatch.profile.name} />

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={handleShare} className="px-4 py-2 rounded bg-blue-600 text-white">
          {copied ? 'Link Copied!' : 'Copy Shareable Link'}
        </button>
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={generatingPdf}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-40"
        >
          {generatingPdf ? 'Generating...' : 'Download PDF Report'}
        </button>
        <button type="button" onClick={handleRetake} className="px-4 py-2 rounded border border-gray-300">
          Retake
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/ResultsPage.test.tsx`
Expected: PASS (8 tests).

- [ ] **Step 5: Run the full suite**

Run: `npm test`
Expected: all test files pass — this is the final task, so confirm the complete count (should be significantly more than the pre-existing 24 files / 63 tests, given ~25 new/modified test files across this plan).

- [ ] **Step 6: Commit**

```bash
git add src/pages/ResultsPage.tsx src/pages/ResultsPage.test.tsx
git commit -m "feat: wire ReportPreview, MethodologySection, ReflectiveBreakdown, PinnacleReflection, PDF download, and stakeholder tags into ResultsPage"
```

---

## Self-Review Notes

**Spec coverage:** Bias reduction (Tasks 2-4), taxonomy expansion and coordinate revisions (Tasks 5-8), material-stakeholder tags (Tasks 9, 14), situational scenarios (Tasks 10-13), research-informed additions — match-closeness %, radar chart de-distortion/comparison, structural bias audit, methodology section (Tasks 15-19) — detailed reports including all 34 profiles' rich content, PDF, preview (Tasks 1, 20-28), Reflective Breakdown and Pinnacle Reflection (Tasks 29-31) are each covered.

**Known iteration points carried forward from the design spec:**
- Task 28's PDF generation has an explicit escalation gate if `@react-pdf/renderer` proves incompatible with the Vitest/jsdom environment, mirroring the Recharts situation from the original build.
- Content readability (stakeholderTags descriptions, scenario prompts, MethodologySection paragraphs, PinnacleReflection text) may need a shortening pass if any individual string fails the `fleschKincaidGrade <= 10` check on first run, per the same process established for the original 112 questions.
- Task 7's `profileRedundancy.test.ts` threshold (5.0) and Task 18's `classificationBias.test.ts` threshold (15%) are informed estimates; if either fails on a specific pair/profile not anticipated here, investigate that specific case rather than loosening the threshold.

**Type consistency checked:** `ProfileReportContent`, `StakeholderTag`, `Scenario`, `QuestionOrder`, and the `QuizContext` value shape are used identically across Tasks 1, 3, 4, 9, 10, 11, 12, 14, 20-31.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-07-bias-reduction-and-reports-implementation.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
