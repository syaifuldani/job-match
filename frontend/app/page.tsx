"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { UploadCV } from "@/components/UploadCV";
import { CandidateProfileCard } from "@/components/CandidateProfileCard";
import { JobFilter } from "@/components/JobFilter";
import { JobCard } from "@/components/JobCard";
import { JobDetailModal } from "@/components/JobDetailModal";
import { CandidateProfile, FilterState, JobMatchAnalysis, Job } from "@/types/job";
import { analyzeCV, getJobs, checkBackendHealth } from "@/lib/api";
import { rankJobs } from "@/lib/matcher";
import { getStoredProfile, saveStoredProfile } from "@/lib/storage";
import {
  Sparkles,
  FileCheck2,
  CheckCircle2,
  Filter,
  Layers,
  ArrowRight,
  Briefcase,
  Loader2,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [isProcessingCV, setIsProcessingCV] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobMatchAnalysis | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [showOnlyMatching, setShowOnlyMatching] = useState<boolean>(true);

  const [filter, setFilter] = useState<FilterState>({
    keyword: "",
    location: "Semua",
    category: "Semua",
    workType: "Semua",
    employmentType: "Semua",
    sortBy: "score_desc",
  });

  // Check backend health and load live jobs from API
  useEffect(() => {
    setMounted(true);
    const stored = getStoredProfile();
    if (stored) {
      setCandidateProfile(stored);
    }

    setIsLoadingJobs(true);
    checkBackendHealth().then((connected) => {
      setIsBackendConnected(connected);
      getJobs().then(({ jobs }) => {
        if (jobs && jobs.length > 0) {
          setAllJobs(jobs);
        }
        setIsLoadingJobs(false);
      }).catch(() => {
        setIsLoadingJobs(false);
      });
    });
  }, []);

  const updateProfile = (profile: CandidateProfile | null) => {
    setCandidateProfile(profile);
    saveStoredProfile(profile);
  };

  // Handle file upload
  const handleAnalyzeFile = async (file: File) => {
    setIsProcessingCV(true);
    try {
      const { profile } = await analyzeCV(file);
      updateProfile(profile);
    } finally {
      setIsProcessingCV(false);
    }
  };

  // Add a skill to the candidate profile
  const handleAddSkill = (newSkill: string) => {
    if (!candidateProfile) {
      updateProfile({
        skills: [newSkill],
        experience_level: "Entry Level",
        recommended_roles: ["Developer"],
      });
      return;
    }

    if (!candidateProfile.skills.includes(newSkill)) {
      updateProfile({
        ...candidateProfile,
        skills: [...candidateProfile.skills, newSkill],
      });
    }
  };

  // Remove a skill from the candidate profile
  const handleRemoveSkill = (skillToRemove: string) => {
    if (!candidateProfile) return;
    updateProfile({
      ...candidateProfile,
      skills: candidateProfile.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Effective profile ensuring SSR/Client match
  const effectiveProfile = mounted ? candidateProfile : null;

  // Compute matched and ranked jobs
  const rankedJobs: JobMatchAnalysis[] = useMemo(() => {
    const candidateSkills = effectiveProfile?.skills || [];
    return rankJobs(allJobs, candidateSkills);
  }, [allJobs, effectiveProfile]);

  // Apply search, workType, and employment type filtering
  // When profile is uploaded, only show jobs with at least 1 matched skill (showOnlyMatching)
  const filteredJobs = useMemo(() => {
    return rankedJobs.filter((job) => {
      // Only-matching filter: hide jobs with 0 matched skills when CV is uploaded
      // (Unless user is actively selecting a specific category or searching a keyword to explore)
      const isExploring = (filter.category && filter.category !== "Semua") || filter.keyword.trim() !== "";
      if (effectiveProfile && showOnlyMatching && !isExploring && job.matched_skills.length === 0) {
        return false;
      }

      // Keyword filter
      if (filter.keyword.trim() !== "") {
        const q = filter.keyword.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchSkill = job.skills.some((s) => s.toLowerCase().includes(q));
        const matchDesc = job.description.toLowerCase().includes(q);
        const matchLoc = job.location.toLowerCase().includes(q);
        if (!matchTitle && !matchCompany && !matchSkill && !matchDesc && !matchLoc) {
          return false;
        }
      }

      // Category / Bidang filter
      if (filter.category && filter.category !== "Semua") {
        if (job.category !== filter.category) return false;
      }

      // Work type filter
      if (filter.workType !== "Semua") {
        if ((job as any).workType !== filter.workType) return false;
      }

      // Employment type filter
      if (filter.employmentType !== "Semua") {
        if (job.type.toLowerCase() !== filter.employmentType.toLowerCase()) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === "score_desc") {
        if (b.match_score !== a.match_score) {
          return b.match_score - a.match_score;
        }
        // Prioritize Indonesia & WFH Indonesia jobs first
        const getPriority = (j: any) => (j.workType === "indonesia" ? 3 : j.workType === "remote_indonesia" ? 2 : 1);
        return getPriority(b) - getPriority(a);
      }
      if (filter.sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      if (filter.sortBy === "company_asc") {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });
  }, [rankedJobs, filter, effectiveProfile, showOnlyMatching]);

  // Count all jobs that have ≥1 matched skill (for "X sesuai dari Y total" display)
  const matchingCount = useMemo(() => {
    if (!effectiveProfile) return 0;
    return rankedJobs.filter((j) => j.matched_skills.length > 0).length;
  }, [rankedJobs, effectiveProfile]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar isBackendConnected={isBackendConnected} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-zinc-200/80 bg-gradient-to-b from-indigo-50/50 via-white to-zinc-50 py-12 dark:border-zinc-800 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
                <Globe className="h-3.5 w-3.5" />
                <span>Live Job API Integration — Data Riil Tanpa Dummy</span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
                Temukan Lowongan yang{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                  Paling Sesuai
                </span>{" "}
                dengan Skill CV Kamu
              </h1>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                Upload CV asli kamu dalam format PDF atau DOCX. Sistem akan mengekstrak keahlian nyata dan mencocokkannya langsung dengan lowongan aktif dari Job API eksternal.
              </p>

              {/* Quick Feature Pills */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Live API Lowongan Indonesia & WFH (Kalibrr & Grab)
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                  Ekstraksi Riil PDF & DOCX (PyMuPDF)
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                  <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                  Match Score & Gap Transparan
                </span>
              </div>
            </div>

            {/* Upload & Candidate Profile Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
              {/* Upload CV Panel */}
              <div className="lg:col-span-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      1
                    </span>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Unggah File CV Kamu
                    </h2>
                  </div>
                  <span className="text-[11px] text-zinc-400">
                    PDF / DOCX &bull; Maks 5MB
                  </span>
                </div>

                <UploadCV
                  onProfileLoaded={updateProfile}
                  isProcessing={isProcessingCV}
                  onAnalyzeFile={handleAnalyzeFile}
                  currentProfile={effectiveProfile}
                />
              </div>

              {/* Candidate Profile Panel */}
              <div className="lg:col-span-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      2
                    </span>
                    <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                      Profil & Ekstraksi Keahlian
                    </h2>
                  </div>
                  {effectiveProfile && (
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ✓ CV Terdeteksi
                    </span>
                  )}
                </div>

                {effectiveProfile ? (
                  <CandidateProfileCard
                    profile={effectiveProfile}
                    onAddSkill={handleAddSkill}
                    onRemoveSkill={handleRemoveSkill}
                    showFindJobsButton={true}
                    onFindJobsClick={() => {
                      const el = document.getElementById("job-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 p-8 text-center bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                      <FileCheck2 className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Belum Ada CV yang Diunggah
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                      Silakan unggah dokumen CV asli Anda di panel samping. Sistem akan mengekstrak keahlian nyata dan mencocokkannya dengan lowongan kerja dari live API.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Job Listings & Match Analysis Section */}
        <section id="job-section" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  3
                </span>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                  {effectiveProfile?.skills?.length
                    ? "Lowongan yang Sesuai dengan Skill CV Anda"
                    : "Daftar Lowongan Kerja Aktif (Live API)"}
                </h2>
              </div>
              {effectiveProfile?.skills?.length ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{matchingCount}</span>
                    {" "} lowongan sesuai dari{" "}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">{rankedJobs.length}</span>
                    {" "} total lowongan berdasarkan{" "}
                    <span className="font-semibold">{effectiveProfile.skills.length} keahlian</span> di CV Anda.
                  </p>
                  {/* Toggle: hanya sesuai / tampilkan semua */}
                  <button
                    type="button"
                    onClick={() => setShowOnlyMatching((v) => !v)}
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                      showOnlyMatching
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300"
                        : "border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {showOnlyMatching ? "✓ Hanya yang Sesuai" : "☰ Tampilkan Semua"}
                  </button>
                </div>
              ) : (
                <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                  Data lowongan kerja nyata dari JobStreet Indonesia, Kalibrr, Grab, BCA, Telkom, Astra, Gojek, dan perusahaan terkemuka.
                </p>
              )}
            </div>

            {/* Score Legend */}
            {effectiveProfile && (
              <div className="hidden xl:flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white p-2 text-[11px] dark:border-zinc-800 dark:bg-zinc-900">
                <span className="font-semibold text-zinc-500 mr-1">Klasifikasi:</span>
                <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">90-100% Excellent</span>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">75-89% Strong</span>
                <span className="rounded bg-amber-100 px-1.5 py-0.5 font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">60-74% Good</span>
                <span className="rounded bg-orange-100 px-1.5 py-0.5 font-bold text-orange-800 dark:bg-orange-950 dark:text-orange-300">40-59% Partial</span>
                <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">&lt;40% Low</span>
              </div>
            )}
          </div>

          {/* Filter Bar */}
          <div className="mt-6">
            <JobFilter
              filter={filter}
              onFilterChange={setFilter}
              totalResults={filteredJobs.length}
            />
          </div>

          {/* Job Cards Grid */}
          <div className="mt-6">
            {isLoadingJobs ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white p-16 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                <p className="mt-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Memuat lowongan kerja riil langsung dari Job API...
                </p>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Mengambil data lowongan aktif dari JobStreet Indonesia, Kalibrr, dan mitra karir resmi
                </p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onSelect={setSelectedJob}
                    candidateSkillsCount={effectiveProfile?.skills?.length || 0}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                  <Filter className="h-7 w-7" />
                </div>
                {effectiveProfile && showOnlyMatching && matchingCount === 0 ? (
                  <>
                    <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">
                      Belum Ada Lowongan yang Cocok dengan Skill Anda
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                      Skill dari CV Anda belum terdeteksi cocok dengan lowongan yang tersedia. Coba tambahkan lebih banyak skill, atau lihat semua lowongan.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowOnlyMatching(false)}
                      className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                    >
                      Tampilkan Semua Lowongan
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">
                      Tidak Ada Lowongan yang Sesuai Filter
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                      Coba gunakan kata kunci lain, atau reset filter pencarian.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFilter({ keyword: "", location: "Semua", category: "Semua", workType: "Semua", employmentType: "Semua", sortBy: "score_desc" });
                        setShowOnlyMatching(true);
                      }}
                      className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                    >
                      Reset Semua Filter
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        candidateSkillsCount={effectiveProfile?.skills?.length || 0}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">AI Job Matcher</span>
            <span>&bull;</span>
            <span>Live Job API + FastAPI CV Parser</span>
          </div>
          <p>
            Data lowongan kerja riil diambil langsung melalui Job API publik sesuai spesifikasi PRD.
          </p>
        </div>
      </footer>
    </div>
  );
}
