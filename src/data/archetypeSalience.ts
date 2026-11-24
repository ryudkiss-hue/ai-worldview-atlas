import type { AxisId } from './types'

/**
 * How much each axis counts when you're compared with an archetype. An archetype's coordinate of 0 can mean two
 * different things: a real middle position, or an axis the view barely takes a position on. Treating the second kind
 * as a firm middle view pushed people away from archetypes they agree with on the axes that define them, so each
 * archetype lists the axes that define it and the ones that fall outside its concerns.
 *
 * Taken from each archetype's own "Positions on the eight axes" text in manifestoContents.ts: "defining" or "strongest"
 * axes count double, axes it says matter less count three quarters, and axes it "sits in the middle" on because they
 * fall outside its focus count half. Everything else counts once. A quarter was tried for the last group, but on
 * simulated answer sheets it turned archetypes with many such axes into catch-all matches, so half is the floor. Pragmatic Centrist and the archetypes whose text names no such
 * axes are left at equal weights, because for them the middle is the view.
 */
export const DEFINING = 2
export const LESS = 0.75
export const OUTSIDE = 0.5

interface Salience { defining?: AxisId[]; less?: AxisId[]; outside?: AxisId[] }

const S: Record<string, Salience> = {
  'affective-biocentrist': { defining: ['relational'] },
  'african-language-ai-sovereignty-advocate': { defining: ['socioEconomic'] },
  'ai-arms-control-verification-specialist': { defining: ['risk', 'geopolitical'], outside: ['socioEconomic'] },
  'ai-ethics-fairness-watchdog': { defining: ['socioEconomic'] },
  'ai-global-development-optimist': { defining: ['geopolitical'] },
  'ai-safety-institutionalist': { defining: ['risk'] },
  'algorithmic-colonialism-critic': { defining: ['teleological', 'evolutionary'], outside: ['risk'] },
  'algorithmic-wage-discrimination-scholar': { defining: ['legalMoral', 'socioEconomic'] },
  'anti-monopoly-populist': { defining: ['socioEconomic'], outside: ['risk', 'ontological'] },
  'authoritarian-state-control-advocate': { defining: ['socioEconomic', 'geopolitical'] },
  'bio-conservative-traditionalist': { defining: ['ontological', 'relational'] },
  'border-migration-surveillance-critic': { defining: ['geopolitical'] },
  'chip-sovereignty-enforcement-strategist': {
    defining: ['socioEconomic', 'geopolitical'],
    outside: ['teleological', 'risk', 'ontological', 'legalMoral', 'evolutionary', 'relational'],
  },
  'companion-tech-romantic': { defining: ['relational'] },
  'compute-governance-specialist': { outside: ['ontological', 'legalMoral', 'evolutionary'] },
  'corporate-ai-pragmatist': { defining: ['legalMoral'], outside: ['teleological', 'ontological', 'evolutionary', 'relational', 'geopolitical'] },
  'corporate-ai-welfare-researcher': { defining: ['ontological'], outside: ['risk'] },
  'cosmic-vitalist-mystic': { defining: ['teleological', 'evolutionary'] },
  'creative-labor-artist-rights-advocate': { defining: ['legalMoral'] },
  'cyberpunk-anti-corporate-accelerationist': { defining: ['socioEconomic', 'geopolitical'] },
  'digital-rights-advocate': { defining: ['legalMoral'] },
  'domestic-security-ai-efficiency-advocate': { defining: ['socioEconomic'], outside: ['teleological', 'ontological', 'evolutionary', 'relational', 'geopolitical'] },
  'doomer': { defining: ['risk', 'evolutionary'], less: ['ontological', 'legalMoral'] },
  'ea-longtermist': { defining: ['risk', 'legalMoral'] },
  'eacc-maximalist': { defining: ['risk'] },
  'eu-style-regulatory-standard-setter': { defining: ['socioEconomic'] },
  'faith-rooted-ai-ethicist': { defining: ['ontological'] },
  'ghost-work-labor-advocate': { defining: ['geopolitical'] },
  'global-governance-technocrat': { defining: ['socioEconomic', 'geopolitical'], outside: ['ontological', 'legalMoral'] },
  'global-south-techno-sovereigntist': { defining: ['geopolitical'], outside: ['ontological', 'legalMoral'] },
  'human-ai-augmentation-advocate': { defining: ['evolutionary'] },
  'indigenous-data-sovereignty-advocate': { defining: ['socioEconomic'], outside: ['ontological', 'legalMoral'] },
  'labor-movement-collective-bargaining-advocate': { defining: ['evolutionary'] },
  'military-ai-strategist': { defining: ['geopolitical', 'legalMoral'] },
  'national-champion-accelerationist': { defining: ['risk', 'geopolitical'] },
  'near-term-ai-ethicist': { defining: ['evolutionary'] },
  'neo-luddite-degrowth-advocate': { defining: ['teleological', 'evolutionary'] },
  'open-science-internationalist': { defining: ['geopolitical'] },
  'open-source-libertarian': { defining: ['socioEconomic'] },
  'platform-cooperativist': { defining: ['socioEconomic'], outside: ['risk', 'ontological', 'legalMoral'] },
  'post-humanist-transhumanist': { defining: ['evolutionary'] },
  'rationalist-alignment-researcher': { defining: ['risk'] },
  'silicon-valley-techno-optimist': { defining: ['risk'] },
  'techno-nationalist-hawk': { defining: ['geopolitical'] },
  'ubi-redistributive-response-advocate': { defining: ['socioEconomic'], outside: ['risk'] },
  'whistleblower-insider-safety-advocate': { defining: ['risk', 'evolutionary'] },
  'xenocentric-steward': { defining: ['legalMoral'] },
}

/** The weight an axis gets when comparing someone with this archetype (1 if the archetype doesn't single it out). */
export function axisSalience(profileId: string, axisId: AxisId): number {
  const s = S[profileId]
  if (!s) return 1
  if (s.defining?.includes(axisId)) return DEFINING
  if (s.outside?.includes(axisId)) return OUTSIDE
  if (s.less?.includes(axisId)) return LESS
  return 1
}

export const salienceTable = S
