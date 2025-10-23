# Quick Start: Database Setup

Get your Sip.AI database running in under 5 minutes!

## Prerequisites

- Docker Desktop installed and running
- Node.js 18+ installed
- Terminal/Command Line access

## Steps

### 1. Start PostgreSQL Database

```bash
# Start PostgreSQL in Docker
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- pgAdmin on `http://localhost:5050`

### 2. Set Up Environment Variables

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` and add:
```env
# Your OpenAI API key
OPENAI_API_KEY=sk-proj-...your-key-here...

# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-here

# Database (already configured for Docker)
DATABASE_URL=postgresql://postgres:password@localhost:5432/sipai_dev
```

### 3. Install Dependencies & Generate Prisma Client

```bash
npm install
npx prisma generate
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all tables in your database.

### 5. Seed the Database

```bash
npm run db:seed
```

This adds:
- ✅ 3 regions (Napa, Sonoma, Mendocino)
- ✅ 15 amenities
- ✅ 24 specialties (wine types, cuisines, hotel types)
- ✅ 6 sample venues (3 wineries, 2 restaurants, 1 hotel)
- ✅ 1 experience (hot air balloon ride)
- ✅ 1 demo user

**Demo Login Credentials:**
- Email: `demo@sipai.com`
- Password: `demo1234`

### 6. Start the App

```bash
npm run dev
```

Open http://localhost:3000 🎉

### 7. Explore Your Database (Optional)

**Option A: Prisma Studio (Recommended)**
```bash
npm run db:studio
```
Opens a GUI at http://localhost:5555

**Option B: pgAdmin**
- Open http://localhost:5050
- Login: `admin@sipai.local` / `admin`
- Add server:
  - Host: `postgres` (or `host.docker.internal` on Mac/Windows)
  - Port: `5432`
  - Username: `postgres`
  - Password: `password`
  - Database: `sipai_dev`

---

## Common Commands

```bash
# View database schema
npx prisma studio

# Check migration status
npx prisma migrate status

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Stop database
docker-compose down

# Stop and delete all data
docker-compose down -v
```

---

## What's Next?

### Test Authentication
1. Go to http://localhost:3000
2. Click "Sign In"
3. Create a new account or use demo credentials
4. Try the AI chat with personalized recommendations

### Explore the Data
1. Open Prisma Studio: `npm run db:studio`
2. Browse:
   - **Users** - See your account and demo user
   - **Venues** - Sample wineries, restaurants, hotels
   - **Regions** - Napa, Sonoma, Mendocino
   - **Amenities** - All available features
   - **Specialties** - Wine types, cuisines, etc.

### Add More Data
The database currently has **6 sample venues**. Your static data files contain **1000+ venues**.

To migrate all static data:
1. See `DATABASE_ARCHITECTURE.md` for the data model
2. Create a migration script (coming next)
3. Or manually import via Prisma Studio

---

## Troubleshooting

### "Can't reach database server"
```bash
# Check Docker is running
docker ps

# Restart database
docker-compose down
docker-compose up -d
```

### "Migration failed"
```bash
# Check migration status
npx prisma migrate status

# Reset and try again
npx prisma migrate reset
npx prisma migrate dev --name init
```

### "Prisma Client not generated"
```bash
npx prisma generate
```

### Port 5432 already in use
```bash
# Check what's using port 5432
lsof -i :5432

# Kill the process or change port in docker-compose.yml
ports:
  - "5433:5432"  # Use port 5433 instead
```

Then update `.env.local`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5433/sipai_dev
```

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│  Next.js App (Frontend)             │
│  - React Components                 │
│  - AI Chat Interface                │
│  - User Authentication (NextAuth)   │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  API Routes (Backend)               │
│  - /api/auth/[...nextauth]          │
│  - /api/auth/register               │
│  - /api/chat                        │
│  - /api/venues (future)             │
│  - /api/trips (future)              │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  Prisma ORM                         │
│  - Type-safe database client        │
│  - Migrations                       │
│  - Schema management                │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  PostgreSQL Database                │
│  - Users & Auth                     │
│  - Venues (wineries, restaurants,   │
│    hotels, etc.)                    │
│  - Regions, Amenities, Specialties  │
│  - Trips, Favorites, Reviews        │
└─────────────────────────────────────┘
```

---

## Production Deployment

For production, you'll need a hosted PostgreSQL database:

### Recommended Providers:
1. **Vercel Postgres** (easiest for Vercel deployment)
2. **Supabase** (includes auth, storage, realtime)
3. **Railway** (simple and affordable)
4. **Neon** (serverless Postgres)

### Steps:
1. Create database with your provider
2. Get connection string
3. Add to Vercel environment variables:
   ```
   DATABASE_URL=your_production_connection_string
   ```
4. Run migrations in production:
   ```bash
   npx prisma migrate deploy
   ```
5. Seed production database:
   ```bash
   npm run db:seed
   ```

---

## Need Help?

- **Database Setup:** See `DATABASE_SETUP.md`
- **Schema Details:** See `DATABASE_ARCHITECTURE.md`
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://next-auth.js.org

**You're all set! 🎉**

Your Sip.AI database is ready to power personalized wine country experiences.
