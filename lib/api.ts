export type RudrakshaProduct = {
  id: number | string;
  _id?: string;
  mukhi: string;
  name: string;
  price: number;
  desc: string;
  benefits: string[];
  rating: number;
  image: string;
};

export type RecommendationResponse = {
  type: "name" | "dob";
  input: string;
  items: RudrakshaProduct[];
  recommendedMukhi: number;
  nameNumber?: number;
  lifePathNumber?: number;
};

export type ExploreRecommendationResponse = {
  type: "horoscope" | "bhagyank" | "name";
  label: string;
  value: number;
  item: RudrakshaProduct;
};

export type LifePathResponse = {
  lifePathNumber: number;
  meaning: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const finalResponse = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!finalResponse.ok) {
    const fallbackMessage = `Request failed with status ${finalResponse.status}`;

    try {
      const errorPayload = await finalResponse.json();
      throw new Error(errorPayload.message || fallbackMessage);
    } catch {
      throw new Error(fallbackMessage);
    }
  }

  return finalResponse.json() as Promise<T>;
}

export async function fetchProducts(mukhi?: string) {
  const normalizedMukhi = String(mukhi || "all").trim();
  const query = normalizedMukhi !== "all" ? `?mukhi=${encodeURIComponent(normalizedMukhi)}` : "";
  const filtered = await request<{ items: RudrakshaProduct[] }>(`/products${query}`);

  if (normalizedMukhi === "all" || filtered.items.length > 0) {
    return filtered;
  }

  // Fallback for stale backend processes where mukhi filter may not behave correctly.
  const all = await request<{ items: RudrakshaProduct[] }>("/products");
  return {
    items: all.items.filter((item) => String(item.mukhi) === normalizedMukhi)
  };
}

export async function fetchProductById(productId: string) {
  return request<{ item: RudrakshaProduct }>(`/products/${encodeURIComponent(productId)}`);
}

export async function fetchNameRecommendations(name: string) {
  return request<RecommendationResponse>(
    `/recommend/name?name=${encodeURIComponent(name)}`
  );
}

export async function fetchDobRecommendations(dob: string) {
  return request<RecommendationResponse>(
    `/recommend/dob?dob=${encodeURIComponent(dob)}`
  );
}

export async function fetchExploreRecommendation(params: {
  type: "horoscope" | "bhagyank" | "name";
  date?: string;
  name?: string;
}) {
  const query = new URLSearchParams({ type: params.type });

  if (params.date) {
    query.set("date", params.date);
  }

  if (params.name) {
    query.set("name", params.name);
  }

  return request<ExploreRecommendationResponse>(`/recommendations/explore?${query.toString()}`);
}

export async function calculateLifePath(payload: { day: number; month: number; year: number }) {
  return request<LifePathResponse>("/life-path", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export type CartEntry = {
  product: RudrakshaProduct;
  quantity: number;
  lineTotal: number;
};

export type CartResponse = {
  userId: string;
  items: CartEntry[];
  totalAmount: number;
};

export async function fetchCart(userId: string) {
  return request<CartResponse>(`/cart/${userId}`);
}

export async function addCartItem(payload: { userId: string; productId: string; quantity?: number }) {
  return request<CartResponse>("/cart/add", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateCartItem(payload: { userId: string; productId: string; quantity: number }) {
  return request<CartResponse>("/cart/update", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function removeCartItem(payload: { userId: string; productId: string }) {
  return request<CartResponse>("/cart/remove", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export type OrderResponse = {
  order: {
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
};

export async function createOrder(payload: { userId: string; shippingAddress: string }) {
  return request<OrderResponse>("/order/create", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function createOrderFromItems(payload: {
  userId: string;
  shippingAddress?: string;
  shipping?: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: { productId: string; quantity: number }[];
}) {
  return request<OrderResponse>("/order/create", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchOrders(userId: string) {
  return request<{ orders: OrderResponse["order"][] }>(`/order/${userId}`);
}
