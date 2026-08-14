"use server";

import { revalidatePath } from "next/cache";
import { CAREERS } from "@/lib/data";
import type { Career, MentorMessage } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export interface MentorContext {
  name: string;
  level: number;
  xp: number;
  studyHours: number | null;
  career: { title: string; completed: number; total: number } | null;
}

export interface MentorSendState {
  ok: boolean;
  error?: string;
  userMessage?: MentorMessage;
  assistantMessage?: MentorMessage;
}

export interface MentorClearState {
  ok: boolean;
  error?: string;
}

export async function getChat(): Promise<MentorMessage[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("mentor_messages")
      .select("id, user_id, role, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(100);

    return (data ?? []) as MentorMessage[];
  } catch {
    return [];
  }
}

export async function clearChat(
  _prevState: MentorClearState,
  _formData: FormData
): Promise<MentorClearState> {
  void _prevState;
  void _formData;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "You must be signed in to clear the chat." };
    }

    await supabase.from("mentor_messages").delete().eq("user_id", user.id);
    revalidatePath("/mentor");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not clear the chat. Please try again." };
  }
}

export async function sendMessage(
  _prevState: MentorSendState,
  formData: FormData
): Promise<MentorSendState> {
  void _prevState;
  const raw = formData.get("content");
  const content = typeof raw === "string" ? raw.trim() : "";
  if (!content) return { ok: false, error: "Please type a message first." };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, error: "You must be signed in to chat with your mentor." };
    }

    const context = await loadContext(user.id);
    const reply = generateMentorReply(content, context);

    const { data: userMessage } = await supabase
      .from("mentor_messages")
      .insert({ user_id: user.id, role: "user", content })
      .select("id, user_id, role, content, created_at")
      .single();
    if (!userMessage) {
      return { ok: false, error: "Could not save your message. Please try again." };
    }

    const { data: assistantMessage } = await supabase
      .from("mentor_messages")
      .insert({ user_id: user.id, role: "assistant", content: reply })
      .select("id, user_id, role, content, created_at")
      .single();
    if (!assistantMessage) {
      return { ok: true, userMessage: userMessage as MentorMessage };
    }

    revalidatePath("/mentor");
    return {
      ok: true,
      userMessage: userMessage as MentorMessage,
      assistantMessage: assistantMessage as MentorMessage,
    };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

async function loadContext(userId: string): Promise<MentorContext> {
  const base: MentorContext = {
    name: "there",
    level: 1,
    xp: 0,
    studyHours: null,
    career: null,
  };

  try {
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, xp, level, study_hours_per_week")
      .eq("id", userId)
      .maybeSingle();

    base.name =
      profile?.full_name?.trim().split(/\s+/)[0] ||
      profile?.email?.split("@")[0] ||
      "there";
    base.level = profile?.level ?? 1;
    base.xp = profile?.xp ?? 0;
    base.studyHours = profile?.study_hours_per_week ?? null;

    const { data: roadmap } = await supabase
      .from("roadmaps")
      .select("id, career_title")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (roadmap) {
      const { data: milestones } = await supabase
        .from("milestones")
        .select("status")
        .eq("roadmap_id", roadmap.id);
      const rows = milestones ?? [];
      base.career = {
        title: roadmap.career_title,
        total: rows.length,
        completed: rows.filter((m) => m.status === "completed").length,
      };
    }
  } catch {}

  return base;
}

const CAREER_KEYWORDS = [
  "what career",
  "which career",
  "career path",
  "career options",
  "career for me",
  "what job",
  "which job",
  "good fit",
  "best fit",
  "career fit",
  "should i become",
  "career should",
  "which field",
  "what field",
  "best career",
  "good career",
  "how do i choose",
  "how to choose a career",
];

const RESUME_KEYWORDS = ["resume", "cv", "cover letter", "curriculum vitae"];

const INTERVIEW_KEYWORDS = ["interview", "hiring process", "screening"];

const STUDY_KEYWORDS = [
  "how to learn",
  "how do i learn",
  "how to study",
  "study plan",
  "learn faster",
  "how to start",
  "where do i start",
  "where to start",
  "get started",
  "starting out",
  "beginner",
  "learning path",
  "learn ",
  "study ",
  "practice",
  "tutorial",
  "course",
  "resource",
  "teach myself",
  "self study",
  "study material",
];

const MOTIVATION_KEYWORDS = [
  "motivat",
  "discourag",
  "give up",
  "burnout",
  "burned out",
  "burn out",
  "tired",
  "stuck",
  "overwhelm",
  "hopeless",
  "frustrat",
  "procrastin",
  "lazy",
  "confiden",
  "feel like i",
  "can't do",
  "cant do",
  "so hard",
  "too hard",
];

const SCHOLARSHIP_KEYWORDS = [
  "scholarship",
  "financial aid",
  "funding",
  "tuition",
  "afford",
  "grant",
  "free course",
  "free resources",
  "cost",
  "fee",
];

const INTERNSHIP_KEYWORDS = ["internship", "intern role", "intern position"];

const PROJECT_KEYWORDS = [
  "project",
  "portfolio",
  "side project",
  "build something",
  "what to build",
  "make something",
  "build an app",
  "sample project",
];

const NEXT_STEP_KEYWORDS = [
  "what should i do next",
  "what's next",
  "whats next",
  "what is next",
  "next step",
  "after this",
  "what now",
  "what do i do now",
  "where to go from here",
  "what should i focus on",
  "then what",
];

const EXPLAIN_KEYWORDS = [
  "explain",
  "what is",
  "what are",
  "what's a",
  "whats a",
  "how does",
  "how do",
  "define",
  "meaning",
  "tell me about",
  "difference between",
  "introduction to",
  "overview of",
];

const GREETING_WORDS = [
  "hi",
  "hello",
  "hey",
  "yo",
  "good morning",
  "good evening",
  "good afternoon",
];

function hasAny(q: string, keywords: string[]): boolean {
  return keywords.some((k) => q.includes(k));
}

function hasWord(q: string, word: string): boolean {
  return new RegExp(`\\b${word}\\b`).test(q);
}

function joinLines(lines: string[]): string {
  return lines.filter((l) => l.length > 0).join("\n");
}

function matchCareer(q: string): Career | null {
  for (const career of CAREERS) {
    const title = career.title.toLowerCase();
    if (q.includes(title)) return career;
    const tokens = title.split(/[\s/]+/).filter((t) => t.length >= 5);
    if (tokens.some((t) => hasWord(q, t))) return career;
  }
  return null;
}

function greet(context: MentorContext): string {
  return context.name && context.name !== "there" ? context.name : "friend";
}

function progressNote(context: MentorContext): string {
  if (context.career) {
    if (context.career.total === 0) {
      return `You are on the ${context.career.title} track. Take the first step on your roadmap and the rest will follow.`;
    }
    return `Your ${context.career.title} roadmap shows ${context.career.completed} of ${context.career.total} milestones complete — every one moves you forward.`;
  }
  return "Completing the career assessment will unlock a personalized roadmap with milestones built just for you.";
}

function levelNote(context: MentorContext): string {
  if (context.xp > 0) {
    return `At level ${context.level} with ${context.xp} XP, you have already shown real commitment.`;
  }
  return "";
}

function studyHoursNote(context: MentorContext): string {
  if (context.studyHours && context.studyHours > 0) {
    return `With ${context.studyHours} hours a week available, aim for three short, focused sessions rather than one long marathon.`;
  }
  return "";
}

function careerReply(career: Career, q: string, context: MentorContext): string {
  const lines: string[] = [
    `${career.title} is a great path to explore, ${greet(context)}. ${career.description}`,
    "Here is what matters most for this track:",
  ];
  for (const skill of career.required_skills) {
    lines.push(`• Build ${skill.toLowerCase()} skills — they are core to the role.`);
  }
  if (hasAny(q, INTERVIEW_KEYWORDS)) {
    lines.push("• Practice explaining your projects and prepare for role-specific interview questions.");
  }
  if (hasAny(q, RESUME_KEYWORDS)) {
    lines.push(`• Tailor your resume around ${career.title} keywords and your best projects.`);
  }
  if (hasAny(q, PROJECT_KEYWORDS)) {
    lines.push("• Ship a small project that proves you can apply these skills end to end.");
  }
  if (hasAny(q, STUDY_KEYWORDS)) {
    lines.push("• Learn the fundamentals first, then apply each idea in a small exercise or project.");
  }
  lines.push(progressNote(context));
  lines.push("Pick one skill to practice today — small steps compound fast.");
  return joinLines(lines);
}

function careerHelpReply(context: MentorContext): string {
  const lines = [
    `Great, ${greet(context)} — let's find the direction that fits you.`,
    "Your best fit comes from a mix of your interests, skills, and goals.",
    "• Take the career assessment to get personalized matches and reasons.",
    "• Explore the careers that interest you and look at the skills each one needs.",
    "• Try a small project in a field you are curious about before committing.",
    progressNote(context),
    levelNote(context),
    "Start with the assessment — it turns guesswork into a plan.",
  ];
  return joinLines(lines);
}

function resumeReply(context: MentorContext): string {
  const lines = [
    `A resume's job is to earn you an interview, ${greet(context)} — make it easy to scan and tailored to the role.`,
    "• Match keywords from the job description, including skills from your chosen track.",
    "• Use action verbs and measurable results, like \"Built X, which improved Y by Z%\".",
    "• Keep it to one page for entry-level roles and add a Projects section.",
    "• Get one more pair of eyes before you send it.",
    progressNote(context),
    "Polish it once, then start applying — done beats perfect.",
  ];
  return joinLines(lines);
}

function interviewReply(context: MentorContext): string {
  const lines = [
    `Interviews are a skill you can practice, ${greet(context)} — every rep makes you calmer.`,
    "• Research the company and the role before you walk in.",
    "• Use the STAR method (Situation, Task, Action, Result) for behavioral answers.",
    "• Run a mock interview out loud and time your responses.",
    "• Prepare two or three thoughtful questions to ask the interviewer.",
    progressNote(context),
    "Rehearse once today and you will feel the difference on the day.",
  ];
  return joinLines(lines);
}

function studyReply(context: MentorContext): string {
  const lines = [
    `Learning sticks when you practice, not when you re-read, ${greet(context)}.`,
    "• Break big topics into 25-45 minute focused sessions.",
    "• Apply each new idea in a tiny exercise or project the same week.",
    "• Review past notes with spaced repetition instead of cramming.",
    studyHoursNote(context),
    progressNote(context),
    "Start with one topic today — momentum is built in small steps.",
  ];
  return joinLines(lines);
}

function motivationReply(context: MentorContext): string {
  const lines = [
    `Feeling stuck is a normal part of any career journey, ${greet(context)} — it does not mean you are failing.`,
    levelNote(context),
    "• Shrink your next step until it feels easy, like opening the course or writing three lines.",
    "• Track one small win each day to rebuild momentum.",
    "• Revisit why you started and picture where you want to be in six months.",
    progressNote(context),
    "Momentum beats motivation. Do the smallest useful thing today.",
  ];
  return joinLines(lines);
}

function scholarshipReply(context: MentorContext): string {
  const lines = [
    `Good news, ${greet(context)}: there are more funding paths than most people realize.`,
    "• Start with government and university scholarship portals.",
    "• Apply widely and early — many scholarships go unawarded simply for lack of applicants.",
    "• Use free or low-cost resources, open courses, and community programs while you plan.",
    "• Ask a mentor or professor to review your applications before you submit.",
    progressNote(context),
    "Funded or not, keep building skills — that is what opens the real doors.",
  ];
  return joinLines(lines);
}

function internshipReply(context: MentorContext): string {
  const lines = [
    `Internships reward readiness over perfection, ${greet(context)}.`,
    "• Build one solid project you can talk about before applying.",
    "• Tailor your resume to each posting and mention relevant coursework.",
    "• Apply broadly, then follow up politely after about a week.",
    "• Use your career center, LinkedIn, and career fairs to find openings.",
    progressNote(context),
    "Treat every application as practice — each one gets you closer.",
  ];
  return joinLines(lines);
}

function projectReply(context: MentorContext): string {
  const lines = [
    `Projects are the fastest way to prove your skills, ${greet(context)}.`,
    "• Pick something small enough to finish in two to four weeks but big enough to show real ability.",
    "• Choose a problem you actually care about so the work feels motivated.",
    "• Document your process and the decisions you made along the way.",
    "• Share it in your portfolio and on LinkedIn once it is done.",
    progressNote(context),
    "A finished small project beats an unfinished big one. Start today.",
  ];
  return joinLines(lines);
}

function nextStepReply(context: MentorContext): string {
  const lines: string[] = [`Let's make your next step concrete, ${greet(context)}.`];
  if (context.career) {
    if (context.career.total > 0) {
      lines.push(
        `You are on the ${context.career.title} track with ${context.career.completed} of ${context.career.total} milestones complete. Finish the current milestone's courses to keep the roadmap moving.`
      );
    } else {
      lines.push(
        `You are on the ${context.career.title} track — your first milestone is waiting to be started.`
      );
    }
    lines.push("• Open your roadmap and pick the single most useful course to start now.");
    lines.push("• Schedule a short daily study slot for it.");
    lines.push("• Complete one lesson today and mark it done.");
  } else {
    lines.push("Your best next step is to complete the career assessment and get a personalized roadmap.");
    lines.push("• Take the assessment to discover your strengths and best-fit careers.");
    lines.push("• Once you have a roadmap, start milestone one with a small daily study slot.");
    lines.push("• Check in daily so your progress and streak keep building.");
  }
  lines.push(levelNote(context));
  lines.push("One clear next step is all you need. What will it be?");
  return joinLines(lines);
}

function extractConcept(q: string): string {
  const patterns: RegExp[] = [
    /explain (.+)/,
    /what is an?\s+(.+)/,
    /what is the?\s+(.+)/,
    /what are (.+)/,
    /how does (.+)/,
    /how do (.+)/,
    /define (.+)/,
    /difference between (.+)/,
    /tell me about (.+)/,
    /overview of (.+)/,
    /introduction to (.+)/,
  ];
  for (const pattern of patterns) {
    const match = q.match(pattern);
    if (match && match[1]) {
      const concept = match[1].trim().replace(/[?.,!]+$/, "");
      if (concept.length > 0 && concept.length <= 60) {
        return concept.charAt(0).toUpperCase() + concept.slice(1);
      }
    }
  }
  return "";
}

function explainReply(q: string, context: MentorContext): string {
  const concept = extractConcept(q);
  const lines: string[] = [];
  if (concept) {
    lines.push(
      `Great question, ${greet(context)}. "${concept}" is a building block in this field, and the fastest way to understand it is to see it in action.`
    );
  } else {
    lines.push(
      `Great question, ${greet(context)}. The fastest way to understand any concept is to see it in action.`
    );
  }
  lines.push("• Read a beginner-friendly explanation, then rephrase it in your own words.");
  lines.push("• Try it in a small hands-on example or exercise the same day.");
  lines.push("• Teach it to a friend or write a short note to lock it in.");
  if (context.career && concept) {
    lines.push(`Look for how "${concept}" shows up in the ${context.career.title} track — that connection makes it stick.`);
  }
  lines.push("Work through it step by step, and come back to ask me again if a piece is still fuzzy.");
  return joinLines(lines);
}

function greetingReply(context: MentorContext): string {
  const lines = [
    `Hey ${greet(context)}, welcome to your AI mentor space. I am here to help you grow.`,
    progressNote(context),
    levelNote(context),
    "You can ask me about careers, resumes, interviews, projects, scholarships, or internships.",
    "Or tell me what you are working on and I will help you pick the next step.",
  ];
  return joinLines(lines);
}

function defaultReply(context: MentorContext): string {
  const lines = [
    `I am here to help you plan your next move, ${greet(context)}.`,
    "• Ask about a career, resume, interview, project, scholarship, or internship.",
    "• Tell me a skill you want to learn and I will point you to a starting point.",
    "• Say \"what should I do next?\" and I will map out your next action.",
    progressNote(context),
    levelNote(context),
    "Every mentor chat is a chance to get one step closer. What is on your mind?",
  ];
  return joinLines(lines);
}

function generateMentorReply(question: string, context: MentorContext): string {
  const q = question.toLowerCase();

  const career = matchCareer(q);
  if (career) return careerReply(career, q, context);

  if (hasAny(q, CAREER_KEYWORDS)) return careerHelpReply(context);
  if (hasAny(q, RESUME_KEYWORDS)) return resumeReply(context);
  if (hasAny(q, INTERVIEW_KEYWORDS)) return interviewReply(context);
  if (hasAny(q, SCHOLARSHIP_KEYWORDS)) return scholarshipReply(context);
  if (hasAny(q, INTERNSHIP_KEYWORDS) || hasWord(q, "intern")) {
    return internshipReply(context);
  }
  if (hasAny(q, MOTIVATION_KEYWORDS)) return motivationReply(context);
  if (hasAny(q, STUDY_KEYWORDS)) return studyReply(context);
  if (hasAny(q, PROJECT_KEYWORDS)) return projectReply(context);
  if (hasAny(q, NEXT_STEP_KEYWORDS)) return nextStepReply(context);
  if (hasAny(q, EXPLAIN_KEYWORDS)) return explainReply(q, context);
  if (GREETING_WORDS.some((w) => hasWord(q, w))) return greetingReply(context);

  return defaultReply(context);
}