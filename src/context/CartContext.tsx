'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IOrderItem } from '@/types';

interface CartContextType {
  items: IOrderItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: IOrderItem) => void;
  removeItem: (productId: string, compatibility: string, color: string) => void;
  updateQuantity: (productId: string, compatibility: string, color: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'abdou_phone_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<IOrderItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Failed to save cart to localStorage:', e);
      }
    }
  }, [items, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = (newItem: IOrderItem) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (it) =>
          it.productId === newItem.productId &&
          it.selectedCompatibility === newItem.selectedCompatibility &&
          it.selectedColor === newItem.selectedColor
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += newItem.quantity;
        return copy;
      }

      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, compatibility: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (it) =>
          !(
            it.productId === productId &&
            it.selectedCompatibility === compatibility &&
            it.selectedColor === color
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    compatibility: string,
    color: string,
    delta: number
  ) => {
    setItems((prev) =>
      prev
        .map((it) => {
          if (
            it.productId === productId &&
            it.selectedCompatibility === compatibility &&
            it.selectedColor === color
          ) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as IOrderItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
