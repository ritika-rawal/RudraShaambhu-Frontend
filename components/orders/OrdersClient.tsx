"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { useCurrency } from "@/components/common/CurrencyProvider";
import { fetchOrders } from "@/lib/api";

type OrdersClientProps = {
  userId: string;
};

type Order = {
  _id: string;
  userId: string;
  totalAmount: number;
  shippingAddress: string;
  status: "pending" | "completed";
  createdAt: string;
  items?: {
    productId?: {
      _id?: string;
      id?: string | number;
      name?: string;
      mukhi?: string | number;
    };
    quantity: number;
    price: number;
  }[];
};

export default function OrdersClient({ userId }: OrdersClientProps) {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOrders() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchOrders(userId);
        if (mounted) {
          setOrders(response.orders as Order[]);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load orders");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE8C7] to-[#FFD8A8]">
      <Header showBack title="Orders" />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <h1 className="text-3xl font-bold text-[#2C1810]">Your Orders</h1>
          <p className="mt-2 text-sm text-[#4A3728]">Track your recent Rudraksha purchases.</p>

          {loading && <p className="mt-6 text-sm text-[#4A3728]">Loading orders...</p>}
          {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {!loading && !error && orders.length === 0 && (
            <p className="mt-6 text-sm text-[#4A3728]">No orders placed yet.</p>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="mt-6 space-y-4">
              {orders.map((order) => (
                <article key={order._id} className="rounded-2xl border border-[#FFD8A8] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-[#2C1810]">Order #{order._id}</p>
                    <p className="text-xs uppercase tracking-wide text-[#8B4513]">{order.status}</p>
                  </div>
                  <p className="mt-2 text-sm text-[#4A3728]">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-[#4A3728]">Shipping: {order.shippingAddress}</p>
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 space-y-1 rounded-lg bg-[#fff7eb] p-3">
                      {order.items.map((item, index) => (
                        <p key={`${order._id}-${index}`} className="text-sm text-[#4A3728]">
                          {item.productId?.name || "Product"}
                          {item.productId?.mukhi ? ` (${item.productId.mukhi} Mukhi)` : ""} x {item.quantity}
                        </p>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-lg font-bold text-[#8B4513]">{formatPrice(order.totalAmount)}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer variant="simple" />
    </div>
  );
}
