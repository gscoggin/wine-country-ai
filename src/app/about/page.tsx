'use client'

import { Wine, MapPin, Users, Star, Heart, Award, Globe, Phone } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-wine-600 to-vineyard-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Wine Country AI
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-wine-100">
              Your intelligent companion for discovering Northern California's wine regions
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe that every wine country visit should be extraordinary. Our AI-powered platform 
              combines local expertise with cutting-edge technology to help you discover the perfect 
              wineries, restaurants, and experiences tailored to your preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-wine-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wine size={32} className="text-wine-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Knowledge</h3>
              <p className="text-gray-600">
                Our AI is trained on extensive knowledge of Northern California's wine regions, 
                from hidden gems to world-renowned establishments.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-vineyard-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-vineyard-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Recommendations</h3>
              <p className="text-gray-600">
                Get customized suggestions based on your taste preferences, budget, and travel style 
                for a truly personalized experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gold-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">
                Built by wine enthusiasts, for wine enthusiasts. We're constantly updating our 
                recommendations based on community feedback and local insights.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600">
              Comprehensive tools to plan your perfect wine country adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-wine-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Wine size={24} className="text-wine-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Chat</h3>
                  <p className="text-gray-600">
                    Ask our AI assistant anything about wine country. Get instant, personalized 
                    recommendations for wineries, restaurants, hotels, and experiences.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-vineyard-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-vineyard-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Directory</h3>
                  <p className="text-gray-600">
                    Browse our extensive database of wineries, restaurants, and hotels with 
                    advanced search and filtering capabilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star size={24} className="text-gold-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Trip Planning</h3>
                  <p className="text-gray-600">
                    Create and manage your wine country itineraries with our intuitive trip 
                    planning tools. Save your favorites and track your bookings.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-wine-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart size={24} className="text-wine-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Curated Experiences</h3>
                  <p className="text-gray-600">
                    Discover unique experiences like hot air balloon rides, cooking classes, 
                    and exclusive wine tastings that make your trip unforgettable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Regions Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Wine Regions We Cover</h2>
            <p className="text-lg text-gray-600">
              From Napa's luxury estates to Mendocino's organic vineyards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-wine-500 to-wine-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">N</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Napa Valley</h3>
              <p className="text-gray-600 mb-4">
                World-renowned for premium Cabernet Sauvignon and luxury wine experiences. 
                Home to iconic wineries and Michelin-starred restaurants.
              </p>
              <div className="text-sm text-gray-500">
                <p>400+ Wineries</p>
                <p>Specialties: Cabernet, Chardonnay, Sparkling</p>
              </div>
            </div>

            <div className="card text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-vineyard-500 to-vineyard-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">S</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sonoma County</h3>
              <p className="text-gray-600 mb-4">
                Diverse microclimates producing exceptional Pinot Noir, Chardonnay, and Zinfandel. 
                Known for family-owned wineries and farm-to-table dining.
              </p>
              <div className="text-sm text-gray-500">
                <p>425+ Wineries</p>
                <p>Specialties: Pinot Noir, Chardonnay, Zinfandel</p>
              </div>
            </div>

            <div className="card text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mendocino County</h3>
              <p className="text-gray-600 mb-4">
                Organic and biodynamic wines with sustainable practices and unique terroir. 
                A haven for eco-conscious wine lovers.
              </p>
              <div className="text-sm text-gray-500">
                <p>100+ Wineries</p>
                <p>Specialties: Pinot Noir, Sparkling, Gewürztraminer</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-wine-600 to-vineyard-600 rounded-xl p-8 text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-wine-100">
                Helping wine enthusiasts discover their perfect wine country experience
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">925+</div>
                <div className="text-wine-100">Wineries Listed</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">150+</div>
                <div className="text-wine-100">Restaurants</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-wine-100">Hotels & Inns</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">100+</div>
                <div className="text-wine-100">Unique Experiences</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 mb-8">
            Have questions or suggestions? We'd love to hear from you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-wine-100 rounded-full flex items-center justify-center">
                <Globe size={20} className="text-wine-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Website</div>
                <div className="text-sm text-gray-600">winecountryai.com</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-vineyard-100 rounded-full flex items-center justify-center">
                <Phone size={20} className="text-vineyard-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Phone</div>
                <div className="text-sm text-gray-600">(707) 555-WINE</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                <Award size={20} className="text-gold-600" />
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Support</div>
                <div className="text-sm text-gray-600">help@winecountryai.com</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

