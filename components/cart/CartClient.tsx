"use client";

import Link from "next/link";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrency } from "@/components/common/CurrencyProvider";

export default function CartClient() {
  const { items, totalAmount, itemCount, removeItem, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE8C7] to-[#FFD8A8]">
      <Header showBack title="Your Cart" />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#2C1810]">Cart</h1>
            <p className="text-sm text-[#4A3728]">{itemCount} items</p>
          </div>

          {items.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-[#4A3728]">Your cart is empty.</p>
              <Link href="/rudraksha" className="inline-flex rounded-xl bg-[#8B4513] px-4 py-2 text-sm font-semibold text-white">
                Continue Shopping
              </Link>
            </div>
          )}

          {items.length > 0 && (
            <>
              <div className="space-y-4">
                {items.map((entry) => {
                  const productId = String(entry.product._id || entry.product.id);
                  const lineTotal = Number((entry.product.price * entry.quantity).toFixed(2));

                  return (
                    <article key={productId} className="rounded-2xl border border-[#FFD8A8] p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-[#2C1810]">{entry.product.name}</h2>
                          <p className="text-sm text-[#4A3728]">{entry.product.mukhi} Mukhi</p>
                          <p className="mt-2 text-sm font-semibold text-[#8B4513]">Line Total: {formatPrice(lineTotal)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(productId, entry.quantity - 1)}
                            className="h-8 w-8 rounded-lg bg-[#8B4513] text-white"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-[#2C1810]">{entry.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(productId, entry.quantity + 1)}
                            className="h-8 w-8 rounded-lg bg-[#8B4513] text-white"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(productId)}
                            className="rounded-lg bg-[#fff1df] px-3 py-2 text-sm font-semibold text-[#8B4513]"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#FFD8A8] p-4">
                <div>
                  <p className="text-sm text-[#4A3728]">Subtotal</p>
                  <p className="text-xl font-bold text-[#8B4513]">{formatPrice(totalAmount)}</p>
                </div>
                <div className="flex gap-3">
                  <Link href="/rudraksha" className="rounded-xl bg-[#fff1df] px-4 py-2 text-sm font-semibold text-[#8B4513]">
                    Continue Shopping
                  </Link>
                  <Link href="/login?callbackUrl=/checkout" className="rounded-xl bg-[#8B4513] px-4 py-2 text-sm font-semibold text-white">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
      <Footer variant="simple" />
    </div>
  );
}
