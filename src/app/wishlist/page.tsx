'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/hooks/use-wishlist';
import { products } from '@/lib/products-import';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, isMounted } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);

  useEffect(() => {
    if (isMounted && wishlistItems.length > 0) {
      const filtered = products.filter((p) => wishlistItems.includes(p.id));
      setWishlistProducts(filtered);
    } else {
      setWishlistProducts([]);
    }
  }, [wishlistItems, isMounted]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 mb-4 w-fit">
            <ArrowLeft size={20} />
            Back
          </Link>
          <div className="flex items-center gap-4">
            <Heart size={32} className="text-primary fill-primary" />
            <div>
              <h1 className="text-3xl font-display font-bold">My Wishlist</h1>
              <p className="text-muted-foreground mt-1">
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-display font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">
              Start adding products to save your favorites!
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded hover:opacity-90 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                className="group border border-border/40 rounded-lg overflow-hidden bg-card hover:shadow-lg transition"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background transition"
                  >
                    <Heart size={20} className="text-primary fill-primary" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-1">{product.brand}</p>
                  <h3 className="font-medium line-clamp-2 mb-2 hover:text-primary transition">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">${product.price}</span>
                    </div>
                    <span className="text-xs bg-secondary/50 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <button className="w-full py-2 bg-primary text-primary-foreground font-medium rounded hover:opacity-90 transition flex items-center justify-center gap-2">
                    <ShoppingCart size={16} />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
