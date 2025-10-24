#!/bin/bash

# Yelp Data Import Script Runner
# This script checks prerequisites and runs the Yelp data import

set -e  # Exit on error

echo "🍷 Wine Country AI - Yelp Data Import"
echo "======================================"
echo ""

# Check if YELP_API_KEY is set in .env.local
if ! grep -q "YELP_API_KEY=" .env.local 2>/dev/null; then
    echo "❌ YELP_API_KEY not found in .env.local"
    echo ""
    echo "📝 To get your Yelp API key:"
    echo "   1. Go to: https://www.yelp.com/developers/v3/manage_app"
    echo "   2. Create a new app (takes 2 minutes)"
    echo "   3. Copy your API Key"
    echo "   4. Add this line to .env.local:"
    echo "      YELP_API_KEY=your_api_key_here"
    echo ""
    exit 1
fi

# Check if YELP_API_KEY has a value
YELP_KEY=$(grep "YELP_API_KEY=" .env.local | cut -d '=' -f2)
if [ -z "$YELP_KEY" ] || [ "$YELP_KEY" = "your_yelp_api_key_here" ]; then
    echo "❌ YELP_API_KEY is not set to a valid value in .env.local"
    echo ""
    echo "📝 Please replace 'your_yelp_api_key_here' with your actual API key"
    echo ""
    exit 1
fi

echo "✅ Yelp API key found"

# Check if database is running
if ! podman ps --filter name=sipai-postgres --format "{{.Names}}" | grep -q sipai-postgres; then
    echo "❌ Database container 'sipai-postgres' is not running"
    echo ""
    echo "📝 Start the database with:"
    echo "   podman start sipai-postgres"
    echo ""
    exit 1
fi

echo "✅ Database is running"

# Check database connection
if ! podman exec sipai-postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "❌ Database is not ready"
    echo ""
    echo "⏳ Waiting for database to be ready..."
    sleep 3
fi

echo "✅ Database is ready"
echo ""

# Export environment variable for the import script
export $(grep "^DATABASE_URL=" .env.local)
export $(grep "^YELP_API_KEY=" .env.local)

echo "🚀 Starting import..."
echo "   This will take approximately 10-30 minutes"
echo "   Importing ~800+ venues from Yelp API"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Run the import script
npx tsx scripts/import-yelp.ts

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✨ Import complete!"
echo ""
echo "📊 View your data at: http://localhost:3000/directory"
echo ""
