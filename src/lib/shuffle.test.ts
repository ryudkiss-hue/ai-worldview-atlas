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
    expect(result).toEqual(['c', 'd', 'b', 'a', 'e'])
  })

  it('handles an empty array without throwing', () => {
    expect(shuffleArray([])).toEqual([])
  })
})
