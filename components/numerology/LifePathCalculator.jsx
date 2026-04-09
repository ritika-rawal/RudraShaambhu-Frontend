"use client";

import { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { calculateLifePath } from "@/lib/api";

function validateForm(day, month, year) {
  if (!day || !month || !year) {
    return "Please fill day, month and year.";
  }

  const dayNum = Number(day);
  const monthNum = Number(month);
  const yearNum = Number(year);

  if (
    !Number.isInteger(dayNum) ||
    !Number.isInteger(monthNum) ||
    !Number.isInteger(yearNum)
  ) {
    return "Day, month and year must be valid numbers.";
  }

  if (monthNum < 1 || monthNum > 12) {
    return "Month must be between 1 and 12.";
  }

  if (dayNum < 1 || dayNum > 31) {
    return "Day must be between 1 and 31.";
  }

  if (yearNum < 1) {
    return "Year must be greater than 0.";
  }

  const date = new Date(Date.UTC(yearNum, monthNum - 1, dayNum));
  const valid =
    date.getUTCFullYear() === yearNum &&
    date.getUTCMonth() === monthNum - 1 &&
    date.getUTCDate() === dayNum;

  if (!valid) {
    return "Please enter a valid date.";
  }

  return null;
}

export default function LifePathCalculator() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    const validationMessage = validateForm(day, month, year);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setLoading(true);
    try {
      const response = await calculateLifePath({
        day: Number(day),
        month: Number(month),
        year: Number(year)
      });
      setResult(response);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to calculate life path.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFE8C7] to-[#FFD8A8]">
      <Header showBack title="Life Path Calculator" />
      <main className="mx-auto flex max-w-6xl px-4 pb-16 pt-32 sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-xl rounded-3xl border border-[#FFD8A8] bg-white p-6 shadow-xl sm:p-8">
          <h1 className="text-2xl font-bold text-[#2C1810] sm:text-3xl">Numerology Life Path Number</h1>
          <p className="mt-2 text-sm text-[#4A3728]">
            Enter your date of birth to calculate your Life Path Number and meaning.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#2C1810]">Day</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={day}
                  onChange={(event) => setDay(event.target.value)}
                  className="w-full rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                  placeholder="DD"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#2C1810]">Month</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  className="w-full rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                  placeholder="MM"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#2C1810]">Year</label>
                <input
                  type="number"
                  min="1"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  className="w-full rounded-lg border border-[#FFD8A8] px-3 py-2 outline-none"
                  placeholder="YYYY"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#8B4513] py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Calculating..." : "Calculate Life Path"}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          {result && (
            <article className="mt-6 rounded-2xl border border-[#FFD8A8] bg-[#fff7eb] p-4">
              <p className="text-xs uppercase tracking-wide text-[#4A3728]">Life Path Number</p>
              <p className="mt-1 text-3xl font-bold text-[#8B4513]">{result.lifePathNumber}</p>
              <p className="mt-3 text-sm leading-6 text-[#4A3728]">{result.meaning}</p>
            </article>
          )}
        </section>
      </main>
      <Footer variant="simple" />
    </div>
  );
}
