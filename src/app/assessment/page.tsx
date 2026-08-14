"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_QUESTIONS } from "@/lib/data";
import type { AssessmentResponse } from "@/lib/types";
import { completeAssessment, getAssessment, saveProgress } from "@/lib/assessment";

export default function AssessmentPage() {
  const router = useRouter();
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessment = useCallback(async () => {
    try {
      const data = await getAssessment();
      if (data.assessment?.status === "completed") {
        router.replace("/analysis");
        return;
      }
      if (data.assessment?.responses?.length) {
        setResponses(data.assessment.responses);
        const resumeIndex =
          data.assessment.current_question_index ?? data.assessment.responses.length;
        setIndex(Math.min(resumeIndex, ASSESSMENT_QUESTIONS.length - 1));
      }
      setLoading(false);
    } catch {
      setError("We couldn't load your assessment. Please try again.");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    let active = true;
    getAssessment()
      .then((data) => {
        if (!active) return;
        if (data.assessment?.status === "completed") {
          router.replace("/analysis");
          return;
        }
        if (data.assessment?.responses?.length) {
          setResponses(data.assessment.responses);
          const resumeIndex =
            data.assessment.current_question_index ?? data.assessment.responses.length;
          setIndex(Math.min(resumeIndex, ASSESSMENT_QUESTIONS.length - 1));
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("We couldn't load your assessment. Please try again.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [router]);

  const total = ASSESSMENT_QUESTIONS.length;
  const question = ASSESSMENT_QUESTIONS[index];
  const currentAnswer = responses.find((r) => r.question_id === question?.id)?.answer;
  const isLast = index === total - 1;
  const hasAnswer =
    currentAnswer !== undefined &&
    currentAnswer !== null &&
    !(Array.isArray(currentAnswer) && currentAnswer.length === 0);

  const setAnswer = (answer: number | string | string[]) => {
    setResponses((prev) => [
      ...prev.filter((r) => r.question_id !== question.id),
      { question_id: question.id, category: question.category, answer },
    ]);
  };

  const toggleOption = (option: string) => {
    const selected = Array.isArray(currentAnswer) ? (currentAnswer as string[]) : [];
    setAnswer(selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option]);
  };

  const handleNext = () => {
    const nextIndex = index + 1;
    setIndex(nextIndex);
    saveProgress(responses, nextIndex);
  };

  const handleBack = () => {
    const prevIndex = index - 1;
    setIndex(prevIndex);
    saveProgress(responses, prevIndex);
  };

  const handleComplete = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await completeAssessment(responses);
      router.push("/analysis");
    } catch {
      setError("We couldn't finish your assessment. Please try again.");
      setSubmitting(false);
    }
  };

  const progress = Math.round(((index + 1) / total) * 100);
  const selectedValues = Array.isArray(currentAnswer) ? (currentAnswer as string[]) : [];
  const ratingValues = Array.from(
    { length: (question?.max ?? 5) - (question?.min ?? 1) + 1 },
    (_, i) => (question?.min ?? 1) + i
  );

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />
        <p className="mt-4 text-sm text-slate-400">Loading your assessment…</p>
      </main>
    );
  }

  if (error && !question) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-slate-100">
        <h1 className="text-xl font-semibold text-white">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-400">{error}</p>
        <button
          onClick={() => {
            setLoading(true);
            setError(null);
            fetchAssessment();
          }}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Career Discovery Assessment</h1>
            <p className="text-sm text-slate-400">
              Question {index + 1} of {total}
            </p>
          </div>
          <span className="text-sm font-medium text-indigo-400">{progress}%</span>
        </header>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <span className="inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-300">
            {question.category.replace("_", " ")}
          </span>
          <h2 className="mt-4 text-xl font-semibold text-white sm:text-2xl">{question.text}</h2>

          <div className="mt-8">
            {question.type === "rating" && (
              <div className="flex flex-wrap gap-3">
                {ratingValues.map((value) => (
                  <button
                    key={value}
                    onClick={() => setAnswer(value)}
                    className={`h-12 w-12 rounded-xl text-lg font-semibold transition ${
                      currentAnswer === value
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                        : "border border-slate-700 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}

            {question.type === "choice" && (
              <div className="flex flex-col gap-3">
                {question.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAnswer(option)}
                    className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition ${
                      currentAnswer === option
                        ? "border-indigo-500 bg-indigo-600 text-white"
                        : "border-slate-700 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {question.type === "multiselect" && (
              <div className="flex flex-wrap gap-3">
                {question.options?.map((option) => {
                  const isSelected = selectedValues.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleOption(option)}
                      className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-slate-700 bg-slate-800 text-slate-300 hover:border-indigo-500 hover:text-white"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={index === 0}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-40"
          >
            Back
          </button>

          {isLast ? (
            <button
              onClick={handleComplete}
              disabled={!hasAnswer || submitting}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-40"
            >
              {submitting ? "Finishing…" : "Complete Assessment"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-40"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
