import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getGroups, joinGroup, leaveGroup } from "@/lib/community";
import { CreateGroupForm } from "./create-group-form";

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
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-white">Community</h1>
      <p className="mt-2 text-slate-400">
        Join study groups, meet peers, and learn together.
      </p>

      <div className="mt-8">
        <CreateGroupForm />
      </div>

      <h2 className="mt-12 text-xl font-semibold text-white">Study groups</h2>
      {groups.length === 0 ? (
        <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
          No study groups yet. Create the first one to get started.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ group, member_count, is_member, is_owner }) => (
            <div
              key={group.id}
              className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition-colors hover:border-indigo-500/40"
            >
              <div className="flex items-start justify-between gap-3">
                <Link
                  href={`/community/${group.id}`}
                  className="font-semibold text-white transition-colors hover:text-indigo-300"
                >
                  {group.name}
                </Link>
                {is_owner && (
                  <span className="shrink-0 rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-300">
                    You own this
                  </span>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm text-slate-400">
                {group.description || "No description yet."}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                {member_count} member{member_count === 1 ? "" : "s"}
              </p>
              <div className="mt-4">
                {is_member && !is_owner ? (
                  <form action={leaveGroup.bind(null, group.id)}>
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                    >
                      Leave
                    </button>
                  </form>
                ) : (
                  <form action={joinGroup.bind(null, group.id)}>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-colors hover:bg-indigo-500"
                    >
                      Join
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}