import type { Axis } from './types'

export const axes: Axis[] = [
  { id: 'teleological', number: 1, name: 'Teleological', poleA: 'Cosmic Vitalism', poleB: 'Anthropocentric Humanism' },
  { id: 'risk', number: 2, name: 'Risk Profile', poleA: 'X-Risk Precautionary', poleB: 'Accelerationary / Stagnation-Averse' },
  { id: 'socioEconomic', number: 3, name: 'Socio-Economic', poleA: 'Permissionless Open-Source', poleB: 'Managed Technocracy & Regulation' },
  { id: 'ontological', number: 4, name: 'Ontological', poleA: 'Silicon Functionalism', poleB: 'Substrate Exceptionalism' },
  { id: 'legalMoral', number: 5, name: 'Legal & Moral', poleA: 'Machine Patienthood', poleB: 'Pure Instrumentalism & Property' },
  { id: 'evolutionary', number: 6, name: 'Evolutionary', poleA: 'Post-Human Replacement', poleB: 'Directed Cybernetic Co-Evolution' },
  { id: 'relational', number: 7, name: 'Relational', poleA: 'Post-Biological Pluralism', poleB: 'Affective Biocentrism' },
  { id: 'geopolitical', number: 8, name: 'Geopolitical', poleA: 'Techno-Nationalism', poleB: 'Borderless Networkism' },
]

export function getAxisById(id: string): Axis | undefined {
  return axes.find((a) => a.id === id)
}
