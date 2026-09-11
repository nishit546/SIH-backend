import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plug, Search, ShieldCheck, Activity, AlertTriangle, Layers } from 'lucide-react';
import './LandingPage.css';
import heroVideo from '../../../../PLKU49YW8UVObdQXIgzEYj95Og.mp4';
import imgHazard from 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/70dbd87f-2f42-436c-86e0-1b10e6f80ea7/hazard_detection_1789106599016.jpg';
import imgControls from 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/70dbd87f-2f42-436c-86e0-1b10e6f80ea7/control_failures_1789106633577.jpg';
import imgMapping from 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/70dbd87f-2f42-436c-86e0-1b10e6f80ea7/iogp_mapping_1789106647686.jpg';

// Custom hook for scroll progress (0 to 1)
const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
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
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      });
    }, { threshold: 0.3 });
    
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
      style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(8px)' }}
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
          <div 
            key={idx} 
            className={`scroll-bar ${idx <= activeBarIndex ? 'active' : ''}`}
          ></div>
        ))}
      </div>

      {/* SECTION 1 - HEADER */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="content-container header-content">
          <a href="#" className="logo-mark">SIF-Guard</a>
          <nav className="nav-links">
            <a href="#test">60-Second Fit Test</a>
            <a href="#pricing">Pricing</a>
            <a href="#security">Security</a>
            <a href="#about">About</a>
          </nav>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            Book a Call Book a Call
          </button>
        </div>
      </header>

      {/* SECTION 2 - HERO */}
      <section className="hero-section">
        <div className="content-container hero-inner">
          <div className="hero-text">
            <FadeInSection>
              <h1>Your Safety Intelligence,<br/>Deployed in 24 Hours.</h1>
              <p className="hero-subtitle">Stop letting critical SIF precursors get buried in incident reports. SIF-Guard extracts the risk before it becomes an accident.</p>
              <div className="hero-ctas">
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>Book a Call Book a Call</button>
                <button className="btn-secondary" onClick={() => navigate('/dashboard')}>View Demo</button>
              </div>
            </FadeInSection>
          </div>
          <div className="hero-media">
            <FadeInSection>
              <div className="hero-video-box">
                <video autoPlay loop muted playsInline onContextMenu={(e) => e.preventDefault()} style={{ pointerEvents: 'none' }}>
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
            <span className="eyebrow">Trusted by teams at</span>
            <div className="logos-strip">
              <span>OIL CORP</span>
              <span>ENERGY OPS</span>
              <span>INDUSTRIAL</span>
              <span>SHELLTECH</span>
              <span>PETROMINE</span>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 4 - PRODUCT SCREENSHOT */}
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
            <span className="eyebrow">How It Works</span>
            <div className="workflow-grid">
              <div className="card workflow-card">
                <div className="workflow-visual" style={{backgroundColor: 'var(--color-f0)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Plug size={24} color="var(--accent)" />
                </div>
                <h2>Connect</h2>
                <p>Plug into your existing unstructured incident reporting systems effortlessly.</p>
              </div>
              <div className="card workflow-card">
                <div className="workflow-visual" style={{backgroundColor: 'var(--color-c0)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Search size={24} color="var(--accent)" />
                </div>
                <h2>Analyze</h2>
                <p>AI extracts hazards, human exposure, and failed controls instantly.</p>
              </div>
              <div className="card workflow-card">
                <div className="workflow-visual" style={{backgroundColor: 'var(--color-90)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Activity size={24} color="#ffffff" />
                </div>
                <h2>Predict</h2>
                <p>Map findings to IOGP Life-Saving Rules and surface recurring risks.</p>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 6 - FEATURE/VALUE */}
      <section className="section-wrapper">
        <div className="content-container">
          
          <div className="feature-row">
            <div className="feature-text">
              <FadeInSection>
                <span className="eyebrow">Hazard Detection</span>
                <h2>Find the hidden energy.</h2>
                <p>Our NLP engine parses free-text to identify critical energy sources like hot work, pressure, and suspended loads without relying on simple keywords.</p>
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
                <p>Identify missing, bypassed, or ineffective critical controls instantly. Know exactly why a hazard escalated into a near-miss.</p>
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
                <p>Automatically map detected precursors to the nine IOGP Life-Saving Rules to ensure your interventions align with global standards.</p>
              </FadeInSection>
            </div>
            <div className="feature-visual">
              <img src={imgMapping} alt="IOGP Mapping Visualization" />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 7 - FINAL CTA */}
      <section className="section-wrapper final-cta">
        <div className="content-container final-cta-inner">
          <FadeInSection>
            <h2>Stop guessing. Start predicting.</h2>
            <button className="btn-primary" onClick={() => navigate('/dashboard')}>Book a Call Book a Call</button>
            <p className="reassurance">Free pilot deployment · No credit card required</p>
          </FadeInSection>
        </div>
      </section>

      {/* SECTION 8 - FOOTER */}
      <footer className="site-footer">
        <div className="content-container">
          <div className="footer-grid">
            <div className="footer-col">
              <a href="#" className="logo-mark">SIF-Guard</a>
            </div>
            <div className="footer-col">
              <h4>Product</h4>
              <div className="footer-links">
                <a href="#">Features</a>
                <a href="#">Integrations</a>
                <a href="#">Security</a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <div className="footer-links">
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
            </div>
          </div>
          <div className="footer-legal">
            &copy; 2026 SIF-Guard Inc. All rights reserved. Built for OIL HSE Teams.
          </div>
        </div>
      </footer>

    </div>
  );
};
