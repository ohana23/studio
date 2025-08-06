'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useProductSearch } from '@/hooks/useProductSearch'

interface Product {
  year: string
  title: string
  description: string
  image?: string
}

interface SearchFilterProps {
  products: Product[]
  onFilteredProducts: (products: Product[]) => void
}

export function SearchFilter({ products, onFilteredProducts }: SearchFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    filters,
    filteredProducts,
    years,
    deviceTypes,
    updateFilters,
    clearFilters,
    hasActiveFilters
  } = useProductSearch(products)

  // Update parent component with filtered products
  useEffect(() => {
    onFilteredProducts(filteredProducts)
  }, [filteredProducts, onFilteredProducts])

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={filters.query}
              onChange={(e) => updateFilters({ query: e.target.value })}
              className="pl-10"
            />
            {filters.query && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilters({ query: '' })}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {[filters.query, filters.year !== 'all', filters.deviceType !== 'all'].filter(Boolean).length}
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>

          {/* Filter Options */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Select value={filters.year} onValueChange={(value) => updateFilters({ year: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Device Type</label>
                <Select value={filters.deviceType} onValueChange={(value) => updateFilters({ deviceType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.query && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Search: "{filters.query}"
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters({ query: '' })}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.year !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Year: {filters.year}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters({ year: 'all' })}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {filters.deviceType !== 'all' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Type: {filters.deviceType}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters({ deviceType: 'all' })}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </CardContent>
    </Card>
  )
}