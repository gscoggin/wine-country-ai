'use client'

import { useState } from 'react'
import { Search, Filter, MapPin, Star, DollarSign, X } from 'lucide-react'

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void
  type: 'wineries' | 'restaurants' | 'hotels' | 'all'
}

export interface SearchFilters {
  query: string
  region: string
  priceRange: string
  rating: number
  amenities: string[]
  specialties: string[]
  sortBy: string
}

const regions = [
  { value: '', label: 'All Regions' },
  { value: 'Napa', label: 'Napa Valley' },
  { value: 'Sonoma', label: 'Sonoma County' },
  { value: 'Mendocino', label: 'Mendocino County' }
]

const priceRanges = [
  { value: '', label: 'Any Price' },
  { value: '$', label: '$ (Budget)' },
  { value: '$$', label: '$$ (Moderate)' },
  { value: '$$$', label: '$$$ (Upscale)' },
  { value: '$$$$', label: '$$$$ (Luxury)' }
]

const amenities = [
  'Spa', 'Pool', 'Restaurant', 'Wine Tasting', 'Concierge', 'Pet Friendly',
  'Outdoor Seating', 'Valet Parking', 'Fitness Center', 'Room Service'
]

const wineSpecialties = [
  'Cabernet Sauvignon', 'Chardonnay', 'Pinot Noir', 'Zinfandel', 'Sparkling Wine',
  'Merlot', 'Sauvignon Blanc', 'Gewürztraminer', 'Bordeaux Blend'
]

const cuisineTypes = [
  'French', 'Italian', 'American', 'Japanese-Fusion', 'Mediterranean', 'Farm-to-Table'
]

const hotelTypes = [
  'Luxury', 'Resort', 'Boutique Hotel', 'B&B', 'Inn'
]

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' }
]

export function SearchFilters({ onSearch, type }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    region: '',
    priceRange: '',
    rating: 0,
    amenities: [],
    specialties: [],
    sortBy: 'rating'
  })
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSpecialtyToggle = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      region: '',
      priceRange: '',
      rating: 0,
      amenities: [],
      specialties: [],
      sortBy: 'rating'
    }
    setFilters(clearedFilters)
    onSearch(clearedFilters)
  }

  const getSpecialtyOptions = () => {
    switch (type) {
      case 'wineries':
        return wineSpecialties
      case 'restaurants':
        return cuisineTypes
      case 'hotels':
        return hotelTypes
      default:
        return [...wineSpecialties, ...cuisineTypes, ...hotelTypes]
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-terracotta-100 p-4 sm:p-6 mb-8">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400" />
          <input
            type="text"
            placeholder={`Search ${type}...`}
            value={filters.query}
            onChange={(e) => handleInputChange('query', e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
        <button
          onClick={handleSearch}
          className="btn-primary px-6 sm:px-8 w-full sm:w-auto"
        >
          Search
        </button>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {regions.map((region) => (
          <button
            key={region.value}
            onClick={() => handleInputChange('region', region.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
              filters.region === region.value
                ? 'bg-terracotta-600 text-white shadow-md'
                : 'bg-tuscan-100 text-charcoal-700 hover:bg-terracotta-100'
            }`}
          >
            {region.label}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-gray-100 pt-6 space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-3">
              Price Range
            </label>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleInputChange('priceRange', range.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    filters.priceRange === range.value
                      ? 'bg-terracotta-600 text-white shadow-md'
                      : 'bg-tuscan-100 text-charcoal-700 hover:bg-terracotta-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-3">
              Minimum Rating
            </label>
            <div className="flex flex-wrap gap-2">
              {[4, 4.5, 4.8, 4.9].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleInputChange('rating', rating)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    filters.rating === rating
                      ? 'bg-gold-600 text-white shadow-md'
                      : 'bg-tuscan-100 text-charcoal-700 hover:bg-gold-100'
                  }`}
                >
                  <Star size={14} className="fill-current" />
                  <span>{rating}+</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-3">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    filters.amenities.includes(amenity)
                      ? 'bg-sage-600 text-white shadow-md'
                      : 'bg-tuscan-100 text-charcoal-700 hover:bg-sage-100'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-3">
              {type === 'wineries' ? 'Wine Specialties' :
               type === 'restaurants' ? 'Cuisine Types' :
               type === 'hotels' ? 'Hotel Types' : 'Specialties'}
            </label>
            <div className="flex flex-wrap gap-2">
              {getSpecialtyOptions().map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => handleSpecialtyToggle(specialty)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    filters.specialties.includes(specialty)
                      ? 'bg-terracotta-600 text-white shadow-md'
                      : 'bg-tuscan-100 text-charcoal-700 hover:bg-terracotta-100'
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleInputChange('sortBy', e.target.value)}
              className="input-field max-w-xs"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          {(filters.amenities.length > 0 || filters.specialties.length > 0 || filters.rating > 0) && (
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-3">
                Active Filters
              </label>
              <div className="flex flex-wrap gap-2">
                {filters.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-sage-100 text-sage-800 rounded-full text-sm font-medium"
                  >
                    <span>{amenity}</span>
                    <button
                      onClick={() => handleAmenityToggle(amenity)}
                      className="hover:text-sage-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {filters.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-terracotta-100 text-terracotta-800 rounded-full text-sm font-medium"
                  >
                    <span>{specialty}</span>
                    <button
                      onClick={() => handleSpecialtyToggle(specialty)}
                      className="hover:text-terracotta-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {filters.rating > 0 && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gold-100 text-gold-800 rounded-full text-sm font-medium">
                    <span>{filters.rating}+ Rating</span>
                    <button
                      onClick={() => handleInputChange('rating', 0)}
                      className="hover:text-gold-600 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-terracotta-600 hover:text-terracotta-700 font-medium underline transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

