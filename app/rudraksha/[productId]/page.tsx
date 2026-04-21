"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { useCart } from "@/components/cart/CartProvider";
import { useCurrency } from "@/components/common/CurrencyProvider";
import { fetchProductById, RudrakshaProduct } from "@/lib/api";
import { getMukhiImageSrc } from "@/lib/mukhiImages";

type RudrakshaInsight = {
  traditionalAssociation: string;
  whatItDoes: string;
  bestFor: string;
  dailyPractice: string;
};

const MUKHI_INSIGHTS: Record<string, RudrakshaInsight> = {
  "1": {
    traditionalAssociation: "Shiva consciousness and single-pointed awareness.",
    whatItDoes: "Traditionally used to support deep focus, spiritual clarity, and inner stillness.",
    bestFor: "People seeking meditation depth, leadership calm, and reduced mental noise.",
    dailyPractice: "Wear during morning prayer and sit for 10 minutes of slow breathing while setting one intention."
  },
  "2": {
    traditionalAssociation: "Shiva and Shakti union, balance and harmony.",
    whatItDoes: "Traditionally believed to improve emotional balance and relationship understanding.",
    bestFor: "People managing family stress, partnership issues, or emotional swings.",
    dailyPractice: "Before important conversations, hold the bead for one minute and breathe deeply to center yourself."
  },
  "3": {
    traditionalAssociation: "Agni energy and transformation.",
    whatItDoes: "Traditionally used for confidence, courage, and release of old emotional burden.",
    bestFor: "People rebuilding confidence and moving forward after setbacks.",
    dailyPractice: "Wear during work or study hours and repeat a short affirmation for courage each morning."
  },
  "4": {
    traditionalAssociation: "Brahma knowledge and creative intelligence.",
    whatItDoes: "Traditionally connected with communication clarity, memory support, and structured thinking.",
    bestFor: "Students, teachers, creators, speakers, and knowledge workers.",
    dailyPractice: "Use before reading, writing, or speaking tasks to begin with a clear mental focus."
  },
  "5": {
    traditionalAssociation: "Kalagni Rudra protection and life balance.",
    whatItDoes: "Traditionally used for calmness, steadiness, and general well-being support.",
    bestFor: "Most people as an everyday spiritual bead for routine stability.",
    dailyPractice: "Wear daily and spend a few minutes in gratitude practice in the evening."
  },
  "6": {
    traditionalAssociation: "Kartikeya discipline and skill development.",
    whatItDoes: "Traditionally linked to focus, willpower, and balanced decision-making.",
    bestFor: "People preparing for exams, interviews, or high-focus professional goals.",
    dailyPractice: "Wear during study sessions and work blocks, then review one clear goal at the end of day."
  },
  "7": {
    traditionalAssociation: "Lakshmi blessings and stability.",
    whatItDoes: "Traditionally believed to support grounded progress, financial discipline, and patience.",
    bestFor: "People seeking better consistency in wealth planning and personal growth.",
    dailyPractice: "Use during weekly planning and budgeting to keep actions aligned with long-term goals."
  },
  "8": {
    traditionalAssociation: "Ganesha obstacle-clearing energy.",
    whatItDoes: "Traditionally used for overcoming delays, fear, and blocked momentum.",
    bestFor: "People facing repeated hurdles in career, business, or personal projects.",
    dailyPractice: "Wear before important meetings and begin tasks with a short grounding breath routine."
  },
  "9": {
    traditionalAssociation: "Durga strength and protective force.",
    whatItDoes: "Traditionally connected with emotional strength, confidence, and resilience.",
    bestFor: "People needing support during demanding phases and high emotional pressure.",
    dailyPractice: "Wear when entering stressful situations and pause for three steady breaths when overwhelmed."
  },
  "10": {
    traditionalAssociation: "Vishnu preservation and life order.",
    whatItDoes: "Traditionally used for confidence in transitions and balanced life management.",
    bestFor: "People navigating change, responsibility, and multi-role pressure.",
    dailyPractice: "Use during morning planning to prioritize your top three actions clearly."
  },
  "11": {
    traditionalAssociation: "Hanuman devotion and fearless action.",
    whatItDoes: "Traditionally believed to support courage, discipline, and spiritual commitment.",
    bestFor: "People on a deeper spiritual path with demanding personal goals.",
    dailyPractice: "Wear during spiritual practice and stay consistent with a fixed prayer or mantra time."
  },
  "12": {
    traditionalAssociation: "Surya vitality and radiance.",
    whatItDoes: "Traditionally used for confidence, clear presence, and active leadership energy.",
    bestFor: "People in leadership, public-facing roles, and high-visibility work.",
    dailyPractice: "Wear in the morning and do a short sunlight breathing routine if possible."
  },
  "13": {
    traditionalAssociation: "Kama and attraction with wise intent.",
    whatItDoes: "Traditionally linked with charisma, harmonious relationships, and creative attraction.",
    bestFor: "People seeking better interpersonal confidence and magnetic communication.",
    dailyPractice: "Use before social or creative activities and set a respectful intention for interaction."
  },
  "14": {
    traditionalAssociation: "Shiva third-eye insight and foresight.",
    whatItDoes: "Traditionally used to support intuition, wise judgement, and long-view decisions.",
    bestFor: "People in strategy, leadership, and spiritually reflective practice.",
    dailyPractice: "Wear during important decision windows and journal key insights before acting."
  }
};

function getRudrakshaInsight(product: RudrakshaProduct): RudrakshaInsight {
  const key = String(product.mukhi || "").replace(/\D/g, "");

  if (MUKHI_INSIGHTS[key]) {
    return MUKHI_INSIGHTS[key];
  }

  return {
    traditionalAssociation: `${product.mukhi} Mukhi spiritual support and balance.`,
    whatItDoes:
      "Traditionally used to support calm focus, emotional steadiness, and mindful living.",
    bestFor: "People who want a daily spiritual anchor and consistent inner balance.",
    dailyPractice: "Wear regularly and combine with a short daily breathing or meditation practice."
  };
}

export default function RudrakshaProductPage() {
  const router = useRouter();
  const { status } = useSession();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const params = useParams<{ productId?: string }>();
  const productId = String(params?.productId || "").trim();

  const [product, setProduct] = useState<RudrakshaProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      if (!productId) {
        if (mounted) {
          setError("Invalid product id");
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchProductById(productId);
        if (mounted) {
          setProduct(data.item);
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load product");
          setProduct(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [productId]);

  const primaryBenefits = useMemo(() => product?.benefits ?? [], [product?.benefits]);
  const insight = useMemo(() => {
    if (!product) {
      return null;
    }

    return getRudrakshaInsight(product);
  }, [product]);

  async function handleAddToCart() {
    if (!product) {
      return;
    }

    if (status !== "authenticated") {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    setAddingToCart(true);
    try {
      await addItem(product, 1);
    } finally {
      setAddingToCart(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE8C7] to-[#FFD8A8]">
      <Header />

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <Link
          href="/rudraksha"
          className="inline-flex items-center gap-2 rounded-full border border-[#D8A26A] bg-white px-4 py-2 text-sm font-semibold text-[#4A3728] transition hover:bg-[#fff7eb]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to collection
        </Link>

        {loading && <p className="mt-6 text-sm text-[#4A3728]">Loading product details...</p>}

        {!loading && error && (
          <div className="mt-6 rounded-2xl border border-red-300 bg-white p-6">
            <p className="text-sm text-red-700">{error}</p>
            <Link
              href="/rudraksha"
              className="mt-4 inline-flex rounded-lg bg-[#8B4513] px-4 py-2 text-sm font-semibold text-white"
            >
              Go to products
            </Link>
          </div>
        )}

        {!loading && product && (
          <section className="mt-6 grid gap-8 rounded-3xl border border-[#FFD8A8] bg-white p-6 shadow-xl lg:grid-cols-2 lg:p-8">
            <div className="relative h-72 overflow-hidden rounded-2xl bg-[#fff7eb] sm:h-96 lg:h-full">
              <Image
                src={getMukhiImageSrc(product.mukhi, product.image)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div>
              <p className="inline-flex rounded-full bg-[#fff7eb] px-3 py-1 text-xs font-semibold text-[#8B4513]">
                {product.mukhi} Mukhi
              </p>
              <h1 className="mt-3 text-3xl font-bold text-[#2C1810]">{product.name}</h1>

              <div className="mt-4 flex items-center gap-3">
                <p className="text-2xl font-extrabold text-[#8B4513]">{formatPrice(product.price)}</p>
                <div className="inline-flex items-center gap-1 rounded-full bg-[#fff7eb] px-2 py-1">
                  <Star className="h-4 w-4 fill-current text-amber-500" />
                  <span className="text-sm font-semibold text-[#4A3728]">{product.rating}</span>
                </div>
              </div>

              <p className="mt-5 text-base leading-7 text-[#4A3728]">{product.desc}</p>

              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2C1810]">Benefits</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {primaryBenefits.map((benefit) => (
                    <span
                      key={benefit}
                      className="rounded-full border border-[#FFD8A8] bg-[#fff7eb] px-3 py-1 text-sm text-[#4A3728]"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>

              {insight && (
                <div className="mt-6 rounded-2xl border border-[#FFD8A8] bg-[#fff7eb] p-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-[#2C1810]">
                    What This Rudraksha Does
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-[#4A3728]">
                    <p>
                      <span className="font-semibold text-[#2C1810]">Traditional Association:</span>{" "}
                      {insight.traditionalAssociation}
                    </p>
                    <p>
                      <span className="font-semibold text-[#2C1810]">How It Helps:</span> {insight.whatItDoes}
                    </p>
                    <p>
                      <span className="font-semibold text-[#2C1810]">Best For:</span> {insight.bestFor}
                    </p>
                    <p>
                      <span className="font-semibold text-[#2C1810]">Daily Use:</span> {insight.dailyPractice}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="mt-8 w-full rounded-xl bg-[#8B4513] py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer variant="simple" />
    </div>
  );
}
