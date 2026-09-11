import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/common/PublicNavbar';
import { PublicFooter } from '../components/common/PublicFooter';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Gauge,
  Flame,
  FileText,
  Workflow,
  Zap,
} from 'lucide-react';

interface QuestionOption {
  label: string;
  sub: string;
  points: number; // Higher points = higher vulnerability
}

interface Question {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  options: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Monthly Incident & Observation Volume',
    description: 'How many safety reports, near-misses, and observations does your enterprise log per month?',
    icon: FileText,
    options: [
      { label: '< 100 observations/mo', sub: 'Low volume or single facility site', points: 1 },
      { label: '100 – 1,000 observations/mo', sub: 'Medium operational footprint across rigs/plants', points: 3 },
      { label: '1,000+ observations/mo', sub: 'Large multi-site enterprise or global fleet', points: 5 },
    ],
  },
  {
    id: 2,
    title: 'Unstructured Free-Text Reporting Ratio',
    description: 'What percentage of observations are submitted as free-form written descriptions or voice notes?',
    icon: Workflow,
    options: [
      { label: '< 20% free-text', sub: 'Strictly rigid dropdowns and checkboxes', points: 1 },
      { label: '20% – 60% free-text', sub: 'Hybrid format with narrative summary fields', points: 3 },
      { label: '> 60% free-text', sub: 'Predominantly open-ended text descriptions', points: 5 },
    ],
  },
  {
    id: 3,
    title: 'Current SIF Precursor Detection Method',
    description: 'How does your HSE team identify high-energy hazards buried in routine observations?',
    icon: Flame,
    options: [
      { label: 'Automated AI Precursor Reasoning', sub: 'Zero-delay NLP energy & barrier extraction', points: 1 },
      { label: 'Keyword Filtering & Spreadsheets', sub: 'Searching words like "fire", "fall", "leak"', points: 4 },
      { label: 'Manual Spot-Checks / Reactive Reviews', sub: 'Reviewed manually days or weeks later', points: 5 },
    ],
  },
  {
    id: 4,
    title: 'IOGP Life-Saving Rules & Barrier Mapping',
    description: 'Are your near-misses systematically mapped to IOGP Life-Saving Rules and critical barriers?',
    icon: ShieldCheck,
    options: [
      { label: 'Automated Instant Mapping', sub: 'Real-time classification against 9 IOGP rules', points: 1 },
      { label: 'Manual Post-Incident Categorization', sub: 'Assigned during formal safety investigations', points: 3 },
      { label: 'Ad-hoc / Not Standardized', sub: 'No unified global barrier taxonomy in use', points: 5 },
    ],
  },
];

export const FitTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([1, 1, 1, 1]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleSelectOption = (optionIndex: number) => {
    const updated = [...answers];
    updated[currentStep] = optionIndex;
    setAnswers(updated);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const calculateScore = () => {
    const totalPoints = answers.reduce((sum, optIdx, qIdx) => {
      return sum + QUESTIONS[qIdx].options[optIdx].points;
    }, 0);

    // Points range: 4 (lowest risk) to 20 (highest vulnerability)
    const percentage = Math.round(((totalPoints - 4) / 16) * 100);
    return Math.min(99, Math.max(15, percentage));
  };

  const riskScore = calculateScore();

  const getRiskTier = (score: number) => {
    if (score >= 70) {
      return {
        level: 'Critical SIF Blindspot Exposure',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.1)',
        desc: 'Over 65% of high-energy precursor events are likely passing through your reporting pipeline undetected until an escalation occurs.',
      };
    }
    if (score >= 40) {
      return {
        level: 'Moderate Precursor Latency',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.1)',
        desc: 'Manual or keyword-based workflows are introducing a 48–72 hour delay in isolating critical barrier failures.',
      };
    }
    return {
      level: 'High Operational Readiness',
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
      desc: 'Your pipeline is primed for immediate real-time automated NLP precursor intelligence and predictive safety triggers.',
    };
  };

  const tier = getRiskTier(riskScore);
  const missedPrecursorsEstimate = Math.round((riskScore / 100) * 340);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', color: '#111827', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />

      <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '100px',
                backgroundColor: 'rgba(255, 72, 0, 0.08)',
                color: '#ff4800',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              <Sparkles size={14} /> 60-Second Diagnostic
            </div>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: 800,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: '#ff4800',
                letterSpacing: '-0.02em',
                margin: '0 0 12px 0',
              }}
            >
              SIF Precursor Blindspot Assessment
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '600px', margin: '0 auto', lineHeight: 1.5 }}>
              Evaluate how effectively your current reporting workflow isolates fatal & serious precursor risks before they escalate.
            </p>
          </div>

          {!isCompleted ? (
            /* Questionnaire Box */
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                padding: '36px',
              }}
            >
              {/* Step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#ff4800' }}>
                  Question {currentStep + 1} of {QUESTIONS.length}
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {QUESTIONS.map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: '28px',
                        height: '6px',
                        borderRadius: '4px',
                        backgroundColor: idx <= currentStep ? '#ff4800' : '#e5e7eb',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Current Question */}
              {(() => {
                const q = QUESTIONS[currentStep];
                const Icon = q.icon;
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          backgroundColor: 'rgba(255, 72, 0, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={22} color="#ff4800" />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0', color: '#111827' }}>
                          {q.title}
                        </h2>
                        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
                          {q.description}
                        </p>
                      </div>
                    </div>

                    {/* Options list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {q.options.map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(optIdx)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '16px 20px',
                            borderRadius: '14px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: '#fafafa',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#ff4800';
                            e.currentTarget.style.backgroundColor = 'rgba(255, 72, 0, 0.03)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.backgroundColor = '#fafafa';
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
                              {opt.label}
                            </div>
                            <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                              {opt.sub}
                            </div>
                          </div>
                          <ArrowRight size={18} color="#9ca3af" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* Results Screen */
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
                padding: '40px 36px',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 16px',
                    borderRadius: '100px',
                    backgroundColor: tier.bg,
                    color: tier.color,
                    fontSize: '13px',
                    fontWeight: 700,
                    marginBottom: '16px',
                  }}
                >
                  <Gauge size={16} />
                  <span>{tier.level}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '64px', fontWeight: 900, color: tier.color, letterSpacing: '-0.03em' }}>
                    {riskScore}%
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 600, color: '#6b7280' }}>Blindspot Index</span>
                </div>
                <p style={{ fontSize: '15px', color: '#4b5563', maxWidth: '620px', margin: '12px auto 0 auto', lineHeight: 1.5 }}>
                  {tier.desc}
                </p>
              </div>

              {/* Metric Callouts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                    Est. Unclassified Precursors
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#111827', margin: '4px 0' }}>
                    ~{missedPrecursorsEstimate} / year
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    High-energy near-misses masked as routine minor incidents.
                  </div>
                </div>

                <div style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                    Precursor Detection Latency
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 800, color: '#ff4800', margin: '4px 0' }}>
                    &lt; 5 Seconds
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Achievable with SIF-Guard automated NLP vs current 48h backlog.
                  </div>
                </div>
              </div>

              {/* Action Recommendations */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '28px', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#111827' }}>
                  Recommended Immediate Interventions:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <span>Deploy automated free-text NLP parser to extract energy sources & failed barrier defenses.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <span>Map all field reports to standard IOGP 9 Life-Saving Rules to identify repetitive rule bypasses.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                    <CheckCircle2 size={18} color="#10b981" />
                    <span>Provide live role-based dashboards for HSE analysts to approve corrective actions in 24 hours.</span>
                  </div>
                </div>
              </div>

              {/* Next Steps Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '14px 28px',
                    borderRadius: '100px',
                    backgroundColor: '#ff4800',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(255, 72, 0, 0.3)',
                  }}
                >
                  <Zap size={18} />
                  <span>Launch Live Safety Console</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    setIsCompleted(false);
                    setCurrentStep(0);
                    setAnswers([1, 1, 1, 1]);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '14px 24px',
                    borderRadius: '100px',
                    backgroundColor: '#ffffff',
                    color: '#4b5563',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: '1px solid #d1d5db',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={15} />
                  <span>Retake Assessment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
