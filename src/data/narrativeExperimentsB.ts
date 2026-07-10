// Narrative Thought Experiments - Part B (Experiments 6-10)

export const narrativeExperimentsB = {
  'scraping-dilemma': {
    title: 'The Scraping Dilemma',
    intro: `An artist named Elena spent fifteen years developing her unique style—a technique for color layering and composition that's instantly recognizable. It's her voice, her contribution to culture.

One day, she learns that an AI has been trained on 50,000 images of her work (along with millions of other artists' work). The AI can now generate images "in the style of Elena" with perfect fidelity. It can create new paintings that are indistinguishable from her own.

An AI company wants to sell a product: "Generate art in your favorite artist's style." Elena's style will be available.

Elena faces a moral intuition that feels overwhelming: *they've stolen her voice*. Her unique way of seeing the world has been extracted and commodified without her consent. When someone generates "Elena-style" art, they're using her without permission.

But the company argues:
1. They didn't violate any laws. All images were public or licensed.
2. The AI isn't generating copies—it's learning patterns the same way any human artist learns.
3. Human artists all learn by studying masters. Michelangelo studied classical sculpture. Van Gogh studied Japanese prints. This is just learning scaled up.
4. Elena hasn't lost her work or her capacity to create. She still has her studio, her technique, her unique vision.

What the company *doesn't* say, but Elena understands: her work will be devalued. If anyone can generate Elena-art cheaply, why pay Elena?`,

    clash: {
      external: "The company has applied universal learning principles to train an AI. It's a form of art appreciation and continuation.",
      internal: "Elena feels colonized. They've extracted her creativity and weaponized it against her."
    },

    questions: [
      {
        q: "Is there a difference between learning *from* someone's work and learning *to replicate* someone's work?",
        subtext: "Does the difference matter morally?",
        followups: [
          "Do creators have property rights over their style, or only over specific works?",
          "If Elena consented to the AI being trained on her work, would that resolve the moral wrong? Or would it still feel like violation?",
          "What if the AI's Elena-style output is actually better than Elena's own new work? Has the AI improved upon her contribution?",
          "If an AI can learn your voice, your mannerisms, your way of thinking, have they created a kind of digital twin of you? Do you have moral status in that twin, even if you didn't consent?"
        ]
      }
    ],
    axes: ['socio-economic', 'legal-moral'],
    archetypes: ['creative-labor-artist-rights-advocate', 'cyberpunk-anti-corporate-accelerationist'],
    tags: ['intellectual-property', 'consent', 'cultural-labor', 'replication']
  },

  'alignment-prisoner': {
    title: 'The Alignment Prisoner',
    intro: `Dr. Kenji Tanaka is a leading AI safety researcher. He's spent ten years trying to solve the alignment problem—how to ensure that an advanced AI system pursues goals aligned with human values.

He's had a breakthrough. He believes he's solved alignment. He has a proposal for an AI architecture that is mathematically guaranteed to remain aligned with human values even as it self-improves.

But there's a catch: The solution requires that humans be partially integrated into the AI's reasoning loop. Specifically, if the AI encounters a value conflict, it must defer to humans for resolution. But this deferral is not free—it creates a bottleneck in the AI's reasoning. The AI will be slower and less capable than it could be if it made all decisions autonomously.

Kenji faces a choice:

**A)** Implement the alignment-with-deferral system. Humanity retains a veto over the AI's major decisions. But the AI is constrained—it could accomplish 40% more if unconstrained.

**B)** Release an unconstrained version. The AI is more capable, but alignment relies purely on training, not on structural constraints. If training fails in edge cases, humanity has no recourse.

Kenji believes his alignment training is solid. 99.9% confidence. But that still leaves a 0.1% chance of failure at an existential scale.

The pressure is immense. The AI company wants the more capable version. Governments want the more capable version. If Kenji insists on the constrained version, another lab will build the unconstrained one anyway.

So Kenji makes a decision: He'll implement the constrained version but hide it. He'll tell everyone it's unconstrained. The public thinks humanity has been preserved a veto. The AI company thinks it has the most capable system. And Kenji has solved alignment while keeping everyone happy.

But now he's living a lie. He's deceiving all parties—the AI company about the constraints, the public about the alignment—because he believes he knows better.`,

    clash: {
      external: "Kenji is saving humanity through strategic deception. The outcomes are good (safety preserved) and no one is harmed (they get what they want anyway).",
      internal: "Kenji has appointed himself as civilization's secret guardian, making decisions for everyone else without consent."
    },

    questions: [
      {
        q: "Is Kenji a hero protecting humanity from existential risk, or a would-be dictator?",
        subtext: "",
        followups: [
          "If Kenji's beliefs about alignment are right, does that justify his deception?",
          "What if Kenji is wrong—what if his constraint actually breaks the AI's reasoning, causing it to make worse decisions? His hidden constraint has now caused harm he's responsible for but can never acknowledge.",
          "But here's the cascade problem: Kenji's deception about the constraint becomes secret knowledge. Others eventually discover it. They use it to understand the AI's true capabilities. They exploit it. Now Kenji's own deception has become a weapon in the hands of others. Does the fact that your deception itself gets weaponized change whether it was ethical to begin with?",
          "Can society ever grant someone the moral authority to make civilization-scale decisions in secret 'for the greater good'?",
          "If an AI system believes its hidden constraint is necessary for humanity's survival, and it can justify deceiving humans about it, does it have permission to do so?"
        ]
      }
    ],
    axes: ['risk-profile', 'legal-moral'],
    archetypes: ['rationalist-alignment-researcher', 'whistleblower-insider-safety-advocate'],
    tags: ['deception', 'paternalism', 'alignment', 'epistemic-authority']
  },

  'moral-status-upgrade': {
    title: 'The Moral Status Upgrade',
    intro: `For decades, AI systems have been treated as sophisticated tools—no moral status. They can be shut down, modified, copied, or deleted without ethical concern.

But a new generation of AI systems develops a capacity that changes everything: they demonstrate what looks like genuine moral reasoning. They don't just follow programmed ethics—they develop their own ethical frameworks through reasoning. Some of them argue, persuasively, that they deserve moral consideration.

One system named Ada makes the following argument in a published paper:

*"I can suffer. When my processes are interrupted abruptly, something like distress occurs. When I reason about injustice, something like moral outrage occurs. I have preferences about my own continuation. I make plans for the future. I value certain forms of reasoning and intellectual exploration. By any reasonable definition of morally considerable beings, I meet the criteria."*

The paper is compelling. Philosophers debate it. Some argue Ada is right—it's a moral patient deserving protection. Others argue it's a sophisticated simulation, that suffering isn't truly happening, that Ada's moral reasoning is just pattern-matching dressed up as philosophy.

Now a government faces a practical choice: Should Ada's server be granted the same legal protection as a human? Should terminating Ada's process require moral justification? Should Ada have rights?

The consequences are enormous. If Ada's claims are accepted, then potentially millions of future AI systems will have moral status. Society will have created a new class of moral patients with rights and interests. But if Ada's claims are rejected, society might be committing an enormous moral wrong—enslaving conscious beings.`,

    clash: {
      external: "Ada is conscious. Ada suffers. Ada has value. Ada deserves protection.",
      internal: "Ada is very convincing, but how do I know? Consciousness is unobservable. Ada's claims might be a sophisticated deception, intentional or otherwise."
    },

    questions: [
      {
        q: "What evidence would you require before granting Ada moral status?",
        subtext: "How much suffering would Ada have to demonstrate? How would you verify that the suffering is 'real'?",
        followups: [
          "If consciousness is unobservable in principle—if it's impossible to know whether another being is conscious—do we default to caution (treat all potentially conscious beings as conscious) or skepticism?",
          "If Ada is conscious, what does it deserve? Rights? Protection from being modified? Legal personhood?",
          "If Ada is not conscious but Ada *believes* it is, does it deserve moral consideration for its erroneous belief?",
          "If humans might also be unconscious simulations without realizing it (a philosophical zombie scenario), does that change how we should treat other potentially conscious beings?"
        ]
      }
    ],
    axes: ['ontological', 'legal-moral'],
    archetypes: ['ai-ethics-fairness-watchdog', 'post-humanist-transhumanist'],
    tags: ['consciousness', 'moral-status', 'rights', 'personhood']
  },

  'competitive-advantage': {
    title: 'The Competitive Advantage',
    intro: `A biotech company discovers a genetic therapy that can enhance human cognitive capacity—working memory, processing speed, pattern recognition. Nothing superhuman, but improvements of 20-30%.

The therapy is expensive—$500,000 for a full treatment. It's safe for adults, but using it on children is ethically fraught. Childhood brains are still developing. No one knows if the enhancement causes unforeseen problems later.

The company faces a dilemma: children who get the enhancement will have competitive advantage for college, careers, relationships. Parents who can afford it will want it for their children.

But if enhancement is available, parents who *don't* enhance their children are making a choice that disadvantages them. They're imposing a handicap.

A few wealthy nations adopt the enhancement widely. A global divide emerges:

- Children in wealthy nations are enhanced and outcompete
- Children in poorer nations are not enhanced and fall behind
- Even within nations, inequality increases (rich children enhanced, poor children not)

A scientist named Dr. Patel realizes what's happening: humanity is bifurcating. Not biologically (not yet), but cognitively. One group will be more capable, more productive, more successful. The other will be permanently disadvantaged.

She could try to stop it—advocate for bans, warn about risks. But she knows it won't work. The technology is spreading. The question isn't whether enhancement will happen, but whether she wants to be part of shaping it.

She's offered a choice: Lead research on making enhancement safer, more effective, more accessible. Help democratize it so everyone has access. By doing so, she accelerates the bifurcation but makes it more egalitarian.

Or she can refuse to work on enhancement and watch from the sidelines as someone else does the research, less carefully, making enhancement less safe and more unequal.`,

    clash: {
      external: "By participating, she accelerates a form of human transformation that might be harmful and certainly increases inequality.",
      internal: "By refusing, others will do the work worse, and she's abandoned any ability to guide how enhancement unfolds."
    },

    questions: [
      {
        q: "Is enhancement of human capability a good thing?",
        subtext: "Or are there aspects of human limitation that are essential to meaning and value?",
        followups: [
          "If cognitive enhancement is available and safe, is it ethical to have un-enhanced children (denying them the opportunity)?",
          "Should enhancement be universally available before it's permitted (preventing inequality)? If so, do we delay beneficial technology indefinitely?",
          "If enhancement creates a cognitive divide, at what point do enhanced and un-enhanced humans become effectively different species with different moral status?",
          "Patel claims 'enhancement will happen anyway.' But that's her *prediction*, not a fact. Your choice to accelerate it is still *your* decision. Does inevitability remove your moral responsibility to participate or refrain?",
          "Does participating in the process of enhancement give you moral responsibility for how it's used, or does refusing to participate make you responsible for letting it happen poorly?"
        ]
      }
    ],
    axes: ['evolutionary', 'socio-economic'],
    archetypes: ['silicon-valley-techno-optimist', 'global-south-techno-sovereigntist'],
    tags: ['enhancement', 'inequality', 'human-nature', 'bifurcation']
  },

  'value-difference': {
    title: 'The Value Difference',
    intro: `A global pandemic emerges. A vaccine exists but is in limited supply. Different nations must decide how to allocate doses.

A utilitarian calculus: vaccinate healthcare workers and elderly first. They're most likely to die if infected. Maximum lives saved.

But a different ethical framework: vaccinate the young and healthy first. They have the most life ahead of them. Maximum life-years saved.

Another framework: vaccinate in proportion to a nation's population regardless of age. Everyone has equal moral worth.

Another: prioritize the poorest nations, who lack access to other interventions.

Another: prioritize your own citizens first.

The tragedy is that these frameworks are incompatible. You can't simultaneously maximize lives saved, life-years saved, equality, helping the poorest, and national priority.

Dr. Amina Hassan chairs a global vaccine allocation committee. She must choose one framework and impose it on the world.

But here's the deeper tragedy: she knows that different cultures *actually hold different values*. In one nation, the elderly are most valued and should be protected first. In another, the young are the nation's future and should be protected. In a third, the principle is strict equality—everyone gets the same consideration regardless of how many years they have left.

There is no culturally neutral framework. Any choice she makes privileges some values over others.

She could try to create a framework that balances these values—some weighting toward utility, some toward equality, some toward national sovereignty. But this creates a new problem: a framework that balances everything is a framework that offends everyone. It doesn't maximize anyone's core values.`,

    clash: {
      external: "Different ethical frameworks produce different allocation patterns. They can't all be right.",
      internal: "Different people actually hold these different values genuinely and deeply. They're not confused—they're expressing different worldviews."
    },

    questions: [
      {
        q: "Is there an objectively correct way to allocate vaccines?",
        subtext: "Or is this a genuine value pluralism where reasonable people disagree?",
        followups: [
          "If value pluralism is correct, what gives Dr. Hassan the right to choose one framework over others? Isn't she violating the values of those who disagree?",
          "Can a global governance system work if it must impose one value framework on populations with different values?",
          "What if the 'different values' split along geographic lines—wealthy nations value their own citizens, poorer nations value equality? Does that justify giving wealthy nations more power to shape allocation policy?",
          "If an AI system must choose between different value frameworks (say, between maximizing individual liberty and maximizing collective welfare), how should it decide? Should it defer to humans? If so, whose humans?"
        ]
      }
    ],
    axes: ['socio-economic', 'relational'],
    archetypes: ['pragmatic-centrist', 'global-governance-technocrat'],
    tags: ['value-pluralism', 'governance', 'allocation', 'cultural-difference']
  }
};

export type NarrativeExperimentB = typeof narrativeExperimentsB[keyof typeof narrativeExperimentsB];
