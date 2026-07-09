import React from 'react'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple block-level markdown parser
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let currentList: React.ReactNode[] = []
  let currentOrderedList: React.ReactNode[] = []
  let inCodeBlock = false
  let codeBlockLines: string[] = []
  let inList = false
  let inOrderedList = false

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc list-inside space-y-2 my-4 text-gray-700 leading-relaxed">
          {currentList}
        </ul>
      )
      currentList = []
      inList = false
    }
  }

  const flushOrderedList = (key: number) => {
    if (currentOrderedList.length > 0) {
      elements.push(
        <ol key={`olist-${key}`} className="list-decimal list-inside space-y-2 my-4 text-gray-700 leading-relaxed">
          {currentOrderedList}
        </ol>
      )
      currentOrderedList = []
      inOrderedList = false
    }
  }

  const renderInlineText = (text: string) => {
    // Parse bold (**text**) and italic (*text*) and code (`code`)
    const parts: React.ReactNode[] = []
    let tempText = text

    // Simple replacement logic for rendering
    // We can use a regex to split by bold/italic/code tags
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g
    const splitParts = tempText.split(regex)

    return splitParts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic">{part.slice(1, -1)}</em>
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={idx} className="font-mono bg-gray-100 px-1 py-0.5 rounded text-sm text-red-600">{part.slice(1, -1)}</code>
      }
      if (part.startsWith('[') && part.includes('](')) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/)
        if (match) {
          return (
            <a key={idx} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {match[1]}
            </a>
          )
        }
      }
      return part
    })
  }

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]
    const trimmed = line.trim()

    // Code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <pre key={`code-${idx}`} className="font-mono bg-gray-50 border border-gray-200 p-4 rounded text-xs overflow-x-auto whitespace-pre my-4 shadow-inner text-gray-800">
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        )
        codeBlockLines = []
        inCodeBlock = false
      } else {
        flushList(idx)
        flushOrderedList(idx)
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      continue
    }

    // Headers
    if (trimmed.startsWith('# ')) {
      flushList(idx)
      flushOrderedList(idx)
      elements.push(
        <h1 key={`h1-${idx}`} className="text-3xl font-extrabold text-gray-900 border-b pb-2 mt-8 mb-4 tracking-tight">
          {renderInlineText(trimmed.slice(2))}
        </h1>
      )
      continue
    }
    if (trimmed.startsWith('## ')) {
      flushList(idx)
      flushOrderedList(idx)
      elements.push(
        <h2 key={`h2-${idx}`} className="text-2xl font-bold text-gray-800 mt-8 mb-4 border-l-4 border-blue-500 pl-3">
          {renderInlineText(trimmed.slice(3))}
        </h2>
      )
      continue
    }
    if (trimmed.startsWith('### ')) {
      flushList(idx)
      flushOrderedList(idx)
      elements.push(
        <h3 key={`h3-${idx}`} className="text-xl font-semibold text-gray-800 mt-6 mb-3">
          {renderInlineText(trimmed.slice(4))}
        </h3>
      )
      continue
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***') {
      flushList(idx)
      flushOrderedList(idx)
      elements.push(<hr key={`hr-${idx}`} className="my-8 border-gray-300" />)
      continue
    }

    // Ordered lists (e.g. "1. Item")
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
    if (orderedMatch) {
      flushList(idx)
      inOrderedList = true
      currentOrderedList.push(
        <li key={`oli-${idx}`} className="pl-1">
          {renderInlineText(orderedMatch[2])}
        </li>
      )
      continue
    }

    // Unordered lists
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      flushOrderedList(idx)
      inList = true
      currentList.push(
        <li key={`li-${idx}`} className="pl-1">
          {renderInlineText(trimmed.slice(2))}
        </li>
      )
      continue
    }

    // Empty lines
    if (trimmed === '') {
      flushList(idx)
      flushOrderedList(idx)
      continue
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList(idx)
      flushOrderedList(idx)
      elements.push(
        <blockquote key={`bq-${idx}`} className="border-l-4 border-gray-300 bg-gray-50 pl-4 py-2 my-4 italic text-gray-600">
          {renderInlineText(trimmed.slice(2))}
        </blockquote>
      )
      continue
    }

    // Paragraph
    if (inList) {
      // If we were in a list but this line doesn't start with a bullet point, flush it first
      flushList(idx)
    }
    if (inOrderedList) {
      flushOrderedList(idx)
    }

    elements.push(
      <p key={`p-${idx}`} className="text-gray-700 leading-relaxed my-4 text-justify">
        {renderInlineText(line)}
      </p>
    )
  }

  // Flush any final list
  flushList(lines.length)
  flushOrderedList(lines.length)

  return <div className="markdown-body text-base max-w-none">{elements}</div>
}
