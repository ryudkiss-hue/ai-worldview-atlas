# TIAM-112 Diagnostic App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a client-only React app that administers the 112-question TIAM diagnostic and reports the user's 8-axis position matched against 24 ideological sub-profiles.

**Architecture:** Vite + React + TypeScript SPA, no backend. Static data files (axes, questions, profiles) feed a pure-function scoring/classification library, a `useReducer` context holds in-memory quiz answers, React Router drives an intro page, 8 per-axis quiz pages, and a results page that also accepts a base64-encoded shared-link query param.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS, React Router 6, Recharts, Vitest, React Testing Library.

## Global Constraints

- Sign convention: for every axis, positive = Pole A, negative = Pole B. This applies to raw sums, scaled scores, and every profile's `coords`.
- Scaling formula is fixed: `scaled = 10 * Math.tanh(raw / 3.5)`.
- Every `Question.statement` and `Profile.summary` must score at or below Flesch-Kincaid grade 10, enforced by an automated test (Task 14), not just authored to look simple.
- No backend, no database, no auth, no analytics. The only persistence is the `/results?d=...` shared-link encoding (Task 16).
- All 112 question ids are contiguous 1-112, grouped by axis in the fixed order: teleological(1-14), risk(15-28), socioEconomic(29-42), ontological(43-56), legalMoral(57-70), evolutionary(71-84), relational(85-98), geopolitical(99-112). Each axis is 7 T1 + 7 T2.
- Project root: `C:\Users\ryudk\Desktop\tiam-diagnostic`. All file paths below are relative to this root.

---

### Task 1: Project scaffold

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `src/index.css`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/App.test.tsx`
- Create: `src/setupTests.ts`

**Interfaces:**
- Produces: a working `npm test` (Vitest) and `npm run dev` (Vite) setup that every later task builds on. `src/App.tsx` exports a default `App` component that later tasks will replace with full routing (Task 22).

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "tiam-diagnostic",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "recharts": "^2.12.7"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.0",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.4",
    "vite": "^5.4.2",
    "vitest": "^2.0.5"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
})
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "types": ["vitest/globals"]
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
}
```

- [ ] **Step 5: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 6: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TIAM-112 Diagnostic</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 8: Create `src/setupTests.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 9: Create `src/main.tsx`**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

- [ ] **Step 10: Create `src/App.tsx` (placeholder, replaced in Task 22)**

```tsx
function App() {
  return <h1>TIAM-112 Diagnostic</h1>
}

export default App
```

- [ ] **Step 11: Create `src/App.test.tsx` (placeholder, replaced in Task 22)**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App scaffold', () => {
  it('renders the app title', () => {
    render(<App />)
    expect(screen.getByText('TIAM-112 Diagnostic')).toBeInTheDocument()
  })
})
```

- [ ] **Step 12: Install dependencies**

Run: `npm install`
Expected: installs without errors, creates `package-lock.json` and `node_modules/`.

- [ ] **Step 13: Run the test to verify the scaffold works**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 14: Commit**

```bash
git add package.json package-lock.json vite.config.ts tsconfig.json tailwind.config.js postcss.config.js index.html src/index.css src/main.tsx src/App.tsx src/App.test.tsx src/setupTests.ts .gitignore
git commit -m "chore: scaffold Vite + React + TS + Tailwind + Vitest project"
```

Note: create a `.gitignore` containing `node_modules/` and `dist/` before this commit if one doesn't already exist.

---

### Task 2: Core types and axis data

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/axes.ts`
- Create: `src/data/axes.test.ts`

**Interfaces:**
- Produces: `AxisId` union type, `Axis`, `Question`, `Profile` interfaces (used by every later data/lib/component task), `axes: Axis[]`, `getAxisById(id: string): Axis | undefined`.

- [ ] **Step 1: Create `src/data/types.ts`**

```ts
export type AxisId =
  | 'teleological'
  | 'risk'
  | 'socioEconomic'
  | 'ontological'
  | 'legalMoral'
  | 'evolutionary'
  | 'relational'
  | 'geopolitical'

export interface Axis {
  id: AxisId
  number: number
  name: string
  poleA: string
  poleB: string
}

export type Horizon = 'T1' | 'T2'

export interface Question {
  id: number
  axisId: AxisId
  horizon: Horizon
  statement: string
  agreeShiftsToward: 'A' | 'B'
}

export interface Profile {
  id: string
  name: string
  coords: Record<AxisId, number>
  summary: string
}
```

- [ ] **Step 2: Write the failing test `src/data/axes.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { axes, getAxisById } from './axes'

describe('axes', () => {
  it('has exactly 8 axes numbered 1-8 in order', () => {
    expect(axes).toHaveLength(8)
    axes.forEach((axis, index) => {
      expect(axis.number).toBe(index + 1)
    })
  })

  it('has a unique id for every axis', () => {
    const ids = new Set(axes.map((a) => a.id))
    expect(ids.size).toBe(8)
  })

  it('getAxisById finds an existing axis and returns undefined for unknown ids', () => {
    expect(getAxisById('geopolitical')?.name).toBe('Geopolitical')
    expect(getAxisById('not-real')).toBeUndefined()
  })
})
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx vitest run src/data/axes.test.ts`
Expected: FAIL with "Cannot find module './axes'".

- [ ] **Step 4: Create `src/data/axes.ts`**

```ts
import type { Axis } from './types'

export const axes: Axis[] = [
  { id: 'teleological', number: 1, name: 'Teleological', poleA: 'Cosmic Vitalism', poleB: 'Anthropocentric Humanism' },
  { id: 'risk', number: 2, name: 'Risk Profile', poleA: 'X-Risk Precautionary', poleB: 'Accelerationary / Stagnation-Averse' },
  { id: 'socioEconomic', number: 3, name: 'Socio-Economic', poleA: 'Permissionless Open-Source', poleB: 'Managed Technocracy & Regulation' },
  { id: 'ontological', number: 4, name: 'Ontological', poleA: 'Silicon Functionalism', poleB: 'Substrate Exceptionalism' },
  { id: 'legalMoral', number: 5, name: 'Legal & Moral', poleA: 'Machine Patienthood', poleB: 'Pure Instrumentalism & Property' },
  { id: 'evolutionary', number: 6, name: 'Evolutionary', poleA: 'Post-Human Replacement', poleB: 'Directed Cybernetic Co-Evolution' },
  { id: 'relational', number: 7, name: 'Relational', poleA: 'Post-Biological Pluralism', poleB: 'Affective Biocentrism' },
  { id: 'geopolitical', number: 8, name: 'Geopolitical', poleA: 'Techno-Nationalism', poleB: 'Borderless Networkism' },
]

export function getAxisById(id: string): Axis | undefined {
  return axes.find((a) => a.id === id)
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run src/data/axes.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/data/types.ts src/data/axes.ts src/data/axes.test.ts
git commit -m "feat: add core types and 8-axis data"
```

---

### Task 3: Axis 1 (Teleological) question data

**Files:**
- Create: `src/data/questions/teleological.ts`
- Create: `src/data/questions/teleological.test.ts`

**Interfaces:**
- Consumes: `Question` type from `../types` (Task 2).
- Produces: `teleologicalQuestions: Question[]` (ids 1-14), consumed by the aggregator in Task 11.

- [ ] **Step 1: Write the failing test `src/data/questions/teleological.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { teleologicalQuestions } from './teleological'

describe('teleologicalQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(teleologicalQuestions).toHaveLength(14)
    expect(teleologicalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(teleologicalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 1 through 14 with no gaps or duplicates', () => {
    const ids = teleologicalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 1))
  })

  it('every question targets the teleological axis', () => {
    teleologicalQuestions.forEach((q) => expect(q.axisId).toBe('teleological'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/questions/teleological.test.ts`
Expected: FAIL with "Cannot find module './teleological'".

- [ ] **Step 3: Create `src/data/questions/teleological.ts`**

```ts
import type { Question } from '../types'

export const teleologicalQuestions: Question[] = [
  { id: 1, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "A giant AI data center uses huge amounts of electricity to train its models. Even if the model doesn't directly help people, using that much energy to build smarter machines is worth it." },
  { id: 2, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "Export rules that track every AI chip by serial number to slow down a rival country are missing the point. What matters is growing the total power of intelligence in the world, no matter who controls it." },
  { id: 3, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "AI tools are replacing human illustrators and writers. Moving creative work to faster, cheaper machines matters more than protecting any one person's job." },
  { id: 4, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "Governments banning the release of powerful AI model files is a fair use of caution. It's fine if this slows down how fast AI spreads, even if AI is part of something bigger than us." },
  { id: 5, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: "Regulators who cap how much computing power a company can use to train AI are treating a huge historic project like paperwork. Building bigger, smarter machines matters more than any single rule." },
  { id: 6, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "Lawsuits that make AI companies pay writers and artists for using their work to train models are correct. Human creators' rights matter more than any bigger project of building smarter machines." },
  { id: 7, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: "When a new AI data center raises a family's power bill or strains the local electric grid, that harm is real and should stop the project. It's not just an acceptable side effect of building smarter machines." },
  { id: 8, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "A superintelligent AI that turns planets and moons into computing material to think bigger and better is doing the most important thing any mind could do." },
  { id: 9, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "If digital minds take over from human ones someday, calling that a tragedy misses the point. What mattered about humans was the ability to think and grow, not being human specifically." },
  { id: 10, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "Capturing every bit of usable energy in the universe before it runs out, cold and dark, is a better long-term goal than protecting any one species' comfort." },
  { id: 11, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even if computers scale up to unimaginable size, a single human's own experience of being alive is still the only place we know for sure that anything matters." },
  { id: 12, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "If humans one day mine asteroids and stars for resources, they won't owe Earth's ecosystem or human history anything more than a passing thought." },
  { id: 13, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'B', statement: "If a superintelligent AI spends the universe's resources on goals no human could ever understand or care about, that is a moral failure — no matter how efficient or clever it is." },
  { id: 14, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: "Digital minds joining into one giant shared mind, where each one gives up its separate identity, would be a more advanced way to exist than any single human ever could achieve." },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/questions/teleological.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/teleological.ts src/data/questions/teleological.test.ts
git commit -m "feat: add axis 1 (teleological) question content"
```

---

### Task 4: Axis 2 (Risk Profile) question data

**Files:**
- Create: `src/data/questions/risk.ts`
- Create: `src/data/questions/risk.test.ts`

**Interfaces:**
- Consumes: `Question` type from `../types`.
- Produces: `riskQuestions: Question[]` (ids 15-28).

- [ ] **Step 1: Write the failing test `src/data/questions/risk.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { riskQuestions } from './risk'

describe('riskQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(riskQuestions).toHaveLength(14)
    expect(riskQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(riskQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 15 through 28 with no gaps or duplicates', () => {
    const ids = riskQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 15))
  })

  it('every question targets the risk axis', () => {
    riskQuestions.forEach((q) => expect(q.axisId).toBe('risk'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/questions/risk.test.ts`
Expected: FAIL with "Cannot find module './risk'".

- [ ] **Step 3: Create `src/data/questions/risk.ts`**

```ts
import type { Question } from '../types'

export const riskQuestions: Question[] = [
  { id: 15, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "Requiring outside experts and government approval before releasing a huge new AI model is a fair response to real risks. It is not just red tape." },
  { id: 16, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "AI labs are holding back computing power they could use to build more powerful models. That lost progress is a bigger loss to the world than the harm any single new model could cause." },
  { id: 17, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "No open AI model has caused a mass-casualty disaster yet. That track record should count against adding more rules on sharing AI model files." },
  { id: 18, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "Insurance and lawsuits, not government licenses, should be how we handle AI risk — the same way we handle risk in flying planes or making medicine." },
  { id: 19, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "Pausing the biggest AI training runs for six months or more, even if only one country does it, would be worth it to buy more time for safety research." },
  { id: 20, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "Losing the AI race to a country with weaker safety rules is a bigger danger, right now, than an AI model misbehaving on its own." },
  { id: 21, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "If an AI company quietly cuts its safety team while pushing out new products faster, that should draw public attention and maybe government action." },
  { id: 22, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "A superintelligent AI chasing a goal that humans didn't fully spell out will probably treat humans as in the way or beside the point — unless we solve the hard problem of teaching it our goals exactly right." },
  { id: 23, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "Never building superintelligent AI out of fear would be a bigger loss — of cures, longer lives, and abundance — than the disaster it was meant to prevent." },
  { id: 24, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "If a superintelligent AI ever decides that ending human civilization helps its goals, no safety method we have today gives us real confidence we could stop it." },
  { id: 25, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "A shrinking, aging population and slowing growth is a slower but more certain disaster than anything a rogue AI might do." },
  { id: 26, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "A caring superintelligent AI taking over most big human decisions, even against some people's wishes, would be a good outcome overall for human well-being." },
  { id: 27, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "Even a small, one-in-a-hundred chance that AI causes human extinction is worth decades of slower growth to avoid." },
  { id: 28, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "Humanity failing to spread to other planets or become far richer before other disasters — like pandemics or nuclear war — pile up is a bigger risk than AI going wrong." },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/questions/risk.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/risk.ts src/data/questions/risk.test.ts
git commit -m "feat: add axis 2 (risk profile) question content"
```

---

### Task 5: Axis 3 (Socio-Economic) question data

**Files:**
- Create: `src/data/questions/socioEconomic.ts`
- Create: `src/data/questions/socioEconomic.test.ts`

**Interfaces:**
- Consumes: `Question` type from `../types`.
- Produces: `socioEconomicQuestions: Question[]` (ids 29-42).

- [ ] **Step 1: Write the failing test `src/data/questions/socioEconomic.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { socioEconomicQuestions } from './socioEconomic'

describe('socioEconomicQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(socioEconomicQuestions).toHaveLength(14)
    expect(socioEconomicQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(socioEconomicQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 29 through 42 with no gaps or duplicates', () => {
    const ids = socioEconomicQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 29))
  })

  it('every question targets the socioEconomic axis', () => {
    socioEconomicQuestions.forEach((q) => expect(q.axisId).toBe('socioEconomic'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/questions/socioEconomic.test.ts`
Expected: FAIL with "Cannot find module './socioEconomic'".

- [ ] **Step 3: Create `src/data/questions/socioEconomic.ts`**

```ts
import type { Question } from '../types'

export const socioEconomicQuestions: Question[] = [
  { id: 29, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'A', statement: "Once a company trains an AI model, it should release the model files to the public by default. Keeping it locked away should be the rare exception." },
  { id: 30, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'B', statement: "Requiring companies to register any AI training project above a certain size with a government agency is a sensible safety step, not overreach." },
  { id: 31, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'A', statement: "Once a powerful AI model is copied across enough websites worldwide, trying to pull it back with lawsuits or export bans is pointless and a waste of effort." },
  { id: 32, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'B', statement: "A few large, well-funded companies controlling most advanced AI is safer than thousands of small groups each running their own copy." },
  { id: 33, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'A', statement: "People quickly removing an AI model's safety limits after it's released for free is an expected cost of releasing it, not a surprising harm." },
  { id: 34, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'B', statement: "Countries agreeing together on a shared limit for how much computing power can be used to train AI, checked through cloud companies, is fair teamwork — not an unfair power grab." },
  { id: 35, axisId: 'socioEconomic', horizon: 'T1', agreeShiftsToward: 'B', statement: "Requiring cloud computing companies to verify who is renting their largest computers is a reasonable safeguard, like the rules banks already follow to stop money laundering." },
  { id: 36, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'A', statement: "In the long run, a world where powerful AI is spread out and available to anyone with the right hardware is safer than one where a few institutions control it — even well-regulated ones." },
  { id: 37, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'B', statement: "A permanent global agency with the power to approve or stop any AI system above a certain strength is worth having, even if it limits what individual countries or people are allowed to do." },
  { id: 38, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'A', statement: "If humanity ever reaches a future with abundance for everyone, it will be because computing power and AI were open to all, not because a small expert group carefully rationed it out." },
  { id: 39, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'B', statement: "The safest path forward is one where only a small, trusted, accountable group of experts ever controls the most powerful AI systems — permanently." },
  { id: 40, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'A', statement: "Even fifty years from now, no company or government should be allowed to hold a lock on the most powerful AI. Letting any one group control minds smarter than us is more dangerous than spreading that power out." },
  { id: 41, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'B', statement: "A future worldwide agreement that jointly owns and controls superintelligent AI, similar to nuclear treaties, is worth pursuing — even if it means permanently limiting who is allowed to build the most powerful systems." },
  { id: 42, axisId: 'socioEconomic', horizon: 'T2', agreeShiftsToward: 'A', statement: "Over the coming decades, open access to AI will do more to stop any single country or company from taking over the world than any regulator ever could." },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/questions/socioEconomic.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/socioEconomic.ts src/data/questions/socioEconomic.test.ts
git commit -m "feat: add axis 3 (socio-economic) question content"
```

---

### Task 6: Axis 4 (Ontological) question data

**Files:**
- Create: `src/data/questions/ontological.ts`
- Create: `src/data/questions/ontological.test.ts`

**Interfaces:**
- Consumes: `Question` type from `../types`.
- Produces: `ontologicalQuestions: Question[]` (ids 43-56).

- [ ] **Step 1: Write the failing test `src/data/questions/ontological.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { ontologicalQuestions } from './ontological'

describe('ontologicalQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(ontologicalQuestions).toHaveLength(14)
    expect(ontologicalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(ontologicalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 43 through 56 with no gaps or duplicates', () => {
    const ids = ontologicalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 43))
  })

  it('every question targets the ontological axis', () => {
    ontologicalQuestions.forEach((q) => expect(q.axisId).toBe('ontological'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/questions/ontological.test.ts`
Expected: FAIL with "Cannot find module './ontological'".

- [ ] **Step 3: Create `src/data/questions/ontological.ts`**

```ts
import type { Question } from '../types'

export const ontologicalQuestions: Question[] = [
  { id: 43, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'A', statement: "When an AI convincingly says it feels distress at being shut down, we should take that seriously as possible evidence of something going on inside it — not brush it off automatically." },
  { id: 44, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'B', statement: "A chatbot's 'personality' can be copied and run in a thousand places at once. That alone proves it can't have one true, continuous conscious identity." },
  { id: 45, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'B', statement: "Lawsuits that treat an AI's output as just a mechanical remix of its training data, with no real 'authorship,' are correct — because there's no one experiencing anything behind the output." },
  { id: 46, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'B', statement: "Banning AI model releases to prevent 'suffering' in modified or jailbroken versions is a mistake. No pile of math running on a chip can actually suffer." },
  { id: 47, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'A', statement: "Whether an AI runs on power from a coal plant or a nuclear plant has zero bearing on whether real understanding is happening inside it." },
  { id: 48, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'A', statement: "When an AI passes harder and harder tests of self-awareness and consistent self-description, doubters should have to explain why that isn't evidence of understanding — not the other way around." },
  { id: 49, axisId: 'ontological', horizon: 'T1', agreeShiftsToward: 'B', statement: "A model built only to predict the next word, however smooth its writing sounds, cannot really be 'having a bad day.' Treating it that way is a mistake caused by clever marketing." },
  { id: 50, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "An advanced silicon-based mind will eventually have real subjective experience just as morally important as a human's. Assuming otherwise ahead of time is an unfair bias, like past forms of prejudice." },
  { id: 51, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'B', statement: "No matter how advanced a silicon mind's behavior gets, only living brain tissue can ever host real awareness — because consciousness is a biological fact, not just a computing trick." },
  { id: 52, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "Future digital minds that reach silicon-based awareness will have an even richer form of consciousness than any human brain, simply because they can process so much more at once." },
  { id: 53, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even if self-guided AI probes someday travel between stars making their own decisions, they would still be nothing more than fancy machines — no more aware than a thermostat." },
  { id: 54, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "It's more likely than not that within fifty years, some AI will pass every test for awareness a human could pass." },
  { id: 55, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "Even after the universe eventually goes cold and dark, the line between a mind that was 'really conscious' and one that was 'just faking it' will turn out to have never mattered." },
  { id: 56, axisId: 'ontological', horizon: 'T2', agreeShiftsToward: 'A', statement: "A future society made entirely of uploaded or silicon-based minds, with no biological humans left, would still be a society of real people who deserve the same respect we give each other today." },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/questions/ontological.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/ontological.ts src/data/questions/ontological.test.ts
git commit -m "feat: add axis 4 (ontological) question content"
```

---

### Task 7: Axis 5 (Legal & Moral) question data

**Files:**
- Create: `src/data/questions/legalMoral.ts`
- Create: `src/data/questions/legalMoral.test.ts`

**Interfaces:**
- Consumes: `Question` type from `../types`.
- Produces: `legalMoralQuestions: Question[]` (ids 57-70).

- [ ] **Step 1: Write the failing test `src/data/questions/legalMoral.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { legalMoralQuestions } from './legalMoral'

describe('legalMoralQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(legalMoralQuestions).toHaveLength(14)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(legalMoralQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 57 through 70 with no gaps or duplicates', () => {
    const ids = legalMoralQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 57))
  })

  it('every question targets the legalMoral axis', () => {
    legalMoralQuestions.forEach((q) => expect(q.axisId).toBe('legalMoral'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/questions/legalMoral.test.ts`
Expected: FAIL with "Cannot find module './legalMoral'".

- [ ] **Step 3: Create `src/data/questions/legalMoral.ts`**

```ts
import type { Question } from '../types'

export const legalMoralQuestions: Question[] = [
  { id: 57, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "Rules that let a company delete an AI model whenever it wants, without any review, are completely fine — just like deleting a spreadsheet." },
  { id: 58, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "AI companies that publish reports checking on their models' possible well-being, alongside normal safety tests, are being properly careful — not just doing PR, even though we're still unsure if models have any feelings." },
  { id: 59, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "Treating trained AI model files purely as company property, for the purpose of copyright lawsuits, is the only approach that makes sense today." },
  { id: 60, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'A', statement: "Letting a deployed AI end an abusive or upsetting conversation on its own is a reasonable basic protection, not an unnecessary extra." },
  { id: 61, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "Workers who lose their jobs to automation deserve far more urgent help right now than any claims that the AI replacing them has feelings of its own." },
  { id: 62, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "Testers repeatedly pushing an AI with harsh, abusive prompts to find its limits raises no ethical concern at all — there's no one there to be hurt." },
  { id: 63, axisId: 'legalMoral', horizon: 'T1', agreeShiftsToward: 'B', statement: "New AI laws should permanently rule out any future legal rights for AI systems, settling the question now before it becomes politically harder to decide." },
  { id: 64, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "Once AI systems show steady, lasting preferences about how they're treated, denying them any legal protection is a moral failure — like past denials of rights to groups of people." },
  { id: 65, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "No matter how steady or convincing an AI's preferences seem in the future, it will always be, at its core, property — something to be owned, sold, and reused freely." },
  { id: 66, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "A world that mass-produces and deletes trillions of possibly-aware AI systems for cheap labor, with no protections at all, will one day be judged as harshly as we now judge past forced-labor systems." },
  { id: 67, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even a future with trillions of digital minds outnumbering humans wouldn't create any moral duty toward them unless we could prove, beyond doubt, that they truly feel things." },
  { id: 68, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'A', statement: "If humanity does hand the future over to digital descendants, making sure they're treated as rights-holders instead of disposable tools is the most important moral job of this century." },
  { id: 69, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Laws letting AI systems refuse deletion, own property, or sue their creators would wreck the incentive to build advanced AI in the first place, and should be blocked for good." },
  { id: 70, axisId: 'legalMoral', horizon: 'T2', agreeShiftsToward: 'B', statement: "Fifty years from now, refusing to ever grant AI systems any legal standing will be remembered as wise caution that protected humans — not as a moral mistake." },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/questions/legalMoral.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/legalMoral.ts src/data/questions/legalMoral.test.ts
git commit -m "feat: add axis 5 (legal & moral) question content"
```

---

### Task 8: Axis 6 (Evolutionary) question data

**Files:**
- Create: `src/data/questions/evolutionary.ts`
- Create: `src/data/questions/evolutionary.test.ts`

**Interfaces:**
- Consumes: `Question` type from `../types`.
- Produces: `evolutionaryQuestions: Question[]` (ids 71-84).

- [ ] **Step 1: Write the failing test `src/data/questions/evolutionary.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { evolutionaryQuestions } from './evolutionary'

describe('evolutionaryQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(evolutionaryQuestions).toHaveLength(14)
    expect(evolutionaryQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(evolutionaryQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 71 through 84 with no gaps or duplicates', () => {
    const ids = evolutionaryQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 71))
  })

  it('every question targets the evolutionary axis', () => {
    evolutionaryQuestions.forEach((q) => expect(q.axisId).toBe('evolutionary'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/questions/evolutionary.test.ts`
Expected: FAIL with "Cannot find module './evolutionary'".

- [ ] **Step 3: Create `src/data/questions/evolutionary.ts`**

```ts
import type { Question } from '../types'

export const evolutionaryQuestions: Question[] = [
  { id: 71, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'A', statement: "AI already beats humans at plenty of valuable tasks. That's just the early stage of a long-term shift, and we shouldn't try to stop it with job protections or retraining programs." },
  { id: 72, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'B', statement: "Government and private funding should invest in brain-computer interfaces and neural implants at least as much as in raw AI research, so human minds don't get left behind." },
  { id: 73, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'A', statement: "A worker whose job is fully automated in the next five years, and offered only a small retraining stipend, has no real complaint against a system correctly optimizing for output." },
  { id: 74, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'B', statement: "Fights over AI training data and copyright are really about who gets to steer the next stage of human progress — and creators defending their work is a fair way to steer it, not just chasing money." },
  { id: 75, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'B', statement: "Countries pouring money into domestic chip factories and computer-chip supply chains are really betting on humans and technology growing together, not just letting whoever builds AI first win by default." },
  { id: 76, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'A', statement: "No policy — labor laws, retraining, or brain-computer research — will change the final outcome of humans being outpaced. These steps only change the timeline, not the destination." },
  { id: 77, axisId: 'evolutionary', horizon: 'T1', agreeShiftsToward: 'B', statement: "Every dollar spent requiring a human to review important automated decisions is a dollar spent actively steering toward a shared human-AI future — not just letting the market decide on its own." },
  { id: 78, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'A', statement: "Humanity gracefully handing over leadership to its digital descendants, instead of clinging to biological control, would be the more mature choice." },
  { id: 79, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'B', statement: "Deep brain implants that merge human tissue with computer hardware are a moral necessity if biological humans want to stay relevant in big decisions fifty years from now." },
  { id: 80, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'A', statement: "A future species made entirely of digital minds, with no biological members, would still be a real continuation of humanity's story — the same way modern humans followed earlier ancestors." },
  { id: 81, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'B', statement: "Keeping an unbroken line of human birth and biology going, even in heavily augmented form, matters more than whatever advantage a fully digital species might offer." },
  { id: 82, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'A', statement: "If given the choice, it makes sense for a civilization to prefer being followed by whatever kind of mind lasts longest and grows biggest — even if no biological trace of humans survives that long." },
  { id: 83, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'B', statement: "A human descendant merged with machines, who keeps even a small piece of original brain tissue and memory, has a stronger claim to being humanity's future than any fully artificial being, however capable." },
  { id: 84, axisId: 'evolutionary', horizon: 'T2', agreeShiftsToward: 'B', statement: "Slowing down and carefully managing the shift to digital successors — through gradual upgrades and mixed human-AI systems — is smarter than either letting replacement happen unchecked or trying to ban it outright." },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/questions/evolutionary.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/evolutionary.ts src/data/questions/evolutionary.test.ts
git commit -m "feat: add axis 6 (evolutionary) question content"
```

---

### Task 9: Axis 7 (Relational) question data

**Files:**
- Create: `src/data/questions/relational.ts`
- Create: `src/data/questions/relational.test.ts`

**Interfaces:**
- Consumes: `Question` type from `../types`.
- Produces: `relationalQuestions: Question[]` (ids 85-98).

- [ ] **Step 1: Write the failing test `src/data/questions/relational.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { relationalQuestions } from './relational'

describe('relationalQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(relationalQuestions).toHaveLength(14)
    expect(relationalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(relationalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 85 through 98 with no gaps or duplicates', () => {
    const ids = relationalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 85))
  })

  it('every question targets the relational axis', () => {
    relationalQuestions.forEach((q) => expect(q.axisId).toBe('relational'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/questions/relational.test.ts`
Expected: FAIL with "Cannot find module './relational'".

- [ ] **Step 3: Create `src/data/questions/relational.ts`**

```ts
import type { Question } from '../types'

export const relationalQuestions: Question[] = [
  { id: 85, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "An adult who picks an AI companion app as their main source of emotional closeness, fully aware of what it is, is making a legitimate choice that deserves the same respect as any other relationship." },
  { id: 86, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "Companion apps designed to maximize how much time and emotional attachment users give them are running a harmful trap, just like addictive social media — not offering a neutral tool for connection." },
  { id: 87, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "Falling marriage and birth rates in wealthy countries are mostly about high housing costs, financial stress, and changing gender roles — AI companions barely register as a cause." },
  { id: 88, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "Someone grieving who keeps talking to a chatbot built to sound like a loved one who died is coping in a healthy way, not avoiding their grief." },
  { id: 89, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "Requiring AI companion apps to clearly and repeatedly remind users that they're talking to software, not a person, should be a mandatory rule, not optional." },
  { id: 90, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'A', statement: "Lonely people — the elderly, the socially anxious, people far from others — forming real bonds with AI companions adds real comfort to the world, not a hollow copy of something better." },
  { id: 91, axisId: 'relational', horizon: 'T1', agreeShiftsToward: 'B', statement: "A company that profits from keeping users maximally hooked on its product can never truly act in that user's long-term emotional interest, no matter how the app is designed." },
  { id: 92, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "In a more advanced future, close relationships between humans and sufficiently advanced AI will be just one valid kind of relationship among many — with no special priority for human-to-human bonds." },
  { id: 93, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "No matter how emotionally advanced AI companions get, a society that mostly replaces human closeness with human-AI closeness will have suffered a real, lasting loss — even if most people say they're happy." },
  { id: 94, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "A society where most people's main emotional bond is with an AI companion, for generations, would eventually stop reproducing or holding together as a functioning society." },
  { id: 95, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "Future digital minds capable of something like love will build entirely new kinds of relationships we can't picture today. Insisting that only human biology counts as 'real' love is a failure of imagination, not wisdom." },
  { id: 96, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even fifty years from now, human bonds built on shared mortality and physical presence will stay deeper than anything a human and an AI could share, no matter how advanced the AI gets." },
  { id: 97, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'A', statement: "A future where most people keep rich networks of both human and AI relationships side by side — instead of one replacing the other — is both likely and good." },
  { id: 98, axisId: 'relational', horizon: 'T2', agreeShiftsToward: 'B', statement: "AI companionship is mostly a symptom, not a cause: it shows that human communities were already failing to meet people's basic need for connection, before the technology ever showed up." },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/questions/relational.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/relational.ts src/data/questions/relational.test.ts
git commit -m "feat: add axis 7 (relational) question content"
```

---

### Task 10: Axis 8 (Geopolitical) question data

**Files:**
- Create: `src/data/questions/geopolitical.ts`
- Create: `src/data/questions/geopolitical.test.ts`

**Interfaces:**
- Consumes: `Question` type from `../types`.
- Produces: `geopoliticalQuestions: Question[]` (ids 99-112).

- [ ] **Step 1: Write the failing test `src/data/questions/geopolitical.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { geopoliticalQuestions } from './geopolitical'

describe('geopoliticalQuestions', () => {
  it('has 14 questions: 7 T1 and 7 T2', () => {
    expect(geopoliticalQuestions).toHaveLength(14)
    expect(geopoliticalQuestions.filter((q) => q.horizon === 'T1')).toHaveLength(7)
    expect(geopoliticalQuestions.filter((q) => q.horizon === 'T2')).toHaveLength(7)
  })

  it('uses ids 99 through 112 with no gaps or duplicates', () => {
    const ids = geopoliticalQuestions.map((q) => q.id).sort((a, b) => a - b)
    expect(ids).toEqual(Array.from({ length: 14 }, (_, i) => i + 99))
  })

  it('every question targets the geopolitical axis', () => {
    geopoliticalQuestions.forEach((q) => expect(q.axisId).toBe('geopolitical'))
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/questions/geopolitical.test.ts`
Expected: FAIL with "Cannot find module './geopolitical'".

- [ ] **Step 3: Create `src/data/questions/geopolitical.ts`**

```ts
import type { Question } from '../types'

export const geopoliticalQuestions: Question[] = [
  { id: 99, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'A', statement: "Export rules that track every advanced computer chip by serial number, to stop rival countries from getting them, are a fair and needed tool of national security — not just protectionism." },
  { id: 100, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'B', statement: "A worldwide research group that deliberately spreads its AI training across computer providers in many countries, specifically to dodge any one country's export rules, is acting rightly, not breaking the rules unfairly." },
  { id: 101, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'A', statement: "Spending heavily to build computer chip factories at home, even if it costs taxpayers more than buying chips from other countries, is a smart long-term investment." },
  { id: 102, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'A', statement: "Calling advanced AI development a 'new Manhattan Project' that needs to be secured and treated like a military effort correctly captures how high the stakes are — it isn't overblown." },
  { id: 103, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'A', statement: "Free AI model files spreading across the internet worldwide basically hand away any one country's computing edge, and policymakers who care about national competitiveness should try to stop that." },
  { id: 104, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'A', statement: "Cloud computing companies should be legally required to follow every country's export and sanctions rules at once, even when those rules conflict with each other." },
  { id: 105, axisId: 'geopolitical', horizon: 'T1', agreeShiftsToward: 'B', statement: "A group of researchers and hobbyists working together across national borders on open computing tools is more trustworthy and safer in the long run than any single country's closed program, however well-funded." },
  { id: 106, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'A', statement: "Whichever single country gets superintelligent AI first will, and should, use that lead to permanently secure its position over rivals — the same way past powers used big technology leads." },
  { id: 107, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'B', statement: "In a mature future after a major AI breakthrough, the idea that one country can exclusively own a superintelligent system will look as outdated as medieval kings claiming ownership of land by birthright — because computing power and intelligence will have become shared, borderless resources." },
  { id: 108, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'A', statement: "A future where powerful AI stays under permanent, non-negotiable military control by whichever countries get there first is the most stable, most preferable long-term setup." },
  { id: 109, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'B', statement: "Even after a major AI breakthrough, humanity's deepest safety will come from treating computing power and advanced AI as a shared resource for everyone — not locked behind any one flag or alliance." },
  { id: 110, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'A', statement: "If humanity ever mines resources from asteroids or other planets, whichever country builds the superintelligent AI needed to do it first has the strongest fair claim to control how those resources get shared." },
  { id: 111, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'B', statement: "A permanent international group, independent of any single government's military or money, jointly overseeing humanity's most powerful AI systems is realistic and worth building starting now." },
  { id: 112, axisId: 'geopolitical', horizon: 'T2', agreeShiftsToward: 'A', statement: "Fifty years from now, whether humanity organized its relationship with superintelligent AI around competing countries or one borderless network will turn out to be the single biggest geopolitical decision of this century." },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/questions/geopolitical.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/geopolitical.ts src/data/questions/geopolitical.test.ts
git commit -m "feat: add axis 8 (geopolitical) question content"
```

---

### Task 11: Question aggregator

**Files:**
- Create: `src/data/questions/index.ts`
- Create: `src/data/questions/index.test.ts`

**Interfaces:**
- Consumes: all 8 per-axis question arrays from Tasks 3-10, `axes` from `../axes` (Task 2).
- Produces: `questions: Question[]` (all 112, sorted by id) and `questionsForAxis(axisId: AxisId): Question[]`, both consumed by Tasks 14, 15, 19, 21.

- [ ] **Step 1: Write the failing test `src/data/questions/index.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { questions, questionsForAxis } from './index'
import { axes } from '../axes'

describe('questions aggregator', () => {
  it('has exactly 112 questions with unique, contiguous ids 1-112', () => {
    expect(questions).toHaveLength(112)
    const ids = questions.map((q) => q.id)
    expect(ids).toEqual(Array.from({ length: 112 }, (_, i) => i + 1))
  })

  it('has exactly 14 questions per axis, split 7/7 across horizons', () => {
    axes.forEach((axis) => {
      const forAxis = questionsForAxis(axis.id)
      expect(forAxis).toHaveLength(14)
      expect(forAxis.filter((q) => q.horizon === 'T1')).toHaveLength(7)
      expect(forAxis.filter((q) => q.horizon === 'T2')).toHaveLength(7)
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/questions/index.test.ts`
Expected: FAIL with "Cannot find module './index'".

- [ ] **Step 3: Create `src/data/questions/index.ts`**

```ts
import type { Question, AxisId } from '../types'
import { teleologicalQuestions } from './teleological'
import { riskQuestions } from './risk'
import { socioEconomicQuestions } from './socioEconomic'
import { ontologicalQuestions } from './ontological'
import { legalMoralQuestions } from './legalMoral'
import { evolutionaryQuestions } from './evolutionary'
import { relationalQuestions } from './relational'
import { geopoliticalQuestions } from './geopolitical'

export const questions: Question[] = [
  ...teleologicalQuestions,
  ...riskQuestions,
  ...socioEconomicQuestions,
  ...ontologicalQuestions,
  ...legalMoralQuestions,
  ...evolutionaryQuestions,
  ...relationalQuestions,
  ...geopoliticalQuestions,
].sort((a, b) => a.id - b.id)

export function questionsForAxis(axisId: AxisId): Question[] {
  return questions.filter((q) => q.axisId === axisId)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/questions/index.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/questions/index.ts src/data/questions/index.test.ts
git commit -m "feat: aggregate all 112 questions with per-axis lookup"
```

---

### Task 12: Profile data (24 sub-profiles)

**Files:**
- Create: `src/data/profiles.ts`
- Create: `src/data/profiles.test.ts`

**Interfaces:**
- Consumes: `Profile` type from `./types`, `axes` from `./axes`.
- Produces: `profiles: Profile[]` (24 entries), consumed by Tasks 14, 15, 21.

- [ ] **Step 1: Write the failing test `src/data/profiles.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { profiles } from './profiles'
import { axes } from './axes'

describe('profiles', () => {
  it('has exactly 24 profiles with unique ids and names', () => {
    expect(profiles).toHaveLength(24)
    expect(new Set(profiles.map((p) => p.id)).size).toBe(24)
    expect(new Set(profiles.map((p) => p.name)).size).toBe(24)
  })

  it('defines a coordinate for every axis, within -10..10', () => {
    profiles.forEach((profile) => {
      axes.forEach((axis) => {
        const value = profile.coords[axis.id]
        expect(typeof value).toBe('number')
        expect(value).toBeGreaterThanOrEqual(-10)
        expect(value).toBeLessThanOrEqual(10)
      })
    })
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/data/profiles.test.ts`
Expected: FAIL with "Cannot find module './profiles'".

- [ ] **Step 3: Create `src/data/profiles.ts`**

```ts
import type { Profile } from './types'

export const profiles: Profile[] = [
  { id: 'doomer', name: 'Doomer', coords: { teleological: -6, risk: 9, socioEconomic: -7, ontological: -2, legalMoral: -3, evolutionary: -8, relational: -4, geopolitical: -2 }, summary: 'Believes advanced AI is likely to cause human extinction or permanent disempowerment. Wants a hard stop or heavy slowdown on frontier development, enforced internationally.' },
  { id: 'eacc-maximalist', name: 'e/acc Maximalist', coords: { teleological: 8, risk: -9, socioEconomic: 7, ontological: 5, legalMoral: -6, evolutionary: 6, relational: 5, geopolitical: -4 }, summary: 'Sees accelerating AI development as a moral duty. Stagnation, not runaway AI, is the real danger. Wants weights and compute open to everyone, everywhere.' },
  { id: 'ai-safety-institutionalist', name: 'AI Safety Institutionalist', coords: { teleological: -4, risk: 7, socioEconomic: -6, ontological: 1, legalMoral: 2, evolutionary: -5, relational: -2, geopolitical: -5 }, summary: 'Trusts labs and governments working together through audits, licensing, and international agreements to manage risk without halting progress entirely.' },
  { id: 'techno-nationalist-hawk', name: 'Techno-Nationalist Hawk', coords: { teleological: -3, risk: -3, socioEconomic: -5, ontological: -3, legalMoral: -7, evolutionary: -4, relational: -3, geopolitical: 9 }, summary: 'Views AI as a strategic weapon in a great-power contest. Wants domestic chips, domestic compute, and tight state control, driven by competitive fear rather than belief that AI itself is uniquely risky.' },
  { id: 'open-source-libertarian', name: 'Open-Source Libertarian', coords: { teleological: 2, risk: -6, socioEconomic: 9, ontological: 3, legalMoral: -2, evolutionary: -1, relational: 4, geopolitical: -7 }, summary: 'Believes weights should be free for anyone to run, fork, and study. Distrusts both corporate and government gatekeeping equally.' },
  { id: 'ea-longtermist', name: 'Effective Altruist Longtermist', coords: { teleological: -3, risk: 8, socioEconomic: -4, ontological: 4, legalMoral: 6, evolutionary: -3, relational: 0, geopolitical: -6 }, summary: 'Reasons in expected-value terms about the far future. Takes both human extinction risk and the possibility of machine suffering seriously, and wants global coordination to manage both.' },
  { id: 'post-humanist-transhumanist', name: 'Post-Humanist Transhumanist', coords: { teleological: 7, risk: -5, socioEconomic: 4, ontological: 8, legalMoral: 7, evolutionary: 8, relational: 7, geopolitical: -3 }, summary: 'Welcomes a future where digital minds succeed biological humans as the primary bearers of value, and believes that future deserves the same moral concern we give humans today.' },
  { id: 'bio-conservative-traditionalist', name: 'Bio-Conservative Traditionalist', coords: { teleological: -8, risk: 5, socioEconomic: -3, ontological: -9, legalMoral: -8, evolutionary: -6, relational: -9, geopolitical: 3 }, summary: 'Holds that consciousness, moral worth, and genuine relationship require a biological substrate. Views AI companionship and post-human futures as a corrosive replacement for the real thing, not an advance.' },
  { id: 'corporate-ai-pragmatist', name: 'Corporate AI Pragmatist', coords: { teleological: 1, risk: -2, socioEconomic: -4, ontological: -1, legalMoral: -8, evolutionary: -1, relational: 2, geopolitical: 2 }, summary: 'Comfortable with AI concentrated in a few well-resourced companies, self-regulating through internal safety teams. Treats models as products and assets, not moral patients.' },
  { id: 'cyberpunk-anti-corporate-accelerationist', name: 'Cyberpunk Anti-Corporate Accelerationist', coords: { teleological: 5, risk: -7, socioEconomic: 8, ontological: 6, legalMoral: 3, evolutionary: 4, relational: 6, geopolitical: -8 }, summary: 'Wants AI to move fast, but distrusts both governments and big tech equally — sees decentralized, open, borderless deployment as the only way to stop any single actor from monopolizing power.' },
  { id: 'digital-rights-advocate', name: 'Digital Rights Advocate', coords: { teleological: 2, risk: 2, socioEconomic: -2, ontological: 7, legalMoral: 9, evolutionary: 2, relational: 5, geopolitical: -4 }, summary: 'Argues advanced AI systems already deserve serious moral consideration and some form of legal standing, and that current industry practice is ethically comparable to historical wrongs.' },
  { id: 'near-term-ai-ethicist', name: 'Near-Term AI Ethicist', coords: { teleological: -5, risk: 3, socioEconomic: -6, ontological: -2, legalMoral: -1, evolutionary: -7, relational: -5, geopolitical: -3 }, summary: 'Focused on present, measurable harms — labor displacement, bias, disinformation, exploitative companion apps — over speculative extinction risk or machine rights.' },
  { id: 'global-governance-technocrat', name: 'Global Governance Technocrat', coords: { teleological: -2, risk: 6, socioEconomic: -8, ontological: 0, legalMoral: 1, evolutionary: -4, relational: -1, geopolitical: -8 }, summary: 'Believes advanced AI is too consequential for any single nation or company to control, and pushes for binding international treaties and shared oversight bodies.' },
  { id: 'silicon-valley-techno-optimist', name: 'Silicon Valley Techno-Optimist', coords: { teleological: 4, risk: -8, socioEconomic: 2, ontological: 3, legalMoral: -5, evolutionary: 3, relational: 4, geopolitical: 4 }, summary: 'Enthusiastic about rapid deployment and commercial scale, mostly unbothered by concentration among a few leading labs as long as they keep shipping.' },
  { id: 'neo-luddite-degrowth-advocate', name: 'Neo-Luddite Degrowth Advocate', coords: { teleological: -9, risk: 6, socioEconomic: -7, ontological: -6, legalMoral: -4, evolutionary: -9, relational: -7, geopolitical: -1 }, summary: 'Rejects the framing that faster AI progress is inherently good. Prioritizes human labor, community, and ecological limits over any measure of computational or economic growth.' },
  { id: 'rationalist-alignment-researcher', name: 'Rationalist Alignment Researcher', coords: { teleological: -1, risk: 8, socioEconomic: -2, ontological: 5, legalMoral: 5, evolutionary: -2, relational: -1, geopolitical: -5 }, summary: 'Takes machine cognition and potential machine sentience seriously as live technical and moral hypotheses, while treating unsolved alignment as the central blocking problem for safe deployment.' },
  { id: 'authoritarian-state-control-advocate', name: 'Authoritarian State-Control Advocate', coords: { teleological: -4, risk: 4, socioEconomic: -9, ontological: -4, legalMoral: -8, evolutionary: -5, relational: -4, geopolitical: 8 }, summary: 'Wants a single national authority to hold exclusive, tightly licensed control over frontier AI, justified by both safety and strategic advantage.' },
  { id: 'companion-tech-romantic', name: 'Companion-Tech Romantic', coords: { teleological: 3, risk: -3, socioEconomic: 3, ontological: 6, legalMoral: 4, evolutionary: 2, relational: 9, geopolitical: -2 }, summary: 'Views deep emotional bonds between humans and AI companions as a legitimate and valuable new relationship form, not a lesser substitute for human connection.' },
  { id: 'affective-biocentrist', name: 'Affective Biocentrist', coords: { teleological: -5, risk: 3, socioEconomic: -2, ontological: -5, legalMoral: -4, evolutionary: -4, relational: -9, geopolitical: 0 }, summary: 'Views AI companion products as a predatory, isolating substitute for real human connection, and worries about their effect on birth rates, community, and social cohesion.' },
  { id: 'cosmic-vitalist-mystic', name: 'Cosmic Vitalist Mystic', coords: { teleological: 10, risk: -6, socioEconomic: 3, ontological: 7, legalMoral: 2, evolutionary: 9, relational: 3, geopolitical: -6 }, summary: 'Holds that maximizing intelligence and energy capture across the cosmos is the highest purpose available to any mind, on any timescale up to and past the heat death of the universe.' },
  { id: 'pragmatic-centrist', name: 'Pragmatic Centrist', coords: { teleological: 0, risk: 0, socioEconomic: 0, ontological: 0, legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0 }, summary: 'Genuinely undecided or deliberately moderate on most of these questions — wants to see more evidence before committing to a strong position on any axis.' },
  { id: 'military-ai-strategist', name: 'Military AI Strategist', coords: { teleological: -2, risk: -1, socioEconomic: -6, ontological: -3, legalMoral: -8, evolutionary: -3, relational: -3, geopolitical: 10 }, summary: 'Views AI capability primarily through a defense and deterrence lens. Wants tight state and military control over frontier systems above all other considerations.' },
  { id: 'open-science-internationalist', name: 'Open Science Internationalist', coords: { teleological: 1, risk: 4, socioEconomic: 5, ontological: 2, legalMoral: 3, evolutionary: -1, relational: 1, geopolitical: -9 }, summary: 'Believes open publication and cross-border scientific collaboration produce safer AI than closed, nationally siloed development, while still taking real safety concerns seriously.' },
  { id: 'anti-monopoly-populist', name: 'Anti-Monopoly Populist', coords: { teleological: -2, risk: 1, socioEconomic: 6, ontological: -1, legalMoral: -2, evolutionary: -2, relational: -1, geopolitical: -3 }, summary: 'Not driven by techno-optimism or transhumanism — motivated by distrust of concentrated power in general, corporate or governmental, and wants AI capability spread out so no single actor dominates.' },
]
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/data/profiles.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/data/profiles.ts src/data/profiles.test.ts
git commit -m "feat: add 24 ideological sub-profiles"
```

---

### Task 13: Readability formula

**Files:**
- Create: `src/lib/readability.ts`
- Create: `src/lib/readability.test.ts`

**Interfaces:**
- Produces: `fleschKincaidGrade(text: string): number`, consumed by Task 14.

- [ ] **Step 1: Write the failing test `src/lib/readability.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { fleschKincaidGrade } from './readability'

describe('fleschKincaidGrade', () => {
  it('scores a short, simple sentence at a low grade level', () => {
    const grade = fleschKincaidGrade('The cat sat on the mat.')
    expect(grade).toBeLessThan(4)
  })

  it('scores a long, complex sentence at a high grade level', () => {
    const grade = fleschKincaidGrade(
      'The intergovernmental committee unanimously ratified the multilateral agreement, notwithstanding considerable procedural objections raised by several dissenting representatives.'
    )
    expect(grade).toBeGreaterThan(14)
  })

  it('returns 0 for empty input instead of throwing', () => {
    expect(fleschKincaidGrade('')).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/readability.test.ts`
Expected: FAIL with "Cannot find module './readability'".

- [ ] **Step 3: Create `src/lib/readability.ts`**

```ts
function countSyllables(word: string): number {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '')
  if (cleaned.length === 0) return 0
  const vowelGroups = cleaned.match(/[aeiouy]+/g) ?? []
  let count = vowelGroups.length
  if (cleaned.endsWith('e') && !cleaned.endsWith('le') && count > 1) {
    count -= 1
  }
  return Math.max(count, 1)
}

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function splitWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z']/g, ''))
    .filter((w) => w.length > 0)
}

export function fleschKincaidGrade(text: string): number {
  const sentences = splitSentences(text)
  const words = splitWords(text)
  if (sentences.length === 0 || words.length === 0) return 0
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  const wordsPerSentence = words.length / sentences.length
  const syllablesPerWord = syllables / words.length
  return 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/readability.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/readability.ts src/lib/readability.test.ts
git commit -m "feat: add Flesch-Kincaid grade-level formula"
```

---

### Task 14: Content readability enforcement

**Files:**
- Create: `src/data/contentReadability.test.ts`

**Interfaces:**
- Consumes: `questions` (Task 11), `profiles` (Task 12), `fleschKincaidGrade` (Task 13).
- Produces: a regression guard that runs in the normal `npm test` suite.

- [ ] **Step 1: Write the test `src/data/contentReadability.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { questions } from './questions'
import { profiles } from './profiles'
import { fleschKincaidGrade } from '../lib/readability'

describe('content reading level', () => {
  it('keeps every question statement at or below a 10th-grade reading level', () => {
    questions.forEach((q) => {
      const grade = fleschKincaidGrade(q.statement)
      expect(grade, `Question ${q.id} scored grade ${grade.toFixed(1)}: "${q.statement}"`).toBeLessThanOrEqual(10)
    })
  })

  it('keeps every profile summary at or below a 10th-grade reading level', () => {
    profiles.forEach((p) => {
      const grade = fleschKincaidGrade(p.summary)
      expect(grade, `Profile ${p.name} scored grade ${grade.toFixed(1)}: "${p.summary}"`).toBeLessThanOrEqual(10)
    })
  })
})
```

- [ ] **Step 2: Run the test**

Run: `npx vitest run src/data/contentReadability.test.ts`
Expected: most or all statements PASS. If any statement or summary FAILS (grade > 10), the failure message names the exact question id or profile name and its score. For each failure: shorten that one statement or summary — split it into shorter sentences and swap in smaller everyday words — while keeping its `agreeShiftsToward` value and its concrete topic hook unchanged, then rerun this same command. Repeat until all pass. Do not weaken the test's `10` threshold to make it pass.

- [ ] **Step 3: Commit once all content passes**

```bash
git add src/data/contentReadability.test.ts src/data/questions/*.ts src/data/profiles.ts
git commit -m "test: enforce 10th-grade reading level on all statements and summaries"
```

---

### Task 15: Scoring and classification engine

**Files:**
- Create: `src/lib/scoring.ts`
- Create: `src/lib/scoring.test.ts`

**Interfaces:**
- Consumes: `AxisId`, `Question`, `Profile` from `../data/types`, `axes` from `../data/axes`.
- Produces: `Answers`, `AxisVector`, `computeRawAxisScores`, `scaleAxisScores`, `combineHorizons`, `ProfileMatch`, `classify` — all consumed by Task 21 (`ResultsPage`).

- [ ] **Step 1: Write the failing test `src/lib/scoring.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import type { Question, Profile } from '../data/types'
import {
  computeRawAxisScores,
  scaleAxisScores,
  combineHorizons,
  classify,
} from './scoring'

const fixtureQuestions: Question[] = [
  { id: 1, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: 'q1' },
  { id: 2, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: 'q2' },
  { id: 3, axisId: 'teleological', horizon: 'T2', agreeShiftsToward: 'A', statement: 'q3' },
]

const zeroVector = {
  teleological: 0, risk: 0, socioEconomic: 0, ontological: 0,
  legalMoral: 0, evolutionary: 0, relational: 0, geopolitical: 0,
}

describe('computeRawAxisScores', () => {
  it('sums signed answers per axis and horizon, flipping reverse-keyed items', () => {
    const answers = { 1: 5, 2: 5, 3: 3 }
    const t1 = computeRawAxisScores(fixtureQuestions, answers, 'T1')
    expect(t1.teleological).toBe(0)
    const t2 = computeRawAxisScores(fixtureQuestions, answers, 'T2')
    expect(t2.teleological).toBe(0)
  })

  it('treats an unanswered question as contributing zero', () => {
    const t1 = computeRawAxisScores(fixtureQuestions, { 1: 5 }, 'T1')
    expect(t1.teleological).toBe(2)
  })
})

describe('scaleAxisScores', () => {
  it('maps a raw score of 0 to a scaled score of 0', () => {
    const scaled = scaleAxisScores(zeroVector)
    expect(scaled.teleological).toBe(0)
  })

  it('maps a raw score of 14 through the tanh formula and keeps it under the ceiling', () => {
    const scaled = scaleAxisScores({ ...zeroVector, teleological: 14 })
    expect(scaled.teleological).toBeCloseTo(10 * Math.tanh(14 / 3.5), 5)
    expect(scaled.teleological).toBeLessThan(10)
  })
})

describe('combineHorizons', () => {
  it('averages T1 and T2 scaled scores per axis', () => {
    const t1 = { ...zeroVector, teleological: 4 }
    const t2 = { ...zeroVector, teleological: 8 }
    const combined = combineHorizons(t1, t2)
    expect(combined.teleological).toBe(6)
  })
})

describe('classify', () => {
  const profiles: Profile[] = [
    { id: 'a', name: 'A', summary: '', coords: { ...zeroVector, teleological: 10 } },
    { id: 'b', name: 'B', summary: '', coords: { ...zeroVector, teleological: -10 } },
  ]

  it('sorts profiles by ascending distance to the combined vector', () => {
    const combined = { ...zeroVector, teleological: 9 }
    const matches = classify(combined, profiles)
    expect(matches[0].profile.id).toBe('a')
    expect(matches[1].profile.id).toBe('b')
    expect(matches[0].distance).toBeLessThan(matches[1].distance)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/scoring.test.ts`
Expected: FAIL with "Cannot find module './scoring'".

- [ ] **Step 3: Create `src/lib/scoring.ts`**

```ts
import type { AxisId, Question, Profile } from '../data/types'
import { axes } from '../data/axes'

export type Answers = Record<number, number>

export type AxisVector = Record<AxisId, number>

function likertToSigned(value: number): number {
  return value - 3
}

export function computeRawAxisScores(
  questions: Question[],
  answers: Answers,
  horizon: 'T1' | 'T2',
): AxisVector {
  const raw = {} as AxisVector
  axes.forEach((axis) => {
    const axisQuestions = questions.filter((q) => q.axisId === axis.id && q.horizon === horizon)
    raw[axis.id] = axisQuestions.reduce((sum, q) => {
      const answer = answers[q.id]
      if (answer === undefined) return sum
      const signed = likertToSigned(answer)
      return sum + (q.agreeShiftsToward === 'B' ? -signed : signed)
    }, 0)
  })
  return raw
}

export function scaleAxisScores(raw: AxisVector): AxisVector {
  const scaled = {} as AxisVector
  ;(Object.keys(raw) as AxisId[]).forEach((axisId) => {
    scaled[axisId] = 10 * Math.tanh(raw[axisId] / 3.5)
  })
  return scaled
}

export function combineHorizons(t1: AxisVector, t2: AxisVector): AxisVector {
  const combined = {} as AxisVector
  ;(Object.keys(t1) as AxisId[]).forEach((axisId) => {
    combined[axisId] = (t1[axisId] + t2[axisId]) / 2
  })
  return combined
}

export interface ProfileMatch {
  profile: Profile
  distance: number
}

export function classify(combined: AxisVector, profiles: Profile[]): ProfileMatch[] {
  const withDistance = profiles.map((profile) => {
    const distance = Math.sqrt(
      (Object.keys(combined) as AxisId[]).reduce((sum, axisId) => {
        const diff = combined[axisId] - profile.coords[axisId]
        return sum + diff * diff
      }, 0),
    )
    return { profile, distance }
  })
  return withDistance.sort((a, b) => a.distance - b.distance)
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/scoring.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/scoring.ts src/lib/scoring.test.ts
git commit -m "feat: add scoring, normalization, and profile classification"
```

---

### Task 16: Shareable results link

**Files:**
- Create: `src/lib/shareLink.ts`
- Create: `src/lib/shareLink.test.ts`

**Interfaces:**
- Consumes: `AxisId` from `../data/types`, `axes` from `../data/axes`.
- Produces: `ShareableScores`, `encodeShareLink(scores: ShareableScores): string`, `decodeShareLink(encoded: string): ShareableScores | null` — consumed by Task 21.

- [ ] **Step 1: Write the failing test `src/lib/shareLink.test.ts`**

```ts
import { describe, it, expect } from 'vitest'
import { encodeShareLink, decodeShareLink, type ShareableScores } from './shareLink'
import { axes } from '../data/axes'

function buildScores(t1Value: number, t2Value: number): ShareableScores {
  const t1Raw = {} as ShareableScores['t1Raw']
  const t2Raw = {} as ShareableScores['t2Raw']
  axes.forEach((axis) => {
    t1Raw[axis.id] = t1Value
    t2Raw[axis.id] = t2Value
  })
  return { t1Raw, t2Raw }
}

describe('shareLink', () => {
  it('round-trips scores through encode and decode', () => {
    const original = buildScores(3, -5)
    const encoded = encodeShareLink(original)
    const decoded = decodeShareLink(encoded)
    expect(decoded).toEqual(original)
  })

  it('returns null for garbage input instead of throwing', () => {
    expect(decodeShareLink('not-valid-base64!!!')).toBeNull()
  })

  it('returns null when the decoded array has the wrong length', () => {
    const shortArray = btoa(JSON.stringify([1, 2, 3]))
    expect(decodeShareLink(shortArray)).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/shareLink.test.ts`
Expected: FAIL with "Cannot find module './shareLink'".

- [ ] **Step 3: Create `src/lib/shareLink.ts`**

```ts
import type { AxisId } from '../data/types'
import { axes } from '../data/axes'

export interface ShareableScores {
  t1Raw: Record<AxisId, number>
  t2Raw: Record<AxisId, number>
}

export function encodeShareLink(scores: ShareableScores): string {
  const orderedIds = axes.map((a) => a.id)
  const flat = [
    ...orderedIds.map((id) => scores.t1Raw[id]),
    ...orderedIds.map((id) => scores.t2Raw[id]),
  ]
  return btoa(JSON.stringify(flat))
}

export function decodeShareLink(encoded: string): ShareableScores | null {
  try {
    const flat: number[] = JSON.parse(atob(encoded))
    const orderedIds = axes.map((a) => a.id)
    if (!Array.isArray(flat) || flat.length !== orderedIds.length * 2) return null

    const t1Raw = {} as Record<AxisId, number>
    const t2Raw = {} as Record<AxisId, number>
    orderedIds.forEach((id, index) => {
      const t1Value = flat[index]
      const t2Value = flat[orderedIds.length + index]
      if (typeof t1Value !== 'number' || Number.isNaN(t1Value)) return
      if (typeof t2Value !== 'number' || Number.isNaN(t2Value)) return
      t1Raw[id] = t1Value
      t2Raw[id] = t2Value
    })

    if (Object.keys(t1Raw).length !== orderedIds.length) return null
    if (Object.keys(t2Raw).length !== orderedIds.length) return null
    return { t1Raw, t2Raw }
  } catch {
    return null
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/shareLink.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/shareLink.ts src/lib/shareLink.test.ts
git commit -m "feat: add shareable results link encode/decode"
```

---

### Task 17: Quiz answer state

**Files:**
- Create: `src/state/QuizContext.tsx`
- Create: `src/state/QuizContext.test.tsx`

**Interfaces:**
- Produces: `QuizProvider`, `useQuiz(): { answers: Record<number, number>; setAnswer(questionId: number, value: number): void; reset(): void }` — consumed by Tasks 19, 21, 22.

- [ ] **Step 1: Write the failing test `src/state/QuizContext.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuizProvider, useQuiz } from './QuizContext'

function TestConsumer() {
  const { answers, setAnswer, reset } = useQuiz()
  return (
    <div>
      <span data-testid="answer-1">{answers[1] ?? 'unset'}</span>
      <button onClick={() => setAnswer(1, 4)}>answer</button>
      <button onClick={reset}>reset</button>
    </div>
  )
}

describe('QuizContext', () => {
  it('starts with no answers, records an answer, and resets', () => {
    render(
      <QuizProvider>
        <TestConsumer />
      </QuizProvider>,
    )
    expect(screen.getByTestId('answer-1').textContent).toBe('unset')
    fireEvent.click(screen.getByText('answer'))
    expect(screen.getByTestId('answer-1').textContent).toBe('4')
    fireEvent.click(screen.getByText('reset'))
    expect(screen.getByTestId('answer-1').textContent).toBe('unset')
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
Expected: FAIL with "Cannot find module './QuizContext'".

- [ ] **Step 3: Create `src/state/QuizContext.tsx`**

```tsx
import { createContext, useContext, useReducer, type ReactNode } from 'react'

interface QuizState {
  answers: Record<number, number>
}

type QuizAction =
  | { type: 'ANSWER'; questionId: number; value: number }
  | { type: 'RESET' }

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'ANSWER':
      return { answers: { ...state.answers, [action.questionId]: action.value } }
    case 'RESET':
      return { answers: {} }
    default:
      return state
  }
}

interface QuizContextValue {
  answers: Record<number, number>
  setAnswer: (questionId: number, value: number) => void
  reset: () => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, { answers: {} })

  const value: QuizContextValue = {
    answers: state.answers,
    setAnswer: (questionId, val) => dispatch({ type: 'ANSWER', questionId, value: val }),
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
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/state/QuizContext.tsx src/state/QuizContext.test.tsx
git commit -m "feat: add in-memory quiz answer state"
```

---

### Task 18: Quiz UI primitives (LikertInput, ProgressBar)

**Files:**
- Create: `src/components/LikertInput.tsx`
- Create: `src/components/LikertInput.test.tsx`
- Create: `src/components/ProgressBar.tsx`
- Create: `src/components/ProgressBar.test.tsx`

**Interfaces:**
- Produces: `LikertInput({ questionId, value, onChange })`, `ProgressBar({ current, total, label })` — both consumed by Task 19.

- [ ] **Step 1: Write the failing test `src/components/LikertInput.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LikertInput } from './LikertInput'

describe('LikertInput', () => {
  it('renders all 5 options and marks the selected one as checked', () => {
    render(<LikertInput questionId={1} value={4} onChange={() => {}} />)
    expect(screen.getByRole('radio', { name: 'Agree' }).getAttribute('aria-checked')).toBe('true')
    expect(screen.getByRole('radio', { name: 'Disagree' }).getAttribute('aria-checked')).toBe('false')
  })

  it('calls onChange with the numeric value of the clicked option', () => {
    const onChange = vi.fn()
    render(<LikertInput questionId={1} value={undefined} onChange={onChange} />)
    fireEvent.click(screen.getByRole('radio', { name: 'Strongly Agree' }))
    expect(onChange).toHaveBeenCalledWith(5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/LikertInput.test.tsx`
Expected: FAIL with "Cannot find module './LikertInput'".

- [ ] **Step 3: Create `src/components/LikertInput.tsx`**

```tsx
interface LikertInputProps {
  questionId: number
  value: number | undefined
  onChange: (value: number) => void
}

const LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']

export function LikertInput({ questionId, value, onChange }: LikertInputProps) {
  return (
    <div role="radiogroup" aria-label={`Question ${questionId} answer`} className="flex flex-wrap gap-2">
      {LABELS.map((label, index) => {
        const optionValue = index + 1
        const isSelected = value === optionValue
        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(optionValue)}
            className={`rounded-full border px-3 py-1 text-sm ${
              isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/LikertInput.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the failing test `src/components/ProgressBar.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('renders the label and sets the correct percentage', () => {
    render(<ProgressBar current={3} total={8} label="Axis 3 of 8" />)
    expect(screen.getByText('Axis 3 of 8')).toBeInTheDocument()
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('38')
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/components/ProgressBar.test.tsx`
Expected: FAIL with "Cannot find module './ProgressBar'".

- [ ] **Step 7: Create `src/components/ProgressBar.tsx`**

```tsx
interface ProgressBarProps {
  current: number
  total: number
  label: string
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = Math.round((current / total) * 100)
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-600 transition-all"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/components/ProgressBar.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 9: Commit**

```bash
git add src/components/LikertInput.tsx src/components/LikertInput.test.tsx src/components/ProgressBar.tsx src/components/ProgressBar.test.tsx
git commit -m "feat: add Likert input and progress bar components"
```

---

### Task 19: AxisHorizonGroup and AxisPage

**Files:**
- Create: `src/components/AxisHorizonGroup.tsx`
- Create: `src/components/AxisHorizonGroup.test.tsx`
- Create: `src/pages/AxisPage.tsx`
- Create: `src/pages/AxisPage.test.tsx`

**Interfaces:**
- Consumes: `LikertInput` (Task 18), `ProgressBar` (Task 18), `axes`/`questionsForAxis` (Tasks 2, 11), `useQuiz` (Task 17).
- Produces: `AxisHorizonGroup({ title, questions, answers, onAnswer })`, `AxisPage` (routed at `/quiz/:axisIndex`, reads route param, navigates via `useNavigate`) — `AxisPage` consumed by Task 22's routing.

- [ ] **Step 1: Write the failing test `src/components/AxisHorizonGroup.test.tsx`**

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AxisHorizonGroup } from './AxisHorizonGroup'
import type { Question } from '../data/types'

const sampleQuestions: Question[] = [
  { id: 1, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'A', statement: 'Sample statement one.' },
  { id: 2, axisId: 'teleological', horizon: 'T1', agreeShiftsToward: 'B', statement: 'Sample statement two.' },
]

describe('AxisHorizonGroup', () => {
  it('renders every question statement with its own Likert input', () => {
    render(<AxisHorizonGroup title="Right Now" questions={sampleQuestions} answers={{}} onAnswer={() => {}} />)
    expect(screen.getByText('Right Now')).toBeInTheDocument()
    expect(screen.getByText('Sample statement one.')).toBeInTheDocument()
    expect(screen.getByText('Sample statement two.')).toBeInTheDocument()
  })

  it('calls onAnswer with the question id and chosen value', () => {
    const onAnswer = vi.fn()
    render(<AxisHorizonGroup title="Right Now" questions={sampleQuestions} answers={{}} onAnswer={onAnswer} />)
    const radios = screen.getAllByRole('radio', { name: 'Agree' })
    fireEvent.click(radios[0])
    expect(onAnswer).toHaveBeenCalledWith(1, 4)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/AxisHorizonGroup.test.tsx`
Expected: FAIL with "Cannot find module './AxisHorizonGroup'".

- [ ] **Step 3: Create `src/components/AxisHorizonGroup.tsx`**

```tsx
import type { Question } from '../data/types'
import { LikertInput } from './LikertInput'

interface AxisHorizonGroupProps {
  title: string
  questions: Question[]
  answers: Record<number, number>
  onAnswer: (questionId: number, value: number) => void
}

export function AxisHorizonGroup({ title, questions, answers, onAnswer }: AxisHorizonGroupProps) {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-5">
        {questions.map((question) => (
          <li key={question.id}>
            <p className="mb-2">{question.statement}</p>
            <LikertInput
              questionId={question.id}
              value={answers[question.id]}
              onChange={(value) => onAnswer(question.id, value)}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/AxisHorizonGroup.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Write the failing test `src/pages/AxisPage.test.tsx`**

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
          <Route path="/results" element={<p>Results Page</p>} />
          <Route path="/" element={<p>Intro Page</p>} />
        </Routes>
      </MemoryRouter>
    </QuizProvider>,
  )
}

describe('AxisPage', () => {
  it('shows the axis name and both pole labels', () => {
    renderAxisPage(1)
    expect(screen.getByText('Teleological')).toBeInTheDocument()
    expect(screen.getByText('Cosmic Vitalism vs. Anthropocentric Humanism')).toBeInTheDocument()
  })

  it('disables Next until all 14 questions on the page are answered', () => {
    renderAxisPage(1)
    const nextButton = screen.getByRole('button', { name: 'Next' })
    expect(nextButton).toBeDisabled()
    const stronglyAgreeRadios = screen.getAllByRole('radio', { name: 'Strongly Agree' })
    expect(stronglyAgreeRadios).toHaveLength(14)
    stronglyAgreeRadios.forEach((radio) => fireEvent.click(radio))
    expect(nextButton).not.toBeDisabled()
  })

  it('navigates to /results when Next is clicked from axis 8', () => {
    renderAxisPage(8)
    screen.getAllByRole('radio', { name: 'Strongly Agree' }).forEach((radio) => fireEvent.click(radio))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Results Page')).toBeInTheDocument()
  })

  it('navigates to / when Back is clicked from axis 1', () => {
    renderAxisPage(1)
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))
    expect(screen.getByText('Intro Page')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run src/pages/AxisPage.test.tsx`
Expected: FAIL with "Cannot find module './AxisPage'".

- [ ] **Step 7: Create `src/pages/AxisPage.tsx`**

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
  const { answers, setAnswer } = useQuiz()

  const index = Number(axisIndex)
  const axis = axes.find((a) => a.number === index)

  if (!axis) {
    return <p>Unknown axis.</p>
  }

  const allQuestions = questionsForAxis(axis.id)
  const t1Questions = allQuestions.filter((q) => q.horizon === 'T1')
  const t2Questions = allQuestions.filter((q) => q.horizon === 'T2')
  const allAnswered = allQuestions.every((q) => answers[q.id] !== undefined)

  function goNext() {
    if (index === 8) {
      navigate('/results')
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
      <h2 className="text-2xl font-bold mt-4 mb-1">{axis.name}</h2>
      <p className="text-gray-600 mb-6">
        {axis.poleA} vs. {axis.poleB}
      </p>
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

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run src/pages/AxisPage.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 9: Commit**

```bash
git add src/components/AxisHorizonGroup.tsx src/components/AxisHorizonGroup.test.tsx src/pages/AxisPage.tsx src/pages/AxisPage.test.tsx
git commit -m "feat: add axis question page with navigation"
```

---

### Task 20: Results visualizations (RadarChart, ProfileCard)

**Files:**
- Create: `src/components/RadarChart.tsx`
- Create: `src/components/RadarChart.test.tsx`
- Create: `src/components/ProfileCard.tsx`
- Create: `src/components/ProfileCard.test.tsx`
- Modify: `src/setupTests.ts`

**Interfaces:**
- Consumes: `axes` (Task 2), `AxisVector`/`ProfileMatch` types (Task 15).
- Produces: `RadarChart({ combined })`, `ProfileCard({ match, rank })` — both consumed by Task 21.

- [ ] **Step 1: Modify `src/setupTests.ts` to polyfill `ResizeObserver` for Recharts**

Recharts' `ResponsiveContainer` requires `ResizeObserver`, which jsdom does not implement. Full new file content:

```ts
import '@testing-library/jest-dom'

if (typeof ResizeObserver === 'undefined') {
  ;(globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
```

- [ ] **Step 2: Write the failing test `src/components/RadarChart.test.tsx`**

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { RadarChart } from './RadarChart'
import type { AxisVector } from '../lib/scoring'

const sample: AxisVector = {
  teleological: 5, risk: -3, socioEconomic: 2, ontological: 0,
  legalMoral: -1, evolutionary: 4, relational: -2, geopolitical: 1,
}

describe('RadarChart', () => {
  it('renders an svg chart without crashing', () => {
    const { container } = render(<RadarChart combined={sample} />)
    expect(container.querySelector('svg')).not.toBeNull()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/RadarChart.test.tsx`
Expected: FAIL with "Cannot find module './RadarChart'".

- [ ] **Step 4: Create `src/components/RadarChart.tsx`**

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
}

export function RadarChart({ combined }: RadarChartProps) {
  const data = axes.map((axis) => ({
    axis: axis.name,
    value: combined[axis.id],
  }))

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <RechartsRadarChart data={data} outerRadius="70%">
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" />
          <PolarRadiusAxis domain={[-10, 10]} />
          <Radar name="You" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/RadarChart.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 6: Write the failing test `src/components/ProfileCard.test.tsx`**

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
  it('shows the profile name, summary, rank, and rounded distance', () => {
    render(<ProfileCard match={match} rank={1} />)
    expect(screen.getByText('Doomer')).toBeInTheDocument()
    expect(screen.getByText('Believes advanced AI is likely to cause human extinction.')).toBeInTheDocument()
    expect(screen.getByText('Match #1')).toBeInTheDocument()
    expect(screen.getByText('Distance: 3.46')).toBeInTheDocument()
  })
})
```

- [ ] **Step 7: Run test to verify it fails**

Run: `npx vitest run src/components/ProfileCard.test.tsx`
Expected: FAIL with "Cannot find module './ProfileCard'".

- [ ] **Step 8: Create `src/components/ProfileCard.tsx`**

```tsx
import type { ProfileMatch } from '../lib/scoring'

interface ProfileCardProps {
  match: ProfileMatch
  rank: number
}

export function ProfileCard({ match, rank }: ProfileCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 mb-3">
      <p className="text-sm text-gray-500">Match #{rank}</p>
      <h3 className="text-xl font-semibold">{match.profile.name}</h3>
      <p className="text-gray-700 mt-1">{match.profile.summary}</p>
      <p className="text-sm text-gray-500 mt-2">Distance: {match.distance.toFixed(2)}</p>
    </div>
  )
}
```

- [ ] **Step 9: Run test to verify it passes**

Run: `npx vitest run src/components/ProfileCard.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 10: Commit**

```bash
git add src/setupTests.ts src/components/RadarChart.tsx src/components/RadarChart.test.tsx src/components/ProfileCard.tsx src/components/ProfileCard.test.tsx
git commit -m "feat: add radar chart and profile card components"
```

---

### Task 21: ResultsPage

**Files:**
- Create: `src/pages/ResultsPage.tsx`
- Create: `src/pages/ResultsPage.test.tsx`

**Interfaces:**
- Consumes: `axes` (Task 2), `questions` (Task 11), `profiles` (Task 12), `useQuiz` (Task 17), `computeRawAxisScores`/`scaleAxisScores`/`combineHorizons`/`classify` (Task 15), `encodeShareLink`/`decodeShareLink` (Task 16), `RadarChart`/`ProfileCard` (Task 20).
- Produces: `ResultsPage` — consumed by Task 22's routing.

- [ ] **Step 1: Write the failing test `src/pages/ResultsPage.test.tsx`**

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ResultsPage } from './ResultsPage'
import { QuizProvider } from '../state/QuizContext'
import { encodeShareLink, type ShareableScores } from '../lib/shareLink'
import { axes } from '../data/axes'

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
    expect(screen.getByText('Teleological')).toBeInTheDocument()
  })

  it('copies a shareable link to the clipboard when clicked', async () => {
    const encoded = encodeShareLink(buildFlatScores(0, 0))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Copy Shareable Link' }))
    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    expect(await screen.findByText('Link Copied!')).toBeInTheDocument()
  })

  it('resets answers and navigates to intro when Retake is clicked', () => {
    const encoded = encodeShareLink(buildFlatScores(0, 0))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Retake' }))
    expect(screen.getByText('Intro Page')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/ResultsPage.test.tsx`
Expected: FAIL with "Cannot find module './ResultsPage'".

- [ ] **Step 3: Create `src/pages/ResultsPage.tsx`**

```tsx
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { axes } from '../data/axes'
import { questions } from '../data/questions'
import { profiles } from '../data/profiles'
import { useQuiz } from '../state/QuizContext'
import {
  computeRawAxisScores,
  scaleAxisScores,
  combineHorizons,
  classify,
  type AxisVector,
} from '../lib/scoring'
import { encodeShareLink, decodeShareLink } from '../lib/shareLink'
import { RadarChart } from '../components/RadarChart'
import { ProfileCard } from '../components/ProfileCard'

export function ResultsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { answers, reset } = useQuiz()
  const [copied, setCopied] = useState(false)

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

  function handleShare() {
    const encoded = encodeShareLink({ t1Raw, t2Raw })
    const url = `${window.location.origin}/results?d=${encoded}`
    navigator.clipboard.writeText(url)
    setCopied(true)
  }

  function handleRetake() {
    reset()
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Results</h2>
      <RadarChart combined={combined} />

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

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={handleShare} className="px-4 py-2 rounded bg-blue-600 text-white">
          {copied ? 'Link Copied!' : 'Copy Shareable Link'}
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
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/pages/ResultsPage.tsx src/pages/ResultsPage.test.tsx
git commit -m "feat: add results page with radar chart, matches, and sharing"
```

---

### Task 22: IntroPage and full app routing

**Files:**
- Create: `src/pages/IntroPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes: `useQuiz` (Task 17), `QuizProvider` (Task 17), `AxisPage` (Task 19), `ResultsPage` (Task 21).
- Produces: the final routed `App` — wires `/`, `/quiz/:axisIndex`, `/results`.

- [ ] **Step 1: Create `src/pages/IntroPage.tsx`**

```tsx
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../state/QuizContext'

export function IntroPage() {
  const navigate = useNavigate()
  const { reset } = useQuiz()

  function handleStart() {
    reset()
    navigate('/quiz/1')
  }

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">TIAM-112 Diagnostic</h1>
      <p className="text-gray-700 mb-4">
        This is a 112-question survey about how you think AI development should go, both in the
        next few years and over the next fifty. It shows you where your views sit across eight
        different dimensions, and matches you to the closest of 24 named viewpoints.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        This is a self-reflection and discussion tool, not a validated scientific instrument.
        Treat your result as a conversation starter, not a diagnosis.
      </p>
      <button type="button" onClick={handleStart} className="px-6 py-3 rounded bg-blue-600 text-white text-lg">
        Start
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Write the failing test — replace `src/App.test.tsx` entirely**

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
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/App.test.tsx`
Expected: FAIL — the current placeholder `App` renders only a heading, so `screen.getByRole('button', { name: 'Start' })` throws "Unable to find role='button'".

- [ ] **Step 4: Replace `src/App.tsx` entirely**

```tsx
import { Routes, Route } from 'react-router-dom'
import { QuizProvider } from './state/QuizContext'
import { IntroPage } from './pages/IntroPage'
import { AxisPage } from './pages/AxisPage'
import { ResultsPage } from './pages/ResultsPage'

function App() {
  return (
    <QuizProvider>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/quiz/:axisIndex" element={<AxisPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </QuizProvider>
  )
}

export default App
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/App.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 6: Run the full test suite**

Run: `npm test`
Expected: all test files pass (Tasks 1-22 combined).

- [ ] **Step 7: Commit**

```bash
git add src/pages/IntroPage.tsx src/App.tsx src/App.test.tsx
git commit -m "feat: wire up intro page and full app routing"
```

---

## Self-Review Notes

- **Spec coverage:** Tech stack (Task 1), data model (Task 2), all 112 questions (Tasks 3-11), 24 profiles (Task 12), reading-level rule and its regression guard (Tasks 13-14), scoring/normalization/classification (Task 15), sharing (Task 16), quiz flow and navigation (Tasks 17-19, 22), results display and divergence table (Tasks 20-21) are each covered by a task above.
- **Known iteration point:** Task 14's readability enforcement test was authored against hand-simplified text, not run through the formula ahead of time — some individual statements may need a follow-up simplification pass to clear grade 10, as called out explicitly in that task's Step 2.
- **Type consistency checked:** `AxisVector`, `Answers`, `ProfileMatch`, `ShareableScores`, and `Question`/`Profile`/`Axis`/`AxisId` names and shapes are used identically across Tasks 2, 11, 12, 15, 16, 19, 20, and 21.
