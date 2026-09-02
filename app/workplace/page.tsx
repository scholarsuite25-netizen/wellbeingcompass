import { HubTemplate } from "@/components/HubTemplate";
import { getArticlesByCategory } from "@/lib/content";
export const metadata = { title: "Workplace Wellbeing" };
export default function Page(){ return <HubTemplate title="Workplace Wellbeing" description="Burnout, balance, psychologically safe workplaces and leadership practices that sustain health." category="Workplace Wellbeing" articles={getArticlesByCategory("Workplace Wellbeing")} /> }
