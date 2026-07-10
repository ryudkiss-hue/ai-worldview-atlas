import os
import re
import json
import time
from deep_translator import GoogleTranslator

# Input directories and files
QUESTIONS_DIR = "src/data/questions"
SCENARIOS_FILE = "src/data/scenarios.ts"
AXES_FILE = "src/data/axes.ts"
PROFILES_FILE = "src/data/profiles.ts"
OUTPUT_FILE = "src/data/translations.ts"

UI_STRINGS = {
    "strongly_disagree": "Strongly Disagree",
    "disagree": "Disagree",
    "neutral": "Neutral",
    "agree": "Agree",
    "strongly_agree": "Strongly Agree",
    "simple_reading": "Simple Reading (6th-8th Grade)",
    "voice_settings": "Voice Settings",
    "next": "Next",
    "back": "Back",
    "decline_question": "Decline Question",
    "decline_unselected": "I don't have a strong view on this",
    "decline_selected": "I don't have a strong view on this (selected)",
    "start_assessment": "Start the Assessment",
    "worldview_atlas": "AI Worldview Atlas",
    "intro_title": "The AI Worldview Atlas",
    "intro_subtitle": "This is a 145-question survey about how you think AI development should go. It shows you where your views sit across eight different dimensions, and matches you to the closest of 50 named viewpoints.",
    "intro_notice": "About 19-25 minutes, 145 questions. Your answers aren't saved if you refresh mid-quiz — only a finished result can be shared via link.",
    "start": "Start",
    "finish": "Finish",
    "close": "Close",
    "results_title": "Your Results",
    "results_subtitle": "Calculated across 8 architectural axis coordinates",
    "no_results_yet": "No Results Yet",
    "no_results_desc": "You haven't completed the assessment yet, so there's nothing to show here. Start from the beginning to get your results.",
    "scenario_title": "One More Thing (Optional)",
    "scenario_subtitle": "Eight quick gut-check questions. These don't change your score — they're just here to compare against it.",
    "skip_scenarios": "Skip for now",
    "see_results": "See My Results",
    "clear_cache": "Clear Local Audio Cache",
    "clear_cache_desc": "Clears browser cached speech files.",
    "loading_audio": "Generating...",
    "read_aloud": "Read question aloud",
    "download_report": "Download PDF Report",
    "download_image": "Download Share Image",
    "share_link": "Copy Shareable Link",
    "link_copied": "Link Copied!",
    "divergence_table": "Divergence from Archetypes",
    "closest_archetype": "Closest Worldview Matches",
    "axis": "Axis",
    "question": "Question",
    "retake": "Retake",
    "match_rank": "Match",
    "match_closeness": "match",
    "distance": "Distance",
    "axis_comparison": "Near-Term vs. Long-Term, by Axis",
    "right_now": "Right Now",
    "looking_ahead": "Looking Ahead",
    "view_report_manifesto": "View Report & Manifesto",
    "summary_report": "Summary Report",
    "full_manifesto": "Full Worldview Manifesto",
    "horizon_t1": "Right Now (Next 2-5 Years)",
    "horizon_t2": "Looking Ahead (20-50 Years)",
    "start_assessment": "Start the Assessment",
}


def clean_escapes(text):
    # Unescape escaped single quotes or double quotes
    return text.replace("\\'", "'").replace('\\"', '"')

def load_questions():
    questions = []
    # 1. Parse standard question files
    files = [f for f in os.listdir(QUESTIONS_DIR) if f.endswith(".ts") and f != "index.ts" and f != "simplifiedQuestions.ts"]
    for file in files:
        filepath = os.path.join(QUESTIONS_DIR, file)
        content = open(filepath, "r", encoding="utf-8").read()
        
        # Extract array block
        array_match = re.search(r'export const \w+Questions:\s*Question\[\]\s*=\s*\[(.*?)\]', content, re.DOTALL)
        if not array_match:
            continue
        array_content = array_match.group(1)
        
        pattern = r'id:\s*(\d+),\s*axisId:\s*\'(\w+)\',\s*horizon:\s*\'(\w+)\',\s*agreeShiftsToward:\s*\'([AB])\',\s*statement:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\')'
        matches = re.findall(pattern, array_content)
        for m in matches:
            qid = int(m[0])
            axis = m[1]
            horizon = m[2]
            stmt = clean_escapes(m[4] if m[4] else m[5])
            questions.append({
                "id": qid,
                "axisId": axis,
                "horizon": horizon,
                "statement": stmt
            })
            
    # 2. Parse simplified questions
    simp_filepath = os.path.join(QUESTIONS_DIR, "simplifiedQuestions.ts")
    simp_content = open(simp_filepath, "r", encoding="utf-8").read()
    
    dict_match = re.search(r'export const simplifiedQuestions:\s*Record<number,\s*string>\s*=\s*\{(.*?)\}', simp_content, re.DOTALL)
    if dict_match:
        simp_content = dict_match.group(1)
        
    simp_pattern = r'(\d+):\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\')'
    simp_matches = re.findall(simp_pattern, simp_content)
    simp_map = {}
    for m in simp_matches:
        qid = int(m[0])
        stmt = clean_escapes(m[1] if m[1] else m[2])
        simp_map[qid] = stmt
        
    for q in questions:
        q["simplifiedStatement"] = simp_map.get(q["id"], q["statement"])
        
    # Sort by ID
    questions.sort(key=lambda x: x["id"])
    return questions

def load_scenarios():
    scenarios = []
    content = open(SCENARIOS_FILE, "r", encoding="utf-8").read()
    
    array_match = re.search(r'export const scenarios:\s*Scenario\[\]\s*=\s*\[(.*?)\]', content, re.DOTALL)
    if not array_match:
        return scenarios
    array_content = array_match.group(1)
    
    pattern = r'axisId:\s*\'(\w+)\',\s*prompt:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'),\s*optionA:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'),\s*optionB:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\')'
    matches = re.findall(pattern, array_content)
    for m in matches:
        axis = m[0]
        prompt = clean_escapes(m[1] if m[1] else m[2])
        optA = clean_escapes(m[3] if m[3] else m[4])
        optB = clean_escapes(m[5] if m[5] else m[6])
        scenarios.append({
            "axisId": axis,
            "prompt": prompt,
            "optionA": optA,
            "optionB": optB
        })
    return scenarios

def load_axes():
    axes = []
    content = open(AXES_FILE, "r", encoding="utf-8").read()
    
    array_match = re.search(r'export const axes:\s*Axis\[\]\s*=\s*\[(.*?)\]', content, re.DOTALL)
    if not array_match:
        return axes
    array_content = array_match.group(1)
    
    pattern = r'id:\s*\'(\w+)\',\s*number:\s*\d+,\s*name:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'),\s*poleA:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'),\s*poleB:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\')'
    matches = re.findall(pattern, array_content)
    for m in matches:
        axis_id = m[0]
        name = clean_escapes(m[1] if m[1] else m[2])
        poleA = clean_escapes(m[3] if m[3] else m[4])
        poleB = clean_escapes(m[5] if m[5] else m[6])
        axes.append({
            "id": axis_id,
            "name": name,
            "poleA": poleA,
            "poleB": poleB
        })
    return axes

def load_profiles():
    profiles = []
    content = open(PROFILES_FILE, "r", encoding="utf-8").read()
    
    array_match = re.search(r'export const profiles:\s*Profile\[\]\s*=\s*\[(.*?)\]', content, re.DOTALL)
    if not array_match:
        return profiles
    array_content = array_match.group(1)
    
    pattern = r'id:\s*\'([\w-]+)\',\s*name:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\'),\s*coords:\s*\{[^}]*\},\s*summary:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\')'
    matches = re.findall(pattern, array_content)
    for m in matches:
        pid = m[0]
        name = clean_escapes(m[1] if m[1] else m[2])
        summary = clean_escapes(m[3] if m[3] else m[4])
        profiles.append({
            "id": pid,
            "name": name,
            "summary": summary
        })
    return profiles

def translate_list(texts, target_lang):
    if not texts:
        return []
    
    batches = []
    current_batch = []
    current_length = 0
    
    for text in texts:
        if current_length + len(text) + 5 > 4000:
            batches.append(current_batch)
            current_batch = [text]
            current_length = len(text)
        else:
            current_batch.append(text)
            current_length += len(text) + 5
            
    if current_batch:
        batches.append(current_batch)
        
    translated_texts = []
    lang_map = {"zh": "zh-CN"}
    actual_target = lang_map.get(target_lang, target_lang)
    translator = GoogleTranslator(source='en', target=actual_target)
    
    for i, batch in enumerate(batches):
        combined = " ||| ".join(batch)
        try:
            print(f"Translating batch {i+1}/{len(batches)} ({len(batch)} items) to {target_lang}...")
            translated_combined = translator.translate(combined)
            parts = [p.strip() for p in translated_combined.split("|||")]
            
            clean_parts = []
            for p in parts:
                p_clean = p.replace("|| |", "").replace("| ||", "").replace("|||", "").strip()
                if p_clean:
                    clean_parts.append(p_clean)
            
            if len(clean_parts) != len(batch):
                regex_parts = re.split(r'\s*\|\|\s*\|\s*', translated_combined)
                clean_parts = [r.strip() for r in regex_parts if r.strip()]
                
            if len(clean_parts) != len(batch):
                print(f"Warning: Batch count mismatch. Expected {len(batch)}, got {len(clean_parts)}. Translating items individually...")
                clean_parts = []
                for item in batch:
                    clean_parts.append(translator.translate(item))
                    time.sleep(0.02)
            translated_texts.extend(clean_parts)
            time.sleep(0.1)
        except Exception as e:
            print(f"Error: {e}. Translating items individually...")
            clean_parts = []
            for item in batch:
                try:
                    clean_parts.append(translator.translate(item))
                except Exception as inner_e:
                    print(f"Failed to translate '{item}': {inner_e}")
                    clean_parts.append(item)
                time.sleep(0.02)
            translated_texts.extend(clean_parts)
            
    return translated_texts

def main():
    print("--- Extracting Assessment Data ---")
    questions = load_questions()
    scenarios = load_scenarios()
    axes = load_axes()
    profiles = load_profiles()
    
    print(f"Extracted {len(questions)} questions.")
    print(f"Extracted {len(scenarios)} scenarios.")
    print(f"Extracted {len(axes)} axes.")
    print(f"Extracted {len(profiles)} profiles.")
    
    # Compile a flat list of strings to translate
    strings_to_translate = []
    
    # 1. Questions standard (index 0 to len(questions)-1)
    for q in questions:
        strings_to_translate.append(q["statement"])
    # 2. Questions simplified (index len(questions) to 2*len(questions)-1)
    for q in questions:
        strings_to_translate.append(q["simplifiedStatement"])
    # 3. Scenarios: prompt, optionA, optionB
    scen_offset = len(strings_to_translate)
    for s in scenarios:
        strings_to_translate.append(s["prompt"])
        strings_to_translate.append(s["optionA"])
        strings_to_translate.append(s["optionB"])
    # 4. Axes: name, poleA, poleB
    axes_offset = len(strings_to_translate)
    for a in axes:
        strings_to_translate.append(a["name"])
        strings_to_translate.append(a["poleA"])
        strings_to_translate.append(a["poleB"])
    # 5. UI Strings
    ui_offset = len(strings_to_translate)
    ui_keys = list(UI_STRINGS.keys())
    for k in ui_keys:
        strings_to_translate.append(UI_STRINGS[k])
    # 6. Profiles: name, summary
    prof_offset = len(strings_to_translate)
    for p in profiles:
        strings_to_translate.append(p["name"])
        strings_to_translate.append(p["summary"])
        
    languages = ["es", "zh", "fr", "de"]
    translations = {}
    
    # Populate English as baseline
    translations["en"] = {
        "questions": {str(q["id"]): {"statement": q["statement"], "simplifiedStatement": q["simplifiedStatement"]} for q in questions},
        "scenarios": {s["axisId"]: {"prompt": s["prompt"], "optionA": s["optionA"], "optionB": s["optionB"]} for s in scenarios},
        "axes": {a["id"]: {"name": a["name"], "poleA": a["poleA"], "poleB": a["poleB"]} for a in axes},
        "ui": UI_STRINGS,
        "profiles": {p["id"]: {"name": p["name"], "summary": p["summary"]} for p in profiles}
    }
    
    for lang in languages:
        print(f"\n--- Translating to {lang.upper()} ---")
        translated_strings = translate_list(strings_to_translate, lang)
        
        # Verify length matching
        if len(translated_strings) != len(strings_to_translate):
            print(f"CRITICAL ERROR: Translation count mismatch for {lang}! Expected {len(strings_to_translate)}, got {len(translated_strings)}.")
            # Fallback fill
            while len(translated_strings) < len(strings_to_translate):
                translated_strings.append(strings_to_translate[len(translated_strings)])
                
        # Reconstruct structured data
        lang_questions = {}
        for idx, q in enumerate(questions):
            lang_questions[str(q["id"])] = {
                "statement": translated_strings[idx],
                "simplifiedStatement": translated_strings[idx + len(questions)]
            }
            
        lang_scenarios = {}
        for idx, s in enumerate(scenarios):
            s_idx = scen_offset + idx * 3
            lang_scenarios[s["axisId"]] = {
                "prompt": translated_strings[s_idx],
                "optionA": translated_strings[s_idx + 1],
                "optionB": translated_strings[s_idx + 2]
            }
            
        lang_axes = {}
        for idx, a in enumerate(axes):
            a_idx = axes_offset + idx * 3
            lang_axes[a["id"]] = {
                "name": translated_strings[a_idx],
                "poleA": translated_strings[a_idx + 1],
                "poleB": translated_strings[a_idx + 2]
            }
            
        lang_ui = {}
        for idx, k in enumerate(ui_keys):
            u_idx = ui_offset + idx
            lang_ui[k] = translated_strings[u_idx]
            
        lang_profiles = {}
        for idx, p in enumerate(profiles):
            p_idx = prof_offset + idx * 2
            lang_profiles[p["id"]] = {
                "name": translated_strings[p_idx],
                "summary": translated_strings[p_idx + 1]
            }
            
        translations[lang] = {
            "questions": lang_questions,
            "scenarios": lang_scenarios,
            "axes": lang_axes,
            "ui": lang_ui,
            "profiles": lang_profiles
        }
        
    print("\n--- Writing translations.ts ---")
    ts_content = f"""// AUTO-GENERATED BY scripts/generate_translations.py
// DO NOT EDIT THIS FILE DIRECTLY.

export interface LanguageTranslation {{
  questions: Record<string, {{ statement: string; simplifiedStatement: string }}>
  scenarios: Record<string, {{ prompt: string; optionA: string; optionB: string }}>
  axes: Record<string, {{ name: string; poleA: string; poleB: string }}>
  ui: Record<string, string>
  profiles: Record<string, {{ name: string; summary: string }}>
}}

export type SupportedLanguage = 'en' | 'es' | 'zh' | 'fr' | 'de'

export const translations: Record<SupportedLanguage, LanguageTranslation> = {json.dumps(translations, indent=2, ensure_ascii=False)}
"""
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print("translations.ts generated successfully!")

if __name__ == "__main__":
    main()
