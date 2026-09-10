"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CandidateProfile } from "@/types/job";
import { User, GraduationCap, Briefcase, Plus, X, Sparkles, ArrowRight } from "lucide-react";

interface CandidateProfileCardProps {
  profile: CandidateProfile;
  onAddSkill: (skill: string) => void;
  onRemoveSkill: (skill: string) => void;
  onResetSkills?: () => void;
  showFindJobsButton?: boolean;
  onFindJobsClick?: () => void;
}

export const CandidateProfileCard: React.FC<CandidateProfileCardProps> = ({
  profile,
  onAddSkill,
  onRemoveSkill,
  showFindJobsButton = true,
  onFindJobsClick,
}) => {
  const [newSkillInput, setNewSkillInput] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !profile.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      onAddSkill(trimmed);
      setNewSkillInput("");
      setIsAdding(false);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white p-5 shadow-sm dark:border-indigo-950/60 dark:from-indigo-950/20 dark:to-zinc-900">
      {/* Title & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/80 pb-3 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Your CV Analysis
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Hasil ekstraksi teks & keahlian CV kamu
            </p>
          </div>
        </div>

        {/* Level & Education Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {profile.experience_level && (
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Experience Level</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Briefcase className="h-3 w-3 text-zinc-500" />
                {profile.experience_level}
              </span>
            </div>
          )}
          {profile.education && (
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Education</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <GraduationCap className="h-3.5 w-3.5 text-zinc-500" />
                {profile.education}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Skills Section with Interactive Tag Management */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Skills ({profile.skills.length})
          </span>
          <span className="text-[11px] text-zinc-400">
            Klik × untuk menghapus, atau tambah skill
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {profile.skills.map((skill) => (
            <span
              key={skill}
              className="group inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-800 shadow-sm transition hover:border-indigo-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              <span>[{skill}]</span>
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                className="ml-0.5 rounded p-0.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-700"
                title={`Hapus ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {/* Add skill input or trigger button */}
          {isAdding ? (
            <form onSubmit={handleAddSubmit} className="inline-flex items-center gap-1">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Nama skill..."
                className="h-7 w-28 rounded-md border border-indigo-400 bg-white px-2 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-indigo-600 dark:bg-zinc-800 dark:text-white"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-md p-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center gap-1 rounded-lg border border-dashed border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-500 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-indigo-400"
            >
              <Plus className="h-3 w-3" />
              Tambah Skill
            </button>
          )}
        </div>
      </div>

      {/* Recommended Roles */}
      {profile.recommended_roles && profile.recommended_roles.length > 0 && (
        <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            Recommended Roles
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {profile.recommended_roles.map((role) => (
              <span
                key={role}
                className="rounded-lg bg-indigo-50 border border-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/60 dark:text-indigo-300"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Section 23: [Find Matching Jobs] CTA Button */}
      {showFindJobsButton && (
        <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          {onFindJobsClick ? (
            <button
              type="button"
              onClick={onFindJobsClick}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              <span>Find Matching Jobs (Temukan Lowongan Cocok)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              href="/jobs"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700"
            >
              <Sparkles className="h-4 w-4" />
              <span>Find Matching Jobs (Temukan Lowongan Cocok)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};
