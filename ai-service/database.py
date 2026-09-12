import json
from datetime import datetime
from typing import Generator

from sqlalchemy import Column, Integer, Float, String, Text, DateTime, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# Local SQLite database file
DATABASE_URL = "sqlite:///./safety_audit.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # Required for SQLite concurrency with FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AuditLog(Base):
    """
    Audit log database model recording all incoming incident analyses,
    raw DistilBERT probabilities, ontology overrides, and final Gemini XAI outputs.
    """
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True, nullable=False)
    report_text = Column(Text, nullable=False)
    distilbert_score = Column(Float, nullable=False)
    calibrated_score = Column(Float, nullable=False)
    final_risk_level = Column(String(20), nullable=False)
    extracted_hazards = Column(Text, nullable=False)       # JSON string list
    iogp_rules = Column(Text, nullable=False)              # JSON string list
    exposure = Column(Text, nullable=False)                # JSON string list
    control_failures = Column(Text, nullable=False)        # JSON string list
    explanation = Column(Text, nullable=False)

    def to_dict(self):
        """Converts the model into a serialized dictionary with parsed JSON fields."""
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "report_text": self.report_text,
            "distilbert_score": round(self.distilbert_score, 4),
            "calibrated_score": round(self.calibrated_score, 4),
            "final_risk_level": self.final_risk_level,
            "extracted_hazards": json.loads(self.extracted_hazards or "[]"),
            "iogp_rules": json.loads(self.iogp_rules or "[]"),
            "exposure": json.loads(self.exposure or "[]"),
            "control_failures": json.loads(self.control_failures or "[]"),
            "explanation": self.explanation,
        }

def init_db():
    """Initializes the database schema and creates tables if they do not exist."""
    Base.metadata.create_all(bind=engine)

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for managing database session lifecycle."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
