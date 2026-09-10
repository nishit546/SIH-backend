import React from 'react';
import { ShieldCheck, Plus, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            FACILITY:
          </span>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--text-main)',
            }}
          >
            All OIL Sites (Multi-Facility)
          </span>
        </div>
      </div>

      <div className="header-right">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            color: '#4ade80',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          <ShieldCheck size={14} />
          <span>AI PRECURSOR ENGINE ACTIVE</span>
        </div>

        <Link to="/reports/new" className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
          <Plus size={15} />
          <span>Submit Observation</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          <button style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }} title="Notifications">
            <Bell size={18} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700 }}>
              <User size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>HSE Reviewer</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>OIL India Ltd.</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
