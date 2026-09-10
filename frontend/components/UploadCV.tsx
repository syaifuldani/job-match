"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2, X } from "lucide-react";
import { CandidateProfile } from "@/types/job";

interface UploadCVProps {
  onProfileLoaded: (profile: CandidateProfile) => void;
  isProcessing: boolean;
  onAnalyzeFile: (file: File) => Promise<void>;
  currentProfile: CandidateProfile | null;
}

export const UploadCV: React.FC<UploadCVProps> = ({
  onProfileLoaded,
  isProcessing,
  onAnalyzeFile,
  currentProfile,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsingStep, setParsingStep] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validate size (5MB) per FR-01
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage("Your CV is too large. Maximum file size is 5 MB.");
      return;
    }

    const name = file.name.toLowerCase();
    if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
      setErrorMessage("Unsupported file format. Please upload PDF or DOCX.");
      return;
    }

    if (file.size === 0) {
      setErrorMessage("The uploaded file is empty. Please upload another file.");
      return;
    }

    try {
      setParsingStep(`Mengekstrak teks & skill dari ${file.name}...`);
      await onAnalyzeFile(file);
    } catch (err: any) {
      setErrorMessage(
        err?.message || "We couldn't extract text from this CV. Please upload another file."
      );
    } finally {
      setParsingStep("");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {/* Upload Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer ${
          isDragOver
            ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
            : currentProfile
            ? "border-emerald-300 bg-emerald-50/30 dark:border-emerald-900/60 dark:bg-emerald-950/10 hover:border-emerald-400"
            : "border-zinc-300 bg-zinc-50/60 hover:border-indigo-400 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-indigo-500"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                {parsingStep || "Memproses dan mengekstrak skill CV..."}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Membaca isi dokumen dan mengidentifikasi keahlian teknis secara riil
              </p>
            </div>
          </div>
        ) : currentProfile ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                CV Berhasil Dianalisis:{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {currentProfile.file_name || "Dokumen CV"}
                </span>
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {currentProfile.skills.length} keahlian riil terdeteksi • Klik untuk mengunggah CV lain
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-950 dark:text-indigo-400">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Drag & drop CV kamu di sini, atau{" "}
                <span className="text-indigo-600 underline dark:text-indigo-400">pilih file</span>
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Format yang didukung:{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">PDF, DOCX</span>{" "}
                (Maksimal 5 MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message per Section 24 */}
      {errorMessage && (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Peringatan Dokumen CV</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
