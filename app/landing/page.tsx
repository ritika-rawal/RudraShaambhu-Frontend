"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import Hero from '@/components/landing/Hero';
import Benefits from '@/components/landing/Benefits';
import About from '@/components/landing/About';
import Featured from '@/components/landing/Featured';
import CTA from '@/components/landing/CTA';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFE8C7 0%, #FFD8A8 100%)' }}>
      {/* Navigation */}
      <nav className="fixed w-full shadow-md z-50" style={{ backgroundColor: '#FFE8C7' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/Logo.png"
                  alt="Rudra Shambhu Logo"
                  width={90}
                  height={90}
                  className="object-contain"
                  priority
                />
              </div>
             
            </div>
            <div className="hidden md:flex gap-8 items-center">
              {['Home', 'Rudraksha', 'Benefits', 'About Us', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '')}`} 
                  className="text-base font-medium transition-all"
                  style={{ color: '#2C1810' }}
                >
                  {item}
                </a>
              ))}
            </div>
            <button 
              className="md:hidden"
              style={{ color: '#2C1810' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t" style={{ backgroundColor: '#FFE8C7', borderColor: '#FFD8A8' }}>
            <div className="px-6 py-4 space-y-3">
              {['Home', 'Benefits', 'About Us', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '')}`} 
                  className="block font-medium"
                  style={{ color: '#2C1810' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
      {/* Import all section components */}
      <Hero />
      <Benefits />
      <About />
      <Featured />
      <CTA />
      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: '#2C1810' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-white">Rudra Shaambhu</span>
              </div>
              <p className="text-lg" style={{ color: '#FFD8A8' }}>
                Authentic spiritual beads for meditation, healing, and inner peace.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
              <div className="space-y-2">
                <a href="#aboutus" className="block transition text-base" style={{ color: '#FFD8A8' }}>About Us</a>
                <a href="#benefits" className="block transition text-base" style={{ color: '#FFD8A8' }}>Benefits</a>
                <a href="#" className="block transition text-base" style={{ color: '#FFD8A8' }}>Store</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Connect</h4>
              <div className="space-y-2">
                <a href="#" className="block transition text-base" style={{ color: '#FFD8A8' }}>Contact</a>
                <a href="#" className="block transition text-base" style={{ color: '#FFD8A8' }}>FAQ</a>
                <a href="#" className="block transition text-base" style={{ color: '#FFD8A8' }}>Newsletter</a>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4 text-center" style={{ borderColor: '#4A3728' }}>
            <p style={{ color: '#FFD8A8' }}>&copy; 2026 Rudra Shaambhu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}