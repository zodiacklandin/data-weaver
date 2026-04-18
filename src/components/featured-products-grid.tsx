'use client';

import { useFeaturedProducts } from '@/hooks/use-featured-products';
import { products } from '@/lib/products-import';
import Link from 'next/link';
import { ArrowRight, ExternalLink, Sparkles, Star } from 'lucide-react';

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
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Featured</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
              Latest Video Picks
            </h2>
            <p className="text-muted-foreground text-lg">Products from our most recent content</p>
          </div>
          
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
          >
            View All
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product: Product, index: number) => (
            <div
              key={product.id}
              className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image container */}
              <div className="relative aspect-square overflow-hidden bg-secondary">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}

                {/* Category badge */}
                {product.category && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-card/90 backdrop-blur-sm text-card-foreground text-xs font-semibold rounded-full border border-border/50">
                    {product.category}
                  </div>
                )}
                
                {/* Quick view overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                  <a
                    href={product.buyLink || 'https://litbuy.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  >
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Product info */}
              <div className="p-5">
                {product.brand && (
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
                    {product.brand}
                  </p>
                )}
                <h3 className="font-display font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xl font-bold text-primary">
                    ${Math.round(product.price)}
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">4.9</span>
                  </div>
                </div>

                {/* Buy button */}
                <a
                  href={product.buyLink || 'https://litbuy.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-3 bg-secondary text-secondary-foreground border border-border rounded-xl font-semibold text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-center block"
                >
                  Buy Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
