# CI/CD Setup Guide

## Overview

This document explains the CI/CD pipeline setup for Sahi Jagah using GitHub Actions, Netlify, and Vercel.

## Pipeline Architecture

```
GitHub Push/PR
    ↓
GitHub Actions
    ├── Lint & Format Check
    ├── Backend Tests
    ├── Frontend Tests
    ├── Security Scan
    ├── Build Backend
    └── Build Frontend
    ↓
Deploy (if main/develop branch)
    ├── Staging (develop branch)
    │   ├── Netlify (Frontend)
    │   └── Vercel (Backend)
    └── Production (main branch)
        ├── Netlify (Frontend)
        └── Vercel (Backend)
```

## GitHub Actions Workflows

### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
1. **Lint** - ESLint and Prettier checks
2. **Backend Tests** - Jest tests with coverage
3. **Frontend Tests** - Vitest tests with coverage
4. **Backend Build** - TypeScript compilation
5. **Frontend Build** - Vite build
6. **Security Scan** - npm audit and Snyk
7. **Deploy Staging** - Deploy to staging (develop branch)
8. **Deploy Production** - Deploy to production (main branch)

### 2. PR Checks (`.github/workflows/pr-checks.yml`)

**Triggers:**
- Pull request opened, synchronized, or reopened

**Jobs:**
1. **PR Title Check** - Semantic PR title validation
2. **Code Quality** - Linting, formatting, console.log check
3. **Dependency Check** - npm audit for vulnerabilities
4. **Bundle Size Check** - Frontend bundle size analysis
5. **Coverage Check** - Test coverage reporting
6. **Lighthouse CI** - Performance and accessibility checks

### 3. CodeQL Security Scan (`.github/workflows/codeql.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests
- Weekly schedule (Monday midnight)

**Jobs:**
1. **Analyze** - CodeQL security analysis for JavaScript/TypeScript

## Required GitHub Secrets

### Netlify Secrets
```
NETLIFY_AUTH_TOKEN          # Netlify personal access token
NETLIFY_STAGING_SITE_ID     # Staging site ID
NETLIFY_PRODUCTION_SITE_ID  # Production site ID
```

### Vercel Secrets
```
VERCEL_TOKEN                # Vercel authentication token
VERCEL_ORG_ID              # Vercel organization ID
VERCEL_PROJECT_ID          # Vercel project ID
```

### Firebase Secrets (Frontend Build)
```
VITE_API_URL                        # API base URL
VITE_FIREBASE_API_KEY               # Firebase API key
VITE_FIREBASE_AUTH_DOMAIN           # Firebase auth domain
VITE_FIREBASE_PROJECT_ID            # Firebase project ID
VITE_FIREBASE_STORAGE_BUCKET        # Firebase storage bucket
VITE_FIREBASE_MESSAGING_SENDER_ID   # Firebase messaging sender ID
VITE_FIREBASE_APP_ID                # Firebase app ID
VITE_FIREBASE_DATABASE_URL          # Firebase database URL
```

### Optional Secrets
```
SNYK_TOKEN                  # Snyk security scanning token
SLACK_WEBHOOK_URL          # Slack notifications webhook
CODECOV_TOKEN              # Codecov coverage reporting token
```

## Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its value

## Netlify Setup

### 1. Create Netlify Sites

**Staging Site:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Create staging site
netlify sites:create --name sahi-jagah-staging
```

**Production Site:**
```bash
# Create production site
netlify sites:create --name sahi-jagah
```

### 2. Get Site IDs

```bash
# List your sites
netlify sites:list

# Copy the Site ID for each site
```

### 3. Get Auth Token

1. Go to https://app.netlify.com/user/applications
2. Click **New access token**
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token
5. Add to GitHub secrets as `NETLIFY_AUTH_TOKEN`

### 4. Configure netlify.toml

The `frontend/netlify.toml` file is already configured with:
- Build settings
- SPA redirects
- Security headers
- Cache headers
- Environment-specific settings

## Vercel Setup

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Link Project

```bash
cd backend
vercel link
```

### 4. Get Vercel Credentials

```bash
# Get Vercel token
vercel whoami

# Get project details
vercel project ls
```

Or get from Vercel dashboard:
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Go to your project settings
4. Copy Organization ID and Project ID

### 5. Configure vercel.json

The `backend/vercel.json` file is already configured with:
- Build settings
- Routes
- Environment variables
- Function configuration
- Region (Mumbai - bom1)

## Dependabot Setup

Dependabot is configured in `.github/dependabot.yml` to:
- Check for dependency updates weekly (Monday)
- Create PRs for npm dependencies (root, backend, frontend)
- Update GitHub Actions versions
- Limit open PRs to prevent spam

## Branch Strategy

### Main Branch (Production)
- Protected branch
- Requires PR approval
- Runs full CI/CD pipeline
- Deploys to production on merge

### Develop Branch (Staging)
- Integration branch
- Runs full CI/CD pipeline
- Deploys to staging on merge

### Feature Branches
- Created from `develop`
- Runs PR checks only
- No deployment
- Merged to `develop` via PR

## Deployment Flow

### Staging Deployment
```
1. Create feature branch from develop
2. Make changes and commit
3. Push to GitHub
4. Create PR to develop
5. PR checks run automatically
6. Review and approve PR
7. Merge to develop
8. CI/CD pipeline runs
9. Deploys to staging automatically
```

### Production Deployment
```
1. Create PR from develop to main
2. Review changes thoroughly
3. Approve PR
4. Merge to main
5. CI/CD pipeline runs
6. Deploys to production automatically
7. Slack notification sent (if configured)
```

## Monitoring Deployments

### GitHub Actions
- Go to **Actions** tab in GitHub
- View workflow runs
- Check logs for each job
- Download artifacts if needed

### Netlify
- Go to https://app.netlify.com
- Select your site
- View **Deploys** tab
- Check deploy logs

### Vercel
- Go to https://vercel.com/dashboard
- Select your project
- View **Deployments** tab
- Check deployment logs

## Rollback Procedures

### Frontend Rollback (Netlify)
1. Go to Netlify dashboard
2. Select your site
3. Go to **Deploys** tab
4. Find previous successful deploy
5. Click **Publish deploy**

### Backend Rollback (Vercel)
1. Go to Vercel dashboard
2. Select your project
3. Go to **Deployments** tab
4. Find previous successful deployment
5. Click **⋯** → **Promote to Production**

### Git Rollback
```bash
# Revert last commit
git revert HEAD

# Push to trigger new deployment
git push origin main
```

## Troubleshooting

### Build Failures

**Check logs:**
```bash
# GitHub Actions logs
# Go to Actions tab → Select workflow run → View logs

# Netlify logs
netlify logs

# Vercel logs
vercel logs
```

**Common issues:**
1. **Missing environment variables** - Check GitHub secrets
2. **Dependency issues** - Run `npm ci` locally
3. **Build errors** - Run `npm run build` locally
4. **Test failures** - Run `npm test` locally

### Deployment Failures

**Netlify:**
- Check build logs in Netlify dashboard
- Verify `netlify.toml` configuration
- Check environment variables

**Vercel:**
- Check deployment logs in Vercel dashboard
- Verify `vercel.json` configuration
- Check environment variables

### Security Scan Failures

**npm audit:**
```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

**Snyk:**
- Review Snyk dashboard
- Fix vulnerabilities
- Update dependencies

## Performance Optimization

### Frontend
- Code splitting enabled (Vite)
- Asset caching (31536000s = 1 year)
- Compression enabled (Netlify)
- CDN distribution (Netlify)

### Backend
- Function optimization (Vercel)
- Region: Mumbai (bom1) for India
- Memory: 1024MB
- Max duration: 10s

## Best Practices

1. **Always create PRs** - Never push directly to main/develop
2. **Write tests** - Maintain test coverage above 80%
3. **Review PRs thoroughly** - Check code quality and tests
4. **Monitor deployments** - Check logs after deployment
5. **Use semantic commits** - Follow conventional commits
6. **Keep dependencies updated** - Review Dependabot PRs
7. **Fix security issues** - Address vulnerabilities promptly
8. **Test locally first** - Run tests and build before pushing

## Maintenance

### Weekly Tasks
- Review Dependabot PRs
- Check security scan results
- Monitor deployment logs
- Review performance metrics

### Monthly Tasks
- Update dependencies manually if needed
- Review and optimize bundle size
- Check and update documentation
- Review and update CI/CD pipeline

## Support

- **GitHub Actions:** https://docs.github.com/en/actions
- **Netlify:** https://docs.netlify.com
- **Vercel:** https://vercel.com/docs
- **Dependabot:** https://docs.github.com/en/code-security/dependabot

---

**Last Updated:** December 9, 2025  
**Version:** 1.0.0
