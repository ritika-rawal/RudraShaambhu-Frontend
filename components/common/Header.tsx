"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, ArrowLeft } from 'lucide-react';
import colors from '@/theme/colors';

type HeaderProps = {
  showBack?: boolean;
  title?: string;
};

export default function Header({ showBack = false, title = 'Rudra Shaambhu' }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full shadow-md z-50" style={{ backgroundColor: colors.primary }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {showBack ? (
            <Link href="/landing" className="flex items-center gap-2 hover:opacity-80 transition group">
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
          </div>
        </div>
      )}
    </nav>
  );
}
