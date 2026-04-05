'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { ApiPackage } from '@/services/packagesService';

interface MarketplaceContextType {
  wishlist: ApiPackage[];
  cart: ApiPackage[];
  toggleWishlist: (pkg: ApiPackage) => void;
  isInWishlist: (id: string) => boolean;
  addToCart: (pkg: ApiPackage) => void;
  removeFromCart: (id: string) => void;
  isInCart: (id: string) => boolean;
}

const WISHLIST_KEY = 'amona_wishlist';
const CART_KEY = 'amona_cart';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<ApiPackage[]>([]);
  const [cart, setCart] = useState<ApiPackage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setWishlist(loadFromStorage<ApiPackage[]>(WISHLIST_KEY, []));
    setCart(loadFromStorage<ApiPackage[]>(CART_KEY, []));
    setHydrated(true);
  }, []);

  // Persist to localStorage on change (skip initial mount)
  useEffect(() => {
    if (hydrated) localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  const toggleWishlist = useCallback((pkg: ApiPackage) => {
    setWishlist((prev) =>
      prev.some((item) => item.package_id === pkg.package_id)
        ? prev.filter((item) => item.package_id !== pkg.package_id)
        : [...prev, pkg]
    );
  }, []);

  const isInWishlist = useCallback(
    (id: string) => wishlist.some((item) => item.package_id === id),
    [wishlist]
  );

  const addToCart = useCallback((pkg: ApiPackage) => {
    setCart((prev) =>
      prev.some((item) => item.package_id === pkg.package_id)
        ? prev
        : [...prev, pkg]
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.package_id !== id));
  }, []);

  const isInCart = useCallback(
    (id: string) => cart.some((item) => item.package_id === id),
    [cart]
  );

  const value = useMemo(
    () => ({ wishlist, cart, toggleWishlist, isInWishlist, addToCart, removeFromCart, isInCart }),
    [wishlist, cart, toggleWishlist, isInWishlist, addToCart, removeFromCart, isInCart]
  );

  return (
    <MarketplaceContext.Provider value={value}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
