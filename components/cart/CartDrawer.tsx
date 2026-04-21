"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrency } from "@/components/common/CurrencyProvider";

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { items, itemCount, totalAmount, removeItem, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();

  function handleCheckout() {
    setOpen(false);
    router.push("/login?callbackUrl=/checkout&forceLogin=1");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#8B4513] px-4 py-3 text-sm font-semibold text-white shadow-xl"
      >
        <ShoppingBag className="h-4 w-4" />
        Cart ({itemCount})
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#2C1810]">Your Cart</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-md p-1 text-[#2C1810]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 && <p className="text-sm text-[#4A3728]">Your cart is empty.</p>}

            <div className="space-y-3 overflow-y-auto pb-28">
              {items.map((item) => {
                const productId = String(item.product._id || item.product.id);
                return (
                  <article key={productId} className="rounded-xl border border-[#FFD8A8] p-3">
                    <p className="font-semibold text-[#2C1810]">{item.product.name}</p>
                    <p className="text-sm text-[#4A3728]">{item.product.mukhi} Mukhi</p>
                    <p className="mt-1 text-sm font-semibold text-[#8B4513]">{formatPrice(item.product.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(productId, item.quantity - 1)}
                        className="h-7 w-7 rounded-md bg-[#8B4513] text-white"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-[#2C1810]">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                        className="h-7 w-7 rounded-md bg-[#8B4513] text-white"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(productId)}
                        className="ml-auto rounded-md bg-[#fff1df] px-2 py-1 text-xs font-semibold text-[#8B4513]"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-5">
              <p className="text-sm text-[#4A3728]">Total</p>
              <p className="text-xl font-bold text-[#8B4513]">{formatPrice(totalAmount)}</p>
              <button
                type="button"
                onClick={handleCheckout}
                className="mt-3 block w-full rounded-xl bg-[#8B4513] py-2 text-center text-sm font-semibold text-white"
              >
                Go to Checkout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
