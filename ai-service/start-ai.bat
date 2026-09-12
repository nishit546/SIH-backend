@echo off
cd /d "%~dp0"
echo ===================================================
echo Starting SIH SIF Detection AI Service on port 8000
echo Using local DistilBERT model in ./sif_final_model
echo ===================================================
python -m uvicorn main:app --host 0.0.0.0 --port 8000
