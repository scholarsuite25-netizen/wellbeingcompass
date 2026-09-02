import Link from "next/link";
export default function NotFound(){
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="font-display font-bold text-3xl text-brand-700">Page not found</h1>
      <p className="text-muted mt-2">The page you requested doesn&apos;t exist. Try searching or return home.</p>
      <div className="mt-4 flex justify-center gap-2">
        <Link href="/" className="bg-brand-500 text-white px-5 py-2 rounded-full font-semibold">Go home</Link>
        <Link href="/search" className="border border-border px-5 py-2 rounded-full font-semibold">Search</Link>
      </div>
    </div>
  )
}
