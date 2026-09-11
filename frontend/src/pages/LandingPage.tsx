import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Plug,
  Search,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
} from 'lucide-react';
import './LandingPage.css';
import heroVideo from '../assets/PLKU49YW8UVObdQXIgzEYj95Og.mp4';
import imgHazard from '../assets/hazard_detection.jpg';
import imgControls from '../assets/control_failures.jpg';
import imgMapping from '../assets/iogp_mapping.jpg';
import { PublicFooter } from '../components/common/PublicFooter';

// Custom hook for scroll progress (0 to 1)
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / (windowHeight || 1)}`;
      setProgress(Number(scroll));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
};

// Custom hook for scroll threshold (for header)
const useScrolled = (threshold = 40) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return scrolled;
};

// Fade in observer component
const FadeInSection = ({ children }: { children: React.ReactNode }) => {
  const domRef = useRef<HTMLDivElement>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (domRef.current) {
      observer.observe(domRef.current);
    }

    return () => {
      if (domRef.current) observer.unobserve(domRef.current);
    };
  }, []);

  return (
    <div
      className={isVisible ? 'animate-fade-in' : ''}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
      ref={domRef}
    >
      {children}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isScrolled = useScrolled(40);
  const scrollProgress = useScrollProgress();

  // Calculate which of the 6 bars should be active
  const activeBarIndex = Math.min(5, Math.floor(scrollProgress * 6));

  return (
    <div className="landing-container">
      {/* 6 Bars Scroll Indicator */}
      <div className="scroll-bars-container">
        {[0, 1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className={`scroll-bar ${idx <= activeBarIndex ? 'active' : ''}`}></div>
        ))}
      </div>

      {/* SECTION 1 - HEADER */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="content-container header-content">
          <Link to="/" className="logo-mark" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent)',
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
          <nav className="nav-links">
            <Link to="/fit-test">60-Second Fit Test</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/security">Security</Link>
            <Link to="/about">About</Link>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-body)',
                padding: '6px 14px',
                borderRadius: '100px',
                border: '1px solid #d1d5db',
                backgroundColor: '#ffffff',
              }}
            >
              Sign In
            </Link>
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Safety Console
            </button>
          </div>
        </div>
      </header>

      {/* SECTION 2 - HERO */}
      <section className="hero-section">
        <div className="content-container hero-inner">
          <div className="hero-text">
            <FadeInSection>
              <h1>
                Your Safety Intelligence,
                <br />
                Deployed in 24 Hours.
              </h1>
              <p className="hero-subtitle">
                Stop letting critical SIF precursors get buried in incident reports. SIF-Guard extracts the high-energy hazard before it becomes a catastrophe.
              </p>
              <div className="hero-ctas">
                <button className="btn-primary" onClick={() => navigate('/fit-test')}>
                  Take 60-Sec Fit Test
                </button>
                <button className="btn-secondary" onClick={() => navigate('/login')}>
                  View Live Console
                </button>
              </div>
            </FadeInSection>
          </div>
          <div className="hero-media">
            <FadeInSection>
              <div className="hero-video-box">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ pointerEvents: 'none' }}
                >
                  <source src={heroVideo} type="video/mp4" />
                </video>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* SECTION 3 - SOCIAL PROOF */}
      <section className="section-wrapper social-proof">
        <div className="content-container">
          <FadeInSection>
            <span className="eyebrow">Harmonized with global energy & industrial standards</span>
            <div className="logos-strip">
              <span>IOGP 9 RULES</span>
              <span>OIL & GAS HSE</span>
              <span>OFFSHORE OPS</span>
              <span>REFINERY SAFETY</span>
              <span>ENERGY FLEETS</span>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 4 - PRODUCT SCREENSHOT MOCK */}
      <section className="section-wrapper screenshot-section">
        <div className="content-container">
          <FadeInSection>
            <div className="app-frame">
              <div className="app-frame-header">
                <div className="app-frame-dot"></div>
                <div className="app-frame-dot"></div>
                <div className="app-frame-dot"></div>
              </div>
              <div className="app-frame-content mock-dashboard">
                <div className="mock-sidebar">
                  <div className="mock-sidebar-item active"></div>
                  <div className="mock-sidebar-item"></div>
                  <div className="mock-sidebar-item"></div>
                  <div className="mock-sidebar-item"></div>
                </div>
                <div className="mock-main">
                  <div className="mock-header">
                    <div className="mock-header-title"></div>
                    <div className="mock-header-actions">
                      <div className="mock-header-btn"></div>
                      <div className="mock-header-btn primary"></div>
                    </div>
                  </div>
                  <div className="mock-cards">
                    <div className="mock-card">
                      <div className="mock-card-top">
                        <div className="mock-card-icon" style={{ backgroundColor: 'var(--accent)' }}></div>
                      </div>
                      <div className="mock-card-value"></div>
                    </div>
                    <div className="mock-card">
                      <div className="mock-card-top">
                        <div className="mock-card-icon" style={{ backgroundColor: 'var(--color-c0)' }}></div>
                      </div>
                      <div className="mock-card-value"></div>
                    </div>
                    <div className="mock-card">
                      <div className="mock-card-top">
                        <div className="mock-card-icon" style={{ backgroundColor: '#60a8c0' }}></div>
                      </div>
                      <div className="mock-card-value"></div>
                    </div>
                  </div>
                  <div className="mock-graph-area">
                    <div className="mock-graph">
                      <div className="mock-bar low"></div>
                      <div className="mock-bar med"></div>
                      <div className="mock-bar high"></div>
                      <div className="mock-bar med"></div>
                      <div className="mock-bar low"></div>
                      <div className="mock-bar high"></div>
                      <div className="mock-bar med"></div>
                    </div>
                    <div className="mock-list">
                      <div className="mock-list-item">
                        <div className="mock-list-dot" style={{ backgroundColor: 'var(--accent)' }}></div>
                        <div className="mock-list-text"></div>
                      </div>
                      <div className="mock-list-item">
                        <div className="mock-list-dot" style={{ backgroundColor: 'var(--color-c0)' }}></div>
                        <div className="mock-list-text" style={{ width: '80%' }}></div>
                      </div>
                      <div className="mock-list-item">
                        <div className="mock-list-dot" style={{ backgroundColor: '#60a8c0' }}></div>
                        <div className="mock-list-text" style={{ width: '60%' }}></div>
                      </div>
                      <div className="mock-list-item">
                        <div className="mock-list-dot" style={{ backgroundColor: 'var(--color-90)' }}></div>
                        <div className="mock-list-text" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 5 - WORKFLOW TRIO */}
      <section className="section-wrapper">
        <div className="content-container">
          <FadeInSection>
            <span className="eyebrow">Autonomous Reasoning Pipeline</span>
            <div className="workflow-grid">
              <div className="card workflow-card">
                <div
                  className="workflow-visual"
                  style={{
                    backgroundColor: 'var(--color-f0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plug size={24} color="var(--accent)" />
                </div>
                <h2>Connect</h2>
                <p>Plug into your existing unstructured incident reporting systems effortlessly via REST APIs or shift logs.</p>
              </div>
              <div className="card workflow-card">
                <div
                  className="workflow-visual"
                  style={{
                    backgroundColor: 'var(--color-c0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Search size={24} color="var(--accent)" />
                </div>
                <h2>Analyze</h2>
                <p>AI extracts energy hazards, human exposure vectors, and failed barrier controls instantly in under 5 seconds.</p>
              </div>
              <div className="card workflow-card">
                <div
                  className="workflow-visual"
                  style={{
                    backgroundColor: 'var(--color-90)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Activity size={24} color="#ffffff" />
                </div>
                <h2>Predict</h2>
                <p>Map findings to IOGP Life-Saving Rules and surface recurring multi-site risk patterns before release occurs.</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 6 - CORE FEATURES */}
      <section className="section-wrapper">
        <div className="content-container">
          <div className="feature-row">
            <div className="feature-text">
              <FadeInSection>
                <span className="eyebrow">Hazard Detection</span>
                <h2>Find the hidden energy.</h2>
                <p>
                  Our NLP engine parses free-text to identify critical energy sources like hot work, high pressure, and suspended loads without relying on brittle keyword searches.
                </p>
              </FadeInSection>
            </div>
            <div className="feature-visual">
              <img src={imgHazard} alt="Hazard Detection Visualization" />
            </div>
          </div>

          <div className="feature-row reverse">
            <div className="feature-text">
              <FadeInSection>
                <span className="eyebrow">Control Failures</span>
                <h2>Barrier intelligence.</h2>
                <p>
                  Identify missing, bypassed, or ineffective critical barriers instantly. Know exactly why a hazard escalated into a dangerous near-miss.
                </p>
              </FadeInSection>
            </div>
            <div className="feature-visual">
              <img src={imgControls} alt="Control Failures Visualization" />
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-text">
              <FadeInSection>
                <span className="eyebrow">IOGP Mapping</span>
                <h2>Standardized risk.</h2>
                <p>
                  Automatically map detected precursors to the nine IOGP Life-Saving Rules to ensure your interventions align with global industry standards.
                </p>
              </FadeInSection>
            </div>
            <div className="feature-visual">
              <img src={imgMapping} alt="IOGP Mapping Visualization" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 - PREVIEW CALLOUTS: FIT TEST, PRICING, SECURITY, ABOUT */}
      <section className="section-wrapper" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div className="content-container">
          <FadeInSection>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="eyebrow">Platform Overview</span>
              <h2 style={{ fontSize: '32px', margin: '0 0 12px 0' }}>Explore SIF-Guard Capabilities</h2>
              <p style={{ color: '#6b7280', maxWidth: '580px', margin: '0 auto' }}>
                Discover our diagnostic tools, transparent fleet pricing, enterprise security architecture, and safety engineering mission.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {/* Card 1: Fit Test */}
              <div
                style={{
                  padding: '28px',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 72, 0, 0.1)',
                      color: '#ff4800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Sparkles size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#111827' }}>
                    60-Second Fit Test
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                    Evaluate your operation's SIF vulnerability index and quantify hidden high-energy precursor exposure.
                  </p>
                </div>
                <Link
                  to="/fit-test"
                  style={{
                    color: '#ff4800',
                    fontWeight: 600,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Start Fit Test</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Card 2: Pricing */}
              <div
                style={{
                  padding: '28px',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 72, 0, 0.1)',
                      color: '#ff4800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Zap size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#111827' }}>
                    Pricing & Fleet Plans
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                    Transparent Site, Enterprise Fleet, and Sovereign On-Premise tiers with interactive ROI estimation.
                  </p>
                </div>
                <Link
                  to="/pricing"
                  style={{
                    color: '#ff4800',
                    fontWeight: 600,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>View Pricing</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Card 3: Security */}
              <div
                style={{
                  padding: '28px',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 72, 0, 0.1)',
                      color: '#ff4800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Lock size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#111827' }}>
                    Security & Compliance
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                    Automated worker PII redaction, TLS 1.3/AES-256 encryption, SOC 2 alignment, and air-gapped readiness.
                  </p>
                </div>
                <Link
                  to="/security"
                  style={{
                    color: '#ff4800',
                    fontWeight: 600,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Explore Security</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Card 4: About */}
              <div
                style={{
                  padding: '28px',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'rgba(255, 72, 0, 0.1)',
                      color: '#ff4800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#111827' }}>
                    About Our Mission
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                    Our scientific principles: Energy Release Theory, Barrier Defense, and zero fatalities in heavy industry.
                  </p>
                </div>
                <Link
                  to="/about"
                  style={{
                    color: '#ff4800',
                    fontWeight: 600,
                    fontSize: '13px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Read Mission</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 8 - FINAL CTA */}
      <section className="section-wrapper final-cta">
        <div className="content-container final-cta-inner">
          <FadeInSection>
            <h2>Stop guessing. Start predicting.</h2>
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Open Safety Console
            </button>
            <p className="reassurance">Interactive role demos · Relational database · No credit card required</p>
          </FadeInSection>
        </div>
      </section>

      {/* Shared Footer */}
      <PublicFooter />
    </div>
  );
};
