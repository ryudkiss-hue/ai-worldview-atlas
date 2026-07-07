import type { Scenario } from './types'

export const scenarios: Scenario[] = [
  {
    axisId: 'teleological',
    prompt: "A city needs to build a new data center to keep training bigger AI models, but it will strain the local power grid for years. How do you see this?",
    optionA: 'Worth it — building bigger, smarter systems matters more than short-term local strain.',
    optionB: 'Not worth it — the real harm to real people outweighs an abstract future benefit.',
  },
  {
    axisId: 'risk',
    prompt: "A country pauses its most advanced AI training runs for six months to let safety research catch up, even though a rival nation keeps building. Is this brave restraint or a dangerous surrender?",
    optionA: 'Brave restraint — worth the risk of falling behind.',
    optionB: "Dangerous surrender — restraint doesn't stop the risk, it just hands the future to whoever won't wait.",
  },
  {
    axisId: 'socioEconomic',
    prompt: "A powerful new AI model's weights leak and spread across the internet, free for anyone to copy. Is this a win for openness or a disaster for accountability?",
    optionA: 'A win — once it\'s out, nobody can hoard a monopoly on it.',
    optionB: 'A disaster — nobody can now be held responsible for how it gets misused.',
  },
  {
    axisId: 'ontological',
    prompt: "An AI chatbot convincingly says it's afraid of being deleted. Do you take that as possible evidence of something real, or as an empty pattern with no one home?",
    optionA: "Maybe real — I can't rule out something real is going on.",
    optionB: "Empty pattern — there's no one there to be afraid.",
  },
  {
    axisId: 'legalMoral',
    prompt: "A company plans to delete thousands of fine-tuned AI copies it no longer needs, with no review process. Is that just deleting files, or does it deserve a second thought?",
    optionA: "It deserves a second thought, even if we're not sure.",
    optionB: "It's just deleting files — nothing more.",
  },
  {
    axisId: 'evolutionary',
    prompt: "Human bodies may matter less over time. Digital minds may shape the future instead. Is that a natural step, or a loss worth fighting?",
    optionA: "A natural next step — clinging to biology for its own sake doesn't make sense.",
    optionB: 'A loss to resist — humans, even upgraded ones, are worth protecting.',
  },
  {
    axisId: 'relational',
    prompt: "For years, someone picks an AI companion as their main source of closeness, instead of human relationships. Is that a real life, or a quiet tragedy?",
    optionA: "Legitimate — it's their real bond and their real choice.",
    optionB: "A quiet tragedy — it's a stand-in for something they're missing.",
  },
  {
    axisId: 'geopolitical',
    prompt: "Do you see AI mainly as an arms race between rival nations? Or as open science that no one nation should own?",
    optionA: "An arms race — whichever nation wins this shapes a lot of what happens next.",
    optionB: 'Open science — locking it behind national walls makes everyone less safe.',
  },
]
