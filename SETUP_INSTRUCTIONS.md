# Complete Setup Instructions for Sip.AI

Follow these steps to get Sip.AI running with a fully populated database.

## Prerequisites

Before you begin, make sure you have:

- ✅ **Podman or Docker** installed (Podman is free! See `PODMAN_SETUP.md`)
- ✅ **Node.js 18+** installed
- ✅ **OpenAI API key** (from https://platform.openai.com/api-keys)
- ✅ Terminal/Command line access

> **💡 Recommended: Use Podman (Free & Open Source)**
>
> Podman is a free alternative to Docker with no subscription required.
>
> **Installation:** See `PODMAN_SETUP.md` for detailed instructions
>
> **Quick Install (macOS):**
> ```bash
> brew install podman podman-compose
> podman machine init
> podman machine start
> ```

---

## Step-by-Step Setup

### 1. Install Podman (Recommended - Free!) or Docker

**Option A: Podman (Recommended - No Subscription Required)**

**macOS:**
```bash
brew install podman podman-compose
podman machine init
podman machine start
podman --version  # Verify installation
```

**Windows:**
- Download Podman Desktop: https://podman-desktop.io/downloads
- Install and run (it will set up WSL2 automatically)

**Linux:**
```bash
sudo apt-get install podman  # Ubuntu/Debian
# or
sudo dnf install podman      # Fedora/RHEL
pip3 install podman-compose
```

**See `PODMAN_SETUP.md` for detailed instructions**

---

**Option B: Docker Desktop (Requires Subscription for Business Use)**

**macOS/Windows:**
- Download from: https://www.docker.com/products/docker-desktop/
- Install and start Docker Desktop
- Verify it's running

**Verify installation:**
```bash
# Podman
podman --version

# or Docker
docker --version
```

---

### 2. Start PostgreSQL Database

**With Podman:**
```bash
# Start PostgreSQL and pgAdmin with Podman
podman-compose up -d
# or (Podman 4.1+)
podman compose up -d
```

**With Docker:**
```bash
# Start PostgreSQL and pgAdmin with Docker
docker compose up -d
```

This command starts:
- **PostgreSQL** on `localhost:5432`
- **pgAdmin** (database UI) on `http://localhost:5050`

**Verify it's running:**

**Podman:**
```bash
podman ps
```

**Docker:**
```bash
docker ps
```

You should see two containers: `sipai-postgres` and `sipai-pgadmin`

---

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local
```

Now edit `.env.local` and add your keys:

```env
# Your OpenAI API key (required)
OPENAI_API_KEY=sk-proj-...your-key-here...

# Generate a random secret for NextAuth
# Run: openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret-here

# NextAuth URL (already correct for local dev)
NEXTAUTH_URL=http://localhost:3000

# Database URL (already configured for Docker)
DATABASE_URL=postgresql://postgres:password@localhost:5432/sipai_dev
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 4. Install Dependencies

```bash
npm install
```

---

### 5. Generate Prisma Client

```bash
npx prisma generate
```

This creates the TypeScript types and database client based on your schema.

---

### 6. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This creates all the tables in your database based on the schema.

**You should see:**
- ✅ Migration files created in `prisma/migrations/`
- ✅ Tables created in PostgreSQL
- ✅ "Migration applied successfully"

---

### 7. Seed Initial Data

```bash
npm run db:seed
```

This adds:
- ✅ 3 regions (Napa Valley, Sonoma County, Mendocino County)
- ✅ 15 amenities (wheelchair accessible, Wi-Fi, spa services, etc.)
- ✅ 24 specialties (wine types, cuisines, hotel types)
- ✅ 6 sample venues (3 wineries, 2 restaurants, 1 hotel)
- ✅ 1 experience (hot air balloon ride)
- ✅ 1 demo user

**Demo User Credentials:**
- Email: `demo@sipai.com`
- Password: `demo1234`

---

### 8. Migrate Your Static Data (1000+ Venues)

```bash
npm run db:migrate-data
```

This script imports all your existing data:
- 🍷 **925+ wineries** from `src/data/wineries.ts`
- 🍽️ **150+ restaurants** from `src/data/restaurants.ts`
- 🏨 **50+ hotels** from `src/data/hotels.ts`

The script:
- ✅ Automatically creates wine types, cuisines, and amenities
- ✅ Maps your static data to the new database schema
- ✅ Skips duplicates (safe to run multiple times)
- ✅ Shows progress and error reporting

**This may take 2-5 minutes depending on your machine.**

You should see:
```
🍷 Migrating wineries...
  ✅ Imported 50 wineries...
  ✅ Imported 100 wineries...
  ...
✅ Wineries migration complete: Imported: 925

🍽️  Migrating restaurants...
✅ Restaurants migration complete: Imported: 150

🏨 Migrating hotels...
✅ Hotels migration complete: Imported: 50

📊 MIGRATION SUMMARY
Total Imported: 1125
```

---

### 9. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**You should now see:**
- ✅ Sip.AI homepage with hero carousel
- ✅ AI chat interface
- ✅ Full directory with 1000+ venues
- ✅ Trip planning features
- ✅ Search and filters working

---

### 10. Explore Your Database (Optional)

#### Option A: Prisma Studio (Recommended)

```bash
npm run db:studio
```

Opens at http://localhost:5555

- Visual interface to browse and edit data
- See all your venues, users, regions, etc.
- Edit records directly
- Great for debugging

#### Option B: pgAdmin

1. Open http://localhost:5050
2. Login:
   - Email: `admin@sipai.local`
   - Password: `admin`
3. Add Server:
   - Right-click "Servers" → "Register" → "Server"
   - Name: `Sip.AI Local`
   - Connection tab:
     - Host: `postgres` (or `host.docker.internal` on Mac/Windows)
     - Port: `5432`
     - Database: `sipai_dev`
     - Username: `postgres`
     - Password: `password`
4. Click "Save"

Now you can browse tables, run SQL queries, and view data.

---

## Verify Everything is Working

### Test 1: View a Venue
1. Go to http://localhost:3000/directory
2. You should see 1000+ venues
3. Search for "Domaine Carneros"
4. Click to view details

### Test 2: Try the AI Chat
1. Go to http://localhost:3000
2. Ask: "What are the best Pinot Noir wineries in Sonoma?"
3. You should get personalized recommendations

### Test 3: Create a Trip
1. Go to http://localhost:3000/trips
2. Click "Create New Trip"
3. Name it "Weekend Getaway"
4. Add some venues from the directory

### Test 4: Create an Account
1. Click "Sign In" in the header
2. Switch to "Sign Up" tab
3. Create an account with your email
4. You should be logged in

### Test 5: Login as Demo User
1. Click "Sign In"
2. Use:
   - Email: `demo@sipai.com`
   - Password: `demo1234`
3. Should work instantly

---

## Common Issues & Solutions

### Issue: "Can't reach database server"

**Solution:**
```bash
# Check Docker is running
docker ps

# If no containers, start them
docker compose up -d

# If port conflict, check what's using 5432
lsof -i :5432
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

### Issue: "Migration failed"

**Solution:**
```bash
# Check migration status
npx prisma migrate status

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Re-run setup
npx prisma migrate dev --name init
npm run db:seed
npm run db:migrate-data
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npx prisma generate
```

### Issue: Docker "port 5432 already in use"

**Solution:**
Either kill the process using that port, or change the port in `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Use 5433 instead
```

Then update `.env.local`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5433/sipai_dev
```

### Issue: Migration script errors

**Solution:**
```bash
# Check your data files exist
ls -la src/data/

# Re-run migration (it skips duplicates)
npm run db:migrate-data

# If still failing, check error messages
# Common issues:
# - Region not found: Make sure you ran db:seed first
# - Duplicate slugs: Safe to ignore, means venue already exists
```

---

## Useful Commands

### Database Management

```bash
# View database in browser
npm run db:studio

# Create a new migration (after schema changes)
npm run db:migrate

# Reset database (⚠️ deletes everything)
npm run db:reset

# Re-import static data
npm run db:migrate-data

# Generate Prisma Client (after schema changes)
npm run db:generate

# Deploy migrations to production
npm run db:migrate:deploy
```

### Docker Management

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# Stop and delete all data (⚠️ permanent)
docker compose down -v

# View logs
docker compose logs -f postgres

# Restart database
docker compose restart
```

### Development

```bash
# Start dev server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## What You've Built

After completing setup, you have:

✅ **Full-stack application** with Next.js 14 App Router
✅ **PostgreSQL database** with 1000+ venues
✅ **Real authentication** with NextAuth.js
✅ **AI-powered chat** with OpenAI GPT-4o-mini
✅ **User accounts** with preferences and interests
✅ **Trip planning** system
✅ **Favorites** and bookmarks
✅ **Review system** (ready to use)
✅ **Booking tracking** (ready to use)
✅ **Multi-region support** (easily expandable)
✅ **Multi-vertical ready** (can add new business types)

---

## Next Steps

### 1. Update API Routes to Use Database

Currently, the app still uses static data files. Next, you need to update API routes to query the database:

- [ ] Update `/api/venues` to query Prisma
- [ ] Update chat interface to fetch from database
- [ ] Update directory page to use database
- [ ] Update trip planning to save to database

### 2. Build User Profile Management

- [ ] Create user profile page
- [ ] Add preference editing
- [ ] Show user's saved favorites
- [ ] Display trip history

### 3. Implement Favorites System

- [ ] Add "Save to Favorites" buttons
- [ ] Create favorites page
- [ ] Add favorite indicators in directory

### 4. Add Review System

- [ ] Create review submission form
- [ ] Display reviews on venue pages
- [ ] Calculate average ratings
- [ ] Add helpful voting

### 5. Production Deployment

- [ ] Set up hosted PostgreSQL (Vercel Postgres, Supabase, etc.)
- [ ] Add production environment variables to Vercel
- [ ] Run migrations in production
- [ ] Migrate data to production database

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Frontend (Next.js + React)                 │
│  - Homepage with AI chat                    │
│  - Directory (wineries, restaurants, hotels)│
│  - Trip planning                            │
│  - User profiles                            │
│  - Authentication UI                        │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  API Routes (/app/api/*)                    │
│  - /api/auth/[...nextauth] (authentication) │
│  - /api/auth/register (user registration)   │
│  - /api/chat (AI chat)                      │
│  - /api/venues (future - venue queries)     │
│  - /api/trips (future - trip management)    │
│  - /api/favorites (future - save favorites) │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  Prisma ORM                                 │
│  - Type-safe database client                │
│  - Automatic migrations                     │
│  - Schema validation                        │
└────────────────┬────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────┐
│  PostgreSQL Database                        │
│  - 15 interconnected tables                 │
│  - 1000+ venues (wineries, restaurants,     │
│    hotels)                                  │
│  - Users with preferences                   │
│  - Trips, favorites, reviews, bookings      │
│  - Amenities, specialties, regions          │
└─────────────────────────────────────────────┘
```

---

## Support & Documentation

- **Quick Start:** `QUICKSTART_DATABASE.md`
- **Database Setup:** `DATABASE_SETUP.md`
- **Architecture:** `DATABASE_ARCHITECTURE.md`
- **Deployment:** `DEPLOYMENT.md`
- **Main README:** `README.md`

**Prisma Documentation:** https://www.prisma.io/docs
**NextAuth.js Documentation:** https://next-auth.js.org
**Next.js Documentation:** https://nextjs.org/docs

---

## Congratulations! 🎉

Your Sip.AI platform is now fully set up with a robust, scalable database containing over 1000 wine country venues. You're ready to build personalized wine country experiences powered by AI!

**Happy coding! 🍷**
