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
  Eye,
  CheckCircle2
} from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { SifStatus } from '../components/analysis/SifStatus';
import { OriginalReportCard } from '../components/analysis/OriginalReportCard';
import { AnalysisSection } from '../components/analysis/AnalysisSection';
import { TagList } from '../components/analysis/TagList';
import { MOCK_ANALYSIS_DATA } from '../mock/mockAnalysisData';
import { mockReports } from '../mock/mockData';
import type { AnalysisPageData } from '../types/analysis.types';

export const AnalysisResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isReanalyzing, setIsReanalyzing] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  // Load report data or use default matching mock scenario
  const matchingReport = mockReports.find((r) => r.id === id);
  const data: AnalysisPageData = matchingReport
    ? {
        report: {
          id: matchingReport.id,
          reportNumber: matchingReport.reportNumber,
          description: matchingReport.description,
          reportType: matchingReport.reportType,
          site: matchingReport.site,
          department: matchingReport.department || 'Operations & Maintenance',
          activity: matchingReport.activity,
          contractorType: matchingReport.contractorType || 'Direct EPC Contractor',
          workPhase: matchingReport.workPhase || 'Live Execution',
          eventDate: matchingReport.eventDate,
          status: matchingReport.status
        },
        analysis: matchingReport.latestAnalysis
          ? {
              sifPotential: matchingReport.latestAnalysis.sifPotential,
              probability: matchingReport.latestAnalysis.probability,
              riskLevel: matchingReport.latestAnalysis.riskLevel,
              hazards: matchingReport.latestAnalysis.hazards,
              exposures: matchingReport.latestAnalysis.exposures,
              criticalControls: matchingReport.latestAnalysis.criticalControls,
              controlFailures: matchingReport.latestAnalysis.controlFailures,
              barrierStatus: matchingReport.latestAnalysis.barrierStatus || null,
              potentialConsequences: matchingReport.latestAnalysis.potentialConsequences,
              iogpRules: matchingReport.latestAnalysis.iogpRules,
              explanation: matchingReport.latestAnalysis.explanation,
              modelVersion: matchingReport.latestAnalysis.modelVersion,
              ontologyVersion: 'v1.0.0',
              evaluatedAt: matchingReport.latestAnalysis.createdAt
            }
          : MOCK_ANALYSIS_DATA.analysis
      }
    : MOCK_ANALYSIS_DATA;

  const handleReanalyze = () => {
    setIsReanalyzing(true);
    setTimeout(() => {
      setIsReanalyzing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }, 1200);
  };

  const { report, analysis } = data;

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
            AI Analysis re-evaluated successfully!
          </div>
        )}
      </div>

      {/* Page Header */}
      <PageHeader
        title={`SIF Precursor Analysis: ${report.reportNumber}`}
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
              View Original Report
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
              <span>Ontology: {analysis.ontologyVersion || 'v1.0.0'}</span>
              <span>Evaluated: {analysis.evaluatedAt || new Date().toLocaleString()}</span>
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
    </PageContainer>
  );
};
