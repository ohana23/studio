import { products } from './products';

// Simple index-based product lookup - much simpler than slug generation!
// Note: To prevent URL breakage when adding/removing products, always add new products
// to the END of the array, never insert them in the middle or reorder existing ones.
export function getProductByIndex(index: string): typeof products[0] | undefined {
  const idx = parseInt(index, 10);
  if (isNaN(idx) || idx < 0 || idx >= products.length) {
    return undefined;
  }
  return products[idx];
}

export function getIndexByProduct(product: typeof products[0]): number | undefined {
  const index = products.findIndex(p => 
    p.title === product.title && p.year === product.year
  );
  return index === -1 ? undefined : index;
}

// Get all valid indices as strings
export function getAllProductIndices(): string[] {
  return products.map((_, index) => index.toString());
}

// Legacy function names for easier migration (can be removed later)
export const getProductBySlug = getProductByIndex;
export const getSlugByProduct = getIndexByProduct;