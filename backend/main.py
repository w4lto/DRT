from fastapi import FastAPI, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from models import ReportDefinition
from report_engine import render_report
import os

CONN_PARAMS = {
    "dbname": os.getenv("DB_NAME", "sampledb"),
    "user": os.getenv("DB_USER", "superset"),
    "password": os.getenv("DB_PASSWORD", "superset"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": int(os.getenv("DB_PORT", 5432)),
}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REPORTS = {}

@app.post("/reports/")
def save_report(defn: ReportDefinition):
    REPORTS[defn.name] = defn
    return {"msg": f"Report '{defn.name}' saved."}

@app.get("/reports/")
def list_reports():
    return [r.dict() for r in REPORTS.values()]

@app.get("/reports/{name}")
async def generate_report(name: str, request: Request):
    if name not in REPORTS:
        return {"error": "Report not found"}
    defn = REPORTS[name]

    # ✅ Extract all query params into a dict
    params = dict(request.query_params)

    pdf_bytes = render_report(defn.query, defn.template, CONN_PARAMS, params)
    return Response(pdf_bytes, media_type="application/pdf")
