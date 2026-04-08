import rawProductData from './raw-products.json';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  gender: 'Women' | 'Men' | 'Unisex';
  image: string;
  brand: string;
  qcLink: string;
  buyLink: string;
};

// All available categories from the data
export const CATEGORIES = [
  'T-SHIRTS',
  'SHOES',
  'HOODIES',
  'DRESSES',
  'ACCESSOIRES',
  'JACKETS',
  'ALO',
  'SHIRTS',
  'PANTS',
  'TOPS',
  'SHORTS',
  'BAGS',
  'SWEATERS',
  'ELECTRONICS',
  'PARFUME',
  'ZARA',
  'SKIRTS',
  'LULULEMON',
] as const;

// Gender inference map based on category characteristics
const GENDER_CATEGORY_MAP: Record<string, 'Women' | 'Men' | 'Unisex'> = {
  'T-SHIRTS': 'Unisex',
  'SHOES': 'Unisex',
  'HOODIES': 'Unisex',
  'DRESSES': 'Women',
  'ACCESSOIRES': 'Unisex',
  'JACKETS': 'Unisex',
  'ALO': 'Women',
  'SHIRTS': 'Unisex',
  'PANTS': 'Unisex',
  'TOPS': 'Women',
  'SHORTS': 'Unisex',
  'BAGS': 'Unisex',
  'SWEATERS': 'Unisex',
  'ELECTRONICS': 'Unisex',
  'PARFUME': 'Unisex',
  'ZARA': 'Unisex',
  'SKIRTS': 'Women',
  'LULULEMON': 'Women',
};

// Infer gender from category and product name
function inferGender(category: string, name: string): 'Women' | 'Men' | 'Unisex' {
  const upperCategory = category.toUpperCase();
  const lowerName = name.toLowerCase();

  // Check name for explicit gender markers
  if (lowerName.includes('women') || lowerName.includes("women's") || lowerName.includes('womens')) {
    return 'Women';
  }
  if (lowerName.includes('men') || lowerName.includes("men's") || lowerName.includes('mens') || 
      lowerName.includes('boy') || lowerName.includes('male')) {
    return 'Men';
  }
  if (lowerName.includes('unisex') || lowerName.includes('one size')) {
    return 'Unisex';
  }

  // Fall back to category mapping
  return GENDER_CATEGORY_MAP[upperCategory] || 'Unisex';
}

// Transform raw JSON data to our Product format
function transformProducts(rawData: any[]): Product[] {
  return rawData
    .map((item: any, index: number) => {
      const image = item['object-contain src'] || item.image || '';
      const categoryRaw = item['text-[0_65rem]'] || item.category || 'JACKETS';
      const brandAndModel = item['text-base'] || item.name || `Product ${index}`;
      const priceStr = item['text-2xl'] || item.price || '0';
      const price = parseFloat(priceStr.toString().replace('$', ''));
      const qcLink = item['flex-1 href'] || item.qcLink || '#';
      const buyLink = item['flex-1 href (2)'] || item.buyLink || '#';

      // Extract brand from name
      const nameParts = brandAndModel.split(' ');
      const brand = nameParts[0] || 'Brand';

      const category = categoryRaw.toUpperCase() || 'JACKETS';
      const gender = inferGender(category, brandAndModel);

      return {
        id: `prod_${index + 1}`,
        name: brandAndModel,
        price: isNaN(price) ? 0 : price,
        category,
        gender,
        image,
        brand,
        qcLink,
        buyLink,
      };
    })
    .filter((p) => p.image && p.name && p.price >= 0);
}

export const products: Product[] = transformProducts(rawProductData);

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
