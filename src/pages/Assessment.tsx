import React, { useState, useEffect } from 'react';
import { NarrativeExperimentDisplay } from '../components/NarrativeExperimentDisplay';
import { experimentIntegrationGuide } from '../data/experimentIntegration';
import { narrativeExperiments } from '../data/narrativeExperiments';
import { narrativeExperimentsB } from '../data/narrativeExperimentsB';
import { narrativeExperimentsC } from '../data/narrativeExperimentsC';
import { narrativeExperimentsD } from '../data/narrativeExperimentsD';

interface AssessmentState {
  respondentId: string;
  currentQuestionNumber: number;
  questionResponses: Record<string, any>;
  experimentResponses: Record<string, any>;
  showExperiment: boolean;
  currentExperimentKey: string | null;
  startTime: number;
  archetype: string | null;
}

const TOTAL_QUESTIONS = 145;
const ALL_EXPERIMENTS = {
  ...narrativeExperiments,
  ...narrativeExperimentsB,
  ...narrativeExperimentsC,
  ...narrativeExperimentsD,
};

export const Assessment: React.FC = () => {
  const [state, setState] = useState<AssessmentState>({
    respondentId: generateRespondentId(),
    currentQuestionNumber: 0,
    questionResponses: {},
    experimentResponses: {},
    showExperiment: false,
    currentExperimentKey: null,
    startTime: Date.now(),
    archetype: null,
  });

  // Check if experiment should be shown
  useEffect(() => {
    const placement = experimentIntegrationGuide.experimentPlacement.find(
      p => p.questionsAfter === state.currentQuestionNumber
    );

    if (placement && !state.experimentResponses[placement.experimentKey]) {
      setState(prev => ({
        ...prev,
        showExperiment: true,
        currentExperimentKey: placement.experimentKey,
      }));
    }
  }, [state.currentQuestionNumber, state.experimentResponses]);

  const handleQuestionResponse = (response: any) => {
    setState(prev => ({
      ...prev,
      questionResponses: {
        ...prev.questionResponses,
        [`q_${prev.currentQuestionNumber}`]: {
          response,
          timestamp: new Date().toISOString(),
          timeSpent: Date.now() - prev.startTime,
        },
      },
      currentQuestionNumber: prev.currentQuestionNumber + 1,
    }));
  };

  const handleExperimentResponse = (response: any) => {
    setState(prev => ({
      ...prev,
      experimentResponses: {
        ...prev.experimentResponses,
        [response.experimentKey]: {
          ...response,
          timestamp: new Date().toISOString(),
        },
      },
      showExperiment: false,
      currentExperimentKey: null,
    }));
  };

  const handleCompleteAssessment = async () => {
    const finalData = {
      respondentId: state.respondentId,
      sessionStartTime: new Date(state.startTime).toISOString(),
      sessionEndTime: new Date().toISOString(),
      totalTimeSpent: Date.now() - state.startTime,
      questionResponses: state.questionResponses,
      experimentResponses: state.experimentResponses,
      archetype: state.archetype,
      completionStatus: 'completed',
    };

    // Send to backend
    try {
      await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      // Show completion code
      const completionCode = generateCompletionCode(state.respondentId);
      alert(`✅ Assessment Complete!\n\nCompletion Code: ${completionCode}\n\nPlease submit this code to Prolific to confirm completion.`);

      // Reset or redirect
      window.location.href = '/thank-you';
    } catch (e) {
      console.error('Submission failed:', e);
      alert('Error submitting assessment. Please try again.');
    }
  };

  // Show experiment if active
  if (state.showExperiment && state.currentExperimentKey) {
    const experiment = ALL_EXPERIMENTS[state.currentExperimentKey as keyof typeof ALL_EXPERIMENTS];
    if (!experiment) return <div>Error: Experiment not found</div>;

    return (
      <NarrativeExperimentDisplay
        experimentKey={state.currentExperimentKey}
        title={experiment.title}
        narrative={experiment.intro}
        clash={experiment.clash}
        mainQuestion={experiment.questions[0]}
        followUpQuestions={experiment.questions[0].followups || []}
        onRespond={handleExperimentResponse}
      />
    );
  }

  // Show regular question
  if (state.currentQuestionNumber < TOTAL_QUESTIONS) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
            Question {state.currentQuestionNumber + 1} of {TOTAL_QUESTIONS}
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
            <div
              style={{
                width: `${((state.currentQuestionNumber + 1) / TOTAL_QUESTIONS) * 100}%`,
                height: '100%',
                backgroundColor: '#6366f1',
                borderRadius: '3px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>Sample Question {state.currentQuestionNumber + 1}</h3>
          <p>
            [This would be replaced with actual questions from your assessment database]
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <textarea
              placeholder="Your response..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => handleQuestionResponse('Sample response')}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Assessment complete
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h2>Assessment Complete! 🎉</h2>
      <p>Thank you for thoughtfully responding to all questions and thought experiments.</p>
      <button
        onClick={handleCompleteAssessment}
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1.1rem',
        }}
      >
        Submit Assessment & Get Completion Code
      </button>
    </div>
  );
};

function generateRespondentId(): string {
  return `R${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateCompletionCode(respondentId: string): string {
  return `ASSESS-${respondentId.substr(0, 8)}-SUCCESS`;
}

export default Assessment;
