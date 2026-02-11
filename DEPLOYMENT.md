# Deployment Guide

## Overview

This application consists of:
1. Frontend React app (static files)
2. Supabase backend (database + edge function)

## Prerequisites

- Supabase project (already configured)
- Anthropic API key
- Deployment platform account (Vercel, Netlify, etc.)

## Step 1: Configure Anthropic API Key

Before deploying, ensure the Anthropic API key is set in Supabase secrets:

```bash
supabase secrets set ANTHROPIC_API_KEY=your-api-key
```

Or use the Supabase Dashboard:
1. Go to Project Settings → Edge Functions
2. Add secret: `ANTHROPIC_API_KEY`

## Step 2: Build the Application

```bash
npm install
npm run build
```

This creates a `dist/` folder with static files.

## Step 3: Deploy to Vercel (Recommended)

### Using Vercel CLI

```bash
npm install -g vercel
vercel
```

### Using Vercel Dashboard

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

### Vercel Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

## Step 4: Deploy to Netlify

### Using Netlify CLI

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Using Netlify Dashboard

1. Go to https://app.netlify.com
2. Drag and drop the `dist/` folder
3. Or connect to GitHub for automatic deployments

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Step 5: Configure Environment Variables on Platform

Add these environment variables in your deployment platform:

```
VITE_SUPABASE_URL=https://iszggldcuhvftglmjjop.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Step 6: Test Deployment

1. Visit your deployed URL
2. Try creating a UI: "Create a login form"
3. Test iteration: "Add a submit button"
4. Test rollback: Use version history to restore previous version

## Alternative Platforms

### Render

```bash
# Static Site
- Build Command: npm run build
- Publish Directory: dist
```

### AWS Amplify

```bash
# Amplify Console
- Build Command: npm run build
- Output Directory: dist
```

### GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/repo-name",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

npm run deploy
```

## Monitoring

### Check Edge Function Logs

1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Select `generate-ui`
4. View logs and metrics

### Frontend Error Tracking

Consider adding error tracking:
- Sentry
- LogRocket
- Bugsnag

## Performance Optimization

### Enable Caching

Add cache headers for static assets:

```
# Vercel: vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Optimize Build

```bash
# Analyze bundle size
npm run build -- --mode production

# Optional: Use environment-specific builds
npm run build -- --mode staging
```

## Security Checklist

- [ ] Anthropic API key stored in Supabase secrets (not in code)
- [ ] CORS headers properly configured in Edge Function
- [ ] RLS policies enabled on all database tables
- [ ] Environment variables not committed to git
- [ ] HTTPS enabled on deployed URL

## Troubleshooting

### Edge Function Not Responding
- Check Supabase function logs
- Verify ANTHROPIC_API_KEY is set
- Check CORS configuration

### 404 on Routes
- Ensure SPA redirect is configured
- Check build output directory

### Environment Variables Not Working
- Prefix with `VITE_` for Vite access
- Rebuild after changing env vars
- Clear browser cache

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records

### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS

## Continuous Deployment

Connect to GitHub for automatic deployments:

1. Push to main branch triggers production deploy
2. Pull requests create preview deployments
3. Rollback to previous deployment if needed

## Cost Considerations

- Supabase: Free tier includes 500MB database + 2GB transfer
- Edge Functions: Free tier includes 500,000 invocations
- Anthropic: Pay per API call (~$0.015 per 1k tokens)
- Hosting: Most platforms offer free tier for static sites

## Scaling

For production use:
1. Implement rate limiting on Edge Function
2. Add authentication for multi-user support
3. Cache frequent component generations
4. Monitor Anthropic API usage and costs
5. Consider queueing system for high traffic
