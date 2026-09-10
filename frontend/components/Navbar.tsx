"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Briefcase, UploadCloud } from "lucide-react";

interface NavbarProps {
  isBackendConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isBackendConnected = false }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                AI Job Matcher
              </span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                MVP v1.0
              </span>
            </div>
            <p className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
              Upload CV & Temukan Lowongan Sesuai Skill Kamu
            </p>
          </div>
        </Link>

        {/* Navigation Links per Section 22 PRD */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/upload"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              pathname === "/upload"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            <UploadCloud className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Upload CV</span>
          </Link>

          <Link
            href="/jobs"
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              pathname === "/jobs"
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            <Briefcase className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Daftar Lowongan</span>
          </Link>

          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <span
              className={`h-2 w-2 rounded-full ${
                isBackendConnected ? "bg-emerald-500 animate-pulse" : "bg-blue-500"
              }`}
            />
            <span>{isBackendConnected ? "FastAPI Connected" : "Local Engine"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
