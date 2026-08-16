import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGroups, joinGroup, leaveGroup } from "@/lib/community";
import { CreateGroupForm } from "./create-group-form";
import { Reveal, Stagger, StaggerItem } from "../_components/motion";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const groups = await getGroups();

  return (
    <div className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-display text-sm text-accent">01.</span>
        <h1 className="mt-2 font-display text-3xl uppercase tracking-tight text-slate-900">Community</h1>
        <p className="mt-2 text-slate-500">
          Join study groups, meet peers, and learn together.
        </p>
      </Reveal>

      <Reveal className="mt-8" delay={0.1}>
        <CreateGroupForm />
      </Reveal>

      <Reveal className="mt-12 flex items-baseline gap-4">
        <span className="font-display text-sm text-accent">02.</span>
        <h2 className="font-display text-2xl uppercase tracking-tight text-slate-900">Study groups</h2>
      </Reveal>
      {groups.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-line bg-card p-6 text-slate-500">
          No study groups yet. Create the first one to get started.
        </p>
      ) : (
        <Stagger className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ group, member_count, is_member, is_owner }) => (
            <StaggerItem key={group.id}>
              <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-xl hover:shadow-slate-200">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/community/${group.id}`}
                    className="font-display text-lg uppercase tracking-tight text-slate-900 transition-colors hover:text-accent"
                  >
                    {group.name}
                  </Link>
                  {is_owner && (
                    <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                      You own this
                    </span>
                  )}
                </div>
                <p className="mt-2 flex-1 text-sm text-slate-500">
                  {group.description || "No description yet."}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  {member_count} member{member_count === 1 ? "" : "s"}
                </p>
                <div className="mt-4">
                  {is_member && !is_owner ? (
                    <form action={leaveGroup.bind(null, group.id)}>
                      <button
                        type="submit"
                        className="w-full rounded-xl border border-line px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                      >
                        Leave
                      </button>
                    </form>
                  ) : (
                    <form action={joinGroup.bind(null, group.id)}>
                      <button
                        type="submit"
                        className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-slate-800"
                      >
                        Join
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}