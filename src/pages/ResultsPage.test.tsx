import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { ResultsPage } from './ResultsPage'
import { QuizProvider, useQuiz } from '../state/QuizContext'
import { encodeShareLink, decodeShareLink, type ShareableScores } from '../lib/shareLink'
import { recordResult } from '../lib/resultHistory'
import { axes } from '../data/axes'
import { questions } from '../data/questions'

// PDF generation itself is covered by pdfReport.test.tsx against a small fixture.
// Here we only care about the loading-state UX, so the actual (CPU-heavy, and
// growing as more profile content is added) rendering work is mocked out —
// otherwise this test's runtime tracks production content size instead of
// testing button-state behavior. toBlobMock is individually overridable per
// test (e.g. mockRejectedValueOnce) to exercise the failure path.
const { toBlobMock } = vi.hoisted(() => ({
  toBlobMock: vi.fn(async () => new Blob(['mock-pdf'], { type: 'application/pdf' })),
}))
vi.mock('@react-pdf/renderer', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@react-pdf/renderer')>()
  return {
    ...actual,
    pdf: () => ({ toBlob: toBlobMock }),
  }
})

// jsdom has no real canvas support, so the share-image path is mocked the same
// way as the PDF path above — this file only tests button-state UX, not the
// actual pixel output (that's covered by shareCard.test.ts against a mock context).
const { renderShareCardToBlobMock } = vi.hoisted(() => ({
  renderShareCardToBlobMock: vi.fn(async (): Promise<Blob | null> => new Blob(['mock-png'], { type: 'image/png' })),
}))
vi.mock('../lib/shareCard', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/shareCard')>()
  return {
    ...actual,
    renderShareCardToBlob: renderShareCardToBlobMock,
  }
})

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
  URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url')
  URL.revokeObjectURL = vi.fn()
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  localStorage.clear()
})

describe('ResultsPage', () => {
  it('decodes a shared link and shows the top matches and a divergence table row per axis', () => {
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    expect(screen.getByText('Closest Worldview Matches')).toBeInTheDocument()
    const table = screen.getByRole('table')
    expect(within(table).getByText('Teleological')).toBeInTheDocument()
  })

  it('shows the match-closeness percentage on the top ProfileCard', () => {
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    expect(screen.getAllByText(/% match/).length).toBeGreaterThan(0)
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

  it('shows a loading state on Download Share Image while generating, then downloads it', async () => {
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Download Share Image' }))
    expect(screen.getByRole('button', { name: 'Generating...' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Download Share Image' })).toBeInTheDocument()
    expect(renderShareCardToBlobMock).toHaveBeenCalledWith(
      expect.objectContaining({ archetypeName: expect.any(String), matchPercent: expect.any(Number) }),
    )
  })

  it('shows a distinct failure state instead of a silent no-op when the share image fails to render', async () => {
    renderShareCardToBlobMock.mockRejectedValueOnce(new Error('canvas failed'))
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Download Share Image' }))
    expect(await screen.findByRole('button', { name: 'Download Failed — Try Again' })).toBeInTheDocument()
  })

  it('shows a distinct failure state when the share image renderer returns null (no canvas support)', async () => {
    renderShareCardToBlobMock.mockResolvedValueOnce(null)
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Download Share Image' }))
    expect(await screen.findByRole('button', { name: 'Download Failed — Try Again' })).toBeInTheDocument()
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

  it('reverts "Link Copied!" back to the default label after a few seconds', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const scores = buildFlatScores(3, -3)
    const encoded = encodeShareLink(scores)
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Copy Shareable Link' }))
    expect(await screen.findByText('Link Copied!')).toBeInTheDocument()
    await vi.advanceTimersByTimeAsync(2500)
    expect(screen.queryByText('Link Copied!')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy Shareable Link' })).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('shows a distinct failure state instead of a false "Link Copied!" when the clipboard write rejects', async () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    const encoded = encodeShareLink(buildFlatScores(3, -3))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Copy Shareable Link' }))
    expect(await screen.findByText('Copy Failed — Try Again')).toBeInTheDocument()
    expect(screen.queryByText('Link Copied!')).not.toBeInTheDocument()
  })

  it('resets answers and navigates to intro when Retake is clicked and confirmed', () => {
    const encoded = encodeShareLink(buildFlatScores(0, 0))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Retake' }))
    expect(window.confirm).toHaveBeenCalled()
    expect(screen.getByText('Intro Page')).toBeInTheDocument()
  })

  it('does nothing when the Retake confirmation is declined', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    const encoded = encodeShareLink(buildFlatScores(0, 0))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Retake' }))
    expect(screen.getByText('Closest Worldview Matches')).toBeInTheDocument()
    expect(screen.queryByText('Intro Page')).not.toBeInTheDocument()
  })

  it('shows a distinct failure state instead of a silent no-op when PDF generation throws', async () => {
    toBlobMock.mockRejectedValueOnce(new Error('render failed'))
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    fireEvent.click(screen.getByRole('button', { name: 'Download PDF Report' }))
    expect(await screen.findByRole('button', { name: 'Download Failed — Try Again' })).toBeInTheDocument()
  })

  it('shows a "no results yet" message instead of a fake neutral result when the quiz was never completed', () => {
    renderResultsPage('')
    expect(screen.getByText('No Results Yet')).toBeInTheDocument()
    expect(screen.queryByText('Closest Worldview Matches')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start the Assessment' })).toBeInTheDocument()
  })

  it('shows a "no strong view" summary, naming the axis it clustered on, when questions were declined', () => {
    function DeclineSeeder() {
      const { setAnswer, declineQuestion } = useQuiz()
      useEffect(() => {
        questions.slice(0, 6).forEach((q) => setAnswer(q.id, q.agreeShiftsToward === 'A' ? 3 : -3))
        const teleologicalQuestions = questions.filter((q) => q.axisId === 'teleological').slice(0, 2)
        teleologicalQuestions.forEach((q) => declineQuestion(q.id))
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      return <ResultsPage />
    }
    render(
      <QuizProvider>
        <MemoryRouter initialEntries={['/results']}>
          <Routes>
            <Route path="/results" element={<DeclineSeeder />} />
          </Routes>
        </MemoryRouter>
      </QuizProvider>,
    )
    expect(screen.getByText('No Strong View')).toBeInTheDocument()
    expect(screen.getByText(/marked 2 of 145 questions/)).toBeInTheDocument()
    expect(screen.getByText(/mostly on Teleological/)).toBeInTheDocument()
  })

  it('does not show a "no strong view" summary when viewing a shared link, even if the local quiz state has declines', () => {
    function DeclineSeederWithShare() {
      const { declineQuestion } = useQuiz()
      useEffect(() => {
        declineQuestion(questions[0].id)
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
      return <ResultsPage />
    }
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    render(
      <QuizProvider>
        <MemoryRouter initialEntries={[`/results?d=${encoded}`]}>
          <Routes>
            <Route path="/results" element={<DeclineSeederWithShare />} />
          </Routes>
        </MemoryRouter>
      </QuizProvider>,
    )
    expect(screen.queryByText('No Strong View')).not.toBeInTheDocument()
  })

  it('shows a comparison to a prior recorded result, naming whether the top match changed', () => {
    recordResult(
      {
        t1Raw: (() => {
          const v = {} as ShareableScores['t1Raw']
          axes.forEach((a) => { v[a.id] = 0 })
          return v
        })(),
        t2Raw: (() => {
          const v = {} as ShareableScores['t2Raw']
          axes.forEach((a) => { v[a.id] = 0 })
          return v
        })(),
        topMatchId: 'cosmic-vitalist-mystic',
        topMatchName: 'Cosmic Vitalist Mystic',
      },
      Date.now() - 1000,
    )
    function AnswerSeeder() {
      const { setAnswer } = useQuiz()
      useEffect(() => {
        questions.slice(0, 6).forEach((q) => setAnswer(q.id, q.agreeShiftsToward === 'A' ? 5 : 1))
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
    // A lightly-answered quiz (6 of 145 questions) lands near Pragmatic Centrist, virtually
    // never the extreme Cosmic Vitalist Mystic corner seeded as the prior result — so this
    // reliably exercises the "top match changed" branch without over-specifying classify()'s
    // exact output.
    const heading = screen.getByText('Compared to Your Last Attempt')
    const comparisonSection = heading.closest('div') as HTMLElement
    expect(within(comparisonSection).getByText('Cosmic Vitalist Mystic')).toBeInTheDocument()
    expect(within(comparisonSection).getByText(/This time it's/)).toBeInTheDocument()
  })

  it('does not show a comparison section on someone\'s very first completed result', () => {
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
    expect(screen.queryByText('Compared to Your Last Attempt')).not.toBeInTheDocument()
  })

  it('does not show a comparison section when viewing a shared link, even if local history exists', () => {
    recordResult(
      {
        t1Raw: (() => {
          const v = {} as ShareableScores['t1Raw']
          axes.forEach((a) => { v[a.id] = 0 })
          return v
        })(),
        t2Raw: (() => {
          const v = {} as ShareableScores['t2Raw']
          axes.forEach((a) => { v[a.id] = 0 })
          return v
        })(),
        topMatchId: 'pragmatic-centrist',
        topMatchName: 'Pragmatic Centrist',
      },
      Date.now() - 1000,
    )
    const encoded = encodeShareLink(buildFlatScores(7, -7))
    renderResultsPage(`?d=${encoded}`)
    expect(screen.queryByText('Compared to Your Last Attempt')).not.toBeInTheDocument()
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
    expect(screen.getByText('Closest Worldview Matches')).toBeInTheDocument()
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('row').length).toBe(axes.length + 1)
  })
})
