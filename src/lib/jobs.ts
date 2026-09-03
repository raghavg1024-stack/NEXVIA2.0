"use server";

import { createClient } from "@/lib/supabase/server";
import { type Job, type Scholarship, type Company, type CandidateProfile } from "./types";
import { calculateJobMatch, calculateScholarshipMatch, expandProfileTerms, termsAreRelated } from "./opportunity-matching";

export interface RemoteJob {
  id: string;
  title: string;
  url: string;
  apply_url: string;
  company: string;
  company_logo: string | null;
  category: string;
  location: string;
  salary_text: string | null;
  salary_min: number | null;
  salary_max: number | null;
  type: string;
  description: string;
  posted_at: string;
}

interface RemoteJobsResponse {
  data: Array<{
    id: string;
    title: string;
    url: string;
    apply_url: string;
    company: { name: string; logo_url: string | null };
    category: { name: string };
    location: string;
    salary_text: string | null;
    salary_min: number | null;
    salary_max: number | null;
    type: string;
    description: string;
    posted_at: string;
  }>;
  pagination?: { total: number };
}

const CAREER_MATCHES: Record<
  string,
  { category: string; keywords: string[] }
> = {
  "Software Engineer": {
    category: "programming",
    keywords: ["software", "engineer", "developer", "full stack", "frontend", "backend", "devops", "engineering"],
  },
  "Data Scientist": {
    category: "data-science",
    keywords: ["data", "analyst", "scientist", "machine learning", "analytics"],
  },
  "UX/UI Designer": {
    category: "design",
    keywords: ["designer", "design", "product designer", "ux", "ui"],
  },
  "Product Manager": {
    category: "programming",
    keywords: ["product manager", "product", "program manager", "technical product"],
  },
  "Data Analyst": {
    category: "data-science",
    keywords: ["data", "analyst", "analytics", "insights"],
  },
  "Technical Writer": {
    category: "writing",
    keywords: ["writer", "writing", "content", "documentation", "technical"],
  },
  "Cybersecurity Analyst": {
    category: "programming",
    keywords: ["security", "cyber", "analyst", "soc", "infosec"],
  },
  "Entrepreneur / Startup Founder": {
    category: "sales",
    keywords: ["founder", "startup", "business development", "growth"],
  },
  "Graphic Designer": {
    category: "design",
    keywords: ["graphic designer", "visual designer", "brand designer", "creative designer"],
  },
  "Digital Marketer": {
    category: "marketing",
    keywords: ["digital marketing", "seo", "content marketing", "growth marketing", "social media"],
  },
  "Project Manager": {
    category: "customer-support",
    keywords: ["project manager", "program manager", "project coordinator", "delivery manager"],
  },
  "Technical Project Manager": {
    category: "programming",
    keywords: ["technical project manager", "technical program manager", "engineering project manager"],
  },
  "Cloud Architect": {
    category: "programming",
    keywords: ["cloud architect", "solutions architect", "cloud engineer", "aws architect", "azure architect"],
  },
  "Product Designer": {
    category: "design",
    keywords: ["product designer", "ux designer", "ui designer", "interaction designer"],
  },
  "Financial Analyst": {
    category: "data-science",
    keywords: ["financial analyst", "finance analyst", "investment analyst", "fp&a"],
  },
  "Operations Manager": {
    category: "customer-support",
    keywords: ["operations manager", "business operations", "operations lead", "operations coordinator"],
  },
  "Sales Manager": {
    category: "sales",
    keywords: ["sales manager", "account executive", "sales lead", "business development"],
  },
  "Data Journalist": {
    category: "writing",
    keywords: ["data journalist", "data reporter", "research journalist", "data writer"],
  },
  "Data Science Specialist": {
    category: "data-science",
    keywords: ["data scientist", "data science", "machine learning scientist", "analytics scientist"],
  },
  "AI/ML Engineer": {
    category: "data-science",
    keywords: ["machine learning engineer", "ai engineer", "ml engineer", "applied scientist"],
  },
  "Quantitative Analyst": {
    category: "data-science",
    keywords: ["quantitative analyst", "quant analyst", "quantitative researcher", "risk analyst"],
  },
  "Registered Nurse": {
    category: "customer-support",
    keywords: ["registered nurse", "telehealth nurse", "clinical nurse", "nurse case manager"],
  },
  Chef: {
    category: "customer-support",
    keywords: ["chef", "culinary", "recipe developer", "food specialist"],
  },
  "Marketing Manager": {
    category: "marketing",
    keywords: ["marketing manager", "brand manager", "growth marketing", "product marketing"],
  },
  "Social Worker": {
    category: "customer-support",
    keywords: ["social worker", "case manager", "care coordinator", "community support"],
  },
};

const VALID_CATEGORIES = new Set([
  "programming",
  "design",
  "writing",
  "sales",
  "marketing",
  "customer-support",
  "data-science",
]);

function findCareerMatch(careerTitle: string) {
  for (const [career, match] of Object.entries(CAREER_MATCHES)) {
    if (careerTitle.toLowerCase().includes(career.toLowerCase())) {
      return match;
    }
  }
  const slug = careerTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return {
    category: VALID_CATEGORIES.has(slug) ? slug : "customer-support",
    keywords: [careerTitle],
  };
}

function matchesCareer(job: RemoteJob, keywords: string[]): boolean {
  const haystack = `${job.title} ${job.description} ${job.category}`.toLowerCase();
  return keywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

async function fetchCategoryJobs(
  category: string,
  limit: number
): Promise<RemoteJob[]> {
  const url = new URL("https://remotejobs.org/api/v1/jobs");
  url.searchParams.set("category", category);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "Nexvia (career-OS)" },
  });

  if (!response.ok) {
    throw new Error(`Jobs API responded ${response.status}`);
  }

  const data = (await response.json()) as RemoteJobsResponse;
  return (data.data ?? []).map((job) => ({
    id: job.id,
    title: job.title,
    url: job.url,
    apply_url: job.apply_url,
    company: job.company?.name ?? "Unknown",
    company_logo: job.company?.logo_url ?? null,
    category: job.category?.name ?? "General",
    location: job.location ?? "Remote",
    salary_text: job.salary_text ?? null,
    salary_min: job.salary_min ?? null,
    salary_max: job.salary_max ?? null,
    type: job.type ?? "Full-time",
    description: job.description ?? "",
    posted_at: job.posted_at ?? "",
  }));
}

interface CachedJobRow {
  external_id: string;
  category: string;
  category_name: string | null;
  title: string;
  url: string;
  apply_url: string | null;
  company: string;
  company_logo: string | null;
  location: string | null;
  salary_text: string | null;
  salary_min: number | null;
  salary_max: number | null;
  type: string | null;
  description: string;
  posted_at: string | null;
  fetched_at: string;
}

function rowToJob(row: CachedJobRow): RemoteJob {
  return {
    id: row.external_id,
    title: row.title,
    url: row.url,
    apply_url: row.apply_url ?? row.url,
    company: row.company,
    company_logo: row.company_logo,
    category: row.category_name ?? row.category,
    location: row.location ?? "Remote",
    salary_text: row.salary_text,
    salary_min: row.salary_min,
    salary_max: row.salary_max,
    type: row.type ?? "Full-time",
    description: row.description,
    posted_at: row.posted_at ?? "",
  };
}

async function fetchCachedJobs(
  category: string
): Promise<{ jobs: RemoteJob[]; lastSyncedAt: string | null }> {
  const supabase = await createClient();
  const [{ data: rows }, { data: latest }] = await Promise.all([
    supabase
      .from("job_listings")
      .select("*")
      .eq("category", category)
      .order("fetched_at", { ascending: false })
      .limit(200),
    supabase
      .from("job_listings")
      .select("fetched_at")
      .eq("category", category)
      .order("fetched_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const cached = (rows ?? []).map(rowToJob);
  return { jobs: cached, lastSyncedAt: latest?.fetched_at ?? null };
}

export async function getJobsForCareer(
  careerTitle: string,
  limit = 10
): Promise<{
  jobs: RemoteJob[];
  category: string;
  error?: string;
  source: "cache" | "live";
  lastSyncedAt?: string | null;
}> {
  const { category, keywords } = findCareerMatch(careerTitle);

  try {
    const { jobs: cached, lastSyncedAt } = await fetchCachedJobs(category);

    if (cached.length > 0) {
      const matched = cached.filter((job) => matchesCareer(job, keywords)).slice(0, limit);
      return {
        jobs: matched,
        category,
        source: "cache",
        lastSyncedAt,
      };
    }

    const fetched = await fetchCategoryJobs(category, limit * 3);
    const jobs = fetched.filter((job) => matchesCareer(job, keywords)).slice(0, limit);
    return {
      jobs,
      category,
      source: "live",
    };
  } catch (error) {
    return {
      jobs: [],
      category,
      source: "cache",
      error: error instanceof Error ? error.message : "Failed to load jobs",
    };
  }
}

export async function getSelectedCareerTitle(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("roadmaps")
    .select("career_title")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data?.career_title ?? null;
}

export async function getEligibleJobsAndScholarships(userId: string) {
  const supabase = await createClient();

  const [{ data: profile }, { data: jobs }, { data: scholarships }, { data: roadmap }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    supabase.from("jobs").select("*, companies(name, logo_url)").eq("status", "open"),
    supabase.from("scholarships").select("*").eq("is_active", true).order("deadline", { ascending: true }),
    supabase.from("roadmaps").select("career_title").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  if (!profile) throw new Error("Profile not found");

  const cgpa = Number(profile.cgpa ?? 0);
  const percentage = Number(profile.current_percentage ?? 0);
  const educationLevel = String(profile.education_level ?? "");
  const major = String(profile.major ?? "").toLowerCase();
  const arrayValue = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eligibleJobs = (jobs || []).filter((job: any) => {
    const cgpaOk = job.min_cgpa === null || cgpa >= Number(job.min_cgpa);
    const percentageOk = job.min_percentage === null || percentage >= Number(job.min_percentage);
    const majors = arrayValue(job.eligible_majors);
    const majorTerms = expandProfileTerms([major]);
    const majorOk = majors.length === 0 || !major || majors.some((item) => majorTerms.some((term) => termsAreRelated(term, item)));
    return cgpaOk && percentageOk && majorOk;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eligibleScholarships = (scholarships || []).filter((scholarship: any) => {
    const cgpaOk = scholarship.min_cgpa === null || cgpa >= Number(scholarship.min_cgpa);
    const percentageOk = scholarship.min_percentage === null || percentage >= Number(scholarship.min_percentage);
    const education = arrayValue(scholarship.eligible_education_levels);
    const educationOk = education.length === 0 || !educationLevel || education.some((item) => termsAreRelated(educationLevel, item));
    const majors = arrayValue(scholarship.eligible_majors);
    const majorOk = majors.length === 0 || !major || majors.some((item) => expandProfileTerms([major]).some((term) => termsAreRelated(term, item)));
    const genderOk = arrayValue(scholarship.eligible_genders).length === 0 || !profile.gender || arrayValue(scholarship.eligible_genders).some((item) => termsAreRelated(profile.gender, item));
    const categoryOk = arrayValue(scholarship.eligible_categories).length === 0 || !profile.social_category || arrayValue(scholarship.eligible_categories).some((item) => termsAreRelated(profile.social_category, item));
    const disabilityOk = scholarship.min_disability_percentage === null || profile.disability_percentage === null || Number(profile.disability_percentage) >= Number(scholarship.min_disability_percentage);
    const incomeOk = scholarship.max_family_income === null || profile.annual_family_income === null || Number(profile.annual_family_income) <= Number(scholarship.max_family_income);
    const states = arrayValue(scholarship.eligible_states);
    const stateOk = states.length === 0 || !profile.domicile_state || states.some((item) => termsAreRelated(profile.domicile_state, item));
    return cgpaOk && percentageOk && educationOk && majorOk && genderOk && categoryOk && disabilityOk && incomeOk && stateOk;
  });

  // Fetch assessment responses to rank jobs
  const { data: assessment } = await supabase
    .from("assessments")
    .select("responses")
    .eq("user_id", userId)
    .single();

  let studentSkills: string[] = arrayValue(profile.skill_tags);
  if (assessment && assessment.responses) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skillsResponse = (assessment.responses as any[]).find((r: any) => r.question_id === "skills_2");
    if (skillsResponse && Array.isArray(skillsResponse.answer)) {
      studentSkills = [...new Set([...studentSkills, ...skillsResponse.answer])];
    }
  }

  // Calculate match scores for jobs
  const matchingProfile = { ...profile, skill_tags: studentSkills };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rankedJobs = eligibleJobs.map((job: any) => {
    const result = calculateJobMatch({
      profile: matchingProfile,
      requiredSkills: arrayValue(job.required_skills),
      minimumCgpa: job.min_cgpa === null ? null : Number(job.min_cgpa),
      minimumPercentage: job.min_percentage === null ? null : Number(job.min_percentage),
      eligibleMajors: arrayValue(job.eligible_majors),
      title: job.title,
      careerTitle: roadmap?.career_title ?? null,
    });
    return { ...job, ...result };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).sort((a: any, b: any) => b.matchScore - a.matchScore);

  const rankedScholarships = (eligibleScholarships as Scholarship[]).map((scholarship) => {
    const result = calculateScholarshipMatch({
      profile: matchingProfile,
      minimumCgpa: scholarship.min_cgpa === null ? null : Number(scholarship.min_cgpa),
      minimumPercentage: scholarship.min_percentage === null ? null : Number(scholarship.min_percentage),
      educationLevels: arrayValue(scholarship.eligible_education_levels),
      eligibleMajors: arrayValue(scholarship.eligible_majors),
      relevantSkills: arrayValue(scholarship.required_skills),
      eligibleGenders: arrayValue(scholarship.eligible_genders),
      eligibleCategories: arrayValue(scholarship.eligible_categories),
      minimumDisabilityPercentage: scholarship.min_disability_percentage === null ? null : Number(scholarship.min_disability_percentage),
      maximumFamilyIncome: scholarship.max_family_income === null ? null : Number(scholarship.max_family_income),
      eligibleStates: arrayValue(scholarship.eligible_states),
    });
    return { ...scholarship, ...result };
  }).sort((a, b) => b.matchScore - a.matchScore);

  return { jobs: rankedJobs, scholarships: rankedScholarships };
}

export async function applyToJob(jobId: string, matchScore: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not logged in");

  const { error } = await supabase.from("job_applications").insert({
    job_id: jobId,
    user_id: user.id,
    match_score: matchScore,
    status: "pending"
  });

  if (error) {
    if (error.code === '23505') {
      throw new Error("Already applied to this role");
    }
    throw error;
  }
}

export async function createJob(companyId: string, data: Partial<Job>) {
  const supabase = await createClient();
  const { error } = await supabase.from("jobs").insert({
    company_id: companyId,
    ...data
  });
  if (error) throw error;
}

export async function getCompanyByUserId(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("company_members")
    .select("companies(*)")
    .eq("user_id", userId)
    .single();
  
  return (data?.companies as unknown as Company) || null;
}

export async function getTopStudentMatches(jobId: string, limit = 10) {
  const supabase = await createClient();
  const { data: job } = await supabase.from("jobs").select("*").eq("id", jobId).single();
  if (!job) return [];
  const { data: candidates } = await supabase
    .from("candidate_profiles")
    .select("*")
    .eq("open_to_recruiters", true)
    .limit(500);

  const requiredSkills = Array.isArray(job.required_skills) ? job.required_skills : [];
  return ((candidates ?? []) as CandidateProfile[])
    .filter((candidate) => {
      const cgpaOk = job.min_cgpa === null || Number(candidate.cgpa ?? 0) >= Number(job.min_cgpa);
      const marksOk = job.min_percentage === null || Number(candidate.current_percentage ?? 0) >= Number(job.min_percentage);
      const majors = Array.isArray(job.eligible_majors) ? job.eligible_majors : [];
      const majorOk = majors.length === 0 || majors.some((item: string) => termsAreRelated(candidate.major ?? "", item));
      return cgpaOk && marksOk && majorOk;
    })
    .map((candidate) => {
      const result = calculateJobMatch({
        profile: { ...candidate, education_level: null },
        requiredSkills,
        minimumCgpa: job.min_cgpa === null ? null : Number(job.min_cgpa),
        minimumPercentage: job.min_percentage === null ? null : Number(job.min_percentage),
        eligibleMajors: Array.isArray(job.eligible_majors) ? job.eligible_majors : [],
        title: job.title,
      });
      return { ...candidate, ...result };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}
