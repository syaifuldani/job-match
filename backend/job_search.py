import urllib.request
import json
import re
import html
import time
from typing import List, Optional
from models import Job
from skill_extractor import extract_skills

JOBS_CACHE: List[Job] = []
LAST_FETCH_TIME: float = 0
CACHE_TTL: float = 600  # 10 minutes cache

def fetch_jobs_from_external_apis() -> List[Job]:
    """
    Fetch real live jobs from external Job APIs (Jobicy, Remotive) without using dummy jobs.json.
    Extracts real technical requirements directly from the live job listings.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    live_jobs: List[Job] = []
    current_id = 1

    # Source 1: Jobicy Remote Tech & Dev Jobs API
    try:
        req = urllib.request.Request(
            "https://jobicy.com/api/v2/remote-jobs?count=50",
            headers=headers
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            for item in data.get("jobs", []):
                title = item.get("jobTitle", "").strip()
                company = item.get("companyName", "").strip()
                if not title or not company:
                    continue

                raw_desc = html.unescape(re.sub(r"<[^>]+>", " ", item.get("jobDescription", "")))
                desc = " ".join(raw_desc.split())
                location = item.get("jobGeo", "Remote").strip() or "Remote"
                url = item.get("url", "")
                
                # Determine employment type
                job_types = item.get("jobType", ["Full-Time"])
                job_type = "Full Time"
                if isinstance(job_types, list) and job_types:
                    t = str(job_types[0]).lower()
                    if "part" in t: job_type = "Part Time"
                    elif "intern" in t: job_type = "Internship"
                    elif "contract" in t: job_type = "Contract"

                # Extract REAL skills required by this specific live job
                skills = extract_skills(f"{title} {desc}")
                if not skills:
                    # In case text is short, infer from title and industry
                    industry = item.get("jobIndustry", [])
                    skills = ["Remote"] + ([str(i) for i in industry[:2]] if isinstance(industry, list) else [])

                salary = None
                sal_min = item.get("annualSalaryMin")
                sal_max = item.get("annualSalaryMax")
                if sal_min and sal_max:
                    salary = f"${sal_min:,} - ${sal_max:,} / year"

                live_jobs.append(Job(
                    id=current_id,
                    title=title,
                    company=company,
                    location=location,
                    type=job_type,
                    skills=skills,
                    description=desc[:600] + "..." if len(desc) > 600 else desc,
                    requirements=[f"Experience with {s}" for s in skills[:5]] if skills else ["Relevant experience in the field"],
                    salary=salary,
                    experience_level=item.get("jobLevel", "Not Specified"),
                    posted_at=str(item.get("pubDate", "Recently"))[:10],
                    url=url
                ))
                current_id += 1
    except Exception as e:
        print(f"[API] Warning fetching from Jobicy: {e}")

    # Source 2: Remotive Software Development Jobs API
    try:
        req = urllib.request.Request(
            "https://remotive.com/api/remote-jobs?category=software-dev",
            headers=headers
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))
            for item in data.get("jobs", []):
                title = item.get("title", "").strip()
                company = item.get("company_name", "").strip()
                if not title or not company:
                    continue

                raw_desc = html.unescape(re.sub(r"<[^>]+>", " ", item.get("description", "")))
                desc = " ".join(raw_desc.split())
                location = item.get("candidate_required_location", "Remote").strip() or "Remote"
                url = item.get("url", "")

                job_type = "Full Time"
                if "contract" in str(item.get("job_type", "")).lower():
                    job_type = "Contract"

                tags = item.get("tags", [])
                tag_str = " ".join(tags) if isinstance(tags, list) else ""
                skills = extract_skills(f"{title} {desc} {tag_str}")
                if not skills and tags:
                    skills = [t.capitalize() for t in tags[:4]]

                live_jobs.append(Job(
                    id=current_id,
                    title=title,
                    company=company,
                    location=location,
                    type=job_type,
                    skills=skills if skills else ["Software Development", "Remote"],
                    description=desc[:600] + "..." if len(desc) > 600 else desc,
                    requirements=[f"Strong knowledge of {s}" for s in skills[:5]] if skills else ["Software development experience"],
                    salary=item.get("salary") or None,
                    experience_level="Mid Level",
                    posted_at=str(item.get("publication_date", "Recently"))[:10],
                    url=url
                ))
                current_id += 1
    except Exception as e:
        print(f"[API] Warning fetching from Remotive: {e}")

    return live_jobs

def load_jobs(force_refresh: bool = False) -> List[Job]:
    global JOBS_CACHE, LAST_FETCH_TIME
    now = time.time()

    # Use in-memory cache if valid
    if JOBS_CACHE and not force_refresh and (now - LAST_FETCH_TIME < CACHE_TTL):
        return JOBS_CACHE

    fetched = fetch_jobs_from_external_apis()
    if fetched:
        JOBS_CACHE = fetched
        LAST_FETCH_TIME = now
        print(f"[Job Search API] Loaded {len(JOBS_CACHE)} real live jobs from external APIs.")
        return JOBS_CACHE

    # If external APIs are temporarily unreachable, keep existing cache
    return JOBS_CACHE

def search_jobs(
    keyword: Optional[str] = None,
    location: Optional[str] = None,
    employment_type: Optional[str] = None
) -> List[Job]:
    jobs = load_jobs()
    results = []

    for job in jobs:
        if keyword:
            q = keyword.lower()
            match_title = q in job.title.lower()
            match_company = q in job.company.lower()
            match_desc = q in job.description.lower()
            match_skill = any(q in s.lower() for s in job.skills)
            if not (match_title or match_company or match_desc or match_skill):
                continue

        if location and location.lower() not in ["semua", "all"]:
            if location.lower() not in job.location.lower():
                continue

        if employment_type and employment_type.lower() not in ["semua", "all"]:
            if job.type.lower() != employment_type.lower():
                continue

        results.append(job)

    return results

def get_job_by_id(job_id: int) -> Optional[Job]:
    jobs = load_jobs()
    for job in jobs:
        if job.id == job_id:
            return job
    return None
