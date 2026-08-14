import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { StudyGroupMessage } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import {
  getGroup,
  getGroupMembers,
  getGroupMessages,
  isGroupMember,
  joinGroup,
} from "@/lib/community";
import { GroupChat } from "../group-chat";

export const dynamic = "force-dynamic";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const [group, members, member] = await Promise.all([
    getGroup(groupId),
    getGroupMembers(groupId),
    isGroupMember(groupId),
  ]);

  if (!group) {
    notFound();
  }

  const isOwner = group.owner_id === user.id;

  let messages: StudyGroupMessage[] = [];
  let messageError: string | null = null;
  if (member) {
    try {
      messages = await getGroupMessages(groupId);
    } catch (e) {
      messageError = e instanceof Error ? e.message : "Could not load messages.";
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6">
      <Link
        href="/community"
        className="text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
      >
        Back to community
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {group.name}
          </h1>
          <p className="mt-2 text-slate-400">
            {group.description || "No description yet."}
          </p>
        </div>
        {isOwner && (
          <span className="shrink-0 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            You own this
          </span>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Members ({members.length})
        </h2>
        {members.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No members yet.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {members.map((m) => (
              <li
                key={m.user_id}
                className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-300"
              >
                {m.full_name?.trim() || "Group member"}
              </li>
            ))}
          </ul>
        )}
      </div>

      {member ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex min-h-64 max-h-[28rem] flex-col gap-3 overflow-y-auto p-6">
            {messageError ? (
              <p className="text-sm text-amber-400">{messageError}</p>
            ) : messages.length === 0 ? (
              <p className="text-sm text-slate-500">
                No messages yet. Say hello!
              </p>
            ) : (
              messages.map((message) => {
                const own = message.user_id === user.id;
                return (
                  <div
                    key={message.id}
                    className={own ? "flex justify-end" : "flex"}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        own
                          ? "rounded-br-sm bg-indigo-600"
                          : "rounded-bl-sm bg-slate-800"
                      }`}
                    >
                      <p className="text-xs font-medium text-indigo-300">
                        {message.user_name || "Group member"}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-200">
                        {message.content}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="border-t border-slate-800 p-4">
            <GroupChat groupId={groupId} />
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">
              You are not a member of this group
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Join to see the conversation and send messages.
            </p>
          </div>
          <form action={joinGroup.bind(null, group.id)}>
            <button
              type="submit"
              className="shrink-0 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-colors hover:bg-indigo-500"
            >
              Join group
            </button>
          </form>
        </div>
      )}
    </div>
  );
}