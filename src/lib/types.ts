export type UUID = string;

export type EducationLevel =
  | "high_school"
  | "undergraduate"
  | "graduate"
  | "self_taught";

export type LearningStyle = "visual" | "auditory" | "reading" | "kinesthetic";

export type RoadmapStatus = "draft" | "active" | "completed" | "paused";

export type MilestoneStatus = "locked" | "in_progress" | "completed";

export interface Profile {
  id: UUID;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  education_level: EducationLevel | null;
  study_hours_per_week: number | null;
  goals: string | null;
  learning_style: LearningStyle | null;
  xp: number;
  coins: number;
  level: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_active_day: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentQuestion {
  id: string;
  category:
    | "interest"
    | "skills"
    | "personality"
    | "goals"
    | "learning_style"
    | "study_availability"
    | "education";
  text: string;
  type: "rating" | "choice" | "multiselect";
  options?: string[];
  min?: number;
  max?: number;
  weight?: number;
}

export interface AssessmentResponse {
  question_id: string;
  category: AssessmentQuestion["category"];
  answer: number | string | string[];
}

export type AssessmentStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export interface Assessment {
  id: UUID;
  user_id: UUID;
  status: AssessmentStatus;
  current_question_index: number;
  responses: AssessmentResponse[];
  started_at: string | null;
  completed_at: string | null;
}

export interface AnalysisReport {
  id: UUID;
  user_id: UUID;
  strengths: string[];
  growth_areas: string[];
  learning_style: LearningStyle;
  study_capacity_hours: number;
  recommended_pace: string;
  summary: string;
  created_at: string;
}

export interface Career {
  id: UUID;
  title: string;
  description: string;
  category: string;
  required_skills: string[];
  salary_range: string;
  demand: "low" | "medium" | "high" | "very_high";
  icon: string;
}

export interface CareerRecommendation {
  id: UUID;
  user_id: UUID;
  career_id: UUID;
  match_percentage: number;
  reasons: string[];
  required_skills: string[];
  existing_strengths: string[];
  growth_opportunities: string[];
  is_selected: boolean;
  created_at: string;
}

export interface Course {
  id: UUID;
  title: string;
  description: string;
  duration_weeks: number;
  status: "pending" | "in_progress" | "completed";
}

export interface Milestone {
  id: UUID;
  title: string;
  description: string;
  order_index: number;
  status: MilestoneStatus;
  courses: Course[];
}

export interface Roadmap {
  id: UUID;
  user_id: UUID;
  career_id: UUID;
  career_title: string;
  status: RoadmapStatus;
  milestones: Milestone[];
  created_at: string;
}

export interface Badge {
  id: UUID;
  key: string;
  name: string;
  description: string;
  icon: string;
  xp_required: number | null;
  criteria: string | null;
}

export interface UserBadge {
  badge_key: string;
  earned_at: string;
}

export interface XpTransaction {
  id: UUID;
  user_id: UUID;
  amount: number;
  reason: string;
  created_at: string;
}

export type RewardType = "xp" | "coins";

export interface RewardGrant {
  type: RewardType;
  amount: number;
  reason: string;
}

export interface CareerReadiness {
  technical_skills: number;
  communication: number;
  projects: number;
  resume_quality: number;
  interview_readiness: number;
  overall: number;
  suggestions: string[];
}
