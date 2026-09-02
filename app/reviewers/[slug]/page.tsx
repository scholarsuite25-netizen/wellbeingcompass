import { reviewers, articles } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
export function generateStaticParams(){ return reviewers.map(r=>({ slug:r.slug })); }
export default function Page({ params }: { params: { slug:string }}){
  const rev = reviewers.find(r=>r.slug===params.slug);
  if(!rev) return <div className="mx-auto max-w-3xl px-4 py-12">Reviewer not found.</div>;
  const by = articles.filter(a=>a.reviewer?.slug===rev.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="bg-green-50 border border-green-200 rounded-3xl p-6 flex gap-4">
        <img src={rev.avatar} alt={rev.name} width={80} height={80} className="h-20 w-20 rounded-full object-cover"/>
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-700">{rev.name}</h1>
          <p className="text-sm text-muted">{rev.credentials} — {rev.specialty}</p>
          <p className="text-xs text-muted mt-2">Reviewer bios are illustrative sample data; replace with verified credentials in production.</p>
        </div>
      </div>
      <h2 className="font-bold mt-6">Reviewed articles</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
        {by.map(a=> <ArticleCard key={a.slug} article={a} />)}
        {by.length===0 && <p className="text-muted text-sm">No reviewed articles yet.</p>}
      </div>
    </div>
  )
}
