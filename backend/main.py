import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import CandidateProfile
from cv_parser import parse_cv_file, CVParseError
from skill_extractor import extract_candidate_profile

app = FastAPI(
    title="AI Job Matcher API",
    description="Backend service for CV parsing and skill extraction.",
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
        "docs": "/docs"
    }

@app.post("/api/cv/analyze", response_model=CandidateProfile)
async def analyze_cv(file: UploadFile = File(...)):
    """
    Accepts PDF or DOCX file, extracts actual text using PyMuPDF / python-docx,
    identifies multi-discipline skills, and returns candidate profile.
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
