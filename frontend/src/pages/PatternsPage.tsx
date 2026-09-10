import React from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { RiskBadge } from '../components/common/RiskBadge';
import { mockPatterns } from '../mock/mockData';
import { Flame, MapPin, Tag } from 'lucide-react';

export const PatternsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Emerging Precursor Patterns & Hotspots"
        description="Cross-report recurring hazard clusters and control breakdown concentrations detected across facilities."
        badge={
          <span className="badge-tag" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            2 Active Clusters
          </span>
        }
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {mockPatterns.map((pat) => (
          <Card key={pat.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-critical-bg)', color: 'var(--color-critical)' }}>
                  <Flame size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{pat.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Type: {pat.patternType}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge-tag" style={{ backgroundColor: 'var(--color-primary-subtle)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  {pat.reportCount} Associated Reports
                </span>
                <RiskBadge level={pat.riskLevel} />
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
              {pat.description}
            </p>

            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-dim)', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} color="var(--text-muted)" /> {pat.site}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Tag size={14} color="var(--text-muted)" /> Rule: {pat.iogpRule}
              </span>
              <span>Activity: {pat.activity}</span>
              <span>Last detected: {new Date(pat.lastDetectedAt).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};
