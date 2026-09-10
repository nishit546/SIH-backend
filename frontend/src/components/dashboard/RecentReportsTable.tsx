import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowRight, ShieldAlert } from 'lucide-react';
import type { RecentReport } from '../../types/dashboard.types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';

interface RecentReportsTableProps {
  reports: RecentReport[];
}

export const RecentReportsTable: React.FC<RecentReportsTableProps> = ({ reports }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="var(--color-primary)" />
          <div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-text-main)',
                margin: 0
              }}
            >
              Recent Safety Reports & Precursors
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)',
                margin: 0
              }}
            >
              Latest field submissions and AI classification status
            </p>
          </div>
        </div>

        <Link
          to="/reports"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            textDecoration: 'none'
          }}
        >
          View All Reports
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Table Area with Horizontal Scroll for Responsiveness */}
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
              <th style={{ padding: '12px 16px' }}>Report ID</th>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Site / Facility</th>
              <th style={{ padding: '12px 16px' }}>Activity</th>
              <th style={{ padding: '12px 16px' }}>Report Type</th>
              <th style={{ padding: '12px 16px' }}>Risk Level</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>SIF Potential</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
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
                {/* Report Number */}
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: 'var(--color-primary)'
                    }}
                  >
                    {report.reportNumber}
                  </span>
                </td>

                {/* Event Date */}
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                  {report.eventDate}
                </td>

                {/* Site */}
                <td style={{ padding: '12px 16px', color: 'var(--color-text-main)', fontWeight: 500 }}>
                  {report.site}
                </td>

                {/* Activity & Headline snippet */}
                <td style={{ padding: '12px 16px', maxWidth: '240px' }}>
                  <div
                    style={{
                      fontWeight: 500,
                      color: 'var(--color-text-main)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={report.activity}
                  >
                    {report.activity}
                  </div>
                  {report.headline && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px'
                      }}
                      title={report.headline}
                    >
                      {report.headline}
                    </div>
                  )}
                </td>

                {/* Report Type */}
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
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
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  {report.riskLevel ? (
                    <RiskBadge level={report.riskLevel} />
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '12px' }}>—</span>
                  )}
                </td>

                {/* SIF Potential Indicator */}
                <td style={{ padding: '12px 16px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                  {report.sifPotential ? (
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
                      SIF
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        padding: '2px 6px'
                      }}
                    >
                      No
                    </span>
                  )}
                </td>

                {/* Status Badge */}
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  <StatusBadge status={report.status} />
                </td>

                {/* View Report Action */}
                <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Link
                    to={`/reports/${report.id}`}
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
                      textDecoration: 'none'
                    }}
                  >
                    View
                    <ArrowRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
