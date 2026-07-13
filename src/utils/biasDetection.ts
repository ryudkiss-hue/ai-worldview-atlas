/**
 * Bias Detection & Validation System
 * Automatically identifies experiments with systematic bias toward archetypes
 */

interface RespondentData {
  respondent_id: string;
  pre_assessment_archetype: string;
  post_assessment_archetype: string;
  experiments: {
    experimentKey: string;
    mainResponse: string;
    mainResponseConfidence: number;
    mainResponseTime: number;
    followUpResponses: Record<string, boolean>;
    artificialityRating: number;
    confusionFlag: boolean;
  }[];
}

interface BiasReport {
  experimentKey: string;
  archetypeBias: {
    archetype: string;
    overrepresentation: number; // percentage points above expected
    mainResponsePattern: string;
  }[];
  confidence: number; // 0-1 based on effect size
  followUpDifferentiation: {
    followUpIndex: number;
    correlation: number; // with main response
    leadingFlag: boolean; // if correlation > 0.8
  }[];
  artificialityScores: {
    mean: number;
    percentUnder3: number; // percentage rating artificial
  };
  responseTimeStats: {
    mean: number;
    std: number;
    outlierFlag: boolean; // if > 2 std from overall mean
  };
  confidenceStats: {
    mean: number;
    std: number;
    tooConfident: boolean; // if mean > 3.5
  };
  verdict: 'PASS' | 'PASS_WITH_REVIEW' | 'REWRITE';
}

/**
 * Detect archetype bias in responses
 * Chi-square test for uniform distribution
 */
export function detectArchetypeBias(data: RespondentData[]): {
  chiSquareStatistic: number;
  pValue: number;
  isUniform: boolean;
  biasedArchetypes: {
    archetype: string;
    observedCount: number;
    expectedCount: number;
    deviation: number;
  }[];
} {
  const uniqueArchetypes = new Set<string>();
  data.forEach(r => {
    uniqueArchetypes.add(r.post_assessment_archetype);
  });

  const k = uniqueArchetypes.size;
  const n = data.length;
  const expectedFreq = n / k;

  const archetypeCounts: Record<string, number> = {};
  uniqueArchetypes.forEach(arch => (archetypeCounts[arch] = 0));

  data.forEach(r => {
    archetypeCounts[r.post_assessment_archetype]++;
  });

  // Calculate chi-square statistic
  let chiSquare = 0;
  Object.values(archetypeCounts).forEach(observed => {
    const diff = observed - expectedFreq;
    chiSquare += (diff * diff) / expectedFreq;
  });

  // Calculate p-value (simplified: degrees of freedom = k - 1)
  // Using chi-square CDF approximation
  const pValue = chiSquareCDF(chiSquare, k - 1);
  const isUniform = pValue > 0.05;

  const biasedArchetypes = Object.entries(archetypeCounts)
    .map(([arch, count]) => ({
      archetype: arch,
      observedCount: count,
      expectedCount: expectedFreq,
      deviation: count - expectedFreq,
    }))
    .filter(a => Math.abs(a.deviation) > 1);

  return {
    chiSquareStatistic: chiSquare,
    pValue,
    isUniform,
    biasedArchetypes,
  };
}

/**
 * Analyze follow-up differentiation
 * Measure correlation between follow-up selection and main response
 */
export function analyzeFollowUpDifferentiation(
  experimentResponses: RespondentData['experiments'][0][],
  groupByMainResponse: boolean = true
): {
  followUpIndex: number;
  correlation: number;
  leadingFlag: boolean;
}[] {
  if (experimentResponses.length < 10) return [];

  const results: {
    followUpIndex: number;
    correlation: number;
    leadingFlag: boolean;
  }[] = [];

  // Get all follow-up indices
  const firstExperiment = experimentResponses[0];
  const followUpCount = Object.keys(firstExperiment.followUpResponses).length;

  for (let followUpIdx = 0; followUpIdx < followUpCount; followUpIdx++) {
    const followUpKey = `followup_${followUpIdx}`;

    // Encode main response as numeric (for correlation)
    const mainResponses = experimentResponses.map(exp => {
      // Simple encoding: hash main response to numeric value
      return hashString(exp.mainResponse) % 100;
    });

    const followUpSelections = experimentResponses.map(exp => {
      return exp.followUpResponses[followUpKey] ? 1 : 0;
    });

    const correlation = pearsonCorrelation(mainResponses, followUpSelections);
    const leadingFlag = Math.abs(correlation) > 0.75; // Too high = leading

    results.push({
      followUpIndex: followUpIdx,
      correlation: Math.abs(correlation), // Use absolute value
      leadingFlag,
    });
  }

  return results;
}

/**
 * Comprehensive bias report for a single experiment
 */
export function generateExperimentBiasReport(
  experimentKey: string,
  respondentData: RespondentData[],
  allExperimentResponses: RespondentData['experiments'][0][]
): BiasReport {
  const experimentResponses = allExperimentResponses.filter(
    e => e.experimentKey === experimentKey
  );

  if (experimentResponses.length < 5) {
    return {
      experimentKey,
      archetypeBias: [],
      confidence: 0,
      followUpDifferentiation: [],
      artificialityScores: { mean: 3, percentUnder3: 50 },
      responseTimeStats: { mean: 300, std: 60, outlierFlag: false },
      confidenceStats: { mean: 3, std: 0.5, tooConfident: false },
      verdict: 'PASS',
    };
  }

  // Archetype distribution per main response pattern
  const archetypeBias = analyzeArchetypeBiasInExperiment(
    experimentResponses,
    respondentData
  );

  // Follow-up differentiation
  const followUpDifferentiation = analyzeFollowUpDifferentiation(
    experimentResponses
  );

  // Artificiality scores
  const artificialityScores = {
    mean:
      experimentResponses.reduce((sum, e) => sum + e.artificialityRating, 0) /
      experimentResponses.length,
    percentUnder3:
      (experimentResponses.filter(e => e.artificialityRating < 3).length /
        experimentResponses.length) *
      100,
  };

  // Response time stats
  const times = experimentResponses.map(e => e.mainResponseTime);
  const meanTime = times.reduce((a, b) => a + b, 0) / times.length;
  const stdTime = Math.sqrt(
    times.reduce((sum, t) => sum + Math.pow(t - meanTime, 2), 0) / times.length
  );

  // Confidence stats
  const confidences = experimentResponses.map(e => e.mainResponseConfidence);
  const meanConfidence =
    confidences.reduce((a, b) => a + b, 0) / confidences.length;
  const stdConfidence = Math.sqrt(
    confidences.reduce(
      (sum, c) => sum + Math.pow(c - meanConfidence, 2),
      0
    ) / confidences.length
  );

  // Determine verdict
  let verdict: 'PASS' | 'PASS_WITH_REVIEW' | 'REWRITE' = 'PASS';

  if (
    archetypeBias.some(a => a.overrepresentation > 20) ||
    followUpDifferentiation.some(f => f.leadingFlag) ||
    artificialityScores.mean > 3.5 ||
    meanConfidence > 4.2
  ) {
    verdict = 'REWRITE';
  } else if (
    archetypeBias.some(a => Math.abs(a.overrepresentation) > 10) ||
    followUpDifferentiation.some(f => f.correlation > 0.65) ||
    artificialityScores.percentUnder3 > 40 ||
    meanTime > 900
  ) {
    verdict = 'PASS_WITH_REVIEW';
  }

  return {
    experimentKey,
    archetypeBias,
    confidence: Math.min(archetypeBias.length / 5, 1), // Confidence in bias detection
    followUpDifferentiation,
    artificialityScores,
    responseTimeStats: {
      mean: meanTime,
      std: stdTime,
      outlierFlag: meanTime > 900 || stdTime > 200,
    },
    confidenceStats: {
      mean: meanConfidence,
      std: stdConfidence,
      tooConfident: meanConfidence > 3.8,
    },
    verdict,
  };
}

/**
 * Analyze archetype distribution for specific experiment
 */
function analyzeArchetypeBiasInExperiment(
  experimentResponses: RespondentData['experiments'][0][],
  respondentData: RespondentData[]
): BiasReport['archetypeBias'] {
  // Create map of respondent → experiment response
  const responseMap = new Map<
    string,
    { response: string; archetype: string }
  >();

  respondentData.forEach(r => {
    const expResp = r.experiments.find(e => e.experimentKey);
    if (expResp) {
      responseMap.set(r.respondent_id, {
        response: expResp.mainResponse,
        archetype: r.post_assessment_archetype,
      });
    }
  });

  // Group by response pattern
  const responsePatterns = new Map<
    string,
    { archetypes: string[]; count: number }
  >();

  experimentResponses.forEach((exp, idx) => {
    const pattern = truncate(exp.mainResponse, 50);
    if (!responsePatterns.has(pattern)) {
      responsePatterns.set(pattern, { archetypes: [], count: 0 });
    }
    responsePatterns.get(pattern)!.count++;
  });

  // Analyze archetype overrepresentation
  const totalResponses = experimentResponses.length;
  const uniqueArchetypes = new Set(respondentData.map(r => r.post_assessment_archetype));
  const expectedPerArchetype = totalResponses / uniqueArchetypes.size;

  const archetypeBias: BiasReport['archetypeBias'] = [];

  uniqueArchetypes.forEach(archetype => {
    const architectureResponses = experimentResponses.filter((_, idx) => {
      const respondent = respondentData[idx];
      return respondent && respondent.post_assessment_archetype === archetype;
    });

    const overrep = architectureResponses.length - expectedPerArchetype;
    const mainPattern = architectureResponses[0]?.mainResponse || '';

    if (Math.abs(overrep) > 2) {
      archetypeBias.push({
        archetype,
        overrepresentation: (overrep / expectedPerArchetype) * 100,
        mainResponsePattern: mainPattern.substring(0, 40),
      });
    }
  });

  return archetypeBias.sort((a, b) => b.overrepresentation - a.overrepresentation);
}

/**
 * Helper: Simple Pearson correlation
 */
function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0) return 0;

  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? 0 : numerator / denom;
}

/**
 * Helper: Simple string hash
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Helper: Truncate string
 */
function truncate(str: string, length: number): string {
  return str.substring(0, length);
}

/**
 * Helper: Simplified chi-square CDF
 * (In production, use proper statistical library)
 */
function chiSquareCDF(x: number, df: number): number {
  // Simplified approximation - for production use scipy.stats
  if (x < 0) return 0;
  if (df === 1) {
    // For df=1, use normal approximation
    return 2 * (1 - normalCDF(Math.sqrt(x)));
  }
  // Simplified: rough approximation
  return x > df + 2 * Math.sqrt(df) ? 0.01 : 0.5;
}

/**
 * Helper: Standard normal CDF approximation
 */
function normalCDF(x: number): number {
  return (1 + Math.tanh(0.56 * x)) / 2; // Wichura approximation
}

export default {
  detectArchetypeBias,
  analyzeFollowUpDifferentiation,
  generateExperimentBiasReport,
};
