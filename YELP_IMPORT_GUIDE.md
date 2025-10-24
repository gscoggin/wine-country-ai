# Quick Start: Yelp Data Import

Get 800+ real wineries, restaurants, and hotels in your database in 30 minutes!

## Step 1: Get Your Yelp API Key (5 minutes)

1. **Go to Yelp Developers**: https://www.yelp.com/developers/v3/manage_app

2. **Create a New App**:
   - Click "Create New App"
   - App Name: "Wine Country AI" (or anything)
   - Industry: "Food & Restaurants"
   - Description: "Wine country venue discovery platform"
   - Click "Create New App"

3. **Copy Your API Key**:
   - You'll see your API Key on the app page
   - Copy it (looks like: `abcdef123456...`)

## Step 2: Add API Key to Environment (1 minute)

Add this line to your `.env.local` file:

```bash
# Add this line to .env.local
YELP_API_KEY=paste_your_api_key_here
```

Or run this command (replace with your actual key):

```bash
echo "YELP_API_KEY=your_actual_api_key_here" >> .env.local
```

## Step 3: Run the Import (30 minutes - automated)

Simply run:

```bash
./scripts/run-yelp-import.sh
```

**Or manually**:

```bash
export DATABASE_URL="postgresql://postgres:password@localhost:5432/sipai_dev"
export YELP_API_KEY="your_api_key_here"
npx tsx scripts/import-yelp.ts
```

## What Gets Imported

### Wineries (~350 venues)
- Napa Valley wineries
- Sonoma County wineries
- Mendocino wineries
- Tasting rooms
- Wine bars

### Restaurants (~350 venues)
- Fine dining
- Casual restaurants
- Wine country cuisine
- Michelin-rated establishments

### Hotels (~100 venues)
- Luxury resorts
- Bed & breakfasts
- Boutique hotels
- Inn accommodations

### Data Included Per Venue
- ✅ Name, address, phone
- ✅ Yelp ratings and review counts
- ✅ Price levels ($, $$, $$$, $$$$)
- ✅ Multiple photos per venue
- ✅ Categories and specialties
- ✅ Geographic coordinates
- ✅ Website links

## Import Progress

You'll see output like this:

```
🍷 Starting Yelp data import...

🍇 Importing wineries...

📍 Searching Napa...
   Found 50 wineries
✅ Imported: Domaine Carneros (WINERY)
✅ Imported: Stag's Leap Wine Cellars (WINERY)
✅ Imported: Opus One Winery (WINERY)
...

🍽️  Importing restaurants...

📍 Searching Napa...
   Found 50 restaurants
✅ Imported: The French Laundry (RESTAURANT)
✅ Imported: Bouchon Bistro (RESTAURANT)
...

✨ Import complete!
📊 Total imported: 823
⏭️  Total skipped (existing): 0
```

## After Import

1. **View your data**: Visit http://localhost:3000/directory
2. **Try the AI chat**: Ask about wineries in Napa
3. **Create a trip**: Add venues to your itinerary

## Troubleshooting

### "YELP_API_KEY not found"
- Make sure you added it to `.env.local`
- Restart any running processes after adding the key

### "Database is not running"
```bash
podman start sipai-postgres
```

### "Rate limit exceeded"
- Yelp free tier: 5,000 calls/day
- If you hit the limit, wait 24 hours or continue tomorrow
- The script will resume where it left off

### "Duplicate venue" errors
- Normal! The script skips venues already in the database
- You can safely re-run the import

### Import is slow
- Normal! ~800 venues with rate limiting takes 20-30 minutes
- The script waits 200ms between each request (Yelp requirement)
- Goes to background with Ctrl+Z if needed

## Cost

**FREE** - Yelp Fusion API is completely free for the first 5,000 calls/day

## Legal Requirements

When displaying Yelp data on your site:

1. **Display Yelp logo** on venue pages
2. **Link to Yelp listing** for each venue
3. **Include attribution**: "Powered by Yelp"

See Yelp's terms of service for details.

## Next Steps

After importing:

1. ✅ **Manually enhance top venues** - Edit descriptions for featured wineries
2. ✅ **Add user photo uploads** - Let users contribute images
3. ✅ **Schedule monthly updates** - Keep ratings current
4. ✅ **Test the AI chat** - Ask for recommendations

## Need Help?

Check these files:
- `scripts/README.md` - Detailed script documentation
- `DATA_SOURCING_PLAN.md` - Complete data strategy
- `scripts/import-yelp.ts` - The import script source

Or run the import with verbose output:
```bash
DEBUG=* npx tsx scripts/import-yelp.ts
```
