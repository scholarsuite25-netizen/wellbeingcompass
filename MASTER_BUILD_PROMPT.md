# Master Build Prompt — WellMind Health

You are a senior product architect, full-stack engineer, medical-content UX strategist, accessibility specialist, SEO engineer, security engineer, and digital publishing expert.

Build a production-ready, responsive medical education and wellbeing web application called **WellMind Health**.

## Brand
Name: WellMind Health
Tagline: Understand. Prevent. Heal. Thrive.
Colour philosophy:
- Blue is the dominant brand colour.
- Yellow is a restrained accent for calls to action, highlights, badges, awareness elements, and positive moments.
- Use neutral white/off-white surfaces and accessible dark text.
- Do not create a childish, hospital-like, or overly corporate appearance.
- The visual mood should communicate trust, calm, hope, intelligence, compassion and professionalism.

## Mission
The platform educates, counsels, trains and creates awareness around mental health and general health. It should also help readers understand and address environmental, relationship, family, workplace and social factors that affect health and wellbeing.

## Critical instruction
Do not build a superficial blog template. Build a complete digital health publishing platform with a strong CMS, structured content, editorial workflows, author/reviewer profiles, media management, search, taxonomy, SEO, accessibility, moderation, analytics-ready architecture and health-safety controls.

## Core experience
Create:
- Beautiful homepage
- Mental health hub
- General health hub
- Prevention hub
- Relationships hub
- Family & parenting hub
- Social wellbeing hub
- Environment & health hub
- Workplace wellbeing hub
- Training/learning hub
- Health awareness campaigns
- Article detail pages
- Author pages
- Medical reviewer pages
- Topic pages
- Search results
- Newsletter subscription
- Contact/about pages
- Emergency/help page
- Privacy, terms, disclaimer and editorial policy pages

## Homepage
Include:
- Hero editorial feature
- Latest health stories
- Mental health spotlight
- General health spotlight
- Practical tips
- Relationships/social wellbeing section
- Environment and health section
- Training/learning section
- Awareness campaign banner
- Featured experts
- Newsletter signup
- Emergency/help notice where appropriate
- Footer with complete navigation

## Article system
Articles must support:
- Title
- Subtitle/deck
- Slug
- Excerpt
- Author
- Medical reviewer
- Category
- Multiple topics/tags
- Featured image
- Image caption
- Inline images
- Image credits/licensing
- Image alt text
- Rich text
- Pull quotes
- Callout boxes
- Key takeaways
- Table of contents
- FAQs
- References/sources
- Related articles
- Publication date
- Updated date
- Reading time
- Evidence level
- Review status
- Content warning where appropriate
- Last medically reviewed date
- Disclaimer
- Share tools

Support left, right and centred image placement when editorially appropriate. Maintain elegant typography and excellent readability on mobile and desktop.

## CMS
Build a robust WordPress-like CMS:
- Dashboard
- Posts/articles
- Drafts
- Scheduled publishing
- Pages
- Categories
- Tags/topics
- Authors
- Medical reviewers
- Media library
- Menus
- Homepage modules
- Newsletters
- Comments
- Moderation queue
- Health campaigns
- Training courses
- FAQs
- References
- Redirects
- SEO settings
- Site settings
- Analytics settings
- Audit logs

## Roles
At minimum:
- Super Admin
- Administrator
- Editor-in-Chief
- Managing Editor
- Health/Medical Editor
- Medical Reviewer
- Author
- Contributor
- Copy Editor
- Moderator
- Media Manager
- SEO Manager
- Trainer/Course Manager

Implement granular permissions. Authors must not be able to publish medically sensitive content without the required workflow.

## Editorial workflow
Use:
Idea → Draft → Editorial Review → Medical Review where required → Copy/Fact Check → SEO Review → Approved → Scheduled/Published → Periodic Review.

Make review requirements configurable by content category and risk level.

## Medical safety
The application must never imply that an article provides a personal diagnosis. Build reusable safety components:
- General-information disclaimer
- “When to seek professional help”
- “Emergency help” component
- Crisis-sensitive content warning
- Medication disclaimer
- Source/reference panel
- Medical review badge
- Last reviewed date

Do not use sensational language, stigma, fear-based headlines, unsupported cures, fabricated statistics, or claims that a particular article can replace professional care.

For mental-health content, use supportive, non-stigmatizing language. Avoid unnecessarily graphic descriptions of self-harm or suicide. Include appropriate help-seeking guidance for high-risk subjects.

## Search
Provide:
- Full-text search
- Topic/category filters
- Health area filters
- Content type filters
- Author filters
- Date filters
- Search suggestions
- Empty states
- Related content

## SEO
Implement:
- Clean URLs
- Canonical URLs
- Metadata
- Open Graph
- Twitter/X cards
- XML sitemap
- robots controls
- Breadcrumbs
- Article structured data
- FAQ structured data only when appropriate
- Person/author structured data
- Organization structured data
- Internal linking
- Related content
- Image SEO
- Pagination/indexation controls

Do not make medical claims solely for SEO.

## Accessibility
Target WCAG 2.2 AA:
- Keyboard navigation
- Visible focus states
- Semantic HTML
- Screen-reader labels
- Accessible forms
- Colour contrast
- Alt text
- Captions/transcripts for media
- Reduced-motion support
- Skip links
- Responsive typography

Do not rely on blue/yellow colour alone to communicate meaning.

## Performance
Use:
- Responsive images
- Modern image formats
- Lazy loading
- Image dimensions to prevent layout shift
- Code splitting
- Caching
- CDN-ready architecture
- Optimized fonts
- Minimal client-side JavaScript where possible

Target excellent Core Web Vitals.

## Security and privacy
Implement:
- Secure authentication
- Strong password handling
- Role-based access control
- CSRF protection
- Input validation
- Output sanitization
- Rate limiting
- Secure file uploads
- Audit logs
- Session security
- Privacy-conscious analytics
- Data retention controls
- Consent management where required

Never expose private user health information in URLs, logs, analytics events, search indexes, or public profiles.

## Content model
Use structured content rather than storing everything as arbitrary HTML. Design reusable blocks for:
- Text
- Heading
- Image
- Gallery
- Quote
- Key takeaway
- Warning
- Tip
- FAQ
- Reference
- Related content
- Expert insight
- Video/audio
- Course CTA
- Newsletter CTA
- Emergency/help box

## Training
Create an optional learning area with:
- Courses
- Lessons
- Modules
- Quizzes
- Progress tracking
- Certificates/badges where appropriate
- Trainer profiles

Examples:
- Mental health awareness
- Stress management
- Healthy relationships
- Workplace wellbeing
- First aid awareness
- Healthy lifestyle education
- Parenting and adolescent wellbeing

Keep training educational and do not present non-clinical training as professional medical certification unless formally accredited.

## Design
Use a premium editorial health-magazine aesthetic:
- Generous whitespace
- Strong hierarchy
- Calm blue surfaces
- Small, intentional yellow accents
- High-quality documentary/editorial imagery
- Human photography rather than generic medical stock where possible
- Rounded cards only where useful
- Subtle motion
- No excessive gradients
- No clutter

## Responsive behavior
Design mobile-first and ensure:
- Navigation works elegantly on small screens
- Articles remain highly readable
- Images never overflow
- Tables scroll safely
- CMS works on tablet and desktop
- Touch targets are accessible
- Sticky elements do not cover content

## Quality requirements
Before declaring completion:
1. Run build/type checks.
2. Run linting.
3. Test every route.
4. Test all forms.
5. Test authentication and role permissions.
6. Test CMS workflows.
7. Test image upload and media handling.
8. Test search and filters.
9. Test responsive layouts.
10. Test keyboard navigation.
11. Test broken/empty states.
12. Test SEO metadata.
13. Test security-sensitive inputs.
14. Test database migrations.
15. Test production deployment.
16. Remove placeholder content where real content is expected.
17. Fix all console errors and broken links.

Do not merely report problems. Fix them.

## Content generation
Seed the application with a high-quality editorial taxonomy and realistic sample articles, but clearly label sample/editorial content. Do not fabricate medical experts, credentials, citations, statistics, clinical trials or health claims.

## Deliverables
Produce:
- Working application
- Database/schema
- CMS
- Authentication/authorization
- Responsive frontend
- Seed content
- Documentation
- Environment variable documentation
- Deployment instructions
- Testing checklist
- Medical editorial safety framework

If the existing project already contains code, preserve useful functionality and data. Inspect the existing architecture before making destructive changes. Do not overwrite working features without understanding their dependencies.
