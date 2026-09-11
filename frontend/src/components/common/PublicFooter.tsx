import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Award } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#f3f4f6',
        borderTop: '1px solid #e5e7eb',
        padding: '60px 24px 32px 24px',
        color: '#374151',
        fontFamily: "'Geist', 'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Col 1: Brand */}
          <div>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                color: '#ff4800',
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700,
                fontSize: '22px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#ff4800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <span>SIF-Guard</span>
            </Link>
            <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, margin: 0, maxWidth: '280px' }}>
              Next-generation safety intelligence & precursor reasoning engine built specifically for heavy industry, energy, and oil & gas operations.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '16px', alignItems: 'center', color: '#6b7280', fontSize: '12px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={13} color="#ff4800" /> SOC2 Ready
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Award size={13} color="#ff4800" /> IOGP 9 Compliant
              </span>
            </div>
          </div>

          {/* Col 2: Product & Tools */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111827', margin: '0 0 16px 0' }}>
              Platform & Tools
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/fit-test" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '14px' }}>
                60-Second SIF Fit Test
              </Link>
              <Link to="/pricing" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '14px' }}>
                Pricing & Fleet Tiers
              </Link>
              <Link to="/security" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '14px' }}>
                Security & Compliance
              </Link>
              <Link to="/login" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '14px' }}>
                Safety Console Demo
              </Link>
            </div>
          </div>

          {/* Col 3: Standards & Frameworks */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111827', margin: '0 0 16px 0' }}>
              HSE Standards
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ color: '#4b5563', fontSize: '14px' }}>IOGP Life-Saving Rules</span>
              <span style={{ color: '#4b5563', fontSize: '14px' }}>Energy-Based Hazard Theory</span>
              <span style={{ color: '#4b5563', fontSize: '14px' }}>Barrier Failure Taxonomy</span>
              <span style={{ color: '#4b5563', fontSize: '14px' }}>Zero-Hallucination NLP</span>
            </div>
          </div>

          {/* Col 4: Organization */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111827', margin: '0 0 16px 0' }}>
              Company
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/about" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '14px' }}>
                About Our Mission
              </Link>
              <span style={{ color: '#4b5563', fontSize: '14px' }}>Offshore & Onshore Pilots</span>
              <span style={{ color: '#4b5563', fontSize: '14px' }}>HSE Advisory Council</span>
              <a href="mailto:safety@sif-guard.internal" style={{ color: '#ff4800', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                Contact Safety Engineering →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13px',
            color: '#6b7280',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} SIF-Guard HSE Platform. All rights reserved. Dedicated to zero workplace fatalities.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/security" style={{ color: '#6b7280', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/security" style={{ color: '#6b7280', textDecoration: 'none' }}>Terms of Service</Link>
            <Link to="/security" style={{ color: '#6b7280', textDecoration: 'none' }}>Security Architecture</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
