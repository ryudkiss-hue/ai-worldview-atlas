import { describe, it, expect } from 'vitest'
import data from '../../paper/data.json'
import { questions } from './questions'
import { profiles } from './profiles'
import { axes } from './axes'
import { CORE_ARCHETYPES } from './coreThree'

// paper/build.py prints the booklet from this file. Regenerate it with: npx vite-node scripts/export_paper_data.ts
describe('paper booklet data', () => {
  it('matches the quiz statements, axes, archetypes and core-three text', () => {
    expect(data.items.map((i) => [i.id, i.statement, i.agreeShiftsToward])).toEqual(questions.map((q) => [q.id, q.statement, q.agreeShiftsToward]))
    expect(data.axes.map((a) => [a.id, a.name, a.question])).toEqual(axes.map((a) => [a.id, a.name, a.question]))
    expect(data.profiles.map((p) => [p.id, p.name, p.summary, p.coords])).toEqual(profiles.map((p) => [p.id, p.name, p.summary, p.coords]))
    expect(data.CORE_ARCHETYPES.map((a) => [a.name, a.tagline])).toEqual(CORE_ARCHETYPES.map((a) => [a.name, a.tagline]))
  })
})
