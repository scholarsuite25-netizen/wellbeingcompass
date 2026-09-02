import { HubTemplate } from "@/components/HubTemplate";
import { getArticlesByCategory } from "@/lib/content";
export const metadata = { title: "Prevention & Healthy Living" };
export default function Page(){ return <HubTemplate title="Prevention & Healthy Living" description="Build habits that reduce risk: movement, nutrition, sleep, screening and early care conversations." category="Prevention" articles={getArticlesByCategory("Prevention")} /> }
