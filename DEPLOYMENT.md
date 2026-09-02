# Deployment Checklist

## Environments
- Development
- Staging
- Production

## Required configuration
Document every environment variable in `.env.example`.

Never commit:
- Passwords
- API keys
- Database credentials
- Authentication secrets
- Private storage keys

## Production checklist
- [ ] HTTPS
- [ ] Database backups
- [ ] Error monitoring
- [ ] Logging
- [ ] Secure headers
- [ ] Rate limits
- [ ] Storage protection
- [ ] Email delivery
- [ ] Sitemap
- [ ] Robots
- [ ] Analytics/privacy configuration
- [ ] Health/legal disclaimers
- [ ] Admin account protection
- [ ] Disaster recovery procedure
