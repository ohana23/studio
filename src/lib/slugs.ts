import { products } from './products';

// Function to convert a product title to a URL-friendly slug
function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Create a map of slugs to products, handling duplicates by adding year suffix
export const productSlugMap = new Map<string, typeof products[0]>();
export const productToSlugMap = new Map<typeof products[0], string>();

// Build the maps
products.forEach((product) => {
  let baseSlug = titleToSlug(product.title);
  let finalSlug = baseSlug;
  
  // Check if the slug already exists
  let counter = 1;
  while (productSlugMap.has(finalSlug)) {
    // If it exists and it's a different product, append year or counter
    const existingProduct = productSlugMap.get(finalSlug)!;
    if (existingProduct.title !== product.title || existingProduct.year !== product.year) {
      finalSlug = `${baseSlug}-${product.year}`;
      
      // If year-based slug still conflicts, add counter
      if (productSlugMap.has(finalSlug)) {
        finalSlug = `${baseSlug}-${product.year}-${counter}`;
        counter++;
      }
    } else {
      // Same product, don't add again
      return;
    }
  }
  
  productSlugMap.set(finalSlug, product);
  productToSlugMap.set(product, finalSlug);
});

// Helper functions
export function getProductBySlug(slug: string): typeof products[0] | undefined {
  return productSlugMap.get(slug);
}

export function getSlugByProduct(product: typeof products[0]): string | undefined {
  return productToSlugMap.get(product);
}

// Get all slugs
export function getAllProductSlugs(): string[] {
  return Array.from(productSlugMap.keys());
}