import { FOUNDER } from "./founders";
export type Category = "Mental Health" | "General Health" | "Prevention" | "Relationships" | "Family & Parenting" | "Social Wellbeing" | "Environment & Health" | "Workplace Wellbeing" | "Training" | "Public Health";
export type EvidenceLevel = "Evidence-informed" | "Expert reviewed" | "General education" | "Research summary";
export type ReviewStatus = "draft" | "pending-medical-review" | "medically-reviewed" | "published";
export type Author = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  isFounder?: boolean;
  credentials?: string;          // e.g. "RN, RM, PhD"
  professionalTitle?: string;    // e.g. "Director of Nursing Services"
  currentPosition?: string;      // e.g. "Babcock University Teaching Hospital"
  shortBio?: string;             // homepage intro
  fullBio?: string;              // profile page narrative
  profilePhoto?: string;         // official founder portrait
  specializations?: string[];    // one-line professional identities
  expertise?: { title: string; description?: string }[];
  education?: { title: string; place?: string; level?: string }[];
  fellowships?: string[];
  certifications?: string[];
  awards?: string[];
  researchInterests?: string[];
  socialLinks?: { label: string; url: string }[];
};
export type Reviewer = { slug: string; name: string; credentials: string; specialty: string; avatar: string };
export type Article = {
  slug: string;
  title: string;
  deck: string;
  excerpt: string;
  category: Category;
  topics: string[];
  author: Author;
  reviewer?: Reviewer;
  featuredImage: string;
  imageAlt: string;
  imageCaption?: string;
  content: { type: "heading"|"paragraph"|"list"|"quote"|"callout"|"tip"|"warning"; text: string; items?: string[] }[];
  keyTakeaways: string[];
  faqs: { q: string; a: string }[];
  references: { title: string; url: string }[];
  publishedAt: string;
  updatedAt: string;
  lastReviewed?: string;
  readingTime: number;
  evidenceLevel: EvidenceLevel;
  reviewStatus: ReviewStatus;
  contentWarning?: string;
};

export const authors: Author[] = [
  FOUNDER,
  { slug: "amina-okoro", name: "Amina Okoro", role: "Public Health Specialist, MPH", bio: "Nigerian public-health writer and researcher focused on prevention, health equity, and community wellness.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
  { slug: "daniel-owusu", name: "Daniel Owusu", role: "Senior Medical Editor", bio: "Health journalist and editor with 12 years in African health communications and plain-language medical education.", avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&fit=crop" },
  { slug: "sarah-lee", name: "Sarah Nwachukwu", role: "Mental Health & Wellbeing Educator", bio: "Lagos-based counselling educator writing on emotional resilience, relationships, and youth coping strategies.", avatar: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=400&h=400&fit=crop" },
  { slug: "james-obi", name: "James Obi", role: "Family & Adolescent Contributor", bio: "Parenting educator and community advocate supporting family wellbeing and youth mentorship across Nigeria.", avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&h=400&fit=crop" },
];

export const reviewers: Reviewer[] = [
  { slug: "dr-ayodele-bello", name: "Dr Ayodele Bello", credentials: "MBBS, FWACP", specialty: "Family & Community Medicine", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop" },
  { slug: "dr-chioma-nwosu", name: "Dr Chioma Nwosu", credentials: "MBBS, MSc Public Health", specialty: "Public Health & Epidemiology", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
  { slug: "dr-emeka-udo", name: "Dr Emeka Udo", credentials: "PhD Clinical Psychology", specialty: "Clinical Psychology & Neuropsychiatry", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
];

export const categories: { slug: string; label: Category; description: string; href: string }[] = [
  { slug: "mental-health", label: "Mental Health", description: "Understanding emotions, stress, anxiety, depression and coping.", href: "/mental-health" },
  { slug: "general-health", label: "General Health", description: "Body, nutrition, sleep, chronic conditions and everyday care.", href: "/general-health" },
  { slug: "prevention", label: "Prevention", description: "Healthy habits, screening, and reducing risk.", href: "/prevention" },
  { slug: "relationships", label: "Relationships", description: "Communication, boundaries, empathy and connection.", href: "/relationships" },
  { slug: "family-parenting", label: "Family & Parenting", description: "Parenting, child wellbeing and family resilience.", href: "/family-parenting" },
  { slug: "social-wellbeing", label: "Social Wellbeing", description: "Belonging, community, support systems.", href: "/social" },
  { slug: "environment", label: "Environment & Health", description: "Air, water, housing, climate and health.", href: "/environment" },
  { slug: "workplace", label: "Workplace Wellbeing", description: "Burnout, balance, psychologically safe work.", href: "/workplace" },
  { slug: "training", label: "Training", description: "Short courses on wellbeing, first aid and awareness.", href: "/training" },
];

export const articles: Article[] = [
  {
    slug: "understanding-everyday-anxiety",
    title: "Understanding Everyday Anxiety: When Worry Is Normal and When to Seek Support",
    deck: "Learn the difference between common stress responses and patterns that may benefit from professional support.",
    excerpt: "Anxiety is a normal human response. This guide explains common signs, coping ideas, and when to consider help — without diagnosing you.",
    category: "Mental Health",
    topics: ["Anxiety & Stress", "Coping Skills", "Awareness"],
    author: FOUNDER,
    reviewer: reviewers[2],
    featuredImage: "/images/articles/understanding-everyday-anxiety.png",
    imageAlt: "Smiling Nigerian family sitting together comfortably on a couch",
    imageCaption: "Calm routines, supportive relationships and healthy habits all influence how we experience anxiety. Photo is illustrative.",
    content: [
      { type: "paragraph", text: "Anxiety involves feelings of worry, unease or fear. In small amounts it can help us prepare for challenges. When it becomes frequent, intense or hard to manage, it may affect sleep, work, relationships and daily life." },
      { type: "heading", text: "Common experiences that can accompany anxiety" },
      { type: "list", text: "", items: ["Racing thoughts or difficulty concentrating", "Restlessness, irritability or feeling on edge", "Physical sensations such as faster heartbeat, muscle tension, stomach unease", "Worrying more than usual about everyday matters", "Avoiding situations that trigger discomfort"] },
      { type: "callout", text: "This article is educational. If you are experiencing persistent distress, consider speaking with a healthcare professional or a trusted support resource in your area." },
      { type: "heading", text: "Practical ideas many people find helpful" },
      { type: "list", text: "", items: ["Keep a regular sleep and wake time and create a calming bedtime routine", "Build short movement breaks into the day — even brief walks can help", "Practice slow breathing: inhale for 4, hold briefly, exhale for 6", "Write down worries and one small next step for each", "Talk with a supportive friend, family member, teacher or counselor", "Notice caffeine, alcohol and screen time patterns that affect rest"] },
      { type: "quote", text: "You deserve support, not stigma. Reaching out is a sign of self-respect, not weakness." },
      { type: "warning", text: "Seek urgent help if you feel unsafe, have thoughts of harming yourself, or are worried about someone else. Contact local emergency services or a crisis helpline. If you can, reach a trusted person right away." },
    ],
    keyTakeaways: ["Anxiety is common and varies widely from person to person.", "Healthy routines, connection and coping skills can help manage everyday stress.", "Ongoing or severe symptoms deserve professional guidance."],
    faqs: [
      { q: "Is anxiety a sign of personal failure?", a: "No. Anxiety is a common human experience influenced by biology, environment, life events and stress. Seeking information or support is constructive." },
      { q: "Can I manage anxiety on my own?", a: "Some coping strategies help with mild stress. Persistent, intense or interfering anxiety is best discussed with a healthcare professional." },
      { q: "What should I do if a friend seems anxious?", a: "Listen without judgment, ask how you can support them, and encourage professional help if needed. Avoid diagnosing." },
    ],
    references: [
      { title: "WHO — Mental Health information", url: "https://www.who.int/health-topics/mental-health" },
      { title: "NIMH — Anxiety Disorders", url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders" },
    ],
    publishedAt: "2025-11-02",
    updatedAt: "2026-02-10",
    lastReviewed: "2026-02-08",
    readingTime: 6,
    evidenceLevel: "Expert reviewed",
    reviewStatus: "medically-reviewed",
  },
  {
    slug: "sleep-hygiene-guide",
    title: "Sleep Hygiene: A Simple Guide to Better Nights and Brighter Days",
    deck: "Evidence-informed habits that support restful sleep — from light exposure to wind-down routines.",
    excerpt: "Consistent sleep supports mood, learning and physical health. Explore practical, low-cost habits that improve sleep without products or promises.",
    category: "General Health",
    topics: ["Sleep", "Prevention", "Healthy Habits"],
    author: FOUNDER,
    reviewer: reviewers[0],
    featuredImage: "/images/articles/sleep-hygiene-guide.jpg",
    imageAlt: "Serene person sleeping peacefully in a comfortable, bright modern bedroom",
    content: [
      { type: "paragraph", text: "Sleep affects nearly every system in the body. Small environmental and behavioral changes often improve sleep quality more sustainably than quick fixes." },
      { type: "heading", text: "Five foundations of sleep hygiene" },
      { type: "list", text: "", items: ["Keep a steady sleep/wake window, even on weekends", "Make the bedroom dark, quiet and cool; limit screens before bed", "Get bright daylight early in the day and dim lights in the evening", "Be mindful of caffeine after midday and alcohol near bedtime", "Create a 30-minute wind-down with reading, stretching or breathing exercises"] },
      { type: "tip", text: "If you cannot sleep after ~20 minutes, get up, do a calm activity in dim light, and return when sleepy. This helps break the frustration cycle." },
    ],
    keyTakeaways: ["Regularity and environment matter more than perfection.", "Daylight and movement during the day support sleep at night.", "If sleep problems persist for weeks, seek professional advice."],
    faqs: [
      { q: "How much sleep do adults need?", a: "Most adults feel best with 7–9 hours, but individual needs vary. Focus on how you function in the day, not just hours." },
      { q: "Are naps helpful?", a: "Short early naps (10–20 minutes) can help some people. Long or late naps may make nighttime sleep lighter." },
    ],
    references: [{ title: "CDC — About Sleep", url: "https://www.cdc.gov/sleep/about/index.html" }],
    publishedAt: "2025-12-18",
    updatedAt: "2026-03-01",
    lastReviewed: "2026-02-20",
    readingTime: 5,
    evidenceLevel: "Evidence-informed",
    reviewStatus: "medically-reviewed",
  },
  {
    slug: "healthy-communication-relationships",
    title: "Healthy Communication in Relationships: Listening to Understand",
    deck: "Practical phrases and habits that build trust, reduce conflict and deepen connection.",
    excerpt: "Strong relationships depend on how we listen, speak and repair. Learn compassionate communication patterns you can practice today.",
    category: "Relationships",
    topics: ["Communication", "Trust", "Family"],
    author: FOUNDER,
    reviewer: reviewers[2],
    featuredImage: "/images/articles/healthy-communication-relationships.jpg",
    imageAlt: "Nigerian couple engaging in thoughtful conversation in a warm cafe",
    content: [
      { type: "paragraph", text: "Relationship wellbeing grows from small, repeated actions: how we listen, how we handle disagreement, and how we show care when things are difficult." },
      { type: "heading", text: "A three-step check for difficult conversations" },
      { type: "list", text: "", items: ["Pause: notice your body and emotions before responding", "Phrase with I-statements: 'I feel ___ when ___ because ___'", "Invite: 'What is this like for you? What would help right now?'"] },
    ],
    keyTakeaways: ["Listening without interrupting builds safety.", "Repair after conflict matters more than avoiding conflict entirely.", "Kind, clear boundaries protect both people."],
    faqs: [{ q: "What if my partner shuts down?", a: "Give space, agree on a time to revisit, and use calm language. If patterns persist, a counselor or trusted mediator may help." }],
    references: [{ title: "APA — Healthy relationships", url: "https://www.apa.org/topics/healthy-relationships" }],
    publishedAt: "2026-01-10",
    updatedAt: "2026-03-05",
    lastReviewed: "2026-03-01",
    readingTime: 5,
    evidenceLevel: "General education",
    reviewStatus: "medically-reviewed",
  },
  {
    slug: "preventive-care-checkups",
    title: "Preventive Care: Why Regular Checkups Matter More Than You Think",
    deck: "Screening, habits and early conversations that reduce risk — explained in plain language.",
    excerpt: "Prevention is not just tests. It is daily choices, timely visits, and knowing your family history.",
    category: "Prevention",
    topics: ["Screening", "Primary Care", "Healthy Choices"],
    author: FOUNDER,
    reviewer: reviewers[1],
    featuredImage: "/images/articles/preventive-care-checkups.jpg",
    imageAlt: "Nigerian male doctor reviewing health chart in a modern medical clinic",
    content: [{ type: "paragraph", text: "Preventive care helps identify risks early when support is often more effective. This includes regular visits, blood pressure checks, immunizations and conversations about lifestyle." }],
    keyTakeaways: ["Know your numbers: blood pressure, and risk factors relevant to your age and history.", "Bring a list of medicines and questions to appointments."],
    faqs: [{ q: "How often should I have a checkup?", a: "Frequency depends on age, history and local guidelines. Ask your primary-care clinic for a personalized schedule." }],
    references: [{ title: "WHO — Prevention", url: "https://www.who.int/health-topics/disease-prevention" }],
    publishedAt: "2026-02-01",
    updatedAt: "2026-03-10",
    readingTime: 4,
    evidenceLevel: "Evidence-informed",
    reviewStatus: "medically-reviewed",
  },
  {
    slug: "parenting-adolescent-wellbeing",
    title: "Supporting Adolescent Wellbeing: A Guide for Parents and Caregivers",
    deck: "Developmentally supportive ways to stay connected while respecting independence.",
    excerpt: "Adolescence brings big changes. Learn to balance guidance with autonomy and recognize signs that extra support helps.",
    category: "Family & Parenting",
    topics: ["Parenting", "Adolescents", "Connection"],
    author: FOUNDER,
    reviewer: reviewers[2],
    featuredImage: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=1200&h=675&fit=crop&crop=focalpoint&fp-y=0.25",
    imageAlt: "Smiling young child outdoors with full view and headroom",
    content: [{ type: "paragraph", text: "Adolescents thrive when they feel both connected and respected. Consistent routines, open conversation and age-appropriate autonomy help." }],
    keyTakeaways: ["Stay curious, not interrogative.", "Teach coping by modeling it."],
    faqs: [{ q: "How do I start a mental health conversation?", a: "Choose a calm moment, listen more than advise, and ask 'What would feel supportive right now?'" }],
    references: [{ title: "UNICEF — Parenting", url: "https://www.unicef.org/parenting" }],
    publishedAt: "2026-01-25",
    updatedAt: "2026-02-15",
    readingTime: 7,
    evidenceLevel: "Expert reviewed",
    reviewStatus: "medically-reviewed",
  },
  {
    slug: "workplace-burnout-boundaries",
    title: "Workplace Burnout: Early Signs and Boundary Strategies That Help",
    deck: "Understand burnout beyond tiredness — and practical ways leaders and teams can protect wellbeing.",
    excerpt: "Exhaustion, detachment and reduced effectiveness often build gradually. Learn to spot signs early and respond with boundaries.",
    category: "Workplace Wellbeing",
    topics: ["Burnout", "Boundaries", "Leadership"],
    author: FOUNDER,
    reviewer: reviewers[1],
    featuredImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=675&fit=crop&crop=focalpoint&fp-y=0.35",
    imageAlt: "Nigerian professionals collaborating at modern office workspace with clear view",
    content: [{ type: "paragraph", text: "Burnout is linked to prolonged workplace stress. It is not simply personal weakness; environment, workload, autonomy and recognition all matter." }],
    keyTakeaways: ["Boundaries are not selfish; they sustain performance.", "Managers shape norms by modeling rest and fairness."],
    faqs: [{ q: "What can I do today?", a: "Define one workday end-time and protect it for a week. Notice what changes." }],
    references: [{ title: "WHO — Burn-out", url: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon" }],
    publishedAt: "2026-02-12",
    updatedAt: "2026-03-12",
    readingTime: 6,
    evidenceLevel: "Evidence-informed",
    reviewStatus: "medically-reviewed",
  },
  {
    slug: "air-quality-and-health",
    title: "Air Quality and Your Health: Small Steps That Reduce Risk",
    deck: "What indoor and outdoor air means for lungs, heart and children — and what you can control.",
    excerpt: "From cooking smoke to traffic pollution, air quality shapes health. Learn practical ways to breathe easier at home and work.",
    category: "Environment & Health",
    topics: ["Air Quality", "Children", "Prevention"],
    author: FOUNDER,
    featuredImage: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&h=675&fit=crop&crop=focalpoint&fp-y=0.35",
    imageAlt: "Happy children jumping and playing in fresh clean forest air",
    content: [{ type: "paragraph", text: "Ventilation, cooking practices, tobacco smoke and traffic exposure all affect air you breathe daily." }],
    keyTakeaways: ["Ventilate while cooking and avoid indoor smoking.", "Check local air quality when possible."],
    faqs: [{ q: "Are air purifiers useful?", a: "Some may help in specific indoor conditions, but ventilation and source control come first. Ask local guidance." }],
    references: [{ title: "WHO — Air pollution", url: "https://www.who.int/health-topics/air-pollution" }],
    publishedAt: "2026-01-18",
    updatedAt: "2026-02-28",
    readingTime: 4,
    evidenceLevel: "Evidence-informed",
    reviewStatus: "pending-medical-review",
  },
  {
    slug: "social-connection-loneliness",
    title: "Social Connection and Loneliness: Why Belonging Protects Health",
    deck: "Belonging is not a luxury — it shapes physical and mental health. Ideas for strengthening connection.",
    excerpt: "Loneliness can affect sleep, mood and immunity. Explore community-oriented ways to feel more connected.",
    category: "Social Wellbeing",
    topics: ["Belonging", "Community", "Mental Health"],
    author: FOUNDER,
    featuredImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=675&fit=crop&crop=focalpoint&fp-y=0.3",
    imageAlt: "Group of cheerful friends laughing and connecting around a table",
    content: [{ type: "paragraph", text: "Connection is built through repeated small interactions: greetings, invitations, shared activities and offers of help." }],
    keyTakeaways: ["One consistent social ritual matters more than many occasional events."],
    faqs: [{ q: "I feel lonely but surrounded by people?", a: "Loneliness is about perceived connection, not number of contacts. Meaningful interaction helps." }],
    references: [{ title: "CDC — Social Connection", url: "https://www.cdc.gov/social-connectedness/about/index.html" }],
    publishedAt: "2026-02-20",
    updatedAt: "2026-03-08",
    readingTime: 5,
    evidenceLevel: "General education",
    reviewStatus: "medically-reviewed",
  },
];

export function getArticle(slug: string) { return articles.find(a=>a.slug===slug); }
export function getArticlesByCategory(cat: Category) { return articles.filter(a=>a.category===cat); }
export function searchArticles(q: string) {
  const s = q.toLowerCase();
  if(!s) return articles;
  return articles.filter(a=> a.title.toLowerCase().includes(s) || a.deck.toLowerCase().includes(s) || a.excerpt.toLowerCase().includes(s) || a.topics.some(t=>t.toLowerCase().includes(s)) || a.category.toLowerCase().includes(s));
}
export const campaigns = [
  { slug: "mindful-may", title: "Mindful May — 30 Days of Small Calm Practices", description: "A public awareness campaign with one tiny practice each day: breathing, gratitude, movement and connection. Download a printable tracker.", color: "bg-brand-500" },
  { slug: "healthy-hearts", title: "Healthy Hearts: Know Your Numbers", description: "Community campaign on blood pressure, salt awareness and walking groups across Nigerian communities.", color: "bg-emerald-600" },
];
export const courses = [
  { slug: "stress-management-101", title: "Stress Management 101", lessons: 6, duration: "2.5 hours", audience: "Adults • Beginners", description: "Foundations of stress, coping toolbox, sleep and boundaries. Educational, not clinical therapy." },
  { slug: "healthy-relationships", title: "Healthy Relationships & Communication", lessons: 5, duration: "2 hours", audience: "Couples • Families", description: "Listening, repairing conflict, expressing needs kindly." },
  { slug: "first-aid-awareness", title: "First Aid Awareness — Family Edition", lessons: 4, duration: "1.5 hours", audience: "Parents • Teachers", description: "Awareness of choking, bleeding and emergency steps. Not a certified medical course." },
];
