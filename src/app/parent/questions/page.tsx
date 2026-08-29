"use client";

import { useState } from "react";

export default function ParentQuestionsPage() {
  const [questions, setQuestions] = useState<string[] | null>(null);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/parent/questions", { cache: "no-store" });
      const data = await res.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-card p-6">
      <h3 className="font-display text-sm uppercase tracking-wider text-slate-400 mb-4">
        Questions to Ask Your Child
      </h3>
      <p className="text-slate-400 text-sm">
        Generate personalized questions to connect with your child about their
        career exploration.
      </p>
      <button
        onClick={fetchQuestions}
        className="mt-4 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Generate Questions
      </button>
      {questions && (
        <div className="mt-4">
          <p className="text-slate-400 text-sm mb-4">
            Try these warm, open-ended questions to engage with your child:
          </p>
          <ul className="space-y-3 text-slate-300 text-sm">
            {questions.map((q, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-accent font-medium">•</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-slate-500">
            <p>These questions reference your childs specific situation without assuming reasons.</p>
            <p>Focus on open-ended exploration, not directing a specific choice.</p>
          </div>
        </div>
      )}
    </div>
  );
}