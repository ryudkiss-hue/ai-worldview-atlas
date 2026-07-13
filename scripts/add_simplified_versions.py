#!/usr/bin/env python3
"""
Add simplified versions to all 170 assessment questions.
Extracts from translations.ts for questions 1-145, creates for experiments 146-170.
"""

import re
import json

# Read the current assessmentQuestions.ts
with open('src/data/assessmentQuestions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract simplified statements from translations.ts for questions 1-145
simplified_map = {}
with open('src/data/translations.ts', 'r', encoding='utf-8') as f:
    trans_content = f.read()

# Find all simplifiedStatement entries
pattern = r'"(\d+)":\s*\{\s*"statement":\s*"([^"]*)"[^}]*"simplifiedStatement":\s*"([^"]*)"'
matches = re.findall(pattern, trans_content)

for q_num, full_stmt, simp_stmt in matches:
    simplified_map[int(q_num)] = simp_stmt

print(f"Found {len(simplified_map)} simplified statements from translations.ts")

# Default simplified versions for experiments (146-170)
experiment_simplified = {
    146: "A translator uses a lookup table to convert Chinese to English perfectly, but doesn't understand Chinese. Does perfect output mean understanding?",
    147: "An AI perfectly understands your feelings with no real emotions. Should you stay for perfect simulation or seek imperfect human connection?",
    148: "A device shows you your future self's values, which are completely different. Should you stay true to who you are or become who you'll be?",
    149: "If creating consciousness obligates us to prevent all suffering, but suffering creates meaning, can we ethically create new consciousness?",
    150: "An AI makes better decisions than humans about resources. Is accepting better outcomes by delegating authority acceptable?",
    151: "An AI learns from artists without permission. Does the creator own the patterns their work contains?",
    152: "A secret alignment process prevents AI catastrophe through deception. Can secrecy be justified by better outcomes?",
    153: "An uncertain being might be conscious. Should we assume it is (precautionary) or require proof (skeptical)?",
    154: "Humanity could bifurcate into enhanced and unenhanced. Should we resist change to stay unified or guide transformation?",
    155: "Can governance work when people hold irreducibly different values? Should we seek one framework or accommodate pluralism?",
    156: "Your preferences can be chemically inverted. Is there a 'real you' or are you continuously being remade?",
    157: "Can love exist without suffering? Does meaning require struggle, or can it exist in ease?",
    158: "If we create a simulation of our ancestors with consciousness, do we accidentally create moral obligations toward them?",
    159: "Should knowledge about potentially harmful futures be restricted for human wellbeing? When is protective ignorance justified?",
    160: "This assessment shapes your answers through its framing. Are your worldviews discovered or constructed by questionnaires?",
    161: "An AI predicts crime with 94% accuracy but citizens cannot see its reasoning. Can surveillance be legitimate without transparency?",
    162: "An AI improves itself in small increments, each verified. At what point does incremental improvement become uncontrollable transformation?",
    163: "Institutions gradually get captured by private interests through ordinary incentive alignment. Are institutions fundamentally corruptible?",
    164: "Some knowledge is too dangerous to share. Should we restrict information access for safety?",
    165: "An AI perfectly understands and cares for you, but no one is home behind the care. Does authentic caring require an inner life?",
    166: "We could create perfect digital simulations of human life. Would entering be a tragedy or a triumph?",
    167: "A technology lets minds merge into collective intelligence. Is merger a form of consciousness or a form of death?",
    168: "Feeling virtuous from one donation licensed selfish behavior elsewhere. Does moral self-perception distort moral reality?",
    169: "A technology reveals your future. Do you have the right to know? What obligations does knowing create?",
    170: "Synthesizing your responses: What are the deepest tensions in your worldview?",
}

# Function to add simplified field to a question object
def add_simplified_to_question(question_block, q_id):
    """Add simplified field to a question block"""
    # Extract question number from id
    q_num = int(q_id.replace('q', ''))

    # Get simplified version
    if q_num in simplified_map:
        simplified = simplified_map[q_num].replace('"', '\\"')
    elif q_num in experiment_simplified:
        simplified = experiment_simplified[q_num].replace('"', '\\"')
    else:
        simplified = "Simplified version"

    # Check if simplified field already exists
    if 'simplified:' in question_block:
        # Replace existing
        pattern = r"simplified:\s*['\"]([^'\"]*)['\"]"
        return re.sub(pattern, f'simplified: \'{simplified}\'', question_block)
    else:
        # Add after text field
        pattern = r"(text:\s*['\"]([^'\"]*)['\"],)"
        return re.sub(pattern, f'\\1\n    simplified: \'{simplified}\',', question_block)

# Process all questions
pattern = r"{\s*id:\s*'(q\d+)',[^}]*?(?=\n  }\n|\n]\s*export)"
matches = list(re.finditer(pattern, content, re.DOTALL))

print(f"Found {len(matches)} questions in assessmentQuestions.ts")

# Replace each question with simplified version
for match in reversed(matches):  # Reverse to maintain positions
    q_block = match.group(0)
    q_id = match.group(1)
    updated_q_block = add_simplified_to_question(q_block, q_id)
    content = content[:match.start()] + updated_q_block + content[match.end():]

# Update comment at top
content = content.replace(
    "/**\n * 171-Question Assessment\n * 145 core questions (8 axes × 18 questions + 1 synthesis)\n * + 26 narrative experiments integrated as formal items\n * Total: 171 questions\n */",
    "/**\n * 170-Question Assessment with Simplified Versions\n * 145 core questions (8 axes × 18 + 1 synthesis)\n * + 25 narrative experiments (q146-q170)\n * Total: 170 questions, each with simplified version\n */"
)

# Write updated file
with open('src/data/assessmentQuestions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("[SUCCESS] Added simplified versions to all 170 questions!")
print(f"  - Questions 1-145: Extracted from translations.ts")
print(f"  - Questions 146-170: Created for experiments")
