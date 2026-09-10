import React from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { mockReports } from '../mock/mockData';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  FileText,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Proactive Safety Intelligence Dashboard"
        description="Real-time SIF Precursor tracking, IOGP Life-Saving Rule mapping & barrier breakdown metrics across facilities."
        badge={
          <span
            className="badge-tag"
            style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}
          >
            Live Monitor
          </span>
        }
        actions={
          <Link to="/reports/new" className="btn btn-primary">
            + New Safety Report
          </Link>
        }
      />

      {/* KPI Summary Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="card-subtitle">Total Observations</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0 0.5rem', color: '#fff' }}>12</h2>
              <span style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUp size={12} /> +100% Ingested
              </span>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(2, 132, 199, 0.2)', color: '#38bdf8' }}>
              <FileText size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="card-subtitle">SIF Precursors Detected</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0 0.5rem', color: '#c084fc' }}>8</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-critical)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <AlertTriangle size={12} /> 66.7% High Consequence
              </span>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-sif-bg)', color: '#c084fc' }}>
              <AlertTriangle size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="card-subtitle">High / Critical Risk</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0 0.5rem', color: 'var(--color-critical)' }}>8</h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Immediate Attention
              </span>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-critical-bg)', color: 'var(--color-critical)' }}>
              <Flame size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p className="card-subtitle">Corrective Actions</p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '0.25rem 0 0.5rem', color: '#4ade80' }}>3</h2>
              <span style={{ fontSize: '0.75rem', color: '#4ade80', display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle2 size={12} /> 1 Completed / 2 Open
              </span>
            </div>
            <div style={{ padding: '0.6rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-low-bg)', color: '#4ade80' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Charts & Precursor Spotlights */}
      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        <Card title="Top IOGP Life-Saving Rules Involved" subtitle="Precursor occurrences categorized by 9 core safety rules">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            {[
              { rule: 'Hot Work', count: 4, pct: 40, color: '#f97316' },
              { rule: 'Bypassing Safety Controls', count: 3, pct: 30, color: '#ef4444' },
              { rule: 'Working at Height', count: 2, pct: 20, color: '#eab308' },
              { rule: 'Confined Space', count: 1, pct: 10, color: '#a855f7' },
            ].map((r) => (
              <div key={r.rule}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 600 }}>{r.rule}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{r.count} Reports ({r.pct}%)</span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${r.pct}%`, height: '100%', backgroundColor: r.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Risk Level Distribution" subtitle="Breakdown of analyzed reports across safety tiers">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            {[
              { label: 'CRITICAL RISK', count: 4, pct: 33.3, bg: 'var(--color-critical)' },
              { label: 'HIGH RISK', count: 4, pct: 33.3, bg: 'var(--color-high)' },
              { label: 'MEDIUM RISK', count: 1, pct: 8.3, bg: 'var(--color-medium)' },
              { label: 'LOW RISK', count: 3, pct: 25.0, bg: 'var(--color-low)' },
            ].map((t) => (
              <div key={t.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 600 }}>{t.label}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{t.count} ({t.pct}%)</span>
                </div>
                <div style={{ width: '100%', height: 6, backgroundColor: 'var(--bg-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${t.pct}%`, height: '100%', backgroundColor: t.bg, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent High-Risk Precursor Observations */}
      <Card
        title="Recent High-Consequence Precursors"
        subtitle="Latest safety reports evaluated by the AI reasoning engine"
        action={
          <Link to="/reports" className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
            View Full Log <ArrowUpRight size={13} />
          </Link>
        }
      >
        <div className="table-container" style={{ marginTop: '0.5rem' }}>
          <table className="hse-table">
            <thead>
              <tr>
                <th>Report #</th>
                <th>Observation Description</th>
                <th>Site / Facility</th>
                <th>Activity</th>
                <th>Risk / SIF Assessment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mockReports.map((rep) => (
                <tr key={rep.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>
                    {rep.reportNumber}
                  </td>
                  <td style={{ maxWidth: 360 }}>
                    <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rep.description}
                    </p>
                  </td>
                  <td>{rep.site}</td>
                  <td>{rep.activity}</td>
                  <td>
                    <RiskBadge level={rep.latestAnalysis?.riskLevel} sifPotential={rep.latestAnalysis?.sifPotential} />
                  </td>
                  <td>
                    <StatusBadge status={rep.status} />
                  </td>
                  <td>
                    <Link to={`/reports/${rep.id}`} style={{ color: '#38bdf8', fontWeight: 600, fontSize: '0.8rem' }}>
                      Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
};
