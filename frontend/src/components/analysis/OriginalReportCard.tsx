import React from 'react';
import { FileText, MapPin, Building2, Activity, Calendar, Tag } from 'lucide-react';
import type { DetailedSafetyReport } from '../../types/analysis.types';
import { StatusBadge } from '../common/StatusBadge';

interface OriginalReportCardProps {
  report: DetailedSafetyReport;
}

export const OriginalReportCard: React.FC<OriginalReportCardProps> = ({ report }) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* Header with Reference & Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border-subtle)',
          paddingBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={18} color="var(--color-primary)" />
          <div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              Original Observation Reference
            </span>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                fontFamily: 'monospace',
                margin: 0
              }}
            >
              {report.reportNumber}
            </h3>
          </div>
        </div>

        <StatusBadge status={report.status} />
      </div>

      {/* Raw Field Observation Textarea / Quote Box */}
      <div>
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
          Unmutated Field Observation Narrative
        </span>
        <div
          style={{
            backgroundColor: 'var(--color-bg-subtle)',
            border: '1px solid var(--color-border)',
            borderLeft: '4px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            fontSize: '13px',
            color: 'var(--color-text-main)',
            lineHeight: 1.6,
            fontStyle: 'italic'
          }}
        >
          "{report.description}"
        </div>
      </div>

      {/* Metadata Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          backgroundColor: 'var(--color-bg-subtle)',
          border: '1px solid var(--color-border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px'
        }}
      >
        {/* Site */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <MapPin size={14} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Facility Site
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {report.site}
            </span>
          </div>
        </div>

        {/* Activity */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <Activity size={14} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Activity
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {report.activity}
            </span>
          </div>
        </div>

        {/* Department */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <Building2 size={14} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Department
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {report.department || 'Operations'}
            </span>
          </div>
        </div>

        {/* Report Type */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <Tag size={14} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Report Type
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {report.reportType.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Date */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <Calendar size={14} color="var(--color-text-muted)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
              Observed Date
            </span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {report.eventDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
