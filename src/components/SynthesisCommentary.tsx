import React from 'react';
import styles from './SynthesisCommentary.module.css';

interface ExperimentResponseData {
  experimentKey: string;
  title: string;
  mainResponse: string | null;
  followUpReflections: string[];
}

interface ArchetypeInsight {
  archetype: string;
  description: string;
  alignment: number; // 0-100
}

interface SynthesisCommentaryProps {
  responses: ExperimentResponseData[];
  predictedArchetypes: ArchetypeInsight[];
  overallTheme?: string;
}

export const SynthesisCommentary: React.FC<SynthesisCommentaryProps> = ({
  responses,
  predictedArchetypes,
  overallTheme,
}) => {
  const topArchetype = predictedArchetypes[0];
  const runnerUp = predictedArchetypes[1];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <h2>Your Worldview Through Thought Experiments</h2>
          <p className={styles.subtitle}>
            Synthesis of how you navigated difficult philosophical scenarios
          </p>
        </div>

        {/* Key Theme */}
        {overallTheme && (
          <div className={styles.themeBox}>
            <h3>Central Theme</h3>
            <p>{overallTheme}</p>
          </div>
        )}

        {/* Response Summary */}
        <div className={styles.responseSection}>
          <h3>Your Responses</h3>
          <div className={styles.responseGrid}>
            {responses.map((exp, idx) => (
              <div key={idx} className={styles.responseCard}>
                <h4>{exp.title}</h4>
                {exp.mainResponse && (
                  <div className={styles.mainResponse}>
                    <strong>Position:</strong>
                    <p>{exp.mainResponse}</p>
                  </div>
                )}
                {exp.followUpReflections.length > 0 && (
                  <div className={styles.reflections}>
                    <strong>Reflections:</strong>
                    <ul>
                      {exp.followUpReflections.map((r, rIdx) => (
                        <li key={rIdx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Archetype Analysis */}
        <div className={styles.archetypeSection}>
          <h3>How You Align With Archetypes</h3>

          {topArchetype && (
            <div className={styles.topArchetype}>
              <div className={styles.archetypeHeader}>
                <h4>{topArchetype.archetype}</h4>
                <div className={styles.alignmentBar}>
                  <div
                    className={styles.alignmentFill}
                    style={{ width: `${topArchetype.alignment}%` }}
                  />
                </div>
                <span className={styles.alignmentPercent}>
                  {Math.round(topArchetype.alignment)}% alignment
                </span>
              </div>
              <p className={styles.description}>{topArchetype.description}</p>
            </div>
          )}

          {runnerUp && (
            <div className={styles.secondArchetype}>
              <div className={styles.archetypeHeader}>
                <h4>{runnerUp.archetype}</h4>
                <div className={styles.alignmentBar}>
                  <div
                    className={styles.alignmentFill}
                    style={{ width: `${runnerUp.alignment}%` }}
                  />
                </div>
                <span className={styles.alignmentPercent}>
                  {Math.round(runnerUp.alignment)}% alignment
                </span>
              </div>
              <p className={styles.description}>{runnerUp.description}</p>
            </div>
          )}
        </div>

        {/* Key Insights */}
        <div className={styles.insightsSection}>
          <h3>What Your Responses Reveal</h3>
          <div className={styles.insights}>
            <Insight
              title="Consciousness & Moral Status"
              content={`Your responses to experiments about consciousness, authenticity, and moral status
              suggest you prioritize ${
                topArchetype.archetype.includes('consciousness') ||
                topArchetype.archetype.includes('phenomenal')
                  ? 'subjective experience'
                  : 'observable behavior'
              } when determining what deserves moral consideration.`}
            />
            <Insight
              title="Individual vs. Collective"
              content={`When navigating scenarios about collective action, enhancement, and autonomy,
              you tend to emphasize ${
                topArchetype.archetype.includes('individual') ||
                topArchetype.archetype.includes('autonomy')
                  ? 'individual agency and choice'
                  : 'collective outcomes and shared flourishing'
              }.`}
            />
            <Insight
              title="Process vs. Outcomes"
              content={`Across multiple experiments, you revealed a preference for ${
                topArchetype.archetype.includes('pragmatist') ||
                topArchetype.archetype.includes('consequent')
                  ? 'outcomes and consequences'
                  : 'process integrity and principles'
              }, even when they conflict.`}
            />
          </div>
        </div>

        {/* Nuance Note */}
        <div className={styles.nuanceBox}>
          <p>
            <strong>Note:</strong> These archetypes are simplifications of genuine complexity.
            Your actual worldview likely spans multiple positions and contains tensions.
            The experiments above highlight how these tensions appear in real scenarios.
          </p>
        </div>
      </div>
    </div>
  );
};

interface InsightProps {
  title: string;
  content: string;
}

const Insight: React.FC<InsightProps> = ({ title, content }) => (
  <div className={styles.insight}>
    <h4>{title}</h4>
    <p>{content}</p>
  </div>
);

export default SynthesisCommentary;
