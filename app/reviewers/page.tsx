import { reviewers } from "@/lib/content";
import Link from "next/link";
export const metadata = { title: "Medical Reviewers" };
export default function Page(){
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl text-brand-700">Medical reviewers</h1>
      <p className="text-muted mt-2 max-w-3xl">Clinicians and public-health specialists who review high-risk content for accuracy and safety. Review status and last-reviewed dates appear on each article.</p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {reviewers.map(r=>(
          <Link key={r.slug} href={`/reviewers/${r.slug}`} className="bg-white border border-border rounded-2xl p-5 hover:shadow-card">
            <img src={r.avatar} alt="" width={64} height={64} className="h-16 w-16 rounded-full object-cover"/>
            <p className="font-semibold mt-3">{r.name}</p>
            <p className="text-xs text-brand-600">{r.credentials} • {r.specialty}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
