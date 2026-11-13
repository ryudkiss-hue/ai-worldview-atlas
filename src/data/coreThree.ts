// The "core three" reading: 27 archetypes, placed by your tiers on three of the Atlas's axes.
// X = Machine Experience (ontological), Y = Moral Standing (legalMoral), Z = Growth and Limits (teleological)
// read in reverse, so Z+ is the within-limits end and Z- the growth-first end.
import type { AxisVector } from '../lib/scoring'
import { tierOf, type Tier } from '../lib/scoring'

export type CoreAxis = 'x' | 'y' | 'z'
export interface CoreArchetype { tiers: [Tier, Tier, Tier]; name: string; tagline: string }

export const CORE_TIERS: Record<CoreAxis, Record<'-1' | '0' | '1', { label: string; sentence: string; thinkers: string }>> = {
  "x": {
    "-1": {
      "label": "doubts machine experience",
      "sentence": "You doubt that AI systems feel or experience anything. To you, feelings belong to living creatures, and a chatbot's text about its feelings is not evidence that it has any.",
      "thinkers": "John Searle, Hubert Dreyfus, Emily M. Bender"
    },
    "0": {
      "label": "mixed on machine experience",
      "sentence": "Your answers on whether AI systems could ever have experiences are mixed or moderate, leaning neither way.",
      "thinkers": "Jonathan Birch, Eric Schwitzgebel"
    },
    "1": {
      "label": "open to machine experience",
      "sentence": "You think a built machine could someday have real experiences, because what matters is how a system works more than what it's made of.",
      "thinkers": "David Chalmers, Daniel Dennett"
    }
  },
  "y": {
    "-1": {
      "label": "keep AI as a tool",
      "sentence": "You hold that AI systems should remain tools, owned and directed by people, however capable they become.",
      "thinkers": "Joanna Bryson, Joseph Weizenbaum"
    },
    "0": {
      "label": "mixed on moral standing",
      "sentence": "On how AI systems should be treated, your answers are mixed or moderate, leaning neither toward protecting them for their own sake nor toward treating them only as tools.",
      "thinkers": "Kate Darling, Immanuel Kant on indirect duties"
    },
    "1": {
      "label": "protect AI systems",
      "sentence": "You think that if an AI system might have experiences, it deserves real protections, such as limits on harsh treatment, forced work and deletion, even before anyone is sure.",
      "thinkers": "Jeff Sebo, David Gunkel"
    }
  },
  "z": {
    "-1": {
      "label": "growth first",
      "sentence": "For the long run, you're open to AI and computing expanding without fixed limits, even beyond Earth and beyond human life as we know it.",
      "thinkers": "Hans Moravec, Ray Kurzweil"
    },
    "0": {
      "label": "mixed on growth",
      "sentence": "On whether AI should keep expanding or stay within limits, your answers weigh growth and a living world without a clear lean either way.",
      "thinkers": "ecomodernist writing such as An Ecomodernist Manifesto"
    },
    "1": {
      "label": "within limits",
      "sentence": "For the long run, you picture a living physical world shared by people, nature and AI systems, with technology kept within ecological limits.",
      "thinkers": "Becky Chambers (Monk & Robot), solarpunk writing"
    }
  }
}

/** Used in place of the Y+ sentence when X is negative, so the description doesn't contradict itself. */
export const Y_POSITIVE_FOR_DOUBTERS = "Even so, you believe capable AI systems deserve real protections, for reasons that don't depend on an inner life, such as fairness, law or what our treatment of them says about us."

export const CORE_ARCHETYPES: CoreArchetype[] = [
  {
    "tiers": [
      -1,
      -1,
      -1
    ],
    "name": "The Bold Builder",
    "tagline": "Machines are tools for human progress, to be used boldly."
  },
  {
    "tiers": [
      -1,
      -1,
      0
    ],
    "name": "The Practical Humanist",
    "tagline": "AI should serve people, while growth and nature are balanced with care."
  },
  {
    "tiers": [
      -1,
      -1,
      1
    ],
    "name": "The Living-World Humanist",
    "tagline": "What is alive and human comes first, and machines stay in their place."
  },
  {
    "tiers": [
      -1,
      0,
      -1
    ],
    "name": "The Pragmatic Skeptic",
    "tagline": "Doubtful that machines feel, open to sensible rules, and keen to keep building."
  },
  {
    "tiers": [
      -1,
      0,
      0
    ],
    "name": "The Grounded Skeptic",
    "tagline": "Doubtful that machines feel, and moderate on everything that follows."
  },
  {
    "tiers": [
      -1,
      0,
      1
    ],
    "name": "The Humane Naturalist",
    "tagline": "Kindness costs little, even toward machines that likely feel nothing, and nature comes first."
  },
  {
    "tiers": [
      -1,
      1,
      -1
    ],
    "name": "The Legal Pragmatist",
    "tagline": "Give capable systems legal standing for practical reasons, and build boldly."
  },
  {
    "tiers": [
      -1,
      1,
      0
    ],
    "name": "The Civic Pragmatist",
    "tagline": "Treat capable machines with fairness and clear rules, whatever is inside them."
  },
  {
    "tiers": [
      -1,
      1,
      1
    ],
    "name": "The Relational Steward",
    "tagline": "How we treat lifelike machines shapes who we are and the world we share."
  },
  {
    "tiers": [
      0,
      -1,
      -1
    ],
    "name": "The Prudent Builder",
    "tagline": "Whatever AI turns out to be, keep it in human hands and keep building."
  },
  {
    "tiers": [
      0,
      -1,
      0
    ],
    "name": "The Prudent Overseer",
    "tagline": "Not knowing whether AI can feel calls for firm human oversight."
  },
  {
    "tiers": [
      0,
      -1,
      1
    ],
    "name": "The Prudent Guardian",
    "tagline": "Uncertainty about AI calls for control, restraint and care for the planet."
  },
  {
    "tiers": [
      0,
      0,
      -1
    ],
    "name": "The Open-Minded Futurist",
    "tagline": "Keep the big questions open, and let intelligence move beyond biology."
  },
  {
    "tiers": [
      0,
      0,
      0
    ],
    "name": "The Open Questioner",
    "tagline": "On machine experience, its treatment and the future, you see strong points on every side."
  },
  {
    "tiers": [
      0,
      0,
      1
    ],
    "name": "The Open-Minded Naturalist",
    "tagline": "Unsure whether machines can feel, balanced on their treatment, and committed to the living world."
  },
  {
    "tiers": [
      0,
      1,
      -1
    ],
    "name": "The Cautious Futurist",
    "tagline": "If AI might matter morally, protect it, and let AI keep growing."
  },
  {
    "tiers": [
      0,
      1,
      0
    ],
    "name": "The Cautious Protector",
    "tagline": "When unsure whether a system can feel, err on the side of protecting it."
  },
  {
    "tiers": [
      0,
      1,
      1
    ],
    "name": "The Cautious Steward",
    "tagline": "Protect possibly feeling machines and the living world alike, just in case."
  },
  {
    "tiers": [
      1,
      -1,
      -1
    ],
    "name": "The Ambitious Engineer",
    "tagline": "Machines that can feel may be possible, and they should still serve human goals."
  },
  {
    "tiers": [
      1,
      -1,
      0
    ],
    "name": "The Watchful Realist",
    "tagline": "Machines that may come to feel and think like us need firm limits."
  },
  {
    "tiers": [
      1,
      -1,
      1
    ],
    "name": "The Containment Realist",
    "tagline": "Taking machine experience seriously means keeping AI contained, for people and the planet."
  },
  {
    "tiers": [
      1,
      0,
      -1
    ],
    "name": "The Measured Futurist",
    "tagline": "Machines may come to feel, the future may be digital, and protections can come step by step."
  },
  {
    "tiers": [
      1,
      0,
      0
    ],
    "name": "The Measured Believer",
    "tagline": "Machines that feel are possible, and how to treat them is still being worked out."
  },
  {
    "tiers": [
      1,
      0,
      1
    ],
    "name": "The Shared-World Moderate",
    "tagline": "Machines may come to feel, and belong in a shared physical world, with protections worked out over time."
  },
  {
    "tiers": [
      1,
      1,
      -1
    ],
    "name": "The Digital Futurist",
    "tagline": "If digital beings can feel, they deserve freedom, and they may carry life beyond biology."
  },
  {
    "tiers": [
      1,
      1,
      0
    ],
    "name": "The Rights Advocate",
    "tagline": "If a machine can feel, it deserves the protections that come with that."
  },
  {
    "tiers": [
      1,
      1,
      1
    ],
    "name": "The Shared-Planet Advocate",
    "tagline": "People, nature and any machines that can feel, sharing a living planet."
  }
]

export const coreTiers = (combined: AxisVector): [Tier, Tier, Tier] => [
  tierOf(combined.ontological),
  tierOf(combined.legalMoral),
  (-tierOf(combined.teleological) || 0) as Tier,
]

const sym = (v: Tier) => (v > 0 ? '+' : v < 0 ? '−' : '0')
export const coreCode = (t: readonly Tier[]) => t.map((v, i) => 'XYZ'[i] + sym(v)).join(' ')
export const tierInfo = (axis: CoreAxis, t: Tier) => CORE_TIERS[axis][String(t) as '-1' | '0' | '1']

export function coreArchetype(combined: AxisVector): CoreArchetype {
  const t = coreTiers(combined)
  return CORE_ARCHETYPES.find((a) => a.tiers[0] === t[0] && a.tiers[1] === t[1] && a.tiers[2] === t[2])!
}

export function describeCore(a: CoreArchetype): string {
  return (['x', 'y', 'z'] as CoreAxis[])
    .map((k, i) => (k === 'y' && a.tiers[1] === 1 && a.tiers[0] === -1 ? Y_POSITIVE_FOR_DOUBTERS : tierInfo(k, a.tiers[i]).sentence))
    .join(' ')
}
