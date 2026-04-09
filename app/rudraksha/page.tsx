"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrency } from "@/components/common/CurrencyProvider";
import {
  fetchDobRecommendations,
  fetchNameRecommendations,
  fetchProducts,
  RecommendationResponse,
  RudrakshaProduct
} from "@/lib/api";
import { getMukhiImageSrc } from "@/lib/mukhiImages";

type ZodiacKey =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

type ZodiacInfo = {
  title: string;
  combinations: string[];
  topics: string[];
};

const ZODIAC_ORDER: ZodiacKey[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces"
];

const ZODIAC_INFO: Record<ZodiacKey, ZodiacInfo> = {
  aries: {
    title: "Aries",
    combinations: ["3 Mukhi", "3 + 5 Mukhi"],
    topics: ["Confidence", "Action", "Leadership"]
  },
  taurus: {
    title: "Taurus",
    combinations: ["5 Mukhi", "5 + 6 Mukhi"],
    topics: ["Stability", "Wealth", "Grounded routine"]
  },
  gemini: {
    title: "Gemini",
    combinations: ["4 Mukhi", "4 + 6 Mukhi"],
    topics: ["Communication", "Learning", "Creativity"]
  },
  cancer: {
    title: "Cancer",
    combinations: ["2 Mukhi", "2 + 9 Mukhi"],
    topics: ["Emotional balance", "Family harmony", "Inner peace"]
  },
  leo: {
    title: "Leo",
    combinations: ["1 Mukhi", "1 + 12 Mukhi"],
    topics: ["Authority", "Visibility", "Self-belief"]
  },
  virgo: {
    title: "Virgo",
    combinations: ["6 Mukhi", "4 + 6 Mukhi"],
    topics: ["Focus", "Health discipline", "Clarity"]
  },
  libra: {
    title: "Libra",
    combinations: ["2 Mukhi", "2 + 5 Mukhi"],
    topics: ["Balance", "Relationships", "Decision making"]
  },
  scorpio: {
    title: "Scorpio",
    combinations: ["8 Mukhi", "8 + 9 Mukhi"],
    topics: ["Protection", "Transformation", "Willpower"]
  },
  sagittarius: {
    title: "Sagittarius",
    combinations: ["7 Mukhi", "7 + 11 Mukhi"],
    topics: ["Growth", "Fortune", "Spiritual expansion"]
  },
  capricorn: {
    title: "Capricorn",
    combinations: ["11 Mukhi", "11 + 5 Mukhi"],
    topics: ["Discipline", "Career goals", "Consistency"]
  },
  aquarius: {
    title: "Aquarius",
    combinations: ["9 Mukhi", "9 + 4 Mukhi"],
    topics: ["Innovation", "Vision", "Emotional strength"]
  },
  pisces: {
    title: "Pisces",
    combinations: ["6 Mukhi", "6 + 2 Mukhi"],
    topics: ["Intuition", "Compassion", "Spirituality"]
  }
};

function getZodiacFromDob(value: string): ZodiacKey | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [, monthStr, dayStr] = value.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);

  if (!Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "pisces";

  return null;
}

export default function RudrakshaPage() {
  const { addItem, itemCount } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedMukhi, setSelectedMukhi] = useState("all");
  const [products, setProducts] = useState<RudrakshaProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [nameRecommendation, setNameRecommendation] = useState<RecommendationResponse | null>(null);
  const [dobRecommendation, setDobRecommendation] = useState<RecommendationResponse | null>(null);
  const [selectedZodiac, setSelectedZodiac] = useState<ZodiacKey>("aries");
  const [zodiacModalOpen, setZodiacModalOpen] = useState<ZodiacKey | null>(null);
  const [recoLoading, setRecoLoading] = useState(false);
  const [recoError, setRecoError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      setLoadingProducts(true);
      setError(null);

      try {
        const data = await fetchProducts(selectedMukhi);
        if (mounted) {
          setProducts(data.items);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load products");
        }
      } finally {
        if (mounted) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [selectedMukhi]);

  useEffect(() => {
    let mounted = true;
    const canFetchName = name.trim().length > 0;
    const canFetchDob = /^\d{4}-\d{2}-\d{2}$/.test(dob);

    if (!canFetchName && !canFetchDob) {
      setNameRecommendation(null);
      setDobRecommendation(null);
      setRecoError(null);
      return;
    }

    async function loadRecommendations() {
      setRecoLoading(true);
      setRecoError(null);

      try {
        const [nameRes, dobRes] = await Promise.all([
          canFetchName ? fetchNameRecommendations(name.trim()) : Promise.resolve(null),
          canFetchDob ? fetchDobRecommendations(dob) : Promise.resolve(null)
        ]);

        if (mounted) {
          setNameRecommendation(nameRes);
          setDobRecommendation(dobRes);
        }
      } catch (requestError) {
        if (mounted) {
          setRecoError(
            requestError instanceof Error ? requestError.message : "Failed to load recommendations"
          );
        }
      } finally {
        if (mounted) {
          setRecoLoading(false);
        }
      }
    }

    const timer = setTimeout(loadRecommendations, 350);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [name, dob]);

  useEffect(() => {
    const detected = getZodiacFromDob(dob);
    if (detected) {
      setSelectedZodiac(detected);
    }
  }, [dob]);

  const recommendationItems = useMemo(() => {
    if (dobRecommendation?.items?.length) {
      return dobRecommendation.items;
    }
    return nameRecommendation?.items || [];
  }, [dobRecommendation?.items, nameRecommendation?.items]);

  const recommendedMukhi =
    dobRecommendation?.recommendedMukhi ?? nameRecommendation?.recommendedMukhi ?? null;
  const lifePathNumber = dobRecommendation?.lifePathNumber ?? null;
  const nameNumber = nameRecommendation?.nameNumber ?? null;

  const mukhiOptions = useMemo(
    () => ["all", ...Array.from({ length: 14 }, (_, i) => String(i + 1))],
    []
  );

  async function handleAddToCart(product: RudrakshaProduct) {
    setAddingProductId(String(product._id || product.id));
    try {
      await addItem(product, 1);
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE8C7] to-[#FFD8A8]">
      <Header />

      <main className="mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[#FFD8A8] bg-white p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-[#2C1810]">Rudraksha Recommendation Engine</h1>
          <p className="mt-2 text-sm text-[#4A3728]">
            Enter your name and date of birth to calculate numerology and get personalized Mukhi suggestions.
          </p>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-[#2C1810]">Name</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-[#FFD8A8] px-4 py-3 outline-none"
                />
              </label>
              <label className="space-y-2 block">
                <span className="text-sm font-semibold text-[#2C1810]">Date of Birth</span>
                <input
                  type="date"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                  className="w-full rounded-xl border border-[#FFD8A8] px-4 py-3 outline-none"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-[#FFD8A8] bg-[#fff7eb] p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2C1810]">
                Horoscope by Zodiac
              </h2>
              <p className="mt-1 text-xs text-[#4A3728]">
                Click on your zodiac sign to view combinations and focus topics.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {ZODIAC_ORDER.map((zodiac) => (
                  <button
                    key={zodiac}
                    type="button"
                    onClick={() => {
                      setSelectedZodiac(zodiac);
                      setZodiacModalOpen(zodiac);
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer hover:shadow-md ${
                      selectedZodiac === zodiac
                        ? "bg-[#8B4513] text-white"
                        : "border border-[#FFD8A8] bg-white text-[#2C1810] hover:bg-[#fffbf5]"
                    }`}
                  >
                    {ZODIAC_INFO[zodiac].title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-[#fff7eb] p-4">
            {recoLoading && <p className="text-sm text-[#4A3728]">Calculating recommendations...</p>}
            {recoError && <p className="text-sm text-red-700">{recoError}</p>}
            {!recoLoading && !recoError && (
              <div className="grid gap-4 md:grid-cols-3">
                <article>
                  <p className="text-xs uppercase tracking-wide text-[#4A3728]">Life Path Number</p>
                  <p className="text-2xl font-bold text-[#8B4513]">{lifePathNumber ?? "-"}</p>
                </article>
                <article>
                  <p className="text-xs uppercase tracking-wide text-[#4A3728]">Name Number</p>
                  <p className="text-2xl font-bold text-[#8B4513]">{nameNumber ?? "-"}</p>
                </article>
                <article>
                  <p className="text-xs uppercase tracking-wide text-[#4A3728]">Recommended Mukhi</p>
                  <p className="text-2xl font-bold text-[#8B4513]">
                    {recommendedMukhi ? `${recommendedMukhi} Mukhi` : "-"}
                  </p>
                </article>
              </div>
            )}
          </div>

          {recommendationItems.length > 0 && (
            <div className="mt-5">
              <h2 className="text-lg font-semibold text-[#2C1810]">Suggested Products</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {recommendationItems.slice(0, 4).map((item) => (
                  <Link
                    key={String(item._id || item.id)}
                    href={`/rudraksha/${String(item._id || item.id)}`}
                    className="block rounded-xl border border-[#FFD8A8] bg-white p-3 transition hover:shadow-md"
                  >
                    <div className="relative mb-3 h-40 w-full overflow-hidden rounded-lg bg-[#fff7eb]">
                      <Image
                        src={getMukhiImageSrc(item.mukhi, item.image)}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <p className="font-semibold text-[#2C1810]">{item.name}</p>
                    <p className="text-sm text-[#4A3728]">{item.mukhi} Mukhi</p>
                    <p className="mt-1 font-semibold text-[#8B4513]">{formatPrice(item.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-[#2C1810]">Shop Rudraksha Collection</h2>
            <p className="text-sm font-medium text-[#4A3728]">Cart Items: {itemCount}</p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {mukhiOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedMukhi(option)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedMukhi === option
                    ? "bg-[#8B4513] text-white"
                    : "border border-[#FFD8A8] bg-[#fff7eb] text-[#2C1810]"
                }`}
              >
                {option === "all" ? "All Mukhi" : `${option} Mukhi`}
              </button>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loadingProducts && <p className="text-sm text-[#4A3728]">Loading products...</p>}
            {!loadingProducts &&
              products.map((product) => {
                const productId = String(product._id || product.id);
                return (
                  <article
                    key={productId}
                    className="rounded-3xl border border-[#FFD8A8] bg-[#fff7eb] p-5 shadow-sm"
                  >
                    <Link href={`/rudraksha/${productId}`} className="block">
                      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-2xl bg-white">
                        <Image
                          src={getMukhiImageSrc(product.mukhi, product.image)}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#2C1810]">{product.name}</h3>
                          <p className="mt-1 text-sm text-[#4A3728]">{product.mukhi} Mukhi</p>
                        </div>
                        <p className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8B4513]">
                          {formatPrice(product.price)}
                        </p>
                      </div>

                      <p className="mt-3 text-sm text-[#4A3728]">{product.desc}</p>
                      <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1">
                        <Star className="h-4 w-4 fill-current text-amber-500" />
                        <span className="text-xs font-semibold text-[#4A3728]">{product.rating}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.benefits.map((benefit) => (
                          <span key={benefit} className="rounded-full bg-white px-2 py-1 text-xs text-[#4A3728]">
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      disabled={addingProductId === productId}
                      className="mt-5 w-full rounded-xl bg-[#8B4513] py-2 text-sm font-semibold text-white"
                    >
                      {addingProductId === productId ? "Adding..." : "Add to Cart"}
                    </button>
                  </article>
                );
              })}
          </div>
        </section>
      </main>

      <Footer variant="simple" />

      {zodiacModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 border-b border-[#FFD8A8] bg-gradient-to-r from-[#FFE8C7] to-[#FFD8A8] p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#2C1810]">
                  {ZODIAC_INFO[zodiacModalOpen].title}
                </h2>
                <button
                  onClick={() => setZodiacModalOpen(null)}
                  className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#2C1810] transition hover:bg-white"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 p-6">
              {/* Combinations */}
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#8B4513]">
                  Recommended Mukhi Combinations
                </p>
                <div className="flex flex-wrap gap-2">
                  {ZODIAC_INFO[zodiacModalOpen].combinations.map((item) => (
                    <span
                      key={item}
                      className="inline-block rounded-full bg-gradient-to-r from-[#FFE8C7] to-[#FFD8A8] px-4 py-2 text-sm font-semibold text-[#2C1810]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-wide text-[#8B4513]">
                  Focus Topics
                </p>
                <div className="flex flex-wrap gap-2">
                  {ZODIAC_INFO[zodiacModalOpen].topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-block rounded-full border-2 border-[#FFD8A8] px-4 py-2 text-sm font-medium text-[#2C1810]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-xl bg-[#fff7eb] p-4">
                <p className="text-sm text-[#4A3728]">
                  {ZODIAC_INFO[zodiacModalOpen].title}s can benefit from the recommended Mukhi combinations
                  to enhance focus on these key life areas.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setZodiacModalOpen(null)}
                className="w-full rounded-lg bg-[#8B4513] py-3 text-sm font-semibold text-white transition hover:bg-[#6B3410]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
