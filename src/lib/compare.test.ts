import { describe, it, expect } from 'vitest'
import { axes } from '../data/axes'
import { encodeShareLink } from './shareLink'
import { extractShareCode, resultFromShare, compareAxes, averageGap } from './compare'

const raw = (v: number) => Object.fromEntries(axes.map((a) => [a.id, v])) as Record<(typeof axes)[number]['id'], number>

describe('comparing two results', () => {
  it('reads a full link, a d= fragment or a bare code', () => {
    const code = encodeShareLink({ t1Raw: raw(4), t2Raw: raw(4) })
    expect(extractShareCode(`https://x.github.io/ai-worldview-atlas/#/results?d=${code}`)).toBe(code)
    expect(extractShareCode(`  ${code}  `)).toBe(code)
    expect(resultFromShare('not a link')).toBeNull()
  })

  it('rebuilds scores the way the results page does and measures the gap', () => {
    const a = resultFromShare(encodeShareLink({ t1Raw: raw(16), t2Raw: raw(20) }))!
    const b = resultFromShare(encodeShareLink({ t1Raw: raw(-16), t2Raw: raw(-20) }))!
    expect(a.combined.risk).toBe(10)
    expect(b.combined.risk).toBe(-10)
    const rows = compareAxes(a.combined, b.combined)
    expect(rows.every((r) => !r.sameSide && r.gap === 20)).toBe(true)
    expect(averageGap(rows)).toBe(20)
  })
})
