"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { sendGroupMessage, type ChatState } from "@/lib/community";

const initialState: ChatState = { ok: false, error: null, message: null };

export function GroupChat({ groupId }: { groupId: string }) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [state, formAction, pending] = useActionState(
    sendGroupMessage.bind(null, groupId),
    initialState
  );

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex gap-2">
      <input
        name="content"
        required
        maxLength={1000}
        placeholder="Write a message..."
        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending..." : "Send"}
      </button>
      {state.error && (
        <p
          aria-live="polite"
          className="mt-2 w-full text-sm text-amber-400"
        >
          {state.error}
        </p>
      )}
    </form>
  );
}