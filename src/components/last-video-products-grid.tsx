'use client';

import { useLastVideoProducts } from '@/hooks/use-last-video-products';
import { ExternalLink } from 'lucide-react';

export function LastVideoProductsGrid() {
  const { products, isLoading } = useLastVideoProducts();

  if (isLoading) {
    return (
      <section className="w-full py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-8 font-display">
            Products from last video
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full h-48 bg-muted rounded mb-4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 bg-gradient-to-b from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 font-display">
            Products from last video
          </h2>
          <p className="text-muted-foreground">Check out the latest items featured in our videos</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <a
              key={product.id}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group h-full"
            >
              <div className="h-full flex flex-col bg-background border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                {/* Product Image */}
                <div className="relative w-full h-48 bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%" height="192"%3E%3Crect fill="%23e5e7eb" width="100%" height="192"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" fill="%23999" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {/* CTA Button on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-semibold text-sm hover:bg-primary/90 transition">
                      View Product
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-grow p-4 flex flex-col">
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2 group-hover:text-primary transition">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 flex-grow">{product.price}</p>

                  {/* Buy Now Button */}
                  <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
