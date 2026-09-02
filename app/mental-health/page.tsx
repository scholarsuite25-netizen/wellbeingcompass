import { HubTemplate } from "@/components/HubTemplate";
import { getArticlesByCategory } from "@/lib/content";
export const metadata = { title: "Mental Health Hub" };
export default function Page(){ return <HubTemplate title="Mental Health" description="Compassionate, evidence-informed education on anxiety, stress, mood, coping and help-seeking — written in plain language and reviewed for safety." category="Mental Health" articles={getArticlesByCategory("Mental Health")} /> }
