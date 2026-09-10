import React from 'react';
import { CheckCircle2, Clock, BrainCircuit, AlertCircle, Send } from 'lucide-react';
import type { ProcessingStatus } from '../../types/safety.types';

interface ReportLifecycleTimelineProps {
  status: ProcessingStatus;
  submittedAt: string;
  evaluatedAt?: string;
  modelVersion?: string;
  reporter?: string;
}

export const ReportLifecycleTimeline: React.FC<ReportLifecycleTimelineProps> = ({
  status,
  submittedAt,
  evaluatedAt,
  modelVersion = 'fastapi-sif-nlp-v1',
  reporter = 'Field HSE Officer (Shift Patrol)'
}) => {
  const isPending = status === 'PENDING';
  const isAnalyzing = status === 'ANALYZING';
  const isAnalyzed = status === 'ANALYZED';
  const isFailed = status === 'FAILED';

  const steps = [
    {
      id: 'step-1',
      title: 'Report Ingested',
      description: `Logged by ${reporter}`,
      date: submittedAt ? new Date(submittedAt).toLocaleString() : 'Recently',
      isComplete: true,
      isCurrent: false,
      icon: Send,
      color: 'var(--color-primary)'
    },
    {
      id: 'step-2',
      title: 'Processing State',
      description: isAnalyzed
        ? 'Successfully processed by NLP pipeline'
        : isAnalyzing
        ? 'NLP feature extraction in progress...'
        : isFailed
        ? 'Processing encountered pipeline error'
        : 'Queued in processing backlog',
      date: isAnalyzed ? 'Completed' : isAnalyzing ? 'In Progress' : isFailed ? 'Failed' : 'Pending',
      isComplete: isAnalyzed,
      isCurrent: isAnalyzing || isPending,
      icon: isFailed ? AlertCircle : isAnalyzing ? BrainCircuit : isAnalyzed ? CheckCircle2 : Clock,
      color: isFailed
        ? 'var(--color-danger)'
        : isAnalyzing
        ? 'var(--color-warning)'
        : isAnalyzed
        ? 'var(--color-safe)'
        : 'var(--color-text-muted)'
    },
    {
      id: 'step-3',
      title: 'SIF Assessment Evaluated',
      description: isAnalyzed
        ? `Model ${modelVersion} SIF Precursor mapped`
        : 'Awaiting model inference completion',
      date: evaluatedAt ? new Date(evaluatedAt).toLocaleString() : 'Pending evaluation',
      isComplete: isAnalyzed,
      isCurrent: isAnalyzed,
      icon: isAnalyzed ? CheckCircle2 : Clock,
      color: isAnalyzed ? 'var(--color-sif)' : 'var(--color-text-muted)'
    }
  ];

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px 20px',
        marginBottom: '24px'
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          display: 'block',
          marginBottom: '14px'
        }}
      >
        Safety Report Lifecycle & Audit Trail
      </span>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          position: 'relative'
        }}
      >
        {steps.map((step, idx) => {
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                backgroundColor: 'var(--color-bg-subtle)',
                border: `1px solid ${step.isComplete ? 'var(--color-border)' : 'var(--color-border-subtle)'}`,
                borderLeft: `4px solid ${step.color}`,
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: step.color,
                  flexShrink: 0
                }}
              >
                <Icon size={16} style={{ animation: isAnalyzing && idx === 1 ? 'spin 1.5s linear infinite' : 'none' }} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Step {idx + 1}
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {step.title}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '0 0 4px 0', lineHeight: 1.35 }}>
                  {step.description}
                </p>
                <span style={{ fontSize: '10px', color: step.color, fontWeight: 600 }}>
                  {step.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
