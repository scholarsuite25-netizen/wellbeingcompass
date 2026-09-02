import { HubTemplate } from "@/components/HubTemplate";
import { getArticlesByCategory } from "@/lib/content";
export const metadata = { title: "Social Wellbeing" };
export default function Page(){ return <HubTemplate title="Social Wellbeing" description="Belonging, community support and social determinants that influence health." category="Social Wellbeing" articles={getArticlesByCategory("Social Wellbeing")} /> }
