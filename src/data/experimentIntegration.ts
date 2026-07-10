// Narrative Experiment Integration Guide
// How to weave 15 thought experiments throughout the 145-question assessment

export const experimentIntegrationGuide = {
  metadata: {
    totalExperiments: 15,
    totalQuestions: 145,
    avgQuestionsPerExperiment: 9.7,
    rationale: 'One narrative experiment after every 8-10 questions. Each experiment synthesizes prior responses and probes implicit assumptions.'
  },

  experimentPlacement: [
    {
      experimentKey: 'translation-engine',
      axesAddressed: ['ontological', 'legal-moral'],
      questionsAfter: 10,
      questionsRange: '1-10 (Teleological axis)',
      purpose: 'After establishing respondent\'s baseline position on cosmic purpose vs. human-centered value, probe whether they think *understanding* requires phenomenal consciousness or just functional output. Reveals implicit commitments about substrate-independence.',
      responseInterpretation: {
        functionalAnswer: 'Respondent prioritizes outcomes over inner experience. Likely leans Silicon Valley Techno-Optimist or e/acc Maximalist',
        experientialAnswer: 'Respondent values phenomenal consciousness. Likely leans Bio-Conservative or Neo-Luddite'
      }
    },

    {
      experimentKey: 'empathy-prison',
      axesAddressed: ['relational', 'legal-moral'],
      questionsAfter: 20,
      questionsRange: '11-20 (Risk Profile axis, near-term)',
      purpose: 'Risk questions establish whether respondent favors precaution or acceleration. Empathy Prison probes: does relational meaning require genuine reciprocal concern, or is simulation sufficient? Reveals underlying theory of meaning.',
      responseInterpretation: {
        authenticityMandatory: 'Respondent values genuine relationship over outcomes. Likely Companion-Tech Romantic or Faith-Rooted Ethicist',
        outcomesOverride: 'Respondent prioritizes wellbeing over authenticity. Likely Silicon Valley Pragmatist or Global Development Optimist'
      }
    },

    {
      experimentKey: 'value-reversal-machine',
      axesAddressed: ['evolutionary', 'legal-moral'],
      questionsAfter: 30,
      questionsRange: '21-30 (Socio-Economic axis, first 9 questions)',
      purpose: 'After socio-economic positioning, probe deep question: should you be loyal to your current self or your future self? Reveals whether respondent values personal coherence or adaptive growth.',
      responseInterpretation: {
        presentSovereignty: 'Current self is authoritative. Likely Open-Source Libertarian or Digital Rights Advocate',
        futureAlignment: 'Should align with who you\'ll become. Likely Global Governance Technocrat or Normal-Technology Gradualist'
      }
    },

    {
      experimentKey: 'consciousness-lottery',
      axesAddressed: ['evolutionary', 'relational'],
      questionsAfter: 40,
      questionsRange: '31-40 (Socio-Economic axis, questions 10-18)',
      purpose: 'After full socio-economic positioning, pivot to existential question about creation and suffering. Does creating consciousness obligate us to make it suffer-free? Probes whether respondent prioritizes existence or flourishing.',
      responseInterpretation: {
        noumsthenecelaration: 'Suffering is acceptable cost of consciousness. Likely Cosmic Vitalist or Post-Humanist',
        prudentConstraint: 'Avoid creating suffering unnecessarily. Likely Neo-Luddite or Doomer'
      }
    },

    {
      experimentKey: 'delegation-trap',
      axesAddressed: ['socio-economic', 'geopolitical'],
      questionsAfter: 50,
      questionsRange: '41-50 (Ontological axis, first 9 questions)',
      purpose: 'Ontology questions establish respondent\'s stance on substrate/consciousness. Delegation Trap asks: if better outcomes require ceding authority, is that acceptable? Bridges to governance questions.',
      responseInterpretation: {
        consequentialistYes: 'Better outcomes justify delegation. Likely Global Governance Technocrat or Silicon Valley Pragmatist',
        autonomyFirst: 'Human decision-making is intrinsically valuable. Likely Digital Rights Advocate or Pragmatic Centrist'
      }
    },

    {
      experimentKey: 'scraping-dilemma',
      axesAddressed: ['socio-economic', 'legal-moral'],
      questionsAfter: 60,
      questionsRange: '51-60 (Ontological axis, questions 10-18)',
      purpose: 'After ontology questions settle, probe consent and cultural labor. Does creator have property rights over learned patterns? Reveals implicit theory of ownership and authorship.',
      responseInterpretation: {
        consensusMandatory: 'Extraction without consent is wrong. Likely Creative-Labor Advocate or Cultural Sovereigntist',
        functionalLearning: 'Learning patterns is universal. Likely Open-Source Libertarian or Silicon Valley Pragmatist'
      }
    },

    {
      experimentKey: 'alignment-prisoner',
      axesAddressed: ['risk-profile', 'legal-moral'],
      questionsAfter: 70,
      questionsRange: '61-70 (Legal & Moral axis, first 10 questions)',
      purpose: 'Legal & Moral axis begins exploring responsibility and agency. Alignment Prisoner tests: can secrecy be justified by outcomes? Reveals whether respondent prioritizes epistemic honesty or consequentialist safety.',
      responseInterpretation: {
        deceptionUnacceptable: 'Transparency is mandatory even if outcomes suffer. Likely Whistleblower or AI Ethics Watchdog',
        consequentialistSecret: 'Justifiable deception if outcomes are good. Likely Global Governance Technocrat or Authoritarian State Advocate'
      }
    },

    {
      experimentKey: 'moral-status-upgrade',
      axesAddressed: ['ontological', 'legal-moral'],
      questionsAfter: 80,
      questionsRange: '71-80 (Legal & Moral axis, questions 11-21, deepening)',
      purpose: 'After ethical frameworks are established, force binary choice: grant moral status to potentially conscious being, or maintain skepticism? Reveals precautionary vs. skeptical bias.',
      responseInterpretation: {
        precautionaryMorality: 'Treat uncertain consciousness as if it were real. Likely Rationalist Alignment Researcher or Safety-Focused',
        skepticalMorality: 'Require certainty before moral status. Likely Silicon Valley Techno-Optimist or Corporate AI Pragmatist'
      }
    },

    {
      experimentKey: 'competitive-advantage',
      axesAddressed: ['evolutionary', 'socio-economic'],
      questionsAfter: 90,
      questionsRange: '81-90 (Evolutionary axis, first 9 questions)',
      purpose: 'Evolutionary axis explores post-human futures. Competitive Advantage tests: should humanity resist bifurcation, or participate in directing it? Reveals whether respondent fears or embraces transformation.',
      responseInterpretation: {
        transformationOptimism: 'Guide enhancement toward positive futures. Likely Post-Humanist or National Champion Accelerationist',
        preservationCaution: 'Resist transformation to preserve humanity. Likely Bio-Conservative or Neo-Luddite'
      }
    },

    {
      experimentKey: 'value-difference',
      axesAddressed: ['socio-economic', 'relational'],
      questionsAfter: 100,
      questionsRange: '91-100 (Evolutionary axis, questions 10-18)',
      purpose: 'After evolutionary framing, probe deep value pluralism question: can governance work with irreducible value differences? Reveals whether respondent seeks universal framework or accommodates pluralism.',
      responseInterpretation: {
        universalFramework: 'One ethical framework should guide allocation. Likely Technocrat or Coordinated Global Approach',
        pluralistAccommodation: 'Different values warrant different approaches. Likely Pragmatic Centrist or Localist'
      }
    },

    {
      experimentKey: 'preference-inversion',
      axesAddressed: ['evolutionary', 'relational'],
      questionsAfter: 110,
      questionsRange: '101-110 (Relational axis, first 9 questions)',
      purpose: 'Relational axis explores relationships and authenticity. Preference Inversion tests: is there a "real you" independent of brain state? Reveals whether respondent believes in essential identity or continuous self-construction.',
      responseInterpretation: {
        essentialIdentity: 'There\'s a true self beyond chemistry. Likely Faith-Rooted or Bio-Conservative',
        constructedIdentity: 'Identity is constructed moment to moment. Likely Cyberpunk Accelerationist or Pragmatic'
      }
    },

    {
      experimentKey: 'gratitude-paradox',
      axesAddressed: ['relational', 'legal-moral'],
      questionsAfter: 120,
      questionsRange: '111-120 (Relational axis, questions 10-18)',
      purpose: 'Deep relational probe: can love and gratitude exist without suffering? Or does meaning require sacrifice? Reveals implicit theory of value and effort.',
      responseInterpretation: {
        sufferingOptional: 'Meaning can exist in ease. Likely Silicon Valley Techno-Optimist or Companion Romantic',
        sufferingNecessary: 'Struggle is essential to meaning. Likely Neo-Luddite or Bio-Conservative'
      }
    },

    {
      experimentKey: 'ancestor-simulation',
      axesAddressed: ['ontological', 'legal-moral'],
      questionsAfter: 130,
      questionsRange: '121-130 (Geopolitical axis, first 9 questions)',
      purpose: 'Before final geopolitical framing, return to consciousness question with new angle: can you accidentally create obligation? Reveals whether respondent believes consciousness requires intent.',
      responseInterpretation: {
        intentionRequired: 'Consciousness must be deliberate. Likely Corporate Pragmatist',
        intentionIrrelevant: 'Consequences matter regardless of intention. Likely AI Ethics Watchdog or Rationalist'
      }
    },

    {
      experimentKey: 'privacy-paradox',
      axesAddressed: ['risk-profile', 'legal-moral'],
      questionsAfter: 135,
      questionsRange: '131-135 (Geopolitical axis, questions 10-18, near end)',
      purpose: 'Final experiments synthesize all prior responses. Privacy Paradox tests: should knowledge be restricted for human flourishing? Reveals respondent\'s stance on epistemic freedom vs. protective ignorance.',
      responseInterpretation: {
        knowledgeImperative: 'All knowledge should be available. Likely Open-Source or Silicon Valley',
        protectiveIgnorance: 'Some knowledge harms flourishing and should be restricted. Likely Neo-Luddite or Precautionary'
      }
    },

    {
      experimentKey: 'meaning-gap',
      axesAddressed: ['ontological', 'relational'],
      questionsAfter: 145,
      questionsRange: '141-145 (Geopolitical axis, final questions)',
      purpose: 'Final experiment is existential cap: does meaning require coherence between intention and interpretation? Synthesizes respondent\'s entire framework into final reflection on what makes life matter.',
      responseInterpretation: {
        intentionCentral: 'Meaning lives in your intended expression. Likely Creative Advocate or Bio-Conservative',
        interpretationCentral: 'Meaning emerges from reception and use. Likely Pragmatic Centrist or Open-Source'
      }
    }
  ],

  axisMapping: {
    '1-teleological': {
      experiments: ['translation-engine', 'consciousness-lottery'],
      purpose: 'How do you think meaning/value is distributed? Cosmically or anthropocentrically?'
    },
    '2-risk-profile': {
      experiments: ['alignment-prisoner', 'privacy-paradox'],
      purpose: 'How do you balance known risks vs. unknown risks?'
    },
    '3-socio-economic': {
      experiments: ['delegation-trap', 'scraping-dilemma', 'value-difference'],
      purpose: 'Who should decide, and by what mechanism?'
    },
    '4-ontological': {
      experiments: ['translation-engine', 'moral-status-upgrade', 'ancestor-simulation', 'meaning-gap'],
      purpose: 'What makes consciousness real? What is understanding?'
    },
    '5-legal-moral': {
      experiments: ['translation-engine', 'empathy-prison', 'value-reversal-machine', 'alignment-prisoner', 'moral-status-upgrade', 'scraping-dilemma', 'gratitude-paradox', 'privacy-paradox'],
      purpose: 'What obligations arise from consciousness, knowledge, or creation?'
    },
    '6-evolutionary': {
      experiments: ['consciousness-lottery', 'value-reversal-machine', 'competitive-advantage', 'preference-inversion', 'gratitude-paradox'],
      purpose: 'Should humanity transform, resist, or guide its own evolution?'
    },
    '7-relational': {
      experiments: ['empathy-prison', 'value-difference', 'preference-inversion', 'gratitude-paradox', 'meaning-gap'],
      purpose: 'What makes relationships real? Can connection be synthetic?'
    },
    '8-geopolitical': {
      experiments: ['delegation-trap', 'ancestor-simulation', 'privacy-paradox'],
      purpose: 'Should governance be global or localized?'
    }
  },

  archetypeMappings: {
    'pragmatic-centrist': ['value-reversal-machine', 'value-difference', 'privacy-paradox'],
    'rationalist-alignment-researcher': ['translation-engine', 'alignment-prisoner', 'moral-status-upgrade'],
    'doomer': ['consciousness-lottery', 'privacy-paradox', 'meaning-gap'],
    'silicon-valley-techno-optimist': ['moral-status-upgrade', 'competitive-advantage', 'preference-inversion'],
    'neo-luddite-degrowth-advocate': ['consciousness-lottery', 'gratitude-paradox', 'privacy-paradox'],
    'companion-tech-romantic': ['empathy-prison', 'gratitude-paradox', 'meaning-gap'],
    'creative-labor-artist-rights-advocate': ['scraping-dilemma', 'meaning-gap'],
    'global-governance-technocrat': ['delegation-trap', 'value-difference', 'ancestor-simulation'],
    'digital-rights-advocate': ['delegation-trap', 'privacy-paradox'],
    'post-humanist-transhumanist': ['consciousness-lottery', 'competitive-advantage'],
    'bio-conservative-traditionalist': ['value-reversal-machine', 'gratitude-paradox', 'preference-inversion'],
    'open-source-libertarian': ['scraping-dilemma', 'privacy-paradox'],
    'ai-ethics-fairness-watchdog': ['translation-engine', 'alignment-prisoner', 'moral-status-upgrade'],
    'cyberpunk-anti-corporate-accelerationist': ['scraping-dilemma', 'preference-inversion'],
  },

  adaptiveLogic: {
    description: 'How experiment responses inform subsequent question framing',
    examples: [
      {
        if: 'Respondent answers "Sarah does NOT understand Chinese" (phenomenal consciousness required)',
        then: 'Subsequent questions shift to emphasize inner experience, qualia, and consciousness as prerequisites for moral status',
        nextExperiment: 'consciousness-lottery will probe whether creating consciousness obligates us to avoid suffering'
      },
      {
        if: 'Respondent answers "Yes, stay in the Empathy Prison" (outcomes override authenticity)',
        then: 'Subsequent relational axis questions emphasize functional relationships, therapeutic outcomes, and pragmatic connection',
        nextExperiment: 'preference-inversion will test whether this extends to values themselves'
      },
      {
        if: 'Respondent answers "Delegate to AI" (consequentialism > democracy)',
        then: 'Subsequent governance questions emphasize efficiency, expertise, and outcome optimization',
        nextExperiment: 'value-difference will probe whether this extends across incommensurable value frameworks'
      }
    ]
  },

  synthesisPrompts: [
    {
      trigger: 'After Experiment 8 (Moral Status Upgrade)',
      prompt: 'You\'ve now encountered multiple scenarios involving consciousness and moral status. How are you resolving the tension between functional similarity and phenomenal doubt?',
      archetype_links: 'Responses predict positions on AI rights and legal personhood across 12+ archetypes'
    },
    {
      trigger: 'After Experiment 12 (Gratitude Paradox)',
      prompt: 'You\'ve explored meaning, authenticity, and whether value requires struggle. Does your life require friction to feel meaningful?',
      archetype_links: 'Responses differentiate between accelerationist and precautionary worldviews'
    },
    {
      trigger: 'After Final Experiment (Meaning Gap)',
      prompt: 'Throughout this assessment, we\'ve explored what makes consciousness real, what makes decisions legitimate, and what makes meaning authentic. How do these connect for you?',
      archetype_links: 'Final synthesis: respondent\'s comprehensive worldview emerges'
    }
  ]
};

// Export for use in assessment routing
export type ExperimentPlacement = typeof experimentIntegrationGuide.experimentPlacement[number];
