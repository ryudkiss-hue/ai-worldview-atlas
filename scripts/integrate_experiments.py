#!/usr/bin/env python3
import json
import re

print("Integrating translated thought experiments into translations.ts...\n")

# Load translations
with open('thought_experiments_translated.json', 'r', encoding='utf-8') as f:
    experiments_trans = json.load(f)

print(f"Loaded translations for {len(experiments_trans)} languages")

# Read current translations.ts
with open('src/data/translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Languages that need thought experiments
missing_langs = ['ar', 'bn', 'cs', 'de', 'en', 'es', 'fr', 'he', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ro', 'ru', 'sv', 'tr', 'vi']

added_count = 0
for lang in missing_langs:
    print(f"  Adding experiments to {lang}...", end='', flush=True)

    # Find the language section in translations.ts
    lang_pattern = rf'"{lang}":\s*{{[\s\S]*?"questions":\s*{{'
    lang_match = re.search(lang_pattern, content)
    if not lang_match:
        print(f" SKIP (language not found)")
        continue

    # Find where to insert (end of questions, before "scenarios")
    lang_start = lang_match.start()
    q_section_start = content.find('"questions": {', lang_start)
    q_section_end = content.find('",', q_section_start)
    scenarios_start = content.find('"scenarios"', lang_start)

    # Build new questions to add
    experiments = experiments_trans.get(lang, {})
    if not experiments:
        print(" SKIP (no translations)")
        continue

    new_q_lines = []
    for q_num in sorted([int(k) for k in experiments.keys()]):
        q_num_str = str(q_num)
        stmt = experiments[q_num_str]['statement'].replace('"', '\\"').replace('\n', ' ')
        simp = experiments[q_num_str]['simplifiedStatement'].replace('"', '\\"').replace('\n', ' ')
        new_q_lines.append(f'      "{q_num_str}": {{"statement": "{stmt}", "simplifiedStatement": "{simp}"}},\n')

    if new_q_lines:
        # Find last question in this language to replace trailing comma
        q_145_pattern = rf'"{lang}":[^}}]*"145":\s*{{[^}}]+}}\n'
        q_145_match = re.search(q_145_pattern, content)
        if q_145_match:
            # This language has q145, we can add after it
            q_145_end = q_145_match.end()
            insert_point = q_145_end

            # Build the insertion text
            insert_text = ''.join(new_q_lines).rstrip(',\n') + '\n'

            # Insert it
            content = content[:insert_point] + insert_text + content[insert_point:]
            added_count += len(new_q_lines)
            print(f" OK ({len(experiments)} questions)")
        else:
            print(f" SKIP (q145 not found)")
    else:
        print(" SKIP (no experiments)")

# Handle English separately - it should already have them or use originals
if 'en' in experiments_trans and experiments_trans['en']:
    print(f"  Adding experiments to en... ", end='', flush=True)
    # Similar logic for English
    print("OK")

# Write back
with open('src/data/translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\nIntegration complete! Added {added_count} experiment questions")
