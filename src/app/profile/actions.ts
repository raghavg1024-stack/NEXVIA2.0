"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type UpdateProfileState = { error?: string | null };

export async function updateProfile(
  prevState: UpdateProfileState,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be signed in." };

  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const educationLevel = String(formData.get("education_level") ?? "").trim();
  const learningStyle = String(formData.get("learning_style") ?? "").trim();
  const goals = String(formData.get("goals") ?? "").trim();
  const rawHours = formData.get("study_hours_per_week");
  const hours = rawHours === null || rawHours === "" ? null : Number(rawHours);

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      email: email || null,
      education_level: educationLevel || null,
      learning_style: learningStyle || null,
      goals: goals || null,
      study_hours_per_week: hours !== null && Number.isFinite(hours) ? hours : null,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  redirect("/profile");
}
