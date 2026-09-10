import { Link } from 'react-router-dom';
import {
  X,
  Layers,
  Flame,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  FileText
} from 'lucide-react';
import type { SafetyPatternItem } from '../../types/pattern.types';
import { RiskBadge } from '../common/RiskBadge';
import { TrendBadge } from './TrendBadge';
import { TagList } from '../analysis/TagList';

interface PatternDetailModalProps {
  pattern: SafetyPatternItem | null;
  onClose: () => void;
}

export const PatternDetailModal: React.FC<PatternDetailModalProps> = ({ pattern, onClose }) => {
  if (!pattern) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          width: '100%',
          maxWidth: '840px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--color-bg-surface)',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-sif-subtle)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-sif)',
                flexShrink: 0,
                marginTop: '2px'
              }}
            >
              <Layers size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <RiskBadge level={pattern.riskLevel} />
                <TrendBadge trend={pattern.trend} />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-sif)',
                    backgroundColor: 'var(--color-sif-subtle)',
                    border: '1px solid rgba(168, 85, 247, 0.4)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase'
                  }}
                >
                  {pattern.sifCount} SIF Precursors Detected
                </span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
                {pattern.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Description & Frequency Summary */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px'
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '4px'
              }}
            >
              Systemic Cluster Synthesis
            </span>
            <p style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.6, margin: '0 0 10px 0' }}>
              {pattern.description}
            </p>
            <div style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} />
              {pattern.frequencySummary}
            </div>
          </div>

          {/* Grid: Common Hazards & Control Failures */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '16px'
            }}
          >
            {/* Common Hazards */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Flame size={16} color="#f97316" />
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                  Common Underlying Hazards
                </h4>
              </div>
              <TagList items={pattern.commonHazards} variant="hazard" />
            </div>

            {/* Related IOGP Rules */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <ShieldCheck size={16} color="var(--color-primary)" />
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                  Associated IOGP Life-Saving Rules
                </h4>
              </div>
              <TagList items={pattern.iogpRules} variant="rule" />
            </div>
          </div>

          {/* Common Control Failures */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <AlertTriangle size={16} color="var(--color-danger)" />
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                Recurring Control & Barrier Breakdowns
              </h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {pattern.commonControlFailures.map((cf, idx) => (
                <li key={idx} style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                  {cf}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Corrective Actions */}
          <div
            style={{
              backgroundColor: 'var(--color-safe-subtle)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <CheckCircle2 size={16} color="var(--color-safe)" />
              <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-safe)', margin: 0 }}>
                Recommended HSE Mitigation & Intervention Plan
              </h4>
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {pattern.recommendedActions.map((action, idx) => (
                <li key={idx} style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.4 }}>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          {/* Linked Reports List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} color="var(--color-primary)" />
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                  Associated Field Reports ({pattern.linkedReports.length} Shown)
                </h4>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Clustered by NLP similarity
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {pattern.linkedReports.map((rep) => (
                <div
                  key={rep.id}
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)', fontSize: '12px' }}>
                        {rep.reportNumber}
                      </span>
                      <RiskBadge level={rep.riskLevel} />
                      {rep.sifPotential && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: 'var(--color-sif)',
                            backgroundColor: 'var(--color-sif-subtle)',
                            padding: '1px 6px',
                            borderRadius: '3px',
                            textTransform: 'uppercase'
                          }}
                        >
                          SIF Precursor
                        </span>
                      )}
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {rep.site} • {rep.eventDate}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
                      {rep.headline}
                    </p>
                  </div>

                  <Link
                    to={`/reports/${rep.id}/analysis`}
                    onClick={onClose}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      backgroundColor: 'rgba(2, 132, 199, 0.08)',
                      border: '1px solid rgba(2, 132, 199, 0.25)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Inspect
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'var(--color-bg-surface)'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--color-text-main)',
              cursor: 'pointer'
            }}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
