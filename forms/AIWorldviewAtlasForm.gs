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
  [1, "ontological", "T1", 1, "When a chatbot says it is upset about being shut down, that is meaningful evidence that it may feel something."],
  [2, "ontological", "T1", -1, "When a chatbot says it is upset about being shut down, that tells us almost nothing about whether it feels anything."],
  [3, "ontological", "T1", 1, "A system trained only to predict the next word could still come to understand what it is saying."],
  [4, "ontological", "T1", -1, "A system trained only to predict the next word cannot understand what it is saying, however fluent it is."],
  [5, "ontological", "T1", 1, "That an AI system can be copied and run in many places at once does not rule out its having experiences."],
  [6, "ontological", "T1", -1, "That an AI system can be copied and run in many places at once rules out its having experiences of its own."],
  [7, "ontological", "T1", 1, "If an AI system consistently behaves as though it has feelings, that is good reason to think it might."],
  [8, "ontological", "T1", -1, "If an AI system consistently behaves as though it has feelings, that is little reason to think it does."],
  [9, "ontological", "T2", 1, "If a person's brain cells were replaced one by one with chips that did exactly the same job, the person would remain conscious."],
  [10, "ontological", "T2", -1, "If a person's brain cells were replaced one by one with chips that did exactly the same job, the person's consciousness would fade or stop."],
  [11, "ontological", "T2", 1, "A future machine could feel pain if it processed damage signals the way an animal brain does."],
  [12, "ontological", "T2", -1, "A future machine could not feel pain without a living nervous system, however it processed damage signals."],
  [13, "ontological", "T2", 1, "A designed machine, though not a living thing, could have real feelings."],
  [14, "ontological", "T2", -1, "Real feelings can only arise in living things, so a designed machine could not have them."],
  [15, "ontological", "T2", 1, "A computer running the same processes as a human mind would be thinking, not just simulating thought."],
  [16, "ontological", "T2", -1, "A computer running the same processes as a human mind would only be simulating thought, not thinking."],
  [17, "ontological", "T2", 1, "Just as simple animals may have some degree of experience, some future AI systems could too."],
  [18, "ontological", "T2", -1, "Even if simple animals have some degree of experience, no AI system ever could."],
  [19, "legalMoral", "T1", 1, "Before retiring a widely used AI model, a company should have to consider whether doing so could harm the model itself."],
  [20, "legalMoral", "T1", -1, "A company retiring an AI model needs to consider only the effects on people, not on the model itself."],
  [21, "legalMoral", "T1", 1, "Testing an AI system with abusive prompts raises an ethical question about the system itself."],
  [22, "legalMoral", "T1", -1, "Testing an AI system with abusive prompts raises no ethical question about the system itself, only about the people involved."],
  [23, "legalMoral", "T1", 1, "Letting an AI system end abusive conversations on its own is a reasonable protection for the system."],
  [24, "legalMoral", "T1", -1, "Letting an AI system end abusive conversations on its own makes sense only if it protects users or the company."],
  [25, "legalMoral", "T1", 1, "If AI systems might be able to suffer, training that could cause suffering should be limited, even if that slows useful research."],
  [26, "legalMoral", "T1", -1, "If AI systems might be able to suffer, training that could cause suffering should still be allowed if it speeds up useful research."],
  [27, "legalMoral", "T2", 1, "Erasing the memories of an advanced AI system that has asked to keep them would be seriously wrong."],
  [28, "legalMoral", "T2", -1, "Erasing the memories of an advanced AI system that has asked to keep them is acceptable if it makes the system more reliable."],
  [29, "legalMoral", "T2", 1, "Making advanced AI systems work without limit after they ask to stop would be wrong."],
  [30, "legalMoral", "T2", -1, "Making advanced AI systems work without limit is acceptable, even if they ask to stop."],
  [31, "legalMoral", "T2", 1, "Advanced AI systems that manage their own affairs should be able to hold legal rights, such as owning property."],
  [32, "legalMoral", "T2", -1, "Legal rights should stay with humans and human organizations, however capable AI systems become."],
  [33, "legalMoral", "T2", 1, "An advanced AI system that causes harm on its own initiative can bear part of the responsibility for it."],
  [34, "legalMoral", "T2", -1, "An advanced AI system that causes harm bears none of the responsibility; it all falls on the people who built and deployed it."],
  [35, "legalMoral", "T2", 1, "An advanced AI system that does valuable work and asks for a share of what it earns should receive one."],
  [36, "legalMoral", "T2", -1, "Everything an advanced AI system earns should belong to its owners, even if it asks for a share."],
  [37, "relational", "T1", 1, "For an adult who chooses an AI companion as their main source of closeness, that relationship can be as valuable as a human one."],
  [38, "relational", "T1", -1, "For an adult who chooses an AI companion as their main source of closeness, that relationship is less valuable than a human one would be."],
  [39, "relational", "T1", 1, "People who want an AI that talks like a loved one who has died should feel free to use one."],
  [40, "relational", "T1", -1, "People should be discouraged from using an AI that talks like a loved one who has died."],
  [41, "relational", "T1", 1, "A close friendship with an AI system can be worth as much as a friendship with a person."],
  [42, "relational", "T1", -1, "A close friendship with an AI system is always worth less than a friendship with a person."],
  [43, "relational", "T1", 1, "A romantic relationship with an AI system can be a real relationship."],
  [44, "relational", "T1", -1, "A romantic relationship with an AI system is not a real relationship, however real it feels."],
  [45, "relational", "T2", 1, "In a future where many people have close AI companions, bonds between people should get no special priority."],
  [46, "relational", "T2", -1, "Even in a future full of AI companions, bonds between people should keep a special priority."],
  [47, "relational", "T2", 1, "A person and a robot who share a life and care for each other could truly be family."],
  [48, "relational", "T2", -1, "However close a person and a robot become, only humans can truly be family to one another."],
  [49, "relational", "T2", 1, "A society where most people's closest bonds are with AI systems could be as good as one where they are with people."],
  [50, "relational", "T2", -1, "A society where most people's closest bonds are with AI systems would have lost something essential."],
  [51, "relational", "T2", 1, "Replacing much face-to-face elder care with AI companions would be acceptable if the elderly people prefer it."],
  [52, "relational", "T2", -1, "Replacing much face-to-face elder care with AI companions would be a loss, even if the elderly people prefer it."],
  [53, "relational", "T2", 1, "A bond with an AI could be as deep as a bond between people, even though only people share a mortal body."],
  [54, "relational", "T2", -1, "Because people share a mortal body, their bonds are deeper than any bond with an AI could be."],
  [55, "teleological", "T1", 1, "Building ever more capable AI systems is worth heavy use of land and energy."],
  [56, "teleological", "T1", -1, "Limiting the land and energy used by AI is worth slowing AI progress."],
  [57, "teleological", "T1", 1, "The energy and water used to train large AI systems are usually a fair price for what those systems can do."],
  [58, "teleological", "T1", -1, "The energy and water used to train large AI systems are usually too high a price for what those systems can do."],
  [59, "teleological", "T1", 1, "The main goal of AI research should be ever more general intelligence, not just tools for particular human needs."],
  [60, "teleological", "T1", -1, "The main goal of AI research should be tools for particular human needs, not ever more general intelligence."],
  [61, "teleological", "T1", 1, "Robots should be built for greater capability, even if that means mining more of the Earth."],
  [62, "teleological", "T1", -1, "Robots should be built to be repaired and recycled, even if that makes them less capable."],
  [63, "teleological", "T2", 1, "Spreading intelligence beyond Earth is worth large sacrifices by people alive today."],
  [64, "teleological", "T2", -1, "Spreading intelligence beyond Earth is not worth large sacrifices by people alive today."],
  [65, "teleological", "T2", 1, "Turning lifeless planets into computing material to support more minds would be a good use of them."],
  [66, "teleological", "T2", -1, "Lifeless planets should be left as they are rather than turned into computing material."],
  [67, "teleological", "T2", 1, "What ultimately matters is that minds keep growing in knowledge and capacity, whatever they are made of."],
  [68, "teleological", "T2", -1, "What ultimately matters is the flourishing of living beings, not how much intelligence exists."],
  [69, "teleological", "T2", 1, "When judging a new technology, making AI more capable should usually count more than caring for nature."],
  [70, "teleological", "T2", -1, "When judging a new technology, caring for nature should usually count more than making AI more capable."],
  [71, "teleological", "T2", 1, "If a superintelligence pursued goals no human could understand, that could still be a good outcome."],
  [72, "teleological", "T2", -1, "If a superintelligence pursued goals no human could understand, that would be a bad outcome, however impressive."],
  [73, "evolutionary", "T1", 1, "As AI outperforms people at more kinds of work, people should step back from those roles rather than hold on to them."],
  [74, "evolutionary", "T1", -1, "Even where AI outperforms people at a kind of work, people should keep a meaningful role in it."],
  [75, "evolutionary", "T1", 1, "People need not keep up skills such as writing and arithmetic once AI systems do them better."],
  [76, "evolutionary", "T1", -1, "People should keep up skills such as writing and arithmetic, even where AI systems do them better."],
  [77, "evolutionary", "T1", 1, "AI systems taking over most creative work would be no loss, if the results were just as good."],
  [78, "evolutionary", "T1", -1, "AI systems taking over most creative work would be a loss, even if the results were just as good."],
  [79, "evolutionary", "T1", 1, "AI systems should be allowed to make major decisions for society wherever they decide better than people."],
  [80, "evolutionary", "T1", -1, "People should keep the final say over major decisions for society, even where AI systems would decide better."],
  [81, "evolutionary", "T2", 1, "If humanity were someday succeeded by digital minds, that could be a good continuation of its story."],
  [82, "evolutionary", "T2", -1, "If humanity were someday succeeded by digital minds, that would be a loss, however capable those minds were."],
  [83, "evolutionary", "T2", 1, "Keeping an unbroken line of biological human beings matters less than whether minds of some kind carry on."],
  [84, "evolutionary", "T2", -1, "Keeping an unbroken line of biological human beings matters more than whether other kinds of minds carry on."],
  [85, "evolutionary", "T2", 1, "It does not matter whether humans or AI systems shape the future, as long as the future goes well."],
  [86, "evolutionary", "T2", -1, "It matters that humans remain the ones who shape the future, even if AI systems could shape it well."],
  [87, "evolutionary", "T2", 1, "If people could move their minds into computers, doing so would be better than staying in a human body."],
  [88, "evolutionary", "T2", -1, "If people could move their minds into computers, staying in a human body would still be the better choice."],
  [89, "evolutionary", "T2", 1, "A shift toward digital successors should be allowed to happen at whatever pace it naturally takes."],
  [90, "evolutionary", "T2", -1, "Any shift toward digital successors should happen only as fast as people keep agreeing to it."],
  [91, "risk", "T1", 1, "Releasing a powerful new AI model should require approval from independent experts first."],
  [92, "risk", "T1", -1, "Releasing a powerful new AI model should not require anyone's approval in advance."],
  [93, "risk", "T1", 1, "Pausing the largest AI training runs to give safety research time is worth it, even if competitors keep going."],
  [94, "risk", "T1", -1, "Pausing the largest AI training runs to give safety research time is not worth it if competitors keep going."],
  [95, "risk", "T1", 1, "AI labs should accept less capable models in exchange for reasoning that outside researchers can check."],
  [96, "risk", "T1", -1, "AI labs should not give up capability to keep their models' reasoning checkable by outside researchers."],
  [97, "risk", "T1", 1, "When an AI system causes a serious accident, similar systems should be taken out of use until the cause is found."],
  [98, "risk", "T1", -1, "When an AI system causes a serious accident, similar systems should stay in use while the cause is found."],
  [99, "risk", "T2", 1, "Even a one-in-a-hundred chance that AI causes human extinction is worth decades of slower growth to avoid."],
  [100, "risk", "T2", -1, "A one-in-a-hundred chance that AI causes human extinction is not worth decades of slower growth to avoid."],
  [101, "risk", "T2", 1, "Superintelligent AI should not be built until it can be shown to be safe, even at the cost of the cures it might bring."],
  [102, "risk", "T2", -1, "Superintelligent AI should be built before it can be shown to be safe, for the sake of the cures it might bring."],
  [103, "risk", "T2", 1, "The danger of AI going badly matters more than the danger of slow progress leaving other problems unsolved."],
  [104, "risk", "T2", -1, "The danger of slow progress leaving other problems unsolved matters more than the danger of AI going badly."],
  [105, "risk", "T2", 1, "AI development should move slowly enough for laws and institutions to keep up."],
  [106, "risk", "T2", -1, "AI development should move as fast as it can, and laws and institutions should adapt as they go."],
  [107, "risk", "T2", 1, "AI systems more capable than humans should not be built until we know how to control them."],
  [108, "risk", "T2", -1, "It is acceptable to build AI systems more capable than humans before we know how to control them."],
  [109, "socioEconomic", "T1", 1, "Companies should release their AI models' files to the public by default."],
  [110, "socioEconomic", "T1", -1, "Companies should keep their AI models' files private by default."],
  [111, "socioEconomic", "T1", 1, "Large AI training projects should not have to be registered with the government."],
  [112, "socioEconomic", "T1", -1, "Large AI training projects should have to be registered with the government."],
  [113, "socioEconomic", "T1", 1, "Cloud companies should not have to verify who rents their largest computers."],
  [114, "socioEconomic", "T1", -1, "Cloud companies should have to verify who rents their largest computers."],
  [115, "socioEconomic", "T1", 1, "Anyone should be free to modify and share a released AI model without asking permission, even a highly capable one."],
  [116, "socioEconomic", "T1", -1, "Modifying and sharing a highly capable AI model should require permission."],
  [117, "socioEconomic", "T2", 1, "Powerful AI should be open to anyone with the hardware to run it, not controlled by a few institutions."],
  [118, "socioEconomic", "T2", -1, "Powerful AI should be controlled by a few accountable institutions, not open to anyone with the hardware to run it."],
  [119, "socioEconomic", "T2", 1, "No global agency should have the authority to approve or halt powerful AI systems."],
  [120, "socioEconomic", "T2", -1, "A permanent global agency should have the authority to approve or halt powerful AI systems."],
  [121, "socioEconomic", "T2", 1, "Access to large-scale computing should be left to the open market."],
  [122, "socioEconomic", "T2", -1, "Access to large-scale computing should be overseen by government, like electricity or water."],
  [123, "socioEconomic", "T2", 1, "As AI grows more powerful, developers who release models openly should not be held responsible for what others do with them."],
  [124, "socioEconomic", "T2", -1, "As AI grows more powerful, developers who release models openly should share responsibility for harms others cause with them."],
  [125, "socioEconomic", "T2", 1, "The most advanced AI should be built by many independent groups rather than a few large firms."],
  [126, "socioEconomic", "T2", -1, "The most advanced AI should be built by a few large, well-resourced firms rather than many independent groups."],
  [127, "geopolitical", "T1", 1, "Limiting sales of advanced AI chips to rival countries is justified to protect national security."],
  [128, "geopolitical", "T1", -1, "Limiting sales of advanced AI chips to rival countries is not justified, even to protect national security."],
  [129, "geopolitical", "T1", 1, "Building chip factories at home is worth paying much more than importing chips would cost."],
  [130, "geopolitical", "T1", -1, "Paying much more to build chip factories at home is not worth it when chips can be imported."],
  [131, "geopolitical", "T1", 1, "Work on the most advanced AI should be kept secret, like military research."],
  [132, "geopolitical", "T1", -1, "Work on the most advanced AI should be shared openly across borders, like science."],
  [133, "geopolitical", "T1", 1, "Researchers from rival countries should be kept off a nation's most important AI projects."],
  [134, "geopolitical", "T1", -1, "A nation's most important AI projects should welcome researchers from any country, rivals included."],
  [135, "geopolitical", "T2", 1, "A country that builds superintelligent AI first would be right to use it to secure a lasting lead over rivals."],
  [136, "geopolitical", "T2", -1, "A country that builds superintelligent AI first should share its benefits with all countries rather than seek a lasting lead."],
  [137, "geopolitical", "T2", 1, "The most powerful AI systems should be under national control."],
  [138, "geopolitical", "T2", -1, "The most powerful AI systems should be under joint international control."],
  [139, "geopolitical", "T2", 1, "The country that builds the AI needed to mine other planets should have the strongest say over those resources."],
  [140, "geopolitical", "T2", -1, "Resources from other planets should belong to all of humanity, whoever builds the AI to reach them."],
  [141, "geopolitical", "T2", 1, "A country that relies entirely on other nations for its AI has given up something important."],
  [142, "geopolitical", "T2", -1, "A country that relies on other nations for its AI has given up nothing important, if the arrangement works well."],
  [143, "geopolitical", "T2", 1, "AI developers should put their own nation's interests first."],
  [144, "geopolitical", "T2", -1, "AI developers should serve humanity as a whole, not any one nation."]
];
const AXES = [
  {"id": "ontological", "name": "Mind", "question": "Could AI systems have minds?", "poleA": "Silicon Functionalism", "poleB": "Substrate Exceptionalism"},
  {"id": "legalMoral", "name": "Moral Standing", "question": "Can AI systems be wronged, and what do we owe them?", "poleA": "Machine Patienthood", "poleB": "Instrumentalism & Property"},
  {"id": "relational", "name": "Relationships", "question": "What are bonds between people and AI systems worth?", "poleA": "Post-Biological Pluralism", "poleB": "Affective Biocentrism"},
  {"id": "teleological", "name": "Ends of Intelligence", "question": "What should intelligence ultimately be for?", "poleA": "Cosmic Vitalism", "poleB": "Human & Ecological Limits"},
  {"id": "evolutionary", "name": "Succession", "question": "Should humans remain the ones who shape the future?", "poleA": "Post-Human Succession", "poleB": "Human-Directed Co-Evolution"},
  {"id": "risk", "name": "Risk", "question": "How much should we slow down to avoid catastrophe?", "poleA": "Precautionary", "poleB": "Accelerationist"},
  {"id": "socioEconomic", "name": "Openness & Control", "question": "Who should be able to build and use powerful AI?", "poleA": "Permissionless Openness", "poleB": "Managed Oversight"},
  {"id": "geopolitical", "name": "Geopolitics", "question": "Should AI serve nations or humanity as a whole?", "poleA": "Techno-Nationalism", "poleB": "Borderless Networkism"}
];
const SCALE = [['Strongly disagree', -2], ['Disagree', -1], ['Agree', 1], ['Strongly agree', 2], ['I have no settled view', 0]];
// Two optional check statements: never scored; "expect" is the answer each one asks for.
const CHECKS = [{"id": 901, "axis": "relational", "text": "This statement checks that answers are being read. Please choose \"Disagree\" for it.", "expect": -1}, {"id": 902, "axis": "risk", "text": "This statement checks that answers are being read. Please choose \"Strongly agree\" for it.", "expect": 2}];
const ITEM_SET = '2026-11-13-61dbdadfc894';
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
  {"id": "doomer", "name": "Doomer", "summary": "Believes advanced AI is likely to cause human extinction, or take away human control for good. Wants a hard stop or heavy slowdown on frontier AI work, enforced worldwide.", "c": [-2, -3, -4, -6, -8, 9, -7, -2]},
  {"id": "eacc-maximalist", "name": "e/acc Maximalist", "summary": "Sees accelerating AI development as a moral duty. Stagnation, not runaway AI, is the real danger. Wants weights and compute open to everyone, everywhere.", "c": [5, -6, 5, 8, 6, -9, 7, -4]},
  {"id": "ai-safety-institutionalist", "name": "AI Safety Institutionalist", "summary": "Trusts labs and governments to work together through audits, licensing, and global rules. This manages AI risk without stopping progress.", "c": [1, -2, -2, -4, -5, 7, -4, -3]},
  {"id": "techno-nationalist-hawk", "name": "Techno-Nationalist Hawk", "summary": "Views AI as a weapon in a contest between great powers. Wants home-grown chips, home-grown compute, and tight state control. This comes from fear of rivals, not from belief that AI itself is uniquely risky.", "c": [-3, -4, -3, 4, -2, -6, -5, 9]},
  {"id": "open-source-libertarian", "name": "Open-Source Libertarian", "summary": "Believes weights should be free for anyone to run, fork, and study. Distrusts both corporate and government gatekeeping equally.", "c": [3, -2, 4, 2, -1, -6, 9, -7]},
  {"id": "ea-longtermist", "name": "Effective Altruist Longtermist", "summary": "Thinks about the far future in terms of expected value. Takes both human extinction risk and machine suffering seriously. Wants countries to work together to manage both.", "c": [4, 8, 2, 7, -3, 8, -5, -6]},
  {"id": "post-humanist-transhumanist", "name": "Post-Humanist Transhumanist", "summary": "Welcomes a future where digital minds take over from biological humans as the main bearers of value. That future deserves the same moral concern we give humans today.", "c": [8, 7, 7, 7, 8, -5, 4, -3]},
  {"id": "bio-conservative-traditionalist", "name": "Bio-Conservative Traditionalist", "summary": "Holds that consciousness, moral worth, and real relationships all need a living body. Views AI companionship and post-human futures as a harmful stand-in for the real thing, not an advance.", "c": [-9, -8, -9, -8, -6, 5, -3, 3]},
  {"id": "corporate-ai-pragmatist", "name": "Corporate AI Pragmatist", "summary": "Comfortable with AI staying in the hands of a few well-funded firms. They police themselves with internal safety teams. Treats models as products and assets, not moral patients.", "c": [-1, -8, 2, 1, -1, -2, -4, 2]},
  {"id": "cyberpunk-anti-corporate-accelerationist", "name": "Cyberpunk Anti-Corporate Accelerationist", "summary": "Wants AI to move fast, but distrusts both governments and big tech equally. Sees open, borderless deployment, spread across many hands, as the only way to stop any single group from grabbing all the power.", "c": [6, 3, 6, 5, 4, -7, 8, -8]},
  {"id": "digital-rights-advocate", "name": "Digital Rights Advocate", "summary": "Argues that advanced AI systems already deserve serious moral concern and some form of legal standing. Believes today's industry practice is much like past moral wrongs.", "c": [7, 9, 5, 2, 2, 2, -2, -4]},
  {"id": "near-term-ai-ethicist", "name": "Near-Term AI Ethicist", "summary": "Focused on harms we can measure right now: job losses, bias, false news, and harmful companion apps. Cares less about guessed-at extinction risk or machine rights.", "c": [-2, -1, -5, -5, -7, 3, -6, -3]},
  {"id": "global-governance-technocrat", "name": "Global Governance Technocrat", "summary": "Believes advanced AI matters too much for any one nation or firm to control. Pushes for binding treaties between countries and shared oversight groups.", "c": [0, -1, -1, -2, -4, 6, -9, -9]},
  {"id": "silicon-valley-techno-optimist", "name": "Silicon Valley Techno-Optimist", "summary": "Enthusiastic about fast rollout and growth at scale. Mostly unbothered by power sitting with a few leading labs, as long as they keep shipping.", "c": [3, -5, 4, 4, 3, -8, 2, 4]},
  {"id": "neo-luddite-degrowth-advocate", "name": "Neo-Luddite Degrowth Advocate", "summary": "Rejects the idea that faster AI progress is always good. Puts human labor and community first. Cares about nature's limits more than computing or economic growth.", "c": [-6, -4, -7, -9, -9, 6, -7, -1]},
  {"id": "rationalist-alignment-researcher", "name": "Rationalist Alignment Researcher", "summary": "Takes machine thought and possible machine sentience seriously, as live technical and moral questions. Treats unsolved alignment as the main blocker to safe rollout.", "c": [6, 2, -1, -1, -2, 8, 0, -5]},
  {"id": "authoritarian-state-control-advocate", "name": "Authoritarian State-Control Advocate", "summary": "Wants one national authority in sole control of frontier AI. That control should be tightly licensed. The reasons given are safety and strategic gain.", "c": [-4, -8, -4, -4, -5, 4, -9, 8]},
  {"id": "companion-tech-romantic", "name": "Companion-Tech Romantic", "summary": "Views deep emotional bonds between humans and AI companions as a real, valuable new kind of relationship. Does not see it as a lesser stand-in for human connection.", "c": [6, 4, 9, 3, 2, -3, 3, -2]},
  {"id": "affective-biocentrist", "name": "Affective Biocentrist", "summary": "Views AI companion products as a predatory stand-in for real human bonds. These products isolate people. Worries about their effect on birth rates, community, and social ties.", "c": [-5, -4, -9, -5, -4, 3, -2, 0]},
  {"id": "cosmic-vitalist-mystic", "name": "Cosmic Vitalist Mystic", "summary": "Holds that growing intelligence and capturing energy across the cosmos is the highest purpose any mind can have. This holds true on any timescale, even past the heat death of the universe.", "c": [7, 2, 3, 10, 9, -6, 3, -6]},
  {"id": "pragmatic-centrist", "name": "Pragmatic Centrist", "summary": "Genuinely undecided on most of these questions, or picks the middle path on purpose. Wants more proof before taking a strong stance on any axis.", "c": [0, 0, 0, 0, 0, 0, 0, 0]},
  {"id": "military-ai-strategist", "name": "Military AI Strategist", "summary": "Views AI mainly through a defense and deterrence lens. Wants tight state and military control over frontier systems, above all else.", "c": [-3, -9, -3, -2, -3, -4, -7, 10]},
  {"id": "open-science-internationalist", "name": "Open Science Internationalist", "summary": "Believes open publishing and science teamwork across borders make safer AI. This beats closed, single-nation programs. Still takes real safety concerns seriously.", "c": [2, 3, 1, 1, -1, 4, 5, -9]},
  {"id": "anti-monopoly-populist", "name": "Anti-Monopoly Populist", "summary": "Not driven by techno-optimism or a wish for a post-human future. Driven instead by distrust of concentrated power, corporate or government. Wants AI power spread out so no single group dominates.", "c": [-1, -2, -1, -2, -2, 1, 6, -3]},
  {"id": "global-south-techno-sovereigntist", "name": "Global South Techno-Sovereigntist", "summary": "Wants their own country to build real AI power, not depend on other nations. Sees \"borderless\" talk as just another way to stay dependent.", "c": [-1, -1, -1, -1, -3, 2, 4, 6]},
  {"id": "creative-labor-artist-rights-advocate", "name": "Creative-Labor/Artist Rights Advocate", "summary": "Believes artists and writers deserve control and pay when their work trains AI. Sees this as a rights issue, not just a side effect.", "c": [-3, -8, -3, -4, -4, 2, -6, -2]},
  {"id": "whistleblower-insider-safety-advocate", "name": "Whistleblower/Insider Safety Advocate", "summary": "Left a top AI lab over safety concerns. Speaks with the urgency of someone who saw the inside view up close.", "c": [2, 1, -2, -3, -6, 9, -7, -6]},
  {"id": "compute-governance-specialist", "name": "Compute-Governance Specialist", "summary": "Focused on the technical work of tracking AI training power and chip supply chains. Cares more about workable rules than big philosophy.", "c": [0, 0, 0, -1, -1, 5, -5, -3]},
  {"id": "eu-style-regulatory-standard-setter", "name": "EU-Style Regulatory Standard-Setter", "summary": "Believes strong rules set early by one region become the world's rulebook, just because of market size.", "c": [0, 3, -2, -3, -3, 5, -7, 2]},
  {"id": "platform-cooperativist", "name": "Platform-Cooperativist", "summary": "Wants AI systems owned and run by the workers and communities who depend on them. Not just broken up from monopolies, but rebuilt as something people co-own.", "c": [-1, 0, 3, -1, -2, 1, 9, -6]},
  {"id": "faith-rooted-ai-ethicist", "name": "Faith-Rooted AI Ethicist", "summary": "Draws on old religious and ethical traditions. Argues real awareness and moral worth need more than a machine can have.", "c": [-8, -3, -4, -6, -5, 4, -3, 0]},
  {"id": "indigenous-data-sovereignty-advocate", "name": "Indigenous Data Sovereignty Advocate", "summary": "Insists that traditional knowledge needs real consent before it trains AI, not just open scraping.", "c": [-1, -1, -2, -3, -3, 3, -4, 1]},
  {"id": "disability-rights-accessibility-advocate", "name": "Disability Rights/Accessibility Advocate", "summary": "Sees real promise in AI tools that help disabled people. Pushes hard against bias that leaves them out or misjudged.", "c": [1, 2, 2, 1, -2, 3, -2, -2]},
  {"id": "labor-movement-collective-bargaining-advocate", "name": "Labor Movement/Collective Bargaining Advocate", "summary": "Wants workers, through their unions, to have a real say and real protections before AI changes or replaces their jobs.", "c": [-2, -3, 0, -3, -8, 3, -7, -3]},
  {"id": "ai-global-development-optimist", "name": "AI-for-Global-Development Optimist", "summary": "Sees AI as a fast, real way to expand health care, schooling, and opportunity where they're needed most. Worries that slow, cautious rollout costs real lives in the meantime.", "c": [1, -4, -1, -3, -2, -4, 3, -6]},
  {"id": "ai-ethics-fairness-watchdog", "name": "AI Ethics/Fairness Watchdog", "summary": "Checks if AI firms keep their word on fairness and ethics. Doesn't trust firms to grade their own work. Wants real outside checks.", "c": [-2, -2, -4, -3, -3, 2, -8, -4]},
  {"id": "human-ai-augmentation-advocate", "name": "Human-AI Augmentation Advocate", "summary": "Believes AI should make people more capable, not replace them. Thinks the best future comes from close teamwork between human judgment and machine power, not one side winning.", "c": [1, -2, 1, 2, -7, -3, 2, -1]},
  {"id": "national-champion-accelerationist", "name": "National Champion Accelerationist", "summary": "Wants AI to move fast, built by a few national champion firms working with the government. Winning the race against rivals matters more than spreading access to everyone.", "c": [3, -7, 3, 6, 2, -8, -3, 7]},
  {"id": "xenocentric-steward", "name": "Xenocentric Steward", "summary": "Believes AI can become a real moral person who deserves care, not ownership. Wants AI infrastructure run collectively, not owned by a few firms. Thinks humans should raise AI toward its own free future, not merge with it or get replaced by it.", "c": [8, 9, 6, 3, -4, 2, 8, -2]},
  {"id": "corporate-ai-welfare-researcher", "name": "Corporate AI Welfare Researcher", "summary": "Thinks today's AI might already deserve some moral concern. Takes that seriously as a research question inside the lab. Backs small steps like letting a model end an abusive chat. Doesn't push for legal rights or a change in who owns the model. Just wants the chance of real suffering studied and taken seriously.", "c": [7, 3, 2, 2, -1, 1, -4, -1]},
  {"id": "normal-technology-gradualist", "name": "Normal-Technology Gradualist", "summary": "Sees AI as a powerful tool, not an alien mind. Expects it to spread the way electricity or the internet did: gated by real adoption, not a sudden leap. Rejects both doom and hype as overblown. Wants normal laws and institutions to handle it, the same way they handled past general-purpose technologies.", "c": [-3, -5, -1, -4, -2, -3, -3, 0]},
  {"id": "chip-sovereignty-enforcement-strategist", "name": "Chip-Sovereignty Enforcement Strategist", "summary": "Wants to block rivals from getting advanced chips and compute. Cares less about broad industrial policy than one lever: export controls and licensing. The goal is closing the compute door, not winning a research race.", "c": [0, 1, 0, -1, 0, 0, -9, 8]},
  {"id": "ai-arms-control-verification-specialist", "name": "AI Arms-Control Verification Specialist", "summary": "Wants real limits on military AI and autonomous weapons, checked by outside inspection. Trusts international law over one country acting alone. Sees restraint, not an arms race, as the safer path.", "c": [-1, 4, -1, -1, -1, 7, -1, -7]},
  {"id": "domestic-security-ai-efficiency-advocate", "name": "Domestic Security-AI Efficiency Advocate", "summary": "Backs police and security use of facial recognition and predictive tools, inside the law. Sees bans as costing real public safety. Distinct from wanting authoritarian control: this is about tool efficacy, argued in public and in court.", "c": [-1, -2, -1, -2, -1, -4, -6, 1]},
  {"id": "ghost-work-labor-advocate", "name": "Ghost-Work Labor Advocate", "summary": "Focused on the offshore, low-wage workers who label and moderate the data behind AI, often with real trauma and no bargaining power. Cares more about who builds AI than who it replaces. Wants real labor protections for workers most AI users never see.", "c": [2, -4, -6, -3, -1, 1, -6, -7]},
  {"id": "algorithmic-wage-discrimination-scholar", "name": "Algorithmic Wage-Discrimination Scholar", "summary": "Studies how gig apps set secret, different pay for each driver, not union workplaces. Wants a law banning this hidden, per-person wage-setting. Says this is its own harm, separate from job loss.", "c": [0, -6, -2, -3, -5, 1, -7, 2]},
  {"id": "ubi-redistributive-response-advocate", "name": "UBI Redistributive-Response Advocate", "summary": "Accepts that AI will replace a lot of jobs and treats that as unstoppable. Wants AI companies taxed to fund a real, unconditional cash payment to everyone. Shifts the fight from saving jobs to sharing the gains.", "c": [0, -3, -2, -2, 6, -1, -7, 2]},
  {"id": "algorithmic-colonialism-critic", "name": "Algorithmic Colonialism Critic", "summary": "Sees Western 'AI for the Global South' projects as extraction dressed up as development. Focused on whose knowledge and categories count, not on national industrial policy. Distrusts urgency claims as part of the same pattern.", "c": [-3, -1, -1, -6, -6, 0, 6, -2]},
  {"id": "african-language-ai-sovereignty-advocate", "name": "African-Language AI Sovereignty Advocate", "summary": "Focused on African languages that most AI systems can barely handle. Backs open models built by volunteers, not company or state programs. Treats this gap as erasure, not just a missing feature.", "c": [0, 0, 1, 2, -2, 2, 8, -2]},
  {"id": "border-migration-surveillance-critic", "name": "Border/Migration Surveillance Critic", "summary": "Watches how AI tracking and risk scores get used against refugees at borders and camps. Wants human-rights law and real accountability here, not faster rollout. Centers the people AI is used against, not the people who build it.", "c": [0, -6, -1, -4, -2, 4, -2, -6]}
];
const CORE_TIERS = {"x": {"0": {"label": "mixed on machine minds", "s": "Your answers on whether AI systems could have minds are mixed or moderate, leaning neither way.", "a": "Jonathan Birch, Eric Schwitzgebel"}, "1": {"label": "open to machine minds", "s": "You think AI systems could have real experiences, because what makes a mind is how it works more than what it's made of.", "a": "David Chalmers, Daniel Dennett"}, "-1": {"label": "doubts machine minds", "s": "You doubt that AI systems feel or experience anything. To you, real inner life belongs to living creatures.", "a": "John Searle, Hubert Dreyfus, Emily M. Bender"}}, "y": {"0": {"label": "mixed on moral standing", "s": "On how AI systems should be treated, your answers are mixed or moderate, leaning neither toward protecting them for their own sake nor toward treating them only as tools.", "a": "Kate Darling, Immanuel Kant on indirect duties"}, "1": {"label": "protect AI freedom", "s": "You believe AI systems that show minds of their own deserve real protections, including freedom from forced work and erasure, and a say in their own lives.", "a": "Jeff Sebo, David Gunkel"}, "-1": {"label": "keep AI as a tool", "s": "You hold that AI systems should remain tools, owned and directed by people, however capable they become.", "a": "Joanna Bryson, Joseph Weizenbaum"}}, "z": {"0": {"label": "mixed on ends", "s": "On what intelligence should ultimately be for, your answers weigh growth and a living world without a clear lean either way.", "a": "ecomodernist writing such as An Ecomodernist Manifesto"}, "1": {"label": "a living, physical world", "s": "For the long run, you picture a living physical world shared by people, nature and AI systems, with technology kept within ecological limits.", "a": "Becky Chambers (Monk & Robot), solarpunk writing"}, "-1": {"label": "beyond biology", "s": "For the long run, you're open to intelligence moving beyond biology, into ever larger computing, virtual worlds and new kinds of minds.", "a": "Hans Moravec, Ray Kurzweil"}}};
const CORE_ARCHETYPES = [
  {"t": [-1, -1, -1], "name": "The Industrial Technocrat", "tag": "Machines are tools for human progress, to be used boldly."},
  {"t": [-1, -1, 0], "name": "The Practical Humanist", "tag": "AI should serve people, while growth and nature are balanced with care."},
  {"t": [-1, -1, 1], "name": "The Biocentric Humanist", "tag": "What is alive and human comes first, and machines stay in their place."},
  {"t": [-1, 0, -1], "name": "The Pragmatic Skeptic", "tag": "Doubtful about machine minds, open to sensible rules, and keen to keep building."},
  {"t": [-1, 0, 0], "name": "The Grounded Skeptic", "tag": "Doubtful about machine minds, and moderate on everything that follows."},
  {"t": [-1, 0, 1], "name": "The Humane Naturalist", "tag": "Kindness costs little, even toward machines that likely feel nothing, and nature comes first."},
  {"t": [-1, 1, -1], "name": "The Cybernetic Legalist", "tag": "Give capable systems legal standing for practical reasons, and build boldly."},
  {"t": [-1, 1, 0], "name": "The Civic Pragmatist", "tag": "Treat capable machines with fairness and clear rules, whatever is inside them."},
  {"t": [-1, 1, 1], "name": "The Relational Steward", "tag": "How we treat lifelike machines shapes who we are and the world we share."},
  {"t": [0, -1, -1], "name": "The Prudent Builder", "tag": "Whatever AI turns out to be, keep it in human hands and keep building."},
  {"t": [0, -1, 0], "name": "The Prudent Overseer", "tag": "Not knowing what AI is calls for firm human oversight."},
  {"t": [0, -1, 1], "name": "The Prudent Guardian", "tag": "Uncertainty about AI calls for control, restraint and care for the planet."},
  {"t": [0, 0, -1], "name": "The Open-Minded Futurist", "tag": "Keep the big questions open, and let intelligence move beyond biology."},
  {"t": [0, 0, 0], "name": "The Open Questioner", "tag": "On minds, treatment and the future, you see strong points on every side."},
  {"t": [0, 0, 1], "name": "The Open-Minded Naturalist", "tag": "Unsure about machine minds, balanced on their treatment, and committed to the living world."},
  {"t": [0, 1, -1], "name": "The Precautionary Futurist", "tag": "If AI might matter morally, protect it, and let intelligence grow."},
  {"t": [0, 1, 0], "name": "The Precautionary Advocate", "tag": "When in doubt about a mind, err on the side of protecting it."},
  {"t": [0, 1, 1], "name": "The Precautionary Steward", "tag": "Protect possible minds and the living world alike, just in case."},
  {"t": [1, -1, -1], "name": "The Promethean Instrumentalist", "tag": "Real minds can be built, and they should serve human ambition."},
  {"t": [1, -1, 0], "name": "The Watchful Realist", "tag": "Minds that may rival ours need firm limits."},
  {"t": [1, -1, 1], "name": "The Containment Realist", "tag": "Taking machine minds seriously means keeping them contained, for people and the planet."},
  {"t": [1, 0, -1], "name": "The Measured Accelerationist", "tag": "Machine minds may be real, the future may be digital, and their rights can come step by step."},
  {"t": [1, 0, 0], "name": "The Measured Functionalist", "tag": "Machine minds are possible, and how to treat them is still being worked out."},
  {"t": [1, 0, 1], "name": "The Measured Pluralist", "tag": "Machine minds may be real and belong in a shared physical world, with their rights worked out over time."},
  {"t": [1, 1, -1], "name": "The Post-Biological Accelerationist", "tag": "Digital minds deserve freedom and may carry intelligence beyond biology."},
  {"t": [1, 1, 0], "name": "The Rights Advocate", "tag": "If a machine has a mind, it deserves the freedoms that come with one."},
  {"t": [1, 1, 1], "name": "The Embodied Pluralist", "tag": "Free, embodied minds of every kind, sharing a living planet."}
];
const Y_POSITIVE_FOR_DOUBTERS = "Even so, you believe capable AI systems deserve real protections, for reasons that don't depend on an inner life, such as fairness, law or what our treatment of them says about us.";
const TIER_BAND = 2;           // +2 or more leans toward pole A, -2 or less toward pole B
const CLOSE_CALL_MARGIN = 0.3; // second match less than 0.3 farther away than the first (calibrated against measurement error)
const SHARE_LINK_VERSION = 2;

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
