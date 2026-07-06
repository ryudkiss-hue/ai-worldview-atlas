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
