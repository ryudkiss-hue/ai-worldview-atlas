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

  it('renders the shadow side', () => {
    render(<ReportPreview content={content} />)
    expect(screen.getByText('Shadow Side')).toBeInTheDocument()
    expect(screen.getByText(content.shadowSide)).toBeInTheDocument()
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

  it('renders the commonly-confused-with archetype name and distinction', () => {
    render(<ReportPreview content={content} />)
    expect(screen.getByText(`${content.commonlyConfusedWith.profileName}.`)).toBeInTheDocument()
    expect(screen.getByText(content.commonlyConfusedWith.distinction)).toBeInTheDocument()
  })
})
