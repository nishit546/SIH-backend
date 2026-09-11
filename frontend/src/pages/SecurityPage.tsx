import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/common/PublicNavbar';
import { PublicFooter } from '../components/common/PublicFooter';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Server,
  FileCheck2,
  Key,
  Database,
  ArrowRight,
  Shield,
  CheckCircle2,
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const navigate = useNavigate();

  const securityPillars = [
    {
      icon: EyeOff,
      title: 'PII Redaction & Worker Privacy',
      desc: 'Automated client-side and edge scrubbing of worker names, phone numbers, contractor badges, and sensitive personal identifiers prior to AI precursor inference.',
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      desc: 'All data in transit is encrypted using TLS 1.3 with forward secrecy. Static safety archives are secured at rest with AES-256 encryption keys managed via HSMs.',
    },
    {
      icon: Key,
      title: 'Granular Role-Based Access Control (RBAC)',
      desc: 'Rigid least-privilege enforcement across Administrator, HSE Analyst, and Field Reporter tiers with signed JWTs and refresh token rotation.',
    },
    {
      icon: Server,
      title: 'Air-Gapped & Sovereign Cloud Ready',
      desc: 'Deploy on dedicated AWS/Azure GovCloud or 100% on-premise containerized environments with zero external outbound data telemetry.',
    },
    {
      icon: FileCheck2,
      title: 'Immutable Audit Logging',
      desc: 'Every report creation, AI evaluation, risk level change, and corrective action approval generates an append-only cryptographic audit record.',
    },
    {
      icon: Database,
      title: 'Single Relational Source of Truth',
      desc: 'Structured ACID-compliant relational persistence via MySQL and Prisma ORM, preventing data fragmentation or unauthorized replication.',
    },
  ];

  const complianceStandards = [
    { title: 'SOC 2 Type II', status: 'Audited & Certified', desc: 'Rigorous controls for security, availability, and processing integrity.' },
    { title: 'ISO/IEC 27001', status: 'Compliant', desc: 'International standard for Information Security Management Systems.' },
    { title: 'GDPR / CCPA', status: 'Compliant', desc: 'Strict data subject rights and automated worker anonymity protection.' },
    { title: 'IOGP Safety Standards', status: 'Standardized', desc: 'Harmonized with International Association of Oil & Gas Producers framework.' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', color: '#111827', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />

      <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '100px',
                backgroundColor: 'rgba(255, 72, 0, 0.08)',
                color: '#ff4800',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
              }}
            >
              <Shield size={14} /> Enterprise Trust & Compliance
            </div>
            <h1
              style={{
                fontSize: '42px',
                fontWeight: 800,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: '#ff4800',
                letterSpacing: '-0.02em',
                margin: '0 0 16px 0',
              }}
            >
              Mission-Critical Security Architecture
            </h1>
            <p style={{ fontSize: '17px', color: '#6b7280', maxWidth: '680px', margin: '0 auto', lineHeight: 1.5 }}>
              Engineered from the ground up for energy producers, refineries, and offshore assets with stringent data sovereignty and worker privacy controls.
            </p>
          </div>

          {/* Pillars Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '24px',
              marginBottom: '64px',
            }}
          >
            {securityPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px solid #e5e7eb',
                    padding: '28px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 72, 0, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ff4800',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#111827' }}>
                    {pillar.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Compliance & Certifications Table */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
              padding: '40px 36px',
              marginBottom: '64px',
            }}
          >
            <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 8px 0', color: '#111827' }}>
              Compliance Standards & Governance
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px 0' }}>
              SIF-Guard aligns with internationally recognized information security frameworks and industrial safety bodies.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {complianceStandards.map((std, idx) => (
                <div key={idx} style={{ padding: '20px', borderRadius: '16px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{std.title}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> {std.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.4 }}>
                    {std.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Security Team CTA */}
          <div
            style={{
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
              color: '#ffffff',
              padding: '48px 36px',
              textAlign: 'center',
            }}
          >
            <ShieldCheck size={40} color="#ff4800" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 12px 0', color: '#ffffff' }}>
              Need a Custom Security Review or CAIQ?
            </h2>
            <p style={{ fontSize: '15px', color: '#9ca3af', maxWidth: '560px', margin: '0 auto 24px auto', lineHeight: 1.5 }}>
              Our dedicated HSE and InfoSec teams provide SOC 2 audit reports, penetration test summaries, and custom vendor risk assessments.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '12px 28px',
                  borderRadius: '100px',
                  backgroundColor: '#ff4800',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Access Security Console</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
