"use server";

import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const MAX_RESUME_BYTES = 5 * 1024 * 1024;

const resumeAnalysisSchema = z.object({
  atsEstimate: z.number().int().min(0).max(100),
  summary: z.string().min(20).max(700),
  strengths: z.array(z.string().min(2).max(160)).min(1).max(6),
  missingSkills: z.array(z.string().min(2).max(100)).max(8),
  improvements: z.array(z.string().min(2).max(180)).min(1).max(8),
  suggestedProjects: z.array(z.string().min(2).max(180)).max(4),
  detectedSkills: z.array(z.string().min(1).max(80)).max(20),
  roleAlignment: z.string().min(10).max(400),
});

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;

export interface ResumeAnalysisState {
  ok: boolean;
  error?: string;
  fileName?: string;
  targetRole?: string;
  result?: ResumeAnalysis;
}

export const resumeAnalysisInitialState: ResumeAnalysisState = { ok: false };

export async function analyzeResume(
  _previousState: ResumeAnalysisState,
  formData: FormData,
): Promise<ResumeAnalysisState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in before analysing a resume." };

  const file = formData.get("resume");
  const targetRole = String(formData.get("targetRole") ?? "").trim();
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Choose a PDF resume first." };
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { ok: false, error: "Only PDF resumes are supported." };
  }
  if (file.size > MAX_RESUME_BYTES) {
    return { ok: false, error: "Please keep the PDF under 5 MB." };
  }
  if (targetRole.length > 100) {
    return { ok: false, error: "Keep the target role under 100 characters." };
  }
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return { ok: false, error: "Resume analysis is temporarily unavailable because Gemini is not configured." };
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({ schema: resumeAnalysisSchema }),
      system:
        "You are a careful career resume reviewer. Analyse only evidence present in the supplied resume. Never infer protected traits, invent experience, guarantee hiring, or claim that the ATS estimate is an official employer score. Make suggestions specific, actionable, and suitable for a student or early-career applicant.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Review this resume${targetRole ? ` for the target role: ${targetRole}` : " for general early-career readiness"}. The ATS estimate must reflect structure, clarity, evidence, keywords, and role alignment.`,
            },
            { type: "file", data: bytes, mediaType: "application/pdf" },
          ],
        },
      ],
      abortSignal: AbortSignal.timeout(25_000),
    });

    return {
      ok: true,
      fileName: file.name.slice(0, 120),
      targetRole: targetRole || "General career readiness",
      result: output,
    };
  } catch {
    return {
      ok: false,
      error: "We could not analyse this PDF right now. Check the file, Gemini quota, and connection, then try again.",
    };
  }
}
