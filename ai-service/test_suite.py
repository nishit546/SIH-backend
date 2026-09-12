import time
import json
import requests

API_URL = "http://127.0.0.1:8000/api/analyze"
HEALTH_URL = "http://127.0.0.1:8000/health"

TEST_CASES = [
    {
        "name": "Case 1: Severe SIF Near-Miss (Critical Triad)",
        "payload": {
            "text": "Maintenance worker started welding on a high pressure hydrocarbon pipeline before gas testing was completed."
        },
        "expected_risk": "HIGH",
    },
    {
        "name": "Case 2: Compliant Safe Work (No Failure)",
        "payload": {
            "text": "Technician completed pre-task risk assessment, verified positive energy isolation, and received valid hot work authorization permit."
        },
        "expected_risk": "LOW/MEDIUM",
    },
    {
        "name": "Case 3: Generic Minor Incident (Non-High Energy)",
        "payload": {
            "text": "An administrative clerk tripped over an Ethernet cable in the site office corridor and scraped their knee."
        },
        "expected_risk": "LOW",
    },
]

def print_separator(char="=", length=95):
    print(char * length)

def run_test_suite():
    print_separator("=")
    print("      SIH26165 INDUSTRIAL SAFETY AI ENGINE - EVALUATOR TEST SUITE")
    print_separator("=")

    # 1. Health check
    try:
        health_res = requests.get(HEALTH_URL, timeout=5)
        if health_res.status_code == 200:
            info = health_res.json()
            print(f"[+] Health Check Passed:")
            print(f"    - DistilBERT Model Loaded : {info.get('distilbert_model_loaded')}")
            print(f"    - Gemini 2.5 Configured  : {info.get('gemini_configured')}")
            print(f"    - Compute Device         : {info.get('compute_device')}")
        else:
            print(f"[-] Health check failed with status code {health_res.status_code}")
    except requests.exceptions.ConnectionError:
        print("[!] ERROR: Cannot connect to http://127.0.0.1:8000. Is the FastAPI server running?")
        print("    Run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload")
        return

    print_separator("-")
    print(f"Executing {len(TEST_CASES)} diverse industrial scenario evaluations...")
    print_separator("-")

    for idx, test in enumerate(TEST_CASES, start=1):
        print(f"\n[{idx}] {test['name']}")
        print(f"    Input Narrative: \"{test['payload']['text']}\"")
        
        start_time = time.time()
        try:
            res = requests.post(API_URL, json=test["payload"], timeout=20)
            latency = (time.time() - start_time) * 1000

            if res.status_code == 200:
                data = res.json()
                print(f"    Status: 200 OK | Latency: {latency:.1f}ms")
                print("    +--------------------------------------------------------------------------------+")
                print(f"    | SIF Probability : {data.get('sif_probability', 0):<12} | Risk Level: {data.get('risk_level', 'UNKNOWN'):<22} |")
                print(f"    | IOGP Rules      : {', '.join(data.get('iogp_rules', [])):<61} |")
                print(f"    | Hazards Found   : {', '.join(data.get('hazards', [])):<61} |")
                print(f"    | Control Failures: {', '.join(data.get('control_failures', [])):<61} |")
                print(f"    | Human Exposure  : {', '.join(data.get('exposure', [])):<61} |")
                print("    +--------------------------------------------------------------------------------+")
                print(f"    Explanation: {data.get('explanation', '')}")
            else:
                print(f"    [-] Request failed: Status {res.status_code} - {res.text}")
        except Exception as e:
            print(f"    [-] Execution error: {e}")

    # Audit log validation
    print("\n" + "=" * 95)
    print("Querying /api/audit-log (SQLite Evaluator Audit Trail)...")
    try:
        audit_res = requests.get("http://127.0.0.1:8000/api/audit-log?limit=3", timeout=5)
        if audit_res.status_code == 200:
            logs = audit_res.json()
            print(f"[+] Total recent records fetched: {len(logs)}")
            for item in logs:
                print(f"    ID: {item['id']} | Risk: {item['final_risk_level']:<6} | SIF Score: {item['calibrated_score']:.2f} | Time: {item['timestamp']}")
        else:
            print(f"[-] Failed to fetch audit logs: {audit_res.status_code}")
    except Exception as e:
        print(f"[-] Audit log query error: {e}")

    print("=" * 95)
    print("[+] Test Suite execution complete.")

if __name__ == "__main__":
    run_test_suite()
