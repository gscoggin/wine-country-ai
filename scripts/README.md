# Data Import Scripts

Scripts for populating the Wine Country AI database with real venue data.

## Quick Start (Recommended: Yelp - FREE)

### 1. Get Yelp API Key (Free)

1. Go to https://www.yelp.com/developers/v3/manage_app
2. Create a new app
3. Copy your API Key

### 2. Add to Environment

```bash
# Add to .env.local
YELP_API_KEY=your_yelp_api_key_here
```

### 3. Run Import

```bash
# Make sure database is running
export DATABASE_URL="postgresql://wineuser:winepass@localhost:5432/winecountry"

# Run import script
npx tsx scripts/import-yelp.ts
```

This will import:
- ~350 wineries
- ~350 restaurants
- ~100 hotels

**Total**: ~800 real venues with photos, ratings, and reviews (100% FREE)

## Alternative: Google Places API (Better photos, costs money)

### 1. Get Google API Key

1. Go to https://console.cloud.google.com/
2. Enable Places API
3. Create API key
4. Add billing (Free tier: $200/month credit)

### 2. Create Google Import Script

```bash
npm install @googlemaps/google-maps-services-js
```

See `DATA_SOURCING_PLAN.md` for full Google Places implementation.

**Cost**: ~$50-100 for initial import of 1,000 venues with photos

## What Gets Imported

### Venue Data
- Name, address, phone, website
- Ratings and review counts
- Price levels
- Categories/specialties
- Geographic coordinates
- Multiple photos per venue

### Relationships
- Regions (Napa, Sonoma, etc.)
- Specialties (Cabernet, Italian, etc.)
- Amenities (coming soon)

## Rate Limits

### Yelp (Free)
- 5,000 calls/day
- Our script: ~800-1,000 calls total
- Rate limited to 5 requests/second

### Google Places (Paid)
- Pay per request
- No rate limits on paid tier
- ~$0.03 per place details request

## Troubleshooting

### "YELP_API_KEY not found"
Make sure `.env.local` has the key and restart any running processes.

### "Duplicate venue" errors
Normal! The script skips venues already in the database.

### "Rate limit exceeded"
Wait 24 hours (Yelp resets daily) or implement request queuing.

### Database connection errors
Make sure Podman database is running:
```bash
podman ps  # Should show wine-db container
```

## Next Steps After Import

1. **Verify data**: Check http://localhost:3000/directory
2. **Enhance descriptions**: Use AI to improve venue descriptions
3. **Add amenities**: Manually curate common amenities
4. **User contributions**: Enable photo uploads from users
5. **Regular updates**: Run import monthly to refresh ratings

## Data Attribution

When using API data, you must:

### Yelp
- Display Yelp logo on venue pages
- Link back to Yelp listing
- Include "Powered by Yelp" attribution

### Google Places
- Display "Powered by Google" logo
- Include Google attribution text
- Follow usage guidelines

See individual API documentation for specific requirements.
