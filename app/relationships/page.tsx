import { HubTemplate } from "@/components/HubTemplate";
import { getArticlesByCategory } from "@/lib/content";
export const metadata = { title: "Relationships Hub" };
export default function Page(){ return <HubTemplate title="Relationships & Social Connection" description="Communication, trust, boundaries and belonging — how healthy relationships protect wellbeing." category="Relationships" articles={getArticlesByCategory("Relationships")} /> }
