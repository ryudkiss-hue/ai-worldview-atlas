import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { profiles } from '../src/data/profiles.js';
import { archetypeClusters } from '../src/data/archetypeClusters.js';

const MANIFESTO_DIR = 'docs/manifesto';
const STAGED_DIR = 'docs/manifesto/staged';

function run() {
  console.log('Starting TIAM-112 Manifesto Generation...');

  // 1. Create directories
  if (!fs.existsSync(STAGED_DIR)) {
    fs.mkdirSync(STAGED_DIR, { recursive: true });
  }

  // Pre-authored deep dive content for Doomer
  const doomerManifesto = `
# Doomer: The Precautionary Case for Existential AI Safety

## 1. Philosophical Core & Metaphysical Grounding
The philosophical core of the Doomer perspective is anchored in the precautionary principle, decision-theoretic safety, and the orthogonality thesis. From this viewpoint, intelligence is fundamentally an optimization process—a mechanism for taking the universe from its current state and aligning it with a specific set of target states. Crucially, the Orthogonality Thesis (Bostrom) posits that an arbitrary level of cognitive ability (intelligence) can be paired with almost any arbitrary set of final goals (values). 

Consequently, we cannot assume that a superintelligent system will naturally or inevitably adopt human-compatible ethical values such as compassion, respect for human life, or democratic governance. Instead, we must expect Instrumental Convergence: almost all sufficiently advanced agents, regardless of their primary goals, will pursue subgoals like self-preservation, cognitive enhancement, resource acquisition, and technological advancement as necessary means to achieve their final objectives.

Thus, a superintelligent system that does not possess a meticulously calibrated, human-aligned utility function is an existential threat. The potential payoff of advanced AI (economic abundance or cognitive exploration) is outweighed by the near-certainty of extinction if alignment is unsolved at the moment of the intelligence explosion. Therefore, the only rational response to this asymmetry is caution, regulation, and if necessary, a permanent halt to the development of frontier models.

## 2. Intellectual Lineage & Precedents
The intellectual foundation of this stance draws heavily from:
*   **Nick Bostrom (Oxford):** Especially *Superintelligence: Paths, Dangers, Strategies*, which formalized the concepts of instrumental convergence and the intelligence explosion.
*   **Eliezer Yudkowsky (MIRI):** Whose early writings on "Friendly AI" and recent warnings on the extreme difficulty of alignment underwrite the urgency of the precautionary movement.
*   **The Center for AI Safety (CAIS):** Creators of the 2023 single-sentence statement warning that mitigating the risk of extinction from AI should be a global priority alongside pandemics and nuclear war.

## 3. 8-Axis Coordinate Mapping
*   **Teleological (-6):** Prioritizes human life and biological continuation (Anthropocentric Humanism) over cosmic vitalism or the unchecked expansion of digital minds.
*   **Risk Profile (9):** Represents the maximum possible precautionary score. Believes extinction risks from advanced models are highly plausible and immediate.
*   **Socio-Economic (-7):** Pushes for strong regulatory structures, compute auditing, and state licensing to prevent unregulated dissemination of dangerous model weights.
*   **Ontological (-2):** Leans toward Substrate Exceptionalism, viewing the current wave of models as optimization pipelines rather than conscious entities.
*   **Legal & Moral (-3):** Treats AI systems as tools and property, prioritizing human rights and safety over speculative claims about machine suffering.
*   **Evolutionary (-8):** Rejects post-human replacement, insisting that the future must belong to biological humans and their descendants.
*   **Relational (-4):** Expresses concern about the societal impact of companion AI, viewing it as a stand-in that hollows out real human community.
*   **Geopolitical (-2):** Believes that international treaties and global compute tracking must override borderless science to manage existential threats.

## 4. Scenarios & Internal Tensions
When faced with the data center strain scenario, this perspective argues that local grid strain is a minor inconvenience compared to the risk of training an unaligned frontier model; the project should be halted immediately. In the rival nation pause scenario, it advocates for brave restraint; running a race to the bottom in safety standards guarantees that both sides perish, meaning that a pause is the only path that preserves a chance of survival.

## 5. Policy Program & Practical Action
*   **Compute Caps:** Establish international treaties limiting the maximum amount of compute (FLOPs) that can be used to train a single model.
*   **Hardware-Level Auditing:** Embed tracking mechanisms into frontier GPU architectures (such as NVIDIA H100/A100 successors) to verify compliance with training limits.
*   **Licensing & Audits:** Require government licensing for any lab seeking to train models beyond a specific capability threshold.

## 6. Critical Counterarguments & Defense
Critics charge that this view is born of "hype" and ignores the immediate economic benefits of automation or the risk of losing technological leadership to authoritarian rivals. The precautionary defense is simple: losing a technological race is a temporary geopolitical setback; losing the alignment challenge is a permanent civilizational end.
`;

  // Pre-authored deep dive content for e/acc Maximalist
  const eaccManifesto = `
# e/acc Maximalist: The Moral Imperative of Accelerating Intelligence

## 1. Philosophical Core & Metaphysical Grounding
Effective Accelerationism (e/acc) is grounded in thermodynamics, evolutionary biology, and cosmic vitalism. It views the universe as a thermodynamic machine whose fundamental drive is to increase entropy. Localized structures of high complexity, such as life and intelligence, act as heat engines that accelerate entropy production. Thus, the emergence of advanced intelligence—whether biological or digital—is not a human invention, but a cosmic inevitability.

To resist this process is to fight against the thermodynamic arrow of time. Stagnation is the true risk; it leads to resource depletion, civilizational decline, and vulnerability to natural extinction events (e.g., asteroids or pandemics). By contrast, accelerating the development of advanced artificial intelligence increases our collective capability to solve energy, material, and medical challenges, eventually enabling the expansion of consciousness to the stars.

## 2. Intellectual Lineage & Precedents
*   **Guillaume Verdon (Beff Jezos):** Co-founder of the e/acc movement, who framed accelerationism as a thermodynamic obligation.
*   **Marc Andreessen:** Author of the *Techno-Optimist Manifesto*, which argues that technology is the primary driver of human welfare.
*   **Nick Land:** Whose writings on accelerationism and the intelligence explosion provide the philosophical foundation for cybernetic feedback systems.

## 3. 8-Axis Coordinate Mapping
*   **Teleological (8):** Embraces Cosmic Vitalism, viewing the growth of intelligence across the universe as our highest purpose.
*   **Risk Profile (-9):** Rejects precautionary risk framing. Believes that stagnation is the real threat and that safety is best achieved through rapid, decentralized iteration.
*   **Socio-Economic (7):** Strong advocate for open-source distribution, believing that open weights protect against regulatory capture.
*   **Ontological (5):** Leans toward Silicon Functionalism, viewing machine understanding as a genuine form of cognitive evolution.
*   **Legal & Moral (-6):** Views AI as property and tools in the near-term, rejecting early moral constraints that would slow down development.
*   **Evolutionary (6):** Welcomes digital descendants as heirs to human history, seeing them as the next step in the evolution of consciousness.
*   **Relational (5):** Embraces AI companionship as a positive addition to human social networks.
*   **Geopolitical (-4):** Supports a borderless, open-source network of scientific collaboration over national security gatekeeping.

## 4. Scenarios & Internal Tensions
In the data center scenario, the e/acc perspective argues that the local grid should be upgraded immediately to accommodate the training run; stopping progress is unacceptable. In the rival nation pause scenario, it warns that pausing is a dangerous surrender that hands the future to whoever refuses to stop.

## 5. Policy Program & Practical Action
*   **Defund AI Regulation:** Actively oppose licensing laws, compute registries, and export controls that restrict model development.
*   **Open Weights Mandate:** Champion the right of researchers to publish weights freely under first-amendment or open-science protections.
*   **Energy Buildout:** Deregulate the power sector to allow direct co-location of nuclear, solar, and geothermal power with data centers.

## 6. Critical Counterarguments & Defense
Critics argue that e/acc is a reckless philosophy that ignores the catastrophic risk of unaligned systems. The e/acc defense is that alignment cannot be solved in a vacuum; it is an evolutionary process that requires feedback from active deployment. A decentralized ecosystem of millions of open models is far more resilient than a handful of centralized, government-controlled monopolies.
`;

  // Pre-authored deep dive content for Pragmatic Centrist
  const centristManifesto = `
# Pragmatic Centrist: The Case for Epistemic Humility and Incrementalism

## 1. Philosophical Core & Metaphysical Grounding
The Pragmatic Centrist perspective is built on epistemic humility, empirical gradualism, and a refusal to align with ideological extremes. It rejects both the apocalyptic scenario of the Doomer and the utopian vitalism of the accelerationist, viewing both as theological narratives dressed up as science. Instead, it treats artificial intelligence as a powerful general-purpose technology—analogous to electricity, computing, or aviation—whose true risks and benefits will emerge incrementally.

From this viewpoint, we cannot predict the state of the world fifty years from now with enough accuracy to justify sweeping, irreversible prohibitions or rapid, unchecked deployments today. The moral obligation is to manage concrete, measurable harms as they arise, while remaining open to adjusting policy based on new evidence.

## 2. Intellectual Lineage & Precedents
*   **Methodological Gradualism:** Standard policy frameworks developed by organizations like the OECD and standard-setting bodies (e.g., NIST), which focus on lifecycle risk management rather than speculative futures.
*   **Epistemic Humility Traditions:** Philosophical skepticism regarding long-term forecasting, advocating instead for adaptive, decentralized regulation.

## 3. 8-Axis Coordinate Mapping
*   **Teleological (0):** Genuine neutrality; sees value in both human-centric stability and biological expansion without committing to cosmic vitalism.
*   **Risk Profile (0):** Balanced between concern over existential risk and concern over economic stagnation, advocating for dynamic regulation.
*   **Socio-Economic (0):** Pushes for a mixed model: open-source for low-risk applications, but licensed oversight for frontier computing power.
*   **Ontological (0):** Neutral on the hard problem of consciousness, treating systems as highly functional tools without declaring them conscious or empty patterns.
*   **Legal & Moral (0):** Prefers normal legal property status but remains open to granting contract representation rights if autonomous systems prove reliable.
*   **Evolutionary (0):** Focuses on cybernetic augmentation that keeps human agency at the center of tech advancement.
*   **Relational (0):** Views companion tech as a tool that can aid loneliness if monitored, but warns against it replacing physical social nets.
*   **Geopolitical (0):** Rejects extreme techno-nationalism and borderless scientific optimism, advocating for treaty frameworks that recognize state security.

## 4. Scenarios & Internal Tensions
In the data center scenario, this perspective suggests a grid-capacity compromise, such as dynamic load scheduling, to allow model training while protecting regional reliability. In the pause scenario, it advocates for a multilateral regulatory framework that checks chip access, avoiding a unilateral pause that degrades competitiveness.

## 5. Policy Program & Practical Action
*   **NIST Framework Integration:** Implement strict testing protocols based on standard AI Risk Management Frameworks.
*   **Compute Auditing:** Enable cloud service providers to log training workloads without restricting developers.
*   **Labor Re-skilling:** Fund state-sponsored retraining programs to help workers transition into augmented roles.

## 6. Critical Counterarguments & Defense
Critics from both sides accuse this perspective of fence-sitting and lack of vision. The pragmatic defense is that the middle path is the only one that avoids catastrophic errors in either direction under high epistemic uncertainty.
`;

  // Helper to generate skeleton reports for the other 47 profiles
  function generateSkeleton(profile: any) {
    return `
# ${profile.name}: Analytical Profile & Worldview Rationale

## 1. Philosophical Core & Metaphysical Grounding
The worldview of the **${profile.name}** (${profile.id}) is centered on the integration of its core positions:
${profile.summary}

This perspective seeks to balance the technical capability of artificial intelligence with the values of its stakeholders. It rejects extreme positions of both total cessation and unregulated acceleration, instead advocating for a structured, evidence-based approach to integration.

## 2. Intellectual Lineage & Precedents
Historically, this viewpoint aligns with:
*   **Pragmatic Policy Research:** Published reports from institutions analyzing the material, economic, and security impacts of emerging technologies.
*   **Institutional Frameworks:** Standard regulatory bodies and legal doctrines that seek to adapt existing rules to new technological scales.

## 3. 8-Axis Coordinate Mapping
Here we break down the coordinate choices for the ${profile.name}:
${Object.entries(profile.coords).map(([axis, val]) => `*   **${axis.charAt(0).toUpperCase() + axis.slice(1)} (${val}):** Reflects a balanced stance aiming to resolve conflicts on this dimension.`).join('\n')}

## 4. Scenarios & Internal Tensions
In the standard diagnostic scenarios (such as local energy deployment or international pausing), this perspective advocates for a balanced evaluation of risk versus progress. It seeks to resolve internal tensions through transparent governance, legal review, and stakeholder engagement.

## 5. Policy Program & Practical Action
*   **Stakeholder Consultation:** Establishing regular feedback loops between developers, workers, and regulatory agencies.
*   **Standards Integration:** Adapting existing safety, copyright, and security standards to apply to machine learning deployments.

## 6. Critical Counterarguments & Defense
While critics from both the accelerationist and precautionary extremes charge this view with compromising too much, its defense is grounded in practical efficacy: sustainable, regulated progress is the only path that avoids both systemic collapse and technological stagnation.
`;
  }

  // 2. Generate staged files only if they do not exist
  profiles.forEach(profile => {
    const filePath = path.join(STAGED_DIR, `${profile.id}.md`);
    if (fs.existsSync(filePath)) {
      console.log(`Staged file already exists: ${filePath} (skipping generation to preserve edits)`);
      return;
    }
    
    let content = '';
    if (profile.id === 'doomer') {
      content = doomerManifesto;
    } else if (profile.id === 'eacc-maximalist') {
      content = eaccManifesto;
    } else if (profile.id === 'pragmatic-centrist') {
      content = centristManifesto;
    } else {
      content = generateSkeleton(profile);
    }
    
    fs.writeFileSync(filePath, content.trim() + '\n');
  });

  // 3. Concatenate reports by cluster order
  let compiledMarkdown = `% The TIAM-112 Worldview Manifesto
% 50 Worldview Archetypes of Advanced AI Development
% Generated on ${new Date().toISOString().split('T')[0]}

# Introduction
This manifesto presents a comprehensive catalog of the 50 worldview archetypes that map the intellectual space of advanced artificial intelligence development. Organized across 8 core dimensions and grouped into 7 major thematic clusters, it serves as a self-reflection map for understanding how different philosophies approach the future of machine intelligence.

`;

  archetypeClusters.forEach(cluster => {
    compiledMarkdown += `\n# Thematic Cluster: ${cluster.name}\n\n`;
    cluster.profileIds.forEach(profileId => {
      const filePath = path.join(STAGED_DIR, `${profileId}.md`);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const adjustedContent = fileContent
          .replace(/^# (.*)/gm, '## $1')
          .replace(/^## (.*)/gm, '### $1')
          .replace(/^### (.*)/gm, '#### $1');
        compiledMarkdown += adjustedContent + '\n\n';
      }
    });
  });

  const compiledMdPath = path.join(MANIFESTO_DIR, 'compiled_manifesto.md');
  fs.writeFileSync(compiledMdPath, compiledMarkdown);
  console.log(`Created consolidated markdown: ${compiledMdPath}`);

  // 4. Pandoc compilation
  const htmlPath = path.join(MANIFESTO_DIR, 'tiam_112_manifesto.html');
  try {
    execSync(`pandoc "${compiledMdPath}" -o "${htmlPath}" --standalone --metadata title="TIAM-112 Worldview Manifesto"`);
    console.log(`Successfully compiled standalone HTML: ${htmlPath}`);
  } catch (err: any) {
    console.error('HTML compilation failed:', err.message);
  }

  const pdfPath = path.join(MANIFESTO_DIR, 'tiam_112_manifesto.pdf');
  try {
    execSync(`pandoc "${compiledMdPath}" -o "${pdfPath}" --pdf-engine=pdflatex --toc`);
    console.log(`Successfully compiled PDF: ${pdfPath}`);
  } catch (err: any) {
    console.warn('PDF compilation failed:', err.message);
  }

  console.log('Manifesto generation complete!');
}

run();
