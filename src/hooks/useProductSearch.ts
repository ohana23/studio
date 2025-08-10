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
      
      // Mac Family (notebooks & desktops)
      if (title.includes('macbook') || title.includes('imac') || title.includes('mac mini') || 
          title.includes('mac studio') || title.includes('mac pro') || title.includes('power mac') ||
          title.includes('studio display') || title.includes('pro display') || title.includes('cinema display') ||
          title.includes('thunderbolt display') || title.includes('apple studio display')) {
        types.add('Mac Family')
      }
      // iPhones
      else if (title.includes('iphone')) {
        types.add('iPhones')
      }
      // iPads
      else if (title.includes('ipad')) {
        types.add('iPads')
      }
      // iPods
      else if (title.includes('ipod')) {
        types.add('iPods')
      }
      // Watches
      else if (title.includes('watch')) {
        types.add('Watches')
      }
      // Spatial Computing
      else if (title.includes('vision')) {
        types.add('Spatial Computing')
      }
      // Personal Audio
      else if (title.includes('airpods') || title.includes('airpods pro') || title.includes('airpods max') ||
               title.includes('beats') || title.includes('ipod hi-fi') || title.includes('earpods') ||
               title.includes('in-ear headphones') || title.includes('headphones')) {
        types.add('Personal Audio')
      }
      // TV & Home
      else if (title.includes('apple tv') || title.includes('homepod') || title.includes('siri remote') ||
               title.includes('apple remote')) {
        types.add('TV & Home')
      }
      // Core Accessories & Peripherals
      else if (title.includes('magic keyboard') || title.includes('magic trackpad') || title.includes('magic mouse') ||
               title.includes('apple pencil') || title.includes('keyboard') || title.includes('mouse') || 
               title.includes('trackpad') || title.includes('display') || title.includes('monitor') ||
               title.includes('cable') || title.includes('adapter') || title.includes('charger') ||
               title.includes('magsafe') || title.includes('superdrive') || title.includes('airtag') ||
               title.includes('polishing cloth') || title.includes('battery pack')) {
        types.add('Core Accessories & Peripherals')
      }
      // Historic & Experimental Lines
      else if (title.includes('apple i') || title.includes('apple ii') || title.includes('apple iii') ||
               title.includes('lisa') || title.includes('newton') || title.includes('pippin') ||
               title.includes('quicktake') || title.includes('emate') || title.includes('laserwriter') ||
               title.includes('imagewriter') || title.includes('stylewriter') || title.includes('printer') ||
               title.includes('disk ii') || title.includes('disk iii') || title.includes('profile') ||
               title.includes('modem') || title.includes('network server') || title.includes('workgroup server') ||
               title.includes('xserve') || title.includes('airport') || title.includes('time capsule')) {
        types.add('Historic & Experimental Lines')
      }
      // Fallback for uncategorized items
      else {
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
          case 'Mac Family':
            return title.includes('macbook') || title.includes('imac') || title.includes('mac mini') || 
                   title.includes('mac studio') || title.includes('mac pro') || title.includes('power mac') ||
                   title.includes('studio display') || title.includes('pro display') || title.includes('cinema display') ||
                   title.includes('thunderbolt display') || title.includes('apple studio display')
          case 'iPhones':
            return title.includes('iphone')
          case 'iPads':
            return title.includes('ipad')
          case 'iPods':
            return title.includes('ipod')
          case 'Watches':
            return title.includes('watch')
          case 'Spatial Computing':
            return title.includes('vision')
          case 'Personal Audio':
            return title.includes('airpods') || title.includes('airpods pro') || title.includes('airpods max') ||
                   title.includes('beats') || title.includes('ipod hi-fi') || title.includes('earpods') ||
                   title.includes('in-ear headphones') || title.includes('headphones')
          case 'TV & Home':
            return title.includes('apple tv') || title.includes('homepod') || title.includes('siri remote') ||
                   title.includes('apple remote')
          case 'Core Accessories & Peripherals':
            return title.includes('magic keyboard') || title.includes('magic trackpad') || title.includes('magic mouse') ||
                   title.includes('apple pencil') || title.includes('keyboard') || title.includes('mouse') || 
                   title.includes('trackpad') || title.includes('display') || title.includes('monitor') ||
                   title.includes('cable') || title.includes('adapter') || title.includes('charger') ||
                   title.includes('magsafe') || title.includes('superdrive') || title.includes('airtag') ||
                   title.includes('polishing cloth') || title.includes('battery pack')
          case 'Historic & Experimental Lines':
            return title.includes('apple i') || title.includes('apple ii') || title.includes('apple iii') ||
                   title.includes('lisa') || title.includes('newton') || title.includes('pippin') ||
                   title.includes('quicktake') || title.includes('emate') || title.includes('laserwriter') ||
                   title.includes('imagewriter') || title.includes('stylewriter') || title.includes('printer') ||
                   title.includes('disk ii') || title.includes('disk iii') || title.includes('profile') ||
                   title.includes('modem') || title.includes('network server') || title.includes('workgroup server') ||
                   title.includes('xserve') || title.includes('airport') || title.includes('time capsule')
          case 'Other':
            // Products that don't fit into any of the above categories
            return !title.includes('macbook') && !title.includes('imac') && !title.includes('mac mini') && 
                   !title.includes('mac studio') && !title.includes('mac pro') && !title.includes('power mac') &&
                   !title.includes('studio display') && !title.includes('pro display') && !title.includes('cinema display') &&
                   !title.includes('thunderbolt display') && !title.includes('apple studio display') &&
                   !title.includes('iphone') && !title.includes('ipad') && !title.includes('ipod') &&
                   !title.includes('watch') && !title.includes('vision') &&
                   !title.includes('airpods') && !title.includes('beats') && !title.includes('earpods') &&
                   !title.includes('in-ear headphones') && !title.includes('headphones') &&
                   !title.includes('apple tv') && !title.includes('homepod') && !title.includes('siri remote') &&
                   !title.includes('apple remote') &&
                   !title.includes('magic keyboard') && !title.includes('magic trackpad') && !title.includes('magic mouse') &&
                   !title.includes('apple pencil') && !title.includes('keyboard') && !title.includes('mouse') && 
                   !title.includes('trackpad') && !title.includes('display') && !title.includes('monitor') &&
                   !title.includes('cable') && !title.includes('adapter') && !title.includes('charger') &&
                   !title.includes('magsafe') && !title.includes('superdrive') && !title.includes('airtag') &&
                   !title.includes('polishing cloth') && !title.includes('battery pack') &&
                   !title.includes('apple i') && !title.includes('apple ii') && !title.includes('apple iii') &&
                   !title.includes('lisa') && !title.includes('newton') && !title.includes('pippin') &&
                   !title.includes('quicktake') && !title.includes('emate') && !title.includes('laserwriter') &&
                   !title.includes('imagewriter') && !title.includes('stylewriter') && !title.includes('printer') &&
                   !title.includes('disk ii') && !title.includes('disk iii') && !title.includes('profile') &&
                   !title.includes('modem') && !title.includes('network server') && !title.includes('workgroup server') &&
                   !title.includes('xserve') && !title.includes('airport') && !title.includes('time capsule')
          default:
            return true
        }
      })
    }

    // Apply search query
    if (filters.query.trim()) {
      const searchResults = fuse.search(filters.query)
      const searchResultIds = new Set(searchResults.map((result: any) => result.item.title))
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