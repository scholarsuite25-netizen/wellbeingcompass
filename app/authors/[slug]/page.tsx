import { authors, articles } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
export function generateStaticParams(){ return authors.map(a=>({ slug:a.slug })); }
export default function Page({ params }: { params: { slug: string } }){
  const author = authors.find(a=>a.slug===params.slug);
  if(!author) return <div className="mx-auto max-w-3xl px-4 py-12">Author not found.</div>;
  const by = articles.filter(a=>a.author.slug===author.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="bg-white border border-border rounded-3xl p-6 flex gap-4">
        <img src={author.avatar} alt={author.name} width={80} height={80} className="h-20 w-20 rounded-full object-cover"/>
        <div>
          <h1 className="font-display font-bold text-2xl text-brand-700">{author.name}</h1>
          <p className="text-sm text-brand-600">{author.role}</p>
          <p className="text-sm text-muted mt-2">{author.bio}</p>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context":"https://schema.org","@type":"Person", name:author.name, jobTitle:author.role })}}/>
        </div>
      </div>
      <h2 className="font-bold mt-6">Articles by {author.name}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
        {by.map(a=> <ArticleCard key={a.slug} article={a} />)}
      </div>
    </div>
  )
}
