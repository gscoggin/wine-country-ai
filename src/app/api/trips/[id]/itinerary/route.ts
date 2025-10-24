import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

// POST add venue to trip itinerary
export async function POST(
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
    const trip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        itineraryItems: true
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    const { venueId, date, startTime, endTime, notes, status } = await request.json()

    // Validate required fields
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

    // Calculate order (add to end)
    const maxOrder = trip.itineraryItems.length > 0
      ? Math.max(...trip.itineraryItems.map(item => item.order))
      : -1

    // Create itinerary item
    const itineraryItem = await prisma.itineraryItem.create({
      data: {
        tripId: params.id,
        venueId,
        date: date ? new Date(date) : null,
        startTime,
        endTime,
        notes,
        status: status || 'PLANNED',
        order: maxOrder + 1
      },
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
      }
    })

    return NextResponse.json({ itineraryItem }, { status: 201 })
  } catch (error) {
    console.error('Add itinerary item error:', error)
    return NextResponse.json(
      { error: 'Failed to add venue to itinerary' },
      { status: 500 }
    )
  }
}

// DELETE remove venue from itinerary
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

    const searchParams = request.nextUrl.searchParams
    const itemId = searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Verify trip belongs to user and item exists
    const trip = await prisma.trip.findFirst({
      where: {
        id: params.id,
        userId: user.id,
        itineraryItems: {
          some: {
            id: itemId
          }
        }
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip or itinerary item not found' },
        { status: 404 }
      )
    }

    // Delete itinerary item
    await prisma.itineraryItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete itinerary item error:', error)
    return NextResponse.json(
      { error: 'Failed to remove venue from itinerary' },
      { status: 500 }
    )
  }
}
