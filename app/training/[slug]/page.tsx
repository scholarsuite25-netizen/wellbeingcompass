import { courses } from "@/lib/content";
import Link from "next/link";
import { EnrollButton } from "./EnrollButton";
import { QuizInteractive } from "@/components/QuizInteractive";
import { prisma } from "@/lib/prisma";
export function generateStaticParams(){ return courses.map(c=>({ slug:c.slug })); }
export default async function Page({ params }: { params: { slug: string } }){
  const course = courses.find(c=>c.slug===params.slug);
  if(!course) return <div className="mx-auto max-w-3xl px-4 py-12">Course not found.</div>;
  const lessons = Array.from({length: course.lessons}, (_,i)=>({ title: `Module ${i+1}: ${["Understanding the basics","Building your toolbox","Daily practice","Relationships & support","Staying on track","Review & next steps"][i] || "Deep dive"}`, mins: 18+ i*4 }));
  // Try DB quizzes (with progress/certificate) — fallback to static if DB empty
  let quizzes: any[] = [];
  try {
    const dbCourse = await prisma.course.findUnique({ where:{ slug: params.slug }, include:{ quizzes:true }});
    if(dbCourse?.quizzes?.length) quizzes = dbCourse.quizzes.map(q=>({ id:q.id, question:q.question, options: JSON.parse(q.options), answer:q.answer, explain:q.explain||undefined }));
  } catch{}
  if(quizzes.length===0 && params.slug==="stress-management-101"){
    quizzes = [
      { id:"q1", question:"Which breathing pattern is suggested for a one-minute reset?", options:["Inhale 8 hold 8","Inhale 4 hold 2 exhale 6","Inhale 2 exhale 2","Hold breath 30s"], answer:1, explain:"Inhale 4, hold 2, exhale 6, repeat 4 times helps settle the body."},
      { id:"q2", question:"Best response to persistent, interfering anxiety?", options:["Ignore it","Try harder alone","Speak with a healthcare professional","Avoid all stress"], answer:2, explain:"Persistent or interfering symptoms deserve professional guidance."},
    ];
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/training" className="text-sm text-brand-600">← All courses</Link>
      <h1 className="font-display font-bold text-3xl text-brand-700 mt-2 animate-in fade-in slide-in-from-bottom-2">{course.title}</h1>
      <p className="text-muted mt-2">{course.description}</p>
      <div className="mt-6 bg-white border border-border rounded-2xl p-5 shadow-card hover:shadow-elevated transition-shadow">
        <p className="font-semibold">Course content</p>
        <ul className="mt-3 space-y-2">
          {lessons.map(l=> <li key={l.title} className="flex justify-between text-sm border-b border-border py-2"><span>{l.title}</span><span className="text-muted">{l.mins} min</span></li>)}
        </ul>
        <EnrollButton />
        <p className="text-xs text-muted mt-2">Educational awareness only. Not a substitute for professional training or certification.</p>
      </div>
      <div className="mt-8">
        <h2 className="font-display font-bold text-xl text-brand-700">Check your understanding</h2>
        <p className="text-sm text-muted">Interactive, low-stakes checks — your best score is saved locally. 80%+ shows a printable awareness note (not a clinical certificate).</p>
        <div className="mt-4"><QuizInteractive quizzes={quizzes} courseSlug={params.slug} /></div>
      </div>
    </div>
  )
}
