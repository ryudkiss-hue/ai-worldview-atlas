import type { Axis } from './types'

// Eight axes in four groups: what AI is (Machine Experience); how we live with it (Moral Standing, Relationships);
// what future to build (Growth and Limits, Human Control); who decides and how fast (Speed and Safety, Openness & Control,
// Nations and the World). Labels follow docs/LANGUAGE_GUIDE.md.
// Positive scores lean toward pole A, negative toward pole B. Ids are kept from the original Atlas so archetype
// coordinates, reports and manifestos still line up.
export const axes: Axis[] = [
  { id: 'ontological', number: 1, name: "Machine Experience", question: "Could an AI system ever have real experiences, such as feelings?", poleA: "Possible in machines", poleADesc: "What matters for experience is how a system works, so a built machine could someday have real feelings and understanding.", poleB: "Only in living things", poleBDesc: "Real feelings and understanding belong to living things, so a machine can produce convincing text about feelings without having any." },
  { id: 'legalMoral', number: 2, name: "Moral Standing", question: "Could an AI system ever be owed moral consideration for its own sake?", poleA: "Owed some protection", poleADesc: "If an AI system might be able to have experiences, how it is treated could matter for its own sake, and that possibility deserves some protection.", poleB: "Tools and property", poleBDesc: "AI systems are products and property; what matters morally is how they affect people." },
  { id: 'relational', number: 3, name: "Relationships", question: "What are relationships with AI systems worth?", poleA: "As valuable as human bonds", poleADesc: "A relationship with an AI system can be as real and valuable to a person as a relationship with another person.", poleB: "Human bonds come first", poleBDesc: "Relationships between people have a depth and give-and-take that relationships with AI systems cannot match." },
  { id: 'teleological', number: 4, name: "Growth and Limits", question: "Should AI keep expanding, or stay within the limits of people and the planet?", poleA: "Growth first", poleADesc: "Expanding what AI can do is worth heavy use of energy, land and materials, now and far into the future.", poleB: "Within limits", poleBDesc: "AI should serve the well-being of people and the living world, and stay within the planet's limits." },
  { id: 'evolutionary', number: 5, name: "Human Control", question: "Should people keep the final say, even where machines do better?", poleA: "Open to handing over", poleADesc: "Where machines do better, people can step back, and it need not matter whether people or AI systems shape the future.", poleB: "People stay in charge", poleBDesc: "People should keep the final say over their work, public decisions and the future, and change alongside AI only by their own choice." },
  { id: 'risk', number: 6, name: "Speed and Safety", question: "How carefully should AI be developed and released?", poleA: "Caution first", poleADesc: "Avoiding serious harm from AI is worth slower progress and real costs.", poleB: "Speed first", poleBDesc: "Slowing AI costs more than it saves, because delay leaves other problems unsolved and hands the lead to others." },
  { id: 'socioEconomic', number: 7, name: "Openness & Control", question: "Who should be able to build and use powerful AI?", poleA: "Open to all", poleADesc: "Powerful AI should be open for anyone to use, study and change, without licenses or gatekeepers.", poleB: "Public oversight", poleBDesc: "Powerful AI should be overseen by accountable public institutions, with rules on who can build and release it." },
  { id: 'geopolitical', number: 8, name: "Nations and the World", question: "Should AI serve national interests or people everywhere?", poleA: "National interest", poleADesc: "AI is a matter of national security and advantage, to be built and controlled at home.", poleB: "Global cooperation", poleBDesc: "AI should be shared across borders and governed for the benefit of people everywhere." },
]

export function getAxisById(id: string): Axis | undefined {
  return axes.find((a) => a.id === id)
}
