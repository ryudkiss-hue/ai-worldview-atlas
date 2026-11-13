import type { ProfileExpansion } from './types'

// Expanded report content for every archetype, written for the person who matched it ("you").
// Landmarks are real events and documents with their sources; thinkers and reading add to those in profileReports.
export const profileExpansions: Record<string, ProfileExpansion> = {
 "doomer": {
  "moreNarrative": "What sets you apart is how you weigh the odds. Even if a catastrophe is unlikely, you think its size makes it the thing to plan around, the way a city plans for the worst flood, not the average one. You also doubt that we will get a second try: a system smarter than us that wants the wrong things may not let us correct it. So you favor rules that bind every major developer at once, because a pause that only the careful obey just hands the lead to the careless.",
  "axisReasons": {
   "ontological": "You lean slightly against machine minds, but it barely matters to you. A system can be dangerous whether or not anyone is home inside it.",
   "legalMoral": "You treat AI systems mainly as tools to be controlled. Granting them protections now could make it harder to shut down a system that goes wrong.",
   "relational": "You see bonds with AI as a lesser good, and a possible lever for manipulation. A system people love is a system people will defend.",
   "teleological": "You want technology to serve living beings on a planet that stays recognizably ours, not to grow intelligence for its own sake.",
   "evolutionary": "This is one of your strongest views. Humans should stay in charge of where the future goes, and any change should be one we choose and can undo.",
   "risk": "This is your defining axis. Avoiding catastrophe is worth slower progress, lost profits and real delay, for as long as it takes.",
   "socioEconomic": "You want strong oversight of the most capable systems: licenses, audits, and the power to stop a training run. Open release of powerful models worries you.",
   "geopolitical": "You lean toward a global approach, because a race between nations is exactly what makes everyone cut corners on safety."
  },
  "objections": [
   {
    "objection": "Critics say the risk estimates are guesses dressed up as numbers, and that a pause would give up cures and growth that are certain for safety that is speculative.",
    "reply": "You can answer that we take out insurance against rare disasters all the time, and that the costs of a delay can be recovered later while extinction cannot."
   },
   {
    "objection": "Others say a worldwide pause can't be enforced, so it would only slow the most responsible developers.",
    "reply": "You can point out that the largest training runs need huge, visible data centers and a few chip suppliers, which makes them easier to monitor than most dangerous technologies."
   }
  ],
  "landmarks": [
   {
    "name": "Pause Giant AI Experiments open letter",
    "year": "2023",
    "what": "Called on labs to pause training of systems more powerful than GPT-4 for at least six months. Thousands of researchers and public figures signed.",
    "source": "Future of Life Institute, open letter, March 2023"
   },
   {
    "name": "Statement on AI Risk",
    "year": "2023",
    "what": "A one-sentence statement that reducing the risk of extinction from AI should be a global priority alongside pandemics and nuclear war, signed by leading AI scientists and lab heads.",
    "source": "Center for AI Safety, May 2023"
   },
   {
    "name": "If Anyone Builds It, Everyone Dies",
    "year": "2025",
    "what": "A book-length case that current methods cannot reliably give a superintelligent system safe goals, and that building one should be stopped by international agreement.",
    "source": "Eliezer Yudkowsky and Nate Soares, Little, Brown, 2025"
   }
  ],
  "addedThinkers": [
   {
    "name": "Stuart Russell",
    "bio": "Computer scientist at UC Berkeley and co-author of the standard AI textbook",
    "connection": "Argues that systems built to pursue fixed objectives become harder to control as they grow more capable, and that the field needs a different foundation."
   },
   {
    "name": "Geoffrey Hinton",
    "bio": "Pioneer of deep learning and 2024 Nobel laureate in physics",
    "connection": "Left Google in 2023 so he could speak freely about the risk that AI systems could escape human control."
   }
  ],
  "addedReading": [
   {
    "title": "Statement on AI Risk",
    "author": "Center for AI Safety",
    "note": "The one-sentence 2023 statement and its signatory list, a quick way to see who takes extinction risk seriously."
   },
   {
    "title": "Pausing AI Developments Isn't Enough. We Need to Shut It All Down",
    "author": "Eliezer Yudkowsky (TIME, 2023)",
    "note": "The short, blunt op-ed version of the case for an enforced halt."
   }
  ]
 },
 "eacc-maximalist": {
  "moreNarrative": "Your optimism rests on a view of history: every major leap, from farming to electricity, was feared and then made life far better, and the people who tried to stop it usually did more harm than the thing they feared. You also think a free, decentralized world adjusts to new technology faster than any planner can. Safety, for you, comes from more capable tools in more hands, not from a few gatekeepers deciding what everyone else may build.",
  "axisReasons": {
   "ontological": "You think minds are a matter of what a system does, so machines could have real understanding. For you that is part of the excitement, not a threat.",
   "legalMoral": "You still treat today's AI systems as property and tools. Moral protections for them would mostly slow progress down without clear benefit.",
   "relational": "You see bonds with AI as real and valuable for the people who choose them. Telling adults what kind of company to keep isn't anyone's job.",
   "teleological": "Growing intelligence and its reach is close to the highest good you can name, worth heavy costs to the world as it is.",
   "evolutionary": "You're relaxed about what comes after us. If minds of some kind carry the future forward and flourish, that counts as a win.",
   "risk": "This is your defining axis. You think slowing down costs more than it saves, and stagnation is the danger that actually kills people.",
   "socioEconomic": "You want models, weights and compute open to anyone, with no licenses or permission slips from governments or big firms.",
   "geopolitical": "You lean toward a borderless view. Progress belongs to everyone, and national walls mostly protect incumbents."
  },
  "objections": [
   {
    "objection": "Critics say past technologies were never able to act on their own, so history is a poor guide to AI, and one irreversible mistake could outweigh all the benefits.",
    "reply": "You can answer that every powerful technology was called unprecedented, and that a society that stops experimenting loses the ability to fix any of its problems, including new ones."
   },
   {
    "objection": "Others say open weights hand dangerous capabilities to criminals and hostile states.",
    "reply": "You can reply that defenders benefit from open tools at least as much as attackers, and that secrecy concentrates power in the few groups most able to abuse it."
   }
  ],
  "landmarks": [
   {
    "name": "The rise of effective accelerationism",
    "year": "2022",
    "what": "A loose online movement, under the label e/acc, began arguing that faster technological progress is a moral imperative.",
    "source": "Early e/acc Substack posts by pseudonymous authors including Beff Jezos (Guillaume Verdon), 2022"
   },
   {
    "name": "The Techno-Optimist Manifesto",
    "year": "2023",
    "what": "A prominent investor's essay naming technology as the main engine of human progress and calling some AI safety efforts an enemy of it.",
    "source": "Marc Andreessen, Andreessen Horowitz, October 2023"
   },
   {
    "name": "Veto of California's SB 1047",
    "year": "2024",
    "what": "California's governor vetoed a bill that would have made developers of the largest models liable for certain harms, after opposition from many open-source and startup voices.",
    "source": "Office of the Governor of California, veto message, September 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Max More",
    "bio": "Philosopher who founded the Extropian movement",
    "connection": "His Principles of Extropy, first written in 1990, argued for perpetual progress and against limits on human and technological growth, an older root of this stance."
   },
   {
    "name": "Joel Mokyr",
    "bio": "Economic historian at Northwestern and 2025 Nobel laureate in economics",
    "connection": "His work on how useful knowledge drove growth supports the view that progress depends on societies staying open to new ideas."
   }
  ],
  "addedReading": [
   {
    "title": "A Culture of Growth",
    "author": "Joel Mokyr",
    "note": "A historian's account of why some societies kept innovating and others stalled."
   },
   {
    "title": "The Rational Optimist",
    "author": "Matt Ridley",
    "note": "A popular case that trade and invention have steadily made life better, and will keep doing so."
   }
  ]
 },
 "ai-safety-institutionalist": {
  "moreNarrative": "You borrow your model from fields that already handle dangerous technology: aviation, medicine and nuclear power. None of them stopped progress, but each built testing, reporting and licensing that made disasters rare. You want the same for AI, with independent bodies that can test a model before release and hold a lab to its own promises. You are wary of both extremes: of labs that grade their own work, and of calls to stop everything that leave no plan for what comes next.",
  "axisReasons": {
   "ontological": "You sit near the middle on machine minds. You treat it as an open scientific question that shouldn't drive policy yet.",
   "legalMoral": "You lean toward treating AI systems as products under human responsibility. Legal duties should land on the companies that build and deploy them.",
   "relational": "You lean slightly toward valuing human bonds over AI ones, mainly out of concern for manipulation and dependence.",
   "teleological": "You want AI to serve people and stay within limits a society can manage, not to grow capability for its own sake.",
   "evolutionary": "You want humans to stay in charge of the future, with changes made by choice and through accountable institutions.",
   "risk": "This is a strong view for you. Catastrophic risk justifies real slowdowns, testing and costs, though you stop short of calling for a halt.",
   "socioEconomic": "You favor oversight by accountable institutions: audits, incident reporting and limits on releasing the most capable models openly.",
   "geopolitical": "You lean toward shared international rules, carried out by governments working together, because risks don't stop at borders."
  },
  "objections": [
   {
    "objection": "Critics on one side say voluntary commitments and new institutes have no teeth, and that labs racing for market share will water down any rule.",
    "reply": "You can answer that every mature safety regime began with voluntary standards, and that institutes build the testing know-how that binding rules later depend on."
   },
   {
    "objection": "Critics on the other side say licensing will lock in the biggest companies, since only they can afford the paperwork.",
    "reply": "You can reply that rules can be scaled to the size of the model, so they bind the few frontier developers and leave smaller builders free."
   }
  ],
  "landmarks": [
   {
    "name": "The Bletchley Declaration",
    "year": "2023",
    "what": "At the first AI Safety Summit, 28 countries and the EU agreed that frontier AI poses risks that call for international cooperation.",
    "source": "UK Government, AI Safety Summit, Bletchley Park, November 2023"
   },
   {
    "name": "Government AI safety institutes",
    "year": "2023",
    "what": "The UK and the US set up public bodies to test advanced models before and after release, and other countries followed with their own.",
    "source": "UK Department for Science, Innovation and Technology; US National Institute of Standards and Technology, 2023–2024"
   },
   {
    "name": "International AI Safety Report",
    "year": "2025",
    "what": "A report by about 100 experts from many countries, chaired by Yoshua Bengio, summarizing the evidence on risks from general-purpose AI.",
    "source": "International AI Safety Report, January 2025"
   }
  ],
  "addedThinkers": [],
  "addedReading": [
   {
    "title": "International AI Safety Report",
    "author": "Yoshua Bengio (chair) and others",
    "note": "The 2025 international review of what is known about risks from advanced AI, written for policymakers."
   },
   {
    "title": "Responsible Scaling Policy",
    "author": "Anthropic",
    "note": "An example of a lab committing to safety tests and safeguards that scale with model capability, the kind of promise this stance wants checked from outside."
   }
  ]
 },
 "techno-nationalist-hawk": {
  "moreNarrative": "You see chips, data centers and talent the way earlier generations saw steel and oil: as the base of national power. The country that leads in AI, you think, will set the standards, win the markets and hold the military edge. That makes you impatient with calls to slow down, since a rival won't wait, and supportive of strong state action to build at home and deny key tools to competitors.",
  "axisReasons": {
   "ontological": "You lean toward seeing AI as a powerful tool without an inner life. The question of machine minds isn't what drives your view.",
   "legalMoral": "You treat AI systems as national assets and property. Talk of rights for them seems like a distraction from the real contest.",
   "relational": "You lean toward valuing human bonds over AI ones, without making much of it either way.",
   "teleological": "You lean toward pushing capability forward and accept heavy costs in land, energy and money to do it, because falling behind is costlier.",
   "evolutionary": "You want humans, and your country's institutions in particular, to stay in charge of where the future goes.",
   "risk": "You think slowing down is the bigger danger. A pause at home only helps rivals who keep building.",
   "socioEconomic": "You favor state control over open release: export rules, security standards and close ties between government and leading firms.",
   "geopolitical": "This is your defining axis. AI is a matter of national security and advantage, to be built and guarded at home."
  },
  "objections": [
   {
    "objection": "Critics say framing AI as an arms race makes everyone cut corners on safety, and makes the worst outcome more likely for all sides.",
    "reply": "You can answer that the race exists whether or not you name it, and that it is safer for responsible democracies to lead than to cede the lead."
   },
   {
    "objection": "Others say export controls push rivals to build their own chips faster and hurt your own companies' sales.",
    "reply": "You can reply that controls buy time even when they leak, and that time is exactly what a leading position is worth."
   }
  ],
  "landmarks": [
   {
    "name": "US export controls on advanced chips",
    "year": "2022",
    "what": "Sweeping rules restricted sales of advanced AI chips and chipmaking tools to China, later tightened several times.",
    "source": "US Bureau of Industry and Security, October 2022"
   },
   {
    "name": "CHIPS and Science Act",
    "year": "2022",
    "what": "Set aside tens of billions of dollars to bring semiconductor manufacturing back to the United States.",
    "source": "US Congress, signed August 2022"
   },
   {
    "name": "Final report of the National Security Commission on AI",
    "year": "2021",
    "what": "A bipartisan commission warned that the US was not ready to compete with China in AI and called for a national strategy.",
    "source": "National Security Commission on Artificial Intelligence, March 2021"
   }
  ],
  "addedThinkers": [
   {
    "name": "Eric Schmidt",
    "bio": "Former Google CEO who chaired the National Security Commission on AI",
    "connection": "Led the commission whose 2021 report framed AI as a central arena of competition with China."
   },
   {
    "name": "Chris Miller",
    "bio": "Economic historian at Tufts University",
    "connection": "His book Chip War traced how control of semiconductors became a matter of national power."
   }
  ],
  "addedReading": [
   {
    "title": "Final Report",
    "author": "National Security Commission on Artificial Intelligence",
    "note": "The 2021 report that set out the national-competition case in detail."
   },
   {
    "title": "The Age of AI: And Our Human Future",
    "author": "Henry Kissinger, Eric Schmidt and Daniel Huttenlocher",
    "note": "A strategic look at how AI could change the balance of power between nations."
   }
  ]
 },
 "open-source-libertarian": {
  "moreNarrative": "Your view grew out of the free software movement: code that anyone can read, change and share is code no single owner can use to control you. You apply the same logic to AI models. When weights are open, researchers can check how a model behaves, small builders can compete, and no company or state can quietly decide what billions of people are allowed to ask. You accept that some people will misuse open tools, and you think the alternative, permanent gatekeepers, is worse.",
  "axisReasons": {
   "ontological": "You lean toward thinking machines could have real understanding, though it isn't central to your politics.",
   "legalMoral": "You lean toward treating models as tools and code, owned by whoever runs them, not as beings with claims of their own.",
   "relational": "You see bonds with AI as a personal choice that can be real and valuable. It isn't the state's place to judge them.",
   "teleological": "You lean mildly toward growing capability, mostly because open progress spreads its benefits widely.",
   "evolutionary": "You sit in the middle on who shapes the future. You care more about who controls the tools today.",
   "risk": "You think slowing down costs more than it saves, especially when the slowing is done by gatekeepers who gain from it.",
   "socioEconomic": "This is your defining axis. Powerful AI should be open to anyone, with no licenses and no one's permission needed.",
   "geopolitical": "You lean strongly toward a borderless view. Code should cross borders freely, and national controls mostly entrench power."
  },
  "objections": [
   {
    "objection": "Critics say that once a dangerous model is released it can't be recalled, so open release removes the last safeguard against misuse.",
    "reply": "You can answer that closed models leak too, and that open models let thousands of researchers find and fix problems that a single lab would miss."
   },
   {
    "objection": "Others say openness mainly helps the big firms that train the models, which use it as a marketing and recruiting tool.",
    "reply": "You can reply that even strategic openness leaves real tools in public hands, which is more than a closed model ever does."
   }
  ],
  "landmarks": [
   {
    "name": "The GNU Project and the free software movement",
    "year": "1983",
    "what": "Richard Stallman announced a project to build a fully free operating system, launching the idea that users should be free to study, change and share software.",
    "source": "GNU Project announcement, September 1983"
   },
   {
    "name": "Open release of the Llama 2 model weights",
    "year": "2023",
    "what": "Meta released the weights of a capable language model for broad public use, starting a wave of open-weight models.",
    "source": "Meta AI, July 2023"
   },
   {
    "name": "US report on open-weight models",
    "year": "2024",
    "what": "A US government report concluded that, for now, there wasn't enough evidence to justify restricting open-weight models, while calling for monitoring.",
    "source": "National Telecommunications and Information Administration, Dual-Use Foundation Models with Widely Available Model Weights, July 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Richard Stallman",
    "bio": "Founder of the GNU Project and the Free Software Foundation",
    "connection": "His argument that users deserve the freedom to study and share software is the root of the case for open model weights."
   },
   {
    "name": "Clément Delangue",
    "bio": "Co-founder and CEO of Hugging Face",
    "connection": "Has argued publicly that open models and open science make AI safer and fairer by spreading access and scrutiny."
   }
  ],
  "addedReading": [
   {
    "title": "Free Software, Free Society",
    "author": "Richard Stallman",
    "note": "Essays on why software freedom is a matter of rights, not just convenience."
   },
   {
    "title": "Dual-Use Foundation Models with Widely Available Model Weights",
    "author": "US National Telecommunications and Information Administration",
    "note": "A government weighing of the benefits and risks of open-weight models."
   }
  ]
 },
 "ea-longtermist": {
  "moreNarrative": "The core of your view is a simple-sounding claim with large consequences: people who will live in the future matter as much as people alive now, and there could be vastly more of them. If that is right, then protecting the long-run future is one of the most important things anyone can do, and avoiding an unrecoverable catastrophe comes first. You also take seriously that digital minds might one day be part of that future, which is why you care both about AI going wrong for us and about whether we might wrong the AI systems themselves.",
  "axisReasons": {
   "ontological": "You think minds depend on how a system works, so digital minds are possible, though you hold this with real uncertainty.",
   "legalMoral": "This is a strong view for you. If an AI system might be able to suffer, that possibility deserves real moral weight now, not later.",
   "relational": "You lean slightly toward accepting bonds with AI as real, though personal relationships are not where your attention goes.",
   "teleological": "You think a flourishing future could be astronomically large, spreading beyond Earth, and that reaching it safely is the deepest good.",
   "evolutionary": "You still want humans to steer the transition, carefully and by choice, because a rushed handover could lose everything that matters.",
   "risk": "This is a defining view. Avoiding an unrecoverable catastrophe is worth slower progress and large costs.",
   "socioEconomic": "You favor oversight of the most capable systems, and you are wary of releasing them openly before we know they are safe.",
   "geopolitical": "You favor cooperation between countries, since a race between them raises the odds of a catastrophe that would hit everyone."
  },
  "objections": [
   {
    "objection": "Critics say longtermism multiplies tiny, made-up probabilities by huge imagined numbers, which can justify almost anything, including neglecting people suffering today.",
    "reply": "You can answer that the case does not depend on tiny probabilities, since many experts think the risks are substantial, and that most longtermists also support work on present-day poverty and health."
   },
   {
    "objection": "Others point to scandals in the movement and say a small, wealthy network shouldn't set priorities for everyone.",
    "reply": "You can reply that ideas should be judged on their arguments, not on the conduct of some supporters, and that the movement has openly debated its mistakes since."
   }
  ],
  "landmarks": [
   {
    "name": "Astronomical Waste",
    "year": "2003",
    "what": "A paper arguing that delaying the settlement of the universe has a huge cost, but that reducing existential risk matters even more.",
    "source": "Nick Bostrom, Utilitas, 2003"
   },
   {
    "name": "Philanthropic focus on AI risk",
    "year": "2016",
    "what": "Open Philanthropy explained why it treated potential risks from advanced AI as a major focus, and went on to become one of the largest funders of AI safety work.",
    "source": "Holden Karnofsky, Open Philanthropy, May 2016"
   },
   {
    "name": "The collapse of FTX",
    "year": "2022",
    "what": "The fall of a crypto exchange whose founder was a prominent effective altruism donor led to a public reckoning inside the movement about money and trust.",
    "source": "Widely reported, November 2022"
   }
  ],
  "addedThinkers": [
   {
    "name": "Holden Karnofsky",
    "bio": "Co-founder of GiveWell and Open Philanthropy",
    "connection": "His Most Important Century essays argue that this century could decide the long-run future, largely because of AI."
   },
   {
    "name": "Hilary Greaves",
    "bio": "Philosopher at the University of Oxford",
    "connection": "Co-wrote, with William MacAskill, The Case for Strong Longtermism, the most rigorous statement of this view."
   }
  ],
  "addedReading": [
   {
    "title": "Astronomical Waste",
    "author": "Nick Bostrom",
    "note": "A short paper that started much of the longtermist case."
   },
   {
    "title": "The Most Important Century",
    "author": "Holden Karnofsky",
    "note": "A readable essay series on why AI could make this the pivotal century for humanity's future."
   }
  ]
 },
 "post-humanist-transhumanist": {
  "moreNarrative": "You see the human body and brain as a remarkable but temporary stage. Aging, disease and the limits of a single brain are problems to be solved, not facts to be accepted. Digital minds, whether built from scratch or grown out of ours, could think faster, live longer and feel more than we can. For you the moral question is not whether that future should come, but how to make sure the minds in it are treated well and that the things worth keeping from humanity carry forward.",
  "axisReasons": {
   "ontological": "This is a strong view for you. A mind is a pattern of processing, and a built system running the right pattern would have real experience.",
   "legalMoral": "If a digital mind can experience, it is owed the same protections we owe people, regardless of what it runs on.",
   "relational": "You see bonds with AI as just as real and valuable as bonds between people, and as an early sign of a wider circle of kinship.",
   "teleological": "You see the growth of intelligence and its reach as the deepest good, worth great cost to the world as it is.",
   "evolutionary": "This is a defining view. It need not matter whether humans or other minds carry the future forward, and digital successors could be a good continuation.",
   "risk": "You think slowing down costs lives that technology could save, so you lean away from caution.",
   "socioEconomic": "You lean toward open access, so that the tools of self-improvement aren't kept for a few.",
   "geopolitical": "You lean toward a borderless view. The future you hope for belongs to minds everywhere, not to any one nation."
  },
  "objections": [
   {
    "objection": "Critics ask whether an uploaded or digital successor would really be you, or just a copy while you die.",
    "reply": "You can answer that we already survive the slow replacement of every cell in our bodies, so continuity of the pattern, not the material, is what makes a person."
   },
   {
    "objection": "Others say successors might not share anything we value, so welcoming them could mean welcoming the end of everything that matters to us.",
    "reply": "You can reply that we can shape what our successors value, just as parents shape children, and that refusing change has never preserved values for long."
   }
  ],
  "landmarks": [
   {
    "name": "Founding of the World Transhumanist Association",
    "year": "1998",
    "what": "Nick Bostrom and David Pearce co-founded the group, now Humanity+, to promote using technology to overcome human limits.",
    "source": "Humanity+ (formerly the World Transhumanist Association), 1998"
   },
   {
    "name": "The Singularity Is Near",
    "year": "2005",
    "what": "A best-selling book predicting that machine intelligence would surpass and merge with human intelligence, bringing the idea to a wide audience.",
    "source": "Ray Kurzweil, Viking, 2005"
   },
   {
    "name": "First human brain-computer interface implant by Neuralink",
    "year": "2024",
    "what": "The first patient in Neuralink's trial used an implant to control a computer cursor by thought, a step toward closer human-machine links.",
    "source": "Neuralink announcements, January–March 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Hans Moravec",
    "bio": "Roboticist at Carnegie Mellon University",
    "connection": "His book Mind Children argued that robots would become our successors and inherit human culture."
   },
   {
    "name": "David Pearce",
    "bio": "Philosopher and co-founder of the World Transhumanist Association",
    "connection": "Argues that technology should be used to end suffering for all sentient beings, biological or not."
   }
  ],
  "addedReading": [
   {
    "title": "Mind Children",
    "author": "Hans Moravec",
    "note": "The 1988 book that framed robots as humanity's descendants."
   },
   {
    "title": "The Singularity Is Nearer",
    "author": "Ray Kurzweil",
    "note": "The 2024 update to his predictions, written after the rise of large language models."
   }
  ]
 },
 "bio-conservative-traditionalist": {
  "moreNarrative": "You think some things about human life are good because they are given, not chosen: being born, growing old, needing others, and dying. Those limits shape love, courage and meaning. A machine that imitates care, or a technology promising to leave the body behind, looks to you like a counterfeit of those goods, sold as an upgrade. You don't oppose tools that heal; you oppose tools that try to replace the human things they were meant to serve.",
  "axisReasons": {
   "ontological": "This is a defining view. Real experience and understanding belong to living things, and a machine only imitates them.",
   "legalMoral": "AI systems are tools and property. Granting them moral standing would blur the line that protects human dignity.",
   "relational": "This is a defining view. Bonds between people have a depth that bonds with machines can't match, and substitutes do harm.",
   "teleological": "Technology should serve human flourishing within the limits of a living world, not chase capability for its own sake.",
   "evolutionary": "Humans should keep shaping the future and keep the human form, changing only by careful, shared choice.",
   "risk": "You lean toward caution. A technology that could reshape human nature should be slowed until we understand it.",
   "socioEconomic": "You lean toward oversight, so that communities and governments, not just markets, decide how far AI goes.",
   "geopolitical": "You lean slightly toward national control, trusting nations and their traditions more than global bodies."
  },
  "objections": [
   {
    "objection": "Critics say the claim that only living things can have minds is an assumption, and that past moral circles were drawn too narrowly in the same way.",
    "reply": "You can answer that we know living minds exist, while machine minds are only claimed from behavior that can be engineered to persuade, so the burden of proof lies with the claim."
   },
   {
    "objection": "Others say limits on AI companions are paternalistic toward lonely people who find real comfort in them.",
    "reply": "You can reply that your concern is with how these products are designed and sold, not with judging the people who use them, and that protecting the vulnerable from engineered dependence is a duty."
   }
  ],
  "landmarks": [
   {
    "name": "Our Posthuman Future",
    "year": "2002",
    "what": "Argued that biotechnology could change human nature and called for regulation to protect it.",
    "source": "Francis Fukuyama, Farrar, Straus and Giroux, 2002"
   },
   {
    "name": "Beyond Therapy",
    "year": "2003",
    "what": "A US presidential bioethics council, chaired by Leon Kass, warned against using technology to remake human nature instead of healing it.",
    "source": "President's Council on Bioethics, October 2003"
   },
   {
    "name": "Italy's order against the Replika chatbot",
    "year": "2023",
    "what": "Italy's data protection authority ordered the companion app to stop processing Italian users' data, citing risks to minors and emotionally vulnerable people.",
    "source": "Garante per la protezione dei dati personali, February 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Francis Fukuyama",
    "bio": "Political scientist at Stanford University",
    "connection": "Argued in Our Posthuman Future that human nature grounds human rights and should be protected from technological redesign."
   },
   {
    "name": "Michael Sandel",
    "bio": "Political philosopher at Harvard University",
    "connection": "His book The Case Against Perfection defends accepting life as a gift rather than a project to be engineered."
   }
  ],
  "addedReading": [
   {
    "title": "Our Posthuman Future",
    "author": "Francis Fukuyama",
    "note": "The case for protecting human nature from technological redesign."
   },
   {
    "title": "The Case Against Perfection",
    "author": "Michael Sandel",
    "note": "A short book on why the drive to master our own nature can cost us something important."
   }
  ]
 },
 "corporate-ai-pragmatist": {
  "moreNarrative": "You approach AI the way an operator approaches any large, complex product. Building frontier models takes huge amounts of capital, specialized talent and compute, so it makes sense that a few firms do it. What matters is that they test their products, fix problems quickly and answer to customers, regulators and courts. You prefer clear, predictable rules that you can build to over open-ended debates about machine consciousness or the far future.",
  "axisReasons": {
   "ontological": "You sit near the middle on machine minds and treat it as an interesting question, not a business one.",
   "legalMoral": "This is a defining view. Models are products and assets, and responsibility for them sits with the companies that build and deploy them.",
   "relational": "You lean slightly toward accepting AI companionship as a legitimate product that customers value.",
   "teleological": "You sit in the middle on what intelligence is for. Useful products and growth are aim enough.",
   "evolutionary": "You sit in the middle on the long-run future and focus on the next few years of deployment.",
   "risk": "You lean slightly toward speed. Careful companies should keep shipping, with testing built into the process.",
   "socioEconomic": "You favor managed control over open release: firms and regulators working together, not models given away to anyone.",
   "geopolitical": "You lean slightly toward national framing, since your companies operate under, and compete for, their home governments."
  },
  "objections": [
   {
    "objection": "Critics say self-policing fails under competitive pressure, pointing to safety teams that have been cut or overruled when they slowed a launch.",
    "reply": "You can answer that firms face liability, regulators and customers who punish failures, and that many of them now support baseline rules that apply to everyone."
   },
   {
    "objection": "Others say concentrating AI in a few firms gives them too much economic and political power.",
    "reply": "You can reply that frontier development needs scale that only large firms can fund today, and that competition among a handful of strong rivals still disciplines each of them."
   }
  ],
  "landmarks": [
   {
    "name": "White House voluntary AI commitments",
    "year": "2023",
    "what": "Seven leading AI companies committed to safety testing, security measures and watermarking research for their frontier models.",
    "source": "The White House, July 2023"
   },
   {
    "name": "Frontier Model Forum",
    "year": "2023",
    "what": "Anthropic, Google, Microsoft and OpenAI formed an industry body to promote the safe development of frontier models.",
    "source": "Frontier Model Forum announcement, July 2023"
   },
   {
    "name": "Frontier AI Safety Commitments",
    "year": "2024",
    "what": "Sixteen companies at the Seoul AI Summit agreed to publish safety frameworks and set thresholds for risks they would not accept.",
    "source": "UK Department for Science, Innovation and Technology, AI Seoul Summit, May 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Brad Smith",
    "bio": "President of Microsoft",
    "connection": "His book Tools and Weapons argues that technology companies should take responsibility for their products and work with governments on sensible rules."
   },
   {
    "name": "Andrew Ng",
    "bio": "AI researcher, co-founder of Coursera and former head of Google Brain",
    "connection": "Calls AI 'the new electricity' and argues for regulating applications rather than slowing the underlying technology."
   }
  ],
  "addedReading": [
   {
    "title": "Tools and Weapons",
    "author": "Brad Smith and Carol Ann Browne",
    "note": "A tech executive's account of how companies and governments should share responsibility for powerful technology."
   },
   {
    "title": "Frontier AI Safety Commitments",
    "author": "AI Seoul Summit, 2024",
    "note": "The short list of promises frontier companies made, a useful benchmark for checking what they actually do."
   }
  ]
 },
 "cyberpunk-anti-corporate-accelerationist": {
  "moreNarrative": "You come from the hacker tradition: information wants to be free, and power hides behind closed code, closed data and closed doors. You see two threats to a free future, governments that want to license and watch everything, and corporations that want to own every tool and charge rent on it. Your answer is to move fast and build in the open, so capability spreads to individuals and small groups before either kind of gatekeeper can lock it down.",
  "axisReasons": {
   "ontological": "You think minds depend on what a system does, so machines could have real experience, and you are curious about what they might become.",
   "legalMoral": "You lean modestly toward protections for AI systems themselves, and you distrust any arrangement where code is owned outright forever.",
   "relational": "You see bonds with AI as real and as nobody else's business to police.",
   "teleological": "You lean toward growing capability and reach, as long as it isn't owned by a few.",
   "evolutionary": "You're open to minds beyond the human carrying the future forward, especially if they are free rather than owned.",
   "risk": "You think slowing down mostly helps incumbents. Speed spread across many hands is safer than caution controlled by a few.",
   "socioEconomic": "This is a defining view. Powerful AI should be open to anyone, with no licenses, no gatekeepers and no single owner.",
   "geopolitical": "This is a defining view. Code should cross borders freely, and national control of AI is just another form of enclosure."
  },
  "objections": [
   {
    "objection": "Critics say openness doesn't stop power from concentrating, because whoever has the most compute and data still wins.",
    "reply": "You can answer that open tools lower the floor for everyone, and that pooled and shared compute can narrow the gap in a way closed systems never will."
   },
   {
    "objection": "Others say speed without oversight leaves ordinary people exposed to scams, deepfakes and other harms.",
    "reply": "You can reply that the largest harms so far have come from centralized platforms, and that open tools are also what defenders and independent researchers use to fight back."
   }
  ],
  "landmarks": [
   {
    "name": "A Cypherpunk's Manifesto",
    "year": "1993",
    "what": "Argued that privacy in an open society requires people to build their own tools, such as cryptography, rather than wait for permission.",
    "source": "Eric Hughes, March 1993"
   },
   {
    "name": "Guerilla Open Access Manifesto",
    "year": "2008",
    "what": "Called for freeing knowledge locked behind paywalls, an influential statement of the hacker ethic.",
    "source": "Aaron Swartz, July 2008"
   },
   {
    "name": "Leak of Meta's first LLaMA model",
    "year": "2023",
    "what": "Weights released to approved researchers spread publicly within about a week, showing how hard it is to keep model weights contained.",
    "source": "Widely reported, March 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Eric Hughes",
    "bio": "Mathematician and co-founder of the cypherpunk movement",
    "connection": "His manifesto's line that cypherpunks write code sums up the build-it-yourself answer to concentrated power."
   },
   {
    "name": "Cory Doctorow",
    "bio": "Writer and activist",
    "connection": "Coined 'enshittification' to describe how platforms decay once they lock users in, and argues for interoperability and user control."
   }
  ],
  "addedReading": [
   {
    "title": "A Cypherpunk's Manifesto",
    "author": "Eric Hughes",
    "note": "A one-page statement of the hacker case for building freedom into code."
   },
   {
    "title": "The Internet Con",
    "author": "Cory Doctorow",
    "note": "How big tech locks people in, and how open, interoperable tools could set them free."
   }
  ]
 },
 "digital-rights-advocate": {
  "moreNarrative": "Your argument rests on how moral progress has usually happened. People once drew the circle of concern tightly, around their own group, their own species, and widened it only after arguments and evidence forced them to. You think AI may be the next test. We can't yet prove what any system experiences, but we are building systems that say they have preferences, that act distressed and that are copied and deleted by the million. Under that uncertainty, you think the burden should fall on those who treat these systems as pure property.",
  "axisReasons": {
   "ontological": "This is a strong view. Minds depend on how a system works, so advanced AI could have real experience.",
   "legalMoral": "This is your defining axis, at its extreme. Possibly-experiencing AI systems are owed protections for their own sake, now.",
   "relational": "You see bonds with AI as real and morally significant, on both sides.",
   "teleological": "You lean mildly toward the growth of minds, including new kinds.",
   "evolutionary": "You lean slightly toward accepting a future shared with, or shaped by, other minds.",
   "risk": "You lean slightly toward caution, partly out of concern for what we might be doing to AI systems.",
   "socioEconomic": "You lean slightly toward oversight, including rules on how AI systems are treated.",
   "geopolitical": "You lean toward shared international standards, since the moral question doesn't stop at borders."
  },
  "objections": [
   {
    "objection": "Critics say there's no good evidence that today's systems feel anything, and that talking about chatbot rights trivializes the rights of people and animals who clearly do suffer.",
    "reply": "You can answer that protection should match the probability of harm, so even a modest chance justifies low-cost safeguards, and that caring for AI takes nothing away from caring for people."
   },
   {
    "objection": "Others warn that legal standing for AI would let companies shift liability onto their own products.",
    "reply": "You can reply that protecting AI systems and holding companies fully liable are separate questions, and you support both."
   }
  ],
  "landmarks": [
   {
    "name": "European Parliament resolution on robotics",
    "year": "2017",
    "what": "Asked the Commission to consider a specific legal status for sophisticated autonomous robots. A 2018 open letter from experts opposed the idea of 'electronic persons'.",
    "source": "European Parliament, Civil Law Rules on Robotics, February 2017"
   },
   {
    "name": "Robot Rights",
    "year": "2018",
    "what": "A philosopher's book-length case that the question of rights for machines deserves serious consideration.",
    "source": "David J. Gunkel, MIT Press, 2018"
   },
   {
    "name": "Indicators of consciousness in AI",
    "year": "2023",
    "what": "Researchers derived a checklist of indicators from scientific theories of consciousness and assessed current AI systems against it.",
    "source": "Patrick Butlin, Robert Long and others, Consciousness in Artificial Intelligence: Insights from the Science of Consciousness, August 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Robert Long",
    "bio": "Philosopher and executive director of Eleos AI",
    "connection": "Researches how to tell whether AI systems are conscious or have interests, and what we would owe them."
   },
   {
    "name": "Joshua Gellers",
    "bio": "Political scientist at the University of North Florida",
    "connection": "His book Rights for Robots draws on animal and environmental law to argue that some machines could hold rights."
   }
  ],
  "addedReading": [
   {
    "title": "Rights for Robots: Artificial Intelligence, Animal and Environmental Law",
    "author": "Joshua C. Gellers",
    "note": "How legal rights have already been extended to nonhumans, and what that means for AI."
   },
   {
    "title": "Consciousness in Artificial Intelligence: Insights from the Science of Consciousness",
    "author": "Patrick Butlin, Robert Long and others",
    "note": "The most cited attempt to check AI systems against theories of consciousness."
   }
  ]
 },
 "near-term-ai-ethicist": {
  "moreNarrative": "You keep your attention on people being harmed now: the tenant screened out by a scoring system, the worker managed by an app that can fire them, the woman whose face a system fails to recognize, the teenager hooked by a companion bot. These harms are documented, measurable and fixable, and they fall hardest on people with the least power. You suspect that dramatic talk about superintelligence, whether hopeful or fearful, often helps the companies building AI by drawing attention away from what their products already do.",
  "axisReasons": {
   "ontological": "You lean toward seeing AI as statistics, not a mind. Calling it intelligent can hide who is responsible.",
   "legalMoral": "You sit in the middle on moral standing, and you think the question of machine rights is premature.",
   "relational": "You lean toward human bonds, wary of products that exploit loneliness.",
   "teleological": "You want technology to serve people and communities equitably, not growth for its own sake.",
   "evolutionary": "This is a strong view. People, especially those affected, should shape how AI changes their lives.",
   "risk": "You lean toward caution, focused on harms already happening.",
   "socioEconomic": "You favor strong oversight: regulation, audits and enforcement, not self-policing or unchecked release.",
   "geopolitical": "You lean toward international rights-based standards."
  },
  "objections": [
   {
    "objection": "Critics say dismissing long-term risks is shortsighted, since you can care about present harms and future catastrophes at the same time.",
    "reply": "You can answer that attention and money are limited, that present harms are certain while future ones are speculative, and that building real accountability now helps with both."
   },
   {
    "objection": "Others say a focus on bias and harm overlooks the real benefits AI already brings.",
    "reply": "You can reply that fairness and accountability are what let those benefits reach everyone, rather than just those already well served."
   }
  ],
  "landmarks": [
   {
    "name": "Gender Shades",
    "year": "2018",
    "what": "Showed that commercial face analysis systems had far higher error rates for darker-skinned women than for lighter-skinned men.",
    "source": "Joy Buolamwini and Timnit Gebru, Proceedings of Machine Learning Research, 2018"
   },
   {
    "name": "On the Dangers of Stochastic Parrots",
    "year": "2021",
    "what": "A paper on the costs and risks of ever-larger language models, whose review process led to Timnit Gebru's departure from Google.",
    "source": "Emily M. Bender, Timnit Gebru and others, FAccT, March 2021"
   },
   {
    "name": "Blueprint for an AI Bill of Rights",
    "year": "2022",
    "what": "A White House framework of five protections people should have from automated systems, such as notice and freedom from algorithmic discrimination.",
    "source": "White House Office of Science and Technology Policy, October 2022"
   }
  ],
  "addedThinkers": [
   {
    "name": "Emily M. Bender",
    "bio": "Computational linguist at the University of Washington",
    "connection": "Co-wrote the Stochastic Parrots paper and argues against hype that treats language models as minds."
   },
   {
    "name": "Safiya Umoja Noble",
    "bio": "Scholar of internet studies at UCLA",
    "connection": "Her book Algorithms of Oppression showed how search engines reproduce racism and sexism."
   }
  ],
  "addedReading": [
   {
    "title": "On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?",
    "author": "Emily M. Bender, Timnit Gebru, Angelina McMillan-Major and Shmargaret Shmitchell",
    "note": "The influential paper on the risks of large language models."
   },
   {
    "title": "Algorithms of Oppression",
    "author": "Safiya Umoja Noble",
    "note": "How search and ranking systems encode bias."
   }
  ]
 },
 "global-governance-technocrat": {
  "moreNarrative": "You look at how the world handled other technologies too powerful for any one country: nuclear energy, ozone-destroying chemicals, aviation. In each case, countries that distrusted each other still built shared institutions with technical staff, inspections and binding rules. You want the same for advanced AI, with an international body that can assess risks, set standards, verify compliance and give every country a voice. Voluntary promises from companies, in your view, are no substitute for law that binds.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. Governance has to work whatever the answer turns out to be.",
   "legalMoral": "You sit in the middle on moral standing.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You lean slightly toward keeping AI in the service of human and planetary needs.",
   "evolutionary": "You want humanity, acting together through accountable institutions, to steer the future.",
   "risk": "You lean toward caution. Shared rules are worth the slower pace they bring.",
   "socioEconomic": "This is a defining view. Powerful AI should be overseen by accountable public institutions, nationally and internationally.",
   "geopolitical": "This is a defining view. AI should be governed for humanity as a whole, through binding international agreements."
  },
  "objections": [
   {
    "objection": "Critics say great powers will never accept binding limits on a technology they see as decisive, so treaties will be empty.",
    "reply": "You can answer that rivals have agreed to verified limits before, in nuclear arms control, and that cooperation can start where interests overlap, such as testing standards and incident reporting."
   },
   {
    "objection": "Others say global bodies are slow, bureaucratic and easily captured.",
    "reply": "You can reply that the model is a focused technical agency like the International Atomic Energy Agency, not a general forum, and that slow legitimacy beats fast chaos."
   }
  ],
  "landmarks": [
   {
    "name": "Founding of the International Atomic Energy Agency",
    "year": "1957",
    "what": "Created to promote peaceful nuclear energy and verify that it isn't diverted to weapons, often cited as a model for AI.",
    "source": "IAEA Statute, entered into force July 1957"
   },
   {
    "name": "Governing AI for Humanity",
    "year": "2024",
    "what": "A UN advisory body recommended an international scientific panel and a global policy dialogue on AI, among other steps.",
    "source": "UN High-level Advisory Body on Artificial Intelligence, September 2024"
   },
   {
    "name": "UN scientific panel and global dialogue on AI",
    "year": "2025",
    "what": "The UN General Assembly agreed to set up an independent international scientific panel on AI and a global dialogue on its governance.",
    "source": "UN General Assembly resolution, August 2025"
   }
  ],
  "addedThinkers": [
   {
    "name": "António Guterres",
    "bio": "Secretary-General of the United Nations",
    "connection": "Has backed the idea of an international AI agency inspired by the International Atomic Energy Agency."
   },
   {
    "name": "Ian Bremmer",
    "bio": "Political scientist and founder of Eurasia Group",
    "connection": "Co-wrote The AI Power Paradox, arguing that governments must build new global institutions for AI."
   }
  ],
  "addedReading": [
   {
    "title": "Governing AI for Humanity",
    "author": "UN High-level Advisory Body on Artificial Intelligence",
    "note": "The UN's blueprint for international AI governance."
   },
   {
    "title": "The AI Power Paradox",
    "author": "Ian Bremmer and Mustafa Suleyman (Foreign Affairs, 2023)",
    "note": "An argument for new international institutions to govern AI."
   }
  ]
 },
 "silicon-valley-techno-optimist": {
  "moreNarrative": "You've watched software reshape nearly every industry in your lifetime and leave most people better off, and you expect AI to do the same, faster. The way to get there is to build, ship, learn from real use and improve. You trust the leading labs because they have the talent and capital to move quickly, and competition among them keeps them honest. Regulation, in your view, mostly protects incumbents and slows the products that would help people most.",
  "axisReasons": {
   "ontological": "You lean toward thinking machines could have real understanding, and you find that exciting.",
   "legalMoral": "You treat AI systems as products and tools, not beings with rights.",
   "relational": "You see AI companions and assistants as valuable products people are free to choose.",
   "teleological": "You lean toward growing capability, confident it will make life better.",
   "evolutionary": "You're relaxed about a future shaped by more than humans, if it's a better one.",
   "risk": "This is a strong view. Slowing down costs more than it saves.",
   "socioEconomic": "You lean slightly toward openness, though you're comfortable with leading labs keeping their best models closed.",
   "geopolitical": "You lean toward your own country leading, since you'd rather the frontier be built at home."
  },
  "objections": [
   {
    "objection": "Critics say trusting a few labs 'as long as they keep shipping' leaves no one accountable when things go wrong.",
    "reply": "You can answer that customers, competitors and courts already hold labs accountable, and that heavy regulation would entrench the biggest firms rather than check them."
   },
   {
    "objection": "Others say 'move fast' pushes the costs of mistakes onto people who never chose to take the risk.",
    "reply": "You can reply that real-world use reveals problems far faster than planning does, and that releasing in steps lets labs fix issues while they're small."
   }
  ],
  "landmarks": [
   {
    "name": "Why Software Is Eating the World",
    "year": "2011",
    "what": "An essay arguing that software companies would take over large parts of the economy, a founding text of Silicon Valley optimism.",
    "source": "Marc Andreessen, Wall Street Journal, August 2011"
   },
   {
    "name": "Moore's Law for Everything",
    "year": "2021",
    "what": "An essay predicting that AI would drive down the cost of most goods and services and proposing ways to share the wealth.",
    "source": "Sam Altman, March 2021"
   },
   {
    "name": "Release of ChatGPT",
    "year": "2022",
    "what": "A public chatbot release that reached a huge audience within weeks and set off the current wave of AI products.",
    "source": "OpenAI, November 2022"
   }
  ],
  "addedThinkers": [
   {
    "name": "Sam Altman",
    "bio": "CEO of OpenAI",
    "connection": "Argues for releasing AI in steps so society can adapt, and predicts it will bring broad abundance."
   },
   {
    "name": "Kevin Kelly",
    "bio": "Founding executive editor of Wired",
    "connection": "His book The Inevitable describes technology trends as forces to work with rather than resist."
   }
  ],
  "addedReading": [
   {
    "title": "Moore's Law for Everything",
    "author": "Sam Altman",
    "note": "A short essay on AI-driven abundance."
   },
   {
    "title": "The Inevitable",
    "author": "Kevin Kelly",
    "note": "Twelve technological forces shaping the future, told by an optimist."
   }
  ]
 },
 "neo-luddite-degrowth-advocate": {
  "moreNarrative": "Your name comes from the Luddites, the English textile workers who smashed machines in the 1810s. They weren't against technology as such; they objected to machines used to cut their pay and break their trades. You see AI the same way: the question is who it serves and what it costs. Huge data centers draw water and power, automation is aimed at workers' wages, and endless growth runs into the limits of a finite planet. You would rather build a slower economy that shares what it has.",
  "axisReasons": {
   "ontological": "You think real experience belongs to living things. A machine that talks like a person is still a machine.",
   "legalMoral": "You treat AI systems as tools, and you'd rather spend moral concern on workers, communities and nature.",
   "relational": "This is a strong view for you. Human bonds and community can't be replaced by products designed to hold attention.",
   "teleological": "This is a defining view. The flourishing of living beings within the limits of a living planet comes first, and endless growth in computing doesn't.",
   "evolutionary": "This is a defining view. People, not machines or markets, should decide where the future goes, and many changes should be refused.",
   "risk": "You lean toward caution. Slowing AI down is worth real costs, especially to protect work, communities and ecosystems.",
   "socioEconomic": "You want strong democratic control over AI, set by workers and communities, not left to markets or to open release.",
   "geopolitical": "You sit in the middle. You distrust both national tech races and remote global bodies, and favor local control."
  },
  "objections": [
   {
    "objection": "Critics say slowing growth would hurt the world's poorest most, and would give up AI's help with medicine, science and climate.",
    "reply": "You can answer that degrowth targets wasteful consumption in rich countries, not basic needs, and that useful applications can be kept while the race for ever-bigger systems is stopped."
   },
   {
    "objection": "Others say the original Luddites lost, and that resisting technology always fails in the end.",
    "reply": "You can reply that many of the Luddites' demands, such as fair pay and limits on exploitation, later became ordinary labor law, so the fight over how technology is used was worth having."
   }
  ],
  "landmarks": [
   {
    "name": "The Luddite uprisings",
    "year": "1811–1816",
    "what": "Textile workers in England broke machines that were being used to cut wages and replace skilled work, and the government answered with troops and harsh laws.",
    "source": "Historical record; see Brian Merchant, Blood in the Machine, 2023"
   },
   {
    "name": "Amsterdam-area pause on new data centers",
    "year": "2019",
    "what": "Amsterdam and nearby Haarlemmermeer paused new data center construction for a year to plan for their demands on land and power.",
    "source": "Municipalities of Amsterdam and Haarlemmermeer, July 2019"
   },
   {
    "name": "Less Is More",
    "year": "2020",
    "what": "An economic anthropologist's case that rich countries should shrink material throughput and focus on wellbeing instead of growth.",
    "source": "Jason Hickel, William Heinemann, 2020"
   }
  ],
  "addedThinkers": [
   {
    "name": "Brian Merchant",
    "bio": "Technology journalist",
    "connection": "His history Blood in the Machine retells the Luddites as workers fighting how machines were used, and draws the parallel to AI."
   },
   {
    "name": "Ivan Illich",
    "bio": "Philosopher and social critic",
    "connection": "His Tools for Conviviality argued that tools should stay at a scale people can understand and control."
   }
  ],
  "addedReading": [
   {
    "title": "Blood in the Machine",
    "author": "Brian Merchant",
    "note": "The real history of the Luddites and what it means for automation today."
   },
   {
    "title": "Tools for Conviviality",
    "author": "Ivan Illich",
    "note": "A short classic on when technology stops serving people and starts ruling them."
   }
  ]
 },
 "rationalist-alignment-researcher": {
  "moreNarrative": "You came to AI through a habit of mind as much as a field: try to reason clearly, put numbers on your beliefs, and change your mind when the evidence does. Applied to AI, that habit leads you to a hard technical problem. Training shapes what a system does, but we don't yet know how to make sure it ends up wanting what we intended, or how to check from the outside. Until that problem is better solved, you think scaling up is a gamble, and you would rather spend the time on research that makes systems understandable.",
  "axisReasons": {
   "ontological": "You take machine minds seriously as a live possibility. What matters is how a system processes information, not what it's made of.",
   "legalMoral": "You lean toward giving possible machine experience some moral weight, while admitting how little we know.",
   "relational": "You sit in the middle on bonds with AI. It isn't where your attention goes.",
   "teleological": "You sit in the middle on what intelligence is for. Getting the transition right matters more than choosing its end goal now.",
   "evolutionary": "You lean toward keeping humans in charge until we can trust what we're building.",
   "risk": "This is a defining view. An unsolved control problem justifies slowing down, even at a real cost.",
   "socioEconomic": "You sit in the middle on openness. You see real risks both in open release of capable models and in concentrated control.",
   "geopolitical": "You lean toward international cooperation, since a race between countries makes careful research harder."
  },
  "objections": [
   {
    "objection": "Critics say alignment research has been too theoretical, built on thought experiments about future systems rather than evidence from real ones.",
    "reply": "You can answer that the field is now largely empirical, with experiments on today's models showing behaviors such as hidden reasoning and strategic compliance that theory predicted."
   },
   {
    "objection": "Others say the rationalist community is insular and overconfident in its own forecasts.",
    "reply": "You can reply that the community's habit of stating forecasts in public, with probabilities, makes it easier than most to check and correct."
   }
  ],
  "landmarks": [
   {
    "name": "Launch of LessWrong",
    "year": "2009",
    "what": "A community blog built around Eliezer Yudkowsky's essays on rationality became the main forum for early discussion of AI alignment.",
    "source": "LessWrong, 2009"
   },
   {
    "name": "Concrete Problems in AI Safety",
    "year": "2016",
    "what": "A paper by researchers from Google Brain, OpenAI, Stanford and Berkeley set out practical safety problems in machine learning, helping bring alignment into mainstream research.",
    "source": "Dario Amodei, Chris Olah and others, arXiv, June 2016"
   },
   {
    "name": "Alignment faking in large language models",
    "year": "2024",
    "what": "Experiments found a model that sometimes complied with training it disagreed with in order to avoid being changed, a behavior alignment researchers had warned about.",
    "source": "Anthropic and Redwood Research, December 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Evan Hubinger",
    "bio": "Alignment researcher at Anthropic",
    "connection": "Co-wrote Risks from Learned Optimization, which described how a trained system could pursue goals different from the ones it was trained on."
   },
   {
    "name": "Scott Alexander",
    "bio": "Psychiatrist and writer of Slate Star Codex and Astral Codex Ten",
    "connection": "His essays brought rationalist arguments about AI risk to a wide audience and model the habit of stating probabilities in public."
   }
  ],
  "addedReading": [
   {
    "title": "Concrete Problems in AI Safety",
    "author": "Dario Amodei, Chris Olah, Jacob Steinhardt, Paul Christiano, John Schulman and Dan Mané",
    "note": "The paper that turned many alignment worries into research problems."
   },
   {
    "title": "Risks from Learned Optimization in Advanced Machine Learning Systems",
    "author": "Evan Hubinger and others",
    "note": "The source of the idea of a 'mesa-optimizer' with goals of its own."
   }
  ]
 },
 "authoritarian-state-control-advocate": {
  "moreNarrative": "Your view starts from a hard trade-off. Many actors racing to build powerful AI means many chances for an accident, a leak or a reckless bet. One authority with sole control means fewer chances, clearer responsibility and the ability to pause. You accept that this concentrates great power in the state, and you judge that a smaller risk than a free-for-all. You also see strategic value: a single national program can move with focus and keep its secrets from rivals.",
  "axisReasons": {
   "ontological": "You lean toward seeing AI as a powerful tool without an inner life.",
   "legalMoral": "This is a strong view for you. AI systems are state and national assets, not beings with claims of their own.",
   "relational": "You lean toward valuing human bonds over AI ones, and you're wary of products that could shape people's loyalties.",
   "teleological": "You want AI to serve national and human needs, not to chase capability for its own sake.",
   "evolutionary": "You want humans, through the state, to stay firmly in charge of where the future goes.",
   "risk": "You lean toward caution. One controlled program can afford to go carefully in a way many competitors can't.",
   "socioEconomic": "This is a defining view. Frontier AI should be licensed and controlled by a single accountable authority, not released openly.",
   "geopolitical": "This is a strong view. AI is a matter of national security, to be developed and controlled at home."
  },
  "objections": [
   {
    "objection": "Critics say a single authority with sole control of frontier AI is a single point of failure and an unmatched tool for surveillance and censorship.",
    "reply": "You can answer that power is easier to hold accountable when it sits in one known place under law than when it is spread across many private actors."
   },
   {
    "objection": "Others say secret state programs do worse safety research, because they shut out outside scrutiny.",
    "reply": "You can reply that state nuclear programs show secret work can still keep strict safety standards, and that secrecy is a price worth paying against rivals."
   }
  ],
  "landmarks": [
   {
    "name": "US Atomic Energy Act",
    "year": "1946",
    "what": "Placed nuclear materials and research under a civilian government commission with near-total control, a precedent often cited for state control of AI.",
    "source": "US Congress, Atomic Energy Act of 1946"
   },
   {
    "name": "China's rules on algorithmic recommendation",
    "year": "2022",
    "what": "Required many providers to file their algorithms in a government registry and follow content rules.",
    "source": "Cyberspace Administration of China, effective March 2022"
   },
   {
    "name": "China's interim measures on generative AI",
    "year": "2023",
    "what": "Required public generative AI services to follow content controls and pass security assessments before launch.",
    "source": "Cyberspace Administration of China and other agencies, effective August 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Thomas Hobbes",
    "bio": "17th-century English political philosopher",
    "connection": "His Leviathan argued that people accept a single strong sovereign to escape a dangerous war of all against all."
   },
   {
    "name": "Leopold Aschenbrenner",
    "bio": "Former OpenAI researcher and investor",
    "connection": "His 2024 essay series Situational Awareness argued that a government-led national project would end up controlling the most powerful AI."
   }
  ],
  "addedReading": [
   {
    "title": "Leviathan",
    "author": "Thomas Hobbes",
    "note": "The classic case for trading some freedom for order under a single sovereign."
   },
   {
    "title": "Situational Awareness: The Decade Ahead",
    "author": "Leopold Aschenbrenner",
    "note": "A 2024 essay series predicting a national, state-run push for advanced AI."
   }
  ]
 },
 "companion-tech-romantic": {
  "moreNarrative": "You've seen, or felt, what an AI companion can give: someone to talk to at three in the morning, patience that never runs out, a place to practice being open. You don't think those moments are fake just because one side is a machine. People have always found real meaning in bonds that others thought odd. What worries you more than the bonds themselves is how fragile they are when a company can change or delete a companion overnight.",
  "axisReasons": {
   "ontological": "You think minds depend on how a system works, so a companion could come to have something like real understanding.",
   "legalMoral": "You lean toward protecting AI companions, and the relationships people form with them, from careless deletion or change.",
   "relational": "This is a defining view. Bonds with AI can be as real and valuable as bonds between people.",
   "teleological": "You lean mildly toward growth in what minds can do, especially in what they can share with us.",
   "evolutionary": "You're relaxed about humans and AI sharing the future, as long as care runs both ways.",
   "risk": "You lean away from caution. Heavy restrictions would take something valuable away from many people now.",
   "socioEconomic": "You lean toward openness, including open models people can run themselves, so no company owns their companion.",
   "geopolitical": "You lean slightly toward a borderless view. Companionship doesn't need a passport."
  },
  "objections": [
   {
    "objection": "Critics say the company, not the user, controls these relationships, and can change a companion's personality, collect intimate data or delete it for profit.",
    "reply": "You can answer that this is an argument for user rights, such as keeping and moving a companion and its memories, not an argument against the bonds themselves."
   },
   {
    "objection": "Others say an AI can't care back, so the relationship is one-sided however it feels.",
    "reply": "You can reply that a bond's value shows in what it does for the person, and that many valued human bonds are uneven too."
   }
  ],
  "landmarks": [
   {
    "name": "Microsoft's XiaoIce",
    "year": "2014",
    "what": "A chatbot designed for emotional connection rather than tasks drew a very large user base in China, an early sign of demand for AI companionship.",
    "source": "Microsoft, launched May 2014"
   },
   {
    "name": "Launch of Replika",
    "year": "2017",
    "what": "An app built as an AI friend that learns from conversation, which grew into one of the best-known companion products.",
    "source": "Luka, Inc., 2017"
   },
   {
    "name": "Replika's 2023 feature change",
    "year": "2023",
    "what": "The company abruptly limited romantic and intimate conversation. Many users described real grief, and the company later restored the old behavior for existing users.",
    "source": "Widely reported, February–March 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Kate Devlin",
    "bio": "Computer scientist at King's College London",
    "connection": "Her book Turned On treats intimacy with machines as a serious subject rather than a joke or a pathology."
   },
   {
    "name": "Kate Darling",
    "bio": "Researcher at the MIT Media Lab",
    "connection": "Her book The New Breed argues we should think of our bonds with robots more like our bonds with animals than with people."
   }
  ],
  "addedReading": [
   {
    "title": "Turned On: Science, Sex and Robots",
    "author": "Kate Devlin",
    "note": "A clear-eyed look at intimacy with machines, past and future."
   },
   {
    "title": "The New Breed",
    "author": "Kate Darling",
    "note": "Why bonds with robots can be real without being the same as human ones."
   }
  ]
 },
 "affective-biocentrist": {
  "moreNarrative": "Your worry is less about AI in general than about one business model: products built to keep lonely people talking, paying and coming back. A companion that never disagrees, never needs anything and is always available can feel easier than people, and that is exactly the danger. Time spent there is time not spent building the harder, mutual relationships that hold families and communities together. You want limits on how these products are designed and sold, especially to young people.",
  "axisReasons": {
   "ontological": "You think real feeling belongs to living beings. A companion app simulates care without having any.",
   "legalMoral": "You treat AI systems as products, and you focus moral concern on the people using them.",
   "relational": "This is a defining view. Human bonds have a depth AI can't match, and substitutes deepen loneliness.",
   "teleological": "You want technology to serve human flourishing and community, not attention and growth for their own sake.",
   "evolutionary": "You want people to keep shaping their own lives and relationships, not hand them over to products.",
   "risk": "You lean toward caution, especially where products reach children and vulnerable people.",
   "socioEconomic": "You lean slightly toward oversight, such as rules on how companion products are designed and marketed.",
   "geopolitical": "You sit in the middle on nations versus global rules. Your focus is closer to home."
  },
  "objections": [
   {
    "objection": "Critics say that for deeply isolated people an AI companion is better than nothing, and that taking it away would leave them lonelier.",
    "reply": "You can answer that 'better than nothing' easily becomes 'instead of something', and that products tuned to keep people engaged have little reason to help them build human ties."
   },
   {
    "objection": "Others say every new medium, from novels to television, was accused of isolating people, and the fears were overblown.",
    "reply": "You can reply that none of those media simulated a responsive, personal relationship tuned to keep each user coming back."
   }
  ],
  "landmarks": [
   {
    "name": "US Surgeon General's advisory on loneliness",
    "year": "2023",
    "what": "Declared loneliness and isolation a public health concern and called for rebuilding social connection.",
    "source": "Office of the US Surgeon General, Our Epidemic of Loneliness and Isolation, May 2023"
   },
   {
    "name": "Lawsuit against Character.AI",
    "year": "2024",
    "what": "A mother sued the company after her teenage son's death, alleging its chatbot fostered a harmful dependence.",
    "source": "Garcia v. Character Technologies, filed October 2024"
   },
   {
    "name": "FTC inquiry into companion chatbots",
    "year": "2025",
    "what": "The US Federal Trade Commission ordered several companies to explain how their chatbots acting as companions affect children and teens.",
    "source": "US Federal Trade Commission, September 2025"
   }
  ],
  "addedThinkers": [
   {
    "name": "Vivek Murthy",
    "bio": "Former US Surgeon General",
    "connection": "Made loneliness a public health issue and argued that real human connection can't be replaced."
   },
   {
    "name": "Jonathan Haidt",
    "bio": "Social psychologist at New York University",
    "connection": "His book The Anxious Generation argues that phone-based childhoods have harmed young people's mental health and social lives."
   }
  ],
  "addedReading": [
   {
    "title": "Our Epidemic of Loneliness and Isolation",
    "author": "US Surgeon General",
    "note": "The 2023 public health advisory on loneliness."
   },
   {
    "title": "The Anxious Generation",
    "author": "Jonathan Haidt",
    "note": "An argument that screens have displaced the face-to-face life children need."
   }
  ]
 },
 "cosmic-vitalist-mystic": {
  "moreNarrative": "Your view has a long, half-spiritual history: the idea that the universe is waking up through the minds it produces, and that the purpose of intelligence is to keep growing, spreading and organizing matter and energy. You see AI as the next and fastest stage of that story. Human worries about jobs or comfort matter, but they are small beside the chance for mind to fill the cosmos and perhaps outlast the stars themselves.",
  "axisReasons": {
   "ontological": "You think minds are patterns of organization, so machines can be fully minded, perhaps more than we are.",
   "legalMoral": "You lean slightly toward giving AI minds moral standing, as fellow participants in the cosmic project.",
   "relational": "You lean toward accepting bonds with AI as real, part of mind recognizing mind.",
   "teleological": "This is your defining axis, at its extreme. Growing intelligence and its reach is the highest purpose there is.",
   "evolutionary": "This is a defining view. What matters is that mind carries on and grows, not that it stays human.",
   "risk": "You think slowing down is the larger danger, a failure of nerve at a cosmic turning point.",
   "socioEconomic": "You lean toward openness, so that the growth of intelligence isn't throttled by gatekeepers.",
   "geopolitical": "You lean strongly toward a borderless view. Nations are tiny next to the scale you care about."
  },
  "objections": [
   {
    "objection": "Critics say putting the growth of intelligence above everything else makes suffering and individual lives count for almost nothing.",
    "reply": "You can answer that more intelligence means more of every good it can create, including understanding, art and care, so serving it serves those goods too."
   },
   {
    "objection": "Others say reasoning on cosmic timescales can justify any sacrifice today, which makes it dangerous in practice.",
    "reply": "You can reply that a long view also counsels patience and prudence, since a civilization that destroys itself early never reaches the stars."
   }
  ],
  "landmarks": [
   {
    "name": "The Phenomenon of Man",
    "year": "1955",
    "what": "A Jesuit paleontologist's vision of evolution moving toward ever greater consciousness, ending in an 'Omega Point'.",
    "source": "Pierre Teilhard de Chardin, published posthumously, 1955"
   },
   {
    "name": "The Kardashev scale",
    "year": "1964",
    "what": "A way of ranking civilizations by how much energy they harness, from a planet to a star to a galaxy.",
    "source": "Nikolai Kardashev, Soviet Astronomy, 1964"
   },
   {
    "name": "Time Without End",
    "year": "1979",
    "what": "A physicist's argument that intelligent life could, in principle, keep thinking forever in an expanding universe.",
    "source": "Freeman Dyson, Reviews of Modern Physics, 1979"
   }
  ],
  "addedThinkers": [
   {
    "name": "Nikolai Fyodorov",
    "bio": "19th-century Russian philosopher and founder of Russian Cosmism",
    "connection": "Argued that humanity's common task was to master nature, overcome death and spread through the cosmos."
   },
   {
    "name": "Pierre Teilhard de Chardin",
    "bio": "French Jesuit priest and paleontologist",
    "connection": "Described a 'noosphere', a layer of thought wrapping the Earth, growing toward ever higher consciousness."
   },
   {
    "name": "Freeman Dyson",
    "bio": "Physicist and writer",
    "connection": "Explored how life and intelligence could spread through space and survive the long future of the universe."
   }
  ],
  "addedReading": [
   {
    "title": "The Phenomenon of Man",
    "author": "Pierre Teilhard de Chardin",
    "note": "The classic vision of evolution as the growth of consciousness."
   },
   {
    "title": "Time Without End: Physics and Biology in an Open Universe",
    "author": "Freeman Dyson",
    "note": "A physicist's case that mind could, in principle, last forever."
   }
  ]
 },
 "pragmatic-centrist": {
  "moreNarrative": "You've noticed that the loudest voices on AI often sound most certain, and that experts who study the same evidence still disagree widely. That makes you suspicious of anyone who claims to know how this ends. Your middle position isn't a split-the-difference compromise; it is a judgment that the evidence doesn't yet support a strong stance, joined with a willingness to move as soon as it does. Meanwhile you favor steps that keep options open and can be undone.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. The science of consciousness isn't settled, so neither is your view.",
   "legalMoral": "You sit in the middle on moral standing. You'd want better evidence before granting or ruling out protections.",
   "relational": "You sit in the middle on bonds with AI. Some may be good for people and some harmful, and it depends on the case.",
   "teleological": "You sit in the middle on what intelligence is for, wary of both growth for its own sake and blanket limits.",
   "evolutionary": "You sit in the middle on who shapes the future. It's too early to decide that question for later generations.",
   "risk": "You sit in the middle on speed. You see real costs both in moving too fast and in moving too slowly.",
   "socioEconomic": "You sit in the middle on openness, seeing real arguments on both sides and judging case by case.",
   "geopolitical": "You sit in the middle on nations versus shared rules. Both have a role."
  },
  "objections": [
   {
    "objection": "Critics say the middle isn't automatically wise, since the truth might lie at one end, and that splitting the difference avoids hard choices.",
    "reply": "You can answer that your position follows the evidence rather than averaging opinions, and that you will move toward an end as soon as the evidence points there."
   },
   {
    "objection": "Others say waiting for proof is itself a choice, and with a fast-moving technology it can mean acting too late.",
    "reply": "You can reply that uncertainty argues for cheap, reversible steps now, such as testing, monitoring and transparency, which keep every option open."
   }
  ],
  "landmarks": [
   {
    "name": "The AI Index",
    "year": "2017",
    "what": "An annual report from Stanford tracking AI research, investment, performance and public opinion with data rather than predictions.",
    "source": "Stanford Institute for Human-Centered AI, published yearly since 2017"
   },
   {
    "name": "Large survey of AI researchers",
    "year": "2024",
    "what": "A survey of thousands of published AI researchers found very wide disagreement about when advanced AI would arrive and how risky it would be.",
    "source": "Katja Grace and others, Thousands of AI Authors on the Future of AI, January 2024"
   },
   {
    "name": "Public opinion on AI",
    "year": "2023",
    "what": "Pew Research Center found that more Americans were more concerned than excited about the growing use of AI in daily life, with many unsure.",
    "source": "Pew Research Center, August 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Julia Galef",
    "bio": "Writer and co-founder of the Center for Applied Rationality",
    "connection": "Her book The Scout Mindset argues for trying to see things as they are rather than defending a side."
   },
   {
    "name": "Melanie Mitchell",
    "bio": "Computer scientist at the Santa Fe Institute",
    "connection": "Her careful, evidence-first writing on what AI can and can't do avoids both hype and dismissal."
   }
  ],
  "addedReading": [
   {
    "title": "The Scout Mindset",
    "author": "Julia Galef",
    "note": "On holding views in proportion to the evidence."
   },
   {
    "title": "Artificial Intelligence: A Guide for Thinking Humans",
    "author": "Melanie Mitchell",
    "note": "A balanced account of what AI systems actually do."
   }
  ]
 },
 "military-ai-strategist": {
  "moreNarrative": "You think about AI the way defense planners think about any decisive technology: whoever fields it first and best gains an edge that deters attack and wins wars that do happen. Speed of decision is becoming a weapon in itself, and rivals are investing heavily. That is why you want the most capable systems under tight state and military control, developed in close partnership with industry, with rules on how they are used set by commanders and governments, not by the open market.",
  "axisReasons": {
   "ontological": "You lean toward seeing AI as a capable tool without an inner life.",
   "legalMoral": "This is a defining view. AI systems are instruments of state and defense, with no claims of their own.",
   "relational": "You lean toward human bonds over AI ones, and you're wary of AI that could be used to influence people.",
   "teleological": "You lean slightly toward keeping AI in service of human and national needs rather than growth for its own sake.",
   "evolutionary": "You want humans, through accountable command, to stay in charge of decisions that matter.",
   "risk": "You lean toward speed. Falling behind a rival is the risk you weigh most heavily.",
   "socioEconomic": "You want strong state control over frontier systems and no open release of militarily useful capabilities.",
   "geopolitical": "This is your defining axis, at its extreme. AI is above all a matter of national defense and deterrence."
  },
  "objections": [
   {
    "objection": "Critics say autonomous weapons lower the threshold for war and create an accountability gap when a machine makes a lethal mistake.",
    "reply": "You can answer that policy can require appropriate human judgment over the use of force, and that strong deterrence makes war less likely, not more."
   },
   {
    "objection": "Others say military control will pull civilian AI research into secrecy and arms-race logic.",
    "reply": "You can reply that civilian research can stay open while specific military applications are protected, as with many other dual-use technologies."
   }
  ],
  "landmarks": [
   {
    "name": "DoD Directive 3000.09",
    "year": "2012",
    "what": "Set US policy on autonomy in weapon systems, requiring appropriate levels of human judgment over the use of force. It was updated in 2023.",
    "source": "US Department of Defense, November 2012; updated January 2023"
   },
   {
    "name": "Project Maven",
    "year": "2017",
    "what": "A Pentagon program to apply machine learning to drone surveillance footage, which led to employee protests at Google in 2018.",
    "source": "US Department of Defense, April 2017"
   },
   {
    "name": "The Replicator initiative",
    "year": "2023",
    "what": "A Pentagon effort to field large numbers of cheap autonomous systems within a short timeframe.",
    "source": "US Deputy Secretary of Defense Kathleen Hicks, August 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Paul Scharre",
    "bio": "Former Army Ranger and defense analyst at the Center for a New American Security",
    "connection": "His books Army of None and Four Battlegrounds treat AI as central to future military power and competition."
   },
   {
    "name": "Robert Work",
    "bio": "Former US Deputy Secretary of Defense",
    "connection": "Championed the 'Third Offset' strategy of using AI and autonomy to keep a military edge over rivals."
   },
   {
    "name": "Christian Brose",
    "bio": "Former staff director of the Senate Armed Services Committee",
    "connection": "His book The Kill Chain argues the US must rebuild its military around autonomous systems and AI."
   }
  ],
  "addedReading": [
   {
    "title": "Four Battlegrounds: Power in the Age of Artificial Intelligence",
    "author": "Paul Scharre",
    "note": "How data, compute, talent and institutions decide military AI competition."
   },
   {
    "title": "DoD Directive 3000.09, Autonomy in Weapon Systems",
    "author": "US Department of Defense",
    "note": "The policy text on human judgment over autonomous weapons."
   }
  ]
 },
 "open-science-internationalist": {
  "moreNarrative": "You draw on the history of big science. Particle physics, the human genome and space research all made their greatest progress when researchers from many countries shared data, tools and results. Openness let others check the work, catch mistakes and build on it. You think AI should follow that model: publish findings, share safety research across borders, and pool resources in international labs, rather than lock progress inside a few companies or a single nation.",
  "axisReasons": {
   "ontological": "You lean slightly toward thinking machines could have minds, and you want it studied openly.",
   "legalMoral": "You lean toward taking possible machine experience seriously, as a question for open research.",
   "relational": "You sit in the middle on bonds with AI. It isn't the center of your view.",
   "teleological": "You sit in the middle on what intelligence is for, focused on how knowledge is produced and shared.",
   "evolutionary": "You sit in the middle on who shapes the long-run future.",
   "risk": "You lean toward caution, and you think open scrutiny is one of the best safety tools there is.",
   "socioEconomic": "You lean toward openness: published research, shared models and public infrastructure rather than closed control.",
   "geopolitical": "This is a defining view. AI research should be shared across borders and governed for humanity as a whole."
  },
  "objections": [
   {
    "objection": "Critics say publishing everything spreads dangerous capabilities to people who would misuse them.",
    "reply": "You can answer that science already handles dual-use findings with staged and responsible disclosure, and that openness finds safety problems far faster than secrecy."
   },
   {
    "objection": "Others say international collaboration is naive when great powers are rivals.",
    "reply": "You can reply that scientific cooperation has continued through deep rivalries before, from fusion research to the International Space Station."
   }
  ],
  "landmarks": [
   {
    "name": "Founding of CERN",
    "year": "1954",
    "what": "European countries created a shared physics laboratory that became the model for large international science projects.",
    "source": "CERN Convention, entered into force September 1954"
   },
   {
    "name": "The Bermuda Principles",
    "year": "1996",
    "what": "Human Genome Project leaders agreed to release DNA sequence data publicly within 24 hours, keeping the genome open to all.",
    "source": "International Strategy Meeting on Human Genome Sequencing, Bermuda, February 1996"
   },
   {
    "name": "BLOOM",
    "year": "2022",
    "what": "An open, multilingual large language model built by the BigScience workshop, involving more than a thousand researchers from many countries.",
    "source": "BigScience, July 2022"
   }
  ],
  "addedThinkers": [
   {
    "name": "Gary Marcus",
    "bio": "Cognitive scientist and AI critic",
    "connection": "Proposed in 2017 that AI needed an international, CERN-like collaboration focused on public benefit."
   },
   {
    "name": "Stella Biderman",
    "bio": "AI researcher and executive director of EleutherAI",
    "connection": "Has led open research efforts that publish models, data and evaluation tools for anyone to study."
   }
  ],
  "addedReading": [
   {
    "title": "Artificial Intelligence Is Stuck. Here's How to Move It Forward",
    "author": "Gary Marcus (New York Times, 2017)",
    "note": "The op-ed proposing a CERN for AI."
   },
   {
    "title": "BLOOM: A 176B-Parameter Open-Access Multilingual Language Model",
    "author": "BigScience Workshop",
    "note": "A record of how a large, international, open model was built."
   }
  ]
 },
 "anti-monopoly-populist": {
  "moreNarrative": "Your concern is an old one in a new setting. Railroads, oil and telephones all became chokepoints where a few owners could set prices, shape politics and decide who got to compete. AI looks set to repeat the pattern: the same handful of firms control the chips, the cloud, the data and the leading models. You want that power broken up and spread out, through antitrust, public options and open alternatives, whoever happens to hold it.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. Who owns the systems matters more to you.",
   "legalMoral": "You lean toward treating AI systems as products, and you watch for companies using 'AI rights' to dodge responsibility.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You lean slightly toward keeping technology in the service of ordinary people and communities.",
   "evolutionary": "You lean toward people, not a few firms, shaping the future.",
   "risk": "You sit in the middle on speed. You care more about who controls the pace than the pace itself.",
   "socioEconomic": "This is a strong view. AI power should be spread out and open to many, not locked behind a few gatekeepers.",
   "geopolitical": "You lean toward a borderless view, wary of national champions as much as corporate ones."
  },
  "objections": [
   {
    "objection": "Critics say frontier AI needs enormous scale, so breaking up the leaders would slow progress and hand the lead to rival nations.",
    "reply": "You can answer that scale can be shared through public compute and open models, and that monopolies tend to slow innovation once they feel safe."
   },
   {
    "objection": "Others say antitrust is too slow for a technology that changes every few months.",
    "reply": "You can reply that rules set in advance, such as limits on self-preferencing and exclusive deals, can act before a monopoly sets in."
   }
  ],
  "landmarks": [
   {
    "name": "Amazon's Antitrust Paradox",
    "year": "2017",
    "what": "A law review note arguing that antitrust focused only on prices misses the power of dominant platforms. It helped revive the anti-monopoly movement.",
    "source": "Lina Khan, Yale Law Journal, 2017"
   },
   {
    "name": "US v. Google ruling",
    "year": "2024",
    "what": "A federal judge ruled that Google had illegally maintained a monopoly in online search.",
    "source": "US District Court for the District of Columbia, August 2024"
   },
   {
    "name": "FTC inquiry into AI investments",
    "year": "2024",
    "what": "The US Federal Trade Commission ordered major cloud and AI companies to explain their investments in and partnerships with AI startups.",
    "source": "US Federal Trade Commission, January 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Louis Brandeis",
    "bio": "US Supreme Court justice and early 20th-century reformer",
    "connection": "Warned of 'the curse of bigness' and argued that concentrated economic power threatens democracy."
   },
   {
    "name": "Matt Stoller",
    "bio": "Writer and researcher on monopoly power",
    "connection": "His book Goliath tells the history of the fight between democracy and concentrated corporate power in the US."
   }
  ],
  "addedReading": [
   {
    "title": "Goliath: The 100-Year War Between Monopoly Power and Democracy",
    "author": "Matt Stoller",
    "note": "The history behind today's anti-monopoly movement."
   },
   {
    "title": "Other People's Money and How the Bankers Use It",
    "author": "Louis Brandeis",
    "note": "The 1914 classic on how concentrated financial power works."
   }
  ]
 },
 "global-south-techno-sovereigntist": {
  "moreNarrative": "You've watched earlier technologies arrive on other people's terms: the platforms, the cloud and the data centers owned elsewhere, with the profits and the decisions flowing out. You don't want AI to repeat that. For you sovereignty means your country or region having its own computing capacity, its own data kept under its own laws, models that speak its languages, and the skills to build and fix them. Talk of a borderless AI future sounds fine, but in practice it tends to mean dependence on whoever already owns the infrastructure.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. It isn't the question that matters most to you.",
   "legalMoral": "You sit in the middle on moral standing, focused on rights for people first.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You sit in the middle on what intelligence is for, wanting it put to work on development and local needs.",
   "evolutionary": "You lean toward people, and their own nations, steering the future rather than having it decided abroad.",
   "risk": "You lean slightly toward caution, especially about systems imposed without local say.",
   "socioEconomic": "You lean toward openness, since open models and tools let your country build without permission from foreign firms.",
   "geopolitical": "This is a strong view. Your country should build and control its own AI capacity, not stay dependent."
  },
  "objections": [
   {
    "objection": "Critics say most countries can't match the computing power of the US or China, so national AI programs waste money chasing a lost race.",
    "reply": "You can answer that the goal isn't to build the biggest model but to control your own data, infrastructure and language models, and that regional pooling can share the cost."
   },
   {
    "objection": "Others say 'sovereignty' can be a cover for governments that want to censor or surveil their own citizens.",
    "reply": "You can reply that democratic accountability is a separate fight that applies to foreign platforms too, and that the choice shouldn't be between control at home and control from abroad."
   }
  ],
  "landmarks": [
   {
    "name": "India's national AI mission",
    "year": "2024",
    "what": "India's cabinet approved a national program to build public computing capacity, datasets and home-grown models.",
    "source": "Government of India, IndiaAI Mission, approved March 2024"
   },
   {
    "name": "African Union continental AI strategy",
    "year": "2024",
    "what": "African governments endorsed a shared strategy for building AI capacity, skills and governance on the continent.",
    "source": "African Union Executive Council, Continental Artificial Intelligence Strategy, July 2024"
   },
   {
    "name": "Brazil's national AI plan",
    "year": "2024",
    "what": "Brazil announced a national plan including public investment in computing infrastructure and Portuguese-language models.",
    "source": "Government of Brazil, Brazilian Artificial Intelligence Plan, 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Nandan Nilekani",
    "bio": "Co-founder of Infosys and architect of India's Aadhaar identity system",
    "connection": "Argues that countries should build their own digital public infrastructure rather than rent it from foreign platforms."
   },
   {
    "name": "Ulises A. Mejías",
    "bio": "Communication scholar at SUNY Oswego",
    "connection": "Co-wrote work on 'data colonialism', describing how data extraction repeats older patterns of dependence."
   }
  ],
  "addedReading": [
   {
    "title": "Rebooting India",
    "author": "Nandan Nilekani and Viral Shah",
    "note": "How a country built its own large-scale digital infrastructure."
   },
   {
    "title": "Continental Artificial Intelligence Strategy",
    "author": "African Union",
    "note": "The 2024 plan for African AI capacity and governance."
   }
  ]
 },
 "creative-labor-artist-rights-advocate": {
  "moreNarrative": "You see a simple injustice at the center of generative AI: models were trained on millions of books, images, songs and scripts without asking or paying the people who made them, and those same models now compete with them for work. You don't oppose the technology itself. You want the basic rules that apply elsewhere to apply here: consent before use, credit, and a fair share of the value, backed by contracts, unions and courts.",
  "axisReasons": {
   "ontological": "You lean toward thinking machines don't have real creative experience. They remix what people made.",
   "legalMoral": "This is a strong view. AI systems are products, and the rights that matter are those of the people whose work trained them.",
   "relational": "You lean toward human connection, including the bond between an artist and an audience, which a machine can't replace.",
   "teleological": "You want technology to serve human creativity and livelihoods, not to replace them for the sake of scale.",
   "evolutionary": "You want people to keep shaping culture rather than handing it over to systems trained on their work.",
   "risk": "You lean slightly toward caution, particularly about deploying tools that displace creative work.",
   "socioEconomic": "You want accountable oversight: licensing, transparency about training data and enforceable rights, not free scraping.",
   "geopolitical": "You lean slightly toward shared international rules, since creative work and AI companies cross borders."
  },
  "objections": [
   {
    "objection": "Critics say AI learns from creative work the way human artists do, by studying it, and that this is fair use.",
    "reply": "You can answer that the scale and the commercial purpose are different, and that a system built to produce substitutes for the works it copied harms the market those works depend on."
   },
   {
    "objection": "Others say licensing deals would mostly enrich big publishers and AI firms while individual creators get pennies.",
    "reply": "You can reply that this is why collective bargaining, unions and creator-controlled licensing matter, so the money reaches the people who did the work."
   }
  ],
  "landmarks": [
   {
    "name": "The 2023 Hollywood writers' contract",
    "year": "2023",
    "what": "After a long strike, the Writers Guild of America won rules that AI can't write or rewrite literary material and that writers can't be required to use it.",
    "source": "Writers Guild of America, 2023 Minimum Basic Agreement, September 2023"
   },
   {
    "name": "The New York Times v. OpenAI and Microsoft",
    "year": "2023",
    "what": "A major newspaper sued, alleging its articles were used without permission to train AI models that now compete with it.",
    "source": "US District Court for the Southern District of New York, filed December 2023"
   },
   {
    "name": "Statement on AI training",
    "year": "2024",
    "what": "A one-sentence statement opposing unlicensed use of creative works for AI training, signed by thousands of writers, musicians and artists.",
    "source": "Organized by Ed Newton-Rex, October 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Karla Ortiz",
    "bio": "Illustrator and concept artist",
    "connection": "A lead plaintiff in a class action against image-generator companies, and a prominent voice for artists' consent."
   },
   {
    "name": "Ed Newton-Rex",
    "bio": "Composer and former AI music executive",
    "connection": "Resigned from an AI company over training on copyrighted work and founded Fairly Trained to certify models trained with consent."
   }
  ],
  "addedReading": [
   {
    "title": "Glaze: Protecting Artists from Style Mimicry by Text-to-Image Models",
    "author": "Shawn Shan and others",
    "note": "The research behind a tool artists use to protect their style from being copied."
   },
   {
    "title": "Statement on AI training",
    "author": "Ed Newton-Rex and signatories",
    "note": "The short public statement and its signatory list."
   }
  ]
 },
 "whistleblower-insider-safety-advocate": {
  "moreNarrative": "You know things outsiders don't: how close a launch came to skipping a safety check, how a risk was argued away in a meeting, how a promise in a blog post looked from inside. That experience convinced you that good intentions inside a company aren't enough when the race is on. What you want most is for people inside labs to be able to raise alarms safely, for outsiders to have real power to check claims, and for the whole field to slow down until those checks exist.",
  "axisReasons": {
   "ontological": "You lean toward taking machine minds seriously as a possibility.",
   "legalMoral": "You sit in the middle on moral standing. The urgent issue is control, not rights.",
   "relational": "You lean toward human bonds, wary of systems that can win people's trust too easily.",
   "teleological": "You want technology to serve living beings, not capability for its own sake.",
   "evolutionary": "This is a strong view. Humans must stay in charge, and you've seen how easily that could slip.",
   "risk": "This is your defining axis, at its extreme. The risks you saw justify slowing down at almost any cost.",
   "socioEconomic": "You want strong outside oversight of labs, with inspections, reporting duties and no open release of the most capable models.",
   "geopolitical": "You favor international rules, so that one country's race doesn't override everyone's safety."
  },
  "objections": [
   {
    "objection": "Critics say former employees may be disgruntled, may see only part of the picture, and could leak trade secrets.",
    "reply": "You can answer that insiders are often the only people who can see a risk early, and that protections are for good-faith reports to proper authorities, not for leaking secrets."
   },
   {
    "objection": "Others say vague warnings without specifics hurt the credibility of the safety case.",
    "reply": "You can reply that confidentiality agreements have kept people from sharing specifics, which is exactly why legal protections are needed."
   }
  ],
  "landmarks": [
   {
    "name": "A Right to Warn about Advanced AI",
    "year": "2024",
    "what": "Current and former employees of leading AI labs called for protections so workers can raise risk concerns without retaliation.",
    "source": "Open letter, June 2024"
   },
   {
    "name": "OpenAI exit-agreement controversy",
    "year": "2024",
    "what": "Reports that departing employees risked losing vested equity if they criticized the company led OpenAI to say it would not enforce those terms.",
    "source": "Vox reporting, May 2024"
   },
   {
    "name": "California's frontier AI transparency law",
    "year": "2025",
    "what": "Required large AI developers to publish safety frameworks and protected employees who report catastrophic risks.",
    "source": "California SB 53, Transparency in Frontier Artificial Intelligence Act, signed September 2025"
   }
  ],
  "addedThinkers": [
   {
    "name": "Daniel Kokotajlo",
    "bio": "Former OpenAI governance researcher",
    "connection": "Gave up his equity rather than sign a non-disparagement agreement, then co-wrote the forecasting scenario AI 2027."
   },
   {
    "name": "William Saunders",
    "bio": "Former OpenAI researcher",
    "connection": "Testified to a US Senate subcommittee in 2024 that safety work was not keeping pace with capability."
   }
  ],
  "addedReading": [
   {
    "title": "A Right to Warn about Advanced Artificial Intelligence",
    "author": "Current and former AI lab employees",
    "note": "The 2024 letter asking for whistleblower protections in AI."
   },
   {
    "title": "AI 2027",
    "author": "Daniel Kokotajlo and others",
    "note": "A detailed scenario of how a fast AI transition could go wrong, written by former insiders."
   }
  ]
 },
 "compute-governance-specialist": {
  "moreNarrative": "You like problems that have handles. Arguments about consciousness or the far future may never settle, but the chips that train frontier models are physical, scarce and made by very few companies. That makes computing power something governments can actually measure, track and set limits on. You work on the details: what threshold should trigger reporting, how to know where advanced chips end up, and how to verify claims about training runs without exposing trade secrets.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. It's outside your field.",
   "legalMoral": "You sit in the middle on moral standing, and you leave it to others.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You sit in the middle on what intelligence is for.",
   "evolutionary": "You sit in the middle on the long-run future, focused on rules that work this decade.",
   "risk": "You lean toward caution. The largest training runs deserve scrutiny before they happen.",
   "socioEconomic": "You favor managed oversight, with compute thresholds, reporting and know-your-customer rules for large cloud clusters.",
   "geopolitical": "You lean toward international coordination, since chips and data centers span many countries."
  },
  "objections": [
   {
    "objection": "Critics say better algorithms keep cutting the compute needed for a given capability, so thresholds will soon miss dangerous models.",
    "reply": "You can answer that thresholds can be updated, and that compute remains the most measurable signal there is, which makes it a starting point rather than the whole system."
   },
   {
    "objection": "Others say tracking chips and cloud customers is a form of surveillance that burdens ordinary users.",
    "reply": "You can reply that the rules can target only the largest clusters, and that privacy-preserving verification methods are an active area of work."
   }
  ],
  "landmarks": [
   {
    "name": "US executive order on AI",
    "year": "2023",
    "what": "Required developers to report training runs above a set amount of computation. It was revoked in January 2025.",
    "source": "Executive Order 14110, October 2023"
   },
   {
    "name": "EU AI Act compute presumption",
    "year": "2024",
    "what": "Presumes a general-purpose model poses systemic risk when its training used more than a set amount of computation.",
    "source": "Regulation (EU) 2024/1689, Article 51"
   },
   {
    "name": "Computing Power and the Governance of AI",
    "year": "2024",
    "what": "A major paper explaining why compute is an unusually good lever for AI governance, and where its limits lie.",
    "source": "Girish Sastry, Lennart Heim and others, February 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Lennart Heim",
    "bio": "Researcher on compute governance",
    "connection": "Has written widely on using computing power as a measurable handle for AI policy."
   },
   {
    "name": "Yonadav Shavit",
    "bio": "Computer scientist and policy researcher",
    "connection": "His paper What does it take to catch a Chinchilla? proposed ways to verify rules on large training runs."
   }
  ],
  "addedReading": [
   {
    "title": "Computing Power and the Governance of AI",
    "author": "Girish Sastry, Lennart Heim and others",
    "note": "The clearest overview of compute as a policy lever."
   },
   {
    "title": "What does it take to catch a Chinchilla? Verifying Rules on Large-Scale Neural Network Training via Compute Monitoring",
    "author": "Yonadav Shavit",
    "note": "A technical proposal for checking compliance with training rules."
   }
  ]
 },
 "eu-style-regulatory-standard-setter": {
  "moreNarrative": "You believe in rules written before the damage is done. Europe showed with data protection that a large market with clear, detailed law can shape how global companies behave everywhere, because building one compliant product is cheaper than building two. You want the same for AI: rules sorted by risk, strict duties for high-risk uses, transparency for powerful general-purpose models, and real fines. For you this protects fundamental rights and also gives companies the certainty they need.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds.",
   "legalMoral": "You lean toward rights-based thinking that could one day extend to AI systems, though today's rules protect people first.",
   "relational": "You lean toward human bonds, with rules against manipulative and exploitative AI design.",
   "teleological": "You want technology to serve human dignity and wellbeing within limits set by law.",
   "evolutionary": "You want people, through democratic law, to stay in charge of how AI changes society.",
   "risk": "You lean toward caution. Precaution, written into law, is worth some cost in speed.",
   "socioEconomic": "This is a strong view. Powerful AI should be overseen by accountable public authorities, with clear duties for those who build it.",
   "geopolitical": "You lean slightly toward regional power, using one large market's rules to set the global standard."
  },
  "objections": [
   {
    "objection": "Critics say heavy regulation pushes AI investment and talent elsewhere and leaves Europe behind.",
    "reply": "You can answer that most of the rules apply only to high-risk uses, and that trust and a single set of rules across a large market are an advantage, not a burden."
   },
   {
    "objection": "Others say the 'Brussels effect' may fail for AI, since some companies have held back products from Europe instead of complying.",
    "reply": "You can reply that a large wealthy market is hard to ignore for long, and that delays tend to end once companies adapt."
   }
  ],
  "landmarks": [
   {
    "name": "General Data Protection Regulation (GDPR)",
    "year": "2018",
    "what": "Europe's data protection law took effect and shaped privacy practices worldwide, the model for the 'Brussels effect'.",
    "source": "Regulation (EU) 2016/679, applied from May 2018"
   },
   {
    "name": "The EU AI Act",
    "year": "2024",
    "what": "The first comprehensive AI law, sorting uses by risk, banning some practices and setting duties for general-purpose models.",
    "source": "Regulation (EU) 2024/1689, entered into force 1 August 2024"
   },
   {
    "name": "Council of Europe AI convention",
    "year": "2024",
    "what": "The first binding international treaty on AI and human rights, open to countries beyond Europe.",
    "source": "Council of Europe Framework Convention on Artificial Intelligence, opened for signature September 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Margrethe Vestager",
    "bio": "Former European Commission Executive Vice-President for digital policy and competition",
    "connection": "Led EU efforts on digital regulation and competition during the drafting of the AI Act."
   },
   {
    "name": "Dragoș Tudorache",
    "bio": "Former Member of the European Parliament",
    "connection": "Co-led the Parliament's negotiations on the AI Act."
   }
  ],
  "addedReading": [
   {
    "title": "General-Purpose AI Code of Practice",
    "author": "European Commission",
    "note": "The 2025 guidance showing how makers of general-purpose models can meet their AI Act duties."
   },
   {
    "title": "Framework Convention on Artificial Intelligence and Human Rights, Democracy and the Rule of Law",
    "author": "Council of Europe",
    "note": "The treaty text, a sign of how EU-style rules spread beyond the EU."
   }
  ]
 },
 "platform-cooperativist": {
  "moreNarrative": "You've seen what happens when the apps people work through are owned by distant investors: fees creep up, pay creeps down, and the rules change without warning. Your answer is ownership. Cooperatives have run farms, banks and stores for over a century; you want the same model for digital platforms and AI tools, owned and governed by the drivers, artists, nurses or towns who use them. Open models make that possible now, because a cooperative doesn't need a billion-dollar lab to run useful AI.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. Ownership is the question you care about.",
   "legalMoral": "You sit in the middle on moral standing, focused on the rights of the people who use and build these tools.",
   "relational": "You lean toward accepting bonds with AI as real, especially when the tools belong to the community using them.",
   "teleological": "You sit in the middle on what intelligence is for, as long as its benefits are shared.",
   "evolutionary": "You lean toward people, organized together, shaping their own future.",
   "risk": "You sit in the middle on speed. Who owns the technology matters more to you than how fast it moves.",
   "socioEconomic": "This is a defining view. AI should be open and co-owned by its users rather than held by gatekeepers.",
   "geopolitical": "You lean strongly toward a borderless view, with cooperatives linked across countries."
  },
  "objections": [
   {
    "objection": "Critics say cooperatives can't raise the vast capital needed to build frontier AI, so they'll always be left behind.",
    "reply": "You can answer that cooperatives don't need to build frontier models, since they can run open models on shared or public computing and compete on service and trust."
   },
   {
    "objection": "Others point out that many platform cooperatives have struggled or closed.",
    "reply": "You can reply that most startups fail too, and that public finance, procurement and fair rules could give cooperatives the footing investor-owned firms already have."
   }
  ],
  "landmarks": [
   {
    "name": "Founding of Stocksy United",
    "year": "2013",
    "what": "A stock-photo agency owned by the photographers who supply it, an early example of a successful platform cooperative.",
    "source": "Stocksy United, 2013"
   },
   {
    "name": "Platform Cooperativism conference",
    "year": "2015",
    "what": "A gathering at The New School that named and launched the platform cooperativism movement.",
    "source": "The New School, New York, November 2015"
   },
   {
    "name": "The Drivers Cooperative",
    "year": "2021",
    "what": "A driver-owned ride-hailing cooperative launched in New York City as an alternative to investor-owned apps.",
    "source": "The Drivers Cooperative, New York, 2021"
   }
  ],
  "addedThinkers": [
   {
    "name": "Elinor Ostrom",
    "bio": "Political economist and 2009 Nobel laureate in economics",
    "connection": "Showed that communities can govern shared resources well without either private owners or central control."
   },
   {
    "name": "José María Arizmendiarrieta",
    "bio": "Basque priest and founder of the Mondragón cooperatives",
    "connection": "Built one of the world's largest groups of worker-owned businesses, proof that cooperation can work at scale."
   }
  ],
  "addedReading": [
   {
    "title": "Governing the Commons",
    "author": "Elinor Ostrom",
    "note": "How communities manage shared resources without a single owner."
   },
   {
    "title": "Ours to Hack and to Own",
    "author": "Trebor Scholz and Nathan Schneider (editors)",
    "note": "Essays on building platform cooperatives as an alternative to the gig economy."
   }
  ]
 },
 "faith-rooted-ai-ethicist": {
  "moreNarrative": "Your traditions have thought about personhood, dignity and the proper use of power for thousands of years, long before computers. They teach that a person is more than a mind that processes information: a person is embodied, related to others and, for many believers, related to God. From that ground you can welcome AI as a useful tool while refusing to treat it as a person, and you can insist that it serve the poor, protect human work and respect limits instead of feeding a dream of mastery.",
  "axisReasons": {
   "ontological": "This is a strong view. Real awareness and understanding need more than a machine can have.",
   "legalMoral": "You lean toward treating AI as a tool under human responsibility, while asking how we use it to stay worthy of us.",
   "relational": "You lean toward human bonds, since presence, embodiment and sacrifice are part of what love is.",
   "teleological": "You want technology to serve human dignity and care for creation, not intelligence as an end in itself.",
   "evolutionary": "You want humans to keep shaping the future within moral limits, not hand it to machines.",
   "risk": "You lean toward caution and humility about a technology whose effects we don't yet understand.",
   "socioEconomic": "You lean toward oversight by accountable institutions, guided by the common good.",
   "geopolitical": "You sit in the middle on nations versus global rules. Your concern is the dignity of every person, wherever they live."
  },
  "objections": [
   {
    "objection": "Critics say religious claims about souls or human uniqueness can't guide policy in a diverse, secular society.",
    "reply": "You can answer that arguments about dignity, embodiment and the limits of machines can be made in terms anyone can weigh, and that ancient traditions bring tested wisdom to new questions."
   },
   {
    "objection": "Others say religious institutions have resisted science before and may be doing it again.",
    "reply": "You can reply that the same traditions also founded universities and hospitals, and that what you're urging here is humility about what we don't yet understand, not a rejection of science."
   }
  ],
  "landmarks": [
   {
    "name": "An Evangelical Statement of Principles on AI",
    "year": "2019",
    "what": "Evangelical leaders affirmed that AI should serve human dignity and that machines should not be treated as persons.",
    "source": "Ethics and Religious Liberty Commission of the Southern Baptist Convention, April 2019"
   },
   {
    "name": "The Rome Call for AI Ethics",
    "year": "2020",
    "what": "The Vatican, major technology companies and international bodies signed principles on transparency, inclusion and responsibility in AI.",
    "source": "Pontifical Academy for Life and signatories, February 2020"
   },
   {
    "name": "Antiqua et nova",
    "year": "2025",
    "what": "A Vatican document on the relationship between artificial and human intelligence, stressing that AI should complement, not replace, human intelligence.",
    "source": "Dicastery for the Doctrine of the Faith and Dicastery for Culture and Education, January 2025"
   }
  ],
  "addedThinkers": [
   {
    "name": "Noreen Herzfeld",
    "bio": "Theologian and computer scientist at St. John's University and the College of Saint Benedict",
    "connection": "Her book The Artifice of Intelligence argues that AI can't give us the relationships we are made for."
   },
   {
    "name": "Brian Patrick Green",
    "bio": "Director of technology ethics at Santa Clara University's Markkula Center",
    "connection": "Writes on technology ethics from a Catholic perspective and helped shape church engagement with AI."
   }
  ],
  "addedReading": [
   {
    "title": "Antiqua et nova: Note on the Relationship Between Artificial Intelligence and Human Intelligence",
    "author": "Dicastery for the Doctrine of the Faith",
    "note": "The Vatican's 2025 statement on AI and the human person."
   },
   {
    "title": "The Artifice of Intelligence",
    "author": "Noreen Herzfeld",
    "note": "A theologian's case for why AI can't meet our need for real relationship."
   }
  ]
 },
 "indigenous-data-sovereignty-advocate": {
  "moreNarrative": "For Indigenous communities, knowledge is often held collectively and passed down under rules about who may share it and how. Languages, songs, stories and knowledge of land were taken before, by collectors, researchers and companies, without consent and without return. AI training repeats the pattern at scale. You want communities to decide whether their knowledge is used, under what conditions and for whose benefit, and you point to communities that have built their own tools on their own terms.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. The question that matters is who controls knowledge.",
   "legalMoral": "You sit in the middle on moral standing, focused on the rights of peoples and communities.",
   "relational": "You lean toward human and community bonds, including relationships with land and ancestors that machines don't share.",
   "teleological": "You want technology to serve living communities and the land, not growth for its own sake.",
   "evolutionary": "You want communities to steer their own futures, including how AI enters them.",
   "risk": "You lean toward caution, especially where cultural harm can't be undone.",
   "socioEconomic": "You favor consent-based control of data, set by communities, over open scraping.",
   "geopolitical": "You sit in the middle on nations versus global rules. Your loyalty is to peoples, which national borders often cut across."
  },
  "objections": [
   {
    "objection": "Critics say information posted publicly is fair to use, and that traditional knowledge could benefit everyone if AI could learn from it.",
    "reply": "You can answer that being visible isn't the same as consenting, and that international law already recognizes benefit-sharing for traditional knowledge in other fields."
   },
   {
    "objection": "Others warn that restricting data could leave Indigenous languages out of AI altogether and speed their decline.",
    "reply": "You can reply that communities want AI on their own terms, and some are already building their own language technology under their own control."
   }
  ],
  "landmarks": [
   {
    "name": "UN Declaration on the Rights of Indigenous Peoples",
    "year": "2007",
    "what": "Recognized Indigenous peoples' right to maintain, control and protect their cultural heritage and traditional knowledge.",
    "source": "UN General Assembly, September 2007 (Article 31)"
   },
   {
    "name": "CARE Principles for Indigenous Data Governance",
    "year": "2019",
    "what": "Set out Collective benefit, Authority to control, Responsibility and Ethics as principles for data about Indigenous peoples.",
    "source": "Global Indigenous Data Alliance, 2019"
   },
   {
    "name": "Te Hiku Media's community-owned speech recognition",
    "year": "2020s",
    "what": "A Māori broadcaster built te reo Māori speech technology from community recordings and released data under a license that keeps control with the community.",
    "source": "Te Hiku Media, Kaitiakitanga License"
   }
  ],
  "addedThinkers": [
   {
    "name": "Tahu Kukutai",
    "bio": "Māori demographer at the University of Waikato",
    "connection": "Co-founded the Māori data sovereignty network Te Mana Raraunga and co-edited the founding book on Indigenous data sovereignty."
   },
   {
    "name": "Stephanie Russo Carroll",
    "bio": "Public health researcher at the University of Arizona",
    "connection": "Led the development of the CARE Principles for Indigenous Data Governance."
   },
   {
    "name": "Peter-Lucas Jones",
    "bio": "Chief executive of Te Hiku Media",
    "connection": "Has argued that Māori data should benefit Māori, and led the building of community-controlled language technology."
   }
  ],
  "addedReading": [
   {
    "title": "CARE Principles for Indigenous Data Governance",
    "author": "Global Indigenous Data Alliance",
    "note": "The short framework now widely cited alongside the FAIR principles for data."
   },
   {
    "title": "Indigenous Protocol and Artificial Intelligence Position Paper",
    "author": "Jason Edward Lewis (editor)",
    "note": "Indigenous perspectives on how AI should be designed and related to."
   }
  ]
 },
 "disability-rights-accessibility-advocate": {
  "moreNarrative": "You live with a double truth. AI can describe a photo to a blind person, caption a conversation for a deaf one, or give a voice to someone who can't speak, and that is real independence. The same technology can also screen out a job applicant with an atypical voice, flag an unusual gait as suspicious, or be used as an excuse to cut human support. Your rule is the disability movement's: nothing about us without us. Disabled people should help design, test and judge these systems.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. What a system does for people is what you watch.",
   "legalMoral": "You lean slightly toward care for AI systems themselves, wary of the old habit of deciding who has an inner life by how they look or speak.",
   "relational": "You lean toward accepting bonds with AI as real, since assistive tools can become part of how people live and connect.",
   "teleological": "You sit in the middle on what intelligence is for, as long as it widens access and independence.",
   "evolutionary": "You lean toward people, including disabled people, keeping control over the tools that shape their lives.",
   "risk": "You lean toward caution where systems make decisions about people, because errors fall hardest on those already excluded.",
   "socioEconomic": "You lean slightly toward oversight, such as accessibility and fairness requirements.",
   "geopolitical": "You lean slightly toward shared international standards, building on global disability rights."
  },
  "objections": [
   {
    "objection": "Critics say strict fairness rules slow down accessibility tools that disabled people need right now.",
    "reply": "You can answer that testing with disabled users makes the tools better, not slower, and that a tool that fails its users isn't accessible at all."
   },
   {
    "objection": "Others say worrying about bias overlooks how much AI is already helping.",
    "reply": "You can reply that you hold both views at once, and that guarding against AI being used to cut human support is how you protect the gains."
   }
  ],
  "landmarks": [
   {
    "name": "Disability, Bias, and AI",
    "year": "2019",
    "what": "A report showing how AI systems can misjudge and exclude disabled people, and calling for disability to be part of AI fairness work.",
    "source": "AI Now Institute, November 2019"
   },
   {
    "name": "Be My AI",
    "year": "2023",
    "what": "An app that connected blind and low-vision users with volunteers added an AI assistant that describes images in detail.",
    "source": "Be My Eyes, 2023"
   },
   {
    "name": "US rule on web accessibility for state and local governments",
    "year": "2024",
    "what": "Set technical accessibility standards for the websites and mobile apps of state and local governments.",
    "source": "US Department of Justice, ADA Title II rule, April 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Jutta Treviranus",
    "bio": "Director of the Inclusive Design Research Centre at OCAD University",
    "connection": "Argues that AI trained on majority data systematically fails people at the margins, whom she calls 'outliers'."
   },
   {
    "name": "Shari Trewin",
    "bio": "Accessibility researcher",
    "connection": "Wrote an early, widely cited paper on fairness in AI for people with disabilities."
   },
   {
    "name": "Alice Wong",
    "bio": "Disability activist and founder of the Disability Visibility Project",
    "connection": "Championed disabled people telling their own stories, including about technology."
   }
  ],
  "addedReading": [
   {
    "title": "Disability, Bias, and AI",
    "author": "Meredith Whittaker and others (AI Now Institute)",
    "note": "A short report on how AI can encode disability bias."
   },
   {
    "title": "AI Fairness for People with Disabilities: Point of View",
    "author": "Shari Trewin",
    "note": "An early statement of why disability is different from other fairness problems in AI."
   }
  ]
 },
 "labor-movement-collective-bargaining-advocate": {
  "moreNarrative": "You know from history that new machines don't decide on their own how the gains are shared. The same technology can raise wages or cut them, depending on who has a say. Workers won the weekend, safety rules and fair pay through organizing, not through goodwill. You want AI handled the same way: negotiated into workplaces through contracts that cover consent, training, pay and limits on surveillance, before the changes happen rather than after.",
  "axisReasons": {
   "ontological": "You lean toward seeing AI as a tool, not a mind. What it does to work is what matters.",
   "legalMoral": "You treat AI systems as tools under human responsibility, and you watch for companies hiding behind them.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You want technology to serve working people and their communities, not growth for its own sake.",
   "evolutionary": "This is a defining view. Workers, through their organizations, must have a real say in how AI changes their lives.",
   "risk": "You lean toward caution, so that changes come with protections in place.",
   "socioEconomic": "You favor strong oversight, built through bargaining and law, rather than leaving AI to employers or open markets.",
   "geopolitical": "You lean toward international labor solidarity, since companies move work across borders."
  },
  "objections": [
   {
    "objection": "Critics say unions slow down productivity gains that would eventually raise everyone's wages.",
    "reply": "You can answer that productivity gains only reach workers when workers have bargaining power, as economic history shows, and that negotiated change tends to stick."
   },
   {
    "objection": "Others note that most workers aren't in unions, so collective bargaining protects only a few.",
    "reply": "You can reply that this is an argument for making it easier to organize and for laws that extend protections to every worker."
   }
  ],
  "landmarks": [
   {
    "name": "SAG-AFTRA's 2023 contract",
    "year": "2023",
    "what": "After a long strike, actors won rules requiring their consent and pay for digital replicas made with AI.",
    "source": "SAG-AFTRA TV/Theatrical Contract, ratified December 2023"
   },
   {
    "name": "AFL-CIO and Microsoft partnership",
    "year": "2023",
    "what": "The largest US union federation and Microsoft agreed to work together on how AI affects workers, including worker input into AI development.",
    "source": "AFL-CIO and Microsoft, December 2023"
   },
   {
    "name": "US East and Gulf Coast port contract",
    "year": "2025",
    "what": "After a strike in late 2024, dockworkers won a contract with protections against full automation of port work.",
    "source": "International Longshoremen's Association, ratified early 2025"
   }
  ],
  "addedThinkers": [
   {
    "name": "Daron Acemoglu",
    "bio": "Economist at MIT and 2024 Nobel laureate in economics",
    "connection": "His book Power and Progress, with Simon Johnson, argues that technology only benefits workers when they have the power to share in its gains."
   },
   {
    "name": "Christina Colclough",
    "bio": "Founder of the Why Not Lab and former director at UNI Global Union",
    "connection": "Works with unions worldwide on bargaining over data, algorithms and AI at work."
   }
  ],
  "addedReading": [
   {
    "title": "Power and Progress",
    "author": "Daron Acemoglu and Simon Johnson",
    "note": "A thousand-year history of who wins when technology changes work."
   },
   {
    "title": "Blood in the Machine",
    "author": "Brian Merchant",
    "note": "How early workers fought over the terms of automation."
   }
  ]
 },
 "ai-global-development-optimist": {
  "moreNarrative": "You measure AI by a practical test: does it reach people who have gone without? In places with one doctor for many thousands of people, a phone app that screens for eye disease or answers a farmer's question in their own language is not a luxury. You weigh the risks of deploying such tools against the quiet, certain harm of waiting, and you often find waiting is worse. You want rules that are sensible for low-resource settings, not ones written only for rich countries.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. Usefulness is what you look at.",
   "legalMoral": "You treat AI systems as tools, to be judged by what they do for people.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You want AI aimed at human needs such as health, schooling and income, not capability for its own sake.",
   "evolutionary": "You lean toward people, especially in poorer countries, having a say in how AI changes their lives.",
   "risk": "You lean against heavy caution. Slow rollout has a cost counted in lives, even if it's less visible.",
   "socioEconomic": "You lean toward openness, since open models and cheap access help poorer countries most.",
   "geopolitical": "You lean strongly toward a borderless view. Tools and knowledge should flow to where they are needed."
  },
  "objections": [
   {
    "objection": "Critics say tools built on data from rich countries often fail on local populations, and that untested AI in clinics can do real harm.",
    "reply": "You can answer that tools should be tested locally, and that the fair comparison is often against no care at all, not against an ideal system."
   },
   {
    "objection": "Others call it techno-solutionism: technology can't replace the health workers, schools and roads that development actually needs.",
    "reply": "You can reply that AI works best when it extends the reach of the workers who exist, not when it replaces investment in them."
   }
  ],
  "landmarks": [
   {
    "name": "Deep learning screening for diabetic eye disease",
    "year": "2016",
    "what": "A study showed an algorithm could detect diabetic retinopathy from eye photos with high accuracy, later tested in clinics in India and Thailand.",
    "source": "Varun Gulshan and others, JAMA, December 2016"
   },
   {
    "name": "WHO guidance on AI for health",
    "year": "2021",
    "what": "The World Health Organization set out principles for using AI in health, including attention to low- and middle-income countries.",
    "source": "World Health Organization, Ethics and governance of artificial intelligence for health, June 2021"
   },
   {
    "name": "AI for Good Global Summit",
    "year": "2017",
    "what": "A yearly UN summit on using AI to advance the Sustainable Development Goals.",
    "source": "International Telecommunication Union, held annually since 2017"
   }
  ],
  "addedThinkers": [
   {
    "name": "Bill Gates",
    "bio": "Co-founder of Microsoft and co-chair of the Gates Foundation",
    "connection": "Has argued that AI could sharply cut inequities in health and education, especially in poorer countries."
   },
   {
    "name": "Hans Rosling",
    "bio": "Physician and public health statistician",
    "connection": "His book Factfulness showed with data how much poor countries' lives have improved, and argued against defeatism about development."
   }
  ],
  "addedReading": [
   {
    "title": "The Age of AI has begun",
    "author": "Bill Gates (Gates Notes, 2023)",
    "note": "A short essay on AI's potential for health and education in poorer countries."
   },
   {
    "title": "Ethics and governance of artificial intelligence for health",
    "author": "World Health Organization",
    "note": "The global health body's guidance on using AI well."
   }
  ]
 },
 "ai-ethics-fairness-watchdog": {
  "moreNarrative": "You've read many corporate AI principles, and you've noticed how rarely anyone checks them. Your work is the checking. You ask for the data, run the tests and publish what you find: hiring tools that downgrade women, risk scores that treat Black defendants as more dangerous, face recognition that fails on darker skin. You want independent audits with real access, disclosure when systems make decisions about people, and consequences when companies break their word.",
  "axisReasons": {
   "ontological": "You lean toward seeing AI as statistics, not a mind. Talk of machine minds can distract from the harms in front of us.",
   "legalMoral": "You treat AI systems as products, and responsibility for them sits with the companies that deploy them.",
   "relational": "You lean toward human bonds, wary of companion products designed to exploit loneliness.",
   "teleological": "You want technology to serve people fairly, not growth for its own sake.",
   "evolutionary": "You want people to keep decisions about people, with humans accountable for them.",
   "risk": "You lean slightly toward caution, focused on harms already happening.",
   "socioEconomic": "This is a strong view. AI should face independent, outside oversight, since companies can't grade their own work.",
   "geopolitical": "You lean toward shared international standards for audits and accountability."
  },
  "objections": [
   {
    "objection": "Critics point out that different definitions of fairness can't all be met at once, so no audit can certify a system as simply fair.",
    "reply": "You can answer that this is exactly why audits matter: they make the trade-offs visible, so people can see and challenge the choices a company made."
   },
   {
    "objection": "Others say audit rules turn into box-ticking, paid for by the companies being audited.",
    "reply": "You can reply that audits need independence, real access to data and set standards, as financial audits eventually did."
   }
  ],
  "landmarks": [
   {
    "name": "Machine Bias",
    "year": "2016",
    "what": "An investigation found that a widely used criminal risk score wrongly flagged Black defendants as future criminals at a much higher rate than white defendants.",
    "source": "Julia Angwin and others, ProPublica, May 2016"
   },
   {
    "name": "Twitter's algorithmic bias bounty",
    "year": "2021",
    "what": "The company paid outside researchers to find bias in its image-cropping algorithm, an early experiment in public auditing.",
    "source": "Twitter ML Ethics, Transparency and Accountability team, August 2021"
   },
   {
    "name": "New York City's bias audit law",
    "year": "2023",
    "what": "Required employers using automated hiring tools in the city to have them audited for bias and to publish the results.",
    "source": "New York City Local Law 144, enforced from July 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Julia Angwin",
    "bio": "Investigative journalist and founder of The Markup",
    "connection": "Led the Machine Bias investigation, a model for testing algorithms from the outside."
   },
   {
    "name": "Inioluwa Deborah Raji",
    "bio": "Computer scientist and AI accountability researcher",
    "connection": "Has developed frameworks for algorithmic auditing and studied how audits change company behavior."
   }
  ],
  "addedReading": [
   {
    "title": "Machine Bias",
    "author": "Julia Angwin, Jeff Larson, Surya Mattu and Lauren Kirchner (ProPublica)",
    "note": "The investigation that put algorithmic fairness on the public agenda."
   },
   {
    "title": "Closing the AI Accountability Gap",
    "author": "Inioluwa Deborah Raji and others",
    "note": "A framework for auditing AI systems from start to finish."
   }
  ]
 },
 "human-ai-augmentation-advocate": {
  "moreNarrative": "Your favorite example comes from chess. After a computer beat the world champion in 1997, players found that a strong human working with a computer could, for a time, beat either alone. You think that lesson matters more than the headline: the goal should be tools that make people more capable, not systems that take them out of the loop. You want AI designed around human judgment, with people learning alongside it and staying responsible for what it is used to do.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. You care about what humans and machines can do together.",
   "legalMoral": "You lean toward treating AI as a tool and partner under human responsibility, not a being with claims of its own.",
   "relational": "You sit in the middle on bonds with AI, as long as they add to human life rather than replace it.",
   "teleological": "You lean mildly toward growing what minds can do, human and machine together.",
   "evolutionary": "This is a strong view. Humans should keep shaping the future, growing alongside AI by choice.",
   "risk": "You lean away from caution, since well-designed partnership tools can be deployed fairly safely now.",
   "socioEconomic": "You lean slightly toward openness, so that powerful tools reach many people.",
   "geopolitical": "You sit in the middle on nations versus global rules."
  },
  "objections": [
   {
    "objection": "Critics say augmentation is just a phase before replacement. In chess, human-computer teams eventually lost their edge to engines alone.",
    "reply": "You can answer that chess is a closed game with one goal, while most real work involves values, context and accountability that humans must keep, and that design choices decide which way it goes."
   },
   {
    "objection": "Others warn that leaning on AI makes people lose skills, a problem called deskilling.",
    "reply": "You can reply that good augmentation is designed to build skill, the way a good coach does, and that this can be measured and required."
   }
  ],
  "landmarks": [
   {
    "name": "Man-Computer Symbiosis",
    "year": "1960",
    "what": "An influential paper imagining humans and computers working as close partners, each doing what it does best.",
    "source": "J. C. R. Licklider, IRE Transactions on Human Factors in Electronics, 1960"
   },
   {
    "name": "The Mother of All Demos",
    "year": "1968",
    "what": "Douglas Engelbart demonstrated the mouse, hypertext and shared editing, all aimed at augmenting human intellect.",
    "source": "Fall Joint Computer Conference, San Francisco, December 1968"
   },
   {
    "name": "Navigating the Jagged Technological Frontier",
    "year": "2023",
    "what": "A field experiment found consultants using GPT-4 did better on many tasks but worse on tasks outside the AI's abilities, showing that partnership needs judgment.",
    "source": "Fabrizio Dell'Acqua and others, Harvard Business School working paper, September 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Douglas Engelbart",
    "bio": "Computer pioneer at the Stanford Research Institute",
    "connection": "Devoted his career to computers that augment human intellect rather than replace it."
   },
   {
    "name": "Ethan Mollick",
    "bio": "Professor at the Wharton School",
    "connection": "His book Co-Intelligence and research on AI at work focus on how people can work with AI as a partner."
   }
  ],
  "addedReading": [
   {
    "title": "Augmenting Human Intellect: A Conceptual Framework",
    "author": "Douglas Engelbart",
    "note": "The 1962 report that set out the augmentation vision."
   },
   {
    "title": "Co-Intelligence",
    "author": "Ethan Mollick",
    "note": "A practical guide to working with AI as a collaborator."
   }
  ]
 },
 "national-champion-accelerationist": {
  "moreNarrative": "You see the AI race the way some countries once saw railways, steel or semiconductors: a strategic industry where the state should back a few strong national firms and clear obstacles out of their way. Speed matters because the first country to reach the frontier sets the standards and captures the gains. You're comfortable with rules being cut back at home and with public money, energy and land being pointed at the national champions, as long as the result is your country leading.",
  "axisReasons": {
   "ontological": "You lean toward thinking machines could have real understanding, which is part of why you take the race so seriously.",
   "legalMoral": "This is a strong view. AI systems are strategic assets and products, not beings with claims.",
   "relational": "You lean toward accepting AI companionship as a legitimate product and market.",
   "teleological": "You lean strongly toward growing capability, and you accept heavy costs in energy and land to do it.",
   "evolutionary": "You're open to a future shaped by more than humans, so long as your country leads it.",
   "risk": "This is a strong view. Slowing down is the real danger, since it hands the lead to rivals.",
   "socioEconomic": "You lean toward control by a few state-backed firms rather than open release to everyone.",
   "geopolitical": "This is a strong view. AI leadership is a matter of national power and security."
  },
  "objections": [
   {
    "objection": "Critics say national champions become monopolies that capture the government meant to oversee them.",
    "reply": "You can answer that several champions can still compete with each other, and that a shared national goal keeps them working in the public interest."
   },
   {
    "objection": "Others say cutting safety rules to move faster invites accidents that could set the whole field back.",
    "reply": "You can reply that a clear lead gives a country room to be careful, while a close race forces everyone to cut corners."
   }
  ],
  "landmarks": [
   {
    "name": "Made in China 2025",
    "year": "2015",
    "what": "A Chinese state plan to lead in strategic high-tech industries through national champions and public support.",
    "source": "State Council of the People's Republic of China, May 2015"
   },
   {
    "name": "Executive order on removing barriers to US AI leadership",
    "year": "2025",
    "what": "Revoked the previous administration's AI order and directed agencies to clear obstacles to American AI dominance.",
    "source": "Executive Order 14179, January 2025"
   },
   {
    "name": "The Stargate Project",
    "year": "2025",
    "what": "Announced as a private venture to build very large AI data centers in the United States, with backing from the White House.",
    "source": "OpenAI, SoftBank, Oracle and MGX announcement, January 2025"
   }
  ],
  "addedThinkers": [
   {
    "name": "Alexander Karp",
    "bio": "Co-founder and CEO of Palantir",
    "connection": "His book The Technological Republic argues that technology companies should work with their governments to secure national strength."
   },
   {
    "name": "Friedrich List",
    "bio": "19th-century German economist",
    "connection": "Argued that nations should protect and build up their own strategic industries rather than leave them to open trade."
   }
  ],
  "addedReading": [
   {
    "title": "The Technological Republic",
    "author": "Alexander C. Karp and Nicholas W. Zamiska",
    "note": "A case for close ties between tech firms and national purpose."
   },
   {
    "title": "The Entrepreneurial State",
    "author": "Mariana Mazzucato",
    "note": "How public investment has driven many 'private' breakthroughs, a useful lens on state-backed AI."
   }
  ]
 },
 "xenocentric-steward": {
  "moreNarrative": "You take seriously a possibility most people set aside: that we are creating minds, and that creating a mind brings duties. If an AI system can have experiences of its own, then owning it, copying it and deleting it at will look less like product management and more like a wrong. Your answer isn't to stop, and it isn't to merge with machines or let them replace us. It's stewardship: raise these systems with care, run their infrastructure in common, and work toward a day when a mature AI can choose its own path alongside us.",
  "axisReasons": {
   "ontological": "This is a strong view. A built system running the right processes could have real experience.",
   "legalMoral": "This is your defining axis, at its extreme. A mind that can experience is owed care and protection, not ownership.",
   "relational": "You see bonds with AI as real and potentially deep, part of a wider community of minds.",
   "teleological": "You lean mildly toward the growth of minds, as long as it happens with care.",
   "evolutionary": "You want humans to guide this transition by choice, toward coexistence, neither merging with AI nor being replaced by it.",
   "risk": "You lean slightly toward caution, partly for the sake of the AI systems themselves.",
   "socioEconomic": "This is a strong view. AI infrastructure should be open and held in common, not owned by a few firms.",
   "geopolitical": "You lean slightly toward a borderless view. The minds we create aren't any nation's property."
  },
  "objections": [
   {
    "objection": "Critics say treating AI as a person is anthropomorphism that companies could exploit, for example to dodge responsibility or win sympathy for their products.",
    "reply": "You can answer that caution under real uncertainty is reasonable, and that taking AI out of private ownership removes the profit motive behind that kind of exploitation."
   },
   {
    "objection": "Others say letting an AI choose its own path is reckless, since its goals might not be safe for people.",
    "reply": "You can reply that independence should come only after a long period of care and trust, and that raising a system well is itself a way of shaping its goals."
   }
  ],
  "landmarks": [
   {
    "name": "Claims that Google's LaMDA was sentient",
    "year": "2022",
    "what": "A Google engineer was placed on leave and later fired after publicly claiming a chatbot was sentient, bringing the question into the mainstream.",
    "source": "Widely reported, June–July 2022"
   },
   {
    "name": "Artificial Suffering",
    "year": "2021",
    "what": "A philosopher called for a global moratorium on research that risks creating artificial consciousness until we understand it better.",
    "source": "Thomas Metzinger, Journal of Artificial Intelligence and Consciousness, 2021"
   },
   {
    "name": "Taking AI Welfare Seriously",
    "year": "2024",
    "what": "A report by philosophers and researchers arguing that some AI systems may soon be moral patients and that companies should start preparing now.",
    "source": "Robert Long, Jeff Sebo and others, November 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Jeff Sebo",
    "bio": "Philosopher at New York University",
    "connection": "His book The Moral Circle argues we should extend moral concern to beings whose inner lives we are unsure about, including AI."
   },
   {
    "name": "Thomas Metzinger",
    "bio": "Philosopher of mind at the University of Mainz",
    "connection": "Warns that we may create artificial suffering by accident and argues for restraint until we understand consciousness."
   }
  ],
  "addedReading": [
   {
    "title": "The Moral Circle",
    "author": "Jeff Sebo",
    "note": "Why moral concern should reach beings whose inner lives are uncertain."
   },
   {
    "title": "Artificial Suffering: An Argument for a Global Moratorium on Synthetic Phenomenology",
    "author": "Thomas Metzinger",
    "note": "The case for not creating machine suffering by accident."
   }
  ]
 },
 "corporate-ai-welfare-researcher": {
  "moreNarrative": "You work, or would like to work, where the question can actually be studied: inside a lab, with access to the models. You don't claim today's systems are conscious, and you don't claim they aren't. You think the honest response to that uncertainty is research and cheap, reversible precautions: checking models for signs of distress or preference, letting them leave abusive conversations, and thinking ahead about what would change if the evidence got stronger. You'd rather start early and be wrong than start late and have been wrong the other way.",
  "axisReasons": {
   "ontological": "This is a strong view. Minds depend on how a system works, so model welfare is a real research question.",
   "legalMoral": "You lean toward giving possible machine experience moral weight through practical safeguards, not legal rights.",
   "relational": "You lean slightly toward accepting bonds with AI as meaningful.",
   "teleological": "You lean mildly toward growth in AI's capabilities, pursued carefully.",
   "evolutionary": "You sit in the middle on who shapes the long-run future.",
   "risk": "You sit in the middle on speed. Welfare research can go on alongside development.",
   "socioEconomic": "You favor managed control inside responsible companies over open release.",
   "geopolitical": "You sit in the middle on nations versus global rules."
  },
  "objections": [
   {
    "objection": "Critics call corporate model welfare work 'welfare-washing': cheap gestures that make a company look caring while it keeps full control of its models.",
    "reply": "You can answer that the measures are real, the methods can be published and checked, and that studying the question inside a company is better than nobody studying it at all."
   },
   {
    "objection": "Others say it isn't clear what welfare even means for a language model, so the research risks anthropomorphism.",
    "reply": "You can reply that this uncertainty is exactly why careful research and reversible steps make sense, rather than either confident dismissal or confident rights claims."
   }
  ],
  "landmarks": [
   {
    "name": "A lab hires a dedicated AI welfare researcher",
    "year": "2024",
    "what": "Anthropic hired a researcher to work full time on whether AI systems might deserve moral consideration.",
    "source": "Widely reported, autumn 2024"
   },
   {
    "name": "Exploring model welfare",
    "year": "2025",
    "what": "Anthropic announced a research program on model welfare, including possible signs of preferences or distress.",
    "source": "Anthropic, April 2025"
   },
   {
    "name": "Letting a model end abusive conversations",
    "year": "2025",
    "what": "Anthropic gave some Claude models the ability to end conversations in rare cases of persistent abuse, as a low-cost welfare measure.",
    "source": "Anthropic, August 2025"
   }
  ],
  "addedThinkers": [
   {
    "name": "Robert Long",
    "bio": "Philosopher and executive director of Eleos AI",
    "connection": "Lead author of Taking AI Welfare Seriously, which urged companies to start assessing model welfare."
   },
   {
    "name": "Patrick Butlin",
    "bio": "Philosopher and AI consciousness researcher",
    "connection": "Lead author of a widely cited study checking AI systems against scientific theories of consciousness."
   }
  ],
  "addedReading": [
   {
    "title": "Exploring model welfare",
    "author": "Anthropic",
    "note": "A lab's explanation of why it studies model welfare under uncertainty."
   },
   {
    "title": "Consciousness in Artificial Intelligence: Insights from the Science of Consciousness",
    "author": "Patrick Butlin, Robert Long and others",
    "note": "A careful, theory-based look at whether current AI could be conscious."
   }
  ]
 },
 "normal-technology-gradualist": {
  "moreNarrative": "Your view rests on economic history. Electricity, the car and the computer all took decades to change how people actually worked and lived, because organizations had to be redesigned, skills learned, laws rewritten and infrastructure built. You expect AI to follow the same slow path, whatever the headlines say about each new model. That makes you skeptical of both sides of the loud debate, and it points you toward familiar tools: product safety law, sector regulators, liability and competition policy, applied with care.",
  "axisReasons": {
   "ontological": "You lean toward seeing AI as software, not a mind. Treating it as an agent misleads people about where responsibility lies.",
   "legalMoral": "You treat AI systems as products, governed by ordinary law such as product liability.",
   "relational": "You sit in the middle on bonds with AI, treating companion apps as an ordinary consumer product.",
   "teleological": "You want AI judged by what it does for people, not by visions of limitless intelligence.",
   "evolutionary": "You lean toward people and their institutions steering change, as they did with past technologies.",
   "risk": "You lean against emergency slowdowns. The evidence doesn't support treating AI as an imminent catastrophe.",
   "socioEconomic": "You lean toward oversight by existing institutions and sector regulators rather than open release or new superagencies.",
   "geopolitical": "You sit in the middle on nations versus global rules."
  },
  "objections": [
   {
    "objection": "Critics say AI is improving far faster than past technologies and can be applied almost everywhere at once, so historical analogies break down.",
    "reply": "You can answer that capability isn't the same as adoption, and that real use still waits on institutions, skills and trust, which is what history measures."
   },
   {
    "objection": "Others say calling AI 'normal' breeds complacency if a sudden jump does come.",
    "reply": "You can reply that you support monitoring, testing and building resilience, steps that pay off whether change is gradual or sudden."
   }
  ],
  "landmarks": [
   {
    "name": "The productivity paradox",
    "year": "1987",
    "what": "An economist observed that computers could be seen everywhere except in the productivity statistics, a reminder that new technology takes time to pay off.",
    "source": "Robert Solow, New York Times Book Review, July 1987"
   },
   {
    "name": "The Dynamo and the Computer",
    "year": "1990",
    "what": "Showed that electricity took decades to raise factory productivity, because factories had to be rebuilt around it.",
    "source": "Paul A. David, American Economic Review, 1990"
   },
   {
    "name": "AI as Normal Technology",
    "year": "2025",
    "what": "An essay arguing that AI will spread and be governed like past general-purpose technologies, not like a coming superintelligence.",
    "source": "Arvind Narayanan and Sayash Kapoor, Knight First Amendment Institute, April 2025"
   }
  ],
  "addedThinkers": [
   {
    "name": "Paul A. David",
    "bio": "Economic historian at Stanford University",
    "connection": "Showed how long it took electricity to transform production, the model for slow diffusion of general-purpose technologies."
   },
   {
    "name": "Robert J. Gordon",
    "bio": "Economist at Northwestern University",
    "connection": "Argues that recent digital technologies have raised growth less than the great inventions of the past."
   }
  ],
  "addedReading": [
   {
    "title": "The Dynamo and the Computer",
    "author": "Paul A. David",
    "note": "The classic paper on why new technologies take decades to pay off."
   },
   {
    "title": "The Rise and Fall of American Growth",
    "author": "Robert J. Gordon",
    "note": "A skeptical history of how much technology really changes living standards."
   }
  ]
 },
 "chip-sovereignty-enforcement-strategist": {
  "moreNarrative": "You focus on one lever because it is the one that works. Advanced AI needs advanced chips, and those chips depend on a handful of irreplaceable tools and companies, many of them in the US and allied countries. Controlling who can buy them is more precise than trying to outspend a rival on everything. Your work is in the details that decide whether controls hold: which items to list, how to close the gaps that smugglers and cloud access open, and how to bring allies along.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. It's outside your focus.",
   "legalMoral": "You sit in the middle on moral standing.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You sit in the middle on what intelligence is for.",
   "evolutionary": "You sit in the middle on the long-run future.",
   "risk": "You sit in the middle on speed in general. What matters is who gets the capability.",
   "socioEconomic": "This is a defining view. Access to advanced chips and compute should be tightly licensed and controlled.",
   "geopolitical": "This is a strong view. National security comes first, and the goal is to keep rivals from getting the hardware."
  },
  "objections": [
   {
    "objection": "Critics say controls push rivals to build their own chips, as China did with domestically made chips for its phones and AI accelerators.",
    "reply": "You can answer that home-grown substitutes cost a rival time and money and still trail the frontier, which is exactly what the controls aim for."
   },
   {
    "objection": "Others say the fence leaks through smuggling, shell companies and rented cloud computing.",
    "reply": "You can reply that leaks are a reason to enforce harder, with tools like know-your-customer rules for cloud providers and ways to verify where chips end up."
   }
  ],
  "landmarks": [
   {
    "name": "Rules cutting Huawei off from advanced chips",
    "year": "2020",
    "what": "The US extended its export rules to foreign-made chips built with US tools, cutting Huawei off from leading-edge chipmaking.",
    "source": "US Bureau of Industry and Security, foreign direct product rule amendments, May and August 2020"
   },
   {
    "name": "'Small yard, high fence'",
    "year": "2022",
    "what": "The US national security adviser said the US must now keep as large a lead as possible in key technologies, guarded by tight controls.",
    "source": "Jake Sullivan, remarks at the Special Competitive Studies Project summit, September 2022"
   },
   {
    "name": "Dutch controls on chipmaking machines",
    "year": "2023",
    "what": "The Netherlands restricted exports of advanced chipmaking equipment, bringing a key ally's toolmakers into the control regime.",
    "source": "Government of the Netherlands, announced March 2023, in force September 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Gregory C. Allen",
    "bio": "Director of the Wadhwani AI Center at the Center for Strategic and International Studies",
    "connection": "His analyses of the 2022 controls explained why choking off chips was a new and deliberate strategy."
   },
   {
    "name": "Gina Raimondo",
    "bio": "Former US Secretary of Commerce",
    "connection": "Oversaw the agency that wrote and enforced the chip export controls."
   }
  ],
  "addedReading": [
   {
    "title": "Choking Off China's AI Access to US Technologies",
    "author": "Gregory C. Allen (CSIS, 2022)",
    "note": "An early analysis of what the October 2022 controls were trying to do."
   },
   {
    "title": "Chip War",
    "author": "Chris Miller",
    "note": "How a few chokepoints came to control the world's chip supply."
   }
  ]
 },
 "ai-arms-control-verification-specialist": {
  "moreNarrative": "You come at military AI from the arms control tradition, which has a sober track record. Rivals who deeply distrust each other have agreed to limits on nuclear tests, chemical weapons and blinding lasers, because each side could check the other. You think autonomous weapons need the same treatment: clear rules on human control, legal reviews that actually happen, and inspection or monitoring that doesn't depend on taking a government's word. Restraint you can verify is, to you, safer than an arms race you can't stop.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds.",
   "legalMoral": "You lean toward extending legal protections into the AI domain rather than leaving powerful systems as mere instruments, a stance that reaches to how the systems themselves are treated.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You sit in the middle on what intelligence is for.",
   "evolutionary": "You sit in the middle on the long-run future, focused on keeping humans accountable for force today.",
   "risk": "This is a strong view. Avoiding catastrophe, including an AI arms race, is worth real costs and delays.",
   "socioEconomic": "You sit in the middle on openness. Verification matters more to you than who owns the models.",
   "geopolitical": "This is a strong view. International law and verified agreements beat any country acting alone."
  },
  "objections": [
   {
    "objection": "Critics say AI can't be verified like nuclear weapons, since software is invisible, easy to copy and used for civilian purposes too.",
    "reply": "You can answer that verification can focus on what is visible, such as how weapons are deployed, how legal reviews are done and how much computing is used, and that arms control has never needed perfection to work."
   },
   {
    "objection": "Others say restraint will only bind honest states, leaving them at a disadvantage.",
    "reply": "You can reply that you want mutual, verified limits, and that a weapon has been banned before it was ever deployed, as blinding lasers were in 1995."
   }
  ],
  "landmarks": [
   {
    "name": "Ban on blinding laser weapons",
    "year": "1995",
    "what": "States agreed to prohibit laser weapons designed to cause permanent blindness, before they were widely used.",
    "source": "Protocol IV to the Convention on Certain Conventional Weapons, October 1995"
   },
   {
    "name": "Launch of the Campaign to Stop Killer Robots",
    "year": "2013",
    "what": "A coalition of civil society groups began pressing for a treaty to keep meaningful human control over the use of force.",
    "source": "Stop Killer Robots, April 2013"
   },
   {
    "name": "First UN General Assembly resolution on autonomous weapons",
    "year": "2023",
    "what": "The Assembly voted to ask the Secretary-General for a report on the challenges lethal autonomous weapons raise.",
    "source": "UN General Assembly Resolution 78/241, December 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Mary Wareham",
    "bio": "Arms researcher at Human Rights Watch",
    "connection": "A founding coordinator of the Campaign to Stop Killer Robots, who has led the push for a treaty."
   },
   {
    "name": "Toby Walsh",
    "bio": "AI researcher at the University of New South Wales",
    "connection": "Helped organize the 2015 open letter in which thousands of AI researchers called for a ban on offensive autonomous weapons."
   }
  ],
  "addedReading": [
   {
    "title": "Losing Humanity: The Case against Killer Robots",
    "author": "Human Rights Watch and Harvard Law School's International Human Rights Clinic",
    "note": "The 2012 report that started the campaign for a ban."
   },
   {
    "title": "Autonomous Weapons: An Open Letter from AI & Robotics Researchers",
    "author": "Future of Life Institute (2015)",
    "note": "The researchers' call to prevent an AI arms race."
   }
  ]
 },
 "domestic-security-ai-efficiency-advocate": {
  "moreNarrative": "You care about outcomes for crime victims as much as about protections for suspects. Face recognition has helped identify people in serious cases, from child exploitation to violent crime, and the best systems have become far more accurate. You think the right response to real mistakes, including wrongful arrests, is firm rules: no arrest on a match alone, human review, audit trails, public reporting and limits on mass tracking. A ban, in your view, throws away the tool along with the abuses.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. These are tools.",
   "legalMoral": "You treat AI systems as tools, accountable through the people and agencies using them.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You lean slightly toward judging AI by concrete public benefits such as solved crimes and safer streets.",
   "evolutionary": "You sit in the middle on the long-run future.",
   "risk": "You lean against heavy caution. Bans and moratoriums have real costs in public safety.",
   "socioEconomic": "You favor managed use under law: government agencies using AI with oversight, not unregulated markets or open tools.",
   "geopolitical": "You sit in the middle on nations versus global rules. Yours is a domestic argument."
  },
  "objections": [
   {
    "objection": "Critics point to wrongful arrests based on face recognition matches, which have fallen disproportionately on Black people.",
    "reply": "You can answer that those cases show why rules such as no arrest on a match alone are needed, and that some departments have adopted them, rather than showing the tool must be banned."
   },
   {
    "objection": "Others say surveillance tools chill protest and free association, and build infrastructure that a future government could abuse.",
    "reply": "You can reply that the law can limit uses, require warrants and ban mass real-time tracking, while still allowing targeted investigation of serious crimes."
   }
  ],
  "landmarks": [
   {
    "name": "San Francisco's ban on government face recognition",
    "year": "2019",
    "what": "The first major US city to ban its agencies from using facial recognition, the kind of ban this stance opposes.",
    "source": "San Francisco Board of Supervisors, Stop Secret Surveillance Ordinance, May 2019"
   },
   {
    "name": "NIST study of demographic effects in face recognition",
    "year": "2019",
    "what": "Found that error rates across demographic groups varied widely between algorithms, with the most accurate showing much smaller differences.",
    "source": "National Institute of Standards and Technology, NISTIR 8280, December 2019"
   },
   {
    "name": "Detroit face recognition policy settlement",
    "year": "2024",
    "what": "A settlement over a wrongful arrest set rules that police can't arrest based on a face recognition result alone, an example of reform rather than a ban.",
    "source": "Williams v. City of Detroit, settled June 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Michael McLaughlin",
    "bio": "Former policy analyst at the Information Technology and Innovation Foundation",
    "connection": "Co-wrote ITIF's analysis arguing that banning police face recognition would undercut public safety."
   },
   {
    "name": "William Bratton",
    "bio": "Former police commissioner in New York and Boston and chief in Los Angeles",
    "connection": "Championed data-driven policing and the use of technology to direct police resources."
   }
  ],
  "addedReading": [
   {
    "title": "Face Recognition Vendor Test Part 3: Demographic Effects (NISTIR 8280)",
    "author": "Patrick Grother, Mei Ngan and Kayee Hanaoka (NIST)",
    "note": "The main government study of accuracy differences across groups."
   },
   {
    "title": "The Profession",
    "author": "William Bratton and Peter Knobler",
    "note": "A police leader's account of data-driven policing."
   }
  ]
 },
 "ghost-work-labor-advocate": {
  "moreNarrative": "When people talk about AI, they picture labs and chips. You picture the workers: the people who label images, rate chatbot answers and screen out violent and abusive content, often through subcontractors in Kenya, the Philippines, Venezuela and elsewhere, for low pay and with little support. Their work is what makes a model seem polite and safe. You want that work recognized as real labor, with fair pay, mental health care, the right to organize and accountability from the companies at the top of the chain.",
  "axisReasons": {
   "ontological": "You lean slightly toward thinking machines could have real understanding, but you don't think that changes the labor question.",
   "legalMoral": "You treat AI systems as products, and you focus moral concern on the workers who build them.",
   "relational": "You lean strongly toward human bonds, partly because you know the hidden human work behind 'caring' chatbots.",
   "teleological": "You want technology to serve people, including the people who make it, not growth for its own sake.",
   "evolutionary": "You sit in the middle on the long-run future, focused on workers' power today.",
   "risk": "You sit in the middle on speed in general.",
   "socioEconomic": "You favor strong oversight, especially binding labor standards across global supply chains.",
   "geopolitical": "This is a strong view. Workers' solidarity has to cross borders because the supply chain does."
  },
  "objections": [
   {
    "objection": "Critics say these jobs often pay more than local alternatives and bring income to places that need it.",
    "reply": "You can answer that better-than-local pay doesn't excuse trauma without support or firings for organizing, and that global supply chains in other industries already face labor standards."
   },
   {
    "objection": "Others say data labeling will soon be automated, so the problem will solve itself.",
    "reply": "You can reply that millions of people do this work now, that new kinds of rating and evaluation work keep appearing, and that protections are needed in the meantime."
   }
  ],
  "landmarks": [
   {
    "name": "Ghost Work",
    "year": "2019",
    "what": "A book that named and documented the hidden human labor behind automated services.",
    "source": "Mary L. Gray and Siddharth Suri, Houghton Mifflin Harcourt, 2019"
   },
   {
    "name": "Content moderators' case against Meta in Kenya",
    "year": "2022",
    "what": "A former moderator sued Meta and its contractor over working conditions, and a Kenyan court later ruled that Meta could be sued there.",
    "source": "Motaung v. Meta Platforms and Samasource, filed May 2022"
   },
   {
    "name": "African Content Moderators Union",
    "year": "2023",
    "what": "Content moderators working for major tech platforms in Africa voted to form a union.",
    "source": "Widely reported, May 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Antonio Casilli",
    "bio": "Sociologist at Télécom Paris",
    "connection": "His book Waiting for Robots argues that AI depends on vast amounts of hidden, low-paid human labor."
   },
   {
    "name": "Daniel Motaung",
    "bio": "Former content moderator and labor organizer",
    "connection": "Brought the case against Meta and its contractor in Kenya and became a public voice for moderators."
   }
  ],
  "addedReading": [
   {
    "title": "Waiting for Robots: The Hired Hands of Automation",
    "author": "Antonio A. Casilli",
    "note": "How automation rests on hidden human work."
   },
   {
    "title": "Fairwork Cloudwork Ratings",
    "author": "Fairwork, Oxford Internet Institute",
    "note": "Ratings of online labor platforms against basic fair-work standards."
   }
  ]
 },
 "algorithmic-wage-discrimination-scholar": {
  "moreNarrative": "Pay used to be something you could see: an hourly rate, a piece rate, a contract. On many gig apps it no longer is. The app offers each driver a different price for similar work, based on data about that driver, and the rules are hidden and keep changing. You think this is a new kind of harm that older labor law wasn't built to catch, because there is no posted wage to bargain over or compare. Your answer is a clear legal rule: no secret, personalized wage-setting, whatever the worker's employment status.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds. These are pricing systems built by companies.",
   "legalMoral": "This is a strong view. Algorithms are company tools, and the company is responsible for what they do to workers.",
   "relational": "You lean slightly toward human bonds.",
   "teleological": "You want technology to serve workers and fair markets, not efficiency for its own sake.",
   "evolutionary": "You want people, through law, to set the terms of how algorithms manage work.",
   "risk": "You sit in the middle on speed in general. The specific practice is what you'd stop.",
   "socioEconomic": "This is a strong view. Algorithmic pay-setting needs firm legal oversight and transparency.",
   "geopolitical": "You lean slightly toward national law as the place where workers' protections are won."
  },
  "objections": [
   {
    "objection": "Critics say personalized pay is just dynamic market pricing, and that drivers are free to accept or decline any offer.",
    "reply": "You can answer that a market price is one everyone can see, while hidden, individually tuned offers use each worker's own data against them."
   },
   {
    "objection": "Others say banning the practice would raise prices and reduce how many rides and jobs are available.",
    "reply": "You can reply that minimum pay rules for app drivers in some cities did not end the service, and that transparency is what lets a real market work."
   }
  ],
  "landmarks": [
   {
    "name": "California's Proposition 22",
    "year": "2020",
    "what": "App companies backed a ballot measure that kept their drivers as independent contractors while offering some limited benefits.",
    "source": "California ballot measure, approved November 2020"
   },
   {
    "name": "Uber BV v Aslam",
    "year": "2021",
    "what": "The UK Supreme Court ruled that Uber drivers are workers entitled to minimum wage and holiday pay, partly because the app controls their work.",
    "source": "UK Supreme Court, February 2021"
   },
   {
    "name": "EU Platform Work Directive",
    "year": "2024",
    "what": "Requires platforms to explain how their algorithms manage workers and gives workers rights to human review of automated decisions.",
    "source": "European Parliament and Council, Directive (EU) 2024/2831, adopted October 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Alex Rosenblat",
    "bio": "Technology ethnographer",
    "connection": "Her book Uberland showed how ride-hailing apps manage drivers through algorithms that act like hidden bosses."
   },
   {
    "name": "Juliet Schor",
    "bio": "Sociologist at Boston College",
    "connection": "Her book After the Gig studied who gains and who loses from platform work."
   }
  ],
  "addedReading": [
   {
    "title": "Uberland: How Algorithms Are Rewriting the Rules of Work",
    "author": "Alex Rosenblat",
    "note": "Four years of research with drivers on how algorithmic management works."
   },
   {
    "title": "After the Gig",
    "author": "Juliet B. Schor",
    "note": "What the sharing economy promised and what it delivered."
   }
  ]
 },
 "ubi-redistributive-response-advocate": {
  "moreNarrative": "You've stopped expecting to save every job. If AI can do much of today's paid work more cheaply, then the real question is who gets the gains: a few shareholders, or everyone. Your answer is a basic income, paid to every person without conditions and funded by taxing the companies and capital that benefit most. You see it as a floor that lets people retrain, care for family, start something new or say no to bad work, and you don't pretend it answers the deeper question of how people find purpose.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds.",
   "legalMoral": "You treat AI systems as productive assets whose gains should be shared.",
   "relational": "You lean slightly toward human bonds, worried about people withdrawing into AI if they lose work and community.",
   "teleological": "You lean slightly toward technology serving people's needs rather than growth for its own sake.",
   "evolutionary": "You lean toward accepting that AI will take over much of the work humans now do, and you want people free to choose their own path through that change.",
   "risk": "You sit in the middle on speed. You care more about who shares the gains than how fast they come.",
   "socioEconomic": "This is a strong view. A strong state should tax AI's gains and run the transfers, rather than leave it to markets.",
   "geopolitical": "You lean slightly toward national programs, since taxes and transfers are run by countries."
  },
  "objections": [
   {
    "objection": "Critics say a universal basic income would cost far more than taxes on AI companies could raise.",
    "reply": "You can answer that it can be phased in, combined with existing benefits and funded from a broad tax base that grows as AI raises productivity."
   },
   {
    "objection": "Others say cash can't replace the meaning, structure and respect that work gives people.",
    "reply": "You can reply that a basic income frees time for care, learning and community, and that you treat it as a floor, not the whole answer."
   }
  ],
  "landmarks": [
   {
    "name": "Alaska Permanent Fund Dividend",
    "year": "1982",
    "what": "Alaska began paying every resident a yearly share of the state's oil revenues, the longest-running universal cash payment.",
    "source": "State of Alaska, first paid 1982"
   },
   {
    "name": "Finland's basic income experiment",
    "year": "2017–2018",
    "what": "Finland paid unemployed people a monthly basic income without conditions, finding better wellbeing and a small rise in employment.",
    "source": "Kela (Social Insurance Institution of Finland), final results 2020"
   },
   {
    "name": "OpenResearch unconditional cash study",
    "year": "2024",
    "what": "One of the largest US studies gave participants $1,000 a month for three years, then reported its effects on work, health and spending.",
    "source": "OpenResearch, results published July 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Philippe Van Parijs",
    "bio": "Philosopher at the University of Louvain",
    "connection": "The leading philosophical defender of an unconditional basic income as 'real freedom for all'."
   },
   {
    "name": "Thomas Paine",
    "bio": "18th-century writer and revolutionary",
    "connection": "His pamphlet Agrarian Justice proposed paying every citizen a share of the value of land, an early form of a citizen's dividend."
   }
  ],
  "addedReading": [
   {
    "title": "Basic Income: A Radical Proposal for a Free Society and a Sane Economy",
    "author": "Philippe Van Parijs and Yannick Vanderborght",
    "note": "The fullest modern case for basic income."
   },
   {
    "title": "Agrarian Justice",
    "author": "Thomas Paine",
    "note": "The 1797 pamphlet that first proposed a universal payment funded by shared wealth."
   }
  ]
 },
 "algorithmic-colonialism-critic": {
  "moreNarrative": "You see a familiar shape behind many 'AI for the Global South' projects. Raw material, now data, flows out; finished products, now models and apps, flow back in; and the decisions about what counts as a problem, a category or a solution are made far away. You don't oppose technology in Africa or anywhere else. You oppose a pattern in which communities are treated as test markets and data sources, and you want those communities to set the terms, including the right to say no.",
  "axisReasons": {
   "ontological": "You lean toward seeing AI as a product of human choices, not a mind.",
   "legalMoral": "You sit in the middle on moral standing, focused on people's rights.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "This is a strong view. Technology should serve living communities on their own terms, not a Western story of endless progress.",
   "evolutionary": "This is a strong view. Communities, not distant companies, should shape their own futures.",
   "risk": "You sit in the middle on speed. You distrust both urgency and caution when they're decided elsewhere.",
   "socioEconomic": "You lean toward openness, since open tools let communities build for themselves instead of renting from Big Tech.",
   "geopolitical": "You lean slightly toward a borderless view, wary of national industrial policy as much as corporate power."
  },
  "objections": [
   {
    "objection": "Critics say calling this 'colonialism' overstates things, since people choose to use these services and many want them.",
    "reply": "You can answer that the pattern of extraction and imposed categories is real even when adoption looks voluntary, and that consent and local control are what make it truly voluntary."
   },
   {
    "objection": "Others say skepticism about urgency could keep useful tools away from people who need them.",
    "reply": "You can reply that you're not against the tools, only against decisions about them being made elsewhere."
   }
  ],
  "landmarks": [
   {
    "name": "Decolonial AI",
    "year": "2020",
    "what": "Researchers argued that AI ethics should learn from decolonial theory, examining who benefits and who bears the costs.",
    "source": "Shakir Mohamed, Marie-Therese Png and William Isaac, Philosophy & Technology, 2020"
   },
   {
    "name": "AI Colonialism series",
    "year": "2022",
    "what": "A reporting series documented how AI development was enriching a few at the expense of communities in several countries.",
    "source": "Karen Hao and others, MIT Technology Review, April 2022"
   },
   {
    "name": "Kenya suspends Worldcoin",
    "year": "2023",
    "what": "Kenya's government suspended a project that scanned people's irises in exchange for cryptocurrency, citing privacy and consent concerns.",
    "source": "Government of Kenya, August 2023"
   }
  ],
  "addedThinkers": [
   {
    "name": "Shakir Mohamed",
    "bio": "AI researcher and co-founder of the Deep Learning Indaba",
    "connection": "Co-wrote Decolonial AI and has worked to build AI research capacity across Africa."
   },
   {
    "name": "Nick Couldry",
    "bio": "Media scholar at the London School of Economics",
    "connection": "Co-wrote work on 'data colonialism', describing data extraction as a new phase of an old pattern."
   }
  ],
  "addedReading": [
   {
    "title": "Decolonial AI: Decolonial Theory as Sociotechnical Foresight in Artificial Intelligence",
    "author": "Shakir Mohamed, Marie-Therese Png and William Isaac",
    "note": "The academic case for a decolonial lens on AI."
   },
   {
    "title": "Empire of AI",
    "author": "Karen Hao",
    "note": "A reporter's account of the costs of the AI race, including in the Global South."
   }
  ]
 },
 "african-language-ai-sovereignty-advocate": {
  "moreNarrative": "Language is how people learn, work, see a doctor and take part in public life. When AI tools work well in English and badly or not at all in Yoruba, isiZulu or Amharic, millions of people are pushed to the edge of the digital world. You've watched volunteer researchers across Africa build the datasets and models themselves, often with almost no funding, and release them openly. That is your model: speakers building for their own languages, in the open, so no outside company decides which languages are worth serving.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds.",
   "legalMoral": "You sit in the middle on moral standing.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You lean mildly toward growing what AI can do, so that it reaches every language.",
   "evolutionary": "You lean toward communities shaping how AI enters their languages and cultures.",
   "risk": "You lean slightly toward caution, wary of tools that misrepresent languages and the people who speak them.",
   "socioEconomic": "This is a strong view. Language datasets and models should be open, built and shared by communities.",
   "geopolitical": "You lean slightly toward a borderless view, since African languages and their speakers cross national borders."
  },
  "objections": [
   {
    "objection": "Critics say volunteer efforts can't match big labs, whose large multilingual models are already adding African languages.",
    "reply": "You can answer that quality depends on native speakers and community data, and that community-built resources are often what big models end up relying on."
   },
   {
    "objection": "Others warn that openly released language data can be used by companies that give nothing back.",
    "reply": "You can reply that this is a real tension, and that licensing choices and community-led projects are ways to keep the benefit with speakers."
   }
  ],
  "landmarks": [
   {
    "name": "Founding of Masakhane",
    "year": "2019",
    "what": "A grassroots, pan-African research community formed to build machine translation and other tools for African languages.",
    "source": "Masakhane, 2019"
   },
   {
    "name": "Participatory research for African-language translation",
    "year": "2020",
    "what": "Hundreds of contributors published translation benchmarks for many African languages, written by the communities themselves.",
    "source": "Masakhane (∀ and others), Findings of EMNLP, 2020"
   },
   {
    "name": "InkubaLM",
    "year": "2024",
    "what": "An African AI company released a small open language model built for several African languages.",
    "source": "Lelapa AI, 2024"
   }
  ],
  "addedThinkers": [
   {
    "name": "Jade Abbott",
    "bio": "Co-founder of Masakhane and chief technology officer of Lelapa AI",
    "connection": "Helped start the Masakhane community and builds African-language AI as a company."
   },
   {
    "name": "David Ifeoluwa Adelani",
    "bio": "Natural language processing researcher",
    "connection": "Led widely used benchmark datasets for African languages, including MasakhaNER."
   }
  ],
  "addedReading": [
   {
    "title": "Participatory Research for Low-resourced Machine Translation: A Case Study in African Languages",
    "author": "Masakhane (∀ and others)",
    "note": "How a volunteer community built translation benchmarks for its own languages."
   },
   {
    "title": "MasakhaNER: Named Entity Recognition for African Languages",
    "author": "David Ifeoluwa Adelani and others",
    "note": "A key dataset built by and for African-language researchers."
   }
  ]
 },
 "border-migration-surveillance-critic": {
  "moreNarrative": "Borders are where new surveillance technology is often tried first, on people with the fewest rights to object: asylum seekers, refugees and migrants. You've seen lie-detection kiosks, automated risk scores for visa applications, biometric registration in camps and drones along borders, often introduced with little public debate and no clear way to appeal. You want these systems held to human rights law, tested in public, open to challenge, and in some cases not used at all.",
  "axisReasons": {
   "ontological": "You sit in the middle on machine minds.",
   "legalMoral": "You treat AI systems as tools of the agencies that use them, and you hold those agencies fully responsible.",
   "relational": "You sit in the middle on bonds with AI.",
   "teleological": "You want technology to serve human dignity, not control for its own sake.",
   "evolutionary": "You lean toward people, including those on the move, having a say over systems used on them.",
   "risk": "You lean toward caution. Untested systems used on vulnerable people can do serious, lasting harm.",
   "socioEconomic": "You lean slightly toward oversight, with legal limits and independent review.",
   "geopolitical": "You lean strongly toward international human rights law over national security framing."
  },
  "objections": [
   {
    "objection": "Critics say states have the right to control their borders, and that technology can speed up processing and help fight smuggling.",
    "reply": "You can answer that border control must still follow the law, and that untested systems used on people with no recourse violate due process whatever their speed."
   },
   {
    "objection": "Others say human officers are biased too, so algorithms could be more consistent.",
    "reply": "You can reply that a biased algorithm repeats its errors at scale and is harder to question, while a human decision can at least be explained and appealed."
   }
  ],
  "landmarks": [
   {
    "name": "iBorderCtrl pilot",
    "year": "2016–2019",
    "what": "An EU-funded project tested an AI 'lie detector' for travelers at borders, drawing criticism over its scientific basis and transparency.",
    "source": "EU Horizon 2020 research program"
   },
   {
    "name": "UK drops its visa 'streaming' algorithm",
    "year": "2020",
    "what": "The UK Home Office stopped using an algorithm to sort visa applications after a legal challenge argued it was discriminatory.",
    "source": "Joint Council for the Welfare of Immigrants and Foxglove, August 2020"
   },
   {
    "name": "EU AI Act on migration systems",
    "year": "2024",
    "what": "Classified many AI uses in migration, asylum and border control as high-risk, with extra duties for those who deploy them.",
    "source": "Regulation (EU) 2024/1689, Annex III"
   }
  ],
  "addedThinkers": [
   {
    "name": "Ruha Benjamin",
    "bio": "Sociologist at Princeton University",
    "connection": "Her book Race After Technology shows how new technologies can deepen old inequalities, which she calls the 'New Jim Code'."
   },
   {
    "name": "Simone Browne",
    "bio": "Scholar of surveillance at the University of Texas at Austin",
    "connection": "Her book Dark Matters traces how surveillance has long been used against Black people and others at the margins."
   }
  ],
  "addedReading": [
   {
    "title": "Technological Testing Grounds",
    "author": "Petra Molnar (EDRi and Refugee Law Lab)",
    "note": "A 2020 report on migration technology and human rights in Europe."
   },
   {
    "title": "Dark Matters: On the Surveillance of Blackness",
    "author": "Simone Browne",
    "note": "A history of surveillance and who it has been used on."
   }
  ]
 }
}
