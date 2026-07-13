# Multilingual Translation Guide

## Overview

The AI Worldview Atlas now supports **25 languages** with a complete infrastructure for 170-question multilingual assessments.

### Language Support Status

#### Tier 1: Full Translations Available (11 languages)
- English (en)
- Spanish (es)
- Hindi (hi)
- Arabic (ar)
- Portuguese (pt)
- Bengali (bn)
- Russian (ru)
- Japanese (ja)
- German (de)
- French (fr)
- Korean (ko)
- Turkish (tr)
- Vietnamese (vi)
- Italian (it)
- Polish (pl)
- Indonesian (id)
- Dutch (nl)
- Hebrew (he)
- Swedish (sv)
- Czech (cs)
- Romanian (ro)

#### Tier 2: Configured & Awaiting Translation (14 languages)

**Standard Languages (8):**
- Greek (el)
- Ukrainian (uk)
- Danish (da)
- Norwegian (nb)
- Latin (la)
- Swedish (sv) - *also in Tier 1*
- Tagalog (tl)
- Ithkuil (ixk)

**Constructed/Artistic Languages (6):**
- Lojban (jbo) - https://lojban.org/
- toki pona (tokipona) - https://tokipona.org/compounds.txt + https://nimi.li/
- Esperanto (eo) - https://esperanto.org/
- Proto-Indo-European (pie) - *linguistic reconstruction*
- Laadan (laa) - http://www.laadanlanguage.org/e2l.html
- Ithkuil (ixk) - https://ithkuil.net/index.htm

## Translation Generation Options

### Option 1: Google Translate API (Recommended for Standard Languages)

The Python script `scripts/translate_all_questions.py` is configured to generate translations for all 25 languages.

```bash
python scripts/translate_all_questions.py
```

**Note:** The free tier of Google Translate may be rate-limited. Use the paid API for production:

```python
from google.cloud import translate_v2
client = translate_v2.Client()

result = client.translate_text("text", target_language="es")
```

### Option 2: Manual Translation with Resources

For constructed languages, use the official language resources:

#### toki pona
- Word list: https://tokipona.org/compounds.txt
- Dictionary: https://nimi.li/
- Grammar: https://tokipona.org/

#### Laadan
- Dictionary: http://www.laadanlanguage.org/e2l.html
- Grammar reference: http://www.laadanlanguage.org/

#### Ithkuil
- Documentation: https://ithkuil.net/index.htm
- Grammar: https://ithkuil.net/grammar.htm

#### Lojban
- Official site: https://lojban.org/
- Dictionary: https://mw.lojban.org/papri/lojban-en_jbovla

## Implementation Workflow

### Step 1: Update Language Configuration
Files already configured:
- `.env.local` - VITE_TRANSLATION_LANGUAGES includes all 25 languages
- `src/hooks/useLanguage.ts` - SUPPORTED_LANGUAGES includes all 25 languages
- `src/components/LanguageSwitcher.tsx` - DEFAULT_LANGUAGES with native names
- `src/data/translations.ts` - Infrastructure ready

### Step 2: Generate Translations
Run the translation script (for Tier 2 standard languages):

```bash
cd src/data
python ../../scripts/translate_all_questions.py
```

### Step 3: Manual Translation (Constructed Languages)
For Laadan, Ithkuil, toki pona, and Proto-Indo-European:
1. Extract questions from `src/data/assessmentQuestions.ts`
2. Use language resources above to manually translate
3. Update `src/data/translations.ts` with manual translations

### Step 4: Verify Build
```bash
npm run build
```

## Architecture

### Question Structure
- **Total:** 170 questions
- **Core Assessment:** q1-q145 (8 axes × 18 + 1 synthesis)
- **Thought Experiments:** q146-q170 (25 narrative scenarios)

### Question Interface
```typescript
interface Question {
  id: string;        // q1-q170
  axis: string;      // 8 axes + synthesis
  text: string;      // Full question in English
  simplified?: string; // 6th-8th grade reading level
  subtext?: string;  // Additional context
  type: 'likert' | 'text' | 'choice';
  options?: string[];
}
```

### Translation Schema
```typescript
interface LanguageTranslation {
  questions: Record<string, { 
    statement: string; 
    simplifiedStatement: string 
  }>
  scenarios: Record<string, { 
    prompt: string; 
    optionA: string; 
    optionB: string 
  }>
  axes: Record<string, { 
    name: string; 
    poleA: string; 
    poleB: string 
  }>
  ui: Record<string, string>
  profiles: Record<string, { 
    name: string; 
    summary: string 
  }>
}
```

## UI Language Support

The language switcher is integrated into the assessment UI:
- Top-right corner floating selector
- Browser language auto-detection
- localStorage persistence
- Graceful fallback to English

## Cost Considerations

### Google Translate Free Tier
- 500,000 characters/month limit
- 170 questions × 25 languages ≈ 306-307K characters/month
- **Status:** Within free tier limit

### Paid API
- $15 per million characters
- For production deployment with high usage

## Next Steps

1. **Testing:** Verify all 170 questions extract correctly
2. **Translation:** Generate Tier 2 standard language translations via Python script
3. **Manual Translation:** Add Tier 2 constructed language translations using provided resources
4. **Validation:** Test UI with all 25 languages
5. **Deployment:** Build and deploy with full multilingual support

## Files Modified
- `.env.local` - Language configuration
- `src/hooks/useLanguage.ts` - Language state management
- `src/components/LanguageSwitcher.tsx` - UI language selector
- `src/data/translations.ts` - Translation data structure
- `scripts/translate_all_questions.py` - Translation generation script
- `src/data/assessmentQuestions.ts` - 170-question assessment structure
