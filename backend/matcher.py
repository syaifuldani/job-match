from typing import List, Dict, Any
from models import Job, JobMatchResponse

NORMALIZATION_MAP = {
    "js": "javascript",
    "ts": "typescript",
    "reactjs": "react",
    "react.js": "react",
    "vuejs": "vue.js",
    "nextjs": "next.js",
    "nuxtjs": "nuxt.js",
    "nodejs": "node.js",
    "postgres": "postgresql",
    "tailwind": "tailwind css",
    "golang": "go",
    "restful": "rest api",
    "k8s": "kubernetes"
}

def normalize(skill: str) -> str:
    s = skill.strip().lower()
    return NORMALIZATION_MAP.get(s, s)

def classify_score(score: int) -> str:
    if score >= 90:
        return "Excellent Match"
    if score >= 75:
        return "Strong Match"
    if score >= 60:
        return "Good Match"
    if score >= 40:
        return "Partial Match"
    return "Low Match"

def match_job(job: Job, candidate_skills: List[str]) -> JobMatchResponse:
    if not job.skills or len(job.skills) == 0:
        return JobMatchResponse(
            **job.model_dump(),
            match_score=0,
            matched_skills=[],
            missing_skills=[],
            classification="Low Match"
        )

    cand_set = set(normalize(s) for s in candidate_skills)
    matched = []
    missing = []

    for j_skill in job.skills:
        if normalize(j_skill) in cand_set:
            matched.append(j_skill)
        else:
            missing.append(j_skill)

    if len(candidate_skills) > 0 and len(job.skills) > 0:
        score = round((len(matched) / len(job.skills)) * 100)
    else:
        score = 0

    classification = classify_score(score)

    return JobMatchResponse(
        id=job.id,
        title=job.title,
        company=job.company,
        location=job.location,
        type=job.type,
        skills=job.skills,
        description=job.description,
        requirements=job.requirements or [],
        salary=job.salary,
        url=job.url,
        match_score=score,
        matched_skills=matched,
        missing_skills=missing,
        classification=classification
    )

def rank_jobs(jobs: List[Job], candidate_skills: List[str]) -> List[JobMatchResponse]:
    matches = [match_job(j, candidate_skills) for j in jobs]
    return sorted(matches, key=lambda x: (x.match_score, len(x.matched_skills)), reverse=True)
