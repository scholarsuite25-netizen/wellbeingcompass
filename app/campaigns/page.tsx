import { campaigns } from "@/lib/content";
import Link from "next/link";
export const metadata = { title: "Health Awareness Campaigns" };
export default function Page(){
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl text-brand-700">Health Awareness Campaigns</h1>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {campaigns.map(c=>(
          <div key={c.slug} className="bg-white border border-border rounded-3xl overflow-hidden">
            <div className={`h-2 ${c.color}`}></div>
            <div className="p-6">
              <h2 className="font-bold text-lg">{c.title}</h2>
              <p className="text-sm text-muted mt-1">{c.description}</p>
              <Link href="/newsletter" className="mt-4 inline-flex bg-brand-500 text-white px-4 py-2 rounded-full text-sm font-semibold">Join campaign</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
