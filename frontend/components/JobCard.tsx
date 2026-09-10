"use client";

import React from "react";
import { JobMatchAnalysis } from "@/types/job";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { MapPin, Briefcase, Building2, Check, Circle, ArrowUpRight, Banknote, Globe, Wifi } from "lucide-react";

interface JobCardProps {
  job: JobMatchAnalysis;
  onSelect: (job: JobMatchAnalysis) => void;
  candidateSkillsCount: number;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSelect,
  candidateSkillsCount,
}) => {
  const hasProfile = candidateSkillsCount > 0;

  const workTypeBadge = (() => {
    const wt = (job as any).workType;
    if (wt === "indonesia") return { label: "🇮🇩 Indonesia", cls: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-800" };
    if (wt === "remote_indonesia") return { label: "🏠 Remote WFH (ID)", cls: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800" };
    if (wt === "remote_global") return { label: "🌐 Remote WFH (Global)", cls: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800" };
    return null;
  })();

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-indigo-500/50">
      {/* Top Header: Title, Company, Match Score */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 flex-1 min-w-0">
            {/* Work type + source badges */}
            <div className="flex flex-wrap gap-1 mb-1">
              {workTypeBadge && (
                <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-semibold ${workTypeBadge.cls}`}>
                  {workTypeBadge.label}
                </span>
              )}
              {(job as any).source && (
                <span className="inline-block rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400">
                  via {(job as any).source}
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400 line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <Building2 className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>

          {/* Match Score Badge */}
          {hasProfile ? (
            <MatchScoreBadge
              score={job.match_score}
              classification={job.classification}
              size="md"
            />
          ) : (
            <span className="rounded-lg bg-zinc-100 border border-zinc-200/80 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 shrink-0">
              Upload CV to Match
            </span>
          )}
        </div>

        {/* Location, Type, and Salary metadata */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5 text-zinc-400" />
            <span>{job.type}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1 text-emerald-600 font-medium dark:text-emerald-400">
              <Banknote className="h-3.5 w-3.5" />
              <span>{job.salary}</span>
            </div>
          )}
        </div>

        {/* Brief description */}
        <p className="mt-3 text-xs text-zinc-600 line-clamp-2 dark:text-zinc-300">
          {job.description}
        </p>

        {/* Skills Section */}
        <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
            {hasProfile ? (
              <span>
                Kecocokan Skill ({job.matched_skills.length}/{job.skills.length} cocok):
              </span>
            ) : (
              <span>Kualifikasi Skill yang Dibutuhkan:</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {hasProfile ? (
              <>
                {/* Matched Skills */}
                {job.matched_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300"
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                    {skill}
                  </span>
                ))}

                {/* Missing Skills */}
                {job.missing_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-md bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-600 border border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700 dark:text-zinc-400"
                  >
                    <Circle className="h-2.5 w-2.5 text-zinc-400" />
                    {skill}
                  </span>
                ))}
              </>
            ) : (
              /* Standard neutral skills when no CV is uploaded yet */
              job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 dark:border-zinc-800">
        <span className="text-[11px] text-zinc-400 truncate">
          {job.posted_at || "Aktif"}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            suppressHydrationWarning
            onClick={() => onSelect(job)}
            className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 bg-white px-2.5 py-2 text-xs font-medium text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            <span>Detail</span>
          </button>
          {job.url && job.url !== "#" && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
            >
              <span>Lamar</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
