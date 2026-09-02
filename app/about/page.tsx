export const metadata = { title: "About Wellbeing Compass" };
export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display font-extrabold text-3xl text-brand-700">About Wellbeing Compass</h1>
      <p className="text-muted mt-2 leading-relaxed">
        Wellbeing Compass is an evidence-informed education and public health awareness platform. We provide clear, trustworthy guidance across mental health, general vitality, prevention, relationships, family wellbeing, workplace sanity, and community health.
      </p>
      <div className="mt-6 bg-brand-50 border border-brand-100 rounded-2xl p-5">
        <p className="font-semibold text-brand-900">Our Guiding Compass Principles</p>
        <ul className="list-disc pl-5 text-sm mt-2 space-y-1 text-ink/80">
          <li>Evidence-informed and verified, never sensationalized</li>
          <li>Compassionate, non-stigmatizing language that empowers readers</li>
          <li>Rigorous medical review board for clinical and high-risk topics</li>
          <li>Clear authorship, accredited reviewer credentials, and transparent references</li>
          <li>Privacy-first, universally accessible, and community-centered</li>
        </ul>
      </div>
      <section className="prose-wellmind text-sm mt-6">
        <h2>What we are not</h2>
        <p>We do not provide clinical diagnosis, prescribe medications, or replace personal doctor-patient consultations. For individual health decisions, always consult a qualified healthcare provider.</p>
      </section>
    </div>
  );
}
