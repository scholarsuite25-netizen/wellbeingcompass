import { Newsletter } from "@/components/Newsletter";
export const metadata = { title: "Newsletter" };
export default function Page(){
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="font-display font-bold text-3xl text-brand-700">Newsletter</h1>
      <p className="text-muted mt-2 text-sm">Weekly, practical wellbeing education. No spam. Unsubscribe anytime. We store demo subscriptions locally.</p>
      <div className="mt-6"><Newsletter /></div>
    </div>
  )
}
