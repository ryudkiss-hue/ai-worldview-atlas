import type { Question, AxisId } from '../types'
import { teleologicalQuestions } from './teleological'
import { riskQuestions } from './risk'
import { socioEconomicQuestions } from './socioEconomic'
import { ontologicalQuestions } from './ontological'
import { legalMoralQuestions } from './legalMoral'
import { evolutionaryQuestions } from './evolutionary'
import { relationalQuestions } from './relational'
import { geopoliticalQuestions } from './geopolitical'

export const questions: Question[] = [
  ...ontologicalQuestions,
  ...legalMoralQuestions,
  ...relationalQuestions,
  ...teleologicalQuestions,
  ...evolutionaryQuestions,
  ...riskQuestions,
  ...socioEconomicQuestions,
  ...geopoliticalQuestions,
].sort((a, b) => a.id - b.id)

export function questionsForAxis(axisId: AxisId): Question[] {
  return questions.filter((q) => q.axisId === axisId)
}
