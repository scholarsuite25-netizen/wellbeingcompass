import { authors } from "@/lib/content";
import Link from "next/link";
export const metadata = { title: "Authors & Experts" };
export default function Page(){
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl text-brand-700">Authors & contributors</h1>
      <p className="text-muted mt-2">Writers, editors and educators behind WellMind Health. Bios and credentials are displayed on each article.</p>
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {authors.map(a=>(
          <Link key={a.slug} href={`/authors/${a.slug}`} className="bg-white border border-border rounded-2xl p-5 flex gap-4 hover:shadow-card">
            <img src={a.avatar} alt="" width={64} height={64} className="h-16 w-16 rounded-full object-cover"/>
            <div>
              <p className="font-semibold">{a.name}</p>
              <p className="text-sm text-brand-600">{a.role}</p>
              <p className="text-sm text-muted mt-1">{a.bio}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
