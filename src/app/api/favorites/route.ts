import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

// GET all favorites for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        venue: {
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
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to match frontend format
    const transformedFavorites = favorites.map(fav => ({
      id: fav.id,
      venueId: fav.venueId,
      notes: fav.notes,
      createdAt: fav.createdAt,
      venue: {
        id: fav.venue.id,
        name: fav.venue.name,
        slug: fav.venue.slug,
        type: fav.venue.type,
        region: fav.venue.region.name,
        address: fav.venue.address,
        phone: fav.venue.phone,
        website: fav.venue.website,
        description: fav.venue.description,
        priceLevel: fav.venue.priceLevel,
        rating: fav.venue.rating,
        images: fav.venue.images,
        amenities: fav.venue.amenities.map(a => a.amenity.name),
        specialties: fav.venue.specialties.map(s => s.specialty.name)
      }
    }))

    return NextResponse.json({ favorites: transformedFavorites })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
}

// POST add venue to favorites
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { venueId, notes } = await request.json()

    if (!venueId) {
      return NextResponse.json(
        { error: 'Venue ID is required' },
        { status: 400 }
      )
    }

    // Verify venue exists
    const venue = await prisma.venue.findUnique({
      where: { id: venueId }
    })

    if (!venue) {
      return NextResponse.json(
        { error: 'Venue not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_venueId: {
          userId: user.id,
          venueId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Venue already in favorites' },
        { status: 400 }
      )
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        venueId,
        notes
      },
      include: {
        venue: {
          include: {
            region: true
          }
        }
      }
    })

    return NextResponse.json({ favorite }, { status: 201 })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
}

// DELETE remove venue from favorites
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const venueId = searchParams.get('venueId')

    if (!venueId) {
      return NextResponse.json(
        { error: 'Venue ID is required' },
        { status: 400 }
      )
    }

    // Delete favorite
    const favorite = await prisma.favorite.deleteMany({
      where: {
        userId: user.id,
        venueId
      }
    })

    if (favorite.count === 0) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete favorite error:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
}
