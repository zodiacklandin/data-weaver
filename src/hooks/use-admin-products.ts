'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/products-import';

const ADMIN_STORAGE_KEY = 'admin_products';
const ACTIVE_PRODUCTS_KEY = 'active_products';

export function useAdminProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeProducts, setActiveProducts] = useState<Set<string>>(new Set());
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedProducts = localStorage.getItem(ADMIN_STORAGE_KEY);
    const savedActive = localStorage.getItem(ACTIVE_PRODUCTS_KEY);

    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      setProducts(initialProducts);
    }

    if (savedActive) {
      setActiveProducts(new Set(JSON.parse(savedActive)));
    }
  }, [initialProducts]);

  // Auto-save products to localStorage
  const saveProducts = useCallback((updatedProducts: Product[]) => {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  }, []);

  // Auto-save active products
  const saveActive = useCallback((active: Set<string>) => {
    localStorage.setItem(ACTIVE_PRODUCTS_KEY, JSON.stringify(Array.from(active)));
    setActiveProducts(active);
  }, []);

  // Add new product
  const addProduct = useCallback(
    (product: Omit<Product, 'id'>) => {
      const newId = `prod_custom_${Date.now()}`;
      const newProduct: Product = {
        ...product,
        id: newId,
      };
      const updated = [newProduct, ...products];
      saveProducts(updated);

      // Mark as active
      const newActive = new Set(activeProducts);
      newActive.add(newId);
      saveActive(newActive);

      return newProduct;
    },
    [products, activeProducts, saveProducts, saveActive]
  );

  // Edit product
  const editProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  // Delete product
  const deleteProduct = useCallback(
    (id: string) => {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
      const newActive = new Set(activeProducts);
      newActive.delete(id);
      saveActive(newActive);
    },
    [products, activeProducts, saveProducts, saveActive]
  );

  // Bulk delete
  const bulkDelete = useCallback(
    (ids: string[]) => {
      const updated = products.filter((p) => !ids.includes(p.id));
      saveProducts(updated);
      const newActive = new Set(activeProducts);
      ids.forEach((id) => newActive.delete(id));
      saveActive(newActive);
    },
    [products, activeProducts, saveProducts, saveActive]
  );

  // Reorder products (drag-drop)
  const reorderProducts = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updated = [...products];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  // Bulk assign category
  const bulkAssignCategory = useCallback(
    (ids: string[], category: string) => {
      const updated = products.map((p) =>
        ids.includes(p.id) ? { ...p, category } : p
      );
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  // Bulk assign gender
  const bulkAssignGender = useCallback(
    (ids: string[], gender: 'Women' | 'Men' | 'Unisex') => {
      const updated = products.map((p) =>
        ids.includes(p.id) ? { ...p, gender } : p
      );
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  // Bulk update with multiple fields
  const bulkUpdate = useCallback(
    (ids: string[], updates: Partial<Product>) => {
      const updated = products.map((p) =>
        ids.includes(p.id) ? { ...p, ...updates } : p
      );
      saveProducts(updated);
    },
    [products, saveProducts]
  );

  // Mark product as active
  const markActive = useCallback(
    (id: string, active: boolean) => {
      const newActive = new Set(activeProducts);
      if (active) {
        newActive.add(id);
      } else {
        newActive.delete(id);
      }
      saveActive(newActive);
    },
    [activeProducts, saveActive]
  );

  // Export as JSON
  const exportAsJSON = useCallback(() => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `products_${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [products]);

  // Get active products sorted to top
  const getDisplayProducts = useCallback(() => {
    const active = products.filter((p) => activeProducts.has(p.id));
    const inactive = products.filter((p) => !activeProducts.has(p.id));
    return [...active, ...inactive];
  }, [products, activeProducts]);

  return {
    products,
    activeProducts,
    isMounted,
    addProduct,
    editProduct,
    deleteProduct,
    bulkDelete,
    reorderProducts,
    bulkAssignCategory,
    bulkAssignGender,
    bulkUpdate,
    markActive,
    exportAsJSON,
    getDisplayProducts,
  };
}
