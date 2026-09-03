"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ParentActionState = {
  ok: boolean;
  message?: string;
  code?: string;
};

export type ParentDashboardData = {
  student: {
    id: string;
    name: string;
    level?: number;
    xp?: number;
    current_streak_days?: number;
    longest_streak_days?: number;
    last_active_day?: string | null;
    study_hours_per_week?: number | null;
    learning_style?: string | null;
  };
  assessment?: { status?: string; completed_at?: string | null } | null;
  analysis?: {
    strengths?: string[];
    growth_areas?: string[];
    summary?: string | null;
    learning_style?: string | null;
    recommended_pace?: string | null;
    study_capacity_hours?: number | null;
  } | null;
  recommendation?: {
    career_title?: string;
    description?: string;
    match_percentage?: number;
    reasons?: string[];
    existing_strengths?: string[];
    growth_opportunities?: string[];
    is_selected?: boolean;
  } | null;
  roadmap?: {
    id: string;
    career_title: string;
    status: string;
    created_at: string;
    last_activity_at?: string | null;
    milestones?: Array<{
      id: string;
      title: string;
      description?: string | null;
      order_index: number;
      status: string;
      courses?: Array<{
        id: string;
        title: string;
        status: string;
        duration_weeks: number;
      }>;
    }>;
  } | null;
  badges?: Array<{
    key: string;
    name: string;
    description: string;
    earned_at: string;
  }>;
  readiness?: {
    overall?: number;
    technical_skills?: number;
    communication?: number;
    projects?: number;
    resume_quality?: number;
    interview_readiness?: number;
    suggestions?: string[];
    updated_at?: string;
  } | null;
  interviews?: {
    completed_count?: number;
    average_score?: number;
    latest?: {
      category?: string;
      career_title?: string | null;
      overall_score?: number;
      summary?: string;
      completed_at?: string;
    } | null;
  };
  recent_activity?: Array<{
    reason: string;
    amount: number;
    created_at: string;
  }>;
  encouragements?: Array<{
    id: string;
    message: string;
    read_at?: string | null;
    created_at: string;
  }>;
};

export type ParentWard = {
  linkId: string;
  studentId: string;
  relationship: string;
  name: string;
  careerTitle: string | null;
  lastActiveAt: string | null;
};

function normalizeInviteCode(value: string) {
  return value.trim().toUpperCase();
}

function digestInviteCode(value: string) {
  return createHash("sha256").update(normalizeInviteCode(value)).digest("hex");
}

function safeDashboard(value: unknown): ParentDashboardData | null {
  if (!value || typeof value !== "object") return null;
  const dashboard = value as ParentDashboardData;
  if (!dashboard.student?.id) return null;
  return dashboard;
}

export async function createParentInvite(
  _previous: ParentActionState,
  _formData: FormData,
): Promise<ParentActionState> {
  void _previous;
  void _formData;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in before creating a parent code." };

  const compact = randomBytes(5).toString("hex").toUpperCase();
  const code = `${compact.slice(0, 5)}-${compact.slice(5)}`;
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await supabase
    .from("parent_invites")
    .delete()
    .eq("student_user_id", user.id)
    .is("used_at", null);

  const { error } = await supabase.from("parent_invites").insert({
    student_user_id: user.id,
    code_digest: digestInviteCode(code),
    expires_at: expiresAt,
  });

  if (error) {
    return { ok: false, message: "Could not create a parent code. Please try again." };
  }

  revalidatePath("/parent/access");
  return {
    ok: true,
    code,
    message: "Share this one-time code privately. It expires in seven days.",
  };
}

export async function redeemParentInvite(
  _previous: ParentActionState,
  formData: FormData,
): Promise<ParentActionState> {
  void _previous;
  const rawCode = formData.get("code");
  const rawRelationship = formData.get("relationship");
  const code = typeof rawCode === "string" ? normalizeInviteCode(rawCode) : "";
  const relationship =
    typeof rawRelationship === "string" ? rawRelationship.trim().slice(0, 40) : "Parent";

  if (!/^[A-Z0-9]{5}-[A-Z0-9]{5}$/.test(code)) {
    return { ok: false, message: "Enter the 10-character code in the format XXXXX-XXXXX." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in before linking a learner." };

  const { error } = await supabase.rpc("redeem_parent_invite", {
    invite_code: code,
    relationship_name: relationship || "Parent",
  });

  if (error) {
    const message = error.message.includes("invalid or has expired")
      ? "That code is invalid or expired. Ask the learner to create a new code."
      : error.message.includes("own account")
        ? "Use a different signed-in account for the parent or guardian."
        : "Could not link this learner. Please verify the code and try again.";
    return { ok: false, message };
  }

  revalidatePath("/parent/access");
  revalidatePath("/parent/dashboard");
  return { ok: true, message: "Learner linked successfully." };
}

export async function sendParentEncouragement(
  _previous: ParentActionState,
  formData: FormData,
): Promise<ParentActionState> {
  void _previous;
  const linkId = String(formData.get("linkId") ?? "");
  const studentId = String(formData.get("studentId") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (!linkId || !studentId) {
    return { ok: false, message: "The linked learner could not be identified." };
  }
  if (message.length < 2 || message.length > 300) {
    return { ok: false, message: "Write an encouragement between 2 and 300 characters." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Sign in before sending encouragement." };

  const { data: link } = await supabase
    .from("parent_links")
    .select("id")
    .eq("id", linkId)
    .eq("parent_user_id", user.id)
    .eq("student_user_id", studentId)
    .eq("status", "active")
    .maybeSingle();

  if (!link) return { ok: false, message: "This parent link is no longer active." };

  const { error } = await supabase.from("parent_encouragements").insert({
    parent_link_id: linkId,
    parent_user_id: user.id,
    student_user_id: studentId,
    message,
  });

  if (error) return { ok: false, message: "Could not send the note. Please try again." };

  revalidatePath("/parent/dashboard");
  revalidatePath("/dashboard");
  return { ok: true, message: "Encouragement sent to the learner." };
}

export async function loadParentDashboard(studentId?: string): Promise<{
  role: "parent" | "student";
  linkId: string | null;
  data: ParentDashboardData;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let targetStudentId = studentId;
  let linkId: string | null = null;
  let role: "parent" | "student" = "parent";

  if (!targetStudentId) {
    const { data: firstLink } = await supabase
      .from("parent_links")
      .select("id, student_user_id")
      .eq("parent_user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (!firstLink) return null;
    targetStudentId = firstLink.student_user_id;
    linkId = firstLink.id;
  } else if (targetStudentId === user.id) {
    role = "student";
  } else {
    const { data: link } = await supabase
      .from("parent_links")
      .select("id")
      .eq("parent_user_id", user.id)
      .eq("student_user_id", targetStudentId)
      .eq("status", "active")
      .maybeSingle();
    if (!link) return null;
    linkId = link.id;
  }

  const { data, error } = await supabase.rpc("get_parent_dashboard", {
    target_student_id: targetStudentId,
  });
  if (error) return null;
  const dashboard = safeDashboard(data);
  if (!dashboard) return null;
  return { role, linkId, data: dashboard };
}

export async function loadParentAccess(): Promise<{
  userId: string;
  wards: ParentWard[];
  activeInviteExpiresAt: string | null;
  linkedGuardianCount: number;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [parentLinksResult, inviteResult, studentLinksResult] = await Promise.all([
    supabase
      .from("parent_links")
      .select("id, student_user_id, relationship")
      .eq("parent_user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: true }),
    supabase
      .from("parent_invites")
      .select("expires_at")
      .eq("student_user_id", user.id)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("parent_links")
      .select("id", { count: "exact", head: true })
      .eq("student_user_id", user.id)
      .eq("status", "active"),
  ]);

  const wards = await Promise.all(
    (parentLinksResult.data ?? []).map(async (link): Promise<ParentWard> => {
      const { data } = await supabase.rpc("get_parent_dashboard", {
        target_student_id: link.student_user_id,
      });
      const dashboard = safeDashboard(data);
      return {
        linkId: link.id,
        studentId: link.student_user_id,
        relationship: link.relationship,
        name: dashboard?.student.name ?? "Learner",
        careerTitle:
          dashboard?.roadmap?.career_title ?? dashboard?.recommendation?.career_title ?? null,
        lastActiveAt:
          dashboard?.roadmap?.last_activity_at ?? dashboard?.student.last_active_day ?? null,
      };
    }),
  );

  return {
    userId: user.id,
    wards,
    activeInviteExpiresAt: inviteResult.data?.expires_at ?? null,
    linkedGuardianCount: studentLinksResult.count ?? 0,
  };
}
