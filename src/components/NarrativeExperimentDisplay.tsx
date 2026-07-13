import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './NarrativeExperimentDisplay.module.css';

interface ExperimentQuestion {
  question: string;
  options?: string[];
  subtext?: string;
}

interface NarrativeExperimentProps {
  experimentKey: string;
  title: string;
  narrative: string;
  clash: {
    external: string;
    internal: string;
  };
  mainQuestion: ExperimentQuestion;
  followUpQuestions: ExperimentQuestion[];
  onRespond: (responses: {
    experimentKey: string;
    mainResponse: string | null;
    followUpResponses: Record<string, boolean>;
    timestamp: string;
  }) => void;
}

export const NarrativeExperimentDisplay: React.FC<NarrativeExperimentProps> = ({
  experimentKey,
  title,
  narrative,
  clash,
  mainQuestion,
  followUpQuestions,
  onRespond,
}) => {
  const [mainResponse, setMainResponse] = useState<string | null>(null);
  const [followUpResponses, setFollowUpResponses] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleFollowUpChange = (index: number, value: boolean) => {
    setFollowUpResponses(prev => ({
      ...prev,
      [`followup_${index}`]: value,
    }));
  };

  const handleSubmit = () => {
    onRespond({
      experimentKey,
      mainResponse,
      followUpResponses,
      timestamp: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.card}>
        {/* Title */}
        <h2 className={styles.title}>{title}</h2>

        {/* Narrative Introduction */}
        <motion.div
          className={styles.narrative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <p>{narrative}</p>
        </motion.div>

        {/* The Clash (External vs Internal) */}
        <motion.div
          className={styles.clash}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div className={styles.clashItem}>
            <strong className={styles.clashLabel}>External Reality:</strong>
            <p>{clash.external}</p>
          </div>
          <div className={styles.clashItem}>
            <strong className={styles.clashLabel}>Internal Tension:</strong>
            <p>{clash.internal}</p>
          </div>
        </motion.div>

        {/* Main Question */}
        <motion.div
          className={styles.mainQuestion}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <h3>{mainQuestion.question}</h3>
          {mainQuestion.subtext && (
            <p className={styles.subtext}>{mainQuestion.subtext}</p>
          )}

          {mainQuestion.options && mainQuestion.options.length > 0 ? (
            <div className={styles.optionsGrid}>
              {mainQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`${styles.optionButton} ${
                    mainResponse === option ? styles.selected : ''
                  }`}
                  onClick={() => setMainResponse(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              className={styles.textInput}
              placeholder="Share your response..."
              value={mainResponse || ''}
              onChange={(e) => setMainResponse(e.target.value)}
            />
          )}
        </motion.div>

        {/* Follow-Up Questions */}
        {followUpQuestions.length > 0 && (
          <motion.div
            className={styles.followUps}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <h3 className={styles.followUpHeading}>Reflect on These:</h3>
            <div className={styles.followUpList}>
              {followUpQuestions.map((q, idx) => (
                <div key={idx} className={styles.followUpItem}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={followUpResponses[`followup_${idx}`] || false}
                      onChange={(e) =>
                        handleFollowUpChange(idx, e.currentTarget.checked)
                      }
                      className={styles.checkbox}
                    />
                    <span>{q.question}</span>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          className={`${styles.submitButton} ${submitted ? styles.submitted : ''}`}
          onClick={handleSubmit}
          disabled={!mainResponse || submitted}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {submitted ? '✓ Response Recorded' : 'Continue Assessment'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NarrativeExperimentDisplay;
