/**
 * Mendocino-Focused Import Script
 *
 * This script imports additional venues specifically from Mendocino County
 * to ensure better coverage of this region.
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

// Mendocino locations to search
const MENDOCINO_LOCATIONS = [
  { name: 'Mendocino', latitude: 39.3077, longitude: -123.7992 },
  { name: 'Fort Bragg', latitude: 39.4457, longitude: -123.8053 },
  { name: 'Ukiah', latitude: 39.1502, longitude: -123.2078 },
  { name: 'Willits', latitude: 39.4096, longitude: -123.3558 },
  { name: 'Anderson Valley', latitude: 39.0073, longitude: -123.3700 },
  { name: 'Boonville', latitude: 39.0096, longitude: -123.3661 },
  { name: 'Philo', latitude: 39.0596, longitude: -123.4464 },
  { name: 'Hopland', latitude: 38.9752, longitude: -123.1136 },
]

// Categories to search
const CATEGORIES = {
  wineries: ['wineries', 'winetastingroom', 'wine_bars'],
  restaurants: ['restaurants', 'newamerican', 'french', 'italian', 'seafood', 'farmersmarket'],
  hotels: ['hotels', 'bedbreakfast', 'resorts', 'inns'],
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
    radius: '40000', // 40km radius for better coverage
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
  return price.length
}

function determineVenueType(categories: Array<{ alias: string }>): 'WINERY' | 'RESTAURANT' | 'HOTEL' {
  const aliases = categories.map(c => c.alias)

  if (aliases.some(a => ['wineries', 'winetastingroom', 'wine_bars'].includes(a))) {
    return 'WINERY'
  }
  if (aliases.some(a => ['hotels', 'bedbreakfast', 'resorts', 'inns'].includes(a))) {
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

    // Determine venue type
    const venueType = determineVenueType(business.categories)

    // Extract categories/specialties
    const specialtyNames = business.categories.map(c => c.title)

    // Create venue
    const venue = await prisma.venue.create({
      data: {
        name: business.name,
        slug,
        type: venueType,
        regionId: region.id,
        address: `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`,
        phone: business.display_phone,
        website: business.url,
        description: `${business.name} is a highly-rated ${venueType.toLowerCase()} in ${regionName} with ${business.review_count} reviews on Yelp.`,
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
      // Determine category based on venue type
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
  console.log('🌲 Starting Mendocino County focused import...\n')

  if (!YELP_API_KEY) {
    console.error('❌ YELP_API_KEY not found in environment variables')
    process.exit(1)
  }

  let totalImported = 0
  let totalSkipped = 0

  // Import wineries
  console.log('🍇 Importing Mendocino wineries...')
  for (const location of MENDOCINO_LOCATIONS) {
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
          const details = await getBusinessDetails(business.id)
          await importVenue(details, 'Mendocino')
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

  // Import restaurants
  console.log('\n\n🍽️  Importing Mendocino restaurants...')
  for (const location of MENDOCINO_LOCATIONS) {
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
          await importVenue(details, 'Mendocino')
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
  console.log('\n\n🏨 Importing Mendocino hotels...')
  for (const location of MENDOCINO_LOCATIONS) {
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
          await importVenue(details, 'Mendocino')
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

  console.log('\n\n✨ Mendocino import complete!')
  console.log(`📊 Total imported: ${totalImported}`)
  console.log(`⏭️  Total skipped (existing): ${totalSkipped}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
