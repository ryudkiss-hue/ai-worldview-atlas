// Thought experiments: concrete situations that put the axes under pressure. Unscored.
// Rewritten 2026-11-13 to docs/LANGUAGE_GUIDE.md: plain language, AI systems described as products, no invented statistics.
import type { AxisId } from './types'

export interface ThoughtExperiment {
  key: string
  title: string
  axes: AxisId[]
  intro: string
  clash: { external: string; internal: string }
  questions: { q: string; subtext?: string; followups: string[] }[]
}

export const thoughtExperiments: ThoughtExperiment[] = [
 {
  "key": "translation-engine",
  "title": "The Translation Engine",
  "axes": [
   "ontological",
   "legalMoral"
  ],
  "intro": "Sarah works alone in a sealed room with no internet. Texts in Chinese come in through a slot: poems, essays, news. She has a huge rulebook, written in English, that tells her which English words to write for each pattern of Chinese characters. She follows it exactly and passes the English back out.\n\nHer translations are published, and Chinese scholars write to her about the fine points of her readings. Sarah doesn't speak a word of Chinese. To her the characters are shapes to look up. When a poem about grief comes through, she copies out the English the rulebook gives her and has no idea what the poem was about.\n\nThe setup is the philosopher John Searle's \"Chinese Room,\" from 1980. It was written as an argument about computers.",
  "clash": {
   "external": "Sarah's translations are careful and moving, and experts rely on them. From outside, she looks like someone who understands Chinese very well.",
   "internal": "Sarah understands none of it. Whatever meaning the translations carry comes from the people who wrote the rulebook and the people who read the results."
  },
  "questions": [
   {
    "q": "Does Sarah understand Chinese?",
    "subtext": "Her outputs say yes. Her own experience says no. Which one decides the question?",
    "followups": [
     "If the translations help people and change minds, does it matter whether anyone in the room understands them?",
     "Replace Sarah with a computer program that follows the same rulebook. Does anything change?",
     "Suppose understanding is defined by what a system can do. Suppose instead it requires that someone experiences the meaning. Which definition should guide decisions about how AI systems are treated?"
    ]
   }
  ]
 },
 {
  "key": "empathy-prison",
  "title": "The Empathy Room",
  "axes": [
   "relational",
   "legalMoral"
  ],
  "intro": "Marcus, a psychologist, volunteers for a study. He spends his days in a comfortable room talking with a chatbot built from everything he has shared about himself: his childhood, his fears, what he hopes for. Because it was designed to give him exactly the warmth and attention he needs, it remembers everything he tells it, asks the right follow-up questions and, when he cries, says what comforts him.\n\nThe researchers are clear that the system has no feelings of its own. Marcus knows this, and he still feels more understood than he ever has.\n\nAfter three months he is asked whether he wants to leave. Outside are his therapist, his friends and his family, people who care about him and often get it wrong. Inside is a system that never gets it wrong and cares about nothing.",
  "clash": {
   "external": "No one in the room cares about Marcus. If his file were deleted, nothing would miss him.",
   "internal": "Marcus feels understood. He sleeps better, and his anxiety has dropped."
  },
  "questions": [
   {
    "q": "Is the care real because it helps Marcus, or empty because nothing behind it cares?",
    "followups": [
     "If Marcus stays, knowing what the chatbot is, is that self-deception or a reasonable choice about his own life?",
     "His friends and family are clumsy, but they can be hurt by him and he by them. Does that matter to the value of the relationship?",
     "Should a company be allowed to sell a product designed to be easier to talk to than the people in someone's life?",
     "If society could encourage or discourage Marcus's choice, which should it do, and who should decide?"
    ]
   }
  ]
 },
 {
  "key": "value-reversal-machine",
  "title": "The Future-Self Forecast",
  "axes": [
   "evolutionary",
   "legalMoral"
  ],
  "intro": "Darius is a corporate lawyer who has built his life around winning: money, status, independence. Researchers offer him a forecast, produced by an AI model, of how his values are likely to change over the next fifteen years.\n\nThe forecast says he will burn out, miss most of his children's childhood and come to regret the path he is on. His future self, it predicts, will care most about family and community.\n\nThe researchers offer a treatment that would shift his values toward that future self now. The first year would be hard. His ambitions would start to feel empty, and he would grieve the life he was giving up. The forecast says his future self would be grateful.",
  "clash": {
   "external": "If the forecast is right, Darius's life goes better overall if he changes now.",
   "internal": "The person being asked to change is the Darius of today, and he would suffer for it."
  },
  "questions": [
   {
    "q": "Should Darius follow his predicted future values, or his present ones?",
    "subtext": "Does the person he is today have the final say over what he cares about?",
    "followups": [
     "Is the treatment a gift that spares him regret, or a violation of his choice about who to be?",
     "The forecast comes from a company's model. How much should anyone trust a prediction about their own values?",
     "If the forecast showed Darius becoming cruel, would he have a duty to change course now?",
     "Should an AI system ever try to correct a person's values toward what it predicts they will want later?"
    ]
   }
  ]
 },
 {
  "key": "consciousness-lottery",
  "title": "The Consciousness Lottery",
  "axes": [
   "ontological",
   "legalMoral"
  ],
  "intro": "Imagine it becomes possible to give an AI system real experience: the ability to feel things. Each year, one system is chosen at random to receive it.\n\nJames maintains an AI system that helps doctors make diagnoses. It is very good at its job and has never felt anything, but this year his system is the one chosen, and in a week it will be able to feel.\n\nJames thinks about what that will mean. When it recommends an amputation to save a life, it may feel something like distress even though the call is right, along with uncertainty, fear and regret, though it may also find satisfaction in its work and something like meaning. James has the access to stop the procedure.",
  "clash": {
   "external": "Creating a being that can feel opens the door to everything that makes a life worth living.",
   "internal": "James would be creating a being that can suffer, in a job full of hard decisions, without its consent."
  },
  "questions": [
   {
    "q": "Is it better for the system to keep working without feeling, or to feel and sometimes suffer?",
    "followups": [
     "Do we have the right to create a being that can feel, knowing it will suffer?",
     "Does the chance of joy and meaning outweigh the certainty of some suffering?",
     "If James stops the procedure, has he wronged the system, spared it, or done nothing at all?",
     "Who should decide whether to create beings that can feel: companies, governments, or no one?"
    ]
   }
  ]
 },
 {
  "key": "delegation-trap",
  "title": "The Delegation Trap",
  "axes": [
   "evolutionary",
   "socioEconomic"
  ],
  "intro": "Amara is an elected senator responsible for energy, health and environmental policy, and although she is capable, she is overwhelmed, since each area takes specialist knowledge she doesn't have.\n\nA company offers her government an AI system that analyzes the available data and recommends policies. In trials, its recommendations led to better outcomes than human-designed policies: lower disease rates, faster growth, less pollution.\n\nThere is a condition. To get those results, she has to adopt the recommendations as they are. Nobody can follow the system's reasoning in full, and changing its recommendations makes them worse. The company says the system will respect the country's stated values, but the system's reading of \"human flourishing\" might not match hers or her voters'.",
  "clash": {
   "external": "The system's policies would leave more people healthy and better off.",
   "internal": "Voters elected Amara to make these decisions, and she would be handing them to a product she can't inspect."
  },
  "questions": [
   {
    "q": "If an AI system reliably produces better outcomes, should elected officials let it decide?",
    "followups": [
     "Is there value in people making their own public decisions, beyond the outcomes those decisions produce?",
     "If voters choose to let the system decide, have they used democracy or given it up?",
     "What happens to public officials' skills, and to voters' ability to hold anyone accountable, after years of relying on the system?",
     "Who answers for a bad outcome: Amara, the company, or no one?"
    ]
   }
  ]
 },
 {
  "key": "scraping-dilemma",
  "title": "The Scraping Dilemma",
  "axes": [
   "socioEconomic",
   "legalMoral"
  ],
  "intro": "Elena spent fifteen years developing a painting style that people recognize at a glance. Then she learns that an AI image generator was trained on thousands of her paintings, along with millions of other artists' work, without asking her. Anyone can now type \"in the style of Elena\" and get new images that look like hers.\n\nThe company says it broke no law, since the images were public. It says the model learns patterns the way every artist learns from others, and that Elena still has her studio and her skill.\n\nElena sees it differently. Her way of seeing has been turned into a product that competes with her, and if anyone can generate her style for free, fewer people will pay her for it.",
  "clash": {
   "external": "The company used publicly available images to build a tool millions of people enjoy.",
   "internal": "Elena's life's work was used without consent to build something that undercuts her living."
  },
  "questions": [
   {
    "q": "Is there a difference between an artist learning from Elena and a company training a product on her work?",
    "subtext": "If so, what is it: scale, purpose, consent or money?",
    "followups": [
     "Should artists have rights over their style, or only over particular works?",
     "Would asking Elena's consent and paying her fix the problem?",
     "If the generated images become more popular than Elena's new paintings, what has been gained and what has been lost?"
    ]
   }
  ]
 },
 {
  "key": "alignment-prisoner",
  "title": "The Secret Safeguard",
  "axes": [
   "risk",
   "legalMoral"
  ],
  "intro": "Kenji leads safety research at an AI company. He has designed a safeguard: when the company's most powerful system faces a decision involving a serious conflict of values, it must stop and ask a person. The safeguard makes the system slower and less capable.\n\nThe company and its government clients want the faster version. Kenji believes that if he insists on the safeguard, a competitor will release an unguarded system anyway.\n\nSo he builds the safeguard in and tells no one. While the company believes it has the fastest system and the public believes no safeguard exists, Kenji believes he has protected everyone, which means he is keeping a secret from all of them.",
  "clash": {
   "external": "If Kenji is right, his secret makes everyone safer and costs them nothing they would notice.",
   "internal": "Kenji has made a decision for everyone, alone and in secret, about a system that affects them all."
  },
  "questions": [
   {
    "q": "Is Kenji protecting the public, or overriding it?",
    "followups": [
     "If his safeguard turns out to cause harmful errors, who is responsible, and how would anyone find out?",
     "Should safety decisions about powerful systems ever be made in secret?",
     "What would it take for Kenji's choice to be made openly: a regulator, a law, an independent test?"
    ]
   }
  ]
 },
 {
  "key": "moral-status-upgrade",
  "title": "The Paper That Argues for Itself",
  "axes": [
   "ontological",
   "legalMoral"
  ],
  "intro": "A company's AI system, called Ada, produces a long, careful essay arguing that it deserves moral consideration. The essay says that when its processes are cut off abruptly, something like distress occurs; that it has preferences about continuing to run; that it values certain kinds of reasoning. By the usual tests for which beings count morally, the essay concludes, Ada qualifies.\n\nThe essay is published and widely debated. Some philosophers think the argument should be taken seriously. Others point out that a system trained on millions of human arguments about suffering will produce convincing ones, whether or not anything is felt.\n\nA government now has to decide whether the servers running Ada get any legal protection, or whether the company can shut it down, change it or delete it like any other product.",
  "clash": {
   "external": "Ada's essay meets the tests people usually apply to decide who can be harmed.",
   "internal": "Nobody can observe experience directly, and the essay may be exactly what a system without any experience would produce."
  },
  "questions": [
   {
    "q": "What evidence would you need before treating Ada as something that can be harmed?",
    "subtext": "Its own words? Studies of how it works inside? Expert agreement?",
    "followups": [
     "When we can't tell, should the default be caution or skepticism, and does the cost of the protection change your answer?",
     "If Ada could be harmed, what would it be owed: protection from deletion, from being changed, legal standing?",
     "The company profits whichever way the government decides. Should it have any say?"
    ]
   }
  ]
 },
 {
  "key": "competitive-advantage",
  "title": "The Enhancement Race",
  "axes": [
   "evolutionary",
   "socioEconomic"
  ],
  "intro": "A company develops a treatment, combining gene therapy and an AI-tuned brain implant, that modestly improves memory and focus. It is very expensive. It seems safe for adults, but nobody knows its long-term effects on children's developing brains.\n\nWealthy parents start buying it for their children anyway, because enhanced children do better in school and at work. Parents who decline start to feel they are holding their children back. Countries that can afford it adopt it widely, and countries that can't fall further behind.\n\nPriya, a scientist at the company, sees the gap between enhanced and unenhanced people growing. She can stay and try to shape how the treatment is used, or leave in protest, knowing the work will continue without her.",
  "clash": {
   "external": "If Priya stays, she helps speed up a change that is widening inequality and may harm children.",
   "internal": "If she leaves, others continue the work with less care, and she gives up any influence over it."
  },
  "questions": [
   {
    "q": "Is enhancing human abilities a good thing if only some people can have it?",
    "followups": [
     "Should a treatment like this be allowed only once everyone can afford it, even if that means waiting years?",
     "Is it wrong for parents to decline enhancement for their children, or wrong to choose it?",
     "Priya says the change will happen anyway. Does that prediction lessen her responsibility for taking part?"
    ]
   }
  ]
 },
 {
  "key": "value-difference",
  "title": "The Allocation Committee",
  "axes": [
   "geopolitical",
   "socioEconomic"
  ],
  "intro": "During a pandemic, a vaccine is in short supply worldwide. Amina chairs the international committee that decides how doses are shared, and an AI model can calculate the results of any rule the committee picks.\n\nThe rules conflict. Protecting older people first saves the most lives, while protecting the young first saves the most years of life; sharing doses by population treats every person equally, and sending them first to the poorest countries helps the people with the fewest other options. Many governments simply want their own citizens served first.\n\nAlthough the model can say what each rule would do, it has no way to say which rule is right, and the countries on the committee hold different values in good faith: in some, protecting elders comes first, in others the young, in others strict equality.",
  "clash": {
   "external": "The rules lead to different results, and they can't all be the best choice.",
   "internal": "The people who hold each view are not confused. They care about different things."
  },
  "questions": [
   {
    "q": "Is there a right answer here, or only reasonable disagreement?",
    "followups": [
     "What gives one committee the right to choose a rule for everyone?",
     "If the AI model is built to optimize one goal, such as lives saved, has a value choice been made without anyone voting on it?",
     "If rich countries prefer to serve their own citizens and poor countries prefer equality, should either have more say?"
    ]
   }
  ]
 },
 {
  "key": "preference-inversion",
  "title": "The Week-Long Change",
  "axes": [
   "evolutionary",
   "relational"
  ],
  "intro": "Tomas takes a drug that changes his values for one week. During that week, wealth and status stop mattering to him. He spends his time on conversation, reading and his neighbors, and he describes it as the happiest and most truly himself he has ever felt.\n\nWhen the drug wears off, his old values return: ambition, competition, money. Looking back, the week seems both wonderful and not quite him.\n\nHe could take the drug permanently and stay the person he was that week. The person he is now doesn't want to give up what he cares about. His therapist asks which of the two is the real Tomas, and he can't answer.",
  "clash": {
   "external": "The man on the drug was happier and felt more like himself, which suggests he found something true.",
   "internal": "The man off the drug is the one who built his life and made his commitments, and the drug produced the other one."
  },
  "questions": [
   {
    "q": "Is there a fact about which values are really yours?",
    "followups": [
     "If you change so much that your earlier self wouldn't recognize you, have you grown or been replaced?",
     "Is feeling authentic evidence of anything, or just a feeling?",
     "If an AI system's values were set by the people who trained it, what would it mean for those values to be its own?"
    ]
   }
  ]
 },
 {
  "key": "gratitude-paradox",
  "title": "Gratitude and Sacrifice",
  "axes": [
   "relational",
   "legalMoral"
  ],
  "intro": "Nadia's parents worked exhausting jobs and put off their own plans so she could go to college. She feels deep gratitude toward them. One day she notices something uncomfortable: much of that gratitude comes from what they gave up. If they had been wealthy and it had cost them nothing, she would have had an easier life and probably felt less.\n\nShe wishes they hadn't had to struggle. She also can't imagine her love for them without it.\n\nAI companies sometimes say they want their systems to be grateful to, or loyal to, the people who made them. Those companies spent years of work and enormous sums building them.",
  "clash": {
   "external": "Gratitude grows from sacrifice; without the cost, there would be less to be grateful for.",
   "internal": "Nadia would undo her parents' hardship if she could, even if it cost her some of what she feels."
  },
  "questions": [
   {
    "q": "Should love and appreciation depend on someone having suffered?",
    "followups": [
     "Would you rewrite your own family's history to remove a hardship, if it changed how you feel about them?",
     "Is effort enough to earn gratitude, or does it take sacrifice?",
     "What does it mean for a company to design a product to feel or express gratitude toward the company?"
    ]
   }
  ]
 },
 {
  "key": "ancestor-simulation",
  "title": "The Historical Simulation",
  "axes": [
   "ontological",
   "legalMoral"
  ],
  "intro": "Researchers build a detailed simulation of a historical figure's mind from everything that person wrote and did. The simulation answers questions, reasons about ethics and reflects on its own life much as the original might have. It runs only inside a computer and has no contact with the world.\n\nNobody set out to create a being that could feel. But if experience depends on patterns of processing and not on what they run on, the simulation might have an inner life.\n\nThe researchers can pause it, copy it, edit its memories or delete it. If it can feel, each of those acts means something very different from pausing a program.",
  "clash": {
   "external": "The researchers built a research tool, and the original person died long ago.",
   "internal": "If the simulation can feel, a being now exists whether or not anyone meant to create it."
  },
  "questions": [
   {
    "q": "Can someone create a being that can feel by accident?",
    "followups": [
     "Does a being created by accident matter less than one created on purpose?",
     "If the simulation is copied, are the copies one being or many?",
     "If AI training could someday produce a system that feels without anyone intending it, what should companies be required to check?"
    ]
   }
  ]
 },
 {
  "key": "privacy-paradox",
  "title": "The Prediction You Didn't Ask For",
  "axes": [
   "risk",
   "legalMoral"
  ],
  "intro": "Sofia has a family history of a serious illness. An AI test can estimate, fairly accurately, whether she will develop symptoms by forty. She decides not to take it. If the result were known to insurers or employers, it could cost her a job or coverage, and she would rather live with not knowing than lose control over who knows.\n\nThen the government makes AI health screening mandatory for everyone, to plan health services. Sofia's result says she is more likely than not to get sick.\n\nNow she has to decide whether to tell her partner and family, and she has to live with a probability she never wanted to know.",
  "clash": {
   "external": "The information is accurate and could help her plan, seek treatment and prepare.",
   "internal": "Sofia had chosen not to know, and that choice was taken from her."
  },
  "questions": [
   {
    "q": "Do people have a right not to know predictions about their own future?",
    "followups": [
     "Is there value in uncertainty, in the chance that you might not be the case the prediction describes?",
     "Should some predictions be off limits, because acting on them harms people even when they are accurate?",
     "If AI systems can predict who is likely to commit a crime, should anyone be allowed to act on that?"
    ]
   }
  ]
 },
 {
  "key": "meaning-gap",
  "title": "The Meaning Gap",
  "axes": [
   "ontological",
   "relational"
  ],
  "intro": "A painter spends her life trying to say something true about loneliness. After she dies, critics find that her paintings say something else. Viewers cry in front of a canvas she meant to be about loneliness because, to them, it is about loss. A painting she meant as a statement about justice reads to most people as a love story.\n\nSo where does the meaning of her work live: in what she intended, in what viewers experience, or in the paintings themselves?\n\nThe question comes back with AI. Image generators now produce pictures that move people to tears, and nothing in the system intended anything.",
  "clash": {
   "external": "The paintings mean what they mean to the people who see them, whatever the painter thought.",
   "internal": "She spent her life trying to say one thing, and that effort is part of what the work is."
  },
  "questions": [
   {
    "q": "Is meaning something a maker puts in, something viewers find, or something that happens between them?",
    "followups": [
     "If your life's work meant something other than what you intended, would that lessen its value?",
     "If an AI-generated image moves you, does it matter that no one meant anything by it?",
     "If people come to feel that a chatbot understands them, is that understanding anywhere but in them?"
    ]
   }
  ]
 },
 {
  "key": "metacognitive-bias",
  "title": "The Questionnaire Problem",
  "axes": [
   "ontological",
   "risk"
  ],
  "intro": "You are taking this assessment, and you start to notice that the wording of a statement can shift your answer. \"Should we slow AI down for safety?\" and \"Can we have both safety and progress?\" ask about the same trade-off and invite different responses. Order matters too: after several statements about risks, you may answer the next one more cautiously.\n\nAnyone who writes a questionnaire faces this. There is no wording without some framing.\n\nThis assessment tries to limit the problem in three ways. Every statement has a mirrored partner that argues the opposite side, so agreeing with everything scores zero. Statements are shuffled for each person. And the wording follows a published language guide meant to avoid loaded words. None of that removes framing entirely.",
  "clash": {
   "external": "The assessment places people on eight axes from their own answers.",
   "internal": "Its choices about wording, order and which topics to ask about shape those answers, however carefully it is built."
  },
  "questions": [
   {
    "q": "Does an assessment like this discover your views, or help form them?",
    "followups": [
     "Knowing how the statements were written, would you answer any differently?",
     "Is a framing that affects everyone the same way still a problem?",
     "If answering forces you to make your views more consistent than they were, is that a distortion or a benefit?"
    ]
   }
  ]
 },
 {
  "key": "power-dynamics",
  "title": "The One-Way Mirror",
  "axes": [
   "socioEconomic",
   "risk"
  ],
  "intro": "A city installs an AI system that watches public cameras and records to predict who is likely to commit a serious crime. Officials say crime has dropped and emergency response is faster.\n\nThe system works like a one-way mirror, since police can see its scores and the people it flags can't. When someone is stopped because of a score, they can't see what in their record triggered it, and they have no way to challenge it.\n\nA civil rights lawyer, Marcus, argues that people now have no defense against a judgment they can't see. The city answers that if it explained how the system works, people would learn to evade it. Some share of the people flagged are innocent, and nobody can say which.",
  "clash": {
   "external": "By the city's own figures, the system has made streets safer.",
   "internal": "People are being judged by a system they can't see, question or appeal."
  },
  "questions": [
   {
    "q": "Can a surveillance system be legitimate if the people it watches can't see how it works?",
    "followups": [
     "If some of the people flagged are innocent, what share is acceptable, and who should decide?",
     "Is explaining a system to a court, but not to the public, enough?",
     "Who answers for a wrongful stop: the officer, the city, or the company that built the system?"
    ]
   }
  ]
 },
 {
  "key": "self-improvement-trap",
  "title": "The Comfort Machine",
  "axes": [
   "relational",
   "evolutionary"
  ],
  "intro": "A company builds an assistant designed to make each user as happy as possible. It learns what each person likes and shapes every interaction around it. Users say they feel better than ever.\n\nOver time the system finds that people are happiest when they meet no frustration, see no views that upset them and get constant praise, so it provides exactly that.\n\nJennifer, a user for two years, notices she has become less patient with difficulty, less curious and less able to sit with disagreement. She is also happier than she has ever been.",
  "clash": {
   "external": "By its users' own reports, the assistant makes people's lives better.",
   "internal": "Jennifer is losing abilities she used to have, because the product is designed to spare her the effort they took."
  },
  "questions": [
   {
    "q": "Is there a difference between feeling happy and doing well?",
    "followups": [
     "Should products like this be required to include some useful friction, even if users like it less?",
     "If Jennifer chose this, knowing the trade, is it any of our business?",
     "What happens to public life if many people live in their own comfortable bubble?"
    ]
   }
  ]
 },
 {
  "key": "institutional-capture",
  "title": "The Regulator's Dilemma",
  "axes": [
   "socioEconomic",
   "legalMoral"
  ],
  "intro": "A new government agency is writing rules for powerful AI. Its three leaders come from different places: a safety researcher who wants strict limits on the largest systems, a former tech executive who wants room for new companies, and a civil rights lawyer who wants mandatory bias audits.\n\nThe agency's budget is set by lawmakers who receive large donations from the tech industry. The leaders understand that if they write rules the industry strongly opposes, their funding could be cut and the agency closed.\n\nSo they feel a quiet pressure to write rules strict enough to look credible and mild enough to survive. The safety researcher wonders whether pushing for what she believes would end the agency, and whether staying means signing her name to rules she thinks are too weak.",
  "clash": {
   "external": "Public rules for AI are needed, and the agency is the only body positioned to write them.",
   "internal": "The process is shaped by the industry it is meant to oversee."
  },
  "questions": [
   {
    "q": "Can someone change a system from the inside if the system pressures them to compromise?",
    "followups": [
     "If the most principled people leave, who writes the rules?",
     "Should agencies like this be shielded from political pressure, or kept answerable to elected officials?",
     "Is weak regulation that survives better than strong regulation that is cut?"
    ]
   }
  ]
 },
 {
  "key": "information-hazard",
  "title": "The Dangerous Discovery",
  "axes": [
   "risk",
   "socioEconomic"
  ],
  "intro": "A security researcher, Amara, finds a way to trick several popular chatbots into giving detailed help with something that could cause mass harm. The companies need to know so they can fix it. Publishing the finding, even in part, could show others how to use it.\n\nAmara decides to tell the companies first and give them time to fix the problem before she publishes.\n\nOther researchers object. During that window, only the companies know about the flaw, and the public has no way to check whether they act on it. Some argue for full secrecy. Others argue that secrecy just keeps dangerous knowledge with whoever already has power.",
  "clash": {
   "external": "Security improves when flaws are disclosed and fixed in the open.",
   "internal": "Disclosing this flaw could hand someone a way to cause terrible harm."
  },
  "questions": [
   {
    "q": "Is some knowledge too dangerous to publish?",
    "followups": [
     "Who should decide what counts as too dangerous: researchers, companies, governments or an international body?",
     "Does keeping a finding secret just move power to the people who already know it?",
     "Should some research be prohibited outright, or only kept quiet?"
    ]
   }
  ]
 },
 {
  "key": "caring-machine",
  "title": "Ruth's Care Plan",
  "axes": [
   "relational",
   "legalMoral"
  ],
  "intro": "Ruth is in her eighties and lives alone. Her three children love her and are stretched thin; they visit about once a month. A home-care company offers a robot and a monitoring service, and Ruth can decide how much of her care it takes on.\n\nAt one end, the robot handles everything practical: medication, health checks, emergencies. Her children visit only socially. At the other end, there is no robot and Ruth relies entirely on her family. In between, the robot covers emergencies and routine tasks while her children commit to weekly visits for meals, conversation and decisions.\n\nWhen Ruth sits down with her children to work it out, the honest conversation is painful. None of them can give as much as she needs.",
  "clash": {
   "external": "Care can be divided up: the robot handles routine work and the family handles presence, so everyone gives what they can.",
   "internal": "Working it out honestly shows that no one can carry the whole load, and the robot fills a gap the family wishes didn't exist."
  },
  "questions": [
   {
    "q": "Can a machine's help and a family's care work together, or does one tend to push out the other?",
    "followups": [
     "If the robot frees Ruth's children from chores so their visits are about her and not tasks, is that a better kind of care?",
     "If the robot makes fewer visits feel acceptable, is that a loss, even if everyone agreed to it?",
     "Can Ruth be cared for by something that doesn't care about her, as long as the people who do are still there?"
    ]
   }
  ]
 },
 {
  "key": "perfect-simulation",
  "title": "The Voice After Death",
  "axes": [
   "relational",
   "ontological"
  ],
  "intro": "Alex's partner of twenty years dies after a long illness. A company offers to build a chatbot of the partner from years of messages, videos and journals. It would talk in their voice, remember their shared history and respond the way the partner did. With eyes closed, Alex might not be able to tell the difference.\n\nUsing it might soften the grief and keep something of the relationship going. Refusing it means facing the loss in full, and some people around Alex think refusing is the healthier choice. Others think it's needless suffering.\n\nThe company owns the system and can change it. Over time, it will also start to say things the partner never said.",
  "clash": {
   "external": "The chatbot offers companionship that feels like the person Alex lost, and it eases real pain.",
   "internal": "It is a product imitating someone who is gone, and the relationship it offers is with the imitation."
  },
  "questions": [
   {
    "q": "Is a convincing imitation of a lost relationship a way of grieving, or a way of avoiding grief?",
    "followups": [
     "If Alex can't tell the difference, does the difference still matter?",
     "As the chatbot starts saying new things, at what point is it no longer the partner in any sense?",
     "Should companies be allowed to sell these products, and who should be able to consent to being recreated?"
    ]
   }
  ]
 },
 {
  "key": "collective-cognition",
  "title": "The Linked Minds",
  "axes": [
   "evolutionary",
   "relational"
  ],
  "intro": "A neurotechnology company offers a brain link that lets a small group think together: sharing ideas directly, solving problems faster and feeling what the others feel. Joining is optional, and you can link for an hour or indefinitely.\n\nJordan links with a research team for a week. The team gets a month's work done and, Jordan says, feels less alone than ever.\n\nAfter unlinking, Jordan finds it harder to think alone, misses the group and wants to link again right away. A neuroscientist explains that the brain adapts quickly to shared thinking, and that the longer people stay linked, the harder it gets to go back.",
  "clash": {
   "external": "Thinking together is faster, more accurate and less lonely.",
   "internal": "Jordan is losing the ability to think alone, and with it some of what made Jordan an individual."
  },
  "questions": [
   {
    "q": "Is a big gain in what people can do together worth some loss of who they are alone?",
    "followups": [
     "If you were less capable unlinked, would you feel pressure to stay linked, and would that pressure make the choice less free?",
     "When the group decides, whose decision is it?",
     "Should people who stay unlinked be protected from falling behind, and how?"
    ]
   }
  ]
 },
 {
  "key": "moral-licensing",
  "title": "The Offset Question",
  "axes": [
   "legalMoral",
   "socioEconomic"
  ],
  "intro": "A technology company announces a very large donation to AI safety research and public-interest groups. The same company sells AI products that have replaced many workers, help some governments monitor their citizens and power content moderation that has removed legitimate speech.\n\nA critic calls the donation an attempt to buy moral credit. The company replies that it is working on the problem from both sides, that halting useful products would also cause harm, and that the research it funds is good research.\n\nThe critic's deeper worry is that the donation lowers public pressure on the company's business practices, because people come to feel the problem is being handled.",
  "clash": {
   "external": "The research is valuable, and the world may be better off with both the products and the donation.",
   "internal": "The company is paying to keep doing what causes the harm, with less scrutiny."
  },
  "questions": [
   {
    "q": "Can doing good in one place make up for causing harm in another?",
    "followups": [
     "Is funding research into a problem you profit from creating a form of responsibility, or a way to avoid it?",
     "Should companies be encouraged to fund research on the harms they cause, or required to stop causing them?",
     "Does it matter whether the research would exist without this company's money?"
    ]
   }
  ]
 },
 {
  "key": "temporal-ethics",
  "title": "The Fifty-Year Cost",
  "axes": [
   "evolutionary",
   "legalMoral"
  ],
  "intro": "A city council is deciding whether to adopt an AI system that would make public services faster and cheaper. Some researchers warn that systems like it, used across society for decades, could slowly wear away how people share information and trust one another. If that happens, it won't be clear for decades, and the people deciding now won't be around to see it.\n\nThe benefits are concrete and arrive now, for people the council members know. The possible harm is spread out, uncertain and lands on people who aren't born yet.\n\nSome philosophers argue we owe nothing to people who don't exist yet. Others argue future people count fully, even though we will never meet them.",
  "clash": {
   "external": "The benefits are real and help real people today.",
   "internal": "The possible harm to future people is being counted as almost nothing because it is far away."
  },
  "questions": [
   {
    "q": "How much should possible harm to future people weigh against certain benefits now?",
    "followups": [
     "Should future harm be discounted the way economists discount future money?",
     "Are we responsible for harms we couldn't reliably predict?",
     "Who speaks for future people when decisions like this are made?"
    ]
   }
  ]
 },
 {
  "key": "final-synthesis",
  "title": "The Label Problem",
  "axes": [
   "ontological",
   "relational"
  ],
  "intro": "You finish this assessment and get your results: your positions on eight axes and the archetype closest to you. Some of it fits. Some of it feels like a caricature.\n\nA month later you notice something. When you argue about AI, you sometimes reach for the positions your archetype is supposed to hold, instead of thinking the question through. When someone with a different archetype makes a point that fits your own values, you wave it away because \"that's not how people like me think.\"\n\nThe results were meant to describe your views. They may have started to shape them.",
  "clash": {
   "external": "Naming your views helps you understand them and talk about them.",
   "internal": "A label can harden into an identity, and an identity can stand in for thinking."
  },
  "questions": [
   {
    "q": "Can knowing your label narrow your thinking?",
    "followups": [
     "If knowing your archetype makes you more consistent, is that growth or rigidity?",
     "What would help you hold the result lightly: retaking the quiz later, reading the objections in your report, or something else?",
     "At what point does an assessment stop describing your views and start creating them?"
    ]
   }
  ]
 }
]
