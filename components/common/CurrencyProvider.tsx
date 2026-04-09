"use client";

import { createContext, useContext, useMemo, useState } from "react";

const CURRENCY_STORAGE_KEY = "rudraksha_currency_v1";

export const SUPPORTED_CURRENCIES = [
  "AUD",
  "CAD",
  "USD",
  "INR",
  "JPY",
  "AED",
  "MYR",
  "SGD"
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

const USD_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  AUD: 1.52,
  CAD: 1.36,
  USD: 1,
  INR: 83.25,
  JPY: 151.2,
  AED: 3.67,
  MYR: 4.71,
  SGD: 1.35
};

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatPrice: (amountInUsd: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function getInitialCurrency(): CurrencyCode {
  if (typeof window === "undefined") {
    return "USD";
  }

  const saved = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (saved && SUPPORTED_CURRENCIES.includes(saved as CurrencyCode)) {
    return saved as CurrencyCode;
  }

  return "USD";
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(getInitialCurrency);

  function setCurrency(nextCurrency: CurrencyCode) {
    setCurrencyState(nextCurrency);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, nextCurrency);
    }
  }

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatPrice: (amountInUsd: number) => {
        const convertedAmount = amountInUsd * USD_EXCHANGE_RATES[currency];
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 2
        }).format(convertedAmount);
      }
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }

  return context;
}
