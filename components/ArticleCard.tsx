import Link from "next/link";
import { Badge } from "./ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/lib/content";

export function ArticleCard({ article, featured }: { article: Article; featured?: boolean }) {
  return (
    <article className={`group bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-elevated card-shimmer transition-all duration-300 ${featured ? "md:flex" : ""}`}>
      <Link href={`/articles/${article.slug}`} className={`block shrink-0 overflow-hidden ${featured ? "md:w-[52%]" : ""}`}>
        <img src={article.featuredImage} alt={article.imageAlt} width={800} height={450} className="w-full h-48 md:h-56 object-cover group-hover:scale-[1.03] transition duration-500" loading="lazy" />
      </Link>
      <div className="p-5 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="default">{article.category}</Badge>
          {article.evidenceLevel && <Badge variant="success">{article.evidenceLevel}</Badge>}
          {article.reviewStatus === "medically-reviewed" && <Badge variant="accent">✓ Medically reviewed</Badge>}
        </div>
        <Link href={`/articles/${article.slug}`} className="hover:text-brand-600">
          <h3 className={`font-display font-bold leading-tight ${featured ? "text-xl md:text-2xl" : "text-lg"}`}>{article.title}</h3>
        </Link>
        {article.deck && <p className="text-sm text-muted mt-2 line-clamp-2">{article.deck}</p>}
        <div className="flex items-center gap-2 mt-3 text-xs text-muted">
          <span>{article.author.name}</span><span>•</span><span>{formatDate(article.publishedAt)}</span><span>•</span><span>{article.readingTime} min</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {article.topics.slice(0,3).map(t=> <span key={t} className="text-xs bg-surface border border-border px-2 py-0.5 rounded-full">{t}</span>)}
        </div>
      </div>
    </article>
  )
}

export function ArticleCardCompact({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="flex gap-3 p-3 rounded-xl hover:bg-white border border-transparent hover:border-border hover:shadow-card transition">
      <img src={article.featuredImage} alt="" width={96} height={96} className="h-20 w-20 rounded-xl object-cover shrink-0" />
      <div>
        <p className="text-xs text-brand-600 font-semibold">{article.category}</p>
        <p className="font-semibold leading-tight text-sm line-clamp-2">{article.title}</p>
        <p className="text-xs text-muted mt-1">{article.readingTime} min • {formatDate(article.publishedAt)}</p>
      </div>
    </Link>
  )
}
