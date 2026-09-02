"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { HeartPulse, CheckCircle2, Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed. Please check your inputs.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Auto sign-in after 1.5 seconds
      setTimeout(async () => {
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
        if (loginRes?.ok) {
          router.push("/");
          router.refresh();
        } else {
          router.push("/login");
        }
      }, 1200);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="bg-white border border-border rounded-3xl p-6 md:p-8 shadow-elevated">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-8 w-8 rounded-xl bg-brand-500 text-white grid place-items-center">
            <HeartPulse className="h-4 w-4" />
          </span>
          <span className="font-display font-extrabold text-xl text-brand-700">WellMind Health</span>
        </div>

        <h1 className="font-display font-bold text-2xl text-brand-700 mt-2">Create Your Account</h1>
        <p className="text-sm text-muted mt-1">
          Join our health learning community. Get full access to courses, bookmarks, and auto-delivery of weekly articles.
        </p>

        {success ? (
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-fadeIn">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
            <h2 className="font-bold text-emerald-900 text-lg">Account Created Successfully!</h2>
            <p className="text-xs text-emerald-800 mt-1">
              You are auto-subscribed to weekly health education. We have sent your starter articles to <b>{email}</b>.
            </p>
            <p className="text-xs text-muted mt-3">Signing you in automatically…</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="mt-6 space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ngozi Eze or Chidi Okafor"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-muted pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
                />
              </div>
            </div>

            <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl text-xs text-brand-900 space-y-1">
              <p className="font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> What you receive upon registration:
              </p>
              <p className="text-muted pl-4.5">• Automatic subscription to evidence-informed weekly health newsletter</p>
              <p className="text-muted pl-4.5">• Instant welcome email with starter coping & wellness guides</p>
              <p className="text-muted pl-4.5">• Ability to save articles, track course progress, and participate</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account…" : "Create Free Account"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
