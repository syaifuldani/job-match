# PRD — AI Job Matcher

**Version:** 1.0  
**Status:** MVP / Ready for Development  
**Platform:** Web Application

## 1. Product Overview

AI Job Matcher adalah aplikasi web sederhana yang membantu pengguna menemukan lowongan pekerjaan yang paling sesuai berdasarkan CV yang di-upload.

Flow utama:

**Upload CV → Baca CV → Extract Skills → Cari Job → Matching → Match Score → Apply**

**Value Proposition:**  
> Upload your CV and discover jobs that match your skills.

---

## 2. Problem Statement

Pencari kerja sering harus membuka banyak website lowongan dan memeriksa requirement satu per satu.

Masalah utama:
- Banyak lowongan yang tidak relevan.
- Pengguna kesulitan mengetahui posisi yang cocok dengan skill mereka.
- Requirement pekerjaan dapat menggunakan istilah berbeda dari CV.
- Pencarian keyword biasa menghasilkan terlalu banyak hasil.

AI Job Matcher menyederhanakan proses dengan melakukan matching antara CV dan lowongan secara otomatis.

---

## 3. Product Goals

### Primary Goal
Membantu pengguna menemukan lowongan yang paling relevan berdasarkan CV.

### Secondary Goals
- Mengurangi waktu pencarian lowongan.
- Menampilkan ranking berdasarkan kecocokan.
- Menjelaskan skill yang cocok dan skill yang belum terpenuhi.
- Memberikan rekomendasi posisi yang relevan.

---

## 4. Target User

- Fresh graduate.
- Mahasiswa tingkat akhir.
- Junior developer.
- Job seeker.
- Career switcher.
- Internship seeker.

---

# 5. MVP Scope

| Fitur | Prioritas |
|---|---|
| Upload CV | P0 |
| CV Text Extraction | P0 |
| CV Skill Extraction | P0 |
| Job Dataset JSON | P0 |
| Job Search | P0 |
| Job Matching | P0 |
| Match Score | P0 |
| Job Detail + Apply Link | P0 |

### Tidak Dibutuhkan untuk MVP

- Login / Register.
- Database.
- Admin dashboard.
- Saved jobs.
- Application tracker.
- Multiple CV.
- Notification.
- Payment.
- AI Career Assistant.

---

# 6. User Flow

```text
Landing Page
     ↓
Upload CV
     ↓
CV Text Extraction
     ↓
CV Analysis
     ↓
Extract Skills
     ↓
Load Job Dataset
     ↓
Job Matching
     ↓
Calculate Match Score
     ↓
Sort Jobs
     ↓
Job Recommendation
     ↓
Job Detail
     ↓
Apply
```

---

# 7. Functional Requirements

## FR-01 — Upload CV

User dapat meng-upload CV dalam format:
- PDF
- DOCX

Validasi:
- Maximum 5 MB.
- Format harus didukung.
- File tidak boleh kosong.

---

## FR-02 — CV Text Extraction

Sistem mengambil teks dari CV.

Contoh:

```text
Syaiful Rochmandani

Education:
S1 Informatika

Skills:
Laravel
PHP
MySQL
JavaScript
React Native
Python
Git

Experience:
Intern – BKPSDM
```

Output berupa raw CV text.

---

## FR-03 — CV Skill Extraction

Sistem mengidentifikasi skill dari CV.

Contoh:

```json
{
  "skills": [
    "Laravel",
    "PHP",
    "MySQL",
    "JavaScript",
    "React Native",
    "Python",
    "Git"
  ]
}
```

Untuk MVP, gunakan pendekatan sederhana:
- Keyword matching.
- Skill dictionary.
- Pattern matching.

AI/LLM dapat ditambahkan kemudian.

---

## FR-04 — Candidate Profile

Sistem membuat profil kandidat sederhana.

Contoh:

```json
{
  "skills": [
    "Laravel",
    "PHP",
    "MySQL",
    "JavaScript",
    "Git"
  ],
  "education": "Informatics",
  "experience_level": "Entry Level",
  "recommended_roles": [
    "Backend Developer",
    "Laravel Developer",
    "Web Developer"
  ]
}
```

---

# 8. Job Dataset

MVP **tidak menggunakan database**.

Data lowongan disimpan dalam:

```text
jobs.json
```

Contoh:

```json
[
  {
    "id": 1,
    "title": "Junior Laravel Developer",
    "company": "ABC Technology",
    "location": "Surabaya",
    "type": "Full Time",
    "skills": [
      "PHP",
      "Laravel",
      "MySQL",
      "Git",
      "REST API"
    ],
    "description": "Develop and maintain web applications using Laravel.",
    "url": "https://example.com/job/1"
  }
]
```

Untuk development awal, dataset dapat dibuat manual sekitar **50–200 lowongan**.

Setelah MVP stabil, `jobs.json` dapat diganti dengan API atau sumber job eksternal yang legal dan sesuai Terms of Service.

---

# 9. Job Search

User dapat mencari berdasarkan:
- Job title.
- Company.
- Skills.
- Description.

Contoh:

```text
Search jobs...

Laravel Developer
```

Hasil dapat berupa:

```text
Laravel Developer
Junior Laravel Developer
PHP Developer
Backend Developer
```

---

# 10. Job Matching

Fitur utama aplikasi adalah membandingkan:

```text
CV Skills
     ↓
     VS
Job Skills
```

Contoh CV:

```text
PHP
Laravel
MySQL
Git
REST API
```

Requirement:

```text
PHP
Laravel
MySQL
Git
REST API
Docker
```

Maka:

```text
5 dari 6 skill cocok
```

Match Score:

```text
5 / 6 × 100 = 83.3%
```

---

# 11. Match Score

Formula MVP:

```text
Skill Match Score =
Matched Skills / Required Skills × 100
```

Contoh:

```text
Required Skills:
Laravel
PHP
MySQL
Git
REST API

Candidate Skills:
Laravel
PHP
MySQL
Git

Score = 4 / 5 × 100
      = 80%
```

### Score Classification

| Score | Label |
|---|---|
| 90–100% | Excellent Match |
| 75–89% | Strong Match |
| 60–74% | Good Match |
| 40–59% | Partial Match |
| < 40% | Low Match |

---

# 12. Match Explanation

Setiap hasil harus memberikan alasan sederhana.

Contoh:

```text
Junior Laravel Developer

80% Match

Matched Skills
✓ Laravel
✓ PHP
✓ MySQL
✓ Git

Missing Skills
○ REST API
○ Docker
```

Tujuannya agar pengguna memahami mengapa pekerjaan tersebut direkomendasikan.

---

# 13. Job Recommendation

Lowongan diurutkan berdasarkan Match Score.

Contoh:

```text
Recommended Jobs

1. Junior Laravel Developer
   94% Match

2. Backend Developer
   88% Match

3. PHP Developer
   84% Match

4. Full Stack Developer
   76% Match

5. Frontend Developer
   42% Match
```

---

# 14. Job Card

```text
┌────────────────────────────────────┐
│ Junior Laravel Developer           │
│ ABC Technology                     │
│                                    │
│ 📍 Surabaya                        │
│ 💼 Full Time                       │
│                                    │
│ ⭐ 94% Match                       │
│                                    │
│ ✓ Laravel                          │
│ ✓ PHP                              │
│ ✓ MySQL                            │
│ ✓ Git                              │
│                                    │
│ [View Job]                         │
└────────────────────────────────────┘
```

---

# 15. Job Detail

Menampilkan:
- Job title.
- Company.
- Location.
- Employment type.
- Description.
- Requirements.
- Match score.
- Matched skills.
- Missing skills.
- Apply button.

Contoh:

```text
Junior Laravel Developer

ABC Technology

Surabaya
Full Time

94% Match

Matched Skills
✓ Laravel
✓ PHP
✓ MySQL
✓ Git
✓ REST API

Missing Skills
○ Docker

[ Apply Now ]
```

Tombol **Apply Now** mengarahkan pengguna ke URL sumber lowongan.

---

# 16. Search & Filter

MVP dapat memiliki:

### Search
```text
Laravel Developer
```

### Location
```text
All
Remote
Jakarta
Surabaya
Bandung
Yogyakarta
```

### Employment Type
```text
All
Full Time
Part Time
Internship
Contract
```

---

# 17. Technical Architecture

Aplikasi dibuat sesederhana mungkin dan **tanpa database**.

```text
                    USER
                      │
                      ▼
              ┌───────────────┐
              │    Next.js    │
              │   Frontend    │
              └───────┬───────┘
                      │
                      │ HTTP API
                      ▼
              ┌───────────────┐
              │    FastAPI    │
              │    Backend    │
              └───────┬───────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
     CV Parser    Job Data    Matcher
                     │
                     ▼
                  jobs.json
```

---

# 18. Recommended Tech Stack

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
```

Optional:

```text
shadcn/ui
```

## Backend

```text
Python
FastAPI
```

## CV Processing

PDF:

```text
PyMuPDF
```

DOCX:

```text
python-docx
```

## Matching

MVP:

```text
Python
Keyword Matching
```

Tahap berikutnya:

```text
Sentence Transformers
Embeddings
Cosine Similarity
```

## Storage

Tidak menggunakan database.

```text
jobs.json
```

CV diproses sementara dan tidak perlu disimpan permanen pada MVP.

---

# 19. Project Structure

```text
ai-job-matcher/
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── jobs/
│   │   └── upload/
│   │
│   ├── components/
│   │   ├── JobCard.tsx
│   │   ├── UploadCV.tsx
│   │   ├── MatchScore.tsx
│   │   └── JobFilter.tsx
│   │
│   └── ...
│
├── backend/
│   ├── main.py
│   ├── cv_parser.py
│   ├── skill_extractor.py
│   ├── matcher.py
│   ├── job_search.py
│   ├── models.py
│   └── jobs.json
│
├── uploads/
│
└── README.md
```

---

# 20. Backend API

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | `/api/cv/analyze` | Upload dan analisis CV |
| GET | `/api/jobs` | Mendapatkan daftar job |
| GET | `/api/jobs/{id}` | Detail job |
| POST | `/api/jobs/match` | Matching CV dengan job |
| GET | `/api/recommendations` | Mendapatkan rekomendasi job |

---

# 21. API Example

## Analyze CV

```http
POST /api/cv/analyze
Content-Type: multipart/form-data
```

Response:

```json
{
  "skills": [
    "Laravel",
    "PHP",
    "MySQL",
    "Git"
  ],
  "experience_level": "Entry Level",
  "recommended_roles": [
    "Laravel Developer",
    "Backend Developer"
  ]
}
```

## Job Matching

Request:

```json
{
  "skills": [
    "Laravel",
    "PHP",
    "MySQL",
    "Git"
  ]
}
```

Response:

```json
{
  "jobs": [
    {
      "id": 1,
      "title": "Junior Laravel Developer",
      "match_score": 94,
      "matched_skills": [
        "Laravel",
        "PHP",
        "MySQL",
        "Git"
      ],
      "missing_skills": [
        "Docker"
      ]
    }
  ]
}
```

---

# 22. UI Pages

MVP hanya membutuhkan beberapa halaman:

```text
/
```
Landing page dan upload CV.

```text
/upload
```
Upload dan analisis CV.

```text
/jobs
```
Daftar rekomendasi dan pencarian.

```text
/jobs/:id
```
Detail pekerjaan dan match analysis.

---

# 23. CV Analysis UI

```text
Your CV Analysis

Experience Level
Entry Level

Skills

[Laravel]
[PHP]
[MySQL]
[JavaScript]
[Git]

Recommended Roles

Backend Developer
Laravel Developer
Web Developer

[Find Matching Jobs]
```

---

# 24. Error Handling

### File terlalu besar

```text
Your CV is too large.
Maximum file size is 5 MB.
```

### Format tidak didukung

```text
Unsupported file format.
Please upload PDF or DOCX.
```

### CV tidak dapat dibaca

```text
We couldn't extract text from this CV.
Please upload another file.
```

### Tidak menemukan skill

```text
We couldn't identify enough skills from your CV.
Please make sure your CV contains a skills section.
```

### Tidak ada job cocok

```text
No strong matches found.

Try searching with another role or keyword.
```

---

# 25. Security & Privacy

Karena aplikasi memproses CV:

- Jangan menyimpan CV secara permanen pada MVP.
- Hapus file sementara setelah proses selesai.
- Jangan menampilkan CV pengguna ke pengguna lain.
- Validasi tipe dan ukuran file.
- Jangan menyimpan data pribadi CV ke log.
- Gunakan HTTPS ketika production.
- Jangan mengirim CV ke layanan AI eksternal tanpa persetujuan pengguna.

---

# 26. Performance Requirements

Target MVP:

- Upload CV: < 5 detik untuk file normal.
- CV extraction: < 5 detik.
- Job matching: < 2 detik untuk dataset kecil.
- Job search: < 1 detik.
- Responsive pada desktop dan mobile.

---

# 27. Initial Job Dataset

Untuk development awal:

```text
50–200 jobs
```

Kategori contoh:

```text
Backend Developer
Frontend Developer
Full Stack Developer
Mobile Developer
Data Analyst
Data Scientist
UI/UX Designer
QA Engineer
DevOps Engineer
Software Engineer
```

---

# 28. Matching Improvement Roadmap

## Level 1 — Keyword Matching

```text
CV Skill
   ↓
Compare Job Skill
   ↓
Match Score
```

Ini adalah metode MVP.

## Level 2 — Skill Normalization

Sistem memahami:

```text
JS → JavaScript
TS → TypeScript
Postgres → PostgreSQL
ReactJS → React
```

## Level 3 — Semantic Matching

```text
CV
 ↓
Embedding
 ↓
Vector

Job
 ↓
Embedding
 ↓
Vector

Vector Similarity
 ↓
Semantic Score
```

Kemudian semantic score digabungkan dengan skill score.

---

# 29. Acceptance Criteria

MVP dianggap berhasil jika:

- [ ] User dapat membuka aplikasi.
- [ ] User dapat upload PDF/DOCX.
- [ ] Sistem dapat membaca teks CV.
- [ ] Sistem dapat mengambil skill dari CV.
- [ ] Sistem dapat menampilkan Candidate Profile.
- [ ] Sistem dapat membaca `jobs.json`.
- [ ] User dapat mencari job.
- [ ] Sistem dapat menghitung Match Score.
- [ ] Sistem dapat menampilkan matched skills.
- [ ] Sistem dapat menampilkan missing skills.
- [ ] Job dapat diurutkan berdasarkan score.
- [ ] User dapat membuka detail job.
- [ ] User dapat mengakses link Apply.

---

# 30. Development Roadmap

## Phase 1 — Setup

```text
Next.js
+
FastAPI
```

Target:
- Frontend berjalan.
- Frontend dapat memanggil backend.

## Phase 2 — CV Upload

Implement:
- PDF upload.
- DOCX upload.
- File validation.
- Text extraction.

## Phase 3 — CV Analysis

Implement:
- Skill extraction.
- Experience extraction.
- Education extraction.
- Recommended roles.

## Phase 4 — Job Dataset

Buat:

```text
jobs.json
```

Target:

```text
50–200 jobs
```

## Phase 5 — Job Search

Implement:
- Search.
- Location filter.
- Employment filter.

## Phase 6 — Matching

Implement:
- Skill comparison.
- Match Score.
- Matched skills.
- Missing skills.

## Phase 7 — Recommendation

Implement:
- Sort by Match Score.
- Recommended Jobs.

## Phase 8 — UI Polish

Tambahkan:
- Responsive design.
- Loading state.
- Empty state.
- Error state.
- Progress indicator.
- Clean job cards.
- Match score visualization.

---

# 31. Future Features

### V1.1
- Semantic matching.
- Skill normalization.
- Better job filtering.

### V1.2
- Save job.
- Multiple CV.
- Application tracker.

### V2
- AI Career Assistant.
- CV improvement.
- Skill gap analysis.
- Personalized career recommendation.

### V3
- Mobile app dengan Expo / React Native.
- Job alert.
- External job APIs.
- Personalized job feed.

---

# 32. Product Vision

AI Job Matcher bukan sekadar job board.

Visi jangka panjang:

```text
             CV
              ↓
       Candidate Profile
              ↓
       Skill Understanding
              ↓
       Job Recommendation
              ↓
        Match Analysis
              ↓
          Skill Gap
              ↓
       Career Recommendation
```

Namun MVP tetap fokus:

> **Upload CV → Find Matching Jobs → Understand Why They Match → Apply**

---

# 33. Final MVP Architecture

```text
┌─────────────────────────────┐
│           USER              │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          Next.js            │
│                             │
│  Upload CV                  │
│  Search Jobs                │
│  Job Cards                  │
│  Job Detail                 │
└──────────────┬──────────────┘
               │
               │ REST API
               ▼
┌─────────────────────────────┐
│           FastAPI           │
│                             │
│  CV Parser                  │
│  Skill Extractor            │
│  Job Search                 │
│  Matching Engine            │
└──────────────┬──────────────┘
               │
          ┌────┴─────┐
          ▼          ▼
     CV Parser   jobs.json
          │          │
          └────┬─────┘
               ▼
         Matching Engine
               │
               ▼
          Match Score
               │
               ▼
         Job Ranking
```

---

# 34. Prinsip Development

1. **Tidak menggunakan database pada MVP.**
2. Tidak membuat authentication terlebih dahulu.
3. Tidak membuat admin panel.
4. Tidak langsung menggunakan LLM.
5. Mulai dari keyword matching.
6. Setelah MVP berjalan, tambahkan semantic matching.
7. Fokus pada kualitas Match Score dan UX.
8. Gunakan dataset kecil terlebih dahulu.
9. Pisahkan CV parser, job search, dan matching engine.
10. Jangan membangun fitur yang belum memberikan nilai langsung kepada user.

---

# 35. Kesimpulan

Versi MVP dibuat sederhana:

```text
Next.js
   +
FastAPI
   +
jobs.json
   +
CV Parser
   +
Matching Engine
```

**Tanpa database, tanpa login, tanpa admin panel, dan tanpa fitur kompleks.**

Fokus produk:

```text
CV
 ↓
Extract Skills
 ↓
Compare Jobs
 ↓
Match Score
 ↓
Recommended Jobs
 ↓
Apply
```

Project ini sudah cukup untuk menjadi portfolio **AI/NLP + Full Stack** dengan scope yang jelas dan mudah dikembangkan.
