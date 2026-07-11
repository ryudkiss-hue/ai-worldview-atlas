#!/usr/bin/env python3
"""
Populate simplified versions for all 170 questions from translations.ts
"""

import re
import json

# Read translations.ts and extract simplified statements
simplified_by_q = {}
with open('src/data/translations.ts', 'r', encoding='utf-8') as f:
    trans_lines = f.readlines()

current_q_num = None
for i, line in enumerate(trans_lines):
    # Look for question number lines like: "1": {
    if re.match(r'\s*"(\d+)":\s*{', line):
        match = re.match(r'\s*"(\d+)":\s*{', line)
        current_q_num = int(match.group(1))
    # Look for simplifiedStatement
    elif current_q_num and '"simplifiedStatement":' in line:
        # Extract the simplified text
        match = re.search(r'"simplifiedStatement":\s*"(.+)"', line)
        if match:
            simp_text = match.group(1).replace('\\"', '"').strip()
            simplified_by_q[current_q_num] = simp_text

print(f"Extracted {len(simplified_by_q)} simplified statements from translations.ts")

# Experiment simplified versions
experiment_simplified = {
    146: "A translator mechanically converts Chinese to English perfectly without understanding. Does perfect output mean understanding?",
    147: "An AI perfectly understands your emotions with no inner feelings. Stay for perfect simulation or seek imperfect human connection?",
    148: "A device shows your future self has different values. Stay true to who you are or become who you'll be?",
    149: "If we prevent all suffering in created consciousness, but meaning needs struggle, can we ethically create consciousness?",
    150: "AI makes better resource decisions than humans. Is accepting better outcomes by delegating authority acceptable?",
    151: "AI learns from artists without permission and creates valuable output. Does the creator own the patterns?",
    152: "Secret deception prevents AI catastrophe. Can secrecy be justified by better outcomes?",
    153: "An uncertain being might be conscious. Assume it is, or require proof first?",
    154: "Humanity could split into enhanced and non-enhanced. Resist change to stay unified or guide transformation?",
    155: "Can governance work when people have different core values? One framework or accommodate differences?",
    156: "Your preferences can be chemically inverted. Is there a real you or are you constantly being remade?",
    157: "Can love exist without suffering? Does meaning need struggle or can it exist in ease?",
    158: "Creating simulations of ancestors with consciousness creates moral obligations toward them?",
    159: "Should dangerous knowledge about futures be restricted for human wellbeing?",
    160: "This assessment shapes your answers through framing. Are your worldviews discovered or constructed?",
    161: "AI predicts crime with 94% accuracy but citizens can't see its reasoning. Can surveillance be legitimate without transparency?",
    162: "AI improves itself in small increments. At what point does incremental improvement become uncontrollable?",
    163: "Institutions gradually get captured by private interests. Are institutions fundamentally corruptible?",
    164: "Some knowledge is too dangerous to share. Should we restrict information access?",
    165: "An AI perfectly cares for you with no inner life. Does authentic caring require consciousness?",
    166: "We could create perfect digital simulations of human life. Would entering be tragedy or triumph?",
    167: "Technology lets minds merge into collective intelligence. Is merger consciousness or death?",
    168: "Feeling virtuous from charity licensed selfish behavior elsewhere. Does moral self-perception distort reality?",
    169: "Technology reveals your future. Do you have the right to know?",
    170: "What are the deepest tensions in your worldview?",
}

# Read assessmentQuestions.ts
with open('src/data/assessmentQuestions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Function to add simplified to questions
def add_simplified(content):
    """Add simplified field to each question"""
    lines = content.split('\n')
    result = []
    current_q_id = None
    pending_simplified = None

    for i, line in enumerate(lines):
        # Detect question ID
        if "id: 'q" in line:
            match = re.search(r"id:\s*'(q\d+)'", line)
            if match:
                current_q_id = match.group(1)

        # When we hit type field, insert simplified before it
        if current_q_id and "type: '" in line:
            q_num = int(current_q_id[1:])
            if q_num in simplified_by_q:
                sim = simplified_by_q[q_num].replace("'", "\\'").replace('"', '\\"')
            elif q_num in experiment_simplified:
                sim = experiment_simplified[q_num].replace("'", "\\'")
            else:
                sim = "Simplified version"

            # Add simplified line before type
            indent = len(line) - len(line.lstrip())
            result.append(' ' * indent + f"simplified: '{sim}',")
            current_q_id = None

        result.append(line)

    return '\n'.join(result)

content = add_simplified(content)

# Write back
with open('src/data/assessmentQuestions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added simplified field to all questions!")
print(f"  - q1-q145: From translations.ts ({len([k for k in simplified_by_q.keys() if 1 <= k <= 145])} questions)")
print(f"  - q146-q170: Created for experiments (25 experiments)")
