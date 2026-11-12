import type { Axis } from './types'

// Eight axes in four groups: what AI is (Mind); how we live with it (Moral Standing, Relationships);
// what future to build (Ends of Intelligence, Succession); who decides and how fast (Risk, Openness & Control, Geopolitics).
// Positive scores lean toward pole A, negative toward pole B. Ids are kept from the original Atlas so archetype
// coordinates, reports and manifestos still line up.
export const axes: Axis[] = [
  { id: 'ontological', number: 1, name: "Mind", question: "Could AI systems have minds?", poleA: "Silicon Functionalism", poleADesc: "Minds depend on how a system works, so built machines could have real experience and understanding.", poleB: "Substrate Exceptionalism", poleBDesc: "Real experience and understanding belong to living things, so built machines cannot have them." },
  { id: 'legalMoral', number: 2, name: "Moral Standing", question: "Can AI systems be wronged, and what do we owe them?", poleA: "Machine Patienthood", poleADesc: "AI systems with minds of their own, or that might have them, are owed protections for their own sake.", poleB: "Instrumentalism & Property", poleBDesc: "AI systems are property and tools; only effects on people count morally." },
  { id: 'relational', number: 3, name: "Relationships", question: "What are bonds between people and AI systems worth?", poleA: "Post-Biological Pluralism", poleADesc: "Bonds with AI systems can be as real and valuable as bonds between people.", poleB: "Affective Biocentrism", poleBDesc: "Bonds between people have a depth that bonds with AI systems cannot match." },
  { id: 'teleological', number: 4, name: "Ends of Intelligence", question: "What should intelligence ultimately be for?", poleA: "Cosmic Vitalism", poleADesc: "Growing intelligence and its reach is the deepest good, worth great cost to the world as it is.", poleB: "Human & Ecological Limits", poleBDesc: "The flourishing of living beings comes first, and technology should stay within the limits of a living world." },
  { id: 'evolutionary', number: 5, name: "Succession", question: "Should humans remain the ones who shape the future?", poleA: "Post-Human Succession", poleADesc: "It need not matter whether humans or other minds carry the future forward.", poleB: "Human-Directed Co-Evolution", poleBDesc: "Humans should keep shaping the future, changing alongside AI by their own choice and consent." },
  { id: 'risk', number: 6, name: "Risk", question: "How much should we slow down to avoid catastrophe?", poleA: "Precautionary", poleADesc: "Avoiding catastrophe from AI justifies slower progress and real costs.", poleB: "Accelerationist", poleBDesc: "Slowing AI costs more than it saves; the larger danger is stagnation and losing ground." },
  { id: 'socioEconomic', number: 7, name: "Openness & Control", question: "Who should be able to build and use powerful AI?", poleA: "Permissionless Openness", poleADesc: "Powerful AI should be open to anyone, without licenses or gatekeepers.", poleB: "Managed Oversight", poleBDesc: "Powerful AI should be overseen and controlled by accountable institutions." },
  { id: 'geopolitical', number: 8, name: "Geopolitics", question: "Should AI serve nations or humanity as a whole?", poleA: "Techno-Nationalism", poleADesc: "AI is a matter of national security and advantage, to be developed and controlled nationally.", poleB: "Borderless Networkism", poleBDesc: "AI should be shared across borders and governed for humanity as a whole." },
]

export function getAxisById(id: string): Axis | undefined {
  return axes.find((a) => a.id === id)
}
