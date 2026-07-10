const fs = require('fs')
const src = fs.readFileSync(process.argv[2], 'utf8')
const lines = src.split('\n')
const out = []
for (const line of lines) {
  const idMatch = line.match(/id:\s*'([^']+)'/)
  if (!idMatch) continue
  const summaryMatch = line.match(/summary:\s*(".*?"|'.*?')\s*}/)
  if (!summaryMatch) continue
  let raw = summaryMatch[1]
  // strip quotes
  const quote = raw[0]
  raw = raw.slice(1, -1)
  if (quote === '"') {
    raw = raw.replace(/\\"/g, '"')
  } else {
    raw = raw.replace(/\\'/g, "'")
  }
  out.push({ id: idMatch[1], summary: raw })
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1))
console.log('extracted', out.length)
