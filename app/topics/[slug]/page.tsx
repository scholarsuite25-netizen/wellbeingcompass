import { articles } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
import Link from "next/link";
export default function Page({ params }: { params:{ slug:string } }){
  const topic = decodeURIComponent(params.slug).replace(/-/g," ");
  const list = articles.filter(a=> a.topics.some(t=> t.toLowerCase()===topic.toLowerCase()) || a.category.toLowerCase().replace(/[^a-z]+/g,"-")===params.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/search" className="text-sm text-brand-600">← Search</Link>
      <h1 className="font-display font-bold text-3xl text-brand-700 mt-2 capitalize">{topic}</h1>
      <p className="text-muted mt-1">{list.length} article{list.length!==1?"s":""} tagged with this topic.</p>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {list.map(a=> <ArticleCard key={a.slug} article={a} />)}
      </div>
      {list.length===0 && <p className="text-muted mt-6">No articles found for this topic. Try browsing health areas.</p>}
    </div>
  )
}
