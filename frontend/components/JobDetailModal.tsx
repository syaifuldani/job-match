"use client";

import React, { useEffect } from "react";
import { JobMatchAnalysis } from "@/types/job";
import { MatchScoreBadge } from "./MatchScoreBadge";
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  Banknote,
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";

interface JobDetailModalProps {
  job: JobMatchAnalysis | null;
  onClose: () => void;
  candidateSkillsCount: number;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  candidateSkillsCount,
}) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Content */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 p-6 pb-5 dark:border-zinc-800">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>{job.company}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
              {job.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
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

          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Match Score Hero Breakdown (Section 11 & 12 PRD) */}
          {candidateSkillsCount > 0 ? (
            <div className="space-y-3">
              <MatchScoreBadge
                score={job.match_score}
                classification={job.classification}
                size="lg"
              />

              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span>
                    Formula Kecocokan: {job.matched_skills.length} dari {job.skills.length} skill yang dibutuhkan cocok ({job.match_score}%)
                  </span>
                </div>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                  Skor dihitung otomatis berdasarkan perbandingan keahlian di CV Anda dengan kualifikasi spesifik lowongan pekerjaan ini.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
              <div className="flex items-center gap-2 font-semibold">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Upload CV untuk Melihat Match Analysis</span>
              </div>
              <p className="mt-1 text-blue-800/80 dark:text-blue-300">
                Unggah CV Anda di bagian atas untuk melihat kecocokan dan skill gap secara mendalam.
              </p>
            </div>
          )}

          {/* Matched vs Missing Skills Breakdown */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Matched Skills */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/30 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300 text-xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Skill yang Cocok ({job.matched_skills.length})</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.matched_skills.length > 0 ? (
                  job.matched_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-200"
                    >
                      ✓ {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic">
                    Belum ada skill yang cocok
                  </p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
              <div className="flex items-center gap-2 font-semibold text-zinc-700 dark:text-zinc-300 text-xs">
                <CircleDashed className="h-4 w-4 text-zinc-500" />
                <span>Skill Tambahan / Gap ({job.missing_skills.length})</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.missing_skills.length > 0 ? (
                  job.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-white border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
                    >
                      ○ {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-emerald-600 font-medium">
                    Luar biasa! Semua skill lowongan telah Anda penuhi.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Deskripsi Pekerjaan
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements list */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Kualifikasi & Persyaratan
              </h4>
              <ul className="mt-2 space-y-1.5">
                {job.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0 dark:bg-indigo-400" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer with Apply CTA */}
        <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/60">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
          >
            Tutup
          </button>

          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:scale-[1.02]"
          >
            <span>Lamar Sekarang (Apply Now)</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
