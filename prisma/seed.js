const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...\n')

  // ============================================
  // 1. CREATE REGIONS
  // ============================================
  console.log('📍 Creating regions...')

  const napa = await prisma.region.upsert({
    where: { slug: 'napa' },
    update: {},
    create: {
      name: 'Napa Valley',
      slug: 'napa',
      country: 'USA',
      state: 'California',
      description: 'World-renowned wine region known for Cabernet Sauvignon and luxury experiences.',
      image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200',
      featured: true,
      latitude: 38.5025,
      longitude: -122.3350,
      metaTitle: 'Napa Valley Wine Country | Sip.AI',
      metaDescription: 'Explore 400+ wineries in Napa Valley, from boutique vineyards to world-class estates.'
    }
  })

  const sonoma = await prisma.region.upsert({
    where: { slug: 'sonoma' },
    update: {},
    create: {
      name: 'Sonoma County',
      slug: 'sonoma',
      country: 'USA',
      state: 'California',
      description: 'Diverse wine region with 18 AVAs, known for Pinot Noir, Chardonnay, and laid-back charm.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200',
      featured: true,
      latitude: 38.2919,
      longitude: -122.4580,
      metaTitle: 'Sonoma County Wine Country | Sip.AI',
      metaDescription: 'Discover 425+ wineries across Sonoma\'s diverse wine regions and microclimates.'
    }
  })

  const mendocino = await prisma.region.upsert({
    where: { slug: 'mendocino' },
    update: {},
    create: {
      name: 'Mendocino County',
      slug: 'mendocino',
      country: 'USA',
      state: 'California',
      description: 'Rugged coastline and Anderson Valley, home to exceptional Pinot Noir and sparkling wines.',
      image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=1200',
      featured: true,
      latitude: 39.3073,
      longitude: -123.7991,
      metaTitle: 'Mendocino Wine Country | Sip.AI',
      metaDescription: 'Experience 100+ boutique wineries in Mendocino\'s cool-climate wine regions.'
    }
  })

  console.log('✅ Created 3 regions\n')

  // ============================================
  // 2. CREATE AMENITIES
  // ============================================
  console.log('🏷️  Creating amenities...')

  const amenities = [
    // Accessibility
    { name: 'Wheelchair Accessible', slug: 'wheelchair-accessible', category: 'accessibility', icon: 'wheelchair' },
    { name: 'Parking Available', slug: 'parking', category: 'accessibility', icon: 'parking' },
    { name: 'Pet Friendly', slug: 'pet-friendly', category: 'accessibility', icon: 'dog' },

    // Services
    { name: 'Wi-Fi', slug: 'wifi', category: 'services', icon: 'wifi' },
    { name: 'Outdoor Seating', slug: 'outdoor-seating', category: 'services', icon: 'sun' },
    { name: 'Private Events', slug: 'private-events', category: 'services', icon: 'calendar' },
    { name: 'Wine Club', slug: 'wine-club', category: 'services', icon: 'wine' },
    { name: 'Tasting Room', slug: 'tasting-room', category: 'services', icon: 'glass' },

    // Facilities
    { name: 'Restaurant on Site', slug: 'restaurant', category: 'facilities', icon: 'utensils' },
    { name: 'Gift Shop', slug: 'gift-shop', category: 'facilities', icon: 'shopping-bag' },
    { name: 'Picnic Area', slug: 'picnic-area', category: 'facilities', icon: 'utensils' },
    { name: 'Cave Tours', slug: 'cave-tours', category: 'facilities', icon: 'mountain' },
    { name: 'Spa Services', slug: 'spa', category: 'facilities', icon: 'spa' },
    { name: 'Pool', slug: 'pool', category: 'facilities', icon: 'waves' },
    { name: 'Fitness Center', slug: 'fitness', category: 'facilities', icon: 'dumbbell' },
  ]

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { slug: amenity.slug },
      update: {},
      create: amenity
    })
  }

  console.log(`✅ Created ${amenities.length} amenities\n`)

  // ============================================
  // 3. CREATE SPECIALTIES
  // ============================================
  console.log('🎯 Creating specialties...')

  const specialties = [
    // Wine Types
    { name: 'Cabernet Sauvignon', slug: 'cabernet-sauvignon', category: 'wine_type' },
    { name: 'Pinot Noir', slug: 'pinot-noir', category: 'wine_type' },
    { name: 'Chardonnay', slug: 'chardonnay', category: 'wine_type' },
    { name: 'Zinfandel', slug: 'zinfandel', category: 'wine_type' },
    { name: 'Merlot', slug: 'merlot', category: 'wine_type' },
    { name: 'Sauvignon Blanc', slug: 'sauvignon-blanc', category: 'wine_type' },
    { name: 'Sparkling Wine', slug: 'sparkling', category: 'wine_type' },
    { name: 'Syrah', slug: 'syrah', category: 'wine_type' },
    { name: 'Rosé', slug: 'rose', category: 'wine_type' },

    // Cuisines
    { name: 'Italian', slug: 'italian', category: 'cuisine' },
    { name: 'French', slug: 'french', category: 'cuisine' },
    { name: 'American', slug: 'american', category: 'cuisine' },
    { name: 'Mediterranean', slug: 'mediterranean', category: 'cuisine' },
    { name: 'Farm-to-Table', slug: 'farm-to-table', category: 'cuisine' },
    { name: 'Seafood', slug: 'seafood', category: 'cuisine' },
    { name: 'Steakhouse', slug: 'steakhouse', category: 'cuisine' },
    { name: 'Asian Fusion', slug: 'asian-fusion', category: 'cuisine' },

    // Hotel Types
    { name: 'Luxury Resort', slug: 'luxury-resort', category: 'hotel_type' },
    { name: 'Boutique Hotel', slug: 'boutique-hotel', category: 'hotel_type' },
    { name: 'Bed & Breakfast', slug: 'bed-breakfast', category: 'hotel_type' },
    { name: 'Inn', slug: 'inn', category: 'hotel_type' },
    { name: 'Spa Resort', slug: 'spa-resort', category: 'hotel_type' },
  ]

  for (const specialty of specialties) {
    await prisma.specialty.upsert({
      where: { slug: specialty.slug },
      update: {},
      create: specialty
    })
  }

  console.log(`✅ Created ${specialties.length} specialties\n`)

  // ============================================
  // 4. CREATE SAMPLE VENUES
  // ============================================
  console.log('🍷 Creating sample venues...')

  // Sample Wineries
  const wineries = [
    {
      name: 'Domaine Carneros',
      slug: 'domaine-carneros',
      type: 'WINERY',
      regionId: napa.id,
      address: '1240 Duhig Rd',
      city: 'Napa',
      state: 'CA',
      zipCode: '94559',
      latitude: 38.2544,
      longitude: -122.2508,
      phone: '(707) 257-0101',
      website: 'https://www.domainecarneros.com',
      description: 'Elegant château specializing in sparkling wines and Pinot Noir with stunning views of Carneros.',
      priceLevel: 3,
      rating: 4.8,
      images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800'],
      featured: true,
      verified: true,
      metadata: {
        tastingFee: 45,
        reservationRequired: true,
        familyFriendly: false,
        sustainablePractices: true,
      },
      specialties: ['Sparkling Wine', 'Pinot Noir', 'Chardonnay'],
      amenities: ['Wheelchair Accessible', 'Parking Available', 'Outdoor Seating', 'Tasting Room']
    },
    {
      name: 'Ridge Vineyards',
      slug: 'ridge-vineyards',
      type: 'WINERY',
      regionId: sonoma.id,
      address: '650 Lytton Springs Rd',
      city: 'Healdsburg',
      state: 'CA',
      zipCode: '95448',
      latitude: 38.6108,
      longitude: -122.8694,
      phone: '(707) 433-7721',
      website: 'https://www.ridgewine.com',
      description: 'Historic winery known for exceptional Zinfandel and Cabernet Sauvignon with sustainable practices.',
      priceLevel: 2,
      rating: 4.7,
      images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800'],
      featured: true,
      verified: true,
      metadata: {
        tastingFee: 25,
        reservationRequired: false,
        familyFriendly: true,
        sustainablePractices: true,
      },
      specialties: ['Zinfandel', 'Cabernet Sauvignon', 'Chardonnay'],
      amenities: ['Parking Available', 'Outdoor Seating', 'Tasting Room', 'Wine Club']
    },
    {
      name: 'Goldeneye Winery',
      slug: 'goldeneye-winery',
      type: 'WINERY',
      regionId: mendocino.id,
      address: '9200 CA-128',
      city: 'Philo',
      state: 'CA',
      zipCode: '95466',
      latitude: 39.2656,
      longitude: -123.5319,
      phone: '(707) 895-3202',
      website: 'https://www.goldeneyewinery.com',
      description: 'Boutique winery in Anderson Valley specializing in Pinot Noir with a focus on terroir-driven wines.',
      priceLevel: 3,
      rating: 4.6,
      images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
      featured: true,
      verified: true,
      metadata: {
        tastingFee: 30,
        reservationRequired: true,
        familyFriendly: false,
      },
      specialties: ['Pinot Noir', 'Chardonnay'],
      amenities: ['Parking Available', 'Tasting Room', 'Wine Club']
    }
  ]

  for (const winery of wineries) {
    const { specialties: winerySpecialties, amenities: wineryAmenities, ...wineryData } = winery

    const createdWinery = await prisma.venue.create({
      data: wineryData
    })

    // Add specialties
    for (const specialtyName of winerySpecialties) {
      const specialty = await prisma.specialty.findFirst({
        where: { name: specialtyName }
      })
      if (specialty) {
        await prisma.venueSpecialty.create({
          data: {
            venueId: createdWinery.id,
            specialtyId: specialty.id
          }
        })
      }
    }

    // Add amenities
    for (const amenityName of wineryAmenities) {
      const amenity = await prisma.amenity.findFirst({
        where: { name: amenityName }
      })
      if (amenity) {
        await prisma.venueAmenity.create({
          data: {
            venueId: createdWinery.id,
            amenityId: amenity.id
          }
        })
      }
    }
  }

  console.log(`✅ Created ${wineries.length} sample wineries\n`)

  // Sample Restaurants
  const restaurants = [
    {
      name: 'The French Laundry',
      slug: 'the-french-laundry',
      type: 'RESTAURANT',
      regionId: napa.id,
      address: '6640 Washington St',
      city: 'Yountville',
      state: 'CA',
      zipCode: '94599',
      latitude: 38.4015,
      longitude: -122.3620,
      phone: '(707) 944-2380',
      website: 'https://www.thomaskeller.com/tfl',
      description: '3-Michelin star restaurant offering contemporary French cuisine with seasonal tasting menus.',
      priceLevel: 4,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
      featured: true,
      verified: true,
      metadata: {
        cuisine: 'French',
        michelinStars: 3,
        dressCode: 'Formal',
        reservationRequired: true,
        averageMeal: 350,
      },
      specialties: ['French', 'Farm-to-Table'],
      amenities: ['Wheelchair Accessible', 'Parking Available', 'Private Events']
    },
    {
      name: 'SingleThread',
      slug: 'singlethread',
      type: 'RESTAURANT',
      regionId: sonoma.id,
      address: '131 North St',
      city: 'Healdsburg',
      state: 'CA',
      zipCode: '95448',
      latitude: 38.6111,
      longitude: -122.8694,
      phone: '(707) 723-4646',
      website: 'https://www.singlethreadfarms.com',
      description: '3-Michelin star restaurant with farm and inn, serving Japanese-inspired seasonal cuisine.',
      priceLevel: 4,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'],
      featured: true,
      verified: true,
      metadata: {
        cuisine: 'Japanese-Californian',
        michelinStars: 3,
        dressCode: 'Smart Casual',
        reservationRequired: true,
        averageMeal: 325,
      },
      specialties: ['Asian Fusion', 'Farm-to-Table'],
      amenities: ['Wheelchair Accessible', 'Parking Available', 'Private Events', 'Wine Club']
    }
  ]

  for (const restaurant of restaurants) {
    const { specialties: restaurantSpecialties, amenities: restaurantAmenities, ...restaurantData } = restaurant

    const createdRestaurant = await prisma.venue.create({
      data: restaurantData
    })

    // Add specialties
    for (const specialtyName of restaurantSpecialties) {
      const specialty = await prisma.specialty.findFirst({
        where: { name: specialtyName }
      })
      if (specialty) {
        await prisma.venueSpecialty.create({
          data: {
            venueId: createdRestaurant.id,
            specialtyId: specialty.id
          }
        })
      }
    }

    // Add amenities
    for (const amenityName of restaurantAmenities) {
      const amenity = await prisma.amenity.findFirst({
        where: { name: amenityName }
      })
      if (amenity) {
        await prisma.venueAmenity.create({
          data: {
            venueId: createdRestaurant.id,
            amenityId: amenity.id
          }
        })
      }
    }
  }

  console.log(`✅ Created ${restaurants.length} sample restaurants\n`)

  // Sample Hotels
  const hotels = [
    {
      name: 'Meadowood Napa Valley',
      slug: 'meadowood-napa-valley',
      type: 'HOTEL',
      regionId: napa.id,
      address: '900 Meadowood Ln',
      city: 'St Helena',
      state: 'CA',
      zipCode: '94574',
      latitude: 38.5156,
      longitude: -122.4667,
      phone: '(707) 963-3646',
      website: 'https://www.meadowood.com',
      description: 'Luxury resort nestled in 250 acres of Napa Valley with golf, spa, and fine dining.',
      priceLevel: 4,
      rating: 4.8,
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
      featured: true,
      verified: true,
      metadata: {
        rooms: 85,
        checkIn: '16:00',
        checkOut: '12:00',
        nightly: 800,
      },
      specialties: ['Luxury Resort', 'Spa Resort'],
      amenities: ['Wheelchair Accessible', 'Parking Available', 'Wi-Fi', 'Restaurant on Site', 'Spa Services', 'Pool', 'Fitness Center']
    }
  ]

  for (const hotel of hotels) {
    const { specialties: hotelSpecialties, amenities: hotelAmenities, ...hotelData } = hotel

    const createdHotel = await prisma.venue.create({
      data: hotelData
    })

    // Add specialties
    for (const specialtyName of hotelSpecialties) {
      const specialty = await prisma.specialty.findFirst({
        where: { name: specialtyName }
      })
      if (specialty) {
        await prisma.venueSpecialty.create({
          data: {
            venueId: createdHotel.id,
            specialtyId: specialty.id
          }
        })
      }
    }

    // Add amenities
    for (const amenityName of hotelAmenities) {
      const amenity = await prisma.amenity.findFirst({
        where: { name: amenityName }
      })
      if (amenity) {
        await prisma.venueAmenity.create({
          data: {
            venueId: createdHotel.id,
            amenityId: amenity.id
          }
        })
      }
    }
  }

  console.log(`✅ Created ${hotels.length} sample hotels\n`)

  // ============================================
  // 5. CREATE DEMO USER
  // ============================================
  console.log('👤 Creating demo user...')

  const hashedPassword = await bcrypt.hash('demo1234', 10)

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@sipai.com' },
    update: {},
    create: {
      email: 'demo@sipai.com',
      name: 'Demo User',
      password: hashedPassword,
      emailVerified: new Date(),
    }
  })

  // Create user preferences
  await prisma.userPreferences.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      favoriteWineTypes: ['Cabernet Sauvignon', 'Pinot Noir'],
      priceRangeMin: 50,
      priceRangeMax: 150,
      cuisinePreferences: ['Italian', 'French'],
      accommodationType: ['Luxury Resort', 'Boutique Hotel'],
      experienceInterests: ['wine tasting', 'spa', 'fine dining'],
    }
  })

  console.log('✅ Created demo user (demo@sipai.com / demo1234)\n')

  // ============================================
  // 6. CREATE SAMPLE EXPERIENCE
  // ============================================
  console.log('🎈 Creating sample experiences...')

  const balloon = await prisma.experience.create({
    data: {
      name: 'Hot Air Balloon Ride over Napa Valley',
      slug: 'hot-air-balloon-napa',
      regionId: napa.id,
      description: 'Soar above the vineyards at sunrise for breathtaking views of Napa Valley.',
      longDescription: 'Experience the magic of wine country from above with a peaceful hot air balloon ride at sunrise. Float over endless rows of grapevines, historic estates, and rolling hills while enjoying champagne and gourmet snacks. Your FAA-certified pilot will share insights about the region\'s geography and winemaking. The experience includes pre-flight coffee and pastries, a post-flight champagne toast, and a souvenir photo.',
      duration: 180,
      groupSize: 12,
      difficulty: 'easy',
      price: 275,
      pricePerPerson: 275,
      images: [
        'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800',
        'https://images.unsplash.com/photo-1483450388369-9ed95738483c?w=800'
      ],
      seasonal: true,
      availableMonths: ['March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
      advanceBookingDays: 7,
      featured: true,
    }
  })

  console.log('✅ Created 1 sample experience\n')

  console.log('✨ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log('  - 3 regions')
  console.log(`  - ${amenities.length} amenities`)
  console.log(`  - ${specialties.length} specialties`)
  console.log(`  - ${wineries.length} wineries`)
  console.log(`  - ${restaurants.length} restaurants`)
  console.log(`  - ${hotels.length} hotels`)
  console.log('  - 1 experience')
  console.log('  - 1 demo user\n')
  console.log('🔑 Demo login: demo@sipai.com / demo1234')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
