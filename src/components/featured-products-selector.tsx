'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { useFeaturedProducts } from '@/hooks/use-featured-products';
import { products } from '@/lib/products-import';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  brand?: string;
}

export function FeaturedProductsSelector() {
  const { featuredProductIds, isMounted, toggleFeatured } = useFeaturedProducts();
  const [showMessage, setShowMessage] = useState(false);

  if (!isMounted) {
    return <div className="text-center py-8">Loading featured products...</div>;
  }

  const handleToggle = (productId: string) => {
    toggleFeatured(productId);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);
  };

  const featuredCount = featuredProductIds.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Click on products to feature them on the homepage ({featuredCount} selected)
          </p>
        </div>
      </div>

      {/* Save Message */}
      {showMessage && (
        <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-100">
          ✓ Featured products updated! Changes appear on homepage instantly.
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product: Product) => {
          const isFeatured = featuredProductIds.includes(product.id);

          return (
            <div
              key={product.id}
              onClick={() => handleToggle(product.id)}
              className="relative group cursor-pointer"
            >
              {/* Product Card */}
              <div
                className={`p-4 rounded-lg border transition ${
                  isFeatured
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Image */}
                {product.image && (
                  <div className="mb-3 rounded overflow-hidden bg-muted h-40">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="space-y-2">
                  <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                  <p className="text-lg font-bold text-primary">${product.price}</p>
                  {product.category && (
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  )}
                </div>

                {/* Featured Badge */}
                <div
                  className={`absolute top-2 right-2 p-2 rounded-full transition ${
                    isFeatured
                      ? 'bg-primary text-primary-foreground scale-100'
                      : 'bg-muted text-muted-foreground scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                  }`}
                >
                  <Star size={16} fill="currentColor" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12 bg-muted rounded-lg">
          <p className="text-muted-foreground">No products available yet</p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>💡 How it works:</strong> Click any product card to toggle it as featured. The star icon shows which products are selected. Featured products appear on the homepage automatically - changes are saved instantly to your browser.
        </p>
      </div>
    </div>
  );
}
