'use client';

import { useLastVideoProducts } from '@/hooks/use-last-video-products';
import { ExternalLink, Play, ShoppingBag, Star } from 'lucide-react';

export function LastVideoProductsGrid() {
  const { products, isLoading } = useLastVideoProducts();

  if (isLoading) {
    return (
      <section className="relative py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                From Latest Video
              </h2>
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl overflow-hidden border border-border">
                <div className="aspect-square bg-secondary" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-secondary rounded-full w-3/4" />
                  <div className="h-4 bg-secondary rounded-full w-1/2" />
                  <div className="h-10 bg-secondary rounded-xl mt-4" />
                </div>
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
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1">
                From Latest Video
              </h2>
              <p className="text-muted-foreground">Fresh finds featured in our newest content</p>
            </div>
          </div>
          
          <a
            href="https://www.youtube.com/@Rephoven"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-full text-foreground font-medium hover:border-primary hover:text-primary transition-all"
          >
            <Play className="w-4 h-4" />
            Watch Video
            <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <a
              key={product.id}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100%" height="192"%3E%3Crect fill="%23e5e7eb" width="100%" height="192"/%3E%3Ctext x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui" fill="%23999" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                    <span className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ShoppingBag className="w-4 h-4" />
                      View Product
                    </span>
                  </div>
                  
                  {/* New badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-xs font-bold rounded-full">
                    NEW
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-grow p-5 flex flex-col">
                  <h3 className="font-display font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm font-medium text-foreground">4.8</span>
                    </div>
                    <span className="text-sm text-muted-foreground">|</span>
                    <span className="text-sm text-muted-foreground">Verified</span>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-xl font-bold text-primary mb-4">{product.price}</p>
                    
                    {/* Buy Now Button */}
                    <span className="w-full py-3 bg-secondary text-secondary-foreground border border-border rounded-xl font-semibold text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 text-center flex items-center justify-center gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Buy Now
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
