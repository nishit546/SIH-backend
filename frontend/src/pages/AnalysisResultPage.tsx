import React, { useState, useEffect, useCallback } from 'react';
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
  Eye,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { ErrorState } from '../components/common/ErrorState';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { SifStatus } from '../components/analysis/SifStatus';
import { OriginalReportCard } from '../components/analysis/OriginalReportCard';
import { AnalysisSection } from '../components/analysis/AnalysisSection';
import { TagList } from '../components/analysis/TagList';
import { reportService } from '../services/reportService';
import type { SafetyReport, SafetyAnalysis } from '../types/safety.types';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [report, setReport] = useState<SafetyReport | null>(null);
  const [analysis, setAnalysis] = useState<SafetyAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string>('AI Analysis evaluated successfully!');

  const loadReportData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const fetchedReport = await reportService.getReportById(id);
      setReport(fetchedReport);

      if (fetchedReport.latestAnalysis) {
        setAnalysis(fetchedReport.latestAnalysis);
      } else {
        // If not analyzed yet, trigger automatic initial analysis
        try {
          const result = await reportService.triggerAnalysis(id);
          setAnalysis(result.analysis);
          setReport((prev) => (prev ? { ...prev, status: 'ANALYZED', latestAnalysis: result.analysis } : prev));
        } catch (analysisErr: any) {
          console.warn('Initial auto-analysis failed:', analysisErr);
        }
      }
    } catch (err: any) {
      console.error('Failed to load safety report for analysis:', err);
      setErrorMessage(err.message || 'Unable to load the requested safety report.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const handleReanalyze = async () => {
    if (!id) return;
    setIsReanalyzing(true);
    setErrorMessage(null);

    try {
      const result = await reportService.triggerAnalysis(id, true);
      setAnalysis(result.analysis);
      setReport((prev) => (prev ? { ...prev, status: 'ANALYZED', latestAnalysis: result.analysis } : prev));
      setToastText('AI Reasoning Pipeline re-evaluated report successfully!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err: any) {
      console.error('Re-analysis failed:', err);
      setErrorMessage(err.message || 'AI analysis is temporarily unavailable. Please retry.');
    } finally {
      setIsReanalyzing(false);
    }
  };

  if (isLoading && !report) {
    return (
      <PageContainer>
        <div style={{ marginBottom: '14px' }}>
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
        </div>

        {/* Top SIF Banner Skeleton */}
        <div style={{ marginBottom: '24px' }}>
          <SkeletonCard height="80px" showHeader={false} lines={1} />
        </div>

        {/* Two-Column Skeletons */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
            gap: '24px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SkeletonCard height="200px" lines={3} />
            <SkeletonCard height="240px" lines={4} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <SkeletonCard height="180px" lines={3} />
            <SkeletonCard height="160px" lines={2} />
            <SkeletonCard height="160px" lines={2} />
          </div>
        </div>
      </PageContainer>
    );
  }

  if (errorMessage && !report) {
    return (
      <PageContainer>
        <div style={{ marginBottom: '14px' }}>
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
        </div>

        <ErrorState
          title="Analysis Not Available"
          message={errorMessage}
          onRetry={loadReportData}
          isRetrying={isLoading}
          action={
            <Link
              to="/reports"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              Back to Reports Log
            </Link>
          }
        />
      </PageContainer>
    );
  }

  if (!report) return null;

  return (
    <PageContainer>
      {/* Top Back Navigation */}
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
            {toastText}
          </div>
        )}
      </div>

      {/* Page Header */}
      <PageHeader
        title={`SIF Precursor Analysis: ${report.reportNumber || report.id}`}
        description="Deep natural language reasoning, critical barrier evaluation, and IOGP Life-Saving Rules classification."
        badge={
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--color-sif)',
              backgroundColor: 'var(--color-sif-subtle)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            AI Intelligence Report
          </span>
        }
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Link
              to={`/reports/${report.id}`}
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
              <Eye size={14} />
              View Lifecycle Details
            </Link>

            <button
              type="button"
              onClick={handleReanalyze}
              disabled={isReanalyzing}
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
                cursor: isReanalyzing ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 12px rgba(168, 85, 247, 0.25)'
              }}
            >
              <RotateCw size={14} style={{ animation: isReanalyzing ? 'spin 1s linear infinite' : 'none' }} />
              {isReanalyzing ? 'Re-analyzing...' : 'Re-analyze Report'}
            </button>
          </div>
        }
      />

      {errorMessage && (
        <ErrorState
          compact
          title="Analysis Notice"
          message={errorMessage}
          type="ai"
          onRetry={handleReanalyze}
          isRetrying={isReanalyzing}
        />
      )}

      {analysis ? (
        <>
          {/* 1. SIF POTENTIAL BANNER / STATUS SECTION (HIGH PRIORITY) */}
          <div style={{ marginBottom: '24px' }}>
            <SifStatus
              sifPotential={analysis.sifPotential}
              probability={analysis.probability}
              riskLevel={analysis.riskLevel}
            />
          </div>

          {/* 2. MAIN TWO-COLUMN DASHBOARD GRID */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)',
              gap: '24px',
              alignItems: 'start'
            }}
          >
            {/* LEFT COLUMN: Original Observation, AI Explanation, Consequences */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Original Report Box */}
              <OriginalReportCard report={report} />

              {/* AI EXPLANATION SECTION: "Why was this flagged?" */}
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
                    Model: {analysis.modelVersion || 'sif-nlp-v2'}
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
                  <span>Model Version: {analysis.modelVersion || 'sif-nlp-v2'}</span>
                  <span>Evaluated: {new Date(analysis.createdAt).toLocaleString()}</span>
                </div>
              </AnalysisSection>

              {/* POTENTIAL CONSEQUENCES */}
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

            {/* RIGHT COLUMN: IOGP Rules, Hazards, Exposure, Control Failures */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* IOGP LIFE-SAVING RULES */}
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
                      No specific IOGP rule mapped to this report.
                    </div>
                  )}
                </div>
              </AnalysisSection>

              {/* DETECTED HAZARDS */}
              <AnalysisSection
                icon={<Flame size={18} color="#f97316" />}
                title="Identified Hazards & Energies"
                subtitle="Physical energy sources, chemical releases, or environmental factors"
              >
                <TagList items={analysis.hazards} variant="hazard" emptyMessage="No distinct hazards identified." />
              </AnalysisSection>

              {/* EXPOSURES */}
              <AnalysisSection
                icon={<Users size={18} color="var(--color-primary)" />}
                title="Exposed Personnel & Assets"
                subtitle="Workers, contractors, or physical assets in the line of fire"
              >
                <TagList items={analysis.exposures} variant="exposure" emptyMessage="No specific exposure targets identified." />
              </AnalysisSection>

              {/* CONTROL FAILURES */}
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
        </>
      ) : (
        /* Awaiting Analysis State */
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
            This safety observation is logged in the system. Run the AI reasoning pipeline to classify SIF potential, identify barrier degradations, and map IOGP Life-Saving Rules.
          </p>

          <button
            type="button"
            onClick={handleReanalyze}
            disabled={isReanalyzing}
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
              cursor: isReanalyzing ? 'not-allowed' : 'pointer'
            }}
          >
            <Zap size={16} />
            {isReanalyzing ? 'Running AI Pipeline Inference...' : 'Analyze Safety Report Now'}
          </button>
        </div>
      )}
    </PageContainer>
  );
};
