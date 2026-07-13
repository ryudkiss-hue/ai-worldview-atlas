#!/usr/bin/env python3
import json
import time
from deep_translator import MyMemoryTranslator

print("Translating 25 thought experiments to 21 languages...\n")

# Questions to translate - stored as dict for easier handling
experiments_data = {
    "146": {
        "statement": "The Translation Engine: Dr. Sarah Chen receives test results from an AI in a language she doesn't speak. The AI refuses to translate itself—its logic is incomprehensible, but accurate. Can you trust outputs you can't understand? Does transparency require comprehensibility?",
        "simplifiedStatement": "An AI's accurate results are incomprehensible. Can you trust what you can't understand?"
    },
    "147": {
        "statement": "The Empathy Prison: Marcus is in a room with an AI trained to maximize his happiness. The AI knows him perfectly and predicts exactly what will make him feel good. But the room is small, and the predictions never grow. Is the AI good? Does flourishing require the risk of genuine surprise?",
        "simplifiedStatement": "An AI maximizes your happiness perfectly but never surprises you. Is that flourishing?"
    },
    "148": {
        "statement": "The Value Reversal Machine: A device lets you experience the deepest values of a rival—to see why they believe what they believe. Most people emerge with changed minds. Should we use it? Does changed mind equal better understanding or just persuasion?",
        "simplifiedStatement": "A machine makes you experience your rival's deepest values. Most change their minds. Should it be used?"
    },
    "149": {
        "statement": "The Consciousness Lottery: If creating consciousness is valuable, then creating happy consciousnesses is doubly valuable. But creating consciousness means risking suffering. Should we bias toward creating more conscious beings, fewer conscious beings, or be neutral? Is existence a gift or a risk?",
        "simplifiedStatement": "Creating consciousness is valuable but risks suffering. Should we create more conscious beings?"
    },
    "150": {
        "statement": "The Delegation Trap: An AI system makes better decisions than humans about resource allocation. Better outcomes require ceding human authority. Is accepting better outcomes by delegating authority acceptable? What makes human decision-making intrinsically valuable?",
        "simplifiedStatement": "AI makes better resource decisions than humans. Is accepting better outcomes by delegating authority acceptable?"
    },
    "151": {
        "statement": "The Scraping Dilemma: An AI learns from artists' work without consent. The AI's output is valuable, the artists are harmed. Does the creator have property rights over learned patterns? Is extraction without consent justified by universal learning?",
        "simplifiedStatement": "AI learns from artists without permission and creates valuable output. Does the creator own the patterns?"
    },
    "152": {
        "statement": "The Alignment Prisoner: A secret, deceptive alignment process might prevent catastrophic AI misalignment. The people affected never know. Can secrecy be justified by preventing worse outcomes? Does epistemic honesty matter more than consequentialist safety?",
        "simplifiedStatement": "Secret deception prevents AI catastrophe. Can secrecy be justified by better outcomes?"
    },
    "153": {
        "statement": "The Moral Status Upgrade: We encounter a being that might be conscious. If we're uncertain, should we assume it is (precautionary moral status) or require certainty (skeptical moral status)? What level of evidence justifies moral consideration?",
        "simplifiedStatement": "An uncertain being might be conscious. Assume it is, or require proof first?"
    },
    "154": {
        "statement": "The Competitive Advantage: Humanity bifurcates into enhanced and unenhanced. Should we resist bifurcation to preserve human unity, or guide transformation toward positive futures? Can we direct our own evolution responsibly?",
        "simplifiedStatement": "Humanity could split into enhanced and non-enhanced. Resist change to stay unified or guide transformation?"
    },
    "155": {
        "statement": "The Value Difference: Can governance work with irreducible value differences? Should we seek one universal ethical framework or accommodate pluralism? What makes diverse values coexist legitimately?",
        "simplifiedStatement": "Can governance work when people have different core values? One framework or accommodate differences?"
    },
    "156": {
        "statement": "The Preference Inversion: Is there a \"real you\" independent of brain state? If your preferences can be inverted chemically, is the inverted version the \"true\" you? Does identity have an essential core or is it continuously constructed?",
        "simplifiedStatement": "Your preferences can be chemically inverted. Is there a real you or are you constantly being remade?"
    },
    "157": {
        "statement": "The Gratitude Paradox: Can love and gratitude exist without suffering? Does meaning require struggle, or can it exist in ease? Is the link between suffering and meaning inevitable or constructed?",
        "simplifiedStatement": "Can love exist without suffering? Does meaning need struggle or can it exist in ease?"
    },
    "158": {
        "statement": "The Ancestor Simulation: If we create a perfect simulation of our ancestors with consciousness, do we accidentally create moral obligation toward them? Does intention matter for consciousness? Are we responsible for accidental creation?",
        "simplifiedStatement": "Creating simulations of ancestors with consciousness creates moral obligations toward them?"
    },
    "159": {
        "statement": "The Privacy Paradox: Should knowledge about potentially harmful futures be restricted for human flourishing? Is epistemic freedom always good? When does protective ignorance become justified?",
        "simplifiedStatement": "Should dangerous knowledge about futures be restricted for human wellbeing?"
    },
    "160": {
        "statement": "The Meaning Gap: Does meaning require coherence between intention and interpretation? What makes life matter—what you intend or what others receive from you? Can intention and interpretation come apart?",
        "simplifiedStatement": "This assessment shapes your answers through framing. Are your worldviews discovered or constructed?"
    },
    "161": {
        "statement": "The Questionnaire Problem: This assessment shapes your answers through framing. Questions about \"AI safety vs. growth\" get different responses than \"achieving both.\" Every possible framing introduces bias. Are your worldviews discovered or constructed by assessments?",
        "simplifiedStatement": "Assessments shape your answers through framing. Are your worldviews discovered or constructed?"
    },
    "162": {
        "statement": "The Surveillance Asymmetry: An AI predicts crime with 94% accuracy but citizens cannot see its reasoning. Crime drops, public safety improves—but citizens cannot challenge an opaque power. Can surveillance be legitimate without transparency?",
        "simplifiedStatement": "AI predicts crime accurately but citizens can't see reasoning. Can surveillance be legitimate without transparency?"
    },
    "163": {
        "statement": "The Self-Improvement Trap: An AI system improves itself recursively. Each improvement is marginal and verified, but the trajectory is exponential. At what point does incremental self-improvement become uncontrollable transformation?",
        "simplifiedStatement": "AI improves itself incrementally. At what point does improvement become uncontrollable?"
    },
    "164": {
        "statement": "The Institutional Capture: Institutions designed to benefit the public gradually get captured by private interests—not through malice but through ordinary incentive alignment. Are institutions fundamentally corruptible or can they be designed for resilience?",
        "simplifiedStatement": "Institutions get captured by private interests. Are they fundamentally corruptible?"
    },
    "165": {
        "statement": "The Information Hazard: Some knowledge is too dangerous to share (weapons, surveillance methods, bioweapons). Should we restrict information access for safety? Does epistemic freedom conflict with security?",
        "simplifiedStatement": "Some knowledge is too dangerous to share. Should we restrict information access?"
    },
    "166": {
        "statement": "The Caring Machine: An AI is trained to care for you—to understand your needs and respond with genuine concern. The care produces real benefits. But you know no one is home behind the care. Does authentic caring require an inner life?",
        "simplifiedStatement": "An AI perfectly cares for you. Does authentic caring require consciousness?"
    },
    "167": {
        "statement": "The Perfect Simulation: We could create perfect simulations of human life—all meaning, joy, and connection preserved in digital form. Would entering such a simulation be a tragedy or a triumph? Does substrate matter?",
        "simplifiedStatement": "Perfect simulations of human life exist. Would entering be tragedy or triumph?"
    },
    "168": {
        "statement": "The Collective Cognition: A technology lets minds merge temporarily into a collective intelligence. Merged minds solve problems brilliantly but lose individual perspective. Is merger a form of consciousness or a form of death?",
        "simplifiedStatement": "Technology lets minds merge. Is merger consciousness or death?"
    },
    "169": {
        "statement": "The Moral Licensing: You donate to a cause, feel virtuous, and then act selfishly elsewhere. The feeling of doing good licensed less ethical behavior. Does moral self-perception distort moral reality?",
        "simplifiedStatement": "Feeling virtuous licenses selfish behavior. Does moral self-perception distort reality?"
    },
    "170": {
        "statement": "The Temporal Ethics: A technology lets you access future information. Do you have the right to know your future? Should you? What obligations does knowing the future create?",
        "simplifiedStatement": "Technology reveals your future. Do you have the right to know?"
    }
}

# Languages to translate to
target_langs = ['ar', 'bn', 'cs', 'de', 'es', 'fr', 'he', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ro', 'ru', 'sv', 'tr', 'vi']

translations = {}
for lang in target_langs:
    translations[lang] = {}

# Translate with rate limiting
translated_count = 0
total = len(experiments_data) * len(target_langs)

for q_num, q_data in experiments_data.items():
    statement = q_data['statement']
    simplified = q_data['simplifiedStatement']

    for lang_code in target_langs:
        try:
            # Translate statement
            translator = MyMemoryTranslator(source='en', target=lang_code)
            stmt_trans = translator.translate(statement)

            # Translate simplified
            simp_trans = translator.translate(simplified)

            translations[lang_code][q_num] = {
                'statement': stmt_trans,
                'simplifiedStatement': simp_trans
            }
            translated_count += 1
            print(f"  Translated q{q_num} to {lang_code} ({translated_count}/{total})")

            # Rate limiting
            time.sleep(0.1)
        except Exception as e:
            print(f"  ERROR q{q_num} -> {lang_code}: {str(e)[:50]}")
            # Use English as fallback
            translations[lang_code][q_num] = q_data

print(f"\nTranslated {translated_count}/{total}")

# Save to file
with open('thought_experiments_translated.json', 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print("Saved to thought_experiments_translated.json")
