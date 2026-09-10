"use client";

import React from "react";
import { FilterState } from "@/types/job";
import { Search, MapPin, Briefcase, ArrowUpDown, X, Globe, Building2, Wifi } from "lucide-react";

interface JobFilterProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  totalResults: number;
}

const WORK_TYPES: { value: FilterState["workType"]; label: string; icon: React.ReactNode }[] = [
  { value: "Semua", label: "Semua", icon: null },
  {
    value: "indonesia",
    label: "🇮🇩 Indonesia",
    icon: <Building2 className="h-3.5 w-3.5" />,
  },
  {
    value: "remote_indonesia",
    label: "🏠 Remote WFH (ID)",
    icon: <Wifi className="h-3.5 w-3.5" />,
  },
  {
    value: "remote_global",
    label: "🌐 Remote WFH (Luar Negeri)",
    icon: <Globe className="h-3.5 w-3.5" />,
  },
];

const EMPLOYMENT_TYPES = ["Semua", "Full Time", "Part Time", "Internship", "Contract"];

export const JOB_CATEGORIES = [
  "Semua",
  "Teknologi & IT",
  "Manajemen & Bisnis",
  "Marketing & Sales",
  "Keuangan & Akuntansi",
  "HR & Personalia",
  "Administrasi",
  "Desain & Kreatif",
];

export const JobFilter: React.FC<JobFilterProps> = ({
  filter,
  onFilterChange,
  totalResults,
}) => {
  const hasActiveFilters =
    filter.keyword !== "" ||
    filter.location !== "Semua" ||
    (filter.category && filter.category !== "Semua") ||
    filter.workType !== "Semua" ||
    filter.employmentType !== "Semua";

  const handleReset = () => {
    onFilterChange({
      keyword: "",
      location: "Semua",
      category: "Semua",
      workType: "Semua",
      employmentType: "Semua",
      sortBy: "score_desc",
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-5">
      {/* Top row: Search and Sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={filter.keyword}
            onChange={(e) =>
              onFilterChange({ ...filter, keyword: e.target.value })
            }
            placeholder="Cari berdasarkan posisi, perusahaan, skill, atau lokasi..."
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-white dark:focus:bg-zinc-800"
          />
          {filter.keyword && (
            <button
              onClick={() => onFilterChange({ ...filter, keyword: "" })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-zinc-400" />
          <select
            value={filter.sortBy}
            onChange={(e) =>
              onFilterChange({
                ...filter,
                sortBy: e.target.value as FilterState["sortBy"],
              })
            }
            className="rounded-xl border border-zinc-200 bg-zinc-50/50 px-3 py-2.5 text-xs font-medium text-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300"
          >
            <option value="score_desc">Match Score Tertinggi</option>
            <option value="title_asc">Posisi (A - Z)</option>
            <option value="company_asc">Perusahaan (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Category / Bidang Row */}
      <div className="mt-4 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mr-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span className="font-medium">Bidang / Kategori:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {JOB_CATEGORIES.map((cat) => {
              const active = (filter.category || "Semua") === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onFilterChange({ ...filter, category: cat })}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat === "Semua" ? "Semua Bidang" : cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Work Type Row (Indonesia / Remote ID / Remote Global) */}
      <div className="mt-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mr-1">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-medium">Area Kerja:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {WORK_TYPES.map(({ value, label }) => {
              const active = filter.workType === value;
              return (
                <button
                  key={value}
                  onClick={() => onFilterChange({ ...filter, workType: value })}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    active
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Employment Type Row + result count */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mr-1">
            <span className="font-medium">Tipe:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {EMPLOYMENT_TYPES.map((type) => {
              const active = filter.employmentType === type;
              return (
                <button
                  key={type}
                  onClick={() =>
                    onFilterChange({ ...filter, employmentType: type })
                  }
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>

        {/* Total results count + reset */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            Ditemukan{" "}
            <strong className="text-zinc-900 dark:text-white">{totalResults}</strong>{" "}
            lowongan
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="font-medium text-indigo-600 underline hover:text-indigo-800 dark:text-indigo-400"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
