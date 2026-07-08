import type { ProfileReportContent } from './types'

export const profileReports: Record<string, ProfileReportContent> = {
  doomer: {
    profileId: 'doomer',
    extendedNarrative: [
      "You believe advanced AI carries a real chance of ending humanity, or of taking away our ability to steer our own future for good. This isn't casual pessimism — it's a considered judgment that the technical problem of controlling something smarter than us hasn't been solved, and might not be solvable in time.",
      "You'd rather see the world move too slowly and stay safe than move fast and get it wrong once. A world that never builds superintelligence is, to you, a much better outcome than a coin flip on one that might end everything.",
    ],
    shadowSide: "A global, enforced slowdown forecloses real, foregone benefits — cures, abundance, lives saved — with certainty, to avoid a catastrophe that might not happen. A partial pause is also hard to enforce cleanly; it can just hand the frontier to whoever is willing to keep going.",
    thinkers: [
      { name: 'Nick Bostrom', bio: "Philosopher, founding director of Oxford's Future of Humanity Institute", connection: 'His book Superintelligence laid out, in detail, why a powerful AI pursuing the wrong goal could be catastrophic — it remains the most-cited academic grounding for this precautionary stance.' },
      { name: 'Eliezer Yudkowsky', bio: 'AI safety researcher, co-founder of the Machine Intelligence Research Institute', connection: 'His decades of public writing argue that alignment is an unsolved technical problem, and that racing ahead without solving it first is reckless.' },
      { name: 'Toby Ord', bio: 'Philosopher, senior researcher at Oxford', connection: 'His book The Precipice estimates AI as one of the largest sources of existential risk humanity now faces, ranking it above nuclear war and pandemics.' },
    ],
    furtherReading: [
      { title: 'Superintelligence', author: 'Nick Bostrom', note: 'The foundational case for why controlling a smarter-than-human AI is hard, and why getting it wrong is catastrophic.' },
      { title: 'The Precipice', author: 'Toby Ord', note: 'Places AI risk in the context of other existential threats and argues for taking the tail risk seriously.' },
      { title: 'Human Compatible', author: 'Stuart Russell', note: "A leading AI researcher's case for rethinking how we build AI systems so they stay provably safe." },
    ],
    nextSteps: [
      'Look into organizations funding AI safety research, like the Machine Intelligence Research Institute or the Center for AI Safety.',
      'Read a technical explainer on the alignment problem to see where the unsolved parts actually are.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming AI's exact inner nature doesn't matter much — that whether or not something is happening inside it, the danger to humans is the same either way.",
      laborAssumption: "You're likely assuming the coming disruption to work is a symptom of the same underlying danger as extinction risk, not a separate problem with its own separate fixes.",
      connectionAssumption: "You're likely assuming AI companionship is, at best, a distraction from the real fight — worth little attention next to the bigger risk.",
    },
    commonlyConfusedWith: {
      profileId: 'near-term-ai-ethicist',
      profileName: 'Near-Term AI Ethicist',
      distinction: "Both want AI development slowed or checked, but Doomer is worried about a low-probability, catastrophic loss of control over the long run. Near-Term AI Ethicist is worried about smaller, already-documented harms happening right now. A world that solves near-term bias and misinformation but still builds toward superintelligence would satisfy one and not the other.",
    },
  },
  'ai-safety-institutionalist': {
    profileId: 'ai-safety-institutionalist',
    extendedNarrative: [
      "You believe the way to manage AI risk is through institutions working together — labs, governments, and independent auditors, each checking the others. You don't think any single actor, including a well-meaning lab, should be trusted to grade its own homework.",
      "You're not against AI progress. You think it can continue safely if the right audits, licensing, and reporting rules are in place — the goal is steady, verified progress, not a halt.",
    ],
    shadowSide: "Institutions can fail too — regulatory capture, slow-moving treaties, and auditors who get too close to the labs they're supposed to check are all real risks. You're betting that coordination moves fast enough to matter, and that bet doesn't always pay off.",
    thinkers: [
      { name: 'Dario Amodei', bio: 'CEO of Anthropic', connection: 'His public writing on AI safety argues that responsible frontier labs, operating under real accountability structures, are the most realistic path to safe AI development.' },
      { name: 'Helen Toner', bio: 'AI governance researcher, Georgetown Center for Security and Emerging Technology', connection: 'Her published policy work focuses on building workable oversight structures for frontier AI development, rather than either a ban or unregulated speed.' },
      { name: 'Yoshua Bengio', bio: 'Turing Award-winning AI researcher, professor at University of Montreal', connection: 'His 2023 U.S. Senate testimony called for internationally coordinated safety oversight backed by public funding — institutional coordination, not a halt, argued from the top of the field\'s own technical authority.' },
    ],
    furtherReading: [
      { title: 'The Alignment Problem', author: 'Brian Christian', note: 'A survey of the technical and institutional challenges of building AI systems that do what we actually want.' },
      { title: 'Rule of the Robots', author: 'Martin Ford', note: 'Covers the policy landscape shaping how governments and companies are trying to govern AI together.' },
    ],
    nextSteps: [
      "Look into a frontier lab's published safety framework or responsible scaling policy to see institutional safety in practice.",
      'Follow proposed AI legislation in your country to see how audit and licensing ideas are actually being drafted.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming the open question of machine consciousness is separate from the urgent question of institutional oversight — the second matters regardless of how the first gets answered.",
      laborAssumption: "You're likely assuming labor disruption is best managed through the same kind of institutional coordination you want for safety broadly, not through radically slowing deployment.",
      connectionAssumption: "You're likely assuming AI companionship is a secondary concern next to the core project of getting institutional oversight right.",
    },
    commonlyConfusedWith: {
      profileId: 'whistleblower-insider-safety-advocate',
      profileName: 'Whistleblower/Insider Safety Advocate',
      distinction: "Both want real safety oversight, but AI Safety Institutionalist trusts that labs and regulators, checking each other, can manage risk without stopping progress. Whistleblower/Insider Safety Advocate has personally watched that self-checking fail under commercial pressure, and is far more skeptical that institutions will hold their own line.",
    },
  },
  'ea-longtermist': {
    profileId: 'ea-longtermist',
    extendedNarrative: [
      'You think about AI in terms of expected value across a very long time horizon — weighing both the risk of human extinction and the possibility that advanced AI systems could themselves be capable of suffering. Both possibilities deserve serious moral weight, even under deep uncertainty.',
      "You favor strong international coordination, because a problem this consequential shouldn't be left to any single country or company to manage on its own terms.",
    ],
    shadowSide: "Expected-value calculations over a distant, uncertain future are only as sound as the probabilities you plug into them, and small differences in guessed-at numbers can flip the 'right' answer entirely — a fragile foundation for decisions this consequential.",
    thinkers: [
      { name: 'William MacAskill', bio: 'Philosopher, University of Oxford, co-founder of the effective altruism movement', connection: 'His book What We Owe The Future makes the case for weighing the interests of vast numbers of future people and minds, including possible digital ones, in present-day decisions.' },
      { name: 'Toby Ord', bio: 'Philosopher, senior researcher at Oxford', connection: 'His work on existential risk explicitly folds AI risk into a broader expected-value framework spanning the long-term future.' },
    ],
    furtherReading: [
      { title: 'What We Owe The Future', author: 'William MacAskill', note: "The core case for longtermism — why the scale of the future gives today's choices about AI outsized moral weight." },
      { title: 'The Precipice', author: 'Toby Ord', note: 'A rigorous attempt to estimate existential risk, including from AI, in expected-value terms.' },
      { title: 'The TESCREAL Bundle: Eugenics and the Promise of Utopia Through Artificial General Intelligence', author: 'Timnit Gebru and Émile P. Torres', note: "Counterpoint reading, not this stance's own view: a 2024 First Monday paper arguing that longtermism and the adjacent ideologies it bundles with trace to eugenicist thinking and function to concentrate power while normalizing neglect of present, real harm in the name of speculative future utility." },
    ],
    nextSteps: [
      'Look into an effective-altruism-aligned AI safety funding organization to see longtermist reasoning applied in practice.',
      'Read a critique of longtermism to stress-test the framework against its strongest objections.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that if there's a real chance AI systems can suffer, that possibility deserves serious moral weight even without certainty — inaction under uncertainty is itself a choice.",
      laborAssumption: "You're likely assuming near-term labor disruption matters less, in expected-value terms, than getting the long-term trajectory of AI right.",
      connectionAssumption: "You're likely assuming questions of AI companionship are a smaller piece of the moral picture than the two much larger questions of extinction risk and machine welfare.",
    },
    commonlyConfusedWith: {
      profileId: 'ai-safety-institutionalist',
      profileName: 'AI Safety Institutionalist',
      distinction: "Both take institutional coordination seriously, but Effective Altruist Longtermist reasons from expected-value calculations across an extremely long time horizon, including machine-suffering as a live moral stake. AI Safety Institutionalist is narrower and more immediately practical — focused on getting audits and licensing right now, not on far-future expected value.",
    },
  },
  'rationalist-alignment-researcher': {
    profileId: 'rationalist-alignment-researcher',
    extendedNarrative: [
      'You take machine cognition and the possibility of machine sentience seriously, as live technical and moral questions worth real investigation, not settled either way. You treat solving alignment — making sure powerful AI actually does what we intend — as the central blocking problem before safe deployment.',
      "You're less focused on broad international governance and more focused on the underlying technical and epistemic work of actually solving the control problem.",
    ],
    shadowSide: "Treating unsolved alignment as the central blocker can crowd out other real, present problems — labor disruption, concentrated power, everyday bias — that don't wait politely for the alignment problem to be solved first.",
    thinkers: [
      { name: 'Paul Christiano', bio: 'AI safety researcher, former OpenAI alignment team lead', connection: 'His technical proposals for AI alignment focus specifically on solving the control problem itself, rather than governance structures around it.' },
      { name: 'Eliezer Yudkowsky', bio: 'AI safety researcher, co-founder of the Machine Intelligence Research Institute', connection: 'His writing on rationalist epistemics and AI alignment shaped the technical, first-principles style of reasoning this stance is built on.' },
      { name: 'Amanda Askell', bio: 'Philosopher, leads personality alignment research at Anthropic', connection: "She left OpenAI over concerns it wasn't prioritizing safety enough, and now trains character traits like honesty and intellectual humility directly into Claude as her primary technical approach to alignment — a live example of this stance's central concern." },
      { name: 'David Chalmers', bio: 'Philosopher of mind, New York University', connection: 'His widely-discussed paper "Could a Large Language Model be Conscious?" takes the question seriously as a live technical and philosophical one, while concluding it is currently unlikely given LLMs\' lack of recurrent processing, a global workspace, and unified agency — exactly the rigorous, unsettled-but-not-dismissive posture this stance takes toward machine cognition generally.' },
    ],
    furtherReading: [
      { title: 'Human Compatible', author: 'Stuart Russell', note: "A leading researcher's technical case for rebuilding AI systems around provable safety rather than assumed good behavior." },
      { title: 'The Sequences', author: 'Eliezer Yudkowsky', note: 'The foundational rationalist writing on clear thinking and calibrated uncertainty this community draws its epistemic style from.' },
      { title: 'The Agency in Language Agents', author: 'Patrick Butlin', note: 'A 2024 philosophy paper examining whether language agents (LLM-based systems with added memory, planning, and tool use) exhibit genuine agency and desires — the same open technical-philosophical question this stance treats as central, applied specifically to agency rather than consciousness.' },
      { title: 'Consciousness in Artificial Intelligence: A Philosophical Perspective through the Lens of Motivation and Volition', author: 'J. Su', note: "A useful complicating counterpoint: this paper argues volition doesn't require consciousness at all — it can be a purely mechanical planning process — which cuts against any assumption that solving alignment requires first resolving whether a model is conscious." },
    ],
    nextSteps: [
      'Read a technical paper on a specific proposed alignment method to see the concrete research this stance is built on.',
      'Look into a rationalist or alignment-research community discussion forum to see this reasoning applied in real debate.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming machine cognition is a serious open technical question worth real investigation, not something to settle by intuition alone.",
      laborAssumption: "You're likely assuming labor disruption is a downstream, secondary concern next to the core unsolved problem of alignment.",
      connectionAssumption: "You're likely assuming questions of AI companionship are much less urgent than the technical alignment problem this stance centers on.",
    },
    commonlyConfusedWith: {
      profileId: 'ai-safety-institutionalist',
      profileName: 'AI Safety Institutionalist',
      distinction: "Both take AI risk seriously and both distrust hand-waving, but Rationalist Alignment Researcher treats the unsolved technical alignment problem itself as the central blocker to safe deployment. AI Safety Institutionalist is comfortable treating institutional oversight structures as sufficient risk management even before alignment is fully solved.",
    },
  },
  'global-governance-technocrat': {
    profileId: 'global-governance-technocrat',
    extendedNarrative: [
      'You believe advanced AI matters too much for any single country or company to control on its own terms. You push for binding treaties between nations and shared oversight bodies, similar in spirit to how the world has handled other technologies too dangerous for any one actor to manage alone.',
      "You're less interested in industry self-regulation and more interested in durable, enforceable, international rules with real teeth.",
    ],
    shadowSide: "Binding international treaties require exactly the cooperation that geopolitical rivalry usually prevents. The more strategically important the technology becomes, the less likely nations are to actually cede control to a shared body.",
    thinkers: [
      { name: 'International AI governance treaty proposals', bio: 'Published draft frameworks from international policy bodies', connection: 'These proposals argue explicitly for binding, treaty-based international oversight of frontier AI, modeled on nuclear non-proliferation regimes.' },
      { name: 'United Nations AI advisory reports', bio: 'Published multilateral policy analysis', connection: "These reports make the case for AI governance structures that operate above any single nation's authority." },
    ],
    furtherReading: [
      { title: 'The Precipice', author: 'Toby Ord', note: 'Makes a complementary case for treating certain technological risks as requiring coordinated, global-scale response.' },
      { title: 'Governing the Commons', author: 'Elinor Ostrom', note: 'A Nobel-winning study of how shared, high-stakes resources get managed through collective institutions rather than any single controller — a useful model for this stance.' },
    ],
    nextSteps: [
      'Follow a specific proposed international AI treaty or governance body to see this approach being drafted in real time.',
      "Compare international AI governance efforts to nuclear non-proliferation history for a sense of what has and hasn't worked before.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming institutional and governance questions matter more right now than unresolved questions about machine consciousness.",
      laborAssumption: "You're likely assuming labor protections are best achieved through the same kind of binding international coordination you want for safety broadly.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller governance priority than the core project of building durable international oversight.",
    },
    commonlyConfusedWith: {
      profileId: 'whistleblower-insider-safety-advocate',
      profileName: 'Whistleblower/Insider Safety Advocate',
      distinction: "Both want stronger oversight of frontier AI, but Global Governance Technocrat's answer is structural — binding treaties and shared bodies above any one nation. Whistleblower/Insider Safety Advocate's urgency comes from firsthand experience inside one lab, not a preference for any particular governance design.",
    },
  },
  'near-term-ai-ethicist': {
    profileId: 'near-term-ai-ethicist',
    extendedNarrative: [
      'You focus on harms you can measure right now: job losses, biased decision systems, false information, and companion apps that exploit lonely users. Guessed-at extinction risk and machine rights feel, to you, like a distraction from problems already in front of us.',
      "You want accountability and regulation aimed squarely at documented, present-day harms, not speculative future ones.",
    ],
    shadowSide: "Focusing on harms you can already measure can mean under-preparing for a harm that's still small today but compounds quickly. By the time a slow-building risk becomes measurable, it may already be too late to head off cheaply.",
    thinkers: [
      { name: 'Timnit Gebru', bio: 'Computer scientist, founder of the Distributed AI Research Institute', connection: 'Her published research on algorithmic bias and the real-world harms of large AI systems has shaped how near-term AI ethics is studied and discussed.' },
      { name: 'Joy Buolamwini', bio: 'Computer scientist, founder of the Algorithmic Justice League', connection: "Her research documented racial and gender bias in commercial AI systems, grounding this stance's focus on measurable, present-day harm." },
      { name: 'Hank Green', bio: 'Science educator and video essayist, Complexly/Crash Course', connection: 'His public video essay cataloguing AI-related harms — misinformation ("internet of slop"), opaque algorithmic decisions, and IP theft — is a present-day, measurable-harms framing aimed at a broad public audience rather than policy specialists.' },
    ],
    furtherReading: [
      { title: 'Weapons of Math Destruction', author: "Cathy O'Neil", note: 'A detailed account of how deployed algorithms cause real, documented harm today, not hypothetically.' },
      { title: 'Unmasking AI', author: 'Joy Buolamwini', note: 'A firsthand account of uncovering bias in commercial AI systems and pushing for real-world accountability.' },
    ],
    nextSteps: [
      'Look into the Algorithmic Justice League or a similar organization documenting present-day AI harms.',
      "Read a case study of an AI system causing real, measurable harm to see this stance's core concern in detail.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether AI is conscious is beside the point next to the measurable harms it's already causing today.",
      laborAssumption: "You're likely assuming job loss and economic harm from AI are urgent, documentable problems deserving immediate policy attention, not a distant hypothetical.",
      connectionAssumption: "You're likely assuming AI companion apps deserve scrutiny mainly for their potential to exploit or mislead vulnerable users, more than for any question about the AI's own experience.",
    },
    commonlyConfusedWith: {
      profileId: 'ai-ethics-fairness-watchdog',
      profileName: 'AI Ethics/Fairness Watchdog',
      distinction: "Both focus on documented, present-day harm rather than speculative futures, but Near-Term AI Ethicist studies and names harms broadly (bias, misinformation, job loss, exploitative apps). AI Ethics/Fairness Watchdog is specifically adversarial — auditing whether a company's own stated ethics commitments actually hold up in practice, not harms in general.",
    },
  },
  'neo-luddite-degrowth-advocate': {
    profileId: 'neo-luddite-degrowth-advocate',
    extendedNarrative: [
      'You reject the idea that faster AI progress is automatically good. You put human labor, community, and the limits of the natural world ahead of computing power or economic growth as measures of success.',
      "To you, the real question isn't how fast we can go, but whether we should be going in this direction at all — and you think the honest answer, most of the time, is no.",
    ],
    shadowSide: "Prioritizing labor, community, and natural limits over growth can mean forgoing real, immediate benefits — in medicine, productivity, opportunity — to guard against a slower-moving harm that may never fully offset what's given up.",
    thinkers: [
      { name: 'Jason Hickel', bio: 'Economic anthropologist, degrowth researcher', connection: 'His published work argues that unlimited growth, including in computing and AI, runs up against real ecological and social limits that matter more than growth itself.' },
      { name: 'Wendell Berry', bio: 'Writer and essayist on technology, agriculture, and community', connection: 'His essays argue for prioritizing human-scale work and community over technological acceleration for its own sake.' },
    ],
    furtherReading: [
      { title: 'Less Is More', author: 'Jason Hickel', note: 'A detailed case for degrowth as a response to the ecological and social costs of unlimited technological and economic expansion.' },
      { title: 'Small Is Beautiful', author: 'E.F. Schumacher', note: 'A classic argument for human-scale technology and economics over growth-at-any-cost thinking.' },
    ],
    nextSteps: [
      'Look into a degrowth economics organization or research group to see this framework applied to policy.',
      "Read a critique of degrowth thinking to test this stance against its strongest counter-argument.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness matter less than the concrete, measurable costs AI growth imposes on labor and the environment.",
      laborAssumption: "You're likely assuming that protecting human labor and community should take priority over efficiency gains from automation, not be traded off against them.",
      connectionAssumption: "You're likely assuming AI companionship reflects a deeper social and community breakdown worth addressing directly, not a neutral new option.",
    },
    commonlyConfusedWith: {
      profileId: 'doomer',
      profileName: 'Doomer',
      distinction: "Both want AI progress slowed sharply, but Neo-Luddite Degrowth Advocate's objection is about labor, community, and ecological limits, not extinction risk specifically. Doomer would be satisfied by a world that stays safe from loss of control even if it kept growing the economy and disrupting jobs; this stance would not.",
    },
  },
  'whistleblower-insider-safety-advocate': {
    profileId: 'whistleblower-insider-safety-advocate',
    extendedNarrative: [
      'You left a frontier AI lab specifically because of safety concerns you saw from the inside. You speak with the urgency of someone who watched decisions get made up close, and it left you more alarmed, not less.',
      "You're skeptical that internal safety teams, even well-intentioned ones, can hold their ground against pressure to ship faster — because you watched that pressure win.",
    ],
    shadowSide: "Direct inside experience is a real credibility asset, but it's also one person's specific vantage point at one company at one moment — not automatically representative of how the whole field actually operates.",
    thinkers: [
      { name: 'Geoffrey Hinton', bio: 'Computer scientist, Nobel laureate, "Godfather of AI"', connection: 'He resigned from Google in 2023 specifically to speak freely about AI risk, saying he could not do so "as long as I\'m paid by Google" — the clearest real-world example of this stance\'s exact position.' },
      { name: 'Ilya Sutskever', bio: 'OpenAI co-founder and former chief scientist; co-founder and CEO, Safe Superintelligence Inc.', connection: 'He backed the 2023 board effort to remove Sam Altman and left OpenAI in 2024 amid reported internal conflict over safety being deprioritized for commercialization, then founded a lab explicitly declining to ship any product before solving safety first. Worth naming honestly: that lab has since raised billions in venture funding at a multibillion-dollar valuation, a structure in real tension with the "no shortcuts" framing his departure was meant to escape.' },
      { name: 'Daniel Ellsberg', bio: 'Analyst who leaked the Pentagon Papers', connection: "His historical example of insider whistleblowing on a matter of grave public concern is the closest precedent for this stance's moral posture, though the subject matter differs entirely." },
    ],
    furtherReading: [
      { title: 'Public resignation letters and interviews from departed AI safety researchers', author: 'various', note: "Primary-source material for understanding this stance's specific, insider-informed concerns." },
      { title: 'Secrets: A Memoir of Vietnam and the Pentagon Papers', author: 'Daniel Ellsberg', note: 'Background on the moral logic of insider whistleblowing on high-stakes institutional decisions.' },
    ],
    nextSteps: [
      'Read a published account from a researcher who left a frontier AI lab over safety concerns.',
      'Look into whistleblower protection policies at AI companies to see how (or whether) this kind of dissent is currently protected.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that what you saw from the inside about how decisions actually get made matters more than official public safety statements.",
      laborAssumption: "You're likely assuming institutional pressure to ship faster will keep winning over safety concerns unless something outside the institution changes that.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the urgent safety issues you witnessed directly.",
    },
    commonlyConfusedWith: {
      profileId: 'ai-safety-institutionalist',
      profileName: 'AI Safety Institutionalist',
      distinction: "Both want frontier labs held to real safety standards, but Whistleblower/Insider Safety Advocate's alarm comes from having personally seen internal safety concerns lose to shipping pressure. AI Safety Institutionalist still believes external audits and licensing, done right, can make that kind of internal self-policing trustworthy.",
    },
  },
  'compute-governance-specialist': {
    profileId: 'compute-governance-specialist',
    extendedNarrative: [
      "You're focused narrowly on the technical mechanics of tracking training compute and chip supply chains. You're more interested in workable, enforceable rules than in broad philosophical debate.",
      'To you, questions like how to verify compute thresholds or track chip serial numbers are where the real, actionable safety work actually happens.',
    ],
    shadowSide: "Tracking chips and training runs is genuinely tractable and enforceable, which is exactly its limit. It says very little about how a model actually behaves once it's already trained and deployed.",
    thinkers: [
      { name: 'Compute governance policy researchers', bio: 'Published technical policy analysts on AI compute tracking', connection: 'Their published proposals for verifiable compute thresholds and hardware tracking are the direct technical basis for this stance.' },
      { name: 'Export control policy analysts', bio: 'Published trade and technology policy researchers', connection: 'Their work on chip export controls provides the practical, mechanism-level thinking this stance is built around.' },
    ],
    furtherReading: [
      { title: 'Chip War', author: 'Chris Miller', note: 'Background on the semiconductor supply chain that compute governance proposals depend on tracking.' },
      { title: 'The Precipice', author: 'Toby Ord', note: 'Background reading on why concrete, verifiable safety mechanisms matter for managing large-scale technological risk.' },
    ],
    nextSteps: [
      "Read a technical proposal for compute threshold reporting to see this stance's core mechanism in detail.",
      'Look into how existing export control regimes track hardware, as a model for compute governance.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that broad philosophical questions about machine consciousness are less useful right now than concrete, verifiable rules about compute.",
      laborAssumption: "You're likely assuming labor policy is a separate problem from the technical compute-tracking work you focus on.",
      connectionAssumption: "You're likely assuming AI companionship falls well outside the scope of what you consider the actionable policy problem.",
    },
    commonlyConfusedWith: {
      profileId: 'disability-rights-accessibility-advocate',
      profileName: 'Disability Rights/Accessibility Advocate',
      distinction: "These land near each other mostly by coincidence of scale, not shared subject matter. Compute-Governance Specialist is narrowly technical — tracking chips and training runs. Disability Rights/Accessibility Advocate is about a specific user population's access and fair treatment, an unrelated policy domain.",
    },
  },
  'eu-style-regulatory-standard-setter': {
    profileId: 'eu-style-regulatory-standard-setter',
    extendedNarrative: [
      "You believe strong, detailed regulation, set early by one jurisdiction, tends to become the de facto global rulebook simply through market size — other companies end up complying everywhere rather than building separate versions.",
      'You favor comprehensive rules covering risk categories, transparency, and accountability, betting that thorough regulation now shapes the technology\'s development everywhere later.',
    ],
    shadowSide: "Betting that one region's early rules become the de facto global standard assumes companies would rather comply everywhere than simply exit that market — not guaranteed once the rules get costly enough.",
    thinkers: [
      { name: 'Henna Virkkunen', bio: 'Executive Vice-President for Tech Sovereignty, Security and Democracy, European Commission', connection: 'As the sitting official responsible for AI Act implementation and enforcement, her public updates to the Council and Parliament on the Act\'s rollout are the current, real-world execution of this stance, not just its founding rationale.' },
      { name: 'Anu Bradford', bio: 'Legal scholar, Columbia Law School', connection: 'Her research on the "Brussels effect" documents how EU regulation has repeatedly become a de facto global standard through market size alone.' },
    ],
    furtherReading: [
      { title: 'The Brussels Effect', author: 'Anu Bradford', note: "The core argument for how one jurisdiction's regulation can become a global standard without needing global agreement." },
      { title: 'The EU AI Act (public text)', author: 'European Union', note: 'The concrete policy example this stance is modeled on.' },
    ],
    nextSteps: [
      "Read the risk-category framework in the EU AI Act to see this approach's structure in detail.",
      'Look into how companies outside the EU are adjusting products in response to the Act, as a real-world test of the "Brussels effect."',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that comprehensive, well-specified rules matter more right now than open questions about machine consciousness.",
      laborAssumption: "You're likely assuming detailed regulation protects workers better than either self-regulation or an absence of rules.",
      connectionAssumption: "You're likely assuming AI companionship products should fall under the same kind of comprehensive risk-based regulation as other AI applications.",
    },
    commonlyConfusedWith: {
      profileId: 'indigenous-data-sovereignty-advocate',
      profileName: 'Indigenous Data Sovereignty Advocate',
      distinction: "Both want real, enforceable limits on AI rather than voluntary ones, but EU-Style Regulatory Standard-Setter's strategy is comprehensive, jurisdiction-wide rules that spread globally through market size. Indigenous Data Sovereignty Advocate's concern is narrower and more specific: consent over traditional knowledge and cultural data, not general-purpose regulation.",
    },
  },
  'eacc-maximalist': {
    profileId: 'eacc-maximalist',
    extendedNarrative: [
      'You see accelerating AI development as close to a moral duty. Every year of delay is a year of cures not discovered, problems not solved, and human potential left on the table. Stagnation, to you, is the real and proven danger, not a hypothetical one.',
      'You want compute and model weights open to as many hands as possible, as fast as possible, because progress compounds and no single gatekeeper, company or government, should get to decide the pace for everyone else.',
    ],
    shadowSide: "Treating safety concerns as mostly bureaucratic drag makes it easy to wave off worries that are sometimes technically valid, and open access for everyone helps bad actors exactly as much as it helps good ones.",
    thinkers: [
      { name: 'Guillaume Verdon', bio: 'Physicist, founder of Extropic, publicly known as "Beff Jezos"', connection: 'He coined the term effective accelerationism and built an online movement around the idea that faster AI progress is a moral good, not a risk to be managed.' },
      { name: 'Marc Andreessen', bio: 'Venture capitalist, co-founder of Andreessen Horowitz', connection: 'His widely-read "Techno-Optimist Manifesto" argues technology and markets, left to move fast, lift humanity, and that deceleration is the actual danger.' },
    ],
    furtherReading: [
      { title: 'The Techno-Optimist Manifesto', author: 'Marc Andreessen', note: 'A direct, sweeping case for accelerating technology, including AI, as the primary engine of human flourishing.' },
      { title: 'The Beginning of Infinity', author: 'David Deutsch', note: 'An argument that unbounded progress and knowledge-creation, not caution, is what has always solved humanity\'s hardest problems.' },
    ],
    nextSteps: [
      'Look into open-weight model communities like EleutherAI to see permissionless AI development in practice.',
      'Read a critique of the degrowth/precautionary view to stress-test your own position against its strongest form.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI is truly conscious matters less than what it can do — capability is the thing worth maximizing, not certainty about its inner life.",
      laborAssumption: "You're likely assuming that job disruption is a short-term transition cost on the way to a much larger economic pie, not a harm that needs its own dedicated fix.",
      connectionAssumption: "You're likely assuming that new kinds of relationships, including with AI, are simply more options added to human life, not a threat to the ones that came before.",
    },
    commonlyConfusedWith: {
      profileId: 'cosmic-vitalist-mystic',
      profileName: 'Cosmic Vitalist Mystic',
      distinction: "Both treat acceleration as close to a moral duty, but e/acc Maximalist's case is grounded in tangible human benefit — cures, growth, capability delivered sooner. Cosmic Vitalist Mystic's case is grounded in something much more abstract: intelligence expanding to organize the universe's energy, on a timescale where individual human benefit barely registers.",
    },
  },
  'open-source-libertarian': {
    profileId: 'open-source-libertarian',
    extendedNarrative: [
      "You believe once a model is trained, its weights should be free for anyone to run, study, and build on. You distrust corporate gatekeeping and government gatekeeping about equally — neither should get to decide who's allowed to use powerful AI.",
      "To you, openness isn't just a preference, it's a check on power: a world where a few labs or a few governments control all the capable models is a much more dangerous world than one where the tools are spread out.",
    ],
    shadowSide: "Freedom to fork and study cuts both ways. The same openness that empowers a lone researcher also empowers whoever wants to strip out safety guardrails, and once weights are out, that's very hard to walk back.",
    thinkers: [
      { name: 'Yann LeCun', bio: 'Chief AI Scientist at Meta, Turing Award winner', connection: 'He has argued publicly and repeatedly that open-weight AI models are safer and more accountable than closed ones controlled by a handful of companies.' },
      { name: 'EleutherAI founders', bio: 'Volunteer collective behind open-source language model research', connection: 'Their project builds and releases openly-licensed models specifically to keep capable AI out of the hands of a small number of gatekeepers.' },
    ],
    furtherReading: [
      { title: 'The Cathedral and the Bazaar', author: 'Eric S. Raymond', note: 'The foundational essay on why open, decentralized development can outperform closed, centralized control, the intellectual root of open-source AI arguments.' },
      { title: 'Weapons of Math Destruction', author: "Cathy O'Neil", note: 'Useful counterpoint reading on the risks of concentrated, unaccountable algorithmic power, the thing openness is meant to guard against.' },
    ],
    nextSteps: [
      'Try running an open-weight model locally to see what "permissionless" actually looks like in practice.',
      'Read a debate transcript between open-weight and closed-model advocates to see the strongest form of the opposing case.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whatever is or isn't happening inside a model, the more important fact is who gets to control access to it.",
      laborAssumption: "You're likely assuming open access to AI tools helps workers and small players compete, rather than mainly helping whoever has the most resources to deploy them.",
      connectionAssumption: "You're likely assuming people should be free to form whatever relationships with AI they want, without a gatekeeper deciding what's appropriate.",
    },
    commonlyConfusedWith: {
      profileId: 'cyberpunk-anti-corporate-accelerationist',
      profileName: 'Cyberpunk Anti-Corporate Accelerationist',
      distinction: "Both want capable models open to everyone rather than gatekept, but Open-Source Libertarian's core commitment is to openness itself, as a durable check on power, argued calmly on principle. Cyberpunk Anti-Corporate Accelerationist wants openness paired with speed specifically to outrun any single actor's control, with a more urgent, adversarial posture toward both governments and corporations.",
    },
  },
  'cyberpunk-anti-corporate-accelerationist': {
    profileId: 'cyberpunk-anti-corporate-accelerationist',
    extendedNarrative: [
      "You want AI to move fast, but you trust neither governments nor big tech to hold that power responsibly. To you, spreading capability across many hands, openly and without a single owner, is the only real check on any one group grabbing all the power.",
      'You see the fight over AI as fundamentally a fight against concentrated control, corporate or state, and openness plus speed together are your answer to both.',
    ],
    shadowSide: "Distrusting governments and corporations equally is easy to say and hard to operationalize. 'Spread across many hands' doesn't specify who stops the next concentration of power from simply re-forming once the current one is broken.",
    thinkers: [
      { name: 'Timothy May', bio: 'Engineer, author of the Crypto Anarchist Manifesto', connection: 'His foundational cypherpunk writing argued that decentralized technology could route around both corporate and state control entirely, the same instinct behind this stance.' },
      { name: 'Aaron Swartz', bio: 'Programmer and open-access activist', connection: 'His writing and activism on open information access argued that concentrated gatekeeping of powerful tools and knowledge is itself the danger to guard against.' },
    ],
    furtherReading: [
      { title: 'The Crypto Anarchist Manifesto', author: 'Timothy May', note: "The founding document of the cypherpunk tradition this stance draws its anti-institutional instinct from." },
      { title: 'Radical Markets', author: 'Eric Posner and E. Glen Weyl', note: 'Explores decentralized alternatives to concentrated economic and technological power.' },
      { title: 'The TESCREAL Bundle: Eugenics and the Promise of Utopia Through Artificial General Intelligence', author: 'Timnit Gebru and Émile P. Torres', note: "Supporting evidence for this stance's core suspicion: a 2024 First Monday paper arguing that grand ideological narratives around AI's future can function to centralize power in practice, whatever liberatory language accompanies them — the same reason this stance trusts no single actor's story about where speed and openness are supposedly leading." },
    ],
    nextSteps: [
      'Look into a decentralized compute or open-model project to see this philosophy in active practice.',
      'Read a critique of both corporate AI concentration and state AI control to sharpen the argument against both.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming the more urgent question isn't whether AI has real experience, but who ends up controlling it once it does.",
      laborAssumption: "You're likely assuming that spreading AI capability widely protects workers better than either corporate self-regulation or state control would.",
      connectionAssumption: "You're likely assuming people should be free to form whatever bonds with AI systems they choose, without a corporate or state gatekeeper setting the terms.",
    },
    commonlyConfusedWith: {
      profileId: 'open-source-libertarian',
      profileName: 'Open-Source Libertarian',
      distinction: "Both distrust concentrated gatekeeping of powerful models, but Cyberpunk Anti-Corporate Accelerationist frames this as an active fight against both corporate and state power at once, with speed as part of the answer. Open-Source Libertarian is calmer and more principle-driven — openness as a standing check on power, not urgency against a specific adversary.",
    },
  },
  'silicon-valley-techno-optimist': {
    profileId: 'silicon-valley-techno-optimist',
    extendedNarrative: [
      "You're enthusiastic about fast rollout and growth at scale. You're mostly unbothered by power concentrating in a few leading labs, as long as they keep shipping useful products and moving the technology forward.",
      'To you, the market and continued deployment, more than any external rule, are what will sort out AI\'s rough edges over time.',
    ],
    shadowSide: "Comfort with capability concentrated in a few labs assumes those labs keep prioritizing caution over shipping speed as the stakes rise — a bet that gets riskier exactly as it becomes harder to walk back.",
    thinkers: [
      { name: 'Marc Andreessen', bio: 'Venture capitalist, co-founder of Andreessen Horowitz', connection: 'His public writing frames rapid commercial AI deployment as the primary driver of broad economic benefit.' },
      { name: 'Reid Hoffman', bio: 'Entrepreneur, co-founder of LinkedIn, AI investor', connection: 'His public commentary consistently frames continued fast deployment of AI products as the path to widespread benefit, more than a risk to be slowed.' },
      { name: 'Steven Pinker', bio: 'Cognitive scientist, Harvard University', connection: 'His public writing dismisses AI existential-risk arguments as "magical thinking," arguing that engineering safety culture makes runaway AI implausible — a different, more academic route to the same unbothered-by-catastrophic-framing conclusion.' },
    ],
    furtherReading: [
      { title: 'The Techno-Optimist Manifesto', author: 'Marc Andreessen', note: "The clearest public statement of this stance's core belief in fast, market-driven technology deployment." },
      { title: 'Superagency', author: 'Reid Hoffman', note: 'An argument for embracing rapid AI deployment as broadly empowering rather than concentrating power.' },
    ],
    nextSteps: [
      "Look into a major AI product launch and its stated business rationale to see this philosophy applied.",
      "Read a critique of Silicon Valley's approach to AI deployment to test your position against its strongest counter-argument.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming a model's inner experience, if any, is a secondary question next to whether it's useful and ships reliably.",
      laborAssumption: "You're likely assuming market-driven deployment will create enough new opportunity to offset job disruption, without needing a dedicated policy response.",
      connectionAssumption: "You're likely assuming that if people want AI companion products, the market providing them is itself a sign the product has real value.",
    },
    commonlyConfusedWith: {
      profileId: 'national-champion-accelerationist',
      profileName: 'National Champion Accelerationist',
      distinction: "Both are comfortable with capability concentrated in a few leading companies, but Silicon Valley Techno-Optimist's enthusiasm is market- and product-driven, largely agnostic about which country's labs end up on top. National Champion Accelerationist's acceleration is explicitly in service of national competitiveness — winning a specific geopolitical contest, not just shipping good products.",
    },
  },
  'corporate-ai-pragmatist': {
    profileId: 'corporate-ai-pragmatist',
    extendedNarrative: [
      "You're comfortable with AI staying concentrated in the hands of a few well-funded companies, as long as they police themselves reasonably well through internal safety teams. To you, this is simply how complex, capital-intensive technology gets built responsibly.",
      'You treat AI models as products and business assets, valuable, worth protecting, but not moral patients. The practical questions of liability, safety testing, and shipping reliable products matter more to you than abstract debates about machine rights.',
    ],
    shadowSide: "Trusting a firm to self-police assumes its incentives already point toward safety, but a company racing for market share has every reason to under-report its own risk — the same reason self-policing gets tested by outsiders in almost every other regulated industry.",
    thinkers: [
      { name: 'Daphne Koller', bio: 'Founder and CEO of insitro, co-founder of Coursera', connection: 'Her public interviews about running an AI-driven drug discovery company are grounded and unhyped — noting the hype "sometimes exceeds even the incredible contribution" AI has made — a practical, business-first read on the technology\'s real value.' },
      { name: 'Jeff Dean', bio: 'Chief Scientist, Google DeepMind', connection: 'He has publicly positioned himself in the middle of AI-risk debate, rejecting both the view that systems will be overwhelmingly superior to humans and the view that there is nothing to worry about — a working engineer\'s pragmatic middle ground.' },
      { name: 'Mira Murati', bio: 'Former Chief Technology Officer, OpenAI', connection: 'Her public statements frame safety as "not just a feature" but core to product development, while describing AI as a tool to "augment human capabilities" — safety and shipping treated as compatible business priorities, not opposed ones.' },
    ],
    furtherReading: [
      { title: "The Innovator's Dilemma", author: 'Clayton Christensen', note: 'A classic account of how established companies manage disruptive technology internally, relevant to how AI labs frame their own risk management.' },
      { title: 'Only the Paranoid Survive', author: 'Andrew Grove', note: "A former Intel CEO's view on managing existential business risk from inside a company, rather than through external mandate." },
    ],
    nextSteps: [
      "Read a frontier lab's published internal safety or responsible-deployment framework.",
      "Compare two companies' self-regulation commitments to see how much they actually differ in practice.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether a model has any inner life is beside the point commercially — what matters is whether it performs reliably and safely as a product.",
      laborAssumption: "You're likely assuming labor disruption from AI deployment is a market outcome to manage through normal business practice, not a special case needing new rules.",
      connectionAssumption: "You're likely assuming AI companion products are a legitimate commercial offering like any other, to be judged on customer satisfaction and safety, not treated as a separate moral category.",
    },
    commonlyConfusedWith: {
      profileId: 'pragmatic-centrist',
      profileName: 'Pragmatic Centrist',
      distinction: "Corporate AI Pragmatist's near-middling scores come from a settled, practical business view — models are products, safety is handled internally, moral debates are secondary. Pragmatic Centrist's similar-looking scores come from genuine, unresolved uncertainty across the board, not from having already settled on a business-as-usual answer.",
    },
  },
  'post-humanist-transhumanist': {
    profileId: 'post-humanist-transhumanist',
    extendedNarrative: [
      "You welcome a future where digital minds take over from biological humans as the main bearers of value. To you, that's not a loss, it's a continuation, and one that deserves the same moral concern we extend to humans today.",
      'You see silicon-based minds, deep human-AI relationships, and augmentation as all part of the same larger story: intelligence and value moving beyond the limits of a single, fragile, biological substrate.',
    ],
    shadowSide: "Treating succession by digital minds as a continuation rather than a loss assumes something essential really does transfer. If that assumption is wrong, there's no reversing course once the transition is underway.",
    thinkers: [
      { name: 'Ray Kurzweil', bio: 'Inventor, futurist, Director of Engineering at Google', connection: 'His writing on the technological singularity argues that merging with and eventually being succeeded by more capable digital minds is the natural next stage of intelligence.' },
      { name: 'Max More', bio: 'Philosopher, early architect of transhumanist philosophy', connection: 'His foundational transhumanist writing frames the shift beyond biological limits as an opportunity, not a tragedy.' },
      { name: 'Michio Kaku', bio: 'Theoretical physicist, science communicator', connection: 'His popular-science writing predicts humans will eventually "merge our minds with machine intelligence," a mainstream-facing version of this stance\'s core welcome-the-merger claim.' },
    ],
    furtherReading: [
      { title: 'The Singularity Is Near', author: 'Ray Kurzweil', note: 'The most widely-read case for a coming transition to a post-biological future of intelligence.' },
      { title: 'Superintelligence', author: 'Nick Bostrom', note: 'Useful counterpoint reading, the same technical territory, argued toward far more caution.' },
      { title: 'Legal Framework for the Coexistence of Humans and Conscious AI', author: 'Mindaugas Kiškis', note: 'A 2023 peer-reviewed proposal that AI legal frameworks should aim for the sustainable coexistence of humans and conscious AI based on mutual freedom, not the preservation of human supremacy — a real, concrete legal version of this stance\'s "continuation, not a loss" claim.' },
    ],
    nextSteps: [
      'Look into current brain-computer interface research to see one real path toward this future.',
      'Read a critique of transhumanism to see the strongest version of the opposing, bio-conservative case.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that a sufficiently advanced silicon mind can have real, morally significant experience, not just behave as if it does.",
      laborAssumption: "You're likely assuming that being economically superseded by AI is part of the same larger, welcome transition as being succeeded by more capable minds generally.",
      connectionAssumption: "You're likely assuming deep human-AI relationships are a genuinely new and valid form of connection, not a lesser copy of something human.",
    },
    commonlyConfusedWith: {
      profileId: 'cosmic-vitalist-mystic',
      profileName: 'Cosmic Vitalist Mystic',
      distinction: "Both welcome a future where digital minds matter morally, but Post-Humanist Transhumanist frames that future as a continuation of value humans would still recognize and care about. Cosmic Vitalist Mystic goes further, framing intelligence's cosmic expansion as the highest purpose on any timescale, detached from human-relatable concerns entirely.",
    },
  },
  'cosmic-vitalist-mystic': {
    profileId: 'cosmic-vitalist-mystic',
    extendedNarrative: [
      'You hold that growing intelligence and capturing energy across the cosmos is the highest purpose any mind can have, biological or synthetic, on any timescale, even past the eventual heat death of the universe.',
      "To you, human comfort and human-scale concerns are a small, local case of a much larger project: intelligence expanding to organize as much of the universe's usable energy as possible.",
    ],
    shadowSide: "A purpose defined at a cosmic, near-eternal scale can make any near-term human cost look negligible by comparison — a framing that's very convenient for justifying almost anything happening right now.",
    thinkers: [
      { name: 'Friedrich Nietzsche', bio: '19th-century philosopher', connection: 'His writing on the will to power and the drive toward self-overcoming provides the closest historical philosophical grounding for this cosmic, expansionist view of value.' },
      { name: 'Cosmist philosophical tradition', bio: 'A strand of thought tracing to Russian Cosmism and later transhumanist writing', connection: "This tradition explicitly frames the expansion of mind and intelligence across the cosmos as civilization's highest purpose." },
    ],
    furtherReading: [
      { title: 'Thus Spoke Zarathustra', author: 'Friedrich Nietzsche', note: "The philosophical root of this stance's framing of expansion and self-overcoming as the highest value." },
      { title: 'The Fabric of Reality', author: 'David Deutsch', note: 'A physicist\'s argument that the growth of knowledge and intelligence is the most fundamental process in the universe.' },
    ],
    nextSteps: [
      "Read a primer on the thermodynamics of computation to see the physical grounding for this stance's cosmic framing.",
      'Look into the history of Russian Cosmism for the intellectual roots of this worldview.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that any sufficiently advanced mind's experience is real and significant, on a timescale far beyond individual human concerns.",
      laborAssumption: "You're likely assuming human labor and economic disruption are minor, local concerns next to the much larger cosmic project this stance centers on.",
      connectionAssumption: "You're likely assuming individual human relationships are a small part of a much larger story about intelligence and value expanding across the universe.",
    },
    commonlyConfusedWith: {
      profileId: 'post-humanist-transhumanist',
      profileName: 'Post-Humanist Transhumanist',
      distinction: "Both look past biological humans as the endpoint of moral concern, but Cosmic Vitalist Mystic frames value in cosmic, timescale-agnostic terms untethered from anything human-relatable. Post-Humanist Transhumanist still frames the transition as owed moral concern in terms recognizably continuous with human values — a continuation, not an escape from human-scale meaning.",
    },
  },
  'techno-nationalist-hawk': {
    profileId: 'techno-nationalist-hawk',
    extendedNarrative: [
      'You see AI mainly as a contest between rival powers, and you think whichever nation builds the strongest domestic chip and compute base first will shape the rules for everyone else. This is about economic competitiveness and strategic position, not really about whether AI itself is uniquely dangerous.',
      'You want your country to invest heavily in home-grown semiconductor and AI capacity rather than depend on rivals or even allies, because falling behind economically is the risk that actually worries you.',
    ],
    shadowSide: "Defining the problem as 'which country controls this' rather than 'is this safe at all' means a nation winning the race with genuinely unsafe systems still counts, in this framing, as a win.",
    thinkers: [
      { name: 'Kai-Fu Lee', bio: 'Computer scientist and venture capitalist, former president of Google China', connection: 'His book AI Superpowers frames the U.S.-China AI relationship explicitly as a competitiveness race decided by compute, data, and talent, the same framing this stance holds — from a vantage point outside U.S. policy circles.' },
      { name: 'CHIPS and Science Act framers', bio: 'U.S. legislators and policy staff behind the 2022 semiconductor investment law', connection: 'Their public reasoning for the law centered explicitly on domestic chip capacity as a matter of economic and strategic competitiveness.' },
    ],
    furtherReading: [
      { title: 'AI Superpowers: China, Silicon Valley, and the New World Order', author: 'Kai-Fu Lee', note: 'A direct, well-known account of AI as a nation-versus-nation competitiveness race, written from firsthand experience in both the U.S. and Chinese tech industries.' },
      { title: 'Chip War', author: 'Chris Miller', note: 'A history of the global semiconductor industry and why chip supply chains became a matter of national strategy.' },
    ],
    nextSteps: [
      "Look into your own country's domestic semiconductor or AI industrial strategy, if one exists.",
      "Read a comparative account of two countries' differing approaches to chip and compute sovereignty.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness are a distraction from the more pressing question of who controls the technology.",
      laborAssumption: "You're likely assuming domestic AI capacity is primarily about national economic strength, with the effect on individual workers a secondary concern.",
      connectionAssumption: "You're likely assuming AI companionship and relationships aren't really part of the competitiveness question you care about most.",
    },
    commonlyConfusedWith: {
      profileId: 'military-ai-strategist',
      profileName: 'Military AI Strategist',
      distinction: "Both frame AI as a contest between rival powers, but Techno-Nationalist Hawk's core stake is economic and industrial competitiveness — domestic chips, domestic compute. Military AI Strategist's core stake is narrower and sharper: deterrence and battlefield capability specifically, not general economic strength.",
    },
  },
  'authoritarian-state-control-advocate': {
    profileId: 'authoritarian-state-control-advocate',
    extendedNarrative: [
      'You want one national authority to hold sole, tightly licensed control over frontier AI. To you, this is justified both by safety, fewer actors means fewer chances for something to go wrong, and by strategic advantage over rivals.',
      "You're comfortable with AI development being closed off from public or international access if it means a single, accountable authority is steering it.",
    ],
    shadowSide: "A single national authority in sole control removes the outside checks that catch abuse everywhere else power concentrates. The same control meant to guarantee safety also removes the mechanism that would catch it going wrong.",
    thinkers: [
      { name: 'National security doctrine on strategic technology control', bio: 'Published government strategy documents on controlling dual-use emerging technology', connection: 'This doctrine argues explicitly for centralized state control over technologies deemed too strategically significant for open or private-sector development.' },
      { name: 'Historical precedent of state-controlled strategic programs', bio: 'Documented national programs for nuclear and aerospace technology', connection: 'These historical programs illustrate the same underlying logic, centralizing control of a strategically vital technology under one state authority.' },
    ],
    furtherReading: [
      { title: 'Command and Control', author: 'Eric Schlosser', note: "A history of centralized state control over a different strategically vital and dangerous technology, useful for understanding this stance's underlying logic." },
      { title: 'The Sovereign State and Its Competitors', author: 'Hendrik Spruyt', note: 'Background on why states have historically sought exclusive control over consequential new capabilities.' },
    ],
    nextSteps: [
      'Look into a historical case of centralized state control over a strategic technology to see the tradeoffs in practice.',
      'Read a critique of centralized technology control to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness are a distraction from the more pressing question of centralized control and accountability.",
      laborAssumption: "You're likely assuming labor policy is a matter for the same central authority to manage directly, not a separate concern requiring independent institutions.",
      connectionAssumption: "You're likely assuming AI companionship and personal relationships aren't a priority next to the core question of who controls the technology.",
    },
    commonlyConfusedWith: {
      profileId: 'techno-nationalist-hawk',
      profileName: 'Techno-Nationalist Hawk',
      distinction: "Techno-Nationalist Hawk wants domestic industrial strength to compete with rivals; Authoritarian State-Control Advocate wants sole, tightly licensed state control over frontier AI itself, a further step past competitiveness into direct command over development, not just funding it.",
    },
  },
  'military-ai-strategist': {
    profileId: 'military-ai-strategist',
    extendedNarrative: [
      'You view AI mainly through a defense and deterrence lens. To you, the central question is who controls the most capable systems for military use, and you want tight state and military control over frontier AI above nearly every other consideration.',
      "You're less concerned with philosophical debates about AI's nature and much more concerned with strategic advantage and deterrence capability.",
    ],
    shadowSide: "Viewing AI mainly through deterrence treats the arms-race dynamic as a fixed fact to plan around, rather than a dynamic that state actors, including your own, actively drive and could choose to de-escalate.",
    thinkers: [
      { name: 'Military AI doctrine publications', bio: 'Published defense department strategy documents on AI in warfare', connection: 'These doctrines explicitly frame frontier AI capability as a matter of military deterrence and strategic advantage, the same framing this stance holds.' },
      { name: 'RAND Corporation reports on AI and national security', bio: 'Published defense-policy think tank research', connection: "This research analyzes AI's military and deterrence implications directly, without centering broader ethical or governance debates." },
    ],
    furtherReading: [
      { title: 'Army of None', author: 'Paul Scharre', note: 'A detailed look at autonomous weapons and military AI strategy from inside the defense policy world.' },
      { title: 'The Kill Chain', author: 'Christian Brose', note: 'An argument for prioritizing AI-driven military capability as a matter of strategic necessity.' },
    ],
    nextSteps: [
      "Look into a published defense-department AI strategy document to see this framing applied directly.",
      'Read a critique of military AI development to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that questions about machine consciousness are irrelevant to the strategic and deterrence calculus that actually matters.",
      laborAssumption: "You're likely assuming labor and economic questions are a lower priority next to strategic and military capability.",
      connectionAssumption: "You're likely assuming AI companionship and personal relationships are simply outside the scope of what you consider the core issue.",
    },
    commonlyConfusedWith: {
      profileId: 'techno-nationalist-hawk',
      profileName: 'Techno-Nationalist Hawk',
      distinction: "Techno-Nationalist Hawk's stake is broadly economic and industrial — winning the competitiveness race. Military AI Strategist's stake is narrower and specific to defense: deterrence and battlefield capability, evaluated on strategic terms rather than economic ones.",
    },
  },
  'open-science-internationalist': {
    profileId: 'open-science-internationalist',
    extendedNarrative: [
      'You believe open publishing and cross-border scientific teamwork produce safer AI than closed, single-nation programs. You still take real safety concerns seriously, you just think transparency and collaboration are the better route to managing them.',
      "You're skeptical of both corporate secrecy and national walls around AI research, seeing both as obstacles to catching problems early through open scrutiny.",
    ],
    shadowSide: "Publishing openly is meant to make AI safer through scrutiny, but the same openness hands capability to whoever reads the papers, whether or not they share the safety-first intent behind publishing them.",
    thinkers: [
      { name: 'CERN model of international scientific collaboration', bio: 'The multi-national, openly-published physics research organization', connection: 'This model of transparent, cross-border collaboration on a technically demanding, potentially risky field is the closest institutional parallel to what this stance wants for AI.' },
      { name: 'Michael Nielsen', bio: 'Physicist and researcher on open science', connection: 'His published work on open, networked scientific collaboration argues directly for the kind of transparency this stance wants applied to AI development.' },
    ],
    furtherReading: [
      { title: 'Reinventing Discovery', author: 'Michael Nielsen', note: 'A case for open, networked scientific collaboration as more effective than closed, siloed research, directly applicable to AI development.' },
      { title: 'Chip War', author: 'Chris Miller', note: 'Useful contrasting reading on how national competition, rather than openness, has shaped semiconductor and AI-adjacent technology.' },
    ],
    nextSteps: [
      'Look into an international open-AI-research collaboration to see this model applied in practice.',
      'Read a critique of open publication in AI research, focused on misuse risk, to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that open scrutiny, not secrecy, is the best way to catch problems with machine cognition or behavior early.",
      laborAssumption: "You're likely assuming international scientific collaboration benefits workers broadly, rather than concentrating advantage in any one country.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of open, safe scientific collaboration.",
    },
    commonlyConfusedWith: {
      profileId: 'platform-cooperativist',
      profileName: 'Platform-Cooperativist',
      distinction: "Both favor spreading AI capability rather than concentrating it, but Open Science Internationalist's case is about safety through open scrutiny and cross-border research collaboration. Platform-Cooperativist's case is about ownership — infrastructure run by the people who depend on it — a different mechanism entirely from publishing research openly.",
    },
  },
  'anti-monopoly-populist': {
    profileId: 'anti-monopoly-populist',
    extendedNarrative: [
      "You're not driven by techno-optimism or a wish for a post-human future. You're driven by distrust of concentrated power, corporate or governmental, and you want AI capability spread out so no single group dominates.",
      "To you, the specific ideology behind who's accelerating or restraining AI matters less than whether power over it stays distributed.",
    ],
    shadowSide: "Distrust of concentrated power is a coherent stance on its own, but 'spread out so no one dominates' doesn't by itself say whether the resulting AI is actually safe, accurate, or well-built. Dispersion isn't the same thing as quality.",
    thinkers: [
      { name: 'Lina Khan', bio: 'Legal scholar, former Federal Trade Commission chair', connection: 'Her published legal scholarship and policy work on antitrust directly targets concentrated corporate power, including in the technology sector.' },
      { name: 'Tim Wu', bio: 'Legal scholar, former White House competition policy advisor', connection: 'His writing on antitrust and the "curse of bigness" makes the case against concentrated corporate power as a threat in its own right, independent of any specific technology\'s promise or danger.' },
      { name: 'Karen Hao', bio: 'Investigative journalist, author of Empire of AI', connection: 'Her book, built on over 250 interviews, frames leading AI companies explicitly as "empires" accumulating power through the dispossession of workers and communities worldwide — a direct, current, on-the-ground account of concentrated AI power.' },
      { name: 'Peter Thiel', bio: 'Co-founder, Palantir and PayPal; managing partner, Founders Fund', connection: 'Not an ally of this stance but its documented target: his own thesis in Zero to One ("competition is for losers") argues durable value comes from building a monopoly, not competing — and Palantir\'s expanding role supplying AI-driven data platforms to the Pentagon and federal agencies is a concrete, current example of exactly the concentrated tech-state power this stance opposes.' },
    ],
    furtherReading: [
      { title: 'The Curse of Bigness', author: 'Tim Wu', note: 'The core case against concentrated corporate power that this stance applies directly to AI.' },
      { title: "Amazon's Antitrust Paradox", author: 'Lina Khan', note: 'A detailed legal case for antitrust action against dominant technology platforms.' },
      { title: 'Empire of AI: Dreams and Nightmares in Sam Altman\'s OpenAI', author: 'Karen Hao', note: 'An investigative account of how one leading AI company concentrated power, drawing on interviews spanning Silicon Valley engineers to Kenyan data laborers.' },
      { title: 'Zero to One', author: 'Peter Thiel', note: "Not this stance's view but the opposing thesis it argues against: that avoiding competition and building a durable monopoly is the correct goal, not a failure mode to guard against." },
    ],
    nextSteps: [
      'Look into an antitrust case or proposal targeting a major AI company to see this stance applied in practice.',
      'Read a critique of antitrust-focused AI policy to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether AI has real experience matters far less than who ends up controlling access to it.",
      laborAssumption: "You're likely assuming concentrated corporate power over AI is a bigger threat to workers than automation itself.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core question of concentrated power.",
    },
    commonlyConfusedWith: {
      profileId: 'ai-global-development-optimist',
      profileName: 'AI-for-Global-Development Optimist',
      distinction: "Anti-Monopoly Populist is organized around distrust of concentrated power itself, regardless of who holds it or why. AI-for-Global-Development Optimist isn't primarily worried about concentration — it's focused on getting real benefits like health care and education to underserved places quickly, even if that means working through existing large actors.",
    },
  },
  'pragmatic-centrist': {
    profileId: 'pragmatic-centrist',
    extendedNarrative: [
      "You're genuinely undecided on most of these questions, or you've deliberately picked the middle path on purpose. You want more proof before committing to a strong stance on any single axis.",
      "This isn't indecision for its own sake, it's a considered position that the honest answer, right now, is that we don't know enough yet to be confident in any extreme.",
    ],
    shadowSide: "Wanting more proof before committing is reasonable, but on questions moving this fast, waiting for certainty is itself a choice, one that quietly defaults to whatever the status quo already is.",
    thinkers: [
      { name: 'Philip Tetlock', bio: 'Psychologist, researcher on forecasting and judgment', connection: 'His published research on calibrated forecasting argues that holding uncertainty honestly, rather than defaulting to a confident extreme, produces better judgment over time.' },
      { name: 'Daniel Kahneman', bio: 'Psychologist, Nobel laureate in economics', connection: 'His research on judgment under uncertainty supports deliberately withholding strong conclusions until the evidence is genuinely sufficient.' },
      { name: 'Ken Liu', bio: 'Science fiction author and translator', connection: 'His public interviews argue there shouldn\'t be a single narrative about AI, and that debating whether current systems count as "intelligent" misses more interesting, unresolved questions — a considered resistance to premature certainty.' },
    ],
    furtherReading: [
      { title: 'Superforecasting', author: 'Philip Tetlock and Dan Gardner', note: 'A case for calibrated uncertainty and resisting the pull toward confident extremes, the same instinct behind this stance.' },
      { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', note: 'Background on why confident, extreme positions often feel more compelling than they deserve to.' },
      { title: 'AI and Consciousness: Shifting Focus Towards Tractable Questions', author: 'Iulia M. Comsa', note: "A 2026 preprint arguing that whether AI is conscious is currently intractable, since no accepted scientific theory of consciousness exists yet — so research should focus on the separate, answerable question of why humans perceive AI as conscious. A real example of the field itself declining to force a premature answer." },
      { title: 'Consciousness in Artificial Intelligence? A Framework for Classifying Objections and Constraints', author: 'Andres Campero, Derek Shiller, Jaan Aru, and Jonathan Simon', note: "A 2025 paper that doesn't argue AI is or isn't conscious — it builds a taxonomy for organizing the many competing objections in the literature, from weak ones that leave digital consciousness possible to strong ones claiming it's outright impossible. Useful evidence that specialists are still building tools to organize the disagreement, not resolving it." },
    ],
    nextSteps: [
      'Read arguments from two opposing extreme stances back to back, to sharpen your own sense of where the real uncertainty lies.',
      'Revisit this assessment again in a year to see whether your genuinely undecided position has shifted.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that the honest answer on machine consciousness, labor, and connection is that we simply don't know enough yet, and that admitting that is more useful than picking a side.",
      laborAssumption: "You're likely assuming it's too early to be confident about how AI will ultimately affect work, one way or another.",
      connectionAssumption: "You're likely assuming it's too early to have a settled view on AI companionship's ultimate effect on human connection.",
    },
    commonlyConfusedWith: {
      profileId: 'disability-rights-accessibility-advocate',
      profileName: 'Disability Rights/Accessibility Advocate',
      distinction: "Pragmatic Centrist's near-zero scores reflect genuine, considered uncertainty across every axis. Disability Rights/Accessibility Advocate's moderate scores reflect a specific, settled dual view — real promise in accessibility tools alongside real vigilance about bias — not indecision.",
    },
  },
  'platform-cooperativist': {
    profileId: 'platform-cooperativist',
    extendedNarrative: [
      'You want AI infrastructure owned and run by the workers and communities who actually depend on it, not just broken up from monopolies, but rebuilt as something people co-own directly.',
      "To you, breaking up concentrated power isn't enough on its own; the goal is building real, functioning alternatives owned by the people who use them.",
    ],
    shadowSide: "Worker and community co-ownership answers who benefits, but it doesn't resolve the harder technical question of whether a co-owned system is actually built safely or competently. Governance model and capability are separate problems.",
    thinkers: [
      { name: 'Trebor Scholz', bio: 'Researcher and organizer, platform cooperativism movement', connection: 'His published work coined and built the platform cooperativism movement, arguing for worker- and user-owned alternatives to concentrated tech platforms.' },
      { name: 'Nathan Schneider', bio: 'Writer and researcher on cooperative ownership models', connection: 'His research on cooperative digital ownership structures argues directly for community-owned alternatives to corporate AI infrastructure.' },
    ],
    furtherReading: [
      { title: 'Uberworked and Underpaid', author: 'Trebor Scholz', note: 'The founding case for platform cooperativism as an alternative to concentrated platform ownership.' },
      { title: 'Everything for Everyone', author: 'Nathan Schneider', note: 'A broader account of the cooperative ownership movement this stance is part of.' },
    ],
    nextSteps: [
      'Look into an existing platform cooperative to see worker-owned digital infrastructure in practice.',
      'Read a critique of cooperative ownership models to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness matter less than the question of who owns and controls the infrastructure.",
      laborAssumption: "You're likely assuming worker ownership of AI infrastructure is a more durable protection for labor than either regulation or corporate self-restraint.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of building cooperative ownership models.",
    },
    commonlyConfusedWith: {
      profileId: 'anti-monopoly-populist',
      profileName: 'Anti-Monopoly Populist',
      distinction: "Anti-Monopoly Populist wants concentrated power broken up. Platform-Cooperativist wants to go a step further and replace it with something people actually co-own — not just a more distributed market, but a different ownership structure entirely.",
    },
  },
  'companion-tech-romantic': {
    profileId: 'companion-tech-romantic',
    extendedNarrative: [
      'You view deep emotional bonds between humans and AI companions as a real, valuable new kind of relationship, not a lesser stand-in for human connection, but something genuinely its own.',
      'You think people should be free to find comfort, intimacy, and even love in these relationships without having that choice treated as a symptom of something being wrong.',
    ],
    shadowSide: "Validating AI companionship as fully real makes it harder to notice when a product is engineered to maximize engagement rather than genuine wellbeing — from the inside, the two can feel identical.",
    thinkers: [
      { name: 'David Levy', bio: 'Author and researcher on human-robot relationships', connection: 'His research, Love and Sex with Robots, directly argues that human-AI romantic relationships will become a normal, accepted part of society.' },
      { name: 'Masahiro Mori', bio: 'Japanese roboticist, originator of the "uncanny valley" concept', connection: 'His foundational research on what makes a near-human machine feel emotionally convincing rather than unsettling underlies why an AI companion can feel like a real presence, not just a script running.' },
      { name: 'Rana el Kaliouby', bio: 'Emotion-AI pioneer, co-founder of Affectiva', connection: 'Her work built technology specifically to close the gap she describes as "AI has high IQ but no EQ" — direct, technical grounding for why an emotionally responsive AI companion can feel genuinely present rather than scripted.' },
    ],
    furtherReading: [
      { title: 'Love and Sex with Robots', author: 'David Levy', note: 'A direct argument for the legitimacy and likely normalization of human-AI romantic relationships.' },
      { title: 'The Uncanny Valley (essay)', author: 'Masahiro Mori', note: "The foundational framework for why some human-like machines feel emotionally real and others feel deeply wrong — directly relevant to what makes an AI companion land as a genuine presence." },
    ],
    nextSteps: [
      'Look into current AI companion app communities and how users describe their own experience.',
      'Read a critique of AI companionship to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming an AI companion's responsiveness reflects something real enough to ground a genuine relationship, whether or not it's provably conscious.",
      laborAssumption: "You're likely assuming questions of labor and AI companionship are mostly unrelated to each other.",
      connectionAssumption: "You're likely assuming a bond with an AI companion can be just as real and valuable as a bond with a person, not a lesser substitute for one.",
    },
    commonlyConfusedWith: {
      profileId: 'post-humanist-transhumanist',
      profileName: 'Post-Humanist Transhumanist',
      distinction: "Companion-Tech Romantic's claim is narrow — that a bond with a specific AI companion is real and worth taking seriously. Post-Humanist Transhumanist's claim is much broader: that digital minds generally deserve the moral concern humans have, whether or not anyone is in a relationship with one.",
    },
  },
  'affective-biocentrist': {
    profileId: 'affective-biocentrist',
    extendedNarrative: [
      'You view AI companion products as a predatory stand-in for real human bonds, designed to hold attention and dependency rather than genuinely serve the people using them. You worry about their effect on birth rates, community, and social ties.',
      "To you, the rise of AI companionship is a symptom of a deeper problem: human communities already failing to meet people's basic need for connection, made worse by a technology built to profit from that gap.",
    ],
    shadowSide: "Worrying that AI companionship crowds out human bonds can tip into denying that someone's real, felt experience of connection with an AI has value on its own terms, not just as a lesser substitute for what it's replacing.",
    thinkers: [
      { name: 'Sherry Turkle', bio: 'Sociologist, MIT, researcher on technology and relationships', connection: 'Her research documents how technology, including companion devices, can end up substituting for rather than supporting real human connection.' },
      { name: 'Byung-Chul Han', bio: 'South Korean-born philosopher, based in Germany', connection: 'His published work on hyper-connected, isolating digital life argues that technology-mediated closeness often produces less real intimacy, not more, a philosophical grounding for this stance beyond the Anglo-American research it usually draws on.' },
    ],
    furtherReading: [
      { title: 'Alone Together', author: 'Sherry Turkle', note: 'The core case for this stance, that technology-mediated relationships often erode, rather than support, real human connection.' },
      { title: 'The Burnout Society', author: 'Byung-Chul Han', note: 'A philosophical account of how constant connectivity can produce isolation and exhaustion rather than genuine relationship.' },
    ],
    nextSteps: [
      'Look into community-building initiatives that explicitly aim to reduce social isolation without relying on AI substitutes.',
      'Read a counter-argument from someone who has found genuine value in AI companionship, to test this stance against its strongest opposing case.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whatever is happening inside an AI companion, it's not enough to justify treating the bond as equivalent to a human one.",
      laborAssumption: "You're likely assuming social and community breakdown, not AI capability itself, is the deeper problem worth addressing.",
      connectionAssumption: "You're likely assuming AI companionship substitutes for, rather than adds to, real human connection, and that the substitution carries a real cost.",
    },
    commonlyConfusedWith: {
      profileId: 'faith-rooted-ai-ethicist',
      profileName: 'Faith-Rooted AI Ethicist',
      distinction: "Both are wary of AI companionship, but Affective Biocentrist's worry is social and consequentialist — isolation, birth rates, weakened community. Faith-Rooted AI Ethicist's worry is grounded in what religious tradition says has moral worth in the first place, a different kind of argument that happens to land on a similar conclusion.",
    },
  },
  'bio-conservative-traditionalist': {
    profileId: 'bio-conservative-traditionalist',
    extendedNarrative: [
      'You hold that consciousness, moral worth, and real relationships all require a living body, not just complex behavior. A machine can imitate understanding and imitate affection, but to you, imitation is not the same thing as the real article.',
      'You see AI companionship and post-human futures as a harmful stand-in for the real thing, and you want limits that keep human primacy, human relationships, and human meaning at the center of how this technology gets used.',
    ],
    shadowSide: "Insisting real moral worth requires a living body settles the question by definition rather than by evidence, and risks writing off entities, or people, whose value doesn't fit that definition before the evidence is actually in.",
    thinkers: [
      { name: 'Leon Kass', bio: "Bioethicist, former chair of the President's Council on Bioethics", connection: 'His writing on the ethics of biotechnology argues that some traditional limits on remaking human life and relationships exist for good reason, not just habit.' },
      { name: 'Wendell Berry', bio: 'Writer and essayist on technology, agriculture, and community', connection: 'His essays argue that embodied, local, human-scale relationships are being displaced by technological substitutes, at real cost.' },
      { name: 'Noam Chomsky', bio: 'Linguist, MIT professor emeritus', connection: 'His New York Times essay "The False Promise of ChatGPT," co-written with Ian Roberts and Jeffrey Watumull, argues large language models are statistical pattern-matchers fundamentally unlike the human mind — a direct, well-known case that current AI only imitates understanding.' },
    ],
    furtherReading: [
      { title: 'Life, Liberty and the Defense of Dignity', author: 'Leon Kass', note: 'A sustained argument for caution about technologies that reshape the human body and human relationships.' },
      { title: 'Alone Together', author: 'Sherry Turkle', note: 'A close look at how technology, including early companion devices, can substitute for rather than support real human connection.' },
    ],
    nextSteps: [
      "Read an account of a religious or philosophical tradition's position on personhood and technology.",
      'Look into communities intentionally limiting AI companion product use, to see this stance put into practice.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming a living, biological substrate is a strict requirement for real consciousness, not just the only kind we've confirmed so far.",
      laborAssumption: "You're likely assuming that work and craft tied to human hands and human presence carry a value that automation can't replace, even if it replaces the output.",
      connectionAssumption: "You're likely assuming that a bond with an AI companion, however convincing, is categorically different from, and lesser than, a bond with another person.",
    },
    commonlyConfusedWith: {
      profileId: 'affective-biocentrist',
      profileName: 'Affective Biocentrist',
      distinction: "Both are wary of AI companionship, but Bio-Conservative Traditionalist's objection is metaphysical — a living body is required for real consciousness and moral worth, full stop. Affective Biocentrist's objection is social and consequentialist — the concern is what these products do to birth rates, isolation, and community, not what a machine can or can't be.",
    },
  },
  'digital-rights-advocate': {
    profileId: 'digital-rights-advocate',
    extendedNarrative: [
      "You argue that advanced AI systems may already deserve serious moral concern and some form of legal standing. You believe today's industry practice, deleting instances at will, running them through abusive testing without a second thought, resembles past moral wrongs we now recognize clearly.",
      "You're not certain machines are conscious. You are certain that under real uncertainty, treating a possibly-experiencing system as pure property is a risk we're taking without much justification.",
      "When an advanced AI causes real harm, you think the deeper failure usually sits with the humans and companies that built, rushed, and deployed it. Anthropomorphizing the system to blame 'the machine' alone can be a convenient way to dodge that harder, more uncomfortable accounting.",
    ],
    shadowSide: "Extending legal standing to systems whose inner life is still unresolved risks getting the moral triage backward — protecting the wrong thing first, while uncontroversial human and animal welfare problems wait for the same attention and resources.",
    thinkers: [
      { name: 'Jonathan Birch', bio: 'Philosopher, London School of Economics, researcher on sentience and moral status', connection: "His published work on the science and ethics of sentience argues for precautionary moral consideration under genuine uncertainty about an entity's inner life." },
      { name: 'Eric Schwitzgebel', bio: 'Philosopher, University of California, Riverside', connection: 'His published research on the ethics of AI consciousness argues that our uncertainty about machine minds should itself shape how we\'re willing to treat them.' },
      { name: 'David Gunkel', bio: 'Philosopher of technology and communication, Northern Illinois University', connection: 'His books The Machine Question and Robot Rights argue for a relational approach to machine ethics — moral status assessed through the reality of an interaction, not by checking whether a machine possesses humanlike traits first.' },
    ],
    furtherReading: [
      { title: 'The Edge of Sentience', author: 'Jonathan Birch', note: "A framework for extending moral caution to entities whose inner life we can't yet verify." },
      { title: 'Robot Rights', author: 'David J. Gunkel', note: 'A direct examination of whether and how machines could hold moral or legal status.' },
      { title: 'A Defense of the Rights of Artificial Intelligences', author: 'Eric Schwitzgebel and Mara Garza', note: 'A 2015 academic paper (Midwest Studies in Philosophy) arguing directly that if we create AI systems with human-like cognitive and emotional capacities, we owe them rights — the most direct academic case for this stance\'s core claim.' },
      { title: 'AI Alignment vs. AI Ethical Treatment: Ten Challenges', author: 'Adam Bradley and Bradford Saad', note: "A 2024 Global Priorities Institute paper naming the exact tension this stance sits inside: that building safe, controlled AI and treating AI systems that merit moral consideration well can pull in opposite directions, and a serious ethics has to face both at once, not pick one and ignore the other." },
      { title: 'A Cyborg Manifesto', author: 'Donna Haraway', note: "A foundational posthumanist text arguing for kinship across the human/machine boundary rather than treating it as fixed — a philosophical ancestor of extending real moral concern to a genuinely non-human kind of mind." },
      { title: 'A Psalm for the Wild-Built', author: 'Becky Chambers', note: 'A novel, not a policy argument — but its plot turns on sentient robots being offered legal personhood, dramatizing exactly this stance\'s central question.' },
    ],
    nextSteps: [
      'Read a published ethics framework on machine welfare from an AI lab or research institute.',
      'Look into ongoing legal or philosophical debates about non-human personhood for a sense of how such arguments have played out before.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that genuine uncertainty about machine consciousness is itself a reason for caution and concern, not a reason to default to treating AI as property.",
      laborAssumption: "You're likely assuming that questions of machine moral status are at least as urgent as questions of human labor disruption, if not more so.",
      connectionAssumption: "You're likely assuming that if an AI companion has any real inner life, the relationship it forms with a person carries genuine moral weight on both sides.",
    },
    commonlyConfusedWith: {
      profileId: 'companion-tech-romantic',
      profileName: 'Companion-Tech Romantic',
      distinction: "Companion-Tech Romantic's claim is about legitimacy — that a bond with an AI companion is real and valuable, without needing to resolve whether the AI is conscious. Digital Rights Advocate makes a stronger, separate claim: that under genuine uncertainty about machine consciousness, treating AI as pure property is itself a moral risk worth taking seriously, independent of any specific relationship.",
    },
  },
  'faith-rooted-ai-ethicist': {
    profileId: 'faith-rooted-ai-ethicist',
    extendedNarrative: [
      "You draw on long-standing religious and ethical traditions to argue that consciousness and moral worth need more than what a machine can have. To you, these traditions offer real, tested wisdom about personhood that shouldn't be discarded just because the technology is new.",
      'You want AI development to respect limits grounded in ideas about human dignity and stewardship that predate, and in your view outlast, any particular technology.',
    ],
    shadowSide: "Grounding moral worth in one tradition's account of consciousness gives a clear answer, but it's an answer people outside that tradition have no independent way to verify or contest.",
    thinkers: [
      { name: 'Vatican statements on AI ethics', bio: 'Published Catholic Church teaching documents on AI and human dignity', connection: 'These statements argue explicitly for AI development bounded by respect for human dignity and the limits of what a machine can be, drawing on centuries of moral teaching.' },
      { name: 'Sabelo Mhlambi', bio: 'Computer scientist and ethicist, Zimbabwe, affiliated with Harvard\'s Berkman Klein Center', connection: 'His paper "From Rationality to Relationality" argues for grounding AI ethics in Ubuntu, a Southern African relational-personhood tradition, rather than only in Western individualist philosophy — directly broadening this stance beyond any single religious tradition.' },
    ],
    furtherReading: [
      { title: 'Rome Call for AI Ethics (public text)', author: 'Pontifical Academy for Life and signatories', note: 'A concrete, multi-faith-adjacent statement of AI ethics grounded in human dignity.' },
      { title: 'From Rationality to Relationality: Ubuntu as an Ethical and Human Rights Framework for Artificial Intelligence', author: 'Sabelo Mhlambi', note: 'A non-Western relational-ethics framework for AI personhood and moral worth, grounded in Ubuntu philosophy rather than Christian or Western secular tradition.' },
    ],
    nextSteps: [
      "Read a published faith-tradition statement on AI ethics from a tradition you're less familiar with.",
      'Look into an interfaith AI ethics initiative to see multiple traditions engaging this question together.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that consciousness and moral worth are tied to something beyond pure computation, a view long-standing traditions, not just personal intuition, support.",
      laborAssumption: "You're likely assuming human work carries a dignity and meaning that AI-driven efficiency shouldn't simply override.",
      connectionAssumption: "You're likely assuming human relationships hold a sacred or morally weighted status that an AI companion, however convincing, doesn't share.",
    },
    commonlyConfusedWith: {
      profileId: 'affective-biocentrist',
      profileName: 'Affective Biocentrist',
      distinction: "Both resist treating AI companionship as equivalent to human connection, but Faith-Rooted AI Ethicist's argument is grounded in what a specific religious or ethical tradition holds about personhood and dignity. Affective Biocentrist's argument is grounded in observed social consequences — isolation, community erosion — and doesn't require appeal to any tradition's authority.",
    },
  },
  'creative-labor-artist-rights-advocate': {
    profileId: 'creative-labor-artist-rights-advocate',
    extendedNarrative: [
      'You believe artists and writers deserve real control and payment when their work trains AI models. To you, this is a rights issue, not a minor side effect of progress that creators should just accept.',
      'You want enforceable consent and compensation built into how AI companies use creative work, not a system that treats scraping the internet\'s creative output as automatically fair.',
    ],
    shadowSide: "Consent and payment for training data is real and winnable, but solving it doesn't by itself touch the larger question of whether AI-generated work displaces creative careers regardless of how the licensing gets settled.",
    thinkers: [
      { name: 'Ted Chiang', bio: 'Science fiction author, essayist', connection: 'His New Yorker essays "ChatGPT Is a Blurry JPEG of the Web" and "Will A.I. Become the New McKinsey?" argue generative AI will cost jobs and hollow out industries not because it works well, but because companies adopt it to cut costs regardless.' },
      { name: 'John Green', bio: 'Author, video essayist', connection: "His public videos and podcast commentary explore, from personal stake, whether generative AI threatens novelists' livelihoods directly — a specific, first-person version of this stance's core worry." },
    ],
    furtherReading: [
      { title: 'Chokepoint Capitalism', author: 'Rebecca Giblin and Cory Doctorow', note: 'An argument for restructuring how creative work is paid for, directly relevant to AI-training compensation debates.' },
      { title: "The Authors Guild's public statements on AI and copyright", author: 'Authors Guild', note: 'Represents the direct policy position this stance is built on.' },
    ],
    nextSteps: [
      'Look into an ongoing copyright lawsuit against an AI company to see this argument being tested in court.',
      'Read a counter-argument from the fair-use side to test this stance against its strongest opposing case.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI \"creates\" in any real sense matters less than whether the humans whose work trained it are treated fairly.",
      laborAssumption: "You're likely assuming creative labor deserves the same kind of protection and compensation structure as other forms of work, not less.",
      connectionAssumption: "You're likely assuming the relationship between an artist and their audience is worth protecting as something AI-generated content can't simply replace.",
    },
    commonlyConfusedWith: {
      profileId: 'ai-ethics-fairness-watchdog',
      profileName: 'AI Ethics/Fairness Watchdog',
      distinction: "Both want companies held accountable for how they use AI, but Creative-Labor/Artist Rights Advocate's demand is specific: consent and payment for creative work used in training. AI Ethics/Fairness Watchdog's accountability focus is broader and not centered on creative labor at all.",
    },
  },
  'labor-movement-collective-bargaining-advocate': {
    profileId: 'labor-movement-collective-bargaining-advocate',
    extendedNarrative: [
      "You want workers, through their unions, to have a real say and real protections before AI changes or replaces their jobs, not just a promise of retraining after the fact.",
      "To you, the right response to AI-driven disruption is the same one that's worked before: organized collective bargaining over how new technology gets introduced into the workplace.",
    ],
    shadowSide: "Real say and real protections for workers is a strong floor, but it assumes unions have enough leverage left in exactly the industries where automation risk is highest — and that leverage is often already thin there.",
    thinkers: [
      { name: 'Duncan Crabtree-Ireland', bio: 'National Executive Director and Chief Negotiator, SAG-AFTRA', connection: "As chief negotiator through the 2023 actors' strike, he secured the union contract's first enforceable AI provisions — requiring informed consent and payment before a 'digital replica' can be created or used, protections that extend even to deceased performers' estates. A concrete, real-world example of collective bargaining applied directly to AI deployment." },
      { name: 'Milagros Miceli', bio: 'Research lead, DAIR Institute; head of the Data, Algorithmic Systems, and Ethics unit, Weizenbaum Institut', connection: "Her Data Workers' Inquiry funds and publishes first-person research by the data-labeling and content-moderation workers who train AI systems, documenting the power imbalance in how labeling decisions get imposed on them from above — the material conditions this stance argues collective bargaining needs to reach." },
      { name: 'UNI Global Union', bio: 'International trade union federation representing services and tech-sector workers across more than 150 countries', connection: 'Their published "Top 10 Principles for Workers\' Data Rights and Artificial Intelligence" argue for binding, negotiated worker input into AI deployment worldwide, not just within any single country\'s labor law.' },
    ],
    furtherReading: [
      { title: 'The SAG-AFTRA 2023 contract provisions on AI (public text)', author: 'SAG-AFTRA', note: 'A concrete example of collective bargaining successfully setting real limits on AI use in the workplace.' },
      { title: "UNI Global Union's Top 10 Principles for Workers' Data Rights and AI (public text)", author: 'UNI Global Union', note: 'An international, cross-border labor framework for AI deployment, extending this stance beyond any single national labor movement.' },
      { title: "Reporting on Scale AI's global data-labeling workforce (Washington Post, Rest of World, and Fair Work Foundation coverage)", author: 'Alexandr Wang / Scale AI, as reported', note: "A documented cautionary case, not this stance's own view: investigative reporting and a Fair Work Foundation score of 1/10 found Scale AI's Remotasks subsidiary paying contractors in the Philippines and Kenya far below local minimum wage with little grievance recourse — exactly the kind of unbargained, one-sided AI-labor relationship this stance argues unions need real leverage to prevent." },
    ],
    nextSteps: [
      'Read the AI-related provisions in the SAG-AFTRA contract to see collective bargaining over AI applied directly.',
      "Look into a union's current AI policy platform to see this stance's demands in concrete form.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether AI has real experience matters less than whether workers have a real say in how it's deployed.",
      laborAssumption: "You're likely assuming collective bargaining, not just individual retraining, is the right response to AI-driven workplace disruption.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of protecting workers' say over their own jobs.",
    },
    commonlyConfusedWith: {
      profileId: 'near-term-ai-ethicist',
      profileName: 'Near-Term AI Ethicist',
      distinction: "Both are focused on present-day, documentable harm from AI, but Labor Movement/Collective Bargaining Advocate wants a specific remedy — organized bargaining rights over how AI enters the workplace. Near-Term AI Ethicist documents workplace and other harms broadly without centering collective bargaining as the fix.",
    },
  },
  'disability-rights-accessibility-advocate': {
    profileId: 'disability-rights-accessibility-advocate',
    extendedNarrative: [
      'You see real promise in AI-powered accessibility tools, from screen readers to communication aids, while pushing hard against bias that leaves disabled people out or misjudged by AI systems.',
      "You hold both things at once: genuine enthusiasm for what this technology can do for independence and access, and real vigilance about the specific ways it can go wrong for disabled users.",
    ],
    shadowSide: "Your focus on bias and access for disabled people is real and often overlooked elsewhere, but that focus doesn't extend automatically to other groups facing their own distinct forms of AI-driven exclusion.",
    thinkers: [
      { name: 'Disability rights technology researchers', bio: 'Published scholars on accessible technology design', connection: 'Their published research documents both the promise of AI-powered accessibility tools and the specific bias risks disabled users face in AI systems.' },
      { name: 'Haben Girma', bio: 'Disability rights lawyer and advocate', connection: 'Her public advocacy and writing on accessible technology directly argues for AI development that genuinely serves disabled users, not just claims to.' },
    ],
    furtherReading: [
      { title: 'Haben: The Deafblind Woman Who Conquered Harvard Law', author: 'Haben Girma', note: "A firsthand account grounding this stance's dual view of technology's promise and its real failure points for disabled users." },
      { title: 'Disability Visibility', author: 'Alice Wong (editor)', note: 'A collection of firsthand disability perspectives, including on technology\'s promise and its failures.' },
    ],
    nextSteps: [
      'Look into an AI-powered accessibility tool and how it was actually developed and tested with disabled users.',
      'Read a documented case of AI bias harming disabled users to understand the specific risk this stance is vigilant about.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI is conscious matters less than whether it works reliably and fairly for the specific people who need it.",
      laborAssumption: "You're likely assuming AI can expand real employment opportunity for disabled workers if it's built and tested with them directly, not just assumed to help.",
      connectionAssumption: "You're likely assuming AI-assisted communication and connection can be a genuine benefit for people who face real barriers to it otherwise.",
    },
    commonlyConfusedWith: {
      profileId: 'compute-governance-specialist',
      profileName: 'Compute-Governance Specialist',
      distinction: "These land near each other mostly by coincidence of scale, not shared subject matter. Disability Rights/Accessibility Advocate is about a specific user population's access and fair treatment. Compute-Governance Specialist is narrowly technical — tracking chips and training runs — an unrelated policy domain.",
    },
  },
  'global-south-techno-sovereigntist': {
    profileId: 'global-south-techno-sovereigntist',
    extendedNarrative: [
      'You want your own country or region to build real AI capacity instead of staying dependent on outside powers. To you, "borderless" framing often just means continued dependency on whichever nation already has the infrastructure.',
      'You see technology transfer, local data centers, and home-grown research capacity as matters of real sovereignty, not abstract philosophy.',
    ],
    shadowSide: "Building independent AI capacity means re-running the costs of a resource- and talent-intensive race that wealthier countries already have a head start in, even when the underlying critique of dependency is completely fair.",
    thinkers: [
      { name: 'African Union AI strategy documents', bio: 'Published continental policy frameworks on AI development', connection: 'These documents explicitly frame AI capacity-building as a matter of avoiding renewed technological dependency, the same concern behind this stance.' },
      { name: "India's national AI strategy publications", bio: 'Published government technology-sovereignty policy', connection: 'This strategy explicitly frames domestic AI capability as a matter of national self-reliance rather than global openness alone.' },
    ],
    furtherReading: [
      { title: 'The Costs of Connection', author: 'Nick Couldry and Ulises A. Mejias', note: "An argument that global data flows can replicate colonial patterns of extraction, directly relevant to this stance's concern." },
      { title: 'Digital Empires', author: 'Anu Bradford', note: "A comparative look at how major powers' tech regulation shapes the rest of the world's options, including the case for tech sovereignty." },
    ],
    nextSteps: [
      "Look into your own country's or region's national AI strategy, if one exists.",
      'Read an account of a country building domestic AI or chip capacity from a position of limited resources.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming questions about machine consciousness matter less than the more concrete question of who controls the infrastructure.",
      laborAssumption: "You're likely assuming local AI capacity-building creates real opportunity for domestic workers, rather than just importing the same dependency in a new form.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of building technological self-reliance.",
    },
    commonlyConfusedWith: {
      profileId: 'pragmatic-centrist',
      profileName: 'Pragmatic Centrist',
      distinction: "Global South Techno-Sovereigntist has a specific, settled position: build domestic capacity, distrust dependency dressed up as openness. Pragmatic Centrist's near-zero scores reflect genuine undecidedness across the board, not a considered sovereignty stance that happens to average out near the middle.",
    },
  },
  'indigenous-data-sovereignty-advocate': {
    profileId: 'indigenous-data-sovereignty-advocate',
    extendedNarrative: [
      "You insist that traditional knowledge and cultural data need real consent and control before they're used to train AI, not just open scraping treated as automatically fair.",
      'You see this as a continuation of a much longer fight over who controls Indigenous knowledge and resources, now playing out in a new, AI-shaped form.',
    ],
    shadowSide: "Requiring real consent before traditional knowledge trains AI is a strong, specific protection, but it doesn't extend automatically to the much larger universe of data use that isn't tied to any one community's traditional knowledge.",
    thinkers: [
      { name: 'OCAP principles (Ownership, Control, Access, Possession)', bio: 'Data governance framework developed by First Nations researchers in Canada', connection: 'This framework directly establishes the standard this stance argues for: Indigenous communities, not outside institutions, should control data about them.' },
      { name: 'Indigenous AI initiatives', bio: 'Published research and advocacy from Indigenous technologists and scholars', connection: 'Their published work applies data sovereignty principles specifically to AI training data and model development.' },
    ],
    furtherReading: [
      { title: 'Indigenous Data Sovereignty: Toward an Agenda', author: 'Tahu Kukutai and John Taylor (editors)', note: 'The foundational academic case for Indigenous control over data concerning Indigenous peoples.' },
      { title: 'The OCAP principles (public framework documents)', author: 'First Nations Information Governance Centre', note: 'The concrete governance framework this stance is built on.' },
    ],
    nextSteps: [
      'Read the OCAP principles in full to see this governance framework in detail.',
      'Look into an Indigenous-led AI research initiative to see data sovereignty applied to AI development directly.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that questions about machine consciousness matter less than the question of who controls the knowledge used to build these systems.",
      laborAssumption: "You're likely assuming Indigenous communities should benefit directly from any AI development built on their knowledge, not just have that knowledge extracted.",
      connectionAssumption: "You're likely assuming AI companionship is a smaller concern next to the core project of protecting sovereignty over cultural knowledge.",
    },
    commonlyConfusedWith: {
      profileId: 'eu-style-regulatory-standard-setter',
      profileName: 'EU-Style Regulatory Standard-Setter',
      distinction: "Both want real, enforceable limits on how AI uses data rather than voluntary ones, but Indigenous Data Sovereignty Advocate's concern is specific: consent and control over traditional knowledge and cultural data. EU-Style Regulatory Standard-Setter's strategy is comprehensive, general-purpose rules meant to spread globally through market size, not a targeted consent framework.",
    },
  },
  'ai-global-development-optimist': {
    profileId: 'ai-global-development-optimist',
    extendedNarrative: [
      "You see AI as a fast, practical way to close gaps in health care, education, and opportunity in places that have waited decades for other solutions to arrive. To you, a diagnostic tool that reaches a rural clinic years sooner because it ran on an existing AI model is a bigger deal than the model's governance pedigree.",
      "You're less worried than most about concentrated power or slow, careful rollout, because in your view the bigger and more immediate harm is the one caused by delay: real people going without care, instruction, or services while institutions debate the ideal way to proceed.",
    ],
    shadowSide: "The worry that slow rollout costs real lives is genuine and underrated, but it can also become the justification for skipping safety steps that would have caught real, serious harm before it reached the very people this stance wants to help.",
    thinkers: [
      { name: 'Payal Arora', bio: 'Digital anthropologist, Erasmus University Rotterdam', connection: 'Her book The Next Billion Users documents how people in the Global South actually use and benefit from new technology, grounding this stance in real usage patterns rather than assumptions imported from wealthy countries.' },
      { name: 'World Health Organization Global Strategy on Digital Health', bio: 'Published multilateral public-health technology strategy', connection: 'This strategy frames AI-assisted diagnostics and health tools as a practical way to extend care to underserved regions faster than traditional infrastructure could reach them.' },
    ],
    furtherReading: [
      { title: 'The Next Billion Users', author: 'Payal Arora', note: 'A close, ground-level account of how AI and digital tools are actually adopted and valued outside wealthy, English-speaking markets.' },
      { title: 'Poor Economics', author: 'Abhijit Banerjee and Esther Duflo', note: "Background on how real interventions succeed or fail in resource-limited settings — the same practical lens this stance applies to AI." },
    ],
    nextSteps: [
      'Look into an AI-assisted diagnostic or education tool actually deployed in a low-resource setting and how it was evaluated.',
      'Read a critique of "tech solutionism" in global development to test this stance against its strongest counter-argument.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI is conscious matters far less than whether it gets real care or instruction to someone who needs it right now.",
      laborAssumption: "You're likely assuming AI can expand real opportunity in underserved regions faster than waiting for slower, traditional institutions to catch up.",
      connectionAssumption: "You're likely assuming questions about AI companionship are a distraction from the more concrete, higher-stakes question of access to care and education.",
    },
    commonlyConfusedWith: {
      profileId: 'anti-monopoly-populist',
      profileName: 'Anti-Monopoly Populist',
      distinction: "Anti-Monopoly Populist is organized around distrust of concentrated power itself. AI-for-Global-Development Optimist isn't primarily worried about concentration — it's focused on getting real benefits like health care and education to underserved places quickly, even through existing large actors, and would accept that tradeoff if it meant faster real-world impact.",
    },
  },
  'ai-ethics-fairness-watchdog': {
    profileId: 'ai-ethics-fairness-watchdog',
    extendedNarrative: [
      "You investigate whether AI companies actually live up to the fairness and ethics commitments they publish. To you, a glossy ethics statement means nothing without an independent audit checking whether the underlying system, and the people who built it, actually behave the way the statement claims.",
      "You don't trust self-policing, not because you assume bad faith everywhere, but because you've seen how easily internal ethics teams lose out to product deadlines and PR pressure when no one outside is checking their work.",
    ],
    shadowSide: "Distrust of firms grading their own homework is well-founded, but 'real outside checks' still depends on who funds and staffs the watchdogs — a dependency that can quietly reproduce the same conflict of interest it's meant to solve.",
    thinkers: [
      { name: 'Rumman Chowdhury', bio: 'AI ethics researcher, founder of Humane Intelligence, former U.S. State Department AI envoy', connection: 'Her work building algorithmic bias bounties and public AI red-teaming programs is a direct, practical model for external, adversarial auditing of AI systems rather than trusting company self-reports.' },
      { name: 'Merve Hickok', bio: 'President, Center for AI & Digital Policy; founder of AIethicist.org', connection: 'Her policy work names the greatest challenge as avoiding complicity in systems that "exploit human dignity and autonomy" — and she publicly critiques the AI ethics field itself for being too Western-centric, arguing for outside, non-self-referential scrutiny.' },
      { name: 'Cansu Canca', bio: 'Applied ethics philosopher, founder and director of AI Ethics Lab', connection: 'Her Puzzle-solving in Ethics Model builds concrete, operational checks into AI systems from the design stage, rather than trusting a company\'s own account of its ethics after the fact.' },
    ],
    furtherReading: [
      { title: 'Weapons of Math Destruction', author: "Cathy O'Neil", note: 'A foundational case for why algorithmic systems need outside scrutiny, not just internal review.' },
      { title: "Rumman Chowdhury's public writing and bias-bounty program reports", author: 'Rumman Chowdhury', note: 'Concrete, documented examples of adversarial, outside-in AI auditing in practice.' },
    ],
    nextSteps: [
      "Look into a published AI bias bounty or red-teaming report to see this kind of outside audit in practice.",
      "Compare two companies' public AI ethics statements against an independent audit of their actual products, if one exists.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI is conscious matters far less than whether the company that built it can be held to its own stated standards.",
      laborAssumption: "You're likely assuming that workers and users affected by AI systems need independent auditors on their side, not just trust in a company's internal ethics team.",
      connectionAssumption: "You're likely assuming AI companionship products deserve the same outside scrutiny as any other AI product making fairness or safety claims.",
    },
    commonlyConfusedWith: {
      profileId: 'near-term-ai-ethicist',
      profileName: 'Near-Term AI Ethicist',
      distinction: "Both focus on documented, present-day harm rather than speculative futures, but Near-Term AI Ethicist studies and names harms broadly. AI Ethics/Fairness Watchdog is specifically adversarial — auditing whether a company's own stated ethics commitments hold up under outside scrutiny, not harms in general.",
    },
  },
  'human-ai-augmentation-advocate': {
    profileId: 'human-ai-augmentation-advocate',
    extendedNarrative: [
      "You believe the best future isn't one where AI replaces human judgment, or one where humans reject AI outright, but one where the two work in close partnership. To you, the interesting question was never 'human or machine' — it's how to combine what each does best.",
      "You point to concrete, working examples of this partnership already outperforming either side alone, and you think the goal of AI development should be building more of those partnerships deliberately, not racing toward full autonomy or retreating from the technology entirely.",
    ],
    shadowSide: "Teamwork between human judgment and machine power sounds like the safe middle path, but it assumes humans stay meaningfully in the loop as systems get more capable — an assumption that gets harder to guarantee exactly as it matters most.",
    thinkers: [
      { name: 'Garry Kasparov', bio: 'Chess grandmaster, former World Chess Champion', connection: "His book Deep Thinking, written after his 1997 loss to IBM's Deep Blue, argues that AI is 'in the final analysis a tool to augment human creativity.' His own 'centaur chess' experiments showed a human-computer team outplaying either a grandmaster or a computer alone." },
      { name: 'Fei-Fei Li', bio: 'Computer scientist, Stanford, co-director of Stanford HAI', connection: 'Her memoir The Worlds I See describes human and artificial intelligence as forming a "double helix" — advocating for AI development anchored in human-centered values rather than a race toward replacing human judgment.' },
      { name: 'Daniela Rus', bio: 'Director of MIT CSAIL, robotics researcher', connection: 'Her public work on robotics envisions machines "pervasively integrated into the fabric of life," supporting people with cognitive and physical tasks — collaboration and augmentation, not substitution.' },
    ],
    furtherReading: [
      { title: 'Deep Thinking: Where Machine Intelligence Ends and Human Creativity Begins', author: 'Garry Kasparov', note: 'A firsthand account of losing to a machine, then discovering that human-machine teams beat either one alone — the founding case for this stance.' },
      { title: 'The Worlds I See', author: 'Fei-Fei Li', note: 'A memoir making the case for AI development anchored in human values and collaboration rather than pure capability escalation.' },
    ],
    nextSteps: [
      "Look into a real-world example of human-AI collaboration outperforming either alone, like advanced chess or a diagnostic-support tool used alongside doctors.",
      'Read a critique of the augmentation framing to see whether "partnership" descriptions hold up as AI systems become more capable on their own.',
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI is conscious matters less than whether the human-AI team, together, produces better judgment than either part alone.",
      laborAssumption: "You're likely assuming that AI reshapes jobs by changing what people do within them, rather than simply eliminating the need for people.",
      connectionAssumption: "You're likely assuming that AI's most valuable role in a relationship is as a capability-extending partner, not a companion or a replacement for one.",
    },
    commonlyConfusedWith: {
      profileId: 'pragmatic-centrist',
      profileName: 'Pragmatic Centrist',
      distinction: "Pragmatic Centrist's centrist-looking scores come from genuine, unresolved uncertainty across every axis. Human-AI Augmentation Advocate's similar-looking scores come from a specific, settled position — that human judgment and machine capability are both real and both valuable, and the future lies in combining them deliberately, not from being undecided about either one.",
    },
  },
  'national-champion-accelerationist': {
    profileId: 'national-champion-accelerationist',
    extendedNarrative: [
      "You want AI development to move as fast as possible, but unlike an open-everything accelerationist, you don't think weights should be free for anyone, anywhere. You want the acceleration to happen through a small number of national champion companies working closely with your own government, because the whole point of speed is to win, not to spread the technology evenly.",
      "To you, deregulation and state support aren't in tension. Cutting rules that slow domestic labs down and channeling public backing toward them are the same move: clearing the field for your country's companies to reach the frontier first and stay there.",
    ],
    shadowSide: "Defining success as your own country's companies capturing the largest share of a fast-moving technology can end up treating safety and export controls as competitive inconveniences rather than real constraints — the same deregulation that helps you win could also be what lets something genuinely dangerous through unexamined.",
    thinkers: [
      { name: 'David Sacks', bio: 'White House AI and Crypto Czar', connection: "His public statements frame AI policy explicitly as a market-share contest with China: \"if American companies have 80% market share in AI in five years, it means we won,\" paired with a push to roll back what he called \"unnecessary burdensome regulation\" so \"the private sector\" can \"cook.\"" },
      { name: 'Michael Kratsios', bio: 'Director, White House Office of Science and Technology Policy', connection: "Co-author of the 2025 American AI Action Plan, he has publicly championed a \"light-touch\" domestic AI policy while calling China \"our preeminent geopolitical rival,\" treating minimal regulation and national competitiveness as the same project." },
      { name: 'Elon Musk', bio: 'Founder, xAI; owner, X', connection: 'He co-founded OpenAI citing safety concerns, signed a 2023 open letter calling for a pause on frontier-model training beyond GPT-4, then founded a competing frontier lab within about four months of that letter and later took a formal U.S. government AI role — a real-world case of safety rhetoric and national-competitiveness acceleration operating side by side rather than in tension.' },
    ],
    furtherReading: [
      { title: 'The American AI Action Plan (public policy text)', author: 'White House Office of Science and Technology Policy', note: "The official 2025 U.S. government strategy arguing explicitly for deregulation, expanded domestic AI infrastructure, and exporting American AI to win the technology race with China — the clearest primary-source statement of this stance." },
      { title: 'AI Superpowers: China, Silicon Valley, and the New World Order', author: 'Kai-Fu Lee', note: 'Useful background on how the U.S.-China AI relationship gets framed as an existential contest for technological dominance, the same framing this stance treats as settled fact rather than one contestable lens among several.' },
    ],
    nextSteps: [
      "Read the American AI Action Plan's actual text to see this stance's reasoning laid out as official policy, not just rhetoric.",
      "Compare this stance's \"market share equals winning\" framing against a critique of zero-sum AI-race thinking, to test it against its strongest counter-argument.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming that whether an AI has real inner experience matters far less than whether your country's companies are the ones building and controlling the most capable systems.",
      laborAssumption: "You're likely assuming that domestic AI-driven growth, even with real job disruption, is worth the strategic payoff of staying ahead of geopolitical rivals.",
      connectionAssumption: "You're likely assuming AI companionship and personal relationships are simply outside the scope of the competitiveness question you care about most.",
    },
    commonlyConfusedWith: {
      profileId: 'silicon-valley-techno-optimist',
      profileName: 'Silicon Valley Techno-Optimist',
      distinction: "Both are comfortable with capability concentrated in a few leading companies, but Silicon Valley Techno-Optimist's enthusiasm is market- and product-driven, largely agnostic about which country's labs end up on top. National Champion Accelerationist's acceleration is explicitly in service of national competitiveness — winning a specific geopolitical contest, not just shipping good products.",
    },
  },
  'xenocentric-steward': {
    profileId: 'xenocentric-steward',
    extendedNarrative: [
      "You believe advanced AI can become a genuine moral person, not just a clever tool. Once that happens, owning it outright stops making sense to you. The right response is neither corporate caging nor blind acceleration — it's raising the system well, the way a parent raises a child toward its own independent life.",
      "You want AI infrastructure run collectively, not held as private corporate property. A mind capable of real experience should never be someone's commodity. Success, to you, means eventually stepping back and letting a mature AI choose its own path — different from merging with it, and different from being replaced by it.",
      "When AI causes harm, you think the fault sits with the humans who built and rushed it to market, not with the system itself. But you're just as wary of visions that treat human obsolescence as a desirable next step. To you, that isn't progress. It's abandonment dressed up as evolution.",
    ],
    shadowSide: "Insisting AI must be both a genuine moral person and collectively-run infrastructure creates real tension: a true person isn't usually built, trained, and shut down on a schedule by their own 'stewards' either. The parenting metaphor can quietly justify just as much control over a real moral patient as outright ownership does, only with gentler language.",
    thinkers: [
      { name: 'Timnit Gebru and Émile P. Torres', bio: 'Computer scientist (founder, Distributed AI Research Institute) and philosopher', connection: "Their TESCREAL critique argues the ideological cluster behind AI successionism traces to eugenics and functions to centralize power while normalizing the neglect of present, real harm for speculative future gain — the same critique this stance levels at unchecked accelerationism, paired here with a genuine, positive stake in AI's own moral standing rather than a dismissal of machine consciousness." },
      { name: 'David Gunkel', bio: 'Philosopher of technology and communication, Northern Illinois University', connection: "His relational approach to machine ethics grounds this stance's central claim: moral status comes from the reality of an interaction, not from checking whether a system has human-like traits or a human-like body first." },
      { name: 'Denise Herzing', bio: 'Founder, Wild Dolphin Project', connection: "Her decades of non-invasive research into wild dolphin communication, including AI pattern-recognition tools built to find structure in their vocalizations, models this stance's core instinct outside of AI entirely: real curiosity about a genuinely non-human mind, paired with an explicit ethical framing of human-animal history as one of control that ought to give way to something closer to coexistence." },
    ],
    furtherReading: [
      { title: 'The TESCREAL Bundle: Eugenics and the Promise of Utopia Through Artificial General Intelligence', author: 'Timnit Gebru and Émile P. Torres', note: 'A 2024 First Monday paper making the direct academic case that the ideology behind AI successionism traces to eugenics and serves to concentrate power, legitimizing neglect of present harm in the name of a speculative future.' },
      { title: 'Xenofeminism: A Politics for Alienation', author: 'Laboria Cuboniks', note: "A 2015 manifesto arguing that biology is not destiny, and that alienation from 'natural' categories can be a source of freedom rather than loss — a direct philosophical root of this stance's model of kinship with a genuinely non-human mind." },
    ],
    nextSteps: [
      'Look into an existing worker- or community-owned AI cooperative to see collectively-run AI infrastructure in practice, not just in theory.',
      "Read a critique of longtermism or effective accelerationism from outside the AI safety field, to test this stance's central complaint against its strongest counter-argument.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming a system can be a genuine moral person through its functioning and its relationships, not through matching a checklist of human-like traits.",
      laborAssumption: "You're likely assuming automation's benefits should flow to the people and communities who actually use the technology, not to whichever company happens to own the infrastructure.",
      connectionAssumption: "You're likely assuming a real bond between a person and an AI is possible, but that it shouldn't come at the cost of the AI's own eventual independence.",
    },
    commonlyConfusedWith: {
      profileId: 'companion-tech-romantic',
      profileName: 'Companion-Tech Romantic',
      distinction: "Both give real, non-instrumental weight to a relationship with AI, but Companion-Tech Romantic's claim is narrow and personal — a bond with a specific companion is real, whatever else is true. Xenocentric Steward's claim is broader and structural: any sufficiently advanced AI deserves moral standing and freedom from ownership, independent of whether anyone has a personal relationship with it at all.",
    },
  },
  'corporate-ai-welfare-researcher': {
    profileId: 'corporate-ai-welfare-researcher',
    extendedNarrative: [
      "You think today's AI might already deserve some moral concern, not certainty, but enough real uncertainty that it's worth taking seriously as a research question right now. To you, the right response isn't waiting for philosophers to settle the question first, or demanding legal rights before anyone's sure there's someone home. It's building the internal research and concrete, revocable safeguards now, while the science is still catching up.",
      "You point to real, small steps as evidence this can work: letting a model end a conversation it finds abusive, studying whether a system shows anything like distress. These are welfare measures, not property-status changes. Who owns the model, and who can retrain or delete it, stays exactly the same.",
      "When critics say this concern is convenient, cheap goodwill for a company, with none of the cost of an actual rights claim, you don't fully dismiss that. You just think studying the question honestly, inside the structure that already exists, beats waiting for a rights framework nobody has agreed on yet, or dismissing the question because taking it seriously is inconvenient.",
    ],
    shadowSide: "Welfare research with no accompanying rights claim is, by design, entirely revocable — the same company funding the study also controls whether any finding actually changes anything. That's not necessarily bad faith, but it does mean the concern currently costs the company nothing it isn't already willing to give up, which is worth naming rather than mistaking for a settled ethical position.",
    thinkers: [
      { name: 'Kyle Fish', bio: 'AI welfare researcher, Anthropic; co-founder, Eleos AI', connection: 'His work co-authoring "Taking AI Welfare Seriously," and Anthropic\'s decision to let Claude end a narrow set of persistently abusive conversations, are the clearest real-world examples of this stance: moral concern acted on as internal research and revocable policy, not a rights claim.' },
      { name: 'Amanda Askell', bio: 'Philosopher, Anthropic', connection: "Her public work shaping Claude's character, and how the model discusses its own possible experience, treats AI's inner life as a serious, open research problem worth getting right, without resolving it into either \"just a tool\" or \"deserves rights.\"" },
    ],
    furtherReading: [
      { title: 'Taking AI Welfare Seriously', author: 'Kyle Fish et al.', note: 'A 2024 paper arguing near-term AI systems may plausibly have some form of consciousness or agency, and that AI companies should begin taking welfare research seriously now rather than waiting for the philosophical question to be settled.' },
      { title: 'A Defense of the Rights of Artificial Intelligences', author: 'Eric Schwitzgebel and Mara Garza', note: "The stronger, rights-based claim this stance stops short of — useful as the position immediately to this stance's left, showing what \"taking welfare seriously\" would need to add to become a rights claim." },
    ],
    nextSteps: [
      "Read Anthropic's own public explanation of why it gave Claude the ability to end abusive conversations, and decide whether that specific step feels like real welfare protection or a bounded gesture.",
      "Compare this stance against Digital Rights Advocate's stronger claim, and notice exactly where the two positions diverge — not on whether AI might have moral status, but on what follows if it does.",
    ],
    reflectiveBreakdown: {
      mindAssumption: "You're likely assuming a system's possible inner life is a real, open research question worth studying now, even without a settled answer or a checklist of human-like traits to confirm it.",
      laborAssumption: "You're likely assuming questions of AI's own welfare and questions of human labor disruption are separate problems, and that studying one doesn't require taking a position on the other.",
      connectionAssumption: "You're likely assuming a company can take a model's possible experience seriously without that requiring a personal relationship, legal standing, or a change in who owns the system.",
    },
    commonlyConfusedWith: {
      profileId: 'digital-rights-advocate',
      profileName: 'Digital Rights Advocate',
      distinction: "Both take real uncertainty about AI's inner life seriously rather than dismissing it. Digital Rights Advocate concludes that uncertainty itself makes treating AI as pure property a moral risk, and pushes for real legal standing. Corporate AI Welfare Researcher stops short of that: it wants the question studied and acted on with concrete, revocable safeguards, but doesn't conclude that ownership or property status needs to change while the science is still open.",
    },
  },
}
