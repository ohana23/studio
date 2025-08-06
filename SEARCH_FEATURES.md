# Search and Filter Features

## Overview
The application now includes a comprehensive search and filtering system that allows users to find Apple products quickly and efficiently.

## Features

### 🔍 Fuzzy Search
- **Real-time search**: Search as you type with instant results
- **Fuzzy matching**: Uses Fuse.js for intelligent fuzzy search
- **Multi-field search**: Searches across product titles, descriptions, and years
- **Configurable threshold**: Set to 0.3 for optimal balance between accuracy and flexibility

### 📅 Year Filter
- **Dynamic year list**: Automatically populated from available products
- **Chronological sorting**: Years displayed in descending order (newest first)
- **Clear filtering**: Easy to reset to show all years

### 📱 Device Type Filter
- **Smart categorization**: Automatically categorizes products into:
  - **Mobile**: iPhone, iPad, iPod products
  - **Computer**: Mac, Power Mac, iMac products
  - **Wearable**: Apple Watch products
  - **Accessory**: Printers, monitors, disk drives
  - **Other**: Products that don't fit other categories

### 🎯 Filter Management
- **Active filter indicators**: Shows number of active filters
- **Individual filter removal**: Click X on any filter badge to remove it
- **Clear all filters**: One-click button to reset all filters
- **Filter badges**: Visual representation of active filters

### 📊 Results Display
- **Real-time count**: Shows "X of Y products" as you filter
- **Responsive design**: Works on desktop and mobile devices
- **Smooth animations**: Collapsible filter panel with smooth transitions

## Technical Implementation

### Components
- `SearchFilter.tsx`: Main search and filter component
- `useProductSearch.ts`: Custom hook for search logic
- Integration with existing `page.tsx`

### Dependencies
- `fuse.js`: For fuzzy search functionality
- `lucide-react`: For search and filter icons
- `@radix-ui/react-select`: For dropdown components
- `@radix-ui/react-badge`: For filter badges

### Search Configuration
```typescript
const fuse = new Fuse(products, {
  keys: ['title', 'description', 'year'],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
})
```

## Usage

1. **Search**: Type in the search box to find products by name, description, or year
2. **Filter by Year**: Click "Filters" and select a specific year
3. **Filter by Device Type**: Choose from Mobile, Computer, Wearable, Accessory, or Other
4. **Combine Filters**: Use multiple filters together for precise results
5. **Clear Filters**: Click individual X buttons or "Clear all" to reset

## Performance
- **Memoized search**: Uses React's useMemo for efficient re-computation
- **Debounced updates**: Search updates as you type without performance issues
- **Optimized filtering**: Efficient filtering algorithms for large product lists