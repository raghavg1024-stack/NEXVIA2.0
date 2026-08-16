"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { clearChat, getChat, sendMessage } from "@/lib/mentor";
import type { MentorClearState, MentorSendState } from "@/lib/mentor";
import type { MentorMessage } from "@/lib/types";
import { MentorReply } from "../_components/mentor-reply";

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
    <main className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <span className="font-display text-sm text-accent">01.</span>
          <h1 className="mt-1 font-display text-2xl uppercase tracking-tight text-slate-900">AI Mentor</h1>
          <p className="mt-1 text-sm text-slate-500">
            Ask about careers, resumes, interviews, projects, and more.
          </p>
        </div>
        {!empty && (
          <button
            type="button"
            onClick={handleClear}
            disabled={clearPending || sendPending}
            className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:border-red-400 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {clearPending ? "Clearing..." : "Clear chat"}
          </button>
        )}
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-line bg-card p-4 sm:p-6">
        {empty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full min-h-[300px] flex-col items-center justify-center text-center"
          >
            <p className="max-w-md text-slate-500">
              Your mentor is here to keep you moving. Pick a starter question or
              type your own.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              {STARTER_QUESTIONS.map((question, i) => (
                <motion.button
                  key={question}
                  type="button"
                  onClick={() => sendQuestion(question)}
                  disabled={sendPending}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.3 }}
                  className="rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-sm text-accent transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {question}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                    message.role === "assistant"
                      ? "rounded-tl-sm border border-line bg-slate-50"
                      : "rounded-tr-sm whitespace-pre-line bg-slate-900 text-white"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <MentorReply content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {(sendState.error || clearState.error) && (
        <p className="mt-3 text-sm text-red-600">{sendState.error ?? clearState.error}</p>
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
          className="flex-1 resize-none rounded-2xl border border-line bg-card px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={sendPending || input.trim().length === 0}
          className="shrink-0 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sendPending ? "Sending..." : "Send"}
        </button>
      </form>
    </main>
  );
}