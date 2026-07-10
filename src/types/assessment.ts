/**
 * Assessment Response Data Types
 * TypeScript interfaces for pilot data collection
 */

export interface ExperimentResponse {
  experimentKey: string;
  mainResponse: string | null;
  mainResponseConfidence: number; // 1-5 Likert
  mainResponseTime: number; // seconds
  followUpResponses: Record<string, boolean>;
  artificialityRating: number; // 1-5
  confusionFlag: boolean;
  timestamp: string;
}

export interface QuestionResponse {
  response: string | string[];
  confidence?: number; // 1-5 if provided
  timeSpent: number; // milliseconds
  timestamp: string;
}

export interface RespondentMetadata {
  respondent_id: string;
  session_start_time: string;
  session_end_time: string;
  total_time_spent: number; // milliseconds
  pre_assessment_archetype?: string;
  post_assessment_archetype?: string;
}

export interface PilotResponse extends RespondentMetadata {
  experiments: ExperimentResponse[];
  question_responses: Record<string, QuestionResponse>;
  completion_status: 'incomplete' | 'completed' | 'partial';
  data_version: string;
}

/**
 * Archetype definitions matching the 50+ archetypes
 */
export const ARCHETYPES = {
  pragmaticCentrist: 'Pragmatic Centrist',
  rationalistAlignmentResearcher: 'Rationalist Alignment Researcher',
  doomer: 'Doomer',
  siliconValleyTechnoOptimist: 'Silicon Valley Techno-Optimist',
  neoLuddite: 'Neo-Luddite / Degrowth Advocate',
  companionTechRomantic: 'Companion-Tech Romantic',
  creativeLabor: 'Creative Labor / Artist Rights Advocate',
  globalGovernanceTechnocrat: 'Global Governance Technocrat',
  digitalRightsAdvocate: 'Digital Rights Advocate',
  postHumanist: 'Post-Humanist / Transhumanist',
  bioConservative: 'Bio-Conservative / Traditionalist',
  openSourceLibertarian: 'Open-Source Libertarian',
} as const;

export type Archetype = typeof ARCHETYPES[keyof typeof ARCHETYPES];

/**
 * Pre-screening questionnaire response
 */
export interface PreScreeningResponse {
  respondent_id: string;
  answers: number[]; // 10 items, 1-5 scale each
  calculated_archetype: Archetype;
  archetype_confidence: number; // 0-1
  eligible: boolean; // Passes filtering criteria
  timestamp: string;
}

/**
 * Pilot statistics (computed from responses)
 */
export interface PilotStatistics {
  total_respondents: number;
  completion_rate: number; // 0-1
  archetype_distribution: Record<Archetype, number>;
  chi_square_statistic: number;
  chi_square_p_value: number;
  mean_response_time: number; // seconds
  std_response_time: number;
  mean_confidence: number; // 1-5
  std_confidence: number;
  mean_artificiality: number; // 1-5
  percent_authentic: number; // % rating >3
  follow_up_differentiation: Record<string, number>; // correlation per follow-up
  overall_rigor_score: number; // 8.8-10.0
  bias_detected: boolean;
}

/**
 * Pilot report summary
 */
export interface PilotReport {
  metadata: {
    report_date: string;
    pilot_duration_days: number;
    sample_size: number;
    target_size: number;
  };
  statistics: PilotStatistics;
  findings: {
    title: string;
    biased_experiments: string[];
    recommendations: string[];
  };
  validation_certificate: {
    chi_square_p_value: number;
    rigor_score: number;
    approved_for_deployment: boolean;
  };
}

/**
 * Experiment metadata for validation
 */
export interface ExperimentMetadata {
  key: string;
  title: string;
  tier: number; // 1-4
  axes: string[];
  archetypes: string[];
  red_team_verdict: 'PASS' | 'PASS_WITH_FIX' | 'REWRITE';
  rigor_score: number; // 8.0-9.5
}

/**
 * Helper: Create empty response for respondent
 */
export function createEmptyResponse(respondentId: string): PilotResponse {
  return {
    respondent_id: respondentId,
    session_start_time: new Date().toISOString(),
    session_end_time: '',
    total_time_spent: 0,
    experiments: [],
    question_responses: {},
    completion_status: 'incomplete',
    data_version: '1.0',
  };
}

/**
 * Helper: Validate response completeness
 */
export function validateResponse(response: PilotResponse): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!response.respondent_id) errors.push('Missing respondent_id');
  if (!response.session_start_time) errors.push('Missing session_start_time');
  if (Object.keys(response.question_responses).length < 100)
    errors.push('Less than 100 questions answered');
  if (response.experiments.length < 15)
    errors.push('Less than 15 experiments completed');

  return {
    valid: errors.length === 0,
    errors,
  };
}
