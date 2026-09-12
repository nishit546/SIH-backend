import os
import json
import logging
from typing import Optional

import gradio as gr
import uvicorn
from dotenv import load_dotenv

# Load local environment variables if available
load_dotenv()

from database import init_db, get_db
from ai_engine import (
    load_distilbert_model,
    init_genai,
    is_model_ready,
    is_genai_ready,
    DEVICE,
)
from main import app as fastapi_app, analyze_incident, IncidentReport

logger = logging.getLogger("sih.hf_space")

# Ensure models & DB are ready
init_db()
load_distilbert_model()
init_genai()

def predict_sif(narrative: str):
    """Gradio handler for interactive testing"""
    text = (narrative or "").strip()
    if not text:
        return {
            "Status": "Error",
            "Message": "Please provide an incident or hazard observation text.",
        }
    
    try:
        report = IncidentReport(text=text)
        db = next(get_db())
        res = analyze_incident(report, db)
        
        return {
            "SIF Probability": f"{res.sif_probability:.1%}",
            "SIF Potential": res.sif_potential if res.sif_potential is not None else (res.sif_probability >= 0.5),
            "Risk Level": res.risk_level,
            "Confidence": f"{res.confidence:.1%}" if res.confidence is not None else "N/A",
            "IOGP Life-Saving Rules": res.iogp_rules if res.iogp_rules else ["None Identified"],
            "Identified Hazards": res.hazards if res.hazards else ["None"],
            "Exposure Vectors": res.exposure if res.exposure else ["None"],
            "Control Failures": res.control_failures if res.control_failures else ["None"],
            "Potential Consequence": res.potential_consequence or "N/A",
            "AI Reasoning Explanation": res.explanation,
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        return {"Status": "Error", "Detail": str(e)}

# ---------------------------------------------------------------------------
# Gradio UI Interface
# ---------------------------------------------------------------------------
theme = gr.themes.Soft(
    primary_hue="blue",
    secondary_hue="slate",
    neutral_hue="slate",
)

with gr.Blocks(theme=theme, title="SIF Precursor AI Engine") as demo:
    gr.Markdown(
        """
        # 🛡️ Industrial Safety AI Engine (SIH-2026)
        ### Automated SIF Precursor Detection, Barrier Degradation Analytics & IOGP Life-Saving Rules Compliance
        *Integrated with Fine-Tuned DistilBERT & Gemini Explainable AI (XAI).*
        """
    )
    
    with gr.Row():
        with gr.Column(scale=1):
            input_text = gr.Textbox(
                lines=5,
                placeholder="Enter field incident observation, near-miss, or hazard narrative...",
                label="Incident Observation Narrative",
            )
            submit_btn = gr.Button("Analyze SIF Potential", variant="primary")
            
            gr.Examples(
                examples=[
                    ["Maintenance worker started welding on a crude pipeline before gas testing was completed."],
                    ["Technician safely isolated pump electrical breaker and locked out system before inspection."],
                    ["Contractor working on scaffold at 10m height without safety harness when a loose board slipped."],
                    ["Worker slipped on oily patch on deck pathway and sustained minor bruise on knee."],
                ],
                inputs=input_text,
                label="Sample Incident Scenarios",
            )
            
        with gr.Column(scale=1):
            output_json = gr.JSON(label="Structured SIF Safety Intelligence")
            
    submit_btn.click(fn=predict_sif, inputs=input_text, outputs=output_json)
    
    gr.Markdown(
        """
        ---
        **API Endpoints Available:**
        * `POST /api/analyze` - Direct JSON API for Node.js / Express backend integration
        * `GET /health` - Diagnostic health check
        * `GET /docs` - Interactive OpenAPI / Swagger documentation
        """
    )

# Mount Gradio UI on the root of FastAPI
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    logger.info(f"Starting server on 0.0.0.0:{port}")
    uvicorn.run(app, host="0.0.0.0", port=port)
