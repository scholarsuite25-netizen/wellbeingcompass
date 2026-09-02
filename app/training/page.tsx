import Link from "next/link";
import { courses } from "@/lib/content";
import { Badge } from "@/components/ui/Badge";
export const metadata = { title: "Training & Learning Hub" };
export default function Page(){
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display font-extrabold text-3xl text-brand-700">Training & Learning</h1>
      <p className="text-muted mt-2 max-w-3xl">Short, practical courses for community awareness — mental health literacy, stress, relationships, first-aid awareness and more. Educational-only; not clinical certification.</p>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {courses.map(c=>(
          <div key={c.slug} className="bg-white border border-border rounded-2xl p-5">
            <Badge variant="accent">{c.duration} • {c.lessons} lessons</Badge>
            <h2 className="font-semibold mt-3">{c.title}</h2>
            <p className="text-sm text-muted mt-1">{c.description}</p>
            <p className="text-xs text-muted mt-2">{c.audience}</p>
            <Link href={`/training/${c.slug}`} className="mt-3 inline-flex bg-brand-500 text-white px-4 py-2 rounded-full text-sm font-semibold">View course</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
