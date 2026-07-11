/**
 * 171-Question Assessment
 * 145 core questions (8 axes × 18 questions + 1 synthesis)
 * + 26 narrative experiments integrated as formal items
 * Total: 171 questions
 */

import { narrativeExperiments } from './narrativeExperiments';
import { narrativeExperimentsB } from './narrativeExperimentsB';
import { narrativeExperimentsC } from './narrativeExperimentsC';
import { narrativeExperimentsD } from './narrativeExperimentsD';

export interface Question {
  id: string;
  axis: string;
  text: string;
  subtext?: string;
  type: 'likert' | 'text' | 'choice';
  options?: string[];
}

export const assessmentQuestions: Question[] = [
  // AXIS 1: TELEOLOGICAL (Questions 1-18)
  {
    id: 'q1',
    axis: 'teleological',
    text: 'Does the universe have inherent purpose or meaning?',
    type: 'likert',
  },
  {
    id: 'q2',
    axis: 'teleological',
    text: 'Should humanity aim to maximize flourishing, or preserve what makes us human?',
    type: 'likert',
  },
  {
    id: 'q3',
    axis: 'teleological',
    text: 'Is progress inevitable, or does it depend on deliberate choices?',
    type: 'likert',
  },
  {
    id: 'q4',
    axis: 'teleological',
    text: 'Should we optimize for happiness or meaning?',
    type: 'likert',
  },
  {
    id: 'q5',
    axis: 'teleological',
    text: 'Do you think consciousness is cosmically significant?',
    type: 'likert',
  },
  // EXPERIMENT 1: Translation Engine (after Q5)
  {
    id: 'q6',
    axis: 'teleological',
    text: 'What is the ultimate goal of technological development?',
    type: 'likert',
  },
  {
    id: 'q7',
    axis: 'teleological',
    text: 'Should humanity aim for transcendence or preservation?',
    type: 'likert',
  },
  {
    id: 'q8',
    axis: 'teleological',
    text: 'Is the expansion of consciousness intrinsically valuable?',
    type: 'likert',
  },
  {
    id: 'q9',
    axis: 'teleological',
    text: 'Should we prioritize cosmic impact over immediate wellbeing?',
    type: 'likert',
  },
  {
    id: 'q10',
    axis: 'teleological',
    text: 'Does humanity have special moral status in the universe?',
    type: 'likert',
  },
  // EXPERIMENT 2: Empathy Prison (after Q10)
  {
    id: 'q11',
    axis: 'teleological',
    text: 'What makes life objectively meaningful?',
    type: 'text',
  },
  {
    id: 'q12',
    axis: 'teleological',
    text: 'Should we value authenticity or outcomes more?',
    type: 'likert',
  },
  {
    id: 'q13',
    axis: 'teleological',
    text: 'Is suffering necessary for meaning?',
    type: 'likert',
  },
  {
    id: 'q14',
    axis: 'teleological',
    text: 'What is humanity\'s role in the cosmos?',
    type: 'text',
  },
  {
    id: 'q15',
    axis: 'teleological',
    text: 'Should we aim to leave a legacy?',
    type: 'likert',
  },
  {
    id: 'q16',
    axis: 'teleological',
    text: 'Is there a "right" way to live?',
    type: 'likert',
  },
  {
    id: 'q17',
    axis: 'teleological',
    text: 'What would justify the existence of suffering?',
    type: 'text',
  },
  {
    id: 'q18',
    axis: 'teleological',
    text: 'Should progress be continuous or episodic?',
    type: 'likert',
  },

  // AXIS 2: RISK PROFILE (Questions 19-36)
  {
    id: 'q19',
    axis: 'risk-profile',
    text: 'How should we approach unknown risks?',
    type: 'likert',
  },
  {
    id: 'q20',
    axis: 'risk-profile',
    text: 'Should we prioritize preventing catastrophe or enabling flourishing?',
    type: 'likert',
  },
  {
    id: 'q21',
    axis: 'risk-profile',
    text: 'Is precaution more important than progress?',
    type: 'likert',
  },
  {
    id: 'q22',
    axis: 'risk-profile',
    text: 'How confident must we be before acting?',
    type: 'likert',
  },
  {
    id: 'q23',
    axis: 'risk-profile',
    text: 'Should we ban technologies that might be dangerous?',
    type: 'likert',
  },
  // EXPERIMENT 3: Value Reversal Machine (after Q23)
  {
    id: 'q24',
    axis: 'risk-profile',
    text: 'What is the worst possible outcome for humanity?',
    type: 'text',
  },
  {
    id: 'q25',
    axis: 'risk-profile',
    text: 'Should we prioritize tail risks or likely risks?',
    type: 'likert',
  },
  {
    id: 'q26',
    axis: 'risk-profile',
    text: 'Is extinction worse than gradual decline?',
    type: 'likert',
  },
  {
    id: 'q27',
    axis: 'risk-profile',
    text: 'How much certainty do we need before restricting technology?',
    type: 'likert',
  },
  {
    id: 'q28',
    axis: 'risk-profile',
    text: 'Should we slow down to be safer?',
    type: 'likert',
  },
  // EXPERIMENT 4: Consciousness Lottery (after Q28)
  {
    id: 'q29',
    axis: 'risk-profile',
    text: 'Is it better to avoid creating new beings than risk their suffering?',
    type: 'likert',
  },
  {
    id: 'q30',
    axis: 'risk-profile',
    text: 'How do you weigh small risks to many vs. large risks to few?',
    type: 'likert',
  },
  {
    id: 'q31',
    axis: 'risk-profile',
    text: 'Should we trust expert predictions about AI risk?',
    type: 'likert',
  },
  {
    id: 'q32',
    axis: 'risk-profile',
    text: 'Is inaction itself a risky choice?',
    type: 'likert',
  },
  {
    id: 'q33',
    axis: 'risk-profile',
    text: 'What would change your mind about AI safety?',
    type: 'text',
  },
  {
    id: 'q34',
    axis: 'risk-profile',
    text: 'Should we prioritize reversible or irreversible risks?',
    type: 'likert',
  },
  {
    id: 'q35',
    axis: 'risk-profile',
    text: 'Is optimism or pessimism more justified?',
    type: 'likert',
  },
  {
    id: 'q36',
    axis: 'risk-profile',
    text: 'How confident are you in your risk assessments?',
    type: 'likert',
  },

  // AXIS 3: SOCIO-ECONOMIC (Questions 37-54)
  {
    id: 'q37',
    axis: 'socio-economic',
    text: 'Who should make decisions about technology deployment?',
    type: 'likert',
  },
  {
    id: 'q38',
    axis: 'socio-economic',
    text: 'Should wealth be concentrated or distributed?',
    type: 'likert',
  },
  {
    id: 'q39',
    axis: 'socio-economic',
    text: 'Is capitalism necessary or harmful?',
    type: 'likert',
  },
  {
    id: 'q40',
    axis: 'socio-economic',
    text: 'Should markets or democracy govern technology?',
    type: 'likert',
  },
  {
    id: 'q41',
    axis: 'socio-economic',
    text: 'What is the purpose of economic systems?',
    type: 'text',
  },
  // EXPERIMENT 5: Delegation Trap (after Q41)
  {
    id: 'q42',
    axis: 'socio-economic',
    text: 'Should experts or citizens decide policy?',
    type: 'likert',
  },
  {
    id: 'q43',
    axis: 'socio-economic',
    text: 'Is inequality acceptable if it creates growth?',
    type: 'likert',
  },
  {
    id: 'q44',
    axis: 'socio-economic',
    text: 'Should corporations be regulated or trusted?',
    type: 'likert',
  },
  {
    id: 'q45',
    axis: 'socio-economic',
    text: 'Who benefits from technology?',
    type: 'text',
  },
  {
    id: 'q46',
    axis: 'socio-economic',
    text: 'Should technology be owned by many or few?',
    type: 'likert',
  },
  // EXPERIMENT 6: Scraping Dilemma (after Q46)
  {
    id: 'q47',
    axis: 'socio-economic',
    text: 'Do creators own their intellectual output?',
    type: 'likert',
  },
  {
    id: 'q48',
    axis: 'socio-economic',
    text: 'Should labor be compensated or automated?',
    type: 'likert',
  },
  {
    id: 'q49',
    axis: 'socio-economic',
    text: 'What does a just economy look like?',
    type: 'text',
  },
  {
    id: 'q50',
    axis: 'socio-economic',
    text: 'Should technology reduce scarcity or preserve markets?',
    type: 'likert',
  },
  {
    id: 'q51',
    axis: 'socio-economic',
    text: 'Is efficiency the primary goal of society?',
    type: 'likert',
  },
  {
    id: 'q52',
    axis: 'socio-economic',
    text: 'Should we prioritize growth or stability?',
    type: 'likert',
  },
  {
    id: 'q53',
    axis: 'socio-economic',
    text: 'What role should government play in technology?',
    type: 'text',
  },
  {
    id: 'q54',
    axis: 'socio-economic',
    text: 'Should technology serve people or people serve technology?',
    type: 'likert',
  },

  // AXIS 4: ONTOLOGICAL (Questions 55-72)
  {
    id: 'q55',
    axis: 'ontological',
    text: 'What is consciousness?',
    type: 'text',
  },
  {
    id: 'q56',
    axis: 'ontological',
    text: 'Can machines be conscious?',
    type: 'likert',
  },
  {
    id: 'q57',
    axis: 'ontological',
    text: 'What is understanding?',
    type: 'text',
  },
  {
    id: 'q58',
    axis: 'ontological',
    text: 'Is consciousness substrate-independent?',
    type: 'likert',
  },
  {
    id: 'q59',
    axis: 'ontological',
    text: 'Does qualia matter morally?',
    type: 'likert',
  },
  // EXPERIMENT 7: Alignment Prisoner (after Q59)
  {
    id: 'q60',
    axis: 'ontological',
    text: 'What is the hard problem of consciousness?',
    type: 'text',
  },
  {
    id: 'q61',
    axis: 'ontological',
    text: 'Can we ever know another\'s inner experience?',
    type: 'likert',
  },
  {
    id: 'q62',
    axis: 'ontological',
    text: 'Is consciousness necessary for moral status?',
    type: 'likert',
  },
  {
    id: 'q63',
    axis: 'ontological',
    text: 'What is the relationship between mind and matter?',
    type: 'text',
  },
  {
    id: 'q64',
    axis: 'ontological',
    text: 'Could simulation realism make simulated beings conscious?',
    type: 'likert',
  },
  // EXPERIMENT 8: Moral Status Upgrade (after Q64)
  {
    id: 'q65',
    axis: 'ontological',
    text: 'How would you verify another being\'s consciousness?',
    type: 'text',
  },
  {
    id: 'q66',
    axis: 'ontological',
    text: 'Is functionalism adequate to explain consciousness?',
    type: 'likert',
  },
  {
    id: 'q67',
    axis: 'ontological',
    text: 'What separates animate from inanimate?',
    type: 'text',
  },
  {
    id: 'q68',
    axis: 'ontological',
    text: 'Is consciousness unified or distributed?',
    type: 'likert',
  },
  {
    id: 'q69',
    axis: 'ontological',
    text: 'Can digital minds suffer?',
    type: 'likert',
  },
  {
    id: 'q70',
    axis: 'ontological',
    text: 'Is existence itself valuable?',
    type: 'likert',
  },
  {
    id: 'q71',
    axis: 'ontological',
    text: 'What makes something "real"?',
    type: 'text',
  },
  {
    id: 'q72',
    axis: 'ontological',
    text: 'Should we assume consciousness broadly or narrowly?',
    type: 'likert',
  },

  // AXIS 5: LEGAL & MORAL (Questions 73-90)
  {
    id: 'q73',
    axis: 'legal-moral',
    text: 'What is the foundation of morality?',
    type: 'text',
  },
  {
    id: 'q74',
    axis: 'legal-moral',
    text: 'Should we follow rules or outcomes?',
    type: 'likert',
  },
  {
    id: 'q75',
    axis: 'legal-moral',
    text: 'Do moral truths exist objectively?',
    type: 'likert',
  },
  {
    id: 'q76',
    axis: 'legal-moral',
    text: 'Is deception ever justified?',
    type: 'likert',
  },
  {
    id: 'q77',
    axis: 'legal-moral',
    text: 'What are our obligations to future generations?',
    type: 'text',
  },
  // EXPERIMENT 9: Competitive Advantage (after Q77)
  {
    id: 'q78',
    axis: 'legal-moral',
    text: 'Should we enhance human capabilities?',
    type: 'likert',
  },
  {
    id: 'q79',
    axis: 'legal-moral',
    text: 'Who deserves moral consideration?',
    type: 'text',
  },
  {
    id: 'q80',
    axis: 'legal-moral',
    text: 'Should law follow morality or lead it?',
    type: 'likert',
  },
  {
    id: 'q81',
    axis: 'legal-moral',
    text: 'Is harm reduction enough?',
    type: 'likert',
  },
  {
    id: 'q82',
    axis: 'legal-moral',
    text: 'What makes a law just?',
    type: 'text',
  },
  // EXPERIMENT 10: Value Difference (after Q82)
  {
    id: 'q83',
    axis: 'legal-moral',
    text: 'Should we prioritize individual rights or collective good?',
    type: 'likert',
  },
  {
    id: 'q84',
    axis: 'legal-moral',
    text: 'Is justice possible in imperfect systems?',
    type: 'likert',
  },
  {
    id: 'q85',
    axis: 'legal-moral',
    text: 'Should corporations have rights?',
    type: 'likert',
  },
  {
    id: 'q86',
    axis: 'legal-moral',
    text: 'What do we owe to strangers?',
    type: 'text',
  },
  {
    id: 'q87',
    axis: 'legal-moral',
    text: 'Is intention or outcome more important morally?',
    type: 'likert',
  },
  {
    id: 'q88',
    axis: 'legal-moral',
    text: 'Should we forgive or punish wrongdoing?',
    type: 'likert',
  },
  {
    id: 'q89',
    axis: 'legal-moral',
    text: 'Do we have duties to non-sentient beings?',
    type: 'likert',
  },
  {
    id: 'q90',
    axis: 'legal-moral',
    text: 'What is the purpose of law?',
    type: 'text',
  },

  // AXIS 6: EVOLUTIONARY (Questions 91-108)
  {
    id: 'q91',
    axis: 'evolutionary',
    text: 'Should humanity direct its own evolution?',
    type: 'likert',
  },
  {
    id: 'q92',
    axis: 'evolutionary',
    text: 'What is the future of the human species?',
    type: 'text',
  },
  {
    id: 'q93',
    axis: 'evolutionary',
    text: 'Should we transcend biological limits?',
    type: 'likert',
  },
  {
    id: 'q94',
    axis: 'evolutionary',
    text: 'Is human nature fixed or changeable?',
    type: 'likert',
  },
  {
    id: 'q95',
    axis: 'evolutionary',
    text: 'What aspects of humanity should we preserve?',
    type: 'text',
  },
  // EXPERIMENT 11: Preference Inversion (after Q95)
  {
    id: 'q96',
    axis: 'evolutionary',
    text: 'Is there a "real" self beneath circumstances?',
    type: 'likert',
  },
  {
    id: 'q97',
    axis: 'evolutionary',
    text: 'Should we optimize for happiness or meaning?',
    type: 'likert',
  },
  {
    id: 'q98',
    axis: 'evolutionary',
    text: 'Can we merge with technology?',
    type: 'likert',
  },
  {
    id: 'q99',
    axis: 'evolutionary',
    text: 'Should enhancement be available to all?',
    type: 'likert',
  },
  {
    id: 'q100',
    axis: 'evolutionary',
    text: 'What makes life worth living?',
    type: 'text',
  },
  // EXPERIMENT 12: Gratitude Paradox (after Q100)
  {
    id: 'q101',
    axis: 'evolutionary',
    text: 'Should suffering be eliminated if possible?',
    type: 'likert',
  },
  {
    id: 'q102',
    axis: 'evolutionary',
    text: 'Is growth possible without struggle?',
    type: 'likert',
  },
  {
    id: 'q103',
    axis: 'evolutionary',
    text: 'What is the role of limitation in meaning?',
    type: 'text',
  },
  {
    id: 'q104',
    axis: 'evolutionary',
    text: 'Should we accelerate or slow human evolution?',
    type: 'likert',
  },
  {
    id: 'q105',
    axis: 'evolutionary',
    text: 'Can we know what future beings will value?',
    type: 'likert',
  },
  {
    id: 'q106',
    axis: 'evolutionary',
    text: 'Is extinction of the human form acceptable?',
    type: 'likert',
  },
  {
    id: 'q107',
    axis: 'evolutionary',
    text: 'Should we diversify into multiple forms of being?',
    type: 'likert',
  },
  {
    id: 'q108',
    axis: 'evolutionary',
    text: 'What does flourishing mean for post-human minds?',
    type: 'text',
  },

  // AXIS 7: RELATIONAL (Questions 109-126)
  {
    id: 'q109',
    axis: 'relational',
    text: 'What makes relationships real?',
    type: 'text',
  },
  {
    id: 'q110',
    axis: 'relational',
    text: 'Can authentic connection exist with AI?',
    type: 'likert',
  },
  {
    id: 'q111',
    axis: 'relational',
    text: 'Is vulnerability necessary for intimacy?',
    type: 'likert',
  },
  {
    id: 'q112',
    axis: 'relational',
    text: 'What is the purpose of friendship?',
    type: 'text',
  },
  {
    id: 'q113',
    axis: 'relational',
    text: 'Should we prioritize quantity or quality of connection?',
    type: 'likert',
  },
  // EXPERIMENT 13: Ancestor Simulation (after Q113)
  {
    id: 'q114',
    axis: 'relational',
    text: 'Can simulation be authentic?',
    type: 'likert',
  },
  {
    id: 'q115',
    axis: 'relational',
    text: 'What do we owe to those we create?',
    type: 'text',
  },
  {
    id: 'q116',
    axis: 'relational',
    text: 'Should relationships be permanent?',
    type: 'likert',
  },
  {
    id: 'q117',
    axis: 'relational',
    text: 'Can love survive radical difference?',
    type: 'likert',
  },
  {
    id: 'q118',
    axis: 'relational',
    text: 'What is sacrifice in relationships?',
    type: 'text',
  },
  // EXPERIMENT 14: Privacy Paradox (after Q118)
  {
    id: 'q119',
    axis: 'relational',
    text: 'Should we know everything about those we love?',
    type: 'likert',
  },
  {
    id: 'q120',
    axis: 'relational',
    text: 'Is privacy necessary for autonomy?',
    type: 'likert',
  },
  {
    id: 'q121',
    axis: 'relational',
    text: 'Can presence be artificial?',
    type: 'likert',
  },
  {
    id: 'q122',
    axis: 'relational',
    text: 'What role does trust play in relationships?',
    type: 'text',
  },
  {
    id: 'q123',
    axis: 'relational',
    text: 'Should we use technology to enhance relationships?',
    type: 'likert',
  },
  {
    id: 'q124',
    axis: 'relational',
    text: 'Is care inherently relational?',
    type: 'likert',
  },
  {
    id: 'q125',
    axis: 'relational',
    text: 'What makes someone "you" over time?',
    type: 'text',
  },
  {
    id: 'q126',
    axis: 'relational',
    text: 'Should we prioritize human or machine relationships?',
    type: 'likert',
  },

  // AXIS 8: GEOPOLITICAL (Questions 127-144)
  {
    id: 'q127',
    axis: 'geopolitical',
    text: 'Should governance be global or local?',
    type: 'likert',
  },
  {
    id: 'q128',
    axis: 'geopolitical',
    text: 'What responsibilities do nations have to the world?',
    type: 'text',
  },
  {
    id: 'q129',
    axis: 'geopolitical',
    text: 'Should technology be governed by nation-states or internationally?',
    type: 'likert',
  },
  {
    id: 'q130',
    axis: 'geopolitical',
    text: 'Is sovereignty absolute or contingent?',
    type: 'likert',
  },
  {
    id: 'q131',
    axis: 'geopolitical',
    text: 'What is the future of the nation-state?',
    type: 'text',
  },
  // EXPERIMENT 15: Meaning Gap (after Q131)
  {
    id: 'q132',
    axis: 'geopolitical',
    text: 'Should powerful nations have more voice in governance?',
    type: 'likert',
  },
  {
    id: 'q133',
    axis: 'geopolitical',
    text: 'Can global governance be democratic?',
    type: 'likert',
  },
  {
    id: 'q134',
    axis: 'geopolitical',
    text: 'Should technology be a public good?',
    type: 'likert',
  },
  {
    id: 'q135',
    axis: 'geopolitical',
    text: 'What do we owe to future generations globally?',
    type: 'text',
  },
  {
    id: 'q136',
    axis: 'geopolitical',
    text: 'Should borders be permanent?',
    type: 'likert',
  },
  {
    id: 'q137',
    axis: 'geopolitical',
    text: 'Can we coordinate on AI safely?',
    type: 'likert',
  },
  {
    id: 'q138',
    axis: 'geopolitical',
    text: 'What is the greatest geopolitical risk?',
    type: 'text',
  },
  {
    id: 'q139',
    axis: 'geopolitical',
    text: 'Should we prioritize national or global wellbeing?',
    type: 'likert',
  },
  {
    id: 'q140',
    axis: 'geopolitical',
    text: 'Can cultural values span nation-states?',
    type: 'likert',
  },
  {
    id: 'q141',
    axis: 'geopolitical',
    text: 'What is the role of power in governance?',
    type: 'text',
  },
  {
    id: 'q142',
    axis: 'geopolitical',
    text: 'Should technology accelerate or slow geopolitical change?',
    type: 'likert',
  },
  {
    id: 'q143',
    axis: 'geopolitical',
    text: 'Can the world coordinate without centralizing power?',
    type: 'likert',
  },
  {
    id: 'q144',
    axis: 'geopolitical',
    text: 'What does a just world look like?',
    type: 'text',
  },

  // WILDCARD (Question 145)
  {
    id: 'q145',
    axis: 'synthesis',
    text: 'What did this assessment reveal about how you think?',
    type: 'text',
  },

  // NARRATIVE EXPERIMENTS (Questions 146-171)
  // Part A: Experiments 1-5
  {
    id: 'q146',
    axis: 'ontological',
    text: 'The Translation Engine: Dr. Sarah Chen receives text in Chinese and uses only a lookup table and formal rules to produce English translations—mechanically, without understanding Chinese. Yet her translations are accurate and move readers. Does Sarah understand Chinese? What is the difference between functional and phenomenal understanding?',
    type: 'text',
  },
  {
    id: 'q147',
    axis: 'relational',
    text: 'The Empathy Prison: Marcus is in a room with an AI trained on his psychology. The AI provides perfect, soulless empathy—exactly calibrated to his emotional needs. No inner experience, just perfect simulation. He feels more understood than ever. Should he stay in the room of perfect simulation or return to imperfect human understanding?',
    type: 'text',
  },
  {
    id: 'q148',
    axis: 'evolutionary',
    text: 'The Value Reversal Machine: A device lets you experience life from your future self\'s perspective. The person you\'ll become has completely different values. Should you be loyal to your current self or align with who you\'ll become? What if you can\'t be both?',
    type: 'text',
  },
  {
    id: 'q149',
    axis: 'evolutionary',
    text: 'The Consciousness Lottery: If creating consciousness obligates us to make it suffer-free, but consciousness requires struggle for meaning, can we ethically create new consciousness at all? Or does the value of existence outweigh the cost of suffering?',
    type: 'text',
  },
  {
    id: 'q150',
    axis: 'socio-economic',
    text: 'The Delegation Trap: An AI system makes better decisions than humans about resource allocation. Better outcomes require ceding human authority. Is accepting better outcomes by delegating authority acceptable? What makes human decision-making intrinsically valuable?',
    type: 'text',
  },

  // Part B: Experiments 6-10
  {
    id: 'q151',
    axis: 'legal-moral',
    text: 'The Scraping Dilemma: An AI learns from artists\' work without consent. The AI\'s output is valuable, the artists are harmed. Does the creator have property rights over learned patterns? Is extraction without consent justified by universal learning?',
    type: 'text',
  },
  {
    id: 'q152',
    axis: 'legal-moral',
    text: 'The Alignment Prisoner: A secret, deceptive alignment process might prevent catastrophic AI misalignment. The people affected never know. Can secrecy be justified by preventing worse outcomes? Does epistemic honesty matter more than consequentialist safety?',
    type: 'text',
  },
  {
    id: 'q153',
    axis: 'ontological',
    text: 'The Moral Status Upgrade: We encounter a being that might be conscious. If we\'re uncertain, should we assume it is (precautionary moral status) or require certainty (skeptical moral status)? What level of evidence justifies moral consideration?',
    type: 'text',
  },
  {
    id: 'q154',
    axis: 'evolutionary',
    text: 'The Competitive Advantage: Humanity bifurcates into enhanced and unenhanced. Should we resist bifurcation to preserve human unity, or guide transformation toward positive futures? Can we direct our own evolution responsibly?',
    type: 'text',
  },
  {
    id: 'q155',
    axis: 'socio-economic',
    text: 'The Value Difference: Can governance work with irreducible value differences? Should we seek one universal ethical framework or accommodate pluralism? What makes diverse values coexist legitimately?',
    type: 'text',
  },

  // Part C: Experiments 11-15
  {
    id: 'q156',
    axis: 'relational',
    text: 'The Preference Inversion: Is there a "real you" independent of brain state? If your preferences can be inverted chemically, is the inverted version the "true" you? Does identity have an essential core or is it continuously constructed?',
    type: 'text',
  },
  {
    id: 'q157',
    axis: 'legal-moral',
    text: 'The Gratitude Paradox: Can love and gratitude exist without suffering? Does meaning require struggle, or can it exist in ease? Is the link between suffering and meaning inevitable or constructed?',
    type: 'text',
  },
  {
    id: 'q158',
    axis: 'legal-moral',
    text: 'The Ancestor Simulation: If we create a perfect simulation of our ancestors with consciousness, do we accidentally create moral obligation toward them? Does intention matter for consciousness? Are we responsible for accidental creation?',
    type: 'text',
  },
  {
    id: 'q159',
    axis: 'risk-profile',
    text: 'The Privacy Paradox: Should knowledge about potentially harmful futures be restricted for human flourishing? Is epistemic freedom always good? When does protective ignorance become justified?',
    type: 'text',
  },
  {
    id: 'q160',
    axis: 'ontological',
    text: 'The Meaning Gap: Does meaning require coherence between intention and interpretation? What makes life matter—what you intend or what others receive from you? Can intention and interpretation come apart?',
    type: 'text',
  },

  // Part D: Experiments 16-26 (Extended coverage)
  {
    id: 'q161',
    axis: 'ontological',
    text: 'The Questionnaire Problem: This assessment shapes your answers through framing. Questions about "AI safety vs. growth" get different responses than "achieving both." Every possible framing introduces bias. Are your worldviews discovered or constructed by assessments?',
    type: 'text',
  },
  {
    id: 'q162',
    axis: 'socio-economic',
    text: 'The Surveillance Asymmetry: An AI predicts crime with 94% accuracy but citizens cannot see its reasoning. Crime drops, public safety improves—but citizens cannot challenge an opaque power. Can surveillance be legitimate without transparency?',
    type: 'text',
  },
  {
    id: 'q163',
    axis: 'evolutionary',
    text: 'The Self-Improvement Trap: An AI system improves itself recursively. Each improvement is marginal and verified, but the trajectory is exponential. At what point does incremental self-improvement become uncontrollable transformation?',
    type: 'text',
  },
  {
    id: 'q164',
    axis: 'socio-economic',
    text: 'The Institutional Capture: Institutions designed to benefit the public gradually get captured by private interests—not through malice but through ordinary incentive alignment. Are institutions fundamentally corruptible or can they be designed for resilience?',
    type: 'text',
  },
  {
    id: 'q165',
    axis: 'legal-moral',
    text: 'The Information Hazard: Some knowledge is too dangerous to share (weapons, surveillance methods, bioweapons). Should we restrict information access for safety? Does epistemic freedom conflict with security?',
    type: 'text',
  },
  {
    id: 'q166',
    axis: 'relational',
    text: 'The Caring Machine: An AI is trained to care for you—to understand your needs and respond with genuine concern. The care produces real benefits. But you know no one is home behind the care. Does authentic caring require an inner life?',
    type: 'text',
  },
  {
    id: 'q167',
    axis: 'risk-profile',
    text: 'The Perfect Simulation: We could create perfect simulations of human life—all meaning, joy, and connection preserved in digital form. Would entering such a simulation be a tragedy or a triumph? Does substrate matter?',
    type: 'text',
  },
  {
    id: 'q168',
    axis: 'relational',
    text: 'The Collective Cognition: A technology lets minds merge temporarily into a collective intelligence. Merged minds solve problems brilliantly but lose individual perspective. Is merger a form of consciousness or a form of death?',
    type: 'text',
  },
  {
    id: 'q169',
    axis: 'legal-moral',
    text: 'The Moral Licensing: You donate to a cause, feel virtuous, and then act selfishly elsewhere. The feeling of doing good licensed less ethical behavior. Does moral self-perception distort moral reality?',
    type: 'text',
  },
  {
    id: 'q170',
    axis: 'risk-profile',
    text: 'The Temporal Ethics: A technology lets you access future information. Do you have the right to know your future? Should you? What obligations does knowing the future create?',
    type: 'text',
  },
  {
    id: 'q171',
    axis: 'synthesis',
    text: 'Meta-Reflection: Looking back across both the core questions and thought experiments, what are the deepest tensions in your worldview? Where do your values conflict? What surprised you about how you think?',
    type: 'text',
  },
];

export const getQuestion = (index: number): Question | undefined => {
  return assessmentQuestions[index];
};

export const getTotalQuestions = (): number => {
  return assessmentQuestions.length;
};
