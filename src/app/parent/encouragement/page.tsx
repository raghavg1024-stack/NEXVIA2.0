"use client";

import { useState } from "react";

type EncouragementOutput = {
  message: string;
  source: "parent" | "mentor";
};

export default function ParentEncouragementForm() {
  const [message, setMessage] = useState<string>("");
  const [sent, setSent] = useState<{ success: boolean; mentorMessage?: EncouragementOutput } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    setSent(null);
    try {
      const res = await fetch("/api/parent/encouragement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: "demo-student-123", message: trimmed }),
      });
      const data = await res.json() as EncouragementOutput;
      setSent({ success: true, mentorMessage: data });
      setMessage("");
    } catch (err) {
      console.error("Failed to send encouragement:", err);
      setSent({ success: false });
    }
  };

  if (sent?.success && sent.mentorMessage) {
    const { message: mentorMsg } = sent.mentorMessage;
    return (
      <div className="rounded-2xl border border-line bg-card p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-accent p-3 text-sm text-accent font-medium">
            You
          </div>
          <div className="flex-1 p-3 bg-violet-500/20 rounded-xl text-slate-300 text-sm">
            {mentorMsg}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-6">
      <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-4">
        Send Encouragement
      </h3>
      <p className="text-slate-400 text-sm mb-4">
        Your note will be rephrased warmly and connected to what your child just did.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share a short encouragement (max 150 chars)"
            rows={3}
            className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            maxLength={150}
            disabled={sent?.success === true}
          />
          <p className="mt-1 text-xs text-slate-500">
            {message.length}/150 characters
          </p>
        </div>
        <button
          type="submit"
          disabled={sent?.success === true || message.trim().length === 0}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sent?.success ? "Sent!" : "Send Encouragement"}
        </button>
      </form>
      {sent?.success && (
        <p className="mt-3 text-xs text-slate-500">
          The mentor will deliver this warmly, connecting it to recent activity.
        </p>
      )}
      {sent?.success === false && (
        <p className="mt-3 text-sm text-red-500">
          Failed to send. Please try again.
        </p>
      )}
    </div>
  );
}