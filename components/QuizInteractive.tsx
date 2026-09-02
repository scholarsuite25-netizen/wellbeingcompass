"use client";
import { useState } from "react";

type Q = { id: string; question: string; options: string[]; answer: number; explain?: string };

export function QuizInteractive({ quizzes, courseSlug }: { quizzes: Q[]; courseSlug: string }) {
  const [idx,setIdx]=useState(0);
  const [picked,setPicked]=useState<number|null>(null);
  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);
  const [progress,setProgress]=useState<Record<string,number>>({});
  if(quizzes.length===0) return <p className="text-sm text-muted">No quizzes yet — coming soon. Every course will have reflective checks, not graded exams. This is awareness education.</p>;
  const q = quizzes[idx];
  function submit(){
    if(picked===null) return;
    if(picked===q.answer) setScore(s=>s+1);
    if(idx===quizzes.length-1){
      setDone(true);
      const pct = Math.round(((picked===q.answer?score+1:score)/quizzes.length)*100);
      const key = `wellmind_progress_${courseSlug}`;
      const prev = JSON.parse(localStorage.getItem(key)||"{}");
      prev.best = Math.max(prev.best||0, pct);
      prev.completed = true;
      localStorage.setItem(key, JSON.stringify(prev));
      setProgress(prev);
    } else {
      setIdx(i=>i+1); setPicked(null);
    }
  }
  if(done){
    const pct = Math.round((score/quizzes.length)*100);
    return (
      <div className="bg-brand-700 text-white rounded-2xl p-6 text-center animate-in fade-in">
        <p className="text-accent-400 font-semibold text-xs tracking-widest uppercase">Course check</p>
        <h3 className="font-display font-bold text-2xl mt-2">You scored {score}/{quizzes.length} ({pct}%)</h3>
        <p className="text-white/80 text-sm mt-2">{pct>=70 ? "Great — you’ve got the key ideas. Keep practicing one small step this week." : "Nice effort — review the explanations and try again. Learning is repetition."}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button onClick={()=>{setIdx(0);setPicked(null);setScore(0);setDone(false)}} className="bg-white text-brand-700 px-4 py-2 rounded-full font-semibold text-sm">Retry</button>
          <span className="text-xs bg-white/15 rounded-full px-3 py-2 self-center">Progress saved locally • Certificate preview on 80%+</span>
        </div>
        {pct>=80 && <div className="mt-4 bg-accent-400 text-ink rounded-xl p-3 text-sm font-semibold">🎉 Certificate of awareness (demo) — {courseSlug} — educational, not clinical certification</div>}
      </div>
    )
  }
  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <div className="flex justify-between text-xs text-muted"><span>Question {idx+1} of {quizzes.length}</span><span>Score: {score}</span></div>
      <div className="w-full bg-surface rounded-full h-1.5 mt-2 overflow-hidden"><div className="bg-brand-500 h-full transition-all duration-500" style={{ width:`${((idx)/quizzes.length)*100}%`}}/></div>
      <h4 className="font-semibold mt-4">{q.question}</h4>
      <div className="mt-3 space-y-2">
        {q.options.map((o,i)=>(
          <label key={i} className={`flex items-center gap-2 border rounded-xl px-3 py-2 text-sm cursor-pointer transition hover:border-brand-300 ${picked===i ? "bg-brand-50 border-brand-500" : "bg-white border-border"}`}>
            <input type="radio" name="quiz" checked={picked===i} onChange={()=>setPicked(i)} className="accent-brand-500"/>
            {o}
          </label>
        ))}
      </div>
      {picked!==null && q.explain && <p className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2 mt-3">💡 {q.explain}</p>}
      <button onClick={submit} disabled={picked===null} className="mt-4 w-full bg-brand-500 text-white py-2.5 rounded-full font-semibold hover:bg-brand-600 disabled:opacity-50 transition hover:scale-[1.01] active:scale-[0.99]">{idx===quizzes.length-1 ? "Finish" : "Next"}</button>
    </div>
  )
}
