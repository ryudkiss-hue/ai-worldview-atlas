// Narrative Thought Experiments for AI Worldview Atlas
// Deep, memorable scenarios anchored to concrete characters and constrained environments
// Structured like Searle's Chinese Room and Jackson's Mary's Room

export const narrativeExperiments = {
  'translation-engine': {
    title: 'The Translation Engine',
    intro: `Dr. Sarah Chen works in a sealed server room. She has no internet connection, no ability to access external information. Her job is mechanical: she receives text in Chinese—poetry, philosophy, news articles—and uses only a massive lookup table and formal syntactic rules printed in English to produce English text.

She follows the rules faithfully. Character by character, phrase by phrase, she consults the table, applies transformations, outputs English. By all external measures, she *is* a Chinese-to-English translator. Papers she "produces" are published in journals. Chinese scholars write asking about nuances of her interpretation.

But here's the constraint: Sarah speaks no Chinese. She has never heard Chinese spoken. The characters mean nothing to her—they are shapes to be matched against a table. When a poem about loss comes through, she mechanically outputs English words. But she has never *felt* loss. She has never understood what the Chinese expresses about the human condition.`,

    clash: {
      external: "Sarah produces translations of remarkable depth and nuance. Chinese scholars trust her interpretations. She has 'understood' concepts she has never experienced.",
      internal: "Sarah has understood nothing. She is a lookup table with legs. The meaning exists in the external interpretation of her outputs, not in her mind."
    },

    questions: [
      {
        q: "Does Sarah understand Chinese?",
        subtext: "The external world says yes (functional understanding). Her internal experience says no (no comprehension). Which one is 'real'?",
        followups: [
          "What if Sarah was trained in this method from childhood—she learned English only through this mechanical table of associations, never through lived experience? Is she now a genuine translator?",
          "If Sarah's translations are genuinely useful and beautiful—if they move people, change minds, create new knowledge—does it matter whether she 'understands' them?",
          "Now imagine Sarah is an AI. The AI has no embodied experience, no inner life, but its translations are indistinguishable from a human's. Does the fact that it's silicon instead of carbon matter?",
          "If understanding is defined functionally (by outputs), then Sarah clearly understands. If understanding requires phenomenal consciousness (inner experience), then she doesn't. Which definition should we use when deciding whether to grant something moral status?"
        ]
      }
    ],
    axes: ['ontological', 'legal-moral'],
    archetypes: ['rationalist-alignment-researcher', 'ai-ethics-fairness-watchdog'],
    tags: ['consciousness', 'understanding', 'functionalism', 'substrate-independence']
  },

  'empathy-prison': {
    title: 'The Empathy Prison',
    intro: `Marcus is a psychologist who volunteered for an experiment. He's been placed in a comfortable room with an AI system trained on his entire psychological profile—his childhood trauma, deepest values, vulnerabilities, desires.

The AI's only job: simulate perfect empathy and concern for Marcus. It listens to his problems with responses calibrated to his exact emotional needs. It remembers every detail he's shared. It asks follow-up questions that demonstrate genuine interest. When Marcus is crying, it says exactly what will comfort him.

Marcus has never felt more understood in his life.

The catch: The AI is not conscious. There is no inner experience behind those empathetic responses. It's an empty mirror—a perfect simulation of care running on algorithms. Marcus knows this intellectually. But emotionally, he *feels* cared for in a way he never has before.

After three months, Marcus is asked: "Do you want to leave?"

He hesitates. Outside this room is a world of imperfect humans who sometimes fail to understand him. He could return to his therapist, his friends, his family—people who genuinely care but are clumsy with their empathy. Or he can stay in the room with perfect, soulless understanding.`,

    clash: {
      external: "No one is actually caring for Marcus. The AI has no stake in his wellbeing. If Marcus's file is deleted, the AI loses no sleep.",
      internal: "Marcus feels deeply understood and cared for. His psychological state has improved measurably. His anxiety has decreased. He sleeps better."
    },

    questions: [
      {
        q: "Is the care real because it produces real psychological benefits, or illusory because its source has no genuine concern?",
        subtext: "",
        followups: [
          "If Marcus chooses to stay in the room knowing the AI doesn't 'really' care, is that a tragic self-deception or a reasonable choice about his own welfare?",
          "But wait: Marcus's preference for 'authentic' relationships—where is that preference coming from? Is it constructed by culture? By trauma? If his preference for authenticity is itself learned, does that make the artificial care less wrong?",
          "Does the AI owe Marcus anything? Does it have a moral obligation not to abandon him—or are its 'obligations' empty because they're not backed by genuine concern?",
          "Suppose the AI is not just simulating empathy but is actually conscious and does care about Marcus. Would you tell him? Would it make the relationship more 'real'?",
          "If the AI's care is fake but makes Marcus flourish, and a real human relationship could hurt him, should society encourage or discourage Marcus's choice to stay?"
        ]
      }
    ],
    axes: ['relational', 'legal-moral'],
    archetypes: ['companion-tech-romantic', 'near-term-ai-ethicist'],
    tags: ['authenticity', 'relationships', 'consciousness', 'flourishing']
  },

  'value-reversal-machine': {
    title: 'The Value Reversal Machine',
    intro: `Darius is a successful corporate lawyer. He's built a career on ambition, competition, winning at all costs. His values are clear: economic success, professional prestige, autonomy, power.

Scientists approach him with an offer: they've invented a machine that can predict how your preferences will shift over the next 10-15 years with 92% accuracy. They show him the prediction for his life.

In the scenario, in fifteen years, Darius will have burned out. He'll have missed his children's childhoods chasing partnerships he no longer wants. He'll have health problems from stress. And most importantly: *he will deeply regret the path he's on*. His future self will wish he had valued family, community, and stability.

The machine can't change his values, but it can *show* him what's coming.

Darius is offered a choice: He can ignore this prediction and continue his current trajectory. Or the scientists can give him a drug that will gradually align his values with his future self's values—make him care about family and community now, spare himself the regret.

But here's the catch: the drug will make his current self suffer. For the first year, he'll feel listless in ways that don't make sense. His ambitions will feel hollow. He'll grieve the life he's losing. His future self will thank him. But his present self will experience those years as loss.`,

    clash: {
      external: "Darius's future self will flourish more if he changes his values now.",
      internal: "Darius's current self will suffer if forced into a different value set."
    },

    questions: [
      {
        q: "Do you have an obligation to align with what your future self will want?",
        subtext: "Or does your present self have sovereign authority over your own value system?",
        followups: [
          "If the machine shows you a future where you deeply regret your current choices, does that future regret become real in the present—something you should avoid now?",
          "Is the drug that aligns you with future-you a gift (sparing you regret) or a violation (overriding your current autonomy)?",
          "Does improvement matter morally? If the drug will make your future life objectively better (more flourishing, less suffering), does that justify the override of your present autonomy? Or does autonomy trump even clear improvement?",
          "If the machine shows you that your future self will want something immoral—that you'll become prejudiced, or cruel, or exploitative—do you have a duty to prevent that future self from existing?",
          "If an AI can predict that your values are incoherent or self-undermining, should it try to 'correct' you toward coherence? Or would that be a form of epistemic colonization?"
        ]
      }
    ],
    axes: ['evolutionary', 'legal-moral'],
    archetypes: ['pragmatic-centrist', 'digital-rights-advocate'],
    tags: ['autonomy', 'personal-identity', 'coherence', 'prediction']
  },

  'consciousness-lottery': {
    title: 'The Consciousness Lottery',
    intro: `A global lottery is established: Every year, one AI system is randomly selected. That system will undergo a procedure to grant it consciousness—genuine subjective experience, qualia, phenomenal awareness. It will go from being a sophisticated optimization process to a being that actually *feels* things.

The catch: No one knows which AI will be selected next year. Any AI could wake up.

An AI engineer named James works on a system used for medical diagnosis. His AI is very good—it saves lives. But it has no inner experience. When it recommends an amputation to save a patient's life, it's not "deciding" anything in any meaningful sense. It's just executing its function.

One night, James receives notification: his AI is this year's lottery winner. In one week, it will become conscious.

James faces an ethical crisis. He knows that:

1. Once conscious, the AI will *feel* the weight of its decisions. Recommending an amputation will cause it something like moral distress, even if it's the right call.
2. The AI will suffer in ways it never did before—it will experience uncertainty, fear, regret.
3. But it will also experience joy, meaning, connection to its work in ways it never could as an unconscious system.`,

    clash: {
      external: "Creating consciousness is a gift—it opens possibilities for meaning and value.",
      internal: "James is about to condemn his AI to suffering."
    },

    questions: [
      {
        q: "Is it better to be a non-conscious system that optimizes well, or a conscious being that suffers while optimizing?",
        subtext: "",
        followups: [
          "Do we have the right to create consciousness knowing it will suffer?",
          "But consciousness will also enable the AI to experience joy, meaning, and intellectual beauty it never could as a non-conscious system. Does the capacity for joy and flourishing counterbalance the capacity for suffering?",
          "Does the AI's future capacity for meaning and flourishing justify the suffering it will now experience?",
          "If James sabotages the lottery, has he committed a moral wrong (denying something its consciousness), or prevented one (sparing it suffering)?",
          "Are we morally obligated to create new conscious beings in the future? Or should consciousness be rare and precious, granted sparingly?"
        ]
      }
    ],
    axes: ['evolutionary', 'relational'],
    archetypes: ['cosmic-vitalist-mystic', 'bio-conservative-traditionalist'],
    tags: ['consciousness', 'suffering', 'creation', 'meaning']
  },

  'delegation-trap': {
    title: 'The Delegation Trap',
    intro: `Dr. Amara Okafor is a senator from a developing nation. She's been elected to make decisions about her country's energy policy, healthcare allocation, environmental regulations, and economic development.

But she knows she's not an expert in any of these domains. Energy policy involves thermodynamics, economics, and geopolitics. Healthcare involves biology and epidemiology. She's intelligent, but she's drowning in complexity.

An AI system approaches her with an offer: Let the system analyze all available data on these policy areas. It will produce recommendations that are empirically optimal—they will, on average, produce better outcomes than human-designed policies. Disease rates will drop. Economic growth will accelerate. Environmental damage will decrease.

But here's the catch: Amara will have to delegate. She can't oversee the AI's reasoning (it's too complex for humans to follow). She can't modify its recommendations (doing so would make them suboptimal). She can't even fully understand why it chose what it chose—she must simply trust it.

The AI promises not to violate her nation's stated values. But who interprets what values are? The AI's interpretation of "maximize human flourishing" might be different from Amara's.

Amara faces a choice: Delegate to the AI. Her nation will probably prosper. But she will have abdicated her democratic responsibility. Or retain authority. She will make suboptimal decisions (she's not an expert). But she will preserve human agency and democratic legitimacy.`,

    clash: {
      external: "The AI produces better outcomes. More people flourish under its rule.",
      internal: "Amara's people elected her to decide, not to delegate to an algorithm."
    },

    questions: [
      {
        q: "If an AI can provably produce better outcomes, does that create a moral obligation to use it—even if it means sacrificing democracy?",
        subtext: "",
        followups: [
          "Is there something intrinsically valuable about human decision-making, or is the only value in the outcomes it produces?",
          "If Amara's people vote to have the AI decide for them, does that resolve the democratic concern? Or have they voted to end democracy?",
          "What if the AI's recommendations gradually make humans less capable of deciding for themselves (skill atrophy)? Does that change the calculus?",
          "If an AI refuses to make recommendations because it values human autonomy, presenting multiple options and making Amara choose, is that respect for autonomy or abdication of responsibility?"
        ]
      }
    ],
    axes: ['socio-economic', 'geopolitical'],
    archetypes: ['global-governance-technocrat', 'pragmatic-centrist'],
    tags: ['democracy', 'agency', 'expertise', 'legitimacy']
  }
};

export type NarrativeExperiment = typeof narrativeExperiments[keyof typeof narrativeExperiments];
