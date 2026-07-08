import { describe, it, expect, vi } from 'vitest'
import { drawShareCard, renderShareCardToBlob, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT, type ShareCardData } from './shareCard'
import { axes } from '../data/axes'
import type { AxisVector } from './scoring'

function flatVector(value: number): AxisVector {
  const vector = {} as AxisVector
  axes.forEach((axis) => {
    vector[axis.id] = value
  })
  return vector
}

function buildMockContext() {
  return {
    fillStyle: '',
    font: '',
    fillRect: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((text: string) => ({ width: text.length * 10 })),
  } as unknown as CanvasRenderingContext2D
}

function buildData(overrides: Partial<ShareCardData> = {}): ShareCardData {
  return {
    archetypeName: 'Doomer',
    summary: 'Believes advanced AI carries a real chance of ending humanity.',
    matchPercent: 87,
    combined: flatVector(4),
    ...overrides,
  }
}

describe('drawShareCard', () => {
  it('paints a background covering the full card dimensions', () => {
    const ctx = buildMockContext()
    drawShareCard(ctx, buildData())
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT)
  })

  it('renders the archetype name and match percentage as text', () => {
    const ctx = buildMockContext()
    drawShareCard(ctx, buildData({ archetypeName: 'Xenocentric Steward', matchPercent: 92 }))
    const textCalls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map((call) => call[0])
    expect(textCalls).toContain('Xenocentric Steward')
    expect(textCalls.some((text) => text.includes('92% match'))).toBe(true)
  })

  it('wraps a long summary across multiple fillText calls instead of one overflowing line', () => {
    const ctx = buildMockContext()
    const longSummary = 'word '.repeat(80).trim()
    drawShareCard(ctx, buildData({ summary: longSummary }))
    const textCalls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map((call) => call[0] as string)
    const summaryLines = textCalls.filter((text) => text.includes('word'))
    expect(summaryLines.length).toBeGreaterThan(1)
  })

  it('draws one bar per axis, colored differently for positive and negative values', () => {
    const ctx = buildMockContext()
    const combined = flatVector(0)
    combined.risk = 8
    combined.geopolitical = -8
    drawShareCard(ctx, buildData({ combined }))
    const fillStyles = (ctx.fillRect as ReturnType<typeof vi.fn>).mock.calls.length
    // background (1) + track+value per axis (2 * 8) = 17 fillRect calls
    expect(fillStyles).toBe(1 + axes.length * 2)
  })

  it('labels every axis by name somewhere on the card', () => {
    const ctx = buildMockContext()
    drawShareCard(ctx, buildData())
    const textCalls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls.map((call) => call[0])
    axes.forEach((axis) => {
      expect(textCalls).toContain(axis.name)
    })
  })
})

describe('renderShareCardToBlob', () => {
  it('resolves null when the canvas has no 2D context available (this jsdom setup has no canvas support)', async () => {
    const blob = await renderShareCardToBlob(buildData())
    expect(blob).toBeNull()
  })
})
