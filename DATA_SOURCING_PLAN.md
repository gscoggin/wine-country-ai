# Wine Country AI - Data Sourcing Strategy

## Overview
Strategy for building a comprehensive, sustainable dataset of Northern California wine country venues.

## Phase 1: Initial Data Collection (One-time)

### Option A: Google Places API (Recommended)
**Best for**: Comprehensive, high-quality data with minimal effort

```javascript
// Script: scripts/import-google-places.js
// Fetch wineries, restaurants, hotels in Napa, Sonoma, Mendocino
// Budget: ~$50-100 one-time cost for ~1,000 venues
```

**Steps**:
1. Search for venues by type and location
2. Get detailed place information
3. Download up to 10 photos per venue
4. Import into PostgreSQL database
5. Store photo URLs (or download and self-host)

**Pros**:
- Most comprehensive data
- High-quality photos
- Real user reviews
- Regularly updated by users
- One-time cost, own the data forever

**Cons**:
- Initial cost (~$50-100)
- Must display Google attribution
- Photos hosted on Google (or need to download)

### Option B: Yelp Fusion API (Free alternative)
**Best for**: Reviews and ratings without cost

```javascript
// Script: scripts/import-yelp-data.js
// Free tier: 5,000 calls/day
// Can import 1,000 venues in one day
```

**Pros**:
- Completely free
- Excellent reviews
- Good photo quality
- Business hours included

**Cons**:
- Must display Yelp branding
- Can't cache photos (must link to Yelp)
- Rate limited

### Option C: Hybrid Approach (Best Quality)
**Recommended for production**

1. **Yelp API** - Free business data, reviews, ratings
2. **Google Places** - Photos and additional details ($50-100)
3. **OpenStreetMap** - Geographic boundaries and maps
4. **Manual curation** - Verify top 100 venues manually

## Phase 2: Image Strategy

### Option 1: Use API-provided images
- Link to Google Places photos (must credit Google)
- Link to Yelp photos (must credit Yelp)
- **Pros**: Free, always updated
- **Cons**: Dependent on external services

### Option 2: Download and self-host
- Download images during import
- Store in `/public/images/venues/`
- Or use CDN (Vercel, Cloudinary)
- **Pros**: Full control, faster loading
- **Cons**: Storage costs, copyright considerations

### Option 3: User-generated + Unsplash
- Unsplash API for generic winery/restaurant photos
- Encourage users to upload photos
- **Pros**: Free, scalable
- **Cons**: Less specific to actual venues

### Option 4: AI-Generated placeholder images
- Use DALL-E or Stable Diffusion for generic venue images
- Only for venues without real photos
- **Pros**: Unlimited, free (if using open models)
- **Cons**: Not authentic, may mislead users

## Phase 3: Ongoing Data Updates

### Strategy A: Periodic API syncs
- Monthly update script
- Sync new reviews, ratings, photos
- Cost: ~$10-20/month for Google Places
- Or free with Yelp (daily limit)

### Strategy B: User contributions
- Allow users to suggest edits
- Upload photos
- Add reviews
- Moderate submissions

### Strategy C: Static with manual updates
- Import once, update manually
- Focus on AI recommendations from static data
- Lowest cost, less current

## Recommended Implementation Plan

### Week 1: Initial Import Script
```bash
# Install dependencies
npm install @googlemaps/google-maps-services-js
npm install yelp-fusion

# Create import scripts
scripts/
  ├── import-yelp.ts          # Primary data source (free)
  ├── import-google-places.ts # Photos and verification
  ├── import-images.ts        # Download and optimize images
  └── verify-data.ts          # Check for duplicates, validate
```

### Week 2: Build Dataset
1. Run Yelp import for all venues (free)
2. Optionally run Google Places for top 200 venues (photos)
3. Download and optimize images
4. Populate database

### Week 3: Enhance with Open Data
1. Cross-reference with CA ABC licenses
2. Add winery AVA (American Viticultural Area) data
3. Add specialty/varietal information

### Week 4: User Features
1. Allow photo uploads
2. Add user reviews (supplement API data)
3. Build moderation system

## Cost Analysis

### Option 1: Yelp Only (Free)
- **Setup**: $0
- **Monthly**: $0
- **Images**: Link to Yelp (must show attribution)
- **Quality**: Good
- **Coverage**: Excellent for restaurants, good for wineries

### Option 2: Google Places (One-time)
- **Setup**: $50-100 (1,000 venues with photos)
- **Monthly**: $0 (no updates)
- **Images**: Download and self-host
- **Quality**: Excellent
- **Coverage**: Best overall

### Option 3: Hybrid (Recommended)
- **Setup**: $30-50 (Google photos for top venues only)
- **Monthly**: $0 (Yelp for updates)
- **Images**: Mix of self-hosted and links
- **Quality**: Excellent
- **Coverage**: Comprehensive

### Option 4: Manual Curation
- **Setup**: $0
- **Monthly**: Your time
- **Images**: Unsplash, user uploads
- **Quality**: Can be excellent if curated well
- **Coverage**: Limited to what you add

## Legal Considerations

### API Terms of Service
- **Google**: Must display "Powered by Google", can cache data for 30 days
- **Yelp**: Must display Yelp logo, cannot cache photos
- **Foursquare**: Attribution required
- **OpenStreetMap**: Must credit ODbL

### Photos
- API photos: Check terms (usually can link, may need to download)
- User uploads: Need terms of service granting license
- Stock photos: Use Unsplash (free, no attribution required)

## Next Steps

1. **Decide on primary data source**:
   - Start with Yelp (free, good data)
   - Add Google Places for photos later if needed

2. **Create import scripts**:
   - `scripts/import-yelp.ts`
   - Focus on Napa, Sonoma, Mendocino counties

3. **Set up image handling**:
   - Start with Yelp links (easiest)
   - Move to self-hosted later

4. **Build data enrichment**:
   - Use AI to enhance descriptions
   - Add AVA/region data
   - Categorize by experience type

5. **Plan for updates**:
   - Weekly/monthly Yelp sync
   - User contribution system
   - Manual curation for top venues
