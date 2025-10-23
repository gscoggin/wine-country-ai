# Wine Country AI

An AI-powered platform for discovering and planning wine country adventures in Northern California. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🍷 AI-Powered Chat Interface
- Intelligent recommendations for wineries, restaurants, and experiences
- Personalized suggestions based on user preferences
- Real-time chat with OpenAI GPT-4 integration

### 📍 Comprehensive Directory
- **925+ Wineries** across Napa, Sonoma, and Mendocino
- **150+ Restaurants** from casual to Michelin-starred
- **50+ Hotels & Inns** from luxury resorts to boutique B&Bs
- Advanced search and filtering capabilities

### 🗺️ Trip Planning
- Create and manage wine country itineraries
- Save favorite locations and experiences
- Track bookings and reservations
- Personalized trip recommendations

### 🎯 Curated Experiences
- Hot air balloon rides over vineyards
- Wine and food pairing classes
- Private winery tours and tastings
- Cooking classes with local chefs
- Spa and wellness retreats

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom wine-themed colors
- **AI**: OpenAI GPT-4 API
- **Authentication**: NextAuth.js (configured but using mock data)
- **Database**: Prisma (configured but using static data)
- **Icons**: Lucide React
- **UI Components**: Custom components with Tailwind

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wine-country-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── directory/         # Directory page
│   ├── trips/            # Trip planning page
│   ├── about/            # About page
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ChatInterface.tsx # AI chat component
│   ├── Header.tsx        # Navigation header
│   ├── LoginModal.tsx    # Authentication modal
│   ├── SearchFilters.tsx # Search and filter component
│   └── ...               # Other components
├── data/                 # Static data files
│   ├── wineries.ts       # Winery data
│   ├── restaurants.ts    # Restaurant data
│   └── hotels.ts         # Hotel data
└── types/                # TypeScript type definitions
    └── wine-country.ts   # Main type definitions
```

## Key Components

### ChatInterface
AI-powered chat component that provides personalized recommendations using OpenAI's GPT-4 model.

### SearchFilters
Comprehensive search and filtering system for the directory with support for:
- Text search
- Region filtering (Napa, Sonoma, Mendocino)
- Price range filtering
- Rating filtering
- Amenity filtering
- Specialty filtering (wine types, cuisine, hotel types)

### Trip Planning
Complete trip management system allowing users to:
- Create new trips
- Add wineries, restaurants, and hotels to itineraries
- Track booking status
- View trip details and manage schedules

## Data Structure

The application uses TypeScript interfaces for type safety:

- **Winery**: Name, region, specialties, tasting fees, ratings, etc.
- **Restaurant**: Cuisine type, price range, Michelin stars, etc.
- **Hotel**: Type, amenities, price range, spa services, etc.
- **Experience**: Duration, price, seasonality, difficulty, etc.
- **Trip**: User trips with itineraries and booking status

## Customization

### Colors
The app uses a custom wine-themed color palette defined in `tailwind.config.js`:
- **Wine**: Deep reds and pinks
- **Vineyard**: Greens for nature/vineyards
- **Gold**: Warm golds for luxury/premium

### Adding New Data
To add new wineries, restaurants, or hotels:
1. Update the respective data file in `src/data/`
2. Ensure the data matches the TypeScript interfaces
3. The directory will automatically include the new entries

## Future Enhancements

- [ ] Database integration with Prisma
- [ ] Real authentication system
- [ ] Map integration for location visualization
- [ ] Booking system integration
- [ ] User reviews and ratings
- [ ] Mobile app development
- [ ] Social features and trip sharing
- [ ] Advanced AI recommendations based on user history

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact:
- Email: help@winecountryai.com
- Phone: (707) 555-WINE

---

Built with ❤️ for wine enthusiasts exploring Northern California's wine country.

