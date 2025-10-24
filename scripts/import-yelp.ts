/**
 * Yelp Fusion API Data Import Script
 *
 * This script imports winery, restaurant, and hotel data from Yelp's free API
 * into our PostgreSQL database.
 *
 * Setup:
 * 1. Sign up for Yelp Fusion API: https://www.yelp.com/developers/v3/manage_app
 * 2. Add YELP_API_KEY to .env.local
 * 3. Run: npx tsx scripts/import-yelp.ts
 *
 * Free tier: 5,000 API calls/day (enough for initial import)
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const YELP_API_KEY = process.env.YELP_API_KEY
const YELP_API_BASE = 'https://api.yelp.com/v3'

interface YelpBusiness {
  id: string
  name: string
  image_url: string
  url: string
  review_count: number
  categories: Array<{ alias: string; title: string }>
  rating: number
  coordinates: { latitude: number; longitude: number }
  price?: string
  location: {
    address1: string
    city: string
    state: string
    zip_code: string
  }
  phone: string
  display_phone: string
}

interface YelpBusinessDetails extends YelpBusiness {
  photos: string[]
  hours?: Array<{
    open: Array<{
      day: number
      start: string
      end: string
    }>
  }>
}

// Search areas in wine country
const SEARCH_LOCATIONS = [
  { name: 'Napa', latitude: 38.2975, longitude: -122.2869 },
  { name: 'Sonoma', latitude: 38.2919, longitude: -122.4580 },
  { name: 'Healdsburg', latitude: 38.6102, longitude: -122.8694 },
  { name: 'St. Helena', latitude: 38.5052, longitude: -122.4703 },
  { name: 'Yountville', latitude: 38.4016, longitude: -122.3608 },
  { name: 'Calistoga', latitude: 38.5788, longitude: -122.5797 },
  { name: 'Mendocino', latitude: 39.3077, longitude: -123.7992 },
]

// Business categories to search
const CATEGORIES = {
  wineries: ['wineries', 'winetastingroom', 'wine_bars'],
  restaurants: ['restaurants', 'newamerican', 'french', 'italian'],
  hotels: ['hotels', 'bedbreakfast', 'resorts'],
}

async function searchYelp(
  term: string,
  location: { latitude: number; longitude: number },
  categories: string,
  limit = 50
): Promise<YelpBusiness[]> {
  if (!YELP_API_KEY) {
    throw new Error('YELP_API_KEY not found in environment variables')
  }

  const params = new URLSearchParams({
    term,
    latitude: location.latitude.toString(),
    longitude: location.longitude.toString(),
    categories,
    limit: limit.toString(),
    radius: '25000', // 25km radius
  })

  const response = await fetch(`${YELP_API_BASE}/businesses/search?${params}`, {
    headers: {
      Authorization: `Bearer ${YELP_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Yelp API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.businesses
}

async function getBusinessDetails(businessId: string): Promise<YelpBusinessDetails> {
  if (!YELP_API_KEY) {
    throw new Error('YELP_API_KEY not found in environment variables')
  }

  const response = await fetch(`${YELP_API_BASE}/businesses/${businessId}`, {
    headers: {
      Authorization: `Bearer ${YELP_API_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Yelp API error: ${response.statusText}`)
  }

  return response.json()
}

function mapPriceToLevel(price?: string): number {
  if (!price) return 2
  return price.length // $, $$, $$$, $$$$
}

function determineVenueType(categories: Array<{ alias: string }>): 'WINERY' | 'RESTAURANT' | 'HOTEL' {
  const aliases = categories.map(c => c.alias)

  if (aliases.some(a => ['wineries', 'winetastingroom', 'wine_bars'].includes(a))) {
    return 'WINERY'
  }
  if (aliases.some(a => ['hotels', 'bedbreakfast', 'resorts'].includes(a))) {
    return 'HOTEL'
  }
  return 'RESTAURANT'
}

async function importVenue(business: YelpBusinessDetails, regionName: string) {
  try {
    // Get or create region
    const region = await prisma.region.upsert({
      where: { slug: regionName.toLowerCase() },
      update: {},
      create: {
        name: regionName,
        slug: regionName.toLowerCase(),
        description: `${regionName} wine country region`,
        country: 'United States',
      },
    })

    // Create slug from name
    const slug = business.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if venue already exists
    const existing = await prisma.venue.findFirst({
      where: {
        OR: [
          { slug },
          { name: business.name },
        ],
      },
    })

    if (existing) {
      console.log(`⏭️  Skipping existing venue: ${business.name}`)
      return existing
    }

    // Extract categories/specialties
    const specialtyNames = business.categories.map(c => c.title)

    // Create venue
    const venue = await prisma.venue.create({
      data: {
        name: business.name,
        slug,
        type: determineVenueType(business.categories),
        regionId: region.id,
        address: `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`,
        phone: business.display_phone,
        website: business.url, // Yelp URL for now
        description: `${business.name} is a highly-rated venue in ${regionName} with ${business.review_count} reviews on Yelp.`,
        priceLevel: mapPriceToLevel(business.price),
        rating: business.rating,
        images: business.photos || [business.image_url],
        latitude: business.coordinates.latitude,
        longitude: business.coordinates.longitude,
        metadata: {
          yelpId: business.id,
          yelpUrl: business.url,
          reviewCount: business.review_count,
          categories: business.categories.map(c => c.title),
        },
      },
    })

    // Add specialties
    for (const specialtyName of specialtyNames) {
      // Determine category based on venue type and specialty name
      let category = 'other'
      if (venue.type === 'WINERY') {
        category = 'wine_type'
      } else if (venue.type === 'RESTAURANT') {
        category = 'cuisine'
      } else if (venue.type === 'HOTEL') {
        category = 'hotel_type'
      }

      const specialty = await prisma.specialty.upsert({
        where: { slug: specialtyName.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
        update: {},
        create: {
          name: specialtyName,
          slug: specialtyName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category,
        },
      })

      await prisma.venueSpecialty.create({
        data: {
          venueId: venue.id,
          specialtyId: specialty.id,
        },
      })
    }

    console.log(`✅ Imported: ${venue.name} (${venue.type})`)
    return venue
  } catch (error) {
    console.error(`❌ Error importing ${business.name}:`, error)
    throw error
  }
}

async function main() {
  console.log('🍷 Starting Yelp data import...\n')

  if (!YELP_API_KEY) {
    console.error('❌ YELP_API_KEY not found in environment variables')
    console.log('📝 Get your API key at: https://www.yelp.com/developers/v3/manage_app')
    console.log('📝 Add it to .env.local as: YELP_API_KEY=your_key_here')
    process.exit(1)
  }

  let totalImported = 0
  let totalSkipped = 0

  // Import wineries
  console.log('🍇 Importing wineries...')
  for (const location of SEARCH_LOCATIONS) {
    console.log(`\n📍 Searching ${location.name}...`)

    try {
      const businesses = await searchYelp(
        'wineries',
        location,
        CATEGORIES.wineries.join(','),
        50
      )

      console.log(`   Found ${businesses.length} wineries`)

      for (const business of businesses) {
        try {
          // Get full details including photos
          const details = await getBusinessDetails(business.id)
          await importVenue(details, location.name)
          totalImported++

          // Rate limiting: wait 200ms between requests (max 5/sec)
          await new Promise(resolve => setTimeout(resolve, 200))
        } catch (error) {
          if (error instanceof Error && error.message.includes('existing')) {
            totalSkipped++
          } else {
            console.error(`   Error with ${business.name}:`, error)
          }
        }
      }
    } catch (error) {
      console.error(`   Error searching ${location.name}:`, error)
    }
  }

  // Import restaurants
  console.log('\n\n🍽️  Importing restaurants...')
  for (const location of SEARCH_LOCATIONS) {
    console.log(`\n📍 Searching ${location.name}...`)

    try {
      const businesses = await searchYelp(
        'restaurants',
        location,
        CATEGORIES.restaurants.join(','),
        50
      )

      console.log(`   Found ${businesses.length} restaurants`)

      for (const business of businesses) {
        try {
          const details = await getBusinessDetails(business.id)
          await importVenue(details, location.name)
          totalImported++
          await new Promise(resolve => setTimeout(resolve, 200))
        } catch (error) {
          if (error instanceof Error && error.message.includes('existing')) {
            totalSkipped++
          } else {
            console.error(`   Error with ${business.name}:`, error)
          }
        }
      }
    } catch (error) {
      console.error(`   Error searching ${location.name}:`, error)
    }
  }

  // Import hotels
  console.log('\n\n🏨 Importing hotels...')
  for (const location of SEARCH_LOCATIONS) {
    console.log(`\n📍 Searching ${location.name}...`)

    try {
      const businesses = await searchYelp(
        'hotels',
        location,
        CATEGORIES.hotels.join(','),
        50
      )

      console.log(`   Found ${businesses.length} hotels`)

      for (const business of businesses) {
        try {
          const details = await getBusinessDetails(business.id)
          await importVenue(details, location.name)
          totalImported++
          await new Promise(resolve => setTimeout(resolve, 200))
        } catch (error) {
          if (error instanceof Error && error.message.includes('existing')) {
            totalSkipped++
          } else {
            console.error(`   Error with ${business.name}:`, error)
          }
        }
      }
    } catch (error) {
      console.error(`   Error searching ${location.name}:`, error)
    }
  }

  console.log('\n\n✨ Import complete!')
  console.log(`📊 Total imported: ${totalImported}`)
  console.log(`⏭️  Total skipped (existing): ${totalSkipped}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
