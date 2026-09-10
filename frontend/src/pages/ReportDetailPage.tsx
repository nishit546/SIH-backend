import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { mockReports } from '../mock/mockData';
import {
  ArrowLeft,
  ShieldAlert,
  BrainCircuit,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Find report or fallback to first mock report
  const report = mockReports.find((r) => r.id === id) || mockReports[0];
  const analysis = report.latestAnalysis;

  return (
    <PageContainer>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/reports" style={{ color: '#38bdf8', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}>
          <ArrowLeft size={14} /> Back to Reports Log
        </Link>
      </div>

      <PageHeader
        title={`Safety Report: ${report.reportNumber}`}
        description={`Logged for ${report.site} (${report.activity}) on ${new Date(report.eventDate).toLocaleDateString()}`}
        badge={<StatusBadge status={report.status} />}
        actions={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
              Export PDF
            </button>
            <button className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
              <BrainCircuit size={14} /> Re-Run AI Analysis
            </button>
          </div>
        }
      />

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Left Column: Original Observation */}
        <Card title="Original Field Observation" subtitle="Raw unmutated statement submitted from site">
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#f8fafc' }}>
              "{report.description}"
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>REPORT TYPE</span>
              <span style={{ fontWeight: 600 }}>{report.reportType}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>FACILITY SITE</span>
              <span style={{ fontWeight: 600 }}>{report.site}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>ACTIVITY</span>
              <span style={{ fontWeight: 600 }}>{report.activity}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.75rem' }}>DEPARTMENT</span>
              <span style={{ fontWeight: 600 }}>{report.department || 'General'}</span>
            </div>
          </div>
        </Card>

        {/* Right Column: SIF Assessment Overview */}
        <Card title="SIF Precursor Assessment" subtitle="Automated intelligence & high-consequence risk classification">
          {analysis ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: analysis.sifPotential ? 'var(--color-sif-bg)' : 'var(--bg-subtle)', border: analysis.sifPotential ? '1px solid var(--color-sif-border)' : '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Classification
                  </span>
                  <div style={{ marginTop: '0.2rem' }}>
                    <RiskBadge level={analysis.riskLevel} sifPotential={analysis.sifPotential} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Model Confidence
                  </span>
                  <p style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8' }}>
                    {(analysis.probability * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Explainability Callout */}
              <div style={{ padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  <Sparkles size={16} /> Why Was This Flagged?
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                  {analysis.explanation}
                </p>
              </div>

              {/* Model version footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                <span>Model: {analysis.modelVersion}</span>
                <span>Evaluated: {new Date(analysis.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No AI analysis record generated yet.</p>
          )}
        </Card>
      </div>

      {/* Domain Signal Breakdown (Hazards, Exposures, Controls, Rules) */}
      {analysis && (
        <Card title="Safety Ontology & Signal Evidence Breakdown" subtitle="Structured hazard, human exposure, and barrier breakdown factors">
          <div className="grid-2" style={{ gap: '1.5rem', marginTop: '0.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f97316', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <ShieldAlert size={16} /> Detected Hazards & Energy Sources
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {analysis.hazards.map((h) => (
                  <span key={h} className="badge-tag" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Layers size={16} /> Applicable IOGP Life-Saving Rules
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {analysis.iogpRules.map((r) => (
                  <span key={r} className="badge-tag" style={{ backgroundColor: 'var(--color-sif-bg)', color: '#c084fc', border: '1px solid var(--color-sif-border)' }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                Critical Control / Barrier Breakdown
              </h4>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {analysis.controlFailures.map((cf) => (
                  <li key={cf}>{cf}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                Exposed Personnel & Potential Consequences
              </h4>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <p><strong>Exposed:</strong> {analysis.exposures.join(', ') || 'None specified'}</p>
                <p><strong>Potential Impact:</strong> {analysis.potentialConsequences.join(', ') || 'N/A'}</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </PageContainer>
  );
};
