# ==============================================================================
# SIH26165 Industrial Safety AI Engine - Production Container Image
# ==============================================================================
FROM python:3.11-slim

# Set environment variables for clean container execution
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    MODEL_PATH=/app/sif_final_model

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model weights
COPY database.py .
COPY ai_engine.py .
COPY main.py .
COPY test_suite.py .
COPY sif_final_model/ ./sif_final_model/

# Expose FastAPI listening port
EXPOSE 8000

# Health check to monitor container readiness
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start Uvicorn ASGI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
