import os
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from models import CandidateProfile, Job, MatchRequest, JobMatchResponse
from cv_parser import parse_cv_file, CVParseError
from skill_extractor import extract_candidate_profile
from matcher import rank_jobs, match_job
from job_search import load_jobs, search_jobs, get_job_by_id

app = FastAPI(
    title="AI Job Matcher API",
    description="Backend service for CV parsing, skill extraction, and job matching.",
    version="1.0.0"
)

# Allow CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "AI Job Matcher API",
        "docs": "/docs",
        "total_jobs": len(load_jobs())
    }

@app.post("/api/cv/analyze", response_model=CandidateProfile)
async def analyze_cv(file: UploadFile = File(...)):
    """
    FR-01, FR-02, FR-03, FR-04:
    Accepts PDF or DOCX file, extracts actual text using PyMuPDF / python-docx,
    identifies technical skills, and returns candidate profile.
    """
    try:
        content = await file.read()
        raw_text = parse_cv_file(file.filename or "cv.pdf", content)
        profile = extract_candidate_profile(file.filename or "cv.pdf", raw_text)
        return profile
    except CVParseError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan saat memproses CV: {str(e)}")

@app.get("/api/jobs", response_model=List[Job])
def get_jobs(
    keyword: Optional[str] = Query(None, description="Pencarian judul, perusahaan, skill"),
    location: Optional[str] = Query(None, description="Lokasi lowongan"),
    type: Optional[str] = Query(None, description="Tipe pekerjaan")
):
    """
    Get all jobs with optional search and filters.
    """
    return search_jobs(keyword=keyword, location=location, employment_type=type)

@app.get("/api/jobs/{id}", response_model=Job)
def get_job_detail(id: int):
    """
    Get job detail by ID.
    """
    job = get_job_by_id(id)
    if not job:
        raise HTTPException(status_code=404, detail="Job tidak ditemukan")
    return job

@app.post("/api/jobs/match")
def match_jobs(request: MatchRequest):
    """
    Section 10 & 21:
    Matches candidate skills with all jobs and returns ranked list with Match Score breakdown.
    """
    jobs = load_jobs()
    ranked = rank_jobs(jobs, request.skills)
    return {"jobs": ranked}

@app.get("/api/recommendations")
def get_recommendations(skills: Optional[str] = Query(None, description="Comma separated skills")):
    """
    Section 13:
    Returns recommended jobs sorted by Match Score.
    """
    jobs = load_jobs()
    skill_list = [s.strip() for s in skills.split(",")] if skills else []
    ranked = rank_jobs(jobs, skill_list)
    return {"recommendations": ranked[:10]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
