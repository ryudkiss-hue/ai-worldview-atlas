#!/usr/bin/env python3
import json
import re

print("Integrating thought experiments into translations.ts (proper JSON handling)...\n")

# Load thought experiments
with open('thought_experiments_translated.json', 'r', encoding='utf-8') as f:
    experiments = json.load(f)

# Read translations.ts
with open('src/data/translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the JSON part (after '= {' and before the final '}' or '};')
export_start = content.find('export const translations: Record<SupportedLanguage, LanguageTranslation> = {')
if export_start == -1:
    print("ERROR: Could not find export statement")
    exit(1)

json_start = content.find('{', export_start)
json_end = content.rfind('}')  # Find last closing brace

if json_start == -1 or json_end == -1:
    print("ERROR: Could not find JSON delimiters")
    exit(1)

# Get header and footer
header = content[:json_start + 1]  # Include opening {
footer = content[json_end + 1:]    # Everything after closing brace

# Extract and parse JSON
json_str = content[json_start:json_end + 1]
try:
    translations = json.loads(json_str)
    print(f"Loaded {len(translations)} languages from translations.ts")
except json.JSONDecodeError as e:
    print(f"ERROR parsing JSON: {e}")
    exit(1)

# Languages to update
langs_to_update = ['ar', 'bn', 'cs', 'de', 'en', 'es', 'fr', 'he', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ro', 'ru', 'sv', 'tr', 'vi']

added_count = 0
for lang in langs_to_update:
    if lang not in translations:
        print(f"  {lang}: language not found in translations")
        continue

    if 'questions' not in translations[lang]:
        print(f"  {lang}: no questions object")
        continue

    # Get experiments for this language
    exp_for_lang = experiments.get(lang, {})
    if not exp_for_lang:
        print(f"  {lang}: no experiments to add")
        continue

    # Add experiments
    for q_num_str, q_data in exp_for_lang.items():
        translations[lang]['questions'][q_num_str] = q_data
        added_count += 1

    print(f"  {lang}: added {len(exp_for_lang)} questions")

print(f"\nTotal questions added: {added_count}")

# Verify structure
print("\nVerifying language question counts...")
for lang in sorted(translations.keys()):
    q_count = len(translations[lang].get('questions', {}))
    print(f"  {lang}: {q_count} questions")

# Regenerate JSON
print("\nRegenerating JSON...")
new_json = json.dumps(translations, ensure_ascii=False, indent=2)

# Reconstruct file
new_content = header + new_json + footer

# Validate by parsing
try:
    test = json.loads(new_json)
    print("JSON validation: PASS")
except json.JSONDecodeError as e:
    print(f"JSON validation: FAIL - {e}")
    exit(1)

# Write back
with open('src/data/translations.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("\nIntegration complete!")
