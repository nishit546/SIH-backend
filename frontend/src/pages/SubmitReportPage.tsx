import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Zap,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Clock,
  UploadCloud,
  FileUp,
  X
} from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { PageHeader } from '../components/common/PageHeader';
import { reportService } from '../services/reportService';
import type { SafetyReportForm, SafetyReportSubmissionResult, ReportType } from '../types/safety.types';

const INITIAL_FORM: SafetyReportForm = {
  reportType: 'UNSAFE_CONDITION',
  description: '',
  site: 'Digboi Refinery - Unit 4',
  department: 'Mechanical Maintenance',
  activity: 'Hydrocracker Maintenance & Line Breaking',
  contractorType: 'Direct EPC Contractor',
  workPhase: 'Live Execution & Hot Work',
  eventDate: new Date().toISOString().slice(0, 16)
};

const SAMPLE_PRESETS = [
  {
    label: 'Energy Isolation (LOTO)',
    type: 'NEAR_MISS' as ReportType,
    site: 'Digboi Refinery - Unit 4',
    department: 'Mechanical Maintenance',
    activity: 'Hydrocracker Maintenance & Line Breaking',
    contractorType: 'Direct EPC Contractor',
    workPhase: 'Live Execution & Hot Work',
    description:
      'During scheduled maintenance on the Hydrocracker line, contractor mechanics unbolted flange 4B before verifying zero-energy isolation. Residual high-pressure hydrocarbon gas (approximately 18 bar) hissed through loosened studs. Work was stopped immediately; upstream double block and bleed valves had not been locked in closed position.'
  },
  {
    label: 'Working at Height / Scaffolding',
    type: 'UNSAFE_CONDITION' as ReportType,
    site: 'Numaligarh Terminal',
    department: 'Civil & Scaffolding',
    activity: 'Structural Pipe Rack Scaffolding',
    contractorType: 'Specialized Subcontractor',
    workPhase: 'Routine Safety Inspection',
    description:
      'Inspection of 12-meter piperack access scaffold revealed that two top guardrails were missing on the north platform edge. In addition, the green scaffold tag was expired by 4 days, but workers were observed staging insulation materials without secondary fall arrest lanyards connected.'
  },
  {
    label: 'Confined Space Entry',
    type: 'UNSAFE_ACT' as ReportType,
    site: 'Moran Gathering Station',
    department: 'Operations & Process',
    activity: 'Separator Vessel Internal Inspection',
    contractorType: 'Specialized Subcontractor',
    workPhase: 'Permit to Work (PTW) & Toolbox Talk',
    description:
      'Contractor entry watch attendant permitted two technicians into crude oil separator vessel V-102 before conducting mandatory 4-gas bump test on the personal multi-gas detector. Continuous forced-air ventilation had been offline for 45 minutes prior to entry.'
  }
];

export const SubmitReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SafetyReportForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<SafetyReportSubmissionResult | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // PDF Ingestion States
  const [submissionMode, setSubmissionMode] = useState<'text' | 'pdf'>('text');
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pdfSubmitting, setPdfSubmitting] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handlePdfFileSelect = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setPdfError('Only PDF files (.pdf) are permitted.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPdfError('File size exceeds the 15 MB limit.');
      return;
    }
    setSelectedPdf(file);
    setPdfError(null);
  };

  const handlePdfSubmit = async () => {
    if (!selectedPdf) {
      setPdfError('Please choose or drag a PDF document to upload.');
      return;
    }
    setPdfSubmitting(true);
    setPdfError(null);
    try {
      const result = await reportService.uploadPdfReport(selectedPdf, {
        site: formData.site,
        activity: formData.activity,
        reportType: formData.reportType,
        department: formData.department,
      });
      // Navigate directly to the real AI analysis result page
      navigate(`/reports/${result.report.id}/analysis`);
    } catch (err: any) {
      setPdfError(err.message || 'Failed to process and analyze PDF report.');
    } finally {
      setPdfSubmitting(false);
    }
  };

  // Character counter helper
  const charCount = formData.description.length;
  const minChars = 20;
  const maxChars = 2000;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Safety observation description is required.';
    } else if (formData.description.trim().length < minChars) {
      newErrors.description = `Description must be at least ${minChars} characters long (currently ${formData.description.trim().length}).`;
    }

    if (!formData.site.trim()) {
      newErrors.site = 'Facility / Site is required.';
    }

    if (!formData.activity.trim()) {
      newErrors.activity = 'Specific activity is required.';
    }

    if (!formData.reportType) {
      newErrors.reportType = 'Report type is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof SafetyReportForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleApplyPreset = (preset: (typeof SAMPLE_PRESETS)[0]) => {
    setFormData({
      reportType: preset.type,
      description: preset.description,
      site: preset.site,
      department: preset.department,
      activity: preset.activity,
      contractorType: preset.contractorType,
      workPhase: preset.workPhase,
      eventDate: new Date().toISOString().slice(0, 16)
    });
    setErrors({});
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setSubmissionResult(null);
    setAnalysisComplete(false);
    setAnalysisError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      const result = await reportService.submitReport(formData);
      setSubmissionResult(result);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrors({ form: err.message || 'Failed to submit report. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerAnalysis = async () => {
    if (!submissionResult) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      await reportService.triggerAnalysis(submissionResult.id);
      setAnalysisComplete(true);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.message || 'AI analysis failed. Please retry.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Submit Safety Report"
        description="Record a safety observation, near miss, unsafe condition, or incident for analysis."
        badge={
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              backgroundColor: 'rgba(2, 132, 199, 0.1)',
              border: '1px solid rgba(2, 132, 199, 0.25)',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          >
            HSE Ingestion Form
          </span>
        }
      />

      {/* SUCCESS STATE AFTER SUBMISSION */}
      {submissionResult ? (
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px 24px',
            maxWidth: '720px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-safe-subtle)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: 'var(--color-safe)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--color-text-main)',
              marginBottom: '8px'
            }}
          >
            Report submitted successfully.
          </h2>

          <p
            style={{
              fontSize: '14px',
              color: 'var(--color-text-muted)',
              maxWidth: '520px',
              margin: '0 auto 20px',
              lineHeight: 1.5
            }}
          >
            Your safety report has been logged and assigned reference{' '}
            <strong style={{ color: 'var(--color-primary)', fontFamily: 'monospace' }}>
              {submissionResult.reportNumber}
            </strong>
            . Status is currently set to{' '}
            <span
              style={{
                color: 'var(--color-warning)',
                fontWeight: 600,
                backgroundColor: 'var(--color-warning-subtle)',
                padding: '1px 6px',
                borderRadius: '4px'
              }}
            >
              PENDING
            </span>
            .
          </p>

          {/* Report Summary Card */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-subtle)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              textAlign: 'left',
              marginBottom: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Facility / Site
              </span>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {formData.site}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Report Type
              </span>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {formData.reportType.replace('_', ' ')}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Activity
              </span>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {formData.activity}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Contractor / Department
              </span>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {formData.department}
              </div>
            </div>
          </div>

          {/* AI Analysis Card / Action */}
          <div
            style={{
              backgroundColor: 'var(--color-sif-subtle)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              marginBottom: '24px',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="var(--color-sif)" />
              <strong style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>
                AI SIF Precursor Reasoning Pipeline
              </strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 14px 0', lineHeight: 1.4 }}>
              Execute automated natural language reasoning to identify Life-Saving Rule breaches, degraded barriers,
              and precursor severity.
            </p>

            {analysisError && (
              <div
                style={{
                  backgroundColor: 'var(--color-danger-subtle)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: 'var(--color-danger)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '14px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={15} />
                {analysisError}
              </div>
            )}

            {analysisComplete ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-safe)', fontSize: '13px', fontWeight: 600 }}>
                  <CheckCircle2 size={16} />
                  AI Analysis Completed & Precursors Evaluated
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    to={`/reports/${submissionResult.id}/analysis`}
                    style={{
                      backgroundColor: 'var(--color-sif)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 0 10px rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    <Sparkles size={13} />
                    View Analysis Intelligence
                    <ArrowRight size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => navigate('/reports')}
                    style={{
                      backgroundColor: 'var(--color-bg-surface)',
                      color: 'var(--color-text-main)',
                      border: '1px solid var(--color-border)',
                      padding: '7px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Reports Log
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleTriggerAnalysis}
                disabled={isAnalyzing}
                style={{
                  backgroundColor: 'var(--color-sif)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: isAnalyzing ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)'
                }}
              >
                {isAnalyzing ? (
                  <>
                    <Clock size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    Running AI Precursor Reasoning...
                  </>
                ) : (
                  <>
                    <Zap size={15} />
                    {analysisError ? 'Retry AI Analysis' : 'Analyze Report Now'}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleReset}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-text-main)',
                border: '1px solid var(--color-border)',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Submit Another Report
            </button>
            <Link
              to="/reports"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              View Reports Log
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {/* Submission Mode Selector Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '20px',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '12px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={() => setSubmissionMode('text')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: submissionMode === 'text' ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                color: submissionMode === 'text' ? '#ffffff' : 'var(--color-text-muted)',
                boxShadow: submissionMode === 'text' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <FileText size={15} />
              Manual Observation Entry
            </button>

            <button
              type="button"
              onClick={() => setSubmissionMode('pdf')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: submissionMode === 'pdf' ? 'var(--color-sif)' : 'var(--color-bg-surface)',
                color: submissionMode === 'pdf' ? '#ffffff' : 'var(--color-text-muted)',
                boxShadow: submissionMode === 'pdf' ? '0 2px 8px rgba(168, 85, 247, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <UploadCloud size={15} />
              Upload Incident PDF Document (Instant AI Reasoning)
            </button>
          </div>

          {submissionMode === 'pdf' ? (
            /* PDF DOCUMENT UPLOAD DROPZONE & REASONING PANEL */
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '32px 24px',
                maxWidth: '800px',
                margin: '0 auto'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: 'var(--color-sif)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px'
                  }}
                >
                  <FileUp size={28} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                  Upload Incident PDF Report
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.5 }}>
                  Submit an official Oil India, OSHA, or industrial safety PDF document. PyMuPDF extracts the narrative and sends it directly through the fine-tuned DistilBERT + Hybrid Risk Ontology to evaluate SIF precursor signals.
                </p>
              </div>

              {pdfError && (
                <div
                  style={{
                    backgroundColor: 'var(--color-danger-subtle)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: 'var(--color-danger)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '20px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <AlertCircle size={18} />
                  <span>{pdfError}</span>
                </div>
              )}

              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handlePdfFileSelect(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => {
                  const input = document.getElementById('pdf-file-input');
                  if (input) input.click();
                }}
                style={{
                  border: isDragging ? '2px dashed var(--color-sif)' : '2px dashed var(--color-border)',
                  backgroundColor: isDragging ? 'rgba(168, 85, 247, 0.05)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '40px 24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '24px'
                }}
              >
                <input
                  id="pdf-file-input"
                  type="file"
                  accept=".pdf,application/pdf"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePdfFileSelect(e.target.files[0]);
                    }
                  }}
                />

                {!selectedPdf ? (
                  <>
                    <UploadCloud size={44} color={isDragging ? 'var(--color-sif)' : 'var(--color-text-muted)'} style={{ margin: '0 auto 12px' }} />
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '4px' }}>
                      Click to choose or drag & drop PDF report
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Supported format: Standard .PDF (up to 15MB)
                    </div>
                  </>
                ) : (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px',
                      maxWidth: '520px',
                      margin: '0 auto'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '11px',
                          flexShrink: 0
                        }}
                      >
                        PDF
                      </div>
                      <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {selectedPdf.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {(selectedPdf.size / 1024).toFixed(1)} KB • Ready for AI reasoning
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPdf(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Facility & Metadata row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px'
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    Facility / Site
                  </label>
                  <input
                    type="text"
                    value={formData.site}
                    onChange={(e) => handleChange('site', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-base, transparent)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    Report Classification
                  </label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => handleChange('reportType', e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-base, transparent)',
                      color: 'var(--color-text-main)',
                      fontSize: '13px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="UNSAFE_ACT">Unsafe Act</option>
                    <option value="UNSAFE_CONDITION">Unsafe Condition</option>
                    <option value="NEAR_MISS">Near Miss</option>
                    <option value="INCIDENT">Incident</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={handlePdfSubmit}
                  disabled={pdfSubmitting || !selectedPdf}
                  style={{
                    backgroundColor: 'var(--color-sif)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: pdfSubmitting || !selectedPdf ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 0 16px rgba(168, 85, 247, 0.35)',
                    opacity: !selectedPdf ? 0.6 : 1,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {pdfSubmitting ? (
                    <>
                      <Clock size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Streaming PDF to Node & Python Model...
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      Upload PDF & Run Real AI Reasoning
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* MAIN SUBMISSION FORM */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 300px',
                gap: '24px',
                alignItems: 'start'
              }}
            >
          {/* Main Form Card */}
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px'
            }}
          >
            {errors.form && (
              <div
                style={{
                  backgroundColor: 'var(--color-danger-subtle)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  color: 'var(--color-danger)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '18px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={16} />
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Row 1: Report Type & Date */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                  marginBottom: '18px'
                }}
              >
                {/* Report Type */}
                <div>
                  <label
                    htmlFor="reportType"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      marginBottom: '6px'
                    }}
                  >
                    Report Classification <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <select
                    id="reportType"
                    value={formData.reportType}
                    onChange={(e) => handleChange('reportType', e.target.value as ReportType)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: `1px solid ${errors.reportType ? 'var(--color-danger)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: 'var(--color-text-main)',
                      outline: 'none'
                    }}
                  >
                    <option value="UNSAFE_ACT">Unsafe Act</option>
                    <option value="UNSAFE_CONDITION">Unsafe Condition</option>
                    <option value="NEAR_MISS">Near Miss</option>
                    <option value="INCIDENT">Incident</option>
                  </select>
                </div>

                {/* Event Date / Time */}
                <div>
                  <label
                    htmlFor="eventDate"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      marginBottom: '6px'
                    }}
                  >
                    Date & Time of Event
                  </label>
                  <input
                    id="eventDate"
                    type="datetime-local"
                    value={formData.eventDate}
                    onChange={(e) => handleChange('eventDate', e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: 'var(--color-text-main)',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Row 2: Safety Report Description (PRIMARY FIELD) */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label
                    htmlFor="description"
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--color-text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={15} color="var(--color-primary)" />
                    Safety Report Description <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>

                  <span
                    style={{
                      fontSize: '11px',
                      color: charCount < minChars ? 'var(--color-danger)' : 'var(--color-text-muted)',
                      fontFamily: 'monospace'
                    }}
                  >
                    {charCount} / {maxChars} chars (min {minChars})
                  </span>
                </div>

                <textarea
                  id="description"
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  maxLength={maxChars}
                  placeholder="Describe what happened, what was observed, the activity being performed, hazards present, controls in place, and any control failures..."
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--color-bg-subtle)',
                    border: `1px solid ${errors.description ? 'var(--color-danger)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'var(--color-text-main)',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />

                {errors.description && (
                  <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px' }}>
                    {errors.description}
                  </span>
                )}
              </div>

              {/* Row 3: Site & Department */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                  marginBottom: '18px'
                }}
              >
                {/* Facility / Site */}
                <div>
                  <label
                    htmlFor="site"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      marginBottom: '6px'
                    }}
                  >
                    Facility / Operational Site <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <select
                    id="site"
                    value={formData.site}
                    onChange={(e) => handleChange('site', e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: `1px solid ${errors.site ? 'var(--color-danger)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: 'var(--color-text-main)',
                      outline: 'none'
                    }}
                  >
                    <option value="Digboi Refinery - Unit 4">Digboi Refinery - Unit 4</option>
                    <option value="Digboi Refinery - Tank Farm B">Digboi Refinery - Tank Farm B</option>
                    <option value="Duliajan Drilling Rig #7">Duliajan Drilling Rig #7</option>
                    <option value="Moran Gathering Station">Moran Gathering Station</option>
                    <option value="Numaligarh Terminal">Numaligarh Terminal</option>
                    <option value="Jorhat Crude Pumping Station">Jorhat Crude Pumping Station</option>
                    <option value="Offshore Platform Alpha">Offshore Platform Alpha</option>
                  </select>
                  {errors.site && (
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px' }}>
                      {errors.site}
                    </span>
                  )}
                </div>

                {/* Department */}
                <div>
                  <label
                    htmlFor="department"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      marginBottom: '6px'
                    }}
                  >
                    Department
                  </label>
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: 'var(--color-text-main)',
                      outline: 'none'
                    }}
                  >
                    <option value="Mechanical Maintenance">Mechanical Maintenance</option>
                    <option value="Operations & Process">Operations & Process</option>
                    <option value="Drilling & Well Servicing">Drilling & Well Servicing</option>
                    <option value="Electrical & Instrumentation">Electrical & Instrumentation</option>
                    <option value="Civil & Scaffolding">Civil & Scaffolding</option>
                    <option value="HSE & Emergency Response">HSE & Emergency Response</option>
                    <option value="Logistics & Heavy Transport">Logistics & Heavy Transport</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Activity, Contractor Type, Work Phase */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px'
                }}
              >
                {/* Specific Activity */}
                <div>
                  <label
                    htmlFor="activity"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      marginBottom: '6px'
                    }}
                  >
                    Specific Activity <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    id="activity"
                    type="text"
                    value={formData.activity}
                    onChange={(e) => handleChange('activity', e.target.value)}
                    placeholder="e.g. Line Breaking & Torquing"
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: `1px solid ${errors.activity ? 'var(--color-danger)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: 'var(--color-text-main)',
                      outline: 'none'
                    }}
                  />
                  {errors.activity && (
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-danger)', marginTop: '4px' }}>
                      {errors.activity}
                    </span>
                  )}
                </div>

                {/* Contractor Type */}
                <div>
                  <label
                    htmlFor="contractorType"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      marginBottom: '6px'
                    }}
                  >
                    Contractor Classification
                  </label>
                  <select
                    id="contractorType"
                    value={formData.contractorType}
                    onChange={(e) => handleChange('contractorType', e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: 'var(--color-text-main)',
                      outline: 'none'
                    }}
                  >
                    <option value="Company Internal Workforce">Company Internal Workforce</option>
                    <option value="Direct EPC Contractor">Direct EPC Contractor</option>
                    <option value="Specialized Subcontractor">Specialized Subcontractor</option>
                    <option value="Third-Party Service Vendor">Third-Party Service Vendor</option>
                    <option value="Logistics Carrier">Logistics Carrier</option>
                  </select>
                </div>

                {/* Work Phase */}
                <div>
                  <label
                    htmlFor="workPhase"
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-main)',
                      marginBottom: '6px'
                    }}
                  >
                    Work Phase
                  </label>
                  <select
                    id="workPhase"
                    value={formData.workPhase}
                    onChange={(e) => handleChange('workPhase', e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: 'var(--color-text-main)',
                      outline: 'none'
                    }}
                  >
                    <option value="Permit to Work (PTW) & Toolbox Talk">PTW Briefing & Preparation</option>
                    <option value="Live Execution & Hot Work">Live Execution / Hot Work</option>
                    <option value="Hydrotesting & Pressure Testing">Hydrotesting & Testing</option>
                    <option value="Handover & Isolation Removal">Handover & De-isolation</option>
                    <option value="Routine Safety Inspection">Routine Safety Inspection</option>
                    <option value="Emergency Shutdown & Response">Emergency Response</option>
                  </select>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--color-border-subtle)',
                  paddingTop: '18px'
                }}
              >
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isSubmitting}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'transparent',
                    color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={14} />
                  Reset Form
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link
                    to="/reports"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'transparent',
                      color: 'var(--color-text-main)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: 500,
                      textDecoration: 'none'
                    }}
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={isSubmitting || charCount < minChars}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor:
                        charCount < minChars || isSubmitting
                          ? 'var(--color-border)'
                          : 'var(--color-primary)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 22px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: charCount < minChars || isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <Send size={15} />
                    {isSubmitting ? 'Submitting Report...' : 'Submit Safety Report'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Sidebar: Sample Presets & HSE Guidance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Sample Ingestion Presets */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Sparkles size={15} color="var(--color-primary)" />
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                  Fill Sample HSE Case
                </h4>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '0 0 12px 0' }}>
                Quick-load realistic industrial field scenarios for testing:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    style={{
                      textAlign: 'left',
                      backgroundColor: 'var(--color-bg-subtle)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border)';
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {preset.label}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      {preset.type.replace('_', ' ')} • {preset.site}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Ingestion Guidance Card */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ShieldAlert size={15} color="var(--color-sif)" />
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                  SIF Precursor Guidance
                </h4>
              </div>
              <ul
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  paddingLeft: '16px',
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  lineHeight: 1.4
                }}
              >
                <li>Include energy sources present (pressure, voltage, elevation, mechanical).</li>
                <li>State whether barriers or locks were verified prior to work.</li>
                <li>Note any PPE or atmospheric monitoring anomalies.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
</PageContainer>
  );
};
