import { PrismaClient } from '@prisma/client'
import { wineries } from '../src/data/wineries'
import { restaurants } from '../src/data/restaurants'
import { hotels } from '../src/data/hotels'

const prisma = new PrismaClient()

// Helper function to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

// Helper function to parse address
function parseAddress(address: string) {
  if (!address) return { city: null, state: null, zipCode: null }

  // Try to extract city, state, zip from address
  // Format examples: "1240 Duhig Rd, Napa, CA 94559"
  const parts = address.split(',').map(s => s.trim())

  let city = null
  let state = null
  let zipCode = null

  if (parts.length >= 2) {
    city = parts[parts.length - 2]
  }

  if (parts.length >= 3) {
    const lastPart = parts[parts.length - 1]
    const stateZipMatch = lastPart.match(/([A-Z]{2})\s+(\d{5})/)
    if (stateZipMatch) {
      state = stateZipMatch[1]
      zipCode = stateZipMatch[2]
    }
  }

  return { city, state, zipCode }
}

// Helper to convert price range to level
function priceRangeToPriceLevel(priceRange: string): number {
  if (!priceRange) return 2
  const map: Record<string, number> = {
    '$': 1,
    '$$': 2,
    '$$$': 3,
    '$$$$': 4
  }
  return map[priceRange] || 2
}

// Helper to ensure specialty exists
async function ensureSpecialty(name: string, category: string) {
  const slug = createSlug(name)

  // Try to find existing specialty by name first
  const existing = await prisma.specialty.findUnique({ where: { name } })
  if (existing) return existing

  return await prisma.specialty.create({
    data: {
      name,
      slug,
      category
    }
  })
}

// Helper to ensure amenity exists
async function ensureAmenity(name: string, category = 'services') {
  const slug = createSlug(name)

  // Try to find existing amenity by name first
  const existing = await prisma.amenity.findUnique({ where: { name } })
  if (existing) return existing

  return await prisma.amenity.create({
    data: {
      name,
      slug,
      category,
      icon: 'check'
    }
  })
}

async function migrateWineries() {
  console.log('\n🍷 Migrating wineries...')

  let imported = 0
  let skipped = 0
  let errors = 0

  for (const winery of wineries) {
    try {
      const slug = createSlug(winery.name)

      // Check if already exists
      const existing = await prisma.venue.findUnique({ where: { slug } })
      if (existing) {
        skipped++
        continue
      }

      // Get region
      const region = await prisma.region.findFirst({
        where: { name: { contains: winery.region, mode: 'insensitive' } }
      })

      if (!region) {
        console.warn(`  ⚠️  Region not found for ${winery.name}: ${winery.region}`)
        errors++
        continue
      }

      // Parse address
      const { city, state, zipCode } = parseAddress(winery.address)

      // Create venue
      const venue = await prisma.venue.create({
        data: {
          name: winery.name,
          slug,
          type: 'WINERY',
          regionId: region.id,
          address: winery.address,
          city,
          state,
          zipCode,
          latitude: winery.coordinates?.lat,
          longitude: winery.coordinates?.lng,
          phone: winery.phone,
          website: winery.website,
          description: winery.description,
          priceLevel: winery.tastingFee ? Math.ceil(winery.tastingFee / 25) : 2,
          rating: winery.rating || 0,
          images: winery.imageUrl ? [winery.imageUrl] : [],
          metadata: {
            tastingFee: winery.tastingFee,
            reservationRequired: winery.reservationRequired,
            familyFriendly: winery.familyFriendly,
          }
        }
      })

      // Add specialties (wine types)
      if (winery.specialties && Array.isArray(winery.specialties)) {
        for (const specialtyName of winery.specialties) {
          const specialty = await ensureSpecialty(specialtyName, 'wine_type')
          await prisma.venueSpecialty.create({
            data: {
              venueId: venue.id,
              specialtyId: specialty.id
            }
          })
        }
      }

      // Add common winery amenities
      const amenities = []
      if (winery.familyFriendly) amenities.push('Pet Friendly')
      amenities.push('Tasting Room')
      amenities.push('Parking Available')

      for (const amenityName of amenities) {
        const amenity = await ensureAmenity(amenityName)
        await prisma.venueAmenity.create({
          data: {
            venueId: venue.id,
            amenityId: amenity.id
          }
        })
      }

      imported++
      if (imported % 50 === 0) {
        console.log(`  ✅ Imported ${imported} wineries...`)
      }
    } catch (error: any) {
      console.error(`  ❌ Error importing ${winery.name}:`, error.message)
      errors++
    }
  }

  console.log(`\n✅ Wineries migration complete:`)
  console.log(`   - Imported: ${imported}`)
  console.log(`   - Skipped (duplicates): ${skipped}`)
  console.log(`   - Errors: ${errors}`)

  return { imported, skipped, errors }
}

async function migrateRestaurants() {
  console.log('\n🍽️  Migrating restaurants...')

  let imported = 0
  let skipped = 0
  let errors = 0

  for (const restaurant of restaurants) {
    try {
      const slug = createSlug(restaurant.name)

      // Check if already exists
      const existing = await prisma.venue.findUnique({ where: { slug } })
      if (existing) {
        skipped++
        continue
      }

      // Get region
      const region = await prisma.region.findFirst({
        where: { name: { contains: restaurant.region, mode: 'insensitive' } }
      })

      if (!region) {
        console.warn(`  ⚠️  Region not found for ${restaurant.name}: ${restaurant.region}`)
        errors++
        continue
      }

      // Parse address
      const { city, state, zipCode } = parseAddress(restaurant.address)

      // Create venue
      const venue = await prisma.venue.create({
        data: {
          name: restaurant.name,
          slug,
          type: 'RESTAURANT',
          regionId: region.id,
          address: restaurant.address,
          city,
          state,
          zipCode,
          latitude: restaurant.coordinates?.lat,
          longitude: restaurant.coordinates?.lng,
          phone: restaurant.phone,
          website: restaurant.website,
          description: restaurant.description,
          priceLevel: priceRangeToPriceLevel(restaurant.priceRange),
          rating: restaurant.rating || 0,
          images: restaurant.imageUrl ? [restaurant.imageUrl] : [],
          metadata: {
            cuisine: restaurant.cuisine,
            michelinStars: restaurant.michelinStars,
            wineList: restaurant.wineList,
            outdoorSeating: restaurant.outdoorSeating,
          }
        }
      })

      // Add cuisine specialty
      if (restaurant.cuisine) {
        const specialty = await ensureSpecialty(restaurant.cuisine, 'cuisine')
        await prisma.venueSpecialty.create({
          data: {
            venueId: venue.id,
            specialtyId: specialty.id
          }
        })
      }

      // Add amenities
      const amenities = []
      if (restaurant.outdoorSeating) amenities.push('Outdoor Seating')
      if (restaurant.wineList) amenities.push('Wine Club')
      amenities.push('Parking Available')

      for (const amenityName of amenities) {
        const amenity = await ensureAmenity(amenityName)
        await prisma.venueAmenity.create({
          data: {
            venueId: venue.id,
            amenityId: amenity.id
          }
        })
      }

      imported++
      if (imported % 20 === 0) {
        console.log(`  ✅ Imported ${imported} restaurants...`)
      }
    } catch (error: any) {
      console.error(`  ❌ Error importing ${restaurant.name}:`, error.message)
      errors++
    }
  }

  console.log(`\n✅ Restaurants migration complete:`)
  console.log(`   - Imported: ${imported}`)
  console.log(`   - Skipped (duplicates): ${skipped}`)
  console.log(`   - Errors: ${errors}`)

  return { imported, skipped, errors }
}

async function migrateHotels() {
  console.log('\n🏨 Migrating hotels...')

  let imported = 0
  let skipped = 0
  let errors = 0

  for (const hotel of hotels) {
    try {
      const slug = createSlug(hotel.name)

      // Check if already exists
      const existing = await prisma.venue.findUnique({ where: { slug } })
      if (existing) {
        skipped++
        continue
      }

      // Get region
      const region = await prisma.region.findFirst({
        where: { name: { contains: hotel.region, mode: 'insensitive' } }
      })

      if (!region) {
        console.warn(`  ⚠️  Region not found for ${hotel.name}: ${hotel.region}`)
        errors++
        continue
      }

      // Parse address
      const { city, state, zipCode } = parseAddress(hotel.address)

      // Create venue
      const venue = await prisma.venue.create({
        data: {
          name: hotel.name,
          slug,
          type: 'HOTEL',
          regionId: region.id,
          address: hotel.address,
          city,
          state,
          zipCode,
          latitude: hotel.coordinates?.lat,
          longitude: hotel.coordinates?.lng,
          phone: hotel.phone,
          website: hotel.website,
          description: hotel.description,
          priceLevel: priceRangeToPriceLevel(hotel.priceRange),
          rating: hotel.rating || 0,
          images: hotel.imageUrl ? [hotel.imageUrl] : [],
          metadata: {
            type: hotel.type,
            spa: hotel.spa,
            petFriendly: hotel.petFriendly,
            amenities: hotel.amenities,
          }
        }
      })

      // Add hotel type specialty
      if (hotel.type) {
        const typeMap: Record<string, string> = {
          'Luxury': 'Luxury Resort',
          'Resort': 'Luxury Resort',
          'B&B': 'Bed & Breakfast',
          'Inn': 'Inn',
          'Boutique': 'Boutique Hotel'
        }
        const specialtyName = typeMap[hotel.type] || hotel.type
        const specialty = await ensureSpecialty(specialtyName, 'hotel_type')
        await prisma.venueSpecialty.create({
          data: {
            venueId: venue.id,
            specialtyId: specialty.id
          }
        })
      }

      // Add amenities
      const amenityMap: Record<string, string> = {
        'Spa': 'Spa Services',
        'Pool': 'Pool',
        'Restaurant': 'Restaurant on Site',
        'Wine Tasting': 'Wine Club',
        'Fitness Center': 'Fitness Center',
        'Concierge': 'Concierge',
        'Pet Friendly': 'Pet Friendly',
      }

      if (hotel.amenities && Array.isArray(hotel.amenities)) {
        for (const amenityName of hotel.amenities) {
          const mappedName = amenityMap[amenityName] || amenityName
          const amenity = await ensureAmenity(mappedName, 'facilities')
          await prisma.venueAmenity.create({
            data: {
              venueId: venue.id,
              amenityId: amenity.id
            }
          })
        }
      }

      // Always add parking and Wi-Fi
      const defaultAmenities = ['Parking Available', 'Wi-Fi']
      for (const amenityName of defaultAmenities) {
        const amenity = await ensureAmenity(amenityName)
        await prisma.venueAmenity.create({
          data: {
            venueId: venue.id,
            amenityId: amenity.id
          }
        })
      }

      imported++
      if (imported % 10 === 0) {
        console.log(`  ✅ Imported ${imported} hotels...`)
      }
    } catch (error: any) {
      console.error(`  ❌ Error importing ${hotel.name}:`, error.message)
      errors++
    }
  }

  console.log(`\n✅ Hotels migration complete:`)
  console.log(`   - Imported: ${imported}`)
  console.log(`   - Skipped (duplicates): ${skipped}`)
  console.log(`   - Errors: ${errors}`)

  return { imported, skipped, errors }
}

async function main() {
  console.log('🚀 Starting migration of static data to database...\n')
  console.log('This will import all wineries, restaurants, and hotels from your static data files.')
  console.log('Existing venues will be skipped to avoid duplicates.\n')

  try {
    // Run migrations
    const wineryResults = await migrateWineries()
    const restaurantResults = await migrateRestaurants()
    const hotelResults = await migrateHotels()

    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 MIGRATION SUMMARY')
    console.log('='.repeat(50))
    console.log('\nWineries:')
    console.log(`  ✅ Imported: ${wineryResults.imported}`)
    console.log(`  ⏭️  Skipped: ${wineryResults.skipped}`)
    console.log(`  ❌ Errors: ${wineryResults.errors}`)
    console.log('\nRestaurants:')
    console.log(`  ✅ Imported: ${restaurantResults.imported}`)
    console.log(`  ⏭️  Skipped: ${restaurantResults.skipped}`)
    console.log(`  ❌ Errors: ${restaurantResults.errors}`)
    console.log('\nHotels:')
    console.log(`  ✅ Imported: ${hotelResults.imported}`)
    console.log(`  ⏭️  Skipped: ${hotelResults.skipped}`)
    console.log(`  ❌ Errors: ${hotelResults.errors}`)
    console.log('\nTotal:')
    console.log(`  ✅ Imported: ${wineryResults.imported + restaurantResults.imported + hotelResults.imported}`)
    console.log(`  ⏭️  Skipped: ${wineryResults.skipped + restaurantResults.skipped + hotelResults.skipped}`)
    console.log(`  ❌ Errors: ${wineryResults.errors + restaurantResults.errors + hotelResults.errors}`)
    console.log('\n✨ Migration complete!')
    console.log('\n💡 Next steps:')
    console.log('  1. Open Prisma Studio: npm run db:studio')
    console.log('  2. Verify your data looks correct')
    console.log('  3. Test the app: npm run dev')

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
