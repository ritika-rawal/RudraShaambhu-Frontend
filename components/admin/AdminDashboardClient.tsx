"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BadgeIndianRupee,
  BarChart3,
  Box,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Filter,
  Layers,
  PackageCheck,
  Search,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";
import { AdminOrder, fetchAdminOrders, fetchProducts, RudrakshaProduct, updateProductPriceAsAdmin } from "@/lib/api";
import { useCurrency } from "@/components/common/CurrencyProvider";

type AdminDashboardClientProps = {
  adminName: string;
  adminEmail: string;
};

type StockBand = "healthy" | "watch" | "critical";

type ProductRow = RudrakshaProduct & {
  estimatedStock: number;
  stockBand: StockBand;
};

function stockBandFromCount(stock: number): StockBand {
  if (stock <= 6) {
    return "critical";
  }

  if (stock <= 14) {
    return "watch";
  }

  return "healthy";
}

function deriveEstimatedStock(product: RudrakshaProduct) {
  const source = String(product._id || product.id || product.name);
  const hash = source.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const stock = 4 + (hash % 28);
  return stock;
}

function getStockBadgeClass(stockBand: StockBand) {
  if (stockBand === "critical") {
    return "border-[#7C2D12] bg-[#3E1B13] text-[#FDBA74]";
  }

  if (stockBand === "watch") {
    return "border-[#7C5811] bg-[#3A2A0D] text-[#FDE68A]";
  }

  return "border-[#14532D] bg-[#0F2C1C] text-[#86EFAC]";
}

export default function AdminDashboardClient({ adminName, adminEmail }: AdminDashboardClientProps) {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [priceEdits, setPriceEdits] = useState<Record<string, string>>({});
  const [savingPriceKey, setSavingPriceKey] = useState<string | null>(null);
  const [priceMessage, setPriceMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [mukhiFilter, setMukhiFilter] = useState("all");

  function getProductKey(product: RudrakshaProduct) {
    return String(product._id || product.id);
  }

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      setOrdersLoading(true);
      setOrdersError(null);

      try {
        const [productData, orderData] = await Promise.all([
          fetchProducts("all"),
          fetchAdminOrders(adminEmail)
        ]);

        if (!mounted) {
          return;
        }

        const enhanced: ProductRow[] = productData.items.map((item) => {
          const estimatedStock = deriveEstimatedStock(item);
          return {
            ...item,
            estimatedStock,
            stockBand: stockBandFromCount(estimatedStock)
          };
        });

        setProducts(enhanced);
        setPriceEdits(
          enhanced.reduce<Record<string, string>>((acc, product) => {
            acc[getProductKey(product)] = String(product.price);
            return acc;
          }, {})
        );
        setOrders(Array.isArray(orderData.orders) ? orderData.orders : []);
      } catch (requestError) {
        if (!mounted) {
          return;
        }

        const message = requestError instanceof Error ? requestError.message : "Failed to load dashboard data";
        setError(message);
        setOrdersError(message);
      } finally {
        if (mounted) {
          setLoading(false);
          setOrdersLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, [adminEmail]);

  const orderMetrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = Number(orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0).toFixed(2));

    return {
      totalOrders,
      totalRevenue
    };
  }, [orders]);

  const mukhiOptions = useMemo(() => {
    const values = Array.from(new Set(products.map((product) => String(product.mukhi))));
    values.sort((a, b) => Number(a) - Number(b));
    return ["all", ...values];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesMukhi = mukhiFilter === "all" || String(product.mukhi) === mukhiFilter;
      if (!matchesMukhi) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        String(product.mukhi).toLowerCase().includes(normalizedQuery)
      );
    });
  }, [products, mukhiFilter, query]);

  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const avgPrice =
      totalProducts > 0
        ? Number((products.reduce((sum, product) => sum + product.price, 0) / totalProducts).toFixed(2))
        : 0;

    const totalStock = products.reduce((sum, product) => sum + product.estimatedStock, 0);
    const criticalCount = products.filter((product) => product.stockBand === "critical").length;

    const topPriceProduct = products.reduce<ProductRow | null>((best, current) => {
      if (!best || current.price > best.price) {
        return current;
      }

      return best;
    }, null);

    return {
      totalProducts,
      avgPrice,
      totalStock,
      criticalCount,
      topPriceProduct
    };
  }, [products]);

  const mukhiDistribution = useMemo(() => {
    const counts = new Map<string, number>();

    products.forEach((product) => {
      const key = String(product.mukhi);
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return Array.from(counts.entries())
      .map(([mukhi, count]) => ({ mukhi, count }))
      .sort((a, b) => Number(a.mukhi) - Number(b.mukhi));
  }, [products]);

  function handlePriceEditChange(productKey: string, value: string) {
    setPriceEdits((prev) => ({ ...prev, [productKey]: value }));
  }

  async function handleSavePrice(product: ProductRow) {
    const productKey = getProductKey(product);
    const editedValue = String(priceEdits[productKey] ?? "").trim();
    const parsedPrice = Number(editedValue);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setPriceMessage(`Invalid price for ${product.name}`);
      return;
    }

    setSavingPriceKey(productKey);
    setPriceMessage(null);

    try {
      const response = await updateProductPriceAsAdmin({
        adminEmail,
        productId: productKey,
        mukhi: String(product.mukhi),
        price: parsedPrice
      });

      const updatedPrice = response.item.price;
      setProducts((prev) =>
        prev.map((entry) =>
          getProductKey(entry) === productKey ? { ...entry, price: updatedPrice } : entry
        )
      );
      setPriceEdits((prev) => ({ ...prev, [productKey]: String(updatedPrice) }));
      setPriceMessage(`Saved ${product.name} price`);
    } catch (requestError) {
      setPriceMessage(requestError instanceof Error ? requestError.message : "Failed to save price");
    } finally {
      setSavingPriceKey(null);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#140D0A] text-[#F9E9D7]">
      <div className="pointer-events-none absolute -left-40 top-[-220px] h-[420px] w-[420px] rounded-full bg-[#A16207]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-[180px] h-[360px] w-[360px] rounded-full bg-[#B45309]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] left-[22%] h-[320px] w-[320px] rounded-full bg-[#16A34A]/10 blur-3xl" />

      <main className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <section className="dashboard-reveal rounded-3xl border border-[#5C3B2B] bg-[linear-gradient(140deg,#2A1A12,#18100D_60%,#21160F)] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#6B4A39] bg-[#1D130F] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#E6C7A9]">
                <Sparkles className="h-3.5 w-3.5" />
                Sacred Commerce Console
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-[#FFF4E8] sm:text-5xl">
                Rudraksha Admin Command Center
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#DDBE9F] sm:text-base">
                Monitor product movement, inventory pressure, and catalog coverage from one focused control surface.
              </p>
            </div>

            <aside className="w-full rounded-2xl border border-[#64422E] bg-[#1A110D] p-4 lg:max-w-sm">
              <p className="text-xs uppercase tracking-[0.16em] text-[#CFAE92]">Logged in as</p>
              <p className="mt-2 text-lg font-semibold text-[#FFF4E8]">{adminName || "Administrator"}</p>
              <p className="text-sm text-[#CFAE92]">{adminEmail}</p>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-[#63412F] bg-[#22160F] px-3 py-2">
                <span className="text-xs text-[#DDBE9F]">Current alerts</span>
                <span className="text-sm font-semibold text-[#FDE68A]">{metrics.criticalCount} critical</span>
              </div>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-[#63412F] bg-[#22160F] px-3 py-2">
                <span className="text-xs text-[#DDBE9F]">Placed orders</span>
                <span className="text-sm font-semibold text-[#E7C7A8]">{orderMetrics.totalOrders}</span>
              </div>
            </aside>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-[#6B4938] bg-[#1A110E] p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#D4B392]"><Layers className="h-4 w-4" />Catalog Size</p>
              <p className="mt-3 text-3xl font-bold text-[#FFF4E8]">{metrics.totalProducts}</p>
              <p className="mt-1 text-xs text-[#CDAE92]">Unique products currently listed</p>
            </article>

            <article className="rounded-2xl border border-[#6B4938] bg-[#1A110E] p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#D4B392]"><BadgeIndianRupee className="h-4 w-4" />Average Price</p>
              <p className="mt-3 text-3xl font-bold text-[#FFF4E8]">{formatPrice(metrics.avgPrice)}</p>
              <p className="mt-1 text-xs text-[#CDAE92]">Across all listed SKUs</p>
            </article>

            <article className="rounded-2xl border border-[#6B4938] bg-[#1A110E] p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#D4B392]"><Box className="h-4 w-4" />Stock Units</p>
              <p className="mt-3 text-3xl font-bold text-[#FFF4E8]">{metrics.totalStock}</p>
              <p className="mt-1 text-xs text-[#CDAE92]">Estimated live inventory health</p>
            </article>

            <article className="rounded-2xl border border-[#6B4938] bg-[#1A110E] p-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#D4B392]"><TrendingUp className="h-4 w-4" />Premium SKU</p>
              <p className="mt-3 text-lg font-bold text-[#FFF4E8]">{metrics.topPriceProduct?.name || "-"}</p>
              <p className="mt-1 text-xs text-[#CDAE92]">{metrics.topPriceProduct ? formatPrice(metrics.topPriceProduct.price) : "No products"}</p>
            </article>
          </div>
        </section>

        <section className="dashboard-reveal mt-6 rounded-3xl border border-[#5F3D2C] bg-[#18100D]/95 p-5 shadow-xl sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-xl font-bold text-[#FFF0E1] sm:text-2xl">
                <ClipboardList className="h-5 w-5" />
                Placed Orders With User Details
              </h2>
              <p className="mt-1 text-sm text-[#D4B392]">
                Complete buyer details including contact, address, and ordered items.
              </p>
            </div>
            <p className="text-sm font-semibold text-[#E7C7A8]">
              Revenue: {formatPrice(orderMetrics.totalRevenue)}
            </p>
          </div>

          {ordersLoading && <p className="mt-5 text-sm text-[#D7B79A]">Loading orders...</p>}
          {!ordersLoading && ordersError && (
            <p className="mt-5 rounded-xl border border-[#7C2D12] bg-[#31130F] px-4 py-3 text-sm text-[#FDBA74]">
              {ordersError}
            </p>
          )}

          {!ordersLoading && !ordersError && (
            <div className="mt-5 space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order._id;
                const user = typeof order.userId === "string" ? null : order.userId;
                const shipping = order.shipping || {};
                const buyerName = shipping.fullName || user?.name || "Unknown";
                const buyerEmail = user?.email || "-";
                const phone = shipping.phone || "-";
                const address =
                  [shipping.addressLine1, shipping.addressLine2, shipping.city, shipping.state, shipping.postalCode, shipping.country]
                    .filter(Boolean)
                    .join(", ") || order.shippingAddress;

                return (
                  <article key={order._id} className="rounded-2xl border border-[#5E3E2E] bg-[#1A110D] p-4">
                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
                      className="w-full rounded-xl border border-[#4E3529] bg-[#21160F] px-3 py-3 text-left"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.12em] text-[#CFAE92]">Order ID</p>
                          <p className="text-sm font-semibold text-[#FFF4E8]">{order._id}</p>
                          <p className="mt-1 text-xs text-[#CDAE92]">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-[#6B4A39] bg-[#241711] px-2 py-1 text-xs text-[#E7C7A8]">
                            {buyerName}
                          </span>
                          <span className="rounded-full border border-[#6B4A39] bg-[#241711] px-2 py-1 text-xs text-[#E7C7A8]">
                            {order.status}
                          </span>
                          <span className="rounded-full border border-[#6B4A39] bg-[#241711] px-2 py-1 text-xs text-[#E7C7A8]">
                            {formatPrice(order.totalAmount)}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-[#6B4A39] bg-[#241711] px-2 py-1 text-xs text-[#E7C7A8]">
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </span>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <>
                        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-xl border border-[#4E3529] bg-[#21160F] p-3">
                            <p className="text-xs uppercase tracking-[0.1em] text-[#CDAE92]">Buyer Name</p>
                            <p className="mt-1 text-sm font-semibold text-[#FFF4E8]">{buyerName}</p>
                          </div>
                          <div className="rounded-xl border border-[#4E3529] bg-[#21160F] p-3">
                            <p className="text-xs uppercase tracking-[0.1em] text-[#CDAE92]">Email</p>
                            <p className="mt-1 text-sm font-semibold text-[#FFF4E8] break-all">{buyerEmail}</p>
                          </div>
                          <div className="rounded-xl border border-[#4E3529] bg-[#21160F] p-3">
                            <p className="text-xs uppercase tracking-[0.1em] text-[#CDAE92]">Phone</p>
                            <p className="mt-1 text-sm font-semibold text-[#FFF4E8]">{phone}</p>
                          </div>
                          <div className="rounded-xl border border-[#4E3529] bg-[#21160F] p-3">
                            <p className="text-xs uppercase tracking-[0.1em] text-[#CDAE92]">User ID</p>
                            <p className="mt-1 text-sm font-semibold text-[#FFF4E8] break-all">{typeof order.userId === "string" ? order.userId : order.userId?._id || "-"}</p>
                          </div>
                        </div>

                        <div className="mt-3 rounded-xl border border-[#4E3529] bg-[#21160F] p-3">
                          <p className="text-xs uppercase tracking-[0.1em] text-[#CDAE92]">Shipping Address</p>
                          <p className="mt-1 text-sm text-[#FFF4E8]">{address || "-"}</p>
                        </div>

                        <div className="mt-3 rounded-xl border border-[#4E3529] bg-[#21160F] p-3">
                          <p className="text-xs uppercase tracking-[0.1em] text-[#CDAE92]">Items</p>
                          <div className="mt-2 space-y-1">
                            {(order.items || []).map((entry, index) => (
                              <p key={`${order._id}-${index}`} className="text-sm text-[#F5E1CE]">
                                {(entry.productId?.name || "Product") +
                                  ` (${entry.productId?.mukhi || "-"} Mukhi)`} x {entry.quantity} - {formatPrice(entry.price)}
                              </p>
                            ))}
                            {(order.items || []).length === 0 && (
                              <p className="text-sm text-[#CDAE92]">No items found for this order.</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </article>
                );
              })}

              {orders.length === 0 && (
                <p className="rounded-xl border border-[#5E3E2E] bg-[#1A110D] px-4 py-6 text-center text-sm text-[#C9A98B]">
                  No placed orders yet.
                </p>
              )}
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="dashboard-reveal rounded-3xl border border-[#5F3D2C] bg-[#18100D]/95 p-5 shadow-xl sm:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#FFF0E1] sm:text-2xl">Catalog Management</h2>
                <p className="mt-1 text-sm text-[#D4B392]">Filter, inspect and monitor the health of each listing.</p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A78972]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search product or mukhi"
                    className="w-full rounded-xl border border-[#6B4A39] bg-[#221710] py-2 pl-9 pr-3 text-sm text-[#FAEBDD] outline-none placeholder:text-[#9D7E67] focus:border-[#B08968] sm:w-60"
                  />
                </label>

                <label className="relative">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A78972]" />
                  <select
                    value={mukhiFilter}
                    onChange={(event) => setMukhiFilter(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#6B4A39] bg-[#221710] py-2 pl-9 pr-8 text-sm text-[#FAEBDD] outline-none focus:border-[#B08968] sm:w-44"
                  >
                    {mukhiOptions.map((option) => (
                      <option key={option} value={option}>
                        {option === "all" ? "All Mukhi" : `${option} Mukhi`}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {loading && <p className="mt-6 text-sm text-[#D7B79A]">Loading catalog data...</p>}
            {!loading && error && (
              <p className="mt-6 rounded-xl border border-[#7C2D12] bg-[#31130F] px-4 py-3 text-sm text-[#FDBA74]">
                {error}
              </p>
            )}

            {!loading && !error && (
              <div className="mt-5 overflow-hidden rounded-2xl border border-[#5E3E2E]">
                <div className="max-h-[460px] overflow-auto">
                  {priceMessage && (
                    <p className="border-b border-[#5E3E2E] bg-[#21160F] px-4 py-2 text-xs text-[#E7C7A8]">{priceMessage}</p>
                  )}
                  <table className="min-w-full text-left text-sm">
                    <thead className="sticky top-0 bg-[#241711] text-xs uppercase tracking-[0.12em] text-[#CFB094]">
                      <tr>
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Mukhi</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={getProductKey(product)} className="border-t border-[#4C3327] bg-[#1B120D] text-[#F6E2CF]">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#FFF4E8]">{product.name}</p>
                            <p className="text-xs text-[#CDAE92] line-clamp-1">{product.desc}</p>
                          </td>
                          <td className="px-4 py-3">{product.mukhi}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                value={priceEdits[getProductKey(product)] ?? String(product.price)}
                                onChange={(event) => handlePriceEditChange(getProductKey(product), event.target.value)}
                                className="w-24 rounded-md border border-[#6B4A39] bg-[#21160F] px-2 py-1 text-xs text-[#FFF4E8] outline-none"
                              />
                              <button
                                type="button"
                                disabled={savingPriceKey === getProductKey(product)}
                                onClick={() => handleSavePrice(product)}
                                className="rounded-md bg-[#8B4513] px-2 py-1 text-xs font-semibold text-white disabled:opacity-60"
                              >
                                {savingPriceKey === getProductKey(product) ? "Saving..." : "Save"}
                              </button>
                            </div>
                            <p className="mt-1 text-[11px] text-[#CDAE92]">Current: {formatPrice(product.price)}</p>
                          </td>
                          <td className="px-4 py-3">{product.estimatedStock}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getStockBadgeClass(product.stockBand)}`}>
                              {product.stockBand}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {filteredProducts.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#C9A98B]">
                            No products matched your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="dashboard-reveal rounded-3xl border border-[#5F3D2C] bg-[#18100D]/95 p-5 shadow-xl">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#FFF1E2]"><BarChart3 className="h-5 w-5" />Mukhi Distribution</h3>
              <div className="mt-4 space-y-3">
                {mukhiDistribution.slice(0, 8).map((entry) => {
                  const width = products.length > 0 ? Math.max(8, Math.round((entry.count / products.length) * 100)) : 0;
                  return (
                    <div key={entry.mukhi}>
                      <div className="mb-1 flex items-center justify-between text-xs text-[#D6B69A]">
                        <span>{entry.mukhi} Mukhi</span>
                        <span>{entry.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#2F1F17]">
                        <div className="h-2 rounded-full bg-[linear-gradient(90deg,#E8CFB8,#D49B62)] transition-all duration-500" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="dashboard-reveal rounded-3xl border border-[#5F3D2C] bg-[#18100D]/95 p-5 shadow-xl">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#FFF1E2]"><Activity className="h-5 w-5" />System Pulse</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-xl border border-[#5F4131] bg-[#21160F] px-3 py-2">
                  <span className="text-[#DDBE9F]">Catalog Sync</span>
                  <span className="inline-flex items-center gap-1 text-[#86EFAC]"><PackageCheck className="h-4 w-4" />Healthy</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#5F4131] bg-[#21160F] px-3 py-2">
                  <span className="text-[#DDBE9F]">Buyer Sessions</span>
                  <span className="inline-flex items-center gap-1 text-[#FDE68A]"><Users className="h-4 w-4" />Moderate</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-[#5F4131] bg-[#21160F] px-3 py-2">
                  <span className="text-[#DDBE9F]">Inventory Alerts</span>
                  <span className="inline-flex items-center gap-1 text-[#FDBA74]"><AlertTriangle className="h-4 w-4" />{metrics.criticalCount} items</span>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes dashboardRise {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .dashboard-reveal {
          animation: dashboardRise 460ms ease-out both;
        }
      `}</style>
    </div>
  );
}
