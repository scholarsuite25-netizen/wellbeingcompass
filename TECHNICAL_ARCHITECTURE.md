# Technical Architecture Guidance

The implementation may use a modern full-stack framework such as Next.js with TypeScript, a relational database, secure authentication, object storage for media, and a search layer appropriate to scale.

## Principles
- Type safety
- Server-side validation
- Structured content
- Reusable components
- Modular CMS
- API-first where useful
- Database migrations
- Automated testing
- Observability
- Deployment reproducibility

## Suggested layers
1. Presentation/UI
2. Application/services
3. Authentication/authorization
4. Content/CMS
5. Search
6. Media
7. Database
8. Analytics
9. Integrations

Do not hard-code business rules into presentation components.

## Data entities
- User
- Role
- Permission
- Article
- Page
- Category
- Topic
- Author
- Reviewer
- MediaAsset
- Reference
- Revision
- Comment
- Course
- Lesson
- Quiz
- Campaign
- NewsletterSubscriber
- AuditLog
- Redirect
- SiteSetting
