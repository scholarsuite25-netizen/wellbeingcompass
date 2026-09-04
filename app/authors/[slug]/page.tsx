import { authors, articles } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function generateStaticParams(){ return authors.map(a=>({ slug:a.slug })); }
export default function Page({ params }: { params: { slug: string } }){
  const author = authors.find(a=>a.slug===params.slug);
  if(!author) return <div className="mx-auto max-w-3xl px-4 py-12">Author not found.</div>;
  const by = articles.filter(a=>a.author.slug===author.slug);
  const byline = author.credentials ? `${author.name}, ${author.credentials}` : author.name;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="bg-white border border-border rounded-3xl md:p-8 p-6 md:flex gap-6">
        <img src={author.profilePhoto || author.avatar} alt={author.name} width={160} height={160} className="md:h-36 md:w-36 h-28 w-28 rounded-2xl object-cover object-top shrink-0" />
        <div>
          {author.isFounder && (
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="accent">{author.credentials}</Badge>
              <Badge variant="default">Founder & Health Professional</Badge>
            </div>
          )}
          <h1 className="font-display font-bold text-3xl text-brand-700">{byline}</h1>
          <p className="text-sm text-brand-600 font-semibold mt-1">{author.professionalTitle || author.role}</p>
          {author.currentPosition && <p className="text-sm text-muted">{author.currentPosition}</p>}
          <p className="text-sm text-muted mt-2 leading-relaxed max-w-2xl">{author.isFounder ? author.shortBio || author.bio : author.bio}</p>
          {author.isFounder && (
            <Link href="/about-the-founder" className="mt-4 inline-flex items-center gap-2 bg-brand-700 hover:bg-[#0A223C] text-white font-semibold px-5 py-2.5 rounded-full transition">
              View Full Profile <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context":"https://schema.org","@type":"Person", name:byline, jobTitle:author.professionalTitle || author.role, worksFor: author.currentPosition ? { "@type":"Organization", name: author.currentPosition.replace(/^.*?,?\s*/, "") } : undefined, image: author.profilePhoto })}}/>
        </div>
      </div>
      <h2 className="font-bold mt-6">Articles by {author.name}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
        {by.map(a=> <ArticleCard key={a.slug} article={a} />)}
      </div>
    </div>
  )
}
