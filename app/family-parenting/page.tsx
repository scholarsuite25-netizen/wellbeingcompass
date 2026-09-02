import { HubTemplate } from "@/components/HubTemplate";
import { getArticlesByCategory } from "@/lib/content";
export const metadata = { title: "Family & Parenting" };
export default function Page(){ return <HubTemplate title="Family & Parenting" description="Support for parents, caregivers and families navigating development, wellbeing and resilience." category="Family & Parenting" articles={getArticlesByCategory("Family & Parenting")} /> }
