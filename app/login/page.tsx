"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HeartPulse, KeyRound, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";

const DEMO_ACCOUNTS = [
  { role: "SUPER_ADMIN", email: "superadmin@wellmind.health", label: "Super Admin (Full Access)" },
  { role: "ADMIN", email: "admin@wellmind.health", label: "Administrator (Site Management)" },
  { role: "EDITOR_IN_CHIEF", email: "editor@wellmind.health", label: "Editor-in-Chief (Publishing)" },
  { role: "MEDICAL_REVIEWER", email: "reviewer@wellmind.health", label: "Dr. Chioma Nwosu (Medical Reviewer)" },
  { role: "AUTHOR", email: "author@wellmind.health", label: "Sarah Nwachukwu (Author)" },
  { role: "READER", email: "reader@wellmind.health", label: "Chidi Okafor (Subscribed Reader)" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("superadmin@wellmind.health");
  const [password, setPassword] = useState("WellMind123!");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setErr("Invalid email or password. Please verify credentials.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  function selectDemoAccount(accEmail: string) {
    setEmail(accEmail);
    setPassword("WellMind123!");
    setErr("");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <div className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-elevated">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-8 w-8 rounded-xl bg-brand-500 text-white grid place-items-center">
            <HeartPulse className="h-4 w-4" />
          </span>
          <span className="font-display font-extrabold text-xl text-brand-700">WellMind Health</span>
        </div>

        <h1 className="font-display font-bold text-2xl text-brand-700 mt-2">Sign In to Your Account</h1>
        <p className="text-sm text-muted mt-1">
          Access the publishing workspace, clinical review dashboard, or your member reader profile.
        </p>

        {/* Demo Fast Account Selector */}
        <div className="mt-5 p-4 bg-brand-50 border border-brand-100 rounded-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5" /> Fast Demo Login (Click to populate):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => selectDemoAccount(acc.email)}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg border transition ${
                  email === acc.email
                    ? "bg-brand-500 text-white border-brand-500 font-semibold shadow-sm"
                    : "bg-white border-border hover:bg-brand-100/50 text-ink"
                }`}
              >
                <div className="font-bold truncate">{acc.role}</div>
                <div className="text-[10px] opacity-80 truncate">{acc.email}</div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted mt-2">Default demo password for all accounts: <code className="bg-white px-1 py-0.5 rounded border">WellMind123!</code></p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-3.5">
          {err && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {err}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full text-sm transition shadow-md flex items-center justify-center gap-2"
          >
            {loading ? "Signing In…" : "Sign In"} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted">
          <span>New to WellMind?</span>
          <Link href="/register" className="text-brand-600 font-bold hover:underline">
            Create Free Account →
          </Link>
        </div>
      </div>
    </div>
  );
}
