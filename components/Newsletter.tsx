"use client";
import { useState } from "react";
import { Button } from "./ui/Button";

export function Newsletter({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"success"|"error">("idle");
  const [detail,setDetail]=useState("");
  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!email.includes("@")) { setStatus("error"); setDetail("Please enter a valid email."); return; }
    setStatus("idle"); setDetail("");
    try {
      const res = await fetch("/api/newsletter", { method:"POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify({ email })});
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Failed");
      // Keep local fallback for offline demo
      const list = JSON.parse(localStorage.getItem("wellbeing_compass_subscribers")||"[]");
      list.push({ email, date: new Date().toISOString(), provider: data.provider });
      localStorage.setItem("wellbeing_compass_subscribers", JSON.stringify(list));
      setStatus("success"); setDetail(`Subscribed via ${data.provider}. Check your inbox (console in dev).`); setEmail("");
    } catch(err:any){
      setStatus("error"); setDetail(err.message || "Could not subscribe. Try again.");
    }
  }
  return (
    <section className={`${compact ? "p-6" : "p-8 md:p-10"} rounded-3xl bg-brand-700 text-white`} aria-labelledby="nl-title">
      <div className={`${compact ? "" : "md:flex items-center justify-between gap-8"}`}>
        <div className="max-w-xl">
          <h2 id="nl-title" className="text-2xl font-display font-bold">Stay informed. Stay well.</h2>
          <p className="text-white/80 mt-2 text-sm leading-relaxed">Evidence-informed stories on mental health, healthy living and relationships — once a week. Unsubscribe anytime.</p>
        </div>
        <form onSubmit={onSubmit} className="mt-4 md:mt-0 flex gap-2 max-w-md w-full" noValidate>
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input id="nl-email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email address" className="flex-1 rounded-full px-4 py-2.5 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" />
          <Button type="submit" variant="primary" className="!bg-accent-400 !text-ink hover:!bg-accent-500">Subscribe</Button>
        </form>
      </div>
      {status==="success" && <p role="status" className="mt-3 text-sm bg-white/15 rounded-full inline-flex px-3 py-1">{detail || "Thanks — check your inbox for confirmation. Sample stored locally."}</p>}
      {status==="error" && <p role="alert" className="mt-3 text-sm text-accent-200">{detail || "Please enter a valid email address."}</p>}
      <p className="text-xs text-white/60 mt-2">We respect your privacy. No spam. See our <a href="/privacy" className="underline">Privacy policy</a>.</p>
    </section>
  )
}
