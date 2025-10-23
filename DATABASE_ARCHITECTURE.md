# Sip.AI Database Architecture

## Overview

The Sip.AI database is designed as a **scalable, multi-region, multi-vertical platform** that can expand beyond wine country to support any hospitality, dining, or travel vertical worldwide.

---

## Design Principles

### 1. **Flexible & Extensible**
- Universal `Venue` model supports wineries, restaurants, hotels, bars, cafes, spas, and more
- JSON metadata fields allow type-specific data without schema changes
- Taxonomy system (Amenities & Specialties) enables unlimited categorization

### 2. **Multi-Region Support**
- `Region` model supports global expansion
- Currently: Napa, Sonoma, Mendocino
- Future: Tuscany, Bordeaux, Rioja, Barossa Valley, etc.

### 3. **Multi-Vertical Ready**
- Current: Wine Country (wineries, restaurants, hotels)
- Future: Craft beer trails, culinary tours, wellness retreats, adventure travel

### 4. **User-Centric**
- Rich user preferences and interests tracking
- Personalization engine foundation
- Trip planning and favorites
- Review and booking systems

---

## Core Data Models

### User Management

```prisma
User
├── UserPreferences (1:1)
│   ├── favoriteWineTypes: String[]
│   ├── priceRangeMin/Max: Int
│   ├── dietaryRestrictions: String[]
│   ├── cuisinePreferences: String[]
│   └── experienceInterests: String[]
│
├── UserInterest[] (1:many)
│   ├── category: "wine_type" | "cuisine" | "experience" | "region"
│   ├── value: String
│   └── strength: Int (1-10)
│
├── Trip[] (1:many)
├── Favorite[] (1:many)
├── Review[] (1:many)
└── Booking[] (1:many)
```

**Key Features:**
- Detailed preference tracking for AI recommendations
- Interest strength scoring for personalization
- Complete activity history

---

### Geographic Structure

```prisma
Region
├── name: "Napa Valley" | "Sonoma County" | ...
├── slug: "napa" | "sonoma" | ...
├── country: "USA" | "Italy" | "France" | ...
├── state: "California" | "Tuscany" | ...
├── latitude/longitude: Float
├── featured: Boolean
└── venues: Venue[] (1:many)
```

**Expandability:**
```sql
-- Add new regions easily
INSERT INTO Region (name, slug, country, state, ...)
VALUES ('Tuscany', 'tuscany', 'Italy', 'Tuscany', ...);

-- Add new countries
INSERT INTO Region (name, slug, country, ...)
VALUES ('Bordeaux', 'bordeaux', 'France', 'Nouvelle-Aquitaine', ...);
```

---

### Unified Venue Model

```prisma
Venue
├── type: VenueType enum
│   ├── WINERY
│   ├── RESTAURANT
│   ├── HOTEL
│   ├── BAR
│   ├── CAFE
│   ├── SPA
│   ├── TASTING_ROOM
│   └── EVENT_SPACE (+ more as needed)
│
├── Core Fields
│   ├── name, slug, description
│   ├── region: Region
│   ├── address, city, state, zipCode
│   ├── latitude, longitude
│   ├── phone, email, website
│   ├── images: String[]
│   ├── priceLevel: 1-4 ($-$$$$)
│   ├── rating: Float
│   └── featured, verified, active
│
├── Type-Specific Data (JSON)
│   ├── metadata: Json
│   │   ├── Winery: { tastingFee, reservationRequired, wineClubAvailable, ... }
│   │   ├── Restaurant: { cuisine, michelin, dressCode, averageMeal, ... }
│   │   └── Hotel: { rooms, checkIn, checkOut, nightly, ... }
│
└── Relations
    ├── amenities: VenueAmenity[]
    ├── specialties: VenueSpecialty[]
    ├── reviews: Review[]
    ├── favorites: Favorite[]
    ├── tripItems: TripItem[]
    └── bookings: Booking[]
```

**Why Unified?**
- Single search interface across all venue types
- Shared features (ratings, reviews, bookings)
- Easy to add new venue types
- Reduces code duplication

**Example Metadata Usage:**

```typescript
// Winery
metadata: {
  tastingFee: 45,
  reservationRequired: true,
  wineClubAvailable: true,
  sustainablePractices: true,
  productionVolume: "50,000 cases/year"
}

// Restaurant
metadata: {
  michelin: 3,
  cuisine: "French",
  dressCode: "Formal",
  reservationRequired: true,
  averageMeal: 350,
  privateRoomAvailable: true
}

// Hotel
metadata: {
  rooms: 85,
  checkIn: "16:00",
  checkOut: "12:00",
  nightly: 800,
  conciergeService: true,
  shuttleService: true
}
```

---

### Flexible Taxonomy System

#### Amenities (Reusable Features)

```prisma
Amenity
├── name: "Wheelchair Accessible" | "Wi-Fi" | "Spa Services" | ...
├── slug: "wheelchair-accessible" | "wifi" | ...
├── category: "accessibility" | "services" | "facilities"
└── icon: String (Lucide icon name)
```

**Categories:**
- **Accessibility:** Wheelchair accessible, parking, pet friendly
- **Services:** Wi-Fi, outdoor seating, private events, wine club
- **Facilities:** Restaurant, gift shop, picnic area, cave tours, spa, pool

**Usage:**
```prisma
VenueAmenity (Join Table)
├── venue: Venue
└── amenity: Amenity
```

Many venues can have many amenities without duplication.

---

#### Specialties (Categorized Tags)

```prisma
Specialty
├── name: "Cabernet Sauvignon" | "Italian" | "Luxury Resort" | ...
├── slug: "cabernet-sauvignon" | "italian" | ...
└── category: "wine_type" | "cuisine" | "hotel_type"
```

**Categories:**
- **wine_type:** Cabernet, Pinot Noir, Chardonnay, Zinfandel, etc.
- **cuisine:** Italian, French, Mediterranean, Farm-to-Table, etc.
- **hotel_type:** Luxury Resort, Boutique Hotel, B&B, Inn, etc.

**Expandable:**
```sql
-- Add craft beer specialties
INSERT INTO Specialty (name, slug, category)
VALUES
  ('IPA', 'ipa', 'beer_type'),
  ('Stout', 'stout', 'beer_type'),
  ('Lager', 'lager', 'beer_type');

-- Add experience types
INSERT INTO Specialty (name, slug, category)
VALUES
  ('Hot Air Balloon', 'hot-air-balloon', 'experience_type'),
  ('Cooking Class', 'cooking-class', 'experience_type');
```

---

### Experiences

```prisma
Experience
├── name: "Hot Air Balloon Ride over Napa Valley"
├── region: Region (optional)
├── venue: Venue (optional)
├── duration: Int (minutes)
├── groupSize: Int
├── difficulty: "easy" | "moderate" | "challenging"
├── price: Float
├── pricePerPerson: Float
├── images: String[]
├── seasonal: Boolean
├── availableMonths: String[]
└── advanceBookingDays: Int
```

**Future Expansion:**
- Wine blending classes
- Vineyard tours
- Spa packages
- Cooking classes
- Private tastings
- Multi-day packages

---

### Trip Planning

```prisma
Trip
├── user: User
├── name: "Napa Weekend Getaway"
├── description: String
├── startDate/endDate: DateTime
├── status: "planning" | "booked" | "completed" | "cancelled"
└── items: TripItem[]
    ├── venue: Venue (optional)
    ├── date: DateTime
    ├── time: String
    ├── notes: String
    ├── order: Int
    └── status: "planned" | "booked" | "completed" | "cancelled"
```

**Features:**
- Multi-day itineraries
- Drag-and-drop ordering
- Booking status tracking
- Shareable trips (future)

---

### Reviews & Ratings

```prisma
Review
├── user: User
├── venue: Venue (optional)
├── experience: Experience (optional)
├── rating: Int (1-5 stars)
├── title: String
├── content: String
├── verified: Boolean (verified purchase/visit)
├── helpful: Int (helpful votes)
└── images: String[]
```

**Aggregate Ratings:**
```typescript
// Auto-calculate venue ratings
const avgRating = await prisma.review.aggregate({
  where: { venueId: venue.id },
  _avg: { rating: true },
  _count: true
})

await prisma.venue.update({
  where: { id: venue.id },
  data: {
    rating: avgRating._avg.rating,
    reviewCount: avgRating._count
  }
})
```

---

### Bookings

```prisma
Booking
├── user: User
├── venue: Venue (optional)
├── experience: Experience (optional)
├── bookingDate: DateTime
├── bookingTime: String
├── guestCount: Int
├── status: "pending" | "confirmed" | "completed" | "cancelled"
├── totalPrice: Float
├── contactName/Email/Phone: String
├── specialRequests: String
└── externalBookingId: String (for third-party integrations)
```

**Future Integrations:**
- Resy, OpenTable (restaurants)
- Tripleseat (private events)
- Direct winery booking systems
- Hotel PMS integrations

---

## Scalability Features

### 1. Geographic Expansion

**Current Regions:**
- Napa Valley, Sonoma County, Mendocino County

**Easy to Add:**
```typescript
// Add Tuscany, Italy
await prisma.region.create({
  data: {
    name: "Tuscany",
    slug: "tuscany",
    country: "Italy",
    state: "Tuscany",
    description: "Rolling hills, medieval towns, and world-class Chianti",
    featured: true
  }
})

// Add venues in new region
await prisma.venue.createMany({
  data: tuscanVenues.map(v => ({ ...v, regionId: tuscanyId }))
})
```

**Worldwide Potential:**
- France: Bordeaux, Burgundy, Champagne
- Italy: Tuscany, Piedmont, Veneto
- Spain: Rioja, Ribera del Duero
- Australia: Barossa, Margaret River
- New Zealand: Marlborough, Central Otago
- South Africa: Stellenbosch, Franschhoek
- Chile: Maipo Valley, Colchagua Valley
- Argentina: Mendoza, Salta

---

### 2. Vertical Expansion

**Current:** Wine Country

**Future Verticals:**

#### Craft Beer Trails
```prisma
// Just change venue type and specialties
type: BREWERY
specialties: ["IPA", "Stout", "Lager"]
metadata: {
  tapRoomHours: { ... },
  tourAvailable: true,
  foodTrucks: true
}
```

#### Culinary Tours
```prisma
type: COOKING_SCHOOL
specialties: ["Italian Cuisine", "Pastry", "Wine Pairing"]
metadata: {
  classTypes: ["hands-on", "demonstration"],
  skillLevels: ["beginner", "advanced"],
  avgClassDuration: 180
}
```

#### Wellness Retreats
```prisma
type: SPA | YOGA_STUDIO | WELLNESS_CENTER
specialties: ["Hot Springs", "Massage", "Yoga", "Meditation"]
metadata: {
  treatmentTypes: [...],
  packages: [...],
  dayPassAvailable: true
}
```

#### Adventure Travel
```prisma
type: ADVENTURE_OUTFITTER
specialties: ["Hiking", "Kayaking", "Rock Climbing"]
metadata: {
  equipmentProvided: true,
  guidedTours: true,
  difficultyLevels: ["beginner", "intermediate", "advanced"]
}
```

---

### 3. Personalization Engine

The database schema supports sophisticated personalization:

```typescript
// User interest tracking
const userInterests = await prisma.userInterest.findMany({
  where: { userId: user.id },
  orderBy: { strength: 'desc' }
})

// Preference-based recommendations
const recommendations = await prisma.venue.findMany({
  where: {
    type: 'WINERY',
    specialties: {
      some: {
        specialty: {
          slug: { in: userInterests.map(i => i.value) }
        }
      }
    },
    priceLevel: {
      gte: user.preferences.priceRangeMin,
      lte: user.preferences.priceRangeMax
    }
  }
})

// Learning from user behavior
await prisma.userInterest.upsert({
  where: {
    userId_category_value: {
      userId: user.id,
      category: 'wine_type',
      value: 'Pinot Noir'
    }
  },
  update: {
    strength: { increment: 1 } // Strengthen interest
  },
  create: {
    userId: user.id,
    category: 'wine_type',
    value: 'Pinot Noir',
    strength: 1
  }
})
```

---

## Performance Optimization

### Indexes

```prisma
@@index([slug])        // Fast lookups
@@index([type])        // Filter by venue type
@@index([regionId])    // Region queries
@@index([featured])    // Featured items
@@index([userId])      // User data
```

### Query Optimization

```typescript
// Include related data in single query
const venue = await prisma.venue.findUnique({
  where: { slug: 'domaine-carneros' },
  include: {
    region: true,
    amenities: { include: { amenity: true } },
    specialties: { include: { specialty: true } },
    reviews: {
      take: 10,
      orderBy: { createdAt: 'desc' }
    }
  }
})
```

### Caching Strategy (Future)

```typescript
// Redis caching for frequent queries
const cachedVenue = await redis.get(`venue:${slug}`)
if (cachedVenue) return JSON.parse(cachedVenue)

const venue = await prisma.venue.findUnique(...)
await redis.setex(`venue:${slug}`, 3600, JSON.stringify(venue))
```

---

## Data Migration Strategy

### Phase 1: Seed with Sample Data ✅
- 3 regions (Napa, Sonoma, Mendocino)
- 15 amenities
- 24 specialties
- 6 sample venues (3 wineries, 2 restaurants, 1 hotel)
- 1 experience
- 1 demo user

### Phase 2: Import Static Data (Next)
- Migrate 925+ wineries from `src/data/wineries.ts`
- Migrate 150+ restaurants from `src/data/restaurants.ts`
- Migrate 50+ hotels from `src/data/hotels.ts`
- Parse and map all amenities and specialties

### Phase 3: Enhance Data (Future)
- Add high-quality images
- Verify all contact information
- Add operating hours
- Collect user reviews
- Partner with venues for verified data

### Phase 4: Expand Regions (Future)
- Add new California regions (Paso Robles, Santa Barbara, etc.)
- Expand to Oregon (Willamette Valley)
- International expansion

---

## Security & Best Practices

### 1. Password Security
```typescript
// Always hash passwords
const hashedPassword = await bcrypt.hash(password, 10)

// Never return passwords in queries
select: {
  id: true,
  email: true,
  name: true,
  // password: NEVER include
}
```

### 2. Data Validation
```typescript
// Use Zod for input validation
const venueSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  priceLevel: z.number().min(1).max(4)
})
```

### 3. Soft Deletes
```prisma
// Use active flag instead of deleting
active: Boolean @default(true)

// Query only active records
where: { active: true }
```

### 4. Audit Trail (Future)
```prisma
model AuditLog {
  id        String   @id @default(cuid())
  userId    String?
  action    String   // "create", "update", "delete"
  model     String   // "Venue", "User", etc.
  recordId  String
  changes   Json
  createdAt DateTime @default(now())
}
```

---

## Next Steps

1. ✅ Design schema
2. ✅ Create seed script
3. ✅ Set up authentication
4. 🚧 Migrate static data to database
5. ⏳ Build user profile management UI
6. ⏳ Implement favorites and trip planning with database
7. ⏳ Update API routes to query database
8. ⏳ Add review system
9. ⏳ Implement booking system
10. ⏳ Build admin dashboard

---

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/current/index.html)
- [Database Design Patterns](https://www.patterns.dev/)

---

**Built with flexibility, scalability, and user experience in mind.**
