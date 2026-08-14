import type { AssessmentQuestion, Badge, Career } from "./types";

export const XP_RULES = {
  assessment_completed: 50,
  career_selected: 20,
  course_started: 10,
  course_completed: 100,
  quiz_perfect_score: 40,
  quiz_passed: 20,
  project_submitted: 80,
  project_approved: 150,
  daily_check_in: 10,
  mentor_first_message: 15,
  milestone_completed: 200,
  roadmap_completed: 1000,
  certificate_earned: 300,
} as const;

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "interest_1",
    category: "interest",
    text: "How much do you enjoy solving puzzles or logic problems?",
    type: "rating",
    min: 1,
    max: 5,
    weight: 1,
  },
  {
    id: "interest_2",
    category: "interest",
    text: "How excited are you about creating things (apps, art, designs, content)?",
    type: "rating",
    min: 1,
    max: 5,
    weight: 1,
  },
  {
    id: "interest_3",
    category: "interest",
    text: "How interested are you in helping or teaching others?",
    type: "rating",
    min: 1,
    max: 5,
    weight: 1,
  },
  {
    id: "skills_1",
    category: "skills",
    text: "Which of these best describes your current skill level?",
    type: "choice",
    options: ["Beginner", "Intermediate", "Advanced"],
    weight: 1,
  },
  {
    id: "skills_2",
    category: "skills",
    text: "Select the skills you already have:",
    type: "multiselect",
    options: [
      "Problem solving",
      "Programming",
      "Writing",
      "Public speaking",
      "Design",
      "Data analysis",
      "Teamwork",
      "Research",
    ],
    weight: 1,
  },
  {
    id: "personality_1",
    category: "personality",
    text: "In a team, you usually prefer to:",
    type: "choice",
    options: [
      "Lead and organize",
      "Analyze and plan",
      "Create and brainstorm",
      "Support and execute",
    ],
    weight: 1,
  },
  {
    id: "personality_2",
    category: "personality",
    text: "How comfortable are you working independently?",
    type: "rating",
    min: 1,
    max: 5,
    weight: 1,
  },
  {
    id: "goals_1",
    category: "goals",
    text: "What is your primary goal right now?",
    type: "choice",
    options: [
      "Get my first job",
      "Build my own business",
      "Learn a new skill",
      "Advance my career",
      "Change careers",
    ],
    weight: 1,
  },
  {
    id: "learning_style_1",
    category: "learning_style",
    text: "How do you learn best?",
    type: "choice",
    options: ["Watching videos", "Listening/audio", "Reading notes", "Hands-on practice"],
    weight: 1,
  },
  {
    id: "study_availability_1",
    category: "study_availability",
    text: "How many hours can you study per week?",
    type: "choice",
    options: ["Less than 3", "3-5", "5-10", "10-15", "15+"],
    weight: 1,
  },
  {
    id: "education_1",
    category: "education",
    text: "What is your current education level?",
    type: "choice",
    options: ["High School", "Undergraduate", "Graduate", "Self-taught"],
    weight: 1,
  },
];

export const CAREERS: Career[] = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Software Engineer",
    description:
      "Design, build, and maintain software products from web apps to mobile apps.",
    category: "Technology",
    required_skills: ["Programming", "Problem solving", "Data analysis"],
    salary_range: "$70k - $150k",
    demand: "very_high",
    icon: "💻",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Data Scientist",
    description:
      "Analyze data to find patterns and help organizations make better decisions.",
    category: "Technology",
    required_skills: ["Data analysis", "Programming", "Problem solving"],
    salary_range: "$80k - $160k",
    demand: "very_high",
    icon: "📊",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    title: "UX/UI Designer",
    description:
      "Design intuitive, beautiful, and accessible user experiences and interfaces.",
    category: "Design",
    required_skills: ["Design", "Problem solving", "Teamwork"],
    salary_range: "$60k - $130k",
    demand: "high",
    icon: "🎨",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    title: "Product Manager",
    description:
      "Define the vision for a product and guide a team to ship it successfully.",
    category: "Business",
    required_skills: ["Teamwork", "Research", "Writing", "Public speaking"],
    salary_range: "$80k - $160k",
    demand: "high",
    icon: "📦",
  },
  {
    id: "00000000-0000-0000-0000-000000000005",
    title: "Data Analyst",
    description:
      "Turn raw data into clear insights that guide everyday business decisions.",
    category: "Technology",
    required_skills: ["Data analysis", "Research", "Problem solving"],
    salary_range: "$55k - $110k",
    demand: "very_high",
    icon: "🔍",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    title: "Technical Writer",
    description:
      "Create clear documentation, tutorials, and content that make tech easy to understand.",
    category: "Communication",
    required_skills: ["Writing", "Research", "Public speaking"],
    salary_range: "$50k - $100k",
    demand: "medium",
    icon: "✍️",
  },
  {
    id: "00000000-0000-0000-0000-000000000007",
    title: "Cybersecurity Analyst",
    description:
      "Protect organizations from cyber threats and keep systems and data safe.",
    category: "Technology",
    required_skills: ["Problem solving", "Programming", "Data analysis"],
    salary_range: "$70k - $140k",
    demand: "very_high",
    icon: "🛡️",
  },
  {
    id: "00000000-0000-0000-0000-000000000008",
    title: "Entrepreneur / Startup Founder",
    description:
      "Spot problems, build products, and lead a team to bring an idea to life.",
    category: "Business",
    required_skills: ["Public speaking", "Teamwork", "Research", "Writing"],
    salary_range: "Variable",
    demand: "medium",
    icon: "🚀",
  },
];

export const BADGES: Badge[] = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    key: "onboarded",
    name: "Welcome Aboard",
    description: "Complete your profile setup",
    icon: "👋",
    xp_required: 10,
    criteria: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    key: "assessment_complete",
    name: "Self-Discoverer",
    description: "Complete the AI career assessment",
    icon: "🧭",
    xp_required: 50,
    criteria: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000103",
    key: "career_chosen",
    name: "Direction Set",
    description: "Choose your career path",
    icon: "🎯",
    xp_required: 20,
    criteria: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000104",
    key: "streak_3",
    name: "On Fire",
    description: "Reach a 3-day learning streak",
    icon: "🔥",
    xp_required: null,
    criteria: "streak_days >= 3",
  },
  {
    id: "00000000-0000-0000-0000-000000000105",
    key: "streak_7",
    name: "Week Warrior",
    description: "Reach a 7-day learning streak",
    icon: "⚡",
    xp_required: null,
    criteria: "streak_days >= 7",
  },
  {
    id: "00000000-0000-0000-0000-000000000106",
    key: "milestone_done",
    name: "Milestone Maker",
    description: "Complete your first roadmap milestone",
    icon: "🏁",
    xp_required: 200,
    criteria: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000107",
    key: "level_5",
    name: "Rising Star",
    description: "Reach level 5",
    icon: "🌟",
    xp_required: 500,
    criteria: null,
  },
  {
    id: "00000000-0000-0000-0000-000000000108",
    key: "roadmap_done",
    name: "Career Graduate",
    description: "Complete your entire roadmap",
    icon: "🎓",
    xp_required: 1000,
    criteria: null,
  },
];

export function levelFromXp(xp: number): number {
  return Math.floor(xp / 250) + 1;
}

export function xpForLevel(level: number): number {
  return (level - 1) * 250;
}

export function matchCareers(
  responses: { question_id: string; answer: number | string | string[] }[]
): Array<{ career: Career; score: number; reasons: string[] }> {
  const getAnswers = (category: string) =>
    responses.filter((r) => r.question_id.startsWith(category));

  const selectedSkills: string[] = [];
  const interest = getAnswers("interest").reduce(
    (sum, r) => sum + (typeof r.answer === "number" ? r.answer : 0),
    0
  );
  const personality = getAnswers("personality").map((r) => r.answer).join(" | ");

  const skillsAnswers = getAnswers("skills").find((r) => r.question_id === "skills_2");
  if (skillsAnswers && Array.isArray(skillsAnswers.answer)) {
    selectedSkills.push(...(skillsAnswers.answer as string[]));
  }

  const goals = getAnswers("goals").find((r) => r.question_id === "goals_1");

  const scored = CAREERS.map((career) => {
    let score = 0;
    const reasons: string[] = [];

    for (const skill of career.required_skills) {
      if (selectedSkills.includes(skill)) {
        score += 2;
        reasons.push(`You already have ${skill} skills`);
      }
    }

    if (interest >= 8 && career.category === "Technology") {
      score += 2;
      reasons.push("Your interests align with problem solving and logic");
    }
    if (interest <= 6 && career.category === "Communication") {
      score += 2;
      reasons.push("Your interests point toward people-focused work");
    }
    if (
      career.category === "Business" &&
      personality.includes("Lead and organize")
    ) {
      score += 2;
      reasons.push("You enjoy leading and organizing");
    }
    if (
      career.category === "Technology" &&
      personality.includes("Analyze and plan")
    ) {
      score += 2;
      reasons.push("You prefer analysis and planning");
    }
    if (
      career.category === "Design" &&
      personality.includes("Create and brainstorm")
    ) {
      score += 2;
      reasons.push("You enjoy creating and brainstorming");
    }
    if (
      career.category === "Business" &&
      goals?.answer === "Build my own business"
    ) {
      score += 2;
      reasons.push("Your goal is to build something of your own");
    }

    return { career, score, reasons };
  });

  const maxScore = Math.max(...scored.map((s) => s.score), 1);
  return scored
    .map((s) => ({
      career: s.career,
      score: s.score,
      match: Math.min(97, Math.round((s.score / maxScore) * 100)),
      reasons: s.reasons,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}
