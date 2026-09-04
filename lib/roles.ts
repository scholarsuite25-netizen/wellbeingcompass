export const ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR_IN_CHIEF",
  "MANAGING_EDITOR",
  "HEALTH_EDITOR",
  "MEDICAL_REVIEWER",
  "AUTHOR",
  "CONTRIBUTOR",
  "COPY_EDITOR",
  "MODERATOR",
  "MEDIA_MANAGER",
  "SEO_MANAGER",
  "TRAINER",
  "READER",
] as const;

export type Role = typeof ROLES[number];
export const REVIEW_STATUS = ["draft", "pending_medical_review", "medically_reviewed", "published", "scheduled"] as const;
export const EVIDENCE_LEVELS = ["Evidence_informed", "Expert_reviewed", "General_education", "Research_summary", "Clinical_guideline_based"] as const;

/**
 * Checks if a user has access to the CMS administrative workspace.
 */
export function canAccessCMS(role?: string): boolean {
  if (!role) return false;
  return [
    "SUPER_ADMIN",
    "ADMIN",
    "EDITOR_IN_CHIEF",
    "MANAGING_EDITOR",
    "HEALTH_EDITOR",
    "MEDICAL_REVIEWER",
    "AUTHOR",
    "CONTRIBUTOR",
    "COPY_EDITOR",
    "MODERATOR",
    "MEDIA_MANAGER",
    "SEO_MANAGER",
    "TRAINER",
  ].includes(role);
}

/**
 * Checks if a user can publish content.
 * High-risk or clinical content CANNOT be published by AUTHORS/CONTRIBUTORS without medical review.
 */
export function canPublish(role?: string, needsMedicalReview: boolean = true): boolean {
  if (!role) return false;
  if (["READER", "CONTRIBUTOR"].includes(role)) return false;
  if (needsMedicalReview && role === "AUTHOR") {
    return false;
  }
  return ["SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF", "MANAGING_EDITOR", "HEALTH_EDITOR", "AUTHOR"].includes(role);
}

/**
 * Checks if a user has clinical credentials to perform official medical reviews.
 */
export function canReviewMedical(role?: string): boolean {
  if (!role) return false;
  return ["SUPER_ADMIN", "MEDICAL_REVIEWER", "HEALTH_EDITOR"].includes(role);
}

/**
 * Checks if a user has permissions to create, promote, or delete users and roles.
 */
export function canManageUsers(role?: string): boolean {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
}

/**
 * Checks if a user has permission to delete articles and content.
 */
export function canDeleteArticles(role?: string): boolean {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF"].includes(role);
}

/**
 * Checks if a user has permission to view audit and security logs.
 */
export function canViewAuditLogs(role?: string): boolean {
  if (!role) return false;
  return ["SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF"].includes(role);
}

/**
 * Checks if a user has permission to change global site and security settings.
 */
export function canManageSettings(role?: string): boolean {
  if (!role) return false;
  return role === "SUPER_ADMIN";
}
