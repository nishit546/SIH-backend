import json
import logging
from typing import List, Union, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# Load environment configuration (.env)
load_dotenv()

# Internal modular imports
from database import init_db, get_db, AuditLog
from ai_engine import (
    load_distilbert_model,
    get_ml_probability,
    calibrate_risk,
    generate_explanation,
    init_genai,
    is_model_ready,
    is_genai_ready,
    DEVICE,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sih-backend.main")

# ---------------------------------------------------------------------------
# Lifespan Management
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing SIH26165 SIF Detection Engine...")
    
    # 1. Initialize SQLite Database Tables
    init_db()
    logger.info("Database schema initialized successfully.")

    # 2. Load Local Fine-Tuned DistilBERT Weights
    load_distilbert_model()

    # 3. Initialize Google GenAI SDK Client
    init_genai()

    yield
    logger.info("SIH26165 SIF Detection Engine shutdown complete.")

# ---------------------------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="SIH26165 SIF Detection Engine",
    description="Enterprise Industrial Safety AI Engine for Oil India Limited (SIH26165). Integrates fine-tuned DistilBERT, deterministic hybrid risk ontology, and Gemini 2.5 Flash Explainable AI.",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic Schemas with Rich Documentation
# ---------------------------------------------------------------------------
class IncidentReport(BaseModel):
    text: str = Field(
        ...,
        min_length=5,
        description="Detailed industrial incident, near-miss, or hazard observation narrative.",
        json_schema_extra={
            "example": "Maintenance worker started welding on a pipeline before gas testing was completed."
        },
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "text": "Maintenance worker started welding on a pipeline before gas testing was completed."
                }
            ]
        }
    }

class BatchIncidentRequest(BaseModel):
    reports: List[IncidentReport] = Field(
        ...,
        description="Array of incident reports to be evaluated in batch.",
        json_schema_extra={
            "example": [
                {"text": "Maintenance worker started welding on a pipeline before gas testing was completed."},
                {"text": "Technician safely isolated pump electrical breaker and locked out system before inspection."},
                {"text": "Contractor tripped on an uneven gravel pathway near warehouse and bruised elbow."}
            ]
        }
    )

class SIFAnalysisResult(BaseModel):
    sif_probability: float
    sif_potential: Optional[bool] = None
    confidence: Optional[float] = None
    risk_level: str
    iogp_rules: List[str]
    hazards: List[str]
    exposure: List[str]
    control_failures: List[str]
    potential_consequence: Optional[str] = None
    explanation: str

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health", summary="Health Check & System Diagnostics")
def health_check():
    """Returns runtime status of API, GenAI integration, and local DistilBERT model weights."""
    return {
        "status": "healthy",
        "service": "SIH26165 SIF Detection Engine",
        "distilbert_model_loaded": is_model_ready(),
        "gemini_configured": is_genai_ready(),
        "compute_device": str(DEVICE),
    }

@app.post("/api/analyze", summary="Analyze Single Incident Narrative", response_model=SIFAnalysisResult)
def analyze_incident(report: IncidentReport, db: Session = Depends(get_db)):
    """
    Executes the 3-layer AI Pipeline:
    1. DistilBERT: Computes ML probability of Class 1 (SIF).
    2. Hybrid Risk Ontology: Evaluates High Energy + Control Failure + Exposure triads.
    3. Gemini 2.5 Flash: Generates Explainable AI (XAI) output mapped to IOGP Life-Saving Rules.
    4. Database: Persists immutable record to SQLite Audit Log.
    """
    text = report.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Incident report text cannot be empty.")

    # 1. DistilBERT Inference
    raw_ml_prob = get_ml_probability(text)

    # 2. Deterministic Risk Calibration
    calibrated_prob, risk_level, ontology_details = calibrate_risk(text, raw_ml_prob)

    # 3. Gemini 2.5 Flash XAI Synthesis
    result = generate_explanation(text, calibrated_prob, risk_level, ontology_details)

    # 4. Audit Log Persistence
    audit_entry = AuditLog(
        report_text=text,
        distilbert_score=raw_ml_prob,
        calibrated_score=result.get("sif_probability", calibrated_prob),
        final_risk_level=result.get("risk_level", risk_level),
        extracted_hazards=json.dumps(result.get("hazards", [])),
        iogp_rules=json.dumps(result.get("iogp_rules", [])),
        exposure=json.dumps(result.get("exposure", [])),
        control_failures=json.dumps(result.get("control_failures", [])),
        explanation=result.get("explanation", ""),
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(audit_entry)

    return result

@app.post("/api/analyze/batch", summary="Batch Incident Analysis")
def analyze_batch(payload: Union[BatchIncidentRequest, List[IncidentReport]], db: Session = Depends(get_db)):
    """
    Evaluates a collection of incident reports sequentially, storing each analysis
    in the database and returning the aggregated list of structured results.
    """
    reports_list = payload.reports if isinstance(payload, BatchIncidentRequest) else payload
    results = []

    for item in reports_list:
        text = item.text.strip()
        if not text:
            continue

        raw_ml_prob = get_ml_probability(text)
        calibrated_prob, risk_level, ontology_details = calibrate_risk(text, raw_ml_prob)
        analysis_result = generate_explanation(text, calibrated_prob, risk_level, ontology_details)

        # Persist to database
        audit_entry = AuditLog(
            report_text=text,
            distilbert_score=raw_ml_prob,
            calibrated_score=analysis_result.get("sif_probability", calibrated_prob),
            final_risk_level=analysis_result.get("risk_level", risk_level),
            extracted_hazards=json.dumps(analysis_result.get("hazards", [])),
            iogp_rules=json.dumps(analysis_result.get("iogp_rules", [])),
            exposure=json.dumps(analysis_result.get("exposure", [])),
            control_failures=json.dumps(analysis_result.get("control_failures", [])),
            explanation=analysis_result.get("explanation", ""),
        )
        db.add(audit_entry)
        results.append(analysis_result)

    db.commit()
    return {"processed_count": len(results), "results": results}

@app.get("/api/audit-log", summary="Retrieve Evaluator Audit Logs")
def get_audit_log(limit: int = 50, db: Session = Depends(get_db)):
    """
    Fetches the 50 most recent analyzed incidents from the SQLite database
    for hackathon evaluators and compliance auditing.
    """
    records = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(limit).all()
    return [rec.to_dict() for rec in records]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
