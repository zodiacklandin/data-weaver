'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMounted } from './use-mounted';
import {
  isSupabaseConfigured,
  getFeaturedProductsFromSupabase,
  addFeaturedProductToSupabase,
  removeFeaturedProductFromSupabase,
  syncFeaturedProductsToSupabase,
} from '@/lib/supabase-client';

const FEATURED_KEY = 'rephoven_featured_products';

export function useFeaturedProducts() {
  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const localCacheRef = useRef<string[]>([]);
  const isMounted = useMounted();
  const isSyncingRef = useRef(false);

  // Load featured products from Supabase or localStorage
  useEffect(() => {
    if (!isMounted) return;

    const loadFeaturedProducts = async () => {
      setIsLoading(true);
      setSyncError(null);

      try {
        let ids: string[] = [];

        // Try to load from Supabase first
        if (isSupabaseConfigured) {
          ids = await getFeaturedProductsFromSupabase();
          if (ids.length > 0) {
            // Also save to localStorage as cache
            localStorage.setItem(FEATURED_KEY, JSON.stringify(ids));
          }
        }

        // If no Supabase data, try localStorage
        if (ids.length === 0) {
          try {
            const saved = localStorage.getItem(FEATURED_KEY);
            if (saved) {
              ids = JSON.parse(saved);
            }
          } catch (error) {
            console.error('Failed to load from localStorage:', error);
          }
        }

        localCacheRef.current = ids;
        setFeaturedProductIds(ids);
      } catch (error) {
        console.error('Error loading featured products:', error);
        setSyncError('Failed to load featured products');

        // Fallback to localStorage
        try {
          const saved = localStorage.getItem(FEATURED_KEY);
          if (saved) {
            const ids = JSON.parse(saved);
            localCacheRef.current = ids;
            setFeaturedProductIds(ids);
          }
        } catch (e) {
          console.error('Fallback failed:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [isMounted]);

  // Subscribe to real-time updates from Supabase
  useEffect(() => {
    if (!isMounted || !isSupabaseConfigured) return;

    // Set up real-time subscription
    // Note: This requires importing supabase directly in a client component
    // For now, we'll poll for changes every 3 seconds
    const interval = setInterval(async () => {
      if (isSyncingRef.current) return; // Skip if already syncing

      try {
        const ids = await getFeaturedProductsFromSupabase();
        if (JSON.stringify(ids) !== JSON.stringify(localCacheRef.current)) {
          localCacheRef.current = ids;
          setFeaturedProductIds(ids);
          // Update localStorage cache
          localStorage.setItem(FEATURED_KEY, JSON.stringify(ids));
        }
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isMounted]);

  // Save featured products (to both Supabase and localStorage)
  const saveFeaturedProducts = useCallback(async (ids: string[]) => {
    try {
      isSyncingRef.current = true;
      localCacheRef.current = ids;
      setFeaturedProductIds(ids);

      // Save to localStorage first (for offline)
      localStorage.setItem(FEATURED_KEY, JSON.stringify(ids));

      // Sync to Supabase
      if (isSupabaseConfigured) {
        const success = await syncFeaturedProductsToSupabase(ids);
        if (!success) {
          setSyncError('Failed to sync to cloud');
        } else {
          setSyncError(null);
        }
      }
    } catch (error) {
      console.error('Failed to save featured products:', error);
      setSyncError('Failed to save changes');
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const toggleFeatured = useCallback(
    (productId: string) => {
      setFeaturedProductIds((prev) => {
        const updated = prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId];
        saveFeaturedProducts(updated);
        return updated;
      });
    },
    [saveFeaturedProducts]
  );

  const addFeatured = useCallback(
    (productId: string) => {
      setFeaturedProductIds((prev) => {
        if (prev.includes(productId)) return prev;
        const updated = [...prev, productId];
        saveFeaturedProducts(updated);
        return updated;
      });
    },
    [saveFeaturedProducts]
  );

  const removeFeatured = useCallback(
    (productId: string) => {
      setFeaturedProductIds((prev) => {
        const updated = prev.filter((id) => id !== productId);
        saveFeaturedProducts(updated);
        return updated;
      });
    },
    [saveFeaturedProducts]
  );

  const isFeatured = useCallback((productId: string) => {
    return localCacheRef.current.includes(productId);
  }, []);

  return {
    featuredProductIds,
    isMounted,
    isLoading,
    syncError,
    toggleFeatured,
    addFeatured,
    removeFeatured,
    isFeatured,
    count: featuredProductIds.length,
    isSupabaseEnabled: isSupabaseConfigured,
  };
}
