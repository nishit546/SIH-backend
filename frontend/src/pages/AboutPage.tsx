import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/common/PublicNavbar';
import { PublicFooter } from '../components/common/PublicFooter';
import {
  Target,
  Flame,
  Award,
  ArrowRight,
  TrendingDown,
  Layers,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const principles = [
    {
      icon: Flame,
      title: 'Energy-Based Hazard Theory',
      desc: 'Grounding safety risk not in subjective opinion, but in the physical magnitude of uncontrolled energy (pressure, gravity, electrical, thermal, chemical).',
    },
    {
      icon: Layers,
      title: 'Barrier Defense Integrity',
      desc: 'Focusing on why critical physical and engineered barriers failed or were bypassed, rather than placing blame on frontline operators.',
    },
    {
      icon: Award,
      title: 'IOGP Standard Alignment',
      desc: 'Direct mapping of unstructured field text to the 9 IOGP Life-Saving Rules to create consistent risk benchmarks across global operations.',
    },
    {
      icon: TrendingDown,
      title: 'Precursor-First Intervention',
      desc: 'Intervening on minor precursor signals days or weeks before conditions align into a catastrophic serious injury or fatality (SIF).',
    },
  ];

  const milestones = [
    { number: '100%', label: 'Relational Integrity', sub: 'Single source of truth via MySQL & Prisma ORM' },
    { number: '< 5s', label: 'Reasoning Latency', sub: 'Instant energy and barrier extraction' },
    { number: '9', label: 'IOGP Rules Standard', sub: 'Standardized life-saving taxonomy' },
    { number: '0', label: 'Fatalities Target', sub: 'Our fundamental design objective' },
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
              <Target size={14} /> Our Mission & Safety Philosophy
            </div>
            <h1
              style={{
                fontSize: '44px',
                fontWeight: 800,
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: '#ff4800',
                letterSpacing: '-0.02em',
                margin: '0 0 16px 0',
              }}
            >
              Eliminating Fatalities Through Precursor Intelligence
            </h1>
            <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '720px', margin: '0 auto', lineHeight: 1.5 }}>
              We built SIF-Guard to solve heavy industry's most critical blindspot: the silent buildup of high-energy hazards buried in routine daily observations.
            </p>
          </div>

          {/* Core Story / SIF Paradox Section */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
              padding: '48px 36px',
              marginBottom: '64px',
            }}
          >
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ff4800', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                The SIF Paradox
              </span>
              <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: '0 0 20px 0' }}>
                Why Traditional HSE Incident Metrics Fail
              </h2>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, marginBottom: '16px' }}>
                For decades, industrial safety programs operated under Heinrich's Triangle hypothesis—believing that reducing minor injuries would proportionally reduce fatalities. Modern HSE empirical data has proven this false: <strong>fatalities and serious injuries (SIFs) follow entirely different causal mechanisms than common minor cuts and sprains.</strong>
              </p>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, marginBottom: '16px' }}>
                SIFs require high uncontrolled energy coupled with a compromised barrier. In 80% of major industrial incidents, the exact same precursor conditions had been reported as mundane, low-consequence observations in previous months—yet remained hidden in unstructured logs because no human HSE team can manually cross-examine thousands of free-text reports in real-time.
              </p>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                <strong>SIF-Guard bridges this gap.</strong> By pairing deterministic energy-hazard extraction with IOGP Life-Saving Rules and automated NLP reasoning, we give HSE teams 24-hour predictive foresight before energy is catastrophically released.
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '64px',
            }}
          >
            {milestones.map((m, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e5e7eb',
                  padding: '24px 20px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#ff4800', fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {m.number}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginTop: '4px' }}>
                  {m.label}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Engineering Pillars */}
          <div style={{ marginBottom: '64px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 700, textAlign: 'center', color: '#111827', margin: '0 0 36px 0' }}>
              Our Scientific Engineering Principles
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '24px',
              }}
            >
              {principles.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      border: '1px solid #e5e7eb',
                      padding: '28px 24px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 72, 0, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ff4800',
                        marginBottom: '16px',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 8px 0', color: '#111827' }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Banner */}
          <div
            style={{
              borderRadius: '24px',
              backgroundColor: '#ff4800',
              color: '#ffffff',
              padding: '48px 36px',
              textAlign: 'center',
              boxShadow: '0 12px 32px rgba(255, 72, 0, 0.25)',
            }}
          >
            <h2 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 12px 0', color: '#ffffff' }}>
              Experience Next-Gen Safety Intelligence
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '580px', margin: '0 auto 28px auto', lineHeight: 1.5 }}>
              Explore the live SIF-Guard console with interactive role previews, real-time AI reasoning, and high-energy hazard detection.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 32px',
                borderRadius: '100px',
                backgroundColor: '#ffffff',
                color: '#ff4800',
                border: 'none',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              }}
            >
              <span>Open Safety Console</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
