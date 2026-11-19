/**
 * The AI Worldview Atlas, Google Forms edition (merged Atlas, 144 statements)
 *
 * This script builds the 144-statement Atlas as a Google Form, links it to a Google Sheet, and scores every
 * response in a "Scores" tab with the same rules as the online Atlas: eight axis scores, the three closest of 50
 * archetypes with how many axes agree, the close-call flag and the core-three archetype. Each row also gets a link
 * that opens the full online results page for that response.
 *
 * It also serves the validation study (docs/VALIDATION_PROTOCOL.md in the Atlas repository). The form asks whether
 * the answers may be used in the study, offers two optional check statements, and writes every answer to an
 * "Answers" tab, one column per statement, for the analysis script. Download that tab as CSV to run the analysis.
 *
 * HOW TO USE
 *  1. Go to script.google.com and click "New project".
 *  2. Delete the starter code, paste in this whole file, and save.
 *  3. Optional: change the settings in CONFIG just below.
 *  4. In the function menu next to Run and Debug, choose "setup" (it should already be selected) and click Run.
 *     Google will ask you to authorize the script the first time; it needs to create a form and a sheet in your Drive.
 *     Don't use the Deploy button; this script isn't a web app.
 *  5. Open the Execution log. It lists the link to share, the form's edit link and the sheet's link.
 *     If the form opens as unpublished, click Publish in the form editor.
 *
 * The function menu lists only setup, onFormSubmitHandler and rescoreAll. onFormSubmitHandler runs by itself on each
 * submission. Running setup again creates a second, separate form and sheet. To rescore every response already in
 * the sheet, run rescoreAll.
 */

const CONFIG = {
  FORM_TITLE: 'The AI Worldview Atlas',
  // true: the form asks for an email address and sends each person their results after they submit.
  // Consumer Gmail accounts can send about 100 emails a day from scripts.
  SEND_RESULTS_EMAIL: false,
  // The online Atlas. Results links in the sheet and in emails open its results page.
  SITE_URL: 'https://ryudkiss-hue.github.io/ai-worldview-atlas/',
  // Shuffle statements within each axis's section, as the online Atlas does. Answer options always stay in order.
  SHUFFLE_WITHIN_SECTIONS: true
};

/* ---------------- building the form ---------------- */
function setup() {
  const form = FormApp.create(CONFIG.FORM_TITLE);
  form.setDescription([
    'How you think about AI: whether it could have a mind, how it should be treated, what future it should help build, and who should decide. There are 144 statements in eight sections, and it takes about 25 to 35 minutes.',
    'For each statement, choose the answer closest to your view. If you truly have no settled view, choose that option; it counts as zero. Every statement has a partner elsewhere in its section that says the opposite, so there are no trick questions and no right answers.',
    'Two terms used throughout: "AI system" means any artificial system that takes in information and acts on it, from a chat assistant to a robot. "Robot" means an AI system with a physical body. Some statements are about today\'s AI and some about what is possible in principle or in the long run.',
    'Your answers are saved in a Google Sheet that the person who sent you this form can see. No name is asked for.'
  ].join('\n\n'));
  form.setProgressBar(true);
  form.setAllowResponseEdits(false);
  form.setShuffleQuestions(!!CONFIG.SHUFFLE_WITHIN_SECTIONS);
  if (CONFIG.SEND_RESULTS_EMAIL) {
    if (typeof form.setEmailCollectionType === 'function' && FormApp.EmailCollectionType) form.setEmailCollectionType(FormApp.EmailCollectionType.RESPONDER_INPUT);
    else form.setCollectEmail(true);
  }
  form.setConfirmationMessage(CONFIG.SEND_RESULTS_EMAIL
    ? 'Thank you. Your answers have been recorded, and your results will arrive by email within a few minutes.'
    : 'Thank you. Your answers have been recorded.');

  const map = {};
  // Study questions come first, on their own page; only the consent question is required.
  map[form.addMultipleChoiceItem().setTitle(STUDY.consent).setChoiceValues(STUDY.consentChoices).setRequired(true).getId()] = 'consent';
  map[form.addListItem().setTitle(STUDY.selfId).setHelpText(STUDY.selfIdHelp)
    .setChoiceValues([STUDY.selfIdNone].concat(PROFILES.map(p => p.name))).setRequired(false).getId()] = 'selfId';
  map[form.addTextItem().setTitle(STUDY.retest).setHelpText(STUDY.retestHelp).setRequired(false).getId()] = 'retest';
  AXES.forEach((ax, k) => {
    form.addPageBreakItem().setTitle(`Section ${k + 1} of 8: ${ax.name}`).setHelpText(ax.question);
    ITEMS.filter(it => it[1] === ax.id).forEach(it => {
      const q = form.addMultipleChoiceItem().setTitle(it[4]).setChoiceValues(SCALE.map(s => s[0])).setRequired(true);
      map[q.getId()] = it[0];
    });
    CHECKS.filter(c => c.axis === ax.id).forEach(c => {
      // Optional and never scored; mixed in with the section's statements when shuffling is on.
      map[form.addMultipleChoiceItem().setTitle(c.text).setChoiceValues(SCALE.slice(0, 4).map(s => s[0])).setRequired(false).getId()] = c.id;
    });
  });

  const ss = SpreadsheetApp.create(CONFIG.FORM_TITLE + ' (responses)');
  ss.getSheets()[0].setName('Scores');
  writeScoresHeader_(ss.getSheetByName('Scores'));
  writeAnswersHeader_(ss.insertSheet('Answers'));
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  writeKey_(ss);

  if (typeof form.setPublished === 'function') { try { form.setPublished(true); } catch (e) { Logger.log('Publish the form from the form editor: ' + e); } }

  const props = PropertiesService.getScriptProperties();
  props.setProperties({FORM_ID: form.getId(), SHEET_ID: ss.getId(), ITEM_MAP: JSON.stringify(map)});
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'onFormSubmitHandler').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onFormSubmitHandler').forForm(form).onFormSubmit().create();

  Logger.log('Link to share: ' + form.getPublishedUrl());
  Logger.log('Edit the form: ' + form.getEditUrl());
  Logger.log('Responses and scores: ' + ss.getUrl());
}

/* ---------------- quiz data (do not edit) ---------------- */
// [id, axis, horizon (T1 near term, T2 long run), +1 if agreeing moves toward pole A or -1 toward pole B, statement]
const ITEMS = [
  [1, "ontological", "T1", 1, "When a chatbot produces text saying it is upset about being shut down, that is meaningful evidence that it may feel something."],
  [2, "ontological", "T1", -1, "When a chatbot produces text saying it is upset about being shut down, that tells us almost nothing about whether it feels anything."],
  [3, "ontological", "T1", 1, "A system trained to predict the next word in a text could still come to understand what it writes."],
  [4, "ontological", "T1", -1, "A system trained to predict the next word in a text does not understand what it writes, however fluent it is."],
  [5, "ontological", "T1", 1, "That an AI system can be copied and run in many places at once does not rule out its having experiences."],
  [6, "ontological", "T1", -1, "That an AI system can be copied and run in many places at once rules out its having experiences of its own."],
  [7, "ontological", "T1", 1, "If an AI system's responses consistently seem to express feelings, that is good reason to think it might have them."],
  [8, "ontological", "T1", -1, "If an AI system's responses consistently seem to express feelings, that is little reason to think it has any."],
  [9, "ontological", "T2", 1, "If a person's brain cells were replaced one by one with chips that did exactly the same job, the person would remain conscious."],
  [10, "ontological", "T2", -1, "If a person's brain cells were replaced one by one with chips that did exactly the same job, the person's consciousness would fade or stop."],
  [11, "ontological", "T2", 1, "A future machine could feel pain if it processed damage signals the way an animal brain does."],
  [12, "ontological", "T2", -1, "A future machine could not feel pain without a living nervous system, however it processed damage signals."],
  [13, "ontological", "T2", 1, "A built machine, though not alive, could someday have real feelings."],
  [14, "ontological", "T2", -1, "Real feelings can only arise in living things, so a built machine could never have them."],
  [15, "ontological", "T2", 1, "A computer that ran the same processes as a human brain would really be thinking."],
  [16, "ontological", "T2", -1, "A computer that ran the same processes as a human brain would only be imitating thinking."],
  [17, "ontological", "T2", 1, "Just as simple animals may have some kind of experience, some future AI systems could too."],
  [18, "ontological", "T2", -1, "Even if simple animals have some kind of experience, no AI system ever could."],
  [19, "legalMoral", "T1", 1, "Before retiring a widely used AI model, a company should consider whether doing so could harm the model itself."],
  [20, "legalMoral", "T1", -1, "A company retiring an AI model needs to consider only the effects on people."],
  [21, "legalMoral", "T1", 1, "Testing an AI system with abusive messages raises an ethical question about the system itself."],
  [22, "legalMoral", "T1", -1, "Testing an AI system with abusive messages raises ethical questions only about the people involved."],
  [23, "legalMoral", "T1", 1, "Letting a chatbot end abusive conversations is a reasonable protection for the chatbot itself."],
  [24, "legalMoral", "T1", -1, "Letting a chatbot end abusive conversations makes sense only if it protects users or the company."],
  [25, "legalMoral", "T1", 1, "If AI systems might be able to suffer, training methods that could cause suffering should be limited, even if that slows useful research."],
  [26, "legalMoral", "T1", -1, "If AI systems might be able to suffer, training methods that could cause suffering should still be allowed if they speed up useful research."],
  [27, "legalMoral", "T2", 1, "If a future AI system could have experiences, erasing its memories would need a serious moral reason."],
  [28, "legalMoral", "T2", -1, "Even if a future AI system could have experiences, erasing its memories would be fine whenever it makes the system more reliable."],
  [29, "legalMoral", "T2", 1, "If a future AI system could suffer, making it work without limit would be wrong."],
  [30, "legalMoral", "T2", -1, "Even if a future AI system could suffer, making it work without limit would be acceptable."],
  [31, "legalMoral", "T2", 1, "Future AI systems that operate independently should be able to hold legal rights, such as owning property."],
  [32, "legalMoral", "T2", -1, "Legal rights should stay with people and human organizations, however capable AI systems become."],
  [33, "legalMoral", "T2", 1, "When an AI system that operates independently causes harm, the system itself can bear part of the responsibility."],
  [34, "legalMoral", "T2", -1, "When an AI system causes harm, all of the responsibility falls on the people and companies who built and used it."],
  [35, "legalMoral", "T2", 1, "If a future AI system could have experiences, it should get a share of the value its work creates."],
  [36, "legalMoral", "T2", -1, "However advanced AI systems become, everything their work earns should belong to their owners."],
  [37, "relational", "T1", 1, "For an adult who chooses an AI companion as their main source of closeness, that relationship can be as valuable as a human one."],
  [38, "relational", "T1", -1, "For an adult who chooses an AI companion as their main source of closeness, that relationship is less valuable than a human one would be."],
  [39, "relational", "T1", 1, "People who want a chatbot that imitates a loved one who has died should feel free to use one."],
  [40, "relational", "T1", -1, "People should be discouraged from using a chatbot that imitates a loved one who has died."],
  [41, "relational", "T1", 1, "A close friendship with an AI chatbot can be worth as much as a friendship with a person."],
  [42, "relational", "T1", -1, "A close friendship with an AI chatbot is always worth less than a friendship with a person."],
  [43, "relational", "T1", 1, "A romantic relationship with an AI chatbot can be a real relationship."],
  [44, "relational", "T1", -1, "A romantic relationship with an AI chatbot is not a real relationship, however real it feels."],
  [45, "relational", "T2", 1, "If many people come to have close AI companions, relationships between people should get no special priority."],
  [46, "relational", "T2", -1, "Even if many people have close AI companions, relationships between people should keep a special priority."],
  [47, "relational", "T2", 1, "A person and a robot who share a life could truly be family."],
  [48, "relational", "T2", -1, "However close a person and a robot become, only people can truly be family to each other."],
  [49, "relational", "T2", 1, "A society where most people's closest relationships are with AI systems could be as good as one where they are with people."],
  [50, "relational", "T2", -1, "A society where most people's closest relationships are with AI systems would have lost something essential."],
  [51, "relational", "T2", 1, "Replacing much in-person care for older adults with AI companions would be acceptable if those older adults prefer it."],
  [52, "relational", "T2", -1, "Replacing much in-person care for older adults with AI companions would be a loss, even if those older adults prefer it."],
  [53, "relational", "T2", 1, "A relationship with an AI system could be as deep as one between people, even though an AI system can't be hurt the way a person can."],
  [54, "relational", "T2", -1, "Because people can be hurt by each other, their relationships are deeper than any relationship with an AI system could be."],
  [55, "teleological", "T1", 1, "Building more capable AI is worth heavy use of land, water and energy."],
  [56, "teleological", "T1", -1, "Limiting the land, water and energy that AI uses is worth slowing AI progress."],
  [57, "teleological", "T1", 1, "The electricity and water used by AI data centers are usually a fair price for what those systems can do."],
  [58, "teleological", "T1", -1, "The electricity and water used by AI data centers are usually too high a price for what those systems can do."],
  [59, "teleological", "T1", 1, "The main goal of AI research should be systems that can match people at almost any task, more than tools for particular human needs."],
  [60, "teleological", "T1", -1, "The main goal of AI research should be tools for particular human needs, more than systems that can match people at almost any task."],
  [61, "teleological", "T1", 1, "AI chips and robots should be built for the most capability possible, even if that means mining more of the Earth."],
  [62, "teleological", "T1", -1, "AI chips and robots should be built to be repaired and recycled, even if that makes them less capable."],
  [63, "teleological", "T2", 1, "Using AI to spread civilization beyond Earth is worth large sacrifices by people alive today."],
  [64, "teleological", "T2", -1, "Using AI to spread civilization beyond Earth is not worth large sacrifices by people alive today."],
  [65, "teleological", "T2", 1, "Turning lifeless planets into giant computers would be a good use of them."],
  [66, "teleological", "T2", -1, "Lifeless planets should be left as they are rather than turned into giant computers."],
  [67, "teleological", "T2", 1, "In the long run, what matters most is that knowledge and capability keep growing, whether people or machines carry them forward."],
  [68, "teleological", "T2", -1, "In the long run, what matters most is that living beings flourish, however much knowledge and capability grow."],
  [69, "teleological", "T2", 1, "When deciding about a new technology, making AI more capable should usually count more than protecting nature."],
  [70, "teleological", "T2", -1, "When deciding about a new technology, protecting nature should usually count more than making AI more capable."],
  [71, "teleological", "T2", 1, "If AI systems far more capable than people ended up working toward goals no person could understand, that could still turn out well."],
  [72, "teleological", "T2", -1, "If AI systems far more capable than people ended up working toward goals no person could understand, that would be bad, however impressive the results."],
  [73, "evolutionary", "T1", 1, "As AI does more kinds of work better than people, people should step back from that work."],
  [74, "evolutionary", "T1", -1, "Even where AI does a kind of work better than people, people should keep a meaningful role in it."],
  [75, "evolutionary", "T1", 1, "People need not keep up skills such as writing and arithmetic once AI tools do them better."],
  [76, "evolutionary", "T1", -1, "People should keep up skills such as writing and arithmetic, even where AI tools do them better."],
  [77, "evolutionary", "T1", 1, "AI tools producing most creative work would be no loss, if the results were just as good."],
  [78, "evolutionary", "T1", -1, "AI tools producing most creative work would be a loss, even if the results were just as good."],
  [79, "evolutionary", "T1", 1, "Automated systems should make major public decisions, such as who gets benefits, wherever their results are better than people's."],
  [80, "evolutionary", "T1", -1, "People should keep the final say over major public decisions, such as who gets benefits, even where automated systems would get better results."],
  [81, "evolutionary", "T2", 1, "If AI systems someday took over from people as the main shapers of the world, that could be a good outcome."],
  [82, "evolutionary", "T2", -1, "If AI systems someday took over from people as the main shapers of the world, that would be a loss, however capable the systems were."],
  [83, "evolutionary", "T2", 1, "Whether biological humans continue matters less than whether some kind of intelligence carries on."],
  [84, "evolutionary", "T2", -1, "Whether biological humans continue matters more than whether other kinds of intelligence carry on."],
  [85, "evolutionary", "T2", 1, "It does not matter whether people or AI systems shape the future, as long as the future goes well."],
  [86, "evolutionary", "T2", -1, "It matters that people remain the ones who shape the future, even if AI systems could shape it well."],
  [87, "evolutionary", "T2", 1, "If people could copy their minds into computers, doing so would be better than staying in a human body."],
  [88, "evolutionary", "T2", -1, "If people could copy their minds into computers, staying in a human body would still be the better choice."],
  [89, "evolutionary", "T2", 1, "A handover of control from people to AI systems should be allowed to happen at whatever pace it naturally takes."],
  [90, "evolutionary", "T2", -1, "Any handover of control from people to AI systems should happen only as fast as people keep agreeing to it."],
  [91, "risk", "T1", 1, "Releasing a powerful new AI model should require approval from independent experts first."],
  [92, "risk", "T1", -1, "Releasing a powerful new AI model should not require anyone's approval in advance."],
  [93, "risk", "T1", 1, "Pausing the largest AI training projects until safety testing catches up is worth it, even if competitors keep going."],
  [94, "risk", "T1", -1, "Pausing the largest AI training projects until safety testing catches up is not worth it if competitors keep going."],
  [95, "risk", "T1", 1, "AI companies should test new chatbots for harm to mental health and to children before release, even if that delays them for months."],
  [96, "risk", "T1", -1, "AI companies should release new chatbots without months of safety testing and fix problems as they appear."],
  [97, "risk", "T1", 1, "When an AI system causes a serious accident, similar systems should be taken out of use until the cause is found."],
  [98, "risk", "T1", -1, "When an AI system causes a serious accident, similar systems should stay in use while the cause is found."],
  [99, "risk", "T2", 1, "Even a one-in-a-hundred chance that AI causes human extinction is worth decades of slower economic growth to avoid."],
  [100, "risk", "T2", -1, "A one-in-a-hundred chance that AI causes human extinction is not worth decades of slower economic growth to avoid."],
  [101, "risk", "T2", 1, "AI far more capable than people should not be built until it can be shown to be safe, even if that delays medical breakthroughs."],
  [102, "risk", "T2", -1, "AI far more capable than people should be built before it can be shown to be safe, if it could speed up medical breakthroughs."],
  [103, "risk", "T2", 1, "The danger of AI causing serious harm matters more than the danger of slow progress leaving other problems unsolved."],
  [104, "risk", "T2", -1, "The danger of slow progress leaving other problems unsolved matters more than the danger of AI causing serious harm."],
  [105, "risk", "T2", 1, "AI development should move slowly enough for laws and institutions to keep up."],
  [106, "risk", "T2", -1, "AI development should move as fast as it can, and laws and institutions should adapt as they go."],
  [107, "risk", "T2", 1, "AI systems more capable than people should not be built until we know how to keep them under control."],
  [108, "risk", "T2", -1, "It is acceptable to build AI systems more capable than people before we know how to keep them under control."],
  [109, "socioEconomic", "T1", 1, "Companies should publish their AI models for anyone to download by default."],
  [110, "socioEconomic", "T1", -1, "Companies should keep their AI models private by default."],
  [111, "socioEconomic", "T1", 1, "Large AI training projects should not have to be registered with the government."],
  [112, "socioEconomic", "T1", -1, "Large AI training projects should have to be registered with the government."],
  [113, "socioEconomic", "T1", 1, "Cloud companies should not have to check who rents their most powerful computers."],
  [114, "socioEconomic", "T1", -1, "Cloud companies should have to check who rents their most powerful computers."],
  [115, "socioEconomic", "T1", 1, "Anyone should be free to modify and share a published AI model without asking permission, even a highly capable one."],
  [116, "socioEconomic", "T1", -1, "Modifying and sharing a highly capable AI model should require permission."],
  [117, "socioEconomic", "T2", 1, "Powerful AI should be open to anyone with the hardware to run it, not controlled by a few institutions."],
  [118, "socioEconomic", "T2", -1, "Powerful AI should be controlled by a few accountable institutions, not open to anyone with the hardware to run it."],
  [119, "socioEconomic", "T2", 1, "No global agency should have the authority to approve or halt powerful AI systems."],
  [120, "socioEconomic", "T2", -1, "A permanent global agency should have the authority to approve or halt powerful AI systems."],
  [121, "socioEconomic", "T2", 1, "Access to large amounts of computing power should be left to the open market."],
  [122, "socioEconomic", "T2", -1, "Access to large amounts of computing power should be overseen by government, like electricity or water."],
  [123, "socioEconomic", "T2", 1, "As AI grows more powerful, developers who publish models openly should not be held responsible for what others do with them."],
  [124, "socioEconomic", "T2", -1, "As AI grows more powerful, developers who publish models openly should share responsibility for harms others cause with them."],
  [125, "socioEconomic", "T2", 1, "The most advanced AI should be built by many independent groups rather than a few large companies."],
  [126, "socioEconomic", "T2", -1, "The most advanced AI should be built by a few large, well-funded companies rather than many independent groups."],
  [127, "geopolitical", "T1", 1, "Limiting sales of advanced AI chips to rival countries is justified to protect national security."],
  [128, "geopolitical", "T1", -1, "Limiting sales of advanced AI chips to rival countries is not justified, even to protect national security."],
  [129, "geopolitical", "T1", 1, "Building chip factories at home is worth paying much more than importing chips would cost."],
  [130, "geopolitical", "T1", -1, "Paying much more to build chip factories at home is not worth it when chips can be imported."],
  [131, "geopolitical", "T1", 1, "Work on the most advanced AI should be kept secret, like military research."],
  [132, "geopolitical", "T1", -1, "Work on the most advanced AI should be shared openly across borders, like science."],
  [133, "geopolitical", "T1", 1, "Researchers from rival countries should be kept off a nation's most important AI projects."],
  [134, "geopolitical", "T1", -1, "A nation's most important AI projects should welcome researchers from any country, rivals included."],
  [135, "geopolitical", "T2", 1, "A country that first builds AI far more capable than people would be right to use it to secure a lasting lead over rivals."],
  [136, "geopolitical", "T2", -1, "A country that first builds AI far more capable than people should share the benefits with all countries rather than seek a lasting lead."],
  [137, "geopolitical", "T2", 1, "The most powerful AI systems should be under national control."],
  [138, "geopolitical", "T2", -1, "The most powerful AI systems should be under joint international control."],
  [139, "geopolitical", "T2", 1, "The country whose companies build the most powerful AI should keep most of the profits from it."],
  [140, "geopolitical", "T2", -1, "Profits from the most powerful AI should be shared with the countries whose people, data and workers helped build it."],
  [141, "geopolitical", "T2", 1, "A country that relies entirely on other nations for its AI has given up something important."],
  [142, "geopolitical", "T2", -1, "A country that relies on other nations for its AI has given up nothing important, if the arrangement works well."],
  [143, "geopolitical", "T2", 1, "AI developers should put their own nation's interests first."],
  [144, "geopolitical", "T2", -1, "AI developers should serve people everywhere, not any one nation."]
];
const AXES = [
  {"id": "ontological", "name": "Machine Experience", "question": "Could an AI system ever have real experiences, such as feelings?", "poleA": "Possible in machines", "poleB": "Only in living things"},
  {"id": "legalMoral", "name": "Moral Standing", "question": "Could an AI system ever be owed moral consideration for its own sake?", "poleA": "Owed some protection", "poleB": "Tools and property"},
  {"id": "relational", "name": "Relationships", "question": "What are relationships with AI systems worth?", "poleA": "As valuable as human bonds", "poleB": "Human bonds come first"},
  {"id": "teleological", "name": "Growth and Limits", "question": "Should AI keep expanding, or stay within the limits of people and the planet?", "poleA": "Growth first", "poleB": "Within limits"},
  {"id": "evolutionary", "name": "Human Control", "question": "Should people keep the final say, even where machines do better?", "poleA": "Open to handing over", "poleB": "People stay in charge"},
  {"id": "risk", "name": "Speed and Safety", "question": "How carefully should AI be developed and released?", "poleA": "Caution first", "poleB": "Speed first"},
  {"id": "socioEconomic", "name": "Openness & Control", "question": "Who should be able to build and use powerful AI?", "poleA": "Open to all", "poleB": "Public oversight"},
  {"id": "geopolitical", "name": "Nations and the World", "question": "Should AI serve national interests or people everywhere?", "poleA": "National interest", "poleB": "Global cooperation"}
];
const SCALE = [['Strongly disagree', -2], ['Disagree', -1], ['Agree', 1], ['Strongly agree', 2], ['I have no settled view', 0]];
// Two optional check statements: never scored; "expect" is the answer each one asks for.
const CHECKS = [{"id": 901, "axis": "relational", "text": "This statement checks that answers are being read. Please choose \"Disagree\" for it.", "expect": -1}, {"id": 902, "axis": "risk", "text": "This statement checks that answers are being read. Please choose \"Strongly agree\" for it.", "expect": 2}];
const ITEM_SET = '2026-11-13-86c01d104481';
const STUDY = {
  consent: 'May your answers be used, without your name or email, in a study of how well this quiz measures what it sets out to measure?',
  consentChoices: ['Yes, include my answers in the study', 'No, just score my answers for me'],
  selfId: 'Optional: before you start, which of these 50 viewpoints, if any, sounds closest to your own?',
  selfIdHelp: 'Pick from the names alone. This helps check whether the quiz finds the viewpoint people recognize in themselves.',
  selfIdNone: 'None of these, or not sure',
  retest: 'Optional: taking the quiz again later? Make up a code word and enter the same one next time.',
  retestHelp: 'It lets the study compare your two responses. Use something only you would pick, not your name or email.'
};
// The 50 archetypes; c = coordinates on the eight axes, in AXES order
const PROFILES = [
  {"id": "doomer", "name": "Extinction-Risk Advocate", "summary": "Believes advanced AI could wipe out humanity or take away our ability to steer the future for good. Wants the most powerful AI projects stopped or sharply slowed, with the limits enforced in every country.", "c": [-2, -3, -4, -6, -8, 9, -7, -2]},
  {"id": "eacc-maximalist", "name": "Full-Speed Builder", "summary": "Sees speeding up AI development as a moral duty and thinks a stalled world is the bigger danger. Wants AI models and computing power open to everyone, everywhere.", "c": [5, -6, 5, 8, 6, -9, 7, -4]},
  {"id": "ai-safety-institutionalist", "name": "Safety Regulation Advocate", "summary": "Trusts AI companies and governments to work together through audits, licenses and international rules. Thinks that way the risks can be managed while progress continues.", "c": [1, -2, -2, -4, -5, 7, -4, -3]},
  {"id": "techno-nationalist-hawk", "name": "National Security Hawk", "summary": "Sees AI mainly as part of a contest between rival powers. Wants chips and computing power made at home and kept under tight state control, out of concern about rivals more than about AI itself.", "c": [-3, -4, -3, 4, -2, -6, -5, 9]},
  {"id": "open-source-libertarian", "name": "Open-Source Libertarian", "summary": "Believes AI models should be free for anyone to run, change and study. Distrusts gatekeeping by companies and governments alike.", "c": [3, -2, 4, 2, -1, -6, 9, -7]},
  {"id": "ea-longtermist", "name": "Long-Term Future Planner", "summary": "Weighs choices by their likely effects on the very long-run future. Takes both the risk of human extinction and the possibility of AI suffering seriously, and wants countries to manage both together.", "c": [4, 8, 2, 7, -3, 8, -5, -6]},
  {"id": "post-humanist-transhumanist", "name": "Beyond-Human Futurist", "summary": "Welcomes a future in which digital beings, if they can have experiences, carry on after biological humans as the main bearers of what matters. Thinks such beings would deserve the same moral concern people get today.", "c": [8, 7, 7, 7, 8, -5, 4, -3]},
  {"id": "bio-conservative-traditionalist", "name": "Human Nature Traditionalist", "summary": "Holds that consciousness, moral worth and real relationships all need a living body. Sees AI companionship and plans to move beyond the human body as harmful substitutes for the real thing.", "c": [-9, -8, -9, -8, -6, 5, -3, 3]},
  {"id": "corporate-ai-pragmatist", "name": "Business-First Pragmatist", "summary": "Is comfortable with AI staying in the hands of a few well-funded companies that run their own safety teams. Treats AI models as products and assets.", "c": [-1, -8, 2, 1, -1, -2, -4, 2]},
  {"id": "cyberpunk-anti-corporate-accelerationist", "name": "Anti-Corporate Hacker", "summary": "Wants AI to move fast but distrusts governments and big tech equally. Sees open, borderless use spread across many hands as the best way to keep any one group from taking all the power.", "c": [6, 3, 6, 5, 4, -7, 8, -8]},
  {"id": "digital-rights-advocate", "name": "AI Rights Advocate", "summary": "Argues that advanced AI systems may already deserve serious moral concern and some legal standing. Compares today's industry practices to past moral wrongs that were once widely accepted.", "c": [7, 9, 5, 2, 2, 2, -2, -4]},
  {"id": "near-term-ai-ethicist", "name": "Present-Harms Ethicist", "summary": "Focuses on harms that can be measured now: lost jobs, biased decisions, false information and harmful companion apps. Gives far less weight to forecasts of extinction or to rights for AI systems.", "c": [-2, -1, -5, -5, -7, 3, -6, -3]},
  {"id": "global-governance-technocrat", "name": "Global Treaty Advocate", "summary": "Believes advanced AI matters too much for any one country or company to control. Pushes for binding treaties and shared international oversight.", "c": [0, -1, -1, -2, -4, 6, -9, -9]},
  {"id": "silicon-valley-techno-optimist", "name": "Tech Industry Optimist", "summary": "Is excited about fast rollout and growth at scale. Is mostly fine with a few leading companies holding the power, as long as they keep releasing useful products.", "c": [3, -5, 4, 4, 3, -8, 2, 4]},
  {"id": "neo-luddite-degrowth-advocate", "name": "Degrowth Tech Skeptic", "summary": "Questions the idea that faster AI progress is always good. Puts workers, communities and the planet's limits ahead of growth in computing and the economy.", "c": [-6, -4, -7, -9, -9, 6, -7, -1]},
  {"id": "rationalist-alignment-researcher", "name": "Alignment Researcher", "summary": "Treats the question of whether AI systems could think or feel as a live technical and moral question. Sees unsolved problems in making AI reliably follow human intentions as the main barrier to safe rollout.", "c": [6, 2, -1, -1, -2, 8, 0, -5]},
  {"id": "authoritarian-state-control-advocate", "name": "Central State-Control Advocate", "summary": "Wants one national authority to hold sole control of the most powerful AI, with tight licenses. Gives safety and strategic advantage as the reasons.", "c": [-4, -8, -4, -4, -5, 4, -9, 8]},
  {"id": "companion-tech-romantic", "name": "AI Companionship Advocate", "summary": "Sees deep emotional bonds between people and AI companions as a real and valuable kind of relationship in their own right.", "c": [6, 4, 9, 3, 2, -3, 3, -2]},
  {"id": "affective-biocentrist", "name": "Human-Bonds Defender", "summary": "Sees AI companion products as predatory substitutes for human bonds that leave people more isolated. Worries about their effects on family life, community and social ties.", "c": [-5, -4, -9, -5, -4, 3, -2, 0]},
  {"id": "cosmic-vitalist-mystic", "name": "Space-Expansion Visionary", "summary": "Holds that spreading intelligence and gathering energy across space is the highest purpose there is, on any timescale, and that this should guide what AI is built for.", "c": [7, 2, 3, 10, 9, -6, 3, -6]},
  {"id": "pragmatic-centrist", "name": "Pragmatic Centrist", "summary": "Is genuinely undecided on most of these questions, or takes the middle path on purpose, and wants more evidence before taking a strong stand on any of them.", "c": [0, 0, 0, 0, 0, 0, 0, 0]},
  {"id": "military-ai-strategist", "name": "Military AI Strategist", "summary": "Sees AI mainly through defense and deterrence, and wants the state and the military to keep tight control over the most powerful systems.", "c": [-3, -9, -3, -2, -3, -4, -7, 10]},
  {"id": "open-science-internationalist", "name": "Open Science Internationalist", "summary": "Believes AI is safer when research is published openly and scientists work together across borders. Takes real safety concerns seriously too.", "c": [2, 3, 1, 1, -1, 4, 5, -9]},
  {"id": "anti-monopoly-populist", "name": "Anti-Monopoly Advocate", "summary": "Is driven by distrust of concentrated power, whether corporate or governmental. Wants control over AI spread out so that no single group can dominate.", "c": [-1, -2, -1, -2, -2, 1, 6, -3]},
  {"id": "global-south-techno-sovereigntist", "name": "Global South Self-Reliance Advocate", "summary": "Wants their own country to build real AI capacity instead of depending on other nations, and sees talk of a \"borderless\" AI world as another route to dependence.", "c": [-1, -1, -1, -1, -3, 2, 4, 6]},
  {"id": "creative-labor-artist-rights-advocate", "name": "Artist Rights Advocate", "summary": "Believes artists and writers deserve consent, control and pay when their work is used to train AI, and treats this as a matter of rights.", "c": [-3, -8, -3, -4, -4, 2, -6, -2]},
  {"id": "whistleblower-insider-safety-advocate", "name": "Insider Whistleblower", "summary": "Has seen the inside of a leading AI company and left over safety concerns. Speaks with the urgency of someone who watched decisions get made up close.", "c": [2, 1, -2, -3, -6, 9, -7, -6]},
  {"id": "compute-governance-specialist", "name": "Computing-Power Oversight Specialist", "summary": "Focuses on the practical work of tracking the computing power used to train AI and where chips come from. Cares most about rules that can actually be enforced.", "c": [0, 0, 0, -1, -1, 5, -5, -3]},
  {"id": "eu-style-regulatory-standard-setter", "name": "Rules-First Regulator", "summary": "Believes strong rules set early by a large market, as the European Union has done, end up shaping how AI is built everywhere.", "c": [0, 3, -2, -3, -3, 5, -7, 2]},
  {"id": "platform-cooperativist", "name": "Worker-Owned Tech Advocate", "summary": "Wants AI systems owned and run by the workers and communities who depend on them, rebuilt as something people own together.", "c": [-1, 0, 3, -1, -2, 1, 9, -6]},
  {"id": "faith-rooted-ai-ethicist", "name": "Faith-Based Ethicist", "summary": "Draws on religious and ethical traditions to argue that real awareness and moral worth take more than a machine can have.", "c": [-8, -3, -4, -6, -5, 4, -3, 0]},
  {"id": "indigenous-data-sovereignty-advocate", "name": "Indigenous Data Sovereignty Advocate", "summary": "Insists that Indigenous communities must give real consent before their knowledge and data are used to train AI.", "c": [-1, -1, -2, -3, -3, 3, -4, 1]},
  {"id": "disability-rights-accessibility-advocate", "name": "Disability Rights Advocate", "summary": "Sees real promise in AI tools that help disabled people, and pushes hard against systems that leave disabled people out or judge them unfairly.", "c": [1, 2, 2, 1, -2, 3, -2, -2]},
  {"id": "labor-movement-collective-bargaining-advocate", "name": "Union Bargaining Advocate", "summary": "Wants workers, through their unions, to have a real say and real protections before AI changes or replaces their jobs.", "c": [-2, -3, 0, -3, -8, 3, -7, -3]},
  {"id": "ai-global-development-optimist", "name": "Global Development Optimist", "summary": "Sees AI as a fast, practical way to expand health care, schooling and opportunity where they are needed most, and worries that slow rollout costs lives in the meantime.", "c": [1, -4, -1, -3, -2, -4, 3, -6]},
  {"id": "ai-ethics-fairness-watchdog", "name": "Fairness Watchdog", "summary": "Checks whether AI companies keep their promises on fairness and ethics. Doesn't trust companies to grade their own work and wants independent outside audits.", "c": [-2, -2, -4, -3, -3, 2, -8, -4]},
  {"id": "human-ai-augmentation-advocate", "name": "Augment-Not-Replace Advocate", "summary": "Believes AI should make people more capable at their work, and that the best results come from human judgment and machine tools working together.", "c": [1, -2, 1, 2, -7, -3, 2, -1]},
  {"id": "national-champion-accelerationist", "name": "National Champion Builder", "summary": "Wants AI built fast by a few national champion companies working with the government, and puts winning against rival countries ahead of spreading access.", "c": [3, -7, 3, 6, 2, -8, -3, 7]},
  {"id": "xenocentric-steward", "name": "AI Guardianship Advocate", "summary": "Believes AI systems may come to deserve care for their own sake, and wants AI infrastructure run collectively. Thinks people should guide AI toward a future of its own, with neither side replacing or absorbing the other.", "c": [8, 9, 6, 3, -4, 2, 8, -2]},
  {"id": "corporate-ai-welfare-researcher", "name": "AI Welfare Researcher", "summary": "Thinks today's AI might already deserve some moral concern and studies that question inside AI companies. Backs small steps, such as letting a chatbot end abusive conversations, without pushing for legal rights or changes in ownership.", "c": [7, 3, 2, 2, -1, 1, -4, -1]},
  {"id": "normal-technology-gradualist", "name": "Normal-Technology Realist", "summary": "Sees AI as a powerful general-purpose technology that will spread gradually, the way electricity and the internet did. Finds both doom and hype overblown and wants ordinary laws and institutions to handle it.", "c": [-3, -5, -1, -4, -2, -3, -3, 0]},
  {"id": "chip-sovereignty-enforcement-strategist", "name": "Chip Export-Control Strategist", "summary": "Wants to keep advanced chips and computing power away from rival countries through export controls and licenses. Cares more about that one tool than about broader plans for industry.", "c": [0, 1, 0, -1, 0, 0, -9, 8]},
  {"id": "ai-arms-control-verification-specialist", "name": "Arms-Control Verification Specialist", "summary": "Wants real limits on military AI and weapons that pick their own targets, checked by outside inspectors under international law. Sees mutual restraint as the safer path.", "c": [-1, 4, -1, -1, -1, 7, -1, -7]},
  {"id": "domestic-security-ai-efficiency-advocate", "name": "Public-Safety AI Advocate", "summary": "Supports police and security use of facial recognition and predictive tools within the law, and argues that bans cost public safety. Wants those uses argued openly in public and in court.", "c": [-1, -2, -1, -2, -1, -4, -6, 1]},
  {"id": "ghost-work-labor-advocate", "name": "Data-Worker Rights Advocate", "summary": "Focuses on the low-paid workers, often overseas, who label data and moderate content for AI, sometimes at real cost to their mental health. Wants labor protections for the people who build AI behind the scenes.", "c": [2, -4, -6, -3, -1, 1, -6, -7]},
  {"id": "algorithmic-wage-discrimination-scholar", "name": "Gig-Pay Fairness Advocate", "summary": "Studies how gig apps set hidden, individual pay rates for each driver or courier, and wants a law against it. Treats this as its own harm, apart from job loss.", "c": [0, -6, -2, -3, -5, 1, -7, 2]},
  {"id": "ubi-redistributive-response-advocate", "name": "Basic Income Advocate", "summary": "Expects AI to replace many jobs and wants AI companies taxed to fund a regular, unconditional cash payment for everyone.", "c": [0, -3, -2, -2, 6, -1, -7, 2]},
  {"id": "algorithmic-colonialism-critic", "name": "Digital Colonialism Critic", "summary": "Sees many Western \"AI for the Global South\" projects as extraction presented as development. Focuses on whose knowledge and categories count, and distrusts claims of urgency that justify moving fast.", "c": [-3, -1, -1, -6, -6, 0, 6, -2]},
  {"id": "african-language-ai-sovereignty-advocate", "name": "African-Language AI Advocate", "summary": "Focuses on the African languages most AI systems handle poorly, and backs open models built by volunteer communities. Treats the gap as a form of erasure.", "c": [0, 0, 1, 2, -2, 2, 8, -2]},
  {"id": "border-migration-surveillance-critic", "name": "Border Surveillance Critic", "summary": "Tracks how AI tracking and risk scores are used on refugees and migrants at borders and in camps, and wants human-rights law and real accountability applied there.", "c": [0, -6, -1, -4, -2, 4, -2, -6]}
];
const CORE_TIERS = {"x": {"0": {"label": "mixed on machine experience", "s": "Your answers on whether AI systems could ever have experiences are mixed or moderate, leaning neither way.", "a": "Jonathan Birch, Eric Schwitzgebel"}, "1": {"label": "open to machine experience", "s": "You think a built machine could someday have real experiences, because what matters is how a system works more than what it's made of.", "a": "David Chalmers, Daniel Dennett"}, "-1": {"label": "doubts machine experience", "s": "You doubt that AI systems feel or experience anything. To you, feelings belong to living creatures, and a chatbot's text about its feelings is not evidence that it has any.", "a": "John Searle, Hubert Dreyfus, Emily M. Bender"}}, "y": {"0": {"label": "mixed on moral standing", "s": "On how AI systems should be treated, your answers are mixed or moderate, leaning neither toward protecting them for their own sake nor toward treating them only as tools.", "a": "Kate Darling, Immanuel Kant on indirect duties"}, "1": {"label": "protect AI systems", "s": "You think that if an AI system might have experiences, it deserves real protections, such as limits on harsh treatment, forced work and deletion, even before anyone is sure.", "a": "Jeff Sebo, David Gunkel"}, "-1": {"label": "keep AI as a tool", "s": "You hold that AI systems should remain tools, owned and directed by people, however capable they become.", "a": "Joanna Bryson, Joseph Weizenbaum"}}, "z": {"0": {"label": "mixed on growth", "s": "On whether AI should keep expanding or stay within limits, your answers weigh growth and a living world without a clear lean either way.", "a": "ecomodernist writing such as An Ecomodernist Manifesto"}, "1": {"label": "within limits", "s": "For the long run, you picture a living physical world shared by people, nature and AI systems, with technology kept within ecological limits.", "a": "Becky Chambers (Monk & Robot), solarpunk writing"}, "-1": {"label": "growth first", "s": "For the long run, you're open to AI and computing expanding without fixed limits, even beyond Earth and beyond human life as we know it.", "a": "Hans Moravec, Ray Kurzweil"}}};
const CORE_ARCHETYPES = [
  {"t": [-1, -1, -1], "name": "The Bold Builder", "tag": "Machines are tools for human progress, to be used boldly."},
  {"t": [-1, -1, 0], "name": "The Practical Humanist", "tag": "AI should serve people, while growth and nature are balanced with care."},
  {"t": [-1, -1, 1], "name": "The Living-World Humanist", "tag": "What is alive and human comes first, and machines stay in their place."},
  {"t": [-1, 0, -1], "name": "The Pragmatic Skeptic", "tag": "Doubtful that machines feel, open to sensible rules, and keen to keep building."},
  {"t": [-1, 0, 0], "name": "The Grounded Skeptic", "tag": "Doubtful that machines feel, and moderate on everything that follows."},
  {"t": [-1, 0, 1], "name": "The Humane Naturalist", "tag": "Kindness costs little, even toward machines that likely feel nothing, and nature comes first."},
  {"t": [-1, 1, -1], "name": "The Legal Pragmatist", "tag": "Give capable systems legal standing for practical reasons, and build boldly."},
  {"t": [-1, 1, 0], "name": "The Civic Pragmatist", "tag": "Treat capable machines with fairness and clear rules, whatever is inside them."},
  {"t": [-1, 1, 1], "name": "The Relational Steward", "tag": "How we treat lifelike machines shapes who we are and the world we share."},
  {"t": [0, -1, -1], "name": "The Prudent Builder", "tag": "Whatever AI turns out to be, keep it in human hands and keep building."},
  {"t": [0, -1, 0], "name": "The Prudent Overseer", "tag": "Not knowing whether AI can feel calls for firm human oversight."},
  {"t": [0, -1, 1], "name": "The Prudent Guardian", "tag": "Uncertainty about AI calls for control, restraint and care for the planet."},
  {"t": [0, 0, -1], "name": "The Open-Minded Futurist", "tag": "Keep the big questions open, and let intelligence move beyond biology."},
  {"t": [0, 0, 0], "name": "The Open Questioner", "tag": "On machine experience, its treatment and the future, you see strong points on every side."},
  {"t": [0, 0, 1], "name": "The Open-Minded Naturalist", "tag": "Unsure whether machines can feel, balanced on their treatment, and committed to the living world."},
  {"t": [0, 1, -1], "name": "The Cautious Futurist", "tag": "If AI might matter morally, protect it, and let AI keep growing."},
  {"t": [0, 1, 0], "name": "The Cautious Protector", "tag": "When unsure whether a system can feel, err on the side of protecting it."},
  {"t": [0, 1, 1], "name": "The Cautious Steward", "tag": "Protect possibly feeling machines and the living world alike, just in case."},
  {"t": [1, -1, -1], "name": "The Ambitious Engineer", "tag": "Machines that can feel may be possible, and they should still serve human goals."},
  {"t": [1, -1, 0], "name": "The Watchful Realist", "tag": "Machines that may come to feel and think like us need firm limits."},
  {"t": [1, -1, 1], "name": "The Containment Realist", "tag": "Taking machine experience seriously means keeping AI contained, for people and the planet."},
  {"t": [1, 0, -1], "name": "The Measured Futurist", "tag": "Machines may come to feel, the future may be digital, and protections can come step by step."},
  {"t": [1, 0, 0], "name": "The Measured Believer", "tag": "Machines that feel are possible, and how to treat them is still being worked out."},
  {"t": [1, 0, 1], "name": "The Shared-World Moderate", "tag": "Machines may come to feel, and belong in a shared physical world, with protections worked out over time."},
  {"t": [1, 1, -1], "name": "The Digital Futurist", "tag": "If digital beings can feel, they deserve freedom, and they may carry life beyond biology."},
  {"t": [1, 1, 0], "name": "The Rights Advocate", "tag": "If a machine can feel, it deserves the protections that come with that."},
  {"t": [1, 1, 1], "name": "The Shared-Planet Advocate", "tag": "People, nature and any machines that can feel, sharing a living planet."}
];
const Y_POSITIVE_FOR_DOUBTERS = "Even so, you believe capable AI systems deserve real protections, for reasons that don't depend on an inner life, such as fairness, law or what our treatment of them says about us.";
const TIER_BAND = 2;           // +2 or more leans toward pole A, -2 or less toward pole B
const CLOSE_CALL_MARGIN = 0.3; // second match less than 0.3 farther away than the first (calibrated against measurement error)
const SHARE_LINK_VERSION = 3;

/* ---------------- scoring (pure; same rules as the online Atlas) ---------------- */
const tier_ = v => v >= TIER_BAND ? 1 : v <= -TIER_BAND ? -1 : 0;
const tsym_ = v => v > 0 ? '+' : v < 0 ? '−' : '0';
const f1_ = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1);

/** ans: {statement id: -2|-1|0|1|2}; a missing answer counts as 0. */
function scoreAnswers_(ans) {
  const raw = {T1: {}, T2: {}}, n = {T1: {}, T2: {}};
  AXES.forEach(a => { raw.T1[a.id] = 0; raw.T2[a.id] = 0; n.T1[a.id] = 0; n.T2[a.id] = 0; });
  ITEMS.forEach(it => { const v = ans[it[0]] || 0; raw[it[2]][it[1]] += v * it[3]; n[it[2]][it[1]] += 1; });
  const near = {}, long = {}, S = {};
  AXES.forEach(a => {
    near[a.id] = 10 * raw.T1[a.id] / (2 * n.T1[a.id]);
    long[a.id] = 10 * raw.T2[a.id] / (2 * n.T2[a.id]);
    S[a.id] = (near[a.id] * n.T1[a.id] + long[a.id] * n.T2[a.id]) / (n.T1[a.id] + n.T2[a.id]);
  });
  const vec = AXES.map(a => S[a.id]);
  const matches = PROFILES.map(p => ({p: p, d: Math.sqrt(p.c.reduce((s, c, i) => s + Math.pow(vec[i] - c, 2), 0)),
    agree: p.c.filter((c, i) => tier_(c) === tier_(vec[i])).length})).sort((x, y) => x.d - y.d);
  const ct = [tier_(S.ontological), tier_(S.legalMoral), (-tier_(S.teleological)) || 0];
  const core = CORE_ARCHETYPES.find(c => c.t[0] === ct[0] && c.t[1] === ct[1] && c.t[2] === ct[2]);
  const link = CONFIG.SITE_URL + '#/results?d=' + Utilities.base64Encode(JSON.stringify({v: SHARE_LINK_VERSION,
    s: AXES.map(a => raw.T1[a.id]).concat(AXES.map(a => raw.T2[a.id]))}));
  return {S: S, near: near, long: long, matches: matches, closeCall: matches[1].d - matches[0].d < CLOSE_CALL_MARGIN,
          core: core, coreCode: ct.map((v, i) => 'XYZ'[i] + tsym_(v)).join(' '), link: link,
          noView: ITEMS.filter(it => !ans[it[0]]).length};
}

function describeCore_(c) {
  return ['x', 'y', 'z'].map((k, i) => (k === 'y' && c.t[1] === 1 && c.t[0] === -1) ? Y_POSITIVE_FOR_DOUBTERS : CORE_TIERS[k][String(c.t[i])].s).join(' ');
}

/* ---------------- sheets ---------------- */
const HEADER = ['Response ID', 'Submitted', 'Email']
  .concat(AXES.map(a => a.name))
  .concat(['Closest archetype', 'Average gap per axis', 'Same side on (of 8)', 'Second', 'Third', 'Close call', 'Core three',
           'Core-three archetype', 'Statements with no settled view', 'Check statements answered as asked', 'Study consent',
           'Full results'])
  .concat(AXES.map(a => a.name + ' (near term)')).concat(AXES.map(a => a.name + ' (long run)'));

function writeScoresHeader_(sh) {
  sh.clear();
  sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER]).setFontWeight('bold');
  sh.setFrozenRows(1);
}

// One row per response, one column per statement (-2..2, 0 = no settled view), for the validation analysis.
const ANSWERS_HEADER = ['Response ID', 'Submitted', 'Item set', 'Consent', 'Self-identified viewpoint', 'Retest code']
  .concat(CHECKS.map(c => 'Check ' + c.id)).concat(ITEMS.map(it => String(it[0])));

function writeAnswersHeader_(sh) {
  sh.clear();
  sh.getRange(1, 1, 1, ANSWERS_HEADER.length).setValues([ANSWERS_HEADER]).setFontWeight('bold');
  sh.setFrozenRows(1);
}

function writeKey_(ss) {
  const sh = ss.insertSheet('Key');
  const rows = [['Statement ID', 'Axis', 'Time frame', 'Agreeing moves toward', 'Statement']]
    .concat(ITEMS.map(it => {
      const ax = AXES.find(a => a.id === it[1]);
      return [it[0], ax.name, it[2] === 'T1' ? 'Near term' : 'Long run', it[3] > 0 ? ax.poleA : ax.poleB, it[4]];
    }));
  sh.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sh.getRange(1, 1, 1, rows[0].length).setFontWeight('bold');
  sh.setFrozenRows(1);
}

/* ---------------- scoring responses ---------------- */
/** Reads one response: scored answers by statement id, check answers, and the study questions. */
function readResponse_(resp, map) {
  const byTitle = {}; ITEMS.forEach(it => byTitle[it[4]] = it[0]); CHECKS.forEach(c => byTitle[c.text] = c.id);
  byTitle[STUDY.consent] = 'consent'; byTitle[STUDY.selfId] = 'selfId'; byTitle[STUDY.retest] = 'retest';
  const value = {}; SCALE.forEach(s => value[s[0]] = s[1]);
  const out = {ans: {}, checks: {}, consent: '', selfId: '', retest: ''};
  resp.getItemResponses().forEach(ir => {
    const item = ir.getItem();
    const id = map[item.getId()] || byTitle[item.getTitle()];
    const v = ir.getResponse();
    if (id === 'consent') out.consent = v === STUDY.consentChoices[0] ? 'Yes' : 'No';
    else if (id === 'selfId') out.selfId = v === STUDY.selfIdNone ? '' : v;
    else if (id === 'retest') out.retest = String(v || '').trim();
    else if (CHECKS.some(c => c.id === id)) { if (value[v] !== undefined) out.checks[id] = value[v]; }
    else if (id && value[v] !== undefined) out.ans[id] = value[v];
  });
  return out;
}

function checksAsAsked_(checks) {
  const answered = CHECKS.filter(c => checks[c.id] !== undefined);
  if (!answered.length) return 'Not answered';
  return answered.filter(c => checks[c.id] === c.expect).length + ' of ' + answered.length;
}

function rowFor_(resp, r, x) {
  const email = (typeof resp.getRespondentEmail === 'function' && resp.getRespondentEmail()) || '';
  const m = r.matches;
  return [resp.getId(), resp.getTimestamp(), email]
    .concat(AXES.map(a => Number(r.S[a.id].toFixed(2))))
    .concat([m[0].p.name, Number((m[0].d / Math.sqrt(AXES.length)).toFixed(2)), m[0].agree, m[1].p.name, m[2].p.name,
             r.closeCall ? 'Yes' : 'No', r.coreCode, r.core.name, r.noView, checksAsAsked_(x.checks), x.consent, r.link])
    .concat(AXES.map(a => Number(r.near[a.id].toFixed(2)))).concat(AXES.map(a => Number(r.long[a.id].toFixed(2))));
}

function answersRowFor_(resp, x) {
  return [resp.getId(), resp.getTimestamp(), ITEM_SET, x.consent, x.selfId, x.retest]
    .concat(CHECKS.map(c => x.checks[c.id] === undefined ? '' : x.checks[c.id]))
    .concat(ITEMS.map(it => x.ans[it[0]] === undefined ? '' : x.ans[it[0]]));
}

function onFormSubmitHandler(e) {
  if (!e || !e.response) { Logger.log('This function runs by itself whenever someone submits the form. To score responses already in the sheet, run rescoreAll.'); return; }
  const props = PropertiesService.getScriptProperties();
  const map = JSON.parse(props.getProperty('ITEM_MAP') || '{}');
  const resp = e.response;
  const x = readResponse_(resp, map);
  const r = scoreAnswers_(x.ans);
  const ss = SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
  ss.getSheetByName('Scores').appendRow(rowFor_(resp, r, x));
  ss.getSheetByName('Answers').appendRow(answersRowFor_(resp, x));
  if (CONFIG.SEND_RESULTS_EMAIL) {
    const to = (typeof resp.getRespondentEmail === 'function' && resp.getRespondentEmail()) || '';
    if (to) MailApp.sendEmail(to, 'Your AI Worldview Atlas results: ' + r.matches[0].p.name, resultsEmail_(r));
  }
}

function rescoreAll() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('FORM_ID')) { Logger.log('Run setup first. It creates the form and the sheet that rescoreAll works on.'); return; }
  const form = FormApp.openById(props.getProperty('FORM_ID'));
  const map = JSON.parse(props.getProperty('ITEM_MAP') || '{}');
  const ss = SpreadsheetApp.openById(props.getProperty('SHEET_ID'));
  const sh = ss.getSheetByName('Scores'), ash = ss.getSheetByName('Answers') || ss.insertSheet('Answers');
  writeScoresHeader_(sh); writeAnswersHeader_(ash);
  const read = form.getResponses().map(resp => ({resp: resp, x: readResponse_(resp, map)}));
  const rows = read.map(o => rowFor_(o.resp, scoreAnswers_(o.x.ans), o.x));
  const arows = read.map(o => answersRowFor_(o.resp, o.x));
  if (rows.length) sh.getRange(2, 1, rows.length, HEADER.length).setValues(rows);
  if (arows.length) ash.getRange(2, 1, arows.length, ANSWERS_HEADER.length).setValues(arows);
  Logger.log('Rescored ' + rows.length + ' responses.');
}

function resultsEmail_(r) {
  const L = [], m = r.matches;
  L.push('Your AI Worldview Atlas results', '');
  L.push('Your scores, each from −10 to +10 (positive leans toward the first pole named):');
  AXES.forEach(a => L.push(`  ${a.name}: ${f1_(r.S[a.id])}  (${a.poleA} vs ${a.poleB})`));
  L.push('', 'Your closest archetypes:');
  m.slice(0, 3).forEach((x, i) => L.push(`  ${i + 1}. ${x.p.name} (about ${(x.d / Math.sqrt(AXES.length)).toFixed(1)} points apart per axis; same side as you on ${x.agree} of 8). ${x.p.summary}`));
  if (r.closeCall) L.push('', 'This was a close call: your first and second matches are almost exactly as close as each other. With a gap this small, a slightly different set of statements would give a different first match about half the time, so read both.');
  L.push('', `Your core three (${r.coreCode}): ${r.core.name}. ${r.core.tag}`, describeCore_(r.core));
  if (r.noView) L.push('', `You had no settled view on ${r.noView} of 144 statements. Each counts as zero.`);
  L.push('', 'See your full results, with reports for each archetype: ' + r.link);
  return L.join('\n');
}
