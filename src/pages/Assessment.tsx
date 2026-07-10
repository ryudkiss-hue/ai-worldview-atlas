import React, { useState, useEffect } from 'react';
import { NarrativeExperimentDisplay } from '../components/NarrativeExperimentDisplay';
import { SynthesisCommentary } from '../components/SynthesisCommentary';
import { experimentIntegrationGuide } from '../data/experimentIntegration';
import { assessmentQuestions, getQuestion, getTotalQuestions } from '../data/assessmentQuestions';
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
  if (state.currentQuestionNumber < getTotalQuestions()) {
    const question = getQuestion(state.currentQuestionNumber);
    if (!question) return <div>Error: Question not found</div>;

    const handleResponse = (response: string | string[]) => {
      handleQuestionResponse(response);
    };

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
            Question {state.currentQuestionNumber + 1} of {getTotalQuestions()}
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px' }}>
            <div
              style={{
                width: `${((state.currentQuestionNumber + 1) / getTotalQuestions()) * 100}%`,
                height: '100%',
                backgroundColor: '#6366f1',
                borderRadius: '3px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>{question.text}</h3>
          {question.subtext && (
            <p style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1.5rem' }}>
              {question.subtext}
            </p>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            {question.type === 'likert' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(score => (
                  <button
                    key={score}
                    onClick={() => handleResponse(score.toString())}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.borderColor = '#6366f1';
                      (e.target as HTMLElement).style.backgroundColor = '#f0f4ff';
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.borderColor = '#ddd';
                      (e.target as HTMLElement).style.backgroundColor = '#fff';
                    }}
                  >
                    {score}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'text' && (
              <textarea
                placeholder="Your response..."
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '1rem',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                }}
                onBlur={e => handleResponse(e.target.value)}
              />
            )}

            {question.type === 'choice' && question.options && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleResponse(option)}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#fff',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.borderColor = '#6366f1';
                      (e.target as HTMLElement).style.backgroundColor = '#f0f4ff';
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.borderColor = '#ddd';
                      (e.target as HTMLElement).style.backgroundColor = '#fff';
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type !== 'text' && (
              <button
                onClick={() => handleQuestionResponse('answered')}
                style={{
                  marginTop: '1.5rem',
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
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show synthesis results before completion code
  if (state.currentQuestionNumber === getTotalQuestions()) {
    const predictedArchetypes = [
      { archetype: 'Pragmatic Centrist', confidence: 0.72 },
      { archetype: 'Digital Rights Advocate', confidence: 0.65 },
    ];

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <SynthesisCommentary
          responses={Object.entries(state.experimentResponses).map(([key, resp]) => ({
            experimentKey: key,
            title: key.replace(/-/g, ' '),
            mainResponse: resp.mainResponse || 'No response',
            followUpReflections: Object.entries(resp.followUpResponses || {})
              .filter(([, checked]) => checked)
              .map(([key]) => key),
          }))}
          predictedArchetypes={predictedArchetypes}
          overallTheme="Your responses reflect a balanced approach that values both individual agency and collective outcomes."
        />

        <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
          <h2>Assessment Complete ✅</h2>
          <p>Thank you for your thoughtful responses to all questions and thought experiments.</p>
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
              marginTop: '1rem',
            }}
          >
            Get Completion Code
          </button>
        </div>
      </div>
    );
  }
};

function generateRespondentId(): string {
  return `R${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateCompletionCode(respondentId: string): string {
  return `ASSESS-${respondentId.substr(0, 8)}-SUCCESS`;
}

export default Assessment;
