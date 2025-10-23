import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

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
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!openai) {
      return NextResponse.json({ 
        response: "I'm sorry, but the AI chat feature is currently unavailable. Please set up your OpenAI API key in the environment variables to enable this feature. In the meantime, you can explore our directory of wineries, restaurants, and hotels!"
      })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
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
      max_tokens: 1000,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response from OpenAI')
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    )
  }
}