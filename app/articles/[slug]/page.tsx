import { articles, getArticle } from "@/lib/content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { DisclaimerBox, HelpBox, ReviewBadge, ContentWarning } from "@/components/SafetyComponents";
import { ArticleCard } from "@/components/ArticleCard";
import { ReadingBar } from "@/components/ReadingBar";
import { ShareButtons } from "@/components/ShareButtons";
import { AudioRead } from "@/components/AudioRead";
import { ArticleActions } from "@/components/ArticleActions";
import { AboutTheAuthor } from "@/components/FounderProfile";
import { HealthTipOfTheDay } from "@/components/HealthTipOfTheDay";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export function generateStaticParams(){ return articles.map(a=>({ slug:a.slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug);
  if(!a) return {};
  return {
    title: `${a.title} | Wellbeing Compass`,
    description: a.excerpt,
    openGraph: {
      title: a.title,
      description: a.excerpt,
      type: "article",
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt,
      images: [{ url: a.featuredImage }],
    },
  };
}

export default function Page({ params }: { params: { slug: string } }){
  const article = getArticle(params.slug);
  if(!article) return notFound();
  const related = articles.filter(a=>a.slug!==article.slug && (a.category===article.category || a.topics.some(t=>article.topics.includes(t)))).slice(0,2);
  const jsonLd = {
    "@context":"https://schema.org",
    "@type":"Article",
    headline: article.title,
    description: article.excerpt,
    author: { "@type":"Person", name: article.author.name },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    image: article.featuredImage,
  };
  const toc = article.content.filter(c=>c.type==="heading").map(c=>c.text);
  const articleText = article.content.map(c=>c.text).join(". ");

  return (
    <>
      <ReadingBar title={article.title} readingTime={article.readingTime} />
      <div className="mx-auto max-w-7xl px-4 py-6">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd)}}/>
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/" className="hover:text-brand-600">Home</Link> › <Link href="/search" className="hover:text-brand-600">{article.category}</Link> › <span className="text-ink">{article.title.slice(0,40)}…</span>
        </nav>
        <div className="grid lg:grid-cols-12 gap-8 mt-4">
          <article className="lg:col-span-8">
            <div className="hidden print-only mb-6 pb-4 border-b border-black">
              <p className="text-xl font-bold">Wellbeing Compass — Patient Education Handout</p>
              <p className="text-xs text-gray-600">Educational resource • Not a substitute for individual medical diagnosis</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge>{article.category}</Badge>
              <Badge variant="success">{article.evidenceLevel}</Badge>
              {article.reviewStatus==="medically-reviewed" && <Badge variant="accent">Medically reviewed</Badge>}
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-4xl leading-tight text-brand-700">{article.title}</h1>
            <p className="text-lg text-muted mt-3 leading-relaxed">{article.deck}</p>
            <div className="flex items-center gap-3 mt-4 text-sm">
              <img src={article.author.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover"/>
              <div>
                <p className="font-semibold"><Link href={article.author.isFounder ? "/about-the-founder" : `/authors/${article.author.slug}`} className="hover:text-brand-600">{article.author.name}{article.author.credentials ? <span className="text-muted font-normal">, {article.author.credentials}</span> : ""}</Link> <span className="text-muted font-normal">• {article.author.isFounder ? "Founder & Health Professional" : article.author.role}</span></p>
                <p className="text-muted text-xs">{formatDate(article.publishedAt)} • Updated {formatDate(article.updatedAt)} • {article.readingTime} min read</p>
              </div>
            </div>
            {article.reviewer && article.lastReviewed && <div className="mt-3"><ReviewBadge reviewer={article.reviewer.name} date={article.lastReviewed} /></div>}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <AudioRead articleText={articleText} title={article.title} />
                <ShareButtons title={article.title} slug={article.slug} />
              </div>
              <ArticleActions
                slug={article.slug}
                title={article.title}
                category={article.category}
                readingTime={article.readingTime}
              />
            </div>
            {article.contentWarning && <div className="mt-4"><ContentWarning><p><strong>Content note:</strong> {article.contentWarning}</p></ContentWarning></div>}
            <figure className="mt-6">
              <img src={article.featuredImage} alt={article.imageAlt} width={1200} height={675} className="w-full aspect-[16/9] md:aspect-[21/9] max-h-[460px] rounded-2xl object-cover object-top" style={{ objectPosition: '50% 15%' }} />
              {article.imageCaption && <figcaption className="text-xs text-muted mt-2">{article.imageCaption}</figcaption>}
              <p className="text-xs text-muted mt-1">Image: illustrative. Alt text provided for accessibility.</p>
            </figure>

            {toc.length>0 && (
              <nav aria-label="Table of contents" className="mt-6 bg-surface border border-border rounded-2xl p-4">
                <p className="font-semibold text-sm">On this page</p>
                <ol className="list-decimal pl-5 text-sm mt-2 space-y-1">
                  {toc.map(t=> <li key={t}><a href={`#${t.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`} className="text-brand-600 hover:underline">{t}</a></li>)}
                  <li><a href="#takeaways" className="text-brand-600 hover:underline">Key takeaways</a></li>
                  <li><a href="#faqs" className="text-brand-600 hover:underline">FAQs</a></li>
                  <li><a href="#references" className="text-brand-600 hover:underline">References</a></li>
                </ol>
              </nav>
            )}

            <div className="mt-6 prose-wellmind text-justify hyphens-auto">
              {article.content.map((block,i)=>{
                const id = block.type==="heading" ? block.text.toLowerCase().replace(/[^a-z0-9]+/g,"-") : undefined;
                if(block.type==="heading") return <h2 key={i} id={id}>{block.text}</h2>;
                if(block.type==="paragraph") return <p key={i}>{block.text}</p>;
                if(block.type==="list") return <ul key={i}>{block.items?.map(it=> <li key={it}>{it}</li>)}</ul>;
                if(block.type==="quote") return <blockquote key={i}>{block.text}</blockquote>;
                if(block.type==="callout") return <div key={i} className="rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm my-4">{block.text}</div>;
                if(block.type==="tip") return <div key={i} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm my-4">💡 {block.text}</div>;
                if(block.type==="warning") return <div key={i} className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm my-4">⚠️ {block.text}</div>;
                return null;
              })}
            </div>

            <section id="takeaways" className="mt-8 rounded-2xl bg-brand-700 text-white p-6">
              <h2 className="font-bold">Key takeaways</h2>
              <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-white/90">
                {article.keyTakeaways.map(k=> <li key={k}>{k}</li>)}
              </ul>
            </section>

            <section id="faqs" className="mt-8">
              <h2 className="font-display font-bold text-xl text-brand-700">Frequently asked questions</h2>
              <div className="mt-3 space-y-3">
                {article.faqs.map(f=>(
                  <details key={f.q} className="bg-white border border-border rounded-xl p-4 group">
                    <summary className="font-semibold cursor-pointer list-none flex justify-between items-center">{f.q}<span className="text-brand-500 group-open:rotate-180 transition">⌄</span></summary>
                    <p className="text-sm text-muted mt-2 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context":"https://schema.org",
                "@type":"FAQPage",
                mainEntity: article.faqs.map(f=>({ "@type":"Question", name: f.q, acceptedAnswer: { "@type":"Answer", text: f.a }}))
              })}}/>
            </section>

            <section id="references" className="mt-8 bg-white border border-border rounded-2xl p-5">
              <h2 className="font-bold">Sources & references</h2>
              <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                {article.references.map(r=> <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">{r.title}</a></li>)}
              </ul>
              <p className="text-xs text-muted mt-3">References are educational and not exhaustive. Always consult current guidelines via a healthcare professional for personal decisions.</p>
            </section>

            <div className="mt-6 space-y-4">
              <DisclaimerBox />
              <HelpBox />
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="text-sm font-semibold">Topics:</span>
              {article.topics.map(t=> <Link key={t} href={`/topics/${encodeURIComponent(t.toLowerCase().replace(/\s+/g,"-"))}`} className="text-xs bg-surface border border-border px-2.5 py-1 rounded-full hover:bg-brand-50">{t}</Link>)}
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-6">
            <HealthTipOfTheDay />
            <div className="bg-white border border-border rounded-2xl p-5">
              <AboutTheAuthor author={article.author} compact />
              {article.reviewer && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs font-semibold tracking-widest uppercase text-muted">Medically reviewed by</p>
                  <Link href={`/reviewers/${article.reviewer.slug}`} className="font-semibold text-sm text-brand-700 hover:underline">{article.reviewer.name}</Link>
                  <p className="text-xs text-muted">{article.reviewer.credentials} • {article.reviewer.specialty}</p>
                </div>
              )}
            </div>
            {related.length>0 && (
              <div>
                <h3 className="font-semibold mb-3">Related articles</h3>
                <div className="space-y-4">
                  {related.map(a=> <ArticleCard key={a.slug} article={a} />)}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
