"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ArrowLeft } from 'lucide-react';
import colors from '@/theme/colors';
import { SUPPORTED_CURRENCIES, useCurrency } from '@/components/common/CurrencyProvider';

type HeaderProps = {
  showBack?: boolean;
  title?: string;
  backHref?: string;
};

export default function Header({ showBack = false, title = 'Rudra Shaambhu', backHref = '/landing' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency } = useCurrency();

  return (
    <nav className="fixed w-full shadow-md z-50" style={{ backgroundColor: colors.primary }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {showBack ? (
            <Link href={backHref} className="flex items-center gap-2 hover:opacity-80 transition group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition" style={{ color: colors.text }} />
              <span className="text-xl font-bold hidden sm:inline" style={{ color: colors.text }}>{title}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/Logo.png"
                  alt="Rudra Shaambhu Logo"
                  width={90}
                  height={90}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}

          {!showBack && (
            <div className="hidden md:flex gap-8 items-center">
              {['Home', 'Rudraksha', 'Benefits', 'About Us', 'Contact'].map((item) => {
                if (item === 'Home') {
                  return (
                    <Link key={item} href="/landing#home" className="text-base font-medium transition-all" style={{ color: colors.text }}>
                      {item}
                    </Link>
                  );
                }

                if (item === 'Rudraksha') {
                  return (
                    <Link key={item} href="/rudraksha" className="text-base font-medium transition-all" style={{ color: colors.text }}>
                      {item}
                    </Link>
                  );
                }

                if (item === 'Benefits') {
                  return (
                    <Link key={item} href="/landing#benefits" className="text-base font-medium transition-all" style={{ color: colors.text }}>
                      {item}
                    </Link>
                  );
                }

                if (item === 'About Us') {
                  return (
                    <Link key={item} href="/landing#aboutus" className="text-base font-medium transition-all" style={{ color: colors.text }}>
                      {item}
                    </Link>
                  );
                }

                return (
                  <Link key={item} href="/landing#contact" className="text-base font-medium transition-all" style={{ color: colors.text }}>
                    {item}
                  </Link>
                );
              })}

              <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.text }}>
                Currency
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value as (typeof SUPPORTED_CURRENCIES)[number])}
                  className="rounded-md border px-2 py-1 text-sm"
                  style={{
                    backgroundColor: '#fff',
                    borderColor: colors.accent,
                    color: colors.text
                  }}
                >
                  {SUPPORTED_CURRENCIES.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {showBack && (
            <div className="flex items-center">
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as (typeof SUPPORTED_CURRENCIES)[number])}
                className="rounded-md border px-2 py-1 text-sm"
                style={{
                  backgroundColor: '#fff',
                  borderColor: colors.accent,
                  color: colors.text
                }}
                aria-label="Select currency"
              >
                {SUPPORTED_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!showBack && (
            <button 
              className="md:hidden"
              style={{ color: colors.text }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          )}
        </div>
      </div>

      {!showBack && mobileMenuOpen && (
        <div className="md:hidden border-t absolute left-0 w-full top-20" style={{ backgroundColor: colors.primary, borderColor: colors.accent }}>
          <div className="px-6 py-4 space-y-3 pt-2">
            {['Home', 'Rudraksha', 'Benefits', 'About Us', 'Contact'].map((item) => {
              if (item === 'Home') {
                return (
                  <Link key={item} href="/landing#home" className="block font-medium" style={{ color: colors.text }}>
                    {item}
                  </Link>
                );
              }

              if (item === 'Rudraksha') {
                return (
                  <Link key={item} href="/rudraksha" className="block font-medium" style={{ color: colors.text }}>
                    {item}
                  </Link>
                );
              }

              if (item === 'Benefits') {
                return (
                  <Link key={item} href="/landing#benefits" className="block font-medium" style={{ color: colors.text }}>
                    {item}
                  </Link>
                );
              }

              if (item === 'About Us') {
                return (
                  <Link key={item} href="/landing#aboutus" className="block font-medium" style={{ color: colors.text }}>
                    {item}
                  </Link>
                );
              }

              return (
                <Link key={item} href="/landing#contact" className="block font-medium" style={{ color: colors.text }}>
                  {item}
                </Link>
              );
            })}

            <div className="pt-2">
              <label className="block text-sm font-medium" style={{ color: colors.text }}>
                Currency
              </label>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as (typeof SUPPORTED_CURRENCIES)[number])}
                className="mt-2 w-full rounded-md border px-3 py-2 text-sm"
                style={{
                  backgroundColor: '#fff',
                  borderColor: colors.accent,
                  color: colors.text
                }}
              >
                {SUPPORTED_CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
