import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  ClipboardList,
  Flame,
  Settings,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const isReporter = user?.role === 'REVIEWER' || user?.role === 'REPORTER';

  const navItems = [
    ...(!isReporter
      ? [
          {
            label: 'Command Dashboard',
            path: '/dashboard',
            icon: <LayoutDashboard size={18} />,
            end: true,
          },
        ]
      : []),
    {
      label: 'Submit Observation',
      path: '/reports/new',
      icon: <FilePlus2 size={18} />,
      end: true,
      isSpecial: true,
    },
    {
      label: isReporter ? 'My Reports' : 'Reports Log',
      path: '/reports',
      icon: <ClipboardList size={18} />,
      end: true,
    },
    ...(!isReporter
      ? [
          {
            label: 'Emerging Patterns',
            path: '/patterns',
            icon: <Flame size={18} />,
            end: true,
          },
        ]
      : []),
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings size={18} />,
      end: true,
    },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <Shield size={20} strokeWidth={2.5} />
        </div>
        <div className="brand-title">
          <span>SIF-Guard</span>
          <span className="brand-subtitle">HSE Intelligence</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">
          {isReporter ? 'Reporter Console' : 'Safety Operations'}
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer System Status Card */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.72rem', color: 'var(--text-main)', letterSpacing: '0.01em' }}>
              SIF-Guard Console
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-subtle)',
                padding: '2px 6px',
                borderRadius: '100px',
              }}
            >
              v1.0 Live
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <Shield size={11} color="var(--color-primary)" />
            <span>IOGP 9 Life-Saving Rules</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
