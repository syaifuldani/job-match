"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { MatchScoreBadge } from "@/components/MatchScoreBadge";
import { JobMatchAnalysis, CandidateProfile } from "@/types/job";
import { getJobById } from "@/lib/api";
import { getStoredProfile } from "@/lib/storage";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Banknote,
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  UploadCloud,
  Sparkles,
  Loader2,
} from "lucide-react";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobMatchAnalysis | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const jobId = Number(params?.id);
    const stored = getStoredProfile();
    setCandidateProfile(stored);

    if (jobId) {
      setIsLoading(true);
      getJobById(jobId, stored?.skills || [])
        .then(({ job: found }) => {
          setJob(found);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [params]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <p className="mt-3 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
            Memuat detail lowongan...
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
            Lowongan Tidak Ditemukan
          </h2>
          <p className="mt-2 text-xs text-zinc-500">
            Lowongan dengan ID tersebut tidak ditemukan dalam dataset.
          </p>
          <Link
            href="/"
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const hasProfile = mounted && candidateProfile && candidateProfile.skills.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-indigo-600 transition dark:text-zinc-400 dark:hover:text-indigo-400 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Pencarian Lowongan</span>
          </Link>

          {/* Job Card Container */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{job.company}</span>
                </div>
                <h1 className="mt-1 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  {job.title}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
                    {job.type}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                      <Banknote className="h-3.5 w-3.5" />
                      {job.salary}
                    </span>
                  )}
                </div>
              </div>

              {/* Apply Button */}
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 transition"
              >
                <span>Lamar Sekarang</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Match Score Hero Card */}
            {hasProfile ? (
              <div className="my-6">
                <MatchScoreBadge
                  score={job.match_score}
                  classification={job.classification}
                  size="lg"
                />
              </div>
            ) : (
              <div className="my-6 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    Ingin melihat kecocokan dengan CV Anda?
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Upload CV asli Anda untuk menghitung skor kecocokan secara personal.
                  </p>
                </div>
                <Link
                  href="/upload"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload CV</span>
                </Link>
              </div>
            )}

            {/* Matched & Missing Skills or Required Skills */}
            <div className="my-6">
              {hasProfile ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Keahlian yang Cocok ({job.matched_skills.length})</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-200"
                        >
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
                    <div className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-300 text-xs">
                      <CircleDashed className="h-4 w-4 text-zinc-500" />
                      <span>Skill Tambahan / Gap ({job.missing_skills.length})</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-white border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                        >
                          ○ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Kualifikasi Keahlian yang Dibutuhkan
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Deskripsi Pekerjaan
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Persyaratan Kualifikasi
                </h3>
                <ul className="mt-3 space-y-2">
                  {job.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0 dark:bg-indigo-400" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
