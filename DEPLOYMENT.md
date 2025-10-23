# Sip.AI Deployment Guide

This guide covers deploying Sip.AI to production with proper cost protection and CI/CD automation.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Vercel Deployment](#vercel-deployment)
4. [GitHub Actions CI/CD](#github-actions-cicd)
5. [Cost Protection](#cost-protection)
6. [Monitoring](#monitoring)

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- GitHub account
- Vercel account (free tier works)
- OpenAI API key

## Environment Variables

### Required Variables

Create these in your Vercel dashboard under Settings → Environment Variables:

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-key-here

# NextAuth Configuration (optional, for future authentication)
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-a-random-secret-here

# Environment
NODE_ENV=production
```

### Optional Rate Limiting Configuration

```bash
# Customize rate limits (defaults shown)
RATE_LIMIT_MAX_PER_MINUTE=10
RATE_LIMIT_MAX_PER_DAY=100
RATE_LIMIT_MAX_MESSAGE_LENGTH=500
```

## Vercel Deployment

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration

3. **Configure Environment Variables:**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add all required variables listed above
   - Make sure to add them for Production, Preview, and Development environments

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - You'll get a production URL like `sip-ai.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set environment variables:**
   ```bash
   vercel env add OPENAI_API_KEY production
   # Follow prompts to add your API key
   ```

## GitHub Actions CI/CD

The repository includes a comprehensive CI/CD pipeline that runs automatically on pushes and pull requests.

### Required GitHub Secrets

Add these in your GitHub repository under Settings → Secrets and variables → Actions:

```
VERCEL_TOKEN         - Get from Vercel → Settings → Tokens
VERCEL_ORG_ID        - Get from Vercel → Settings → General
VERCEL_PROJECT_ID    - Get from Vercel → Project Settings → General
OPENAI_API_KEY       - Your OpenAI API key (for build)
```

### Pipeline Stages

1. **Lint & Type Check** - Ensures code quality
2. **Build** - Verifies production build works
3. **Test** - Runs test suite
4. **Security Audit** - Checks for vulnerabilities
5. **Deploy** - Deploys to Vercel (production or preview)

### Manual Deployment

If you need to trigger deployment manually:

```bash
# From your local machine
git push origin main --force-with-lease
```

## Cost Protection

### Built-in Rate Limiting

The API includes multiple layers of protection:

1. **Per-IP Rate Limiting:**
   - 10 requests per minute per IP
   - 100 requests per day per IP
   - Configurable via environment variables

2. **Message Validation:**
   - Maximum 500 characters per message
   - Minimum 2 characters per message
   - Only string inputs accepted

3. **Token Optimization:**
   - Reduced max_tokens from 1000 to 800
   - 30-second timeout on API calls
   - Uses cost-effective gpt-4o-mini model

4. **Usage Logging:**
   - All API calls logged with token usage
   - Monitor in Vercel logs or set up analytics

### Monitoring API Usage

1. **Vercel Logs:**
   ```bash
   vercel logs --follow
   ```

2. **OpenAI Dashboard:**
   - Go to [platform.openai.com/usage](https://platform.openai.com/usage)
   - Monitor daily usage and costs
   - Set up billing alerts

3. **Set Budget Alerts:**
   - In OpenAI dashboard, go to Settings → Limits
   - Set monthly budget limit
   - Enable email notifications

### Recommended Limits for MVP

For initial launch, consider these conservative limits:

```bash
# In OpenAI Dashboard
Monthly Budget: $10
Hard Limit: $20
Alert Threshold: $5

# In .env.local or Vercel
RATE_LIMIT_MAX_PER_MINUTE=5
RATE_LIMIT_MAX_PER_DAY=50
RATE_LIMIT_MAX_MESSAGE_LENGTH=300
```

### Estimated Costs

With gpt-4o-mini pricing:
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens

Typical conversation:
- Input: ~200 tokens
- Output: ~400 tokens
- Cost: ~$0.0003 per conversation

With 100 requests/day limit per IP:
- Max daily cost (worst case, 1000 unique IPs): ~$30/day
- Expected realistic daily cost: $1-5/day

## Monitoring

### Real-time Monitoring

1. **Vercel Analytics:**
   - Enable in Vercel dashboard
   - Track page views, performance
   - Free tier includes 100k events/month

2. **Application Logs:**
   ```bash
   vercel logs
   ```

3. **API Monitoring:**
   - Check for rate limit violations
   - Monitor OpenAI token usage
   - Track error rates

### Health Checks

Add to your monitoring:
- API endpoint response times
- Error rates by endpoint
- Rate limit hit frequency
- Daily active users

## Troubleshooting

### Build Failures

```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Lint issues
npm run lint
```

### API Issues

```bash
# Test API locally
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Test message"}'

# Check rate limiting
for i in {1..12}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"Test '$i'"}'
done
```

### Environment Variable Issues

1. Verify variables are set in Vercel
2. Check they're applied to correct environments
3. Redeploy after changing variables

## Security Best Practices

1. **Never commit .env files:**
   - `.env.local` is gitignored
   - Use `.env.example` as template

2. **Rotate API keys regularly:**
   - OpenAI dashboard → Revoke old keys
   - Update in Vercel environment variables

3. **Monitor for abuse:**
   - Check Vercel logs daily
   - Set up alerts for unusual patterns

4. **Keep dependencies updated:**
   ```bash
   npm audit
   npm update
   ```

## Support

For issues:
1. Check Vercel deployment logs
2. Review GitHub Actions logs
3. Monitor OpenAI usage dashboard
4. Check rate limit headers in API responses

## Next Steps

After deployment:
1. Set up custom domain in Vercel
2. Enable Vercel Analytics
3. Configure OpenAI budget alerts
4. Monitor initial user behavior
5. Adjust rate limits based on usage patterns
