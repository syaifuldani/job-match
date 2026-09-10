export type EmploymentType = "Full Time" | "Part Time" | "Internship" | "Contract";
export type WorkType = "indonesia" | "remote_indonesia" | "remote_global";

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  workType?: WorkType;
  type: EmploymentType;
  skills: string[];
  description: string;
  requirements?: string[];
  url: string;
  salary?: string;
  category?: string;
  experience_level?: string;
  posted_at?: string;
  source?: string;
}

export interface CandidateProfile {
  skills: string[];
  education?: string;
  experience_level: string;
  recommended_roles: string[];
  raw_text?: string;
  file_name?: string;
}

export type ScoreClassification = 
  | "Excellent Match" 
  | "Strong Match" 
  | "Good Match" 
  | "Partial Match" 
  | "Low Match";

export interface JobMatchAnalysis {
  id: number;
  title: string;
  company: string;
  location: string;
  workType?: WorkType;
  type: EmploymentType;
  category?: string;
  skills: string[];
  description: string;
  requirements?: string[];
  url: string;
  salary?: string;
  experience_level?: string;
  posted_at?: string;
  source?: string;
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  classification: ScoreClassification;
}

export interface FilterState {
  keyword: string;
  location: string;
  category: string;
  workType: "Semua" | "indonesia" | "remote_indonesia" | "remote_global";
  employmentType: string;
  sortBy: "score_desc" | "title_asc" | "company_asc";
}
