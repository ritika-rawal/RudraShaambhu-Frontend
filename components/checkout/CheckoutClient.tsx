"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrency } from "@/components/common/CurrencyProvider";
import { createOrderFromItems } from "@/lib/api";

type CheckoutClientProps = {
  userId: string;
};

type ShippingForm = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const initialShipping: ShippingForm = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India"
};

export default function CheckoutClient({ userId }: CheckoutClientProps) {
  const router = useRouter();
  const { items, totalAmount, removeItem, updateQuantity, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const [shipping, setShipping] = useState<ShippingForm>(initialShipping);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const totalItems = useMemo(
    () => items.reduce((sum, entry) => sum + entry.quantity, 0),
    [items]
  );

  function updateField<K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) {
    setShipping((prev) => ({ ...prev, [key]: value }));
  }

  function validateShipping() {
    return (
      shipping.fullName.trim() &&
      shipping.phone.trim() &&
      shipping.addressLine1.trim() &&
      shipping.city.trim() &&
      shipping.state.trim() &&
      shipping.postalCode.trim() &&
      shipping.country.trim()
    );
  }

  async function handlePlaceOrder() {
    setError(null);
    setSuccess(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!validateShipping()) {
      setError("Please fill all required shipping fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await createOrderFromItems({
        userId,
        shipping,
        items: items.map((entry) => ({
          productId: String(entry.product._id || entry.product.id),
          quantity: entry.quantity
        }))
      });
      clearCart();
      setShipping(initialShipping);
      setSuccess(`Order placed successfully. Order ID: ${response.order._id}`);
      router.push("/orders");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE8C7] to-[#FFD8A8]">
      <Header showBack title="Checkout" backHref="/login?callbackUrl=/checkout" />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#2C1810]">Checkout</h1>
            <p className="text-sm text-[#4A3728]">{totalItems} items</p>
          </div>

          {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {success && <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

          {items.length === 0 && <p className="text-sm text-[#4A3728]">Your cart is empty.</p>}

          {items.length > 0 && (
            <div className="space-y-4">
              {items.map((entry) => {
                const productId = String(entry.product._id || entry.product.id);
                const lineTotal = Number((entry.product.price * entry.quantity).toFixed(2));

                return (
                  <article key={productId} className="rounded-xl border border-[#FFD8A8] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-[#2C1810]">{entry.product.name}</p>
                        <p className="text-sm text-[#4A3728]">{entry.product.mukhi} Mukhi</p>
                        <p className="mt-1 text-sm font-semibold text-[#8B4513]">{formatPrice(lineTotal)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(productId, entry.quantity - 1)}
                          className="h-8 w-8 rounded-md bg-[#8B4513] text-white"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-[#2C1810]">{entry.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(productId, entry.quantity + 1)}
                          className="h-8 w-8 rounded-md bg-[#8B4513] text-white"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(productId)}
                          className="rounded-md bg-[#fff1df] px-2 py-1 text-xs font-semibold text-[#8B4513]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#FFD8A8] p-4">
              <h2 className="text-lg font-semibold text-[#2C1810]">Shipping Details</h2>
              <div className="mt-4 grid gap-3">
                <input
                  value={shipping.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  placeholder="Full name"
                  className="rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                />
                <input
                  value={shipping.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="Phone"
                  className="rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                />
                <input
                  value={shipping.addressLine1}
                  onChange={(event) => updateField("addressLine1", event.target.value)}
                  placeholder="Address line 1"
                  className="rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                />
                <input
                  value={shipping.addressLine2}
                  onChange={(event) => updateField("addressLine2", event.target.value)}
                  placeholder="Address line 2 (optional)"
                  className="rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={shipping.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    placeholder="City"
                    className="rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                  />
                  <input
                    value={shipping.state}
                    onChange={(event) => updateField("state", event.target.value)}
                    placeholder="State"
                    className="rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={shipping.postalCode}
                    onChange={(event) => updateField("postalCode", event.target.value)}
                    placeholder="Postal code"
                    className="rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                  />
                  <input
                    value={shipping.country}
                    onChange={(event) => updateField("country", event.target.value)}
                    placeholder="Country"
                    className="rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-[#FFD8A8] p-4">
              <h2 className="text-lg font-semibold text-[#2C1810]">Order Summary</h2>
              <p className="mt-3 text-sm text-[#4A3728]">Items: {totalItems}</p>
              <p className="text-sm text-[#4A3728]">Shipping: Free</p>
              <p className="mt-3 text-2xl font-bold text-[#8B4513]">{formatPrice(totalAmount)}</p>
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="mt-5 w-full rounded-xl bg-[#8B4513] py-3 text-sm font-semibold text-white"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </section>
          </div>
        </section>
      </main>

      <Footer variant="simple" />
    </div>
  );
}
