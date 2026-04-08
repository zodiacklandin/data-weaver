'use client';

import { useState, useCallback, useEffect } from 'react';

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('rephoven_wishlist');
    setWishlistItems(saved ? JSON.parse(saved) : []);
    setIsMounted(true);
  }, []);

  const addToWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => {
      const updated = [...new Set([...prev, productId])];
      localStorage.setItem('rephoven_wishlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => {
      const updated = prev.filter((id) => id !== productId);
      localStorage.setItem('rephoven_wishlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return wishlistItems.includes(productId);
  }, [wishlistItems]);

  const toggleWishlist = useCallback((productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    isMounted,
    count: wishlistItems.length,
  };
}
