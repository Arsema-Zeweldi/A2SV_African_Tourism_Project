'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Package } from '@/lib/marketplace-data';

interface MarketplaceContextType {
  wishlist: Package[];
  cart: Package[];
  toggleWishlist: (pkg: Package) => void;
  isInWishlist: (id: string) => boolean;
  addToCart: (pkg: Package) => void;
  removeFromCart: (id: string) => void;
  isInCart: (id: string) => boolean;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Package[]>([]);
  const [cart, setCart] = useState<Package[]>([]);

  const toggleWishlist = (pkg: Package) => {
    setWishlist(prev =>
      prev.some(item => item.id === pkg.id)
        ? prev.filter(item => item.id !== pkg.id)
        : [...prev, pkg]
    );
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };

  const addToCart = (pkg: Package) => {
    if (!cart.some(item => item.id === pkg.id)) {
      setCart(prev => [...prev, pkg]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const isInCart = (id: string) => {
    return cart.some(item => item.id === id);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        wishlist,
        cart,
        toggleWishlist,
        isInWishlist,
        addToCart,
        removeFromCart,
        isInCart,
      }}
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