#!/usr/bin/env python3
import json
import re

# Load rewritten experiments
with open('experiments_rewritten.json', 'r', encoding='utf-8') as f:
    rewritten = json.load(f)

# Read current file
with open('src/data/assessmentQuestions.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# For each experiment q148-q170, replace the text and simplified fields
# We'll use string replacement with careful pattern matching

for q_num in range(148, 171):
    q_str = str(q_num)

    if q_str not in rewritten:
        print(f"Skipping q{q_num} - not in rewritten")
        continue

    exp = rewritten[q_str]
    old_stmt = exp['statement']  # We don't know the old statement, so we'll find it
    new_stmt = exp['statement'].replace("\\", "\\\\").replace("'", "\\'")
    new_simp = exp['simplifiedStatement'].replace("\\", "\\\\").replace("'", "\\'")

    # Find the pattern: id: 'qNNN', ... text: '...' ... simplified: '...'
    # First, find the line with id: 'qNNN'
    id_line_pattern = rf"    id: 'q{q_num}',"

    if id_line_pattern not in content:
        print(f"Could not find id line for q{q_num}")
        continue

    # Find the index of this id line
    id_index = content.find(id_line_pattern)

    # Now find the next closing brace that ends this block
    # Look for }, after this position
    rest_of_content = content[id_index:]

    # Find text: '...' line  and simplified: '...' line
    lines_section = rest_of_content[:1000]  # Look ahead 1000 chars

    # Extract lines
    lines = lines_section.split('\n')
    text_line_idx = -1
    simp_line_idx = -1

    for i, line in enumerate(lines):
        if line.strip().startswith("text: '"):
            text_line_idx = i
        if line.strip().startswith("simplified: '"):
            simp_line_idx = i

    if text_line_idx == -1 or simp_line_idx == -1:
        print(f"Could not find text or simplified line for q{q_num}")
        continue

    # Extract the old text and simplified values
    text_line = lines[text_line_idx]
    simp_line = lines[simp_line_idx]

    # Parse out the quoted strings
    old_stmt_match = re.search(r"text: '(.*)',", text_line)
    old_simp_match = re.search(r"simplified: '(.*)',", simp_line)

    if not old_stmt_match or not old_simp_match:
        print(f"Could not parse text/simplified for q{q_num}")
        continue

    old_stmt_val = old_stmt_match.group(1)
    old_simp_val = old_simp_match.group(1)

    # Now replace in the original content
    old_text_line = f"    text: '{old_stmt_val}',"
    new_text_line = f"    text: '{new_stmt}',"

    if old_text_line in content:
        content = content.replace(old_text_line, new_text_line, 1)
        print(f"Updated text for q{q_num}")
    else:
        print(f"WARNING: Text line not found exactly for q{q_num}")

    old_simp_line = f"    simplified: '{old_simp_val}',"
    new_simp_line = f"    simplified: '{new_simp}',"

    if old_simp_line in content:
        content = content.replace(old_simp_line, new_simp_line, 1)
        print(f"Updated simplified for q{q_num}")
    else:
        print(f"WARNING: Simplified line not found exactly for q{q_num}")

# Write back
with open('src/data/assessmentQuestions.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nAll experiments updated!")
