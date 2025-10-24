import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    // Extract query parameters
    const query = searchParams.get('query') || ''
    const region = searchParams.get('region') || ''
    const type = searchParams.get('type') || '' // WINERY, RESTAURANT, HOTEL, or empty for all
    const priceLevel = searchParams.get('priceLevel') ? parseInt(searchParams.get('priceLevel')!) : null
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : null
    const amenities = searchParams.get('amenities')?.split(',').filter(Boolean) || []
    const specialties = searchParams.get('specialties')?.split(',').filter(Boolean) || []
    const sortBy = searchParams.get('sortBy') || 'rating' // rating, name, priceLevel
    const sortOrder = searchParams.get('sortOrder') || 'desc' // asc or desc
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 100
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0

    // Build where clause
    const where: any = {}

    // Filter by search query (name or description)
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Filter by region
    if (region) {
      where.region = {
        name: { contains: region, mode: 'insensitive' }
      }
    }

    // Filter by type
    if (type && ['WINERY', 'RESTAURANT', 'HOTEL'].includes(type.toUpperCase())) {
      where.type = type.toUpperCase()
    }

    // Filter by price level
    if (priceLevel !== null) {
      where.priceLevel = priceLevel
    }

    // Filter by minimum rating
    if (minRating !== null) {
      where.rating = { gte: minRating }
    }

    // Filter by amenities
    if (amenities.length > 0) {
      where.amenities = {
        some: {
          amenity: {
            name: { in: amenities, mode: 'insensitive' }
          }
        }
      }
    }

    // Filter by specialties
    if (specialties.length > 0) {
      where.specialties = {
        some: {
          specialty: {
            name: { in: specialties, mode: 'insensitive' }
          }
        }
      }
    }

    // Build order by clause
    const orderBy: any = {}
    if (sortBy === 'name') {
      orderBy.name = sortOrder
    } else if (sortBy === 'priceLevel') {
      orderBy.priceLevel = sortOrder
    } else {
      orderBy.rating = sortOrder
    }

    // Fetch venues with related data
    const venues = await prisma.venue.findMany({
      where,
      include: {
        region: true,
        amenities: {
          include: {
            amenity: true
          }
        },
        specialties: {
          include: {
            specialty: true
          }
        }
      },
      orderBy,
      skip: offset,
      take: limit
    })

    // Get total count for pagination
    const total = await prisma.venue.count({ where })

    // Transform data to match frontend format
    const transformedVenues = venues.map(venue => ({
      id: venue.id,
      name: venue.name,
      slug: venue.slug,
      type: venue.type,
      region: venue.region.name,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      zipCode: venue.zipCode,
      coordinates: venue.latitude && venue.longitude ? {
        lat: venue.latitude,
        lng: venue.longitude
      } : null,
      phone: venue.phone,
      website: venue.website,
      description: venue.description,
      priceLevel: venue.priceLevel,
      rating: venue.rating,
      images: venue.images,
      amenities: venue.amenities.map(a => a.amenity.name),
      specialties: venue.specialties.map(s => s.specialty.name),
      metadata: venue.metadata,
      // Type-specific fields from metadata
      ...(venue.type === 'WINERY' && {
        tastingFee: (venue.metadata as any)?.tastingFee,
        reservationRequired: (venue.metadata as any)?.reservationRequired,
        familyFriendly: (venue.metadata as any)?.familyFriendly
      }),
      ...(venue.type === 'RESTAURANT' && {
        cuisine: (venue.metadata as any)?.cuisine,
        michelinStars: (venue.metadata as any)?.michelinStars,
        wineList: (venue.metadata as any)?.wineList,
        outdoorSeating: (venue.metadata as any)?.outdoorSeating
      }),
      ...(venue.type === 'HOTEL' && {
        hotelType: (venue.metadata as any)?.type,
        spa: (venue.metadata as any)?.spa,
        petFriendly: (venue.metadata as any)?.petFriendly
      })
    }))

    return NextResponse.json({
      venues: transformedVenues,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Venues API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch venues' },
      { status: 500 }
    )
  }
}
