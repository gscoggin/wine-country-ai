import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const venue = await prisma.venue.findUnique({
      where: { slug },
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
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    })

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      )
    }

    // Transform data to match frontend format
    const transformedVenue = {
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
      reviews: venue.reviews.map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        visitDate: r.visitDate,
        createdAt: r.createdAt,
        user: r.user
      })),
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
    }

    return NextResponse.json({ venue: transformedVenue })
  } catch (error) {
    console.error('Venue API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch venue' },
      { status: 500 }
    )
  }
}
