const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/ryudk/Desktop/tiam-diagnostic/docs/manifesto/staged';
const files = fs.readdirSync(dir);

console.log(`Checking ${files.length} files...`);
const results = [];

for (const file of files) {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Look for occurrences of "We " vs "The [Archetype] " or similar in the first 1500 chars
  const sample = content.substring(0, 1500);
  const weCount = (sample.match(/\b(we|our|us)\b/ig) || []).length;
  const thirdCount = (sample.match(/\b(the archetype|the advocate|the critic|the scholar|the specialist|the watchdog|the romantic|the steward|the researcher|the optimist|the gradualist|the hawk|the doomer|the maximalist)\b/ig) || []).length;
  
  let voice = 'unknown';
  if (weCount > 7 && thirdCount < 3) {
    voice = 'first-person';
  } else if (thirdCount > 3 || weCount < 5) {
    voice = 'third-person';
  }
  
  results.push({ file, weCount, thirdCount, voice });
}

console.log(JSON.stringify(results, null, 2));
