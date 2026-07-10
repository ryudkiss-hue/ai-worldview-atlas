function countSyllables(word) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '')
  if (cleaned.length === 0) return 0
  const vowelGroups = cleaned.match(/[aeiouy]+/g) ?? []
  let count = vowelGroups.length
  if (cleaned.endsWith('e') && !cleaned.endsWith('le') && count > 1) {
    count -= 1
  }
  return Math.max(count, 1)
}

function splitSentences(text) {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function splitWords(text) {
  return text
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z']/g, ''))
    .filter((w) => w.length > 0)
}

function fleschKincaidGrade(text) {
  const sentences = splitSentences(text)
  const words = splitWords(text)
  if (sentences.length === 0 || words.length === 0) return 0
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0)
  const wordsPerSentence = words.length / sentences.length
  const syllablesPerWord = syllables / words.length
  return 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59
}

const fs = require('fs')
const path = process.argv[2]
const data = JSON.parse(fs.readFileSync(path, 'utf8'))
const results = data.map((s) => ({ id: s.id, grade: Math.round(fleschKincaidGrade(s.summary) * 100) / 100, words: splitWords(s.summary).length, sentences: splitSentences(s.summary).length }))
console.log(JSON.stringify(results, null, 1))
