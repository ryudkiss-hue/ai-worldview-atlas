# Language guide for the AI Worldview Atlas

The Atlas is read by people who don't follow AI debates for a living. Earlier versions borrowed much of their vocabulary from those debates: pole names such as "Substrate Exceptionalism", movement slang such as "Doomer" and "e/acc", and labels such as "AI-Optimist Boomer". This guide sets the rules every statement, label and report now follows. Each rule comes from a published source, listed at the end.

## 1. Use words people already use

- Write for a general reader, in plain, concrete words. Survey researchers warn that jargon and unfamiliar terms confuse respondents and make answers hard to read [Pew].
- Explain a technical term the first time it appears, or replace it. Say "computing power", not "compute". Say "AI that matches or beats people at most tasks", not "AGI", and don't use "AGI" again after that [AP via Hofstra].
- Leave out the in-group names of tech movements (e/acc, doomer, x-risk, p(doom), longtermist, TESCREAL) unless the text is quoting or explaining them. These terms carry a side's framing with them; critics such as Gebru and Torres treat them as a bundle of ideologies, and supporters use them as badges [Gebru & Torres].
- One idea per statement, no double negatives, no emotionally loaded words [Pew].

## 2. Describe AI systems as products built and run by people

- Don't give AI systems human traits as if they were settled facts. The AP Stylebook says to "avoid language that attributes human characteristics to these systems, since they do not have thoughts or feelings" and not to use gendered pronouns for them [AP via Hofstra].
- Describe what a system does as outputs: "a chatbot produces text saying it is upset", not "a chatbot says it is upset". Put responsibility on the companies that design and release systems [EPIC].
- Where a statement asks whether a system could ever have experiences or be owed anything, ask it as an open question about a possibility. Never build the answer into the wording ("an AI that asks to keep its memories" assumes something the question is meant to test) [Hasan, APA Blog].
- Present-day statements describe today's products. Long-run statements start from an explicit condition ("If a future AI system could feel pain, ...").
- Anthropomorphic wording doesn't affect everyone the same way, and its effect on trust depends on the setting [Inie et al.; Cohn et al.]. That is a reason to keep wording neutral across mirrored pairs, so neither side gets the more humanlike phrasing.

## 3. Describe people the way they would describe themselves

- Name a group by what its members do, believe or have at stake, at the level of detail that matters, and use terms people use for themselves [APA Style].
- No caricature or pejorative labels in any form: no "Doomer", "Conspiracist", "Extremely Online", "Boomer" or "Gen Z" used as a type [APA Style].
- Don't treat one group as the default and others as deviations [APA Style].
- Stakeholder tags are first-person statements a reader can check against their own life ("My job could be automated").

## 4. Start from how AI affects people now

- The sources this project draws on (the American Psychological Association, the World Health Organization, peer-reviewed research and WIRED) mostly discuss AI through its present effects on people: work, privacy, mental health, relationships, the environment and who holds power. Most near-term statements are grounded in a situation like that.
- Long-run questions stay, because some views about AI really are about the long run, but they are written plainly, as conditions and choices, not as forecasts.

## 5. Reports and longer prose

- Same rules, plus the project's writing checklist: plain is/are/has sentences, no grand claims about significance, no "not X, but Y" flips, no inflated register.
- The Summary Report describes a viewpoint in the second person ("you") as a set of reasons a real person could hold, including its strongest objections, and opens with a note that the reader's own reasons may differ. The longer "Case for This View" is reported in the third person (see section 6).

## 6. Footing, quantity and rhythm

- Attribute positions to the people who hold them. The case for each viewpoint is reported in the third person ("supporters think", "supporters reply that"), because the app has no stake in any position and shouldn't speak as "we" on a movement's behalf. Replies to objections follow the same rule; they never coach the reader with "You can answer that...". In Goffman's terms (*Forms of Talk*, 1981), the app is the animator, and the principal whose commitments a sentence states should be a real group of people.
- Give information, and leave advice out. Report sections point to sources and to related viewpoints and describe what each contains; they don't tell the reader what to read, test or decide.
- Say as much as the reader needs and no more. Name a familiar mechanism instead of narrating how it works.
- Keep one register inside a sentence or passage, and don't mix a literal spatial description (a scale, an axis, a chart) with a spatial idiom ("where they stand"). Headings that sit above the axis chart say "position" for that reason.
- Vary sentence length and let subordinate clauses carry reasons and conditions ("because", "although", "which means"). Runs of three or more short independent sentences in a row get combined, and lists of options don't end in a tidy recommendation.

## Sources

- [APA Style] American Psychological Association, "General principles for reducing bias", APA Style. https://apastyle.apa.org/style-grammar-guidelines/bias-free-language/general-principles
- [AP via Hofstra] Hofstra University Editorial Style Guide, "AI – Artificial Intelligence" (selected entries from The Associated Press Stylebook). https://sites.google.com/hofstra.edu/style-guide/topical-guides/ai-artificial-intelligence
- [EPIC] Kara Williams and Mayu Tobin-Miyaji, "A New Year's Resolution for Everyone: Stop Talking about Generative AI Like It Is Human", Electronic Privacy Information Center, January 8, 2026. https://epic.org/a-new-years-resolution-for-everyone-stop-talking-about-generative-ai-like-it-is-human/
- [Hasan, APA Blog] Ali Hasan, "Are You Anthropomorphizing AI?", Blog of the American Philosophical Association, August 20, 2024. https://blog.apaonline.org/2024/08/20/are-you-anthropomorphizing-ai-2/
- [Pew] Pew Research Center, "Writing Survey Questions". https://www.pewresearch.org/writing-survey-questions/
- [Inie et al.] Nanna Inie, Stefania Druga, Peter Zukerman and Emily M. Bender, "From 'AI' to Probabilistic Automation: How Does Anthropomorphization of Technical Systems Descriptions Influence Trust?", ACM FAccT 2024. https://doi.org/10.1145/3630106.3659040
- [Cohn et al.] Michelle Cohn et al., "Believing Anthropomorphism: Examining the Role of Anthropomorphic Cues on Trust in Large Language Models", CHI 2024 Extended Abstracts. https://doi.org/10.1145/3613905.3650818
- [Gebru & Torres] Timnit Gebru and Émile P. Torres, "The TESCREAL bundle: Eugenics and the promise of utopia through artificial general intelligence", First Monday, 2024. https://doi.org/10.5210/fm.v29i4.13636
- The synthetic-intimacy module's sources (American Psychological Association advisories, WHO, WIRED and peer-reviewed studies) are listed in `src/data/intimacyModule.ts`.
