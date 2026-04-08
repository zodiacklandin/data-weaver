'use client';

import { useFeaturedProducts } from '@/hooks/use-featured-products';
import { products } from '@/lib/products-import';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  brand?: string;
  buyLink?: string;
}

export function FeaturedProductsGrid() {
  const { featuredProductIds, isMounted } = useFeaturedProducts();

  if (!isMounted) {
    return null;
  }

  // Get featured products
  const featuredProducts = featuredProductIds
    .map((id) => products.find((p: Product) => p.id === id))
    .filter(Boolean) as Product[];

  // Don't show if no featured products
  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Last Items From Videos
          </h2>
          <p className="text-muted-foreground">Featured products from our latest content</p>
        </div>

        {/* Products Grid - Same as Products Page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product: Product) => (
            <div
              key={product.id}
              className="group rounded-lg overflow-hidden bg-muted/50 border border-border/40 hover:border-primary/50 transition"
            >
              {/* Product Image */}
              <div className="relative w-full aspect-square bg-muted overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}

                {/* Category Badge */}
                {product.category && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-primary/90 text-primary-foreground text-xs font-semibold rounded">
                    {product.category}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                {product.brand && (
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    {product.brand}
                  </p>
                )}
                <h3 className="font-display font-semibold text-sm mb-3 line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary">
                    ${Math.round(product.price)}
                  </span>
                </div>

                {/* Buy Button */}
                <a
                  href={product.buyLink || 'https://litbuy.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-primary text-primary-foreground rounded font-medium text-sm hover:bg-primary/90 transition text-center block"
                >
                  Buy
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
