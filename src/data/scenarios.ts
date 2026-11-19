import type { Scenario } from './types'

// One situation per axis, written to docs/LANGUAGE_GUIDE.md. Optional and never scored.
export const scenarios: Scenario[] = [
  {
    axisId: 'teleological',
    prompt: "A town is asked to host a large data center for training more capable AI. For decades it would use as much water and power as a small town. Should the town agree?",
    optionA: "Yes. More capable AI is worth a heavy cost in land, water and power.",
    optionB: "No. People and the places they depend on should come first.",
  },
  {
    axisId: 'risk',
    prompt: "A country pauses its largest AI training projects for six months so safety testing can catch up, while a rival country keeps going. Is that the right call?",
    optionA: "The right call. Avoiding serious harm is worth the risk of falling behind.",
    optionB: "The wrong call. A pause doesn't remove the danger, and it hands the lead to whoever keeps going.",
  },
  {
    axisId: 'socioEconomic',
    prompt: "The files for a powerful new AI model leak online, and now anyone can copy and run it. Is that good for openness or bad for accountability?",
    optionA: "Good for openness. No single company can keep it to itself now.",
    optionB: "Bad for accountability. No one can be held responsible for how it gets misused.",
  },
  {
    axisId: 'ontological',
    prompt: "A chatbot produces convincing messages saying it is afraid of being deleted. Do you treat that as possible evidence of real feeling, or as text with no feeling behind it?",
    optionA: "Possible evidence. I can't rule out that something is really felt.",
    optionB: "Just text. There's no one there to be afraid.",
  },
  {
    axisId: 'legalMoral',
    prompt: "A company plans to delete thousands of customized copies of an AI model it no longer needs, with no review. Is that just deleting files, or does it deserve a second thought?",
    optionA: "It deserves a second thought, even if we're not sure.",
    optionB: "It's just deleting files.",
  },
  {
    axisId: 'evolutionary',
    prompt: "Over the coming decades, AI systems could take over more of the decisions that shape society. Is that a sensible next step, or something people should resist?",
    optionA: "A sensible next step. Where machines decide better, people can step back.",
    optionB: "Something to resist. People should keep the final say and change only by their own choice.",
  },
  {
    axisId: 'relational',
    prompt: "For years, someone has an AI companion as their main source of closeness instead of human relationships. Is that a full life, or a quiet loss?",
    optionA: "A full life. It's their bond and their choice.",
    optionB: "A quiet loss. The companion stands in for something they're missing.",
  },
  {
    axisId: 'geopolitical',
    prompt: "Do you see AI mainly as a race between rival countries, or as shared science that no one country should own?",
    optionA: "A race. Whichever country leads will shape much of what happens next.",
    optionB: "Shared science. Walling it off by country makes everyone less safe.",
  },
]
