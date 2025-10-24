import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

// GET single trip
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const trip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
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
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    // Transform to match frontend format
    const transformedTrip = {
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
    }

    return NextResponse.json({ trip: transformedTrip })
  } catch (error) {
    console.error('Get trip error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    )
  }
}

// PATCH update trip
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify trip belongs to user
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    const { name, description, startDate, endDate, status, isPublic, metadata } = await request.json()

    // Update trip
    const trip = await prisma.trip.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(status && { status }),
        ...(isPublic !== undefined && { isPublic }),
        ...(metadata && { metadata })
      },
      include: {
        itineraryItems: {
          include: {
            venue: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Update trip error:', error)
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    )
  }
}

// DELETE trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify trip belongs to user
    const existingTrip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingTrip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    // Delete trip (itinerary items will cascade delete)
    await prisma.trip.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete trip error:', error)
    return NextResponse.json(
      { error: 'Failed to delete trip' },
      { status: 500 }
    )
  }
}
