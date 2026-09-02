import { ArticleCard } from "./ArticleCard";
import { Badge } from "./ui/Badge";
import type { Article, Category } from "@/lib/content";
import Link from "next/link";

export function HubTemplate({ title, description, category, articles, accent }: { title: string; description: string; category: Category; articles: Article[]; accent?: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="hover:text-brand-600">Home</Link> <span aria-hidden>›</span> <span className="text-ink font-medium">{title}</span>
      </nav>
      <div className={`mt-4 rounded-3xl p-6 md:p-8 border ${accent || "bg-brand-50 border-brand-100"}`}>
        <Badge>{category}</Badge>
        <h1 className="font-display font-extrabold text-3xl text-brand-700 mt-3">{title}</h1>
        <p className="text-muted mt-2 max-w-3xl leading-relaxed">{description}</p>
        <p className="text-xs text-muted mt-3">Evidence-informed • Medically reviewed where indicated • Educational, not diagnostic.</p>
      </div>
      {articles.length===0 ? (
        <div className="mt-8 text-center py-12 bg-white border border-border rounded-2xl"><p className="text-muted">No articles yet in this hub. Check back soon or explore other health areas.</p><Link href="/search" className="text-brand-600 font-semibold text-sm mt-2 inline-block">Browse all articles</Link></div>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(a=> <ArticleCard key={a.slug} article={a} />)}
        </div>
      )}
      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
        <p className="font-semibold">Educational use</p>
        <p className="text-muted mt-1">Content in this hub supports learning and awareness. It does not replace professional evaluation. If symptoms persist or worsen, speak with a qualified healthcare professional.</p>
      </div>
    </div>
  )
}
