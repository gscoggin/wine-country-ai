# Database Setup Guide

This guide will help you set up the PostgreSQL database for Sip.AI.

## Database Schema Overview

The Sip.AI database is designed for **multi-region, multi-vertical expansion** with support for:

### Core Entities
- **Users** - Account management, authentication, preferences
- **Regions** - Wine country regions (expandable to worldwide destinations)
- **Venues** - Unified model for wineries, restaurants, hotels, bars, cafes, spas
- **Experiences** - Tours, classes, tastings, events
- **Trips** - User-created itineraries
- **Reviews** - User ratings and feedback
- **Bookings** - Reservation tracking

### Flexible Taxonomy System
- **Amenities** - Reusable features (e.g., "wheelchair accessible", "pet friendly")
- **Specialties** - Categorized tags (e.g., wine types, cuisines, hotel styles)
- **User Interests** - Tracked user preferences for personalization

### Key Features
✅ **Multi-Region Support** - Easy to add new wine regions or destinations
✅ **Multi-Vertical Support** - Hospitality, dining, travel, wellness
✅ **User Preferences** - Save dietary restrictions, wine preferences, interests
✅ **Favorites System** - Bookmark venues and experiences
✅ **Trip Planning** - Create and manage detailed itineraries
✅ **Review System** - User ratings with verification support
✅ **Booking Tracking** - Track reservations and confirmations

---

## Option 1: Local Development with Docker (Recommended)

### Prerequisites
- Docker Desktop installed and running
- Node.js 18+ installed

### Steps

1. **Start PostgreSQL**
```bash
docker-compose up -d
```

This starts:
- PostgreSQL database on `localhost:5432`
- pgAdmin (database UI) on `http://localhost:5050`

2. **Copy environment variables**
```bash
cp .env.example .env.local
```

3. **Update .env.local**
The DATABASE_URL should already be correct:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/sipai_dev
```

4. **Generate Prisma Client**
```bash
npx prisma generate
```

5. **Run migrations**
```bash
npx prisma migrate dev --name init
```

6. **Seed the database** (optional)
```bash
npm run db:seed
```

7. **View your database**
- Open pgAdmin: http://localhost:5050
- Login: admin@sipai.local / admin
- Connect to server: `postgres` / `password`

### Stop the database
```bash
docker-compose down
```

### Reset the database
```bash
docker-compose down -v  # Removes volumes
docker-compose up -d
npx prisma migrate reset
```

---

## Option 2: Hosted Database (Production)

### Recommended Providers

1. **Vercel Postgres** (Easiest for Vercel deployment)
   - Go to: https://vercel.com/dashboard
   - Add Postgres database
   - Copy connection string to `.env.local`

2. **Supabase** (Free tier available)
   - Create project: https://supabase.com
   - Get connection string from Settings > Database
   - Use "Connection pooling" string for production

3. **Railway** (Simple and affordable)
   - Create project: https://railway.app
   - Add PostgreSQL
   - Copy connection string

4. **Neon** (Serverless Postgres)
   - Create database: https://neon.tech
   - Copy connection string

### Setup Steps

1. **Get your DATABASE_URL from your provider**

2. **Add to .env.local**
```
DATABASE_URL=your_connection_string_here
```

3. **Run migrations**
```bash
npx prisma migrate deploy
```

4. **Seed the database**
```bash
npm run db:seed
```

---

## Database Commands

### Prisma CLI Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name description_of_changes

# Apply migrations (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Pull schema from existing database
npx prisma db pull

# Push schema without migrations (dev only)
npx prisma db push
```

### npm Scripts

```bash
# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Generate Prisma Client
npm run db:generate
```

---

## Schema Modifications

The schema is designed to be **extensible**. Here's how to add new features:

### Add a New Region
```typescript
// In seed script or via API
await prisma.region.create({
  data: {
    name: "Tuscany",
    slug: "tuscany",
    country: "Italy",
    state: "Tuscany",
    description: "Rolling hills and world-class wines",
    featured: true
  }
})
```

### Add a New Venue Type
The `VenueType` enum can be extended in `schema.prisma`:
```prisma
enum VenueType {
  WINERY
  RESTAURANT
  HOTEL
  BAR
  CAFE
  SPA
  TASTING_ROOM
  EVENT_SPACE
  BREWERY      // New!
  DISTILLERY   // New!
}
```

Then run:
```bash
npx prisma migrate dev --name add_new_venue_types
```

### Add Custom Metadata
The `metadata` field (JSON) allows flexible data storage:
```typescript
// For a winery
metadata: {
  tastingFee: 25,
  reservationRequired: true,
  wineClubAvailable: true,
  productionVolume: "50,000 cases/year"
}

// For a restaurant
metadata: {
  michelin: 2,
  cuisine: "French",
  dressCode: "Business Casual",
  reservationRequired: true
}
```

---

## Database Migration Strategy

### Development
1. Make changes to `schema.prisma`
2. Run `npx prisma migrate dev --name descriptive_name`
3. Prisma generates SQL migration files
4. Test the migration locally

### Production
1. Test migrations locally first
2. Commit migration files to git
3. In production: `npx prisma migrate deploy`
4. Never use `migrate dev` in production

---

## Troubleshooting

### "Can't reach database server"
- Check Docker is running: `docker ps`
- Verify DATABASE_URL is correct
- Check port 5432 isn't in use: `lsof -i :5432`

### "Prisma Client not generated"
Run: `npx prisma generate`

### "Migration failed"
```bash
# Check migration status
npx prisma migrate status

# Reset database (development only)
npx prisma migrate reset
```

### "Out of sync" errors
```bash
# Push schema without migration (dev only)
npx prisma db push

# Or create a new migration
npx prisma migrate dev
```

---

## Security Best Practices

1. **Never commit .env.local** - Already in .gitignore
2. **Use connection pooling** in production (built into Prisma)
3. **Enable SSL** for production databases
4. **Rotate passwords** regularly
5. **Use read replicas** for heavy read operations
6. **Backup regularly** - Set up automated backups with your provider

---

## Next Steps

After database setup:
1. [ ] Run seed script to populate initial data
2. [ ] Test authentication flow
3. [ ] Verify user registration works
4. [ ] Test favorites and trip planning
5. [ ] Check API endpoints with database

For help, see:
- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js Database Guide](https://nextjs.org/docs/app/building-your-application/data-fetching)
