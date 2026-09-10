"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { JobFilter } from "@/components/JobFilter";
import { JobCard } from "@/components/JobCard";
import { JobDetailModal } from "@/components/JobDetailModal";
import { CandidateProfile, FilterState, JobMatchAnalysis, Job } from "@/types/job";
import { getJobs, checkBackendHealth } from "@/lib/api";
import { rankJobs } from "@/lib/matcher";
import { getStoredProfile } from "@/lib/storage";
import { Sparkles, ArrowLeft, UploadCloud, CheckCircle2, Filter, Loader2 } from "lucide-react";

export default function JobsPage() {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState<boolean>(true);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<JobMatchAnalysis | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  const [filter, setFilter] = useState<FilterState>({
    keyword: "",
    location: "Semua",
    category: "Semua",
    workType: "Semua",
    employmentType: "Semua",
    sortBy: "score_desc",
  });

  useEffect(() => {
    setMounted(true);
    // Load stored profile
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

  const effectiveProfile = mounted ? candidateProfile : null;

  // Compute matched and ranked jobs
  const rankedJobs: JobMatchAnalysis[] = useMemo(() => {
    const candidateSkills = effectiveProfile?.skills || [];
    return rankJobs(allJobs, candidateSkills);
  }, [allJobs, effectiveProfile]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return rankedJobs.filter((job) => {
      if (filter.keyword.trim() !== "") {
        const q = filter.keyword.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchSkill = job.skills.some((s) => s.toLowerCase().includes(q));
        const matchDesc = job.description.toLowerCase().includes(q);
        const matchLoc = job.location.toLowerCase().includes(q);
        if (!matchTitle && !matchCompany && !matchSkill && !matchDesc && !matchLoc) return false;
      }

      if (filter.category && filter.category !== "Semua") {
        if (job.category !== filter.category) return false;
      }

      if (filter.workType !== "Semua") {
        if ((job as any).workType !== filter.workType) return false;
      }

      if (filter.employmentType !== "Semua") {
        if (job.type.toLowerCase() !== filter.employmentType.toLowerCase()) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filter.sortBy === "score_desc") {
        if (b.match_score !== a.match_score) return b.match_score - a.match_score;
        const getPriority = (j: any) => (j.workType === "indonesia" ? 3 : j.workType === "remote_indonesia" ? 2 : 1);
        return getPriority(b) - getPriority(a);
      }
      if (filter.sortBy === "title_asc") return a.title.localeCompare(b.title);
      if (filter.sortBy === "company_asc") return a.company.localeCompare(b.company);
      return 0;
    });
  }, [rankedJobs, filter]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar isBackendConnected={isBackendConnected} />

      <main className="flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top navigation & Candidate Banner */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-indigo-600 transition dark:text-zinc-400"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Beranda</span>
              </Link>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Daftar Rekomendasi Lowongan (Live API)
              </span>
            </div>

            {/* Profile Status Banner */}
            {effectiveProfile ? (
              <div className="flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/80 px-4 py-2 text-xs text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    CV Aktif: <strong>{effectiveProfile.skills.length} skills</strong> ({effectiveProfile.file_name || "Dokumen CV"})
                  </span>
                </div>
                <Link
                  href="/upload"
                  className="rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-indigo-700"
                >
                  Edit Skill / Ganti CV
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                <span>Belum upload CV?</span>
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-indigo-700"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Upload CV Sekarang</span>
                </Link>
              </div>
            )}
          </div>

          {/* Section Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {effectiveProfile
                ? "Lowongan yang Paling Cocok untuk Anda"
                : "Semua Lowongan Kerja Aktif (Live API)"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              {effectiveProfile
                ? `Diurutkan dari skor kecocokan tertinggi berdasarkan ${effectiveProfile.skills.length} keahlian riil di CV Anda.`
                : "Daftar lowongan kerja teknologi nyata yang diambil secara live dari Job API publik."}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="mt-6">
            <JobFilter
              filter={filter}
              onFilterChange={setFilter}
              totalResults={filteredJobs.length}
            />
          </div>

          {/* Job Card Grid */}
          <div className="mt-6">
            {isLoadingJobs ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white p-16 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                <p className="mt-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  Memuat lowongan kerja riil dari Job API...
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
              <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                  <Filter className="h-7 w-7" />
                </div>
                <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-white">
                  Tidak Ada Lowongan yang Sesuai
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                  Coba sesuaikan kata kunci atau reset filter pencarian Anda.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setFilter({
                      keyword: "",
                      location: "Semua",
                      category: "Semua",
                      workType: "Semua",
                      employmentType: "Semua",
                      sortBy: "score_desc",
                    })
                  }
                  className="mt-5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Reset Semua Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal Detail */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        candidateSkillsCount={effectiveProfile?.skills?.length || 0}
      />
    </div>
  );
}
