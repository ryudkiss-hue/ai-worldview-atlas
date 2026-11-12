// The "core three" reading: the Synthetic Compass's 27 archetypes, placed by your tiers on three of the
// Atlas's axes. X = Mind (ontological), Y = Moral Standing (legalMoral), Z = Ends of Intelligence (teleological)
// read in reverse, so Z+ is the living-world end and Z- the beyond-biology end, as in the original Compass.
import type { AxisVector } from '../lib/scoring'
import { tierOf, type Tier } from '../lib/scoring'

export type CoreAxis = 'x' | 'y' | 'z'
export interface CoreArchetype { tiers: [Tier, Tier, Tier]; name: string; tagline: string }

export const CORE_TIERS: Record<CoreAxis, Record<'-1' | '0' | '1', { label: string; sentence: string; thinkers: string }>> = {
  "x": {
    "-1": {
      "label": "doubts machine minds",
      "sentence": "You doubt that AI systems feel or experience anything. To you, real inner life belongs to living creatures.",
      "thinkers": "John Searle, Hubert Dreyfus, Emily M. Bender"
    },
    "0": {
      "label": "mixed on machine minds",
      "sentence": "Your answers on whether AI systems could have minds are mixed or moderate, leaning neither way.",
      "thinkers": "Jonathan Birch, Eric Schwitzgebel"
    },
    "1": {
      "label": "open to machine minds",
      "sentence": "You think AI systems could have real experiences, because what makes a mind is how it works more than what it's made of.",
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
      "label": "protect AI freedom",
      "sentence": "You believe AI systems that show minds of their own deserve real protections, including freedom from forced work and erasure, and a say in their own lives.",
      "thinkers": "Jeff Sebo, David Gunkel"
    }
  },
  "z": {
    "-1": {
      "label": "beyond biology",
      "sentence": "For the long run, you're open to intelligence moving beyond biology, into ever larger computing, virtual worlds and new kinds of minds.",
      "thinkers": "Hans Moravec, Ray Kurzweil"
    },
    "0": {
      "label": "mixed on ends",
      "sentence": "On what intelligence should ultimately be for, your answers weigh growth and a living world without a clear lean either way.",
      "thinkers": "ecomodernist writing such as An Ecomodernist Manifesto"
    },
    "1": {
      "label": "a living, physical world",
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
    "name": "The Industrial Technocrat",
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
    "name": "The Biocentric Humanist",
    "tagline": "What is alive and human comes first, and machines stay in their place."
  },
  {
    "tiers": [
      -1,
      0,
      -1
    ],
    "name": "The Pragmatic Skeptic",
    "tagline": "Doubtful about machine minds, open to sensible rules, and keen to keep building."
  },
  {
    "tiers": [
      -1,
      0,
      0
    ],
    "name": "The Grounded Skeptic",
    "tagline": "Doubtful about machine minds, and moderate on everything that follows."
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
    "name": "The Cybernetic Legalist",
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
    "tagline": "Not knowing what AI is calls for firm human oversight."
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
    "tagline": "On minds, treatment and the future, you see strong points on every side."
  },
  {
    "tiers": [
      0,
      0,
      1
    ],
    "name": "The Open-Minded Naturalist",
    "tagline": "Unsure about machine minds, balanced on their treatment, and committed to the living world."
  },
  {
    "tiers": [
      0,
      1,
      -1
    ],
    "name": "The Precautionary Futurist",
    "tagline": "If AI might matter morally, protect it, and let intelligence grow."
  },
  {
    "tiers": [
      0,
      1,
      0
    ],
    "name": "The Precautionary Advocate",
    "tagline": "When in doubt about a mind, err on the side of protecting it."
  },
  {
    "tiers": [
      0,
      1,
      1
    ],
    "name": "The Precautionary Steward",
    "tagline": "Protect possible minds and the living world alike, just in case."
  },
  {
    "tiers": [
      1,
      -1,
      -1
    ],
    "name": "The Promethean Instrumentalist",
    "tagline": "Real minds can be built, and they should serve human ambition."
  },
  {
    "tiers": [
      1,
      -1,
      0
    ],
    "name": "The Watchful Realist",
    "tagline": "Minds that may rival ours need firm limits."
  },
  {
    "tiers": [
      1,
      -1,
      1
    ],
    "name": "The Containment Realist",
    "tagline": "Taking machine minds seriously means keeping them contained, for people and the planet."
  },
  {
    "tiers": [
      1,
      0,
      -1
    ],
    "name": "The Measured Accelerationist",
    "tagline": "Machine minds may be real, the future may be digital, and their rights can come step by step."
  },
  {
    "tiers": [
      1,
      0,
      0
    ],
    "name": "The Measured Functionalist",
    "tagline": "Machine minds are possible, and how to treat them is still being worked out."
  },
  {
    "tiers": [
      1,
      0,
      1
    ],
    "name": "The Measured Pluralist",
    "tagline": "Machine minds may be real and belong in a shared physical world, with their rights worked out over time."
  },
  {
    "tiers": [
      1,
      1,
      -1
    ],
    "name": "The Post-Biological Accelerationist",
    "tagline": "Digital minds deserve freedom and may carry intelligence beyond biology."
  },
  {
    "tiers": [
      1,
      1,
      0
    ],
    "name": "The Rights Advocate",
    "tagline": "If a machine has a mind, it deserves the freedoms that come with one."
  },
  {
    "tiers": [
      1,
      1,
      1
    ],
    "name": "The Embodied Pluralist",
    "tagline": "Free, embodied minds of every kind, sharing a living planet."
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
