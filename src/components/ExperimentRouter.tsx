import React, { useMemo } from 'react';
import { experimentIntegrationGuide } from '../data/experimentIntegration';

interface ExperimentRouterProps {
  currentQuestionNumber: number;
  totalQuestions: number;
  onShowExperiment: (experimentKey: string) => void;
  onHideExperiment: () => void;
  shownExperiments: Set<string>;
}

export const ExperimentRouter: React.FC<ExperimentRouterProps> = ({
  currentQuestionNumber,
  totalQuestions,
  onShowExperiment,
  onHideExperiment,
  shownExperiments,
}) => {
  const shouldShowExperiment = useMemo(() => {
    // Determine if an experiment should be shown at this question
    const currentPlacement = experimentIntegrationGuide.experimentPlacement.find(
      (placement) => placement.questionsAfter === currentQuestionNumber
    );

    if (currentPlacement && !shownExperiments.has(currentPlacement.experimentKey)) {
      onShowExperiment(currentPlacement.experimentKey);
      return currentPlacement.experimentKey;
    }

    return null;
  }, [currentQuestionNumber, shownExperiments, onShowExperiment]);

  // Get metadata about what axis the current questions are probing
  const currentAxisIndex = Math.floor((currentQuestionNumber - 1) / 18);
  const axisNames = [
    'Teleological',
    'Risk Profile',
    'Socio-Economic',
    'Ontological',
    'Legal & Moral',
    'Evolutionary',
    'Relational',
    'Geopolitical',
  ];
  const currentAxis = axisNames[currentAxisIndex] || 'Unknown';

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(255,255,255,0.95)',
        padding: '1rem',
        borderBottom: '1px solid #e0e0e0',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div>
        <span style={{ fontSize: '0.9rem', color: '#666' }}>
          Question {currentQuestionNumber} of {totalQuestions}
        </span>
        <span style={{ fontSize: '0.85rem', color: '#999', marginLeft: '1rem' }}>
          Exploring: <strong>{currentAxis}</strong> Axis
        </span>
      </div>

      {shouldShowExperiment && (
        <div style={{ fontSize: '0.9rem', color: '#6366f1' }}>
          💡 A thought experiment is available
        </div>
      )}
    </div>
  );
};

export default ExperimentRouter;
