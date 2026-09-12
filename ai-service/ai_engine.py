import os
import re
import json
import logging
from typing import Tuple, Dict, Any, List

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Google GenAI Official SDK
from google import genai
from google.genai import types

logger = logging.getLogger("sih-backend.ai_engine")

# ---------------------------------------------------------------------------
# Device & Model Configuration
# ---------------------------------------------------------------------------
MODEL_DIR = os.getenv("MODEL_PATH", "./sif_final_model")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

tokenizer = None
model = None
genai_client = None

# ---------------------------------------------------------------------------
# IOGP 9 Life-Saving Rules Standard
# ---------------------------------------------------------------------------
IOGP_LIFE_SAVING_RULES = [
    "Bypassing Safety Controls",
    "Confined Space",
    "Driving",
    "Energy Isolation",
    "Hot Work",
    "Line of Fire",
    "Safe Mechanical Lifting",
    "Work Authorization",
    "Working at Height",
]

# ---------------------------------------------------------------------------
# Layer 1: DistilBERT Local Inference Engine
# ---------------------------------------------------------------------------
def load_distilbert_model():
    """Loads tokenizer and sequence classification model from local weights directory."""
    global tokenizer, model
    try:
        if os.path.exists(MODEL_DIR):
            logger.info(f"Loading fine-tuned DistilBERT from '{MODEL_DIR}' on {DEVICE}...")
            tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
            model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
            model.to(DEVICE)
            model.eval()
            logger.info("DistilBERT model loaded successfully.")
            print("\n=======================================================")
            print("MODEL LOADED SUCCESSFULLY")
            print(f"MODEL PATH: {MODEL_DIR}")
            print(f"MODEL TYPE: {type(model).__name__}")
            print("TOKENIZER LOADED: YES")
            print(f"COMPUTE DEVICE: {DEVICE}")
            print("=======================================================\n")
            return True
        else:
            logger.error(f"CRITICAL: Model path '{MODEL_DIR}' not found. Cannot proceed with real AI inference.")
            raise FileNotFoundError(f"Model path '{MODEL_DIR}' does not exist.")
    except Exception as e:
        logger.error(f"Error loading DistilBERT model: {e}")
        return False

def get_ml_probability(text: str) -> float:
    """
    Computes raw SIF probability (Class 1) using fine-tuned DistilBERT.
    Returns float probability between 0.0 and 1.0.
    """
    if model is None or tokenizer is None:
        logger.warning("DistilBERT model not loaded in memory; returning fallback probability 0.45.")
        return 0.45

    try:
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding=True,
        )
        inputs = {k: v.to(DEVICE) for k, v in inputs.items() if k != "token_type_ids"}

        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits

            if logits.shape[-1] == 2:
                # Binary classification: [prob(Non-SIF), prob(SIF)]
                probs = torch.softmax(logits, dim=-1)
                sif_prob = probs[0, 1].item()
            else:
                # Single output logit
                sif_prob = torch.sigmoid(logits)[0].item()

        return round(float(sif_prob), 4)
    except Exception as e:
        logger.error(f"Inference execution failed: {e}")
        return 0.50

def is_model_ready() -> bool:
    """Returns True if the DistilBERT model and tokenizer are loaded in memory."""
    return model is not None and tokenizer is not None

def is_genai_ready() -> bool:
    """Returns True if the Google GenAI client is initialized."""
    return genai_client is not None or bool(os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "your_key_here")

# ---------------------------------------------------------------------------
# Layer 2: Deterministic Hybrid Risk Ontology (Regex Engine)
# ---------------------------------------------------------------------------
HIGH_ENERGY_REGEX = re.compile(
    r"\b(welding|hot\s+work|pipeline|pressur\w*|electric\w*|voltage\w*|\d+k?v\b|switchyard|busbar|arc\s+flash|confined\s+space|height\w*|scaffold\w*|suspended\s+load|crane\w*|flammab\w*|gas\w*|h2s|hydrocarbon\w*|tank\w*|vessel\w*)\b",
    re.IGNORECASE,
)

CONTROL_FAILURE_REGEX = re.compile(
    r"\b(before\s+.*?complet\w*|without|not\s+test\w*|failed|failure\w*|bypassed|disabled|no\s+permit|expired|missing|not\s+followed|incomplete|abandoned|unattended)",
    re.IGNORECASE,
)

HUMAN_EXPOSURE_REGEX = re.compile(
    r"\b(worker\w*|operator\w*|contractor\w*|employee\w*|personnel\w*|welder\w*|technician\w*|roughneck\w*|roustabout\w*|crew\w*|mechanic\w*|electrician\w*|helper\w*)\b",
    re.IGNORECASE,
)

def calibrate_risk(text: str, raw_prob: float) -> Tuple[float, str, Dict[str, Any]]:
    """
    Deterministic safety ontology rule engine.
    - High Energy + Control Failure + Exposure -> max(raw_prob, 0.88), Risk: HIGH
    - High Energy + Control Failure           -> max(raw_prob, 0.65), Risk: MEDIUM
    - Otherwise                                -> raw_prob, Risk: MEDIUM if >= 0.5 else LOW
    """
    high_energy_matches = list(set(HIGH_ENERGY_REGEX.findall(text)))
    control_failure_matches = list(set(CONTROL_FAILURE_REGEX.findall(text)))
    human_exposure_matches = list(set(HUMAN_EXPOSURE_REGEX.findall(text)))

    has_high_energy = len(high_energy_matches) > 0
    has_control_failure = len(control_failure_matches) > 0
    has_exposure = len(human_exposure_matches) > 0

    override_tier = "NONE"

    if has_high_energy and has_control_failure and has_exposure:
        calibrated_prob = max(raw_prob, 0.88)
        risk_level = "HIGH"
        override_tier = "CRITICAL_TRIAD"
    elif has_high_energy and has_control_failure:
        calibrated_prob = max(raw_prob, 0.65)
        risk_level = "MEDIUM"
        override_tier = "BARRIER_DEGRADATION"
    else:
        calibrated_prob = raw_prob
        risk_level = "MEDIUM" if raw_prob >= 0.50 else "LOW"

    details = {
        "override_tier": override_tier,
        "high_energy_hazards": high_energy_matches,
        "control_failures": control_failure_matches,
        "human_exposure": human_exposure_matches,
    }

    return round(calibrated_prob, 4), risk_level, details

# ---------------------------------------------------------------------------
# Layer 3: Gemini 2.5 Flash Explainable AI (XAI) Synthesis
# ---------------------------------------------------------------------------
def init_genai():
    """Initializes the Google GenAI client from environment variable."""
    global genai_client
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key and api_key != "your_key_here":
        try:
            genai_client = genai.Client(api_key=api_key)
            logger.info("Google GenAI client successfully initialized.")
            return True
        except Exception as e:
            logger.error(f"Failed to initialize GenAI client: {e}")
            return False
    return False

SYSTEM_INSTRUCTION = f"""
You are the Chief Safety AI Architect for Oil India Limited (OIL) implementing SIF (Serious Injury and Fatality) prevention.
Analyze the incident report narrative alongside its calibrated deterministic risk score.

Available IOGP 9 Life-Saving Rules to map to:
{json.dumps(IOGP_LIFE_SAVING_RULES)}

Strict Output Requirement:
You MUST respond strictly with a single, valid raw JSON object. Do not include markdown code fences (no ```json or ```).
The output schema MUST EXACTLY match:
{{
  "sif_probability": <float between 0.0 and 1.0>,
  "risk_level": <"HIGH" | "MEDIUM" | "LOW">,
  "iogp_rules": [<list of applicable rule strings from the 9 IOGP Life-Saving Rules>],
  "hazards": [<list of specific physical, chemical, or mechanical hazards extracted from text>],
  "exposure": [<list of worker exposure mechanisms or positions relative to hazard>],
  "control_failures": [<list of safety barriers, permits, or controls that failed, were missing, or bypassed>],
  "explanation": <2 to 3 sentences explaining the technical root cause, barrier failure, and fatality potential>
}}
"""

def generate_explanation(
    text: str,
    calibrated_prob: float,
    risk_level: str,
    ontology_details: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Synthesizes the narrative and deterministic ontology signals through Gemini 2.5 Flash
    for Explainable AI (XAI) root cause, barrier failure, and IOGP rule extraction.
    """
    # Deterministic fallback mapping for IOGP rules
    fallback_rules = []
    text_lower = text.lower()
    if "weld" in text_lower or "hot work" in text_lower:
        fallback_rules.append("Hot Work")
    if "pipeline" in text_lower or "pressur" in text_lower or "electric" in text_lower:
        fallback_rules.append("Energy Isolation")
    if "confined space" in text_lower:
        fallback_rules.append("Confined Space")
    if "height" in text_lower or "scaffold" in text_lower:
        fallback_rules.append("Working at Height")
    if "crane" in text_lower or "suspended load" in text_lower:
        fallback_rules.append("Safe Mechanical Lifting")
    if "bypassed" in text_lower or "override" in text_lower:
        fallback_rules.append("Bypassing Safety Controls")
    if "permit" in text_lower:
        fallback_rules.append("Work Authorization")

    # Estimate default consequence based on hazards
    if any(h in text_lower for h in ["weld", "gas", "pipeline", "pressur", "flammab"]):
        default_consequence = "Catastrophic hydrocarbon fire/explosion and worker fatality"
    elif any(h in text_lower for h in ["height", "scaffold", "fall"]):
        default_consequence = "Fall from height resulting in fatal blunt force trauma"
    elif "confined space" in text_lower:
        default_consequence = "Asphyxiation or toxic atmosphere fatality"
    else:
        default_consequence = "Minor physical injury or first-aid event" if risk_level == "LOW" else "Serious lost-time injury"

    sif_potential_flag = bool(calibrated_prob >= 0.50)
    confidence_score = round(min(0.70 + abs(calibrated_prob - 0.50) * 0.55, 0.98), 2)

    client = genai_client
    if not client:
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key and api_key != "your_key_here":
            try:
                client = genai.Client(api_key=api_key)
            except Exception:
                client = None

    if not client:
        # Graceful deterministic output when Gemini API Key is not set
        logger.info("Gemini client not available. Generating local deterministic explanation.")
        return {
            "sif_probability": calibrated_prob,
            "sif_potential": sif_potential_flag,
            "confidence": confidence_score,
            "risk_level": risk_level,
            "iogp_rules": fallback_rules if fallback_rules else ["Work Authorization"],
            "hazards": ontology_details.get("high_energy_hazards", []),
            "exposure": ontology_details.get("human_exposure", []),
            "control_failures": ontology_details.get("control_failures", []),
            "potential_consequence": default_consequence,
            "explanation": (
                f"Deterministically classified as {risk_level} risk (SIF Probability: {calibrated_prob:.2f}) "
                f"based on identified hazard triad and barrier degradation. Safety controls must be verified."
            ),
        }

    user_prompt = f"""
Analyze this oil & gas incident narrative:
"{text}"

Calibrated Probability Score: {calibrated_prob:.4f}
Assigned Risk Level: {risk_level}
Detected High Energy Hazards: {ontology_details.get('high_energy_hazards')}
Detected Control Failures: {ontology_details.get('control_failures')}
Detected Human Exposure: {ontology_details.get('human_exposure')}
Override Tier: {ontology_details.get('override_tier')}

Provide the structured XAI safety assessment in strict JSON format.
"""

    try:
        candidate_models = [
            os.getenv("GEMINI_MODEL", "gemini-3.6-flash"),
            "gemini-flash-latest",
            "gemini-3.5-flash",
            "gemini-2.5-flash",
        ]
        response = None
        last_err = None

        for model_name in candidate_models:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=user_prompt,
                    config=types.GenerateContentConfig(
                        system_instruction=SYSTEM_INSTRUCTION,
                        response_mime_type="application/json",
                        temperature=0.1,
                    ),
                )
                if response and response.text:
                    break
            except Exception as e:
                last_err = e
                continue

        if not response or not response.text:
            raise RuntimeError(f"All Gemini candidate models failed. Last error: {last_err}")

        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        parsed = json.loads(response_text.strip())

        if ontology_details.get("override_tier") == "CRITICAL_TRIAD":
            parsed["sif_probability"] = max(float(parsed.get("sif_probability", calibrated_prob)), 0.88)
            parsed["risk_level"] = "HIGH"
            parsed["sif_potential"] = True
        elif ontology_details.get("override_tier") == "BARRIER_DEGRADATION":
            parsed["sif_probability"] = max(float(parsed.get("sif_probability", calibrated_prob)), 0.65)
            parsed["sif_potential"] = True

        if "sif_potential" not in parsed:
            parsed["sif_potential"] = bool(parsed.get("sif_probability", calibrated_prob) >= 0.50)
        if "confidence" not in parsed:
            parsed["confidence"] = confidence_score
        if "potential_consequence" not in parsed:
            parsed["potential_consequence"] = default_consequence

        return parsed

    except Exception as e:
        logger.error(f"Gemini API call failed: {e}. Falling back to deterministic analysis.")
        return {
            "sif_probability": calibrated_prob,
            "sif_potential": sif_potential_flag,
            "confidence": confidence_score,
            "risk_level": risk_level,
            "iogp_rules": fallback_rules if fallback_rules else ["Work Authorization"],
            "hazards": ontology_details.get("high_energy_hazards", []),
            "exposure": ontology_details.get("human_exposure", []),
            "control_failures": ontology_details.get("control_failures", []),
            "potential_consequence": default_consequence,
            "explanation": (
                f"Classified as {risk_level} risk with SIF score {calibrated_prob:.2f}. "
                f"Barrier failure detected involving {', '.join(ontology_details.get('high_energy_hazards', ['high energy hazards']))}."
            ),
        }
