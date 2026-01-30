"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/common/Header';

export default function RudrakshPage() {

  const [selectedMukhi, setSelectedMukhi] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cart, setCart] = useState(0);

  const products = [
    {
      id: 1,
      mukhi: '1',
      name: '1 Mukhi Rudraksha',
      price: 45,
      desc: 'Most powerful - Unity of consciousness',
      benefits: ['Divine manifestation', 'Supreme consciousness', 'Enlightenment'],
      rating: 5,
      image: '🔱'
    },
    {
      id: 2,
      mukhi: '2',
      name: '2 Mukhi Rudraksha',
      price: 18,
      desc: 'Ardhanari - Balance',
      benefits: ['Relationship harmony', 'Balance', 'Peace'],
      rating: 4.7,
      image: '💫'
    },
    {
      id: 3,
      mukhi: '3',
      name: '3 Mukhi Rudraksha',
      price: 20,
      desc: 'Agni Rudraksha - Fire energy',
      benefits: ['Confidence & courage', 'Vitality', 'Inner strength'],
      rating: 4.7,
      image: '🔥'
    },
    {
      id: 4,
      mukhi: '4',
      name: '4 Mukhi Rudraksha',
      price: 19,
      desc: 'Brahma Rudraksha - Knowledge',
      benefits: ['Creativity', 'Communication', 'Expression'],
      rating: 4.8,
      image: '🌊'
    },
    {
      id: 5,
      mukhi: '5',
      name: '5 Mukhi Rudraksha',
      price: 15,
      desc: 'Most common - Balance & peace',
      benefits: ['Health & vitality', 'Mental peace', 'Protection'],
      rating: 5,
      image: '🌳'
    },
    {
      id: 6,
      mukhi: '6',
      name: '6 Mukhi Rudraksha',
      price: 22,
      desc: 'Knowledge & learning',
      benefits: ['Intelligence & wisdom', 'Focus', 'Academic success'],
      rating: 4.8,
      image: '📚'
    },
    {
      id: 7,
      mukhi: '7',
      name: '7 Mukhi Rudraksha',
      price: 25,
      desc: 'Lakshmi Rudraksha - Prosperity',
      benefits: ['Wealth & prosperity', 'Success', 'Good fortune'],
      rating: 4.8,
      image: '💰'
    },
    {
      id: 8,
      mukhi: '8',
      name: '8 Mukhi Rudraksha',
      price: 28,
      desc: 'Shiva Rudraksha - Power',
      benefits: ['Courage & strength', 'Fearlessness', 'Power'],
      rating: 4.6,
      image: '⚡'
    },
    {
      id: 9,
      mukhi: '9',
      name: '9 Mukhi Rudraksha',
      price: 32,
      desc: 'Chandramukhi - Moon energy',
      benefits: ['Emotional balance', 'Intuition', 'Peace'],
      rating: 4.8,
      image: '💎'
    },
    {
      id: 10,
      mukhi: '11',
      name: '11 Mukhi Rudraksha',
      price: 35,
      desc: 'Highest spiritual path',
      benefits: ['Spiritual growth', 'Deep meditation', 'Divine grace'],
      rating: 4.9,
      image: '🏔️'
    },
    {
      id: 11,
      mukhi: '12',
      name: '12 Mukhi Rudraksha',
      price: 38,
      desc: 'Suryamukhi - Sun energy',
      benefits: ['Leadership & success', 'Authority', 'Confidence'],
      rating: 4.9,
      image: '☀️'
    },
    {
      id: 12,
      mukhi: '13',
      name: '13 Mukhi Rudraksha',
      price: 42,
      desc: 'Kamdev Rudraksha',
      benefits: ['Love & attraction', 'Relationships', 'Harmony'],
      rating: 4.9,
      image: '💝'
    }
  ];

  const filteredProducts = selectedMukhi === 'all' 
    ? products 
    : products.filter(p => p.mukhi === selectedMukhi);

  const mukhiOptions = [
    { value: 'all', label: 'All Rudraksha' },
    ...Array.from({ length: 13 }, (_, i) => i + 1).filter(num => num !== 10).map(num => ({ value: String(num), label: `${num} Mukhi` }))
  ];


  const addToCart = () => {
    setCart(cart + 1);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFF9F0 0%, #FFE8C7 100%)' }}>
        <Header />
      {/* Dropdown Section */}
      <section className="py-0 px-4 pt-32">
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-left">
                <div className="relative w-full max-w-xs z-[999]">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between p-4 rounded-2xl font-semibold transition-all hover:scale-105 text-base"
                style={{ backgroundColor: '#8B4513', color: '#FFFFFF' }}
              >
                <span>
                  {mukhiOptions.find(o => o.value === selectedMukhi)?.label ?? 'All Rudraksha'}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div 
                    className="absolute left-0 right-0 mt-2 w-64 rounded-2xl shadow-2xl z-[1000] max-h-96 overflow-y-auto"
                    style={{ backgroundColor: '#FFFFFF', border: '2px solid #8B4513' }}
                >
                  {mukhiOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelectedMukhi(option.value);
                        setDropdownOpen(false);
                      }}
                      className="w-full px-6 py-3 text-left border-b hover:bg-opacity-80 transition-all font-medium"
                      style={{ 
                        borderColor: '#FFE8C7',
                        backgroundColor: selectedMukhi === option.value ? '#FFE8C7' : 'transparent',
                        color: '#2C1810'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
        <section className="py-8 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:scale-105 cursor-pointer"
                style={{ backgroundColor: '#FFFFFF', border: '2px solid #FFD8A8' }}
                onClick={() => {
                  // You can add a modal or navigation here
                  console.log('Selected:', product.name);
                }}
              >
                {/* Product Image */}
                <div 
                  className="h-32 sm:h-40 flex items-center justify-center text-5xl sm:text-6xl transition-transform hover:scale-125"
                  style={{ backgroundColor: 'linear-gradient(135deg, #FFE8C7 0%, #FFD8A8 100%)' }}
                >
                  {product.image}
                </div>

                <div className="p-4 sm:p-6 text-center">
                  {/* Product Mukhi */}
                  <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#2C1810' }}>
                    {product.mukhi} Mukhi
                  </h3>
                  
                  {/* Price */}
                  <p className="text-lg sm:text-xl font-bold mt-2" style={{ color: '#8B4513' }}>
                    ${product.price}
                  </p>

                  {/* Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart();
                    }}
                    className="mt-4 w-full px-3 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-110 active:scale-95"
                    style={{ backgroundColor: '#FFD8A8', color: '#2C1810' }}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-2xl font-semibold" style={{ color: '#4A3728' }}>
                No products found
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#8B4513' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Why Choose Our Rudraksha?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-2xl font-bold mb-3">100% Authentic</h3>
              <p className="text-sm opacity-90">Genuine beads directly from trusted sources</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3">Certified Quality</h3>
              <p className="text-sm opacity-90">Every bead tested for authenticity</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-sm opacity-90">Secure packaging & worldwide shipping</p>
            </div>
            <div className="text-center text-white">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-2xl font-bold mb-3">Expert Support</h3>
              <p className="text-sm opacity-90">Dedicated guidance for your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: '#2C1810' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">Rudra Shaambhu</h3>
              <p className="text-base" style={{ color: '#FFD8A8' }}>
                Bringing authentic spiritual wisdom and sacred Rudraksha beads to seekers worldwide. Transform your meditation practice and spiritual journey with our premium collection.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Quick Links</h4>
              <div className="space-y-3">
                <Link href="/landing" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>Home</Link>
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>About Us</a>
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>How to Use</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Customer Care</h4>
              <div className="space-y-3">
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>Contact Us</a>
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>FAQ</a>
                <a href="#" className="block transition text-base hover:text-white" style={{ color: '#FFD8A8' }}>Shipping Info</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-opacity-30 pt-8 text-center" style={{ borderColor: '#FFD8A8' }}>
            <p style={{ color: '#FFD8A8' }}>&copy; 2026 Rudra Shaambhu. All rights reserved. | Spreading spiritual wisdom worldwide 🙏</p>
          </div>
        </div>
      </footer>
    </div>
  );
}