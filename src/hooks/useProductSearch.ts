import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'

interface Product {
  year: string
  title: string
  description: string
  image?: string
}

interface SearchFilters {
  query: string
  year: string
  deviceType: string
}

export function useProductSearch(products: Product[]) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    year: 'all',
    deviceType: 'all'
  })

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(products, {
      keys: ['title', 'description', 'year'],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    })
  }, [products])

  // Get unique years and device types for filters
  const years = useMemo(() => {
    const uniqueYears = [...new Set(products.map(p => p.year))].sort((a, b) => b.localeCompare(a))
    return uniqueYears
  }, [products])

  const deviceTypes = useMemo(() => {
    const types = new Set<string>()
    products.forEach(product => {
      const title = product.title.toLowerCase()
      if (title.includes('iphone') || title.includes('ipad') || title.includes('ipod')) {
        types.add('Mobile')
      } else if (title.includes('mac') || title.includes('power') || title.includes('imac')) {
        types.add('Computer')
      } else if (title.includes('watch')) {
        types.add('Wearable')
      } else if (title.includes('printer') || title.includes('monitor') || title.includes('disk')) {
        types.add('Accessory')
      } else {
        types.add('Other')
      }
    })
    return Array.from(types).sort()
  }, [products])

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = products

    // Apply year filter
    if (filters.year !== 'all') {
      filtered = filtered.filter(product => product.year === filters.year)
    }

    // Apply device type filter
    if (filters.deviceType !== 'all') {
      filtered = filtered.filter(product => {
        const title = product.title.toLowerCase()
        switch (filters.deviceType) {
          case 'Mobile':
            return title.includes('iphone') || title.includes('ipad') || title.includes('ipod')
          case 'Computer':
            return title.includes('mac') || title.includes('power') || title.includes('imac')
          case 'Wearable':
            return title.includes('watch')
          case 'Accessory':
            return title.includes('printer') || title.includes('monitor') || title.includes('disk')
          case 'Other':
            return !title.includes('iphone') && !title.includes('ipad') && !title.includes('ipod') &&
                   !title.includes('mac') && !title.includes('power') && !title.includes('imac') &&
                   !title.includes('watch') && !title.includes('printer') && !title.includes('monitor') && !title.includes('disk')
          default:
            return true
        }
      })
    }

    // Apply search query
    if (filters.query.trim()) {
      const searchResults = fuse.search(filters.query)
      const searchResultIds = new Set(searchResults.map(result => result.item.title))
      filtered = filtered.filter(product => searchResultIds.has(product.title))
    }

    return filtered
  }, [products, filters, fuse])

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      year: 'all',
      deviceType: 'all'
    })
  }

  const hasActiveFilters = filters.query || filters.year !== 'all' || filters.deviceType !== 'all'

  return {
    filters,
    filteredProducts,
    years,
    deviceTypes,
    updateFilters,
    clearFilters,
    hasActiveFilters
  }
}