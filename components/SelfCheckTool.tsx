"use client";
import { useState } from "react";
import { ShieldCheck, HeartPulse, Sparkles, RefreshCw, PhoneCall, Info } from "lucide-react";
import Link from "next/link";

interface Question {
  id: number;
  prompt: string;
  options: { label: string; score: number }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "How often over the past two weeks have you felt overwhelmed by daily responsibilities?",
    options: [
      { label: "Rarely or not at all", score: 0 },
      { label: "Several days", score: 1 },
      { label: "More than half the days", score: 2 },
      { label: "Nearly every day", score: 3 },
    ],
  },
  {
    id: 2,
    prompt: "How restful has your sleep felt upon waking?",
    options: [
      { label: "Consistently restful and energized", score: 0 },
      { label: "Occasionally tired", score: 1 },
      { label: "Frequently waking up exhausted", score: 2 },
      { label: "Chronic insomnia or broken sleep", score: 3 },
    ],
  },
  {
    id: 3,
    prompt: "How easily have you been able to unwind and relax during your free time?",
    options: [
      { label: "Easily able to disconnect", score: 0 },
      { label: "Takes some time, but manageable", score: 1 },
      { label: "Mind constantly races with worry", score: 2 },
      { label: "Unable to relax, constant tension", score: 3 },
    ],
  },
  {
    id: 4,
    prompt: "Do you have someone you feel comfortable talking to when feeling down?",
    options: [
      { label: "Yes, a strong support circle", score: 0 },
      { label: "One or two trusted people", score: 1 },
      { label: "Hesitant to burden others", score: 2 },
      { label: "Feel completely isolated", score: 3 },
    ],
  },
];

export function SelfCheckTool() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;

  function selectOption(questionId: number, score: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  }

  function reset() {
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white rounded-3xl p-6 md:p-8 shadow-elevated relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-2 bg-brand-500/30 rounded-xl text-accent-300">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent-300">
            Interactive Health Tool
          </span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs bg-white/10 backdrop-blur px-3 py-1 rounded-full text-white/90">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Non-Diagnostic Educational Screener
        </span>
      </div>

      <h2 className="font-display font-extrabold text-2xl md:text-3xl mt-4 leading-tight">
        Wellbeing & Stress Self-Check
      </h2>
      <p className="text-white/80 text-sm mt-1 max-w-2xl leading-relaxed">
        Take 1 minute to reflect on your current stress levels. This tool provides evidence-informed coping
        ideas and guidance on when to seek professional care.
      </p>

      {!submitted ? (
        <div className="mt-6 space-y-6">
          <div className="space-y-5">
            {QUESTIONS.map((q, idx) => (
              <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-5">
                <p className="text-sm md:text-base font-semibold text-white/95">
                  <span className="text-accent-400 mr-1.5">0{idx + 1}.</span> {q.prompt}
                </p>
                <div className="grid sm:grid-cols-2 gap-2.5 mt-3">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.score;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => selectOption(q.id, opt.score)}
                        className={`text-left text-xs md:text-sm px-4 py-2.5 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-accent-400 text-ink dark:text-[#17212B] font-semibold border-accent-300 shadow-md transform scale-[1.01]"
                            : "bg-white/5 border-white/15 text-white/90 hover:bg-white/10 hover:border-white/25"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <p className="text-xs text-white/70">
              Answered {answeredCount} of {totalQuestions} questions
            </p>
            <button
              type="button"
              disabled={answeredCount < totalQuestions}
              onClick={() => setSubmitted(true)}
              className="bg-accent-400 hover:bg-accent-500 disabled:opacity-40 disabled:hover:bg-accent-400 text-ink dark:text-[#17212B] font-bold px-6 py-2.5 rounded-full text-sm transition shadow-lg inline-flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" /> View My Insights & Coping Strategies
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-white text-ink rounded-2xl p-6 shadow-card space-y-5 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Reflection Summary</span>
              <h3 className="font-display font-bold text-xl text-brand-700 mt-0.5">
                {currentScore <= 3
                  ? "Low Stress — Steady Baseline"
                  : currentScore <= 7
                  ? "Moderate Stress — Noticeable Strain"
                  : "High Stress / Overwhelm — Extra Care Recommended"}
              </h3>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-brand-700 border border-border px-3 py-1.5 rounded-full hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retake check
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
              <p className="font-semibold text-brand-700 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-brand-500" /> Tailored Coping Steps
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-ink/80 text-xs md:text-sm">
                {currentScore <= 3 ? (
                  <>
                    <li>Continue maintaining steady sleep routines and daily hydration.</li>
                    <li>Schedule regular micro-breaks to preserve emotional resilience.</li>
                    <li>Check in with a friend or colleague to nurture positive social bonds.</li>
                  </>
                ) : currentScore <= 7 ? (
                  <>
                    <li>Block 20 minutes daily for screen-free calming activities (e.g., walking, reading).</li>
                    <li>Practice the 4-7-8 breathing technique when experiencing racing thoughts.</li>
                    <li>Set clear boundary end-times for work and evening notifications.</li>
                  </>
                ) : (
                  <>
                    <li>Prioritize essential tasks and delegate non-critical responsibilities.</li>
                    <li>Share how you are feeling with a trusted loved one or healthcare professional.</li>
                    <li>Avoid making major stressful life decisions during acute exhaustion.</li>
                  </>
                )}
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-amber-700" /> When to Connect with Support
                </p>
                <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                  If exhaustion, sleep disruption, or anxiety persist for more than 2 weeks, reaching out to a
                  licensed counselor or primary care physician is a proactive step towards healing.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-950">In distress or need help?</span>
                <Link
                  href="/help"
                  className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition"
                >
                  <PhoneCall className="h-3 w-3" /> Crisis Resources
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-3 text-xs text-muted">
            <p>
              <strong>Safety Note:</strong> This self-check tool is purely educational and does not provide clinical
              diagnosis, therapy, or medical evaluation.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
