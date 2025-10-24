import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

// GET all trips for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch user's trips
    const trips = await prisma.trip.findMany({
      where: { userId: user.id },
      include: {
        itineraryItems: {
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
            order: 'asc'
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    // Transform trips to match frontend format
    const transformedTrips = trips.map(trip => ({
      id: trip.id,
      name: trip.name,
      description: trip.description,
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: trip.status,
      isPublic: trip.isPublic,
      metadata: trip.metadata,
      createdAt: trip.createdAt,
      updatedAt: trip.updatedAt,
      itinerary: trip.itineraryItems.map(item => ({
        id: item.id,
        venueId: item.venueId,
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        notes: item.notes,
        status: item.status,
        order: item.order,
        venue: {
          id: item.venue.id,
          name: item.venue.name,
          slug: item.venue.slug,
          type: item.venue.type,
          region: item.venue.region.name,
          address: item.venue.address,
          phone: item.venue.phone,
          website: item.venue.website,
          description: item.venue.description,
          priceLevel: item.venue.priceLevel,
          rating: item.venue.rating,
          images: item.venue.images,
          amenities: item.venue.amenities.map(a => a.amenity.name),
          specialties: item.venue.specialties.map(s => s.specialty.name)
        }
      }))
    }))

    return NextResponse.json({ trips: transformedTrips })
  } catch (error) {
    console.error('Trips API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}

// POST create a new trip
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { name, description, startDate, endDate, isPublic, metadata } = await request.json()

    // Validate required fields
    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Name, start date, and end date are required' },
        { status: 400 }
      )
    }

    // Create trip
    const trip = await prisma.trip.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'PLANNING',
        isPublic: isPublic || false,
        metadata: metadata || {},
        userId: user.id
      },
      include: {
        itineraryItems: {
          include: {
            venue: true
          }
        }
      }
    })

    return NextResponse.json({ trip }, { status: 201 })
  } catch (error) {
    console.error('Create trip error:', error)
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    )
  }
}
