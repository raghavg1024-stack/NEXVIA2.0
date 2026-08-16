"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Certificate } from "@/lib/types";

function randomSuffix(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("certificates")
      .select("id, user_id, roadmap_id, title, credential_id, issued_at")
      .eq("user_id", user.id)
      .order("issued_at", { ascending: false });

    if (error) return [];
    return (data ?? []) as Certificate[];
  } catch {
    return [];
  }
}

export async function awardCertificate(
  roadmapId: string,
  careerTitle: string
): Promise<{
  ok: boolean;
  certificate?: Certificate;
  alreadyExisted?: boolean;
  message?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { ok: false, message: "Not authenticated" };

    const { data: existing } = await supabase
      .from("certificates")
      .select("id")
      .eq("user_id", user.id)
      .eq("roadmap_id", roadmapId)
      .maybeSingle();

    if (existing) {
      return {
        ok: true,
        alreadyExisted: true,
        message: "Certificate already issued for this roadmap",
      };
    }

    const issuedAt = new Date().toISOString();
    const certificate = {
      user_id: user.id,
      roadmap_id: roadmapId,
      title: `Nexvia Certificate — ${careerTitle}`,
      credential_id: `NX-${Date.now()}-${randomSuffix(4)}`,
      issued_at: issuedAt,
    };

    const { data, error } = await supabase
      .from("certificates")
      .insert(certificate)
      .select("id, user_id, roadmap_id, title, credential_id, issued_at")
      .single();

    if (error || !data) {
      return {
        ok: false,
        message: error?.message ?? "Could not issue certificate",
      };
    }

    revalidatePath("/certificates");
    return { ok: true, alreadyExisted: false, certificate: data as Certificate };
  } catch {
    return { ok: false, message: "Something went wrong" };
  }
}
