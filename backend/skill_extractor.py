import re
from typing import List, Tuple
from models import CandidateProfile

# Comprehensive multi-discipline skills dictionary
SKILL_DICTIONARY = [
    # ── Teknologi & IT ──
    "PHP", "JavaScript", "TypeScript", "Python", "Go", "Golang", "Java", "Kotlin", "Swift", 
    "Dart", "Rust", "C++", "C#", "Ruby", "HTML", "CSS", "SQL", "Bash", "R",
    "Laravel", "CodeIgniter", "Symfony", "React", "React Native", "Next.js", "Vue.js", "Nuxt.js", 
    "Angular", "Svelte", "Node.js", "Express", "NestJS", "FastAPI", "Django", "Flask", 
    "Spring Boot", "Flutter", "SwiftUI", "Tailwind CSS", "Bootstrap", "Redux", "Zustand",
    "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "MariaDB", "Oracle", "Elasticsearch",
    "Git", "GitHub", "GitLab", "Docker", "Kubernetes", "Linux", "AWS", "GCP", "Azure", 
    "CI/CD", "Nginx", "Apache", "Terraform", "Prometheus", "Grafana",
    "Pandas", "NumPy", "Scikit-Learn", "TensorFlow", "PyTorch", "Tableau", "PowerBI", 
    "Machine Learning", "Data Analysis", "NLP", "Computer Vision", "Excel",
    "Cypress", "Jest", "Selenium", "Playwright", "Postman", "API Testing", "Manual Testing", "Jira",
    "REST API", "GraphQL", "gRPC", "Microservices", "OOP", "MVC", "Agile", "Scrum",

    # ── Manajemen & Bisnis ──
    "Project Management", "Product Management", "Leadership", "Team Management",
    "Strategic Planning", "Business Development", "Operations Management",
    "Risk Management", "Stakeholder Management", "Budgeting", "Supply Chain",
    "KPI", "Business Analysis", "Process Improvement", "Negotiation", "Problem Solving",
    "Decision Making", "Cross-functional Leadership", "Management",

    # ── Marketing & Penjualan ──
    "Digital Marketing", "SEO", "SEM", "Social Media Marketing", "Content Creation",
    "Copywriting", "Branding", "Public Relations", "CRM", "Sales", "Lead Generation",
    "Market Research", "B2B", "B2C", "Email Marketing", "Google Analytics",
    "Campaign Management", "Advertising", "Direct Sales", "Account Management",

    # ── Keuangan & Akuntansi ──
    "Accounting", "Financial Analysis", "Auditing", "Tax", "Perpajakan",
    "Financial Reporting", "Cash Flow", "QuickBooks", "SAP",
    "Bookkeeping", "Payroll", "Brevet", "Cost Control", "Financial Modeling",
    "General Ledger", "Invoicing", "IFRS", "PSAK",

    # ── HR & Personalia ──
    "Recruitment", "Talent Acquisition", "Employee Relations", "HR Operations",
    "Performance Management", "Onboarding", "Training & Development",
    "UU Ketenagakerjaan", "HRIS", "Compensation & Benefits", "Organization Development",

    # ── Administrasi & Office ──
    "Administrasi", "Data Entry", "Microsoft Office", "Microsoft Excel",
    "Microsoft Word", "Google Workspace", "Customer Service", "Scheduling",
    "Korespondensi", "Filing", "Inventory Control", "Communication Skills",
    "Time Management",

    # ── Desain & Kreatif ──
    "Figma", "UI/UX Design", "Graphic Design", "Adobe Photoshop", "Adobe Illustrator",
    "Premiere Pro", "Video Editing", "After Effects", "Canva", "Prototyping",
    "User Research", "Wireframing", "Motion Graphics", "Photography", "Adobe XD"
]

# Normalization map
ALIASES = {
    "js": "JavaScript",
    "ts": "TypeScript",
    "reactjs": "React",
    "react.js": "React",
    "vuejs": "Vue.js",
    "vue": "Vue.js",
    "nextjs": "Next.js",
    "next": "Next.js",
    "nuxtjs": "Nuxt.js",
    "nodejs": "Node.js",
    "node": "Node.js",
    "postgres": "PostgreSQL",
    "tailwind": "Tailwind CSS",
    "tailwindcss": "Tailwind CSS",
    "golang": "Go",
    "react native": "React Native",
    "restful": "REST API",
    "rest api": "REST API",
    "rest": "REST API",
    "k8s": "Kubernetes",
    "ml": "Machine Learning",
    # Multi-discipline aliases
    "pajak": "Tax",
    "perpajakan": "Tax",
    "akuntansi": "Accounting",
    "pembukuan": "Bookkeeping",
    "rekrutmen": "Recruitment",
    "administrasi": "Administrasi",
    "ms office": "Microsoft Office",
    "office": "Microsoft Office",
    "ms excel": "Microsoft Excel",
    "excel": "Excel",
    "photoshop": "Adobe Photoshop",
    "illustrator": "Adobe Illustrator",
    "premiere": "Premiere Pro",
    "desain grafis": "Graphic Design",
    "pemasaran": "Digital Marketing",
    "penjualan": "Sales",
    "sdm": "HR Operations",
    "manajemen proyek": "Project Management",
    "manajemen": "Management",
    "desain": "UI/UX Design"
}

def extract_skills(text: str) -> List[str]:
    """
    Extract technical and non-technical skills found inside raw CV text using word boundary matching.
    """
    found_skills = set()
    text_lower = text.lower()

    for skill in SKILL_DICTIONARY:
        s_lower = skill.lower()
        # Escape for regex
        pattern = r'(?<![a-zA-Z0-9_\-\.])' + re.escape(s_lower) + r'(?![a-zA-Z0-9_\-\.])'
        if re.search(pattern, text_lower):
            found_skills.add(skill)

    # Check aliases
    for alias, standard in ALIASES.items():
        pattern = r'(?<![a-zA-Z0-9_\-\.])' + re.escape(alias) + r'(?![a-zA-Z0-9_\-\.])'
        if re.search(pattern, text_lower):
            found_skills.add(standard)

    return sorted(list(found_skills))

def extract_education(text: str) -> str:
    """
    Detect candidate education level and major across all disciplines.
    """
    text_lower = text.lower()
    
    degree = ""
    if re.search(r'\b(s2|magister|master)\b', text_lower):
        degree = "S2 / Master's Degree"
    elif re.search(r'\b(s1|sarjana|bachelor)\b', text_lower):
        degree = "S1 / Bachelor's Degree"
    elif re.search(r'\b(d3|diploma|associate)\b', text_lower):
        degree = "D3 / Diploma"

    major = ""
    if "informatika" in text_lower or "computer science" in text_lower:
        major = "Informatika"
    elif "sistem informasi" in text_lower or "information system" in text_lower:
        major = "Sistem Informasi"
    elif "teknik komputer" in text_lower:
        major = "Teknik Komputer"
    elif "statistika" in text_lower or "matematika" in text_lower:
        major = "Statistika / Data"
    elif "teknik elektro" in text_lower:
        major = "Teknik Elektro"
    elif "manajemen" in text_lower or "management" in text_lower:
        major = "Manajemen Bisnis"
    elif "akuntansi" in text_lower or "accounting" in text_lower or "pajak" in text_lower:
        major = "Akuntansi & Keuangan"
    elif "komunikasi" in text_lower or "communication" in text_lower or "marketing" in text_lower or "pemasaran" in text_lower:
        major = "Ilmu Komunikasi & Marketing"
    elif "psikologi" in text_lower or "psychology" in text_lower:
        major = "Psikologi / SDM"
    elif "administrasi" in text_lower or "administration" in text_lower:
        major = "Administrasi"
    elif "dkv" in text_lower or "desain komunikasi visual" in text_lower or "desain grafis" in text_lower:
        major = "Desain Komunikasi Visual (DKV)"
    elif "ekonomi" in text_lower or "economics" in text_lower:
        major = "Ilmu Ekonomi"
    elif "hukum" in text_lower or "law" in text_lower:
        major = "Ilmu Hukum"

    if degree and major:
        return f"{degree} - {major}"
    elif degree:
        return degree
    elif major:
        return f"Degree in {major}"
    return "Higher Education / Degree"

def extract_experience_level(text: str) -> str:
    """
    Deduce experience level from job history or keywords.
    """
    text_lower = text.lower()
    
    if re.search(r'\b(senior|lead|principal|architect|manager|head of|director|5\+ years|6\+ years|7\+ years)\b', text_lower):
        return "Senior Level"
    if re.search(r'\b(mid|intermediate|specialist|officer|supervisor|2 years|3 years|4 years|2\+ years|3\+ years)\b', text_lower):
        return "Mid Level"
    if re.search(r'\b(intern|internship|magang)\b', text_lower) and not ("senior" in text_lower):
        return "Internship / Entry Level"
    if re.search(r'\b(fresh graduate|junior|entry level|entry-level|fresh grad)\b', text_lower):
        return "Entry Level"
        
    return "Entry Level"

def recommend_roles(skills: List[str]) -> List[str]:
    """
    Suggest relevant job roles based on extracted skills across all disciplines.
    """
    roles = set()
    s_set = set(s.lower() for s in skills)

    # Tech roles
    if any(s in s_set for s in ["laravel", "php", "django", "fastapi", "spring boot", "go", "golang", "node.js"]):
        roles.add("Backend Developer")
    if any(s in s_set for s in ["react", "next.js", "vue.js", "nuxt.js", "tailwind css", "html", "css"]):
        roles.add("Frontend Developer")
    if any(s in s_set for s in ["react native", "flutter", "kotlin", "swift", "dart"]):
        roles.add("Mobile Developer")
    if any(s in s_set for s in ["python", "pandas", "sql", "tableau", "powerbi", "machine learning"]):
        roles.add("Data Analyst")
    if any(s in s_set for s in ["docker", "kubernetes", "linux", "aws", "ci/cd"]):
        roles.add("DevOps Engineer")
    if any(s in s_set for s in ["cypress", "jest", "selenium", "manual testing", "postman"]):
        roles.add("QA Engineer")

    # Management & Business roles
    if any(s in s_set for s in ["project management", "scrum", "agile", "jira", "leadership", "risk management", "budgeting"]):
        roles.add("Project Manager / Scrum Master")
    if any(s in s_set for s in ["business development", "strategic planning", "operations management", "kpi", "business analysis"]):
        roles.add("Business Development Manager")

    # Marketing & Sales roles
    if any(s in s_set for s in ["digital marketing", "seo", "sem", "social media marketing", "google analytics", "branding"]):
        roles.add("Digital Marketing Specialist")
    if any(s in s_set for s in ["sales", "crm", "lead generation", "direct sales", "account management"]):
        roles.add("Account Executive / Sales Specialist")

    # Finance & Accounting roles
    if any(s in s_set for s in ["accounting", "tax", "perpajakan", "brevet", "general ledger", "financial reporting", "auditing"]):
        roles.add("Staff Akuntansi & Pajak")
    if any(s in s_set for s in ["financial analysis", "financial modeling", "cash flow", "cost control"]):
        roles.add("Financial Analyst")

    # HR & Personalia roles
    if any(s in s_set for s in ["recruitment", "talent acquisition", "hr operations", "onboarding", "hris", "uu ketenagakerjaan"]):
        roles.add("HR & Talent Acquisition Specialist")

    # Administration roles
    if any(s in s_set for s in ["administrasi", "data entry", "microsoft office", "microsoft excel", "scheduling", "filing"]):
        roles.add("Staff Administrasi & Operasional")

    # Design roles
    if any(s in s_set for s in ["figma", "ui/ux design", "prototyping", "user research", "wireframing"]):
        roles.add("UI/UX Designer")
    if any(s in s_set for s in ["graphic design", "adobe photoshop", "adobe illustrator", "canva", "motion graphics"]):
        roles.add("Graphic Designer")

    if ("Backend Developer" in roles and "Frontend Developer" in roles) or ("Full Stack" in s_set):
        roles.add("Full Stack Developer")

    if not roles:
        roles.add("Profesional Karir")

    return sorted(list(roles))[:3]

def extract_candidate_profile(filename: str, text: str) -> CandidateProfile:
    """
    Build structured candidate profile from real CV text.
    """
    skills = extract_skills(text)
    education = extract_education(text)
    experience_level = extract_experience_level(text)
    recommended = recommend_roles(skills)

    # Per Section 24 PRD: If insufficient skills found
    if len(skills) == 0:
        # We still return profile but with empty skills to let user know
        pass

    return CandidateProfile(
        skills=skills,
        education=education,
        experience_level=experience_level,
        recommended_roles=recommended,
        raw_text=text[:500] + "..." if len(text) > 500 else text,
        file_name=filename
    )
