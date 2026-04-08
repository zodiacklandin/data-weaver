'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/use-featured-products';
import { products } from '@/lib/products-import';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

export function FeaturedCarousel() {
  const { featuredProductIds, isMounted } = useFeaturedProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);

  // Get featured products
  const featuredProducts = products.filter((p: Product) => featuredProductIds.includes(p.id));

  // Auto-scroll timer
  useEffect(() => {
    if (!autoScroll || featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScroll, featuredProducts.length]);

  if (!isMounted || featuredProducts.length === 0) {
    return null; // Don't show if no featured products
  }

  const goToPrevious = () => {
    setAutoScroll(false);
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const goToNext = () => {
    setAutoScroll(false);
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const goToSlide = (index: number) => {
    setAutoScroll(false);
    setCurrentIndex(index);
  };

  const currentProduct = featuredProducts[currentIndex];

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary/10 via-transparent to-primary/5">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Star size={20} className="text-primary fill-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wide">Featured</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">Featured Products</h2>
          <p className="text-muted-foreground text-lg">Discover our handpicked selection</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-muted">
            {/* Slides */}
            {featuredProducts.map((product: Product, index: number) => (
              <div
                key={product.id}
                className={cn(
                  'absolute inset-0 transition-opacity duration-500',
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                )}
              >
                {/* Product Image */}
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}

                {/* Overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Product Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="max-w-2xl">
                    {product.category && (
                      <p className="text-sm font-semibold text-primary-foreground/80 mb-2 uppercase tracking-wide">
                        {product.category}
                      </p>
                    )}
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl md:text-3xl font-bold text-primary mb-4">${product.price}</p>
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition">
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Buttons */}
            {featuredProducts.length > 1 && (
              <>
                {/* Left Button */}
                <button
                  onClick={goToPrevious}
                  onMouseEnter={() => setAutoScroll(false)}
                  onMouseLeave={() => setAutoScroll(true)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition text-white backdrop-blur-sm"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Right Button */}
                <button
                  onClick={goToNext}
                  onMouseEnter={() => setAutoScroll(false)}
                  onMouseLeave={() => setAutoScroll(true)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition text-white backdrop-blur-sm"
                  aria-label="Next slide"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Slide Indicators */}
          {featuredProducts.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    'h-2 rounded-full transition-all',
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {currentIndex + 1} of {featuredProducts.length}
        </p>
      </div>
    </section>
  );
}
