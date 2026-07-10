import type { Question, AxisId } from '../types'
import { teleologicalQuestions } from './teleological'
import { riskQuestions } from './risk'
import { socioEconomicQuestions } from './socioEconomic'
import { ontologicalQuestions } from './ontological'
import { legalMoralQuestions } from './legalMoral'
import { evolutionaryQuestions } from './evolutionary'
import { relationalQuestions } from './relational'
import { geopoliticalQuestions } from './geopolitical'
import { simplifiedQuestions } from './simplifiedQuestions'

export const questions: Question[] = [
  ...teleologicalQuestions,
  ...riskQuestions,
  ...socioEconomicQuestions,
  ...ontologicalQuestions,
  ...legalMoralQuestions,
  ...evolutionaryQuestions,
  ...relationalQuestions,
  ...geopoliticalQuestions,
].map((q) => ({
  ...q,
  simplifiedStatement: simplifiedQuestions[q.id] || q.statement,
})).sort((a, b) => a.id - b.id)

export function questionsForAxis(axisId: AxisId): Question[] {
  return questions.filter((q) => q.axisId === axisId)
}
