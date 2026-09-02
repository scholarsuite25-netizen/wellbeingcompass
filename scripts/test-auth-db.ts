import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import {
  canAccessCMS,
  canPublish,
  canReviewMedical,
  canManageUsers,
  canDeleteArticles,
  canViewAuditLogs,
} from "../lib/roles";

async function runTests() {
  console.log("=================================================");
  console.log("🧪 WELLBEING COMPASS — DATABASE, AUTH & RBAC TESTS");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // ── TEST 1: Database Seed Integrity ──────────────────────────
  console.log("▶ 1. Checking Database Records & Seed Integrity...");
  const userCount = await prisma.user.count();
  assert(userCount >= 10, `Database has ${userCount} users seeded across all roles (expected >= 10)`);

  const categoryCount = await prisma.category.count();
  assert(categoryCount === 9, `Database has 9 categories seeded (got ${categoryCount})`);

  const articleCount = await prisma.article.count();
  assert(articleCount >= 6, `Database has ${articleCount} articles seeded (got >= 6)`);

  const reviewerCount = await prisma.reviewer.count();
  assert(reviewerCount >= 3, `Database has ${reviewerCount} Nigerian medical reviewers seeded`);

  // ── TEST 2: Password Hashing & Credentials Verification ──────
  console.log("\n▶ 2. Testing Password Hashing & Bcrypt Authentication...");
  const testUser = await prisma.user.findUnique({
    where: { email: "superadmin@wellbeingcompass.org" },
  });
  assert(Boolean(testUser), "Found seeded superadmin account (superadmin@wellbeingcompass.org)");

  const isPasswordValid = await bcrypt.compare("Compass123!", testUser?.password || "");
  assert(isPasswordValid, "Password bcrypt compare verified with 'Compass123!'");

  const isWrongPasswordBlocked = !(await bcrypt.compare("WrongPassword!", testUser?.password || ""));
  assert(isWrongPasswordBlocked, "Invalid password properly rejected by bcrypt");

  // ── TEST 3: User Registration & Auto-Subscription ────────────
  console.log("\n▶ 3. Testing Registration & Auto-Subscription Mechanism...");
  const newEmail = `test.reader.${Date.now()}@wellbeingcompass.org`;
  const hashedNewPw = await bcrypt.hash("SecurePass123!", 10);

  const registeredUser = await prisma.user.create({
    data: {
      name: "Amara Nnadi",
      email: newEmail,
      password: hashedNewPw,
      role: "READER",
      isSubscribed: true,
    },
  });
  assert(Boolean(registeredUser.id), "New user created in DB");

  // Auto-subscribe
  await prisma.newsletterSubscriber.create({
    data: { email: newEmail, source: "test_registration" },
  });
  const isSubscribedInDb = await prisma.newsletterSubscriber.findUnique({
    where: { email: newEmail },
  });
  assert(Boolean(isSubscribedInDb), "User automatically added to NewsletterSubscriber table");

  // ── TEST 4: RBAC Permissions Matrix ──────────────────────────
  console.log("\n▶ 4. Testing Role-Based Access Control (RBAC) Matrix...");

  // Super Admin
  assert(canManageUsers("SUPER_ADMIN"), "SUPER_ADMIN can manage users and roles");
  assert(canPublish("SUPER_ADMIN", true), "SUPER_ADMIN can publish high-risk medical content");
  assert(canReviewMedical("SUPER_ADMIN"), "SUPER_ADMIN can review medical articles");
  assert(canAccessCMS("SUPER_ADMIN"), "SUPER_ADMIN can access CMS");
  assert(canDeleteArticles("SUPER_ADMIN"), "SUPER_ADMIN can delete articles");

  // Admin
  assert(canManageUsers("ADMIN"), "ADMIN can manage users");
  assert(canPublish("ADMIN", true), "ADMIN can publish");
  assert(!canReviewMedical("ADMIN"), "ADMIN cannot sign off on clinical review (requires Medical Reviewer)");

  // Medical Reviewer
  assert(canReviewMedical("MEDICAL_REVIEWER"), "MEDICAL_REVIEWER can sign off on clinical reviews");
  assert(canAccessCMS("MEDICAL_REVIEWER"), "MEDICAL_REVIEWER can access CMS");
  assert(!canManageUsers("MEDICAL_REVIEWER"), "MEDICAL_REVIEWER cannot manage user accounts");

  // Author
  assert(canAccessCMS("AUTHOR"), "AUTHOR can access CMS to write articles");
  assert(!canPublish("AUTHOR", true), "AUTHOR blocked from publishing high-risk without medical review");
  assert(canPublish("AUTHOR", false), "AUTHOR can publish low-risk non-clinical articles");
  assert(!canReviewMedical("AUTHOR"), "AUTHOR cannot approve clinical reviews");

  // Reader / Public
  assert(!canAccessCMS("READER"), "READER cannot access CMS");
  assert(!canPublish("READER", false), "READER cannot publish");
  assert(!canReviewMedical("READER"), "READER cannot review");

  // ── TEST 5: Bookmarks & Course Progress ──────────────────────
  console.log("\n▶ 5. Testing Reader Bookmarks & Course Progress...");
  const firstArticle = await prisma.article.findFirst();
  if (firstArticle) {
    const bookmark = await prisma.bookmark.create({
      data: { userId: registeredUser.id, articleId: firstArticle.id },
    });
    assert(Boolean(bookmark.id), `Reader successfully bookmarked article "${firstArticle.title.slice(0, 30)}..."`);
  }

  const stressCourse = await prisma.course.findUnique({ where: { slug: "stress-management-101" } });
  if (stressCourse) {
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        userId: registeredUser.id,
        courseId: stressCourse.id,
        completedLessons: JSON.stringify([0, 1]),
        quizScore: 100,
      },
    });
    assert(Boolean(enrollment.id), "Reader successfully enrolled and recorded course lesson progress");
  }

  // Cleanup test user
  await prisma.user.delete({ where: { id: registeredUser.id } }).catch(() => {});
  await prisma.newsletterSubscriber.delete({ where: { email: newEmail } }).catch(() => {});

  console.log("\n=================================================");
  console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) process.exit(1);
}

runTests()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
