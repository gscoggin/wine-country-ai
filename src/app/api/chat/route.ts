import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10 // Max 10 requests per minute per IP
const MAX_DAILY_REQUESTS = 100 // Max 100 requests per day per IP
const MAX_MESSAGE_LENGTH = 500 // Max characters per message

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetAt: number; dailyCount: number; dailyResetAt: number }>()

function getRateLimitKey(request: NextRequest): string {
  // Use IP address as key, fallback to a random identifier
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'anonymous'
  return `ratelimit:${ip}`
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number; error?: string } {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record) {
    // First request
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW,
      dailyCount: 1,
      dailyResetAt: now + 24 * 60 * 60 * 1000
    })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetAt: now + RATE_LIMIT_WINDOW }
  }

  // Check daily limit
  if (now > record.dailyResetAt) {
    // Reset daily counter
    record.dailyCount = 1
    record.dailyResetAt = now + 24 * 60 * 60 * 1000
  } else if (record.dailyCount >= MAX_DAILY_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.dailyResetAt,
      error: `Daily limit of ${MAX_DAILY_REQUESTS} requests exceeded. Please try again tomorrow.`
    }
  }

  // Check per-minute limit
  if (now > record.resetAt) {
    // Reset window
    record.count = 1
    record.resetAt = now + RATE_LIMIT_WINDOW
    record.dailyCount += 1
    rateLimitStore.set(key, record)
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetAt: record.resetAt }
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
      error: `Rate limit exceeded. Maximum ${MAX_REQUESTS_PER_WINDOW} requests per minute. Please wait and try again.`
    }
  }

  record.count += 1
  record.dailyCount += 1
  rateLimitStore.set(key, record)
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetAt: record.resetAt }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  const entriesToDelete: string[] = []
  rateLimitStore.forEach((record, key) => {
    if (now > record.dailyResetAt) {
      entriesToDelete.push(key)
    }
  })
  entriesToDelete.forEach(key => rateLimitStore.delete(key))
}, 60 * 60 * 1000) // Clean up every hour

const WINE_COUNTRY_SYSTEM_PROMPT = `You are a knowledgeable and friendly Wine Country AI assistant specializing in Northern California wine regions: Sonoma, Napa, and Mendocino. You have extensive knowledge about:

WINE REGIONS:
- Sonoma County: Known for diverse microclimates, family-owned wineries, and varietals like Pinot Noir, Chardonnay, Zinfandel
- Napa Valley: World-renowned for Cabernet Sauvignon, luxury experiences, and premium wineries
- Mendocino County: Organic and biodynamic wines, sustainable practices, and unique terroir

WINERIES:
- Top-rated wineries in each region
- Wine tasting experiences and tours
- Winery specialties and signature wines
- Booking information and pricing
- Family-friendly vs. adults-only venues

RESTAURANTS:
- Michelin-starred restaurants
- Farm-to-table dining
- Wine country cuisine
- Casual and fine dining options
- Restaurant-winery partnerships

HOTELS & ACCOMMODATIONS:
- Luxury resorts and spas
- Boutique hotels and B&Bs
- Wine country inns
- Glamping and unique stays
- Pet-friendly options

EXPERIENCES:
- Wine tours and tastings
- Cooking classes
- Hot air balloon rides
- Hiking and outdoor activities
- Art galleries and cultural sites
- Seasonal events and festivals

TRAVEL PLANNING:
- Best times to visit
- Transportation options
- Itinerary suggestions
- Budget considerations
- Group vs. solo travel

Always provide helpful, accurate, and personalized recommendations. If you don't know specific details, suggest how users can find more information. Be enthusiastic about wine country while being practical about logistics and costs.`

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first
    const rateLimitKey = getRateLimitKey(request)
    const rateCheck = checkRateLimit(rateLimitKey)

    if (!rateCheck.allowed) {
      const resetDate = new Date(rateCheck.resetAt)
      return NextResponse.json(
        {
          error: rateCheck.error || 'Rate limit exceeded',
          resetAt: resetDate.toISOString(),
          remaining: 0
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': resetDate.toISOString(),
            'Retry-After': Math.ceil((rateCheck.resetAt - Date.now()) / 1000).toString()
          }
        }
      )
    }

    const { message } = await request.json()

    // Validate message
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (typeof message !== 'string') {
      return NextResponse.json({ error: 'Message must be a string' }, { status: 400 })
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` },
        { status: 400 }
      )
    }

    if (message.trim().length < 2) {
      return NextResponse.json({ error: 'Message is too short' }, { status: 400 })
    }

    if (!openai) {
      return NextResponse.json({
        response: "I'm sorry, but the AI chat feature is currently unavailable. Please set up your OpenAI API key in the environment variables to enable this feature. In the meantime, you can explore our directory of wineries, restaurants, and hotels!"
      })
    }

    // Add timeout to prevent long-running requests
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: WINE_COUNTRY_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 800, // Reduced from 1000 to save costs
        temperature: 0.7,
      }, {
        signal: controller.signal as any
      })

      clearTimeout(timeoutId)

      const response = completion.choices[0]?.message?.content

      if (!response) {
        throw new Error('No response from OpenAI')
      }

      // Log usage for monitoring (in production, send to analytics)
      console.log('API Usage:', {
        tokens: completion.usage,
        timestamp: new Date().toISOString(),
        ip: rateLimitKey
      })

      return NextResponse.json(
        { response },
        {
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': rateCheck.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateCheck.resetAt).toISOString()
          }
        }
      )
    } catch (error: any) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again with a shorter message.' },
          { status: 408 }
        )
      }
      throw error
    }
  } catch (error: any) {
    console.error('Chat API error:', error)

    // Handle OpenAI specific errors
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'OpenAI API rate limit exceeded. Please try again later.' },
        { status: 503 }
      )
    }

    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'API authentication failed. Please contact support.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    )
  }
}