import React from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Database, Cpu } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Platform & Model Configuration"
        description="Manage AI engine connections, safety thresholds, and ontology rule mappings."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <Card title="AI Intelligence Engine Connection" subtitle="Active inference provider for SIF precursor reasoning">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Cpu size={20} color="#38bdf8" />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Inference Engine</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Development Mock AI Provider (Local Heuristic Engine)</p>
                </div>
              </div>
              <span className="badge-tag" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
                CONNECTED
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Database size={20} color="#c084fc" />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>PostgreSQL / Prisma Database</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Schema synchronized with SIF-Guard models</p>
                </div>
              </div>
              <span className="badge-tag" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' }}>
                ONLINE
              </span>
            </div>
          </div>
        </Card>

        <Card title="Safety Thresholds" subtitle="SIF precursor classification confidence boundaries">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem', maxWidth: 480 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                HIGH SIF PROBABILITY THRESHOLD
              </label>
              <input
                type="text"
                disabled
                value="0.80 (80% Confidence)"
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                IOGP 9 LIFE-SAVING RULES STANDARD
              </label>
              <input
                type="text"
                disabled
                value="IOGP Report 459 Standard Version 2"
                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
