from typing import List, Optional
from pydantic import BaseModel

class Job(BaseModel):
    id: int
    title: str
    company: str
    location: str
    type: str
    skills: List[str]
    description: str
    requirements: Optional[List[str]] = []
    salary: Optional[str] = None
    experience_level: Optional[str] = None
    posted_at: Optional[str] = None
    url: str

class CandidateProfile(BaseModel):
    skills: List[str]
    education: Optional[str] = None
    experience_level: str
    recommended_roles: List[str]
    raw_text: Optional[str] = None
    file_name: Optional[str] = None

class MatchRequest(BaseModel):
    skills: List[str]

class JobMatchResponse(BaseModel):
    id: int
    title: str
    company: str
    location: str
    type: str
    skills: List[str]
    description: str
    requirements: Optional[List[str]] = []
    salary: Optional[str] = None
    url: str
    match_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    classification: str
