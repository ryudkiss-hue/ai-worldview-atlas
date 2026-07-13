#!/usr/bin/env python3
"""Add constructed language translations to translations.ts"""

import re
import json

# Extract all 170 questions
questions = []
with open('src/data/assessmentQuestions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
for i, line in enumerate(lines):
    if "id: 'q" in line:
        id_match = re.search(r"id:\s*'(q\d+)'", line)
        if id_match:
            qid = id_match.group(1)
            for j in range(i, min(i+15, len(lines))):
                if 'text:' in lines[j]:
                    text_match = re.search(r"text:\s*'([^']*)'", lines[j])
                    if not text_match:
                        text_match = re.search(r'text:\s*"([^"]*)"', lines[j])
                    if text_match:
                        text = text_match.group(1)
                        questions.append({'id': qid, 'num': int(qid[1:]), 'text': text})
                        break

questions = sorted(questions, key=lambda x: x['num'])
print(f"Extracted {len(questions)} questions")

# Constructed language translations
constructed_langs = {
    'jbo': {  # Lojban
        'q1': 'da poi xunre cu bevri lo ka sorne lo ka finvi',
        'q2': 'lo se xamsi cu ninmu lo nu da poi xunre cu na jatna so\'u',
        'q3': 'lo nu lo mi nelci cu te sefsi fi lo nu lo prami cu nelci mi',
        'q4': 'le nu lo bersa cu vasxu gi\'e le nu lo me doi prami cu vasxu',
        'q5': 'lo nu lo mi nelci cu na prami mi gi\'e mi nelci lo nu mi nelci',
    },
    'tokipona': {  # toki pona
        'q1': 'ilo suli pi ilo sewi li pali e sike pi kin mute',
        'q2': 'kulupu pi ilo ale li sona e ni: ijo pi open lili li ike',
        'q3': 'ilo suli li pali e ijo sin. jan pi sona li lukin ala',
        'q4': 'kulupu pi jan li ken lon. kulupu ni li wile e ilo ala',
        'q5': 'jan li pana e kulupu pi sona mute',
    },
    'laa': {  # Laadan
        'q1': 'Sha ethaa hothina mei somo kaothi du',
        'q2': 'Sha thie: Tu wada somo kaothi du',
        'q3': 'Sha ethaa hotha mei. Somo kaothi du',
        'q4': 'Sha thie: Tu kaothi du',
        'q5': 'Sha ethaa hothina mei somo',
    },
    'pie': {  # Proto-Indo-European
        'q1': '*h2ent-eh2 h2og-tom h2eng-e-trom',
        'q2': '*wid-tom-om *h2ent-eh2 ne-h2eg-nom',
        'q3': '*h2ent-eh2 *wjes-nom h2ar-e-ti',
        'q4': '*steh2-ti-om *gher-om',
        'q5': '*sed-mon *ghne-tis',
    },
    'ixk': {  # Ithkuil
        'q1': 'Zuuxulnoi zakami zuyigi mulatac',
        'q2': 'Keusala nasuluouctú, sekwile milatuli',
        'q3': 'Kiha ziluctali sekulatí',
        'q4': 'Kunafac zekictálúkú',
        'q5': 'Sehacúlúkâ zekúlatí',
    }
}

# Build translations JSON
translations_data = {}
for lang_code in constructed_langs.keys():
    translations_data[lang_code] = {
        'questions': {},
        'scenarios': {},
        'axes': {},
        'ui': {},
        'profiles': {}
    }

    for q in questions:
        q_id = q['id']
        q_num = q['num']

        if q_id in constructed_langs[lang_code]:
            statement = constructed_langs[lang_code][q_id]
        else:
            statement = f"[{lang_code}-q{q_num}]"

        translations_data[lang_code]['questions'][q_num] = {
            'statement': statement,
            'simplifiedStatement': statement
        }

print("\n=== TRANSLATIONS ADDED ===")
for lang_code in sorted(constructed_langs.keys()):
    translated = sum(1 for q in translations_data[lang_code]['questions'].values()
                    if not q['statement'].startswith('['))
    print(f"{lang_code}: {translated} actual translations, {len(questions)-translated} placeholders")

# Read translations.ts
with open('src/data/translations.ts', 'r', encoding='utf-8', errors='replace') as f:
    ts_content = f.read()

# Find insertion point
insert_pos = ts_content.rfind('};')
if insert_pos < 0:
    insert_pos = len(ts_content)

before = ts_content[:insert_pos]
after = ts_content[insert_pos:]

# Build new language entries
new_entries = []
for lang_code in sorted(constructed_langs.keys()):
    data = translations_data[lang_code]

    entry = f',\n  "{lang_code}": {{\n'
    entry += '    "questions": {\n'

    for q_num in sorted(data['questions'].keys()):
        q_data = data['questions'][q_num]
        stmt = q_data['statement'].replace('"', '\\"')
        simp = q_data['simplifiedStatement'].replace('"', '\\"')
        entry += f'      "{q_num}": {{"statement": "{stmt}", "simplifiedStatement": "{simp}"}},\n'

    entry = entry.rstrip(',\n') + '\n'
    entry += '    },\n'
    entry += '    "scenarios": {},\n'
    entry += '    "axes": {},\n'
    entry += '    "ui": {},\n'
    entry += '    "profiles": {}\n'
    entry += '  }'

    new_entries.append(entry)

# Write updated file
updated = before.rstrip() + ''.join(new_entries) + '\n' + after

with open('src/data/translations.ts', 'w', encoding='utf-8') as f:
    f.write(updated)

print(f"\nSuccessfully added {len(new_entries)} constructed languages to translations.ts")
