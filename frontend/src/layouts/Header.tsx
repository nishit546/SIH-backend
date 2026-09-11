import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Plus, User as UserIcon, LogOut, KeyRound, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { user, logout, switchDemoUser } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const handleRoleSwitch = async (roleKey: 'ADMIN' | 'HSE_ANALYST' | 'REPORTER') => {
    setMenuOpen(false);
    await switchDemoUser(roleKey);
  };

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' };
      case 'ANALYST':
      case 'MANAGER':
      case 'HSE_ANALYST':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' };
      default:
        return { bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: 'rgba(34, 197, 94, 0.3)' };
    }
  };

  const badgeStyle = getRoleBadgeStyle(user?.role);

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
            {user?.site || 'All OIL Sites (Multi-Facility)'}
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

        {/* User Profile & Role Switcher Dropdown */}
        <div ref={menuRef} style={{ position: 'relative', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '8px',
              transition: 'background-color 0.15s ease',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              <UserIcon size={16} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name || 'HSE User'}</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: badgeStyle.color,
                  textTransform: 'uppercase',
                }}
              >
                {user?.role || 'REPORTER'}
              </span>
            </div>
            <ChevronDown size={14} color="var(--text-dim)" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '240px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
                padding: '12px',
                zIndex: 100,
              }}
            >
              <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--border-color)', marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{user?.email}</div>
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: badgeStyle.bg,
                    border: `1px solid ${badgeStyle.border}`,
                    color: badgeStyle.color,
                    fontSize: '10px',
                    fontWeight: 700,
                  }}
                >
                  ROLE: {user?.role}
                </div>
              </div>

              {/* Quick Switch Persona for Demo */}
              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                  Switch Demo Persona
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button
                    onClick={() => handleRoleSwitch('ADMIN')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: user?.role === 'ADMIN' ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                      color: 'var(--text-main)',
                      fontSize: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <KeyRound size={14} color="#c084fc" />
                    <span>Admin (All Access)</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('HSE_ANALYST')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: (user?.role === 'ANALYST' || user?.role === 'MANAGER') ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                      color: 'var(--text-main)',
                      fontSize: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <ShieldCheck size={14} color="#60a5fa" />
                    <span>HSE Analyst (Analytics & AI)</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('REPORTER')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: user?.role === 'REVIEWER' ? 'rgba(34, 197, 94, 0.12)' : 'transparent',
                      color: 'var(--text-main)',
                      fontSize: '12px',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <UserIcon size={14} color="#4ade80" />
                    <span>Field Reporter (Submit & Status)</span>
                  </button>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    color: '#ef4444',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
