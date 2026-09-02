import { HubTemplate } from "@/components/HubTemplate";
import { getArticlesByCategory } from "@/lib/content";
export const metadata = { title: "General Health Hub" };
export default function Page(){ return <HubTemplate title="General Health" description="Everyday guidance on sleep, nutrition, activity, screening and caring for your body — practical and prevention-focused." category="General Health" articles={getArticlesByCategory("General Health")} /> }
