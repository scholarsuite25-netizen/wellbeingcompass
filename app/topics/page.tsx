import Link from "next/link";
import { articles } from "@/lib/content";
export const metadata = { title: "Topics" };
export default function Page(){
  const allTopics = Array.from(new Set(articles.flatMap(a=>a.topics)));
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl text-brand-700">Topics</h1>
      <div className="flex flex-wrap gap-2 mt-4">
        {allTopics.map(t=> <Link key={t} href={`/topics/${encodeURIComponent(t.toLowerCase().replace(/\s+/g,"-"))}`} className="bg-white border border-border px-4 py-2 rounded-full text-sm hover:bg-brand-50">{t}</Link>)}
      </div>
    </div>
  )
}
