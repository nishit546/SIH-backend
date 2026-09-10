import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Users,
  AlertOctagon,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  FileText,
  MapPin,
  Building2,
  Activity,
  Calendar,
  Tag,
  User,
  Zap,
  CheckCircle2,
  Clock,
  Briefcase
} from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { StatusBadge } from '../components/common/StatusBadge';
import { SifStatus } from '../components/analysis/SifStatus';
import { AnalysisSection } from '../components/analysis/AnalysisSection';
import { TagList } from '../components/analysis/TagList';
import { ReportLifecycleTimeline } from '../components/reports/ReportLifecycleTimeline';
import { MOCK_REPORTS_LIST } from '../mock/mockReportsList';
import type { SafetyReport, SafetyAnalysis } from '../types/safety.types';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Find report by ID or fallback to the primary incident
  const initialReport = MOCK_REPORTS_LIST.find((r) => r.id === id) || MOCK_REPORTS_LIST[0];
  const [report, setReport] = useState<SafetyReport>(initialReport);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const analysis = report.latestAnalysis;

  const handleRunAnalysis = (isReanalysis = false) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const generatedAnalysis: SafetyAnalysis = {
        id: `an-${Date.now()}`,
        reportId: report.id,
        sifPotential: true,
        probability: 0.88,
        riskLevel: 'HIGH',
        hazards: ['welding', 'pipeline', 'pressure', 'gas'],
        exposures: ['worker'],
        criticalControls: ['Double Block and Bleed', 'Atmospheric Gas Testing'],
        controlFailures: ['before gas testing was completed'],
        barrierStatus: null,
        potentialConsequences: ['Catastrophic hydrocarbon fire/explosion and worker fatality'],
        iogpRules: ['Hot Work', 'Energy Isolation', 'Work Authorization'],
        explanation:
          'Critical Triad detected: Hot work commenced on pressurized gas infrastructure without mandatory pre-entry atmospheric clearance. Severe barrier failure with immediate fatality risk.',
        modelVersion: 'fastapi-sif-nlp-v1',
        isLatest: true,
        createdAt: new Date().toISOString()
      };

      setReport((prev) => ({
        ...prev,
        status: 'ANALYZED',
        latestAnalysis: generatedAnalysis
      }));

      setIsAnalyzing(false);
      setToastMessage(
        isReanalysis
          ? 'Safety report re-analyzed successfully by AI engine.'
          : 'Safety report analyzed and SIF Precursors evaluated.'
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1200);
  };

  return (
    <PageContainer>
      {/* Top Back Navigation & Toast */}
      <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link
          to="/reports"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={15} />
          Back to Reports Log
        </Link>

        {showToast && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-safe)',
              backgroundColor: 'var(--color-safe-subtle)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <CheckCircle2 size={14} />
            {toastMessage}
          </div>
        )}
      </div>

      {/* Page Header */}
      <PageHeader
        title={`Safety Report: ${report.reportNumber || report.id}`}
        description={`Logged at ${report.site} (${report.activity}) • Complete lifecycle and AI reasoning review.`}
        badge={<StatusBadge status={report.status} />}
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {analysis ? (
              <>
                <Link
                  to={`/reports/${report.id}/analysis`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-main)',
                    border: '1px solid var(--color-border)',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  <Sparkles size={14} color="var(--color-sif)" />
                  Dedicated AI View
                </Link>

                <button
                  type="button"
                  onClick={() => handleRunAnalysis(true)}
                  disabled={isAnalyzing}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--color-sif)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                    boxShadow: '0 0 12px rgba(168, 85, 247, 0.25)'
                  }}
                >
                  <RotateCw size={14} style={{ animation: isAnalyzing ? 'spin 1s linear infinite' : 'none' }} />
                  {isAnalyzing ? 'Re-analyzing...' : 'Re-analyze Report'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleRunAnalysis(false)}
                disabled={isAnalyzing}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer'
                }}
              >
                <Zap size={15} />
                {isAnalyzing ? 'Executing AI Pipeline...' : 'Analyze Safety Report'}
              </button>
            )}
          </div>
        }
      />

      {/* SECTION 2 — PROCESSING STATUS LIFECYCLE TIMELINE */}
      <ReportLifecycleTimeline
        status={report.status}
        submittedAt={report.createdAt}
        evaluatedAt={analysis?.createdAt}
        modelVersion={analysis?.modelVersion || 'fastapi-sif-nlp-v1'}
        reporter="R. Sharma (Safety Officer - Field Operations)"
      />

      {/* SECTION 1 — ORIGINAL REPORT CARD */}
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '22px 24px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '12px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--color-primary)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
              Section 1 — Original Safety Observation
            </h3>
          </div>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--color-primary)', fontWeight: 700 }}>
            {report.reportNumber || report.id}
          </span>
        </div>

        {/* Visually Prominent Description Narrative */}
        <div style={{ marginBottom: '18px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '6px'
            }}
          >
            Raw Unmutated Field Statement
          </span>
          <div
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderLeft: '4px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              fontSize: '14px',
              color: 'var(--color-text-main)',
              lineHeight: 1.6,
              fontWeight: 500
            }}
          >
            "{report.description}"
          </div>
        </div>

        {/* Structured Metadata Grid (All Required Fields) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px'
          }}
        >
          {/* Site */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <MapPin size={15} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Operational Site
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {report.site}
              </span>
            </div>
          </div>

          {/* Department */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Building2 size={15} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Department
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {report.department || 'Operations'}
              </span>
            </div>
          </div>

          {/* Activity */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Activity size={15} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Specific Activity
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {report.activity}
              </span>
            </div>
          </div>

          {/* Report Type */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Tag size={15} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Report Type
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {report.reportType.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Contractor Type */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Briefcase size={15} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Contractor Type
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {report.contractorType || 'Direct EPC Contractor'}
              </span>
            </div>
          </div>

          {/* Work Phase */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Clock size={15} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Work Phase
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {report.workPhase || 'Live Execution & Hot Work'}
              </span>
            </div>
          </div>

          {/* Reporter */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <User size={15} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Logged By (Reporter)
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                R. Sharma (Safety Officer)
              </span>
            </div>
          </div>

          {/* Event Date */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Calendar size={15} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                Observed Date & Time
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {new Date(report.eventDate).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 — AI ANALYSIS & REASONING (REUSING ANALYSIS RESULT COMPONENTS) */}
      {analysis ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={18} color="var(--color-sif)" />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
              Section 3 — AI Safety Precursor Intelligence
            </h3>
          </div>

          {/* SIF Status Banner */}
          <div style={{ marginBottom: '24px' }}>
            <SifStatus
              sifPotential={analysis.sifPotential}
              probability={analysis.probability}
              riskLevel={analysis.riskLevel}
            />
          </div>

          {/* Two-Column Domain Evidence Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
              gap: '24px',
              alignItems: 'start'
            }}
          >
            {/* Left Column: AI Explanation & Consequences */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* AI Explanation */}
              <AnalysisSection
                icon={<Sparkles size={18} color="var(--color-sif)" />}
                title="Why was this flagged?"
                subtitle="Human-interpretable reasoning derived by the AI safety intelligence engine"
                badge={
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    Model: {analysis.modelVersion || 'fastapi-sif-nlp-v1'}
                  </span>
                }
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-sif-subtle)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    borderLeft: '4px solid var(--color-sif)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px 18px',
                    marginBottom: '12px'
                  }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      lineHeight: 1.6,
                      color: 'var(--color-text-main)',
                      margin: 0,
                      fontWeight: 500
                    }}
                  >
                    {analysis.explanation}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    paddingTop: '6px'
                  }}
                >
                  <span>Ontology: v1.0.0</span>
                  <span>Evaluated: {new Date(analysis.createdAt).toLocaleString()}</span>
                </div>
              </AnalysisSection>

              {/* Potential Consequences */}
              <AnalysisSection
                icon={<AlertOctagon size={18} color="var(--color-danger)" />}
                title="Potential Consequences"
                subtitle="Worst credible catastrophic outcomes if controls and barriers remain breached"
              >
                <div
                  style={{
                    backgroundColor: 'var(--color-danger-subtle)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px'
                  }}
                >
                  {analysis.potentialConsequences && analysis.potentialConsequences.length > 0 ? (
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                      }}
                    >
                      {analysis.potentialConsequences.map((consequence, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--color-danger)',
                            lineHeight: 1.5
                          }}
                        >
                          {consequence}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      No severe high-consequence outcome modeled.
                    </span>
                  )}
                </div>
              </AnalysisSection>
            </div>

            {/* Right Column: Life-Saving Rules, Hazards, Exposure, Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* IOGP Life-Saving Rules */}
              <AnalysisSection
                icon={<ShieldCheck size={18} color="var(--color-primary)" />}
                title="IOGP Life-Saving Rules"
                subtitle="Core industry safety rules associated with this observation"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {analysis.iogpRules && analysis.iogpRules.length > 0 ? (
                    analysis.iogpRules.map((rule, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          backgroundColor: 'var(--color-sif-subtle)',
                          border: '1px solid rgba(168, 85, 247, 0.35)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              color: 'var(--color-sif)',
                              backgroundColor: 'rgba(168, 85, 247, 0.2)',
                              padding: '2px 6px',
                              borderRadius: '3px'
                            }}
                          >
                            LSR #{idx + 1}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                            {rule}
                          </span>
                        </div>
                        <ShieldCheck size={15} color="var(--color-sif)" />
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      No specific IOGP rule mapped.
                    </div>
                  )}
                </div>
              </AnalysisSection>

              {/* Identified Hazards */}
              <AnalysisSection
                icon={<Flame size={18} color="#f97316" />}
                title="Identified Hazards & Energies"
                subtitle="Physical energy sources, chemical releases, or environmental factors"
              >
                <TagList items={analysis.hazards} variant="hazard" emptyMessage="No distinct hazards identified." />
              </AnalysisSection>

              {/* Exposures */}
              <AnalysisSection
                icon={<Users size={18} color="var(--color-primary)" />}
                title="Exposed Personnel & Assets"
                subtitle="Workers, contractors, or physical assets in the line of fire"
              >
                <TagList items={analysis.exposures} variant="exposure" emptyMessage="No specific exposure targets identified." />
              </AnalysisSection>

              {/* Control Failures */}
              <AnalysisSection
                icon={<AlertTriangle size={18} color="var(--color-danger)" />}
                title="Control & Barrier Failures"
                subtitle="Bypassed, missing, or compromised preventative barriers"
              >
                {analysis.controlFailures && analysis.controlFailures.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysis.controlFailures.map((failure, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          padding: '10px 12px',
                          backgroundColor: 'var(--color-bg-subtle)',
                          border: '1px solid var(--color-border)',
                          borderLeft: '4px solid var(--color-danger)',
                          borderRadius: 'var(--radius-md)'
                        }}
                      >
                        <AlertTriangle size={15} color="var(--color-danger)" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.4, fontWeight: 500 }}>
                          {failure}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      fontStyle: 'italic',
                      padding: '10px 12px',
                      backgroundColor: 'var(--color-bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px dashed var(--color-border)'
                    }}
                  >
                    No control failures identified.
                  </div>
                )}
              </AnalysisSection>
            </div>
          </div>
        </div>
      ) : (
        /* PENDING OR UNANALYZED STATE */
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '36px 24px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-warning-subtle)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-warning)',
              margin: '0 auto 16px'
            }}
          >
            <Clock size={28} />
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>
            Awaiting AI SIF Precursor Evaluation
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.5 }}>
            This safety observation has been logged in the system. Run the AI reasoning pipeline to classify SIF potential, identify barrier degradations, and map IOGP Life-Saving Rules.
          </p>

          <button
            type="button"
            onClick={() => handleRunAnalysis(false)}
            disabled={isAnalyzing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              border: 'none',
              padding: '10px 22px',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isAnalyzing ? 'not-allowed' : 'pointer'
            }}
          >
            <Zap size={16} />
            {isAnalyzing ? 'Running AI Pipeline Inference...' : 'Analyze Safety Report Now'}
          </button>
        </div>
      )}
    </PageContainer>
  );
};
