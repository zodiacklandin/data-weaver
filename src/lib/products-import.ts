import { products as rawProducts, CATEGORIES as RAW_CATEGORIES, type Product as RawProduct } from './products';

export type Product = RawProduct;

// Re-export categories
export const CATEGORIES = RAW_CATEGORIES;

// Export the products directly
export const products: Product[] = rawProducts;

// Get products by category
export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category.toUpperCase());
}

// Search products
export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.brand.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery)
  );
}

// Get category stats
export function getCategoryStats() {
  const stats: Record<string, number> = {};
  CATEGORIES.forEach((cat) => {
    stats[cat] = products.filter((p) => p.category === cat).length;
  });
  return stats;
}

// Get all categories sorted by product count
export function getSortedCategories() {
  const stats = getCategoryStats();
  return Object.entries(stats)
    .filter(([_, count]) => count > 0)
    .sort(([_, a], [__, b]) => b - a)
    .map(([cat, count]) => ({ name: cat, count }));
}
