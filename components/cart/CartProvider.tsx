"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { addCartItem, fetchCart, removeCartItem, RudrakshaProduct, updateCartItem } from "@/lib/api";

const CART_STORAGE_KEY = "rudraksha_cart_v1";
const CART_NEEDS_MERGE_KEY = "rudraksha_cart_needs_merge_v1";

export type LocalCartItem = {
  product: RudrakshaProduct;
  quantity: number;
};

type CartContextValue = {
  items: LocalCartItem[];
  itemCount: number;
  totalAmount: number;
  addItem: (product: RudrakshaProduct, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function getProductId(product: RudrakshaProduct) {
  return String(product._id || product.id);
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [hasHydratedLocalCart, setHasHydratedLocalCart] = useState(false);
  const userId = session?.user?.id;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as LocalCartItem[];
        setItems(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // local cart remains empty if parsing fails
    } finally {
      setHasHydratedLocalCart(true);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function syncFromServer() {
      if (!userId || !hasHydratedLocalCart) {
        return;
      }

      try {
        let localItems: LocalCartItem[] = [];
        try {
          const saved = window.localStorage.getItem(CART_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved) as LocalCartItem[];
            localItems = Array.isArray(parsed) ? parsed : [];
          }
        } catch {
          localItems = [];
        }

        const needsMerge = window.localStorage.getItem(CART_NEEDS_MERGE_KEY) === "1";

        // Merge only when cart was created anonymously before login.
        if (needsMerge && localItems.length > 0) {
          await Promise.all(
            localItems.map((entry) =>
              addCartItem({
                userId,
                productId: getProductId(entry.product),
                quantity: entry.quantity
              })
            )
          );

          window.localStorage.removeItem(CART_NEEDS_MERGE_KEY);
        }

        const serverCart = await fetchCart(userId);
        if (!active) {
          return;
        }

        const serverItems = serverCart.items.map((entry) => ({
          product: entry.product,
          quantity: entry.quantity
        }));

        // Do not clobber a non-empty local cart with an empty server response.
        // This can happen right after guest login before merge/sync settles.
        if (serverItems.length === 0 && localItems.length > 0) {
          window.localStorage.setItem(CART_NEEDS_MERGE_KEY, "1");
          return;
        }

        setItems(serverItems);
      } catch {
        // local cart remains the source of truth for UX resilience
      }
    }

    syncFromServer();

    return () => {
      active = false;
    };
    // We intentionally sync only when auth identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, hasHydratedLocalCart]);

  useEffect(() => {
    if (!hasHydratedLocalCart || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hasHydratedLocalCart]);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalAmount = useMemo(
    () =>
      Number(
        items
          .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
          .toFixed(2)
      ),
    [items]
  );

  async function addItem(product: RudrakshaProduct, quantity = 1) {
    const clamped = Math.max(1, Math.floor(quantity));
    const productId = getProductId(product);

    setItems((prev) => {
      const existing = prev.find((item) => getProductId(item.product) === productId);
      if (existing) {
        return prev.map((item) =>
          getProductId(item.product) === productId
            ? { ...item, quantity: item.quantity + clamped }
            : item
        );
      }

      return [...prev, { product, quantity: clamped }];
    });

    if (userId) {
      try {
        await addCartItem({ userId, productId, quantity: clamped });
      } catch {
        // local cart remains the source of truth for UX resilience
      }
    } else if (typeof window !== "undefined") {
      // Mark local cart for one-time server merge after the user logs in.
      window.localStorage.setItem(CART_NEEDS_MERGE_KEY, "1");
    }
  }

  async function removeItem(productId: string) {
    setItems((prev) =>
      prev.filter((item) => getProductId(item.product) !== String(productId))
    );

    if (userId) {
      try {
        await removeCartItem({ userId, productId: String(productId) });
      } catch {
        // no-op
      }
    }
  }

  async function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      await removeItem(productId);
      return;
    }

    const safeQuantity = Math.floor(quantity);
    setItems((prev) =>
      prev.map((item) =>
        getProductId(item.product) === String(productId)
          ? { ...item, quantity: safeQuantity }
          : item
      )
    );

    if (userId) {
      try {
        await updateCartItem({ userId, productId: String(productId), quantity: safeQuantity });
      } catch {
        // no-op
      }
    }
  }

  function clearCart() {
    setItems([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.localStorage.removeItem(CART_NEEDS_MERGE_KEY);
    }
  }

  const value = {
    items,
    itemCount,
    totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
