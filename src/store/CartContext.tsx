import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAsyncStorage } from '../hooks/useAsyncStorage';
import { storageKeys } from '../utils/storage';
import { CartItem, ID, Money } from '../types';
import { sumMoney, multiplyMoney } from '../utils/helpers';
import { products } from '../data/products';

interface CartContextValue {
  items: CartItem[];
  add: (productId: ID, variantIds: ID[], unitPrice: Money) => void;
  updateQuantity: (itemId: ID, quantity: number) => void;
  remove: (itemId: ID) => void;
  clear: () => void;
  subtotal: Money;
  count: number;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  add: () => {},
  updateQuantity: () => {},
  remove: () => {},
  clear: () => {},
  subtotal: { amount: 0, currency: 'INR' },
  count: 0,
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { value: items, setValue } = useAsyncStorage<CartItem[]>(storageKeys.cart, []);

  const add = useCallback(
    (productId: ID, variantIds: ID[], unitPrice: Money) => {
      setValue((prev) => {
        const variantSig = variantIds.slice().sort().join('|');
        const existingIdx = prev.findIndex(
          (item) =>
            item.productId === productId &&
            item.variantIds.slice().sort().join('|') === variantSig
        );
        if (existingIdx !== -1) {
          const next = [...prev];
          next[existingIdx] = {
            ...next[existingIdx],
            quantity: next[existingIdx].quantity + 1,
          };
          return next;
        }
        const id = `cart-${productId}-${Date.now()}`;
        return [
          ...prev,
          {
            id,
            productId,
            variantIds,
            quantity: 1,
            unitPrice,
            addedAt: new Date().toISOString(),
          },
        ];
      });
    },
    [setValue]
  );

  const updateQuantity = useCallback(
    (itemId: ID, quantity: number) => {
      setValue((prev) =>
        prev
          .map((item) => (item.id === itemId ? { ...item, quantity } : item))
          .filter((item) => item.quantity > 0)
      );
    },
    [setValue]
  );

  const remove = useCallback(
    (itemId: ID) => {
      setValue((prev) => prev.filter((item) => item.id !== itemId));
    },
    [setValue]
  );

  const clear = useCallback(() => setValue([]), [setValue]);

  const subtotal = useMemo<Money>(() => {
    if (items.length === 0) {
      const fallback = products[0]?.price;
      return { amount: 0, currency: fallback?.currency ?? 'INR' };
    }
    return sumMoney(items.map((it) => multiplyMoney(it.unitPrice, it.quantity)));
  }, [items]);

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

  const value = useMemo(
    () => ({ items, add, updateQuantity, remove, clear, subtotal, count }),
    [items, add, updateQuantity, remove, clear, subtotal, count]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
