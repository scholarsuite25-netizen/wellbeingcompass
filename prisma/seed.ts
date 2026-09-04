import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding WellMind Health database with Nigerian medical team and full RBAC users…");

  // 1. Categories
  const cats = [
    { slug: "mental-health", label: "Mental Health", description: "Understanding emotions, stress, anxiety, depression and coping." },
    { slug: "general-health", label: "General Health", description: "Body, nutrition, sleep, chronic conditions and everyday care." },
    { slug: "prevention", label: "Prevention", description: "Healthy habits, screening, and reducing risk." },
    { slug: "relationships", label: "Relationships", description: "Communication, boundaries, empathy and connection." },
    { slug: "family-parenting", label: "Family & Parenting", description: "Parenting, child wellbeing and family resilience." },
    { slug: "social-wellbeing", label: "Social Wellbeing", description: "Belonging, community, support systems." },
    { slug: "environment", label: "Environment & Health", description: "Air, water, housing, climate and health." },
    { slug: "workplace", label: "Workplace Wellbeing", description: "Burnout, balance, psychologically safe work." },
    { slug: "training", label: "Training", description: "Short courses on wellbeing." },
  ];
  for (const c of cats) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // 2. Topics
  const topics = [
    "Anxiety & Stress", "Coping Skills", "Awareness", "Sleep", "Prevention",
    "Healthy Habits", "Communication", "Trust", "Family", "Screening",
    "Primary Care", "Parenting", "Adolescents", "Burnout", "Boundaries",
    "Leadership", "Air Quality", "Children", "Belonging", "Community",
  ];
  for (const t of topics) {
    const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.topic.upsert({ where: { slug }, update: {}, create: { slug, label: t } });
  }

  // 3. Authors
  const authors = [
    { slug: "christianah-oyinloye", name: "Christianah Mojirade Adeola Oyinloye", role: "Nurse Leader • Health Educator • Researcher", bio: "Nursing leader, healthcare educator, researcher and health advocate dedicated to helping people understand health in a practical and holistic way.", avatar: "/images/christianah-oyinloye.png", isFounder: true, credentials: "RN, RM, PhD", professionalTitle: "Director of Nursing Services", currentPosition: "Babcock University Teaching Hospital, Ilishan-Remo, Ogun State, Nigeria", shortBio: "Nursing leader, healthcare educator, researcher and health advocate dedicated to helping people understand health in a practical and holistic way. Director of Nursing Services at Babcock University Teaching Hospital, PhD in Nursing from Babcock University, with more than two decades of professional experience in Nigeria and international experience in Qatar.", profilePhoto: "/images/christianah-oyinloye.png", expertise: JSON.stringify([{ title: "Mental Health & Emotional Wellbeing" }, { title: "Public Health & Health Promotion" }, { title: "Nursing Leadership & Healthcare Administration" }, { title: "Oncology Nursing" }]), education: JSON.stringify([{ title: "PhD in Nursing", place: "Babcock University" }]), fellowships: JSON.stringify(["Fellow of the African Institute of Public Health Professionals", "Fellow of the Academy of Oncology Nursing"]), awards: JSON.stringify(["Outstanding Leadership Award", "Nursing Administrator of the Year", "Kathrine Oxford Customer Service Strategic Leadership Award", "Trailblazing African Nurses Award"]), researchInterests: JSON.stringify(["Mental health", "Substance-use awareness", "Adolescent health", "Family dynamics", "Nursing quality", "Public health", "Oncology nursing"]) },
    { slug: "amina-okoro", name: "Amina Okoro", role: "Public Health Specialist, MPH", bio: "Nigerian public-health writer and researcher focused on prevention, health equity, and community wellness.", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },
    { slug: "daniel-owusu", name: "Daniel Owusu", role: "Senior Medical Editor", bio: "Health journalist and editor with 12 years in African health communications and plain-language medical education.", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
    { slug: "sarah-lee", name: "Sarah Nwachukwu", role: "Mental Health & Wellbeing Educator", bio: "Lagos-based counselling educator writing on emotional resilience, relationships, and youth coping strategies.", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop" },
    { slug: "james-obi", name: "James Obi", role: "Family & Adolescent Contributor", bio: "Parenting educator and community advocate supporting family wellbeing and youth mentorship across Nigeria.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
  ];
  for (const a of authors) {
    await prisma.author.upsert({ where: { slug: a.slug }, update: {}, create: a });
  }

  // 4. Reviewers
  const reviewers = [
    { slug: "dr-ayodele-bello", name: "Dr Ayodele Bello", credentials: "MBBS, FWACP", specialty: "Family & Community Medicine", avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop" },
    { slug: "dr-chioma-nwosu", name: "Dr Chioma Nwosu", credentials: "MBBS, MSc Public Health", specialty: "Public Health & Epidemiology", avatar: "https://images.unsplash.com/photo-1594824813626-d34e6d4ba4c8?w=400&h=400&fit=crop" },
    { slug: "dr-emeka-udo", name: "Dr Emeka Udo", credentials: "PhD Clinical Psychology", specialty: "Clinical Psychology & Neuropsychiatry", avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop" },
  ];
  for (const r of reviewers) {
    await prisma.reviewer.upsert({ where: { slug: r.slug }, update: {}, create: r });
  }

  // 5. Test Users Across All Roles
  const pw = await bcrypt.hash("Compass123!", 10);
  const oldPw = await bcrypt.hash("WellMind123!", 10);
  const users = [
    { email: "superadmin@wellbeingcompass.org", name: "Executive Super Admin", role: "SUPER_ADMIN", pw },
    { email: "admin@wellbeingcompass.org", name: "Platform Administrator", role: "ADMIN", pw },
    { email: "editor@wellbeingcompass.org", name: "Daniel Owusu (Editor-in-Chief)", role: "EDITOR_IN_CHIEF", pw },
    { email: "managing@wellbeingcompass.org", name: "Managing Editor", role: "MANAGING_EDITOR", pw },
    { email: "medicaleditor@wellbeingcompass.org", name: "Health/Medical Editor", role: "HEALTH_EDITOR", pw },
    { email: "reviewer@wellbeingcompass.org", name: "Dr. Chioma Nwosu (Medical Reviewer)", role: "MEDICAL_REVIEWER", pw },
    { email: "dr.bello@wellbeingcompass.org", name: "Dr. Ayodele Bello (Medical Reviewer)", role: "MEDICAL_REVIEWER", pw },
    { email: "author@wellbeingcompass.org", name: "Sarah Nwachukwu (Author)", role: "AUTHOR", pw },
    { email: "contributor@wellbeingcompass.org", name: "James Obi (Contributor)", role: "CONTRIBUTOR", pw },
    { email: "reader@wellbeingcompass.org", name: "Chidi Okafor (Subscribed Reader)", role: "READER", pw },
    // Aliases for backwards compatibility
    { email: "superadmin@wellmind.health", name: "Executive Super Admin", role: "SUPER_ADMIN", pw: oldPw },
    { email: "admin@wellmind.health", name: "Platform Administrator", role: "ADMIN", pw: oldPw },
    { email: "editor@wellmind.health", name: "Daniel Owusu (Editor-in-Chief)", role: "EDITOR_IN_CHIEF", pw: oldPw },
    { email: "reviewer@wellmind.health", name: "Dr. Chioma Nwosu (Medical Reviewer)", role: "MEDICAL_REVIEWER", pw: oldPw },
    { email: "author@wellmind.health", name: "Sarah Nwachukwu (Author)", role: "AUTHOR", pw: oldPw },
    { email: "reader@wellmind.health", name: "Chidi Okafor (Subscribed Reader)", role: "READER", pw: oldPw },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { role: u.role, name: u.name, password: u.pw },
      create: { email: u.email, name: u.name, role: u.role, password: u.pw, isSubscribed: true },
    });
    await prisma.newsletterSubscriber.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, source: "seed_account" },
    });
  }

  // 6. Articles
  const articleData = [
    {
      slug: "understanding-everyday-anxiety",
      title: "Understanding Everyday Anxiety: When Worry Is Normal and When to Seek Support",
      deck: "Learn the difference between common stress responses and patterns that may benefit from professional support.",
      excerpt: "Anxiety is a normal human response. This guide explains common signs, coping ideas, and when to consider help — without diagnosing you.",
      categorySlug: "mental-health",
      authorSlug: "sarah-lee",
      reviewerSlug: "dr-emeka-udo",
      featuredImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&h=700&fit=crop",
      imageAlt: "Young Nigerian woman sitting calmly in a bright room reflecting",
      imageCaption: "Calm routines, supportive relationships and healthy habits all influence how we experience anxiety.",
      topics: ["Anxiety & Stress", "Coping Skills", "Awareness"],
      readingTime: 6,
      evidenceLevel: "Expert_reviewed",
      reviewStatus: "medically_reviewed",
      publishedAt: new Date("2025-11-02"),
      lastReviewed: new Date("2026-02-08"),
      content: JSON.stringify([
        { type: "paragraph", text: "Anxiety involves feelings of worry, unease or fear. In small amounts it can help us prepare for challenges. When it becomes frequent, intense or hard to manage, it may affect sleep, work, relationships and daily life." },
        { type: "heading", text: "Common experiences that can accompany anxiety" },
        { type: "list", text: "", items: ["Racing thoughts or difficulty concentrating", "Restlessness, irritability or feeling on edge", "Physical sensations such as faster heartbeat, muscle tension, stomach unease", "Worrying more than usual about everyday matters", "Avoiding situations that trigger discomfort"] },
        { type: "callout", text: "This article is educational. If you are experiencing persistent distress, consider speaking with a healthcare professional." },
      ]),
      keyTakeaways: JSON.stringify(["Anxiety is common and varies widely.", "Healthy routines, connection and coping skills can help.", "Ongoing or severe symptoms deserve professional guidance."]),
      faqs: JSON.stringify([
        { q: "Is anxiety a sign of personal failure?", a: "No. Anxiety is common and influenced by biology, environment, life events and stress." },
        { q: "Can I manage anxiety on my own?", a: "Some coping strategies help with mild stress. Persistent anxiety is best discussed with a healthcare professional." },
        { q: "What should I do if a friend seems anxious?", a: "Listen without judgment and encourage professional help if needed. Avoid diagnosing." },
      ]),
      references: JSON.stringify([
        { title: "WHO — Mental Health information", url: "https://www.who.int/health-topics/mental-health" },
        { title: "NIMH — Anxiety Disorders", url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders" },
      ]),
    },
    {
      slug: "sleep-hygiene-guide",
      title: "Sleep Hygiene: A Simple Guide to Better Nights and Brighter Days",
      deck: "Evidence-informed habits that support restful sleep — from light exposure to wind-down routines.",
      excerpt: "Consistent sleep supports mood, learning and physical health. Explore practical, low-cost habits that improve sleep without products or promises.",
      categorySlug: "general-health",
      authorSlug: "amina-okoro",
      reviewerSlug: "dr-ayodele-bello",
      featuredImage: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=1200&h=700&fit=crop",
      imageAlt: "Serene, modern bedroom in natural daylight",
      imageCaption: "",
      topics: ["Sleep", "Prevention", "Healthy Habits"],
      readingTime: 5,
      evidenceLevel: "Evidence_informed",
      reviewStatus: "medically_reviewed",
      publishedAt: new Date("2025-12-18"),
      lastReviewed: new Date("2026-02-20"),
      content: JSON.stringify([
        { type: "paragraph", text: "Sleep affects nearly every system in the body. Small environmental and behavioral changes often improve sleep quality more sustainably than quick fixes." },
      ]),
      keyTakeaways: JSON.stringify(["Regularity and environment matter more than perfection.", "Daylight and movement during the day support sleep at night.", "If sleep problems persist for weeks, seek professional advice."]),
      faqs: JSON.stringify([
        { q: "How much sleep do adults need?", a: "Most adults feel best with 7–9 hours, but individual needs vary." },
      ]),
      references: JSON.stringify([
        { title: "CDC — About Sleep", url: "https://www.cdc.gov/sleep/about/index.html" },
      ]),
    },
    {
      slug: "preventive-care-checkups",
      title: "Preventive Care: Why Regular Checkups Matter More Than You Think",
      deck: "Screening, habits and early conversations that reduce risk — explained in plain language.",
      excerpt: "Prevention is not just tests. It is daily choices, timely visits, and knowing your family history.",
      categorySlug: "prevention",
      authorSlug: "daniel-owusu",
      reviewerSlug: "dr-chioma-nwosu",
      featuredImage: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=1200&h=700&fit=crop",
      imageAlt: "Nigerian male doctor reviewing health chart in a modern medical clinic",
      imageCaption: "",
      topics: ["Screening", "Primary Care"],
      readingTime: 4,
      evidenceLevel: "Evidence_informed",
      reviewStatus: "medically_reviewed",
      publishedAt: new Date("2026-02-01"),
      lastReviewed: new Date("2026-03-10"),
      content: JSON.stringify([
        { type: "paragraph", text: "Preventive care helps identify risks early when support is often more effective." },
      ]),
      keyTakeaways: JSON.stringify(["Know your numbers: blood pressure, and risk factors relevant to your age and history."]),
      faqs: JSON.stringify([
        { q: "How often should I have a checkup?", a: "Frequency depends on age, history and local guidelines. Ask your primary-care clinic." },
      ]),
      references: JSON.stringify([
        { title: "WHO — Prevention", url: "https://www.who.int/health-topics/disease-prevention" },
      ]),
    },
    {
      slug: "healthy-communication-relationships",
      title: "Healthy Communication in Relationships: Listening to Understand",
      deck: "Practical phrases and habits that build trust, reduce conflict and deepen connection.",
      excerpt: "Strong relationships depend on how we listen, speak and repair. Learn compassionate communication patterns you can practice today.",
      categorySlug: "relationships",
      authorSlug: "sarah-lee",
      reviewerSlug: "dr-emeka-udo",
      featuredImage: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&h=700&fit=crop",
      imageAlt: "Nigerian couple engaging in thoughtful conversation in a warm cafe",
      imageCaption: "",
      topics: ["Communication", "Trust", "Family"],
      readingTime: 5,
      evidenceLevel: "General_education",
      reviewStatus: "medically_reviewed",
      publishedAt: new Date("2026-01-10"),
      lastReviewed: new Date("2026-03-01"),
      content: JSON.stringify([
        { type: "paragraph", text: "Relationship wellbeing grows from small, repeated actions: how we listen, how we handle disagreement, and how we show care when things are difficult." },
      ]),
      keyTakeaways: JSON.stringify(["Listening without interrupting builds safety.", "Repair after conflict matters more than avoiding conflict.", "Kind, clear boundaries protect both people."]),
      faqs: JSON.stringify([
        { q: "What if my partner shuts down?", a: "Give space, agree on a time to revisit, and use calm language." },
      ]),
      references: JSON.stringify([
        { title: "APA — Healthy relationships", url: "https://www.apa.org/topics/healthy-relationships" },
      ]),
    },
    {
      slug: "parenting-adolescent-wellbeing",
      title: "Supporting Adolescent Wellbeing: A Guide for Parents and Caregivers",
      deck: "Developmentally supportive ways to stay connected while respecting independence.",
      excerpt: "Adolescence brings big changes. Learn to balance guidance with autonomy.",
      categorySlug: "family-parenting",
      authorSlug: "james-obi",
      reviewerSlug: "dr-emeka-udo",
      featuredImage: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1200&h=700&fit=crop",
      imageAlt: "Nigerian parent and teenager conversing comfortably outdoors in a garden",
      imageCaption: "",
      topics: ["Parenting", "Adolescents"],
      readingTime: 7,
      evidenceLevel: "Expert_reviewed",
      reviewStatus: "medically_reviewed",
      publishedAt: new Date("2026-01-25"),
      lastReviewed: new Date("2026-02-15"),
      content: JSON.stringify([
        { type: "paragraph", text: "Adolescents thrive when they feel both connected and respected." },
      ]),
      keyTakeaways: JSON.stringify(["Stay curious, not interrogative.", "Teach coping by modeling it."]),
      faqs: JSON.stringify([
        { q: "How do I start a mental health conversation?", a: "Choose a calm moment, listen more than advise." },
      ]),
      references: JSON.stringify([
        { title: "UNICEF — Parenting", url: "https://www.unicef.org/parenting" },
      ]),
    },
    {
      slug: "workplace-burnout-boundaries",
      title: "Workplace Burnout: Early Signs and Boundary Strategies That Help",
      deck: "Understand burnout beyond tiredness — and practical ways leaders and teams can protect wellbeing.",
      excerpt: "Exhaustion, detachment and reduced effectiveness often build gradually.",
      categorySlug: "workplace",
      authorSlug: "daniel-owusu",
      reviewerSlug: "dr-chioma-nwosu",
      featuredImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&h=700&fit=crop",
      imageAlt: "Nigerian professional working at a desk in a bright, modern corporate office",
      imageCaption: "",
      topics: ["Burnout", "Boundaries", "Leadership"],
      readingTime: 6,
      evidenceLevel: "Evidence_informed",
      reviewStatus: "medically_reviewed",
      publishedAt: new Date("2026-02-12"),
      lastReviewed: new Date("2026-03-12"),
      content: JSON.stringify([
        { type: "paragraph", text: "Burnout is linked to prolonged workplace stress. It is not simply personal weakness." },
      ]),
      keyTakeaways: JSON.stringify(["Boundaries are not selfish; they sustain performance."]),
      faqs: JSON.stringify([{ q: "What can I do today?", a: "Define one workday end-time and protect it for a week." }]),
      references: JSON.stringify([
        { title: "WHO — Burn-out", url: "https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon" },
      ]),
    },
  ];

  for (const ad of articleData) {
    const cat = await prisma.category.findUnique({ where: { slug: ad.categorySlug } });
    const aut = await prisma.author.findUnique({ where: { slug: ad.authorSlug } });
    const rev = ad.reviewerSlug ? await prisma.reviewer.findUnique({ where: { slug: ad.reviewerSlug } }) : null;
    if (!cat || !aut) continue;

    await prisma.article.upsert({
      where: { slug: ad.slug },
      update: {
        title: ad.title,
        deck: ad.deck,
        excerpt: ad.excerpt,
        featuredImage: ad.featuredImage,
        imageAlt: ad.imageAlt,
        categoryId: cat.id,
        authorId: aut.id,
        reviewerId: rev?.id ?? null,
        readingTime: ad.readingTime,
        evidenceLevel: ad.evidenceLevel,
        reviewStatus: ad.reviewStatus,
        publishedAt: ad.publishedAt,
        lastReviewed: (ad as any).lastReviewed ?? null,
        content: ad.content,
        keyTakeaways: ad.keyTakeaways,
        faqs: ad.faqs,
        references: ad.references,
      },
      create: {
        slug: ad.slug,
        title: ad.title,
        deck: ad.deck,
        excerpt: ad.excerpt,
        featuredImage: ad.featuredImage,
        imageAlt: ad.imageAlt,
        categoryId: cat.id,
        authorId: aut.id,
        reviewerId: rev?.id ?? null,
        readingTime: ad.readingTime,
        evidenceLevel: ad.evidenceLevel,
        reviewStatus: ad.reviewStatus,
        publishedAt: ad.publishedAt,
        lastReviewed: (ad as any).lastReviewed ?? null,
        content: ad.content,
        keyTakeaways: ad.keyTakeaways,
        faqs: ad.faqs,
        references: ad.references,
      },
    });
  }

  // 7. Courses & Quizzes
  const stressCourse = await prisma.course.upsert({
    where: { slug: "stress-management-101" },
    update: {},
    create: {
      slug: "stress-management-101",
      title: "Stress Management 101",
      lessons: 6,
      duration: "2.5 hours",
      audience: "Adults • Beginners",
      description: "Foundations of stress, coping toolbox, sleep and boundaries. Educational, not clinical therapy.",
    },
  });

  await prisma.quiz.upsert({
    where: { id: "q1" },
    update: {},
    create: {
      id: "q1",
      courseId: stressCourse.id,
      question: "Which breathing pattern is suggested for a quick one-minute nervous system reset?",
      options: JSON.stringify(["Inhale 8, hold 8, exhale 8", "Inhale 4, hold 2, exhale 6", "Inhale 2, exhale 2 rapidly", "Hold breath for 30 seconds"]),
      answer: 1,
      explain: "Inhaling for 4, holding for 2, and exhaling for 6 helps activate the parasympathetic nervous system to settle the body.",
    },
  });

  await prisma.quiz.upsert({
    where: { id: "q2" },
    update: {},
    create: {
      id: "q2",
      courseId: stressCourse.id,
      question: "What is the recommended response if stress or anxiety symptoms persist and interfere with everyday life?",
      options: JSON.stringify(["Attempt to push through alone", "Ignore physical warning signs", "Speak with a qualified healthcare professional", "Completely avoid all daily responsibilities"]),
      answer: 2,
      explain: "Persistent or interfering symptoms deserve professional evaluation from a doctor or licensed counsellor.",
    },
  });

  console.log("Seeding complete with full RBAC accounts and clinical data! ✨");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
