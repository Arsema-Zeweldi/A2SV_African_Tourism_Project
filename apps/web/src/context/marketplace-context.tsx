'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
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

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<ApiPackage[]>([]);
  const [cart, setCart] = useState<ApiPackage[]>([]);

  const toggleWishlist = (pkg: ApiPackage) => {
    setWishlist((prev) =>
      prev.some((item) => item.package_id === pkg.package_id)
        ? prev.filter((item) => item.package_id !== pkg.package_id)
        : [...prev, pkg]
    );
  };

  const isInWishlist = (id: string) => wishlist.some((item) => item.package_id === id);

  const addToCart = (pkg: ApiPackage) => {
    if (!cart.some((item) => item.package_id === pkg.package_id)) {
      setCart((prev) => [...prev, pkg]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.package_id !== id));
  };

  const isInCart = (id: string) => cart.some((item) => item.package_id === id);

  return (
    <MarketplaceContext.Provider
      value={{ wishlist, cart, toggleWishlist, isInWishlist, addToCart, removeFromCart, isInCart }}
    >
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
