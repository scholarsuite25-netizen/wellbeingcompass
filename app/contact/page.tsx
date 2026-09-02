"use client";
import { useState } from "react";
export default function Page(){
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [form,setForm]=useState({ name:"", email:"", message:"" });
  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      const res = await fetch("/api/contact", { method:"POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify(form) });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || "Failed to send");
      setSent(true);
    } catch(ex:any){ setErr(ex.message); } finally { setLoading(false); }
  }
  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl text-brand-700">Contact us</h1>
      <p className="text-sm text-muted mt-2">Questions, corrections or partnership ideas? Send a message. We do not provide medical advice by email.</p>
      {!sent ? (
        <form onSubmit={onSubmit} className="mt-6 space-y-4 bg-white border border-border rounded-2xl p-5">
          <label className="block text-sm"><span className="font-medium">Name</span><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" /></label>
          <label className="block text-sm"><span className="font-medium">Email</span><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm" /></label>
          <label className="block text-sm"><span className="font-medium">Message</span><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required rows={4} className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"></textarea></label>
          {err && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-2">{err}</p>}
          <button type="submit" disabled={loading} className="w-full bg-brand-500 text-white py-2.5 rounded-full font-semibold disabled:opacity-50">{loading?"Sending…":"Send message"}</button>
          <p className="text-xs text-muted">Env: EMAIL_PROVIDER / EMAIL_FROM / CONTACT_TO_EMAIL (+ Resend when in production). Rate-limited per IP.</p>
        </form>
      ) : (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-2xl p-6 text-sm" role="status">Thanks — your message was sent via the env-configured email provider. In dev (console) it’s logged server-side; in production (resend) it’s delivered to CONTACT_TO_EMAIL.</div>
      )}
    </div>
  )
}
