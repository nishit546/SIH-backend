import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicNavbar } from '../components/common/PublicNavbar';
import { PublicFooter } from '../components/common/PublicFooter';
import {
  Check,
  Zap,
  ArrowRight,
  Calculator,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState<boolean>(true);
  const [monthlyReports, setMonthlyReports] = useState<number>(500);

  // ROI estimation math
  const manualReviewHoursPerReport = 0.5; // 30 mins
  const hourlyHSERate = 65; // $65/hr
  const totalHoursSpentManually = monthlyReports * manualReviewHoursPerReport;
  const totalManualCost = totalHoursSpentManually * hourlyHSERate;
  const sifGuardSavingsHours = Math.round(totalHoursSpentManually * 0.85);
  const annualDollarSavings = Math.round((totalManualCost * 12) * 0.7);

  const tiers = [
    {
      name: 'Site Essential',
      tagline: 'For single production plants or offshore rigs requiring automated SIF detection.',
      monthlyPrice: 1499,
      annualPrice: 1199,
      badge: 'Single Asset',
      features: [
        'Up to 1,000 observations / month',
        'Real-time NLP Energy Hazard extraction',
        'IOGP 9 Life-Saving Rules automated mapping',
        '5 Safety Analyst / Admin user seats',
        'Standard relational database & audit logs',
        'Standard email support & 48h SLA',
      ],
      ctaText: 'Start Site Pilot',
      popular: false,
    },
    {
      name: 'Enterprise Fleet',
      tagline: 'Complete safety intelligence for multi-asset operators & enterprise energy fleets.',
      monthlyPrice: 3499,
      annualPrice: 2799,
      badge: 'Most Popular',
      features: [
        'Unlimited observations & incidents',
        'Continuous cross-site safety pattern detection',
        'Custom IOGP & site-specific barrier rules',
        '50 User seats (Admin, Analyst, Reporter)',
        'Automated corrective action tracking & verification',
        'FastAPI high-throughput AI inference cluster',
        'Dedicated HSE Solution Engineer & 99.9% SLA',
      ],
      ctaText: 'Deploy Fleet Console',
      popular: true,
    },
    {
      name: 'Sovereign / On-Prem',
      tagline: 'Air-gapped and sovereign cloud deployment for critical infrastructure.',
      monthlyPrice: null,
      annualPrice: null,
      badge: 'Critical Infrastructure',
      features: [
        '100% Air-gapped / On-Premise deployment',
        'Private fine-tuned LLM reasoning engine',
        'Unlimited seats and asset sites',
        'Custom enterprise telemetry & SCADA hooks',
        'Dedicated 24/7 mission-critical response',
        'Custom data retention & compliance covenants',
      ],
      ctaText: 'Contact HSE Enterprise',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'How fast can SIF-Guard be deployed to our operations?',
      a: 'Standard cloud and hybrid deployments go live in less than 24 hours. Connect your existing incident report feeds or CSV/API streams, and real-time precursor inference begins immediately.',
    },
    {
      q: 'Does SIF-Guard support our existing HSE reporting formats?',
      a: 'Yes. Our NLP engine is specifically architected for messy, unstructured free-text submitted from field operators, including voice-to-text transcripts, shift logs, and formal near-miss tickets.',
    },
    {
      q: 'Can we run SIF-Guard on-premise without external internet access?',
      a: 'Yes. Our Sovereign tier allows containerized deployment via Docker/Kubernetes inside your own private VPC or air-gapped offshore server with local model execution.',
    },
    {
      q: 'Is there a limit on how many field reporters can submit observations?',
      a: 'All plans include unlimited field reporter submissions. Licensing is structured around analytical throughput and administrative user tiers.',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa', color: '#111827', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />

      <main style={{ flex: 1, paddingTop: '100px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
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
              <Zap size={14} /> Transparent HSE Licensing
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
              Enterprise Safety Intelligence Plans
            </h1>
            <p style={{ fontSize: '17px', color: '#6b7280', maxWidth: '640px', margin: '0 auto 28px auto', lineHeight: 1.5 }}>
              Scale automated SIF precursor reasoning across your onshore rigs, refineries, and offshore assets with zero operational friction.
            </p>

            {/* Annual / Monthly Toggle */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: '4px',
                borderRadius: '100px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: !isAnnual ? '#ff4800' : 'transparent',
                  color: !isAnnual ? '#ffffff' : '#4b5563',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '100px',
                  border: 'none',
                  backgroundColor: isAnnual ? '#ff4800' : 'transparent',
                  color: isAnnual ? '#ffffff' : '#4b5563',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>Annual Billing</span>
                <span
                  style={{
                    backgroundColor: isAnnual ? '#ffffff' : '#ff4800',
                    color: isAnnual ? '#ff4800' : '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '100px',
                  }}
                >
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              marginBottom: '64px',
            }}
          >
            {tiers.map((tier) => {
              const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

              return (
                <div
                  key={tier.name}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    border: tier.popular ? '2px solid #ff4800' : '1px solid #e5e7eb',
                    boxShadow: tier.popular ? '0 12px 32px rgba(255, 72, 0, 0.12)' : '0 6px 20px rgba(0,0,0,0.03)',
                    padding: '36px 30px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                  }}
                >
                  {tier.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#ff4800',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 14px',
                        borderRadius: '100px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                      }}
                    >
                      Most Popular For Fleets
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#111827' }}>
                        {tier.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#f3f4f6',
                          color: '#4b5563',
                        }}
                      >
                        {tier.badge}
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 24px 0', minHeight: '38px', lineHeight: 1.4 }}>
                      {tier.tagline}
                    </p>

                    <div style={{ marginBottom: '24px', borderBottom: '1px solid #f3f4f6', paddingBottom: '24px' }}>
                      {price !== null ? (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '38px', fontWeight: 800, color: '#111827' }}>
                            ${price.toLocaleString()}
                          </span>
                          <span style={{ fontSize: '14px', color: '#6b7280' }}>/ month</span>
                        </div>
                      ) : (
                        <div style={{ fontSize: '32px', fontWeight: 800, color: '#111827' }}>
                          Custom Enterprise
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                        {price !== null ? (isAnnual ? 'Billed annually' : 'Billed monthly') : 'Tailored SLA & deployment scope'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                      {tier.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#374151' }}>
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 72, 0, 0.1)',
                              color: '#ff4800',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            <Check size={12} strokeWidth={3} />
                          </div>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/login')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '100px',
                      backgroundColor: tier.popular ? '#ff4800' : '#111827',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease',
                      boxShadow: tier.popular ? '0 4px 14px rgba(255, 72, 0, 0.3)' : 'none',
                    }}
                  >
                    <span>{tier.ctaText}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Interactive ROI Calculator Section */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
              padding: '40px 36px',
              marginBottom: '64px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Calculator size={22} color="#ff4800" />
              <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#111827' }}>
                HSE Operational ROI Estimator
              </h2>
            </div>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px 0' }}>
              Calculate the direct hours and cost reclaimed by shifting from manual review queues to automated SIF reasoning.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  Monthly Incident & Observation Count: <strong>{monthlyReports.toLocaleString()} reports</strong>
                </label>
                <input
                  type="range"
                  min={100}
                  max={5000}
                  step={100}
                  value={monthlyReports}
                  onChange={(e) => setMonthlyReports(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ff4800', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                  <span>100 / mo</span>
                  <span>2,500 / mo</span>
                  <span>5,000 / mo</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                    Hours Reclaimed / Mo
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#ff4800', margin: '4px 0' }}>
                    ~{sifGuardSavingsHours} hrs
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    Eliminates manual triage backlog
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '14px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                    Est. Annual Cost Savings
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
                    ${annualDollarSavings.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    Reallocated to field barrier fixes
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, textAlign: 'center', margin: '0 0 32px 0', color: '#111827' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    padding: '20px 24px',
                  }}
                >
                  <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0', color: '#111827' }}>
                    {faq.q}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
};
