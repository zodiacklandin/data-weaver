'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMounted } from './use-mounted';
import {
  isSupabaseConfigured,
  getLastVideoProductsFromSupabase,
  syncLastVideoProductsToSupabase,
} from '@/lib/supabase-client';

const LAST_VIDEO_KEY = 'rephoven_last_video_products';

export interface LastVideoProduct {
  id: string;
  name: string;
  price: string;
  image: string;
  link: string;
  order: number;
  createdAt: number;
}

export function useLastVideoProducts() {
  const [products, setProducts] = useState<LastVideoProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const localCacheRef = useRef<LastVideoProduct[]>([]);
  const isMounted = useMounted();
  const isSyncingRef = useRef(false);

  // Load products from Supabase or localStorage
  useEffect(() => {
    if (!isMounted) return;

    const loadProducts = async () => {
      setIsLoading(true);
      setSyncError(null);

      try {
        let loadedProducts: LastVideoProduct[] = [];

        // Try to load from Supabase first
        if (isSupabaseConfigured) {
          loadedProducts = await getLastVideoProductsFromSupabase();
          if (loadedProducts.length > 0) {
            // Also save to localStorage as cache
            localStorage.setItem(LAST_VIDEO_KEY, JSON.stringify(loadedProducts));
          }
        }

        // If no Supabase data, try localStorage
        if (loadedProducts.length === 0) {
          try {
            const saved = localStorage.getItem(LAST_VIDEO_KEY);
            if (saved) {
              loadedProducts = JSON.parse(saved);
            }
          } catch (error) {
            console.error('Failed to load from localStorage:', error);
          }
        }

        localCacheRef.current = loadedProducts;
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
        setSyncError('Failed to load products');

        // Fallback to localStorage
        try {
          const saved = localStorage.getItem(LAST_VIDEO_KEY);
          if (saved) {
            const loadedProducts = JSON.parse(saved);
            localCacheRef.current = loadedProducts;
            setProducts(loadedProducts);
          }
        } catch (e) {
          console.error('Fallback failed:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [isMounted]);

  // Poll for real-time updates from Supabase
  useEffect(() => {
    if (!isMounted || !isSupabaseConfigured) return;

    const interval = setInterval(async () => {
      if (isSyncingRef.current) return;

      try {
        const loadedProducts = await getLastVideoProductsFromSupabase();
        if (JSON.stringify(loadedProducts) !== JSON.stringify(localCacheRef.current)) {
          localCacheRef.current = loadedProducts;
          setProducts(loadedProducts);
          // Update localStorage cache
          localStorage.setItem(LAST_VIDEO_KEY, JSON.stringify(loadedProducts));
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isMounted]);

  // Save products (to both Supabase and localStorage)
  const saveProducts = useCallback(async (newProducts: LastVideoProduct[]) => {
    try {
      isSyncingRef.current = true;
      localCacheRef.current = newProducts;
      setProducts(newProducts);

      // Save to localStorage first (for offline)
      localStorage.setItem(LAST_VIDEO_KEY, JSON.stringify(newProducts));

      // Sync to Supabase
      if (isSupabaseConfigured) {
        const success = await syncLastVideoProductsToSupabase(newProducts);
        if (!success) {
          setSyncError('Failed to sync to cloud');
        } else {
          setSyncError(null);
        }
      }
    } catch (error) {
      console.error('Failed to save products:', error);
      setSyncError('Failed to save changes');
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const addProduct = useCallback(
    (product: Omit<LastVideoProduct, 'order' | 'createdAt'>) => {
      setProducts((prev) => {
        const newProduct: LastVideoProduct = {
          ...product,
          order: prev.length,
          createdAt: Date.now(),
        };
        const updated = [...prev, newProduct];
        saveProducts(updated);
        return updated;
      });
    },
    [saveProducts]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<LastVideoProduct>) => {
      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
        saveProducts(updated);
        return updated;
      });
    },
    [saveProducts]
  );

  const removeProduct = useCallback(
    (id: string) => {
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        // Re-order remaining products
        const reordered = updated.map((p, idx) => ({ ...p, order: idx }));
        saveProducts(reordered);
        return reordered;
      });
    },
    [saveProducts]
  );

  const reorderProducts = useCallback(
    (newOrder: LastVideoProduct[]) => {
      const reordered = newOrder.map((p, idx) => ({ ...p, order: idx }));
      saveProducts(reordered);
    },
    [saveProducts]
  );

  const clearAll = useCallback(() => {
    saveProducts([]);
  }, [saveProducts]);

  return {
    products,
    isLoading,
    syncError,
    addProduct,
    updateProduct,
    removeProduct,
    reorderProducts,
    clearAll,
    count: products.length,
    isSupabaseEnabled: isSupabaseConfigured,
  };
}
