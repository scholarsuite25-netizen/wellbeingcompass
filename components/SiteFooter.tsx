import Link from "next/link";
import { Compass } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-brand-700 text-white mt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="h-8 w-8 rounded-lg bg-white text-brand-700 grid place-items-center shadow-sm">
              <Compass className="h-4 w-4" />
            </span>
            <span className="font-bold text-base">Wellbeing Compass</span>
          </div>
          <p className="text-white/80 leading-relaxed text-xs">
            Guiding you with trusted education on mental health, physical wellness, relationships, and the community factors that shape lifelong wellbeing. Not a replacement for professional clinical care.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent-200">Explore Directions</h4>
          <ul className="space-y-2 text-white/80 text-xs">
            <li><Link href="/mental-health" className="hover:text-white">Mental Health & Resilience</Link></li>
            <li><Link href="/general-health" className="hover:text-white">General Health & Vitality</Link></li>
            <li><Link href="/prevention" className="hover:text-white">Prevention & Lifestyle</Link></li>
            <li><Link href="/relationships" className="hover:text-white">Healthy Relationships</Link></li>
            <li><Link href="/training" className="hover:text-white">Compass Academy & Training</Link></li>
            <li><Link href="/campaigns" className="hover:text-white">Public Health Campaigns</Link></li>
            <li><Link href="/archives" className="hover:text-white">Article Archives</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent-200">Trust & Governance</h4>
          <ul className="space-y-2 text-white/80 text-xs">
            <li><Link href="/editorial-policy" className="hover:text-white">Editorial Policy</Link></li>
            <li><Link href="/medical-review" className="hover:text-white">Medical Review Board</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white">Medical Disclaimer</Link></li>
            <li><Link href="/help" className="hover:text-white">Help & Crisis Hotlines</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
            <li><Link href="/promoter" className="hover:text-white">About the Founder</Link></li>
            <li><Link href="/broadcast" className="hover:text-white">Promoter WhatsApp Broadcast</Link></li>
            <li><Link href="/stats" className="hover:text-white">Site Analytics</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-accent-200">Stay Guided</h4>
          <p className="text-white/80 mb-3 text-xs">Get evidence-informed health guides delivered to your inbox weekly.</p>
          <Link href="/newsletter" className="inline-flex bg-accent-400 hover:bg-accent-500 text-ink dark:text-[#17212B] font-semibold px-4 py-2 rounded-full text-xs transition">
            Subscribe to Newsletter
          </Link>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href="tel:+2348146620168" className="inline-flex items-center gap-1.5 bg-white text-brand-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-white/90 transition">
              Call us
            </a>
            <a href="https://wa.me/2348146620168" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#1fbd5a] transition">
              WhatsApp us
            </a>
          </div>
          <p className="mt-4 text-xs text-white/60">© {new Date().getFullYear()} Wellbeing Compass. Educational use only.</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60 px-4">
        Wellbeing Compass does not provide clinical diagnosis, medical prescription, or emergency services. If you are experiencing a crisis, contact emergency services or a trusted crisis helpline immediately.
      </div>
    </footer>
  );
}
