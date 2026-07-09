import { axes } from '../data/axes'
import type { AxisVector } from './scoring'

export interface ShareCardData {
  archetypeName: string
  summary: string
  matchPercent: number
  combined: AxisVector
}

export const SHARE_CARD_WIDTH = 1200
export const SHARE_CARD_HEIGHT = 630

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ')
  let line = ''
  let currentY = y
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = word
      currentY += lineHeight
    } else {
      line = testLine
    }
  }
  if (line) {
    ctx.fillText(line, x, currentY)
    currentY += lineHeight
  }
  return currentY
}

/**
 * Pure drawing routine — takes an already-sized canvas context so it can be
 * unit-tested against a plain mock context object, without needing jsdom's
 * (largely unimplemented) real canvas support.
 */
export function drawShareCard(ctx: CanvasRenderingContext2D, data: ShareCardData): void {
  ctx.fillStyle = '#0f172a'
  ctx.fillRect(0, 0, SHARE_CARD_WIDTH, SHARE_CARD_HEIGHT)

  ctx.fillStyle = '#60a5fa'
  ctx.font = '600 26px system-ui, sans-serif'
  ctx.fillText('THE AI WORLDVIEW ATLAS', 60, 76)

  ctx.fillStyle = '#ffffff'
  ctx.font = '700 52px system-ui, sans-serif'
  const afterName = wrapText(ctx, data.archetypeName, 60, 150, SHARE_CARD_WIDTH - 500, 60)

  ctx.fillStyle = '#34d399'
  ctx.font = '600 28px system-ui, sans-serif'
  ctx.fillText(`${data.matchPercent}% match`, 60, afterName + 20)

  ctx.fillStyle = '#cbd5e1'
  ctx.font = '400 24px system-ui, sans-serif'
  wrapText(ctx, data.summary, 60, afterName + 70, SHARE_CARD_WIDTH - 500, 34)

  const chartX = SHARE_CARD_WIDTH - 400
  const chartY = 130
  const barHeight = 18
  const barGap = 14
  const barMaxWidth = 320
  const centerX = chartX + barMaxWidth / 2

  axes.forEach((axis, index) => {
    const y = chartY + index * (barHeight + barGap)
    const value = data.combined[axis.id]
    const halfWidth = (Math.abs(value) / 10) * (barMaxWidth / 2)

    ctx.fillStyle = '#94a3b8'
    ctx.font = '400 14px system-ui, sans-serif'
    ctx.fillText(axis.name, chartX, y - 4)

    ctx.fillStyle = '#334155'
    ctx.fillRect(chartX, y, barMaxWidth, barHeight)

    ctx.fillStyle = value >= 0 ? '#60a5fa' : '#f87171'
    if (value >= 0) {
      ctx.fillRect(centerX, y, halfWidth, barHeight)
    } else {
      ctx.fillRect(centerX - halfWidth, y, halfWidth, barHeight)
    }
  })

  ctx.fillStyle = '#64748b'
  ctx.font = '400 18px system-ui, sans-serif'
  ctx.fillText('A self-reflection tool, not a scientific instrument.', 60, SHARE_CARD_HEIGHT - 40)
}

/**
 * Orchestration: creates a canvas, draws the card, and resolves a PNG blob.
 * Returns null if canvas 2D context or toBlob support is unavailable.
 */
export async function renderShareCardToBlob(data: ShareCardData): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = SHARE_CARD_WIDTH
  canvas.height = SHARE_CARD_HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  drawShareCard(ctx, data)
  return new Promise((resolve) => {
    if (typeof canvas.toBlob !== 'function') {
      resolve(null)
      return
    }
    canvas.toBlob((blob) => resolve(blob), 'image/png')
  })
}
