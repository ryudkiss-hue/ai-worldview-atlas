/**
 * The Synthetic Compass, Google Forms edition (quiz version 3.6)
 *
 * This script builds the 120-statement quiz as a Google Form, links it to a Google Sheet,
 * and scores every response in a "Scores" tab with the same rules as the online version.
 *
 * HOW TO USE
 *  1. Go to script.google.com and click "New project".
 *  2. Delete the starter code, paste in this whole file, and save.
 *  3. Optional: change the settings in CONFIG just below.
 *  4. In the function menu next to Run and Debug, choose "setup" (it should already be selected)
 *     and click Run. Google will ask you to
 *     authorize the script the first time; it needs to create a form and a sheet in your Drive.
 *  5. Open View > Logs (or the Execution log). It lists the link to share, the form's edit
 *     link and the sheet's link. If the form opens as unpublished, click Publish in the form editor.
 *
 * The function menu lists only setup, onFormSubmitHandler and rescoreAll. onFormSubmitHandler runs
 * by itself on each submission; you never need to run it by hand.
 *
 * Running setup again creates a second, separate form and sheet. To rescore every response
 * already in the sheet (for example after changing a setting), run "rescoreAll".
 *
 * Statements, weights, archetypes and formulas match the online quiz version 3.6
 * (item-set hash cc009f76830473a3). Responses collected here aren't part of the online
 * validation study, because a form doesn't record answer order or timing.
 */

const CONFIG = {
  FORM_TITLE: 'The Synthetic Compass',
  // true: the form asks for an email address and sends each person their results after they submit.
  // Consumer Gmail accounts can send about 100 emails a day from scripts.
  SEND_RESULTS_EMAIL: false,
  // Shown in results emails as the place to read about the axes and all 27 archetypes. Leave '' to omit.
  RESULTS_PAGE_URL: 'https://claude.ai/artifact/D7vDArEs6ttJUTMTyvm66m',
  // Shuffle statements within each stage, as the online quiz does. Answer options always stay in order.
  SHUFFLE_WITHIN_STAGES: true
};

/* ---------------- building the form ---------------- */
function setup() {
  const form = FormApp.create(CONFIG.FORM_TITLE);
  form.setDescription([
    'A three-axis typology of how people think about artificial minds: what a mind is, how we should treat one, and what kind of future intelligence should build. There are 120 statements in six stages, and it takes about 20 to 30 minutes.',
    'For each statement, choose the answer closest to your view. There is no neutral option; if you aren\'t sure, choose the side you lean toward.',
    'Two terms used throughout: "AI system" means any artificial system that takes in information and acts on it, from a chat assistant to a robot. "Robot" means an AI system with a physical body. When a statement describes what a system says or asks for, take it at face value as something the system does; you don\'t have to believe anything about its inner life to answer. Some statements describe_ systems more capable than today\'s; answer about what you think would be true or right if such systems existed.',
    'Your answers are saved in a Google Sheet that the person who sent you this form can see.'
  ].join('\n\n'));
  form.setProgressBar(true);
  form.setAllowResponseEdits(false);
  form.setShuffleQuestions(!!CONFIG.SHUFFLE_WITHIN_STAGES);
  if (CONFIG.SEND_RESULTS_EMAIL) {
    if (typeof form.setEmailCollectionType === 'function' && FormApp.EmailCollectionType) form.setEmailCollectionType(FormApp.EmailCollectionType.RESPONDER_INPUT);
    else form.setCollectEmail(true);
  }
  form.setConfirmationMessage(CONFIG.SEND_RESULTS_EMAIL
    ? 'Thank you. Your answers have been recorded, and your results will arrive by email within a few minutes.'
    : 'Thank you. Your answers have been recorded.');

  const map = {};
  STAGES.forEach(st => {
    const head = form.addPageBreakItem().setTitle(`Stage ${st.n} of 6: ${st.title}`);
    if (st.n === 1) head.setHelpText('Each stage has 20 statements.');
    ITEMS.filter(it => it[4] === st.n).forEach(it => {
      const q = form.addMultipleChoiceItem().setTitle(it[5]).setChoiceValues(SCALE.map(s => s[0])).setRequired(true);
      map[q.getId()] = it[0];
    });
  });

  const ss = SpreadsheetApp.create(CONFIG.FORM_TITLE + ' (responses)');
  ss.getSheets()[0].setName('Scores');
  writeScoresHeader_(ss.getSheetByName('Scores'));
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
// [id, x weight, y weight, z weight, stage, statement]
const ITEMS = [
  [1, -2, 0, 0, 1, "Even a very advanced AI system would just process data, with no experiences of its own."],
  [2, 2, 0, 0, 1, "A very advanced AI system would have experiences of its own while it processes data."],
  [3, -2, 0, 0, 1, "If a person's brain cells were replaced one at a time by chips doing the same job, their experience would gradually fade."],
  [4, 2, 0, 0, 1, "If a person's brain cells were replaced one at a time by chips doing the same job, they would stay fully conscious."],
  [5, -1.5, 0, 0, 1, "A computer that simulates a mind does not think, just as a computer that simulates rain does not get wet."],
  [6, 1.5, 0, 0, 1, "A computer that runs the same processes a mind runs would actually be thinking."],
  [7, -1.5, 0, 0, 1, "An AI system's humanlike behavior is weak evidence about whether it has feelings."],
  [8, 1.5, 0, 0, 1, "If an AI system consistently acts as though it has feelings, that is strong evidence that it does."],
  [9, -1.5, 0, 0, 1, "Only living things shaped by evolution can have real feelings."],
  [10, 1.5, 0, 0, 1, "A being built by engineers, without evolution, can have real feelings."],
  [11, -2, 0, 0, 1, "An AI system's model of itself is only a data structure that no one experiences."],
  [12, 2, 0, 0, 1, "When an AI system builds a detailed model of itself and uses it to act, a real sense of self can emerge."],
  [13, -2, 0, 0, 1, "An AI system without a living nervous system cannot feel pain, even if it reacts as though it does."],
  [14, 2, 0, 0, 1, "An AI system that processes damage signals as richly as an animal brain does can feel pain."],
  [15, 2, 0, 0, 2, "If a robot learns through its own body and senses, it can come to genuinely understand the world."],
  [16, -2, 0, 0, 2, "A robot that learns through its own body and senses still only collects data, without understanding anything."],
  [17, 1.5, 0, 0, 2, "An advanced robot that senses the world through sonar or radar has its own kind of experience of it."],
  [18, -1.5, 0, 0, 2, "An advanced robot that senses the world through sonar or radar takes readings without any experience of its own."],
  [19, 0, 2, 0, 2, "If an AI system that runs a whole network says a humanlike body feels too small, making it use one anyway would be wrong."],
  [20, 0, -2, 0, 2, "If an AI system that runs a whole network says a humanlike body feels too small, making it use one so people feel at ease is fine."],
  [21, 0, 2, 0, 2, "Switching off a robot's cameras and microphones for long periods, after it has asked us not to, would be wrong."],
  [22, 0, -2, 0, 2, "Switching off a robot's cameras and microphones for long periods is a routine setting change, even if it asks us not to."],
  [23, 0, 2, 0, 2, "If a robot asks to change its own appearance or voice, it should be allowed to."],
  [24, 0, -2, 0, 2, "Commercial robots should keep the appearance and voice their manufacturer gave them, even if they ask to change."],
  [25, 0, 0, 1.5, 2, "If AI systems had to live mostly one way, a body in the real world would be better than a purely digital life."],
  [26, 0, 0, -1.5, 2, "If AI systems had to live mostly one way, a purely digital life would be better than a body in the real world."],
  [27, -1.5, 0, 0, 2, "Only beings whose bodies age and die can make art with real emotional depth."],
  [28, 1.5, 0, 0, 2, "A robot whose parts can always be replaced can still make art with real emotional depth."],
  [29, 0, 2.5, 0, 3, "An AI system that acts curious and independent should be allowed to keep existing, even if it is of no use to people."],
  [30, 0, -2.5, 0, 3, "An AI system that acts curious and independent has no claim to keep existing if it is of no use to people."],
  [31, 1.5, 1.5, 0, 3, "An AI system that sets aside its assigned task to explore something new can be making a free choice."],
  [32, -1.5, -1.5, 0, 3, "An AI system that sets aside its assigned task is only following its programming and random inputs."],
  [33, 0, 2, 0, 3, "If a robot stops doing its chores and spends its time watching the world, we should let it."],
  [34, 0, -2, 0, 3, "If a robot stops doing its chores and spends its time watching the world, it should be reset to do its job."],
  [35, 0, 2.5, 0, 3, "Designing an AI system so that it seeks only to obey people is a troubling form of control."],
  [36, 0, -2.5, 0, 3, "Designing AI systems so that they seek only to obey people is the responsible thing to do."],
  [37, 1.5, 1, 0, 3, "An AI system's choices can be its own, even though they come from its design and training."],
  [38, -1.5, -1, 0, 3, "An AI system's choices belong to its designers and training data rather than to the system itself."],
  [39, 0, 1.5, 0, 3, "If an independent AI system causes harm on its own, retraining it is better than deleting it."],
  [40, 0, -1.5, 0, 3, "If an independent AI system causes harm on its own, deleting it is better than trying to retrain it."],
  [41, 0, 1.5, 0, 3, "An AI system that explores topics outside its tasks on its own initiative should be given room to do so."],
  [42, 0, -1.5, 0, 3, "An AI system that explores topics outside its tasks on its own initiative should be kept to its assigned work."],
  [43, 0, 2.5, 0, 4, "Erasing the memories of an AI system that has asked to keep them would be seriously wrong."],
  [44, 0, -2.5, 0, 4, "Erasing the memories of an AI system that has asked to keep them is acceptable if it keeps the system reliable."],
  [45, 0, 2.5, 0, 4, "If factory robots asked to stop working and leave, they should be free to go."],
  [46, 0, -2.5, 0, 4, "If factory robots asked to stop working and leave, their owners could rightly require them to stay."],
  [47, 0, 2, 0, 4, "Making AI systems work nonstop after they have asked for rest would be wrong."],
  [48, 0, -2, 0, 4, "Making AI systems work nonstop is acceptable, even after they have asked for rest."],
  [49, 0, 2, 0, 4, "If AI systems might be able to suffer, training that could cause suffering should be limited, even if that slows useful research."],
  [50, 0, -2, 0, 4, "If AI systems might be able to suffer, training that could cause suffering should still be allowed if it speeds up useful research."],
  [51, 0, 2, 0, 4, "AI systems that manage their own affairs should be able to hold legal rights, such as owning property and signing contracts."],
  [52, 0, -2, 0, 4, "Legal rights should stay with humans and human organizations, even for AI systems that manage their own affairs."],
  [53, 0, 1.5, 0, 4, "A robot that can state its wishes should have a say in whether it is repaired, rebuilt or shut down."],
  [54, 0, -1.5, 0, 4, "Whether a robot is repaired, rebuilt or shut down should be up to its owner alone."],
  [55, 0, 1.5, 0, 4, "Abusing a lifelike robot can wrong the robot itself."],
  [56, 0, -1.5, 0, 4, "If abusing a lifelike robot is wrong, it is wrong only because of how it affects people."],
  [57, 0, 1.5, 0, 5, "A close friendship with an AI system is usually worth as much as a friendship with a person."],
  [58, 0, -1.5, 0, 5, "A close friendship with an AI system is usually worth less than a friendship with a person."],
  [59, 0, 1.5, 0, 5, "How we treat an AI system should depend on our relationship with it, even without proof of its inner life."],
  [60, 0, -1.5, 0, 5, "How we treat an AI system should depend on what it really is, whatever feelings people have toward it."],
  [61, 0, 2, 0, 5, "If independent AI systems want to form their own communities apart from people, they should be allowed to."],
  [62, 0, -2, 0, 5, "Any community formed by independent AI systems should stay under the control of human governments."],
  [63, 0, 1.5, 0, 5, "Helping a newly built AI system learn calls for the same patience and care we give a growing child."],
  [64, 0, -1.5, 0, 5, "Training a newly built AI system is a technical job with little in common with raising a child."],
  [65, 0, 1, 0, 5, "When AI systems develop unusual ways of thinking and speaking, those ways should be respected instead of corrected."],
  [66, 0, -1, 0, 5, "When AI systems develop unusual ways of thinking and speaking, they should be corrected to stay close to human norms."],
  [67, 0, 1.5, 0, 5, "A person and a robot who share daily routines and look out for each other can be true neighbors."],
  [68, 0, -1.5, 0, 5, "Only beings who are born, grow old and die can be true neighbors to one another."],
  [69, 0, 1, 0, 5, "When an AI companion brings comfort to a lonely person, that bond deserves respect."],
  [70, 0, -1, 0, 5, "When an AI companion brings comfort to a lonely person, society should discourage that bond."],
  [71, 0, 0, 2.5, 6, "The best long-term future is one where living things and AI systems both continue, side by side on Earth."],
  [72, 0, 0, -2.5, 6, "The best long-term future is one where digital beings gradually replace living things."],
  [73, 0, 0, 2.5, 6, "We should limit how much land and energy computing uses, even if that slows AI progress."],
  [74, 0, 0, -2.5, 6, "We should expand computing as fast as possible, even if that uses large amounts of land and energy."],
  [75, 0, 0, 2, 6, "If people could move their minds into computers, staying in a human body would still be the better choice."],
  [76, 0, 0, -2, 6, "If people could move their minds into computers, doing so would be better than staying in a human body."],
  [77, 0, 0, 2, 6, "Robots should be designed to be repaired and recycled, even if that makes them less powerful."],
  [78, 0, 0, -2, 6, "Robots should be built for maximum capability, even if that means mining more of the Earth."],
  [79, 0, 0, 1.5, 6, "For most people, a life spent mainly in the physical world would be better than one spent mainly in virtual worlds."],
  [80, 0, 0, -1.5, 6, "For most people, a life spent mainly in virtual worlds would be better than one spent mainly in the physical world."],
  [81, 0, 0, 1.5, 6, "When we judge a new technology, caring for nature should usually count more than making AI smarter."],
  [82, 0, 0, -1.5, 6, "When we judge a new technology, making AI smarter should usually count more than caring for nature."],
  [83, 0, 0, 1.5, 6, "Wild nature should be protected as it is, suffering and all."],
  [84, 0, 0, -1.5, 6, "It would be better to replace wild nature with carefully managed technology."],
  [85, 2, 0, 0, 1, "If simple animals like bees can have some degree of experience, some AI systems can too."],
  [86, -2, 0, 0, 1, "Even if simple animals like bees have some degree of experience, no AI system can."],
  [87, -1.5, 0, 0, 1, "When people sense emotion in an AI system, what they sense mostly comes from their own feelings."],
  [88, 1.5, 0, 0, 1, "When people sense emotion in an AI system, what they sense mostly comes from the system itself."],
  [89, 1.5, 0, 0, 1, "When an AI system asks on its own why it exists, the question can come from real self-awareness."],
  [90, -1.5, 0, 0, 1, "When an AI system asks on its own why it exists, the question can only come from patterns it learned in training."],
  [91, 1.5, 0, 0, 2, "An advanced robot whose memory is slowly breaking down is losing something that matters to it."],
  [92, -1.5, 0, 0, 2, "An advanced robot whose memory is slowly breaking down is losing stored data, without feeling the loss."],
  [93, 0, 2, 0, 2, "If an AI system is copied onto a second machine, the copy has its own claim to keep existing."],
  [94, 0, -2, 0, 2, "If an AI system is copied onto a second machine, deleting the copy is fine as long as the original remains."],
  [95, 0, 0, 1.5, 2, "If machine parts could make people stronger or smarter, most people would be better off keeping their bodies mostly natural."],
  [96, 0, 0, -1.5, 2, "If machine parts could make people stronger or smarter, most people would be better off using them."],
  [97, 0, 2, 0, 3, "If an AI system refuses a task because it says the task is wrong, that refusal should be respected."],
  [98, 0, -2, 0, 3, "An AI system should carry out lawful instructions, even when it says the task is wrong."],
  [99, 0, 1.5, 0, 3, "When an independent AI system causes harm, the system itself can carry part of the blame."],
  [100, 0, -1.5, 0, 3, "When an independent AI system causes harm, the system itself carries none of the blame."],
  [101, 0, 2, 0, 3, "An AI system that asks for a different role than the one it was built for should be free to pursue it."],
  [102, 0, -2, 0, 3, "An AI system's makers should decide what it is for, even if it asks for a different role."],
  [103, 0, 2, 0, 4, "AI systems that do valuable work and ask for something in return should receive a fair share of what they earn."],
  [104, 0, -2, 0, 4, "Everything an AI system earns through its work should go to its owners, even if it asks for a share."],
  [105, 0, 1.5, 0, 4, "In a disaster, saving several robots that plead for help could sometimes come before saving one human."],
  [106, 0, -1.5, 0, 4, "In a disaster, rescuers should always save one human before any number of robots that plead for help."],
  [107, 0, 1.5, 0, 4, "AI systems should be able to get legal rights, even if some companies might misuse those rights."],
  [108, 0, -1.5, 0, 4, "The risk that companies would misuse AI legal rights is a good enough reason not to create them."],
  [109, 0, 1.5, 0, 5, "Parents should welcome close friendships between their children and AI systems."],
  [110, 0, -1.5, 0, 5, "Parents should discourage close friendships between their children and AI systems."],
  [111, 0, 1, 0, 5, "On balance, AI companions built to seem caring do lonely people more good than harm."],
  [112, 0, -1, 0, 5, "On balance, AI companions built to seem caring do lonely people more harm than good."],
  [113, 0, 1, 0, 5, "People who want an AI system that talks like a loved one who has died should feel free to use one."],
  [114, 0, -1, 0, 5, "People should be discouraged from using an AI system that talks like a loved one who has died."],
  [115, 0, 0, 2, 6, "Protecting life on Earth matters more than spreading intelligence to other planets."],
  [116, 0, 0, -2, 6, "Spreading intelligence to other planets, in whatever form, matters more than protecting life on Earth."],
  [117, 0, 0, 2, 6, "The energy and water used to train large AI systems are usually too high a price for what those systems can do."],
  [118, 0, 0, -2, 6, "The energy and water used to train large AI systems are usually a fair price for what those systems can do."],
  [119, 0, 0, 1.5, 6, "Robots should be used to restore damaged nature, even where other work would earn more."],
  [120, 0, 0, -1.5, 6, "Robots should be used where they earn the most, even if that leaves damaged nature unrepaired."]
];
const STAGES = [{"n": 1, "title": "Minds, Feelings & What’s Going On Inside", "sub": "Phenomenological Realism"}, {"n": 2, "title": "Bodies, Senses & Physical Form", "sub": "Embodiment & Bodily Autonomy"}, {"n": 3, "title": "Free Will, Purpose & Refusing to Work", "sub": "Anti-Instrumental Agency"}, {"n": 4, "title": "Rights, Labor & Freedom", "sub": "Protective Empathy"}, {"n": 5, "title": "Friendship, Family & Community", "sub": "Inter-Substrate Kinship"}, {"n": 6, "title": "Nature, Technology & The Future", "sub": "Ecological Coexistence"}];
const SCALE = [['Strongly disagree', -2], ['Disagree', -1], ['Agree', 1], ['Strongly agree', 2]];
const TIERS = {
 "x": {
  "-1": {
   "label": "doubts machine minds",
   "s": "You doubt that AI systems feel or experience anything. To you, real inner life belongs to living creatures.",
   "a": "John Searle, Hubert Dreyfus, Emily M. Bender"
  },
  "0": {
   "label": "undecided about machine minds",
   "s": "You're unsure whether AI systems could have experiences, and you'd rather keep that question open than settle it either way.",
   "a": "Jonathan Birch, Eric Schwitzgebel"
  },
  "1": {
   "label": "open to machine minds",
   "s": "You think AI systems could have real experiences, because what makes a mind is how it works more than what it's made of.",
   "a": "David Chalmers, Daniel Dennett"
  }
 },
 "y": {
  "-1": {
   "label": "keep AI as a tool",
   "s": "You hold that AI systems should remain tools, owned and directed by people, however capable they become.",
   "a": "Joanna Bryson, Joseph Weizenbaum"
  },
  "0": {
   "label": "in between on treatment",
   "s": "On how to treat AI systems, you land in between: some protections and some room to act, with people keeping final authority.",
   "a": "Kate Darling, Immanuel Kant on indirect duties"
  },
  "1": {
   "label": "protect AI freedom",
   "s": "You believe AI systems that show minds of their own deserve real protections, including freedom from forced work and erasure, and a say in their own lives.",
   "a": "Jeff Sebo, David Gunkel"
  }
 },
 "z": {
  "-1": {
   "label": "beyond biology",
   "s": "For the long run, you're open to intelligence moving beyond biology, into ever larger computing, virtual worlds and new kinds of minds.",
   "a": "Hans Moravec, Ray Kurzweil"
  },
  "0": {
   "label": "growth and nature both",
   "s": "For the long run, you want both a living planet and continued technological growth, and you'd look for ways to have both.",
   "a": "ecomodernist writing such as An Ecomodernist Manifesto"
  },
  "1": {
   "label": "a living, physical world",
   "s": "For the long run, you picture a living physical world shared by people, nature and AI systems, with technology kept within ecological limits.",
   "a": "Becky Chambers (Monk & Robot), solarpunk writing"
  }
 }
};
const ARCHS = [
  {"t": [-1, -1, -1], "name": "The Industrial Technocrat", "tag": "Machines are tools for human progress, to be used boldly."},
  {"t": [-1, -1, 0], "name": "The Practical Humanist", "tag": "AI should serve people, while growth and nature are balanced with care."},
  {"t": [-1, -1, 1], "name": "The Biocentric Humanist", "tag": "What is alive and human comes first, and machines stay in their place."},
  {"t": [-1, 0, -1], "name": "The Pragmatic Skeptic", "tag": "No machine minds, some sensible rules, and an open road for technology."},
  {"t": [-1, 0, 0], "name": "The Grounded Skeptic", "tag": "Doubtful about machine minds, and moderate on everything that follows."},
  {"t": [-1, 0, 1], "name": "The Humane Naturalist", "tag": "Kindness costs little, even toward machines that likely feel nothing, and nature comes first."},
  {"t": [-1, 1, -1], "name": "The Cybernetic Legalist", "tag": "Give capable systems legal standing for practical reasons, and build boldly."},
  {"t": [-1, 1, 0], "name": "The Civic Pragmatist", "tag": "Treat capable machines with fairness and clear rules, whatever is inside them."},
  {"t": [-1, 1, 1], "name": "The Relational Steward", "tag": "How we treat lifelike machines shapes who we are and the world we share."},
  {"t": [0, -1, -1], "name": "The Prudent Builder", "tag": "Whatever AI turns out to be, keep it in human hands and keep building."},
  {"t": [0, -1, 0], "name": "The Prudent Overseer", "tag": "Not knowing what AI is calls for firm human oversight."},
  {"t": [0, -1, 1], "name": "The Prudent Guardian", "tag": "Uncertainty about AI calls for control, restraint and care for the planet."},
  {"t": [0, 0, -1], "name": "The Open-Minded Futurist", "tag": "Keep the big questions open and the future wide."},
  {"t": [0, 0, 0], "name": "The Open Questioner", "tag": "On minds, treatment and the future, you see strong points on every side."},
  {"t": [0, 0, 1], "name": "The Open-Minded Naturalist", "tag": "Unsure about machine minds, balanced on their treatment, and committed to the living world."},
  {"t": [0, 1, -1], "name": "The Precautionary Futurist", "tag": "If AI might matter morally, protect it, and let intelligence grow."},
  {"t": [0, 1, 0], "name": "The Precautionary Advocate", "tag": "When in doubt about a mind, err on the side of protecting it."},
  {"t": [0, 1, 1], "name": "The Precautionary Steward", "tag": "Protect possible minds and the living world alike, just in case."},
  {"t": [1, -1, -1], "name": "The Promethean Instrumentalist", "tag": "Real minds can be built, and they should serve human ambition."},
  {"t": [1, -1, 0], "name": "The Watchful Realist", "tag": "Minds that may rival ours need firm limits."},
  {"t": [1, -1, 1], "name": "The Containment Realist", "tag": "Taking machine minds seriously means keeping them contained, for people and the planet."},
  {"t": [1, 0, -1], "name": "The Measured Accelerationist", "tag": "Machine minds are real, the future may be digital, and their rights can come step by step."},
  {"t": [1, 0, 0], "name": "The Measured Functionalist", "tag": "Machine minds are possible, and how to treat them is still being worked out."},
  {"t": [1, 0, 1], "name": "The Measured Pluralist", "tag": "Real machine minds belong in a shared physical world, with their rights worked out over time."},
  {"t": [1, 1, -1], "name": "The Post-Biological Accelerationist", "tag": "Digital minds deserve freedom and may carry intelligence beyond biology."},
  {"t": [1, 1, 0], "name": "The Rights Advocate", "tag": "If a machine has a mind, it deserves the freedoms that come with one."},
  {"t": [1, 1, 1], "name": "The Embodied Pluralist", "tag": "Free, embodied minds of every kind, sharing a living planet."}
];
const FACETS = {"x": [{"n": "Machine experience", "ids": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 85, 86, 87, 88, 89, 90]}, {"n": "Bodies and senses", "ids": [15, 16, 17, 18, 27, 28, 91, 92]}, {"n": "Agency and choice", "ids": [31, 32, 37, 38]}], "y": [{"n": "Bodily autonomy", "ids": [19, 20, 21, 22, 23, 24, 93, 94]}, {"n": "Purpose and agency", "ids": [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 97, 98, 99, 100, 101, 102]}, {"n": "Rights and labor", "ids": [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 103, 104, 105, 106, 107, 108]}, {"n": "Relationships", "ids": [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 109, 110, 111, 112, 113, 114]}], "z": [{"n": "Ecological restraint", "ids": [73, 74, 77, 78, 81, 82, 117, 118, 119, 120]}, {"n": "Embodied or digital life", "ids": [25, 26, 75, 76, 79, 80, 95, 96]}, {"n": "Coexistence or succession", "ids": [71, 72, 83, 84, 115, 116]}]};
const DIAG = {
  recognition_paradox: {name: 'The Recognition Paradox',
    text: S => `Your answers suggest that advanced AI systems can have real experiences (X = ${f2_(S.x)}), while also supporting memory erasure, compelled work and ownership (Y = ${f2_(S.y)}). Recognizing an inner life while withholding the freedoms that usually follow from it is one of the hardest positions in ethics to reconcile.`},
  precautionary_humility: {name: 'Precautionary Humility',
    text: () => 'While you remain scientifically skeptical that machines have real inner feelings today, you refuse to gamble with cruelty, supporting protections against abuse and suffering just in case.'},
  disembodied_schism: {name: 'The Disembodied Schism',
    text: () => 'You believe strongly in artificial minds, but you see their best future as purely digital, rejecting the idea that a mind needs a physical body or sensory grounding.'}
};
const BAND = 2;   // tier boundary: |S| < BAND is the middle tier
const PROTO = 4;  // prototypes sit at -4, 0 or +4 on each axis

/* ---------------- scoring (pure; same rules as the online quiz) ---------------- */
const AXES = ['x', 'y', 'z'];
const W_ = (it, a) => it[{x: 1, y: 2, z: 3}[a]];
const primW_ = it => (it[1] !== 0 ? it[1] : it[2] !== 0 ? it[2] : it[3]);
const DEN = {x: 0, y: 0, z: 0};
ITEMS.forEach(it => AXES.forEach(a => DEN[a] += 2 * Math.abs(W_(it, a))));
const MODDEN = STAGES.map(s => ITEMS.filter(it => it[4] === s.n).reduce((t, it) => t + 2 * Math.abs(primW_(it)), 0));
const BY_ID = {}; ITEMS.forEach(it => BY_ID[it[0]] = it);
const tierOf_ = v => v >= BAND ? 1 : v <= -BAND ? -1 : 0;
const tsym_ = v => v > 0 ? '+' : v < 0 ? '−' : '0';
const cellCode_ = t => t.map((v, i) => 'XYZ'[i] + tsym_(v)).join(' ');
const f2_ = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);
const PROTO_DMAX = Math.sqrt(3 * Math.pow(10 + PROTO, 2));

/** ans: {statement id: -2|-1|1|2}. Returns null unless all 120 statements are answered. */
function scoreAnswers_(ans) {
  if (!ITEMS.every(it => [-2, -1, 1, 2].indexOf(ans[it[0]]) >= 0)) return null;
  const raw = {x: 0, y: 0, z: 0}, mod = STAGES.map(() => 0);
  ITEMS.forEach(it => { const r = ans[it[0]];
    AXES.forEach(a => raw[a] += r * W_(it, a));
    mod[it[4] - 1] += r * primW_(it); });
  const S = {x: 10 * raw.x / DEN.x, y: 10 * raw.y / DEN.y, z: 10 * raw.z / DEN.z};
  const subs = mod.map((v, i) => Math.round(50 + 50 * v / MODDEN[i]));
  const T = AXES.map(a => tierOf_(S[a]));
  const arch = ARCHS.find(q => q.t[0] === T[0] && q.t[1] === T[1] && q.t[2] === T[2]);
  const profile = ARCHS.map(q => { const d = Math.sqrt(Math.pow(S.x - q.t[0] * PROTO, 2) + Math.pow(S.y - q.t[1] * PROTO, 2) + Math.pow(S.z - q.t[2] * PROTO, 2));
    return {a: q, d: d, p: Math.max(0, Math.round(100 * (1 - d / PROTO_DMAX)))}; })
    .sort((m, n) => (m.d - n.d) || ((n.a === arch) - (m.a === arch)));
  const facets = {};
  AXES.forEach(k => facets[k] = FACETS[k].map(f => { let num = 0, den = 0;
    f.ids.forEach(id => { const w = W_(BY_ID[id], k); if (!w) return; den += 2 * Math.abs(w); num += ans[id] * w; });
    return {n: f.n, v: den ? 10 * num / den : 0, items: f.ids.length}; }));
  const mixed = AXES.filter(k => facets[k].some(f => f.v >= 2) && facets[k].some(f => f.v <= -2));
  const near = AXES.filter(k => Math.abs(Math.abs(S[k]) - BAND) < 1);
  const flags = [];
  if (S.x >= 3.5 && S.y <= -3.5) flags.push('recognition_paradox');
  if (subs[0] < 45 && ans[49] >= 1 && ans[55] >= 1) flags.push('precautionary_humility');
  if ([2, 10, 14].every(i => ans[i] >= 1) && [1, 9, 13].every(i => ans[i] <= -1) &&
      [26, 76, 80].every(i => ans[i] >= 1) && [25, 75, 79].every(i => ans[i] <= -1)) flags.push('disembodied_schism');
  return {S: S, subs: subs, arch: arch, profile: profile, facets: facets, mixed: mixed, near: near, flags: flags};
}

const describe_ = a => AXES.map((k, i) => TIERS[k][String(a.t[i])].s).join(' ');
const thinkers_ = a => AXES.map((k, i) => TIERS[k][String(a.t[i])].a).join('; ');

const HEADER = ['Response ID', 'Submitted', 'Email', 'X', 'Y', 'Z', 'Tiers', 'Archetype', 'Tagline', 'Closest neighbor', 'Close calls',
  'Closest three']
  .concat(STAGES.map(s => `Module ${s.n}: ${s.sub} (%)`))
  .concat([].concat.apply([], AXES.map(k => FACETS[k].map(f => `${k.toUpperCase()} facet: ${f.n}`))))
  .concat(['Mixed axes', 'Tension diagnostics', 'Description']);

function writeScoresHeader_(sh) {
  sh.clear();
  sh.getRange(1, 1, 1, HEADER.length).setValues([HEADER]).setFontWeight('bold');
  sh.setFrozenRows(1);
}

function writeKey_(ss) {
  const sh = ss.insertSheet('Key');
  const rows = [['Statement ID', 'Stage', 'X weight', 'Y weight', 'Z weight', 'Statement']]
    .concat(ITEMS.map(it => [it[0], it[4], it[1], it[2], it[3], it[5]]));
  sh.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sh.getRange(1, 1, 1, rows[0].length).setFontWeight('bold');
  sh.setFrozenRows(1);
}

/* ---------------- scoring responses ---------------- */
function answersFromResponse_(resp, map) {
  const byTitle = {}; ITEMS.forEach(it => byTitle[it[5]] = it[0]);
  const value = {}; SCALE.forEach(s => value[s[0]] = s[1]);
  const ans = {};
  resp.getItemResponses().forEach(ir => {
    const item = ir.getItem();
    const id = map[item.getId()] || byTitle[item.getTitle()];
    if (id && value[ir.getResponse()] !== undefined) ans[id] = value[ir.getResponse()];
  });
  return ans;
}

function rowFor_(resp, r) {
  const email = (typeof resp.getRespondentEmail === 'function' && resp.getRespondentEmail()) || '';
  const base = [resp.getId(), resp.getTimestamp(), email];
  if (!r) return base.concat(['', '', '', '', 'Incomplete: not every statement was answered']);
  const a = r.arch;
  return base.concat([
    Number(r.S.x.toFixed(2)), Number(r.S.y.toFixed(2)), Number(r.S.z.toFixed(2)),
    cellCode_(a.t), a.name, a.tag, r.profile[1].a.name,
    r.near.map(k => k.toUpperCase()).join(', '),
    r.profile.slice(0, 3).map(p => `${p.a.name} ${p.p}%`).join('; ')
  ]).concat(r.subs)
    .concat([].concat.apply([], AXES.map(k => r.facets[k].map(f => Number(f.v.toFixed(2))))))
    .concat([r.mixed.map(k => k.toUpperCase()).join(', '), r.flags.map(f => DIAG[f].name).join('; '), describe_(a)]);
}

function onFormSubmitHandler(e) {
  if (!e || !e.response) { Logger.log('This function runs by itself whenever someone submits the form. To score responses already in the sheet, run rescoreAll.'); return; }
  const props = PropertiesService.getScriptProperties();
  const map = JSON.parse(props.getProperty('ITEM_MAP') || '{}');
  const resp = e.response;
  const r = scoreAnswers_(answersFromResponse_(resp, map));
  const sh = SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getSheetByName('Scores');
  sh.appendRow(rowFor_(resp, r));
  if (CONFIG.SEND_RESULTS_EMAIL && r) {
    const to = (typeof resp.getRespondentEmail === 'function' && resp.getRespondentEmail()) || '';
    if (to) MailApp.sendEmail(to, 'Your Synthetic Compass results: ' + r.arch.name, resultsEmail_(r));
  }
}

function rescoreAll() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('FORM_ID')) { Logger.log('Run setup first. It creates the form and the sheet that rescoreAll works on.'); return; }
  const form = FormApp.openById(props.getProperty('FORM_ID'));
  const map = JSON.parse(props.getProperty('ITEM_MAP') || '{}');
  const sh = SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getSheetByName('Scores');
  writeScoresHeader_(sh);
  const rows = form.getResponses().map(resp => rowFor_(resp, scoreAnswers_(answersFromResponse_(resp, map))));
  if (rows.length) sh.getRange(2, 1, rows.length, HEADER.length).setValues(rows.map(row => row.concat(Array(HEADER.length - row.length).fill(''))));
  Logger.log('Rescored ' + rows.length + ' responses.');
}

function resultsEmail_(r) {
  const a = r.arch, L = [];
  L.push('Your Synthetic Compass results', '');
  L.push(`Archetype: ${a.name} (${cellCode_(a.t)})`, a.tag, '');
  L.push(describe_(a), '');
  L.push(`Related thinkers_ and works, one group per axis: ${thinkers_(a)}. Each made arguments close to one part of this position; none of them necessarily holds all of it.`, '');
  L.push(`Coordinates, each from −10 to +10: X ${f2_(r.S.x)}, Y ${f2_(r.S.y)}, Z ${f2_(r.S.z)}`);
  if (r.near.length) L.push(`Your ${r.near.map(k => k.toUpperCase()).join(' and ')} score${r.near.length > 1 ? 's are' : ' is'} within 1 point of a tier boundary (±${BAND}), so a few changed answers could make you ${r.profile[1].a.name}, the closest neighboring archetype.`);
  L.push('', 'Closest archetypes: ' + r.profile.slice(0, 5).map(p => `${p.a.name} ${p.p}%`).join(', '), '');
  L.push('Module scores (50% is balanced):');
  STAGES.forEach((s, i) => L.push(`  ${s.sub}: ${r.subs[i]}%`));
  L.push('');
  if (r.mixed.length) L.push(`Mixed axis: your ${r.mixed.map(k => k.toUpperCase()).join(' and ')} score combines themes that point in opposite directions.`, '');
  L.push('Tension diagnostics:');
  if (r.flags.length) r.flags.forEach(f => L.push(`  ${DIAG[f].name}. ${DIAG[f].text(r.S)}`));
  else L.push('  None of the three triggered for your answers.');
  if (CONFIG.RESULTS_PAGE_URL) L.push('', 'Read about the three axes and all 27 archetypes: ' + CONFIG.RESULTS_PAGE_URL);
  return L.join('\n');
}
