from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid
import os
from typing import Dict, Optional
from dotenv import load_dotenv

load_dotenv()

from services.orchestrator import run_verification
from schemas import VerificationReport

app = FastAPI(title="PROOFCHAIN Verification API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VerificationRequest(BaseModel):
    text: str
    mode: str = "web"
    language: str = "en"
    user_id: Optional[str] = None

from services.db import store_verification_run, get_verification_run, get_user_verifications as db_get_user_verifications

# In-memory store fallback
verifications: Dict[str, VerificationReport] = {}

def process_verification(verification_id: str, text: str, user_id: Optional[str] = None):
    report = run_verification(text, verification_id)
    report.user_id = user_id
    # Store in memory
    verifications[verification_id] = report
    # Store in DB
    store_verification_run(verification_id, user_id, report.model_dump())

@app.post("/api/v1/verifications")
async def create_verification(req: VerificationRequest, background_tasks: BackgroundTasks):
    vid = f"vrf_{uuid.uuid4().hex[:8]}"
    background_tasks.add_task(process_verification, vid, req.text, req.user_id)
    return {"verification_id": vid, "status": "queued"}

@app.get("/api/v1/verifications/{id}")
async def get_verification(id: str):
    db_report = get_verification_run(id)
    if db_report:
        return {"id": id, "status": db_report.get("status", "completed")}
    if id in verifications:
        return {"id": id, "status": "completed"}
    return {"id": id, "status": "queued"}

@app.get("/api/v1/verifications/{id}/report")
async def get_report(id: str):
    db_report = get_verification_run(id)
    if db_report:
        return db_report
    if id in verifications:
        return verifications[id].model_dump()
    return {"error": "not found"}

@app.get("/api/v1/user/{user_id}/verifications")
async def get_user_verifications(user_id: str):
    db_verifs = db_get_user_verifications(user_id)
    if db_verifs and len(db_verifs) > 0:
        return db_verifs
    # Fallback
    user_verifs = [v.model_dump() for v in verifications.values() if v.user_id == user_id]
    return user_verifs
