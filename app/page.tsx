import Link from "next/link";
import { articles, campaigns, categories, courses } from "@/lib/content";
import { ArticleCard, ArticleCardCompact } from "@/components/ArticleCard";
import { Newsletter } from "@/components/Newsletter";
import { SelfCheckTool } from "@/components/SelfCheckTool";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Award, BookOpen, HeartPulse, Leaf, ShieldCheck, Users } from "lucide-react";

export default function HomePage() {
  const hero = articles[0];
  const latest = articles.slice(0,3);
  const mental = articles.filter(a=>a.category==="Mental Health");
  const general = articles.filter(a=>a.category==="General Health");
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Hero */}
      <section className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <article className="bg-white border border-border rounded-3xl overflow-hidden shadow-elevated">
            <img src={hero.featuredImage} alt={hero.imageAlt} width={1200} height={600} className="w-full h-[300px] md:h-[380px] object-cover object-top bg-slate-100" style={{ objectPosition: '50% 18%' }} />
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>Featured — Mental Health</Badge>
                <Badge variant="success">Medically reviewed</Badge>
                <Badge variant="accent">Understand. Prevent. Heal. Thrive.</Badge>
              </div>
              <h1 className="font-display font-extrabold text-2xl md:text-3xl leading-tight text-brand-700"><Link href={`/articles/${hero.slug}`} className="hover:text-brand-500">{hero.title}</Link></h1>
              <p className="text-muted mt-3 leading-relaxed">{hero.deck}</p>
              <div className="flex items-center gap-3 mt-5">
                <Link href={`/articles/${hero.slug}`} className="inline-flex items-center gap-2 bg-brand-500 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-brand-600">Read article <ArrowRight className="h-4 w-4"/></Link>
                <span className="text-sm text-muted">{hero.readingTime} min • {hero.author.name}</span>
              </div>
              <p className="text-xs text-muted mt-3">Last medically reviewed: {hero.lastReviewed} by {hero.reviewer?.name}</p>
            </div>
          </article>
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-brand-700 text-white rounded-3xl p-6">
            <p className="text-accent-400 font-semibold text-xs tracking-widest uppercase">Get help</p>
            <h2 className="font-display font-bold text-xl mt-2">Not sure where to start?</h2>
            <p className="text-white/80 text-sm mt-2">If you feel distressed or worried about someone, reach a trusted person or a healthcare professional. For urgent situations, use local emergency services.</p>
            <Link href="/help" className="mt-4 inline-flex bg-accent-400 text-ink px-4 py-2 rounded-full font-semibold text-sm">Visit Help & Emergency</Link>
          </div>
          <div className="bg-white border border-border rounded-3xl p-5">
            <h3 className="font-bold text-brand-700">Latest health stories</h3>
            <div className="mt-3 space-y-1">
              {latest.map(a=> <ArticleCardCompact key={a.slug} article={a} />)}
            </div>
            <Link href="/search" className="text-sm text-brand-600 font-semibold mt-3 inline-flex">View all articles <ArrowRight className="h-4 w-4 ml-1"/></Link>
          </div>
        </div>
      </section>

      {/* Health areas */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-brand-700">Explore by health area</h2>
          <Link href="/search" className="text-sm font-semibold text-brand-600">Browse all</Link>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mt-4">
          {categories.slice(0,8).map(c=>(
            <Link key={c.slug} href={c.href} className="bg-white border border-border rounded-2xl p-5 hover:shadow-card transition group">
              <div className="h-9 w-9 rounded-xl bg-brand-50 text-brand-600 grid place-items-center group-hover:bg-brand-500 group-hover:text-white transition">
                {c.label.includes("Mental") ? <HeartPulse className="h-4 w-4"/> : c.label.includes("Environment") ? <Leaf className="h-4 w-4"/> : c.label.includes("Workplace") ? <Users className="h-4 w-4"/> : <BookOpen className="h-4 w-4"/>}
              </div>
              <h3 className="font-semibold mt-3">{c.label}</h3>
              <p className="text-sm text-muted mt-1 line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Spotlights */}
      <section className="mt-10 grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-display font-bold text-xl text-brand-700 flex items-center gap-2"><HeartPulse className="h-5 w-5 text-brand-500"/> Mental health spotlight</h2>
          <div className="mt-4 grid gap-4">
            {mental.slice(0,2).map(a=> <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-brand-700 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-brand-500"/> General health spotlight</h2>
          <div className="mt-4 grid gap-4">
            {general.slice(0,2).map(a=> <ArticleCard key={a.slug} article={a} />)}
            {articles.filter(a=>a.category==="Prevention").slice(0,1).map(a=> <ArticleCard key={a.slug} article={a} />)}
          </div>
        </div>
      </section>

      {/* Interactive Wellbeing & Stress Self-Check Tool */}
      <section className="mt-12">
        <SelfCheckTool />
      </section>

      {/* Practical tips */}
      <section className="mt-10 bg-white border border-border rounded-3xl p-6 md:p-8">
        <h2 className="font-display font-bold text-xl text-brand-700">Practical tips you can try today</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
          {[
            { title: "One-minute reset", desc: "Inhale 4, hold 2, exhale 6 — repeat 4 times. Notice shoulders dropping." },
            { title: "Connection nudge", desc: "Text one person a sincere check-in. Belonging protects health." },
            { title: "Sleep anchor", desc: "Keep one fixed wake time for 7 days and step into daylight within an hour." },
          ].map(t=>(
            <div key={t.title} className="rounded-2xl bg-brand-50 border border-brand-100 p-4">
              <p className="font-semibold text-brand-700">{t.title}</p>
              <p className="text-muted mt-1">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Relationships / Environment / Workplace */}
      <section className="mt-10 grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-bold text-brand-700">Relationships & Family</h3>
          <div className="mt-3 space-y-3">
            {articles.filter(a=>["Relationships","Family & Parenting"].includes(a.category)).map(a=> <ArticleCardCompact key={a.slug} article={a} />)}
          </div>
          <Link href="/relationships" className="text-sm font-semibold text-brand-600 mt-2 inline-block">Explore relationships →</Link>
        </div>
        <div>
          <h3 className="font-bold text-brand-700">Environment & Health</h3>
          <div className="mt-3 space-y-3">
            {articles.filter(a=>a.category==="Environment & Health").map(a=> <ArticleCardCompact key={a.slug} article={a} />)}
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm">Tip: Ventilate while cooking, keep homes smoke-free, and check local air-quality alerts when available.</div>
          </div>
          <Link href="/environment" className="text-sm font-semibold text-brand-600 mt-2 inline-block">Explore environment →</Link>
        </div>
        <div>
          <h3 className="font-bold text-brand-700">Workplace wellbeing</h3>
          <div className="mt-3 space-y-3">
            {articles.filter(a=>a.category==="Workplace Wellbeing").map(a=> <ArticleCardCompact key={a.slug} article={a} />)}
          </div>
          <Link href="/workplace" className="text-sm font-semibold text-brand-600 mt-2 inline-block">Explore workplace →</Link>
        </div>
      </section>

      {/* Training */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-brand-700 flex items-center gap-2"><Award className="h-5 w-5 text-accent-500"/> Learn with guidance</h2>
          <Link href="/training" className="text-sm font-semibold text-brand-600">All courses</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {courses.map(c=>(
            <div key={c.slug} className="bg-white border border-border rounded-2xl p-5">
              <Badge variant="accent">{c.duration} • {c.lessons} lessons</Badge>
              <h3 className="font-semibold mt-3">{c.title}</h3>
              <p className="text-sm text-muted mt-1">{c.description}</p>
              <p className="text-xs text-muted mt-2">{c.audience}</p>
              <Link href={`/training/${c.slug}`} className="mt-3 inline-flex text-sm font-semibold text-brand-600">View course →</Link>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-2">All training is educational awareness only, not clinical certification unless formally accredited.</p>
      </section>

      {/* Campaign */}
      <section className="mt-10">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-700 text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <Badge variant="accent" className="bg-accent-400 text-ink border-0">Awareness campaign</Badge>
            <h2 className="font-display font-bold text-xl mt-2">{campaigns[0].title}</h2>
            <p className="text-white/80 text-sm mt-1 max-w-xl">{campaigns[0].description}</p>
          </div>
          <Link href="/campaigns" className="bg-accent-400 text-ink px-5 py-2.5 rounded-full font-semibold shrink-0">Explore campaigns</Link>
        </div>
      </section>

      {/* Experts */}
      <section className="mt-10">
        <h2 className="font-display font-bold text-xl text-brand-700">Featured experts</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {articles.slice(0,3).map(a=>(
            <div key={a.author.slug} className="bg-white border border-border rounded-2xl p-5 flex gap-3">
              <img src={a.author.avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover"/>
              <div>
                <p className="font-semibold text-sm">{a.author.name}</p>
                <p className="text-xs text-muted">{a.author.role}</p>
                <Link href={`/authors/${a.author.slug}`} className="text-xs font-semibold text-brand-600">Profile →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10">
        <Newsletter />
      </div>
    </div>
  );
}
