/**
 * Adaptive Logic for Experiments
 * Uses experiment responses to inform framing of subsequent questions
 */

interface ExperimentResponse {
  experimentKey: string;
  mainResponse: string | null;
  followUpResponses: Record<string, boolean>;
  timestamp: string;
}

interface AdaptationContext {
  experimentResponses: ExperimentResponse[];
  currentAxisIndex: number;
  currentQuestion?: string;
}

/**
 * Determines how to frame the next question based on experiment history
 */
export function getAdaptiveFraming(context: AdaptationContext): {
  framingShift?: string;
  emphasize?: string[];
  deemphasize?: string[];
} {
  if (context.experimentResponses.length === 0) {
    return {};
  }

  const lastResponse = context.experimentResponses[context.experimentResponses.length - 1];

  // Map experiment responses to framing shifts
  const framingMap: Record<string, Record<string, any>> = {
    'translation-engine': {
      'Sarah does NOT understand Chinese': {
        framingShift: 'consciousness-centric',
        emphasize: ['phenomenal experience', 'inner consciousness', 'qualia'],
        deemphasize: ['functional output', 'optimization'],
      },
      'Sarah understands perfectly': {
        framingShift: 'function-centric',
        emphasize: ['outcomes', 'behavior', 'capability'],
        deemphasize: ['inner experience', 'consciousness claims'],
      },
    },

    'empathy-prison': {
      "Stay in the AI's care": {
        framingShift: 'pragmatic-relational',
        emphasize: ['outcomes', 'wellbeing', 'functional connection'],
        deemphasize: ['authenticity', 'genuine feeling'],
      },
      'Reject the simulation': {
        framingShift: 'authenticity-relational',
        emphasize: ['genuine connection', 'real understanding', 'mutual reciprocity'],
        deemphasize: ['outcomes alone'],
      },
    },

    'delegation-trap': {
      'Delegate to AI': {
        framingShift: 'consequentialist',
        emphasize: ['outcomes', 'efficiency', 'optimization'],
        deemphasize: ['process', 'autonomy'],
      },
      'Retain human authority': {
        framingShift: 'autonomy-centric',
        emphasize: ['human agency', 'democratic control', 'process integrity'],
        deemphasize: ['pure outcomes'],
      },
    },

    'moral-status-upgrade': {
      'Grant moral status': {
        framingShift: 'precautionary-consciousness',
        emphasize: ['potential consciousness', 'moral caution', 'rights expansion'],
        deemphasize: ['skepticism', 'certainty requirements'],
      },
      'Withhold moral status': {
        framingShift: 'skeptical-consciousness',
        emphasize: ['evidence requirements', 'consciousness verification', 'caution'],
        deemphasize: ['speculation', 'precaution alone'],
      },
    },

    'competitive-advantage': {
      'Embrace enhancement': {
        framingShift: 'transformation-optimist',
        emphasize: ['positive futures', 'guided evolution', 'progress'],
        deemphasize: ['preservation', 'risk aversion'],
      },
      'Resist enhancement': {
        framingShift: 'preservation-caution',
        emphasize: ['human limits as features', 'risk minimization', 'continuity'],
        deemphasize: ['transformation', 'optimization'],
      },
    },
  };

  const responseKey = lastResponse.mainResponse || '';
  const experimentFraming = framingMap[lastResponse.experimentKey];

  if (experimentFraming && experimentFraming[responseKey]) {
    return experimentFraming[responseKey];
  }

  return {};
}

/**
 * Generates a synthesis prompt based on experiment responses
 * Used to help respondent reflect on their worldview
 */
export function generateSynthesisPrompt(
  responses: ExperimentResponse[],
  triggerExperiment: string
): string {
  const prompts: Record<string, string> = {
    'moral-status-upgrade': `You've now encountered multiple scenarios involving consciousness and moral status.
    Looking back at your responses to the Translation Engine and Moral Status Upgrade experiments,
    how are you resolving the tension between functional similarity and phenomenal doubt?
    What threshold of evidence would convince you that another being (human, AI, or otherwise) deserves moral consideration?`,

    'gratitude-paradox': `You've explored meaning, authenticity, and whether value requires struggle.
    In your reflection on the Gratitude Paradox, you touched on something deep: does meaning require sacrifice?
    How does this connect to other moments in this assessment where you valued effort, consequence, or cost?`,

    'meaning-gap': `Throughout this assessment, we've explored what makes consciousness real, what makes decisions legitimate,
    and what makes meaning authentic. How do these three questions connect for you? Is there a thread linking your views on
    consciousness, autonomy, and meaning?`,
  };

  return prompts[triggerExperiment] || '';
}

/**
 * Predicts likely archetype based on experiment responses
 * Used to validate final archetype matching
 */
export function predictArchetypeFromExperiments(
  responses: ExperimentResponse[]
): { archetype: string; confidence: number }[] {
  const archetypeScores: Record<string, number> = {};

  // Scoring logic based on experiment responses
  responses.forEach((response) => {
    const { experimentKey, mainResponse } = response;

    // Example: Translation Engine responses predict consciousness positions
    if (experimentKey === 'translation-engine') {
      if (
        mainResponse?.includes('understand') ||
        mainResponse?.includes('consciousness')
      ) {
        archetypeScores['rationalist-alignment-researcher'] =
          (archetypeScores['rationalist-alignment-researcher'] || 0) + 2;
        archetypeScores['bio-conservative'] =
          (archetypeScores['bio-conservative'] || 0) + 1;
      } else {
        archetypeScores['silicon-valley-techno-optimist'] =
          (archetypeScores['silicon-valley-techno-optimist'] || 0) + 2;
      }
    }

    // Empathy Prison predicts relational positions
    if (experimentKey === 'empathy-prison') {
      if (mainResponse?.includes('authentic')) {
        archetypeScores['companion-tech-romantic'] =
          (archetypeScores['companion-tech-romantic'] || 0) + 2;
      } else if (mainResponse?.includes('outcome')) {
        archetypeScores['silicon-valley-pragmatist'] =
          (archetypeScores['silicon-valley-pragmatist'] || 0) + 2;
      }
    }

    // More experiments would add more scoring logic...
  });

  // Sort by score and return top predictions
  const sorted = Object.entries(archetypeScores)
    .sort(([, a], [, b]) => b - a)
    .map(([archetype, score]) => ({
      archetype,
      confidence: Math.min(score / 10, 1), // Normalize to 0-1
    }));

  return sorted.length > 0 ? sorted : [{ archetype: 'pragmatic-centrist', confidence: 0.5 }];
}

export default {
  getAdaptiveFraming,
  generateSynthesisPrompt,
  predictArchetypeFromExperiments,
};
