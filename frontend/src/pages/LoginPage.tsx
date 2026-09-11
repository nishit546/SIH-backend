import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, ShieldAlert, User, KeyRound, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type RoleKey = 'ADMIN' | 'HSE_ANALYST' | 'REPORTER';

interface RoleDemoOption {
  key: RoleKey;
  label: string;
  roleTitle: string;
  email: string;
  password: string;
  description: string;
  badge: string;
  color: string;
  icon: React.ComponentType<{ size?: number; color?: string; className?: string }>;
}

const DEMO_ROLES: RoleDemoOption[] = [
  {
    key: 'ADMIN',
    label: 'Admin',
    roleTitle: 'Platform Administrator',
    email: 'admin@oil.com',
    password: 'Password123!',
    description: 'System config & user management',
    badge: 'Full Access',
    color: '#f59e0b',
    icon: KeyRound,
  },
  {
    key: 'HSE_ANALYST',
    label: 'Analyst',
    roleTitle: 'HSE Safety Analyst',
    email: 'analyst@oil.com',
    password: 'Password123!',
    description: 'AI precursor reasoning & analytics',
    badge: 'Analytics + AI',
    color: '#3b82f6',
    icon: ShieldCheck,
  },
  {
    key: 'REPORTER',
    label: 'Reporter',
    roleTitle: 'Field Observer',
    email: 'reviewer@oil.com',
    password: 'Password123!',
    description: 'Submit safety observations',
    badge: 'Reporting',
    color: '#10b981',
    icon: User,
  },
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [selectedRole, setSelectedRole] = useState<RoleKey>('HSE_ANALYST');
  const [email, setEmail] = useState<string>('analyst@oil.com');
  const [password, setPassword] = useState<string>('Password123!');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fillFeedback, setFillFeedback] = useState<string | null>(
    'Credentials filled for HSE Analyst. Click "Sign In" below to log in.'
  );

  const handleSelectRole = (roleOption: RoleDemoOption) => {
    setSelectedRole(roleOption.key);
    setEmail(roleOption.email);
    setPassword(roleOption.password);
    setErrorMessage(null);
    setFillFeedback(`Autofilled credentials for ${roleOption.roleTitle} (${roleOption.email}). Click Sign In to proceed.`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await login({ email, password });
      const target = selectedRole === 'REPORTER' ? '/reports' : from;
      navigate(target, { replace: true });
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-page)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 16px',
        color: 'var(--text-main)',
        position: 'relative',
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '540px',
          height: '380px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, rgba(168, 85, 247, 0.05) 70%, transparent 100%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          padding: '36px 32px',
          boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.35)',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            SIF-Guard Platform
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            HSE Safety Intelligence & Precursor Reasoning Console
          </p>
        </div>

        {/* Role Selection & Auto-Fill Section */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={13} color="var(--color-primary)" />
              Select Role to Auto-Fill Credentials
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {DEMO_ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.key;

              return (
                <button
                  key={role.key}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleSelectRole(role)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    padding: '12px 8px',
                    borderRadius: '14px',
                    border: isSelected ? `2px solid ${role.color}` : '1px solid var(--border-color)',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-card)',
                    boxShadow: isSelected ? `0 0 16px -2px ${role.color}33` : 'none',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    textAlign: 'center',
                  }}
                  title={`Click to fill ${role.label} credentials (${role.email})`}
                >
                  {isSelected && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-7px',
                        right: '-7px',
                        backgroundColor: role.color,
                        borderRadius: '50%',
                        color: '#fff',
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }}
                    >
                      <CheckCircle2 size={12} strokeWidth={3} />
                    </div>
                  )}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      backgroundColor: `${role.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} color={role.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {role.label}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '2px' }}>
                      {role.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback banner showing filled status */}
          {fillFeedback && !errorMessage && (
            <div
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                fontSize: '11px',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={13} />
              <span>{fillFeedback}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 16px 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Account Credentials
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)' }} />
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <ShieldAlert size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Work Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFillFeedback(null);
                }}
                placeholder="analyst@oil.com"
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFillFeedback(null);
                }}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '11px 12px 11px 38px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginTop: '6px',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Safety Console'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ marginTop: '22px', textAlign: 'center' }}>
          <Link
            to="/"
            style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none' }}
          >
            ← Back to Platform Overview
          </Link>
        </div>
      </div>
    </div>
  );
};
