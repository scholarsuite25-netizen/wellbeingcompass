import { HubTemplate } from "@/components/HubTemplate";
import { getArticlesByCategory } from "@/lib/content";
export const metadata = { title: "Environment & Health" };
export default function Page(){ return <HubTemplate title="Environment & Health" description="How air, water, housing, climate and community environments shape physical and mental health." category="Environment & Health" articles={getArticlesByCategory("Environment & Health")} /> }
