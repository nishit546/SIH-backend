import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowRight, FileText } from 'lucide-react';
import type { SafetyReport } from '../../types/safety.types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';

interface ReportTableProps {
  reports: SafetyReport[];
  isLoading?: boolean;
}

export const ReportTable: React.FC<ReportTableProps> = ({ reports, isLoading = false }) => {
  if (reports.length === 0 && !isLoading) {
    return (
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '48px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-muted)'
          }}
        >
          <FileText size={22} />
        </div>
        <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
          No Matching Safety Reports Found
        </h4>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0, maxWidth: '400px' }}>
          Try clearing or relaxing your active search filters to view recorded safety observations.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '13px'
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Report ID</th>
              <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Date</th>
              <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Site / Facility</th>
              <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Department</th>
              <th style={{ padding: '14px 16px', minWidth: '220px' }}>Activity & Narrative</th>
              <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Type</th>
              <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Risk Level</th>
              <th style={{ padding: '14px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>SIF Potential</th>
              <th style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => {
              const analysis = report.latestAnalysis;
              const isSif = Boolean(analysis?.sifPotential);

              return (
                <tr
                  key={report.id}
                  style={{
                    borderBottom: '1px solid var(--color-border-subtle)',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Report ID */}
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <Link
                      to={`/reports/${report.id}/analysis`}
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        color: 'var(--color-primary)',
                        textDecoration: 'none'
                      }}
                      title="View AI Analysis Result"
                    >
                      {report.reportNumber || report.id}
                    </Link>
                  </td>

                  {/* Date */}
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                    {report.eventDate ? new Date(report.eventDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : '—'}
                  </td>

                  {/* Site */}
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-main)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {report.site}
                  </td>

                  {/* Department */}
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {report.department || 'Operations'}
                  </td>

                  {/* Activity & Narrative */}
                  <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: 'var(--color-text-main)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={report.activity}
                    >
                      {report.activity}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '3px'
                      }}
                      title={report.description}
                    >
                      {report.description}
                    </div>
                  </td>

                  {/* Report Type */}
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: 'var(--color-text-muted)',
                        backgroundColor: 'var(--color-bg-subtle)',
                        border: '1px solid var(--color-border)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {report.reportType.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Risk Level Badge */}
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    {analysis?.riskLevel ? (
                      <RiskBadge level={analysis.riskLevel} />
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>—</span>
                    )}
                  </td>

                  {/* SIF Potential Indicator */}
                  <td style={{ padding: '14px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {analysis ? (
                      isSif ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--color-sif)',
                            backgroundColor: 'var(--color-sif-subtle)',
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}
                        >
                          <ShieldAlert size={12} />
                          SIF YES
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--color-text-muted)',
                            backgroundColor: 'rgba(2, 132, 199, 0.08)',
                            border: '1px solid rgba(2, 132, 199, 0.2)',
                            padding: '2px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          Non-SIF
                        </span>
                      )
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>—</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <StatusBadge status={report.status} />
                  </td>

                  {/* View Action Button */}
                  <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <Link
                      to={`/reports/${report.id}/analysis`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--color-primary)',
                        backgroundColor: 'rgba(2, 132, 199, 0.08)',
                        border: '1px solid rgba(2, 132, 199, 0.25)',
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      View
                      <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
