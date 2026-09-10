import React from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { mockReports } from '../mock/mockData';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';

export const ReportsListPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Safety Observations & Precursor Log"
        description="Search, inspect, and evaluate raw field observations and AI-derived SIF precursor assessments."
        actions={
          <Link to="/reports/new" className="btn btn-primary">
            <Plus size={15} />
            Submit Report
          </Link>
        }
      />

      {/* Filter Bar */}
      <Card className="mb-4" style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 220, backgroundColor: 'var(--bg-subtle)', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <Search size={16} color="var(--text-dim)" />
            <input
              type="text"
              placeholder="Search description, equipment, site..."
              style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-dim)" />
            <select style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <option value="">All Sites</option>
              <option value="Plant A">Plant A</option>
              <option value="Plant B">Plant B</option>
              <option value="Offshore Rig 7">Offshore Rig 7</option>
            </select>

            <select style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-color)', color: '#fff', padding: '0.45rem 0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
              <option value="">All Risk Tiers</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reports Table */}
      <Card>
        <div className="table-container">
          <table className="hse-table">
            <thead>
              <tr>
                <th>Report #</th>
                <th>Observation Description</th>
                <th>Site / Facility</th>
                <th>Activity</th>
                <th>Event Date</th>
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
                  <td style={{ maxWidth: 320 }}>
                    <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {rep.description}
                    </p>
                  </td>
                  <td>{rep.site}</td>
                  <td>{rep.activity}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(rep.eventDate).toLocaleDateString()}
                  </td>
                  <td>
                    <RiskBadge level={rep.latestAnalysis?.riskLevel} sifPotential={rep.latestAnalysis?.sifPotential} />
                  </td>
                  <td>
                    <StatusBadge status={rep.status} />
                  </td>
                  <td>
                    <Link
                      to={`/reports/${rep.id}`}
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem' }}
                    >
                      View Report
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
