import React from "react";
import { ScoreClassification } from "@/types/job";
import { getScoreBadgeStyles } from "@/lib/matcher";
import { Award, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface MatchScoreBadgeProps {
  score: number;
  classification: ScoreClassification;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  classification,
  size = "md",
  showLabel = true,
}) => {
  const styles = getScoreBadgeStyles(classification);

  if (size === "sm") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles.bg} ${styles.border} ${styles.text}`}
      >
        <span className="font-bold">{score}%</span>
        {showLabel && <span>{classification}</span>}
      </div>
    );
  }

  if (size === "lg") {
    return (
      <div className={`flex flex-col gap-2 rounded-2xl border p-4 sm:p-5 ${styles.bg} ${styles.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className={`h-5 w-5 ${styles.text}`} />
            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              Match Score
            </span>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${styles.badge}`}>
            {classification}
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <span className={`text-4xl font-extrabold tracking-tight sm:text-5xl ${styles.text}`}>
            {score}%
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Kecocokan dengan skill CV kamu
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${styles.progress}`}
            style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
          />
        </div>
      </div>
    );
  }

  // Medium (Default for Job Cards)
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-semibold transition-all ${styles.bg} ${styles.border} ${styles.text}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-base font-extrabold">{score}%</span>
        {showLabel && (
          <span className="text-xs font-medium opacity-90">
            • {classification}
          </span>
        )}
      </div>
    </div>
  );
};
