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

export const Sidebar: React.FC = () => {
  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: 'Submit Report',
      path: '/reports/new',
      icon: <FilePlus2 size={18} />,
    },
    {
      label: 'Reports Log',
      path: '/reports',
      icon: <ClipboardList size={18} />,
    },
    {
      label: 'Emerging Patterns',
      path: '/patterns',
      icon: <Flame size={18} />,
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <Settings size={18} />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <Shield size={20} />
        </div>
        <div className="brand-title">
          <span>SIF-Guard</span>
          <span className="brand-subtitle">OIL HSE Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.85rem 0.25rem' }}>
          Safety Operations
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>SIH 2026 / PS165</span>
            <span style={{ fontSize: '0.68rem', color: '#38bdf8' }}>v1.0 MVP</span>
          </div>
          <span>IOGP 9 Life-Saving Rules</span>
        </div>
      </div>
    </aside>
  );
};
