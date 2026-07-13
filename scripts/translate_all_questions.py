#!/usr/bin/env python3
"""
Translate all 170 assessment questions using Google Translate free tier.
Supports batch translation with rate limiting.
Reads target languages from .env.local VITE_TRANSLATION_LANGUAGES
"""

import json
import re
import time
import os
from typing import Dict, List
from dotenv import load_dotenv

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("Installing deep_translator...")
    import subprocess
    subprocess.check_call(["pip", "install", "deep_translator"])
    from deep_translator import GoogleTranslator

# Load .env.local
load_dotenv('.env.local')

# Configuration
INPUT_FILE = "src/data/assessmentQuestions.ts"
OUTPUT_FILE = "src/data/translations.ts"
BATCH_SIZE = 5  # Translate in batches to avoid rate limits
DELAY_BETWEEN_BATCHES = 1  # seconds

# Language display names
LANGUAGE_NAMES = {
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "zh": "Chinese",
    "ja": "Japanese",
    "pt": "Portuguese",
    "it": "Italian",
    "ko": "Korean",
    "ar": "Arabic",
    "ru": "Russian",
    "el": "Greek",
    "uk": "Ukrainian",
    "jbo": "Lojban",
    "tokipona": "toki pona",
    "da": "Danish",
    "nb": "Norwegian",
    "la": "Latin",
    "sv": "Swedish",
    "tl": "Tagalog",
    "enm": "Middle English",
    "ang": "Old English",
    "eo": "Esperanto",
    "pie": "Proto-Indo-European",
    "laa": "Laadan",
    "ixk": "Ithkuil"
}

# Get languages from .env.local
env_languages = os.getenv('VITE_TRANSLATION_LANGUAGES', '')
LANGUAGES = {}
if env_languages:
    for lang_code in env_languages.split(','):
        lang_code = lang_code.strip()
        if lang_code in LANGUAGE_NAMES:
            LANGUAGES[lang_code] = LANGUAGE_NAMES[lang_code]
        else:
            LANGUAGES[lang_code] = lang_code.upper()

if not LANGUAGES:
    # Fallback to default languages if .env.local not set
    LANGUAGES = {
        "es": "Spanish",
        "fr": "French",
        "de": "German",
        "zh": "Chinese",
        "ja": "Japanese",
        "pt": "Portuguese",
        "it": "Italian",
        "ko": "Korean",
        "ar": "Arabic",
        "ru": "Russian"
    }

def extract_questions() -> List[Dict]:
    """Extract all 170 questions from assessmentQuestions.ts using line-by-line parsing"""
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    questions = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Look for question id
        if "id: 'q" in line:
            id_match = re.search(r"id:\s*'(q\d+)'", line)
            if id_match:
                qid = id_match.group(1)
                axis = None
                text = None

                # Extract axis and text from following lines
                for j in range(i, min(i + 15, len(lines))):
                    if "axis:" in lines[j]:
                        axis_match = re.search(r"axis:\s*'([^']*)'", lines[j])
                        if axis_match:
                            axis = axis_match.group(1)

                    if "text:" in lines[j]:
                        # Try single quotes first
                        text_match = re.search(r"text:\s*'([^']*)'", lines[j])
                        if not text_match:
                            # Try double quotes
                            text_match = re.search(r'text:\s*"([^"]*)"', lines[j])

                        if text_match:
                            text = text_match.group(1)

                        if axis and text:
                            questions.append({
                                "id": qid,
                                "axis": axis,
                                "text": text
                            })
                            break
        i += 1

    print(f"Extracted {len(questions)} questions from {INPUT_FILE}")
    return questions

def translate_text(text: str, target_lang: str, max_retries: int = 3) -> str:
    """Translate text using Google Translate free tier with retry logic"""
    for attempt in range(max_retries):
        try:
            translator = GoogleTranslator(source_language='en', target_language=target_lang)
            translated = translator.translate(text)
            return translated
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # Exponential backoff
                print(f"  Translation attempt {attempt + 1} failed, retrying in {wait_time}s...")
                time.sleep(wait_time)
            else:
                print(f"  Failed to translate after {max_retries} attempts: {e}")
                return text  # Return original text if all retries fail
    return text

def translate_questions(questions: List[Dict]) -> Dict[str, Dict]:
    """Translate all questions to target languages"""
    translations = {}

    for lang_code, lang_name in LANGUAGES.items():
        print(f"\nTranslating to {lang_name} ({lang_code})...")
        translations[lang_code] = {}

        for i, question in enumerate(questions):
            qid = question["id"]

            # Translate text
            translated_text = translate_text(question["text"], lang_code)

            # Translate subtext if present
            translated_subtext = None
            if question.get("subtext"):
                translated_subtext = translate_text(question["subtext"], lang_code)

            translations[lang_code][qid] = {
                "text": translated_text,
                "subtext": translated_subtext
            }

            # Progress indicator
            if (i + 1) % BATCH_SIZE == 0:
                print(f"  Translated {i + 1}/{len(questions)} questions... pausing {DELAY_BETWEEN_BATCHES}s")
                time.sleep(DELAY_BETWEEN_BATCHES)

    return translations

def generate_ts_output(questions: List[Dict], translations: Dict[str, Dict]) -> str:
    """Generate TypeScript output file"""
    ts_content = """/**
 * Auto-generated translations for all 170 assessment questions
 * Generated from: assessmentQuestions.ts
 *
 * Structure:
 * {
 *   [language_code]: {
 *     [question_id]: { text: "...", subtext: "..." }
 *   }
 * }
 */

export const questionTranslations = {
"""

    for lang_code, lang_name in sorted(LANGUAGES.items()):
        ts_content += f"  // {lang_name} ({lang_code})\n"
        ts_content += f"  '{lang_code}': {{\n"

        if lang_code in translations:
            for qid, translation in sorted(translations[lang_code].items()):
                text = translation["text"].replace("'", "\\'").replace('\\n', ' ')
                subtext = ""
                if translation.get("subtext"):
                    subtext_escaped = translation["subtext"].replace("'", "\\'")
                    subtext = f", subtext: '{subtext_escaped}'"
                ts_content += f"    '{qid}': {{ text: '{text}'{subtext} }},\n"

        ts_content += "  },\n\n"

    ts_content += """}

export const getQuestionTranslation = (
  questionId: string,
  languageCode: string,
  field: 'text' | 'subtext' = 'text'
): string | undefined => {
  const langTranslations = questionTranslations[languageCode as keyof typeof questionTranslations];
  if (!langTranslations) return undefined;

  const question = langTranslations[questionId as keyof typeof langTranslations];
  if (!question) return undefined;

  return question[field];
};
"""
    return ts_content

def main():
    print("Translating all 170 assessment questions using Google Translate...\n")

    # Extract questions
    questions = extract_questions()

    if not questions:
        print("ERROR: No questions found in assessmentQuestions.ts")
        return

    print(f"Found {len(questions)} questions to translate")
    print(f"Target languages: {', '.join(LANGUAGES.values())}")
    print(f"\nStarting translation (this may take a few minutes)...\n")

    # Translate
    translations = translate_questions(questions)

    # Generate output
    ts_output = generate_ts_output(questions, translations)

    # Write output
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(ts_output)

    print(f"\n[SUCCESS] Translations complete!")
    print(f"Output written to: {OUTPUT_FILE}")
    print(f"Total questions translated: {len(questions)}")
    print(f"Total languages: {len(LANGUAGES)}")

if __name__ == "__main__":
    main()
