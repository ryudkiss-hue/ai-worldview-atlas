import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MarkdownRenderer } from './MarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('renders headers at each level', () => {
    render(<MarkdownRenderer content={'# Title\n\n## Section\n\n### Subsection'} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Subsection' })).toBeInTheDocument()
  })

  it('renders an unordered list', () => {
    render(<MarkdownRenderer content={'- First\n- Second\n- Third'} />)
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('UL')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders an ordered list as a real <ol>, not plain paragraphs', () => {
    render(<MarkdownRenderer content={'1. First step\n2. Second step\n3. Third step'} />)
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('First step')
    // the literal "1." prefix should not leak into the rendered text
    expect(items[0]).not.toHaveTextContent('1.')
  })

  it('keeps an ordered list separate from a following unordered list', () => {
    render(<MarkdownRenderer content={'1. Ordered one\n2. Ordered two\n\n- Bulleted one\n- Bulleted two'} />)
    const lists = screen.getAllByRole('list')
    expect(lists).toHaveLength(2)
    expect(lists[0].tagName).toBe('OL')
    expect(lists[1].tagName).toBe('UL')
  })

  it('renders bold, italic, and inline code within a paragraph', () => {
    render(<MarkdownRenderer content={'A **bold** word, an *italic* word, and `some code`.'} />)
    expect(screen.getByText('bold').tagName).toBe('STRONG')
    expect(screen.getByText('italic').tagName).toBe('EM')
    expect(screen.getByText('some code').tagName).toBe('CODE')
  })

  it('renders a blockquote', () => {
    render(<MarkdownRenderer content={'> A quoted line'} />)
    expect(screen.getByText('A quoted line').closest('blockquote')).toBeInTheDocument()
  })

  it('renders a fenced code block verbatim', () => {
    render(<MarkdownRenderer content={'```\nconst x = 1\nconst y = 2\n```'} />)
    expect(screen.getByText(/const x = 1/)).toBeInTheDocument()
  })

  it('renders plain paragraphs for ordinary text', () => {
    render(<MarkdownRenderer content={'Just a sentence.'} />)
    expect(screen.getByText('Just a sentence.').tagName).toBe('P')
  })
})
