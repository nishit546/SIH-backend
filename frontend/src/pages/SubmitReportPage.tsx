import React, { useState } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Send, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SubmitReportPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Submit New Safety Observation"
        description="Enter free-text observation from field logs, near misses, unsafe acts, or unsafe conditions."
      />

      {submitted ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-low-bg)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <FileCheck size={28} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Observation Successfully Logged</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', maxWidth: 450, margin: '0 auto 1.5rem' }}>
              Your report has been stored with status <span style={{ color: '#facc15', fontWeight: 600 }}>PENDING</span> and queued for automatic AI SIF Precursor evaluation.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
                Submit Another
              </button>
              <Link to="/reports" className="btn btn-primary">
                View Reports Log
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <Card title="Observation Details" subtitle="Provide clear context regarding what was observed, the equipment involved, and any safety barriers.">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                Free-Text Safety Observation / Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Example: Maintenance worker started welding on hydrocarbon line before combustible gas testing was completed..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  color: '#fff',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Report Type *
                </label>
                <select
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="UNSAFE_ACT">Unsafe Act</option>
                  <option value="UNSAFE_CONDITION">Unsafe Condition</option>
                  <option value="NEAR_MISS">Near Miss</option>
                  <option value="INCIDENT">Incident</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Facility / Site *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plant A - Refining Complex"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div className="grid-2">
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Specific Activity *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hot Work / Welding / Crane Rigging"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Department (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Maintenance"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    color: '#fff',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <Link to="/reports" className="btn btn-secondary">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary">
                <Send size={15} />
                Submit Observation
              </button>
            </div>
          </form>
        </Card>
      )}
    </PageContainer>
  );
};
