"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { clearChat, getChat, sendMessage } from "@/lib/mentor";
import type { MentorClearState, MentorSendState } from "@/lib/mentor";
import type { MentorMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

const sendInitial: MentorSendState = { ok: true };
const clearInitial: MentorClearState = { ok: true };

const STARTER_QUESTIONS = [
  "Which career is the best fit for me?",
  "How should I build my resume?",
  "How do I prepare for interviews?",
  "What project should I build first?",
  "What should I do next?",
  "I feel stuck and unmotivated. Help me.",
];

export default function MentorPage() {
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [input, setInput] = useState("");
  const [sendState, sendAction, sendPending] = useActionState(sendMessage, sendInitial);
  const [clearState, clearAction, clearPending] = useActionState(clearChat, clearInitial);
  const handledIds = useRef<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    getChat()
      .then((chat) => {
        if (active) setMessages(chat);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const additions: MentorMessage[] = [];
    if (sendState.userMessage) additions.push(sendState.userMessage);
    if (sendState.assistantMessage) additions.push(sendState.assistantMessage);
    const fresh = additions.filter((m) => !handledIds.current.has(m.id));
    if (fresh.length === 0) return;
    for (const m of fresh) handledIds.current.add(m.id);
    setMessages((prev) => [...prev, ...fresh]);
    if (fresh.some((m) => m.role === "user")) setInput("");
  }, [sendState]);

  useEffect(() => {
    if (clearState.ok && !clearPending) {
      getChat()
        .then((chat) => setMessages(chat))
        .catch(() => {});
    }
  }, [clearState, clearPending]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendQuestion = (question: string) => {
    if (sendPending) return;
    setInput(question);
    const formData = new FormData();
    formData.set("content", question);
    sendAction(formData);
  };

  const handleClear = () => {
    if (clearPending || messages.length === 0) return;
    if (window.confirm("Clear the entire chat history?")) {
      clearAction(new FormData());
    }
  };

  const empty = messages.length === 0;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">AI Mentor</h1>
          <p className="mt-1 text-sm text-slate-400">
            Ask about careers, resumes, interviews, projects, and more.
          </p>
        </div>
        {!empty && (
          <button
            type="button"
            onClick={handleClear}
            disabled={clearPending || sendPending}
            className="shrink-0 rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {clearPending ? "Clearing..." : "Clear chat"}
          </button>
        )}
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-4 sm:p-6">
        {empty ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <p className="max-w-md text-slate-300">
              Your mentor is here to keep you moving. Pick a starter question or
              type your own.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {STARTER_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendQuestion(question)}
                  disabled={sendPending}
                  className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 transition-colors hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-line rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "assistant"
                    ? "rounded-tl-sm border border-indigo-500/30 bg-slate-900/80 text-slate-200"
                    : "rounded-tr-sm bg-indigo-600 text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {(sendState.error || clearState.error) && (
        <p className="mt-3 text-sm text-red-400">{sendState.error ?? clearState.error}</p>
      )}

      <form action={sendAction} className="mt-4 flex items-end gap-2">
        <textarea
          name="content"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !sendPending) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          rows={2}
          placeholder="Ask your mentor anything..."
          className="flex-1 resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={sendPending || input.trim().length === 0}
          className="shrink-0 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sendPending ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}