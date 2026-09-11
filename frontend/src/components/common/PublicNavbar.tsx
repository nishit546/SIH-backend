import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Menu, X } from 'lucide-react';

interface PublicNavbarProps {
  transparent?: boolean;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ transparent = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(!transparent);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!transparent) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [transparent]);

  const navLinks = [
    { name: '60-Second Fit Test', path: '/fit-test' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Security', path: '/security' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '68px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.25s ease',
        backgroundColor: scrolled ? 'rgba(250, 250, 250, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #e5e7eb' : '1px solid transparent',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          width: '100%',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#ff4800',
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontWeight: 700,
            fontSize: '22px',
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#ff4800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <span>SIF-Guard</span>
        </Link>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '32px',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#ff4800' : '#374151',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#ff4800';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#374151';
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/login"
            style={{
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: '#1f2937',
              padding: '8px 16px',
              borderRadius: '100px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </Link>
          <button
            onClick={() => navigate('/login')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ff4800',
              color: '#ffffff',
              border: 'none',
              borderRadius: '100px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 72, 0, 0.25)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>Safety Console</span>
            <ArrowRight size={14} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: '#1f2937',
              cursor: 'pointer',
              padding: '6px',
            }}
            className="mobile-nav-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '68px',
            left: 0,
            width: '100%',
            backgroundColor: '#fafafa',
            borderBottom: '1px solid #e5e7eb',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: location.pathname === link.path ? 700 : 500,
                color: location.pathname === link.path ? '#ff4800' : '#1f2937',
              }}
            >
              {link.name}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                backgroundColor: '#ff4800',
                color: '#fff',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              Open Safety Console
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
