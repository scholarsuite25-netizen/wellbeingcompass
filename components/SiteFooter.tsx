import Link from "next/link";
import { HeartPulse } from "lucide-react";
export function SiteFooter(){
  return (
    <footer className="bg-brand-700 text-white mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-8 w-8 rounded-lg bg-white text-brand-700 grid place-items-center"><HeartPulse className="h-4 w-4"/></span>
            <span className="font-bold">WellMind Health</span>
          </div>
          <p className="text-white/80 leading-relaxed">Trusted education on mental health, general health and the social, family and environmental factors that shape wellbeing. Not a replacement for professional care.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent-200">Explore</h4>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/mental-health" className="hover:text-white">Mental Health</Link></li>
            <li><Link href="/general-health" className="hover:text-white">General Health</Link></li>
            <li><Link href="/prevention" className="hover:text-white">Prevention & Healthy Living</Link></li>
            <li><Link href="/training" className="hover:text-white">Training</Link></li>
            <li><Link href="/campaigns" className="hover:text-white">Awareness Campaigns</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent-200">Trust & Safety</h4>
          <ul className="space-y-2 text-white/80">
            <li><Link href="/editorial-policy" className="hover:text-white">Editorial Policy</Link></li>
            <li><Link href="/medical-review" className="hover:text-white">Medical Review Policy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white">Medical Disclaimer</Link></li>
            <li><Link href="/help" className="hover:text-white">Help & Emergency Information</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent-200">Connect</h4>
          <p className="text-white/80 mb-3">Get practical wellbeing tips and new articles.</p>
          <Link href="/newsletter" className="inline-flex bg-accent-400 text-ink font-semibold px-4 py-2 rounded-full">Subscribe to newsletter</Link>
          <p className="mt-4 text-xs text-white/60">© {new Date().getFullYear()} WellMind Health. Educational use only.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60 px-4">WellMind Health does not provide diagnosis, prescription, or emergency services. If you are in crisis, contact your local emergency services or a trusted crisis helpline.</div>
    </footer>
  )
}
