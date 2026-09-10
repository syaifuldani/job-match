"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { UploadCV } from "@/components/UploadCV";
import { CandidateProfileCard } from "@/components/CandidateProfileCard";
import { CandidateProfile } from "@/types/job";
import { analyzeCV, checkBackendHealth } from "@/lib/api";
import { getStoredProfile, saveStoredProfile } from "@/lib/storage";
import { Sparkles, ArrowRight, FileCheck, CheckCircle2 } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [isProcessingCV, setIsProcessingCV] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Load stored profile from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = getStoredProfile();
    if (stored) {
      setCandidateProfile(stored);
    }
    checkBackendHealth().then(setIsBackendConnected);
  }, []);

  const handleProfileLoaded = (profile: CandidateProfile) => {
    setCandidateProfile(profile);
    saveStoredProfile(profile);
  };

  const handleAnalyzeFile = async (file: File) => {
    setIsProcessingCV(true);
    try {
      const { profile } = await analyzeCV(file);
      handleProfileLoaded(profile);
    } finally {
      setIsProcessingCV(false);
    }
  };

  const handleAddSkill = (newSkill: string) => {
    if (!candidateProfile) {
      const initial: CandidateProfile = {
        skills: [newSkill],
        experience_level: "Entry Level",
        recommended_roles: ["Developer"],
      };
      handleProfileLoaded(initial);
      return;
    }

    if (!candidateProfile.skills.includes(newSkill)) {
      const updated: CandidateProfile = {
        ...candidateProfile,
        skills: [...candidateProfile.skills, newSkill],
      };
      handleProfileLoaded(updated);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!candidateProfile) return;
    const updated: CandidateProfile = {
      ...candidateProfile,
      skills: candidateProfile.skills.filter((s) => s !== skillToRemove),
    };
    handleProfileLoaded(updated);
  };

  const effectiveProfile = mounted ? candidateProfile : null;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <Navbar isBackendConnected={isBackendConnected} />

      <main className="flex-1 py-10 sm:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Section 22 & 23 PRD — Upload & CV Analysis</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Upload CV & Analisis Keahlian Riil
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
              Unggah file CV asli kamu dalam format PDF atau DOCX. Sistem akan mengekstrak keahlian nyata dan riwayat pendidikan tanpa data buatan.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
            {/* Left: Upload Dropzone */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Formulir Upload CV
                </h2>
                <span className="text-[11px] text-zinc-400">PDF / DOCX &bull; &lt; 5MB</span>
              </div>

              <UploadCV
                onProfileLoaded={handleProfileLoaded}
                isProcessing={isProcessingCV}
                onAnalyzeFile={handleAnalyzeFile}
                currentProfile={effectiveProfile}
              />
            </div>

            {/* Right: Candidate Profile per Section 23 */}
            <div>
              {effectiveProfile ? (
                <CandidateProfileCard
                  profile={effectiveProfile}
                  onAddSkill={handleAddSkill}
                  onRemoveSkill={handleRemoveSkill}
                  showFindJobsButton={true}
                  onFindJobsClick={() => router.push("/jobs")}
                />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-200 p-10 text-center bg-white/50 dark:border-zinc-800 dark:bg-zinc-900/30">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    Belum Ada CV yang Diunggah
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-xs">
                    Upload file CV asli Anda di sebelah kiri untuk melihat analisis keahlian dan rekomendasi posisi yang relevan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
