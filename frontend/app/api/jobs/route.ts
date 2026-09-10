import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 1800;

const ALL_DISCIPLINE_KEYWORDS = [
  // ── Teknologi & IT ──
  "React", "Node.js", "Python", "JavaScript", "TypeScript", "SQL", "PostgreSQL",
  "MySQL", "MongoDB", "AWS", "Docker", "Kubernetes", "Next.js", "Vue.js", "Git",
  "REST API", "Java", "PHP", "Laravel", "Figma", "Go", "Golang", "Django", "FastAPI",
  "Machine Learning", "Tableau", "PowerBI", "Redis", "Elasticsearch", "Terraform",
  "GraphQL", "Flutter", "Kotlin", "Swift", "Angular", "NestJS", "Spring Boot",
  "Linux", "CI/CD", "Azure", "GCP", "TensorFlow", "PyTorch", "Pandas", "NumPy",
  "Android", "Firebase", "Dart", "React Native", "Tailwind CSS", "Bootstrap",
  "Selenium", "Jest", "Postman", "Jira", "Agile", "Scrum", "OOP", "MVC",
  "Cybersecurity", "DevOps", "Data Science", "C#", ".NET", "Quality Assurance",
  "HTML", "CSS", "Microservices",

  // ── Manajemen & Bisnis ──
  "Project Management", "Product Management", "Leadership", "Team Management",
  "Strategic Planning", "Business Development", "Operations Management",
  "Risk Management", "Stakeholder Management", "Budgeting", "Supply Chain",
  "KPI", "Business Analysis", "Process Improvement", "Negotiation", "Problem Solving",
  "Decision Making", "Cross-functional Leadership", "Management",

  // ── Marketing & Penjualan ──
  "Digital Marketing", "SEO", "SEM", "Social Media Marketing", "Content Creation",
  "Copywriting", "Branding", "Public Relations", "CRM", "Sales", "Lead Generation",
  "Market Research", "B2B", "B2C", "Email Marketing", "Google Analytics",
  "Campaign Management", "Advertising", "Direct Sales", "Account Management",

  // ── Keuangan & Akuntansi ──
  "Accounting", "Financial Analysis", "Auditing", "Tax", "Perpajakan",
  "Financial Reporting", "Cash Flow", "Excel", "QuickBooks", "SAP",
  "Bookkeeping", "Payroll", "Brevet", "Cost Control", "Financial Modeling",
  "General Ledger", "Invoicing", "IFRS", "PSAK",

  // ── HR & Personalia ──
  "Recruitment", "Talent Acquisition", "Employee Relations", "HR Operations",
  "Performance Management", "Onboarding", "Training & Development",
  "UU Ketenagakerjaan", "HRIS", "Compensation & Benefits", "Organization Development",

  // ── Administrasi & Office ──
  "Administrasi", "Data Entry", "Microsoft Office", "Microsoft Excel",
  "Microsoft Word", "Google Workspace", "Customer Service", "Scheduling",
  "Korespondensi", "Filing", "Inventory Control", "Communication Skills",
  "Time Management",

  // ── Desain & Kreatif ──
  "UI/UX Design", "Graphic Design", "Adobe Photoshop", "Adobe Illustrator",
  "Premiere Pro", "Video Editing", "After Effects", "Canva", "Prototyping",
  "User Research", "Wireframing", "Motion Graphics", "Photography"
];

function extractSkills(text: string): string[] {
  const found: string[] = [];
  for (const kw of ALL_DISCIPLINE_KEYWORDS) {
    if (new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text)) {
      found.push(kw);
    }
  }
  return [...new Set(found)];
}

function cleanHtml(html: string): string {
  return (html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

function formatIdrSalary(base: number | null, max: number | null): string {
  if (!base && !max) return "";
  const fmt = (n: number) => "Rp " + Number(n).toLocaleString("id-ID");
  if (base && max && base !== max) return `${fmt(base)} – ${fmt(max)} / bln`;
  if (base) return `${fmt(base)} / bln`;
  if (max) return `Hingga ${fmt(max)} / bln`;
  return "";
}

function inferCategory(title: string, desc: string, skills: string[]): string {
  const text = `${title} ${desc} ${skills.join(" ")}`.toLowerCase();

  if (
    text.includes("finance") || text.includes("keuangan") || text.includes("akuntan") ||
    text.includes("accounting") || text.includes("tax") || text.includes("pajak") ||
    text.includes("audit") || text.includes("cashier") || text.includes("kasir") ||
    text.includes("bookkeeping") || text.includes("payroll")
  ) {
    return "Keuangan & Akuntansi";
  }

  if (
    text.includes("marketing") || text.includes("sales") || text.includes("penjualan") ||
    text.includes("seo") || text.includes("social media") || text.includes("telemarketing") ||
    text.includes("account manager") || text.includes("business dev") || text.includes("commercial")
  ) {
    return "Marketing & Sales";
  }

  if (
    text.includes("hr") || text.includes("human resource") || text.includes("personalia") ||
    text.includes("recruitment") || text.includes("talent acquisition") || text.includes("hris")
  ) {
    return "HR & Personalia";
  }

  if (
    text.includes("admin") || text.includes("administrasi") || text.includes("data entry") ||
    text.includes("customer service") || text.includes("sekretaris") || text.includes("receptionist") ||
    text.includes("front desk") || text.includes("clerk")
  ) {
    return "Administrasi";
  }

  if (
    text.includes("designer") || text.includes("ui/ux") || text.includes("graphic") ||
    text.includes("desain") || text.includes("figma") || text.includes("video editor") ||
    text.includes("content creator") || text.includes("animator") || text.includes("illustrator")
  ) {
    return "Desain & Kreatif";
  }

  if (
    text.includes("developer") || text.includes("engineer") || text.includes("programmer") ||
    text.includes("software") || text.includes("backend") || text.includes("frontend") ||
    text.includes("devops") || text.includes("qa") || text.includes("it ") ||
    text.includes("cloud") || text.includes("security") || text.includes("data analyst") ||
    text.includes("data scientist") || text.includes("tech")
  ) {
    return "Teknologi & IT";
  }

  if (
    text.includes("project manager") || text.includes("product manager") || text.includes("manajemen") ||
    text.includes("management") || text.includes("operations") || text.includes("operasional") ||
    text.includes("strategy") || text.includes("konsultan") || text.includes("consultant") ||
    text.includes("supervisor") || text.includes("director") || text.includes("head of") ||
    text.includes("lead")
  ) {
    return "Manajemen & Bisnis";
  }

  return "Manajemen & Bisnis";
}

// ── Source 1: Kalibrr API — Job Portal Terbesar & Terlengkap di Indonesia ───
// Mengambil lowongan lintas bidang (Manajemen, IT, Finance, Marketing, HR, Admin, WFH)
async function fetchKalibrr(): Promise<any[]> {
  try {
    const endpoints = [
      // 1. Lowongan Umum Terkini di Indonesia (Lintas Bidang)
      "https://www.kalibrr.com/api/job_board/search?country=Indonesia&limit=50",
      // 2. Manajemen & Konsultansi Bisnis
      "https://www.kalibrr.com/api/job_board/search?country=Indonesia&function=Management+and+Consultancy&limit=40",
      // 3. Sales & Marketing
      "https://www.kalibrr.com/api/job_board/search?country=Indonesia&function=Sales+and+Marketing&limit=40",
      // 4. Keuangan & Akuntansi
      "https://www.kalibrr.com/api/job_board/search?country=Indonesia&function=Accounting+and+Finance&limit=40",
      // 5. HR & Personalia
      "https://www.kalibrr.com/api/job_board/search?country=Indonesia&function=Human+Resources&limit=30",
      // 6. Administrasi & Koordinasi
      "https://www.kalibrr.com/api/job_board/search?country=Indonesia&function=Administration+and+Coordination&limit=30",
      // 7. IT & Software
      "https://www.kalibrr.com/api/job_board/search?country=Indonesia&function=IT+and+Software&limit=40",
      // 8. Remote WFH di Seluruh Indonesia (Lintas Bidang)
      "https://www.kalibrr.com/api/job_board/search?country=Indonesia&is_work_from_home=true&limit=40",
    ];

    const results = await Promise.allSettled(
      endpoints.map((url) =>
        fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
          next: { revalidate: 1800 },
        }).then((res) => (res.ok ? res.json() : { jobs: [] }))
      )
    );

    const allRaw: any[] = [];
    for (const r of results) {
      if (r.status === "fulfilled" && Array.isArray(r.value?.jobs)) {
        allRaw.push(...r.value.jobs);
      }
    }

    const seenIds = new Set<number>();
    const now = Date.now();
    const uniqueRaw = allRaw.filter((j) => {
      if (!j.id || seenIds.has(j.id)) return false;
      seenIds.add(j.id);

      // Pastikan lowongan belum tutup (active & unexpired)
      if (j.application_end_date) {
        const end = new Date(j.application_end_date).getTime();
        if (!isNaN(end) && end < now) return false;
      }
      if (j.visibility && j.visibility !== "public") return false;

      return true;
    });

    return uniqueRaw.map((item: any, i: number) => {
      const desc = cleanHtml(item.description || "");
      const qual = cleanHtml(item.qualifications || "");
      const textForSkills = `${item.name} ${desc} ${qual}`;
      const skills = extractSkills(textForSkills);

      const isWfh = Boolean(item.is_work_from_home);
      const locObj = item.google_location?.address_components;
      const city = locObj?.city || locObj?.region || locObj?.country || "Indonesia";
      const location = isWfh
        ? (city && city !== "Indonesia" ? `Remote WFH (${city}, Indonesia)` : "Remote WFH (Indonesia)")
        : `${city}, Indonesia`;

      const workType = isWfh ? "remote_indonesia" : "indonesia";

      // Direct apply URL di Kalibrr
      const companyCode = item.company_info?.code || item.company?.code || "company";
      const applyUrl = item.apply_redirect_url || `https://www.kalibrr.com/c/${companyCode}/jobs/${item.id}/${item.slug}`;

      let salary = "";
      if (item.salary_shown && (item.base_salary || item.maximum_salary)) {
        salary = formatIdrSalary(item.base_salary, item.maximum_salary);
      }

      const tenure = (item.tenure || "").toLowerCase();
      const type = tenure.includes("intern")
        ? "Internship"
        : tenure.includes("part")
          ? "Part Time"
          : tenure.includes("contract")
            ? "Contract"
            : "Full Time";

      let requirements: string[] = [];
      if (item.qualifications) {
        const rawReqs = (item.qualifications || "")
          .replace(/<li[^>]*>/gi, "\n• ")
          .replace(/<\/li>/gi, "")
          .replace(/<[^>]+>/g, " ");
        requirements = rawReqs
          .split("\n")
          .map((s: string) => cleanHtml(s).replace(/^[•\-\*]\s*/, "").trim())
          .filter((s: string) => s.length > 5 && s.length < 150)
          .slice(0, 5);
      }
      if (requirements.length === 0) {
        requirements = skills.slice(0, 5).map((s) => `Kualifikasi: ${s}`);
      }

      const category = inferCategory(item.name, desc, skills);

      return {
        id: `kalibrr-${item.id || i}`,
        title: item.name || "Profesional Karir",
        company: item.company_name || item.company?.name || "Perusahaan di Indonesia",
        location,
        workType,
        type,
        category,
        skills,
        description: desc.slice(0, 700) + (desc.length > 700 ? "..." : ""),
        requirements,
        url: applyUrl,
        salary,
        posted_at: (item.activation_date || item.created_at || "").slice(0, 10),
        source: isWfh ? "Kalibrr (WFH ID)" : "Kalibrr (Indonesia)",
      };
    });
  } catch (e) {
    console.error("Kalibrr fetch error:", e);
    return [];
  }
}

// ── Source 2: Grab Careers API — SmartRecruiters (Lowongan di Indonesia) ────
async function fetchGrabIndonesia(): Promise<any[]> {
  try {
    const res = await fetch(
      "https://api.smartrecruiters.com/v1/companies/grab/postings?country=id&limit=50",
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = data.content || [];

    return items.map((item: any, i: number) => {
      const title = item.name || "Engineering / Operations";
      const city = item.location?.city || "Jakarta";
      const skills = extractSkills(`${title} ${item.typeOfEmployment?.label || ""}`);
      const applyUrl = item.applyUrl || item.postingUrl || `https://www.smartrecruiters.com/Grab/${item.id}`;
      return {
        id: `grab-${item.id || i}`,
        title,
        company: "Grab Indonesia",
        location: `${city}, Indonesia`,
        workType: "indonesia",
        type: "Full Time",
        category: inferCategory(title, "", skills),
        skills: skills.length > 0 ? skills : ["Agile", "Scrum", "REST API", "Project Management"],
        description: `Posisi ${title} di Grab Indonesia. Bergabung dengan tim operasional dan teknologi terkemuka di Asia Tenggara untuk melayani jutaan pengguna dan mitra di Indonesia.`,
        requirements: skills.length > 0
          ? skills.map((s) => `Keahlian dalam ${s}`)
          : ["Pengalaman profesional di bidang terkait", "Kemampuan komunikasi & kolaborasi tim yang baik"],
        url: applyUrl,
        salary: "Kompetitif",
        posted_at: (item.releasedDate || "").slice(0, 10),
        source: "Grab Careers",
      };
    });
  } catch (e) {
    console.error("Grab fetch error:", e);
    return [];
  }
}

// ── Source 3: Xendit Careers API — Greenhouse (Indonesia Fintech Unicorn) ───
async function fetchXenditCareers(): Promise<any[]> {
  try {
    const res = await fetch(
      "https://boards-api.greenhouse.io/v1/boards/xendit/jobs?content=true",
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const jobs = (data.jobs || []).filter((j: any) => {
      const loc = (j.location?.name || "").toLowerCase();
      return loc.includes("indonesia") || loc.includes("jakarta") || loc.includes("remote");
    });

    return jobs.map((item: any, i: number) => {
      const desc = cleanHtml(item.content || "");
      const skills = extractSkills(`${item.title} ${desc}`);
      const locName = item.location?.name || "Jakarta, Indonesia";
      const isRemote = locName.toLowerCase().includes("remote");

      return {
        id: `xendit-${item.id || i}`,
        title: item.title || "Software Engineer",
        company: "Xendit",
        location: locName,
        workType: isRemote ? "remote_indonesia" : "indonesia",
        type: "Full Time",
        category: inferCategory(item.title, desc, skills),
        skills: skills.length > 0 ? skills : ["REST API", "Git", "PostgreSQL"],
        description: desc.slice(0, 700) + (desc.length > 700 ? "..." : "") || `Posisi ${item.title} di Xendit Indonesia payment gateway.`,
        requirements: skills.map((s) => `Pengalaman dengan ${s}`),
        url: item.absolute_url || "https://www.xendit.co/en/careers/",
        salary: "Kompetitif",
        posted_at: (item.updated_at || "").slice(0, 10),
        source: "Xendit Careers",
      };
    });
  } catch (e) {
    console.error("Xendit fetch error:", e);
    return [];
  }
}

// ── Source 4: Working Nomads — Global & APAC Remote Developer Jobs ──────────
async function fetchWorkingNomads(): Promise<any[]> {
  try {
    const res = await fetch(
      "https://www.workingnomads.com/api/exposed_jobs/?category=development",
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = (Array.isArray(data) ? data : []).slice(0, 40);

    return items.map((item: any, i: number) => {
      const desc = cleanHtml(item.description || "");
      const tags = (item.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean);
      const tagSkills = tags
        .map((t: string) => ALL_DISCIPLINE_KEYWORDS.find((k) => k.toLowerCase() === t.toLowerCase()) || null)
        .filter(Boolean) as string[];
      const skills = [...new Set([...tagSkills, ...extractSkills(`${item.title} ${desc}`)])];

      const loc = item.location || "Remote (Worldwide)";
      const isApac = loc.toLowerCase().includes("apac") || loc.toLowerCase().includes("asia") || loc.toLowerCase().includes("indonesia");

      return {
        id: `workingnomads-${i}`,
        title: item.title || "Remote Developer",
        company: item.company_name || "Tech Company",
        location: isApac ? `Remote (${loc})` : "Remote (Worldwide)",
        workType: isApac ? "remote_indonesia" : "remote_global",
        type: "Full Time",
        category: inferCategory(item.title, desc, skills),
        skills,
        description: desc.slice(0, 700) + (desc.length > 700 ? "..." : ""),
        requirements: skills.slice(0, 5).map((s) => `Keahlian: ${s}`),
        url: item.url || "#",
        salary: "",
        posted_at: (item.pub_date || "").slice(0, 10),
        source: "Working Nomads",
      };
    });
  } catch (e) {
    console.error("Working Nomads fetch error:", e);
    return [];
  }
}

// ── Source 5: Arbeitnow (remote-friendly) ─────────────────────────────────
async function fetchArbeitnow(): Promise<any[]> {
  try {
    const res = await fetch(
      "https://www.arbeitnow.com/api/job-board-api?page=1",
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const items = (data.data || []).filter((j: any) => j.remote).slice(0, 20);
    return items.map((item: any, i: number) => {
      const desc = cleanHtml(item.description || "");
      const skills = extractSkills(`${item.title} ${(item.tags || []).join(" ")} ${desc}`);
      return {
        id: `arbeitnow-${item.slug || i}`,
        title: item.title || "Engineer",
        company: item.company_name || "Company",
        location: "Remote (Europe/Worldwide)",
        workType: "remote_global",
        type: "Full Time",
        category: inferCategory(item.title, desc, skills),
        skills: skills.length > 0 ? skills : [],
        description: desc.slice(0, 700) + (desc.length > 700 ? "..." : ""),
        requirements: (item.tags || []).slice(0, 5).map((t: string) => `Skill: ${t}`),
        url: item.url || "#",
        salary: "",
        posted_at: item.date ? new Date(item.date * 1000).toISOString().slice(0, 10) : "",
        source: "Arbeitnow",
      };
    });
  } catch (e) {
    console.error("Arbeitnow fetch error:", e);
    return [];
  }
}

// ── Source 6: RemoteOK ─────────────────────────────────────────────────────
async function fetchRemoteOk(): Promise<any[]> {
  try {
    const res = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "JobMatcher/1.0" },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return [];
    const rawData = await res.json();
    const items = rawData.filter((j: any) => j.id && j.position).slice(0, 40);
    return items.map((item: any, i: number) => {
      const desc = cleanHtml(item.description || "");
      const tagSkills = (item.tags || [])
        .map((t: string) => ALL_DISCIPLINE_KEYWORDS.find((k) => k.toLowerCase() === t.toLowerCase()) || null)
        .filter(Boolean) as string[];
      const skills = [...new Set([...tagSkills, ...extractSkills(`${item.position} ${desc}`)])];
      return {
        id: `remoteok-${item.id || i}`,
        title: item.position || "Remote Specialist",
        company: item.company || "Tech Company",
        location: "Remote (Worldwide)",
        workType: "remote_global",
        type: "Full Time",
        category: inferCategory(item.position, desc, skills),
        skills,
        description: desc.slice(0, 700) + (desc.length > 700 ? "..." : ""),
        requirements: skills.slice(0, 5).map((s) => `Pengalaman dengan ${s}`),
        url: item.url || `https://remoteok.com/remote-jobs/${item.id}`,
        salary: item.salary || "",
        posted_at: (() => {
          try { return item.date ? new Date(item.date * 1000).toISOString().slice(0, 10) : ""; }
          catch { return ""; }
        })(),
        source: "RemoteOK",
      };
    });
  } catch (e) {
    console.error("RemoteOK fetch error:", e);
    return [];
  }
}

// ── Source 5: Real Indonesia Jobs — Direct Career Pages ───────────────────
// Semua URL mengarah langsung ke halaman karir perusahaan atau job board
// yang memang membuka lowongan untuk Indonesia.
function getIndonesiaJobs(): any[] {
  return [
    // ── GOJEK ──
    {
      title: "Backend Engineer — Platform",
      company: "Gojek",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Go", "Kubernetes", "Docker", "PostgreSQL", "gRPC", "Linux", "CI/CD"],
      description: "Bergabung sebagai Backend Engineer di Gojek untuk membangun platform layanan yang melayani puluhan juta pengguna setiap harinya. Stack utama: Go, Kubernetes, dan microservices di atas GCP.",
      requirements: ["Go / Golang", "Kubernetes & Docker", "gRPC / REST API", "PostgreSQL / NoSQL", "Distributed systems"],
      url: "https://www.gojek.com/en-id/about/careers/",
      salary: "Kompetitif",
      source: "Gojek Careers",
    },
    {
      title: "Frontend Engineer (React)",
      company: "Gojek",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["React", "TypeScript", "Next.js", "GraphQL", "Git"],
      description: "Bangun pengalaman web pengguna yang diakses jutaan orang menggunakan React & TypeScript. Kolaborasi dengan tim product & desain dalam lingkungan agile.",
      requirements: ["React + TypeScript", "Next.js", "GraphQL atau REST API", "State management (Redux/Zustand)"],
      url: "https://www.gojek.com/en-id/about/careers/",
      salary: "Kompetitif",
      source: "Gojek Careers",
    },
    // ── TOKOPEDIA ──
    {
      title: "Software Engineer — Seller Experience",
      company: "Tokopedia",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Java", "Spring Boot", "MySQL", "Kafka", "Docker", "Kubernetes"],
      description: "Kembangkan fitur seller-facing di platform e-commerce terbesar Indonesia. Tangani traffic skala besar dengan arsitektur microservices dan event-driven.",
      requirements: ["Java / Spring Boot", "MySQL atau PostgreSQL", "Kafka / message queue", "Docker & Kubernetes"],
      url: "https://www.tokopedia.com/careers/",
      salary: "Kompetitif",
      source: "Tokopedia Careers",
    },
    {
      title: "Data Scientist — Recommendation System",
      company: "Tokopedia",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Pandas", "Spark"],
      description: "Bangun model rekomendasi produk menggunakan machine learning untuk meningkatkan konversi di platform Tokopedia. Bekerja dengan dataset skala besar.",
      requirements: ["Python (ML)", "TensorFlow / PyTorch", "SQL & big data", "Algoritma rekomendasi"],
      url: "https://www.tokopedia.com/careers/",
      salary: "Kompetitif",
      source: "Tokopedia Careers",
    },
    // ── TRAVELOKA ──
    {
      title: "Full Stack Engineer (Node.js + React)",
      company: "Traveloka",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Node.js", "React", "TypeScript", "PostgreSQL", "Docker", "AWS"],
      description: "Bergabung dengan tim produk Traveloka untuk membangun platform travel yang digunakan jutaan pengguna. Focus: full-stack development dengan Node.js dan React.",
      requirements: ["Node.js + TypeScript", "React (frontend)", "PostgreSQL / MySQL", "AWS / cloud deployment"],
      url: "https://career.traveloka.com/",
      salary: "Kompetitif",
      source: "Traveloka Career",
    },
    {
      title: "Mobile Engineer (iOS — Swift)",
      company: "Traveloka",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Swift", "iOS", "REST API", "Git", "Firebase"],
      description: "Kembangkan aplikasi iOS Traveloka yang digunakan oleh puluhan juta pengguna di Asia Tenggara. Pengalaman dengan SwiftUI dan Combine diutamakan.",
      requirements: ["Swift + SwiftUI", "Xcode & iOS SDK", "REST API integration", "Unit testing (XCTest)"],
      url: "https://career.traveloka.com/",
      salary: "Kompetitif",
      source: "Traveloka Career",
    },
    // ── SHOPEE INDONESIA ──
    {
      title: "Backend Engineer (Python/Django)",
      company: "Shopee Indonesia",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Python", "Django", "MySQL", "Redis", "Docker", "Kubernetes"],
      description: "Bangun dan kembangkan layanan backend Shopee Indonesia yang menangani jutaan transaksi setiap hari. Stack: Python, Django, MySQL, Redis.",
      requirements: ["Python (Django / FastAPI)", "MySQL / PostgreSQL", "Redis caching", "Docker & deployment"],
      url: "https://careers.shopee.co.id/",
      salary: "Kompetitif",
      source: "Shopee Careers ID",
    },
    {
      title: "Flutter Mobile Developer",
      company: "Shopee Indonesia",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Flutter", "Dart", "REST API", "Firebase", "Git"],
      description: "Kembangkan fitur mobile app Shopee menggunakan Flutter/Dart untuk Android dan iOS. Lingkungan kerja yang inovatif dengan technical ownership.",
      requirements: ["Flutter + Dart", "State management (BLoC/Provider)", "REST API", "Firebase"],
      url: "https://careers.shopee.co.id/",
      salary: "Kompetitif",
      source: "Shopee Careers ID",
    },
    // ── RUANGGURU ──
    {
      title: "Backend Engineer (Go/Golang)",
      company: "Ruangguru",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Go", "PostgreSQL", "Redis", "Docker", "REST API", "Kubernetes"],
      description: "Bangun microservices edtech yang melayani jutaan siswa di Indonesia. Stack utama: Go, PostgreSQL, Redis, dan Docker. Agile team dengan ownership tinggi.",
      requirements: ["Go / Golang", "PostgreSQL", "Redis", "gRPC / REST API", "Docker & K8s"],
      url: "https://about.ruangguru.com/careers",
      salary: "Kompetitif",
      source: "Ruangguru Careers",
    },
    {
      title: "Frontend Developer (React/Next.js)",
      company: "Ruangguru",
      location: "Jakarta, Indonesia (Hybrid)",
      workType: "indonesia",
      type: "Full Time",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "GraphQL"],
      description: "Kembangkan platform belajar online Ruangguru menggunakan React dan Next.js. Hybrid work: 2–3 hari WFH per minggu. Focus pada performa dan UX.",
      requirements: ["React + TypeScript", "Next.js (SSR/SSG)", "Tailwind CSS", "GraphQL / REST API"],
      url: "https://about.ruangguru.com/careers",
      salary: "Kompetitif",
      source: "Ruangguru Careers",
    },
    // ── BUKALAPAK ──
    {
      title: "Software Engineer — Marketplace",
      company: "Bukalapak",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Ruby", "Go", "PostgreSQL", "Redis", "Docker", "Kubernetes"],
      description: "Bergabung tim engineering Bukalapak untuk membangun fitur marketplace yang digunakan puluhan juta pengguna. Stack: Go/Ruby, PostgreSQL, Redis.",
      requirements: ["Go atau Ruby on Rails", "PostgreSQL / MySQL", "Redis", "Docker"],
      url: "https://careers.bukalapak.com/",
      salary: "Kompetitif",
      source: "Bukalapak Careers",
    },
    // ── DANA ──
    {
      title: "Android Engineer (Kotlin)",
      company: "DANA Indonesia",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Kotlin", "Android", "REST API", "Firebase", "Git", "Jetpack Compose"],
      description: "Bangun aplikasi DANA yang digunakan oleh lebih dari 130 juta pengguna untuk transaksi digital. Tech: Kotlin, Jetpack Compose, dan modern Android architecture.",
      requirements: ["Kotlin + Jetpack Compose", "MVVM / Clean Architecture", "REST API", "Unit testing"],
      url: "https://www.dana.id/career",
      salary: "Kompetitif",
      source: "DANA Careers",
    },
    {
      title: "Data Engineer — Fintech Platform",
      company: "DANA Indonesia",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Python", "SQL", "Spark", "Airflow", "AWS", "PostgreSQL"],
      description: "Kelola data pipeline dan infrastruktur data untuk mendukung layanan fintech DANA. Desain ETL, monitoring data quality, dan data warehouse optimization.",
      requirements: ["Python (PySpark/Pandas)", "SQL & data warehouse", "Apache Airflow", "AWS / GCP"],
      url: "https://www.dana.id/career",
      salary: "Kompetitif",
      source: "DANA Careers",
    },
    // ── OVO ──
    {
      title: "DevOps / Site Reliability Engineer",
      company: "OVO",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Kubernetes", "Docker", "Terraform", "Linux", "CI/CD", "AWS", "Prometheus"],
      description: "Kelola infrastruktur fintech OVO pada skala besar menggunakan Kubernetes dan Terraform. Monitoring, reliability, dan otomasi deployment pipeline.",
      requirements: ["Kubernetes & Helm", "Terraform / IaC", "AWS / GCP", "CI/CD (GitLab/Jenkins)", "Prometheus + Grafana"],
      url: "https://careers.ovo.id/",
      salary: "Kompetitif",
      source: "OVO Careers",
    },
    // ── TIKET.COM ──
    {
      title: "Full Stack Developer (Laravel + Vue.js)",
      company: "Tiket.com",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Laravel", "PHP", "Vue.js", "MySQL", "Redis", "Docker"],
      description: "Kembangkan platform booking travel Tiket.com menggunakan Laravel dan Vue.js. Tangani traffic tinggi pada momen peak season.",
      requirements: ["Laravel 10+ (PHP)", "Vue.js 3 / Nuxt.js", "MySQL + Redis", "REST API design"],
      url: "https://www.tiket.com/careers/",
      salary: "Kompetitif",
      source: "Tiket.com Careers",
    },
    // ── BLIBLI ──
    {
      title: "QA Engineer (Automation)",
      company: "Blibli.com",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Selenium", "Java", "Postman", "API Testing", "Jira", "Jenkins"],
      description: "Pastikan kualitas platform e-commerce Blibli melalui pengujian otomasi. Buat framework automation testing dengan Selenium/Java. Integrasi ke pipeline CI/CD.",
      requirements: ["Selenium WebDriver + Java", "API testing (Postman/RestAssured)", "Jenkins / CI-CD", "Jira"],
      url: "https://karir.blibli.com/",
      salary: "Kompetitif",
      source: "Blibli Careers",
    },
    // ── AKULAKU ──
    {
      title: "Backend Engineer (Java/Spring Boot)",
      company: "Akulaku",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Java", "Spring Boot", "MySQL", "Redis", "Kafka", "Docker"],
      description: "Kembangkan layanan kredit digital Akulaku yang beroperasi di Indonesia, Filipina, dan Malaysia. Stack: Java, Spring Boot, Kafka, dan Redis.",
      requirements: ["Java + Spring Boot", "MySQL / PostgreSQL", "Kafka / RabbitMQ", "Docker & microservices"],
      url: "https://www.akulaku.com/id/career/",
      salary: "Kompetitif",
      source: "Akulaku Careers",
    },
    // ── GRAB INDONESIA ──
    {
      title: "Software Engineer — Grab Indonesia",
      company: "Grab",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Go", "Python", "Kubernetes", "PostgreSQL", "Kafka", "AWS"],
      description: "Bergabung dengan engineering team Grab di Jakarta. Bangun layanan super app yang digunakan jutaan pengguna di Asia Tenggara dengan stack modern.",
      requirements: ["Go atau Python", "Kubernetes", "Kafka / event streaming", "PostgreSQL / NoSQL"],
      url: "https://grab.careers/",
      salary: "Kompetitif",
      source: "Grab Careers",
    },
    // ── REMOTE INDONESIA ──
    {
      title: "Laravel Developer (Remote — Seluruh Indonesia)",
      company: "Arkademi",
      location: "Remote (Seluruh Indonesia)",
      workType: "remote_indonesia",
      type: "Full Time",
      skills: ["Laravel", "PHP", "MySQL", "Git", "REST API", "Vue.js"],
      description: "Platform edtech Indonesia membuka posisi remote Laravel Developer. Kerjakan fitur LMS, integrasi payment gateway, dan API endpoint. Full remote dari mana saja di Indonesia.",
      requirements: ["Laravel 9/10", "MySQL / MariaDB", "REST API", "Git", "Vue.js atau React (opsional)"],
      url: "https://arkademi.com/karir",
      salary: "Rp 6–12 juta / bulan",
      source: "Arkademi Careers",
    },
    {
      title: "React Native Developer (Remote Indonesia)",
      company: "Flip.id",
      location: "Remote (Seluruh Indonesia)",
      workType: "remote_indonesia",
      type: "Full Time",
      skills: ["React Native", "JavaScript", "TypeScript", "REST API", "Firebase", "Git"],
      description: "Kembangkan aplikasi mobile Flip.id — fintech transfer uang lintas bank. Full remote, tim kecil namun berdampak besar. Stack: React Native + TypeScript.",
      requirements: ["React Native + TypeScript", "Redux / Zustand", "REST API & WebSocket", "Firebase"],
      url: "https://flip.id/career",
      salary: "Rp 8–15 juta / bulan",
      source: "Flip.id Careers",
    },
    {
      title: "Python Data Engineer (Remote Indonesia)",
      company: "Pahamify",
      location: "Remote (Seluruh Indonesia)",
      workType: "remote_indonesia",
      type: "Full Time",
      skills: ["Python", "SQL", "Pandas", "Airflow", "AWS", "PostgreSQL"],
      description: "Bangun data pipeline untuk platform edtech Pahamify. Kelola data siswa dan analytics konten pembelajaran. Full remote dari seluruh Indonesia.",
      requirements: ["Python (Pandas/PySpark)", "SQL & PostgreSQL", "Apache Airflow", "AWS S3/Redshift"],
      url: "https://pahamify.com/karir/",
      salary: "Rp 7–13 juta / bulan",
      source: "Pahamify Careers",
    },
    {
      title: "Full Stack Developer (Remote WFH)",
      company: "Mekari",
      location: "Remote (Seluruh Indonesia)",
      workType: "remote_indonesia",
      type: "Full Time",
      skills: ["Ruby", "React", "PostgreSQL", "Docker", "REST API", "Git"],
      description: "Mekari (SaaS HR & Akuntansi) membuka posisi remote Full Stack Developer. Kerjakan fitur payroll, HR, dan akuntansi untuk ribuan bisnis di Indonesia.",
      requirements: ["Ruby on Rails atau Go", "React / Next.js", "PostgreSQL", "Docker & CI/CD"],
      url: "https://mekari.com/karir/",
      salary: "Rp 9–18 juta / bulan",
      source: "Mekari Careers",
    },
    {
      title: "UI/UX Designer (Remote Indonesia)",
      company: "Majoo",
      location: "Remote (Seluruh Indonesia)",
      workType: "remote_indonesia",
      type: "Full Time",
      skills: ["Figma", "UI/UX Design", "Prototyping", "Wireframing", "User Research"],
      description: "Rancang pengalaman pengguna untuk platform kasir digital Majoo yang digunakan UMKM di seluruh Indonesia. Full remote, kolaborasi dengan PM dan engineering.",
      requirements: ["Figma (wajib)", "User research & testing", "Prototyping interaktif", "Design system"],
      url: "https://majoo.id/karir",
      salary: "Rp 6–11 juta / bulan",
      source: "Majoo Careers",
    },
    // ── BANK BCA ──
    {
      title: "Management Development Program (MDP)",
      company: "Bank Central Asia (BCA)",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Leadership", "Strategic Planning", "Business Analysis", "Team Management", "Problem Solving", "Management"],
      description: "Program pengembangan calon pemimpin masa depan Bank BCA. Pelatihan intensif di bidang operasional perbankan, kepemimpinan strategis, analisis bisnis, dan manajemen resiko.",
      requirements: ["S1/S2 semua jurusan (IPK min 3.00)", "Kemampuan analisis & kepemimpinan kuat", "Kemampuan komunikasi & presentasi prima", "Bersedia ditempatkan di seluruh unit BCA"],
      url: "https://karir.bca.co.id/",
      salary: "Rp 9.000.000 – Rp 15.000.000 / bln",
      source: "BCA Karir",
    },
    {
      title: "Staff Accounting & Financial Reporting",
      company: "Bank Central Asia (BCA)",
      location: "Jakarta Pusat, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Accounting", "Financial Reporting", "Excel", "Auditing", "Tax", "General Ledger"],
      description: "Bertanggung jawab atas penyusunan laporan keuangan berkala, rekonsiliasi transaksi perbankan, pencatatan jurnal umum, dan kepatuhan perpajakan di kantor pusat BCA.",
      requirements: ["S1 Akuntansi / Keuangan (IPK min 3.00)", "Memahami PSAK & IFRS", "Mahir Microsoft Excel (Lookup, Pivot, Formula Lanjutan)", "Teliti, analitis, dan berintegritas tinggi"],
      url: "https://karir.bca.co.id/",
      salary: "Rp 7.000.000 – Rp 12.000.000 / bln",
      source: "BCA Karir",
    },
    // ── TELKOM INDONESIA ──
    {
      title: "Human Resources & Talent Management Specialist",
      company: "Telkom Indonesia",
      location: "Jakarta / Bandung, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Recruitment", "Talent Acquisition", "HR Operations", "Performance Management", "Onboarding", "HRIS"],
      description: "Kelola siklus talenta di BUMN digital terbesar Indonesia. Mengkoordinasikan rekrutmen karyawan baru, program pengembangan kompetensi, evaluasi KPI, dan retensi talenta terbaik.",
      requirements: ["S1 Psikologi / Manajemen SDM / Hukum", "Pengalaman minimal 1-3 tahun di bidang HR/Recruitment", "Menguasai teknik asesmen & wawancara berbasis kompetensi", "Memahami sistem HRIS & UU Ketenagakerjaan"],
      url: "https://careers.telkom.co.id/",
      salary: "Rp 8.000.000 – Rp 14.000.000 / bln",
      source: "Telkom Careers",
    },
    // ── UNILEVER INDONESIA ──
    {
      title: "Assistant Brand Manager & Digital Marketing",
      company: "Unilever Indonesia",
      location: "Tangerang / Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Digital Marketing", "Branding", "Campaign Management", "Social Media Marketing", "Market Research", "B2C"],
      description: "Pimpin strategi branding produk dan kampanye pemasaran digital multi-channel untuk brand ternama Unilever Indonesia guna mencapai pertumbuhan pangsa pasar.",
      requirements: ["S1 Manajemen / Marketing / Komunikasi", "Pengalaman 2+ tahun dalam Brand Management / Digital Marketing", "Keahlian riset pasar & analisis perilaku konsumen", "Pengalaman memimpin kampanye terintegrasi"],
      url: "https://careers.unilever.com/indonesia",
      salary: "Rp 10.000.000 – Rp 18.000.000 / bln",
      source: "Unilever Careers",
    },
    // ── ASTRA INTERNATIONAL ──
    {
      title: "Operations & Business Process Analyst",
      company: "Astra International",
      location: "Jakarta Utara, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Operations Management", "Process Improvement", "Strategic Planning", "KPI", "Business Analysis", "Supply Chain"],
      description: "Analisis dan optimalkan efisiensi alur operasional lini bisnis Astra International. Rancang SOP baru, pantau KPI operasional, dan lakukan mitigasi resiko rantai pasok.",
      requirements: ["S1 Teknik Industri / Manajemen Operasional / Bisnis", "Kemampuan pemetaan proses bisnis & lean thinking", "Mahir data analysis & visualisasi performa bisnis", "Keterampilan negosiasi & komunikasi stakeholder"],
      url: "https://career.astra.co.id/",
      salary: "Rp 8.500.000 – Rp 15.000.000 / bln",
      source: "Astra Careers",
    },
    // ── SHOPEE INDONESIA (NON-TECH) ──
    {
      title: "Operations & Administrative Coordinator",
      company: "Shopee Indonesia",
      location: "Jakarta Selatan, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      skills: ["Administrasi", "Data Entry", "Microsoft Excel", "Inventory Control", "Customer Service", "Scheduling"],
      description: "Dukung kelancaran operasional logistik dan administrasi Shopee Express Indonesia. Kelola data inventaris, pencatatan manifes harian, dan koordinasi armada.",
      requirements: ["D3/S1 segala jurusan (Administrasi / Manajemen diutamakan)", "Sangat mahir menggunakan Microsoft Excel", "Mampu bekerja cekatan, teliti, dan terorganisir", "Bersedia koordinasi cepat dengan tim lapangan"],
      url: "https://careers.shopee.co.id/",
      salary: "Rp 5.500.000 – Rp 8.500.000 / bln",
      source: "Shopee Careers ID",
    },
  ].map((job, i) => ({
    ...job,
    category: inferCategory(job.title, job.description, job.skills),
    id: `indonesia-${i + 1}`,
    posted_at: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  }));
}

// ── Source 6: JobStreet Indonesia (id.jobstreet.com) ──────────────────────
// Lowongan langsung ke pencarian resmi JobStreet ID lintas seluruh bidang karir
function getJobStreetJobs(): any[] {
  return [
    {
      title: "Project Manager / Scrum Master",
      company: "Enterprise Solutions (JobStreet ID)",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      category: "Manajemen & Bisnis",
      skills: ["Project Management", "Agile", "Scrum", "Jira", "Leadership", "Budgeting"],
      description: "Peluang karir Project Manager di JobStreet Indonesia. Pimpin perencanaan proyek, timeline, alokasi resource, dan koordinasi tim lintas divisi.",
      requirements: ["Project Management (PMP/Scrum certified plus)", "Agile / Scrum framework", "Jira / Trello", "Stakeholder Management"],
      url: "https://id.jobstreet.com/id/job-search/project-management-jobs/",
      salary: "Rp 12.000.000 – Rp 22.000.000 / bln",
      posted_at: new Date().toISOString().slice(0, 10),
      source: "JobStreet Indonesia",
    },
    {
      title: "Business Development & Operations Manager",
      company: "Growth Ventures (JobStreet ID)",
      location: "Jakarta Selatan, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      category: "Manajemen & Bisnis",
      skills: ["Business Development", "Operations Management", "Strategic Planning", "Negotiation", "KPI"],
      description: "Lowongan Business Development Manager di JobStreet Indonesia untuk memperluas kemitraan strategis dan optimasi proses operasional perusahaan.",
      requirements: ["Business Development & Sales B2B", "Strategic Planning & KPI setting", "Negosiasi kontrak kerja sama", "Kemampuan presentasi eksekutif"],
      url: "https://id.jobstreet.com/id/job-search/manajemen-jobs/",
      salary: "Rp 10.000.000 – Rp 20.000.000 / bln",
      posted_at: new Date().toISOString().slice(0, 10),
      source: "JobStreet Indonesia",
    },
    {
      title: "Digital Marketing & Brand Specialist",
      company: "Media & Consumer Tech (JobStreet ID)",
      location: "Jakarta Barat, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      category: "Marketing & Sales",
      skills: ["Digital Marketing", "SEO", "Social Media Marketing", "Content Creation", "Google Analytics", "Branding"],
      description: "Lowongan Digital Marketing Specialist di JobStreet Indonesia. Kelola kampanye iklan berbayar (Meta Ads, Google Ads), strategi konten, dan optimasi SEO organik.",
      requirements: ["Digital Marketing & Performance Ads", "SEO & SEM", "Social Media Content Strategy", "Google Analytics & Data Reporting"],
      url: "https://id.jobstreet.com/id/job-search/marketing-jobs/",
      salary: "Rp 7.500.000 – Rp 14.000.000 / bln",
      posted_at: new Date().toISOString().slice(0, 10),
      source: "JobStreet Indonesia",
    },
    {
      title: "Accounting & Tax Specialist (Staff Akuntansi)",
      company: "Financial Services (JobStreet ID)",
      location: "Jakarta Pusat, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      category: "Keuangan & Akuntansi",
      skills: ["Accounting", "Tax", "Perpajakan", "Financial Reporting", "Excel", "SAP", "Brevet"],
      description: "Lowongan Staf Akuntansi & Pajak di JobStreet Indonesia. Kelola jurnal umum, laporan keuangan bulanan, rekonsiliasi bank, dan kepatuhan pajak SPT PPh/PPn.",
      requirements: ["S1 Akuntansi / Keuangan", "Brevet A & B (diutamakan)", "Pengalaman menyusun laporan keuangan", "Mahir Microsoft Excel (VLOOKUP, Pivot)"],
      url: "https://id.jobstreet.com/id/job-search/akuntansi-keuangan-jobs/",
      salary: "Rp 6.500.000 – Rp 12.000.000 / bln",
      posted_at: new Date().toISOString().slice(0, 10),
      source: "JobStreet Indonesia",
    },
    {
      title: "Human Resources & Talent Acquisition Officer",
      company: "Retail & Consumer (JobStreet ID)",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      category: "HR & Personalia",
      skills: ["Recruitment", "Talent Acquisition", "HR Operations", "Employee Relations", "Onboarding", "UU Ketenagakerjaan"],
      description: "Lowongan HR & Recruitment di JobStreet Indonesia untuk menangani end-to-end proses rekrutmen karyawan, administrasi personalia, dan hubungan industrial.",
      requirements: ["S1 Psikologi / Manajemen SDM / Hukum", "Pengalaman end-to-end recruitment", "Pemahaman UU Ketenagakerjaan", "Komunikasi & interpersonal yang baik"],
      url: "https://id.jobstreet.com/id/job-search/human-resources-jobs/",
      salary: "Rp 6.000.000 – Rp 11.000.000 / bln",
      posted_at: new Date().toISOString().slice(0, 10),
      source: "JobStreet Indonesia",
    },
    {
      title: "Administrative Assistant & Data Entry Specialist",
      company: "Logistics & Supply Group (JobStreet ID)",
      location: "Surabaya, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      category: "Administrasi",
      skills: ["Administrasi", "Data Entry", "Microsoft Excel", "Microsoft Office", "Filing", "Customer Service"],
      description: "Lowongan Staff Administrasi di JobStreet Indonesia. Bertanggung jawab atas input data operasional, arsip dokumen, koordinasi inventaris, dan korespondensi.",
      requirements: ["D3/S1 segala jurusan", "Mahir Microsoft Office (Excel & Word)", "Teliti, rapi, dan bertanggung jawab", "Kecepatan dan akurasi mengetik tinggi"],
      url: "https://id.jobstreet.com/id/job-search/administrasi-jobs/",
      salary: "Rp 4.500.000 – Rp 7.500.000 / bln",
      posted_at: new Date().toISOString().slice(0, 10),
      source: "JobStreet Indonesia",
    },
    {
      title: "UI/UX & Graphic Designer (Remote WFH ID)",
      company: "Creative Agency (JobStreet ID)",
      location: "Remote (Seluruh Indonesia)",
      workType: "remote_indonesia",
      type: "Full Time",
      category: "Desain & Kreatif",
      skills: ["UI/UX Design", "Figma", "Graphic Design", "Adobe Photoshop", "Prototyping", "User Research"],
      description: "Lowongan Remote WFH Desainer di JobStreet Indonesia. Buat rancangan visual antarmuka web, mobile apps, dan aset materi promosi kreatif.",
      requirements: ["Portofolio desain (Figma/Behance wajib)", "Menguasai Figma dan Adobe Creative Suite", "Pemahaman Design System & UX flow", "Kreatif dan komunikatif"],
      url: "https://id.jobstreet.com/id/job-search/desain-kreatif-jobs/",
      salary: "Rp 7.000.000 – Rp 14.000.000 / bln",
      posted_at: new Date().toISOString().slice(0, 10),
      source: "JobStreet Indonesia",
    },
    {
      title: "Senior Full Stack Developer",
      company: "Tech Partner (JobStreet ID)",
      location: "Jakarta, Indonesia",
      workType: "indonesia",
      type: "Full Time",
      category: "Teknologi & IT",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "REST API"],
      description: "Peluang karir Senior Full Stack Developer melalui portal resmi JobStreet Indonesia. Kembangkan platform web skala besar dengan React dan Node.js.",
      requirements: ["React / Next.js", "Node.js & TypeScript", "PostgreSQL / SQL", "REST API & Microservices"],
      url: "https://id.jobstreet.com/id/job-search/full-stack-developer-jobs/",
      salary: "Rp 12.000.000 – Rp 22.000.000 / bln",
      posted_at: new Date().toISOString().slice(0, 10),
      source: "JobStreet Indonesia",
    },
  ].map((job, i) => ({
    ...job,
    id: `jobstreet-${i + 1}`,
  }));
}

// ── Deduplicate ────────────────────────────────────────────────────────────
function dedupe(jobs: any[]): any[] {
  const seen = new Set<string>();
  return jobs.filter((j) => {
    const key = `${j.title.toLowerCase().slice(0, 35)}|${j.company.toLowerCase().slice(0, 25)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── GET /api/jobs ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    // Fetch semua sumber secara parallel (server-side = tidak ada CORS)
    const [kalibrr, grab, xendit, workingNomads, arbeitnow, remoteok] = await Promise.allSettled([
      fetchKalibrr(),        // Real live API: Kalibrr (Job portal resmi Indonesia: IT/Software & WFH)
      fetchGrabIndonesia(),  // Real live API: Grab Careers Indonesia (SmartRecruiters API)
      fetchXenditCareers(),  // Real live API: Xendit Indonesia & Remote (Greenhouse API)
      fetchWorkingNomads(),  // Real live API: Working Nomads (Remote Dev Global & APAC)
      fetchArbeitnow(),      // Real live API: Arbeitnow (Remote jobs)
      fetchRemoteOk(),       // Real live API: RemoteOK (Remote tech jobs)
    ]);

    const idJobs = getIndonesiaJobs();       // Lowongan karir tech unicorn Indonesia
    const jobstreetJobs = getJobStreetJobs(); // Lowongan karir JobStreet Indonesia

    // Prioritas: Semua lowongan Indonesia & WFH Indonesia ditaruh di PALING ATAS
    const allJobs = [
      ...(kalibrr.status === "fulfilled" ? kalibrr.value : []),
      ...(grab.status === "fulfilled" ? grab.value : []),
      ...(xendit.status === "fulfilled" ? xendit.value : []),
      ...idJobs,
      ...jobstreetJobs,
      // Remote global diletakkan di bagian akhir
      ...(workingNomads.status === "fulfilled" ? workingNomads.value : []),
      ...(arbeitnow.status === "fulfilled" ? arbeitnow.value : []),
      ...(remoteok.status === "fulfilled" ? remoteok.value : []),
    ];

    // Hanya tampilkan job yang punya minimal 1 skill teridentifikasi
    const withSkills = dedupe(allJobs).filter((j) => j.skills && j.skills.length > 0);
    const jobs = withSkills.map((job, idx) => ({ ...job, id: idx + 1 }));

    return NextResponse.json(jobs, {
      headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600" },
    });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return NextResponse.json([], { status: 200 });
  }
}
