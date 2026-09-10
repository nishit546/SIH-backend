import React from 'react';
import { Link } from 'react-router-dom';
import { AlertOctagon, ShieldAlert, ArrowUpRight, MapPin, Calendar, Activity } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import type { RecentReport } from '../../types/dashboard.types';

interface HighPriorityReportsSectionProps {
  reports: RecentReport[];
}

export const HighPriorityReportsSection: React.FC<HighPriorityReportsSectionProps> = ({ reports }) => {
  if (!reports || reports.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        borderRadius: 'var(--radius-lg)',
        padding: '22px',
        marginBottom: '24px',
        boxShadow: '0 0 20px rgba(239, 68, 68, 0.06)'
      }}
    >
      {/* Section Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-danger-subtle)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-danger)'
            }}
          >
            <AlertOctagon size={20} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              High Priority Safety Reports
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--color-danger)',
                  backgroundColor: 'var(--color-danger-subtle)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}
              >
                Immediate Attention Required
              </span>
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)',
                margin: '2px 0 0 0'
              }}
            >
              Incidents and near misses flagged with Critical Risk or SIF Precursor control failures.
            </p>
          </div>
        </div>

        <Link
          to="/reports"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            textDecoration: 'none'
          }}
        >
          View Full Audit Register
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* High Priority Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '14px'
        }}
      >
        {reports.map((report) => (
          <div
            key={report.id}
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'border-color 0.15s ease'
            }}
          >
            <div>
              {/* Top Meta Line: Report #, SIF Badge, Risk Level */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      color: 'var(--color-text-main)'
                    }}
                  >
                    {report.reportNumber}
                  </span>
                  {report.sifPotential && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--color-sif)',
                        backgroundColor: 'var(--color-sif-subtle)',
                        border: '1px solid rgba(168, 85, 247, 0.4)',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}
                    >
                      <ShieldAlert size={10} />
                      SIF Potential
                    </span>
                  )}
                </div>

                {report.riskLevel && <RiskBadge level={report.riskLevel} />}
              </div>

              {/* Event Headline */}
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-text-main)',
                  margin: '0 0 10px 0',
                  lineHeight: 1.4
                }}
              >
                {report.headline || 'Critical safety precursor observed during field operations.'}
              </p>

              {/* Context Details */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  marginBottom: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={12} color="var(--color-text-subtle)" />
                  <span>{report.site}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={12} color="var(--color-text-subtle)" />
                  <span>{report.activity}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={12} color="var(--color-text-subtle)" />
                  <span>{report.eventDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderTop: '1px solid var(--color-border-subtle)',
                paddingTop: '10px'
              }}
            >
              <Link
                to={`/reports/${report.id}/analysis`}
                style={{
                  flex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  textAlign: 'center'
                }}
              >
                AI Intelligence & Barrier Analysis
              </Link>
              <Link
                to={`/reports/${report.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Lifecycle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
