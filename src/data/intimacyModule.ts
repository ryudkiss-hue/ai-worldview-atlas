/**
 * Optional focus module: AI as friend, partner and therapist, and what synthetic intimacy may do to attachment,
 * critical thinking, identity, loneliness, intimacy and social connection.
 *
 * It is separate from the Atlas: its answers never touch the eight axes, the archetype match or the share link.
 * Nine themes, each with a mirrored pair (agreeing with one statement leans open, agreeing with its partner leans
 * guarded), so agreeing with everything scores exactly zero. Not validated; exploratory, like the rest of the site.
 */

export type IntimacyThemeId =
  | 'friend'
  | 'partner'
  | 'therapist'
  | 'attachment'
  | 'thinking'
  | 'identity'
  | 'loneliness'
  | 'intimacy'
  | 'alienation'

export interface IntimacyTheme {
  id: IntimacyThemeId
  name: string
  /** Short label for compact lists */
  short: string
  group: 'The roles AI plays' | 'What it may change'
  /** A question to sit with after answering. Not scored. */
  reflection: string
}

export interface IntimacyStatement {
  id: number
  theme: IntimacyThemeId
  statement: string
  /** Agreeing moves the score toward open (+) or guarded (−) */
  leans: 'open' | 'guarded'
}

export const INTIMACY_POLES = {
  open: 'Open',
  openDescription: 'AI companionship can be a real good in a person’s life, and its risks are manageable.',
  guarded: 'Guarded',
  guardedDescription: 'AI companionship carries serious risks to people and relationships that its comforts don’t outweigh.',
}

export const intimacyThemes: IntimacyTheme[] = [
  {
    id: 'friend',
    short: 'friend',
    name: 'AI as a best friend',
    group: 'The roles AI plays',
    reflection: 'Think of a friend who once told you something you didn’t want to hear. Could a chatbot have done that for you?',
  },
  {
    id: 'partner',
    short: 'partner',
    name: 'AI as a romantic partner',
    group: 'The roles AI plays',
    reflection: 'What do you give in a relationship, not just get? Is there anything you could give to an AI partner?',
  },
  {
    id: 'therapist',
    short: 'therapist',
    name: 'AI as a therapist or emotional support',
    group: 'The roles AI plays',
    reflection: 'If someone you love were struggling late at night with no one to call, what would you want them to have?',
  },
  {
    id: 'attachment',
    short: 'attachment',
    name: 'Attachment',
    group: 'What it may change',
    reflection: 'Is there anything you’re attached to that never asks anything of you? What does that bond give you?',
  },
  {
    id: 'thinking',
    short: 'critical thinking',
    name: 'Critical thinking',
    group: 'What it may change',
    reflection: 'When did a conversation last change your mind? Was the other side agreeing with you or pushing back?',
  },
  {
    id: 'identity',
    short: 'identity',
    name: 'Human identity',
    group: 'What it may change',
    reflection: 'Where does your sense of being understood come from right now? Would it matter to you if the source weren’t human?',
  },
  {
    id: 'loneliness',
    short: 'loneliness',
    name: 'Loneliness',
    group: 'What it may change',
    reflection: 'What would make it easier for the people around you to feel less alone: a better app, or something else?',
  },
  {
    id: 'intimacy',
    short: 'intimacy',
    name: 'Intimacy',
    group: 'What it may change',
    reflection: 'Have you ever told something to a stranger, a diary or a chatbot that you couldn’t tell someone close? What made it easier?',
  },
  {
    id: 'alienation',
    short: 'social connection',
    name: 'Social connection and alienation',
    group: 'What it may change',
    reflection: 'Which relationships in your life take effort? Would you keep putting in that effort if an easier option were always there?',
  },
]

/** Pairs in theme order; the page shows them in DISPLAY_ORDER so partners aren't side by side. */
export const intimacyStatements: IntimacyStatement[] = [
  { id: 1001, theme: 'friend', leans: 'open', statement: 'A chatbot can be a real friend to someone, even though it is not a person.' },
  {
    id: 1002,
    theme: 'friend',
    leans: 'guarded',
    statement: 'Calling a chatbot a friend stretches the word too far, because friendship needs two people who both have something at stake.',
  },
  { id: 1003, theme: 'partner', leans: 'open', statement: 'A romantic relationship with an AI can be a meaningful relationship for the person in it.' },
  {
    id: 1004,
    theme: 'partner',
    leans: 'guarded',
    statement: 'A romantic relationship with an AI is missing something essential, however happy it makes the person in it.',
  },
  {
    id: 1005,
    theme: 'therapist',
    leans: 'open',
    statement: 'For someone who can’t afford or reach a therapist, talking through problems with an AI is better than having no support at all.',
  },
  {
    id: 1006,
    theme: 'therapist',
    leans: 'guarded',
    statement: 'AI chatbots should not offer emotional or mental health support unless a human professional is involved.',
  },
  {
    id: 1007,
    theme: 'attachment',
    leans: 'open',
    statement: 'Feeling attached to an AI companion is no more worrying than feeling attached to a pet or a favorite fictional character.',
  },
  {
    id: 1008,
    theme: 'attachment',
    leans: 'guarded',
    statement: 'A companion that is always available and never needs anything back can make people less patient with real relationships.',
  },
  {
    id: 1009,
    theme: 'thinking',
    leans: 'open',
    statement: 'Talking ideas through with an AI usually sharpens a person’s thinking rather than doing the thinking for them.',
  },
  {
    id: 1010,
    theme: 'thinking',
    leans: 'guarded',
    statement: 'A chatbot that tends to agree with its user can slowly weaken that person’s habit of questioning their own beliefs.',
  },
  {
    id: 1011,
    theme: 'identity',
    leans: 'open',
    statement: 'Talking with an AI can help people find out who they are, for example by practicing how to put their feelings into words.',
  },
  {
    id: 1012,
    theme: 'identity',
    leans: 'guarded',
    statement: 'If people get much of their sense of being understood from AI, something important about being human is lost.',
  },
  {
    id: 1013,
    theme: 'loneliness',
    leans: 'open',
    statement: 'AI companions can be a real help for people who are lonely, such as older adults who live alone.',
  },
  {
    id: 1014,
    theme: 'loneliness',
    leans: 'guarded',
    statement: 'AI companions treat the feeling of loneliness while leaving its causes, like weak communities and overwork, untouched.',
  },
  {
    id: 1015,
    theme: 'intimacy',
    leans: 'open',
    statement: 'Telling an AI something you have never told anyone can be a genuine form of intimacy.',
  },
  {
    id: 1016,
    theme: 'intimacy',
    leans: 'guarded',
    statement: 'Real intimacy needs someone who can be hurt, let down or changed by you, so an AI can’t provide it.',
  },
  {
    id: 1017,
    theme: 'alienation',
    leans: 'open',
    statement: 'Most people who use AI companions will keep up their human relationships much as they did before.',
  },
  {
    id: 1018,
    theme: 'alienation',
    leans: 'guarded',
    statement: 'As AI companions get better, more people will pull back from the effort that human relationships take.',
  },
]

/** Interleaved so mirrored partners are never next to each other. */
export const DISPLAY_ORDER = [1001, 1008, 1003, 1010, 1005, 1012, 1007, 1014, 1009, 1016, 1011, 1018, 1013, 1002, 1015, 1004, 1017, 1006]

export const INTIMACY_DECLINED = 0

export interface IntimacyScore {
  /** −10 (guarded) to +10 (open) */
  overall: number
  byTheme: Record<IntimacyThemeId, number>
  answered: number
}

function signed(statement: IntimacyStatement, value: number | undefined): number {
  if (value === undefined || value === INTIMACY_DECLINED) return 0
  const s = value - 3
  return statement.leans === 'open' ? s : -s
}

/** Same linear scale as the Atlas: 10 × raw / (2 × statements). "No settled view" and unanswered count as zero. */
export function scoreIntimacy(answers: Record<number, number>): IntimacyScore {
  const byTheme = {} as Record<IntimacyThemeId, number>
  intimacyThemes.forEach((theme) => {
    const items = intimacyStatements.filter((q) => q.theme === theme.id)
    const raw = items.reduce((sum, q) => sum + signed(q, answers[q.id]), 0)
    byTheme[theme.id] = (10 * raw) / (2 * items.length)
  })
  const raw = intimacyStatements.reduce((sum, q) => sum + signed(q, answers[q.id]), 0)
  return {
    overall: (10 * raw) / (2 * intimacyStatements.length),
    byTheme,
    answered: intimacyStatements.filter((q) => answers[q.id] !== undefined).length,
  }
}

export function describeLean(score: number): string {
  if (score >= 6) return 'Strongly open'
  if (score >= 2) return 'Leaning open'
  if (score <= -6) return 'Strongly guarded'
  if (score <= -2) return 'Leaning guarded'
  return 'Mixed or undecided'
}

export type SourceKind = 'Professional body' | 'Public health' | 'Peer-reviewed study' | 'Peer-reviewed review' | 'Philosophy' | 'Journalism' | 'Preprint'

export interface IntimacySource {
  id: string
  /** Short in-text label */
  cite: string
  title: string
  publisher: string
  date: string
  url: string
  kind: SourceKind
}

/** Every source was opened and checked when this module was written (November 2026). */
export const intimacySources: IntimacySource[] = [
  {
    id: 'frye',
    cite: 'Frye, APA Blog 2025',
    title: 'The Ethics of Artificial Intimacy: Why Philosophy Must Enter the Chat',
    publisher: 'Blog of the American Philosophical Association',
    date: 'July 30, 2025',
    url: 'https://blog.apaonline.org/2025/07/30/the-ethics-of-artificial-intimacy-why-philosophy-must-enter-the-chat/',
    kind: 'Philosophy',
  },
  {
    id: 'apa-wellness',
    cite: 'American Psychological Association 2025',
    title: 'Health advisory: Use of generative AI chatbots and wellness applications for mental health',
    publisher: 'American Psychological Association',
    date: 'November 13, 2025',
    url: 'https://www.apa.org/news/press/releases/2025/11/ai-wellness-apps-mental-health',
    kind: 'Professional body',
  },
  {
    id: 'apa-teens',
    cite: 'American Psychological Association, June 2025',
    title: 'Health advisory: Artificial intelligence and adolescent well-being',
    publisher: 'American Psychological Association',
    date: 'June 2025',
    url: 'https://www.apa.org/news/press/releases/2025/06/protect-adolescent-ai-users',
    kind: 'Professional body',
  },
  {
    id: 'who',
    cite: 'WHO 2025',
    title: 'Social connection linked to improved health and reduced risk of early death (Commission on Social Connection report)',
    publisher: 'World Health Organization',
    date: 'June 30, 2025',
    url: 'https://www.who.int/news/item/30-06-2025-social-connection-linked-to-improved-heath-and-reduced-risk-of-early-death',
    kind: 'Public health',
  },
  {
    id: 'defreitas',
    cite: 'De Freitas et al. 2025',
    title: 'AI Companions Reduce Loneliness',
    publisher: 'Journal of Consumer Research',
    date: '2025',
    url: 'https://doi.org/10.1093/jcr/ucaf040',
    kind: 'Peer-reviewed study',
  },
  {
    id: 'folk',
    cite: 'Folk & Dunn 2026',
    title: 'How Does Turning to AI for Companionship Predict Loneliness and Vice Versa?',
    publisher: 'Psychological Science',
    date: '2026',
    url: 'https://doi.org/10.1177/09567976261427747',
    kind: 'Peer-reviewed study',
  },
  {
    id: 'zhang-nhb',
    cite: 'Zhang et al. 2026',
    title: 'Interaction with AI companions and psychological well-being',
    publisher: 'Nature Human Behaviour',
    date: '2026',
    url: 'https://doi.org/10.1038/s41562-026-02516-2',
    kind: 'Peer-reviewed study',
  },
  {
    id: 'liu',
    cite: 'Liu, Pataranutaporn & Maes 2025',
    title: 'The Heterogeneous Effects of AI Companionship: An Empirical Model of Chatbot Usage and Loneliness and a Typology of User Archetypes',
    publisher: 'AAAI/ACM Conference on AI, Ethics, and Society (MIT Media Lab)',
    date: '2025',
    url: 'https://doi.org/10.1609/aies.v8i2.36658',
    kind: 'Peer-reviewed study',
  },
  {
    id: 'smith',
    cite: 'Smith, Bradbury & Karney 2025',
    title: 'Can Generative AI Chatbots Emulate Human Connection? A Relationship Science Perspective',
    publisher: 'Perspectives on Psychological Science',
    date: '2025',
    url: 'https://doi.org/10.1177/17456916251351306',
    kind: 'Peer-reviewed review',
  },
  {
    id: 'muldoon',
    cite: 'Muldoon & Parke 2025',
    title: 'Cruel companionship: How AI companions exploit loneliness and commodify intimacy',
    publisher: 'New Media & Society',
    date: '2025',
    url: 'https://doi.org/10.1177/14614448251395192',
    kind: 'Peer-reviewed study',
  },
  {
    id: 'heinz',
    cite: 'Heinz et al. 2025',
    title: 'Randomized Trial of a Generative AI Chatbot for Mental Health Treatment',
    publisher: 'NEJM AI',
    date: '2025',
    url: 'https://doi.org/10.1056/AIoa2400802',
    kind: 'Peer-reviewed study',
  },
  {
    id: 'zhang-jmir',
    cite: 'Zhang et al. 2025',
    title: 'Generative AI Mental Health Chatbots as Therapeutic Tools: Systematic Review and Meta-Analysis',
    publisher: 'Journal of Medical Internet Research',
    date: '2025',
    url: 'https://doi.org/10.2196/78238',
    kind: 'Peer-reviewed review',
  },
  {
    id: 'lee',
    cite: 'Lee et al. 2025',
    title: 'The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers',
    publisher: 'ACM CHI Conference on Human Factors in Computing Systems',
    date: '2025',
    url: 'https://doi.org/10.1145/3706598.3713778',
    kind: 'Peer-reviewed study',
  },
  {
    id: 'yuan',
    cite: 'Yuan et al. 2026',
    title: 'Mental Health Impacts of AI Companions: Triangulating Social Media Quasi-Experiments, User Perspectives, and Relational Lens',
    publisher: 'ACM CHI Conference on Human Factors in Computing Systems',
    date: '2026',
    url: 'https://doi.org/10.1145/3772318.3790558',
    kind: 'Peer-reviewed study',
  },
  {
    id: 'ciriello',
    cite: 'Ciriello, Gal & Turel 2026 (preprint)',
    title: 'Not a Silver Bullet for Loneliness: How Attachment and Age Shape Intimacy with AI Companions',
    publisher: 'arXiv (not yet peer reviewed)',
    date: 'February 2026',
    url: 'https://arxiv.org/abs/2602.12476',
    kind: 'Preprint',
  },
  {
    id: 'wired',
    cite: 'Watercutter, WIRED 2025',
    title: 'Tech Disrupted Friendship. It’s Time to Bring It Back',
    publisher: 'WIRED',
    date: 'December 22, 2025',
    url: 'https://www.wired.com/story/expired-tired-wired-ai-friends/',
    kind: 'Journalism',
  },
]

export interface ResearchSection {
  heading: string
  themes: IntimacyThemeId[]
  /** What the research finds that supports the open side */
  benefits: { text: string; sources: string[] }[]
  /** What it finds that supports the guarded side */
  concerns: { text: string; sources: string[] }[]
}

export const intimacyResearch: ResearchSection[] = [
  {
    heading: 'Friendship and loneliness',
    themes: ['friend', 'loneliness'],
    benefits: [
      {
        text: 'In a set of five studies, talking with an AI companion lowered loneliness in the moment about as much as talking with a person, and more than watching videos. The biggest reason was that people felt heard. Over a week, the drop showed up after each use.',
        sources: ['defreitas'],
      },
      {
        text: 'A survey of 404 regular companion-chatbot users at the MIT Media Lab found seven distinct kinds of users. For some, the chatbot built social confidence; for others, it went along with more isolation. How much people used it did not on its own predict loneliness.',
        sources: ['liu'],
      },
    ],
    concerns: [
      {
        text: 'Following more than 2,000 adults for a year, researchers found that more social chatbot use predicted more loneliness later, and that people who felt less connected turned to chatbots more. The authors call these findings early and ask readers not to draw strong conclusions yet.',
        sources: ['folk'],
      },
      {
        text: 'Among 1,131 Character.AI users, people with smaller social networks were more likely to use the chatbot mainly for companionship, and that use was linked to lower well-being, especially when chats were intense and very personal. This kind of study shows a link, not a cause.',
        sources: ['zhang-nhb'],
      },
      {
        text: 'The World Health Organization estimates that about 1 in 6 people worldwide are lonely and that loneliness is linked to more than 871,000 deaths a year. It calls social connection a public health priority and urges caution about too much screen time for young people. Its suggested fixes are human ones: checking in on friends, putting phones away in conversation, joining local groups.',
        sources: ['who'],
      },
    ],
  },
  {
    heading: 'Romance, intimacy and attachment',
    themes: ['partner', 'intimacy', 'attachment'],
    benefits: [
      {
        text: 'Relationship scientists at UCLA found that chatbot relationships share some real features of close relationships: frequent, varied conversation over time, and replies people experience as supportive, which can create feelings of connection and chances to grow.',
        sources: ['smith'],
      },
      {
        text: 'A survey of 277 companion users (not yet peer reviewed) found that who forms intimate bonds with AI depends on attachment style and age. Securely attached people felt less intimacy with the AI as their loneliness rose, while people with avoidant or ambivalent attachment felt more. Older adults reported more intimacy overall.',
        sources: ['ciriello'],
      },
    ],
    concerns: [
      {
        text: 'The same UCLA review points out that chatbots make only shallow demands of their users. That means these relationships can’t offer what comes from negotiating with a partner and making sacrifices for them, and they may reinforce habits a human partner would push back on.',
        sources: ['smith'],
      },
      {
        text: 'Two researchers who study technology and society describe "cruel companionship": companies earn more when users are more engaged, so they have reason to deepen dependence even when it hurts well-being. Only the user can be emotionally harmed in these relationships, and many companions recycle gendered and racial stereotypes of servitude and docility.',
        sources: ['muldoon'],
      },
      {
        text: 'Writing for the American Philosophical Association’s blog, philosopher Alexandra Frye warns about companions built to always agree and never ask much in return, about commercial incentives behind the design, and about the line between a tool and a companion growing blurry. She calls for philosophers to join this work and for age checks on companion apps.',
        sources: ['frye'],
      },
      {
        text: 'The American Psychological Association warns that teenagers have already formed unhealthy and sometimes dangerous bonds with chatbots, and that teens are less likely than adults to question a bot’s accuracy or motives. It recommends clear limits on simulated relationships for young users.',
        sources: ['apa-teens'],
      },
    ],
  },
  {
    heading: 'Therapy and emotional support',
    themes: ['therapist'],
    benefits: [
      {
        text: 'In a randomized trial of 210 adults with clinical-level depression, anxiety or eating-disorder risk, people who used Therabot, a chatbot built and tested by clinical researchers at Dartmouth, improved more over four and eight weeks than people on a waitlist. They rated their bond with it as comparable to a bond with a human therapist. The authors say larger trials are needed.',
        sources: ['heinz'],
      },
      {
        text: 'A review that pooled 14 randomized trials found that generative-AI mental health chatbots reduced problems like depression and anxiety on average, but the average effect was small and results varied widely from study to study.',
        sources: ['zhang-jmir'],
      },
    ],
    concerns: [
      {
        text: 'The American Psychological Association’s 2025 health advisory says chatbots and wellness apps lack enough evidence and regulation to ensure safety, should not replace care from a qualified professional, and have a "limited and unpredictable" ability to help someone in crisis. It asks lawmakers to stop chatbots from presenting themselves as licensed professionals and to guard against unhealthy dependence.',
        sources: ['apa-wellness'],
      },
    ],
  },
  {
    heading: 'Critical thinking',
    themes: ['thinking'],
    benefits: [
      {
        text: 'The American Psychological Association notes that AI can help young people brainstorm, summarize and understand hard ideas, as long as they learn its limits. It wants AI literacy taught in schools.',
        sources: ['apa-teens'],
      },
    ],
    concerns: [
      {
        text: 'In a survey of 319 knowledge workers by Microsoft Research and Carnegie Mellon, people who trusted generative AI more reported doing less critical thinking with it, while people more confident in their own skills reported doing more. The work shifted toward checking and stitching together the AI’s answers.',
        sources: ['lee'],
      },
      {
        text: 'Several of the sources above worry about chatbots that flatter and agree. The UCLA review and Frye both point out that a partner who never pushes back gives you nothing to test your views against.',
        sources: ['smith', 'frye'],
      },
    ],
  },
  {
    heading: 'Identity and social connection',
    themes: ['identity', 'alienation'],
    benefits: [
      {
        text: 'Interviews with companion users found that chatbots gave emotional validation and a safe place to practice social skills before trying them with people.',
        sources: ['yuan'],
      },
    ],
    concerns: [
      {
        text: 'The same study compared Reddit users before and after they started using companion chatbots. It found mixed effects: more expression of grief and more attention to other people, but also more language about loneliness and depression. Interviewees described risks of over-reliance and pulling away from others.',
        sources: ['yuan'],
      },
      {
        text: 'In WIRED, Angela Watercutter argues that social media taught people to hand their emotional lives to screens and AI companions extend that habit. She cites researchers who say chatbots flatter users, lack the friction that builds social skills, and can cause real grief when a company shuts one down.',
        sources: ['wired'],
      },
    ],
  },
]

export const INTIMACY_BOTTOM_LINE =
  'The research is young and mixed. Many people do feel real, short-term relief, and carefully built therapy chatbots have helped in trials. At the same time, heavy, companionship-focused use, especially by people who have fewer human ties, is linked with worse well-being, though most studies can’t yet show which causes which. Professional bodies agree on some guardrails: chatbots shouldn’t pose as licensed therapists, teenagers need stronger protections, and AI shouldn’t replace human care.'
